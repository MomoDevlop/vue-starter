<template lang="pug">
    .card.shadow.mb-4
        .card-body.has-control
            form.row.search-form(@submit.prevent="onSubmitted()")
                .form-group.col-md-4.col-lg-3
                    label(for="searchName") {{ $t('pages.name') }}
                    input#searchName.form-control(v-model="searcher.params.name" :placeholder="$t('pages.name')" type="text")
                .form-group.col-md-4.col-lg-3
                    label(for="searchDisplayName") {{ $t('pages.display_name') }}
                    input#searchDisplayName.form-control(v-model="searcher.params.display_name" :placeholder="$t('pages.display_name')" type="text")
                .form-group.col-md-4.col-lg-3
                    label(for="searchPermissions") {{ $tc('pages.permission', 2) }}
                    multiple-select2-input(
                        v-if="!localeChange.changed && select2Ready"
                        :id="'searchPermissions'"
                        v-model="searcher.params.permissions"
                        :items="metadata.permissions"
                        :itemValue="'id'"
                        :itemText="'display_name'"
                        :required="true"
                        :options="permissionOptions")
                .col.nowrap
                    button.btn.btn-primary.btn-item.btn-item-left(:disabled="disabled || loading" type="submit")
                        i.fas.fa-search
                        | &nbsp;&nbsp;{{ $t('actions.search') }}
                    button.btn.btn-warning.btn-item.btn-item-left(v-if="searching" :disabled="disabled || loading" @click="onClearSearchClicked()" type="button" data-dismiss="modal") {{ $t('actions.clear_search') }}
</template>

<script>
    import {mapActions, mapGetters} from '@linhntaim/vue-uses'
    import {ui, localeChange} from '../../../app/utils'
    import {Searcher} from '@linhntaim/vue-utils'
    import MultipleSelect2Input from '../../components/MultipleSelect2Input'

    export default {
        name: 'Search',
        components: {MultipleSelect2Input},
        props: {
            disabled: Boolean,
            searcher: Searcher,
        },
        data() {
            return {
                uis: {},

                loading: false,

                permissionOptions: {
                    placeholder: this.$tc('actions.select_what', {what: this.$tc('pages.permission', 2)}),
                },

                select2Ready: false,
                localeChange: localeChange.reset(),
            }
        },
        computed: {
            ...mapGetters({
                metadata: 'prerequisite/metadata',
            }),
            searching() {
                return this.searcher.searching
            },
        },
        created() {
            this.searcher.setParams({
                name: '',
                display_name: '',
                permissions: [],
            })
        },
        destroyed() {
            this.localeChange.off()
        },
        mounted() {
            this.localeChange.on()
            this.uis.$ = ui.query('#searchModal').get()
            this.uis.$searchPermissions = ui.query('#searchPermissions').get()
        },
        methods: {
            ...mapActions({
                require: 'prerequisite/require',
            }),
            init() {
                this.loading = true
                this.require({
                    names: ['permissions'],
                    doneCallback: () => {
                        this.initSearcher()

                        this.select2Ready = true
                        this.loading = false
                    },
                    errorCallback: err => {
                        this.loading = false
                        this.$bus.emit('error', {messages: err.getMessages(), extra: err.getExtra()})
                    },
                })
            },
            initSearcher() {
                this.searcher.parseQuery(this.$route.query)

                this.$emit('searcherInitialized')
            },
            onClearSearchClicked() {
                this.searcher.clear()

                this.uis.$searchPermissions.val([]).trigger('change')

                this.onSubmitted()
            },
            onSubmitted() {
                this.uis.$.modal('hide')

                this.$emit('searched')
            },
        },
    }
</script>
