
$(document).ready(function(){

    $( "#type,#time2, #time1" ).selectmenu();
    
    //on date time selection refresh the entire map
    document.getElementById("dateTime").onchange = mapRefresh;
    $("#gradientButton").click(function(){
        changeGradient();
        //console.log("color button clicked");
    });

    $(".infoDiv").hide();
    $(".recommendationWrapper").hide();

    $("#testClick").click(function(){
        $(".infoDiv").show();
        //$(".infoDiv").css("width", $("#menuContainer").width())
        fillList();
    });
    $("#restaurantClick").click(function(){
        $(".infoDiv").show();
        //$(".infoDiv").css("width", $("#menuContainer").width())
        fillRestaurantList();
    });
    $("#recommenderClick").click(function(){
        $(".recommendationWrapper").show();
        //$(".infoDiv").css("width", $("#menuContainer").width())
        fillRestaurantList();
    });

    $("#exitButtonReco").click(function(){
        $(".recommendationWrapper").hide();
        $("#recommendationResult").html("");
        
        
    });

    $("#recommendatioButton").click(function(){
        console.log("RECOMANDAODSAMD CLICKED");
        generateReccomendation();
    });
    
});

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

//Restaurant hash table

let restaurantHashTable = {
    CHICKFILA: {BUILDING: "PROSPECTOR", NAME: "Chick-Fil-A"},
    WENDYS: {BUILDING: "STUDENTUNION", NAME: "Wendy's"},
    Bojangles: {BUILDING: "STUDENTUNION", NAME: "Bojangles"},
    CROWNS: {BUILDING: "STUDENTUNION", NAME: "Crowns Commons"},
    STARBUCKS: {BUILDING: "STUDENTUNION", NAME: "Starbucks"},
    SALSARITAS: {BUILDING: "PROSPECTOR", NAME: "Salsarita's"},
    MAMMA: {BUILDING: "PROSPECTOR", NAME: "Mamma Leone's"},
    Sushi: {BUILDING: "PROSPECTOR", NAME: "Sushi with Gusto"},
    BURGER: {BUILDING: "PROSPECTOR", NAME: "Burger 704"},
    SOVI: {BUILDING: "SOVI", NAME: "SoVi"},
    PANDA: {BUILDING: "CONE", NAME: "Panda Express"},
    SUBWAY: {BUILDING: "CONE", NAME: "Subway"},







}

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
    CONE: "Cone",
    FRETWELL: "Fret",
    PORTAL: "PORT",
    GRIGG: "Grig",
    SOVI: "SVDH",
    //CATO: "Cato",
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
    
//CATO is placing markers in wrong area, just keep CoEd
    
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
cordinateMapX.set(buildingHashTable.FRETWELL, 35.306051269157344);
cordinateMapY.set(buildingHashTable.FRETWELL, -80.72902588357599);
cordinateMapX.set(buildingHashTable.PORTAL, 35.31169521548943);
cordinateMapY.set(buildingHashTable.PORTAL, -80.74298844343465);
cordinateMapX.set(buildingHashTable.GRIGG, 35.31132178048417);
cordinateMapY.set(buildingHashTable.GRIGG, -80.74191988409817);
cordinateMapX.set(buildingHashTable.SOVI, 35.302913717430094);
cordinateMapY.set(buildingHashTable.SOVI, -80.73485709439822);
//cordinateMapX.set(buildingHashTable.CATO, 35.30774517751554);
//cordinateMapY.set(buildingHashTable.CATO, -80.73374779362989);
cordinateMapX.set(buildingHashTable.CHHS, 35.30749472169555);
cordinateMapY.set(buildingHashTable.CHHS, -80.7333877703301);
cordinateMapX.set(buildingHashTable.KING, 35.30508074951166);
cordinateMapY.set(buildingHashTable.KING, -80.7325550772337);
cordinateMapX.set(buildingHashTable.KENNEDY, 35.30598284294199);
cordinateMapY.set(buildingHashTable.KENNEDY, -80.73092114732545);
cordinateMapX.set(buildingHashTable.ROWE, 35.30453814104648);
cordinateMapY.set(buildingHashTable.ROWE, -80.73072976519171);
cordinateMapX.set(buildingHashTable.MCENIRY, 35.307211693836535);
cordinateMapY.set(buildingHashTable.MCENIRY, -80.73019154498584);
cordinateMapX.set(buildingHashTable.FRIDAY, 35.30631631915391);
cordinateMapY.set(buildingHashTable.FRIDAY, -80.72995964401406);
cordinateMapX.set(buildingHashTable.BARNARD, 35.3057945900544);
cordinateMapY.set(buildingHashTable.BARNARD, -80.72992298495707);
cordinateMapX.set(buildingHashTable.MACY, 35.305704398948556);
cordinateMapY.set(buildingHashTable.MACY, -80.73038760971932);
cordinateMapX.set(buildingHashTable.GARINGER, 35.30499575103916);
cordinateMapY.set(buildingHashTable.GARINGER, -80.73002448065607);
cordinateMapX.set(buildingHashTable.WINNINGHAM, 35.305143003062035);
cordinateMapY.set(buildingHashTable.WINNINGHAM, -80.73039212063783);
cordinateMapX.set(buildingHashTable.ROBINSON, 35.30386202639);
cordinateMapY.set(buildingHashTable.ROBINSON, -80.72993444303359);
cordinateMapX.set(buildingHashTable.STORRS, 35.304615566608916);
cordinateMapY.set(buildingHashTable.STORRS, -80.72915670025833);



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
//await findBusiestTime(x);

}


