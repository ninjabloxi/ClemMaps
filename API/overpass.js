/********************************/
/*********** CLEMMAPS ***********/
/*********** OVERPASS ***********/
/********************************/


"use strict";




/********************************/
/*********** VERSION ************/
/********************************/


const OVERPASS_VERSION =

"2.0";



const OVERPASS_NAME =

"ClemMaps";




/********************************/
/************* API **************/
/********************************/


const OVERPASS_URL =

"https://overpass-api.de/api/interpreter";



const OVERPASS_TIMEOUT =

25000;



const OVERPASS_RADIUS =

5000;



const OVERPASS_MAX_RESULTS =

100;





/********************************/
/************ GPS ***************/
/********************************/


let currentLatitude =

null;



let currentLongitude =

null;



let currentAccuracy =

null;




/********************************/
/*********** CARTE **************/
/********************************/


let currentMap =

null;



let currentZoom =

16;



let currentMarkers =

[];



let currentCircle =

null;



let currentLayer =

null;





/********************************/
/*********** ÉTAT API ***********/
/********************************/


let overpassLoaded =

false;



let overpassSearching =

false;



let overpassConnected =

false;



let lastSearchDate =

null;




/********************************/
/************ FILTRES ***********/
/********************************/


let searchRadius =

OVERPASS_RADIUS;



let searchLimit =

OVERPASS_MAX_RESULTS;



let searchLanguage =

"fr";



let searchCountry =

"France";




/********************************/
/*********** CATÉGORIES *********/
/********************************/


const SEARCH_TYPES = {


    restaurants:

    '["amenity"="restaurant"]',



    hotels:

    '["tourism"="hotel"]',



    parkings:

    '["amenity"="parking"]',



    fuel:

    '["amenity"="fuel"]',



    charging:

    '["amenity"="charging_station"]',



    pharmacy:

    '["amenity"="pharmacy"]',



    hospital:

    '["amenity"="hospital"]',



    supermarket:

    '["shop"="supermarket"]',



    bank:

    '["amenity"="bank"]',



    police:

    '["amenity"="police"]',



    post:

    '["amenity"="post_office"]',



    cinema:

    '["amenity"="cinema"]',



    school:

    '["amenity"="school"]',



    cafe:

    '["amenity"="cafe"]',



    fastfood:

    '["amenity"="fast_food"]',



    airport:

    '["aeroway"="aerodrome"]',



    bus:

    '["highway"="bus_stop"]',



    train:

    '["railway"="station"]',



    museum:

    '["tourism"="museum"]',



    attraction:

    '["tourism"="attraction"]'


};




/********************************/
/*********** STATISTIQUES *******/
/********************************/


let totalRequests =

0;



let successfulRequests =

0;



let failedRequests =

0;



let totalMarkers =

0;



let totalPlacesFound =

0;





/********************************/
/*********** INITIALISATION *****/
/********************************/


function initializeOverpass(){


    overpassLoaded = true;



    console.log(

        "ClemMaps Overpass chargé."

    );



    return true;


}





/********************************/
/************* TEST *************/
/********************************/


function isOverpassReady(){


    return overpassLoaded;


}




function isSearching(){


    return overpassSearching;


}




function getOverpassVersion(){


    return OVERPASS_VERSION;


}




function getSearchRadius(){


    return searchRadius;


}




function setSearchRadius(


radius


){


    searchRadius = radius;


}




function getTotalRequests(){


    return totalRequests;


}

/********************************/
/*********** REQUÊTES ***********/
/********************************/


function createOverpassQuery(

type,
latitude,
longitude,
radius = searchRadius

){


    return `

    [out:json]
    [timeout:25];

    (

    node${type}
    (around:${radius},
    ${latitude},
    ${longitude});


    way${type}
    (around:${radius},
    ${latitude},
    ${longitude});


    relation${type}
    (around:${radius},
    ${latitude},
    ${longitude});

    );

    out center ${searchLimit};

    `;


}





/********************************/
/*********** VALIDATION *********/
/********************************/


function isValidCoordinates(

latitude,
longitude

){


    if(

        latitude === null ||

        longitude === null

    ){

        return false;

    }



    if(

        latitude > 90 ||

        latitude < -90

    ){

        return false;

    }



    if(

        longitude > 180 ||

        longitude < -180

    ){

        return false;

    }



    return true;


}





/********************************/
/*********** CONNEXION **********/
/********************************/


async function connectOverpass(){


    try{


        let response =

        await fetch(

            OVERPASS_URL,

            {

                method:"POST",

                body:

                "[out:json];node(50,3,50,3);out;"

            }

        );



        overpassConnected =

        response.ok;



        return overpassConnected;



    }


    catch(error){


        overpassConnected =

        false;



        console.error(

            "Connexion Overpass impossible.",

            error

        );



        return false;


    }


}





/********************************/
/*********** REQUÊTE API ********/
/********************************/


async function executeQuery(

query

){


    overpassSearching =

    true;



    totalRequests++;



    try{


        const controller =

        new AbortController();



        const timeout =

        setTimeout(

            ()=>{


                controller.abort();

            },

            OVERPASS_TIMEOUT

        );




        const response =

        await fetch(

            OVERPASS_URL,

            {

                method:"POST",

                body:query,

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

                "Erreur API."

            );

        }




        const data =

        await response.json();



        successfulRequests++;



        lastSearchDate =

        new Date();



        overpassSearching =

        false;



        return data;



    }


    catch(error){


        failedRequests++;



        overpassSearching =

        false;



        console.error(

            "Erreur Overpass :",


            error

        );



        return null;


    }


}





/********************************/
/*********** FORMATAGE **********/
/********************************/


