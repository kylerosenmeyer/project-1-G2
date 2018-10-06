//Google Search API Key: AIzaSyDc8BAjqmHGQvYaYLW_bg_AxP986qIkdks
//Hacker News API Key: cf8f9bf8ef354b0687c21810053ada1d


//     url: "https://places.cit.api.here.com/places/v1/discover/search?app_id=qA8H4eSKAGPuJ30pTryC&app_code=e7_nFDb6gHJ1Hvp40oOtSQ&at=52.531,13.3843&q=Brandenburg+Gate",
//     method: "GET"
// }).then( function(response) {
//     console.log(response)
// })

$(document).ready(function(){
    $("#page1, #page2").fadeOut(0)
    $("#page1").fadeIn(2000)
})
$("#user-submit").click(function(){
    $("#page1").fadeOut(1000) 
    $("#page2").delay(1000).fadeIn(1000)  
})
$("#page1").keyup(function(event){
    if(event.keyCode===13){
        console.log("keycode "+event.keyCode)
        $("#page1").fadeOut(1000) 
        $("#page2").delay(1000).fadeIn(1000)         
    }
})


