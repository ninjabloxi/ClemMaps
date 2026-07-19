/********************************/
/********** NAVIGATION **********/
/********************************/


let navigationDistance = 0;

let navigationDuration = 0;

let navigationRemainingDistance = 0;

let navigationRemainingTime = 0;

let navigationArrivalTime = "--";

let navigationTravelCost = "--";



/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeNavigation(){


    console.log(

        "Module navigation chargé."

    );


}





/********************************/
/******** DEMARRAGE NAV *********/
/********************************/


function startNavigation(){


    if(!destinationMarker){


        showNotification(

            "Aucune destination sélectionnée."

        );


        return;


    }



    navigationStarted = true;



    closeSearchBar();



    hideGPSButtons();



    calculateRoute();



    showNavigationInformations();



    showNotification(

        "Navigation démarrée."

    );


}





/********************************/
/******** ARRET NAVIGATION ******/
/********************************/


function stopNavigation(){


    navigationStarted = false;



    showGPSButtons();



    openSearchBar();



    hideNavigationInformations();



    showNotification(

        "Navigation arrêtée."

    );


}





/********************************/
/******** CALCUL TRAJET *********/
/********************************/


async function calculateRoute(){


    if(

        currentPosition.latitude === 0 ||

        currentPosition.longitude === 0

    ){

        showNotification(

            "Position GPS inconnue."

        );

        return;

    }



    if(!destinationMarker){

        return;

    }



    showNotification(

        "Calcul de l'itinéraire..."

    );



    /*
    La prochaine partie utilisera :

    - OSRM
    - OpenStreetMap
    - coordonnées GPS
    */



}

/********************************/
/*********** API OSRM ***********/
/********************************/


async function calculateRoute(){


    if(

        currentPosition.latitude === 0 ||

        currentPosition.longitude === 0

    ){

        showNotification(

            "Position GPS inconnue."

        );

        return;

    }



    if(!destinationMarker){

        return;

    }



    showNotification(

        "Calcul de l'itinéraire..."

    );



    try{


        let destination =

        destinationMarker.getLatLng();



        let url =

        "https://router.project-osrm.org/route/v1/driving/"

        +

        currentPosition.longitude

        +

        ","

        +

        currentPosition.latitude

        +

        ";"

        +

        destination.lng

        +

        ","

        +

        destination.lat

        +

        "?overview=false";




        let response =

        await fetch(

            url

        );



        let data =

        await response.json();



        if(

            !data.routes ||

            data.routes.length === 0

        ){


            showNotification(

                "Impossible de calculer l'itinéraire."

            );


            return;


        }




        navigationDistance =

        Math.round(

            data.routes[0].distance

            / 1000

        );



        navigationDuration =

        Math.round(

            data.routes[0].duration

            / 60

        );



        navigationRemainingDistance =

        navigationDistance;



        navigationRemainingTime =

        navigationDuration;




        calculateArrivalTime();



        calculateTravelCost();



        updateNavigationInformations();



        showNotification(

            "Itinéraire calculé."

        );


    }


    catch(error){


        console.log(

            error

        );



        showNotification(

            "Erreur lors du calcul."

        );


    }


}





/********************************/
/******** TEMPS D'ARRIVEE *******/
/********************************/


function calculateArrivalTime(){


    let date =

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
/******** COÛT DU TRAJET ********/
/********************************/


function calculateTravelCost(){


    if(

        vehicleSettings.fuel ===

        "Electrique"

    ){


        navigationTravelCost =

        Math.max(

            1,

            Math.round(

                navigationDistance *

                0.04

            )

        )

        + " €";


    }


    else{


        navigationTravelCost =

        Math.max(

            1,

            Math.round(

                navigationDistance *

                0.12

            )

        )

        + " €";


    }


}





/********************************/
/******** AFFICHAGE NAV *********/
/********************************/


function showNavigationInformations(){



    let container =

    document.getElementById(

        "navigationInformations"

    );



    if(!container){


        return;


    }



    container.style.display =

    "flex";



    updateNavigationInformations();



}





function hideNavigationInformations(){



    let container =

    document.getElementById(

        "navigationInformations"

    );



    if(container){


        container.style.display =

        "none";


    }


}





/********************************/
/******** MISE À JOUR ***********/
/********************************/


function updateNavigationInformations(){



    let distance =

    document.getElementById(

        "remainingDistance"

    );



    let time =

    document.getElementById(

        "remainingTime"

    );



    let cost =

    document.getElementById(

        "travelCost"

    );



    let arrival =

    document.getElementById(

        "arrivalTime"

    );




    if(distance){


        distance.innerHTML =

        navigationRemainingDistance +

        " km";


    }




    if(time){


        time.innerHTML =

        navigationRemainingTime +

        " min";


    }




    if(cost){


        cost.innerHTML =

        navigationTravelCost;


    }




    if(arrival){


        arrival.innerHTML =

        navigationArrivalTime;


    }


}

/********************************/
/******** SUIVI NAVIGATION ******/
/********************************/


function updateNavigation(){


    if(

        !navigationStarted

    ){

        return;

    }



    if(

        currentPosition.latitude === 0 ||

        currentPosition.longitude === 0

    ){

        return;

    }



    updateRemainingDistance();



    followNavigation();



}





/********************************/
/******** SUIVI GPS *************/
/********************************/


function followNavigation(){


    if(

        !autoFollowGPS ||

        !userMarker

    ){

        return;

    }



    map.setView(

        [

            currentPosition.latitude,

            currentPosition.longitude

        ],

        18

    );


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



    let destination =

    destinationMarker.getLatLng();



    let distance =

    calculateDistance(

        currentPosition.latitude,

        currentPosition.longitude,

        destination.lat,

        destination.lng

    );



    navigationRemainingDistance =

    Math.round(

        distance

    );



    if(

        navigationRemainingDistance <= 1

    ){

        navigationRemainingDistance =

        0;


        destinationReached();


    }



    updateRemainingTime();



    updateNavigationInformations();


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

                /

                80

            )

            *

            60

        )

    );



    calculateArrivalTime();


}

