"use strict";


/********************************/
/*********** VARIABLES **********/
/********************************/


let selectedPlace = null;

let searchResults = [];

let searchInProgress = false;




/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeSearch(){

    console.log(
        "Search.js chargé."
    );

}




/********************************/
/*********** RECHERCHE **********/
/********************************/


async function performSearch(){

    const input =

    document.getElementById(
        "searchInput"
    );


    if(

        !input ||

        !input.value.trim()

    ){

        return;

    }


    searchInProgress = true;


    try{


        const query =

        encodeURIComponent(

            input.value.trim()

        );



        const response =

        await fetch(

        "https://nominatim.openstreetmap.org/search?format=json&q="

        +

        query

        +

        "&limit=5"

        );


        const results =

        await response.json();



        searchResults =

        results;



        if(

            !results.length

        ){

            alert(

                "Aucun résultat."

            );

            return;

        }



        displaySearchResult(

            results[0]

        );


    }


    catch(error){


        console.error(

            error

        );


    }


    finally{


        searchInProgress =

        false;


    }


}





/********************************/
/*********** RÉSULTATS **********/
/********************************/


function displaySearchResult(

result

){


    if(

        !result

    ){

        return;

    }



    const latitude =

    parseFloat(

        result.lat

    );



    const longitude =

    parseFloat(

        result.lon

    );



    selectedPlace = {


        latitude,

        longitude,

        name:

        result.display_name


    };



    if(

        currentMap

    ){


        currentMap.setView(

            [

                latitude,

                longitude

            ],

            16

        );


    }



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

        result.display_name

    )

    .openPopup();


}




/********************************/
/*********** DESTINATION ********/
/********************************/


function getSelectedPlace(){

    return selectedPlace;

}



function clearSelectedPlace(){

    selectedPlace = null;

}

/********************************/
/******** RESTAURANTS ***********/
/********************************/


async function findRestaurants(){


    if(

        !hasGPSPosition()

    ){

        return;

    }



    const results =

    await searchRestaurants(

        currentLatitude,

        currentLongitude

    );



    displayPlaces(

        results

    );


}





/********************************/
/*********** HÔTELS *************/
/********************************/


async function findHotels(){


    if(

        !hasGPSPosition()

    ){

        return;

    }



    const results =

    await searchHotels(

        currentLatitude,

        currentLongitude

    );



    displayPlaces(

        results

    );


}





/********************************/
/*********** PARKINGS ***********/
/********************************/


async function findParkings(){


    if(

        !hasGPSPosition()

    ){

        return;

    }



    const results =

    await searchParkings(

        currentLatitude,

        currentLongitude

    );



    displayPlaces(

        results

    );


}





/********************************/
/******** STATIONS-SERVICE ******/
/********************************/


async function findFuel(){


    if(

        !hasGPSPosition()

    ){

        return;

    }



    const results =

    await searchFuelStations(

        currentLatitude,

        currentLongitude

    );



    displayPlaces(

        results

    );


}





/********************************/
/******** BORNES ÉLECTRIQUES ****/
/********************************/


async function findCharging(){


    if(

        !hasGPSPosition()

    ){

        return;

    }



    const results =

    await searchChargingStations(

        currentLatitude,

        currentLongitude

    );



    displayPlaces(

        results

    );


}





/********************************/
/*********** INFORMATIONS *******/
/********************************/


function getSearchResults(){

    return searchResults;

}



function isSearching(){

    return searchInProgress;

}

/********************************/
/*********** DESTINATION ********/
/********************************/


function selectDestination(

    latitude,

    longitude,

    name = "Destination"

){


    selectedPlace = {


        latitude,

        longitude,

        name


    };



    setDestination(

        latitude,

        longitude,

        name

    );


}





/********************************/
/*********** NAVIGATION *********/
/********************************/


function navigateToSelectedPlace(){


    if(

        !selectedPlace

    ){

        alert(

            "Aucune destination sélectionnée."

        );

        return;

    }



    setDestination(

        selectedPlace.latitude,

        selectedPlace.longitude,

        selectedPlace.name

    );


}





/********************************/
/************* CARTE ************/
/********************************/


function centerOnSelectedPlace(){


    if(

        !selectedPlace ||

        !currentMap

    ){

        return;

    }



    currentMap.setView(

        [

            selectedPlace.latitude,

            selectedPlace.longitude

        ],

        17

    );


}





/********************************/
/*********** MARQUEURS **********/
/********************************/


function clearSearchResults(){


    searchResults = [];


    clearPlaceMarkers();


}




function removeDestination(){


    selectedPlace = null;


    clearDestination();


}





/********************************/
/*********** INFORMATIONS *******/
/********************************/


function hasSelectedPlace(){


    return (

        selectedPlace !== null

    );


}




