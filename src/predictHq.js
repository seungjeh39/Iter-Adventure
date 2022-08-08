
var num_pages = 0;
var current_page = 0;
var data = {};
var image_data = {};
const culture_box = document.getElementById('culture');

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function displayMessage(message, desc) {
    const card = document.createElement('div');
    card.setAttribute('class', 'card');

    const h1 = document.createElement('h1');
    h1.textContent = message;
    const description = document.createElement('p');
    description.textContent = desc

    culture_box.appendChild(card);
    card.appendChild(h1);
    card.appendChild(description);
}

function displayCards(parent) {
    datapoints = data.results;


    for (var j = current_page * 5; j < current_page * 5 + 5; j++) {
        if (j >= datapoints.length) {
            break;
        }
        const image_request = new XMLHttpRequest();
        image_request.open('GET', "https://api.pexels.com/v1/search?query=" + datapoints[j].title + "&per_page=1", true);
        image_request.setRequestHeader("Authorization", "563492ad6f91700001000001fdf5e3e97b884d1ab73f8e0e503e92bc");

        const img = document.createElement('img');
        img.setAttribute('style', 'float:left;height:130px');

        const content_box = document.createElement('div');
        content_box.setAttribute('style', 'padding:1em;display:flex;flex-direction:row');

        image_request.onload = function () {

            image_data = JSON.parse(this.response);
            console.log(image_data);
            if (image_request.status >= 200 && image_request.status < 400) {
                if (image_data.photos.length) {
                    img.setAttribute('src', image_data.photos[0].src.small);
                    content_box.appendChild(img);
                }
            }
            content_box.appendChild(description);
        }
        image_request.send();

        const card = document.createElement('div');
        card.setAttribute('class', 'card');

        const h1 = document.createElement('h1');
        h1.textContent = datapoints[j].title;

        const date = document.createElement('p');
        date_var = new Date(datapoints[j].end);
        date.textContent = date_var.toDateString() + " - Category: " + datapoints[j].category;

        const description = document.createElement('p');
        description.setAttribute('style', 'float:left;');
        description.textContent = datapoints[j].description;

        parent.appendChild(card);
        card.appendChild(h1);
        card.appendChild(date);
        card.appendChild(content_box);
    }
}

function displayNavButtons(parent) {
    const back_button = document.createElement('button');
    back_button.textContent = "Back";
    back_button.setAttribute("onclick", "backPage()");
    back_button.setAttribute("style", "margin-left:2em;float:left;")
    if (current_page == 0) {
        back_button.setAttribute("disabled", "true");
    }

    const current_page_display = document.createElement('p');
    current_page_display.textContent = "page " + (current_page + 1) + " of " + num_pages;
    current_page_display.setAttribute("style", "float:left;margin-left:14em;padding:0;");

    const next_button = document.createElement('button');
    next_button.textContent = "Next";
    next_button.setAttribute("onclick", "nextPage()");
    next_button.setAttribute("style", "float:right;")
    if (current_page == num_pages - 1) {
        next_button.setAttribute("disabled", "true");
    }

    const box = document.createElement('div');
    box.setAttribute("style", "width: 700px;margin-bottom:2em");
    const br = document.createElement('br');

    parent.appendChild(box);
    box.appendChild(back_button);
    box.appendChild(current_page_display);
    box.appendChild(next_button);
    parent.appendChild(br);
}

function getCategories() {
    let fest = document.getElementById('festivals').checked ? "festivals" : "";
    let conc = document.getElementById('concerts').checked ? "concerts" : "";
    let perf = document.getElementById('performing-arts').checked ? "performing-arts" : "";
    let comm = document.getElementById('community').checked ? "community" : "";
    let expo = document.getElementById('expos').checked ? "expos" : "";
    let spor = document.getElementById('sports').checked ? "sports" : "";
    let categories = [fest, conc, perf, comm, expo, spor];

    let categoryStr = "";
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].length) {
            categoryStr += categories[i] + "%2C";
        }
    }
    categoryStr = categoryStr.substr(0, categoryStr.length - 3);
    if (categoryStr.length) {
        categoryStr = 'category=' + categoryStr;
    }
    return categoryStr;
}

