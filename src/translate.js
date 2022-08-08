
window.onclick = e => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const language = urlParams.has('lang') ? urlParams.get('lang') : "en";

    const content = e.target.innerHTML;
    const tag = e.target.tagName;
    if (tag != "LABEL" && (content == "" || tag == "BODY" || tag == "BUTTON" || tag == "DIV" || tag == "UL" || tag == "SELECT" || e.target.href)) {
        return;
    }

    const url = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=' + language;
    const body = [{
        'Text': content
    }]

    var request = new XMLHttpRequest();
    request.open('POST', url, true);

    // set the authorization key and the return type (JSON)
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("Ocp-Apim-Subscription-Key", "66a0fdc9ed974a31a6e9b8fee142f6ae");
    request.setRequestHeader("Ocp-Apim-Subscription-Region", "centralus");

    request.onload = function () {
        var data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            e.target.innerHTML = data[0].translations[0].text;
        } else {
            console.error(data.error.message);
        }
    }
    request.send(JSON.stringify(body));
}

function setLanguage(language) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('lang', language);
    var refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + urlParams.toString();
    window.history.pushState({ path: refresh }, '', refresh);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function start_contrast() {
    var contrast = getCookie("contrast");
    const button = document.getElementById('contrast');

    if (contrast == "false" || contrast == "") { // high contrast is on
        button.innerHTML = "Contrast On";
    } else {
        button.innerHTML = "Contrast Off";
    }

    update_contrast();
}

function set_contrast() {
    var contrast = getCookie("contrast");
    const button = document.getElementById('contrast');

    if (contrast == "false" || contrast == "") {
        setCookie("contrast", "true", 30);
        button.innerHTML = "Contrast Off";
    } else {
        setCookie("contrast", "false", 30);
        button.innerHTML = "Contrast On";
    }

    update_contrast();
}

function update_contrast() {

    var contrast = getCookie("contrast");
    const style = document.getElementById('style_sheet');

    if (contrast == "false" || contrast == "") {
        style.setAttribute('href', 'style.css');
    } else {
        style.setAttribute('href', 'high_contrast_style.css');
    }

    const head = document.getElementsByTagName('head');
    head[0].appendChild(style);
}
