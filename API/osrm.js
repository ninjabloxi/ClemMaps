/********************************/
/*********** CLEMMAPS ***********/
/************* OSRM *************/
/********************************/


"use strict";




/********************************/
/*********** VERSION ************/
/********************************/


const OSRM_VERSION =

"2.0";



const OSRM_NAME =

"ClemMaps Navigation";




/********************************/
/************* API **************/
/********************************/


const OSRM_URL =

"https://router.project-osrm.org";



const OSRM_PROFILE =

"driving";



const OSRM_TIMEOUT =

30000;





/********************************/
/*********** ITINÉRAIRE *********/
/********************************/


let currentRoute =

null;



let currentRouteData =

null;



let currentInstructions =

[];



let currentStep =

0;



let currentDistance =

0;



let currentDuration =

0;





/********************************/
/************* GPS **************/
/********************************/


let navigationStarted =

false;



let destinationLatitude =

null;



let destinationLongitude =

null;



let destinationName =

null;



let followingUser =

true;





/********************************/
/*********** LEAFLET ************/
/********************************/


let routeLayer =

null;



let userMarker =

null;



let destinationMarker =

null;



let navigationCircle =

null;





/********************************/
/*********** STATISTIQUES *******/
/********************************/


let totalRoutesCalculated =

0;



let totalRoutesFailed =

0;



let totalRecalculations =

0;



let totalGPSUpdates =

0;





/********************************/
/*********** NAVIGATION *********/
/********************************/


let navigationVoice =

true;



let navigationZoom =

18;



let navigationVolume =

100;



let navigationMode =

"car";





/********************************/
/************ ALERTES ***********/
/********************************/


let routeDeviation =

false;



let automaticRecalculation =

true;



let arrivalDistance =

25;



let recalculationDistance =

75;





/********************************/
/*********** PARAMÈTRES *********/
/********************************/


function setDestination(


latitude,

longitude,

name = "Destination"


){


    destinationLatitude =

    latitude;



    destinationLongitude =

    longitude;



    destinationName =

    name;


}




function getDestination(){


    return{


        latitude:

        destinationLatitude,



        longitude:

        destinationLongitude,



        name:

        destinationName


    };


}




function clearDestination(){


    destinationLatitude =

    null;



    destinationLongitude =

    null;



    destinationName =

    null;


}





/********************************/
/*********** NAVIGATION *********/
/********************************/


function startNavigationMode(){


    navigationStarted =

    true;


}




function stopNavigationMode(){


    navigationStarted =

    false;


}




function isNavigationStarted(){


    return navigationStarted;


}





/********************************/
/************ OPTIONS ***********/
/********************************/


function enableVoiceGuidance(){


    navigationVoice =

    true;


}




function disableVoiceGuidance(){


    navigationVoice =

    false;


}




function isVoiceEnabled(){


    return navigationVoice;


}




function setNavigationZoom(


zoom


){


    navigationZoom =

    zoom;


}




function getNavigationZoom(){


    return navigationZoom;


}





/********************************/
/************* GPS **************/
/********************************/


function followUser(){


    followingUser =

    true;


}




function stopFollowingUser(){


    followingUser =

    false;


}




function isFollowingUser(){


    return followingUser;


}





/********************************/
/*********** INITIALISATION *****/
/********************************/


function initializeOSRM(){


    console.log(

        "OSRM chargé."

    );



    return true;


}




function getOSRMVersion(){


    return OSRM_VERSION;


}




function getNavigationStatus(){


    return{


        started:

        navigationStarted,



        destination:

        destinationName,



        voice:

        navigationVoice,



        zoom:

        navigationZoom,



        distance:

        currentDistance,



        duration:

        currentDuration,



        recalculation:

        automaticRecalculation


    };


}

/********************************/
/*********** CONNEXION **********/
/********************************/


async function connectOSRM(){


    try{


        const response =

        await fetch(

            `${OSRM_URL}/route/v1/${OSRM_PROFILE}/2.3522,48.8566;2.2950,48.8738?overview=false`

        );



        return response.ok;


    }


    catch(error){


        console.error(

            "Connexion OSRM impossible.",

            error

        );



        return false;


    }


}





/********************************/
/*********** REQUÊTE ************/
/********************************/


function createRouteURL(

startLatitude,
startLongitude,

endLatitude,
endLongitude

){


    return (

        `${OSRM_URL}/route/v1/${OSRM_PROFILE}/` +

        `${startLongitude},${startLatitude};` +

        `${endLongitude},${endLatitude}` +

        `?overview=full` +

        `&geometries=geojson` +

        `&steps=true` +

        `&annotations=true`

    );


}





