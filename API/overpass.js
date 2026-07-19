/********************************/
/*********** OVERPASS ***********/
/********************************/
/*
API Points d'intérêt

OpenStreetMap Overpass

Fonctions :
- Restaurants
- Hôtels
- Parkings
- Stations-service
- Bornes électriques
- Magasins
*/


const OVERPASS_URL =

"https://overpass-api.de/api/interpreter";





/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeOverpass(){


    console.log(

        "API Overpass prête."

    );


}





/********************************/
/******** RECHERCHE GÉNÉRALE ****/
/********************************/


async function searchOverpass(


    query


){


    try{


        let response =

        await fetch(

            OVERPASS_URL,

            {

                method:

                "POST",


                body:

                query

            }

        );



        let data =

        await response.json();



        return data.elements || [];


    }


    catch(error){


        console.log(

            "Erreur Overpass :",

            error

        );



        return [];


    }


}





/********************************/
/******** CRÉATION REQUÊTE ******/
/********************************/


function createAroundQuery(


    type,

    latitude,

    longitude,

    radius = 1000


){


    return `

    [out:json];


    (

        node

        ["amenity"="${type}"]

        (around:${radius},

        ${latitude},

        ${longitude});


    );


    out;

    `;


}

/********************************/
/******** RESTAURANTS ***********/
/********************************/


async function searchRestaurants(


    latitude,

    longitude


){


    let query =

    createAroundQuery(

        "restaurant",

        latitude,

        longitude,

        2000

    );



    return await searchOverpass(

        query

    );


}





/********************************/
/************ HÔTELS ************/
/********************************/


async function searchHotels(


    latitude,

    longitude


){


    let query =

    createAroundQuery(

        "hotel",

        latitude,

        longitude,

        5000

    );



    return await searchOverpass(

        query

    );


}





/********************************/
/*********** PARKINGS ***********/
/********************************/


async function searchParking(


    latitude,

    longitude


){


    let query =

    `

    [out:json];


    node

    ["amenity"="parking"]

    (around:3000,

    ${latitude},

    ${longitude});


    out;


    `;



    return await searchOverpass(

        query

    );


}





/********************************/
/******** STATIONS ESSENCE ******/
/********************************/


async function searchFuelStations(


    latitude,

    longitude


){


    let query =

    `

    [out:json];


    node

    ["amenity"="fuel"]

    (around:5000,

    ${latitude},

    ${longitude});


    out;


    `;



    return await searchOverpass(

        query

    );


}





/********************************/
/******** BORNES ÉLECTRIQUES ****/
/********************************/


async function searchChargingStations(


    latitude,

    longitude


){


    let query =

    `

    [out:json];


    node

    ["amenity"="charging_station"]

    (around:5000,

    ${latitude},

    ${longitude});


    out;


    `;



    return await searchOverpass(

        query

    );


}

/********************************/
/******** SUPERMARCHÉS **********/
/********************************/


async function searchShops(


    latitude,

    longitude


){


    let query =

    `

    [out:json];


    (

        node

        ["shop"="supermarket"]

        (around:5000,

        ${latitude},

        ${longitude});


    );


    out;


    `;



    return await searchOverpass(

        query

    );


}





/********************************/
/******** FORMAT RÉSULTATS ******/
/********************************/


function formatPOIResults(


    results


){


    return results.map(


        function(place){


            return {


                id:

                place.id,


                name:

                place.tags?.name

                ||

                "Lieu sans nom",


                latitude:

                place.lat,


                longitude:

                place.lon,


                type:

                place.tags?.amenity

                ||

                place.tags?.shop

                ||

                "unknown"


            };


        }


    );


}





/********************************/
/******** MARQUEURS CARTE *******/
/********************************/


function addPOIMarker(


    place


){


    if(

        !map

    ){

        return;

    }



    let marker =

    L.marker(

        [

            place.latitude,

            place.longitude

        ]

    )

    .addTo(

        map

    );



    marker.bindPopup(

        `

        <b>

        ${place.name}

        </b>

        <br>

        ${place.type}

        `

    );



    return marker;


}





/********************************/
/******** AFFICHAGE MULTIPLE ****/
/********************************/


function displayPOIResults(


    results


){


    let places =

    formatPOIResults(

        results

    );



    places.forEach(


        function(place){


            addPOIMarker(

                place

            );


        }


    );


}

/********************************/
/******** RECHERCHE CLEMMAPS ****/
/********************************/


async function searchNearby(


    type,

    latitude,

    longitude


){


    let results = [];



    switch(type){


        case "restaurant":


            results =

            await searchRestaurants(

                latitude,

                longitude

            );


        break;




        case "hotel":


            results =

            await searchHotels(

                latitude,

                longitude

            );


        break;




        case "parking":


            results =

            await searchParking(

                latitude,

                longitude

            );


        break;




        case "fuel":


            results =

            await searchFuelStations(

                latitude,

                longitude

            );


        break;




        case "charging":


            results =

            await searchChargingStations(

                latitude,

                longitude

            );


        break;




        case "shop":


            results =

            await searchShops(

                latitude,

                longitude

            );


        break;



        default:


            showNotification(

                "Catégorie inconnue."

            );


            return;


    }



    if(

        results.length === 0

    ){


        showNotification(

            "Aucun résultat trouvé."

        );


        return;


    }



    displayPOIResults(

        results

    );



    showNotification(

        results.length

        +

        " lieu(x) trouvé(s)."

    );


}





/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeOverpassAPI(){


    initializeOverpass();



    console.log(

        "API Overpass chargée."

    );


}





/********************************/
/******** AUTO CHARGEMENT *******/
/********************************/


window.addEventListener(

    "load",

    function(){


        initializeOverpassAPI();


    }

);





/********************************/
/******** FIN OVERPASS.JS *******/
/********************************/

/*

API Overpass :

Fonctionnalités :

- Restaurants ;
- Hôtels ;
- Parkings ;
- Stations-service ;
- Bornes électriques ;
- Supermarchés ;
- Points d'intérêt ;
- Marqueurs Leaflet ;
- Recherche autour GPS ;
- Connexion Explorer ClemMaps.


Architecture :

script.js
      ↓
searchCategory()
      ↓
overpass.js
      ↓
OpenStreetMap
      ↓
Points d'intérêt
      ↓
Leaflet
      ↓
Carte ClemMaps

*/