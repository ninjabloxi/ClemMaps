"use strict";

/********************************/
/*********** VARIABLES **********/
/********************************/


let mapInitialized = false;

let currentZoom = 16;

let currentMapMode = "standard";

let autoFollowMap = true;

let navigationZoom = 18;

let routeLayer = null;



/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeMaps(){


    if(!map){

        return;

    }


    mapInitialized = true;


    console.log(

        "Carte chargée."

    );


}





/********************************/
/*********** INFORMATIONS *******/
/********************************/


function isMapInitialized(){


    return mapInitialized;


}




function getCurrentZoom(){


    return currentZoom;


}





/********************************/
/*********** ZOOM CARTE *********/
/********************************/


function zoomIn(){


    if(map){

        map.zoomIn();

    }


}




function zoomOut(){


    if(map){

        map.zoomOut();

    }


}





/********************************/
/*********** CENTRAGE GPS *******/
/********************************/


function centerOnUser(){


    if(

        !hasGPSPosition()

    ){

        return;

    }



    map.flyTo(

        [

            currentPosition.latitude,

            currentPosition.longitude

        ],

        navigationZoom

    );


}





/********************************/
/******** SUIVI NAVIGATION ******/
/********************************/


function updateMapPosition(){


    if(

        !navigationStarted ||

        !autoFollowMap ||

        !hasGPSPosition()

    ){

        return;

    }



    centerOnUser();


}

/********************************/
/********** TRACÉ BLEU **********/
/********************************/


function displayRouteLayer(

    layer

){


    clearRouteLayer();


    routeLayer = layer;


}




function clearRouteLayer(){


    if(

        routeLayer &&

        map

    ){

        map.removeLayer(

            routeLayer

        );


        routeLayer = null;

    }


}




function hasRouteLayer(){


    return (

        routeLayer !== null

    );


}





/********************************/
/*********** ZOOM AUTO **********/
/********************************/


function updateNavigationZoom(){


    if(

        !navigationStarted ||

        !map

    ){

        return;

    }



    map.setZoom(

        navigationZoom

    );


}





/********************************/
/*********** MODE CARTE *********/
/********************************/


function setMapMode(

    mode

){


    currentMapMode =

    mode;


    applyMapMode();


}





function getMapMode(){


    return currentMapMode;


}





/********************************/
/*********** COUCHES ************/
/********************************/


function refreshMapLayer(){


    if(

        !mapInitialized

    ){

        return;

    }



    applyMapMode();


}





/********************************/
/*********** ACTUALISATION ******/
/********************************/


function refreshMap(){


    if(

        !map

    ){

        return;

    }



    currentZoom =

    map.getZoom();



    updateNavigationZoom();


}





/********************************/
/*********** INFORMATIONS *******/
/********************************/


function getMapsInformations(){


    return{

        initialized:

        mapInitialized,



        zoom:

        currentZoom,



        mode:

        currentMapMode,



        navigation:

        navigationStarted,



        route:

        hasRouteLayer()


    };


}

/********************************/
/******** MODE PLEIN ÉCRAN ******/
/********************************/


function openMapFullscreen(){


    if(

        !document.fullscreenElement

    ){

        document.documentElement

        .requestFullscreen();

    }

    else{

        document.exitFullscreen();

    }


}





/********************************/
/*********** VITESSE ************/
/********************************/


function displayCurrentSpeed(){


    const container =

    document.querySelector(

        ".speedContainer"

    );


    if(

        !container

    ){

        return;

    }



    container.style.display =

    "block";



    container.innerHTML =

    currentSpeed +

    " km/h";


}





/********************************/
/******** LIMITATION VITESSE ****/
/********************************/


function displaySpeedLimit(

    limit = "--"

){


    const container =

    document.getElementById(

        "speedLimit"

    );


    if(

        !container

    ){

        return;

    }



    container.innerHTML =

    limit +

    " km/h";


}





/********************************/
/******** MODE NAVIGATION *******/
/********************************/


function enableNavigationMapMode(){


    navigationZoom = 18;


    autoFollowMap = true;


}





function disableNavigationMapMode(){


    navigationZoom = 16;


}





/********************************/
/*********** BOUSSOLE ***********/
/********************************/


let compassEnabled = true;



function enableCompass(){


    compassEnabled = true;


}




function disableCompass(){


    compassEnabled = false;


}





/********************************/
/*********** INFORMATIONS *******/
/********************************/


