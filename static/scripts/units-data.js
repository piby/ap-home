/*global isFloat */
/*global endsWithCharacter */

function UnitsData() {

    /// Class representing all available units that can be used
    /// to describe amount of ingredients needed to prepare recipe.

	this.data = [
		//id, jeden, pol, trzy, dwadziescia piec, database flag
		[0, 'butelka', 'butelki', 'butelki', 'butelek', ''],
		[1, 'sloik', 'sloika', 'sloiki', 'sloikow', ''],
		[2, 'sztuka', 'sztuki', 'sztuki', 'sztuk', ''],
		[3, 'szklanka', 'szklanki', 'szklanki', 'szklanek', ''],
		[4, 'litr', 'litra', 'litry', 'litrow', ''],
		[5, 'lyzka', 'lyzki', 'lyzki', 'lyzek', ''],
		[6, 'lyzeczka', 'lyzeczki', 'lyzeczki', 'lyzeczek', ''],
		[7, 'paczka', 'paczki', 'paczki', 'paczek', ''],
		[8, 'puszka', 'puszki', 'puszki', 'puszek', ''],
		[9, 'opakowanie', 'opakowania', 'opakowania', 'opakowan', ''],
		[10, 'worek', 'worka', 'worki', 'workow', ''],
		[11, 'kilogram', 'kilograma', 'kilogramy', 'kilogramow', ''],
		[12, 'karton', 'kartonu', 'kartony', 'kartonow', '']
	];

    this.setData = function (data) {
        this.data = data;
    };

    this.count = function () {
        return this.data.length;
    };

    this.add = function (one, half, three, twentyfive) {
        var i;
        // make sure that we do not have already unit with specified name
        for (i in this.data) {
            if (this.data.hasOwnProperty(i) && (this.name(i) === one)) {
                return;
            }
        }
        this.data.push([999999, one, half, three, twentyfive, 'add']);
    };

    this.name = function (index) {
        if (index < this.count()) {
            return this.data[index][1];
        }
        return 'undefined';
    };

    this.getDatabaseFlag = function (index) {
        if (index < this.count()) {
            return this.data[index][5];
        }
        return '';
    };

    this.getAllForms = function (index) {
        if (index < this.count()) {
            return [
                this.data[1],
                this.data[2],
                this.data[3],
                this.data[4]
            ];
        }
        return [];
    };

    this.decline = function (unit, quantity) {
        var index,
            i,
            forms;
        // find index of specidief unit
        for (i in this.data) {
            if (this.data.hasOwnProperty(i) && (this.data[i][1] === unit)) {
                index = i;
                break;
            }
        }
        // return unit if index was not found
        if (index === undefined) {
            return unit;
        }
        forms = this.data[index];
        // determine correct unit form depending on quantity
        if (isFloat(quantity)) {
            return forms[2];
        } else if ((quantity > 4) && (quantity < 22)) {
            return forms[4];
        } else if (endsWithCharacter(quantity, '234')) {
            return forms[3];
        } else if (quantity !== 1) {
            return forms[4];
        }
        return unit;
    };

    this.getBaseForm = function (form) {
        var i, j;
        for (i in this.data) {
            if (this.data.hasOwnProperty(i)) {
                for (j in this.data[i]) {
                    if (this.data[i].hasOwnProperty(j) && (this.data[i][j] === form)) {
                        return this.data[i][1];
                    }
                }
            }
        }
    };
}

