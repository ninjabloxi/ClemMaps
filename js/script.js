/********************************/
/*********** CLEMMAPS ***********/
/************ CORE **************/
/********************************/


let map = null;

let currentLayer = null;


let userMarker = null;

let destinationMarker = null;

let currentRoute = null;



let navigationStarted = false;

let destinationSelected = false;



let currentPosition = {

    latitude:0,

    longitude:0

};



let clemMapsReady = false;



/********************************/
/******** PARAMÈTRES ************/
/********************************/


let mapsSettings = {

    mapMode:"standard",

    traffic:true,

    buildings:true,

    restaurants:true,

    hotels:true,

    gas:true,

    electric:true,

    parking:true,

    bikes:true,

    transports:true,

    speed:true,

    offline:true

};



let navigationSettings = {

    avoidTolls:false,

    avoidHighways:false,

    weather:true,

    stations:true,

    electric:true,

    parking:true

};



let vehicleSettings = {

    name:"Golf 7 GTI",

    fuel:"Essence",

    range:624

};



/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeClemMaps(){


    console.log(

        "Démarrage de ClemMaps..."

    );


    loadSettings();


    initializeMap();


    clemMapsReady = true;


    console.log(

        "ClemMaps prêt."

    );


}



/********************************/
/******** CHARGEMENT ************/
/********************************/


function loadSettings(){


    let savedMaps =

    localStorage.getItem(

        "clemmapsMapsSettings"

    );



    if(savedMaps){


        mapsSettings =

        JSON.parse(

            savedMaps

        );


    }




    let savedNavigation =

    localStorage.getItem(

        "clemmapsNavigationSettings"

    );



    if(savedNavigation){


        navigationSettings =

        JSON.parse(

            savedNavigation

        );


    }




    let savedVehicle =

    localStorage.getItem(

        "clemmapsVehicleSettings"

    );



    if(savedVehicle){


        vehicleSettings =

        JSON.parse(

            savedVehicle

        );


    }


}

/********************************/
/******** INITIALISATION CARTE **/
/********************************/


function initializeMap(){


    if(!document.getElementById("map")){

        console.error(

            "Zone carte introuvable."

        );

        return;

    }



    map = L.map(

        "map",

        {

            zoomControl:false

        }

    ).setView(

        [48.8566,2.3522],

        13

    );



    applyMapMode();


}



/********************************/
/******** MODE DE CARTE *********/
/********************************/


function applyMapMode(){


    if(!map){

        return;

    }



    if(currentLayer){


        map.removeLayer(

            currentLayer

        );


    }



    switch(

        mapsSettings.mapMode

    ){



        case "satellite":


            currentLayer =

            L.tileLayer(

                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",

                {

                    attribution:
                    "Esri Satellite"

                }

            );


        break;



        case "terrain":


            currentLayer =

            L.tileLayer(

                "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",

                {

                    attribution:
                    "OpenTopoMap"

                }

            );


        break;



        case "night":


            currentLayer =

            L.tileLayer(

                "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",

                {

                    attribution:
                    "Stadia Maps"

                }

            );


        break;



        case "transport":


            currentLayer =

            L.tileLayer(

                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

                {

                    attribution:
                    "OpenStreetMap"

                }

            );


        break;



        default:


            currentLayer =

            L.tileLayer(

                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

                {

                    attribution:
                    "OpenStreetMap"

                }

            );


        break;


    }



    currentLayer.addTo(

        map

    );


}

/********************************/
/************* GPS **************/
/********************************/


let watchID = null;



function startGPS(){


    if(!navigator.geolocation){


        showNotification(

            "GPS non disponible."

        );


        return;

    }



    showNotification(

        "Recherche de votre position..."

    );



    if(watchID !== null){


        navigator.geolocation.clearWatch(

            watchID

        );


    }




    watchID =

    navigator.geolocation.watchPosition(


        function(position){


            currentPosition.latitude =

            position.coords.latitude;



            currentPosition.longitude =

            position.coords.longitude;



            updateUserMarker();



            if(!navigationStarted){


                map.setView(

                    [

                        currentPosition.latitude,

                        currentPosition.longitude

                    ],

                    16

                );


            }



            showNotification(

                "Position récupérée."

            );



        },



        function(error){


            console.log(error);



            showNotification(

                "Impossible d'obtenir la position."

            );


        },


        {


            enableHighAccuracy:true,


            maximumAge:0,


            timeout:10000


        }


    );


}




