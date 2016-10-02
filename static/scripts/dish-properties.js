/*jslint browser: true*/
/*global $, jQuery, alert, cleanNameString, md5*/

function GeneralProperties() {
    "use strict";

    this.$dishName = $('#dish-name');
    this.$dishPassword = $('#new-dish-password');
    this.$dishType = $('#dish-type');

    this.initialize = function () {
        $('dish-image-path').textinput();
    };

    this.getContent = function () {
        var edited = true,
            id = 0,
            name = this.$dishName.val(),
            type = 0,
            photo = '',
            password = md5(this.$dishPassword.val()),
            typeInput = this.$dishType.find('input[type="radio"]'),
            i = 0;
        // check which type option is checked
        for (i = 0; i < typeInput.length; i += 1) {
            if ($(typeInput[i]).is(':checked')) {
                type = $(typeInput[i]).attr('value');
                break;
            }
        }
        // construct object containing all information
        return {
            edited: edited,
            id: id,
            name: cleanNameString(name),
            type: type,
            photo: photo,
            password: password
        };
    };

    this.setContent = function (object) {
        var typeInput = this.$dishType.find('input');
        this.$dishName.val(object.name);
        typeInput[object.type].attr('checked', 'checked');
        // todo
    };
}

function IngredientProperties() {
    "use strict";

    /// Class encapsulating all operations related to dish ingredients.

	this.ingredientsData = undefined;
	this.unitsData = undefined;

    this.$allIngredientsList = $('#all-ingredients-list');
    this.$ingredinetsTable = $('#ingredinets-table');
    this.$availableIngredients = $('#available-ingredients');
    this.$editIngredientQuantity = $('#edit-ingredient-quantity');
    this.$editIngredientUnit = $('#edit-ingredient-unit');
    this.$editIngredientPopup = $('#edit-ingredient-popup');
    this.$addIngredientName = $('#add-ingredient-name');
    this.$addIngredientType = $('#add-ingredient-type');
    this.$addIngredientQuantity = $('#add-ingredient-quantity');
    this.$addIngredientUnit = $('#add-ingredient-unit');
    this.$addIngredientPopup = $('#add-ingredient-popup');

    /// Initialize attributes and setup event handlers.
    this.initialize = function (ingredientsData, ingredientTypesData, unitsData) {
        var self = this;
        self.ingredientsData = ingredientsData;
        self.ingredientTypesData = ingredientTypesData;
        self.unitsData = unitsData;
        // Set button callbacks.
        $('#show-add-ingredient-popup').on('tap', function (event) { self.showAddIngredientPopup(); });
        $('#add-new-ingredient').on('tap', function (event) { self.addNewIngredientDefinition(); });
        $('#edit-ingredient').on('tap', function (event) { self.editIngredient(); });
    };

    /// Method called when list of available ingredients should be updated.
    this.synchronizeIngredientList = function () {
        var self = this,
            classText = 'class="ui-btn ui-corner-all ui-shadow ui-screen-hidden"',
            itemsInHtml = this.$allIngredientsList.children().length,
            itemsInScript = this.ingredientsData.count(),
            ingredientsText = '',
            selectorString = '#all-ingredients-list a',
            i = 0;
        // if there is same number of items in html as in javascript array then there is nothing to do
        if (itemsInHtml === itemsInScript) {
            return;
        }
        for (i = itemsInHtml; i < itemsInScript; i += 1) {
            ingredientsText += '<a href="#" ' + classText + '>' + this.ingredientsData.getName(i) + "</a>\n";
        }
        this.$allIngredientsList.append(ingredientsText);
        if (itemsInHtml > 0) {
            selectorString += (':gt(' + (itemsInHtml - 1) + ')');
        }
        $(selectorString).on('tap', function (event) { self.addIngredient($(this).html()); });
    };

    this.clearIngredientList = function () {
        this.$allIngredientsList.empty();
    };

    /// Add ingredient to the recipe.
    this.addIngredient = function (name) {
        var self = this,
            quantity = 1,
            unit = 'sztuka',
            text = '',
            buttonTemplate = '<a href="#" {0} class="ui-btn {1} ui-btn-icon-notext ui-corner-all ui-btn-inline"></a>',
            i = 0,
            ingredient;
        // find default ingredient unit and quantity
        for (i = 0; i < this.ingredientsData.count(); i += 1) {
            if (this.ingredientsData.getName(i) === name) {
                ingredient = this.ingredientsData.get(i);
                quantity = ingredient.defaulQuantity;
                unit = this.unitsData.index(ingredient.defaulUnit);
                unit = this.unitsData.decline(unit, quantity);
                break;
            }
        }
        text = '<tr>' +
                 '<td>' + name + '</td>' +
                 '<td>' + quantity + '</td>' +
                 '<td>' + unit + '</td>' +
                 '<td>' +
                    buttonTemplate.f('', 'ui-icon-arrow-u') +
                    buttonTemplate.f('', 'ui-icon-arrow-d') +
                    buttonTemplate.f('', 'ui-icon-gear') +
                    buttonTemplate.f('', 'ui-icon-delete') +
                 '</td>' +
               '</tr>';
        this.$ingredinetsTable.append(text);
        // move ingredient up
        this.$ingredinetsTable.find('tr:last td:last a:first').on('tap', function (event) {
            var index = $(this).parent().parent().index() + 1;
            self.swapIngredients(index, index - 1);
        });
        // move ingredient down
        this.$ingredinetsTable.find('tr:last td:last a:nth-child(2)').on('tap', function (event) {
            var index = $(this).parent().parent().index() + 1;
            self.swapIngredients(index, index + 1);
        });
        // edit ingredient
        this.$ingredinetsTable.find('tr:last td:last a:nth-child(3)').on('tap', function (event) {
            var index = $(this).parent().parent().index() + 1;
            self.showEditIngredientPopup(index);
        });
        // delete ingredient
        this.$ingredinetsTable.find('tr:last td:last a:last').on('tap', function (event) {
            self.removeIngredient($(this).parent().parent().index() + 1);
        });
        this.$availableIngredients.val('');
        this.$allIngredientsList.find('a').addClass('ui-screen-hidden');
    };

    /// Swap places of two added ingredients.
    this.swapIngredients = function (firstIndex, secondIndex) {
        var firstItemChildren,
            secondItemChildren,
            ingredinetsCount = this.$ingredinetsTable.find('tr').length,
            name,
            quantity,
            unit;

        firstIndex = (firstIndex < 1) ? ingredinetsCount : ((firstIndex > ingredinetsCount) ? 1 : firstIndex);
        secondIndex = (secondIndex < 1) ? ingredinetsCount : ((secondIndex > ingredinetsCount) ? 1 : secondIndex);
        if (firstIndex === secondIndex) {
            return;
        }

        firstItemChildren = this.$ingredinetsTable.find('tr:nth-child(' + firstIndex + ') td');
        secondItemChildren = this.$ingredinetsTable.find('tr:nth-child(' + secondIndex + ') td');

        name = firstItemChildren.eq(0).text();
        quantity = firstItemChildren.eq(1).text();
        unit = firstItemChildren.eq(2).text();
        firstItemChildren.eq(0).text(secondItemChildren.eq(0).text());
        firstItemChildren.eq(1).text(secondItemChildren.eq(1).text());
        firstItemChildren.eq(2).text(secondItemChildren.eq(2).text());
        secondItemChildren.eq(0).text(name);
        secondItemChildren.eq(1).text(quantity);
        secondItemChildren.eq(2).text(unit);
    };

    /// Remove ingredient that was added to recipe.
    this.removeIngredient = function (index) {
        this.$ingredinetsTable.find('tr:nth-child(' + index + ')').remove();
    };

    /// Show popup that enables posibility to edit ingredient unit.
    this.showEditIngredientPopup = function (index) {
        var previousUnit,
            ingredientDefinition = this.$ingredinetsTable.find('tr:nth-child(' + index + ') td'),
            quantity = ingredientDefinition.eq(1).text(),
            unit = ingredientDefinition.eq(2).text();
        unit = this.unitsData.getBaseForm(unit);
        unit = this.unitsData.index(unit);
        unit = this.unitsData.getId(unit);
        this.constructSelectmenu(this.$editIngredientUnit, this.unitsData);
        this.$editIngredientQuantity.val(quantity);
        this.$editIngredientUnit.val(unit);
        this.$editIngredientUnit.selectmenu('refresh');
        this.$editIngredientPopup.attr('data-index', index).popup('open');
    };

    this.constructSelectmenu = function (listTag, listData) {
        var allOptionsText = '',
            i;
        // Construct lists containing all available units.
        if (listTag.children().length === 0) {
            for (i = 0; i < listData.count(); i += 1) {
                allOptionsText += '<option value="' + listData.getId(i) + '">' +
                                  listData.getName(i) + '</option>';
            }
            listTag.html(allOptionsText);
            listTag.selectmenu().selectmenu('refresh');
        }
    };

    /// Show popup that can be used to define new ingredient.
    this.showAddIngredientPopup = function () {
        this.constructSelectmenu(this.$addIngredientType, this.ingredientTypesData);
        this.constructSelectmenu(this.$addIngredientUnit, this.unitsData);
        // clear form content
        this.$addIngredientName.val("");
        this.$addIngredientQuantity.val(1);
        this.$addIngredientPopup.popup('open');
    };

    /// Callback used when new ingredient was defined.
    this.addNewIngredientDefinition = function () {
        var i,
            ingredient,
            name = this.$addIngredientName.val(),
            type = parseInt(this.$addIngredientType.val(), 10),
            defaultQuantity = parseFloat(this.$addIngredientQuantity.val()),
            defaultUnit = parseInt(this.$addIngredientUnit.val(), 10);
        // validate data
        if (isNaN(defaultQuantity) || (defaultQuantity === undefined)) {
            return;
        }
        // close dialog
        this.$addIngredientPopup.popup('close');
        // check if ingrediant exists
        for (i = 0; i < this.ingredientsData.count(); i += 1) {
            ingredient = this.ingredientsData.get(i);
            if (ingredient.name === name) {
                return;
            }
        }
        // add new ingredient
        this.ingredientsData.add(
            -1,
            cleanNameString(name),
            type,
            defaultQuantity,
            defaultUnit,
            'add'
        );
        // update list of ingredients
        this.synchronizeIngredientList();
	};

    this.editIngredient = function () {
        var index = this.$editIngredientPopup.attr('data-index'),
            quantity = this.$editIngredientQuantity.val(),
            unit = this.$editIngredientUnit.val(),
            itemChildren;
        // validate data
        quantity = parseFloat(quantity);
        if (isNaN(quantity) || (quantity === undefined)) {
            return;
        }
        // apply changes
        itemChildren = this.$ingredinetsTable.find('tr:nth-child(' + index + ') td');
        itemChildren.eq(1).text(quantity);
        unit = this.unitsData.index(unit);
        itemChildren.eq(2).text(this.unitsData.decline(unit, quantity));
        // close dialog
        this.$editIngredientPopup.popup('close');
    };

    this.getContent = function () {
        var i = 0,
            ingredient,
            edited = true,
            addedIngredientsData = [],
            dishIngredinetsArray = [],
            ingredientData,
            dishIngredinetsHtml = this.$ingredinetsTable.find('tr'),
            unit;
        // get all newly added (in this sesion) ingredients definitions
        for (i = 0; i < this.ingredientsData.count(); i += 1) {
            if (this.ingredientsData.getDatabaseFlag(i) === 'add') {
                ingredient = this.ingredientsData.get(i);
                addedIngredientsData.push([
                    ingredient.name,
                    ingredient.categoryType,
                    ingredient.defaulQuantity,
                    ingredient.defaulUnit
                ]);
            }

        }
        // get all dish ingredients
        for (i = 0; i < dishIngredinetsHtml.length; i += 1) {
            ingredientData = $(dishIngredinetsHtml[i]).children();
            unit = this.unitsData.getBaseForm($(ingredientData[2]).text());
            unit = this.unitsData.index(unit);
            unit = this.unitsData.getId(unit);
            dishIngredinetsArray.push([
                $(ingredientData[0]).text(),                // name
                parseFloat($(ingredientData[1]).text()),    // quantity
                parseInt(unit, 10)	                        // unit
            ]);
        }

        return {
            edited: edited,
            added: addedIngredientsData,
            selected: dishIngredinetsArray
        };
    };
}

