function setSearchBox(value) {
    if (value != undefined) {
        document.getElementById('search-input').value = value;
    } else {
        document.getElementById('search-input').value =
            parseFloat(document.getElementById('marker-lat').innerHTML).toFixed(6) + ', ' + parseFloat(document.getElementById('marker-long').innerHTML).toFixed(6);
    }
    hideSearchIcons('block', 'none');
}

function hideSearchIcons(icClearDisplay, icSearchDisplay) {
    if (icSearchDisplay != undefined) {
        document.getElementById('ic-clear').style.display = icClearDisplay;
    } if (icSearchDisplay != undefined) {
        if (icSearchDisplay == 'block') {
            document.getElementById('search-input').value = '';
        }
        document.getElementById('ic-search').style.display = icSearchDisplay;
    }
}

function getFormattedDate(date) {
    return date.getUTCDate() + "/" + (date.getUTCMonth() + 1) + "/" + date.getUTCFullYear()
        + " " + date.getUTCHours() + ":" + date.getUTCMinutes();
}

function createCircleAndMarker(map, marker, lat, long) {
    let circle = getCircle(map, lat, long);

    marker.setDraggable(true);
    circle.bindTo('center', marker, 'position');

    circles.push(circle);

    configCircle(circle);

    return circle;
}

function getCircle(map, lat, long) {
    return new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: { lat: lat, lng: long },
        radius: 20,
    });
}

function clearSummary() {
    document.getElementById('div-alert').style.display = 'none';
    document.getElementById('total-persons').innerHTML = 0;
}

function setSummaryAlert(value) {
    document.getElementById('div-alert').style.display = 'block';
    document.getElementById('card-title').innerHTML = value;
}

function getPeoplesOnRadius(latitude, longitude, radius) {
    if (heatmapData.length != 0) {
        let center = new google.maps.LatLng(latitude, longitude);

        const filter = (element) => {
            let diff = google.maps.geometry.spherical.computeDistanceBetween(center, element.location);
            if (diff < radius) {
                return element;
            }
        }

        return heatmapData.filter(filter).length;
    }
}