function isCompassEnabled(){


    return compassEnabled;


}

/********************************/
/*********** MODE CARTE *********/
/********************************/


function openStandardMode(){


    setMapMode(

        "standard"

    );


}




function openSatelliteMode(){


    setMapMode(

        "satellite"

    );


}




function openTerrainMode(){


    setMapMode(

        "terrain"

    );


}




function openNightMode(){


    setMapMode(

        "night"

    );


}





/********************************/
/*********** PARAMÈTRES *********/
/********************************/


function saveMapsSettings(){


    localStorage.setItem(

        "clemmapsMapsSettings",

        JSON.stringify(

            mapsSettings

        )

    );


}




function loadMapsSettings(){


    const data =

    localStorage.getItem(

        "clemmapsMapsSettings"

    );



    if(

        data

    ){

        mapsSettings =

        JSON.parse(

            data

        );

    }


}





/********************************/
/*********** POINTS D'INTÉRÊT ***/
/********************************/


function showPointsOfInterest(){


    mapsSettings.restaurants =

    true;



    mapsSettings.hotels =

    true;



    mapsSettings.parking =

    true;



    mapsSettings.gas =

    true;



    mapsSettings.electric =

    true;



    saveMapsSettings();


}




function hidePointsOfInterest(){


    mapsSettings.restaurants =

    false;



    mapsSettings.hotels =

    false;



    mapsSettings.parking =

    false;



    mapsSettings.gas =

    false;



    mapsSettings.electric =

    false;



    saveMapsSettings();


}





/********************************/
/*********** TRAFIC *************/
/********************************/


function enableTraffic(){


    mapsSettings.traffic =

    true;


    saveMapsSettings();


}




function disableTraffic(){


    mapsSettings.traffic =

    false;


    saveMapsSettings();


}

/********************************/
/******** SYNCHRONISATION *******/
/********************************/


function synchronizeMaps(){


    if(

        !mapInitialized

    ){

        return;

    }


    refreshMap();


    updateMapPosition();


    displayCurrentSpeed();


}





/********************************/
/******** REDIMENSIONNEMENT *****/
/********************************/


function resizeMap(){


    if(

        !map

    ){

        return;

    }


    setTimeout(

        ()=>{


            map.invalidateSize();


        },

        300

    );


}





/********************************/
/******** ACTUALISATION *********/
/********************************/


function refreshMapsModule(){


    if(

        !mapInitialized

    ){

        return;

    }


    synchronizeMaps();


}





/********************************/
/******** OPTIMISATION GPS ******/
/********************************/


function optimizeMap(){


    if(

        !navigationStarted

    ){

        return;

    }


    if(

        currentSpeed >= 110

    ){

        navigationZoom = 16;

    }


    else if(

        currentSpeed >= 70

    ){

        navigationZoom = 17;

    }


    else{

        navigationZoom = 18;

    }


}





/********************************/
/*********** GPS LIVE ***********/
/********************************/


setInterval(

    ()=>{


        if(

            mapInitialized

        ){

            optimizeMap();


            refreshMapsModule();


        }


    },

    3000

);





/********************************/
/*********** ÉVÈNEMENTS *********/
/********************************/


window.addEventListener(

    "resize",

    ()=>{


        resizeMap();


    }


);

/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeMapsModule(){


    initializeMaps();


    loadMapsSettings();


    resizeMap();



    console.log(

        "Module carte prêt."

    );


}





/********************************/
/*********** DIAGNOSTICS ********/
/********************************/


function getMapsDiagnostics(){


    return{

        initialized:

        mapInitialized,



        zoom:

        currentZoom,



        mode:

        currentMapMode,



        autoFollow:

        autoFollowMap,



        navigationZoom:

        navigationZoom


    };


}





/********************************/
/*********** EXPORTS ************/
/********************************/


window.ClemMapsMaps = {


    center:centerOnUser,



    refresh:refreshMap,



    resize:resizeMap,



    diagnostics:

    getMapsDiagnostics,



    zoomIn,



    zoomOut


};





/********************************/
/******** AUTO CHARGEMENT *******/
/********************************/


window.addEventListener(

    "load",

    ()=>{


        initializeMapsModule();


    }


);





/********************************/
/************* FIN **************/
/********************************/


console.log(

    "--------------------------------"

);


console.log(

    "ClemMaps Maps"

);


console.log(

    "Version 1.0"

);


console.log(

    "Carte prête."

);


console.log(

    "--------------------------------"

);
