/*jslint browser: true*/
/*global cleanQuantity*/

function IngredientsData() {
    "use strict";

    /// Class containing list of all ingredients that can be used in dish.

    /// Representation of data that is stored in database. Every item in
    /// array consists of database ID's, ingredient name, category type,
    /// default quantity, default unit, and operation flag.
    this.data = [];

    this.setData = function (data) {
        this.data = data;
    };

    this.count = function () {
        return this.data.length;
    };

    this.index = function (ingredientIdOrName) {
        var i,
            column = ((typeof ingredientIdOrName) === "number") ? 0 : 1;
        // find index of specidief unit
        for (i in this.data) {
            if (this.data.hasOwnProperty(i) && (this.data[i][column] === ingredientIdOrName)) {
                return i;
            }
        }
        return undefined;
    };

    this.add = function (id, name, type, defaultQuantity, defaultUnit, flag) {
        var i;
        // make sure that we do not have ingredient with specified name
        for (i in this.data) {
            if (this.data.hasOwnProperty(i)) {
                if (this.getName(i) === name) {
                    return;
                }
            }
        }
        defaultQuantity = cleanQuantity(defaultQuantity);
        this.data.push([id, name, type, defaultQuantity, defaultUnit, flag]);
    };

    this.updateId = function (name, id) {
        var index = this.index(name);
        if (index === undefined) {
            return;
        }
        this.data[index][0] = id;
        this.data[index][5] = '';
    };

    this.update = function (index, defaultQuantity, defaultUnit) {
        if (index > this.count()) {
            return;
        }
        this.data[index][3] = defaultQuantity;
        this.data[index][4] = defaultUnit;
        // mark data as updated only when it came from database,
        // we do not have to mark data that was recently localy added
        if (this.data[index][5] === "") {
            this.data[index][5] = "update";
        }
    };

    this.get = function (index) {
        var ingredient;
        if (index < this.count()) {
            ingredient = this.data[index];
            return {
                id: ingredient[0],
                name: ingredient[1],
                categoryType: ingredient[2],
                defaulQuantity: ingredient[3],
                defaulUnit: ingredient[4],
                serverUpdateRequired: ingredient[5]
            };
        }
        return {
            id: 0,
            name: "undefined",
            categoryType: 0,
            defaulQuantity: 1,
            defaulUnit: 1,
            serverUpdateRequired: false
        };
    };

    this.getName = function (index) {
        return (index < this.count()) ? this.data[index][1] : "undefined";
    };

    this.getDatabaseFlag = function (index) {
        if (index < this.count()) {
            return this.data[index][5];
        }
        return '';
    };
}

