
String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;
    while (i > -1) {
        i -= 1;
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

function isFloat(value) {
    return (value === +value) && (value !== (value | 0));
}

function endsWithCharacter(value, characters) {
    var strValue = value.toString();
    if (characters.search(strValue.substr(strValue.length - 1)) === -1) {
        return false;
    }
    return true;
}

function cleanNameString(string) {
    // remove leading and trailing white spaces
    string = string.replace(/^\s+|\s+$/g, '');
    // remove all characters that are not leters or space
    string = string.replace(/[^A-Za-z\s]/g, '');
    // replace multiple spaces with single space
    string = string.replace(/\s\s+/g, ' ');
    // make string lowercase
    string = string.toLowerCase();
    return string;
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});
