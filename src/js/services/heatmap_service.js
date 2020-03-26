const API_URL = 'http://127.0.0.1:8082/';
// const API_URL = 'https://a0277a12.ngrok.io/';

function createAlert(latitude, longitude, placeName, radius) {
    console.log(latitude, longitude, placeName, radius);
}

function getPeoplesOnRadius(latitude, longitude, radius) {
    return axios.post(API_URL + 'getPeopleOnRadius', {
        vef_lat: latitude,
        vef_long: longitude,
        vef_radius: radius,
    }).then(function (response) {
        return response;
    });
}

function getLocations() {
    return Rx.Observable.create((observer) => {
        let clearTimeout;
        let index = 0;
        const loop = () => {
            index++;
            axios.get(API_URL + 'getHeatmapAllusersWithoutSafeplace').then(function (response) {
                clearTimeout = setTimeout(() => {
                    observer.next(response.data.map(function (element) {
                        return { location: new google.maps.LatLng(element[0], element[1]), weight: element[2] };
                    }));
                    loop();
                }, index == 1 ? 0 : 30000);
            });
        };

        loop();

        return () => clearTimeout();
    }).catch(function (error) {
        observer.error(error);
    });
}