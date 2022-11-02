export const mapService = {
    initMap,
    addMarker,
    panTo,
    setCenterToUserLoc,
    closeSaveModal,
    getCurrMarker,
    setQUeryParams
}

let gCurrMarker 
var gMap
// Var that is used throughout this Module (not global)

function initMap(lat = 32.0749831, lng = 34.9120554) {
    // console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            // console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })

            google.maps.event.addListener(gMap, 'click', function (e) {
                addMarker(e.latLng)
            })
            // console.log('Map!', gMap)
        })
}

function addMarker(loc) {
    if (gCurrMarker) gCurrMarker.setMap(null)
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    marker.infoWindow = new google.maps.InfoWindow({
        position: loc,
        content: renderInfoModal(loc)
    })
    marker.infoWindow.open(gMap, marker)

    gCurrMarker = marker
    const { lat, lng } = loc
    if (typeof lat === 'function') panTo(loc.toJSON().lat, loc.toJSON().lng)
    else panTo(lat, lng)
    setQUeryParams()
    return marker
}

function renderInfoModal(loc) {
    const locObj = loc.toJSON()
    const { lat, lng } = locObj
    const strHtml = `
    <div class="modal-container">
        <input class="input-loc-name" type="text" placeholder="Name location...">
        <button type="button" onclick="onSaveLoc(${lat}, ${lng})">Save</button>
    </div>`
    return strHtml
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function setCenterToUserLoc({ coords }) {
    const { latitude: lat, longitude: lng } = coords
    gMap.setCenter({ lat, lng })
}

function closeSaveModal() {
    gCurrMarker.infoWindow.close();
}

function getCurrMarker() {
    return gCurrMarker
}

// ----- LOCAL_FUNCTIONS -----
function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyDnRn3KRkL2qHovAbZ-jQx7yM1NawhwKJw'
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function setQUeryParams() {
    let currMarker = mapService.getCurrMarker()
    if (currMarker) currMarker = currMarker.position.toJSON()
    else {
        currMarker = {
            lat: 32.0749831,
            lng: 34.9120554
        }
    }
    for (const key in currMarker) {
        currMarker[key] = currMarker[key].toFixed(2)
    }
    const queryStringParams = `?lat=${currMarker.lat}&lng=${currMarker.lng}`
    const newUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}
