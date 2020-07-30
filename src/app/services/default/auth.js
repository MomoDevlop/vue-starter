import {crypto, serverClock} from '../../utils'
import {APP_DEFAULT_SERVICE} from '../../config'
import DefaultService from '../default-service'

export class AuthService extends DefaultService {
    login(email, password, doneCallback = null, errorCallback = null, alwaysCallback = null) {
        return this.post(
            'auth/login',
            {
                grant_type: 'password',
                client_id: APP_DEFAULT_SERVICE.clientId,
                client_secret: APP_DEFAULT_SERVICE.clientSecret,
                username: email,
                password: password,
                scope: '*',
            },
            doneCallback,
            errorCallback,
            alwaysCallback,
        )
    }

    loginWithToken(email, doneCallback = null, errorCallback = null, alwaysCallback = null) {
        this.e()
        return this.login(
            crypto.encrypt(email, serverClock.blockKey()),
            crypto.encryptJson({source: 'token'}, serverClock.blockKey()),
            doneCallback,
            errorCallback,
            alwaysCallback,
        )
    }

    logout(doneCallback = null, errorCallback = null, alwaysCallback = null) {
        return this.post(
            'auth/logout',
            {},
            doneCallback,
            errorCallback,
            alwaysCallback,
        )
    }

    refreshToken(refreshToken, doneCallback = null, errorCallback = null, alwaysCallback = null) {
        return this.post(
            'oauth/token',
            {
                'grant_type': 'refresh_token',
                'client_id': APP_DEFAULT_SERVICE.clientId,
                'client_secret': APP_DEFAULT_SERVICE.clientSecret,
                'refresh_token': refreshToken,
                'scope': '*',
            },
            doneCallback,
            errorCallback,
            alwaysCallback,
        )
    }

    forgotPassword(email, appResetPasswordPath, doneCallback = null, errorCallback = null, alwaysCallback = null) {
        return this.post(
            'auth/password',
            {
                _forgot: 1,
                email: email,
                app_reset_password_path: appResetPasswordPath,
            },
            doneCallback,
            errorCallback,
            alwaysCallback,
        )
    }

    getResetPassword(params, doneCallback = null, errorCallback = null, alwaysCallback = null) {
        return this.get(
            'auth/password',
            this.appendParams(params, {
                _reset: 1,
            }),
            doneCallback,
            errorCallback,
            alwaysCallback,
        )
    }

    resetPassword(params, doneCallback = null, errorCallback = null, alwaysCallback = null) {
        return this.post(
            'auth/password',
            this.appendParams(params, {
                _reset: 1,
            }),
            doneCallback,
            errorCallback,
            alwaysCallback,
        )
    }
}

export const authService = () => new AuthService()
