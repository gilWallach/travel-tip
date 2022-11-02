import { storageService } from './storage.service.js'

export const locService = {
    getLocs,
    getUserCurrPos,
    saveLoc,
    deleteLoc
}

const LOCS_STORAGE_KEY = 'locs'

let gUserCurrPos
function getUserCurrPos(pos){
    gUserCurrPos = pos
    return gUserCurrPos
}
const locs = [
    { name: 'Greatplace', date: 'Wed Nov 12 2022', lat: 32.047104, lng: 34.832384 }, 
    { name: 'Neveragain',date: 'Wed Nov 22 2022', lat: 32.047201, lng: 34.832581 },
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
            // saveToStorage(LOCS_STORAGE_KEY, locs)
        }, 500)
    })
}

function saveLoc(lat, lng, locName, date){
    
    const newLoc = {
        name: locName,
        date,
        lat,
        lng
    }
    locs.unshift(newLoc)
    storageService.save(LOCS_STORAGE_KEY, locs)
}

function deleteLoc(locName){
    const locIdx = locs.findIndex(loc => loc.name === locName)
    locs.splice(locIdx, 1)
    storageService.save(LOCS_STORAGE_KEY, locs)
}