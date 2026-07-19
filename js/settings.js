/********************************/
/********** PARAMÈTRES **********/
/********************************/


let settings = {


    theme:

    "dark",


    language:

    "fr",


    distanceUnit:

    "km",


    speedUnit:

    "km/h",


    temperatureUnit:

    "celsius",


    notifications:

    true,


    voiceNavigation:

    true,


    vibration:

    true,


    traffic:

    true,


    weather:

    true,


    gps:

    true


};



/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeSettings(){


    loadSettings();


    console.log(

        "Module paramètres prêt."

    );


}





/********************************/
/******** CHARGEMENT ************/
/********************************/


function loadSettings(){


    let savedSettings =

    localStorage.getItem(

        "clemmapsSettings"

    );



    if(

        !savedSettings

    ){

        return;

    }



    settings =

    JSON.parse(

        savedSettings

    );


}





/********************************/
/******** SAUVEGARDE ************/
/********************************/


function saveSettings(){


    localStorage.setItem(

        "clemmapsSettings",

        JSON.stringify(

            settings

        )

    );


}





/********************************/
/*********** UTILITAIRES ********/
/********************************/


function getSetting(name){


    return (

        settings[name]

    );


}




function setSetting(


    name,

    value


){


    settings[name] =

    value;



    saveSettings();


}

/********************************/
/************* THÈME ************/
/********************************/


function changeTheme(theme){


    settings.theme =

    theme;



    saveSettings();



    applyTheme();


}





function applyTheme(){


    if(

        settings.theme

        ===

        "dark"

    ){


        document.body.classList.add(

            "dark"

        );


    }


    else{


        document.body.classList.remove(

            "dark"

        );


    }


}





/********************************/
/******** UNITÉS DISTANCE ********/
/********************************/


function setDistanceUnit(unit){


    if(

        unit !== "km"

        &&

        unit !== "miles"

    ){

        return;

    }



    settings.distanceUnit =

    unit;



    saveSettings();


}





function convertDistance(value){


    if(

        settings.distanceUnit

        ===

        "miles"

    ){


        return Number(

            (

                value

                *

                0.621371

            )

            .toFixed(1)

        );


    }



    return value;


}





/********************************/
/******** UNITÉS VITESSE ********/
/********************************/


function setSpeedUnit(unit){


    settings.speedUnit =

    unit;



    saveSettings();


}





function convertSpeed(value){


    if(

        settings.speedUnit

        ===

        "mph"

    ){


        return Math.round(

            value

            *

            0.621371

        );


    }



    return value;


}





/********************************/
/******** TEMPÉRATURE ***********/
/********************************/


function setTemperatureUnit(unit){


    settings.temperatureUnit =

    unit;



    saveSettings();


}





function convertTemperature(value){


    if(

        settings.temperatureUnit

        ===

        "fahrenheit"

    ){


        return Math.round(

            (

                value

                *

                9

                /

                5

            )

            +

            32

        );


    }



    return value;


}

/********************************/
/************* GPS **************/
/********************************/


function toggleGPS(value){


    settings.gps =

    value;



    saveSettings();



    if(

        value

    ){

        startGPS();

    }

    else{


        stopGPS();


    }


}





/********************************/
/*********** TRAFIC *************/
/********************************/


function toggleTraffic(value){


    settings.traffic =

    value;



    saveSettings();



    if(

        value

    ){


        enableTrafficMode();


    }

    else{


        disableTrafficMode();


    }


}





/********************************/
/*********** MÉTÉO **************/
/********************************/


function toggleWeather(value){


    settings.weather =

    value;



    saveSettings();


}





/********************************/
/******** NOTIFICATIONS *********/
/********************************/


function toggleNotifications(value){


    settings.notifications =

    value;



    saveSettings();


}





/********************************/
/******** NAVIGATION VOCALE *****/
/********************************/


function toggleVoiceNavigation(value){


    settings.voiceNavigation =

    value;



    saveSettings();


}





