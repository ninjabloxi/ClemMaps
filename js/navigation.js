"use strict";


/********************************/
/*********** VARIABLES **********/
/********************************/


let navigationStarted = false;

let navigationDistance = 0;

let navigationDuration = 0;

let navigationRemainingDistance = 0;

let navigationRemainingTime = 0;

let navigationArrivalTime = "--";

let navigationRefreshTime = 3000;



/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeNavigation(){


    console.log(

        "Navigation chargée."

    );


}





/********************************/
/******** ÉTAT NAVIGATION *******/
/********************************/


function isNavigationStarted(){


    return navigationStarted;


}





/********************************/
/******** DÉMARRER GPS **********/
/********************************/


async function startNavigation(){


    if(

        !destinationMarker

    ){

        showNotification(

            "Aucune destination."

        );

        return;

    }



    if(

        !hasGPSPosition()

    ){

        showNotification(

            "GPS indisponible."

        );

        return;

    }



    navigationStarted = true;



    enableNavigationMapMode();



    showNavigationInformations();



    await calculateRoute();



    showNotification(

        "Navigation démarrée."

    );


}





/********************************/
/******** ARRÊTER GPS ***********/
/********************************/


function stopNavigation(){


    navigationStarted = false;



    disableNavigationMapMode();



    hideNavigationInformations();



    clearCurrentRoute();



    showNotification(

        "Navigation arrêtée."

    );


}





/********************************/
/******** DESTINATION ***********/
/********************************/


function destinationReached(){


    showNotification(

        "Vous êtes arrivé."

    );



    speakNavigation(

        "Vous êtes arrivé à destination."

    );



    stopNavigation();


}

/********************************/
/******** CALCUL TRAJET *********/
/********************************/


async function calculateRoute(){


    if(

        !destinationMarker

    ){

        return;

    }



    try{


        const destination =

        destinationMarker.getLatLng();



        const url =

        "https://router.project-osrm.org/route/v1/driving/"

        +

        currentPosition.longitude +

        "," +

        currentPosition.latitude +

        ";" +

        destination.lng +

        "," +

        destination.lat +

        "?overview=full&geometries=geojson";



        const response =

        await fetch(

            url

        );



        const data =

        await response.json();



        if(

            !data.routes ||

            !data.routes.length

        ){

            showNotification(

                "Itinéraire introuvable."

            );

            return;

        }



        const route =

        data.routes[0];



        navigationDistance =

        Math.round(

            route.distance / 1000

        );



        navigationDuration =

        Math.round(

            route.duration / 60

        );



        navigationRemainingDistance =

        navigationDistance;



        navigationRemainingTime =

        navigationDuration;



        calculateArrivalTime();



        displayRoute(

            route.geometry

        );



        updateNavigationInformations();


    }


    catch(error){


        console.error(

            error

        );



        showNotification(

            "Erreur GPS."

        );


    }


}





/********************************/
/********** TRACÉ BLEU **********/
/********************************/


let currentRoute = null;



function displayRoute(

    geometry

){


    if(

        !map ||

        !geometry

    ){

        return;

    }



    clearCurrentRoute();



    currentRoute =

    L.geoJSON(

        geometry,

        {

            style:{

                weight:6,

                opacity:1

            }

        }

    )

    .addTo(

        map

    );



    map.fitBounds(

        currentRoute.getBounds()

    );


}





/********************************/
/******** SUPPRIMER TRAJET ******/
/********************************/


function clearCurrentRoute(){


    if(

        currentRoute

    ){


        map.removeLayer(

            currentRoute

        );



        currentRoute =

        null;


    }


}

/********************************/
/******** DISTANCE RESTANTE *****/
/********************************/


function updateRemainingDistance(){


    if(

        !destinationMarker

    ){

        return;

    }



    const destination =

    destinationMarker.getLatLng();



    navigationRemainingDistance =

    Math.round(

        calculateDistance(

            currentPosition.latitude,

            currentPosition.longitude,

            destination.lat,

            destination.lng

        )

    );



    if(

        navigationRemainingDistance <= 1

    ){

        navigationRemainingDistance =

        0;


        destinationReached();


    }


}





/********************************/
/******** TEMPS RESTANT *********/
/********************************/


function updateRemainingTime(){


    navigationRemainingTime =

    Math.max(

        0,

        Math.round(

            (

                navigationRemainingDistance

                / 80

            ) * 60

        )

    );


}





/********************************/
/******** HEURE D'ARRIVÉE *******/
/********************************/