/********************************/
/******** ARRIVÉE GPS ***********/
/********************************/


function destinationReached(){


    showNotification(

        "Vous êtes arrivé à destination."

    );



    speakNavigation(

        "Vous êtes arrivé à destination."

    );



    stopNavigation();


}





/********************************/
/******** RECALCUL TRAJET *******/
/********************************/


function recalculateRoute(){


    if(

        !navigationStarted

    ){

        return;

    }



    showNotification(

        "Recalcul de l'itinéraire..."

    );



    speakNavigation(

        "Recalcul de l'itinéraire."

    );



    calculateRoute();


}





/********************************/
/******** NOTIFICATIONS VOCALES **/
/********************************/


function speakNavigation(


    message


){


    if(

        !("speechSynthesis"

        in window)

    ){

        return;

    }



    let speech =

    new SpeechSynthesisUtterance(

        message

    );



    speech.lang =

    "fr-FR";



    speech.rate =

    1;



    window.speechSynthesis

    .speak(

        speech

    );


}





/********************************/
/******** SURVEILLANCE GPS ******/
/********************************/


function checkNavigationPosition(){


    if(

        !navigationStarted ||

        !destinationMarker

    ){

        return;

    }



    let destination =

    destinationMarker.getLatLng();



    let distance =

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
/******** PAUSE CONSEILLÉE ******/
/********************************/


function checkRecommendedStop(){


    if(

        navigationDistance < 200

    ){

        return;

    }



    let stop =

    document.getElementById(

        "recommendedStop"

    );



    if(stop){


        stop.innerHTML =

        "Pause conseillée dans 2 h";


    }



}





/********************************/
/******** AUTONOMIE *************/
/********************************/


function updateVehicleRange(){


    let range =

    document.getElementById(

        "vehicleRange"

    );



    if(!range){

        return;

    }



    if(

        vehicleSettings.range <=

        navigationDistance

    ){


        range.innerHTML =

        "Recharge nécessaire";



        showNotification(

            "Autonomie insuffisante."

        );


    }

    else{


        let remaining =

        vehicleSettings.range -

        navigationDistance;



        range.innerHTML =

        remaining +

        " km";


    }


}





/********************************/
/******** CARBURANT *************/
/********************************/


function updateVehicleFuel(){


    let fuel =

    document.getElementById(

        "vehicleFuel"

    );



    if(!fuel){

        return;

    }



    fuel.innerHTML =

    vehicleSettings.fuel;


}





/********************************/
/******** BORNES PROCHES ********/
/********************************/


function searchNearbyCharging(){


    if(

        typeof searchCategory ===

        "function"

    ){


        searchCategory(

            "charging"

        );


    }


}





/********************************/
/******** STATIONS PROCHES ******/
/********************************/


function searchNearbyFuel(){


    if(

        typeof searchCategory ===

        "function"

    ){


        searchCategory(

            "fuel"

        );


    }


}





/********************************/
/******** MISE À JOUR AUTO ******/
/********************************/


function updateVehicleInformations(){


    updateVehicleRange();


    updateVehicleFuel();


    checkRecommendedStop();


}

/********************************/
/******** ACTUALISATION *********/
/********************************/


function refreshNavigation(){


    if(!navigationStarted){

        return;

    }



    updateNavigation();


    checkNavigationPosition();


    updateVehicleInformations();


}





/********************************/
/******** BOUCLE GPS ************/
/********************************/


setInterval(

    function(){


        if(navigationStarted){


            refreshNavigation();


        }


    },

    5000

);





/********************************/
/******** SYNCHRONISATION *******/
/********************************/


function synchronizeNavigation(){


    if(!navigationStarted){

        return;

    }



    updateNavigationInformations();


    calculateArrivalTime();


}





/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeNavigationModule(){


    console.log(

        "Module navigation prêt."

    );


}





/********************************/
/******** AUTO CHARGEMENT *******/
/********************************/


window.addEventListener(

    "load",

    function(){


        initializeNavigationModule();


    }

);





/********************************/
/******** FIN NAVIGATION.JS *****/
/********************************/

/*

Fonctionnalités :

- Calcul d'itinéraire (OSRM) ;
- Temps restant ;
- Distance restante ;
- Coût estimé du trajet ;
- Heure d'arrivée ;
- Recalcul automatique ;
- Notifications vocales ;
- Suivi GPS intelligent ;
- Autonomie du véhicule ;
- Pauses recommandées ;
- Stations-service proches ;
- Bornes électriques proches ;
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
js/navigation.js
      ↓
   GPS
      ↓
 Navigation
      ↓
 Véhicule
      ↓
 Notifications
      ↓
    OSRM
      ↓
 OpenStreetMap

*/
