/********************************/
/************* GPS **************/
/************ MODULE ************/
/********************************/


let gpsAccuracy = 0;

let gpsAltitude = 0;

let gpsHeading = 0;

let gpsLastUpdate = null;





/********************************/
/******** INITIALISATION GPS ****/
/********************************/


function initializeGPS(){


    if(!navigator.geolocation){


        showNotification(

            "GPS non supporté."

        );


        return;


    }



    showNotification(

        "GPS activé."

    );



    startGPS();


}






/********************************/
/******** POSITION AVANCEE *******/
/********************************/


function updateAdvancedGPS(position){



    currentPosition.latitude =

    position.coords.latitude;



    currentPosition.longitude =

    position.coords.longitude;




    gpsAccuracy =

    position.coords.accuracy || 0;




    gpsAltitude =

    position.coords.altitude || 0;




    gpsHeading =

    position.coords.heading || 0;




    gpsLastUpdate =

    new Date();





    updateUserMarker();



    updateSpeed(

        position.coords.speed

    );





}

/********************************/
/******** GPS PRECISION *********/
/********************************/


function startAdvancedGPS(){



    if(!navigator.geolocation){


        showNotification(

            "GPS indisponible."

        );


        return;


    }




    if(watchID !== null){


        navigator.geolocation.clearWatch(

            watchID

        );


    }





    watchID =

    navigator.geolocation.watchPosition(


        function(position){



            updateAdvancedGPS(

                position

            );



            if(!navigationStarted){



                map.setView(

                    [

                        currentPosition.latitude,

                        currentPosition.longitude

                    ],

                    17

                );


            }



        },



        function(error){



            console.log(

                error

            );



            switch(error.code){



                case 1:


                showNotification(

                    "Permission GPS refusée."

                );


                break;




                case 2:


                showNotification(

                    "Position GPS impossible."

                );


                break;




                case 3:


                showNotification(

                    "Temps GPS dépassé."

                );


                break;



                default:


                showNotification(

                    "Erreur GPS."

                );


            }



        },



        {



            enableHighAccuracy:true,


            timeout:15000,


            maximumAge:1000



        }


    );



}






/********************************/
/******** ARRET GPS *************/
/********************************/


function disableAdvancedGPS(){



    if(watchID !== null){



        navigator.geolocation.clearWatch(

            watchID

        );



        watchID = null;



        showNotification(

            "GPS arrêté."

        );


    }


}

/********************************/
/******** BOUSSOLE GPS **********/
/********************************/


function updateCompass(){


    if(!userMarker){


        return;


    }



    if(

        gpsHeading === 0 ||

        gpsHeading === null

    ){


        return;


    }




    let element =

    userMarker.getElement();



    if(!element){


        return;


    }





    element.style.transform +=

    " rotate(" +

    gpsHeading +

    "deg)";



}







/********************************/
/******** DIRECTION GPS *********/
/********************************/


function getDirection(){



    if(

        gpsHeading === null ||

        gpsHeading === 0

    ){


        return "Inconnue";


    }





    let directions = [



        "Nord",


        "Nord-Est",


        "Est",


        "Sud-Est",


        "Sud",


        "Sud-Ouest",


        "Ouest",


        "Nord-Ouest"



    ];





    let index =

    Math.round(

        gpsHeading / 45

    )

    % 8;





    return directions[index];



}






/********************************/
/******** INFO POSITION *********/
/********************************/


function getGPSInformation(){



    return {



        latitude:

        currentPosition.latitude,



        longitude:

        currentPosition.longitude,



        accuracy:

        gpsAccuracy,



        altitude:

        gpsAltitude,



        heading:

        gpsHeading,



        direction:

        getDirection(),



        updated:

        gpsLastUpdate



    };


}

/********************************/
/******** SUIVI AUTOMATIQUE ******/
/********************************/


let autoFollowGPS = true;



function enableGPSFollow(){


    autoFollowGPS = true;


    showNotification(

        "Suivi GPS activé."

    );


}





function disableGPSFollow(){


    autoFollowGPS = false;


    showNotification(

        "Suivi GPS désactivé."

    );


}






/********************************/
/******** RECALAGE CARTE ********/
/********************************/


function recenterGPS(){



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



    showNotification(

        "Carte recentrée."

    );



}






/********************************/
/******** UPDATE NAV GPS ********/
/********************************/


function updateGPSNavigation(){



    if(

        !navigationStarted ||

        !autoFollowGPS

    ){


        return;


    }





    if(!userMarker){


        return;


    }





    map.panTo(


        userMarker.getLatLng(),


        {


            animate:true,


            duration:0.5


        }


    );



    updateCompass();



}





/********************************/
/******** DISTANCE GPS **********/
/********************************/


function calculateDistance(

    lat1,

    lon1,

    lat2,

    lon2

){



    let earthRadius =

    6371;



    let dLat =

    (

        lat2-lat1

    )

    *

    Math.PI

    /

    180;



    let dLon =

    (

        lon2-lon1

    )

    *

    Math.PI

    /

    180;




    let a =


    Math.sin(dLat/2)

    *

    Math.sin(dLat/2)



    +


    Math.cos(

        lat1 *

        Math.PI /

        180

    )

    *

    Math.cos(

        lat2 *

        Math.PI /

        180

    )

    *

    Math.sin(dLon/2)

    *

    Math.sin(dLon/2);





    let c =


    2 *

    Math.atan2(

        Math.sqrt(a),

        Math.sqrt(

            1-a

        )

    );




    return earthRadius * c;



}

/********************************/
/******** GPS STATUS ************/
/********************************/


function getGPSStatus(){


    if(!gpsLastUpdate){


        return "GPS non actif";


    }



    let now = new Date();



    let difference =

    (now - gpsLastUpdate)

    /

    1000;




    if(difference < 5){


        return "GPS actif";


    }



    if(difference < 30){


        return "GPS lent";


    }



    return "GPS perdu";


}






/********************************/
/******** AFFICHAGE GPS *********/
/********************************/


function displayGPSInfo(){



    let info =

    getGPSInformation();



    let container =

    document.getElementById(

        "gpsInfo"

    );



    if(!container){


        return;


    }



    container.innerHTML =



    `

    Latitude :

    ${info.latitude.toFixed(6)}

    <br>

    Longitude :

    ${info.longitude.toFixed(6)}

    <br>

    Précision :

    ${Math.round(info.accuracy)} m

    <br>

    Direction :

    ${info.direction}

    <br>

    Statut :

    ${getGPSStatus()}

    `;



}







/********************************/
/******** GPS INTERVAL **********/
/********************************/


setInterval(

    function(){



        if(

            clemMapsReady

        ){



            updateGPSNavigation();



            displayGPSInfo();



        }



    },

    2000

);







/********************************/
/******** AUTO START ************/
/********************************/


window.addEventListener(

    "load",

    function(){



        if(

            typeof initializeGPS

            ===

            "function"

        ){



            initializeGPS();



        }



    }

);