function calculateArrivalTime(){


    const date =

    new Date();



    date.setMinutes(

        date.getMinutes()

        +

        navigationRemainingTime

    );



    navigationArrivalTime =

    date.toLocaleTimeString(

        "fr-FR",

        {

            hour:"2-digit",

            minute:"2-digit"

        }

    );


}





/********************************/
/******** MISE À JOUR GPS *******/
/********************************/


function updateNavigationInformations(){


    updateRemainingDistance();


    updateRemainingTime();


    calculateArrivalTime();



    const distance =

    document.getElementById(

        "remainingDistance"

    );



    const duration =

    document.getElementById(

        "remainingTime"

    );



    const arrival =

    document.getElementById(

        "arrivalTime"

    );



    if(

        distance

    ){

        distance.innerHTML =

        navigationRemainingDistance +

        " km";

    }



    if(

        duration

    ){

        duration.innerHTML =

        navigationRemainingTime +

        " min";

    }



    if(

        arrival

    ){

        arrival.innerHTML =

        navigationArrivalTime;

    }


}

/********************************/
/******** GUIDAGE VOCAL *********/
/********************************/


function speakNavigation(

    message

){

    if(

        !("speechSynthesis" in window)

    ){

        return;

    }


    const speech =

    new SpeechSynthesisUtterance(

        message

    );


    speech.lang =

    "fr-FR";


    speech.rate =

    1;


    window.speechSynthesis.speak(

        speech

    );

}





/********************************/
/******** RECALCUL AUTO *********/
/********************************/


async function recalculateRoute(){


    if(

        !navigationStarted

    ){

        return;

    }


    showNotification(

        "Recalcul de l'itinéraire..."

    );


    await calculateRoute();


}





/********************************/
/******** SORTIE DE ROUTE *******/
/********************************/


function checkRouteDeviation(){


    if(

        !navigationStarted ||

        !destinationMarker

    ){

        return;

    }


    const destination =

    destinationMarker.getLatLng();



    const distance =

    calculateDistance(

        currentPosition.latitude,

        currentPosition.longitude,

        destination.lat,

        destination.lng

    );



    if(

        distance >

        navigationDistance + 5

    ){

        recalculateRoute();

    }


}





/********************************/
/*********** SUIVI GPS **********/
/********************************/