function getSelectedLatitude(){


    if(

        !selectedPlace

    ){

        return null;

    }



    return selectedPlace.latitude;


}




function getSelectedLongitude(){


    if(

        !selectedPlace

    ){

        return null;

    }



    return selectedPlace.longitude;


}

/********************************/
/*********** FAVORIS ************/
/********************************/


let favoritePlaces = [];



function addFavorite(){


    if(

        !selectedPlace

    ){

        return;

    }



    favoritePlaces.push(

        selectedPlace

    );


    saveFavorites();


}




function getFavorites(){

    return favoritePlaces;

}



function removeFavorite(

    index

){


    favoritePlaces.splice(

        index,

        1

    );


    saveFavorites();


}





/********************************/
/*********** HISTORIQUE *********/
/********************************/


let searchHistory = [];



function addSearchHistory(

    value

){


    searchHistory.unshift(

        value

    );



    if(

        searchHistory.length > 25

    ){

        searchHistory.pop();

    }



    saveHistory();


}




function getSearchHistory(){

    return searchHistory;

}





/********************************/
/*********** LOCAL STORAGE ******/
/********************************/


function saveFavorites(){


    localStorage.setItem(

        "clemmapsFavorites",

        JSON.stringify(

            favoritePlaces

        )

    );


}




function loadFavorites(){


    const data =

    localStorage.getItem(

        "clemmapsFavorites"

    );



    if(

        data

    ){

        favoritePlaces =

        JSON.parse(

            data

        );

    }


}





function saveHistory(){


    localStorage.setItem(

        "clemmapsHistory",

        JSON.stringify(

            searchHistory

        )

    );


}




function loadHistory(){


    const data =

    localStorage.getItem(

        "clemmapsHistory"

    );



    if(

        data

    ){

        searchHistory =

        JSON.parse(

            data

        );

    }


}





/********************************/
/******** INITIALISATION ********/
/********************************/


window.addEventListener(

    "load",

    ()=>{


        loadFavorites();


        loadHistory();


    }


);

/********************************/
/******** AUTOUR DE MOI *********/
/********************************/


async function searchAroundMe(){


    if(

        !hasGPSPosition()

    ){

        return;

    }



    const results =

    await searchAroundMePlaces(

        currentLatitude,

        currentLongitude

    );



    displayPlaces(

        results

    );


}





/********************************/
/*********** ACTUALISATION ******/
/********************************/


function refreshSelectedPlace(){


    if(

        !selectedPlace

    ){

        return;

    }



    centerOnSelectedPlace();


}





/********************************/
/*********** OPTIMISATION *******/
/********************************/


function clearSearch(){


    clearSelectedPlace();


    clearSearchResults();


}




function resetSearch(){


    clearSearch();


    searchInProgress =

    false;


}





/********************************/
/*********** GPS LIVE ***********/
/********************************/


function updateSearch(){


    if(

        !hasGPSPosition()

    ){

        return;

    }



    if(

        hasSelectedPlace()

    ){

        refreshSelectedPlace();

    }


}





/********************************/
/*********** INFORMATIONS *******/
/********************************/


function getSearchInformations(){


    return{


        selected:

        hasSelectedPlace(),



        searching:

        searchInProgress,



        results:

        searchResults.length,



        favorites:

        favoritePlaces.length,



        history:

        searchHistory.length


    };


}





/********************************/
/*********** ACTUALISATION ******/
/********************************/


setInterval(


    ()=>{


        updateSearch();


    },


    5000


);

/********************************/
/*********** DIAGNOSTICS ********/
/********************************/


function getSearchDiagnostics(){


    return{

        selectedPlace,

        searching:

        searchInProgress,

        results:

        searchResults.length,

        favorites:

        favoritePlaces.length,

        history:

        searchHistory.length

    };


}





/********************************/
/*********** EXPORTS ************/
/********************************/


window.ClemMapsSearch = {

    performSearch,

    findRestaurants,

    findHotels,

    findParkings,

    findFuel,

    findCharging,

    searchAroundMe,

    selectDestination,

    navigateToSelectedPlace,

    getSelectedPlace,

    getFavorites,

    getSearchHistory,

    clearSearch,

    resetSearch,

    getSearchDiagnostics

};





/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeSearchModule(){


    initializeSearch();


    loadFavorites();


    loadHistory();


    console.log(

        "Search prêt."

    );


}





/********************************/
/*********** DÉMARRAGE **********/
/********************************/


window.addEventListener(

    "load",

    ()=>{


        initializeSearchModule();


    }


);





/********************************/
/************* FIN **************/
/********************************/


console.log(

    "--------------------------------"

);


console.log(

    "ClemMaps Search"

);


console.log(

    "Version 1.0"

);


console.log(

    "Module chargé."

);


console.log(

    "--------------------------------"

);
