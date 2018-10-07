//API Keys
//Google Search API Key: AIzaSyDc8BAjqmHGQvYaYLW_bg_AxP986qIkdks
//Hacker News API Key: cf8f9bf8ef354b0687c21810053ada1d
//Zomato API Key: a187d16a240ba282ed1eb4dbc4f431c8
//Weatherbit API Key: 929d8637e5cb4a0b83bffcfc9128e8dd


//Declare global variables to be used 
var userName = "",
    city = "",
    latitude = "",
    longitude = "",
    userArray = [],
    currentDate = "",

    //variables for Maps API only
    map = "",
    platform = "",
    defaultLayers = "",

    //variables for Weather API only
    dateStart = "",
    dateEnd = "",
    apiKey = "929d8637e5cb4a0b83bffcfc9128e8dd",

    //variables for Zomato API only
    foodSelection = ""

    
//This is the Javasript Section for the Here Maps API. Line 40 to 105.

//Iniate the HERE Maps API by connecting to the service platform with the app id and app code. This code comes from the api documentation.
var platform = new H.service.Platform({
    'app_id': "qA8H4eSKAGPuJ30pTryC",
    'app_code': "e7_nFDb6gHJ1Hvp40oOtSQ"

});

// call the default map layers from the API
defaultLayers = platform.createDefaultLayers();


// This click event gets the map data ready and the weather data ready. It is displayed when the final results page loads.
$("#citySubmit").click( function() {

    if ( $("#cityIn").val() !== "" ) {
        $("#citySubmit").off()
        $("#page2Center").slideDown(1000)

        //The first section of this code snippet gets the lat and long for the map API. 

        // Create the parameter for the geocoding request (this must be an object with property "searchText"):
        city = {
            searchText: document.getElementById("cityIn").value
        };

        //The mapDisplay function builds the map from the cooridates delivered by the API
        var mapDisplay = function(result) {
            latitude = result.Response.View[0].Result[0].Location.DisplayPosition.Latitude 
            longitude = result.Response.View[0].Result[0].Location.DisplayPosition.Longitude
            console.log("Lat: " + latitude)
            console.log("Long: " + longitude)
        }

        //This calls the geocoding service from the API.
        var geocoder = platform.getGeocodingService();
        //This executes the converstion of the search term to lat-long, and makes the map display!
        geocoder.geocode(city, mapDisplay, function(e) {
        alert(e);
        });

        //This is the Second section of the code snippet, which gets the data for the average weather.

        dateStart = moment().format("YYYY-MM-DD")
        dateEnd = moment(dateStart, "YYYY-MM-DD").add(1, "days").format("YYYY-MM-DD")
        console.log("search start date: " + dateStart)
        console.log("search end date: " + dateEnd)

        var queryURL = ("https://api.weatherbit.io/v2.0/history/daily?city=" + city.searchText + "&start_date=" + dateStart + "&end_date=" + dateEnd + "&key=" + apiKey + "&units=I");
    
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

                userArray.push(city.searchText, latitude, longitude, aveTemp, minTemp, maxTemp, clouds)
                console.log("userArray: " + userArray)
            })

    } else {
        console.log("error! Modal Incoming")
        //Display the modal warning the user that the train info is incomplete.
        $("#warningModal").modal("toggle")
    }

});

//This is the Javasript Section for all the click and key events in the app.

$(document).ready(function(){
    userArray = []
    $("#page2, #page4, #page2Left, #page2Center, #page2Right, #page4LeftTop, #page4Center, #page4Right").slideUp(0)
    $("#page3").fadeOut(0)

})


//The page1toPage2 function and the next two events watch for the user name submit. Submittal can come from pushing the submit button or pushing the enter key.

var page1toPage2 = function () {

    if ( $("#userIn").val() !== "" ) {

        userArray.push($("#userIn").val().trim())
        $("#page1").slideUp(1000)
        $("#page2, #page2Left").slideDown(1000)
        console.log("userArray: " + userArray)        
    } else {
        console.log("error! Modal Incoming")
        //Display the modal warning the user that the train info is incomplete.
        $("#warningModal").modal("toggle")
    }
    //Reset the text field
    $("#userIn").text("")
}
$("#user-submit").click(function(){

    page1toPage2()
})
$("#page1").keyup(function(event){

    if( event.keyCode === 13 ) {
        page1toPage2()
    }
})

