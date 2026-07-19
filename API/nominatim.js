/********************************/
/*********** NOMINATIM **********/
/********************************/
/*
API Recherche d'adresses
OpenStreetMap Nominatim

Fonctions :
- Adresse → GPS
- GPS → Adresse
- Recherche de lieux
*/


const NOMINATIM_URL =

"https://nominatim.openstreetmap.org";





/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeNominatim(){


    console.log(

        "API Nominatim prête."

    );


}





/********************************/
/******** RECHERCHE ADRESSE *****/
/********************************/


async function searchAddress(


    query


){


    if(

        !query ||

        query.trim() === ""

    ){

        return [];

    }



    try{


        let response =

        await fetch(

            NOMINATIM_URL +

            "/search?format=json&q="

            +

            encodeURIComponent(

                query

            )

            +

            "&accept-language=fr"

        );



        let data =

        await response.json();



        return data;


    }


    catch(error){


        console.log(

            "Erreur Nominatim :",

            error

        );



        return [];


    }


}





/********************************/
/******** PREMIER RÉSULTAT ******/
/********************************/


async function findFirstAddress(


    query


){


    let results =

    await searchAddress(

        query

    );



    if(

        results.length === 0

    ){

        return null;

    }



    return results[0];


}

/********************************/
/******** GÉOCODAGE INVERSE *****/
/********************************/


async function reverseGeocode(


    latitude,

    longitude


){


    try{


        let response =

        await fetch(

            NOMINATIM_URL +

            "/reverse?format=json&lat="

            +

            latitude

            +

            "&lon="

            +

            longitude

            +

            "&accept-language=fr"

        );



        let data =

        await response.json();



        return data;


    }


    catch(error){


        console.log(

            "Erreur géocodage inverse :",

            error

        );



        return null;


    }


}





/********************************/
/******** ADRESSE FORMATTÉE *****/
/********************************/


function formatAddress(result){


    if(

        !result

    ){

        return "Adresse inconnue";

    }



    let address =

    result.address;



    if(

        !address

    ){

        return result.display_name;

    }



    let parts = [];



    if(address.house_number){

        parts.push(

            address.house_number

        );

    }



    if(address.road){

        parts.push(

            address.road

        );

    }



    if(address.city){

        parts.push(

            address.city

        );

    }



    if(address.postcode){

        parts.push(

            address.postcode

        );

    }



    return parts.join(

        ", "

    );


}





/********************************/
/******** POSITION ACTUELLE *****/
/********************************/


async function getCurrentAddress(){


    if(

        !currentPosition.latitude

    ){

        return null;

    }



    let result =

    await reverseGeocode(

        currentPosition.latitude,

        currentPosition.longitude

    );



    return formatAddress(

        result

    );


}

/********************************/
/******** RECHERCHE LOCALE ******/
/********************************/


async function searchNearbyAddress(


    latitude,

    longitude,

    radius = 1000


){


    try{


        let query =

        latitude

        +

        ","

        +

        longitude;



        let response =

        await fetch(

            NOMINATIM_URL +

            "/search?format=json&q="

            +

            encodeURIComponent(

                query

            )

            +

            "&limit=10"

        );



        let data =

        await response.json();



        return data;


    }


    catch(error){


        console.log(

            "Erreur recherche locale :",

            error

        );



        return [];


    }


}





/********************************/
/******** FORMAT RÉSULTATS ******/
/********************************/


function formatSearchResults(


    results


){


    return results.map(


        function(place){


            return {


                name:

                place.display_name,


                latitude:

                parseFloat(

                    place.lat

                ),


                longitude:

                parseFloat(

                    place.lon

                ),


                type:

                place.type || "unknown"


            };


        }


    );


}





/********************************/
/******** RECHERCHE CLEMMAPS ****/
/********************************/


async function clemMapsSearch(


    text


){


    let results =

    await searchAddress(

        text

    );



    return formatSearchResults(

        results

    );


}





/********************************/
/******** MARQUEUR CARTE ********/
/********************************/


function createSearchMarker(


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

        place.name

    );



    return marker;


}

/********************************/
/******** CONNEXION SEARCH ******/
/********************************/


async function nominatimSearch(


    query


){


    let results =

    await clemMapsSearch(

        query

    );



    if(

        results.length === 0

    ){


        showNotification(

            "Aucun résultat trouvé."

        );


        return [];


    }



    return results;


}





/********************************/
/******** ERREURS ***************/
/********************************/


function handleNominatimError(


    error


){


    console.log(

        "Nominatim error :",

        error

    );



    showNotification(

        "Erreur de recherche d'adresse."

    );


}





/********************************/
/******** LIMITATION ************/
/********************************/


function limitSearchResults(


    results,

    limit = 5


){


    return results.slice(

        0,

        limit

    );


}





/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeNominatimAPI(){


    initializeNominatim();



    console.log(

        "API Nominatim chargée."

    );


}





/********************************/
/******** AUTO CHARGEMENT *******/
/********************************/


window.addEventListener(

    "load",

    function(){


        initializeNominatimAPI();


    }

);





/********************************/
/******** FIN NOMINATIM.JS *******/
/********************************/

/*

API Nominatim :

Fonctionnalités :

- Recherche d'adresse ;
- Recherche de ville ;
- Recherche de lieux ;
- Géocodage ;
- Géocodage inverse ;
- Adresse depuis GPS ;
- Résultats formatés ;
- Marqueurs Leaflet ;
- Connexion search.js ;
- Compatible ClemMaps.


Architecture :

search.js
    ↓
nominatim.js
    ↓
OpenStreetMap Nominatim
    ↓
Coordonnées GPS
    ↓
Leaflet
    ↓
Carte ClemMaps

*/