/********************************/
/******** MARQUEUR GPS **********/
/********************************/


function updateUserMarker(){



    if(!map){

        return;

    }



    let position = [


        currentPosition.latitude,


        currentPosition.longitude


    ];





    if(userMarker){


        userMarker.setLatLng(

            position

        );


    }

    else{


        userMarker =

        L.marker(

            position

        )

        .addTo(

            map

        );



        userMarker.bindPopup(

            "Votre position"

        );


    }



}




/********************************/
/******** SUIVI GPS *************/
/********************************/


function followUserPosition(){


    if(!userMarker){


        showNotification(

            "Position inconnue."

        );


        return;

    }



    map.setView(


        userMarker.getLatLng(),


        18


    );


}




/********************************/
/******** ARRÊT GPS *************/
/********************************/


function stopGPS(){


    if(watchID !== null){


        navigator.geolocation.clearWatch(

            watchID

        );


        watchID = null;


    }


}

/********************************/
/******** RECHERCHE DEST ********/
/********************************/


function searchDestination(){


    let input =

    document.getElementById(

        "destination"

    );



    if(!input){

        return;

    }



    let destination =

    input.value.trim();



    if(destination === ""){


        showNotification(

            "Entrez une destination."

        );


        return;

    }



    showNotification(

        "Recherche de " +

        destination +

        "..."

    );



    fetch(

        "https://nominatim.openstreetmap.org/search?format=json&q="

        +

        encodeURIComponent(

            destination

        )

    )

    .then(

        response => response.json()

    )

    .then(

        data => {



            if(data.length === 0){


                showNotification(

                    "Destination introuvable."

                );


                return;

            }



            let place = data[0];



            let lat =

            parseFloat(

                place.lat

            );



            let lon =

            parseFloat(

                place.lon

            );



            createDestinationMarker(

                lat,

                lon,

                destination

            );



            destinationSelected = true;



            showRouteMenu();



            showNotification(

                "Destination trouvée."

            );



        }

    )

    .catch(

        error => {


            console.log(error);


            showNotification(

                "Erreur de recherche."

            );


        }

    );


}



/********************************/
/******** MARQUEUR DEST *********/
/********************************/


function createDestinationMarker(

    lat,

    lon,

    name

){



    if(destinationMarker){


        map.removeLayer(

            destinationMarker

        );


    }




    destinationMarker =

    L.marker(

        [

            lat,

            lon

        ]

    )

    .addTo(

        map

    );



    destinationMarker.bindPopup(

        "<b>" +

        name +

        "</b>"

    );



    map.flyTo(

        [

            lat,

            lon

        ],

        15

    );


}




/********************************/
/******** CALCUL TRAJET *********/
/********************************/


