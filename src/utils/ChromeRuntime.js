const getChrome = function () {
    return chrome || {}
}
import _ from 'lodash'

class ChromeRuntime {
    constructor() {
        this.chrome = getChrome()
        this.bookmarks = { children: [] }
        this.getBookmarks()
        this.cb = () => {}
    }

    async init(cb) {
        this.bookmarks = await this.getBookmarks()
        this.cb = cb
        if(typeof cb === 'function') cb()
    }


    getBookmarks() {
        return new Promise(resolve => {
            try {
                this.chrome.bookmarks.getTree().then(res => {
                    const bookmark = _.get(res, '[0]', { children: [] })
                    const obj = { children: [] }
                    bookmark.children.forEach(item => {
                        obj.children.push(...item.children)
                    });
                    resolve(obj)
                }).catch(() => {
                    resolve({})
                })
            } catch (e) {
                resolve({})
            }
            
        })
    }

    updateBookmark(bookmarkId, changes = {}) {
        this.chrome.bookmarks.update(bookmarkId, changes, async() => {
            this.bookmarks = await this.getBookmarks()
            if(typeof this.cb === 'function') this.cb()
        })
    }

    deleteBookmark(bookmarkId) {
        return new Promise((resolve, reject) => {
            this.chrome.bookmarks.remove(bookmarkId).then(async (result) => {
                resolve(result)
                this.bookmarks = await this.getBookmarks()
                if(typeof this.cb === 'function') this.cb()
            }).catch(err => {
                reject(err)
            })
        })
    }

    getFaviconUrl(url) {
        return `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${encodeURIComponent(url)}&size=128`;
        // return file;
    }
}


export default new ChromeRuntime()