mapRefresh();

//reminder on hour/time change the building weight and map needs to be refreshed to do tommorow 10/26

let heatmap;
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

    /*var*/ heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatMapPoints
    });

    heatmap.setMap(map);
    heatmap.set("radius", heatmap.get("radius") ? null : 25);

   console.log("INIT MAP DONE");


    const StuUString = '<h1> Student Union </h1>' +
        '<p>Average Hourly Traffic: ? </p>' +
            '<p>Busiest Hours: ?</p>' +
        '<p>Building Use: Student Services</p>' +
            '<p>Address: 8845 Craver RD, Charlotte NC 28223 </p>'

        ;

    const StuUwindow = new google.maps.InfoWindow({
        content: StuUString,
        ariaLabel: "StuU",
    });
    const image1 = "uncclogo2.png";
   const StuUMarker = new google.maps.Marker({
       position: {lat: 35.308863486369354, lng: -80.7337370128158},
       map,
       icon: image1,
   })

    StuUMarker.addListener("click", () => {
        StuUwindow.open({
            anchor: StuUMarker,
            map,
        });

    });
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
async function mapRefresh(){
    //outputting initial time and file path
    //remember to clear aoutomated list: map points, weights
    myList = [];
    heatMapPoints = [];
    buildingWeight.clear();
    currentFilePath = "jsons/" + document.dtSelection.dateTime.value.substr(0,10) + ".json";
    currentHour = (document.dtSelection.dateTime.value.substr(11,11).substr(0,2));
    console.log("FilePath: ", currentFilePath, (document.dtSelection.dateTime.value.substr(11,11).substr(0,2)));

    //since getData is asynchronous, we use a then function to initiate the map
    getData(currentFilePath, +currentHour).then(window.initMap = initMap).then(fillList);

    


}

 $('#menuContainer').scotchPanel({
    containerSelector: 'body', // As a jQuery Selector
    direction: 'left', // Make it toggle in from the left
    duration: 300, // Speed in ms how fast you want it to be
    transition: 'ease', // CSS3 transition type: linear, ease, ease-in, ease-out, ease-in-out, cubic-bezier(P1x,P1y,P2x,P2y)
    clickSelector: '.toggle-panel', // Enables toggling when clicking elements of this class
    distanceX: '30%', // Size fo the toggle
    enableEscapeKey: true // Clicking Esc will close the panel


});




//function will fill out the list using current data
function fillList(){
    //$('#infoDiv').html("");
    $('#infoDiv').html("<form id=exitButton action=><input class=exitContainer type=button value=Exit ></form>");
    $('#infoDiv').append("<div class=rowDiv><div class=infoContainer><p>Building</p></div><div ><p >Current Traffic</p></div><div><p>Busiest Time</p></div><div><p>Quietist Time</p></div></div>");
    
    //Looping through buildings map and filling putting the data in the list
    for (var prop in buildingHashTable){
        var tempTraffic = "";
        if(buildingWeight.get(buildingHashTable[prop]) != null ) {
            tempTraffic = buildingWeight.get(buildingHashTable[prop]);
            tempTraffic = Math.floor(tempTraffic/10)*10;
        } else {
            tempTraffic = 0;
        } 
        $('#infoDiv').append(
            "<div class=rowDiv>" 
            //building name
            + "<div class=infoContainer><p class=rowText>" + prop +"</p></div>"
            //current traffic
            + "<div class=infoContainer><p class=rowText>" 
            + tempTraffic
            +"</p></div>"
            //busiest time, use temp value for now
            + "<div class=infoContainer><p class=rowText>" + findBusiestTime(buildingHashTable[prop]) +"</p></div>"
            //quiestist time
            +"<div class=infoContainer><p class=rowText>" + findQuietistTime(buildingHashTable[prop]) +"</p></div>"
            //closing div
            + "</div>"
        );
        
       
        
    }

    $("#exitButton, #menuButton").click(function(){
        //console.log("Exit Button")
        $(".infoDiv").hide();
        
    });
  
}