function followNavigation(){


    if(

        !navigationStarted ||

        !autoFollowMap ||

        !map

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
/******** ACTUALISATION GPS *****/
/********************************/


function updateNavigation(){


    if(

        !navigationStarted

    ){

        return;

    }


    updateNavigationInformations();


    followNavigation();


    checkRouteDeviation();


}

/********************************/
/******** AFFICHAGE GPS *********/
/********************************/


function showNavigationInformations(){


    const container =

    document.getElementById(

        "navigationInformations"

    );


    if(

        !container

    ){

        return;

    }


    container.style.display =

    "flex";


    updateNavigationInformations();


}





/********************************/
/******** MASQUER GPS ***********/
/********************************/


function hideNavigationInformations(){


    const container =

    document.getElementById(

        "navigationInformations"

    );


    if(

        container

    ){

        container.style.display =

        "none";

    }


}





/********************************/
/******** BOUTON DÉMARRER *******/
/********************************/


function hideStartButton(){


    const button =

    document.getElementById(

        "startNavigation"

    );


    if(

        button

    ){

        button.style.display =

        "none";

    }


}




function showStartButton(){


    const button =

    document.getElementById(

        "startNavigation"

    );


    if(

        button

    ){

        button.style.display =

        "block";

    }


}





/********************************/
/******** INTERFACE GPS *********/
/********************************/


function updateNavigationInterface(){


    if(

        navigationStarted

    ){

        hideStartButton();

    }

    else{

        showStartButton();

    }


}





/********************************/
/*********** INFORMATIONS *******/
/********************************/


function getNavigationInformations(){


    return{

        distance:

        navigationRemainingDistance,



        duration:

        navigationRemainingTime,



        arrival:

        navigationArrivalTime,



        started:

        navigationStarted


    };


}





/********************************/
/******** SYNCHRONISATION *******/
/********************************/


function synchronizeNavigation(){


    if(

        !navigationStarted

    ){

        return;

    }


    updateNavigationInformations();


    updateNavigationInterface();


}

/********************************/
/******** ARRIVÉE GPS ***********/
/********************************/


function checkDestinationReached(){


    if(

        !navigationStarted

    ){

        return;

    }


    if(

        navigationRemainingDistance <= 0

    ){

        destinationReached();

    }


}





/********************************/
/******** SURVEILLANCE GPS ******/
/********************************/


function checkNavigationStatus(){


    if(

        !navigationStarted

    ){

        return;

    }


    if(

        !hasGPSPosition()

    ){

        showNotification(

            "Signal GPS perdu."

        );

        return;

    }


    checkDestinationReached();


}





/********************************/
/*********** ACTUALISATION ******/
/********************************/


function refreshNavigation(){


    if(

        !navigationStarted

    ){

        return;

    }


    updateNavigation();


    synchronizeNavigation();


    checkNavigationStatus();


}





/********************************/
/******** PERFORMANCE GPS *******/
/********************************/


function optimizeNavigation(){


    if(

        !navigationStarted

    ){

        return;

    }


    if(

        navigationRemainingDistance <= 5

    ){

        navigationRefreshTime =

        2000;

    }

    else{

        navigationRefreshTime =

        3000;

    }


}





/********************************/
/*********** INFORMATIONS *******/
/********************************/


function getNavigationStatus(){


    return{

        started:

        navigationStarted,



        distance:

        navigationRemainingDistance,



        duration:

        navigationRemainingTime,



        arrival:

        navigationArrivalTime


    };


}





/********************************/
/************ GPS LIVE **********/
/********************************/


setInterval(

    ()=>{


        if(

            navigationStarted

        ){


            refreshNavigation();


            optimizeNavigation();


        }


    },

    navigationRefreshTime

);

/********************************/
/******** NOTIFICATIONS GPS *****/
/********************************/


function notifyNavigation(

    message

){

    showNotification(

        message

    );

}


function notifyArrival(){


    notifyNavigation(

        "Vous êtes arrivé à destination."

    );


    speakNavigation(

        "Vous êtes arrivé à destination."

    );

}




function notifyRecalculation(){


    notifyNavigation(

        "Recalcul de l'itinéraire."

    );


    speakNavigation(

        "Recalcul de l'itinéraire."

    );

}





/********************************/
/******** GUIDAGE VOCAL *********/
/********************************/


function announceDistance(){


    if(

        navigationRemainingDistance <= 1

    ){

        speakNavigation(

            "Vous arrivez à destination."

        );

    }


    else if(

        navigationRemainingDistance <= 5

    ){

        speakNavigation(

            "Il vous reste "

            +

            navigationRemainingDistance

            +

            " kilomètres."

        );

    }


}





/********************************/
/*********** EXPORTS ************/
/********************************/


window.ClemMapsNavigation = {


    startNavigation,

    stopNavigation,

    calculateRoute,

    recalculateRoute,

    refreshNavigation,

    getNavigationStatus,

    getNavigationInformations,

    isNavigationStarted


};





/********************************/
/******** SYNCHRONISATION *******/
/********************************/


function synchronizeNavigationModule(){


    updateNavigationInterface();


    updateNavigationInformations();


}





/********************************/
/*********** GPS LIVE ***********/
/********************************/


setInterval(

    ()=>{


        if(

            navigationStarted

        ){


            announceDistance();


            synchronizeNavigationModule();


        }


    },

    30000

);

/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeNavigationModule(){


    initializeNavigation();


    updateNavigationInterface();


    console.log(

        "Module navigation prêt."

    );


}





/********************************/
/*********** DIAGNOSTICS ********/
/********************************/


function getNavigationDiagnostics(){


    return{

        started:

        navigationStarted,



        distance:

        navigationDistance,



        remainingDistance:

        navigationRemainingDistance,



        remainingTime:

        navigationRemainingTime,



        arrival:

        navigationArrivalTime


    };


}





/********************************/
/*********** EXPORTS ************/
/********************************/


window.Navigation = {


    start:startNavigation,



    stop:stopNavigation,



    refresh:refreshNavigation,



    route:calculateRoute,



    diagnostics:

    getNavigationDiagnostics


};





/********************************/
/******** ACTUALISATION GPS *****/
/********************************/


window.addEventListener(

    "load",

    ()=>{


        initializeNavigationModule();


    }


);





/********************************/
/*********** GPS LIVE ***********/
/********************************/


setInterval(

    ()=>{


        if(

            !navigationStarted

        ){

            return;

        }



        refreshNavigation();


    },


    3000


);





/********************************/
/************* FIN **************/
/********************************/


console.log(

    "--------------------------------"

);


console.log(

    "ClemMaps Navigation"

);


console.log(

    "Version 1.0"

);


console.log(

    "Navigation prête."

);


console.log(

    "--------------------------------"

);
