/********************************/
/******** OVERPASS API **********/
/********************************/


const OVERPASS_URL =

"https://overpass-api.de/api/interpreter";




/********************************/
/******** REQUÊTE API ***********/
/********************************/


async function executeOverpassQuery(

query

){

    try{


        const response =

        await fetch(

            OVERPASS_URL,

            {

                method:"POST",

                body:query

            }

        );



        const data =

        await response.json();



        return data.elements;



    }


    catch(error){


        console.error(

            "Erreur Overpass :",

            error

        );


        return [];


    }


}





/********************************/
/******** FORMATAGE *************/
/********************************/


function formatPlaces(places){


    return places.map(


        place=>{


            return{


                name:

                place.tags?.name ||

                "Lieu inconnu",



                latitude:

                place.lat ||

                place.center?.lat,



                longitude:

                place.lon ||

                place.center?.lon,



                type:

                place.tags?.amenity ||

                place.tags?.tourism ||

                "unknown"


            };


        }


    );


}





/********************************/
/******** RECHERCHE *************/
/********************************/


async function searchNearby(


type,

latitude,

longitude,

radius = 5000


){



let query = `


[out:json];

(

node["${type}"]

(around:${radius},

${latitude},

${longitude});


way["${type}"]

(around:${radius},

${latitude},

${longitude});


relation["${type}"]

(around:${radius},

${latitude},

${longitude});

);

out center;


`;




let places =

await executeOverpassQuery(

query

);



return formatPlaces(

places

);


}





/********************************/
/******** RESTAURANTS ***********/
/********************************/


async function searchRestaurants(


lat,

lon


){


return await searchNearby(

'amenity"="restaurant',

lat,

lon

);


}





/********************************/
/******** HÔTELS ****************/
/********************************/


async function searchHotels(


lat,

lon


){


return await searchNearby(

'tourism"="hotel',

lat,

lon

);


}





/********************************/
/******** PARKINGS **************/
/********************************/


async function searchParkings(


lat,

lon


){


return await searchNearby(

'amenity"="parking',

lat,

lon

);


}





/********************************/
/******** STATIONS **************/
/********************************/


async function searchFuelStations(


lat,

lon


){


return await searchNearby(

'amenity"="fuel',

lat,

lon

);


}





/********************************/
/******** BORNES ****************/
/********************************/


async function searchChargingStations(


lat,

lon


){


return await searchNearby(

'amenity"="charging_station',

lat,

lon

);


}
