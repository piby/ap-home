

function IngredientsData() {

    /// Class containing list of all ingredients that can be used in dish.

    /// Representation of data that is stored in database. Every item in
    /// array consists of database ID's, ingredient name, default quantity,
    /// default unit, and operation flag.
    this.data = [
        [1, 'ogorek gruntowy', 1, 'sztuka', ''],
        [2, 'ogorek szklarniowy', 1, 'sztuka', ''],
        [3, 'cebula', 1, 'sztuka', ''],
        [4, 'papryka czerwona', 1, 'sztuka', ''],
        [5, 'papryka zielona', 1, 'sztuka', ''],
        [6, 'papryka zolta', 1, 'sztuka', ''],
        [7, 'makaron swiderki', 0.5, 'paczka', ''],
    ];

    this.count = function() {
        return this.data.length;
    }

    this.add = function(name, defaultQuantity, defaultUnit) {
        // make sure that we do not have ingredient with specified name
        for (var i in this.data) {
            if (this.getName(i) == name) {
                return;
            }
        }
        this.data.push([0, name, defaultQuantity, defaultUnit, "add"]);
    }

    this.update = function(index, defaultQuantity, defaultUnit) {
        if (index > this.count()) {
            return;
        }
        this.data[index][2] = defaultQuantity;
        this.data[index][3] = defaultUnit;
        // mark data as updated only when it came from database,
        // we do not have to mark data that was recently localy added
        if (this.data[index][4] == "") {
            this.data[index][4] = "update";
        }
    }

    this.get = function(index) {
        if (index < this.count()) {
            var ingredient = this.data[index];
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
            defaulQuantity: false
        };
    }

    this.getName = function(index) {
        return (index < this.count()) ? this.data[index][1] : "undefined";
    }

    this.getDatabaseFlag = function(index) {
        if (index < this.count()) {
            return this.data[index][4];
        }
        return '';
    }
}

