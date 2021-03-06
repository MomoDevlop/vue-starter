import {intervalCaller, timeoutCaller, ui} from '../../utils'
import {CommonMiddleware} from '@linhntaim/vue-uses'
import AuthMiddleware from './modules/auth-middleware'
import LocaleMiddleware from './modules/locale-middleware'
import PermissionMiddleware from './modules/permission-middleware'
import ServerMiddleware from './modules/server-middleware'
import SettingsMiddleware from './modules/settings-middleware'

const settingsMiddleware = new SettingsMiddleware()
const authMiddleware = new AuthMiddleware()
const commonMiddleware = new CommonMiddleware(
    () => {
        timeoutCaller.clear()
        intervalCaller.clear()
    },
    () => {
        ui.scrollToTop()
    },
)
const localeMiddleware = new LocaleMiddleware()
const serverMiddleware = new ServerMiddleware()
const permissionMiddleware = new PermissionMiddleware()

export const all = {
    before: [
        settingsMiddleware,
        serverMiddleware,
        commonMiddleware,
        authMiddleware,
        localeMiddleware,
        permissionMiddleware,
    ],
    after: [
        commonMiddleware,
    ],
}

export const error = {
    before: [
        settingsMiddleware,
        serverMiddleware,
        commonMiddleware,
        authMiddleware,
        localeMiddleware,
    ],
    after: [
        commonMiddleware,
    ],
}
