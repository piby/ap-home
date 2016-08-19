/*global isFloat */
/*global endsWithCharacter */

function IngredientTypesData() {
    "use strict";

    /// Class representing all available ingredient types that can
    /// be used sort ingredients for creation of shooping list.

    //id, name
	this.data = [];

    this.setData = function (data) {
        this.data = data;
    };

    this.count = function () {
        return this.data.length;
    };

    this.index = function (typeIdOrName) {
        var i,
            column = 1;
        // negated not a number check to see if argument
        // is a number but in a string form
        if (!isNaN(typeIdOrName)) {
            typeIdOrName = parseInt(typeIdOrName, 10);
            column = 0;
        }
        // find index of specidief unit
        for (i in this.data) {
            if (this.data.hasOwnProperty(i) && (this.data[i][column] === typeIdOrName)) {
                return i;
            }
        }
        return undefined;
    };

    this.add = function (id, name) {
        var i;
        // make sure that we do not have already type with specified name
        if (this.index(name) === undefined) {
            this.data.push([id, name]);
        }
    };

    this.getName = function (index) {
        if (index < this.count()) {
            return this.data[index][1];
        }
        return 'undefined';
    };

    this.getId = function (index) {
        if (index < this.count()) {
            return this.data[index][0];
        }
        return 0;
    };
}

