/*jslint browser: true*/
/*global $, jQuery, alert, UnitsData, IngredientsData, IngredientTypesData, CategoriesData*/

function Globals() {
    "use strict";

    /// Class storing global data.

    this.unitsData = new UnitsData();
	this.ingredientsData = new IngredientsData();
	this.ingredientTypesData = new IngredientTypesData();
    this.categoriesData = new CategoriesData();

    this.requestComponents = function () {
        var self = this;
        $.ajax({
            type: "GET",
            url: "get-components",
            data: "type=[units,ingredient_types,ingredients,categories]",
            datatype: "json",
            error: function (data) { alert('Error'); },
            success: function (data) {
                self.setComponents(data);
            }
        });
    };

    this.setComponents = function (data) {
        var units = data.units,
            ingredients = data.ingredients,
            categories = data.categories,
            ingredientTypes = data.ingredient_types,
            dataRow,
            i;
        for (i in units) {
            if (units.hasOwnProperty(i)) {
                dataRow = units[i];
                this.unitsData.add(
                    dataRow[0], // id
                    dataRow[1], // one
                    dataRow[2], // half
                    dataRow[3], // three
                    dataRow[4]  // twentyfive
                );
            }
        }
        for (i in ingredientTypes) {
            if (ingredientTypes.hasOwnProperty(i)) {
                dataRow = ingredientTypes[i];
                this.ingredientTypesData.add(
                    dataRow[0], // id
                    dataRow[1] // name
                );
            }
        }
        for (i in ingredients) {
            if (ingredients.hasOwnProperty(i)) {
                dataRow = ingredients[i];
                this.ingredientsData.add(
                    dataRow[0], // id
                    dataRow[1], // name
                    dataRow[2], // defaultQuantity
                    dataRow[3], // defaultUnit
                    ""          // flag
                );
            }
        }
        for (i in categories) {
            if (categories.hasOwnProperty(i)) {
                dataRow = categories[i];
                this.categoriesData.add(
                    dataRow[0], // id
                    dataRow[1], // name
                    ""          // flag
                );
            }
        }
    };
}

