import DefaultService from '../default-service'

export default class BaseService extends DefaultService {
    index(params = {}, doneCallback = null, errorCallback = null, alwaysCallback = null) {
        return this.get(
            '',
            params,
            doneCallback,
            errorCallback,
            alwaysCallback,
        )
    }

    store(params = {}, doneCallback = null, errorCallback = null, alwaysCallback = null) {
        return this.post(
            '',
            params,
            doneCallback,
            errorCallback,
            alwaysCallback,
        )
    }

    show(id, doneCallback = null, errorCallback = null, alwaysCallback = null) {
        return this.get(
            id,
            {},
            doneCallback,
            errorCallback,
            alwaysCallback,
        )
    }

    update(id, params = {}, doneCallback = null, errorCallback = null, alwaysCallback = null) {
        return this.post(
            id,
            params,
            doneCallback,
            errorCallback,
            alwaysCallback,
        )
    }

    bulkDestroy(ids, params = {}, doneCallback = null, errorCallback = null, alwaysCallback = null) {
        return this.post(
            '',
            this.appendParams(params, {
                _delete: 1,
                ids: ids,
            }),
            doneCallback,
            errorCallback,
            alwaysCallback,
        )
    }

    destroy(id, params = {}, doneCallback = null, errorCallback = null, alwaysCallback = null) {
        return this.post(
            id,
            this.appendParams(params, {
                _delete: 1,
            }),
            doneCallback,
            errorCallback,
            alwaysCallback,
        )
    }
}