function calculateRoute(){



    if(

        currentPosition.latitude === 0

    ){


        showNotification(

            "Position GPS manquante."

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

    Le vrai calcul d'itinéraire
    sera connecté avec :

    - OSRM
    - GraphHopper
    - Valhalla

    */


    setTimeout(

        function(){


            showNotification(

                "Itinéraire calculé."

            );


        },

        1000

    );


}

/********************************/
/*********** NAVIGATION *********/
/********************************/


function startNavigation(){


    if(!destinationSelected){


        showNotification(

            "Choisissez une destination."

        );


        return;

    }



    navigationStarted = true;



    closeSearchBar();



    hideGPSButtons();



    followUserPosition();



    showNotification(

        "Navigation démarrée."

    );



}




function stopNavigation(){



    navigationStarted = false;



    showGPSButtons();



    openSearchBar();



    showHomeMenu();



    showNotification(

        "Navigation arrêtée."

    );


}




/********************************/
/******** SUIVI TRAJET **********/
/********************************/


function updateNavigation(){



    if(!navigationStarted){


        return;

    }



    if(!userMarker){


        return;

    }



    map.setView(

        userMarker.getLatLng(),

        18

    );



}




/********************************/
/******** MENUS NAV *************/
/********************************/


function showRouteMenu(){



    let menu =

    document.getElementById(

        "routeMenu"

    );



    if(!menu){


        return;

    }




    menu.style.display =

    "block";



    menu.innerHTML =


    `

    <h2>

    Itinéraire prêt

    </h2>


    <p>

    Départ depuis votre position

    </p>


    <br>


    <button onclick="startNavigation()">

    ▶ Démarrer

    </button>



    <button onclick="returnHome()">

    ✖ Annuler

    </button>


    `;



}




function showHomeMenu(){



    let menu =

    document.getElementById(

        "routeMenu"

    );



    if(menu){


        menu.style.display =

        "none";


    }




    let bottom =

    document.querySelector(

        ".bottomMenu"

    );



    if(bottom){


        bottom.style.display =

        "block";


    }



}




/********************************/
/******** AFFICHAGE GPS *********/
/********************************/


function hideGPSButtons(){



    let buttons =

    document.querySelector(

        ".rightButtons"

    );



    if(buttons){


        buttons.style.display =

        "none";


    }


}




function showGPSButtons(){



    let buttons =

    document.querySelector(

        ".rightButtons"

    );



    if(buttons){


        buttons.style.display =

        "flex";


    }


}




function openSearchBar(){



    let search =

    document.querySelector(

        ".searchBox"

    );



    if(search){


        search.style.display =

        "block";


    }


}




function closeSearchBar(){



    let search =

    document.querySelector(

        ".searchBox"

    );



    if(search){


        search.style.display =

        "none";


    }


}




/********************************/
/******** BOUCLE NAV ***********/
/********************************/


setInterval(

    function(){


        updateNavigation();


    },

    2000

);

/********************************/
/******** NOTIFICATIONS *********/
/********************************/


let notificationContainer = null;



function initializeNotifications(){


    if(notificationContainer){


        return;


    }



    notificationContainer =

    document.createElement(

        "div"

    );



    notificationContainer.id =

    "clemNotifications";



    notificationContainer.style.position =

    "fixed";



    notificationContainer.style.right =

    "20px";



    notificationContainer.style.bottom =

    "20px";



    notificationContainer.style.zIndex =

    "999999";



    notificationContainer.style.display =

    "flex";



    notificationContainer.style.flexDirection =

    "column-reverse";



    notificationContainer.style.gap =

    "10px";



    document.body.appendChild(

        notificationContainer

    );



}




function showNotification(message){


    if(!notificationContainer){


        initializeNotifications();


    }



    let notification =

    document.createElement(

        "div"

    );



    notification.innerHTML =

    message;



    notification.style.background =

    "#303134";



    notification.style.color =

    "white";



    notification.style.padding =

    "15px 20px";



    notification.style.borderRadius =

    "20px";



    notification.style.fontFamily =

    "Roboto, sans-serif";



    notification.style.boxShadow =

    "0 5px 20px rgba(0,0,0,.4)";



    notification.style.maxWidth =

    "300px";



    notification.style.animation =

    "notificationIn .3s ease";



    notificationContainer.appendChild(

        notification

    );



    setTimeout(

        function(){


            notification.remove();


        },

        4000

    );



    console.log(

        message

    );


}





/********************************/
/******** RECHERCHE LIEUX ********/
/********************************/


function searchCategory(type){



    if(typeof searchNearby !== "function"){


        showNotification(

            "Module de recherche indisponible."

        );


        return;

    }




    if(

        currentPosition.latitude === 0

    ){


        showNotification(

            "Position GPS inconnue."

        );


        startGPS();


        return;

    }




    searchNearby(

        type,

        currentPosition.latitude,

        currentPosition.longitude

    );


}




/********************************/
/******** RETOUR ACCUEIL ********/
/********************************/


function returnHome(){



    navigationStarted = false;


    destinationSelected = false;



    if(destinationMarker){


        map.removeLayer(

            destinationMarker

        );


        destinationMarker = null;


    }




    showHomeMenu();


    showGPSButtons();


    openSearchBar();



    showNotification(

        "Retour à l'accueil."

    );


}

/********************************/
/*********** DONNÉES ************/
/********************************/


let favorites = [];

let historySearch = [];

let recentSearches = [];

let currentSpeed = 0;



/********************************/
/*********** FAVORIS ************/
/********************************/


function saveFavorite(){


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

            "Aucune destination."

        );


        return;

    }



    favorites.push(

        value

    );



    saveAllData();



    showNotification(

        "Destination ajoutée aux favoris."

    );


}




