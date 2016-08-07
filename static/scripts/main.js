/*jslint browser: true*/
/*global $, jQuery, alert, cleanNameString, requestComponents, setComponents, showDishList, requestDishData, showDishData*/

function requestComponents(ingredientsData, unitsData, categoriesData) {
    "use strict";
    $.ajax({
        type: "GET",
        url: "get-components",
        data: "type=[units,ingredients,categories]",
        datatype: "json",
        error: function (data) { alert('Error'); },
        success: function (data) {
            setComponents(data, ingredientsData, unitsData, categoriesData);
        }
    });
}

function setComponents(data, ingredientsData, unitsData, categoriesData) {
    "use strict";
    var units = data.units,
        ingredients = data.ingredients,
        categories = data.categories,
        dataRow,
        i;
    for (i in units) {
        if (units.hasOwnProperty(i)) {
            dataRow = units[i];
            unitsData.add(
                dataRow[0], // id
                dataRow[1], // one
                dataRow[2], // half
                dataRow[3], // three
                dataRow[4], // twentyfive
                ""          // flag
            );
        }
    }
    for (i in ingredients) {
        if (ingredients.hasOwnProperty(i)) {
            dataRow = ingredients[i];
            ingredientsData.add(
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
            categoriesData.add(
                dataRow[0], // id
                dataRow[1], // name
                ""          // flag
            );
        }
    }
}