/********************************/
/******** CALCUL ITINÉRAIRE *****/
/********************************/


async function calculateRoute(

startLatitude,
startLongitude,

endLatitude,
endLongitude

){


    try{


        const url =

        createRouteURL(

            startLatitude,
            startLongitude,

            endLatitude,
            endLongitude

        );



        const controller =

        new AbortController();



        const timeout =

        setTimeout(

            ()=>{


                controller.abort();


            },

            OSRM_TIMEOUT

        );



        const response =

        await fetch(

            url,

            {

                signal:

                controller.signal

            }

        );



        clearTimeout(

            timeout

        );



        if(

            !response.ok

        ){

            throw new Error(

                "Itinéraire indisponible."

            );

        }



        const data =

        await response.json();



        if(

            !data.routes ||

            !data.routes.length

        ){

            throw new Error(

                "Aucun itinéraire trouvé."

            );

        }



        currentRouteData =

        data.routes[0];



        totalRoutesCalculated++;



        extractRouteInformation();



        return currentRouteData;


    }


    catch(error){


        totalRoutesFailed++;



        console.error(

            error

        );



        return null;


    }


}





/********************************/
/*********** DISTANCE ***********/
/********************************/


function extractRouteInformation(){


    if(

        !currentRouteData

    ){

        return;

    }



    currentDistance =

    currentRouteData.distance;



    currentDuration =

    currentRouteData.duration;



    extractInstructions();


}





/********************************/
/*********** INSTRUCTIONS *******/
/********************************/


function extractInstructions(){


    currentInstructions =

    [];



    if(

        !currentRouteData

    ){

        return;

    }



    currentRouteData

    .legs

    .forEach(


        leg=>{


            leg.steps

            .forEach(


                step=>{


                    currentInstructions.push(

                        step

                    );


                }


            );


        }


    );


}





/********************************/
/*********** INFORMATIONS *******/
/********************************/


function getCurrentDistance(){


    return currentDistance;


}




function getCurrentDuration(){


    return currentDuration;


}




function getCurrentInstructions(){


    return currentInstructions;


}




function getCurrentRoute(){


    return currentRouteData;


}





/********************************/
/******** FORMAT DISTANCE *******/
/********************************/


function formatRouteDistance(

distance

){


    if(

        distance >= 1000

    ){

        return (

            distance/1000

        )

        .toFixed(1)

        +

        " km";

    }



    return (


        Math.round(

            distance

        )

        +

        " m"

    );


}





/********************************/
/********** FORMAT TEMPS ********/
/********************************/


function formatRouteDuration(

duration

){


    const hours =

    Math.floor(

        duration/3600

    );



    const minutes =

    Math.floor(

        (

            duration % 3600

        )/60

    );



    if(

        hours > 0

    ){

        return (

            hours +

            " h " +

            minutes +

            " min"

        );

    }



    return (


        minutes +

        " min"


    );


}





/********************************/
/*********** STATISTIQUES *******/
/********************************/


function getRoutesCalculated(){


    return totalRoutesCalculated;


}




function getRoutesFailed(){


    return totalRoutesFailed;


}

/********************************/
/*********** ITINÉRAIRE *********/
/********************************/


function clearCurrentRoute(){


    if(

        routeLayer &&

        currentMap

    ){

        currentMap.removeLayer(

            routeLayer

        );

    }



    routeLayer =

    null;


}





/********************************/
/*********** MARQUEURS **********/
/********************************/


function clearRouteMarkers(){


    if(

        userMarker &&

        currentMap

    ){

        currentMap.removeLayer(

            userMarker

        );

    }



    if(

        destinationMarker &&

        currentMap

    ){

        currentMap.removeLayer(

            destinationMarker

        );

    }



    userMarker =

    null;



    destinationMarker =

    null;


}





/********************************/
/*********** TRACÉ BLEU *********/
/********************************/


function displayRoute(){


    if(

        !currentRouteData ||

        !currentMap

    ){

        return false;

    }



    clearCurrentRoute();



    const coordinates =

    currentRouteData

    .geometry

    .coordinates;



    const routePoints =

    coordinates.map(


        point=>{


            return[

                point[1],

                point[0]

            ];


        }


    );



    routeLayer =


    L.polyline(

        routePoints,

        {


            weight:8,

            opacity:0.9,

            color:"#007AFF",

            lineJoin:"round",

            lineCap:"round"


        }

    )

    .addTo(

        currentMap

    );



    centerOnRoute();



    return true;


}





