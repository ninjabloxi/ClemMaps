/********************************/
/*********** RECHERCHE **********/
/********************************/


let destinationName = "";

let destinationLatitude = 0;

let destinationLongitude = 0;



let searchMarkers = [];



/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeSearch(){


    console.log(

        "Module recherche chargé."

    );


}





/********************************/
/******** DESTINATION ***********/
/********************************/


async function searchDestination(){


    let input =

    document.getElementById(

        "destination"

    );



    if(!input){

        return;

    }



    let value =

    input.value.trim();



    if(value === ""){


        showNotification(

            "Entrez une destination."

        );


        return;

    }



    destinationName =

    value;



    showNotification(

        "Recherche en cours..."

    );



    try{


        let response =

        await fetch(

            "https://nominatim.openstreetmap.org/search?format=json&limit=1&q="

            +

            encodeURIComponent(

                value

            )

        );



        let data =

        await response.json();



        if(data.length === 0){


            showNotification(

                "Aucun résultat."

            );


            return;

        }



        destinationLatitude =

        parseFloat(

            data[0].lat

        );



        destinationLongitude =

        parseFloat(

            data[0].lon

        );



        createDestinationMarker(

            destinationLatitude,

            destinationLongitude,

            destinationName

        );



        destinationSelected =

        true;



        addHistory(

            destinationName

        );



        calculateRoute();



        showRouteMenu();



        showNotification(

            "Destination trouvée."

        );


    }


    catch(error){


        console.log(error);



        showNotification(

            "Erreur de recherche."

        );


    }


}

/********************************/
/******** SUPPRESSION ***********/
/********************************/


function clearSearchMarkers(){


    searchMarkers.forEach(

        function(marker){


            if(map){


                map.removeLayer(

                    marker

                );


            }


        }

    );



    searchMarkers = [];


}





/********************************/
/*********** FAVORIS ************/
/********************************/


function addFavoriteDestination(


    destination


){



    if(

        destination === ""

    ){


        return;


    }



    if(

        favorites.includes(

            destination

        )

    ){


        showNotification(

            "Destination déjà enregistrée."

        );


        return;


    }




    favorites.push(

        destination

    );



    saveAllData();



    showNotification(

        "Favori ajouté."

    );


}






/********************************/
/*********** HISTORIQUE *********/
/********************************/


function saveSearchHistory(


    destination


){



    if(

        destination === ""

    ){


        return;


    }



    addHistory(

        destination

    );



    saveAllData();


}






/********************************/
/********* SUGGESTIONS **********/
/********************************/


function getSuggestions(){



    return [


        "Paris",


        "Londres",


        "Lille",


        "Bordeaux",


        "Marseille",


        "Disneyland Paris",


        "Aéroport Charles de Gaulle",


        "Gare du Nord",


        "Tour Eiffel",


        "Mont Saint-Michel"


    ];


}






function showSuggestions(){



    let suggestions =

    getSuggestions();



    showNotification(

        suggestions.length +

        " suggestion(s) disponible(s)."

    );


}

/********************************/
/******** RECHERCHE LIEUX *******/
/********************************/


async function searchNearby(

    category,

    latitude,

    longitude

){


    if(

        latitude === 0 ||

        longitude === 0

    ){

        showNotification(

            "Position GPS inconnue."

        );

        return;

    }



    showNotification(

        "Recherche en cours..."

    );



    clearSearchMarkers();



    try{


        let query =

        buildOverpassQuery(

            category,

            latitude,

            longitude

        );



        let response =

        await fetch(

            "https://overpass-api.de/api/interpreter",

            {

                method:"POST",

                body:query

            }

        );



        let data =

        await response.json();



        if(

            data.elements.length === 0

        ){

            showNotification(

                "Aucun résultat."

            );

            return;

        }



        displayPlaces(

            data.elements

        );



        showNotification(

            data.elements.length +

            " résultat(s) trouvé(s)."

        );


    }

    catch(error){


        console.log(

            error

        );



        showNotification(

            "Erreur de recherche."

        );


    }


}





/********************************/
/*********** OVERPASS ***********/
/********************************/


function buildOverpassQuery(

    category,

    latitude,

    longitude

){



    let value =

    category;



    if(

        category === "fuel"

    ){

        value =

        "fuel";

    }



    return `

    [out:json];

    (

        node["amenity"="${value}"]

        (around:5000,

        ${latitude},

        ${longitude});



        way["amenity"="${value}"]

        (around:5000,

        ${latitude},

        ${longitude});

    );

    out center;

    `;


}

/********************************/
/******** AFFICHAGE LIEUX *******/
/********************************/


