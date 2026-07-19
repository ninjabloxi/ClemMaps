/********************************/
/******** NOTIFICATIONS *********/
/********************************/


let notifications = [];


let notificationsEnabled = true;


let notificationSound = true;


let notificationVoice = false;



/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeNotifications(){


    loadNotifications();



    console.log(

        "Module notifications prêt."

    );


}





/********************************/
/******** CRÉATION **************/
/********************************/


function createNotification(


    message,

    type = "info"


){


    if(

        !notificationsEnabled

    ){

        return;

    }



    let notification = {


        id:

        Date.now(),


        message:

        message,


        type:

        type,


        date:

        new Date()

        .toLocaleString(

            "fr-FR"

        )


    };



    notifications.unshift(

        notification

    );



    displayNotification(

        notification

    );



    saveNotifications();


}





/********************************/
/******** AFFICHAGE *************/
/********************************/


function displayNotification(


    notification


){


    let container =

    document.getElementById(

        "notificationsContainer"

    );



    if(!container){

        return;

    }



    let box =

    document.createElement(

        "div"

    );



    box.className =

    "notification";



    box.innerHTML =

    notification.message;



    container.appendChild(

        box

    );



    setTimeout(

        function(){


            box.remove();


        },

        5000

    );


}

/********************************/
/******** NIVEAUX ALERTES *******/
/********************************/


const NOTIFICATION_TYPES = {


    INFO:

    "info",


    WARNING:

    "warning",


    DANGER:

    "danger",


    SUCCESS:

    "success"


};





/********************************/
/******** NOTIFICATION RAPIDE ***/
/********************************/


function showInfo(message){


    createNotification(

        message,

        NOTIFICATION_TYPES.INFO

    );


}




function showWarning(message){


    createNotification(

        message,

        NOTIFICATION_TYPES.WARNING

    );


}




function showDanger(message){


    createNotification(

        message,

        NOTIFICATION_TYPES.DANGER

    );


}




function showSuccess(message){


    createNotification(

        message,

        NOTIFICATION_TYPES.SUCCESS

    );


}





/********************************/
/******** SON NOTIFICATION ******/
/********************************/


function playNotificationSound(){


    if(

        !notificationSound

    ){

        return;

    }



    let audio =

    new Audio();


    audio.src =

    "ASSETS/notification.mp3";


    audio.play()

    .catch(

        function(){}

    );


}





/********************************/
/******** VOIX SYNTHÈSE *********/
/********************************/


function speakNotification(


    message


){


    if(

        !notificationVoice

    ){

        return;

    }



    if(

        !window.speechSynthesis

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
/******** NOTIFICATION COMPLÈTE **/
/********************************/


function sendNotification(


    message,

    type = "info"


){


    createNotification(

        message,

        type

    );


    playNotificationSound();


    speakNotification(

        message

    );


}

/********************************/
/******** ALERTES GPS ***********/
/********************************/


function gpsNotification(message){


    sendNotification(

        message,

        NOTIFICATION_TYPES.INFO

    );


}





/********************************/
/******** ALERTES NAVIGATION ****/
/********************************/


function navigationNotification(message){


    sendNotification(

        message,

        NOTIFICATION_TYPES.INFO

    );


}





function navigationWarning(message){


    sendNotification(

        message,

        NOTIFICATION_TYPES.WARNING

    );


}





/********************************/
/******** ALERTES TRAFIC ********/
/********************************/


function trafficNotification(message){


    sendNotification(

        message,

        NOTIFICATION_TYPES.WARNING

    );


}





function trafficDanger(message){


    sendNotification(

        message,

        NOTIFICATION_TYPES.DANGER

    );


}





/********************************/
/******** ALERTES MÉTÉO *********/
/********************************/


function weatherNotification(message){


    sendNotification(

        message,

        NOTIFICATION_TYPES.INFO

    );


}





function weatherWarning(message){


    sendNotification(

        message,

        NOTIFICATION_TYPES.WARNING

    );


}





/********************************/
/******** ALERTES VÉHICULE ******/
/********************************/


function vehicleNotification(message){


    sendNotification(

        message,

        NOTIFICATION_TYPES.INFO

    );


}





function vehicleWarning(message){


    sendNotification(

        message,

        NOTIFICATION_TYPES.WARNING

    );


}





/********************************/
/******** HISTORIQUE ************/
/********************************/


function getNotifications(){


    return notifications;


}





function clearNotifications(){


    notifications = [];


    saveNotifications();


}

/********************************/
/******** SAUVEGARDE ************/
/********************************/


function saveNotifications(){


    localStorage.setItem(

        "clemmapsNotifications",

        JSON.stringify(

            notifications

        )

    );


}





/********************************/
/******** CHARGEMENT ************/
/********************************/


function loadNotifications(){


    let saved =

    localStorage.getItem(

        "clemmapsNotifications"

    );



    if(saved){


        notifications =

        JSON.parse(

            saved

        );


    }


}





/********************************/
/******** PARAMÈTRES ************/
/********************************/


function enableNotifications(){


    notificationsEnabled =

    true;


}





function disableNotifications(){


    notificationsEnabled =

    false;


}





function enableNotificationVoice(){


    notificationVoice =

    true;


}





function disableNotificationVoice(){


    notificationVoice =

    false;


}





function enableNotificationSound(){


    notificationSound =

    true;


}





function disableNotificationSound(){


    notificationSound =

    false;


}





/********************************/
/******** SYNCHRONISATION *******/
/********************************/


function refreshNotifications(){


    saveNotifications();


}





/********************************/
/******** INITIALISATION ********/
/********************************/


function initializeNotificationsModule(){


    initializeNotifications();


    console.log(

        "Notifications ClemMaps activées."

    );


}





/********************************/
/******** AUTO CHARGEMENT *******/
/********************************/


window.addEventListener(

    "load",

    function(){


        initializeNotificationsModule();


    }

);





/********************************/
/******** FIN NOTIFICATIONS.JS **/
/********************************/

/*

Fonctionnalités :

- Notifications visuelles ;
- Notifications vocales ;
- Sons d'alerte ;
- Niveaux :
    - Info ;
    - Warning ;
    - Danger ;
    - Succès ;
- Alertes GPS ;
- Alertes navigation ;
- Alertes trafic ;
- Alertes météo ;
- Alertes véhicule ;
- Historique ;
- Sauvegarde locale ;
- Activation/désactivation ;
- Compatible :
    - iPad ;
    - iPhone ;
    - Android ;
    - PC ;
    - Vercel.


Architecture :

index.html
      ↓
script.js
      ↓
notifications.js
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
      ↓
Utilisateur

*/