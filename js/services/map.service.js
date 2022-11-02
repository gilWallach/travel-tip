export const mapService = {
    initMap,
    addMarker,
    panTo,
    closeSaveModal,
    getCurrMarker,
    setQUeryParams,
    searchInput
}

let gCurrMarker


// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })

            google.maps.event.addListener(gMap,'click',function(e){
                console.log(e.latLng.toJSON());
                addMarker(e.latLng)
            })
            console.log('Map!', gMap)
        })
}

function getCurrMarker(){
  return gCurrMarker
}

function addMarker(loc) {
    if(gCurrMarker)gCurrMarker.setMap(null)
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
    console.log(typeof loc.lat);
    const {lat, lng} = loc
    if(typeof lat === 'function')panTo(loc.toJSON().lat,loc.toJSON().lng)
    else panTo(lat,lng)
    return marker
}

function closeSaveModal(){
  gCurrMarker.infoWindow.close()
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

function searchInput(value,onSuccess = initMap){
  const prm1 = fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=AIzaSyDnRn3KRkL2qHovAbZ-jQx7yM1NawhwKJw`)
  prm1.then(res => {
      console.log('res', res)
      const prm2 = res.json()
      prm2.then(ans => {
          console.log('ans', ans.results[0].geometry.location)
          const location = ans.results[0].geometry.location
          onSuccess(location.lat,location.lng)
          gCurrMarker = location
          setQUeryParams()
        gCurrMarker = false
      })
  })
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
    if (currMarker) {
      if(typeof currMarker === 'function')currMarker = currMarker.position.toJSON()
    }
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