function displayPlaces(

    places

){


    if(!map){

        return;

    }



    let bounds = [];



    places.forEach(

        function(place){



            let latitude =

            place.lat ||

            place.center.lat;



            let longitude =

            place.lon ||

            place.center.lon;



            let name =

            place.tags.name ||

            "Lieu inconnu";




            let marker =

            L.marker(

                [

                    latitude,

                    longitude

                ]

            )

            .addTo(

                map

            );




            marker.bindPopup(

                "<b>" +

                name +

                "</b>"

            );



            searchMarkers.push(

                marker

            );



            bounds.push(

                [

                    latitude,

                    longitude

                ]

            );


        }

    );




    if(

        bounds.length > 0

    ){


        map.fitBounds(

            bounds,

            {

                padding:[

                    50,

                    50

                ]

            }

        );


    }


}





/********************************/
/******** CATEGORIES ************/
/********************************/


function searchRestaurants(){


    searchNearby(

        "restaurant",

        currentPosition.latitude,

        currentPosition.longitude

    );


}




function searchHotels(){


    searchNearby(

        "hotel",

        currentPosition.latitude,

        currentPosition.longitude

    );


}




function searchParking(){


    searchNearby(

        "parking",

        currentPosition.latitude,

        currentPosition.longitude

    );


}




function searchFuelStations(){


    searchNearby(

        "fuel",

        currentPosition.latitude,

        currentPosition.longitude

    );


}




function searchChargingStations(){


    searchNearby(

        "charging_station",

        currentPosition.latitude,

        currentPosition.longitude

    );


}

/********************************/
/******** CATEGORIES BONUS ******/
/********************************/


function searchShops(){


    searchNearby(

        "supermarket",

        currentPosition.latitude,

        currentPosition.longitude

    );


}




function searchHospitals(){


    searchNearby(

        "hospital",

        currentPosition.latitude,

        currentPosition.longitude

    );


}




function searchPharmacies(){


    searchNearby(

        "pharmacy",

        currentPosition.latitude,

        currentPosition.longitude

    );


}




function searchAirports(){


    searchNearby(

        "aerodrome",

        currentPosition.latitude,

        currentPosition.longitude

    );


}




function searchTrainStations(){


    searchNearby(

        "station",

        currentPosition.latitude,

        currentPosition.longitude

    );


}





/********************************/
/******** RECHERCHE AUTO ********/
/********************************/


function searchCategory(

    category

){


    switch(category){


        case "restaurant":

            searchRestaurants();

        break;



        case "hotel":

            searchHotels();

        break;



        case "parking":

            searchParking();

        break;



        case "fuel":

            searchFuelStations();

        break;



        case "charging":

            searchChargingStations();

        break;



        case "shop":

            searchShops();

        break;



        case "hospital":

            searchHospitals();

        break;



        case "pharmacy":

            searchPharmacies();

        break;



        case "airport":

            searchAirports();

        break;



        case "station":

            searchTrainStations();

        break;



        default:


            showNotification(

                "Catégorie inconnue."

            );


        break;


    }


}

/********************************/
/******** RECHERCHE VOCALE ******/
/********************************/


function voiceSearch(){


    if(

        !("webkitSpeechRecognition"

        in window)

    ){


        showNotification(

            "Recherche vocale indisponible."

        );


        return;


    }



    let recognition =

    new webkitSpeechRecognition();



    recognition.lang =

    "fr-FR";



    recognition.start();



    recognition.onresult =

    function(event){



        let result =

        event.results[0][0]

        .transcript;



        let input =

        document.getElementById(

            "destination"

        );



        if(input){


            input.value =

            result;


        }



        searchDestination();



    };



    recognition.onerror =

    function(){


        showNotification(

            "Erreur lors de la reconnaissance vocale."

        );


    };


}





/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeSearchModule(){


    console.log(

        "Module recherche prêt."

    );


}





/********************************/
/******** COMPATIBILITÉ *********/
/********************************/


function isMobileDevice(){


    return /Android|iPhone|iPad|iPod/i

    .test(

        navigator.userAgent

    );


}




function isIPad(){


    return /iPad/i

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




function isIPhone(){


    return /iPhone/i

    .test(

        navigator.userAgent

    );


}





/********************************/
/******** AUTO CHARGEMENT *******/
/********************************/


window.addEventListener(

    "load",

    function(){


        initializeSearchModule();


    }

);





/********************************/
/******** FIN SEARCH.JS *********/
/********************************/

/*

Fonctionnalités :

- Recherche d'adresses ;
- Calcul d'itinéraires ;
- Restaurants ;
- Hôtels ;
- Parkings ;
- Stations-service ;
- Bornes électriques ;
- Hôpitaux ;
- Pharmacies ;
- Supermarchés ;
- Gares ;
- Aéroports ;
- Recherche vocale ;
- Suggestions ;
- Historique ;
- Favoris ;
- Compatible :
    - iPad ;
    - iPhone ;
    - Android ;
    - PC ;
    - Vercel.

*/
