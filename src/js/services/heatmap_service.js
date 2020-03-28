const API_URL = 'http://127.0.0.1:8082/';
// const API_URL = 'https://a0277a12.ngrok.io/';
const SIMULATE_URL = 'simulateHeatmapCentersWithoutSafeplace';

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

function getSimulateLocations() {
    return Rx.Observable.create((observer) => {
        let clearTimeout;
        let date = new Date("2020-03-24T10:10:00.000Z");
        let formattedDate;
        let increment = 0;
        const loop = () => {
            formattedDate = getFormattedDate(new Date(date.getTime() + increment * 60000));
            axios.post(API_URL + 'simulateHeatmap', {
                inicio: formattedDate,
                fim: formattedDate,
                limite: 1,
                plus: true,
            }).then(function (response) {
                clearTimeout = setTimeout(() => {
                    observer.next(response.data.map(function (element) {
                        return { location: new google.maps.LatLng(element[0], element[1]), weight: element[2] };
                    }));
                    loop();
                    increment += 5;
                }, increment == 0 ? 0 : 3000);
            });
        };

        loop();

        return () => clearTimeout();
    }).catch(function (error) {
        observer.error(error);
    });
}

function getLocations() {
    return Rx.Observable.create((observer) => {
        let clearTimeout;
        let index = 0;
        const loop = () => {
            axios.get(API_URL + 'getHeatmapAllUsersWithoutSafeplace').then(function (response) {
                console.log(index);
                clearTimeout = setTimeout(() => {
                    observer.next(response.data.map(function (element) {
                        return { location: new google.maps.LatLng(element[0], element[1]), weight: element[2] };
                    }));
                    loop();
                    index = 1;
                }, index == 0 ? 0 : 20000);
            });
        };

        loop();

        return () => clearTimeout();
    }).catch(function (error) {
        observer.error(error);
    });
}