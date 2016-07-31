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
            console.log(dataRow);
            unitsData.add(
                dataRow.id,
                dataRow.base_form,
                dataRow.fraction_form,
                dataRow.few_form,
                dataRow.many_form,
                ""
            );
        }
    }
    for (i in ingredients) {
        if (ingredients.hasOwnProperty(i)) {
            dataRow = ingredients[i];
            console.log(dataRow);
            ingredientsData.add(
                dataRow.id,
                dataRow.name,
                dataRow.defaultQuantity,
                dataRow.defaultUnit,
                ""
            );
        }
    }
    for (i in categories) {
        if (categories.hasOwnProperty(i)) {
            dataRow = categories[i];
            console.log(dataRow);
            categoriesData.add(
                dataRow.id,
                dataRow.name,
                ""
            );
        }
    }
}

function requestDishList(meal) {
    "use strict";
    $.ajax({
        type: "GET",
        url: "list-dishes",
        data: "meal=" + meal,
        datatype: "json",
        error: function (data) { alert('Error'); },
        success: function (data) { showDishList(meal, data); }
    });
}

function showDishList(meal, data) {
    "use strict";
    var text = '',
        itemId = '#dish-list',
        i = 0;
    for (i in data) {
        if (data.hasOwnProperty(i)) {
            text += '<li data-id="' + data[i].id + '"><a href=\"#\">' + data[i].name + '</a></li>\n';
        }
    }
    $(itemId).html(text);
    // if #dish-list has children then it was created
    // earlier and its content should be refreshed
    if ($(itemId).hasClass('ui-listview')) {
        $(itemId).listview("refresh");
    }
    $('#dish-list li').on('tap', function (event) { requestDishData($(this).attr('data-id')); });
    $.mobile.changePage($('#dish-list-page'));
}

function requestDishData(dishId) {
    "use strict";
    $.ajax({
        type: "GET",
        url: "get-dish-data",
        data: "id=" + dishId,
        datatype: "json",
        error: function (data) { alert('Error'); },
        success: function (data) { showDishData(dishId, data); }
    });
}

function showDishData(dishId, data) {
    "use strict";
    var text,
        itemId = '#dish-page',
        ingredient,
        i;
    // set dish name
    $(itemId + ' div h1').html(data.name);
    // set dish photo
    if (data.photo) {
        $('#dish-photo').attr('src', data.photo);
    } else {
        $('#dish-photo').attr('src', 'img/noimage.jpg');
    }
    // set dish ingredients
    text = '';
    for (i in data.ingredients) {
        if (data.ingredients.hasOwnProperty(i)) {
            ingredient = data.ingredients[i];
            text += '<li>' + ingredient.name + ' - ' + ingredient.quantity + ' ' + ingredient.unit + '</li>\n';
        }
    }
    $('#dish-ingredients').html(text);
    // set dish recipe
    text = '';
    for (i in data.reciepe) {
        if (data.reciepe.hasOwnProperty(i)) {
            text += '<li>' + data.reciepe[i] + '</li>\n';
        }
    }
    $('#dish-recipe').html(text);
    // set dish keywords
    text = '';
    for (i in data.keywords) {
        if (data.keywords.hasOwnProperty(i)) {
            text += data.keywords[i];
            if (i !== (data.keywords.length - 1)) {
                text += ', ';
            }
        }
    }
    $('#dish-keywords').html(text);
    $.mobile.changePage($('#dish-page'));
}
