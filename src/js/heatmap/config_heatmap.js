function initMapConfig() {
    if (navigator.geolocation != null) {
        navigator.geolocation.getCurrentPosition(initMap, error);
    }
}

function initMap(position) {
    google.maps.InfoWindow.prototype.set = () => {};

    let cposition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    let mapOptions = {
        center: cposition,
        zoom: 19,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false,
    };

    let map = new google.maps.Map(document.getElementById("heatmap"), mapOptions);

    configSearchBox(map);
    addYourLocationButton(map);
    initAlert(map);
    drawHeatMap(cposition, map);
}

function configSearchBox(map) {
    let divSearchInput = document.getElementById('pac-input');
    let searchInput = document.getElementById('search-input');
    let clearIcon = document.getElementById('ic-clear');

    let searchBox = new google.maps.places.SearchBox(searchInput);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(divSearchInput);

    bindEvents(map, searchInput, clearIcon, searchBox);
}

function bindEvents(map, searchInput, clearIcon, searchBox) {
    clearIcon.addEventListener('click', function () {
        searchInput.value = '';
        clearSummary();
        hideSearchIcons('none', 'block');
        deleteMarkers();
    });

    searchInput.addEventListener('input', function () {
        if (this.value != '') {
            hideSearchIcons('block', 'none');
        } else {
            hideSearchIcons('none', 'block');
        }
    });

    searchBox.addListener('places_changed', function () {
        let places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        deleteMarkers();

        let bounds = new google.maps.LatLngBounds();
        places.forEach(element => {
            if (!element.geometry) {
                return;
            }
            let marker = createMarker(element.geometry.location.lat(), element.geometry.location.lng(), map);

            setSummaryAlert(document.getElementById('search-input').value);

            setRadius(map, marker);

            markers.push(marker);

            if (element.geometry.viewport) {
                bounds.union(element.geometry.viewport);
            } else {
                bounds.extend(element.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

    document.getElementById('btn_create_alert').addEventListener('click', function () {
        if (circles.length != 0) {
            let lat = parseFloat(document.getElementById('marker-lat').innerHTML).toFixed(6);
            let long = parseFloat(document.getElementById('marker-long').innerHTML).toFixed(6);
            let placeName = document.getElementById('card-title').innerHTML;

            createAlert(lat, long, placeName, circles[0].getRadius() / 1000);
        }
    });
}

function error(position) {
    alert('Permita que o aplicativo acesse sua localização!');
}