/********************************/
/************* CARTE ************/
/********************************/

let currentMapMode =

"standard";


let currentZoom = 16;


let mapInitialized = false;



/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeMaps(){


    if(!map){

        return;

    }


    mapInitialized = true;


    applyMapMode();


    console.log(

        "Module carte chargé."

    );


}





/********************************/
/*********** MODE CARTE *********/
/********************************/


function setMapMode(mode){


    currentMapMode =

    mode;


    mapsSettings.mapMode =

    mode;



    localStorage.setItem(

        "clemmapsMapsSettings",

        JSON.stringify(

            mapsSettings

        )

    );



    applyMapMode();



    showNotification(

        "Mode " +

        mode +

        " activé."

    );


}





/********************************/
/*********** ZOOM CARTE *********/
/********************************/


function zoomIn(){


    if(!map){

        return;

    }


    map.zoomIn();


}





function zoomOut(){


    if(!map){

        return;

    }


    map.zoomOut();


}





/********************************/
/******** POSITION UTILISATEUR **/
/********************************/


function centerOnUser(){


    if(!userMarker){


        showNotification(

            "Position inconnue."

        );


        return;

    }



    map.flyTo(

        [

            currentPosition.latitude,

            currentPosition.longitude

        ],

        18

    );


}

/********************************/
/******** MODES DE CARTE ********/
/********************************/


function openSatelliteMode(){


    setMapMode(

        "satellite"

    );


}




