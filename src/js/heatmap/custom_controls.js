function initAlert(map) {
    var controlDiv = document.getElementById('div-alert');
    controlDiv.id = 'div-alert';
    controlDiv.style.width = '81%';
    controlDiv.style.height = '20%';
    controlDiv.style.borderRadius = '2px';
    controlDiv.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    controlDiv.style.marginBottom = '26px';

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM].push(controlDiv);
}

function addYourLocationButton(map) {
    var controlDiv = document.createElement('div');
    controlDiv.style.zIndex = '1';

    var firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '3.6em';
    firstChild.style.height = '3.6em';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.padding = '0px 0px 0px 3px';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    var secondChild = document.createElement('div');
    secondChild.style.width = '4.2em';
    secondChild.style.height = '3.4em';
    secondChild.style.backgroundImage = 'url(./src/img/my_location.png)';
    secondChild.style.backgroundPosition = '0 0';
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