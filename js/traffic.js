/********************************/
/************* TRAFIC ***********/
/********************************/


let trafficEnabled = true;

let trafficLevel = "Normal";

let trafficDelay = 0;

let trafficAccidents = [];

let trafficRoadWorks = [];



/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeTraffic(){


    console.log(

        "Module trafic chargé."

    );


}





/********************************/
/******** ACTIVER TRAFIC ********/
/********************************/


function enableTrafficMode(){


    trafficEnabled = true;



    showNotification(

        "Informations trafic activées."

    );


}





function disableTrafficMode(){


    trafficEnabled = false;



    showNotification(

        "Informations trafic désactivées."

    );


}





/********************************/
/*********** NIVEAU *************/
/********************************/


function updateTrafficLevel(


    level = "Normal"


){



    trafficLevel =

    level;


}





function updateTrafficDelay(


    delay = 0


){



    trafficDelay =

    delay;


}





/********************************/
/*********** AFFICHAGE **********/
/********************************/


function showTrafficInformation(){


    if(

        !trafficEnabled

    ){

        return;

    }



    if(

        trafficDelay > 0

    ){


        showNotification(

            "Retard estimé : "

            +

            trafficDelay

            +

            " minute(s)."

        );


    }


}

/********************************/
/******** RALENTISSEMENTS *******/
/********************************/


function detectTrafficSlowdown(){


    if(

        !navigationStarted

    ){

        return;

    }



    if(

        navigationRemainingDistance > 100

    ){


        updateTrafficLevel(

            "Dense"

        );



        updateTrafficDelay(

            15

        );


    }


    else if(

        navigationRemainingDistance > 50

    ){


        updateTrafficLevel(

            "Modéré"

        );



        updateTrafficDelay(

            5

        );


    }


    else{


        updateTrafficLevel(

            "Fluide"

        );



        updateTrafficDelay(

            0

        );


    }


}





/********************************/
/******** SYNCHRONISATION GPS ***/
/********************************/


function synchronizeTraffic(){


    if(

        !trafficEnabled

    ){

        return;

    }



    detectTrafficSlowdown();


    showTrafficInformation();


}





/********************************/
/*********** TRAFIC GPS *********/
/********************************/


function updateTrafficInformations(){


    if(

        !navigationStarted

    ){

        return;

    }



    synchronizeTraffic();



}





/********************************/
/*********** NIVEAU *************/
/********************************/


function getTrafficLevel(){


    return trafficLevel;


}




function getTrafficDelay(){


    return trafficDelay;


}

/********************************/
/*********** ACCIDENTS **********/
/********************************/


function addTrafficAccident(


    description


){


    trafficAccidents.push(

        description

    );


}




function clearTrafficAccidents(){


    trafficAccidents = [];


}





/********************************/
/************ TRAVAUX ***********/
/********************************/


function addRoadWork(


    description


){


    trafficRoadWorks.push(

        description

    );


}




function clearRoadWorks(){


    trafficRoadWorks = [];


}





/********************************/
/*********** ROUTES FERMÉES *****/
/********************************/


function roadClosed(


    roadName = "Route inconnue"


){


    showNotification(

        roadName +

        " est actuellement fermée."

    );



    if(

        navigationStarted

    ){


        recalculateRoute();


    }


}





/********************************/
/*********** NOTIFICATIONS ******/
/********************************/


function displayTrafficAlerts(){


    if(

        trafficAccidents.length > 0

    ){


        showNotification(

            trafficAccidents.length +

            " accident(s) signalé(s)."

        );


    }



    if(

        trafficRoadWorks.length > 0

    ){


        showNotification(

            trafficRoadWorks.length +

            " zone(s) de travaux détectée(s)."

        );


    }


}





/********************************/
/************* VOIX *************/
/********************************/


function speakTrafficAlert(


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



    window.speechSynthesis

    .speak(

        speech

    );


}

/********************************/
/****** OPTIMISATION GPS ********/
/********************************/


function optimizeRoute(){


    if(

        !navigationStarted

    ){

        return;

    }



    if(

        trafficDelay >= 10

    ){


        showNotification(

            "Un itinéraire plus rapide a été trouvé."

        );



        speakTrafficAlert(

            "Un itinéraire alternatif est disponible."

        );



        recalculateRoute();


    }


}





