import cpx from 'cpx'
import fs from 'fs-extra'

export default class AssetCopier {
    constructor(extensions = ['js', 'css', 'map', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'eot', 'ttf', 'woff', 'woff2']) {
        this.assets = []
        this.extensions = extensions
    }

    addExtensions(...extensions) {
        this.extensions.push(...extensions)
        return this
    }

    getMatchedExtensions() {
        return '/*.{' + this.extensions.join(',') + '}'
    }

    getMatchedExtensionsHierarchically() {
        return '/**' + this.getMatchedExtensions()
    }

    add(...assets) {
        this.assets.push(...assets)
        return this
    }

    copy(removeBefore = true) {
        const matchedExtensions = this.getMatchedExtensions()
        const matchedExtensionsHierarchically = this.getMatchedExtensionsHierarchically()
        this.assets.forEach(({src, dst}) => {
            removeBefore && fs.removeSync(dst)
            cpx.copy(src + matchedExtensions, dst)
            cpx.copy(src + matchedExtensionsHierarchically, dst)
        })
    }
}
