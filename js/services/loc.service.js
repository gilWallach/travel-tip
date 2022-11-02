export const locService = {
    getLocs,
    getUserCurrPos,
    saveLoc,
    deleteLoc
}
let gUserCurrPos

function getUserCurrPos(pos){
    gUserCurrPos = pos
    return gUserCurrPos
}

const locs = [
    { name: 'Greatplace', date: '', lat: 32.047104, lng: 34.832384 }, 
    { name: 'Neveragain',date: '', lat: 32.047201, lng: 34.832581 },
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs)
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
}

function deleteLoc(locName){
    const locIdx = locs.findIndex(loc => loc.name === locName)
    locs.splice(locIdx, 1)
    console.log(locs)
}