//The next 4 events watches for your food selection and applies some styling while changing the string stored in the food variable.
$(".foodBtn").click( function() {
    foodSelection = $(this).attr("data-name")
    console.log("food: " + foodSelection)
    
    for (let j=0; j<19; j++ ) {
        if ( $("#food"+j).attr("data-name") === $(this).attr("data-name") ) {
            $("#food"+j).css("border", "2px solid rgb(0,0,0,1)")
        } else {
            $("#food"+j).css("border", "2px solid rgb(0,0,0,0)")
        }
    }
})

//The next event watches for the food section submit. *Draft Mode* THis event triggers the loading of the results page.

$("#foodSubmit").click( function() {

    if ( foodSelection !== "" ) {

        //This is the Javasript Section for the Zomato API. Line 146 to.

        //This is the Ajax call for Zomato
        //On a click event, go get the list of Restaurants
            
        $.ajax({
            url: ("https://developers.zomato.com/api/v2.1/search?q=restaurant&lat=" + userArray[2] + "&lon=" + userArray[3] + "&radius=16093.4&sort=rating&order=desc"),
            method: "GET",
            headers: {"user-key" : "a187d16a240ba282ed1eb4dbc4f431c8"}
        }).then( function(response) {
            console.log(response)
            console.log("restuarant1 Name: " + response.restaurants[0].restaurant.name)
            console.log("restuarant1 Rating: " + response.restaurants[0].restaurant.user_rating.aggregate_rating)
            console.log("restuarant1 Menu URL: " + response.restaurants[0].restaurant.menu_url)

            $("#page4Center").html("<p>Taste the Food...</p>")

            for ( let i = 0; i<10; i++ ) {
                var restName = response.restaurants[i].restaurant.name,
                    restRating = response.restaurants[i].restaurant.user_rating.aggregate_rating,
                    restMenu = response.restaurants[i].restaurant.menu_url,
                    restDiv = $("<div id=\"resturantOption" + i + "\">"),
                    restDivFilled = restDiv.html("<a class=\"restLink\" target=\"blank\" id=\"rest" + i + "\" href=\"" + restMenu + "\">" + restName + " Rating: " + restRating + " </a>")
                $("#page4Center").append(restDivFilled)
            }

        })

        //This section updates the displays of all the content containers on the results page.

        $("#page2").slideUp(1000)
        $("#page4").slideDown(1000)
        $("#page4Top").html("<h1>Welcome To " + userArray[1] + "!</h1>")
        $("#page4LeftTop").delay(1000).slideDown(1000)
        $("#page4Center").delay(1500).slideDown(1000)
        $("#page4Right").delay(2000).slideDown(1000)
        userArray.push(foodSelection)
        console.log("userArray: " + userArray)  

        // Display map using H.Map in the format of (element, maptype, options). This code comes partially from the api documentation.
        map = new H.Map(
            //element (in vanilla JS only)
            document.getElementById("page4LeftBottom"),
            //maptype
            defaultLayers.terrain.map,
            //Map settings (default zoom level and lat-long from the geocode results)
            {   
            zoom: 10,
            //This is the search location
            center: { lat: userArray[2], lng: userArray[3] }})
            console.log("Lat on map load: " + userArray[2])
            console.log("Long on map load: " + userArray[3])

            
            // This is the map events section (next 8 lines). This is pulled from the API documentation to make the map interactive.
            var mapEvents = new H.mapevents.MapEvents(map);

            // Add event listeners:
            map.addEventListener('tap', function(evt) {
            // Log 'tap' and 'mouse' events:
            console.log(evt.type, evt.currentPointer.type); 
            var behavior = new H.mapevents.Behavior(mapEvents);
            });
        
        currentDate = moment().format("LL")
        userArray.push(currentDate)
        console.log("userArray: " + userArray)
        
        $("#page4LeftTop").html(
            "<p>Explore the City...</p>" +
            "<p class=\"weatherReport\">On " + currentDate + ", " +
            "it is usually " + userArray[4] + "&#176. " +
            "The average high is " + userArray[5] + "&#176, " +
            "the average low is " + userArray[6] + "&#176, " +
            "and it is " + userArray[7] + "% cloudy.</p>"
            
        )
    } else {
        console.log("error! Modal Incoming")
        //Display the modal warning the user that the train info is incomplete.
        $("#warningModal").modal("toggle")
    }
          
})
    
//This code snippet focuses onto the modal when it displays (taken from bootstrap documentation)
$("#warningModal").on("shown.bs.modal", function () {
    $("#warningModal").trigger("focus")
})



 