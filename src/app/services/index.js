import {defaultService, services} from './services'
import {ServiceFactory} from '@linhntaim/vue-services'

export const serviceFactory = new ServiceFactory(services, defaultService)