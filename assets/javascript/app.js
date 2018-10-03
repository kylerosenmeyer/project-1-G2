//Google Search API Key: AIzaSyDc8BAjqmHGQvYaYLW_bg_AxP986qIkdks
//Hacker News API Key: cf8f9bf8ef354b0687c21810053ada1d

// $.ajax({
//     url: "http://api.worldbank.org/v2/countries/all/indicators/SP.POP.TOTL?page=2",
//     METHOD: "GET"
// }).then( function(snap){
//     console.log(snap)
// })

var platform = new H.service.Platform({
    'app_id': 'qA8H4eSKAGPuJ30pTryC',
    'app_code': 'e7_nFDb6gHJ1Hvp40oOtSQ'
  });

  // Obtain the default map types from the platform object:
var defaultLayers = platform.createDefaultLayers();

// Instantiate (and display) a map object:
var map = new H.Map(
  document.getElementById('mapContainer'),
  defaultLayers.normal.map,
  {
    zoom: 10,
    center: { lat: 52.5, lng: 13.4 }
  });