function getPlaceName(


place


){


    return (


        place.tags?.name ||

        "Lieu inconnu"


    );


}




function getPlaceLatitude(

place

){


    return (


        place.lat ||

        place.center?.lat ||

        null


    );


}




function getPlaceLongitude(

place

){


    return (


        place.lon ||

        place.center?.lon ||

        null


    );


}




function getPlaceType(

place

){


    return (


        place.tags?.amenity ||

        place.tags?.tourism ||

        place.tags?.shop ||

        "unknown"


    );


}





/********************************/
/*********** FORMAT FINAL *******/
/********************************/


function formatResults(

places

){


    if(

        !places

    ){

        return [];

    }



    return places.map(


        place=>{


            return{


                name:

                getPlaceName(

                    place

                ),



                latitude:

                getPlaceLatitude(

                    place

                ),



                longitude:

                getPlaceLongitude(

                    place

                ),



                type:

                getPlaceType(

                    place

                ),



                raw:

                place


            };


        }


    );


}

/********************************/
/******** RESTAURANTS ***********/
/********************************/


async function searchRestaurants(

latitude,
longitude

){


    if(

        !isValidCoordinates(

            latitude,

            longitude

        )

    ){

        return [];

    }



    const query =

    createOverpassQuery(

        SEARCH_TYPES.restaurants,

        latitude,

        longitude

    );



    const data =

    await executeQuery(

        query

    );



    if(

        !data

    ){

        return [];

    }



    totalPlacesFound +=

    data.elements.length;



    return formatResults(

        data.elements

    );


}





/********************************/
/*********** HÔTELS *************/
/********************************/


async function searchHotels(

latitude,
longitude

){


    if(

        !isValidCoordinates(

            latitude,

            longitude

        )

    ){

        return [];

    }



    const query =

    createOverpassQuery(

        SEARCH_TYPES.hotels,

        latitude,

        longitude

    );



    const data =

    await executeQuery(

        query

    );



    if(

        !data

    ){

        return [];

    }



    totalPlacesFound +=

    data.elements.length;



    return formatResults(

        data.elements

    );


}





/********************************/
/*********** PARKINGS ***********/
/********************************/


async function searchParkings(

latitude,
longitude

){


    if(

        !isValidCoordinates(

            latitude,

            longitude

        )

    ){

        return [];

    }



    const query =

    createOverpassQuery(

        SEARCH_TYPES.parkings,

        latitude,

        longitude

    );



    const data =

    await executeQuery(

        query

    );



    if(

        !data

    ){

        return [];

    }



    totalPlacesFound +=

    data.elements.length;



    return formatResults(

        data.elements

    );


}





/********************************/
/******** STATIONS-SERVICE ******/
/********************************/


async function searchFuelStations(

latitude,
longitude

){


    if(

        !isValidCoordinates(

            latitude,

            longitude

        )

    ){

        return [];

    }



    const query =

    createOverpassQuery(

        SEARCH_TYPES.fuel,

        latitude,

        longitude

    );



    const data =

    await executeQuery(

        query

    );



    if(

        !data

    ){

        return [];

    }



    totalPlacesFound +=

    data.elements.length;



    return formatResults(

        data.elements

    );


}





/********************************/
/******** BORNES ÉLECTRIQUES ****/
/********************************/


async function searchChargingStations(

latitude,
longitude

){


    if(

        !isValidCoordinates(

            latitude,

            longitude

        )

    ){

        return [];

    }



    const query =

    createOverpassQuery(

        SEARCH_TYPES.charging,

        latitude,

        longitude

    );



    const data =

    await executeQuery(

        query

    );



    if(

        !data

    ){

        return [];

    }



    totalPlacesFound +=

    data.elements.length;



    return formatResults(

        data.elements

    );


}





/********************************/
/******** RECHERCHE PERSONNALISÉ */
/********************************/


async function searchCustomPlace(

type,

latitude,

longitude

){


    if(

        !SEARCH_TYPES[type]

    ){

        return [];

    }



    const query =

    createOverpassQuery(

        SEARCH_TYPES[type],

        latitude,

        longitude

    );



    const data =

    await executeQuery(

        query

    );



    if(

        !data

    ){

        return [];

    }



    return formatResults(

        data.elements

    );


}

/********************************/
/********* PHARMACIES ***********/
/********************************/


async function searchPharmacies(

latitude,
longitude

){


    if(

        !isValidCoordinates(

            latitude,
            longitude

        )

    ){

        return [];

    }



    const query =

    createOverpassQuery(

        SEARCH_TYPES.pharmacy,

        latitude,

        longitude

    );



    const data =

    await executeQuery(

        query

    );



    if(

        !data

    ){

        return [];

    }



    totalPlacesFound +=

    data.elements.length;



    return formatResults(

        data.elements

    );


}





/********************************/
/*********** HÔPITAUX ***********/
/********************************/


async function searchHospitals(

latitude,
longitude

){


    if(

        !isValidCoordinates(

            latitude,
            longitude

        )

    ){

        return [];

    }



    const query =

    createOverpassQuery(

        SEARCH_TYPES.hospital,

        latitude,

        longitude

    );



    const data =

    await executeQuery(

        query

    );



    if(

        !data

    ){

        return [];

    }



    totalPlacesFound +=

    data.elements.length;



    return formatResults(

        data.elements

    );


}





/********************************/
/************ BANQUES ***********/
/********************************/


async function searchBanks(

latitude,
longitude

){


    if(

        !isValidCoordinates(

            latitude,
            longitude

        )

    ){

        return [];

    }



    const query =

    createOverpassQuery(

        SEARCH_TYPES.bank,

        latitude,

        longitude

    );



    const data =

    await executeQuery(

        query

    );



    if(

        !data

    ){

        return [];

    }



    totalPlacesFound +=

    data.elements.length;



    return formatResults(

        data.elements

    );


}