function RecipeProperties() {
    "use strict";

    /// Class encapsulating all operations related to dish recipe.

    this.$recipeSections = $('#recipe-sections');
    this.$recipeItemOptions = $('#recipe-item-options');
    this.$editRecipePointTextPopup = $('#edit-recipe-point-text-popup');
    this.$editRecipeSectionNamePopup = $('#edit-recipe-section-name-popup');
    this.$newRecipeSectionName = $('#new-recipe-section-name');

    this.initialize = function () {
        var self = this,
            recipeItemOptions = this.$recipeItemOptions;
        // assign hadler to popup that lets to add new section
        $('#add-recipe-section').on('tap', function (event) { self.addNewRecipeSection(); });
        // assign handler to popup that lets to edit section name
        this.$editRecipeSectionNamePopup.find('a').on('tap', function (event) { self.applyEditSectionName(); });
        // assign handlers to popup that lets to operate on section points
        recipeItemOptions.find('.move-point-up').on('tap', function (event) { self.movePointUp(); });
        recipeItemOptions.find('.move-point-down').on('tap', function (event) { self.movePointDown(); });
        recipeItemOptions.find('.edit-point').on('tap', function (event) { self.showEditPointTextPopup(); });
        recipeItemOptions.find('.delete-point').on('tap', function (event) { self.deletePoint(); });
        // assign handler to popup that lets to edit point text
	    this.$editRecipePointTextPopup.find('a').on('tap', function (event) { self.applyEditedPointText(); });
    };

    /// Add new recipe section.
    this.addNewRecipeSection = function () {
        var self = this,
            text = '',
            buttonClasses = 'ui-btn ui-btn-icon-notext ui-corner-all ui-btn-inline ';
        text = '<div>' +
                 '<div class="ui-bar ui-bar-a">' +
                   '<h4 style="margin-top: 5px;">' + this.$newRecipeSectionName.val() + '</h4>' +
                   '<div style="height: 28px; float: right;">' +
                     '<a href="#" class="' + buttonClasses + 'ui-icon-arrow-u" style="margin-top:0px;"></a>' +
                     '<a href="#" class="' + buttonClasses + 'ui-icon-arrow-d" style="margin-top:0px;"></a>' +
                     '<a href="#" class="' + buttonClasses + 'ui-icon-gear" style="margin-top:0px;"></a>' +
                     '<a href="#" class="' + buttonClasses + 'ui-icon-delete" style="margin-top:0px;"></a>' +
                   '</div>' +
                 '</div>' +
                 '<div class="ui-body ui-body-a">' +
                   '<ol class="ui-listview" data-role="listview" style="margin:8px;">' +
                   '</ol>' +
                   '<div class="ui-input-text ui-body-inherit ui-corner-all ui-shadow-inset">' +
                     '<input placeholder="Opis punktu" value="" type="text">' +
                   '</div>' +
                   '<button class="ui-btn ui-icon-plus ui-btn-icon-left ui-shadow ui-corner-all ui-mini" type="button">Dodaj punkt</button>' +
                 '</div>' +
               '</div>';
        this.$recipeSections.append(text);
        $('#recipe-sections > div:last .ui-icon-arrow-u').on('tap', function (event) { self.moveSectionUp($(this).parent().parent().parent()); });
        $('#recipe-sections > div:last .ui-icon-arrow-d').on('tap', function (event) { self.moveSectionDown($(this).parent().parent().parent()); });
        $('#recipe-sections > div:last .ui-icon-gear').on('tap', function (event) { self.showEditSectionPopup($(this).parent().parent().parent()); });
        $('#recipe-sections > div:last .ui-icon-delete').on('tap', function (event) { $(this).parent().parent().parent().remove(); });
        $('#recipe-sections > div:last button').on('tap', function (event) { self.addNewPoint($(this).parent()); });
        this.$newRecipeSectionName.val('');
    };

    /// Move section up.
    this.moveSectionUp = function (item) {
        var index = item.index() + 1;
        this.swapSections(index, index - 1);
    };

    /// Move section down.
    this.moveSectionDown = function (item) {
        var index = item.index() + 1;
        this.swapSections(index, index + 1);
    };

    /// Swap section names and recipe points betwean two sections.
    this.swapSections = function (firstIndex, secondIndex) {
        var firstSectionHeader,
            secondSectionHeader,
            firstSectionHeaderText,
            firstPointList,
            secondPointList,
            firstPointListHtml,
            sectionsCount = this.$recipeSections.children().length;

        firstIndex = (firstIndex < 1) ? sectionsCount : ((firstIndex > sectionsCount) ? 1 : firstIndex);
        secondIndex = (secondIndex < 1) ? sectionsCount : ((secondIndex > sectionsCount) ? 1 : secondIndex);
        if (firstIndex === secondIndex) {
            return;
        }

        firstSectionHeader = $('#recipe-sections > div:nth-child(' + firstIndex + ') h4');
        secondSectionHeader = $('#recipe-sections > div:nth-child(' + secondIndex + ') h4');

        firstSectionHeaderText = firstSectionHeader.text();
        firstSectionHeader.text(secondSectionHeader.text());
        secondSectionHeader.text(firstSectionHeaderText);

        firstPointList = $('#recipe-sections > div:nth-child(' + firstIndex + ') ol');
        secondPointList = $('#recipe-sections > div:nth-child(' + secondIndex + ') ol');

        firstPointListHtml = firstPointList.html();
        firstPointList.html(secondPointList.html());
        secondPointList.html(firstPointListHtml);
    };

    /// Show popup that can be used to edit section name.
    this.showEditSectionPopup = function (item) {
        this.$editRecipeSectionNamePopup.find('input').val("");
        this.$editRecipeSectionNamePopup.attr('data-index', item.index() + 1);
        this.$editRecipeSectionNamePopup.popup('open');
    };

    /// Apply text entered to popup that defines new section name.
    this.applyEditSectionName = function () {
        var newName = this.$editRecipeSectionNamePopup.find('input').val(),
            index = parseInt(this.$editRecipeSectionNamePopup.attr('data-index'), 10);
        $('#recipe-sections > div:nth-child(' + index + ') h4').text(newName);
        this.$editRecipeSectionNamePopup.popup('close');
    };

    /// Add new point to recipe.
    this.addNewPoint = function (item) {
        var self = this,
            bodyItems = item.children(),
            pointList,
            pointInput = $(bodyItems[1].firstChild),
            pointText = pointInput.val(),
            pointTemplate = '<li data-icon="false" class="ui-mini">' +
                               '<a class="ui-btn" href="#" aria-haspopup="true" aria-expanded="false">' +
                               '{0}' +
                               '</a>' +
                            '</li>';
        // if point text was not specified then there is nothing to do
        if (pointText === '') {
            return;
        }
        // append new point to the end
        pointList = $(bodyItems[0]);
        pointList.append(pointTemplate.format(pointText));
        pointInput.val('');
        // add on tap event callback
        pointList = pointList.children();
        $(pointList[pointList.length - 1]).on('tap', function (event) {
            self.showEditSectionPointPopup($(this), event.pageX, event.pageY);
        });
    };

    /// Show popup that can be used to edit section point (recipe preparation step) properties.
    this.showEditSectionPointPopup = function (item, popupX, popupY) {
        var recipeItemOptions = this.$recipeItemOptions;
        recipeItemOptions.attr('data-section-index', item.parent().parent().parent().index() + 1);
        recipeItemOptions.attr('data-point-index', item.index() + 1);
        recipeItemOptions.popup('open', {
            x: popupX,
            y: popupY
        });
    };

    /// Move point up.
    this.movePointUp = function () {
        var recipeItemOptions = this.$recipeItemOptions,
            sectionIndex = parseInt(recipeItemOptions.attr('data-section-index'), 10),
            pointIndex = parseInt(recipeItemOptions.attr('data-point-index'), 10),
            pointList = $('#recipe-sections > div:nth-child(' + sectionIndex + ') li');
	    this.swapSectionPoints(pointList, pointIndex, pointIndex - 1);
	    recipeItemOptions.popup('close');
    };

    /// Move point down.
    this.movePointDown = function () {
        var sectionIndex = parseInt(this.$recipeItemOptions.attr('data-section-index'), 10),
            pointIndex = parseInt(this.$recipeItemOptions.attr('data-point-index'), 10),
            pointList = $('#recipe-sections > div:nth-child(' + sectionIndex + ') li');
	    this.swapSectionPoints(pointList, pointIndex, pointIndex + 1);
	    this.$recipeItemOptions.popup('close');
    };

    /// Swap points in single section.
    this.swapSectionPoints = function (pointList, firstIndex, secondIndex) {
        var firstPoint,
            secondPoint,
            firstPointText,
            pointCount = pointList.length;
		// validate indexes
        firstIndex = (firstIndex < 1) ? pointCount : ((firstIndex > pointCount) ? 1 : firstIndex);
        secondIndex = (secondIndex < 1) ? pointCount : ((secondIndex > pointCount) ? 1 : secondIndex);
        if (firstIndex === secondIndex) {
            return;
        }
		// <li> tag has single <a> tag inside - text must be copied from it
        firstPoint = $(pointList[firstIndex - 1]).children().first();
		secondPoint = $(pointList[secondIndex - 1]).children().first();
		// swap text
        firstPointText = firstPoint.text();
		firstPoint.text(secondPoint.text());
        secondPoint.text(firstPointText);
    };

	/// Get point at specified index from section with specified index.
	this.getSectionPoint = function (sectionIndex, pointIndex) {
		return $('#recipe-sections > div:nth-child(' + sectionIndex + ') ol > li:nth-child(' + pointIndex + ') a');
	};

	/// Show popup that enebles possibility to edit point text.
    this.showEditPointTextPopup = function () {
	    var sectionIndex = parseInt(this.$recipeItemOptions.attr('data-section-index'), 10),
            pointIndex = parseInt(this.$recipeItemOptions.attr('data-point-index'), 10),
            previousText = this.getSectionPoint(sectionIndex, pointIndex).text(),
	        editPopup = this.$editRecipePointTextPopup;
	    // close options popup
	    this.$recipeItemOptions.popup('close');
	    // set the section and point index in edit popup
        editPopup.attr('data-section-index', sectionIndex);
        editPopup.attr('data-point-index', pointIndex);
        // set the previous text to input box so that it can be edited
        editPopup.find('input').val(previousText);
        // show popup in which we can edit point text - this popup is
        // delayed because in jquery mobile popups can't be chained, its
        // possible that in some case delay may be to small - in that case
        // workaround using popupafterclose should be used
        setTimeout(function () {
		    editPopup.popup('open');
		}, 300);
    };

	/// Apply edited point text.
    this.applyEditedPointText = function () {
	    var editPopup = this.$editRecipePointTextPopup,
            sectionIndex = parseInt(editPopup.attr('data-section-index'), 10),
            pointIndex = parseInt(editPopup.attr('data-point-index'), 10),
            newPointText = editPopup.find('input').val();
        this.getSectionPoint(sectionIndex, pointIndex).text(newPointText);
	    editPopup.popup('close');
    };

    /// Delete selected point from specified section.
    this.deletePoint = function () {
        var optionsPopup = $('#recipe-item-options'),
            sectionIndex = parseInt(optionsPopup.attr('data-section-index'), 10),
            pointIndex = parseInt(optionsPopup.attr('data-point-index'), 10);
        // remove whole <li> tag
        this.getSectionPoint(sectionIndex, pointIndex).parent().remove();
		optionsPopup.popup('close');
    };

    this.getContent = function () {
        var i = 0,
            j = 0,
            sectionPoints = [],
            sectionObjects = [],
            allSectionNamesHtml = this.$recipeSections.find('h4'),
            allSectionPointsHtml = this.$recipeSections.find('ol'),
            sectionPointsHtml;
        // make sure that there is as much titles as section point lists
        if (allSectionNamesHtml.length !== allSectionPointsHtml.length) {
            return;
        }
        // iterate over all section names
        for (i = 0; i < allSectionNamesHtml.length; i += 1) {
            sectionPointsHtml = $(allSectionPointsHtml[i]).children();
            // construc array of section points
            sectionPoints = [];
            for (j = 0; j < sectionPointsHtml.length; j += 1) {
                sectionPoints.push($(sectionPointsHtml[j]).text());
            }
            sectionObjects.push({
                'name': $(allSectionNamesHtml[i]).text(),
                'points': sectionPoints
            });
        }
        return sectionObjects;
    };
}

