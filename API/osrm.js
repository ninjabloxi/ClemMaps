/********************************/
/************* OSRM *************/
/********************************/


const OSRM_URL =

"https://router.project-osrm.org/route/v1";



let currentRoute = null;

let currentSteps = [];

let currentDistance = 0;

let currentDuration = 0;




/********************************/
/******** ITINÉRAIRE ************/
/********************************/


async function calculateRoute(


startLat,
startLon,
endLat,
endLon


){


    try{


        let url =


        `${OSRM_URL}/car/`+

        `${startLon},${startLat};`+

        `${endLon},${endLat}`+

        `?overview=full`+

        `&steps=true`+

        `&geometries=geojson`;



        let response =

        await fetch(

            url

        );



        let data =

        await response.json();




        if(

            data.code !== "Ok"

        ){

            return null;

        }




        currentRoute =

        data.routes[0];



        currentDistance =

        currentRoute.distance;



        currentDuration =

        currentRoute.duration;



        currentSteps =

        currentRoute.legs[0].steps;



        return currentRoute;



    }


    catch(error){


        console.error(

            error

        );


        return null;


    }


}





/********************************/
/******** DISTANCE **************/
/********************************/


function getRouteDistance(){


    return currentDistance;


}





/********************************/
/******** TEMPS *****************/
/********************************/


function getRouteDuration(){


    return currentDuration;


}





/********************************/
/******** ÉTAPES ****************/
/********************************/


function getNavigationSteps(){


    return currentSteps;


}





/********************************/
/******** FORMAT KM *************/
/********************************/


function formatDistance(


meters


){


    if(


        meters >= 1000


    ){


        return (

            meters / 1000

        )

        .toFixed(1)

        +

        " km";


    }



    return (

        Math.round(

            meters

        )

        +

        " m"

    );


}





/********************************/
/******** FORMAT TEMPS **********/
/********************************/


function formatDuration(


seconds


){


    let minutes =

    Math.round(

        seconds / 60

    );



    if(


        minutes >= 60


    ){


        let hours =

        Math.floor(

            minutes / 60

        );



        let rest =

        minutes % 60;



        return (


            hours +

            " h " +

            rest +

            " min"


        );


    }



    return (


        minutes +

        " min"


    );


}





/********************************/
/******** TRACÉ BLEU ************/
/********************************/


function displayRoute(


map


){


    if(

        !currentRoute

    ){

        return;

    }



    if(

        window.routeLayer

    ){


        map.removeLayer(

            window.routeLayer

        );


    }




    window.routeLayer =


    L.geoJSON(

        currentRoute.geometry,

        {

            style:{


                color:"#4285F4",

                weight:8,

                opacity:1


            }


        }

    )

    .addTo(

        map

    );




    map.fitBounds(


        window.routeLayer

        .getBounds()


    );


}





/********************************/
/******** RECALCUL **************/
/********************************/


async function recalculateRoute(


startLat,
startLon,
endLat,
endLon


){



    return await calculateRoute(


        startLat,
        startLon,
        endLat,
        endLon


    );


}