/********************************/
/*********** ZOOM AUTO **********/
/********************************/


function centerOnRoute(){


    if(

        !routeLayer ||

        !currentMap

    ){

        return;

    }



    currentMap.fitBounds(


        routeLayer.getBounds(),

        {


            padding:[

                60,

                60

            ]

        }


    );


}





/********************************/
/*********** DÉPART *************/
/********************************/


function displayUserMarker(

latitude,
longitude

){


    if(

        !currentMap

    ){

        return;

    }



    if(

        userMarker

    ){

        currentMap.removeLayer(

            userMarker

        );

    }



    userMarker =


    L.marker(

        [

            latitude,

            longitude

        ]

    )

    .addTo(

        currentMap

    )

    .bindPopup(

        "Votre position"

    );


}





/********************************/
/*********** ARRIVÉE ************/
/********************************/


function displayDestinationMarker(){


    if(

        !currentMap ||

        !destinationLatitude ||

        !destinationLongitude

    ){

        return;

    }



    if(

        destinationMarker

    ){

        currentMap.removeLayer(

            destinationMarker

        );

    }



    destinationMarker =


    L.marker(

        [

            destinationLatitude,

            destinationLongitude

        ]

    )

    .addTo(

        currentMap

    )

    .bindPopup(

        destinationName ||

        "Destination"

    );


}





/********************************/
/*********** NAVIGATION *********/
/********************************/


function displayNavigation(){


    displayRoute();



    displayDestinationMarker();



    if(

        hasGPSPosition()

    ){

        displayUserMarker(

            currentLatitude,

            currentLongitude

        );

    }


}





/********************************/
/************ GPS ***************/
/********************************/


function updateUserPosition(

latitude,

longitude

){


    totalGPSUpdates++;



    if(

        !navigationStarted

    ){

        return;

    }



    displayUserMarker(

        latitude,

        longitude

    );



    if(

        followingUser &&

        currentMap

    ){


        currentMap.setView(

            [

                latitude,

                longitude

            ],

            navigationZoom

        );


    }


}





/********************************/
/*********** CERCLE GPS *********/
/********************************/


function displayNavigationAccuracy(

latitude,

longitude,

accuracy

){


    if(

        !currentMap

    ){

        return;

    }



    if(

        navigationCircle

    ){

        currentMap.removeLayer(

            navigationCircle

        );

    }



    navigationCircle =


    L.circle(

        [

            latitude,

            longitude

        ],

        {


            radius:

            accuracy,



            fillOpacity:

            0.1,


            weight:1


        }

    )

    .addTo(

        currentMap

    );


}





/********************************/
/*********** SUPPRESSION ********/
/********************************/


function clearNavigation(){


    clearCurrentRoute();


    clearRouteMarkers();



    if(

        navigationCircle &&

        currentMap

    ){

        currentMap.removeLayer(

            navigationCircle

        );

    }



    navigationCircle =

    null;


}





/********************************/
/*********** INFORMATIONS *******/
/********************************/


function getNavigationLayer(){


    return routeLayer;


}




function getNavigationMarker(){


    return destinationMarker;


}




function getGPSUpdates(){


    return totalGPSUpdates;


}

/********************************/
/******** GUIDAGE GPS ***********/
/********************************/


function getCurrentStep(){


    return currentStep;


}




function getNextInstruction(){


    if(

        !currentInstructions.length ||

        currentStep >=

        currentInstructions.length

    ){

        return null;

    }



    return currentInstructions[

        currentStep

    ];


}





/********************************/
/******** PROCHAINE MANŒUVRE ****/
/********************************/


function getNextManeuver(){


    const instruction =

    getNextInstruction();



    if(

        !instruction

    ){

        return null;

    }



    return instruction

    .maneuver ||

    null;


}





/********************************/
/******** DISTANCE RESTANTE *****/
/********************************/


function getRemainingDistance(){


    if(

        !currentInstructions.length

    ){

        return 0;

    }



    let distance = 0;



    for(

        let i = currentStep;

        i < currentInstructions.length;

        i++

    ){


        distance +=

        currentInstructions[i]

        .distance;


    }



    return distance;


}





/********************************/
/********** TEMPS RESTANT *******/
/********************************/