/********************************/
/******** VIBRATION *************/
/********************************/


function toggleVibration(value){


    settings.vibration =

    value;



    saveSettings();


}





/********************************/
/******** SYNCHRONISATION *******/
/********************************/


function synchronizeSettings(){


    applyTheme();



    if(

        settings.gps

    ){


        startGPS();


    }



    if(

        settings.traffic

    ){


        enableTrafficMode();


    }


}

/********************************/
/******** AFFICHAGE MENU ********/
/********************************/


function displaySettings(){


    let container =

    document.getElementById(

        "settingsContainer"

    );



    if(!container){

        return;

    }



    container.innerHTML =


    `

    <div class="settingCard">


        <h3>

        Apparence

        </h3>


        <button onclick="changeTheme('dark')">

        🌙 Mode sombre

        </button>


        <button onclick="changeTheme('light')">

        ☀️ Mode clair

        </button>


    </div>



    <div class="settingCard">


        <h3>

        Navigation

        </h3>


        <button onclick="toggleVoiceNavigation(true)">

        🔊 Navigation vocale activée

        </button>


        <button onclick="toggleVoiceNavigation(false)">

        🔇 Navigation vocale désactivée

        </button>


    </div>



    <div class="settingCard">


        <h3>

        Carte

        </h3>


        <button onclick="toggleTraffic(true)">

        🚦 Trafic activé

        </button>


        <button onclick="toggleTraffic(false)">

        🚦 Trafic désactivé

        </button>


    </div>


    `;


}





/********************************/
/******** RESET PARAMÈTRES ******/
/********************************/


function resetSettings(){


    localStorage.removeItem(

        "clemmapsSettings"

    );



    location.reload();


}





/********************************/
/******** EXPORT PARAMÈTRES *****/
/********************************/


function exportSettings(){


    let data =

    JSON.stringify(

        settings,

        null,

        2

    );



    console.log(

        data

    );


    return data;


}





/********************************/
/******** IMPORT PARAMÈTRES *****/
/********************************/


function importSettings(data){


    try{


        settings =

        JSON.parse(

            data

        );



        saveSettings();



        applyTheme();



    }


    catch(error){


        console.log(

            "Paramètres invalides."

        );


    }


}

/********************************/
/******** SYNCHRONISATION *******/
/********************************/


function refreshSettings(){


    loadSettings();


    synchronizeSettings();


}





/********************************/
/******** CHANGEMENT DYNAMIQUE **/
/********************************/


function updateSetting(


    name,

    value


){


    if(

        settings[name]

        ===

        undefined

    ){

        return;

    }



    settings[name] =

    value;



    saveSettings();


}





/********************************/
/******** INFORMATIONS **********/
/********************************/


function getAllSettings(){


    return settings;


}





/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeSettingsModule(){


    initializeSettings();


    applyTheme();


    synchronizeSettings();



    console.log(

        "Module paramètres chargé."

    );


}





/********************************/
/******** AUTO CHARGEMENT *******/
/********************************/


window.addEventListener(

    "load",

    function(){


        initializeSettingsModule();


    }

);





/********************************/
/******** ACTUALISATION *********/
/********************************/


setInterval(

    function(){


        refreshSettings();


    },

    5000

);





/********************************/
/******** FIN SETTINGS.JS ********/
/********************************/

/*

Fonctionnalités :

- Gestion du thème ;
- Gestion des unités ;
- Gestion GPS ;
- Gestion trafic ;
- Gestion météo ;
- Gestion notifications ;
- Navigation vocale ;
- Vibration ;
- Sauvegarde locale ;
- Import/export paramètres ;
- Réinitialisation ;
- Synchronisation automatique ;
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
 settings.js
      ↓
 localStorage
      ↓
 GPS
      ↓
 Navigation
      ↓
 Trafic
      ↓
 Météo
      ↓
 Véhicule

*/