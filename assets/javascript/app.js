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
// firebase.database.enableLogging(true);

//Declare global variables to be used 
var userName = "",
    city = "",
    latitude = "",
    longitude = "",
    userArray = [],
    currentDate = "",
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
    foodSelection = "",
    categoryId = ""


//This is the docunent ready code section. This fades out or slides up all the pages we don't want to see on landing.

$(document).ready(function(){
    $("#pres2, #pres3, #page1").fadeOut(0)
    $("#page2, #page4, #page2Left, #page2Right").slideUp(0)
    $("#page3").fadeOut(0)

})

//This is the transistion from slide one to slide two.

$("#pres1").click(function(){

    setTimeout( function() {

        console.log("going anyway")
        if ( $(".skipBtn").attr("data-toggle") == "false" ) {
            $("#pres1").fadeOut(1000)
            $("#pres2").delay(1000).fadeIn(1000)
        }
    },200)
})

//This is the transistion from slide two to slide three.

$("#pres2").click(function(){
    $("#pres2").fadeOut(1000)
    $("#pres3").delay(1000).fadeIn(1000)
})

//This is the transistion from slide three to slide main-page.

$("#pres3").click(function(){
    $("#pres3").fadeOut(1000)
    $("#page1").delay(1000).fadeIn(1000)
    
    //This timeout function delays the animation of the globe slightly to come in nicely with page 1. 
    setTimeout(function(){
        //This conditional section changes the way the globes animate when they come in. Kind of like a media query. 
        //For now there are only two ways the globes come in, the desktop version and mobile version. 
        //But more mobile versions are probably necessary.
        if ( window.innerHeight > window.innerWidth) {
            var totalWidth = window.innerWidth
                globeTop = String(Math.floor(0.1*totalWidth) + "px")
                globeLeft = String(Math.floor(0.1*totalWidth) + "px")
                globeSize = String(Math.floor(0.80*totalWidth) + "px")
            $("#globe1, #globe2, #globe3").animate({
                "top": globeTop,
                "left": globeLeft,
                "font-size": globeSize,
                "opacity": "0.8"
            }, 2000)
        } else {
            var totalWidth = window.innerWidth
                globeTop = String(Math.floor(0.01*totalWidth) + "px")
                globeLeft = String(Math.floor(0.27*totalWidth) + "px")
                globeSize = String(Math.floor(0.48*totalWidth) + "px")
            $("#globe1, #globe2, #globe3").animate({
                "top": globeTop,
                "left": globeLeft,
                "font-size": globeSize,
                "opacity": "0.8"
            }, 2000)
        }
    },1550)
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
            if ( firebaseCheck === userName ) {
            //Bring up the user check modal if the user is already in firebase. This gives the user a chance to start over or go to their last day plan. The events for this modal are
            //at the bottom of this javascript file.
            $("#usercheckModal").modal("toggle")

            } else {
                //Transition the content from page 1 to page2, question 1.
                $("#page1").slideUp(1000)
                $("#page2").slideDown(1000)
                $("#page2Left").slideDown(1000)
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
        $("#page2Right").slideDown(2000);

        $("#globe2").animate({
            "opacity":"0"
        }, 2000);

        $("#globe3").animate({
            "opacity": "0.8"
        }, 2000);

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
    categoryId = $(this).attr("data-id")
    
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

        userArray.push(foodSelection, categoryId)
        console.log("userArray: " + userArray)
        
    } else {
        console.log("error! Modal Incoming")
        //Display the modal warning the user that the train info is incomplete.
        $("#warningModal").modal("toggle")
    }

    $("#globe3").fadeOut(1000)

    //Put the userObejct into Firebase
    database.ref("users/" + userArray[0]).set({
        userName: userArray[0],
        userCity: userArray[1],
        cityQuery: userArray[2],
        foodChoice: userArray[3],
        categoryID: userArray[4]
    })

    //This calls all the api queries and builds the results page!
    buildResults()
     
});

