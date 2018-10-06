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

    //variables for Maps API only
    map = "",
    platform = "",
    defaultLayers = "",

    //variables for Weather API only
    dateStart = "",
    dateEnd = "",
    apiKey = "929d8637e5cb4a0b83bffcfc9128e8dd",

    //variables for Zomato API only













    
//This is the Javasript Section for the Here Maps API. Line 40 to 105.

//Iniate the HERE Maps API by connecting to the service platform with the app id and app code. This code comes from the api documentation.
var platform = new H.service.Platform({
    'app_id': "qA8H4eSKAGPuJ30pTryC",
    'app_code': "e7_nFDb6gHJ1Hvp40oOtSQ"

});

// call the default map layers from the API
defaultLayers = platform.createDefaultLayers();


// This click event brings up the map from the search city.
$("#searchBtn").click( function() {

    //First get the lat and long of the search location by sending it to the API using the geo coding service.

    // Create the parameter for the geocoding request (this must be an object with property "searchText"):
    var searchParam = {
        searchText: document.getElementById("searchBox2").value
    };

    //The mapDisplay function builds the map from the cooridates delivered by the API
    var mapDisplay = function(result) {
        latitude = result.Response.View[0].Result[0].Location.DisplayPosition.Latitude 
        longitude = result.Response.View[0].Result[0].Location.DisplayPosition.Longitude
        console.log("Lat: " + latitude)
        console.log("Long: " + longitude)

        // Display map using H.Map in the format of (element, maptype, options). This code comes partially from the api documentation.
        map = new H.Map(
        //element (in vanilla JS only)
        document.getElementById("mapContainer"),
        //maptype
        defaultLayers.terrain.map,
        //Map settings (default zoom level and lat-long from the geocode results)
        {   
        zoom: 13,
        //This is the search location
        center: { lat: latitude, lng: longitude }})
        console.log("Lat2: " + latitude)
        console.log("Long2: " + longitude)
            
        userArray.push(searchParam.searchText, latitude, longitude)
        console.log("userArray: " + userArray)
        
        // This is the map events section (next 8 lines). This is pulled from the API documentation to make the map interactive.
        var mapEvents = new H.mapevents.MapEvents(map);

        // Add event listeners:
        map.addEventListener('tap', function(evt) {
        // Log 'tap' and 'mouse' events:
        console.log(evt.type, evt.currentPointer.type); 
        });
        var behavior = new H.mapevents.Behavior(mapEvents);
    }

    //This calls the geocoding service from the API.
    var geocoder = platform.getGeocodingService();
    //This executes the converstion of the search term to lat-long, and makes the map display!
    geocoder.geocode(searchParam, mapDisplay, function(e) {
    alert(e);
    });

});

//This is the Javasript Section for the Weatherbit API. Line 107 to 144.

//When "Select a Place button is selected, store the text string as the city, and set the dates for today and tomorrow to use in the api call."
$("#button1").click( function() {
    city = $("#searchBox").val().trim()
    console.log("city: " + city)
    dateStart = moment().format("YYYY-MM-DD")
    dateEnd = moment(dateStart, "YYYY-MM-DD").add(1, "days").format("YYYY-MM-DD")
    console.log("search start date: " + dateStart)
    console.log("search end date: " + dateEnd)
})        

//When "Get Average Weather" is clicked, run the api call and display the average temp, average hi, averge low, and average cloudiness.
$("#button2").click( function() {
    var queryURL = ("https://api.weatherbit.io/v2.0/history/daily?city=" + city + "&start_date=" + dateStart + "&end_date=" + dateEnd + "&key=" + apiKey + "&units=I");
    
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

            $("#weatherReport").html(
                "<p>Usually, it is an average of " + aveTemp + "&#8457 today,</p>" +
                "<p>the average high is " + minTemp + "&#8457,</p>" +
                "<p>the average low is " + maxTemp + "&#8457,</p>" +
                "<p>and it is " + clouds + "% cloudy."
            )
        })
})

//This is the Javasript Section for the Zomato API. Line 146 to.

//This is the Ajax call for Zomato
//On a click event, go get the list of Restaurants

$("#id").click( function() {
    
    $.ajax({
        url: ("https://developers.zomato.com/api/v2.1/search?q=restaurant&lat=" + latitude + "&lon=" + longitude + "&radius=16093.4&sort=rating&order=asc"),
        method: "GET",
        headers: {"user-key" : "a187d16a240ba282ed1eb4dbc4f431c8"}
    }).then( function(response) {
        console.log(response)
    })
})

//This is the Javasript Section for all the click and key events in the app.

$(document).ready(function(){

    $("#page1, #page2").fadeOut(0)
    $("#page1").fadeIn(2000)

})
$("#user-submit").click(function(){

    $("#page1").fadeOut(1000) 
    $("#page2").delay(1000).fadeIn(1000) 

})
$("#page1").keyup(function(event){

    if( event.keyCode === 13 ) {

        console.log("keycode: " + event.keyCode)

        $("#page1").fadeOut(1000) 
        $("#page2").delay(1000).fadeIn(1000)         
    }
})


 