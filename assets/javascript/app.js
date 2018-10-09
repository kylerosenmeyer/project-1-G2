//API Keys
//Zomato API Key: a187d16a240ba282ed1eb4dbc4f431c8
//Weatherbit API Key: 929d8637e5cb4a0b83bffcfc9128e8dd

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCrV2_SdRz9hU-1HoYHdYX7o0kaILlgE7A",
    authDomain: "tilly-travel.firebaseapp.com",
    databaseURL: "https://tilly-travel.firebaseio.com",
    projectId: "tilly-travel",
    storageBucket: "tilly-travel.appspot.com",
    messagingSenderId: "1030289818810"
};

firebase.initializeApp(config);
firebase.database.enableLogging(true);

//Declare global variables to be used 
var userName = "",
    city = "",
    latitude = "",
    longitude = "",
    userArray = [],
    currentDate = "",
    userObject = {},
    coordinates = [],
    database = firebase.database(),

    //variables for Maps API only
    map = "",
    platform = "",
    defaultLayers = "",
    mapDisplay = "",

    //variables for Weather API only
    dateStart = "",
    dateEnd = "",
    apiKey = "929d8637e5cb4a0b83bffcfc9128e8dd",

    //variables for Zomato API only
    foodSelection = ""


//This is the docunent ready code section. The main action happening here is the setup of the subsequent pages, and the animation of the globes.

$(document).ready(function(){
    userArray = []
    userObject = {}
    $("#page2, #page4, #page2Left, #page2Right").slideUp(0)
    $("#page3").fadeOut(0)

    //This conditional section changes the way the globes animate when they come in. Kind of like a media query. For now there are only two ways the globes come in, the desktop version and mobile version. But more mobile versions are probably necessary.
    if ( window.innerHeight > window.innerWidth) {
        var totalWidth = window.innerWidth
            globeTop = String(Math.floor(0.35*totalWidth) + "px")
            globeLeft = String(Math.floor(0.05*totalWidth) + "px")
            globeSize = String(Math.floor(0.93*totalWidth) + "px")
        $("#globe1, #globe2, #globe3").animate({
            "top": globeTop,
            "left": globeLeft,
            "font-size": globeSize,
            "opacity": "0.8"
        }, 2000)
    } else {
        var totalWidth = window.innerWidth
            globeTop = String(Math.floor(0.001*totalWidth) + "px")
            globeLeft = String(Math.floor(0.26*totalWidth) + "px")
            globeSize = String(Math.floor(0.50*totalWidth) + "px")
        $("#globe1, #globe2, #globe3").animate({
            "top": globeTop,
            "left": globeLeft,
            "font-size": globeSize,
            "opacity": "0.8"
        }, 2000)
    }

})

//The page1toPage2 function and the next two events watch for the user name submit. Submittal can come from pushing the submit button or pushing the enter key.

var page1toPage2 = function () {

    userName = $("#userIn").val().trim()
    //If the user has entered anthying into the user name field
    if ( userName !== "" ) {

        //Store the userName in the userArray
        userArray.push(userName)
        console.log("userArray: " + userArray) 

        //This pulls the child "userName" from the parent "users" if it exists
        var userPath = database.ref("users/" + userName + "/userName")
        console.log("firebasePath: " + userPath.toString())

        //And this grabs the values of "userName" and "userCity" from that child.
        userPath.on("value", function(snap) {

            var firebaseCheck = snap.val()

            //Log the parameters to verify they were built correctly.
            console.log("userCheck: " + userName)
            console.log("firebaseCheck: " + firebaseCheck)

            //And now check the condition.
            if ( firebaseCheck == userName ) {
            //This is a bug. Do not call buildResults on this condition. need alternative.
            //    buildResults()

            } else {
                //Transition the content from page 1 to page2, question 1.
                $("#page1").slideUp(1000)
                $("#page2, #page2Left").slideDown(1000)
                $("#globe1").animate({
                    "opacity": "0"
                }, 1000)
                $("#globe3").css({"opacity":"0"})
            }
        })  

    //Else pop up the modal
    } else {

        console.log("error! Modal Incoming")
        //Display the modal warning the user that the train info is incomplete.
        $("#warningModal").modal("toggle")
    }
    //Reset the text field
    $("#userIn").text("")
}

