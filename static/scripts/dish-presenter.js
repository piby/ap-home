/*jslint browser: true*/
/*global $, jQuery, alert, cleanNameString, cleanQuantity*/


function DishPresenter() {
    "use strict";

    this.ingredientsData  = undefined;
    this.unitsData  = undefined;
    this.categoriesData  = undefined;
    this.currentDishId = undefined;

    this.initialize = function (globals) {
        var self = this;
        this.ingredientsData  = globals.ingredientsData;
        this.unitsData  = globals.unitsData;
        this.categoriesData  = globals.categoriesData;
        
        $('.ui-icon-breakfast').on('tap', function () { self.requestDishList(0); });
        $('.ui-icon-soup').on('tap', function () { self.requestDishList(1); });
        $('.ui-icon-dinner').on('tap', function () { self.requestDishList(2); });
        $('.ui-icon-desert').on('tap', function () { self.requestDishList(3); });

        $('#remove-dish').on('tap', function () { self.removeDishData(); });
    };

    this.requestDishList = function (meal) {
        var self = this;
        $.ajax({
            type: "GET",
            url: "list-dishes",
            data: { meal: meal },
            datatype: "json",
            error: function (data) { alert('Error'); },
            success: function (data) { self.showDishList(data); }
        });
    };

    this.showDishList = function (data) {
        var text = '',
            self = this,
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
        $('#dish-list li[data-id]').on('tap', function (event) { self.requestDishData($(this).attr('data-id')); });
        $.mobile.changePage($('#dish-list-page'));
    };

    this.requestDishData = function (dishId) {
        var self = this;
        $.ajax({
            type: "GET",
            url: "get-dish-data",
            data: { id: dishId },
            datatype: "json",
            error: function (data) { alert('Error'); },
            success: function (data) { self.showDishData(dishId, data); }
        });
    };

    this.showDishData = function (dishId, data) {
        var text,
            sectionCount,
            section,
            points,
            itemId = '#dish-page',
            ingredient,
            index,
            name,
            quantity,
            unit,
            i,
            j;
        this.currentDishId = dishId;
        // set dish name
        $(itemId + ' div h1').html(data.name);
        // set dish photo
        if (data.photos.length) {
            $('#dish-photo').attr('src', data.photos[0]);
        } else {
            $('#dish-photo').attr('src', '/static/images/noimage.jpg');
        }
        // set dish ingredients
        text = '';
        for (i in data.ingredients) {
            if (data.ingredients.hasOwnProperty(i)) {
                ingredient = data.ingredients[i];
                index = this.ingredientsData.index(ingredient.ingredient_id);
                name = this.ingredientsData.getName(index);
                quantity = cleanQuantity(ingredient.quantity);
                index = this.unitsData.index(ingredient.unit_id);
                unit = this.unitsData.decline(index, quantity);
                text += '<li>' + name + ' - ' + quantity + ' ' + unit + '</li>\n';
            }
        }
        $('#dish-ingredients').html(text);
        // set dish recipe
        text = '';
        sectionCount = data.reciepe.length;
        for (i in data.reciepe) {
            if (data.reciepe.hasOwnProperty(i)) {
                section = data.reciepe[i];
                points = section.points;
                // display section name only when there is more then one section
                if (sectionCount > 1) {
                    text += '<h4>' + section.name + '</h4>';
                }
                text += '<ol>';
                for (j in points) {
                    if (points.hasOwnProperty(j)) {
                        text += '<li>' + points[j] + '</li>\n';
                    }
                }
                text += '</ol>';
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
    };
    
    this.removeDishData = function () {
        var password = $('#remove-dish-password').val();
        this.requestDishRemove(this.currentDishId, password);
    };

    this.requestDishRemove = function (dishId, password) {
        var self = this;
        $.ajax({
            type: "GET",
            url: "remove-dish-data",
            data: { id: dishId, password: password },
            datatype: "json",
            error: function (data) { alert('Error'); },
            success: function (data) { self.goToHomeScreen(); }
        });
    };

    this.goToHomeScreen = function () {
        $.mobile.changePage("#meal-selection-page");
    };
}

