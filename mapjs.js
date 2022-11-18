
$(document).ready(function(){

    $( "#type,#time2, #time1, #compare1, #compare2" ).selectmenu();
    //fillinf the select options from compare selects
    fillCompareSelect();
    //on date time selection refresh the entire map
    document.getElementById("dateTime").onchange = mapRefresh;
    $("#gradientButton").click(function(){
        changeGradient();
        //console.log("color button clicked");
    });

    let colorKey = document.getElementById("colorKey");
    let gradientButton = document.getElementById("gradientButton");

    

    gradientButton.addEventListener("click", changePic);
    $(".infoDiv").hide();
    $(".recommendationWrapper").hide();
    $("#compareDiv").hide();

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
        $("#recommendationWrapper").show();
        
    });

    $("#exitButtonReco").click(function(){
        $("#recommendationWrapper").hide();
        $("#recommendationResult").html("");
        
        
    });

    $("#compareClick").click(function(){
        $("#compareDiv").show();
    });

    $("#exitButtonCompare").click(function(){
        $("#compareDiv").hide();
    });

    
    $("#menuButton").click(function(){
        $("#compareDiv").hide();
        $("#recommendationWrapper").hide();
        $("#recommendationResult").html("");
    });
    
    $("#compare1, #compare2").on("selectmenuchange", addBuildingInfo);

    $("#recommendatioButton").click(function(){
        console.log("RECOMANDAODSAMD CLICKED");
        generateReccomendation();
    });
    
});