function openStandardMode(){


    setMapMode(

        "standard"

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




function openTransportMode(){


    setMapMode(

        "transport"

    );


}





/********************************/
/******** CHANGEMENT COUCHE *****/
/********************************/


function changeMapLayer(){


    if(

        !mapInitialized

    ){

        return;

    }



    applyMapMode();


}





/********************************/
/******** ACTUALISATION *********/
/********************************/


function refreshMap(){


    if(

        !map

    ){

        return;

    }



    currentZoom =

    map.getZoom();



}

/********************************/
/******** MODE PLEIN ÉCRAN ******/
/********************************/


function openMapFullscreen(){


    if(!document.fullscreenElement){


        document.documentElement

        .requestFullscreen();


    }

    else{


        document.exitFullscreen();


    }


}





/********************************/
/******** AFFICHAGE POI *********/
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



    showNotification(

        "Trafic activé."

    );


}





function disableTraffic(){


    mapsSettings.traffic =

    false;



    saveMapsSettings();



    showNotification(

        "Trafic désactivé."

    );


}





/********************************/
/*********** BÂTIMENTS **********/
/********************************/


function enableBuildings(){


    mapsSettings.buildings =

    true;



    saveMapsSettings();


}





function disableBuildings(){


    mapsSettings.buildings =

    false;



    saveMapsSettings();


}





/********************************/
/******** SAUVEGARDE ************/
/********************************/


function saveMapsSettings(){


    localStorage.setItem(

        "clemmapsMapsSettings",

        JSON.stringify(

            mapsSettings

        )

    );


}

/********************************/
/******** ORIENTATION GPS *******/
/********************************/


let autoFollowMap = true;

let lockMapZoom = false;

let navigationZoom = 18;



function enableAutoFollow(){


    autoFollowMap = true;



    showNotification(

        "Suivi automatique activé."

    );


}




function disableAutoFollow(){


    autoFollowMap = false;



    showNotification(

        "Suivi automatique désactivé."

    );


}





/********************************/
/******** VERROUILLAGE ZOOM *****/
/********************************/


function enableZoomLock(){


    lockMapZoom = true;



    showNotification(

        "Zoom verrouillé."

    );


}




function disableZoomLock(){


    lockMapZoom = false;



    showNotification(

        "Zoom déverrouillé."

    );


}





/********************************/
/******** RECENTRAGE GPS ********/
/********************************/


function updateMapPosition(){


    if(

        !autoFollowMap ||

        !map ||

        !navigationStarted

    ){

        return;

    }



    map.flyTo(

        [

            currentPosition.latitude,

            currentPosition.longitude

        ],

        navigationZoom,

        {

            duration:1

        }

    );


}





/********************************/
/*********** ZOOM AUTO **********/
/********************************/


function updateNavigationZoom(){


    if(

        !map ||

        !lockMapZoom

    ){

        return;

    }



    map.setZoom(

        navigationZoom

    );


}





/********************************/
/******** ACTUALISATION CARTE ***/
/********************************/


function refreshMapInformations(){


    if(!map){

        return;

    }



    updateMapPosition();


    updateNavigationZoom();


    refreshMap();


}

/********************************/
/*********** BOUSSOLE ***********/
/********************************/


let compassEnabled = true;



function enableCompass(){


    compassEnabled = true;



    showNotification(

        "Boussole activée."

    );


}




function disableCompass(){


    compassEnabled = false;



    showNotification(

        "Boussole désactivée."

    );


}





/********************************/
/******** VITESSE ACTUELLE ******/
/********************************/


function displayCurrentSpeed(){


    let container =

    document.querySelector(

        ".speedContainer"

    );



    if(!container){

        return;

    }



    container.style.display =

    "block";



    let title =

    container.querySelector(

        "h2"

    );



    if(title){


        title.innerHTML =

        currentSpeed +

        " km/h";


    }


}





/********************************/
/******** LIMITATIONS ***********/
/********************************/


function displaySpeedLimit(


    limit = "--"


){



    let container =

    document.getElementById(

        "speedLimit"

    );



    if(!container){

        return;

    }



    container.innerHTML =

    limit +

    " km/h";


}





/********************************/
/*********** MODE GPS ***********/
/********************************/


function enableNavigationMapMode(){


    navigationZoom = 18;


    autoFollowMap = true;


    lockMapZoom = true;


}





function disableNavigationMapMode(){


    navigationZoom = 16;


    lockMapZoom = false;


}





/********************************/
/*********** MODE 3D ************/
/********************************/


function enable3DMode(){


    showNotification(

        "Mode 3D bientôt disponible."

    );


}




function disable3DMode(){


    showNotification(

        "Retour au mode classique."

    );


}

/********************************/
/******** SYNCHRONISATION *******/
/********************************/


function synchronizeMaps(){


    if(!map){

        return;

    }


    refreshMapInformations();


    displayCurrentSpeed();


}





/********************************/
/*********** REDIMENSION ********/
/********************************/


function resizeMap(){


    if(!map){

        return;

    }


    setTimeout(

        function(){


            map.invalidateSize();


        },

        300

    );


}





/********************************/
/*********** ACTUALISATION ******/
/********************************/


setInterval(

    function(){


        if(

            mapInitialized

        ){


            synchronizeMaps();


        }


    },

    2000

);





/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeMapsModule(){


    initializeMaps();


    resizeMap();



    console.log(

        "Module carte prêt."

    );


}





/********************************/
/******** AUTO CHARGEMENT *******/
/********************************/


window.addEventListener(

    "load",

    function(){


        initializeMapsModule();


    }

);



window.addEventListener(

    "resize",

    function(){


        resizeMap();


    }

);





/********************************/
/******** FIN MAPS.JS ***********/
/********************************/

/*

Fonctionnalités :

- Carte Leaflet ;
- Mode standard ;
- Mode satellite ;
- Mode terrain ;
- Mode nuit ;
- Mode transport ;
- Plein écran ;
- Zoom intelligent ;
- Suivi GPS automatique ;
- Verrouillage du zoom ;
- Affichage de la vitesse ;
- Boussole ;
- Affichage des POI ;
- Gestion du trafic ;
- Gestion des bâtiments ;
- Synchronisation GPS ;
- Compatible :
    - iPad ;
    - iPhone ;
    - Android ;
    - PC ;
    - Vercel.

Architecture :

index.html
      ↓
 js/script.js
      ↓
   maps.js
      ↓
    gps.js
      ↓
navigation.js
      ↓
 search.js
      ↓
   Leaflet
      ↓
OpenStreetMap

*/