
function UnitsData() {

    /// Class representing all available units that can be used
    /// to describe amount of ingredients needed to prepare recipe.

	this.data = [
		//jeden, pol, trzy, dwadziescia piec, database flag
		['butelka', 'butelki', 'butelki', 'butelek', ''],
		['sloik', 'sloika', 'sloiki', 'sloikow', ''],
		['sztuka', 'sztuki', 'sztuki','sztuk', ''],
		['szklanka', 'szklanki', 'szklanki', 'szklanek', ''],
		['litr', 'litra', 'litry', 'litrow', ''],
		['lyzka', 'lyzki', 'lyzki', 'lyzek', ''],
		['lyzeczka', 'lyzeczki', 'lyzeczki', 'lyzeczek', ''],
		['paczka', 'paczki', 'paczki', 'paczek', ''],
		['puszka', 'puszki', 'puszki', 'puszek', ''],
		['opakowanie', 'opakowania', 'opakowania', 'opakowan', ''],
		['worek', 'worka', 'worki', 'workow', ''],
		['kilogram', 'kilograma', 'kilogramy', 'kilogramow', ''],
		['karton', 'kartonu', 'kartony', 'kartonow', ''],
	];

    this.count = function() {
        return this.data.length;
    }

    this.add = function(one, half, three, twentyfive) {
        // make sure that we do not have already unit with specified name
        for (var i in this.data) {
            if (this.name(i) == one) {
                return;
            }
        }
        this.data.push([one, half, three, twentyfive, 'add']);
    }

    this.name = function(index) {
        if (index < this.count()) {
            return this.data[index][0];
        }
        return 'undefined';
    }

    this.getDatabaseFlag = function(index) {
        if (index < this.count()) {
            return this.data[index][4];
        }
        return '';
    }

    this.getAllForms = function(index) {
        if (index < this.count()) {
            return [
                this.data[0],
                this.data[1],
                this.data[2],
                this.data[3]
            ];
        }
        return [];
    }

    this.decline = function(unit, quantity) {
        var index = undefined;
        // find index of specidief unit
        for (var i in this.data) {
            if (this.data[i][0] == unit) {
                index = i;
                break;
            }
        }
        // return unit if index was not found
        if (index == undefined) {
            return unit;
        }
        var forms = this.data[index];
        // determine correct unit form depending on quantity
        if (isFlaot(quantity)) {
            return forms[1];
        }
        else if ((quantity > 4) && (quantity < 22)) {
            return forms[3];
        }
        else if (endsWithCharacter(quantity, '234')) {
            return forms[2];
        }
        else if (quantity != 1 ) {
            return forms[3];
        }
        return unit;
    }
}

