function HTMLRequest(options, printResult) { //This is what actually does the HTTP request, akin to curl
  setTimeout(function () {
      var x = new XMLHttpRequest();
      x.open(options.method, options.url);
      x.onload = x.onerror = function () {
          printResult(
              (x.responseText || '')
          );
      };
      x.send(options.data);
  });
}
function getLatLongData(jsonResult){ //Use google maps geocode API to get address from latlng
  geoFindMe(function latlong(result){
    console.log(result);
    var link = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + result + "&key=AIzaSyBLG2HWgQRUvWp3GLtdI7qkUb4VdfHEoJI";
  
    HTMLRequest({
        method: 'GET',
        url: link,
    }, function printResult(result) {
        var json = JSON.parse(result);
        jsonResult(
            (json)
        );
    });
  });
}

getLatLongData(function jsonResult(json){
  console.log(json);
  fromBox = document.getElementById("from");
  fromBox.value = json.results[2].formatted_address; //set address on from box
});


function getQueryString() { //this function gets the form data passed from homeExperiences.html
  var result = {}, queryString = location.search.slice(1),
      re = /([^&=]+)=([^&]*)/g, m;

  while (m = re.exec(queryString)) {
      result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  }
  return result;
}

var latidude;
var longitude;

function geoFindMe(latlong) { //this function gets the latitude and longitude from geolocation HTML API

  const fromBox = document.getElementById("from");

  function success(position) {
    latitude  = position.coords.latitude;
    longitude = position.coords.longitude;

    fromBox.value = latitude + "," + longitude;
    latlong(
      (fromBox.value)
    );
  }

  function error() {
    fromBox.value = 'Unable to retrieve your location';
  }

  if(!navigator.geolocation) {
    fromBox.textContent = 'Geolocation is not supported by your browser';
  } else {
    fromBox.textContent = 'Locating…';
    navigator.geolocation.getCurrentPosition(success, error);
  }
}


var place = getQueryString()["place"];
var passThruPlace = document.querySelectorAll("[id='place']");
for (var i = 0; i < passThruPlace.length; i++) {
    passThruPlace[i].value = place;
}
var decodedPlace = decodeURI(place).replace(/[&\/\\# +()$~%.'":*?<>{}]/g, " ");
var toBox = document.getElementById("to");
toBox.value = decodedPlace;
//set map options
var myLatLng = { lat: 39.8283, lng: -98.5795 };
var mapOptions = {
    center: myLatLng,
    zoom: 5,
    mapTypeId: google.maps.MapTypeId.ROADMAP

};

//create map
var map = new google.maps.Map(document.getElementById('map'), mapOptions);

//create a DirectionsService object to use the route method and get a result for our request
var directionsService = new google.maps.DirectionsService();

//create a DirectionsRenderer object which we will use to display the route
var directionsDisplay = new google.maps.DirectionsRenderer();

//bind the DirectionsRenderer to the map
directionsDisplay.setMap(map);



//define calcRoute function
function calcRoute() {
  //create request
  var request = {
      origin: document.getElementById("from").value,
      destination: document.getElementById("to").value,
      travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
      unitSystem: google.maps.UnitSystem.IMPERIAL
  }
  console.log()
  //pass the request to the route method
  directionsService.route(request, function (result, status) {
      if (status == google.maps.DirectionsStatus.OK) {

          //Get distance and time
          //const output = document.querySelector('#output');
          //output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";
          const distanceBox = document.getElementById('distance');
          const timeBox = document.getElementById('time');
          distanceBox.innerHTML = result.routes[0].legs[0].distance.text;
          timeBox.innerHTML = result.routes[0].legs[0].duration.text;
          //display route
          directionsDisplay.setDirections(result);
      } else {
          //delete route from map
          directionsDisplay.setDirections({ routes: [] });
          //center map in London
          map.setCenter(myLatLng);

          //show error message
          //output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
      }
  });

}

//create autocomplete objects for all inputs
var options = {
  types: ['(cities)']
}

var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);