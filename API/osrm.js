/********************************/
/************** OSRM ************/
/********************************/
/*
API Calcul itinéraire

Open Source Routing Machine

Fonctions :
- Calcul trajet voiture
- Distance
- Durée
- Étapes navigation
- Recalcul itinéraire
*/


const OSRM_URL =

"https://router.project-osrm.org";





/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeOSRM(){


    console.log(

        "API OSRM prête."

    );


}





/********************************/
/******** CALCUL ROUTE **********/
/********************************/


async function calculateOSRMRoute(


    startLat,

    startLon,

    endLat,

    endLon


){


    try{


        let url =


        OSRM_URL

        +

        "/route/v1/driving/"

        +

        startLon

        +

        ","

        +

        startLat

        +

        ";"

        +

        endLon

        +

        ","

        +

        endLat

        +

        "?overview=full&steps=true&geometries=geojson";




        let response =

        await fetch(

            url

        );



        let data =

        await response.json();



        return data;


    }


    catch(error){


        console.log(

            "Erreur OSRM :",

            error

        );



        return null;


    }


}





/********************************/
/******** PREMIER TRAJET ********/
/********************************/


function getBestRoute(


    data


){


    if(

        !data ||

        !data.routes ||

        data.routes.length === 0

    ){


        return null;


    }



    return data.routes[0];


}

/********************************/
/******** INFORMATIONS TRAJET ***/
/********************************/


function getRouteDistance(


    route


){


    if(

        !route

    ){

        return 0;

    }



    return Math.round(

        route.distance

        /

        1000

    );


}





function getRouteDuration(


    route


){


    if(

        !route

    ){

        return 0;

    }



    return Math.round(

        route.duration

        /

        60

    );


}





/********************************/
/******** FORMAT DURÉE **********/
/********************************/


function formatDuration(


    minutes


){


    if(

        minutes < 60

    ){


        return minutes

        +

        " min";


    }



    let hours =

    Math.floor(

        minutes / 60

    );



    let remaining =

    minutes %

    60;



    return (

        hours

        +

        " h "

        +

        remaining

        +

        " min"

    );


}





/********************************/
/******** FORMAT DISTANCE ********/
/********************************/


function formatDistance(


    kilometers


){


    if(

        kilometers >= 100

    ){


        return (

            kilometers

            +

            " km"

        );


    }



    return (

        kilometers.toFixed(1)

        +

        " km"

    );


}





/********************************/
/******** ÉTAPES NAVIGATION *****/
/********************************/


function getNavigationSteps(


    route


){


    if(

        !route ||

        !route.legs

    ){

        return [];

    }



    return route.legs[0].steps;


}





/********************************/
/******** PREMIÈRE INSTRUCTION **/
/********************************/


function getFirstInstruction(


    route


){


    let steps =

    getNavigationSteps(

        route

    );



    if(

        steps.length === 0

    ){

        return null;

    }



    return steps[0].maneuver;


}

/********************************/
/******** INSTRUCTIONS **********/
/********************************/


function formatNavigationInstruction(


    step


){


    if(

        !step

    ){

        return "";

    }



    let type =

    step.maneuver.type;



    let modifier =

    step.maneuver.modifier || "";



    let road =

    step.name || "la route";



    return (

        translateManeuver(

            type,

            modifier

        )

        +

        " sur "

        +

        road

    );


}





/********************************/
/******** TRADUCTION ************/
/********************************/


function translateManeuver(


    type,

    modifier


){



    if(

        type === "turn"

    ){



        if(

            modifier === "left"

        ){


            return "Tournez à gauche";


        }



        if(

            modifier === "right"

        ){


            return "Tournez à droite";


        }



        return "Tournez";


    }




    if(

        type === "depart"

    ){


        return "Démarrez";


    }





    if(

        type === "arrive"

    ){


        return "Vous êtes arrivé";


    }





    if(

        type === "roundabout"

    ){


        return "Prenez le rond-point";


    }





    return "Continuez";


}





/********************************/
/******** SUIVI TRAJET **********/
/********************************/


function followOSRMRoute(


    route


){


    if(

        !route

    ){

        return;

    }



    let steps =

    getNavigationSteps(

        route

    );



    window.currentNavigationSteps =

    steps;



}





/********************************/
/******** RECALCUL **************/
/********************************/


async function recalculateRoute(){


    if(

        !destinationMarker ||

        !userMarker

    ){

        return null;

    }



    let start =

    userMarker.getLatLng();



    let end =

    destinationMarker.getLatLng();



    return await calculateOSRMRoute(

        start.lat,

        start.lng,

        end.lat,

        end.lng

    );


}

/********************************/
/******** SAUVEGARDE TRAJET ******/
/********************************/


function saveLastRoute(route){


    if(

        !route

    ){

        return;

    }



    localStorage.setItem(

        "clemmapsLastRoute",

        JSON.stringify(

            route

        )

    );


}





/********************************/
/******** CHARGEMENT TRAJET *****/
/********************************/


function loadLastRoute(){


    let route =

    localStorage.getItem(

        "clemmapsLastRoute"

    );



    if(

        !route

    ){

        return null;

    }



    return JSON.parse(

        route

    );


}





/********************************/
/******** SYNCHRONISATION *******/
/********************************/


async function startOSRMNavigation(){


    let route =

    await recalculateRoute();



    if(

        !route

    ){

        showNotification(

            "Impossible de calculer le trajet."

        );


        return;

    }



    let bestRoute =

    getBestRoute(

        route

    );



    saveLastRoute(

        bestRoute

    );



    followOSRMRoute(

        bestRoute

    );



    showNotification(

        "Itinéraire calculé."

    );


}





/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeOSRMAPI(){


    initializeOSRM();



    console.log(

        "API OSRM chargée."

    );


}





/********************************/
/******** AUTO CHARGEMENT *******/
/********************************/


window.addEventListener(

    "load",

    function(){


        initializeOSRMAPI();


    }

);





/********************************/
/******** FIN OSRM.JS ***********/
/********************************/

/*

API OSRM :

Fonctionnalités :

- Calcul d'itinéraire réel ;
- Distance ;
- Temps de trajet ;
- Instructions virage par virage ;
- Traduction française ;
- Suivi GPS ;
- Recalcul automatique ;
- Sauvegarde dernier trajet ;
- Connexion navigation.js.


Architecture :

navigation.js
      ↓
osrm.js
      ↓
OSRM Routing Engine
      ↓
Calcul route
      ↓
GPS
      ↓
Guidage utilisateur

*/