/********************************/
/******** SUPERMARCHÉS **********/
/********************************/


async function searchSupermarkets(

latitude,
longitude

){


    if(

        !isValidCoordinates(

            latitude,
            longitude

        )

    ){

        return [];

    }



    const query =

    createOverpassQuery(

        SEARCH_TYPES.supermarket,

        latitude,

        longitude

    );



    const data =

    await executeQuery(

        query

    );



    if(

        !data

    ){

        return [];

    }



    totalPlacesFound +=

    data.elements.length;



    return formatResults(

        data.elements

    );


}





/********************************/
/************* CAFÉS ************/
/********************************/


async function searchCafes(

latitude,
longitude

){


    if(

        !isValidCoordinates(

            latitude,
            longitude

        )

    ){

        return [];

    }



    const query =

    createOverpassQuery(

        SEARCH_TYPES.cafe,

        latitude,

        longitude

    );



    const data =

    await executeQuery(

        query

    );



    if(

        !data

    ){

        return [];

    }



    return formatResults(

        data.elements

    );


}





/********************************/
/*********** FAST-FOODS *********/
/********************************/


async function searchFastFoods(

latitude,
longitude

){


    if(

        !isValidCoordinates(

            latitude,
            longitude

        )

    ){

        return [];

    }



    const query =

    createOverpassQuery(

        SEARCH_TYPES.fastfood,

        latitude,

        longitude

    );



    const data =

    await executeQuery(

        query

    );



    if(

        !data

    ){

        return [];

    }



    return formatResults(

        data.elements

    );


}





/********************************/
/************* MUSÉES ***********/
/********************************/


async function searchMuseums(

latitude,
longitude

){


    if(

        !isValidCoordinates(

            latitude,
            longitude

        )

    ){

        return [];

    }



    const query =

    createOverpassQuery(

        SEARCH_TYPES.museum,

        latitude,

        longitude

    );



    const data =

    await executeQuery(

        query

    );



    if(

        !data

    ){

        return [];

    }



    return formatResults(

        data.elements

    );


}





/********************************/
/*********** ATTRACTIONS ********/
/********************************/


async function searchAttractions(

latitude,
longitude

){


    if(

        !isValidCoordinates(

            latitude,
            longitude

        )

    ){

        return [];

    }



    const query =

    createOverpassQuery(

        SEARCH_TYPES.attraction,

        latitude,

        longitude

    );



    const data =

    await executeQuery(

        query

    );



    if(

        !data

    ){

        return [];

    }



    return formatResults(

        data.elements

    );


}





/********************************/
/******** RECHERCHE MULTIPLE ****/
/********************************/


async function searchNearbyServices(

latitude,
longitude

){


    const results =

    await Promise.all([

        searchRestaurants(

            latitude,
            longitude

        ),

        searchFuelStations(

            latitude,
            longitude

        ),

        searchParkings(

            latitude,
            longitude

        ),

        searchPharmacies(

            latitude,
            longitude

        ),

        searchChargingStations(

            latitude,
            longitude

        )

    ]);



    return{


        restaurants:

        results[0],



        fuel:

        results[1],



        parkings:

        results[2],



        pharmacies:

        results[3],



        charging:

        results[4]


    };


}

/********************************/
/*********** MARQUEURS **********/
/********************************/


function clearMarkers(){


    if(

        !currentMarkers.length

    ){

        return;

    }



    currentMarkers.forEach(


        marker=>{


            if(

                currentMap

            ){

                currentMap.removeLayer(

                    marker

                );

            }


        }


    );



    currentMarkers = [];


    totalMarkers = 0;


}





/********************************/
/******** SUPPRESSION CERCLE ****/
/********************************/


function clearCircle(){


    if(

        currentCircle &&

        currentMap

    ){


        currentMap.removeLayer(

            currentCircle

        );


    }



    currentCircle =

    null;


}





/********************************/
/************ CARTE *************/
/********************************/


function setCurrentMap(


map


){


    currentMap =

    map;


}




function getCurrentMap(){


    return currentMap;


}





/********************************/
/************ ZOOM **************/
/********************************/


function setCurrentZoom(


zoom


){


    currentZoom =

    zoom;


}




function getCurrentZoom(){


    return currentZoom;


}





/********************************/
/*********** ICÔNES *************/
/********************************/


function getMarkerIcon(


type


){


    switch(type){


        case "restaurant":

            return "🍽️";


        case "hotel":

            return "🏨";


        case "parking":

            return "🅿️";


        case "fuel":

            return "⛽";


        case "charging_station":

            return "⚡";


        case "hospital":

            return "🏥";


        case "pharmacy":

            return "💊";


        case "bank":

            return "🏦";


        case "supermarket":

            return "🛒";


        case "museum":

            return "🏛️";


        case "cafe":

            return "☕";


        case "fast_food":

            return "🍔";


        default:

            return "📍";


    }


}





/********************************/
/*********** POPUPS *************/
/********************************/


function createPopup(


place


){


    return `


    <b>

    ${getMarkerIcon(

        place.type

    )}

    ${place.name}

    </b>


    <br><br>


    Latitude :

    ${place.latitude}


    <br>


    Longitude :

    ${place.longitude}


    <br><br>


    Type :

    ${place.type}


    `;


}





/********************************/
/******** AFFICHAGE LIEUX *******/
/********************************/


