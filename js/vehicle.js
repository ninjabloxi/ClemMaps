/********************************/
/************ VÉHICULE **********/
/********************************/

let vehicleSelected =

false;


let currentVehicle =

null;


let vehicles = [];


/********************************/
/******** CONFIGURATION *********/
/********************************/


let vehicleSettings = {


    name:

    "Aucun véhicule",


    brand:

    "",


    model:

    "",


    year:

    0,


    type:

    "Aucun",


    range:

    0,


    tank:

    0,


    battery:

    0,


    consumption:

    0,


    currentFuel:

    100,


    selected:

    false


};



/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeVehicle(){


    loadVehicleSettings();


    loadVehicles();


    console.log(

        "Module véhicule prêt."

    );


}





/********************************/
/******** AJOUT VÉHICULE ********/
/********************************/


function createVehicle(


    informations


){


    vehicles.push(


        informations


    );



    saveVehicles();



    return true;


}





/********************************/
/******** SUPPRESSION ***********/
/********************************/


function removeVehicle(


    index


){


    if(


        index < 0 ||


        index >= vehicles.length


    ){


        return;


    }



    vehicles.splice(


        index,

        1

    );



    saveVehicles();


}





/********************************/
/******** SÉLECTION *************/
/********************************/


function selectVehicle(


    index


){


    if(


        index < 0 ||


        index >= vehicles.length


    ){


        return;


    }



    currentVehicle =

    vehicles[index];



    vehicleSelected =

    true;



    vehicleSettings =

    currentVehicle;



    saveVehicleSettings();



    showNotification(

        "Véhicule sélectionné."

    );


}





/********************************/
/******** DÉSÉLECTION ***********/
/********************************/


function unselectVehicle(){


    vehicleSelected =

    false;



    currentVehicle =

    null;



    vehicleSettings = {


        name:

        "Aucun véhicule",


        brand:

        "",


        model:

        "",


        year:

        0,


        type:

        "Aucun",


        range:

        0,


        tank:

        0,


        battery:

        0,


        consumption:

        0,


        currentFuel:

        100,


        selected:

        false


    };



    saveVehicleSettings();


}

/********************************/
/******** TYPES VÉHICULES *******/
/********************************/


const VEHICLE_TYPES = [


    "Thermique",


    "Electrique",


    "Hybride",


    "Moto",


    "Scooter",


    "Vélo",


    "Vélo électrique",


    "Camping-car",


    "Utilitaire",


    "Camion"


];




/********************************/
/*********** VÉRIFICATIONS ******/
/********************************/


function hasVehicle(){


    return (

        vehicleSelected

    );


}




function getVehicleType(){


    if(

        !hasVehicle()

    ){

        return "Aucun";

    }



    return (

        vehicleSettings.type

    );


}





function isElectricVehicle(){


    return (

        getVehicleType()

        ===

        "Electrique"

    );


}




function isHybridVehicle(){


    return (

        getVehicleType()

        ===

        "Hybride"

    );


}




function isThermalVehicle(){


    return (

        getVehicleType()

        ===

        "Thermique"

    );


}





/********************************/
/************* DEUX ROUES *******/
/********************************/


function isMotorcycle(){


    return (

        getVehicleType()

        ===

        "Moto"

    );


}




function isScooter(){


    return (

        getVehicleType()

        ===

        "Scooter"

    );


}




function isBike(){


    return (

        getVehicleType()

        ===

        "Vélo"

    );


}




function isElectricBike(){


    return (

        getVehicleType()

        ===

        "Vélo électrique"

    );


}





/********************************/
/******** VÉHICULES LOURDS ******/
/********************************/


function isMotorhome(){


    return (

        getVehicleType()

        ===

        "Camping-car"

    );


}




function isUtilityVehicle(){


    return (

        getVehicleType()

        ===

        "Utilitaire"

    );


}




function isTruck(){


    return (

        getVehicleType()

        ===

        "Camion"

    );


}

/********************************/
/*********** AUTONOMIE **********/
/********************************/


function calculateRemainingRange(){


    if(

        !hasVehicle()

    ){

        return 0;

    }



    return Math.round(

        (

            vehicleSettings.range

            *

            vehicleSettings.currentFuel

        )

        / 100

    );


}





