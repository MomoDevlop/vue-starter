import {dateTimer, settingsCookieStore} from '../../../utils'
import {Middleware} from '@linhntaim/vue-uses'
import {DEFAULT_SETTINGS} from '../../../config'

export default class SettingsMiddleware extends Middleware {
    handle() {
        this.log('settings', 'middleware')

        this.wait()
    }

    wait(called = 1) {
        if (called > 5) {
            this.next()
            return
        }

        setTimeout(() => {
            if (this.hasI18NInstalled()) {
                dateTimer.withCompiler((format, bags) => {
                    return this.app().$t(format, bags)
                })
                const storedSettings = settingsCookieStore.retrieve()
                this.store().commit('account/setSettingsFromCookie', {
                    settings: storedSettings ? storedSettings : DEFAULT_SETTINGS,
                    localeCallback: () => this.next(),
                })
            } else {
                this.wait(++called)
            }
        }, 200)
    }

    hasI18NInstalled() {
        return !!this.app().$i18n
    }
}
