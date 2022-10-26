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

//Object Hash Table of buildings to their abbreviation to use in code and prevent confusion, buildings in all caps

let buildingHashTable = {
    UREC: "UREC",
    ATKINS: "Atki",
    BELKGYM: "BelG",
    STUDENTUNION: "StuU",
    /*
    commenting these out for now, uncomment each one as you add the cordinates and stuff
    BURSON: "Burs",
    CAMERON: "Came",
    DENNY: "Denn",
    COLVARD: "Colv",
    DUKE: "Duke",
    EPIC: "EPIC",
    PROSPECTOR: "Pros",
    WOODWARD: "Wood",
    BIOINFORMATICS: "Bioi",
    COED: "CoEd",
    CONE: "Cone"
    */
}

console.log(buildingHashTable.ATKINS);
var myList = [];

let temp;
let tempString;
//the idea is too set the cordinates in a map and the amounts in a map that will be refreshed on day change or hour change
//we will probably need a conversion table/map to convert the abbreviated names to cordinate names OR we can just use abreviated names
//for now we would hard code each location cordinate into the maps then get them when creating the locations for the heat map
var cordinateMapX = new Map();
var cordinateMapY = new Map();
var buildingWeight = new Map();

cordinateMapX.set(buildingHashTable.UREC, 35.30828240051414);
cordinateMapY.set(buildingHashTable.UREC, -80.7354048026442);
cordinateMapX.set(buildingHashTable.ATKINS, 35.30580227045677);
cordinateMapY.set(buildingHashTable.ATKINS, -80.7321921708205);
cordinateMapX.set(buildingHashTable.BELKGYM, 35.30539285658393);
cordinateMapY.set(buildingHashTable.BELKGYM, -80.73556587697733);
cordinateMapX.set(buildingHashTable.STUDENTUNION, 35.308733600648736);
cordinateMapY.set(buildingHashTable.STUDENTUNION, -80.73375791517492);

//Accessing the right hour is easy, the way the json is made, jsut use list[hour] in 0-23 format to get the hour desired



async function getData(jsonFile, hour){

//fetching json file and parsing information to  myList, testvar is basically the foot traffic for the hour passed 
const re = await fetch(jsonFile);
const tempJson = await re.json();
for(let iso of tempJson){
    //console.log(iso);
    tempString =  JSON.stringify(iso);
    temp =  JSON.parse(tempString);
    await myList.push(iso);

}
let testvar = await myList[hour];
console.log(testvar);
/*
    fetch("test3.json")
.then(response => response.json())
.then(json =>{
    for(let iso of json){
        //console.log(iso);
        tempString =  JSON.stringify(iso);
        temp =  JSON.parse(tempString);
        myList.push(iso);

    }
   
   
}).then(json =>{
    console.log(myList);
    
    let testvar = myList[0];
    console.log(testvar);
    
    //console.log(testvar.Atki);

    //here we add the hour foot traffic to the weight table building name: weight
   
    
}
    );


    //loop for object properties, can prob use to loop through buildings in the building hash table as well
    for (var prop in testvar){

}
    */

//loop through each builing in building table and set the weights
//var buildingKey = buildingHashTable.UREC;
//var currentWeight = testvar.buildingKey; 
//console.log(currentWeight, buildingKey);

for (var prop in buildingHashTable){
    console.log(buildingHashTable[prop]);
    buildingWeight.set(buildingHashTable[prop], testvar[buildingHashTable[prop]]);
    
}

console.log(buildingWeight);

}

//since getData is asynchronous, we use a then function to initiate the map
getData("test3.json", 0).then(window.initMap = initMap);
//reminder on hour/time change the building weight and map needs to be refreshed to do tommorow 10/26


function initMap() {
    
   

    var heatMapPoints = [];

    //adding the locations to the heatmap points based on the buildings in the building hash table
    for (var prop in buildingHashTable){
        heatMapPoints.push({location:  new  google.maps.LatLng(cordinateMapX.get(buildingHashTable[prop]), cordinateMapY.get(buildingHashTable[prop])), weight: buildingWeight.get(buildingHashTable[prop])},)
        
    }


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





    
    
    
