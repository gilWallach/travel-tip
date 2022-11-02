import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storageService } from './services/storage.service.js'

window.onload = onInit
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onSaveLoc = onSaveLoc
window.onDeleteLoc = onDeleteLoc
window.onCopyUrl = onCopyUrl

const LOCS_STORAGE_KEY = 'locs'
window.onSearchInput = onSearchInput

function onInit() {
    const currLoc = renderLocByQueryStringParams()
    mapService.initMap(currLoc.lat, currLoc.lng)
        .then(() => {
            onGetLocs()
            // console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    // console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onGetLocs() {
    if (storageService.load(LOCS_STORAGE_KEY)) {
        console.log('from storage')
        const locs = storageService.load(LOCS_STORAGE_KEY)
        renderLocsList(locs)
    }
    else {
        locService.getLocs()
            .then(locs => {
                storageService.save(LOCS_STORAGE_KEY, locs)
                renderLocsList(locs)
                // document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2) 
            })
    }
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            // console.log('User position is:', pos.coords)
            onPanTo(pos.coords.latitude, pos.coords.latitude)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.latitude}`

        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onPanTo(lat, lng) {
    // console.log('Panning the Map')
    mapService.panTo(lat, lng)
}

function onSaveLoc(lat, lng) {
    const locName = document.querySelector('.input-loc-name').value
    let date = Date().slice(0, 15)
    locService.saveLoc(lat, lng, locName, date)
    mapService.closeSaveModal()
    onGetLocs()
}

function renderLocsList(locs) {
    console.log(locs)
    const strHtml = locs.map((loc) => {
        return `
            <li class="loc-item flex space-between">
            <div class="list-head flex">
                <h3>${loc.name}</h3>
                <p>${loc.date}</p>
                </div>
                <button onclick="onPanTo(${loc.lat}, ${loc.lng})" class="go-to-btn">&#x261B;</button>
                <button onclick="onDeleteLoc('${loc.name}')" class="delete-loc-btn">&#128465;</button>
            </li>
        `
    })
    document.querySelector('.locs-ul').innerHTML = strHtml.join('')
}

function onDeleteLoc(locName) {
    locService.deleteLoc(locName)
    onGetLocs()
}

// ----- query params -----
function renderLocByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const currLoc = {
        lat: queryStringParams.get('lat'),
        lng: queryStringParams.get('lng')
    }

    if (currLoc.lat === null || currLoc.lng === null) {
        currLoc.lat = 32.0749831
        currLoc.lng = 34.9120554
        mapService.setQUeryParams()
    }
    currLoc.lat = parseFloat(currLoc.lat)
    currLoc.lng = parseFloat(currLoc.lng)
    return currLoc
}

function onCopyUrl() {
    const url = document.URL
    navigator.clipboard.writeText(url)
    flashMsg()
}

function flashMsg() {
    const el = document.querySelector('.user-msg')
    el.innerText = 'Url copied to clipboard'
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}

function onSearchInput() {
    const searchValue = document.querySelector('.search-bar').value
    mapService.searchInput(searchValue)
}