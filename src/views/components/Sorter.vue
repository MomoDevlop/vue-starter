<template lang="pug">
    span(@click="onClicked()" role="button")
        | {{ title }}&nbsp;
        i.fas(:class="{'fa-sort-up': sorterBy !== sortBy || sorterOrder === 'asc', 'fa-sort-down': sorterBy === sortBy && sorterOrder === 'desc', 'sort-disabled': sorterBy !== sortBy}")
</template>

<script>
    import {Sorter} from '@linhntaim/vue-utils'

    export default {
        name: 'Sorter',
        props: {
            title: String,
            sorter: Sorter,
            sortBy: String,
        },
        computed: {
            sorterBy() {
                return this.sorter.by
            },
            sorterOrder() {
                return this.sorter.order
            },
        },
        methods: {
            onClicked() {
                this.sorter.setBy(this.sortBy)

                this.$emit('sorted')
            },
        },
    }
</script>

<style scoped>
    .sort-disabled {
        opacity: 0.25;
    }
</style>
