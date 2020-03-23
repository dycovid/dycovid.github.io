var markers = [];
var circles = [];

function drawHeatMap(cposition, map) {
    getLocations().subscribe({
        next: data => initHeatmap(data, map),
    });

    bindClickMap(map);
    getCurrentPosition(cposition, map);
}

function initHeatmap(data, map) {
    new google.maps.visualization.HeatmapLayer({
        data: data
    }).setMap(map);
    console.log(data);
}

function bindClickMap(map) {
    google.maps.event.addListener(map, 'click', function (event) {
        document.getElementById('btn_create_alert').blur();
        let marker = createMarker(event.latLng.lat(), event.latLng.lng(), map);
        getAddress(map, marker, event);
        if (markers.length != 0) {
            deleteMarkers();
        }

        document.getElementById('search-input').blur();
        setRadius(map, marker);
        markers.push(marker);
    });
}

function setRadius(map, marker) {
    let lat = parseFloat(document.getElementById('marker-lat').innerHTML);
    let long = parseFloat(document.getElementById('marker-long').innerHTML);

    let circle = createCircleAndMarker(map, marker, lat, long);

    getPeoplesOnRadius(lat, long, circle.getRadius() / 1000).then(function (result) {
        document.getElementById('total-persons').innerHTML = result.data['ans'];
    });
}

function configCircle(circle) {
    google.maps.event.addListener(circle, 'mouseover', function () {
        circle.set('editable', true);
    });

    google.maps.event.addListener(circle, 'mouseout', function () {
        circle.set('editable', false);
    });

    google.maps.event.addListener(circle, 'radius_changed', function () {
        let lat = parseFloat(document.getElementById('marker-lat').innerHTML).toFixed(6);
        let lng = parseFloat(document.getElementById('marker-long').innerHTML).toFixed(6);

        getPeoplesOnRadius(lat, lng, circle.getRadius() / 1000).then(function (result) {
            document.getElementById('total-persons').innerHTML = result.data['ans'];
        });
    });
}

function bindClickToMarker(marker) {
    google.maps.event.addListener(marker, 'click', function (event) {
        deleteMarkers();
        document.getElementById('search-input').value = '';
    });
}

function setMapOnAll(map, lst, size) {
    for (var i = 0; i < size; i++) {
        lst[i].setMap(map);
    }
}

function deleteMarkers() {
    setMapOnAll(null, markers, markers.length);
    setMapOnAll(null, circles, circles.length);
    markers = [];
    circles = [];
}