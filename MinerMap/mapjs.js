const UNCC_BOUNDS = {
    north: 35.315700,
    south: 35.299345,
    west: -80.746187,
    east: -80.724543,
};

var styles = [
        {
            "featureType": "poi",
            "stylers": [
                { "visibility": "off" }
            ]
        },{
            "featureType": "poi",
            "stylers": [
                { "visibility": "off" }
            ]
        },{
            "featureType": "transit",
            "stylers": [
                { "visibility": "off" }
            ]
        }
    ]
;

function initMap() {
    // The location of uncc
    const uncc = { lat: 35.3071, lng: -80.7352 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        minZoom: 17 - 0.8,
        center: uncc,
        disableDefaultUI: true,
        restriction: {
            latLngBounds: UNCC_BOUNDS,
            strictBounds: false,
        },
        zoomControl: true,
        styles: styles,


    });



}

window.initMap = initMap;
