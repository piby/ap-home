/*jslint browser: true*/
/*global $, jQuery, alert, cleanNameString, cleanQuantity, md5*/


function DishPresenter() {
    "use strict";

    this.ingredientsData  = undefined;
    this.unitsData  = undefined;
    this.categoriesData  = undefined;
    this.currentDishId = undefined;

    this.$dishList = $('#dish-list');
    this.$dishHeader = $('#dish-page div h1');
    this.$dishPhoto = $('#dish-photo');
    this.$dishIngredients = $('#dish-ingredients');
    this.$dishRecipe = $('#dish-recipe');
    this.$dishRecipeSection = $('#dish-recipe-section');
    this.$dishKeywords = $('#dish-keywords');
    this.$removeDishPassword = $('#remove-dish-password');
    this.$backupDishesPassword = $('#backup-dishes-password');
    this.$dishListPage = $('#dish-list-page');
    this.$dishPage = $('#dish-page');
    this.$mealSelectionPage = $("#meal-selection-page");

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
        $('#backup-dishes').on('tap', function () { self.requestDishesBackup(); });
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
            i = 0;
        for (i in data) {
            if (data.hasOwnProperty(i)) {
                text += '<li data-id="' + data[i].id + '" data-image="' + data[i].image + '">' +
                          '<a href=\"#\">' + data[i].name + '</a>' +
                        '</li>\n';
            }
        }
        this.$dishList.html(text);
        // if #dish-list has children then it was created
        // earlier and its content should be refreshed
        if (this.$dishList.hasClass('ui-listview')) {
            this.$dishList.listview("refresh");
        }
        this.$dishList.find('li[data-id]').on('tap', function (event) {
            var item = $(this),
                id = item.attr('data-id'),
                image = item.attr('data-image');
            self.requestDishData(id, image);
        });
        $.mobile.changePage($('#dish-list-page'));
    };

    this.requestDishesBackup = function () {
        var self = this,
            password = md5(this.$backupDishesPassword.val());
        $('#backup-dishes-popup').popup('close');
        $.ajax({
            type: "GET",
            url: "backup-dishes",
            data: { password: password },
            datatype: "json",
            error: function (data) { alert('Error'); },
            success: function (data) { self.saveBackup(data); }
        });
    };

    this.saveBackup = function (data) {
        var aTag = document.createElement('a'),
            date = new Date(),
            day = date.getDate(),
            month = date.getMonth() + 1,
            year = date.getFullYear(),
            filename = 'cookbook_',
            dataToSerialize,
            event;
        if (data.result !== 'ok') {
            return;
        }
        // create file name
        filename += day + '_' + month + '_' + year + '.json';

        // get the components
        dataToSerialize = {
            units: this.unitsData.data,
            categories: this.categoriesData.data,
            ingredients: this.ingredientsData.data,
            dishes: data.list
        };

        aTag.setAttribute('href', 'data:text/plain;charset=utf-8,' + JSON.stringify(dataToSerialize));
        aTag.setAttribute('download', filename);

        if (document.createEvent) {
            event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            aTag.dispatchEvent(event);
        } else {
            aTag.click();
        }
    };

    this.requestDishData = function (dishId, dishImage) {
        var self = this,
            imagePath = '/static/images/dish/';
        // download image
        imagePath += (dishImage === '') ? 'noimage.jpg' : dishImage;
        this.$dishPhoto.attr('src', imagePath);
        // download data
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
            ingredient,
            index,
            name,
            quantity,
            unit,
            i,
            j;
        this.currentDishId = dishId;
        // set dish name
        this.$dishHeader.html(data.name);
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
        this.$dishIngredients.html(text);
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
        if (sectionCount > 0) {
            this.$dishRecipe.html(text);
            this.$dishRecipeSection.show();
        } else {
            this.$dishRecipe.html('');
            this.$dishRecipeSection.hide();
        }
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
        this.$dishKeywords.html(text);
        $.mobile.changePage(this.$dishPage);
    };
    
    this.removeDishData = function () {
        var password = md5(this.$removeDishPassword.val());
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
        $.mobile.changePage(this.$mealSelectionPage);
    };
}

