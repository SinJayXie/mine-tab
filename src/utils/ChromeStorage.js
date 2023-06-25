class ChromeStorage {
    constructor(name = "project") {
        this.storage = chrome.storage.local
        this.name = name
        this._init()
    }


    _init() {
        try {
            chrome.storage.onChanged.addListener(ChromeStorage.onchange)
        } catch(err) {
            console.error(err);
        }
    }

    set(data = {}) {
        const obj = {}
        for (const key in data) {
            obj[this.name + '_' + key] = data[key]
        }
        try {
            this.storage.set(obj || {})
        } catch(err) {
            console.error(err);
        }
    }


    get(keys = []) {
        return new Promise(resolve => {
            try {
                const queryKeys = keys.map(val => `${this.name}_${val}`)
                this.storage.get(queryKeys, (result) => {
                    
                    for (const key of queryKeys) {
                        if(!result.hasOwnProperty(key)) result[key] = undefined
                    }

                    const retObj = {}

                    for (const key in result) {
                        retObj[key.replace(this.name + "_", '')] = result[key]
                    }
                    resolve(retObj)
                })
            } catch(e) {

                const ret = {}
                for(const key in keys) {
                    ret[key] = undefined
                }
                resolve(ret)
            }
            
        })
    }


    getAll() {
        return new Promise(resolve => {
            this.storage.get().then(result => {
                const ret = {}
                for (const key in result) {
                    if(key.indexOf(this.name + '_') === 0) ret[key.replace(this.name + "_")] = result[key]
                }
                resolve(ret)
            }).catch(err => {
                resolve({ error: err.message })
            })
        })
        
    }

    clear() {

    }

    static onchange(changes, namespace) {
        try {
            for (var key in changes) {
                var storageChange = changes[key];
                console.log('Storage key "%s" in namespace "%s" changed. ' +
                            'Old value was "%s", new value is "%s".',
                            key,
                            namespace,
                            storageChange.oldValue,
                            storageChange.newValue);
            }
        } catch(err) {
            console.error(err.message);
        }
        
    }
}


export default ChromeStorage