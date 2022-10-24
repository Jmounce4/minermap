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

//the idea is too set the cordinates in a map and the amounts in a map that will be refreshed on day change or hour change
//we will probably need a conversion table/map to convert the abbreviated names to cordinate names OR we can just use abreviated names
//for now we would hard code each location cordinate into the maps then get them when creating the locations for the heat map
var cordinateMapX = new Map();
var cordinateMapY = new Map();
var buildingWeight = new Map();
cordinateMapX.set("UREC", 35.30828240051414);
cordinateMapY.set("UREC", -80.7354048026442);
buildingWeight.set("UREC", 12000);
//on hour/time change the building weight map is refreshed


function initMap() {
    

    var heatMapPoints = [
        {location: new  google.maps.LatLng(35.308303, -80.733716), weight: 30000},
        {location: new  google.maps.LatLng(35.308303, -80.734), weight: 0},
        new  google.maps.LatLng(35.308177, -80.734503),
        {location:  new  google.maps.LatLng(35.308303, -80.734992), weight: 15000},
        {location:  new  google.maps.LatLng(cordinateMapX.get("UREC"), cordinateMapY.get("UREC")), weight: buildingWeight.get("UREC")},

       
    ];

    

    //using an for loop, run through every item in building weight and add a heatmappoint 

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

    var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatMapPoints
    });

    heatmap.setMap(map);
    heatmap.set("radius", heatmap.get("radius") ? null : 25);


}

window.initMap = initMap;