function CategoryProperties() {
    "use strict";

    /// Class encapsulating all operations related to dish categories.

	this.categoriesData = undefined;

    this.$categoriesList = $('#all-categories-list');
    this.$availableCategories = $('#available-categories');
    this.$newCategory = $('#new-category');
    this.$addCategoryPopup = $('#add-category-popup');

	this.initialize = function (categoriesData) {
        var self = this;
		this.categoriesData = categoriesData;
        $('#add-new-category').on('tap', function (event) { self.showAddCategoryPopup(); });
        $('#add-category').on('tap', function (event) { self.addNewCategoryDefinition(); });
	};

    /// Method called when list of available categorie should be updated.
    this.synchronizeCategoriesList = function () {
        var self = this,
            classText = 'class="ui-btn ui-corner-all ui-shadow ui-screen-hidden"',
            itemsInHtml = this.$categoriesList.children().length,
            itemsInScript = this.categoriesData.count(),
            categoriesText = '',
            selectorString = 'a',
            i;
        // if there is same number of items in html as in javascript array then there is nothing to do
        if (itemsInHtml === itemsInScript) {
            return;
        }
        for (i = itemsInHtml; i < itemsInScript; i += 1) {
            categoriesText += '<a href="#" ' + classText + '>' + this.categoriesData.get(i) + "</a>";
        }
        this.$categoriesList.append(categoriesText);
        // if there already were items added then only add 'on tap' handler
        // to those who have been added during this synchronizations
        if (itemsInHtml > 0) {
            selectorString += (':gt(' + (itemsInHtml - 1) + ')');
        }
        this.$categoriesList.find(selectorString).on('tap', function (event) { self.addCategory($(this).text()); });
    };

    this.clearCategoriesList = function () {
        this.$categoriesList.empty();
    };

    /// Add keyword to the keyword list.
    this.addCategory = function (name) {
        var self = this,
            text = '<a href="#" class="ui-btn ui-mini ui-btn-inline ui-icon-delete ui-btn-icon-left">' +
                      cleanNameString(name) +
                   '</a>',
            categoryShouldBeAdded = true,
            allCategories = this.$categoriesList.find('a'),
            i = 0;
        // check if this category is not already present
        for (i = 0; i < allCategories.length; i += 1) {
            if ($(allCategories[i]).text() === name) {
                categoryShouldBeAdded = false;
                break;
            }
        }
        if (categoryShouldBeAdded) {
            this.$categoriesList.append(text);
            this.$categoriesList.find('a:last').on('tap', function (event) { self.deleteCategory($(this).index() + 1); });
        }
	    this.$availableCategories.val('');
	    this.$categoriesList.find('a').addClass('ui-screen-hidden');
    };

    /// Delete category from the categories list.
    this.deleteCategory = function (index) {
	    this.$categoriesList.find('a:nth-child(' + index + ')').remove();
    };

    /// Show popup that can be used to define new category.
    this.showAddCategoryPopup = function () {
        this.$newCategory.val("");
        this.$addCategoryPopup.popup('open');
    };

    /// Callback used when new category was defined.
    this.addNewCategoryDefinition = function () {
        var name = this.$newCategory.val(),
            i = 0;
        // check if category already exists
        for (i = 0; i < this.categoriesData.count(); i += 1) {
            if (this.categoriesData.get(i) === name) {
                return;
            }
        }
        // add new category
        this.categoriesData.add(-1, name, 'add');
        // update list of categories
        this.synchronizeCategoriesList();
        this.$addCategoryPopup.popup('close');
	};

    this.getContent = function () {
        var i = 0,
            edited = true,
            categoriesHtml = [],
            newCategories = [],
            selectedCategories = [];
        // get new categories
        for (i = 0; i < this.categoriesData.count(); i += 1) {
            if (this.categoriesData.getDatabaseFlag(i) === 'add') {
                newCategories.push(this.categoriesData.get(i));
            }
        }
        // get list of selected categories
        categoriesHtml = $('#keywords-list a');
        for (i = 0; i < categoriesHtml.length; i += 1) {
            selectedCategories.push($(categoriesHtml[i]).text());
        }
        return {
            edited: edited,
            added: newCategories,
            selected: selectedCategories
        };
    };
}