function myCulture() {

    country_to_symbol = { "Zimbabwe": "ZW", "Zambia": "ZM", "South Africa ": "ZA", "Yemen": "YE", "Samoa": "WS", "Wallis and Futuna": "WF", "Vanuatu": "VU", "Vietnam": "VN", "United States Virgin Islands": "VI", "British Virgin Islands": "VG", "Venezuela": "VE", "Saint Vincent and the Grenadines": "VC", "Vatican City": "VA", "Uzbekistan": "UZ", "United States": "US", "Uruguay": "UY", "United States Minor Outlying Islands": "UM", "Ukraine": "UA", "Uganda": "UG", "Tanzania": "TZ", "Taiwan": "TW", "Tuvalu": "TV", "Turkey": "TR", "Tunisia": "TN", "Trinidad and Tobago": "TT", "Tonga": "TO", "Timor-Leste": "TL", "Turkmenistan": "TM", "Tokelau": "TK", "Tajikistan": "TJ", "Thailand": "TH", "Togo": "TG", "Chad": "TD", "Turks and Caicos Islands": "TC", "Syria": "SY", "Seychelles": "SC", "Sint Maarten": "SX", "Eswatini": "SZ", "Sweden": "SE", "Slovenia": "SI", "Slovakia": "SK", "Suriname": "SR", "São Tomé and Príncipe": "ST", "South Sudan": "SS", "Serbia": "RS", "Saint Pierre and Miquelon": "PM", "Somalia": "SO", "San Marino": "SM", "El Salvador": "SV", "Sierra Leone": "SL", "Solomon Islands": "SB", "Svalbard and Jan Mayen": "SJ", "South Georgia": "GS", "Singapore": "SG", "Senegal": "SN", "Sudan": "SD", "Saudi Arabia": "SA", "Rwanda": "RW", "Russia": "RU", "Romania": "RO", "Réunion": "RE", "Qatar": "QA", "Palestine": "PS", "French Polynesia": "PF", "Paraguay": "PY", "Portugal": "PT", "North Korea": "KP", "Puerto Rico": "PR", "Poland": "PL", "Papua New Guinea": "PG", "Palau": "PW", "Philippines": "PH", "Peru": "PE", "Pitcairn Islands": "PN", "Panama": "PA", "Pakistan": "PK", "Oman": "OM", "New Zealand": "NZ", "Nauru": "NR", "Nepal": "NP", "Norway": "NO", "Netherlands": "NL", "Niue": "NU", "Nicaragua": "NI", "Nigeria": "NG", "Norfolk Island": "NF", "Niger": "NE", "New Caledonia": "NC", "Namibia": "NA", "Mayotte": "YT", "Malaysia": "MY", "Malawi": "MW", "Mauritius": "MU", "Martinique": "MQ", "Montserrat": "MS", "Mauritania": "MR", "Mozambique": "MZ", "Northern Mariana Islands": "MP", "Mongolia": "MN", "Montenegro": "ME", "Myanmar": "MM", "Malta": "MT", "Mali": "ML", "Macedonia": "MK", "Marshall Islands": "MH", "Mexico": "MX", "Maldives": "MV", "Madagascar": "MG", "Moldova": "MD", "Monaco": "MC", "Morocco": "MA", "Saint Martin": "MF", "Macau": "MO", "Latvia": "LV", "Luxembourg": "LU", "Lithuania": "LT", "Lesotho": "LS", "Sri Lanka": "LK", "Liechtenstein": "LI", "Saint Lucia": "LC", "Libya": "LY", "Liberia": "LR", "Lebanon": "LB", "Laos": "LA", "Kuwait": "KW", "Kosovo": "XK", "South Korea": "KR", "Saint Kitts and Nevis": "KN", "Kiribati": "KI", "Cambodia": "KH", "Kyrgyzstan": "KG", "Kenya": "KE", "Kazakhstan": "KZ", "Japan": "JP", "Jordan": "JO", "Jersey": "JE", "Jamaica": "JM", "Italy": "IT", "Israel": "IL", "Iceland": "IS", "Iraq": "IQ", "Iran": "IR", "Ireland": "IE", "British Indian Ocean Territory": "IO", "India": "IN", "Isle of Man": "IM", "Indonesia": "ID", "Hungary": "HU", "Haiti": "HT", "Croatia": "HR", "Honduras": "HN", "Heard Island and McDonald Islands": "HM", "Hong Kong": "HK", "Guyana": "GY", "Guam": "GU", "French Guiana": "GF", "Guatemala": "GT", "Greenland": "GL", "Grenada": "GD", "Greece": "GR", "Equatorial Guinea": "GQ", "Guinea-Bissau": "GW", "Gambia": "GM", "Guadeloupe": "GP", "Guinea": "GN", "Gibraltar": "GI", "Ghana": "GH", "Guernsey": "GG", "Georgia": "GE", "United Kingdom": "GB", "Gabon": "GA", "Micronesia": "FM", "Faroe Islands": "FO", "France": "FR", "Falkland Islands": "FK", "Fiji": "FJ", "Finland": "FI", "Ethiopia": "ET", "Estonia": "EE", "Spain": "ES", "Western Sahara": "EH", "Eritrea": "ER", "Egypt": "EG", "Ecuador": "EC", "Algeria": "DZ", "Dominican Republic": "DO", "Denmark": "DK", "Dominica": "DM", "Djibouti": "DJ", "Germany": "DE", "Czechia": "CZ", "Cyprus": "CY", "Cayman Islands": "KY", "Christmas Island": "CX", "Curaçao": "CW", "Cuba": "CU", "Costa Rica": "CR", "Cape Verde": "CV", "Comoros": "KM", "Colombia": "CO", "Cook Islands": "CK", "Republic of the Congo": "CG", "DR Congo": "CD", "Cameroon": "CM", "Ivory Coast": "CI", "China": "CN", "Chile": "CL", "Switzerland": "CH", "Cocos (Keeling) Islands": "CC", "Canada": "CA", "Central African Republic": "CF", "Botswana": "BW", "Bouvet Island": "BV", "Bhutan": "BT", "Brunei": "BN", "Barbados": "BB", "Brazil": "BR", "Caribbean Netherlands": "BQ", "Bolivia": "BO", "Bermuda": "BM", "Belize": "BZ", "Belarus": "BY", "Saint Helena, Ascension and Tristan da Cunha": "SH", "Saint Barthélemy": "BL", "Bosnia and Herzegovina": "BA", "Bahamas": "BS", "Bahrain": "BH", "Bulgaria": "BG", "Bangladesh": "BD", "Burkina Faso": "BF", "Benin": "BJ", "Belgium": "BE", "Burundi": "BI", "Azerbaijan": "AZ", "Austria": "AT", "Australia": "AU", "Antigua and Barbuda": "AG", "French Southern and Antarctic Lands": "TF", "Antarctica": "AQ", "American Samoa": "AS", "Armenia": "AM", "Argentina": "AR", "United Arab Emirates": "AE", "Andorra": "AD", "Albania": "AL", "Åland Islands": "AX", "Anguilla": "AI", "Angola": "AO", "Afghanistan": "AF", "Aruba": "AW" }

    var event_request = new XMLHttpRequest();
    let country = country_to_symbol[document.getElementById('countries').value];

    event_request.open('GET', 'https://api.predicthq.com/v1/events?' + getCategories() + '&country=' + country + '&limit=25', true);

    // set the authorization key and the return type (JSON)
    event_request.setRequestHeader("Authorization", "Bearer R3qahp9v_QWnjOfLquoHgjZuMsuwk9uNL6tGBRTL");
    event_request.setRequestHeader("Accept", "application/json");

    event_request.onload = function () {

        // Begin accessing JSON data here
        data = JSON.parse(this.response);

        removeAllChildNodes(culture_box);
        if (event_request.status >= 200 && event_request.status < 400) {
            // set variables for page navigation
            num_pages = num_pages = Math.ceil(data.results.length / 5);
            current_page = 0;

            if (!data.results.length) {
                displayMessage("No Results", "Try leaving all categories unchecked");
            } else {
                // show navigation buttons and query results
                displayNavButtons(culture_box);
                displayCards(culture_box);
                displayNavButtons(culture_box);
            }
        } else {
            // Error handling
            displayMessage("Error: " + data.error, "");
        }
    }
    event_request.send();
}

function backPage() {
    if (current_page > 0) {
        current_page--;
    } else {
        return;
    }

    removeAllChildNodes(culture_box);
    displayNavButtons(culture_box);
    displayCards(culture_box);
    displayNavButtons(culture_box);
}

function nextPage() {
    if (current_page < num_pages - 1) {
        current_page++;
    } else {
        return;
    }

    removeAllChildNodes(culture_box);
    displayNavButtons(culture_box);
    displayCards(culture_box);
    displayNavButtons(culture_box);
}

//passes form data to weather page to get location info
function getQueryString() { //this function gets the form data passed from homeExperiences.html
    var result = {}, queryString = location.search.slice(1),
        re = /([^&=]+)=([^&]*)/g, m;

    while (m = re.exec(queryString)) {
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    return result;
}

var place = getQueryString()["place"];
//document.getElementById("place").value = place;
var passThruPlace = document.querySelectorAll("[id='place']");
for (var i = 0; i < passThruPlace.length; i++) {
    passThruPlace[i].value = place;
}
var date = getQueryString()["date"];
//TODO, input date info, might not be needed though