function displayPlacesOnMap(


places


){


    if(

        !currentMap ||

        !places.length

    ){

        return;

    }



    clearMarkers();



    places.forEach(


        place=>{


            if(

                !place.latitude ||

                !place.longitude

            ){

                return;

            }



            const marker =


            L.marker(

                [

                    place.latitude,

                    place.longitude

                ]

            )

            .addTo(

                currentMap

            )

            .bindPopup(

                createPopup(

                    place

                )

            );




            currentMarkers.push(

                marker

            );



            totalMarkers++;


        }


    );


}





/********************************/
/*********** ZONE GPS ***********/
/********************************/


function displaySearchRadius(


latitude,

longitude


){


    if(

        !currentMap

    ){

        return;

    }



    clearCircle();




    currentCircle =


    L.circle(

        [

            latitude,

            longitude

        ],

        {


            radius:

            searchRadius,



            weight:2,



            fillOpacity:

            0.15


        }

    )

    .addTo(

        currentMap

    );


}





/********************************/
/*********** RECADRAGE **********/
/********************************/


function centerOnPlaces(){


    if(

        !currentMarkers.length ||

        !currentMap

    ){

        return;

    }



    const group =


    L.featureGroup(

        currentMarkers

    );



    currentMap.fitBounds(


        group.getBounds(),


        {

            padding:[

                50,

                50

            ]

        }


    );


}





/********************************/
/*********** STATISTIQUES *******/
/********************************/


function getTotalMarkers(){


    return totalMarkers;


}




function getPlacesFound(){


    return totalPlacesFound;


}




function getFailedRequests(){


    return failedRequests;


}




function getSuccessfulRequests(){


    return successfulRequests;


}

/********************************/
/*********** DISTANCES **********/
/********************************/


function calculateDistance(

lat1,
lon1,
lat2,
lon2

){


    const R =

    6371000;



    const dLat =

    (lat2-lat1)

    *

    Math.PI/180;



    const dLon =

    (lon2-lon1)

    *

    Math.PI/180;



    const a =


    Math.sin(

        dLat/2

    )

    *

    Math.sin(

        dLat/2

    )

    +

    Math.cos(

        lat1 *

        Math.PI/180

    )

    *

    Math.cos(

        lat2 *

        Math.PI/180

    )

    *

    Math.sin(

        dLon/2

    )

    *

    Math.sin(

        dLon/2

    );



    const c =


    2 *

    Math.atan2(

        Math.sqrt(a),

        Math.sqrt(

            1-a

        )

    );



    return (

        R*c

    );


}





/********************************/
/******** FORMAT DISTANCE *******/
/********************************/


function formatDistance(


meters


){


    if(

        meters >= 1000

    ){


        return (


            meters / 1000


        )

        .toFixed(1)

        +

        " km";


    }



    return (


        Math.round(

            meters

        )

        +

        " m"


    );


}





/********************************/
/********* TRI DISTANCES ********/
/********************************/


function sortByDistance(

places,

latitude,

longitude

){


    return places.sort(


        (a,b)=>{


            const distanceA =

            calculateDistance(

                latitude,

                longitude,

                a.latitude,

                a.longitude

            );



            const distanceB =

            calculateDistance(

                latitude,

                longitude,

                b.latitude,

                b.longitude

            );



            return (


                distanceA -

                distanceB


            );


        }


    );


}





/********************************/
/******** DISTANCE UTILISATEUR **/
/********************************/


function addDistanceToPlaces(

places,

latitude,

longitude

){


    return places.map(


        place=>{


            place.distance =

            calculateDistance(


                latitude,

                longitude,


                place.latitude,

                place.longitude


            );



            place.formattedDistance =

            formatDistance(


                place.distance


            );



            return place;


        }


    );


}





/********************************/
/************* FAVORIS **********/
/********************************/


let favoritePlaces =

[];



function addFavorite(

place

){


    favoritePlaces.push(

        place

    );


}




function removeFavorite(

name

){


    favoritePlaces =


    favoritePlaces.filter(


        place=>{


            return (

                place.name !==

                name

            );


        }


    );


}




function getFavorites(){


    return favoritePlaces;


}




function clearFavorites(){


    favoritePlaces = [];


}





/********************************/
/************ FILTRES ***********/
/********************************/


function getNearestPlaces(

places,

maximum = 20

){


    return places.slice(

        0,

        maximum

    );


}





/********************************/
/*********** STATISTIQUES *******/
/********************************/


function getAverageDistance(

places

){


    if(

        !places.length

    ){

        return 0;

    }



    let total = 0;



    places.forEach(


        place=>{


            total +=

            place.distance ||

            0;


        }


    );



    return (


        total /

        places.length


    );


}





/********************************/
/*********** GPS INTELLIGENT ****/
/********************************/


function updateGPSPosition(

latitude,

longitude,

accuracy = null

){


    currentLatitude =

    latitude;



    currentLongitude =

    longitude;



    currentAccuracy =

    accuracy;


}




function getGPSLatitude(){


    return currentLatitude;


}




function getGPSLongitude(){


    return currentLongitude;


}




function getGPSAccuracy(){


    return currentAccuracy;


}





/********************************/
/************* TESTS ************/
/********************************/


function hasGPSPosition(){


    return (


        currentLatitude !==

        null &&


        currentLongitude !==

        null


    );


}

/********************************/
/******** AUTOUR DE MOI *********/
/********************************/


let aroundMeEnabled =

false;



let aroundMeResults =

[];



function enableAroundMe(){


    aroundMeEnabled =

    true;


}




function disableAroundMe(){


    aroundMeEnabled =

    false;


}




function isAroundMeEnabled(){


    return aroundMeEnabled;


}





/********************************/
/******** RECHERCHE GPS *********/
/********************************/


async function searchAroundMe(){


    if(

        !hasGPSPosition()

    ){

        return [];

    }



    const results =


    await searchNearbyServices(


        currentLatitude,

        currentLongitude


    );



    aroundMeResults =

    results;



    return results;


}





