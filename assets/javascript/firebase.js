// needed in the HTML
// <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script> */}
// <script src="https://www.gstatic.com/firebasejs/5.5.2/firebase.js"></script> */}

  
  
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

  var database = firebase.database();
  
  document.onkeyup = function(event) {

    // Determines which key was pressed.
    var disBeAvalue = event.key;
    console.log(event.key);
    database.ref().set({
      disBeAvalue: event.key,
    });

  };