function getRemainingDuration(){


    if(

        !currentInstructions.length

    ){

        return 0;

    }



    let duration = 0;



    for(

        let i = currentStep;

        i < currentInstructions.length;

        i++

    ){


        duration +=

        currentInstructions[i]

        .duration;


    }



    return duration;


}





/********************************/
/************ ARRIVÉE ***********/
/********************************/


function hasArrived(){


    if(

        !hasGPSPosition()

    ){

        return false;

    }



    if(

        !destinationLatitude ||

        !destinationLongitude

    ){

        return false;

    }



    const distance =


    calculateDistance(

        currentLatitude,

        currentLongitude,

        destinationLatitude,

        destinationLongitude

    );



    return (

        distance <=

        arrivalDistance

    );


}





/********************************/
/************* GPS **************/
/********************************/


function checkArrival(){


    if(

        !hasArrived()

    ){

        return false;

    }



    stopNavigationMode();



    speakInstruction(

        "Vous êtes arrivé à destination."

    );



    return true;


}





/********************************/
/******** GUIDAGE VOCAL *********/
/********************************/


function speakInstruction(

text

){


    if(

        !navigationVoice

    ){

        return;

    }



    if(

        !window.speechSynthesis

    ){

        return;

    }



    const speech =


    new SpeechSynthesisUtterance(

        text

    );



    speech.lang =

    "fr-FR";



    speech.volume =

    navigationVolume/100;



    window

    .speechSynthesis

    .speak(

        speech

    );


}





/********************************/
/******** INSTRUCTION GPS *******/
/********************************/


function readCurrentInstruction(){


    const instruction =


    getNextInstruction();



    if(

        !instruction

    ){

        return;

    }



    if(

        instruction.name

    ){


        speakInstruction(

            "Continuez sur " +

            instruction.name

        );


    }


}





/********************************/
/*********** GPS LIVE ***********/
/********************************/


function updateNavigationStep(){


    if(

        currentStep >=

        currentInstructions.length

    ){

        return;

    }



    currentStep++;


}





/********************************/
/*********** RECALCUL ***********/
/********************************/


async function recalculateRoute(){


    if(

        !automaticRecalculation

    ){

        return;

    }



    if(

        !hasGPSPosition()

    ){

        return;

    }



    if(

        !destinationLatitude ||

        !destinationLongitude

    ){

        return;

    }



    totalRecalculations++;



    await calculateRoute(

        currentLatitude,

        currentLongitude,

        destinationLatitude,

        destinationLongitude

    );



    displayNavigation();


}





/********************************/
/*********** INFORMATIONS *******/
/********************************/


function getRemainingInformation(){


    return{


        distance:

        formatRouteDistance(

            getRemainingDistance()

        ),



        duration:

        formatRouteDuration(

            getRemainingDuration()

        ),



        arrival:

        hasArrived()


    };


}





/********************************/
/******** ACTUALISATION GPS *****/
/********************************/


setInterval(


    ()=>{


        if(

            !navigationStarted

        ){

            return;

        }



        checkArrival();


    },


    5000


);

/********************************/
/******** MODES GPS *************/
/********************************/


let travelMode =

"car";


function setTravelMode(

mode

){


    const modes = [

        "car",

        "bike",

        "walking"

    ];


    if(

        modes.includes(

            mode

        )

    ){

        travelMode =

        mode;

    }


}


function getTravelMode(){


    return travelMode;


}





/********************************/
/******** SORTIE ITINÉRAIRE *****/
/********************************/


function hasLeftRoute(){


    if(

        !navigationStarted ||

        !currentRouteData ||

        !hasGPSPosition()

    ){

        return false;

    }



    const distance =


    calculateDistance(

        currentLatitude,

        currentLongitude,

        destinationLatitude,

        destinationLongitude

    );



    if(

        distance <=

        recalculationDistance

    ){

        routeDeviation =

        false;

        return false;

    }



    routeDeviation =

    true;


    return true;


}





/********************************/
/******** RECALCUL AUTO *********/
/********************************/


async function checkRouteDeviation(){


    if(

        !automaticRecalculation

    ){

        return;

    }



    if(

        hasLeftRoute()

    ){


        speakInstruction(

            "Recalcul de l'itinéraire."

        );



        await recalculateRoute();


    }


}





/********************************/
/*********** GPS LIVE ***********/
/********************************/


function updateNavigationGPS(){


    if(

        !navigationStarted

    ){

        return;

    }



    if(

        hasGPSPosition()

    ){


        updateUserPosition(

            currentLatitude,

            currentLongitude

        );


    }


}