function showFavorites(){



    if(favorites.length === 0){


        showNotification(

            "Aucun favori."

        );


        return;

    }



    showNotification(

        favorites.length +

        " favori(s)."

    );


}





/********************************/
/******** HISTORIQUE ************/
/********************************/


function addHistory(value){



    if(value === ""){


        return;

    }



    historySearch.unshift(

        value

    );



    recentSearches.unshift(

        value

    );



    if(recentSearches.length > 10){


        recentSearches.pop();


    }



}




function showHistory(){



    showNotification(

        historySearch.length +

        " recherche(s)."

    );


}





/********************************/
/******** VITESSE ***************/
/********************************/


function updateSpeed(speed){



    if(speed === null){


        currentSpeed = 0;


    }

    else{


        currentSpeed =

        Math.round(

            speed * 3.6

        );


    }



    updateSpeedDisplay();


}





function updateSpeedDisplay(){



    let box =

    document.querySelector(

        ".speedContainer"

    );



    if(!box){


        return;


    }



    let title =

    box.querySelector(

        "h2"

    );



    if(title){


        title.innerHTML =

        currentSpeed +

        " km/h";


    }



}





/********************************/
/******** SAUVEGARDE ************/
/********************************/


function saveAllData(){



    localStorage.setItem(

        "clemmapsFavorites",

        JSON.stringify(

            favorites

        )

    );



    localStorage.setItem(

        "clemmapsHistory",

        JSON.stringify(

            historySearch

        )

    );



    localStorage.setItem(

        "clemmapsRecent",

        JSON.stringify(

            recentSearches

        )

    );


}




function loadAllData(){



    favorites =

    JSON.parse(

        localStorage.getItem(

            "clemmapsFavorites"

        )

    ) || [];



    historySearch =

    JSON.parse(

        localStorage.getItem(

            "clemmapsHistory"

        )

    )

    || [];



    recentSearches =

    JSON.parse(

        localStorage.getItem(

            "clemmapsRecent"

        )

    )

    || [];


}

/********************************/
/******** PLEIN ÉCRAN ***********/
/********************************/


function fullscreenMode(){


    if(!document.fullscreenElement){


        document.documentElement.requestFullscreen();


    }

    else{


        document.exitFullscreen();


    }


}



/********************************/
/******** PARAMÈTRES ************/
/********************************/


function openSettings(){


    window.location.href =

    "pages/settings.html";


}




/********************************/
/******** MODE CARTE ************/
/********************************/


function changeMapMode(mode){



    mapsSettings.mapMode = mode;



    localStorage.setItem(

        "clemmapsMapsSettings",

        JSON.stringify(

            mapsSettings

        )

    );



    applyMapMode();



    showNotification(

        "Mode carte changé."

    );


}





/********************************/
/******** SYNCHRONISATION ********/
/********************************/


function refreshSettings(){



    let settings =

    localStorage.getItem(

        "clemmapsMapsSettings"

    );



    if(settings){


        mapsSettings =

        JSON.parse(

            settings

        );


        applyMapMode();


    }



}




/********************************/
/******** DÉMARRAGE *************/
/********************************/


window.addEventListener(

    "load",

    function(){



        loadAllData();



        initializeNotifications();



        initializeClemMaps();



        startGPS();



        showNotification(

            "Bienvenue sur ClemMaps."

        );



    }

);





/********************************/
/******** ACTUALISATION *********/
/********************************/


setInterval(

    function(){



        refreshSettings();



    },

    3000

);





/********************************/
/******** SAUVEGARDE AUTO ********/
/********************************/


window.addEventListener(

    "beforeunload",

    function(){



        saveAllData();



    }

);





/********************************/
/******** FIN CLEMMAPS **********/
/********************************/


/*

Architecture :

index.html

↓

js/script.js

↓

Carte Leaflet

↓

GPS

↓

Recherche

↓

Navigation

↓

Paramètres

↓

localStorage

↓

Vercel


Modules :

js/gps.js

js/search.js

js/maps.js

js/notifications.js


*/