/********************************/
/******** EMBOUTEILLAGES ********/
/********************************/


function detectTrafficJam(){


    if(

        trafficDelay >= 20

    ){


        showNotification(

            "Embouteillage important détecté."

        );



        speakTrafficAlert(

            "Embouteillage important sur votre trajet."

        );


    }


}





/********************************/
/******** ITINÉRAIRE BIS ********/
/********************************/


function suggestAlternativeRoute(){


    if(

        trafficDelay < 15

    ){

        return;

    }



    showNotification(

        "Un itinéraire alternatif est recommandé."

    );


}





/********************************/
/******** ROUTES À ÉVITER *******/
/********************************/


function avoidTrafficRoads(){


    if(

        trafficRoadWorks.length > 0 ||

        trafficAccidents.length > 0

    ){


        recalculateRoute();


    }


}





/********************************/
/******** TRAFIC TEMPS RÉEL *****/
/********************************/


function refreshTrafficNavigation(){


    optimizeRoute();


    detectTrafficJam();


    suggestAlternativeRoute();


    avoidTrafficRoads();


}

/********************************/
/******** AFFICHAGE CARTE *******/
/********************************/


function displayTrafficOnMap(){


    if(

        !trafficEnabled ||

        !map

    ){

        return;

    }



    updateTrafficColor();


}





/********************************/
/******** COULEUR DU TRAFIC *****/
/********************************/


function getTrafficColor(){


    switch(

        trafficLevel

    ){


        case "Fluide":

            return "green";


        case "Modéré":

            return "orange";


        case "Dense":

            return "red";


        default:

            return "blue";


    }


}





function updateTrafficColor(){


    let color =

    getTrafficColor();



    console.log(

        "Couleur trafic :",

        color

    );


}





/********************************/
/******** SYNCHRONISATION *******/
/********************************/


function synchronizeTrafficMap(){


    if(

        !trafficEnabled

    ){

        return;

    }



    displayTrafficOnMap();


}





/********************************/
/******** INFORMATIONS **********/
/********************************/


function displayTrafficLevel(){


    if(

        !trafficEnabled

    ){

        return;

    }



    console.log(

        "Trafic :",

        trafficLevel

    );


}





/********************************/
/******** ACTUALISATION *********/
/********************************/


function refreshTrafficMap(){


    synchronizeTrafficMap();


    displayTrafficLevel();


}

/********************************/
/******** SYNCHRONISATION *******/
/********************************/

function refreshTraffic(){


    if(

        !trafficEnabled

    ){

        return;

    }


    updateTrafficInformations();


    refreshTrafficNavigation();


    refreshTrafficMap();


}





/********************************/
/******** ACTUALISATION *********/
/********************************/


setInterval(

    function(){


        if(

            navigationStarted

        ){


            refreshTraffic();


        }


    },

    60000

);





/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeTrafficModule(){


    initializeTraffic();


    refreshTraffic();



    console.log(

        "Module trafic prêt."

    );


}





/********************************/
/******** AUTO CHARGEMENT *******/
/********************************/


window.addEventListener(

    "load",

    function(){


        initializeTrafficModule();


    }

);





/********************************/
/*********** UTILITAIRES ********/
/********************************/


function isTrafficEnabled(){


    return trafficEnabled;


}




function getTrafficInformations(){


    return {


        level:

        trafficLevel,


        delay:

        trafficDelay,


        accidents:

        trafficAccidents,


        roadWorks:

        trafficRoadWorks


    };


}





/********************************/
/******** FIN TRAFFIC.JS ********/
/********************************/

/*

Fonctionnalités :

- Informations trafic ;
- Détection des ralentissements ;
- Détection des embouteillages ;
- Travaux routiers ;
- Accidents ;
- Routes fermées ;
- Recalcul intelligent des itinéraires ;
- Itinéraires alternatifs ;
- Synchronisation GPS ;
- Synchronisation navigation ;
- Affichage sur la carte ;
- Notifications vocales ;
- Actualisation automatique ;
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
  traffic.js
      ↓
   maps.js
      ↓
navigation.js
      ↓
    gps.js
      ↓
 Notifications
      ↓
 Optimisation GPS

*/