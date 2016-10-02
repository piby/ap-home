/*global $, jQuery*/

String.prototype.format = String.prototype.f = function () {
    "use strict";
    var s = this,
        i = arguments.length;
    while (i > -1) {
        i -= 1;
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

function isFloat(value) {
    "use strict";
    return (value === +value) && (value !== (value | 0));
}

function endsWithCharacter(value, characters) {
    "use strict";
    var strValue = value.toString();
    if (characters.search(strValue.substr(strValue.length - 1)) === -1) {
        return false;
    }
    return true;
}

function cleanNameString(string) {
    "use strict";
    // remove leading and trailing white spaces
    string = string.replace(/^\s+|\s+$/g, '');
    // replace multiple spaces with single space
    string = string.replace(/\s\s+/g, ' ');
    // make string lowercase
    string = string.toLowerCase();
    return string;
}

function cleanQuantity(value) {
    "use strict";
    if ($.type(value) === "string") {
        value = parseFloat(value);
    }
    var floorValue = Math.floor(value);
    return (value % 1 === 0) ? floorValue : value;
}

function getCookie(name) {
    "use strict";
    var cookieValue = null,
        cookies,
        cookie,
        i;
    if (document.cookie && document.cookie !== '') {
        cookies = document.cookie.split(';');
        for (i = 0; i < cookies.length; i += 1) {
            cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    "use strict";
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        "use strict";
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});