//This is the function that builds the results page from the User's data.
var buildResults = function() {

    //declare variables to pull data from user's info
    console.log("userName: " + userName)
    var userCitypath = database.ref("users/" + userName + "/userCity"),
        userQuerypath = database.ref("users/" + userName + "/cityQuery"),
        userCategorypath = database.ref("users/" + userName + "/categoryID"),
        userFoodpath = database.ref("users/" + userName + "/foodChoice")
        pulluserCity = "",
        pullcityQuery = "",
        pullfoodChoice = "",
        pullcategoryId = "",
        currentDate = moment().format("LL")

        userCitypath.on( "value", function(snap) { pulluserCity = snap.val() } )
        userQuerypath.on( "value", function(snap) { pullcityQuery = snap.val() } )
        userFoodpath.on( "value", function(snap) { pullfoodChoice = snap.val() } )
        userCategorypath.on( "value", function(snap) { pullcategoryId = snap.val() } )
        console.log("pulluserCity: " + pulluserCity)
        console.log("pullcityQuery: " + pullcityQuery)
        console.log("pullfoodChoice: " + pullfoodChoice)
        console.log("pullcategoryId: " + pullcategoryId)

    setTimeout( function() {
        //This section updates the displays of all the content containers on the results page.

        $("#page2").slideUp(1000)
        $("#page4").slideDown(1000, function() {
            console.log("slideDown done")
        })
        
        $("#page4Top").html("<h1 id=\"resultTitle\">Good Morning from " + pulluserCity + ".</h1>")

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
            setTimeout( function() {
                console.log("map loading!")
                map = new H.Map(
                    //element (in vanilla JS only)
                    document.getElementById("mapContainer"),
                    //maptype
                    defaultLayers.terrain.map,
                    //Map settings (default zoom level and lat-long from the geocode results)
                    {   
                    zoom: 14,
                    //This is the search location
                    center: { lat: coordinates[0], lng: coordinates[1] }
                });

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

            },1500)
            
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
        
        //This is the weather section of the function. It queries two apis, historical weather and current weather. 

        dateStart = moment().format("YYYY-MM-DD")
        dateEnd = moment(dateStart, "YYYY-MM-DD").add(1, "days").format("YYYY-MM-DD")
        console.log("search start date: " + dateStart)
        console.log("search end date: " + dateEnd)

        //This is the search query for the Weatherbit API: Historical Weather Daily
        var queryURL = ("https://api.weatherbit.io/v2.0/history/daily?city=" + pullcityQuery+ "&start_date=" + dateStart + "&end_date=" + dateEnd + "&key=" + apiKey + "&units=I");

        setTimeout( function() {
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
                    //In phase 1 this information is not being used.
                })

                //Place the weather data into paragraph form on the results page.
                $("#page4story").html(
                    "<p class=\"page4Title\"><i class=\"fas fa-map-marker pinLeft\"></i>It's Your Day!<i class=\"fas fa-map-marker pinRight\"></i></p>" +
                    "<p>Walking through a new place for the first time is exciting, fun, and memorable. Your day will be even better if you can plan for the weather. So we prepared a typical weather day for you.</p>" +
                    "<p>On " + currentDate + ", " +
                    "it is usually " + aveTemp + "&#176. " +
                    "The average high is " + maxTemp + "&#176, " +
                    "the average low is " + minTemp + "&#176, " +
                    "and it is " + clouds + "% cloudy.</p>" +
                    "<p>And one more thing. We printed a map for you, and pinned it below! Happy Exploring."
                )
                ScrollReveal().reveal("#page4story", {
                    duration: 3000,
                })
            })
        },1000)
        
        

        //This is the Ajax call for Zomato
        //On a click event, go get the list of Restaurants
        setTimeout( function() {
            
            $.ajax({
                url: ("https://developers.zomato.com/api/v2.1/search?q=restaurant&lat=" + coordinates[0] + "&lon=" + coordinates[1] + "&radius=16093.4&sort=rating&order=desc&category=" + pullcategoryId),
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
                    $("#page4food").html("<p class=\"page4Title\"><i class=\"fas fa-map-marker pinLeft\"></i>Find Great Food and Drinks...<i class=\"fas fa-map-marker pinRight\"></i></p>")
        
                    //Grab the restaurant name, the aggregate rating, and the menu url, and then build a link/button for each restuarant and append it to the results page.
                    for ( let i = 0; i<8; i++ ) {
                        var restName = response.restaurants[i].restaurant.name,
                            restRating = response.restaurants[i].restaurant.user_rating.aggregate_rating,
                            restMenu = response.restaurants[i].restaurant.menu_url,
                            restDiv = $("<div class=\"restOptions\">"),
                            restDivFilled = restDiv.html("<i class=\"fas fa-map-marker pinLeft\"></i><a href=\"" + restMenu + "\" target=\"blank\"><button class=\"restLink\" target=\"blank\" id=\"rest" + i + "\">" + restName + " Rating: " + restRating + " </button></a>")
                        $("#page4food").append(restDivFilled)
                        //These are the scroll reveals for the restaurant buttons and search widget.
                        ScrollReveal().reveal(".restOptions", {
                            duration: 1500,
                        })

                        ScrollReveal().reveal("#rest"+i, {
                            duration: 3000,
                        })

                        ScrollReveal().reveal("#searchWidget", {
                            duration: 3000,
                        })
                    }
                    
                } else {
                    $("#page4food").html("<p>Oops! Looks like we don't have restuarants in this location.</p>")
                    
                    ScrollReveal().reveal(".restOptions", {
                        duration: 1500,
                    })

                    ScrollReveal().reveal("#rest"+i, {
                        duration: 3000,
                    })

                    ScrollReveal().reveal("#searchWidget", {
                        duration: 3000,
                    })
                }
            });
            
        },3500)

    },1000)
    
        
    console.log("pulluserCity2: " + pulluserCity)
    console.log("pullcityQuery2: " + pullcityQuery)
    console.log("pullfoodChoice2: " + pullfoodChoice)
    console.log("pullcategoryId2: " + pullcategoryId)
}