/********************************/
/*********** CACHE **************/
/********************************/


let searchCache =

new Map();



function addToCache(

key,

value

){


    searchCache.set(

        key,

        {

            value:value,



            date:

            Date.now()

        }

    );


}




function getFromCache(

key

){


    if(

        !searchCache.has(

            key

        )

    ){

        return null;

    }



    return searchCache

    .get(

        key

    )

    .value;


}




function clearCache(){


    searchCache.clear();


}




function getCacheSize(){


    return (

        searchCache.size

    );


}





/********************************/
/*********** CLÉS CACHE *********/
/********************************/


function createCacheKey(

type,

latitude,

longitude

){


    return (


        type+

        "_" +

        latitude +

        "_" +

        longitude


    );


}





/********************************/
/******** RECHERCHE CACHE *******/
/********************************/


async function searchWithCache(


type,

latitude,

longitude


){


    const key =


    createCacheKey(


        type,

        latitude,

        longitude


    );



    const cache =

    getFromCache(

        key

    );



    if(

        cache

    ){

        return cache;

    }



    const results =


    await searchCustomPlace(

        type,

        latitude,

        longitude

    );



    addToCache(


        key,

        results

    );



    return results;


}





/********************************/
/*********** GPS LIVE ***********/
/********************************/


let backgroundSearching =

false;



function enableBackgroundSearch(){


    backgroundSearching =

    true;


}




function disableBackgroundSearch(){


    backgroundSearching =

    false;


}




function isBackgroundSearchEnabled(){


    return backgroundSearching;


}





/********************************/
/*********** GPS LIVE ***********/
/********************************/


async function updateAroundMe(){


    if(

        !aroundMeEnabled

    ){

        return;

    }



    if(

        !hasGPSPosition()

    ){

        return;

    }



    await searchAroundMe();


}





/********************************/
/********* LIEUX POPULAIRES *****/
/********************************/


function getPopularPlaces(


results


){


    return{


        restaurants:

        getNearestPlaces(

            results.restaurants || []

        ),



        fuel:

        getNearestPlaces(

            results.fuel || []

        ),



        pharmacies:

        getNearestPlaces(

            results.pharmacies || []

        ),



        parkings:

        getNearestPlaces(

            results.parkings || []

        ),



        charging:

        getNearestPlaces(

            results.charging || []

        )


    };


}





/********************************/
/************ ACTUALISATION *****/
/********************************/


setInterval(


    async ()=>{


        if(

            backgroundSearching

        ){


            await updateAroundMe();


        }


    },


    30000


);





/********************************/
/*********** INFORMATIONS *******/
/********************************/


function getAroundMeResults(){


    return aroundMeResults;


}




function getLastSearchDate(){


    return lastSearchDate;


}




function isOverpassConnected(){


    return overpassConnected;


}

/********************************/
/******** NOTIFICATIONS *********/
/********************************/


let notificationsEnabled =

true;



let notificationRadius =

1000;



let notifiedPlaces =

[];



function enableNotifications(){


    notificationsEnabled =

    true;


}




function disableNotifications(){


    notificationsEnabled =

    false;


}




function areNotificationsEnabled(){


    return notificationsEnabled;


}





/********************************/
/*********** RAYON GPS **********/
/********************************/


function setNotificationRadius(

radius

){


    notificationRadius =

    radius;


}




function getNotificationRadius(){


    return (

        notificationRadius

    );


}





/********************************/
/*********** NOTIFIER ***********/
/********************************/


function sendPlaceNotification(

place

){


    if(

        !notificationsEnabled

    ){

        return;

    }



    if(

        wasAlreadyNotified(

            place.name

        )

    ){

        return;

    }



    console.log(


        "ClemMaps :",


        place.name,


        "à",


        place.formattedDistance


    );



    addNotifiedPlace(

        place.name

    );


}





/********************************/
/*********** HISTORIQUE *********/
/********************************/


function addNotifiedPlace(

name

){


    notifiedPlaces.push(

        name

    );


}




function clearNotifications(){


    notifiedPlaces = [];


}




function wasAlreadyNotified(

name

){


    return (

        notifiedPlaces.includes(

            name

        )

    );


}





/********************************/
/*********** PROXIMITÉ **********/
/********************************/


function isNearby(

distance

){


    return (


        distance <=

        notificationRadius


    );


}





/********************************/
/********* VÉRIFICATION *********/
/********************************/


function checkNearbyPlaces(

places

){


    if(

        !places.length

    ){

        return;

    }



    places.forEach(


        place=>{


            if(

                !place.distance

            ){

                return;

            }



            if(

                isNearby(

                    place.distance

                )

            ){


                sendPlaceNotification(

                    place

                );


            }


        }


    );


}





/********************************/
/************ FAVORIS ***********/
/********************************/


function isFavorite(

name

){


    return (


        favoritePlaces.some(


            place=>{


                return (


                    place.name ===

                    name


                );


            }


        )


    );


}





/********************************/
/*********** GPS LIVE ***********/
/********************************/


async function checkFavoritesNearby(


places


){


    places.forEach(


        place=>{


            if(

                isFavorite(

                    place.name

                )

            ){


                sendPlaceNotification(

                    place

                );


            }


        }


    );


}





/********************************/
/*********** ITINÉRAIRE *********/
/********************************/


let routeServices =

[];



function addServiceToRoute(

place

){


    routeServices.push(

        place

    );


}




function clearRouteServices(){


    routeServices = [];


}




function getRouteServices(){


    return routeServices;


}





/********************************/
/*********** STATIONS ***********/
/********************************/