//function to get key from value in buildings map, x is the current value being used
function getKey(x){
    //going to loop through map until we find the value
    for (var prop in buildingHashTable){
        if(buildingHashTable[prop] === x){
            return prop;
        }
        //buildingWeight.set(buildingHashTable[prop], testvar[buildingHashTable[prop]]);
        
    }
    return null;
}

//console.log("TESTING getKey: ", getKey)

//Find the busiest time for for building that day
function findBusiestTime(building){
    //to be used as return value
    var max = 0;
    var busiestHour;
    for(var list in myList){
        //myList[list]: this grabs the the current hour list
        //next we need to grab each traffic for the current building and then return the max or min
        //grabbing list for hour
        let tempHour = myList[list];
        //grabbing traffic for building at current hour
        let tempTraffic = tempHour[building];
        //checking max
        if(tempTraffic > max){
            
            max = tempTraffic;
            busiestHour = list;
        }
    };
    
    return busiestHour;
    
   
}

function findQuietistTime(building){
    //to be used as return value
    var min = 0;
    var quietistHour;
    
    for(var list in myList){
        //console.log(list);
        //myList[list]: this grabs the the current hour list
        //next we need to grab each traffic for the current building and then return the max or min
        //grabbing list for hour
        let tempHour = myList[list];
        //grabbing traffic for building at current hour
        let tempTraffic = tempHour[building];

        if(min == 0 ){
            quietistHour = 0;
            min = tempTraffic;
        }
        
        //checking min
        if(tempTraffic < min){
            
            min = tempTraffic;
            quietistHour = list;
        }
    };
    
    return quietistHour;
    
   
}

//changes color of heatmap points to diffrenent color
function changeGradient() {
    //console.log("FunctionRAN")
    const gradient = [
      "rgba(0, 255, 255, 0)",
      "rgba(0, 255, 255, 1)",
      "rgba(0, 191, 255, 1)",
      "rgba(0, 127, 255, 1)",
      "rgba(0, 63, 255, 1)",
      "rgba(0, 0, 255, 1)",
      "rgba(0, 0, 223, 1)",
      "rgba(0, 0, 191, 1)",
      "rgba(0, 0, 159, 1)",
      "rgba(0, 0, 127, 1)",
      "rgba(63, 0, 91, 1)",
      "rgba(127, 0, 63, 1)",
      "rgba(191, 0, 31, 1)",
      "rgba(255, 0, 0, 1)",
    ];
    
    heatmap.set("gradient", heatmap.get("gradient") ? null : gradient);
  }

  //for restaurants, we will fill the div with restraurants name, building it is in, and same info as other div. need to create a map that connects the restaurant to builing. Restaurant name: full building name

  function fillRestaurantList(){
    //console.log("TEST 1 for Rest: BUIILDING: ");
    //console.log(restaurantHashTable["WENDYS"].BUILDING);

    $('#infoDiv').html("<form id=exitButton action=><input class=exitContainer type=button value=Exit ></form>");
    $('#infoDiv').append("<div class=rowDiv><div class=infoContainer><p class=rowText>Restaurant</p></div><div class=infoContainer><p class=rowText>Building</p></div><div ><p class=rowText>Current Traffic</p></div><div><p class=rowText>Busiest Time</p></div>"+"</div>");
    
    //Looping through buildings map and putting the data in the list
    for (var prop in restaurantHashTable){
        var tempTraffic = "";
        var currentBuilding = restaurantHashTable[prop].BUILDING;
        if(buildingWeight.get(buildingHashTable[currentBuilding]) != null ) {
            tempTraffic = buildingWeight.get(buildingHashTable[currentBuilding]);
            tempTraffic = Math.floor(tempTraffic/10)*10;
            
        } else {
            tempTraffic = 0;
        } 
        $('#infoDiv').append(
            "<div class=rowDiv>"
            //Restaurant name
            + "<div class=infoContainer><p class=rowText>" + restaurantHashTable[prop].NAME +"</p></div>"
            //building name
            + "<div class=infoContainer><p class=rowText>" + currentBuilding +"</p></div>"
            //current traffic
            + "<div class=infoContainer><p class=rowText>" 
            + tempTraffic
            +"</p></div>"
            //busiest time, use temp value for now
            + "<div class=infoContainer><p class=rowText>" + findBusiestTime(buildingHashTable[currentBuilding]) +"</p></div>"
            //quiestist time
            //+"<div class=infoContainer><p class=rowText>" + findQuietistTime(buildingHashTable[currentBuilding]) +"</p></div>"
            //closing div
            + "</div>"
        );
        
       
        
    }

    $("#exitButton, #menuButton").click(function(){
        //console.log("Exit Button")
        $(".infoDiv").hide();
        
    });
    
  }
  //TO DO ELVIS: may change the layout of bukding hash table but that would also mean going into everyfunction and changing how the building is gotten,, though we could maybe just use find/replace for that testing that next time, add hours to restaurants, maybe use the bestTimes api idk yet
  //so, using the current selections from the user, we will generate a location that best suits their needs
  //study will need to find quitest area during a time period, while advertise will need to find busiest are during time period
