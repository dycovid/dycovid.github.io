function initAlert(map) {
    var controlDiv = document.getElementById('div-alert');
    controlDiv.id = 'div-alert';
    controlDiv.style.width = '100%';
    controlDiv.style.marginBottom = '25px';
    controlDiv.style.padding = '0px 10px';
    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(controlDiv);
}

function addYourLocationButton(map) {
    var controlDiv = document.createElement('div');
    controlDiv.style.zIndex = '1';

    var firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '40px';
    firstChild.style.height = '40px';
    firstChild.style.borderRadius = '50%';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.marginBottom = '160px';
    firstChild.style.padding = '0.6em 0.6em 0.6em 0.6em';
    firstChild.style.display = 'flex';
    firstChild.style.alignItems = 'center';
    firstChild.style.justifyContent = 'center';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    var secondChild = document.createElement('div');
    secondChild.style.width = '24px';
    secondChild.style.height = '24px';
    secondChild.style.backgroundImage = 'url(./src/img/gps-location.svg)';
    secondChild.style.backgroundRepeat = 'no-repeat';
    firstChild.appendChild(secondChild);

    google.maps.event.addListener(map, 'center_changed', function () {
        secondChild.style['background-position'] = '0 0';
    });

    firstChild.addEventListener('click', function () {
        clearSummary();
        var imgX = '0',
            animationInterval = setInterval(function () {
                imgX = imgX === '-18' ? '0' : '-18';
                secondChild.style['background-position'] = imgX + 'px 0';
            }, 500);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setCenter(latlng);
                map.setZoom(16);
                deleteMarkers();
                hideSearchIcons('none', 'block');
                clearInterval(animationInterval);
                // secondChild.style['background-position'] = '-144px 0';
            });
        } else {
            clearInterval(animationInterval);
            secondChild.style['background-position'] = '0 0';
        }
    });

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}