//The following click and keyup methods watch for the user to complete the first page, and then run the page1toPage2 transition.
$("#user-submit").click(function(){

    page1toPage2()
})
$("#page1").keyup(function(event){

    if( event.keyCode === 13 ) {

        page1toPage2()
    }
})


//On the citySubmit click the main task is store the city as a proper search query term and a second version in a nice title format. 
$("#citySubmit").click( function() {

    if ( $("#cityIn").val() !== "" ) {
        
        $("#citySubmit").off()
        $("#page2Right").slideDown(2000)

        $("#globe2").animate({
            "opacity":"0"
        }, 2000)

        $("#globe3").animate({
            "opacity": "0.8"
        }, 2000)

        //First, get the value of the user's search, and create an empty array and variable.
        var cityInput = $("#cityIn").val().trim(),
            cityBreakdown = [],
            citySearchRebuilt = "",
            cityRebuilt = ""
        //Break the search term down to it's character codes and push them to the empty array.
        for ( let k=0; k<cityInput.length; k++ ) {
            cityBreakdown.push( cityInput.charCodeAt(k) )
        }

        console.log("citybreakdown1: " + cityBreakdown)
        //First convert all the codes to lower case.
        for ( let m=0; m<cityBreakdown.length; m++ ) {
            if ( ( cityBreakdown[m] > 64 ) && ( cityBreakdown[m] < 91 ) ) {
                cityBreakdown[m] = ( cityBreakdown[m] + 32 )
            }
        }

        console.log("citybreakdown2: " + cityBreakdown)
        //Capitalize the first letter.
        cityBreakdown[0] = ( cityBreakdown[0] - 32 )

        //Check for spaces, and after any space, capitalize the next letter.
        for ( let n=0; n<cityBreakdown.length; n++ ) {
            if ( cityBreakdown[n] === 32 ) {
                cityBreakdown[n+1] = ( cityBreakdown[n+1] - 32 )
            }
        }

        //Rebuild the corrected character code array into a string.
        for ( let p=0; p<cityBreakdown.length; p++ ) {

            cityRebuilt += String.fromCharCode( cityBreakdown[p] )
        }

        //After the city name is rebuilt, rebuild the city search term with hyphens instead of spaces (if any)
        for ( let q=0; q<cityBreakdown.length; q++ ) {
            if ( cityBreakdown[q] === 32 ) {
                cityBreakdown[q] = ( cityBreakdown[q] + 13 )
            }
            citySearchRebuilt += String.fromCharCode( cityBreakdown[q] )
        }

        userArray.push(cityRebuilt, citySearchRebuilt)
        console.log("userArray: " + userArray)

         //Pop up the modal if the user has not entered anything into the city search.
    } else {
        console.log("error! Modal Incoming")
        //Display the modal warning the user that the train info is incomplete.
        $("#warningModal").modal("toggle")
    }
})

//The next event watches for your food selection and applies some styling while changing the string stored in the food variable.
$(".foodBtn").click( function() {
    foodSelection = $(this).attr("data-name")
    
    for (let j=0; j<19; j++ ) {
        if ( $("#food"+j).attr("data-name") === $(this).attr("data-name") ) {
            $("#food"+j).css("border", "2px solid rgb(0,0,0,1)")
        } else {
            $("#food"+j).css("border", "2px solid rgb(0,0,0,0)")
        }
    }
})

//On the foodsubmit click, the main task is to store the foodchoice into the userArray, push the user info into firebase, and run the buildResults function.

$("#foodSubmit").click( function() {

    if ( foodSelection !== "" ) {

        userArray.push(foodSelection)
        console.log("userArray: " + userArray)
        
    } else {
        console.log("error! Modal Incoming")
        //Display the modal warning the user that the train info is incomplete.
        $("#warningModal").modal("toggle")
    }

    //Put the userObejct into Firebase
    database.ref("users/" + userArray[0]).set({
        userName: userArray[0],
        userCity: userArray[1],
        cityQuery: userArray[2],
        foodChoice: userArray[3],
    })

    //This calls all the api queries and builds the results page!
    buildResults()
     
});