async function searchFuelOnRoute(){


    if(

        !hasGPSPosition()

    ){

        return [];

    }



    const stations =


    await searchFuelStations(


        currentLatitude,

        currentLongitude


    );



    return getNearestPlaces(


        stations,

        5


    );


}





/********************************/
/************ BORNES ************/
/********************************/


async function searchChargingOnRoute(){


    if(

        !hasGPSPosition()

    ){

        return [];

    }



    const stations =


    await searchChargingStations(


        currentLatitude,

        currentLongitude


    );



    return getNearestPlaces(


        stations,

        5


    );


}





/********************************/
/************* GPS **************/
/********************************/


async function updateNotifications(){


    if(

        !aroundMeResults

    ){

        return;

    }



    Object.values(

        aroundMeResults

    )

    .forEach(


        places=>{


            if(

                Array.isArray(

                    places

                )

            ){


                checkNearbyPlaces(

                    places

                );


            }


        }


    );


}





/********************************/
/*********** ACTUALISATION ******/
/********************************/


setInterval(


    async ()=>{


        if(

            notificationsEnabled

        ){


            await updateNotifications();


        }


    },


    10000


);





/********************************/
/*********** STATISTIQUES *******/
/********************************/


function getNotificationCount(){


    return (

        notifiedPlaces.length

    );


}




function getFavoriteCount(){


    return (

        favoritePlaces.length

    );


}

/********************************/
/******** MODE HORS-LIGNE *******/
/********************************/


let offlineMode =

false;



let offlinePlaces =

[];



function enableOfflineMode(){


    offlineMode =

    true;


}




function disableOfflineMode(){


    offlineMode =

    false;


}




function isOfflineModeEnabled(){


    return offlineMode;


}





/********************************/
/******** SAUVEGARDE LOCALE *****/
/********************************/


function savePlacesLocally(

places

){


    try{


        localStorage.setItem(

            "ClemMapsPlaces",

            JSON.stringify(

                places

            )

        );


    }


    catch(error){


        console.error(

            error

        );


    }


}




function loadLocalPlaces(){


    try{


        const data =


        localStorage.getItem(

            "ClemMapsPlaces"

        );



        if(

            !data

        ){

            return [];

        }



        offlinePlaces =

        JSON.parse(

            data

        );



        return offlinePlaces;


    }


    catch(error){


        return [];

    }


}





/********************************/
/*********** FAVORIS ************/
/********************************/


function saveFavorites(){


    try{


        localStorage.setItem(

            "ClemMapsFavorites",

            JSON.stringify(

                favoritePlaces

            )

        );


    }


    catch(error){


        console.error(

            error

        );


    }


}




function loadFavorites(){


    try{


        const data =


        localStorage.getItem(

            "ClemMapsFavorites"

        );



        if(

            !data

        ){

            return [];

        }



        favoritePlaces =


        JSON.parse(

            data

        );



        return favoritePlaces;


    }


    catch(error){


        return [];

    }


}





/********************************/
/******** HISTORIQUE GPS ********/
/********************************/


let searchHistory =

[];



function addHistory(


search


){


    searchHistory.unshift(

        {

            value:search,



            date:

            Date.now()


        }

    );



    if(

        searchHistory.length > 50

    ){


        searchHistory.pop();


    }



    saveHistory();


}




function saveHistory(){


    localStorage.setItem(

        "ClemMapsHistory",

        JSON.stringify(

            searchHistory

        )

    );


}




function loadHistory(){


    const data =

    localStorage.getItem(

        "ClemMapsHistory"

    );



    if(

        !data

    ){

        return [];

    }



    searchHistory =


    JSON.parse(

        data

    );



    return searchHistory;


}




function clearHistory(){


    searchHistory =

    [];



    saveHistory();


}





/********************************/
/******** SYNCHRONISATION *******/
/********************************/


function synchronizeData(){


    saveFavorites();



    saveHistory();



    savePlacesLocally(

        offlinePlaces

    );


}





/********************************/
/*********** MÉMOIRE ************/
/********************************/


function clearMemory(){


    searchCache.clear();



    currentMarkers =

    [];



    offlinePlaces =

    [];



    notifiedPlaces =

    [];


}





/********************************/
/*********** CACHE GPS **********/
/********************************/


function saveLastPosition(){


    if(

        !hasGPSPosition()

    ){

        return;

    }



    localStorage.setItem(

        "ClemMapsGPS",


        JSON.stringify(


            {

                latitude:

                currentLatitude,



                longitude:

                currentLongitude,



                accuracy:

                currentAccuracy


            }


        )


    );


}




function loadLastPosition(){


    const data =


    localStorage.getItem(

        "ClemMapsGPS"

    );



    if(

        !data

    ){

        return null;

    }



    return JSON.parse(

        data

    );


}





/********************************/
/*********** DÉMARRAGE **********/
/********************************/


function initializeLocalStorage(){


    loadFavorites();


    loadHistory();


    loadLocalPlaces();


}





/********************************/
/******** ACTUALISATION *********/
/********************************/


setInterval(


    ()=>{


        synchronizeData();



        saveLastPosition();


    },


    60000


);

/********************************/
/*********** VERSION ************/
/********************************/


const CLEMMAPS_VERSION =

"1.0.0";



const CLEMMAPS_BUILD =

"2026.07.19";





/********************************/
/*********** DÉVELOPPEUR ********/
/********************************/


let developerMode =

false;



function enableDeveloperMode(){


    developerMode =

    true;



    console.log(

        "Mode développeur activé."

    );


}




function disableDeveloperMode(){


    developerMode =

    false;


}




function isDeveloperModeEnabled(){


    return developerMode;


}