function DishProperies() {
    "use strict";

    this.ingredientsData = undefined;
    this.ingredientTypesData = undefined;
    this.unitsData = undefined;
    this.categoriesData = undefined;

    this.generalProperties = undefined;
	this.ingredientProperties = undefined;
    this.recipeProperties = undefined;
    this.categoryProperties = undefined;

    this.initialize = function (globals) {
        var self = this;
        this.ingredientsData = globals.ingredientsData;
        this.ingredientTypesData = globals.ingredientTypesData;
        this.unitsData = globals.unitsData;
        this.categoriesData = globals.categoriesData;
        this.generalProperties = new GeneralProperties();
        this.generalProperties.initialize();
        this.ingredientProperties = new IngredientProperties();
        this.ingredientProperties.initialize(this.ingredientsData, this.ingredientTypesData, this.unitsData);
        this.recipeProperties = new RecipeProperties();
        this.recipeProperties.initialize();
        this.categoryProperties = new CategoryProperties();
        this.categoryProperties.initialize(this.categoriesData);
		$('#dish-defined').on('tap', function (event) { self.applyDishProperties(); });
		$('#dish-definition-canceled').on('tap', function (event) { self.goToHomeScreen(); });
    };

    this.synchronizeComponents = function () {
        this.ingredientProperties.clearIngredientList();
        this.ingredientProperties.synchronizeIngredientList();
        this.categoryProperties.clearCategoriesList();
        this.categoryProperties.synchronizeCategoriesList();
    };

    this.applyDishProperties = function () {
        var self = this,
            dishData = {
                general: this.generalProperties.getContent(),
                ingredients: this.ingredientProperties.getContent(),
                recipe: this.recipeProperties.getContent(),
                categories: this.categoryProperties.getContent()
            };
        $.ajax({
            type: "POST",
            url: "add-dish-data",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(dishData),
            dataType: 'json',
            error: function (data) { alert('Error'); },
            success: function (data) { self.applyNewComponents(data); }
        });
    };
    
    this.applyNewComponents = function (data) {
        var i;
        if (data.result === "ok") {
            // apply ids to components that were just added to database on the server
            for (i = 0; i < data.new_ingredients.length; i += 1) {
                this.ingredientsData.updateId(
                    data.new_ingredients[i].name,
                    data.new_ingredients[i].id
                );
            }
            for (i = 0; data.new_categories.length; i += 1) {
                this.categoriesData.updateId(
                    data.new_categories[i].name,
                    data.new_categories[i].id
                );
            }
        }
        this.goToHomeScreen();
    };

    this.goToHomeScreen = function () {
        $.mobile.changePage("#meal-selection-page");
    };
}

