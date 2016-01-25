
String.prototype.format = String.prototype.f = function () {
    var s = this,
        i = arguments.length;
    while (i > -1) {
        i -= 1;
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

function isFlaot(value) {
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