function generateReccomendation(){
//********** I'll need to add a fallback for when user picks later time on first option */

    //getting selceted options from user
  
    //console.log($("#time1").find(":selected").val());
    //console.log($("#time2").find(":selected").val());
    var time1 = parseFloat($("#time1").find(":selected").val());
    var time2 = parseFloat($("#time2").find(":selected").val());

    var averageDivider = time2 - time1 + 1;

    //starting with code to find least busy building
    //choosing robinson as a comparison for the rest of the list 
  
    var buildingAverages = new Map();
    for(time1; time1<=time2; time1++){
        
        //looping through every building we are using using building hash table
        for(var building in buildingHashTable){

        //Here we set the building total traffic over the hours selected by the user
        if(!(building in buildingAverages.keys())){
            //if builing not in hashtable add it
            buildingAverages.set(building,  myList[time1][buildingHashTable[building]]);
        }else{
            //if building exist in hashtable, update its value with traffic from current hour
            buildingAverages.set(building, buildingAverages.get(building) + myList[time1][buildingHashTable[building]]);
        }
            /*
            if(building == "UREC"){
                continue;
            }
            */
            //grabbing the currents traffic from list of traffic (myList) and comparing it to leastBusyBuilding, 
            //if less least busy building will be changed to the one with less traffic
           
            
        }
    }

    //now average out all values in hashtable by diving it with total hours used set in averageDivider

    for(var key of buildingAverages.keys()){
        buildingAverages.set(key, buildingAverages.get(key) / averageDivider);
        //console.log(key);
    }
    
    //lastly we get the min or max value building based on what user selected they were looking for 
    var returnBuilding = "UREC";
    //finding least busy building for studying
    if($("#type").find(":selected").val() == "study"){
           
        for(var key of buildingAverages.keys()){
            if(buildingAverages.get(key) < buildingAverages.get(returnBuilding)){
                returnBuilding = key;
            }
            
        }
        //creating div with result
        $("#recommendationResult").html("");
        $("#recommendationResult").append(
            "From "
            +$("#time1").find(":selected").val() 
            +":00 to "
            +$("#time2").find(":selected").val()
            + ":00, <br> "
            +returnBuilding
            + " was the least busy."
        );

    }else if($("#type").find(":selected").val() == "advertise"){
        //finding busiest building for advertising
        for(var key of buildingAverages.keys()){
            if(buildingAverages.get(key) > buildingAverages.get(returnBuilding)){
                returnBuilding = key;
            }
            
        }
        //creating div with result
        $("#recommendationResult").html("");
        $("#recommendationResult").append(
            "From "
            +$("#time1").find(":selected").val() 
            +":00 to "
            +$("#time2").find(":selected").val()
            + ":00, <br> "
            +returnBuilding
            + " was the most busy."
        );

    }
    
  }


  //TO DO ELVIS: do the round thing 