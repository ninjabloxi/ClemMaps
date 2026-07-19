/********************************/
/******** NAVIGATION GPS ********/
/********************************/


let navigationStarted = false;

let followUser = true;

let destination = null;




/********************************/
/******** DÉMARRER **************/
/********************************/


async function startNavigation(){


    navigationStarted = true;



    let button =

    document.getElementById(

        "startNavigation"

    );



    if(

        button

    ){

        button.style.display =

        "none";

    }



    if(

        !destination

    ){

        alert(

            "Aucune destination."

        );



        return;

    }




    let position =

    getCurrentPosition();



    if(

        !position

    ){

        return;

    }



    let route =

    await calculateRoute(

        position.lat,

        position.lon,

        destination.lat,

        destination.lon

    );




    if(

        route

    ){


        displayRoute(

            map

        );



        speakInstruction(

            "Navigation démarrée."

        );


    }


}





/********************************/
/******** ARRÊTER ***************/
/********************************/


function stopNavigation(){


    navigationStarted = false;



    let button =

    document.getElementById(

        "startNavigation"

    );



    if(

        button

    ){

        button.style.display =

        "block";

    }



    if(

        window.routeLayer

    ){


        map.removeLayer(

            window.routeLayer

        );


    }



    speakInstruction(

        "Navigation arrêtée."

    );


}





/********************************/
/******** DESTINATION ***********/
/********************************/


function setDestination(


lat,

lon


){


    destination = {


        lat:lat,

        lon:lon


    };


}





/********************************/
/******** GPS ******************/
/********************************/


function updateNavigation(){


    if(

        !navigationStarted

    ){

        return;

    }




    let position =

    getCurrentPosition();



    if(

        !position

    ){

        return;

    }




    if(

        followUser

    ){


        map.setView(

            [

                position.lat,

                position.lon

            ],

            17

        );


    }



}




/********************************/
/******** VOIX *****************/
/********************************/


function speakInstruction(


text


){


    if(

        !window.speechSynthesis

    ){

        return;

    }



    let voice =

    new SpeechSynthesisUtterance(

        text

    );



    voice.lang =

    "fr-FR";



    speechSynthesis.speak(

        voice

    );


}





/********************************/
/******** INSTRUCTIONS **********/
/********************************/


function readNextInstruction(){


    let steps =

    getNavigationSteps();



    if(

        !steps ||

        !steps.length

    ){

        return;

    }



    let instruction =

    steps[0]

    .maneuver

    ?.instruction;



    if(

        instruction

    ){


        speakInstruction(

            instruction

        );


    }


}





/********************************/
/******** RECALCUL **************/
/********************************/


async function recalculateNavigation(){


    if(

        !destination

    ){

        return;

    }



    let position =

    getCurrentPosition();



    if(

        !position

    ){

        return;

    }




    await recalculateRoute(

        position.lat,

        position.lon,

        destination.lat,

        destination.lon

    );



    displayRoute(

        map

    );


}





/********************************/
/******** ACTUALISATION *********/
/********************************/


setInterval(


    updateNavigation,


    2000


);
