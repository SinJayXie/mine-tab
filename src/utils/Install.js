import ChromeStorage from './ChromeStorage'
import defaultConfig from '../defaultConfig'
const storage = new ChromeStorage("mineTab")


const isInstall = async function () {
    const result = await storage.get(['install'])
    return !!result.install
}


const install = function() {
    storage.set(defaultConfig)
}



export {
    isInstall,
    install
}