//This event starts a new day for a user who been flagged as a return user. This overwrites their old data.
$("#newDay").click( function() {
    //Transition the content from page 1 to page2, question 1.
    $("#page1").slideUp(1000)
    $("#page2").slideDown(1000)
    $("#page2Left").slideDown(1000)
    $("#globe1").animate({
        "opacity": "0"
    }, 1000)
    $("#globe3").css({"opacity":"0"})
})

//This event reloads a saved search from a return user.
$("#oldDay").click( function() {
    $("#page1").slideUp(1500)
    setTimeout( function() {
        buildResults()
    },2000)
})

//This event skips the presentation and goes straight to page 1.
$(".skipBtn").click( function() {
    $(this).attr("data-toggle", "true")
    $("#pres1").fadeOut(1000)
    $("#page1").delay(1000).fadeIn(2200)

    setTimeout(function(){
        //This conditional section changes the way the globes animate when they come in. Kind of like a media query. For now there are only two ways the globes come in, the desktop version and mobile version. But more mobile versions are probably necessary.
        if ( window.innerHeight > window.innerWidth) {
            var totalWidth = window.innerWidth
                globeTop = String(Math.floor(0.1*totalWidth) + "px")
                globeLeft = String(Math.floor(0.1*totalWidth) + "px")
                globeSize = String(Math.floor(0.80*totalWidth) + "px")
            $("#globe1, #globe2, #globe3").animate({
                "top": globeTop,
                "left": globeLeft,
                "font-size": globeSize,
                "opacity": "0.8"
            }, 2000)
        } else {
            var totalWidth = window.innerWidth
                globeTop = String(Math.floor(0.01*totalWidth) + "px")
                globeLeft = String(Math.floor(0.27*totalWidth) + "px")
                globeSize = String(Math.floor(0.48*totalWidth) + "px")
            $("#globe1, #globe2, #globe3").animate({
                "top": globeTop,
                "left": globeLeft,
                "font-size": globeSize,
                "opacity": "0.8"
            }, 2000)
        }

    },1000)
})
    
//This code snippet focuses onto the modal when it displays (taken from bootstrap documentation)
$("#warningModal").on("shown.bs.modal", function () {
    $("#warningModal").trigger("focus")
})

$("#usercheckModal").on("shown.bs.modal", function () {
    $("#usercheckModal").trigger("focus")
})

 