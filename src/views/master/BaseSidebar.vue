<template lang="pug">
    ul#accordionSidebar.navbar-nav.bg-gradient-primary.sidebar.sidebar-dark.accordion
        router-link.sidebar-brand.d-flex.align-items-center.justify-content-center(@click.native="onRouterClicked()" :to="{name: rootName}")
            .sidebar-brand-icon.show-sm
                | {{ appName.charAt(0).toUpperCase() }}
            .sidebar-brand-text.mx-2
                | &nbsp;{{ appName }}
        li.nav-item(v-if="filteredMenuItems.length && !filteredMenuItems[0].heading")
            .item-heading
                hr.sidebar-divider(style="margin-bottom: 0")
        li.nav-item(v-for="(item, itemIndex) in filteredMenuItems" :class="{active: item.active}")
            .item-heading(v-if="item.heading")
                hr.sidebar-divider
                .sidebar-heading {{ $t('master.base_sidebar.' + item.title) }}
            template(v-else)
                template(v-if="item.children")
                    a.nav-link(:class="{collapsed: !item.active}" href="#", data-toggle="collapse", :data-target="'#collapse' + itemIndex")
                        i(v-if="item.iconClass" :class="item.iconClass")
                        span &nbsp;{{ $t('master.base_sidebar.' + item.title) }}
                    .collapse(:id="'collapse' + itemIndex" :class="{show: item.active}" data-parent="#accordionSidebar")
                        .bg-white.py-2.collapse-inner.rounded
                            template(v-for="childItem in item.children")
                                h6.collapse-header(v-if="childItem.heading") {{ $t('master.base_sidebar.' + childItem.title) }}
                                router-link.collapse-item(v-else @click.native="onRouterClicked()" :to="childItem.to" :class="{active: childItem.active}") {{ $t('master.base_sidebar.' + childItem.title) }}
                router-link.nav-link(v-else @click.native="onRouterClicked()" :to="item.to")
                    i(v-if="item.iconClass" :class="item.iconClass")
                    span &nbsp;{{ $t('master.base_sidebar.' + item.title) }}
        hr.sidebar-divider.d-none.d-md-block
        .text-center.d-none.d-md-inline
            button#sidebarToggle.rounded-circle.border-0
</template>

<script>
    import {mapGetters} from '@linhntaim/vue-uses'
    import {permissionChecker, timeoutCaller, ui} from '../../app/utils'
    import {APP_NAME, APP_ROUTE} from '../../app/config'
    import {routePermissions} from '../../app/router'

    const defaultMenuItems = () => [
        {
            title: 'dashboard',
            iconClass: 'fas fa-fw fa-tachometer-alt',
            to: {
                name: 'dashboard',
            },
        },
        {
            title: 'role_management',
            iconClass: 'fas fa-fw fa-users',
            matches: [/^\/role/],
            active: false,
            children: [
                {
                    title: 'create_a_role',
                    to: {
                        name: 'role_create',
                    },
                },
                {
                    title: 'list_of_roles',
                    to: {
                        name: 'role_index',
                    },
                },
            ],
        },
    ]

    export default {
        name: 'BaseSidebar',
        data() {
            return {
                uis: {},

                appName: APP_NAME,
                rootName: APP_ROUTE.home,
                filteredMenuItems: [],
            }
        },
        computed: {
            ...mapGetters({
                accountPermissions: 'account/permissions',
            }),
        },
        watch: {
            '$route'() {
                this.initMenuItems()
            },
        },
        beforeDestroy() {
            this.destroyUi()
        },
        mounted() {
            this.initRootPath()
            this.initMenuItems()
        },
        methods: {
            initUi() {
                this.uis = {
                    $window: ui.query(window).get(),
                    $body: ui.query('body').get(),
                    $sidebar: ui.query('.sidebar').get(),
                }
                if (this.uis.$window.width() < 768) {
                    ui.query('.sidebar .collapse').get().collapse('hide')
                }
                if (this.uis.$window.width() < 576) {
                    if (!this.uis.$sidebar.hasClass('toggled')) {
                        this.uis.$body.toggleClass('sidebar-toggled')
                        this.uis.$sidebar.toggleClass('toggled')
                    }
                }
            },

            destroyUi() {
                this.uis.$body.removeClass('sidebar-toggled')
            },

            initRootPath() {
                // TODO: if need to change root path
                this.rootName = APP_ROUTE.home
            },

            initMenuItems() {
                this.filteredMenuItems = defaultMenuItems()
                this.filterMenuItems(this.filteredMenuItems)

                timeoutCaller.register(() => {
                    this.initUi()
                })
            },

            filterMenuItems(menuItems, level = 0) {
                let removingItemIndices = []

                let itemIndex = 0
                menuItems.forEach((menuItem) => {
                    let permitted = true

                    const hasToName = 'to' in menuItem && 'name' in menuItem.to
                    if (hasToName && menuItem.to.name in routePermissions) {
                        permitted = permissionChecker.checkAtLeast(routePermissions[menuItem.to.name], this.accountPermissions)
                    }

                    if (permitted) {
                        menuItem.active = false
                        if ('matches' in menuItem) {
                            for (let i in menuItem.matches) {
                                if (menuItem.matches[i].test(this.$route.path)) {
                                    menuItem.active = true
                                    break
                                }
                            }
                        } else if (hasToName && menuItem.to.name === this.$route.name) {
                            menuItem.active = true
                        }

                        if ('children' in menuItem) {
                            this.filterMenuItems(menuItem.children, level + 1)
                        }
                    } else {
                        removingItemIndices.push(itemIndex)
                    }

                    ++itemIndex
                })

                while (removingItemIndices.length) {
                    menuItems.splice(removingItemIndices.pop(), 1)
                }

                if (level === 0) {
                    this.pruneMenuItems(menuItems)
                }
            },

            pruneMenuItems(menuItems) {
                for (let i = menuItems.length - 1; i >= 0; --i) {
                    if ('children' in menuItems[i]) {
                        this.pruneMenuItems(menuItems[i].children)

                        if (menuItems[i].children.length === 0) {
                            menuItems.splice(i, 1)
                        }
                    } else if ('heading' in menuItems[i] && menuItems[i].heading) {
                        if (i + 1 === menuItems.length
                            || ('heading' in menuItems[i + 1] && menuItems[i + 1].heading)) {
                            menuItems.splice(i, 1)
                        }
                    }
                }
            },

            onRouterClicked() {
                // TODO: if need to add extra handle on menu navigation
            },
        },
    }
</script>