function changePic() {

    if (colorKey.getAttribute('src') === "legend.jpg"){
        colorKey.setAttribute('src', "legend2.jpg");
    }
    else {
        colorKey.setAttribute('src', "legend.jpg");
    }
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



//These are coordinates for each building's shape to allow them to be clicked on map
//
//
//
//


const urecShapeCoords = [
    { lat: 35.308432253929754, lng: -80.73583374185519 }, // Top left
    { lat: 35.308432253929754, lng: -80.73493706987938 }, // Top right
    { lat: 35.30812777607675, lng: -80.73493706987938 },  // bottom right
    { lat: 35.30812777607675, lng: -80.73583374185519 },  // bottom left
];

const atkinsShapeCoords = [
    { lat: 35.30618211129387, lng: -80.73280745886328 },
    { lat: 35.30618211129387, lng: -80.73136252382474  },
    { lat: 35.30552354030355, lng: -80.73136252382474  },
    { lat: 35.30552354030355, lng: -80.73280745886328  },
];

const belkShapeCoords = [
    { lat: 35.305757830327266, lng: -80.73618281887289  },
    { lat: 35.305757830327266, lng: -80.73524941012587  },
    { lat: 35.30500484667147, lng: -80.73524941012587 },
    { lat: 35.30500484667147, lng: -80.73618281887289  },
];

const studentUnionShapeCoords = [
    { lat: 35.30897860059564, lng: -80.73433170767746 },
    { lat: 35.30897860059564, lng: -80.73313007802611 },
    { lat: 35.30824534637546, lng: -80.73313007802611 },
    { lat: 35.30824534637546, lng: -80.73433170767746 },
];


const bursonShapeCoords = [
    { lat: 35.307725246058936, lng: -80.73299694332529 },
    { lat: 35.307725246058936, lng: -80.73193863599927 },
    { lat: 35.30715876925303, lng: -80.73193863599927 },
    { lat: 35.30715876925303, lng: -80.73299694332529 },
];

const cameronShapeCoords = [
    { lat: 35.30792539758837, lng: -80.73160055194114 },
    { lat: 35.30792539758837, lng: -80.73080663007038 },
    { lat: 35.30742475683544, lng: -80.73080663007038 },
    { lat: 35.30742475683544, lng: -80.73160055194114 },
];


const dennyShapeCoords = [
    { lat: 35.30560645621952, lng: -80.73000665648031 },
    { lat: 35.30560645621952, lng: -80.72960432514333 },
    { lat: 35.30520150872728, lng: -80.72960432514333 },
    { lat: 35.30520150872728, lng: -80.73000665648031 },
];

const colvardShapeCoords = [
    { lat: 35.305324353567585, lng: -80.73211371585455 },
    { lat: 35.305324353567585, lng: -80.73135317600199 },
    { lat: 35.30446377700056, lng: -80.73135317600199 },
    { lat: 35.30446377700056, lng: -80.73211371585455 },
];


const dukeShapeCoords = [
    { lat: 35.31185079902643, lng: -80.74166349621309 },
    { lat: 35.31230271637708, lng: -80.7411855509927 },
    { lat: 35.31199937487237, lng: -80.74076450401283 },
    { lat: 35.31154436048228, lng: -80.74127658817754 },
];


const epicShapeCoords = [
    { lat: 35.30946933393975, lng: -80.74190469955056 },
    { lat: 35.308948185921594, lng: -80.74105603408181 },
    { lat: 35.30837909345747, lng: -80.7416139335082 },
    { lat: 35.30895256354042, lng: -80.74239713847221 },
];

const prospectorShapeCoords = [
    { lat: 35.307169294042225, lng: -80.7310926569935 },
    { lat: 35.307169294042225, lng: -80.73064204589608 },
    { lat: 35.30642507903455, lng: -80.73064204589608 },
    { lat: 35.30642507903455, lng: -80.7310926569935 },
];

const woodwardShapeCoords = [
    { lat: 35.307638378598995, lng: -80.73593745332892 },
    { lat: 35.307638378598995, lng: -80.7348816619922 },
    { lat: 35.30687049292217, lng: -80.7348816619922 },
    { lat: 35.30687049292217, lng: -80.73593745332892 },
];

const bioinformaticsShapeCoords = [
    { lat: 35.31259986613882, lng: -80.74237662081882 },
    { lat: 35.312980587671824, lng: -80.74197074670307 },
    { lat: 35.31275772650414, lng: -80.74164453012406 },
    { lat: 35.312370813296226, lng: -80.74204661102377 },
];

const coedShapeCoords = [
    { lat: 35.30786658360647, lng: -80.73438985605516 },
    { lat: 35.30786658360647, lng: -80.73385398613198 },
    { lat: 35.30730433741148, lng: -80.73385398613198 },
    { lat: 35.30730433741148, lng: -80.73438985605516 },
];

const coneShapeCoords = [
    { lat: 35.30558303194232, lng: -80.73346404756457 },
    { lat: 35.30558303194232, lng: -80.7328618397819 },
    { lat: 35.305161524604905, lng: -80.7328618397819 },
    { lat: 35.305161524604905, lng: -80.73346404756457 },
];

const fretwellShapeCoords = [
    { lat: 35.306475660540876, lng: -80.72942549285187 },
    { lat: 35.306475660540876, lng: -80.72848940194115 },
    { lat: 35.305878095085305, lng: -80.72848940194115 },
    { lat: 35.305878095085305, lng: -80.72942549285187 },
];

const portalShapeCoords = [
    { lat: 35.31156826495034, lng: -80.74335468279756 },
    { lat: 35.31195088497801, lng: -80.74294321126975 },
    { lat: 35.311734848041986, lng: -80.74263699990021 },
    { lat: 35.31134962412194, lng: -80.74305166112978 },
];

const griggShapeCoords = [
    { lat: 35.311050112595495, lng: -80.74260724704928 },
    { lat: 35.3115639413222, lng: -80.74202688499592 },
    { lat: 35.31122654812866, lng: -80.74155652620759 },
    { lat: 35.310759147893165, lng: -80.74206102394024 },
];

const soviShapeCoords = [
    { lat: 35.303116121374366, lng: -80.7352806542296 },
    { lat: 35.303116121374366, lng: -80.7344920848091 },
    { lat: 35.30252290907234, lng: -80.7344920848091 },
    { lat: 35.30252290907234, lng: -80.7352806542296 },
];

const chhsShapeCoords = [
    { lat: 35.30794506216922, lng: -80.73356631204373 },
    { lat: 35.30794506216922, lng: -80.73308887885717 },
    { lat: 35.30690098036771, lng: -80.73308887885717},
    { lat: 35.30690098036771, lng: -80.73356631204373 },
];

const kingShapeCoords = [
    { lat: 35.30523616004091, lng: -80.7327393567272 },
    { lat: 35.30523616004091, lng: -80.7323584830615 },
    { lat: 35.304920956400714, lng: -80.7323584830615 },
    { lat: 35.304920956400714, lng: -80.7327393567272 },
];

const kennedyShapeCoords = [
    { lat: 35.3061456766128, lng: -80.73113477348694 },
    { lat: 35.3061456766128, lng: -80.73072427977252 },
    { lat: 35.30578491315174, lng: -80.73072427977252 },
    { lat: 35.30578491315174, lng: -80.73113477348694 },
];

const roweShapeCoords = [
    { lat: 35.30477657614483, lng: -80.73108277263134 },
    { lat: 35.30477657614483, lng: -80.7303407263014 },
    { lat: 35.30416915707214, lng: -80.7303407263014},
    { lat: 35.30416915707214, lng: -80.73108277263134 },
];

const mceniryShapeCoords = [
    { lat: 35.307418526560305, lng: -80.73054738107295 },
    { lat: 35.307418526560305, lng: -80.72985805334885 },
    { lat: 35.30679470166045, lng: -80.72985805334885 },
    { lat: 35.30679470166045, lng: -80.73054738107295 },
];

const fridayShapeCoords = [
    { lat: 35.306603352740915, lng: -80.73023607195744 },
    { lat: 35.306603352740915, lng: -80.72967280805837 },
    { lat: 35.30602548822784, lng: -80.72967280805837 },
    { lat: 35.30602548822784, lng: -80.73023607195744 },
];

const barnardShapeCoords = [
    { lat: 35.30588644334289, lng: -80.730222601387 },
    { lat: 35.30588644334289, lng: -80.72979613014914 },
    { lat: 35.30570695397434, lng: -80.72979613014914 },
    { lat: 35.30570695397434, lng: -80.730222601387 },
];

const macyShapeCoords = [
    { lat: 35.305887633050645, lng: -80.73050166127365 },
    { lat: 35.305887633050645, lng: -80.73028306123662 },
    { lat: 35.30547502580406, lng: -80.73028306123662 },
    { lat: 35.30547502580406, lng: -80.73050166127365 },
];

const garingerShapeCoords = [
    { lat: 35.30507750157947, lng: -80.73021731517473 },
    { lat: 35.30507750157947, lng: -80.72980195797827 },
    { lat: 35.30490260043431, lng: -80.72980195797827 },
    { lat: 35.30490260043431, lng: -80.73021731517473 },
];

const winninghamShapeCoords = [
    { lat: 35.30531895740637, lng: -80.73050180640517 },
    { lat: 35.30531895740637, lng: -80.73028559307004 },
    { lat: 35.304907243832446, lng: -80.73028559307004 },
    { lat: 35.304907243832446, lng: -80.73050180640517 },
];

const robinsonShapeCoords = [
    { lat: 35.30422131074929, lng: -80.73023239630423 },
    { lat: 35.30422131074929, lng: -80.7295799630824 },
    { lat: 35.30337620073741, lng: -80.7295799630824 },
    { lat: 35.30337620073741, lng: -80.73023239630423 },
];

const storrsShapeCoords = [
    { lat: 35.305026235371244, lng: -80.7294864506802 },
    { lat: 35.305026235371244, lng: -80.72877834749279 },
    { lat: 35.30414190864265, lng: -80.72877834749279 },
    { lat: 35.30414190864265, lng: -80.7294864506802 },
];

//
//
//
//




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

    const image1 = "small.png";

    // INFO WINDOW INFORMATION
//
//
//



    const urecString = '<h1> University Recreational Center </h1>' +
        '<p>Average Hourly Traffic: '+ 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["UREC"]) +
        '<p>Building Use: Student Services</p>' +
        '<p>Address: 8827 CRAVER RD, Charlotte NC 28223 </p>';

    const atkinsString = '<h1> J. Murrey Atkins Library </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["ATKINS"]) +
        '<p>Building Use: Student Services</p>' +
        '<p>Address: 410 LIBRARY LN, Charlotte NC 28223 </p>';

    const belkString = '<h1> Belk Gym </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["BELKGYM"]) +
        '<p>Building Use: Student Services</p>' +
        '<p>Address: 8911 University Rd, Charlotte, NC 28223 </p>';

    const studentUnionString = '<h1> Student Union </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["STUDENTUNION"]) +
        '<p>Building Use: Student Services</p>' +
        '<p>Address: 8845 Craver RD, Charlotte NC 28223 </p>';

    const bursonString = '<h1> Burson </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["BURSON"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9006 CRAVER RD, Charlotte NC 28223 </p>';

    const cameronString = '<h1> Cameron </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["CAMERON"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9010 CRAVER RD, Charlotte NC 28223 </p>';

    const dennyString = '<h1> Denny </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["DENNY"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9125 Mary Alexander Rd, Charlotte, NC 28223 </p>';

    const colvardString = '<h1> Colvard </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["COLVARD"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9105 UNIVERSITY RD, Charlotte NC 28223 </p>';

    const dukeString = '<h1> Duke Centennial Hall </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["DUKE"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9330 Robert D. Snyder Rd, Charlotte, NC 28223 </p>';

    const epicString = '<h1> EPIC </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["EPIC"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 8700 Phillips Rd, Charlotte, NC 28223 </p>';

    const prospectorString = '<h1> Prospector </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["PROSPECTOR"]) +
        '<p>Building Use:  Student Services</p>' +
        '<p>Address: Library Ln, Charlotte, NC 28223 </p>';

    const woodwardString = '<h1> Woodward Hall </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["WOODWARD"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 8812 CRAVER RD, Charlotte NC 28223 </p>';

    const bioinformaticsString = '<h1> Bioinformatics </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["BIOINFORMATICS"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9331 Robert D. Snyder Rd, Charlotte, NC 28223 </p>';

    const coedString = '<h1> Cato College of Education </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["COED"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 8838 Craver Rd, Charlotte, NC 28223 </p>';

    const coneString = '<h1> Cone </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["CONE"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9025 University Rd, Charlotte, NC 28223 </p>';

    const fretwellString = '<h1> Fretwell </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["FRETWELL"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9203 Mary Alexander Rd, Charlotte, NC 28223 </p>';

    const portalString = '<h1> PORTAL </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["PORTAL"]) +
        '<p>Building Use: Auxiliary</p>' +
        '<p>Address: 9319 Robert D. Snyder Rd, Charlotte, NC 28223 </p>';

    const griggString = '<h1> Grigg Hall </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["GRIGG"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9320 Robert D. Snyder Rd, Charlotte, NC 28223 </p>';

    const soviString = '<h1> Sovi </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["SOVI"]) +
        '<p>Building Use: Student Services</p>' +
        '<p>Address: 8917 Johnson Alumni Way, Charlotte, NC 28262 </p>';

    const chhsString = '<h1> College of Health and Human Services </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["CHHS"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 8844 Craver Rd, Charlotte, NC 28223 </p>';

    const kingString = '<h1> King </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["KING"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9037 University Rd, Charlotte, NC 28223 </p>';

    const kennedyString = '<h1> Kennedy </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["KENNEDY"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9214 South, Library Ln, Charlotte, NC 28223 </p>';

    const roweString = '<h1> Rowe </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["ROWE"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9119 University Rd, Charlotte, NC 28223 </p>';

    const mceniryString = '<h1> McEniry </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["MCENIRY"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9215 Mary Alexander Rd, Charlotte, NC 28223 </p>';

    const fridayString = '<h1> Belk College of Business (Friday) </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["FRIDAY"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9209 Mary Alexander Rd, Charlotte, NC 28262 </p>';

    const barnardString = '<h1> Barnard </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["BARNARD"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9129 Mary Alexander Rd, Charlotte, NC 28223 </p>';

    const macyString = '<h1> Macy </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["MACY"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9224 Library Ln, Charlotte, NC 28262 </p>';

    const garingerString = '<h1> Garinger </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["GARINGER"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9121 Mary Alexander Rd, Charlotte, NC 28223 </p>';

    const winninghamString = '<h1> Winningham </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["WINNINGHAM"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9236 SOUTH, Library Ln, Charlotte, NC 28223 </p>';

    const robinsonString = '<h1> Robinson </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' + findBusiestTime(buildingHashTable["ROBINSON"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9027 Mary Alexander Rd, Charlotte, NC 28223 </p>';

    const storrsString = '<h1> Storrs School of Architecture </h1>' +
        '<p>Average Hourly Traffic: ' + 1 +
        '<p>Busiest Hours: ' +  findBusiestTime(buildingHashTable["STORRS"]) +
        '<p>Building Use: Instruction & Research</p>' +
        '<p>Address: 9115 Mary Alexander Rd, Charlotte, NC 28262 </p>';

//
//
//
//


    //All of this must be done in initmap, since it is all google maps related objects
    // This establishes all shapes, markers, info windows, and onclick events for each building
    //
    //
    //
    //



    const urecShape = new google.maps.Polygon({
        paths: urecShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    urecShape.setMap(map);
    const urecWindow = new google.maps.InfoWindow({
        content: urecString,
        ariaLabel: "urec",
    });
    const urecMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["UREC"]), lng: cordinateMapY.get(buildingHashTable["UREC"])},
        map,
        icon: image1,
        visible: false,
    });
    urecShape.addListener("click", () => {
        urecWindow.open({
            anchor: urecMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        urecWindow.close();
    });



    const atkinsShape = new google.maps.Polygon({
        paths: atkinsShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    atkinsShape.setMap(map);
    const atkinsWindow = new google.maps.InfoWindow({
        content: atkinsString,
        ariaLabel: "atkins",
    });
    const atkinsMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["ATKINS"]), lng: cordinateMapY.get(buildingHashTable["ATKINS"])},
        map,
        icon: image1,
        visible: false,
    });
    atkinsShape.addListener("click", () => {
        atkinsWindow.open({
            anchor: atkinsMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        atkinsWindow.close();
    });

    const belkShape = new google.maps.Polygon({
        paths: belkShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    belkShape.setMap(map);
    const belkWindow = new google.maps.InfoWindow({
        content: belkString,
        ariaLabel: "belk",
    });
    const belkMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["BELKGYM"]), lng: cordinateMapY.get(buildingHashTable["BELKGYM"])},
        map,
        icon: image1,
        visible: false,
    });
    belkShape.addListener("click", () => {
        belkWindow.open({
            anchor: belkMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        belkWindow.close();
    });
    const studentUnionShape = new google.maps.Polygon({
        paths: studentUnionShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    studentUnionShape.setMap(map);
    const studentUnionWindow = new google.maps.InfoWindow({
        content: studentUnionString,
        ariaLabel: "studentUnion",
    });
    const studentUnionMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["STUDENTUNION"]), lng: cordinateMapY.get(buildingHashTable["STUDENTUNION"])},
        map,
        icon: image1,
        visible: false,
    });
    studentUnionShape.addListener("click", () => {
        studentUnionWindow.open({
            anchor: studentUnionMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        studentUnionWindow.close();
    });



    const bursonShape = new google.maps.Polygon({
        paths: bursonShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    bursonShape.setMap(map);
    const bursonWindow = new google.maps.InfoWindow({
        content: bursonString,
        ariaLabel: "burson",
    });
    const bursonMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["BURSON"]), lng: cordinateMapY.get(buildingHashTable["BURSON"])},
        map,
        icon: image1,
        visible: false,
    });
    bursonShape.addListener("click", () => {
        bursonWindow.open({
            anchor: bursonMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        bursonWindow.close();
    });



    const cameronShape = new google.maps.Polygon({
        paths: cameronShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    cameronShape.setMap(map);
    const cameronWindow = new google.maps.InfoWindow({
        content: cameronString,
        ariaLabel: "",
    });
    const cameronMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["CAMERON"]), lng: cordinateMapY.get(buildingHashTable["CAMERON"])},
        map,
        icon: image1,
        visible: false,
    });
    cameronShape.addListener("click", () => {
        cameronWindow.open({
            anchor: cameronMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        cameronWindow.close();
    });


//NEW PASTE

    const dennyShape = new google.maps.Polygon({
        paths: dennyShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    dennyShape.setMap(map);
    const dennyWindow = new google.maps.InfoWindow({
        content: dennyString,
        ariaLabel: "denny",
    });
    const dennyMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["DENNY"]), lng: cordinateMapY.get(buildingHashTable["DENNY"])},
        map,
        icon: image1,
        visible: false,
    });
    dennyShape.addListener("click", () => {
        dennyWindow.open({
            anchor: dennyMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        dennyWindow.close();
    });

    const colvardShape = new google.maps.Polygon({
        paths: colvardShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    colvardShape.setMap(map);
    const colvardWindow = new google.maps.InfoWindow({
        content: colvardString,
        ariaLabel: "colvard",
    });
    const colvardMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["COLVARD"]), lng: cordinateMapY.get(buildingHashTable["COLVARD"])},
        map,
        icon: image1,
        visible: false,
    });
    colvardShape.addListener("click", () => {
        colvardWindow.open({
            anchor: colvardMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        colvardWindow.close();
    });



    const dukeShape = new google.maps.Polygon({
        paths: dukeShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    dukeShape.setMap(map);
    const dukeWindow = new google.maps.InfoWindow({
        content: dukeString,
        ariaLabel: "duke",
    });
    const dukeMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["DUKE"]), lng: cordinateMapY.get(buildingHashTable["DUKE"])},
        map,
        icon: image1,
        visible: false,
    });
    dukeShape.addListener("click", () => {
        dukeWindow.open({
            anchor: dukeMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        dukeWindow.close();
    });



    const epicShape = new google.maps.Polygon({
        paths: epicShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    epicShape.setMap(map);
    const epicWindow = new google.maps.InfoWindow({
        content: epicString,
        ariaLabel: "epic",
    });
    const epicMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["EPIC"]), lng: cordinateMapY.get(buildingHashTable["EPIC"])},
        map,
        icon: image1,
        visible: false,
    });
    epicShape.addListener("click", () => {
        epicWindow.open({
            anchor: epicMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        epicWindow.close();
    });



    const prospectorShape = new google.maps.Polygon({
        paths: prospectorShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    prospectorShape.setMap(map);
    const prospectorWindow = new google.maps.InfoWindow({
        content: prospectorString,
        ariaLabel: "prospector",
    });
    const prospectorMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["PROSPECTOR"]), lng: cordinateMapY.get(buildingHashTable["PROSPECTOR"])},
        map,
        icon: image1,
        visible: false,
    });
    prospectorShape.addListener("click", () => {
        prospectorWindow.open({
            anchor: prospectorMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        prospectorWindow.close();
    });
    const woodwardShape = new google.maps.Polygon({
        paths: woodwardShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    woodwardShape.setMap(map);
    const woodwardWindow = new google.maps.InfoWindow({
        content: woodwardString,
        ariaLabel: "woodward",
    });
    const woodwardMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["WOODWARD"]), lng: cordinateMapY.get(buildingHashTable["WOODWARD"])},
        map,
        icon: image1,
        visible: false,
    });
    woodwardShape.addListener("click", () => {
        woodwardWindow.open({
            anchor: woodwardMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        woodwardWindow.close();
    });



    const bioinformaticsShape = new google.maps.Polygon({
        paths: bioinformaticsShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    bioinformaticsShape.setMap(map);
    const bioinformaticsWindow = new google.maps.InfoWindow({
        content: bioinformaticsString,
        ariaLabel: "bioinformatics",
    });
    const bioinformaticsMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["BIOINFORMATICS"]), lng: cordinateMapY.get(buildingHashTable["BIOINFORMATICS"])},
        map,
        icon: image1,
        visible: false,
    });
    bioinformaticsShape.addListener("click", () => {
        bioinformaticsWindow.open({
            anchor: bioinformaticsMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        bioinformaticsWindow.close();
    });



    const coedShape = new google.maps.Polygon({
        paths: coedShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    coedShape.setMap(map);
    const coedWindow = new google.maps.InfoWindow({
        content: coedString,
        ariaLabel: "coed",
    });
    const coedMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["COED"]), lng: cordinateMapY.get(buildingHashTable["COED"])},
        map,
        icon: image1,
        visible: false,
    });
    coedShape.addListener("click", () => {
        coedWindow.open({
            anchor: coedMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        coedWindow.close();
    });
    const coneShape = new google.maps.Polygon({
        paths: coneShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    coneShape.setMap(map);
    const coneWindow = new google.maps.InfoWindow({
        content: coneString,
        ariaLabel: "cone",
    });
    const coneMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["CONE"]), lng: cordinateMapY.get(buildingHashTable["CONE"])},
        map,
        icon: image1,
        visible: false,
    });
    coneShape.addListener("click", () => {
        coneWindow.open({
            anchor: coneMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        coneWindow.close();
    });



    const fretwellShape = new google.maps.Polygon({
        paths: fretwellShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    fretwellShape.setMap(map);
    const fretwellWindow = new google.maps.InfoWindow({
        content: fretwellString,
        ariaLabel: "fretwell",
    });
    const fretwellMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["FRETWELL"]), lng: cordinateMapY.get(buildingHashTable["FRETWELL"])},
        map,
        icon: image1,
        visible: false,
    });
    fretwellShape.addListener("click", () => {
        fretwellWindow.open({
            anchor: fretwellMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        fretwellWindow.close();
    });



    const portalShape = new google.maps.Polygon({
        paths: portalShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    portalShape.setMap(map);
    const portalWindow = new google.maps.InfoWindow({
        content: portalString,
        ariaLabel: "portal",
    });
    const portalMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["PORTAL"]), lng: cordinateMapY.get(buildingHashTable["PORTAL"])},
        map,
        icon: image1,
        visible: false,
    });
    portalShape.addListener("click", () => {
        portalWindow.open({
            anchor: portalMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        portalWindow.close();
    });



    const griggShape = new google.maps.Polygon({
        paths: griggShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    griggShape.setMap(map);
    const griggWindow = new google.maps.InfoWindow({
        content: griggString,
        ariaLabel: "grigg",
    });
    const griggMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["GRIGG"]), lng: cordinateMapY.get(buildingHashTable["GRIGG"])},
        map,
        icon: image1,
        visible: false,
    });
    griggShape.addListener("click", () => {
        griggWindow.open({
            anchor: griggMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        griggWindow.close();
    });



    const soviShape = new google.maps.Polygon({
        paths: soviShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    soviShape.setMap(map);
    const soviWindow = new google.maps.InfoWindow({
        content: soviString,
        ariaLabel: "sovi",
    });
    const soviMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["SOVI"]), lng: cordinateMapY.get(buildingHashTable["SOVI"])},
        map,
        icon: image1,
        visible: false,
    });
    soviShape.addListener("click", () => {
        soviWindow.open({
            anchor: soviMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        soviWindow.close();
    });



    const chhsShape = new google.maps.Polygon({
        paths: chhsShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    chhsShape.setMap(map);
    const chhsWindow = new google.maps.InfoWindow({
        content: chhsString,
        ariaLabel: "chhs",
    });
    const chhsMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["CHHS"]), lng: cordinateMapY.get(buildingHashTable["CHHS"])},
        map,
        icon: image1,
        visible: false,
    });
    chhsShape.addListener("click", () => {
        chhsWindow.open({
            anchor: chhsMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        chhsWindow.close();
    });



    const kingShape = new google.maps.Polygon({
        paths: kingShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    kingShape.setMap(map);
    const kingWindow = new google.maps.InfoWindow({
        content: kingString,
        ariaLabel: "king",
    });
    const kingMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["KING"]), lng: cordinateMapY.get(buildingHashTable["KING"])},
        map,
        icon: image1,
        visible: false,
    });
    kingShape.addListener("click", () => {
        kingWindow.open({
            anchor: kingMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        kingWindow.close();
    });



    const kennedyShape = new google.maps.Polygon({
        paths: kennedyShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    kennedyShape.setMap(map);
    const kennedyWindow = new google.maps.InfoWindow({
        content: kennedyString,
        ariaLabel: "kennedy",
    });
    const kennedyMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["KENNEDY"]), lng: cordinateMapY.get(buildingHashTable["KENNEDY"])},
        map,
        icon: image1,
        visible: false,
    });
    kennedyShape.addListener("click", () => {
        kennedyWindow.open({
            anchor: kennedyMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        kennedyWindow.close();
    });



    const roweShape = new google.maps.Polygon({
        paths: roweShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    roweShape.setMap(map);
    const roweWindow = new google.maps.InfoWindow({
        content: roweString,
        ariaLabel: "rowe",
    });
    const roweMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["ROWE"]), lng: cordinateMapY.get(buildingHashTable["ROWE"])},
        map,
        icon: image1,
        visible: false,
    });
    roweShape.addListener("click", () => {
        roweWindow.open({
            anchor: roweMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        roweWindow.close();
    });


    const mceniryShape = new google.maps.Polygon({
        paths: mceniryShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    mceniryShape.setMap(map);
    const mceniryWindow = new google.maps.InfoWindow({
        content: mceniryString,
        ariaLabel: "mceniry",
    });
    const mceniryMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["MCENIRY"]), lng: cordinateMapY.get(buildingHashTable["MCENIRY"])},
        map,
        icon: image1,
        visible: false,
    });
    mceniryShape.addListener("click", () => {
        mceniryWindow.open({
            anchor: mceniryMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        mceniryWindow.close();
    });



    const fridayShape = new google.maps.Polygon({
        paths: fridayShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    fridayShape.setMap(map);
    const fridayWindow = new google.maps.InfoWindow({
        content: fridayString,
        ariaLabel: "friday",
    });
    const fridayMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["FRIDAY"]), lng: cordinateMapY.get(buildingHashTable["FRIDAY"])},
        map,
        icon: image1,
        visible: false,
    });
    fridayShape.addListener("click", () => {
        fridayWindow.open({
            anchor: fridayMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        fridayWindow.close();
    });
    const barnardShape = new google.maps.Polygon({
        paths: barnardShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    barnardShape.setMap(map);
    const barnardWindow = new google.maps.InfoWindow({
        content: barnardString,
        ariaLabel: "barnard",
    });
    const barnardMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["BARNARD"]), lng: cordinateMapY.get(buildingHashTable["BARNARD"])},
        map,
        icon: image1,
        visible: false,
    });
    barnardShape.addListener("click", () => {
        barnardWindow.open({
            anchor: barnardMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        barnardWindow.close();
    });


    const macyShape = new google.maps.Polygon({
        paths: macyShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    macyShape.setMap(map);
    const macyWindow = new google.maps.InfoWindow({
        content: macyString,
        ariaLabel: "macy",
    });
    const macyMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["MACY"]), lng: cordinateMapY.get(buildingHashTable["MACY"])},
        map,
        icon: image1,
        visible: false,
    });
    macyShape.addListener("click", () => {
        macyWindow.open({
            anchor: macyMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        macyWindow.close();
    });

    const garingerShape = new google.maps.Polygon({
        paths: garingerShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    garingerShape.setMap(map);
    const garingerWindow = new google.maps.InfoWindow({
        content: garingerString,
        ariaLabel: "garinger",
    });
    const garingerMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["GARINGER"]), lng: cordinateMapY.get(buildingHashTable["GARINGER"])},
        map,
        icon: image1,
        visible: false,
    });
    garingerShape.addListener("click", () => {
        garingerWindow.open({
            anchor: garingerMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        garingerWindow.close();
    });



    const winninghamShape = new google.maps.Polygon({
        paths: winninghamShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    winninghamShape.setMap(map);
    const winninghamWindow = new google.maps.InfoWindow({
        content: winninghamString,
        ariaLabel: "winningham",
    });
    const winninghamMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["WINNINGHAM"]), lng: cordinateMapY.get(buildingHashTable["WINNINGHAM"])},
        map,
        icon: image1,
        visible: false,
    });
    winninghamShape.addListener("click", () => {
        winninghamWindow.open({
            anchor: winninghamMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        winninghamWindow.close();
    });



    const robinsonShape = new google.maps.Polygon({
        paths: robinsonShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    robinsonShape.setMap(map);
    const robinsonWindow = new google.maps.InfoWindow({
        content: robinsonString,
        ariaLabel: "robinson",
    });
    const robinsonMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["ROBINSON"]), lng: cordinateMapY.get(buildingHashTable["ROBINSON"])},
        map,
        icon: image1,
        visible: false,
    });
    robinsonShape.addListener("click", () => {
        robinsonWindow.open({
            anchor: robinsonMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        robinsonWindow.close();
    });



    const storrsShape = new google.maps.Polygon({
        paths: storrsShapeCoords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.0,
        strokeWeight: 1,
        fillColor: "#085212",
        fillOpacity: 0.0,
    });
    storrsShape.setMap(map);
    const storrsWindow = new google.maps.InfoWindow({
        content: storrsString,
        ariaLabel: "storrs",
    });
    const storrsMarker = new google.maps.Marker({
        position: {lat: cordinateMapX.get(buildingHashTable["STORRS"]), lng: cordinateMapY.get(buildingHashTable["STORRS"])},
        map,
        icon: image1,
        visible: false,
    });
    storrsShape.addListener("click", () => {
        storrsWindow.open({
            anchor: storrsMarker,
            map,
        });
    });
    google.maps.event.addListener(map, "click", function(event) {
        storrsWindow.close();
    });

    //
    //
    //
    //
    //
    //
    //
//End of all info windows+markers etc.




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
    getData(currentFilePath, +currentHour).then(window.initMap = initMap).then(fillList).then(addBuildingInfo);
 
    
    


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


//filling selects with buildings in buildings hashtable
function fillCompareSelect(){
    console.log("RAN  CMOAPRE FIL");
    for(var building in buildingHashTable){
        $("#compare1").append(
            "<option value ="
            //value set to current building from loop
            +building
            +">"
            //setting text to building from loop
            +building
            //closing option div
            +"</option>"
        )
        $("#compare2").append(
            "<option value ="
            //value set to current building from loop
            +building
            +">"
            //setting text to building from loop
            +building
            //closing option div
            +"</option>"
        )
    }
    $("#compare1").selectmenu("refresh");
    $("#compare2").selectmenu("refresh");
}

//adding selected building info to 
async function addBuildingInfo(){
    
    //setting the initial state of the building info p tags
    $("#building1Info p:eq(0)").html("Current Traffic: ");
    $("#building1Info p:eq(1)").html("Busiest Time: ");
    $("#building2Info p:eq(0)").html("Current Traffic: ");
    $("#building2Info p:eq(1)").html("Busiest Time: ");
   
    //checking that value of building 1 select is not undefined
    /*
    if($("#compare1").find(":selected").val() == undefined){
        console.log("THE BUILDING UNDEFINED CHECK WORKED");
    }
    */
    
    //getting current traffic of building 1
    var tempTraffic1 = buildingWeight.get(buildingHashTable[$("#compare1").find(":selected").val()]);
    tempTraffic1 = Math.floor(tempTraffic1/10)*10;
  
    //appending traffic and busiest time to building one info
    
    $("#building1Info p:eq(0)").append(tempTraffic1);
    $("#building1Info p:eq(1)").append(findBusiestTime(buildingHashTable[$("#compare1").find(":selected").val()]));

     //getting current traffic of building 2
     var tempTraffic2 = buildingWeight.get(buildingHashTable[$("#compare2").find(":selected").val()]);
     tempTraffic2 = Math.floor(tempTraffic2/10)*10;
   
     //appending traffic and busiest time to building two info
     
     $("#building2Info p:eq(0)").append(tempTraffic2);
     $("#building2Info p:eq(1)").append(findBusiestTime(buildingHashTable[$("#compare2").find(":selected").val()]));

}

//TODO for Elvis: make a find busy and least busy time with a time range