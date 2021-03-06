// const API_URL = 'http://localhost:5000/'
const API_URL = 'https://api-dycovid.mybluemix.net/';
const SIMULATE_URL = 'getHeatmapAllusersPlusCentersWithSafeplace';

function createAlert(deviceId, latitude, longitude, placeName, radius) {
    if (deviceId != '') {
        axios.post(API_URL + 'api/user/addAlert', {
            device_id: deviceId,
            alert_lat: latitude,
            alert_long: longitude,
            alert_radius: radius,
            alert_local_name: placeName,
        }).then(function (response) {
            $('#modal').modal('show');
            clearSummary();
            hideSearchIcons('none', 'block');
            deleteMarkers();
            return response;
        });
    } else {
        console.log("Device id not defined");
    }
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
    // return Rx.Observable.create((observer) => {
    //     let clearTimeout;
    //     let index = 0;
    //     const loop = () => {
    //         axios.get(API_URL + 'getHeatmapAllusersPlusCentersWithSafeplace').then(function (response) {
    //             clearTimeout = setTimeout(() => {
    //                 observer.next(response.data.map(function (element) {
    //                     return { location: new google.maps.LatLng(element[0], element[1]), weight: element[2] };
    //                 }));
    //                 loop();
    //                 index = 1;
    //             }, index == 0 ? 0 : 500000);
    //         });
    //     };

    //     loop();

    //     return () => clearTimeout();
    return Rx.Observable.create((observer) => {
        axios.post(API_URL + 'api/heatmap/getSnapshot', {
            qtd: 300000,
            plus: true,
        }).then(function (response) {
            observer.next(response.data.data.map(function (element) {
                return { location: new google.maps.LatLng(element[0], element[1]), weight: element[2] };
            }));
        });
    }).catch(function (error) {
        observer.error(error);
    });
}