/********************************/
/******** RECENTRAGE AUTO *******/
/********************************/


function centerOnUser(){


    if(

        !followingUser ||

        !currentMap ||

        !hasGPSPosition()

    ){

        return;

    }



    currentMap.setView(

        [

            currentLatitude,

            currentLongitude

        ],

        navigationZoom

    );


}




function enableAutoCenter(){


    followingUser =

    true;


}




function disableAutoCenter(){


    followingUser =

    false;


}





/********************************/
/******** LIMITATION VITESSE ****/
/********************************/


let speedLimit =

null;


function setSpeedLimit(

speed

){


    speedLimit =

    speed;


}


function getSpeedLimit(){


    return speedLimit;


}





/********************************/
/************ VITESSE ***********/
/********************************/


let currentSpeed =

0;


function setCurrentSpeed(

speed

){


    currentSpeed =

    speed;


}


function getCurrentSpeed(){


    return currentSpeed;


}




function isSpeedExceeded(){


    if(

        speedLimit === null

    ){

        return false;

    }



    return (

        currentSpeed >

        speedLimit

    );


}





/********************************/
/************ ALERTES ***********/
/********************************/


function checkSpeedLimit(){


    if(

        !isSpeedExceeded()

    ){

        return;

    }



    speakInstruction(

        "Attention, vous dépassez la limitation de vitesse."

    );


}





/********************************/
/*********** INFORMATIONS *******/
/********************************/


function getNavigationInformations(){


    return{


        speed:

        currentSpeed,



        speedLimit:

        speedLimit,



        distance:

        formatRouteDistance(

            getRemainingDistance()

        ),



        duration:

        formatRouteDuration(

            getRemainingDuration()

        ),



        travelMode:

        travelMode,



        deviation:

        routeDeviation


    };


}





/********************************/
/*********** ACTUALISATION ******/
/********************************/


setInterval(


    async ()=>{


        if(

            !navigationStarted

        ){

            return;

        }



        updateNavigationGPS();



        centerOnUser();



        await checkRouteDeviation();



        checkSpeedLimit();


    },


    3000


);

/********************************/
/******** MANŒUVRE GPS **********/
/********************************/


function getCurrentManeuver(){


    const instruction =

    getNextInstruction();



    if(

        !instruction ||

        !instruction.maneuver

    ){

        return null;

    }



    return instruction

    .maneuver.type;


}




function getCurrentModifier(){


    const instruction =

    getNextInstruction();



    if(

        !instruction ||

        !instruction.maneuver

    ){

        return null;

    }



    return instruction

    .maneuver.modifier ||

    null;


}





/********************************/
/******** PANNEAUX GPS **********/
/********************************/


function getNavigationIcon(){


    const type =

    getCurrentManeuver();



    switch(type){


        case "turn":

            return "↱";


        case "roundabout":

            return "⭕";


        case "arrive":

            return "🏁";


        case "depart":

            return "🚗";


        case "merge":

            return "↗";


        case "fork":

            return "⬆";


        case "uturn":

            return "↩";


        case "continue":

            return "⬆";


        default:

            return "➡";


    }


}





/********************************/
/******** PROCHAINE DISTANCE ****/
/********************************/


function getNextDistance(){


    const instruction =

    getNextInstruction();



    if(

        !instruction

    ){

        return 0;

    }



    return (

        instruction.distance ||

        0

    );


}




function getFormattedNextDistance(){


    return formatRouteDistance(

        getNextDistance()

    );


}





/********************************/
/******** HEURE D'ARRIVÉE *******/
/********************************/


function getArrivalTime(){


    const duration =

    getRemainingDuration();



    const arrival =

    new Date(

        Date.now()

        +

        (

            duration * 1000

        )

    );



    return (

        arrival

        .getHours()

        .toString()

        .padStart(

            2,

            "0"

        )

        +

        ":" +

        arrival

        .getMinutes()

        .toString()

        .padStart(

            2,

            "0"

        )

    );


}





/********************************/
/*********** GUIDAGE ************/
/********************************/


function getInstructionText(){


    const instruction =

    getNextInstruction();



    if(

        !instruction

    ){

        return (

            "Aucune instruction."

        );

    }



    if(

        instruction.name

    ){

        return (

            "Continuez sur " +

            instruction.name

        );

    }



    return (

        "Continuez tout droit."

    );


}





/********************************/
/************ GPS UI ************/
/********************************/