/********************************/
/******** CONSOMMATION **********/
/********************************/


function calculateConsumption(){


    if(

        !hasVehicle()

    ){

        return 0;

    }



    if(

        navigationDistance <= 0

    ){

        return 0;

    }



    return Number(

        (

            (

                navigationDistance

                *

                vehicleSettings

                .consumption

            )

            / 100

        )

        .toFixed(1)

    );


}





/********************************/
/******** COÛT DU TRAJET ********/
/********************************/


function calculateTravelCost(){


    if(

        !hasVehicle()

    ){

        return "--";

    }



    if(

        isElectricVehicle()

    ){

        return Number(

            (

                navigationDistance

                * 0.04

            )

            .toFixed(2)

        );

    }



    return Number(

        (

            calculateConsumption()

            * 1.85

        )

        .toFixed(2)

    );


}





/********************************/
/******** AUTONOMIE GPS *********/
/********************************/


function hasEnoughRange(){


    if(

        !hasVehicle()

    ){

        return true;

    }



    return (

        calculateRemainingRange()

        >=

        navigationDistance

    );


}





/********************************/
/******** IMPACT MÉTÉO **********/
/********************************/


function applyWeatherImpact(){


    if(

        !hasVehicle()

    ){

        return;

    }



    if(

        weatherTemperature

        === "--"

    ){

        return;

    }



    let temperature =

    parseInt(

        weatherTemperature

    );



    if(

        temperature <= 0

    ){

        vehicleSettings.range =

        Math.round(

            vehicleSettings.range

            * 0.90

        );

    }



    if(

        temperature >= 35

    ){

        vehicleSettings.range =

        Math.round(

            vehicleSettings.range

            * 0.95

        );

    }


}

/********************************/
/******** PAUSES CONSEILLÉES ****/
/********************************/


function recommendBreak(){


    if(

        !navigationStarted

    ){

        return;

    }



    if(

        navigationDuration >= 120

    ){


        showNotification(

            "Une pause est recommandée."

        );


    }


}





/********************************/
/******** STATION-SERVICE *******/
/********************************/


function recommendFuelStop(){


    if(

        !hasVehicle()

    ){

        return;

    }



    if(

        isElectricVehicle()

    ){

        return;

    }



    if(

        !hasEnoughRange()

    ){


        showNotification(

            "Un arrêt carburant est recommandé."

        );


    }


}





/********************************/
/*********** RECHARGE ***********/
/********************************/


function recommendChargingStop(){


    if(

        !isElectricVehicle()

        &&

        !isHybridVehicle()

    ){

        return;

    }



    if(

        !hasEnoughRange()

    ){


        showNotification(

            "Une recharge sera nécessaire."

        );


    }


}





/********************************/
/******** OPTIMISATION GPS ******/
/********************************/


function optimizeVehicleRoute(){


    if(

        !hasVehicle()

    ){

        return;

    }



    if(

        hasEnoughRange()

    ){

        return;

    }



    if(

        isElectricVehicle()

    ){


        showNotification(

            "Ajout recommandé d'une borne de recharge."

        );


    }


    else{


        showNotification(

            "Ajout recommandé d'une station-service."

        );


    }


}





/********************************/
/******** VÉHICULES SPÉCIAUX ****/
/********************************/


function checkSpecialVehicles(){


    if(

        isTruck()

    ){


        showNotification(

            "Pensez à vérifier les restrictions routières."

        );


    }



    if(

        isMotorhome()

    ){


        showNotification(

            "Les aires de camping-cars peuvent être proposées."

        );


    }



    if(

        isUtilityVehicle()

    ){


        showNotification(

            "Les limitations spécifiques aux utilitaires peuvent s'appliquer."

        );


    }


}





/********************************/
/******** ACTUALISATION AUTO ****/
/********************************/


function updateVehicleNavigation(){


    recommendBreak();


    recommendFuelStop();


    recommendChargingStop();


    optimizeVehicleRoute();


    checkSpecialVehicles();


}

/********************************/
/*********** SAUVEGARDE *********/
/********************************/


