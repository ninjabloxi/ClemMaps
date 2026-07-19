/********************************/
/******** OPENWEATHER ***********/
/********************************/
/*
API Météo

Fonctions :
- Météo actuelle
- Température
- Vent
- Conditions
- Prévisions
*/


const OPENWEATHER_URL =

"https://api.openweathermap.org/data/2.5";


let weatherAPIKey =

"";





/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeOpenWeather(){


    console.log(

        "API OpenWeather prête."

    );


}





/********************************/
/******** CONFIGURATION ********/
/********************************/


function setWeatherAPIKey(


    key


){


    weatherAPIKey =

    key;



    localStorage.setItem(

        "clemmapsWeatherKey",

        key

    );


}





function loadWeatherAPIKey(){


    let key =

    localStorage.getItem(

        "clemmapsWeatherKey"

    );



    if(key){


        weatherAPIKey =

        key;


    }


}





/********************************/
/******** MÉTÉO ACTUELLE ********/
/********************************/


async function getCurrentWeather(


    latitude,

    longitude


){


    if(

        weatherAPIKey === ""

    ){


        console.log(

            "Clé météo absente."

        );


        return null;

    }



    try{


        let response =

        await fetch(


            OPENWEATHER_URL

            +

            "/weather?lat="

            +

            latitude

            +

            "&lon="

            +

            longitude

            +

            "&units=metric&lang=fr&appid="

            +

            weatherAPIKey


        );



        let data =

        await response.json();



        return data;


    }


    catch(error){


        console.log(

            "Erreur météo :",

            error

        );



        return null;


    }


}

/********************************/
/******** INFORMATIONS MÉTÉO ****/
/********************************/


function getWeatherTemperature(


    weather


){


    if(

        !weather

        ||

        !weather.main

    ){

        return "--";

    }



    return Math.round(

        weather.main.temp

    )

    +

    " °C";


}





function getWeatherFeelsLike(


    weather


){


    if(

        !weather

        ||

        !weather.main

    ){

        return "--";

    }



    return Math.round(

        weather.main.feels_like

    )

    +

    " °C";


}





function getWeatherWind(


    weather


){


    if(

        !weather

        ||

        !weather.wind

    ){

        return "--";

    }



    return Math.round(

        weather.wind.speed

        *

        3.6

    )

    +

    " km/h";


}





function getWeatherDescription(


    weather


){


    if(

        !weather

        ||

        !weather.weather

    ){

        return "--";

    }



    return (

        weather.weather[0].description

    );


}





/********************************/
/******** ICÔNE MÉTÉO ***********/
/********************************/


function getWeatherIcon(


    weather


){


    if(

        !weather

        ||

        !weather.weather

    ){

        return "";

    }



    let icon =

    weather.weather[0].icon;



    return (

        "https://openweathermap.org/img/wn/"

        +

        icon

        +

        "@2x.png"

    );


}





/********************************/
/******** AFFICHAGE INTERFACE ***/
/********************************/


function updateWeatherDisplay(


    weather


){


    let temp =

    document.getElementById(

        "weatherTemperature"

    );



    let state =

    document.getElementById(

        "weatherState"

    );



    let wind =

    document.getElementById(

        "weatherWind"

    );



    if(temp){


        temp.innerHTML =

        getWeatherTemperature(

            weather

        );


    }



    if(state){


        state.innerHTML =

        getWeatherDescription(

            weather

        );


    }



    if(wind){


        wind.innerHTML =

        getWeatherWind(

            weather

        );


    }


}

/********************************/
/******** PRÉVISIONS MÉTÉO ******/
/********************************/


async function getWeatherForecast(


    latitude,

    longitude


){


    if(

        weatherAPIKey === ""

    ){

        return null;

    }



    try{


        let response =

        await fetch(


            OPENWEATHER_URL

            +

            "/forecast?lat="

            +

            latitude

            +

            "&lon="

            +

            longitude

            +

            "&units=metric&lang=fr&appid="

            +

            weatherAPIKey


        );



        let data =

        await response.json();



        return data;


    }


    catch(error){


        console.log(

            "Erreur prévisions météo :",

            error

        );



        return null;


    }


}





/********************************/
/******** ALERTES MÉTÉO *********/
/********************************/


function checkWeatherAlert(


    weather


){


    if(

        !weather

    ){

        return;

    }



    let temperature =

    weather.main.temp;



    if(

        temperature <= 0

    ){


        weatherWarning(

            "Température basse, risque de gel."

        );


    }



    if(

        temperature >= 35

    ){


        weatherWarning(

            "Forte chaleur détectée."

        );


    }



    if(

        weather.wind.speed >= 20

    ){


        weatherWarning(

            "Vent fort pendant le trajet."

        );


    }


}





/********************************/
/******** IMPACT VÉHICULE ********/
/********************************/


function applyWeatherVehicleImpact(


    weather


){


    if(

        !weather

    ){

        return;

    }



    if(

        typeof applyWeatherImpact

        ===

        "function"

    ){


        applyWeatherImpact();


    }


}





/********************************/
/******** MISE À JOUR ***********/
/********************************/


async function refreshWeather(){


    if(

        !currentPosition.latitude

    ){

        return;

    }



    let weather =

    await getCurrentWeather(


        currentPosition.latitude,


        currentPosition.longitude


    );



    updateWeatherDisplay(

        weather

    );



    checkWeatherAlert(

        weather

    );



    applyWeatherVehicleImpact(

        weather

    );


}

/********************************/
/******** SAUVEGARDE ************/
/********************************/


function saveWeatherData(


    weather


){


    if(

        !weather

    ){

        return;

    }



    localStorage.setItem(

        "clemmapsLastWeather",

        JSON.stringify(

            weather

        )

    );


}





/********************************/
/******** CHARGEMENT ************/
/********************************/


function loadWeatherData(){


    let data =

    localStorage.getItem(

        "clemmapsLastWeather"

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
/******** INITIALISATION ********/
/********************************/


function initializeWeatherAPI(){


    loadWeatherAPIKey();


    initializeOpenWeather();



    console.log(

        "API OpenWeather chargée."

    );


}





/********************************/
/******** AUTO CHARGEMENT *******/
/********************************/


window.addEventListener(

    "load",

    function(){


        initializeWeatherAPI();


    }

);





/********************************/
/******** ACTUALISATION *********/
/********************************/


setInterval(

    function(){


        refreshWeather();


    },

    900000

);





/********************************/
/******** FIN OPENWEATHER.JS ****/
/********************************/

/*

API OpenWeather :

Fonctionnalités :

- Météo actuelle ;
- Température ;
- Température ressentie ;
- Vent ;
- Conditions météo ;
- Icônes ;
- Prévisions ;
- Alertes météo ;
- Impact véhicule ;
- Sauvegarde dernière météo ;
- Actualisation automatique.


Architecture :

weather.js
      ↓
openweather.js
      ↓
OpenWeather API
      ↓
Données météo
      ↓
Navigation
      ↓
Véhicule


*/