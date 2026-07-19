/********************************/
/******** RECHERCHE GPS *********/
/********************************/


const NOMINATIM_URL =

"https://nominatim.openstreetmap.org/search";



let searchMarker = null;

let userIsSearching = false;




/********************************/
/******** RECHERCHE *************/
/********************************/


async function performSearch(){


    let input =

    document.getElementById(

        "searchInput"

    );



    if(

        !input

    ){

        return;

    }



    let query =

    input.value.trim();



    if(

        !query

    ){

        return;

    }



    try{


        let response =

        await fetch(

            `${NOMINATIM_URL}?`+

            `q=${encodeURIComponent(query)}`+

            `&format=json`+

            `&limit=1`

        );



        let results =

        await response.json();




        if(

            !results.length

        ){

            alert(

                "Aucun résultat."

            );



            return;

        }




        let result =

        results[0];



        let latitude =

        parseFloat(

            result.lat

        );



        let longitude =

        parseFloat(

            result.lon

        );




        userIsSearching = true;

        followUser = false;




        displaySearchResult(

            latitude,

            longitude,

            result.display_name

        );



        setDestination(

            latitude,

            longitude

        );



    }


    catch(error){


        console.error(

            error

        );


        alert(

            "Erreur de recherche."

        );


    }


}





/********************************/
/******** AFFICHAGE *************/
/********************************/


function displaySearchResult(


latitude,

longitude,

name


){


    if(

        searchMarker

    ){


        map.removeLayer(

            searchMarker

        );


    }



    searchMarker =


    L.marker(

        [

            latitude,

            longitude

        ]

    )

    .addTo(

        map

    )

    .bindPopup(

        name

    )

    .openPopup();




    map.setView(

        [

            latitude,

            longitude

        ],

        16

    );


}





/********************************/
/******** NAVIGATION ************/
/********************************/


async function navigateToSearch(){


    let position =

    getCurrentPosition();



    if(

        !position

    ){

        return;

    }



    if(

        !destination

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


    }


}





/********************************/
/******** SUIVI UTILISATEUR ******/
/********************************/


function enableFollowUser(){


    followUser = true;


}




function disableFollowUser(){


    followUser = false;


}
