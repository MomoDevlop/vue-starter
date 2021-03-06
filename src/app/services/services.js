import {APP_DEFAULT_SERVICE} from '../config'
import {AxiosServiceInstance} from '@linhntaim/vue-services'

export const defaultService = 'axios'

export const services = {
    axios: new AxiosServiceInstance({
        baseURL: APP_DEFAULT_SERVICE.baseUrl,
        headers: (() => {
            const headers = {}
            if (APP_DEFAULT_SERVICE.hasBasicAuth) {
                headers['Authorization'] = 'Basic ' + btoa(APP_DEFAULT_SERVICE.basicAuth)
            }
            return headers
        })(),
    }),
}
