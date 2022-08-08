
// Get URL parameters from the main page
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

let cityFrom = urlParams.has('cityFrom') ? urlParams.get('cityFrom') : "";
let cityTo = urlParams.has('cityTo') ? urlParams.get('cityTo') : "";
let depDate = urlParams.has('depDate') ? urlParams.get('depDate') : "";
let retDate = urlParams.has('retDate') ? urlParams.get('retDate') : "";

let placeFrom = "";
let placeTo = "";

// Set the values of the input boxes on the page to the parameters
const leavingFrom = document.getElementById('leavingfrom');
leavingFrom.value = cityFrom;
const goingTo = document.getElementById('goingto');
goingTo.value = cityTo;
const depart_box = document.getElementById("depDate");
depart_box.value = depDate;
const return_box = document.getElementById("retDate");
return_box.value = retDate;

const country = 'US';
const currency = "USD";

// Setup data objects
var departData = {};
var destinationData = {};
var resultData = {};

// Container for all output data
const flight_box = document.getElementById("flights");

function removeAllChildNodes(parent) {
    /**This function clears out all cards from a div element to prepare for updated information */
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function getDepartLoc() {
    /**This function will make a request to the flights API to generate airports to fly from for the drop-down menu */
    if (cityFrom == "" || country == "") {
        return;
    }
    const departRequest = new XMLHttpRequest();
    departRequest.withCredentials = true;

    departRequest.onload = function () {
        departData = JSON.parse(this.response);
        console.log(departData);

        const departFromSelect = document.getElementById("departFrom");
        removeAllChildNodes(departFromSelect);
        departData.Places.forEach(airport => {
            const choice = document.createElement('option');
            choice.setAttribute("value", airport.PlaceId);
            choice.textContent = airport.PlaceName;
            departFromSelect.appendChild(choice);
        });
    }

    departRequest.open("GET", "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/" + country + "/" + currency + "/en-US/?query=" + cityFrom);
    departRequest.setRequestHeader("x-rapidapi-key", "9ddc2837femsha9f3de8de437c74p1229afjsn4d6a487b8450");
    departRequest.setRequestHeader("x-rapidapi-host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com");

    departRequest.send();
}

function getDestinationLoc() {
    /**This function will make a request to the flights API to generate airports to fly to for the drop-down menu */
    if (cityTo == "" || country == "") {
        return;
    }
    const destinationRequest = new XMLHttpRequest();
    destinationRequest.withCredentials = true;

    destinationRequest.onload = function () {
        destinationData = JSON.parse(this.response);
        console.log(destinationData);

        const destinationSelect = document.getElementById("destination");
        removeAllChildNodes(destinationSelect);
        destinationData.Places.forEach(airport => {
            const choice = document.createElement('option');
            choice.setAttribute("value", airport.PlaceId);
            choice.textContent = airport.PlaceName;
            destinationSelect.appendChild(choice);
        });
    }

    destinationRequest.open("GET", "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/" + country + "/" + currency + "/en-US/?query=" + cityTo);
    destinationRequest.setRequestHeader("x-rapidapi-key", "9ddc2837femsha9f3de8de437c74p1229afjsn4d6a487b8450");
    destinationRequest.setRequestHeader("x-rapidapi-host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com");

    destinationRequest.send();
}

function updateChoices() {
    getDepartLoc();
    getDestinationLoc();
}

function passVariablesOnScreen() {
    /**This function will update the airport from and to drop-down menus with the values from the origin city and destination city textboxes */
    cityFrom = document.getElementById("leavingfrom").value;
    cityTo = document.getElementById("goingto").value;

    updateChoices();
}

function displayMessage(message, desc) {
    /**This function will add a card with a customized message and description
     * 
     * It is used for error messages and a message to display if there are no actual results
     */
    const card = document.createElement('div');
    card.setAttribute('class', 'card');

    const h1 = document.createElement('h1');
    h1.textContent = message;
    const description = document.createElement('p');
    description.textContent = desc

    flight_box.appendChild(card);
    card.appendChild(h1);
    card.appendChild(description);
}

function displayCards(parent) {
    /**Using the data object global variable, this function will display all the data on separate cards within the parent object */

    resultData.Quotes.forEach(quote => {
        const card = document.createElement('div');
        card.setAttribute('class', 'card');

        const h1 = document.createElement('h1');
        h1.textContent = placeFrom + " => " + placeTo;

        const date = document.createElement('p');
        date_var = new Date(quote.OutboundLeg.DepartureDate);
        date.textContent = date_var.toDateString() + " - " + (quote.Direct ? "Direct" : "Indirect");

        const description = document.createElement('p');
        description.textContent = "Minimum Price: " + quote.MinPrice;

        parent.appendChild(card);
        card.appendChild(h1);
        card.appendChild(date);
        card.appendChild(description);
    });
}

function myFlights() {
    /**This function is the final request to the API to get the quotes for flight prices. 
     * It uses the values of the two drop-down menus as well as the date text boxes. 
     * The dates are not required, and will be handled properly if left blank.*/

    placeFrom = document.getElementById("departFrom").value;
    placeTo = document.getElementById("destination").value;
    depDate = document.getElementById("depDate").value;
    retDate = document.getElementById("retDate").value;

    if (placeFrom == "" || placeTo == "") {
        removeAllChildNodes(flight_box);
        displayMessage("One or more textboxes aren't filled", "");
        return;
    }
    depDate = depDate == "" ? "anytime" : depDate;
    retDate = retDate == "" ? "anytime" : retDate;

    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.onload = function () {
        resultData = JSON.parse(this.response);
        console.log(resultData);

        removeAllChildNodes(flight_box);
        if (xhr.status >= 200 && xhr.status < 400) {
            // set variables for page navigation

            if (resultData.Quotes.length) {
                displayCards(flight_box);
            } else {
                displayMessage("No results", "Try removing the departure/return dates");
            }
        } else {
            // Error handling
            displayMessage("Error: " + data.error, "");
        }

    }

    xhr.open("GET", "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/USD/en-US/" + placeFrom + "/" + placeTo + "/" + depDate + "/?inboundpartialdate=" + retDate);
    xhr.setRequestHeader("x-rapidapi-key", "9ddc2837femsha9f3de8de437c74p1229afjsn4d6a487b8450");
    xhr.setRequestHeader("x-rapidapi-host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com");

    xhr.send();
}
