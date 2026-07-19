/********************************/
/************* MÉTÉO ************/
/********************************/


let weatherTemperature = "--";

let weatherState = "--";

let weatherWind = "--";

let weatherHumidity = "--";

let weatherVisibility = "--";



/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeWeather(){


    console.log(

        "Module météo chargé."

    );


}





/********************************/
/******** POSITION MÉTÉO ********/
/********************************/


async function updateWeather(){


    if(

        currentPosition.latitude === 0 ||

        currentPosition.longitude === 0

    ){

        return;

    }



    showNotification(

        "Actualisation météo..."

    );



    try{


        await getWeatherInformation();


    }


    catch(error){


        console.log(

            error

        );


        showNotification(

            "Impossible de récupérer la météo."

        );


    }


}





/********************************/
/*********** DESTINATION ********/
/********************************/


async function updateDestinationWeather(){


    if(

        destinationLatitude === 0 ||

        destinationLongitude === 0

    ){

        return;

    }



    try{


        await getDestinationWeather();


    }


    catch(error){


        console.log(

            error

        );


    }


}

/********************************/
/******** DONNÉES MÉTÉO *********/
/********************************/


async function getWeatherInformation(){


    let latitude =

    currentPosition.latitude;



    let longitude =

    currentPosition.longitude;




    let url =

    "https://api.open-meteo.com/v1/forecast"

    +

    "?latitude="

    +

    latitude

    +

    "&longitude="

    +

    longitude

    +

    "&current="

    +

    "temperature_2m,"

    +

    "relative_humidity_2m,"

    +

    "wind_speed_10m,"

    +

    "visibility";




    let response =

    await fetch(

        url

    );



    let data =

    await response.json();




    weatherTemperature =

    Math.round(

        data.current.temperature_2m

    )

    + " °C";




    weatherHumidity =

    data.current

    .relative_humidity_2m

    + " %";




    weatherWind =

    Math.round(

        data.current.wind_speed_10m

    )

    + " km/h";




    weatherVisibility =

    Math.round(

        data.current.visibility

        / 1000

    )

    + " km";



    weatherState =

    "Temps dégagé";



    updateWeatherInformations();


}





/********************************/
/******** DESTINATION ***********/
/********************************/


async function getDestinationWeather(){


    let url =

    "https://api.open-meteo.com/v1/forecast"

    +

    "?latitude="

    +

    destinationLatitude

    +

    "&longitude="

    +

    destinationLongitude

    +

    "&current=temperature_2m";




    let response =

    await fetch(

        url

    );



    let data =

    await response.json();




    console.log(

        "Météo destination :",

        data.current.temperature_2m,

        "°C"

    );


}

/********************************/
/******** AFFICHAGE MÉTÉO *******/
/********************************/


function updateWeatherInformations(){


    let temperature =

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



    if(temperature){


        temperature.innerHTML =

        weatherTemperature;


    }



    if(state){


        state.innerHTML =

        weatherState;


    }



    if(wind){


        wind.innerHTML =

        weatherWind;


    }


}





/********************************/
/******** AFFICHAGE MENU ********/
/********************************/


function showWeatherInformations(){


    let container =

    document.getElementById(

        "weatherInformations"

    );



    if(!container){

        return;

    }



    container.style.display =

    "flex";


}





function hideWeatherInformations(){


    let container =

    document.getElementById(

        "weatherInformations"

    );



    if(container){


        container.style.display =

        "none";


    }


}





/********************************/
/******** SYNCHRONISATION *******/
/********************************/


function synchronizeWeather(){


    updateWeatherInformations();


}

/********************************/
/******** ALERTES MÉTÉO *********/
/********************************/


function checkWeatherAlerts(){


    if(

        weatherWind !== "--"

    ){

        let speed =

        parseInt(

            weatherWind

        );



        if(

            speed >= 70

        ){


            showNotification(

                "Vent fort détecté. Prudence sur la route."

            );



            speakWeatherAlert(

                "Attention, vent fort détecté."

            );


        }


    }


}





/********************************/
/******** CONDITIONS ROUTE ******/
/********************************/


function checkDrivingConditions(){


    if(

        weatherVisibility !== "--"

    ){

        let visibility =

        parseInt(

            weatherVisibility

        );



        if(

            visibility <= 2

        ){


            showNotification(

                "Visibilité réduite. Réduisez votre vitesse."

            );


        }


    }


}





/********************************/
/******** RECOMMANDATIONS *******/
/********************************/


function displayWeatherAdvice(){


    if(

        weatherTemperature === "--"

    ){

        return;

    }



    let temperature =

    parseInt(

        weatherTemperature

    );



    if(

        temperature >= 35

    ){

        showNotification(

            "Pensez à vous hydrater durant votre trajet."

        );

    }



    if(

        temperature <= 0

    ){

        showNotification(

            "Risque de verglas détecté."

        );

    }


}





/********************************/
/******** NOTIFICATION VOCALE ***/
/********************************/


function speakWeatherAlert(


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
/******** ACTUALISATION *********/
/********************************/


function refreshWeather(){


    updateWeather();


    synchronizeWeather();


    checkWeatherAlerts();


    checkDrivingConditions();


    displayWeatherAdvice();


}





/********************************/
/******** BOUCLE MÉTÉO **********/
/********************************/


setInterval(

    function(){


        if(

            currentPosition.latitude !== 0

        ){


            refreshWeather();


        }


    },

    300000

);



/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeWeatherModule(){


    initializeWeather();


    updateWeather();



    console.log(

        "Module météo prêt."

    );


}





/********************************/
/******** AUTO CHARGEMENT *******/
/********************************/


window.addEventListener(

    "load",

    function(){


        initializeWeatherModule();


    }

);





/********************************/
/******** FIN WEATHER.JS ********/
/********************************/

/*

Fonctionnalités :

- Température actuelle ;
- Vent ;
- Humidité ;
- Visibilité ;
- Météo de la destination ;
- Alertes météo intelligentes ;
- Notifications vocales ;
- Conseils de conduite ;
- Synchronisation GPS ;
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
  weather.js
      ↓
 Open-Meteo API
      ↓
     GPS
      ↓
 Navigation
      ↓
 Notifications
      ↓
 Affichage météo

*/