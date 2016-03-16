
function CategoriesData() {

    /// Class representing all available categries
    /// that can be used to categorize dishes.

	this.data = [
        [1, 'smazone', ''],
        [2, 'pieczone', ''],
        [3, 'gotowane', ''],
        [4, 'dobry sos', ''],
        [5, 'proste', ''],
        [6, 'skaplikowane', ''],
        [7, 'szybkie', '']
	];

    this.count = function () {
        return this.data.length;
    };

    this.add = function (name) {
        this.data.push([999999, name, 'add']);
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

