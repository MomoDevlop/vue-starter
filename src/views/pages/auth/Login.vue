<template lang="pug">
    .row.justify-content-center
        .col-lg-6.col-md-8.col-sm-10
            .card.o-hidden.border-0.shadow-lg.my-5
                .card-body.p-5
                    .text-center
                        h1.h4.text-gray-900.mb-4(v-html="$t('pages._auth._login.welcome_back')")
                    form.user(@submit.prevent="onLoginSubmitted()")
                        .form-group
                            input#inputEmail.form-control.form-control-user(v-model="email" type="text" aria-describedby="emailHelp" :placeholder="$t('pages.email_address')" :disabled="token" required)
                        .form-group
                            input#inputPassword.form-control.form-control-user(v-model="password" type="password" :placeholder="$t('pages.password')" :required="!token" :disabled="token")
                        button.btn.btn-primary.btn-user.btn-block(:disabled="loading || disabled" type="submit")
                            i.fas.fa-circle-notch.fa-spin(v-if="loading")
                            span(v-else) {{ $t('actions.login') }}
                    template(v-if="extraShown")
                        hr
                        .text-center
                            router-link.small(v-if="forgotPasswordEnabled" :to="{name: 'forgot_password'}")
                                | {{ $t('pages._auth._login.forgot_password') }}
</template>

<script>
    import {mapActions} from '@linhntaim/vue-uses'
    import {session} from '@linhntaim/vue-router'
    import {APP_ROUTE} from '../../../app/config'

    export default {
        name: 'Login',
        data() {
            return {
                loading: false,

                token: false,

                email: '',
                password: '',

            }
        },
        computed: {
            disabled() {
                return !this.token && (!this.email || !this.password)
            },
            extraShown() {
                return this.forgotPasswordEnabled
            },
            forgotPasswordEnabled() {
                return this.$server.forgot_password_enabled.admin
            },
        },
        created() {
            if (this.$route.query.token) {
                this.email = this.$route.query.token
                this.token = true
            }
        },
        methods: {
            ...mapActions({
                accountLogin: 'account/login',
            }),
            onLoginSubmitted() {
                this.loading = true
                this.accountLogin({
                    email: this.email,
                    password: this.password,
                    token: this.token,
                    doneCallback: () => {
                        this.loading = false

                        this.afterLogin()
                    },
                    errorCallback: err => {
                        this.loading = false
                        this.$bus.emit('error', {messages: err.getMessages(), extra: err.getExtra()})
                    },
                })
            },
            afterLogin() {
                session.restart()

                this.$router.push({name: APP_ROUTE.home})
            },
        },
    }
</script>

<style lang="sass">
    form.user .form-control-user
        height: 50px
        padding: 1rem 1rem
</style>