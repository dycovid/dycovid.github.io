
function createMarker(latitude, longitude, map, myLocation) {
    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: map,
        icon: myLocation != undefined ? new google.maps.MarkerImage('./src/img/dot_selflocation.png') : null,
    });
    document.getElementById('marker-lat').innerHTML = latitude;
    document.getElementById('marker-long').innerHTML = longitude;
    return marker;
}

function getAddress(map, marker, event) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'location': marker.getPosition(),
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                if (event.placeId != undefined) {
                    getPlaceName(map, event.placeId);
                    setSearchBox(results[0].formatted_address);
                } else {
                    setSearchBox();
                    setSummaryAlert(results[0].formatted_address);
                }
            }
        }
    });
}

function getPlaceName(map, placeId) {
    let service = new google.maps.places.PlacesService(map);
    service.getDetails({ placeId: placeId, fields: ['name'] }, function (place, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            setSummaryAlert(place.name);
        }
    });
}

function getCurrentPosition(cposition, map) {
    createMarker(cposition.lat(), cposition.lng(), map, true);
}
