<template lang="pug">
    .input-group(:id="id")
        input.form-control.datetimepicker-input(
            :value="content"
            :placeholder="placeholder"
            :required="required"
            :data-target="htmlId"
            data-toggle="datetimepicker"
            type="text"
            @change = "changeDateTime"
            autocomplete="off")
        .input-group-append(:data-target="htmlId" data-toggle="datetimepicker")
            .input-group-text
                i.fa.fa-calendar
</template>

<script>
    import {mapGetters} from '@linhntaim/vue-uses'
    import {ui} from '../../app/utils'
    import moment from 'moment'

    const $uis = {}

    export default {
        name: 'CalendarInput',
        props: {
            id: String,
            placeholder: String,
            value: String,
            required: Boolean,
            options: Object,
        },
        data() {
            return {
                content: this.value,
            }
        },
        computed: {
            ...mapGetters({
                currentAdmin: 'account/admin',
                currentSettings: 'account/settings',
            }),
            htmlId() {
                return '#' + this.id
            },
        },
        mounted() {
            $uis._ = ui.query(this.htmlId).get()
            this.options.locale = this.currentSettings.locale
            if (this.content) {
                this.options.userCurrent = false
                if (this.options.timeOnly) {
                    this.options.date = moment().format('YYYY-MM-DD') + ' ' + this.content
                } else {
                    this.options.date = this.content
                }
            }
            this.options.icons = {
                time: 'fa fa-clock',
            }
            $uis._.on('change.datetimepicker', e => {
                if (e.date) {
                    this.update(e.date.format(this.options.format))
                }
            }).datetimepicker(this.options)
        },
        methods: {
            changeDateTime($event) {
                let date = $event.target.value
                if (date) {
                    date = this.options.timeOnly ?
                        moment(moment().format('YYYY-MM-DD') + ' ' + date)
                        : moment($event.target.value)
                    this.options.date = date.isValid() ? date.format(this.options.format) : moment().format(this.options.format)
                } else {
                    this.options.date = ''
                }
                this.update(this.options.date)
            },
            update(content) {
                this.content = content
                this.$emit('input', this.content)
                this.$forceUpdate()
            },
            clear() {
                $uis._.datetimepicker('clear')
                this.update('')
            },
        },
    }
</script>