/********************************/
/*********** PERFORMANCES *******/
/********************************/


let startupDate =

Date.now();



let gpsUpdates =

0;



let totalSearches =

0;



let totalNotifications =

0;



let totalRoutes =

0;



let totalErrors =

0;





/********************************/
/*********** STATISTIQUES *******/
/********************************/


function incrementGPSUpdates(){


    gpsUpdates++;


}




function incrementSearches(){


    totalSearches++;


}




function incrementNotifications(){


    totalNotifications++;


}




function incrementRoutes(){


    totalRoutes++;


}




function incrementErrors(){


    totalErrors++;


}





/********************************/
/************* UPTIME ***********/
/********************************/


function getApplicationUptime(){


    const seconds =

    Math.floor(


        (

            Date.now()

            -

            startupDate

        )

        /1000


    );



    return seconds;


}





/********************************/
/************* MÉMOIRE **********/
/********************************/


function getMemoryUsage(){


    if(

        !performance.memory

    ){

        return null;

    }



    return{


        used:

        performance.memory

        .usedJSHeapSize,



        total:

        performance.memory

        .totalJSHeapSize,



        limit:

        performance.memory

        .jsHeapSizeLimit


    };


}





/********************************/
/*********** DIAGNOSTIC *********/
/********************************/


function getDiagnostics(){


    return{


        version:

        CLEMMAPS_VERSION,



        build:

        CLEMMAPS_BUILD,



        connected:

        overpassConnected,



        searches:

        totalSearches,



        requests:

        totalRequests,



        success:

        successfulRequests,



        failed:

        failedRequests,



        markers:

        totalMarkers,



        places:

        totalPlacesFound,



        routes:

        totalRoutes,



        gpsUpdates:

        gpsUpdates,



        notifications:

        totalNotifications,



        favorites:

        favoritePlaces.length,



        cache:

        getCacheSize(),



        offline:

        offlineMode



    };


}





/********************************/
/*********** GPS STATUS *********/
/********************************/


function getGPSStatus(){


    return{


        enabled:

        hasGPSPosition(),



        latitude:

        currentLatitude,



        longitude:

        currentLongitude,



        accuracy:

        currentAccuracy,



        radius:

        searchRadius


    };


}





/********************************/
/*********** OVERPASS ***********/
/********************************/


function getOverpassStatus(){


    return{


        loaded:

        overpassLoaded,



        connected:

        overpassConnected,



        searching:

        overpassSearching,



        version:

        OVERPASS_VERSION,



        requests:

        totalRequests,



        success:

        successfulRequests,



        failed:

        failedRequests


    };


}





/********************************/
/*********** EXPORT *************/
/********************************/


function exportDiagnostics(){


    const diagnostics =


    JSON.stringify(


        getDiagnostics(),


        null,


        4


    );



    console.log(

        diagnostics

    );



    return diagnostics;


}





/********************************/
/************* TESTS ************/
/********************************/


function performSystemTest(){


    return{


        GPS:

        hasGPSPosition(),



        API:

        overpassConnected,



        Cache:

        getCacheSize(),



        Notifications:

        notificationsEnabled,



        Offline:

        offlineMode,



        Developer:

        developerMode


    };


}





/********************************/
/*********** ACTUALISATION ******/
/********************************/


setInterval(


    ()=>{


        if(

            developerMode

        ){


            console.table(


                getDiagnostics()

            );


        }


    },


    30000


);

/********************************/
/******** OPTIMISATIONS *********/
/********************************/


const MAX_CACHE_SIZE =

500;



const MAX_HISTORY_SIZE =

100;



const MAX_FAVORITES =

250;



const AUTO_CLEAN_INTERVAL =

300000;



/********************************/
/*********** MÉMOIRE ************/
/********************************/


function optimizeMemory(){


    if(

        currentMarkers.length >

        1000

    ){


        clearMarkers();


    }



    if(

        searchHistory.length >

        MAX_HISTORY_SIZE

    ){


        searchHistory =

        searchHistory.slice(

            0,

            MAX_HISTORY_SIZE

        );


    }


}




/********************************/
/*********** CACHE **************/
/********************************/


function optimizeCache(){


    if(

        getCacheSize() <

        MAX_CACHE_SIZE

    ){

        return;

    }



    searchCache.clear();



    console.log(

        "Cache ClemMaps nettoyé."

    );


}





/********************************/
/*********** FAVORIS ************/
/********************************/


function optimizeFavorites(){


    if(

        favoritePlaces.length <=

        MAX_FAVORITES

    ){

        return;

    }



    favoritePlaces =

    favoritePlaces.slice(

        0,

        MAX_FAVORITES

    );



    saveFavorites();


}





/********************************/
/*********** HISTORIQUE *********/
/********************************/


function optimizeHistory(){


    if(

        searchHistory.length <=

        MAX_HISTORY_SIZE

    ){

        return;

    }



    searchHistory =

    searchHistory.slice(

        0,

        MAX_HISTORY_SIZE

    );



    saveHistory();


}





/********************************/
/*********** RÉCUPÉRATION *******/
/********************************/


function recoverAfterError(){


    try{


        clearMarkers();



        clearNotifications();



        clearRouteServices();



        overpassSearching =

        false;



        console.log(

            "Récupération effectuée."

        );


    }


    catch(error){


        console.error(

            error

        );


    }


}





/********************************/
/*********** INTERNET ***********/
/********************************/


function isOnline(){


    return navigator.onLine;


}




function checkConnection(){


    if(

        !isOnline()

    ){


        enableOfflineMode();



        return false;


    }



    disableOfflineMode();



    return true;


}





/********************************/
/************* MOBILE ***********/
/********************************/