function getNavigationPanel(){


    return{


        icon:

        getNavigationIcon(),



        instruction:

        getInstructionText(),



        distance:

        getFormattedNextDistance(),



        remaining:

        formatRouteDistance(

            getRemainingDistance()

        ),



        duration:

        formatRouteDuration(

            getRemainingDuration()

        ),



        arrival:

        getArrivalTime(),



        speed:

        currentSpeed,



        limit:

        speedLimit


    };


}





/********************************/
/*********** ROND-POINT *********/
/********************************/


function isRoundabout(){


    return (


        getCurrentManeuver()

        ===

        "roundabout"


    );


}




function isArrival(){


    return (


        getCurrentManeuver()

        ===

        "arrive"


    );


}




function isTurn(){


    return (


        getCurrentManeuver()

        ===

        "turn"


    );


}





/********************************/
/*********** GUIDAGE VOCAL ******/
/********************************/


function announceInstruction(){


    const text =

    getInstructionText();



    speakInstruction(

        text

    );


}




function announceArrival(){


    speakInstruction(

        "Vous arriverez à destination à "

        +

        getArrivalTime()

    );


}





/********************************/
/*********** GPS LIVE ***********/
/********************************/


function updateNavigationDisplay(){


    if(

        !navigationStarted

    ){

        return;

    }



    const panel =

    getNavigationPanel();



    console.table(

        panel

    );


}





/********************************/
/******** ACTUALISATION GPS *****/
/********************************/


setInterval(


    ()=>{


        if(

            !navigationStarted

        ){

            return;

        }



        updateNavigationDisplay();


    },


    5000


);





/********************************/
/*********** EXPORT *************/
/********************************/


function exportNavigationData(){


    return{


        instruction:

        getInstructionText(),



        distance:

        getRemainingDistance(),



        duration:

        getRemainingDuration(),



        arrival:

        getArrivalTime(),



        maneuver:

        getCurrentManeuver(),



        speed:

        currentSpeed,


        speedLimit:

        speedLimit


    };


}

/********************************/
/******* NAVIGATION 3D **********/
/********************************/


let immersiveMode =

false;



let mapRotation =

true;



let tunnelMode =

false;



let lastKnownPosition =

null;




function enableImmersiveMode(){


    immersiveMode =

    true;


}




function disableImmersiveMode(){


    immersiveMode =

    false;


}




function isImmersiveModeEnabled(){


    return immersiveMode;


}





/********************************/
/******** ROTATION GPS **********/
/********************************/


function enableMapRotation(){


    mapRotation =

    true;


}




function disableMapRotation(){


    mapRotation =

    false;


}




function isMapRotationEnabled(){


    return mapRotation;


}





/********************************/
/********* DIRECTION GPS ********/
/********************************/


let currentHeading =

0;



function setCurrentHeading(

heading

){


    currentHeading =

    heading;


}




function getCurrentHeading(){


    return currentHeading;


}





/********************************/
/************ TUNNELS ***********/
/********************************/


function enableTunnelMode(){


    tunnelMode =

    true;


}




function disableTunnelMode(){


    tunnelMode =

    false;


}




function isTunnelModeEnabled(){


    return tunnelMode;


}





/********************************/
/************* GPS **************/
/********************************/


function saveLastKnownPosition(){


    if(

        !hasGPSPosition()

    ){

        return;

    }



    lastKnownPosition = {


        latitude:

        currentLatitude,



        longitude:

        currentLongitude,



        accuracy:

        currentAccuracy,



        heading:

        currentHeading


    };


}




function getLastKnownPosition(){


    return lastKnownPosition;


}





/********************************/
/*********** PERTE GPS **********/
/********************************/


function hasLostGPS(){


    return (


        !hasGPSPosition()

        &&

        navigationStarted


    );


}




function recoverGPS(){


    if(

        !hasLostGPS()

    ){

        return;

    }



    if(

        lastKnownPosition

    ){


        console.log(

            "Utilisation de la dernière position GPS."

        );


    }


}





/********************************/
/*********** ZOOM AUTO **********/
/********************************/


function updateNavigationZoom(){


    if(

        !navigationStarted

    ){

        return;

    }



    if(

        currentSpeed >= 110

    ){


        navigationZoom =

        15;


    }


    else if(

        currentSpeed >= 70

    ){


        navigationZoom =

        16;


    }


    else{


        navigationZoom =

        18;


    }


}





/********************************/
/******** MODE IMMERSIF *********/
/********************************/