function saveVehicles(){


    localStorage.setItem(

        "clemmapsVehicles",

        JSON.stringify(

            vehicles

        )

    );


}




function loadVehicles(){


    vehicles =

    JSON.parse(

        localStorage.getItem(

            "clemmapsVehicles"

        )

    )

    || [];


}





/********************************/
/******** VÉHICULE ACTUEL *******/
/********************************/


function saveVehicleSettings(){


    localStorage.setItem(

        "clemmapsCurrentVehicle",

        JSON.stringify(

            vehicleSettings

        )

    );


}




function loadVehicleSettings(){


    let settings =

    JSON.parse(

        localStorage.getItem(

            "clemmapsCurrentVehicle"

        )

    );



    if(!settings){

        return;

    }



    vehicleSettings =

    settings;



    if(

        vehicleSettings.name

        !==

        "Aucun véhicule"

    ){

        vehicleSelected =

        true;


    }


}





/********************************/
/*********** AFFICHAGE **********/
/********************************/


function displayVehicleName(){


    let name =

    document.getElementById(

        "vehicleName"

    );



    if(!name){

        return;

    }



    name.innerHTML =

    vehicleSettings.name;


}




function displayVehicleType(){


    let fuel =

    document.getElementById(

        "vehicleFuel"

    );



    if(!fuel){

        return;

    }



    fuel.innerHTML =

    vehicleSettings.type;


}




function displayVehicleRange(){


    let range =

    document.getElementById(

        "vehicleRange"

    );



    if(!range){

        return;

    }



    range.innerHTML =

    calculateRemainingRange()

    +

    " km";


}





/********************************/
/******** MISE À JOUR AUTO ******/
/********************************/


function refreshVehicleInformations(){


    displayVehicleName();


    displayVehicleType();


    displayVehicleRange();


}

/********************************/
/******** SYNCHRONISATION *******/
/********************************/


function synchronizeVehicleModule(){


    refreshVehicleInformations();


    updateVehicleNavigation();


}




/********************************/
/******** ACTUALISATION *********/
/********************************/


function refreshVehicle(){


    if(

        !hasVehicle()

    ){

        return;

    }


    applyWeatherImpact();


    synchronizeVehicleModule();


}





/********************************/
/******** BOUCLE VÉHICULE *******/
/********************************/


setInterval(

    function(){


        refreshVehicle();


    },

    10000

);





/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeVehicleModule(){


    initializeVehicle();


    refreshVehicleInformations();



    console.log(

        "Module véhicule prêt."

    );


}





/********************************/
/******** AUTO CHARGEMENT *******/
/********************************/


window.addEventListener(

    "load",

    function(){


        initializeVehicleModule();


    }

);





/********************************/
/******** SAUVEGARDE AUTO *******/
/********************************/


window.addEventListener(

    "beforeunload",

    function(){


        saveVehicleSettings();


        saveVehicles();


    }

);





/********************************/
/*********** UTILITAIRES ********/
/********************************/


function getCurrentVehicle(){


    return (

        currentVehicle

    );


}




function getVehicles(){


    return (

        vehicles

    );


}




function vehicleReady(){


    return (

        hasVehicle()

    );


}





/********************************/
/******** FIN VEHICLE.JS ********/
/********************************/

/*

Fonctionnalités :

- Nombre illimité de véhicules ;
- Aucun véhicule imposé au démarrage ;
- Voitures thermiques ;
- Voitures électriques ;
- Voitures hybrides ;
- Motos ;
- Scooters ;
- Vélos ;
- Vélos électriques ;
- Camping-cars ;
- Utilitaires ;
- Camions ;
- Calcul de l'autonomie ;
- Coût estimé des trajets ;
- Pauses recommandées ;
- Stations-service ;
- Bornes de recharge ;
- Optimisation des trajets ;
- Sauvegarde automatique ;
- Synchronisation GPS ;
- Synchronisation navigation ;
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
 vehicle.js
      ↓
 navigation.js
      ↓
    gps.js
      ↓
 weather.js
      ↓
 traffic.js
      ↓
 localStorage
      ↓
 pages/vehicle.html
      ↓
    Vercel

*/