function isMobile(){


    return /Android|iPhone|iPad/i

    .test(

        navigator.userAgent

    );


}




function isIOS(){


    return /iPhone|iPad/i

    .test(

        navigator.userAgent

    );


}




function isAndroid(){


    return /Android/i

    .test(

        navigator.userAgent

    );


}





/********************************/
/*********** LEAFLET ************/
/********************************/


function isMapLoaded(){


    return (


        currentMap !==

        null


    );


}




function checkLeaflet(){


    return (


        typeof L !==

        "undefined"


    );


}





/********************************/
/*********** GPS ***************/
/********************************/


function optimizeGPS(){


    if(

        !hasGPSPosition()

    ){

        return;

    }



    if(

        currentAccuracy >

        150

    ){


        console.warn(

            "GPS imprécis."

        );


    }


}





/********************************/
/*********** APPLICATION ********/
/********************************/


function optimizeApplication(){


    optimizeMemory();


    optimizeCache();


    optimizeHistory();


    optimizeFavorites();


    optimizeGPS();


    checkConnection();


}





/********************************/
/*********** NETTOYAGE **********/
/********************************/


function fullCleanup(){


    clearCache();


    clearNotifications();


    clearMarkers();


    clearRouteServices();


    console.log(

        "Nettoyage terminé."

    );


}





/********************************/
/*********** PERFORMANCE ********/
/********************************/


function getPerformanceStatus(){


    return{


        uptime:

        getApplicationUptime(),



        mobile:

        isMobile(),



        online:

        isOnline(),



        cache:

        getCacheSize(),



        markers:

        currentMarkers.length,



        memory:

        getMemoryUsage()


    };


}





/********************************/
/*********** ACTUALISATION ******/
/********************************/


setInterval(


    ()=>{


        optimizeApplication();


    },


    AUTO_CLEAN_INTERVAL


);





/********************************/
/************* EVENTS ***********/
/********************************/


window.addEventListener(


    "online",


    ()=>{


        disableOfflineMode();


        console.log(

            "Connexion retrouvée."

        );


    }


);




window.addEventListener(


    "offline",


    ()=>{


        enableOfflineMode();


        console.log(

            "Mode hors-ligne activé."

        );


    }


);

/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeClemMapsOverpass(){


    try{


        initializeOverpass();


        initializeLocalStorage();


        checkConnection();


        optimizeApplication();


        loadFavorites();


        loadHistory();


        loadLocalPlaces();


        console.log(

            "Overpass.js initialisé."

        );


        return true;


    }


    catch(error){


        console.error(

            "Erreur d'initialisation :",


            error

        );


        incrementErrors();


        return false;


    }


}





/********************************/
/*********** COMPATIBILITÉ ******/
/********************************/


function isNavigationReady(){


    return (


        typeof startNavigation ===

        "function"


    );


}




function isSearchReady(){


    return (


        typeof performSearch ===

        "function"


    );


}




function isOSRMReady(){


    return (


        typeof calculateRoute ===

        "function"


    );


}




function isGPSReady(){


    return (


        typeof getCurrentPosition ===

        "function"


    );


}





/********************************/
/*********** VÉRIFICATIONS ******/
/********************************/


function performStartupTests(){


    return{


        Leaflet:

        checkLeaflet(),



        GPS:

        isGPSReady(),



        Search:

        isSearchReady(),



        Navigation:

        isNavigationReady(),



        OSRM:

        isOSRMReady(),



        Internet:

        isOnline(),



        API:

        overpassConnected


    };


}





/********************************/
/*********** RAPPORT ************/
/********************************/


function printStartupReport(){


    console.table(


        performStartupTests()

    );


}




function printOverpassReport(){


    console.table({


        version:

        OVERPASS_VERSION,



        connected:

        overpassConnected,



        requests:

        totalRequests,



        success:

        successfulRequests,



        failed:

        failedRequests,



        places:

        totalPlacesFound,



        cache:

        getCacheSize(),



        favorites:

        favoritePlaces.length,



        notifications:

        getNotificationCount(),



        mobile:

        isMobile(),



        offline:

        offlineMode


    });


}





/********************************/
/*********** PARAMÈTRES *********/
/********************************/


function resetOverpassSettings(){


    searchRadius =

    OVERPASS_RADIUS;



    notificationRadius =

    1000;



    overpassSearching =

    false;



    aroundMeEnabled =

    false;



    backgroundSearching =

    false;



    developerMode =

    false;


}





/********************************/
/*********** RECHARGEMENT *******/
/********************************/


function reloadOverpass(){


    fullCleanup();



    resetOverpassSettings();



    initializeClemMapsOverpass();


}





/********************************/
/*********** EXPORTS ************/
/********************************/


window.ClemMapsOverpass = {


    searchRestaurants,

    searchHotels,

    searchParkings,

    searchFuelStations,

    searchChargingStations,

    searchPharmacies,

    searchHospitals,

    searchBanks,

    searchSupermarkets,

    searchCafes,

    searchFastFoods,

    searchMuseums,

    searchAttractions,

    searchAroundMe,

    displayPlacesOnMap,

    calculateDistance,

    getFavorites,

    addFavorite,

    removeFavorite,

    getDiagnostics,

    exportDiagnostics,

    reloadOverpass

};





/********************************/
/*********** DÉMARRAGE **********/
/********************************/


window.addEventListener(


    "load",


    async ()=>{


        initializeClemMapsOverpass();



        await connectOverpass();



        printStartupReport();



        if(

            developerMode

        ){


            printOverpassReport();


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

    "ClemMaps Overpass API"

);


console.log(

    "Version :",


    OVERPASS_VERSION

);


console.log(

    "Prêt."

);


console.log(

    "--------------------------------"

);
