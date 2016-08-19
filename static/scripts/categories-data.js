
function CategoriesData() {
    "use strict";

    /// Class representing all available categries
    /// that can be used to categorize dishes.

	this.data = [];

    this.setData = function (data) {
        this.data = data;
    };

    this.count = function () {
        return this.data.length;
    };

    this.index = function (category) {
        var i;
        for (i in this.data) {
            if (this.data.hasOwnProperty(i) && (this.data[i][1] === category)) {
                return i;
            }
        }
        return undefined;
    };

    this.add = function (id, name, flag) {
        this.data.push([id, name, flag]);
    };

    this.updateId = function (category, id) {
        var index = this.index(category);
        if (index === undefined) {
            return;
        }
        this.data[index][0] = id;
        this.data[index][2] = '';
    };

    this.get = function (index) {
        if (index < this.count()) {
            return this.data[index][1];
        }
        return 'undefined';
    };

    this.getDatabaseFlag = function (index) {
        if (index < this.count()) {
            return this.data[index][2];
        }
        return '';
    };
}

