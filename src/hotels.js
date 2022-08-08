
// Get URL parameters from the main page
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

function getQueryString() { //this function gets the form data passed from homeExperiences.html
    var result = {}, queryString = location.search.slice(1),
        re = /([^&=]+)=([^&]*)/g, m;

    while (m = re.exec(queryString)) {
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    return result;
}
var loc = getQueryString()["loc"];
var checkin = getQueryString()["checkin"];
var checkout = getQueryString()["checkout"];
var numguest = getQueryString()["numguests"];

var locBox = document.getElementById("destination");
var checkinBox = document.getElementById("checkInDate");
var checkoutBox = document.getElementById("checkOutDate");
var numguestBox = document.getElementById("numGuests");

locBox.value = loc;
checkinBox.value = checkin;
checkoutBox.value = checkout;
numguestBox.value = numguest;



function HTMLRequest(options, printResult) { 
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
function getLatLongData(jsonResult) {
    locBox = document.getElementById("destination");
    var link = "https://maps.googleapis.com/maps/api/geocode/json?address=" + locBox.value + "&key=AIzaSyBLG2HWgQRUvWp3GLtdI7qkUb4VdfHEoJI";

    HTMLRequest({
        method: 'GET',
        url: link,
    }, function printResult(result) {
        var json = JSON.parse(result);
        jsonResult(
            (json)
        );
    });
}

var latitude = 1;
var longitude = 1;

getLatLongData(function jsonResult(json) {
	latitude = json.results[0].geometry.location.lat;
	longitude = json.results[0].geometry.location.lng;
	console.log(json);
    myHotels();
});

function getLatLongDataButton(){
    getLatLongData(function jsonResult(json) {
        latitude = json.results[0].geometry.location.lat;
        longitude = json.results[0].geometry.location.lng;
        console.log(json);
        myHotels();
    });
}
const currency = 'USD';
const locale = 'en_US';
const sort_order = 'GUEST_RATING';

// Container for all output data
const hotel_box = document.getElementById("hotels");

function removeAllChildNodes(parent) {
    /**This function clears out all cards from a div element to prepare for updated information */
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
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

    hotel_box.appendChild(card);
    card.appendChild(h1);
    card.appendChild(description);
}

function displayCards(parent) {
    /**Using the data object global variable, this function will display all the data on separate cards within the parent object */

    resultData.searchResults.results.forEach(quote => {
        const card = document.createElement('div');
        card.setAttribute('class', 'card');

        const h1 = document.createElement('h1');
        h1.textContent = quote.name;

	const picture = document.createElement('img');
	picture.setAttribute('src', quote.optimizedThumbUrls.srpDesktop);
        picture.style.paddingLeft = "50px";

	const starRating = document.createElement('p');
	starRating.textContent = "Star Rating: " + quote.starRating;
        starRating.style.paddingLeft = "50px";

	const price = document.createElement('p');
	price.textContent = "Price: $" + quote.ratePlan.price.exactCurrent + " /per night";
        price.style.paddingLeft = "50px";

	const guestRating = document.createElement('p');
	guestRating.textContent = "Guest Rating: " + quote.guestReviews.rating + "/5 (" + quote.guestReviews.total + " reviews)";
        guestRating.style.paddingLeft = "50px";

	const freeCancel = document.createElement('p');
	if (quote.ratePlan.features.freeCancellation == true) {
		freeCancel.textContent = "Free Cancellation!";
        	freeCancel.style.paddingLeft = "50px";
	}

        parent.appendChild(card);
        card.appendChild(h1);
	card.appendChild(picture);
        card.appendChild(starRating);
	card.appendChild(price);
	card.appendChild(guestRating);
	card.appendChild(freeCancel);
    });
}

function myHotels() {

	const xhr = new XMLHttpRequest();
	xhr.withCredentials = true;

	xhr.onload = function() {
		resultData = JSON.parse(this.response);
		console.log(resultData);

		removeAllChildNodes(hotel_box);
		if (xhr.status >= 200 && xhr.status < 400) {
			if (resultData.searchResults.totalCount) {
				displayCards(hotel_box);
			} else {
				displayMessage("No Results");
			}
		} else {
			displayMessage ("Error: " + resultData.detail[0].msg, "");
		}
	}

	xhr.open("GET", "https://hotels-com-provider.p.rapidapi.com/v1/hotels/nearby?checkout_date="+ checkoutBox.value +"&currency=USD&sort_order=STAR_RATING_HIGHEST_FIRST&adults_number=" + numguestBox.value + "&longitude=" + longitude + "&locale=en_US&latitude=" + latitude + "&checkin_date=" + checkinBox.value +"&children_ages=4%2C0%2C15&guest_rating_min=4&price_min=10&amenity_ids=527%2C2063&star_rating_ids=3%2C4%2C5&page_number=1&theme_ids=14%2C27%2C25&price_max=500&accommodation_ids=20%2C8%2C15%2C5%2C1");
	xhr.setRequestHeader("x-rapidapi-key", "4e35033bfemsh40103b608cb80f4p145d4djsn135bc3cba603");
	xhr.setRequestHeader("x-rapidapi-host", "hotels-com-provider.p.rapidapi.com");

	xhr.send();
}