function updateImmersiveMode(){


    if(

        !immersiveMode

    ){

        return;

    }



    if(

        currentMap &&

        hasGPSPosition()

    ){


        currentMap.setView(

            [

                currentLatitude,

                currentLongitude

            ],

            navigationZoom

        );


    }


}





/********************************/
/********* VUE NAVIGATION *******/
/********************************/


function getNavigationView(){


    return {


        immersive:

        immersiveMode,



        zoom:

        navigationZoom,



        heading:

        currentHeading,



        speed:

        currentSpeed,



        following:

        followingUser,



        tunnel:

        tunnelMode


    };


}





/********************************/
/*********** GPS LIVE ***********/
/********************************/


function updateNavigationEngine(){


    if(

        !navigationStarted

    ){

        return;

    }



    saveLastKnownPosition();



    updateNavigationZoom();



    updateImmersiveMode();



    recoverGPS();


}





/********************************/
/*********** STATISTIQUES *******/
/********************************/


function getImmersiveInformations(){


    return{


        immersive:

        immersiveMode,



        tunnel:

        tunnelMode,



        heading:

        currentHeading,



        zoom:

        navigationZoom,



        gpsLost:

        hasLostGPS()


    };


}





/********************************/
/*********** ACTUALISATION ******/
/********************************/


setInterval(


    ()=>{


        if(

            !navigationStarted

        ){

            return;

        }



        updateNavigationEngine();


    },


    2000


);





/********************************/
/*********** EXPORT *************/
/********************************/


function exportImmersiveData(){


    return{


        heading:

        currentHeading,



        immersive:

        immersiveMode,



        zoom:

        navigationZoom,



        tunnel:

        tunnelMode,



        position:

        lastKnownPosition


    };


}

/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeClemMapsOSRM(){


    try{


        initializeOSRM();


        connectOSRM();


        console.log(

            "Navigation OSRM initialisée."

        );



        return true;


    }


    catch(error){


        console.error(

            error

        );



        return false;


    }


}





/********************************/
/*********** DIAGNOSTIC *********/
/********************************/


function getOSRMDiagnostics(){


    return{


        version:

        OSRM_VERSION,



        started:

        navigationStarted,



        destination:

        destinationName,



        voice:

        navigationVoice,



        immersive:

        immersiveMode,



        travelMode:

        travelMode,



        speed:

        currentSpeed,



        zoom:

        navigationZoom,



        heading:

        currentHeading,



        gpsUpdates:

        totalGPSUpdates,



        routes:

        totalRoutesCalculated,



        recalculations:

        totalRecalculations,



        failed:

        totalRoutesFailed,



        tunnel:

        tunnelMode,



        following:

        followingUser,


        autoRecalculation:

        automaticRecalculation


    };


}





/********************************/
/************ RAPPORT ***********/
/********************************/


function printOSRMReport(){


    console.table(

        getOSRMDiagnostics()

    );


}




function exportOSRMReport(){


    return JSON.stringify(

        getOSRMDiagnostics(),

        null,

        4

    );


}





/********************************/
/*********** PARAMÈTRES *********/
/********************************/


function resetNavigationSettings(){


    navigationVoice =

    true;



    immersiveMode =

    false;



    mapRotation =

    true;



    navigationZoom =

    18;



    navigationStarted =

    false;



    followingUser =

    true;



    automaticRecalculation =

    true;



    tunnelMode =

    false;


}





/********************************/
/*********** RÉINITIALISATION ***/
/********************************/


function reloadOSRM(){


    clearNavigation();


    clearDestination();


    resetNavigationSettings();


    initializeClemMapsOSRM();


}





/********************************/
/************ EXPORTS ***********/
/********************************/


window.ClemMapsNavigation = {


    calculateRoute,

    displayRoute,

    startNavigationMode,

    stopNavigationMode,

    recalculateRoute,

    getNavigationStatus,

    getNavigationInformations,

    getNavigationPanel,

    getRemainingInformation,

    getCurrentRoute,

    getCurrentInstructions,

    getDestination,

    setDestination,

    clearDestination,

    followUser,

    centerOnUser,

    enableVoiceGuidance,

    disableVoiceGuidance,

    enableImmersiveMode,

    disableImmersiveMode,

    setTravelMode,

    reloadOSRM,

    exportOSRMReport,

    getOSRMDiagnostics


};





/********************************/
/*********** TESTS **************/
/********************************/


