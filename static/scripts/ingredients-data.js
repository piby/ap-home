

function IngredientsData() {
    "use strict";

    /// Class containing list of all ingredients that can be used in dish.

    /// Representation of data that is stored in database. Every item in
    /// array consists of database ID's, ingredient name, default quantity,
    /// default unit, and operation flag.
    this.data = [];

    this.setData = function (data) {
        this.data = data;
    };

    this.count = function () {
        return this.data.length;
    };

    this.index = function (name) {
        var i;
        for (i in this.data) {
            if (this.data.hasOwnProperty(i) && (this.data[i][1] === name)) {
                return i;
            }
        }
        return undefined;
    };

    this.add = function (id, name, defaultQuantity, defaultUnit, flag) {
        var i,
            floorQuantity = Math.floor(defaultQuantity);
        // make sure that we do not have ingredient with specified name
        for (i in this.data) {
            if (this.data.hasOwnProperty(i)) {
                if (this.getName(i) === name) {
                    return;
                }
            }
        }
        // if quantity is integer store it as an integer, not float
        // this is needed for the declination algorithm
        defaultQuantity = (defaultQuantity % 1 === 0) ? floorQuantity : defaultQuantity;
        this.data.push([id, name, defaultQuantity, defaultUnit, flag]);
    };

    this.updateId = function (name, id) {
        var index = this.index(name);
        if (index === undefined) {
            return;
        }
        this.data[index][0] = id;
        this.data[index][4] = '';
    };

    this.update = function (index, defaultQuantity, defaultUnit) {
        if (index > this.count()) {
            return;
        }
        this.data[index][2] = defaultQuantity;
        this.data[index][3] = defaultUnit;
        // mark data as updated only when it came from database,
        // we do not have to mark data that was recently localy added
        if (this.data[index][4] === "") {
            this.data[index][4] = "update";
        }
    };

    this.get = function (index) {
        var ingredient;
        if (index < this.count()) {
            ingredient = this.data[index];
            return {
                id: ingredient[0],
                name: ingredient[1],
                defaulQuantity: ingredient[2],
                defaulUnit: ingredient[3],
                serverUpdateRequired: ingredient[4]
            };
        }
        return {
            id: 0,
            name: "undefined",
            defaulQuantity: 1,
            defaulUnit: "sztuka",
            serverUpdateRequired: false
        };
    };

    this.getName = function (index) {
        return (index < this.count()) ? this.data[index][1] : "undefined";
    };

    this.getDatabaseFlag = function (index) {
        if (index < this.count()) {
            return this.data[index][4];
        }
        return '';
    };
}