//This is the function that builds the results page from the User's data.
var buildResults = function() {

    //declare variables to pull data from user's info

    var userCitypath = database.ref("users/" + userName + "/userCity"),
        userQuerypath = database.ref("users/" + userName + "/cityQuery"),
        userFoodpath = database.ref("users/" + userName + "/foodChoice"),
        pulluserCity = "",
        pullcityQuery = "",
        pullfoodChoice = "",
        currentDate = moment().format("LL")

        userCitypath.on( "value", function(snap) { pulluserCity = snap.val() } )
        userQuerypath.on( "value", function(snap) { pullcityQuery = snap.val() } )
        userFoodpath.on( "value", function(snap) { pullfoodChoice = snap.val() } )

    //Iniate the HERE Maps API by connecting to the service platform with the app id and app code. This code comes from the api documentation.
    var    platform = new H.service.Platform({
        'app_id': "qA8H4eSKAGPuJ30pTryC",
        'app_code': "e7_nFDb6gHJ1Hvp40oOtSQ"

    });

    // call the default map layers from the API
    defaultLayers = platform.createDefaultLayers();

    //The mapDisplay function builds the map from the cooridates delivered by the API
    mapDisplay = function(result) {
        latitude = result.Response.View[0].Result[0].Location.DisplayPosition.Latitude 
        longitude = result.Response.View[0].Result[0].Location.DisplayPosition.Longitude
        coordinates.push(latitude, longitude)
        console.log("Lat check1: " + latitude)
        console.log("Long check1: " + longitude)
        console.log("coordinate check1: " + coordinates)
        
        // Display map using H.Map in the format of (element, maptype, options). This code comes partially from the api documentation.
        
        map = new H.Map(
            //element (in vanilla JS only)
            document.getElementById("mapContainer"),
            //maptype
            defaultLayers.terrain.map,
            //Map settings (default zoom level and lat-long from the geocode results)
            {   
            zoom: 8,
            //This is the search location
            center: { lat: coordinates[0], lng: coordinates[1] }})
            console.log("Lat on map load: " + coordinates[0])
            console.log("Long on map load: " + coordinates[1])

            
            // This is the map events section (next 8 lines). This is pulled from the API documentation to make the map interactive.
            var mapEvents = new H.mapevents.MapEvents(map);

            // Add event listeners:
            map.addEventListener('tap', function(evt) {
            // Log 'tap' and 'mouse' events:
            console.log(evt.type, evt.currentPointer.type); 
            var behavior = new H.mapevents.Behavior(mapEvents);

        })
    }
    
    //Put the rebuilt city string into the search parameter. This will ensure consistency in searching API's and displaying results.
    city = {
        searchText: pullcityQuery
    };

    //This calls the geocoding service from the API.
    var geocoder = platform.getGeocodingService();
    //This executes the converstion of the search term to lat-long, and makes the map display!
    geocoder.geocode(city, mapDisplay, function(e) {
    alert(e);
    });
    
    console.log("doublecheck lat and long: ")
    console.log(coordinates[0], coordinates[1])
    //This is the Second section of the code snippet, which gets the data for the average weather.

    dateStart = moment().format("YYYY-MM-DD")
    dateEnd = moment(dateStart, "YYYY-MM-DD").add(1, "days").format("YYYY-MM-DD")
    console.log("search start date: " + dateStart)
    console.log("search end date: " + dateEnd)

    //This is the search query for the Weatherbit API: Historical Weather Daily
    var queryURL = ("https://api.weatherbit.io/v2.0/history/daily?city=" + pullcityQuery+ "&start_date=" + dateStart + "&end_date=" + dateEnd + "&key=" + apiKey + "&units=I");

    console.log("query URL: " + queryURL)
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then( function(response) {
        var aveTemp = response.data[0].temp,
            minTemp = response.data[0].min_temp,
            maxTemp = response.data[0].max_temp,
            clouds = response.data[0].clouds

            console.log("avg temp: " + aveTemp)
            console.log("min temp: " + minTemp)
            console.log("max temp: " + maxTemp)
            console.log("cloud percent: " + clouds)


        //This is the Third section of the code snippet, which gets the data from the current weather api (weatherbit) for whether the city is in day or night.

        var queryURL2 = ("https://api.weatherbit.io/v2.0/current?city=" + pullcityQuery + "&key=" + apiKey)

        console.log("query URL2: " + queryURL2)
        $.ajax({
            url: queryURL2,
            method: "GET"
        }).then( function(response) {
            var dayNight = response.data[0].pod  
            console.log("Day or Night: " + dayNight)
            //Set the color of results page based on whether the city's local time is day or night.
            if ( dayNight === "n" ) {
                $("#page4, .row9, .row10, .row11, .row12").css({
                    "background-image": "linear-gradient(45deg,rgb(47, 71, 99),rgb(27, 51, 78))",
                    "color": "white"
                })
                setTimeout( function() {
                    $(".restLink").removeClass("restLink").addClass("restLinkNight")
                },5000)
                

            } 
        })

        //Place the weather data into paragraph form on the results page.
        $("#page4story").html(
            "<p>Explore the City...</p>" +
            "<p class=\"weatherReport\">On " + currentDate + ", " +
            "it is usually " + aveTemp + "&#176. " +
            "The average high is " + maxTemp + "&#176, " +
            "the average low is " + minTemp + "&#176, " +
            "and it is " + clouds + "% cloudy.</p>"
            
        )
    })

    //This is the Ajax call for Zomato
    //On a click event, go get the list of Restaurants
    setTimeout( function() {
        
        $.ajax({
            url: ("https://developers.zomato.com/api/v2.1/search?q=restaurant&lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&radius=16093.4&sort=rating&order=desc"),
            method: "GET",
            headers: {"user-key" : "a187d16a240ba282ed1eb4dbc4f431c8"},
            
        }).then( function(response) {
            console.log("coordinates triple check: ")
            console.log(coordinates[0], coordinates[1])
            console.log(response)
            console.log("restuarant1 Name: " + response.restaurants[0].restaurant.name)
            console.log("restuarant1 Rating: " + response.restaurants[0].restaurant.user_rating.aggregate_rating)
            console.log("restuarant1 Menu URL: " + response.restaurants[0].restaurant.menu_url)
            
            //Check the city location of the first restaurant from the search.
            var cityCheck = response.restaurants[0].restaurant.location.city 
            console.log("cityCheck: " + cityCheck)
            console.log("userCity: " + pulluserCity)
    
            //If the API is not pulling restuarants from the same city that the user searched for, find out, and change the outcome of the restuarant search. 
            if ( cityCheck === pulluserCity ) {
                $("#page4food").html("<p>Taste the Food...</p>")
    
                //Grab the restaurant name, the aggregate rating, and the menu url, and then build a link/button for each restuarant and append it to the results page.
                for ( let i = 0; i<12; i++ ) {
                    var restName = response.restaurants[i].restaurant.name,
                        restRating = response.restaurants[i].restaurant.user_rating.aggregate_rating,
                        restMenu = response.restaurants[i].restaurant.menu_url,
                        restDiv = $("<div class=\"restOptions\">"),
                        restDivFilled = restDiv.html("<a href=\"" + restMenu + "\" target=\"blank\"><button class=\"restLink\" target=\"blank\" id=\"rest" + i + "\">" + restName + " Rating: " + restRating + " </button></a>")
                    $("#page4food").append(restDivFilled)
    
                }
                
            } else {
                $("#page4food").html("<p>Oops! Looks like we don't have restuarants in this location.</p>")
    
                //Set the color of results page based on whether the city's local time is day or night.
            }
        });
        
    },3000)

    

    //This section updates the displays of all the content containers on the results page.

    $("#page2").slideUp(1000)
    $("#page4").slideDown(1000)
    $("#page4Top").html("<h1 id=\"resultTitle\">Imagine a Day in " + pulluserCity + ".</h1>")
        
        
}
    
//This code snippet focuses onto the modal when it displays (taken from bootstrap documentation)
$("#warningModal").on("shown.bs.modal", function () {
    $("#warningModal").trigger("focus")
})



 