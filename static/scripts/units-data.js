/*global isFloat */
/*global endsWithCharacter */

function UnitsData() {
    "use strict";

    /// Class representing all available units that can be used
    /// to describe amount of ingredients needed to prepare recipe.

    //id, jeden, pol, trzy, dwadziescia piec, database flag
	this.data = [];

    this.setData = function (data) {
        this.data = data;
    };

    this.count = function () {
        return this.data.length;
    };

    this.index = function (unitIdOrName) {
        var i,
            column = ((typeof unitIdOrName) === "number") ? 0 : 1;
        // find index of specidief unit
        for (i in this.data) {
            if (this.data.hasOwnProperty(i) && (this.data[i][column] === unitIdOrName)) {
                return i;
            }
        }
        return undefined;
    };

    this.add = function (id, one, half, three, twentyfive, flag) {
        var i;
        // make sure that we do not have already unit with specified name
        if (this.index(one) === undefined) {
            this.data.push([id, one, half, three, twentyfive, flag]);
        }
    };

    this.updateId = function (unitName, id) {
        var index = this.index(unitName);
        if (index === undefined) {
            return;
        }
        this.data[index][0] = id;
        this.data[index][5] = '';
    };

    this.getName = function (index) {
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

    this.decline = function (index, quantity) {
        var forms;
        // return unit if index was not found
        if ((index === undefined) || (index >= this.count())) {
            return undefined;
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
        return forms[1];
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