function performOSRMTests(){


    return{


        GPS:

        typeof hasGPSPosition ===

        "function",



        Overpass:

        typeof searchRestaurants ===

        "function",



        Navigation:

        typeof startNavigation ===

        "function",



        Leaflet:

        typeof L !==

        "undefined",



        Internet:

        navigator.onLine


    };


}





/********************************/
/*********** SURVEILLANCE *******/
/********************************/


setInterval(


    ()=>{


        if(

            developerMode

        ){


            printOSRMReport();


        }


    },


    60000


);





/********************************/
/*********** DÉMARRAGE **********/
/********************************/


window.addEventListener(


    "load",


    ()=>{


        initializeClemMapsOSRM();



        if(

            developerMode

        ){


            console.table(

                performOSRMTests()

            );


        }


    }


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

"OSRM Version :",

OSRM_VERSION

);


console.log(

"Navigation prête."

);


console.log(

"--------------------------------"

);/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeClemMapsOSRM(){


    try{


        initializeOSRM();


        connectOSRM();


        console.log(

            "Navigation OSRM initialisée."

        );



        return true;


    }


    catch(error){


        console.error(

            error

        );



        return false;


    }


}





/********************************/
/*********** DIAGNOSTIC *********/
/********************************/


function getOSRMDiagnostics(){


    return{


        version:

        OSRM_VERSION,



        started:

        navigationStarted,



        destination:

        destinationName,



        voice:

        navigationVoice,



        immersive:

        immersiveMode,



        travelMode:

        travelMode,



        speed:

        currentSpeed,



        zoom:

        navigationZoom,



        heading:

        currentHeading,



        gpsUpdates:

        totalGPSUpdates,



        routes:

        totalRoutesCalculated,



        recalculations:

        totalRecalculations,



        failed:

        totalRoutesFailed,



        tunnel:

        tunnelMode,



        following:

        followingUser,


        autoRecalculation:

        automaticRecalculation


    };


}





/********************************/
/************ RAPPORT ***********/
/********************************/


function printOSRMReport(){


    console.table(

        getOSRMDiagnostics()

    );


}




function exportOSRMReport(){


    return JSON.stringify(

        getOSRMDiagnostics(),

        null,

        4

    );


}





/********************************/
/*********** PARAMÈTRES *********/
/********************************/


function resetNavigationSettings(){


    navigationVoice =

    true;



    immersiveMode =

    false;



    mapRotation =

    true;



    navigationZoom =

    18;



    navigationStarted =

    false;



    followingUser =

    true;



    automaticRecalculation =

    true;



    tunnelMode =

    false;


}





/********************************/
/*********** RÉINITIALISATION ***/
/********************************/


function reloadOSRM(){


    clearNavigation();


    clearDestination();


    resetNavigationSettings();


    initializeClemMapsOSRM();


}





/********************************/
/************ EXPORTS ***********/
/********************************/


window.ClemMapsNavigation = {


    calculateRoute,

    displayRoute,

    startNavigationMode,

    stopNavigationMode,

    recalculateRoute,

    getNavigationStatus,

    getNavigationInformations,

    getNavigationPanel,

    getRemainingInformation,

    getCurrentRoute,

    getCurrentInstructions,

    getDestination,

    setDestination,

    clearDestination,

    followUser,

    centerOnUser,

    enableVoiceGuidance,

    disableVoiceGuidance,

    enableImmersiveMode,

    disableImmersiveMode,

    setTravelMode,

    reloadOSRM,

    exportOSRMReport,

    getOSRMDiagnostics


};





/********************************/
/*********** TESTS **************/
/********************************/


function performOSRMTests(){


    return{


        GPS:

        typeof hasGPSPosition ===

        "function",



        Overpass:

        typeof searchRestaurants ===

        "function",



        Navigation:

        typeof startNavigation ===

        "function",



        Leaflet:

        typeof L !==

        "undefined",



        Internet:

        navigator.onLine


    };


}





/********************************/
/*********** SURVEILLANCE *******/
/********************************/


setInterval(


    ()=>{


        if(

            developerMode

        ){


            printOSRMReport();


        }


    },


    60000


);





/********************************/
/*********** DÉMARRAGE **********/
/********************************/


window.addEventListener(


    "load",


    ()=>{


        initializeClemMapsOSRM();



        if(

            developerMode

        ){


            console.table(

                performOSRMTests()

            );


        }


    }


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

"OSRM Version :",

OSRM_VERSION

);


console.log(

"Navigation prête."

);


console.log(

"--------------------------------"

);
