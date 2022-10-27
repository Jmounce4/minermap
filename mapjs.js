window.onload = function(){
    //on date time selection refresh the entire map
    document.getElementById("dateTime").onchange = mapRefresh;
}

//for testing stuff dont touch please - Elvis
var x = 1 
function testFunction(){
    x += 1;
    console.log(x);
    var testDate = document.dtSelection.dateTime.value;
    console.log(testDate);
    
    
}

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

    /*

    FRETWELL: "Fret",
    PORTAL: "PORT",
    GRIGG: "Grig",
    SOVI: "SVDH",
    CATO: "Cato",
    CHHS: "Heal",
    KING: "King",
    KENNEDY: "Kenn",
    ROWE: "Rowe",
    MCENIRY: "McEn",
    FRIDAY: "Frid",
    BARNARD: "Barn",
    MACY: "Macy",
    GARINGER: "Gari",
    WINNINGHAM: "Winn",
    ROBINSON: "Robi",
    STORRS: "Stor"
    */
    
}

//these are the variables that will be modified as the user selects time and date
var currentFilePath;
var currentHour;
var myList = [];
var heatMapPoints = [];
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
cordinateMapX.set(buildingHashTable.BURSON, 35.30755202779894);
cordinateMapY.set(buildingHashTable.BURSON, -80.73245238202595);
cordinateMapX.set(buildingHashTable.CAMERON, 35.30766340578566);
cordinateMapY.set(buildingHashTable.CAMERON, -80.73120876534848);
cordinateMapX.set(buildingHashTable.DENNY, 35.30540989667834);
cordinateMapY.set(buildingHashTable.DENNY, -80.72980119011649);
cordinateMapX.set(buildingHashTable.COLVARD, 35.30485735361828);
cordinateMapY.set(buildingHashTable.COLVARD, -80.73171867761586);
cordinateMapX.set(buildingHashTable.DUKE, 35.311968214346244);
cordinateMapY.set(buildingHashTable.DUKE, -80.74124823312059);
cordinateMapX.set(buildingHashTable.EPIC, 35.309087539725724);
cordinateMapY.set(buildingHashTable.EPIC, -80.74159117551818);
cordinateMapX.set(buildingHashTable.PROSPECTOR, 35.306814202649974);
cordinateMapY.set(buildingHashTable.PROSPECTOR, -80.73087887288469);
cordinateMapX.set(buildingHashTable.WOODWARD, 35.30744822877269);
cordinateMapY.set(buildingHashTable.WOODWARD, -80.73566633711343);
cordinateMapX.set(buildingHashTable.BIOINFORMATICS, 35.312679527276934);
cordinateMapY.set(buildingHashTable.BIOINFORMATICS, -80.74201738001688);
cordinateMapX.set(buildingHashTable.COED, 35.307575);
cordinateMapY.set(buildingHashTable.COED, -80.734177);
cordinateMapX.set(buildingHashTable.CONE, 35.305156834601746);
cordinateMapY.set(buildingHashTable.CONE, -80.73324174007793);

//Accessing the right hour is easy, the way the json is made, jsut use list[hour] in 0-23 format to get the hour desired



async function getData(jsonFile, hour){

//fetching json file and parsing information to  myList, testvar is basically the foot traffic for the hour passed 
let re = await fetch(jsonFile);
let tempJson = await re.json();
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

console.log("getData DONE");

}


mapRefresh();

//reminder on hour/time change the building weight and map needs to be refreshed to do tommorow 10/26


function initMap() {
    
   
    console.log("INIT MAP start");
  

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

   console.log("INIT MAP DONE");
    
}


//for some reason substr pulls the time all togethjer when substr, to get it we first substr the time to its own var then substr it again
/*
var testDate = document.dtSelection.dateTime.value;
console.log(testDate.substr(0,10));
var testType = testDate.substr(11);
console.log(testType.substr(0,2));
console.log(testDate.substr(11,11));
console.log(typeof +testType);
console.log(+"09");
*/

//this resets variables and refreshes the actual map
function mapRefresh(){
    //outputting initial time and file path
    //remember to clear aoutomated list: map points, weights
    myList = [];
    heatMapPoints = [];
    buildingWeight.clear();
    currentFilePath = "jsons/" + document.dtSelection.dateTime.value.substr(0,10) + ".json";
    currentHour = (document.dtSelection.dateTime.value.substr(11,11).substr(0,2));
    console.log("FilePath: ", currentFilePath, (document.dtSelection.dateTime.value.substr(11,11).substr(0,2)));

    //since getData is asynchronous, we use a then function to initiate the map
    getData(currentFilePath, +currentHour).then(window.initMap = initMap);
    



}