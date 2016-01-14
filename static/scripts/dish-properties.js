
function GeneralProperties() {

    this.initialize = function() {
        var self = this;
    }

    this.getContent = function() {
        var edited = true;
        var id = 0;
        var name = $('#dish-name').val();
        var type = 0;
        var photo = '';
        var password = $('#secret-password').val();
        var typeInput = $('#dish-type input[type="radio"]');
        // check which type option is checked
        for (var i = 0 ; i < typeInput.length ; i++) {
            if ($(typeInput[i]).is(':checked')) {
                type = $(typeInput[i]).attr('value');
                console.log(i);
                break;
            }
        }
        // construct object containing all information
        return {
            'edited': edited,
            'id': id,
            'name': cleanNameString(name),
    	    'type': type,
            'photo': photo,
            'password': password
        };
    }

    this.setContent = function(object) {
        var typeInput = $('#dish-type input');
        $('#dish-name').val(object.name);
        typeInput[object.type].attr('checked', 'checked');
        // todo
    }
}

function IngredientProperties() {

    /// Class encapsulating all operations related to dish ingredients.

	this.ingredientsData = undefined;
	this.unitsData = undefined;

    /// Initialize attributes and setup event handlers.
    this.initialize = function(ingredientsData, unitsData) {
        var self = this;
        self.ingredientsData = ingredientsData;
        self.unitsData = unitsData;
        self.synchronizeIngredientList();
        $('#show-add-ingredient-popup').on('tap', function(event) { self.showAddIngredientPopup(); });
        $('#show-add-ingredient-unit-popup').on('tap', function(event) { self.showAddUnitPopup(); });
        $('#add-new-unit').on('tap', function(event) { self.addNewUnitDefinition(); });
    }

    /// Method called when list of available ingredients should be updated.
    this.synchronizeIngredientList = function() {
        var self = this;
        var classText = 'class="ui-btn ui-corner-all ui-shadow ui-screen-hidden"';
        var ingredientsList = $('#all-ingredients-list');
        var itemsInHtml = ingredientsList.children().length;
        var itemsInScript = this.ingredientsData.count();
        var ingredientsText = '';
        var eventIndex;
        // if there is same number of items in html as in javascript array then there is nothing to do
        if (itemsInHtml == itemsInScript) {
            return;
        }
        for (var i = itemsInHtml ; i < itemsInScript ; i++) {
            ingredientsText += '<a href="#" ' + classText + '>' + this.ingredientsData.getName(i) + "</a>";
        }
        ingredientsList.append(ingredientsText);
        eventIndex = itemsInHtml - 1;
        eventIndex = (eventIndex < 0) ? 0 : eventIndex;
        $('#all-ingredients-list a:gt(' + eventIndex + ')').on('tap', function(event) { self.addIngredient($(this).html()); });
    }

    /// Add ingredient to the recipe.
    this.addIngredient = function(name) {
        var self = this;
        var quantity = 1;
        var unit = 'sztuka';
        var text = '';
        var buttonTemplate = '<a href="#" {0} class="ui-btn {1} ui-btn-icon-notext ui-corner-all ui-btn-inline"></a>'
        // find default ingredient unit and quantity
        for (var i = 0 ; i < this.ingredientsData.count() ; i++) {
            if (this.ingredientsData.getName(i) == name) {
                var ingredient = this.ingredientsData.get(i);
                quantity = ingredient.defaulQuantity;
                unit = this.unitsData.decline(ingredient.defaulUnit, quantity);
                break;
            }
        }
        text = '<tr>' +
                 '<td>' + name + '</td>' +
                 '<td>' + quantity + '</td>' +
                 '<td>' + unit + '</td>' +
                 '<td>' +
                    buttonTemplate.f( '', 'ui-icon-arrow-u') +
                    buttonTemplate.f( '', 'ui-icon-arrow-d') +
                    buttonTemplate.f( '', 'ui-icon-gear') +
                    buttonTemplate.f( '', 'ui-icon-delete') +
                 '</td>' +
               '</tr>';
      $('#ingredinets-table').append(text);
	  // move ingredient up
	  $('#ingredinets-table tr:last td:last a:first').on('tap', function(event) {
          var index = $(this).parent().parent().index() + 1;
          self.swapIngredients(index, index-1);
	  });
	  // move ingredient down
	  $('#ingredinets-table tr:last td:last a:nth-child(2)').on('tap', function(event) {
          var index = $(this).parent().parent().index() + 1;
          self.swapIngredients(index, index+1);
	  });
	  // edit ingredient
	  $('#ingredinets-table tr:last td:last a:nth-child(3)').on('tap', function(event) {
          var index = $(this).parent().parent().index() + 1;
          self.showEditIngredientPopup(index);
	  });
	  // delete ingredient
	  $('#ingredinets-table tr:last td:last a:last').on('tap', function(event) {
          self.removeIngredient($(this).parent().parent().index() + 1);
	  });
      $('#available-ingredients').val('');
      $('#all-ingredients-list a').addClass('ui-screen-hidden');
    }

    /// Swap places of two added ingredients.
    this.swapIngredients = function(firstIndex, secondIndex) {
        var firstItemChildren = undefined;
        var secondItemChildren = undefined;
        var ingredinetsCount = $('#ingredinets-table tr').length;

        firstIndex = (firstIndex < 1) ? ingredinetsCount : ((firstIndex > ingredinetsCount) ? 1 : firstIndex);
        secondIndex = (secondIndex < 1) ? ingredinetsCount : ((secondIndex > ingredinetsCount) ? 1 : secondIndex);
        if (firstIndex == secondIndex ) {
            return;
        }

        firstItemChildren = $('#ingredinets-table tr:nth-child(' + firstIndex + ') td');
        secondItemChildren = $('#ingredinets-table tr:nth-child(' + secondIndex + ') td');

        name = firstItemChildren.eq(0).text();
        quantity = firstItemChildren.eq(1).text();
        unit = firstItemChildren.eq(2).text();
        firstItemChildren.eq(0).text(secondItemChildren.eq(0).text());
        firstItemChildren.eq(1).text(secondItemChildren.eq(1).text());
        firstItemChildren.eq(2).text(secondItemChildren.eq(2).text());
        secondItemChildren.eq(0).text(name);
        secondItemChildren.eq(1).text(quantity);
        secondItemChildren.eq(2).text(unit);
    }

    /// Remove ingredient that was added to recipe.
    this.removeIngredient = function(index) {
        $('#ingredinets-table tr:nth-child(' + index + ')').remove();
    }

    /// Create list of available units that can be used during adding ingredients to recipe.
    this.createListOfAvailableUnits = function(listTagId, unitCallback) {
        var allUnitsText = "";
        var classText = 'class="ui-btn ui-corner-all ui-shadow ui-screen-hidden"';
        for (var i = 0 ; i < this.unitsData.count() ; i++) {
            allUnitsText += '<a href="#" ' + classText + '>' + this.unitsData.name(i) + "</a>";
        }
        $(listTagId).html(allUnitsText);
        // define function that is called when unit is selected
        $(listTagId + ' a').on('tap', unitCallback);
    }

    /// Show popup that enables posibility to edit ingredient unit.
    this.showEditIngredientPopup = function(index) {
        var editPopup = $('#edit-ingredient-popup');
        var self = this;
        // clear form content
        $('#edit-ingredient-quantity').val(1);
        $('#edit-ingredient-unit-input').val("");
        this.createListOfAvailableUnits('#edit-ingredient-all-units-list', function(event) { 
            var unit = $(this).html();
            var quantity = $('#edit-ingredient-quantity').val();
            quantity = parseInt(quantity);
            if ((quantity == NaN) || (quantity == undefined)) {
  	    	    return;
            }
            self.applyUnitAndQuantity(index, unit, quantity);
        });
        // show popup
        editPopup.popup('open');
    }

    /// Show popup that can be used to define new ingredient.
    this.showAddIngredientPopup = function() {
        var self = this;
        // clear form content
 	    $('#add-ingredient-name').val("");
	    $('#add-ingredient-quantity').val(1);
        $('#add-ingredient-unit').val("");
        this.createListOfAvailableUnits('#add-ingredient-all-units-list', function(event) {
            // get ingredient data
            var name = $('#add-ingredient-name').val();
            var defaultQuantity = $('#add-ingredient-quantity').val();
            var defaultUnit = $(this).html();
            // validate data
            defaultQuantity = parseInt(defaultQuantity);
            if ((defaultQuantity == NaN) || (defaultQuantity == undefined)) {
                return;
            }
            // add new ingredient definition
            self.addNewIngredientDefinition(name, defaultQuantity, defaultUnit);
            $('#add-ingredient-popup').popup('close');
        });
        $('#add-ingredient-popup').popup('open');
    }

    /// Show popup that can be used to define new units.
    this.showAddUnitPopup = function() {
        var forms = $('#add-ingredient-unit-popup input');
        $(forms[0]).val("");
        $(forms[1]).val("");
        $(forms[2]).val("");
        $(forms[3]).val("");
        $('#add-ingredient-unit-popup').popup('open');
    }

    /// Callback used when data entered to edit-ingredient popup was confirmed.
    this.applyUnitAndQuantity = function(index, unit, quantity) {
        var itemChildren = $('#ingredinets-table tr:nth-child(' + index + ') td');
        itemChildren.eq(1).text(quantity);
        itemChildren.eq(2).text(this.unitsData.decline(unit, quantity));
        $('#edit-ingredient-popup').popup('close');
    }

    /// Callback used when new ingredient was defined.
    this.addNewIngredientDefinition = function(name, defaultQuantity, defaultUnit) {
        // check if ingrediant exists
       for (var i = 0 ; i < this.ingredientsData.count() ; i++) {
            var ingredient = this.ingredientsData.get(i);
            if (ingredient.name == name) {
                this.ingredientsData.update(i, defaultQuantity, defaultUnit);
                return;
            }
        }
        // add new ingredient
        this.ingredientsData.add(cleanNameString(name), defaultQuantity, defaultUnit);
        // update list of ingredients
        this.synchronizeIngredientList();
	}

    /// Callback used when new unit was defined.
	this.addNewUnitDefinition = function(unit) {
        var forms = $('#add-ingredient-unit-popup input');
        var one = $(forms[0]).val();
        var half = $(forms[1]).val();
        var three = $(forms[2]).val();
        var twentyfive = $(forms[3]).val();
        this.unitsData.add(
            cleanNameString(one),
            cleanNameString(half),
            cleanNameString(three),
            cleanNameString(twentyfive));
        $('#add-ingredient-unit-popup').popup('close');
	}

    this.getContent = function() {
        var i = 0;
        var ingredient;
        var edited = true;
        var addedUnitsData = [];
        var addedIngredientsData = [];
        var dishIngredinetsArray = [];
        var ingredientData = undefined;
        var dishIngredinetsHtml = $('#ingredinets-table tr');
        // get all newly added (in this sesion) units
        for (i = 0 ; i < this.unitsData.count() ; i++) {
            if (this.unitsData.getDatabaseFlag(i) == 'add') {
                addedUnitsData.push(this.unitsData.getAllForms(i));
            }
        }
        // get all newly added (in this sesion) ingredients
        for (i = 0 ; i < this.ingredientsData.count() ; i++) {
            if (this.ingredientsData.getDatabaseFlag(i) == 'add') {
                ingredient = this.ingredientsData.get(i);
                addedIngredientsData.push([
                    ingredient.name,
                    ingredient.defaulQuantity,
                    ingredient.defaulUnit
                ]);
            }

        }
        // get all dish ingredients
        for (i = 0 ; i < dishIngredinetsHtml.length ; i++) {
            var ingredientData = $(dishIngredinetsHtml[i]).children();
            dishIngredinetsArray.push([
                $(ingredientData[0]).text(),     // name
                $(ingredientData[1]).text(),     // quantity
                $(ingredientData[2]).text()      // unit
            ]);
        }

        return {
            'edited': edited,
            'new-units': addedUnitsData,
            'new-ingredients': addedIngredientsData,
            'selected': dishIngredinetsArray
        };
    }
}

function RecipeProperties() {

    /// Class encapsulating all operations related to dish recipe.

    this.recipeSections = undefined;

    this.initialize = function() {
        var self = this;
        this.recipeSections = $('#recipe-sections');
        // assign hadler to popup that lets to add new section
        $('#add-recipe-section').on('tap', function(event) { self.addNewRecipeSection(); });
        // assign handler to popup that lets to edit section name
        $('#edit-recipe-section-name-popup a').on('tap', function(event) { self.applyEditSectionName(); });
        // assign handlers to popup that lets to operate on section points
        $('#recipe-item-options .move-point-up').on('tap', function(event) { self.movePointUp(); });
        $('#recipe-item-options .move-point-down').on('tap', function(event) { self.movePointDown(); });
        $('#recipe-item-options .edit-point').on('tap', function(event) { self.showEditPointTextPopup(); });
        $('#recipe-item-options .delete-point').on('tap', function(event) { self.deletePoint(); });
        // assign handler to popup that lets to edit point text
	    $('#edit-recipe-point-text-popup a').on('tap', function(event) { self.applyEditedPointText(); });
    }

    /// Add new recipe section.
    this.addNewRecipeSection = function() {
        var self = this;
        var newSectionName = $('#new-recipe-section-name');
        var text = '';
        var buttonClasses = 'ui-btn ui-btn-icon-notext ui-corner-all ui-btn-inline ';
        text = '<div>' +
                 '<div class="ui-bar ui-bar-a">' +
                   '<h4 style="margin-top: 5px;">' + newSectionName.val() + '</h4>' +
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
        this.recipeSections.append(text);
        $('#recipe-sections > div:last .ui-icon-arrow-u').on('tap', function(event) { self.moveSectionUp($(this).parent().parent().parent()); });
        $('#recipe-sections > div:last .ui-icon-arrow-d').on('tap', function(event) { self.moveSectionDown($(this).parent().parent().parent()); });
        $('#recipe-sections > div:last .ui-icon-gear').on('tap', function(event) { self.showEditSectionPopup($(this).parent().parent().parent()); });
        $('#recipe-sections > div:last .ui-icon-delete').on('tap', function(event) { $(this).parent().parent().parent().remove(); });
        $('#recipe-sections > div:last button').on('tap', function(event) { self.addNewPoint($(this).parent()); });
        newSectionName.val('');
    }

    /// Move section up.
    this.moveSectionUp = function(item) {
        var index = item.index() + 1;
        this.swapSections(index, index-1);
    }

    /// Move section down.
    this.moveSectionDown = function(item) {
        var index = item.index() + 1;
        this.swapSections(index, index+1);
    }

    /// Swap section names and recipe points betwean two sections.
    this.swapSections = function(firstIndex, secondIndex) {
        var firstSectionHeader = undefined;
        var secondSectionHeader = undefined;
        var firstSectionHeaderText = undefined;
        var firstPointList = undefined;
        var secondPointList = undefined;
        var firstPointListHtml = undefined;
        var sectionsCount = this.recipeSections.children().length;

        firstIndex = (firstIndex < 1) ? sectionsCount : ((firstIndex > sectionsCount) ? 1 : firstIndex);
        secondIndex = (secondIndex < 1) ? sectionsCount : ((secondIndex > sectionsCount) ? 1 : secondIndex);
        if (firstIndex == secondIndex ) {
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
    }

    /// Show popup that can be used to edit section name.
    this.showEditSectionPopup = function(item) {
        var editPopup = $('#edit-recipe-section-name-popup');
        $('#edit-recipe-section-name-popup input').val("");
        editPopup.attr('data-index', item.index() + 1);
        editPopup.popup('open');
    }

    /// Apply text entered to popup that defines new section name.
    this.applyEditSectionName = function() {
        var newName = $('#edit-recipe-section-name-popup input').val();
        var editPopup = $('#edit-recipe-section-name-popup');
        var index = parseInt(editPopup.attr('data-index'));
        $('#recipe-sections > div:nth-child(' + index + ') h4').text(newName);
        editPopup.popup('close');
    }

    /// Add new point to recipe.
    this.addNewPoint = function(item) {
        var self = this;
        var bodyItems = item.children();
        var pointList = undefined;
        var pointInput = $(bodyItems[1].firstChild);
        var pointText = pointInput.val();
        var pointTemplate = '<li data-icon="false" class="ui-mini">' +
                               '<a class="ui-btn" href="#" aria-haspopup="true" aria-expanded="false">' +
                               '{0}' +
                               '</a>' +
                            '</li>';
        // if point text was not specified then there is nothing to do
        if (pointText == '') {
            return;
        }
        // append new point to the end
        pointList = $(bodyItems[0]);
        pointList.append(pointTemplate.format(pointText));
        pointInput.val('');
        // add on tap event callback
        pointList = pointList.children();
        $(pointList[pointList.length - 1]).on('tap', function(event) {
        	self.showEditSectionPointPopup($(this), event.pageX, event.pageY);
        });
    }

    /// Show popup that can be used to edit section point (recipe preparation step) properties.
    this.showEditSectionPointPopup = function(item, popupX, popupY) {
        var optionsPopup = $('#recipe-item-options');
        optionsPopup.attr('data-section-index', item.parent().parent().parent().index() + 1);
        optionsPopup.attr('data-point-index', item.index() + 1);
        optionsPopup.popup('open', {
        	x: popupX,
        	y: popupY
        });
    }

    /// Move point up.
    this.movePointUp = function() {
        var optionsPopup = $('#recipe-item-options');
        var sectionIndex = parseInt(optionsPopup.attr('data-section-index'));
        var pointIndex = parseInt(optionsPopup.attr('data-point-index'));
        var pointList = $('#recipe-sections > div:nth-child(' + sectionIndex + ') li');
	    this.swapSectionPoints(pointList, pointIndex, pointIndex-1);
	    optionsPopup.popup('close');
    }

    /// Move point down.
    this.movePointDown = function() {
        var optionsPopup = $('#recipe-item-options');
        var sectionIndex = parseInt(optionsPopup.attr('data-section-index'));
        var pointIndex = parseInt(optionsPopup.attr('data-point-index'));
        var pointList = $('#recipe-sections > div:nth-child(' + sectionIndex + ') li');
	    this.swapSectionPoints(pointList, pointIndex, pointIndex+1);
	    optionsPopup.popup('close');
    }

    /// Swap points in single section.
    this.swapSectionPoints = function(pointList, firstIndex, secondIndex) {
        var firstPoint = undefined;
        var secondPoin = undefined;
        var firstPointText = undefined;
        var pointCount = pointList.length;
		// validate indexes
        firstIndex = (firstIndex < 1) ? pointCount : ((firstIndex > pointCount) ? 1 : firstIndex);
        secondIndex = (secondIndex < 1) ? pointCount : ((secondIndex > pointCount) ? 1 : secondIndex);
        if (firstIndex == secondIndex ) {
            return;
        }
		// <li> tag has single <a> tag inside - text must be copied from it
        firstPoint = $(pointList[firstIndex-1]).children().first();
		secondPoint = $(pointList[secondIndex-1]).children().first();
		// swap text
        firstPointText = firstPoint.text();
		firstPoint.text(secondPoint.text());
        secondPoint.text(firstPointText);
    }

	/// Get point at specified index from section with specified index.
	this.getSectionPoint = function(sectionIndex, pointIndex) {
		return $('#recipe-sections > div:nth-child(' + sectionIndex + ') ol > li:nth-child(' + pointIndex + ') a');
	}

	/// Show popup that enebles possibility to edit point text.
    this.showEditPointTextPopup = function() {
	    var optionsPopup = $('#recipe-item-options');
        var sectionIndex = parseInt(optionsPopup.attr('data-section-index'));
        var pointIndex = parseInt(optionsPopup.attr('data-point-index'));
        var previousText = this.getSectionPoint(sectionIndex, pointIndex).text();
	    var editPopup = $('#edit-recipe-point-text-popup');
	    // close options popup
	    optionsPopup.popup('close');
	    // set the section and point index in edit popup
        editPopup.attr('data-section-index', sectionIndex);
        editPopup.attr('data-point-index', pointIndex);
        // set the previous text to input box so that it can be edited
        $('#edit-recipe-point-text-popup input').val(previousText);
        // show popup in which we can edit point text - this popup is
        // delayed because in jquery mobile popups can't be chained, its
        // possible that in some case delay may be to small - in that case
        // workaround using popupafterclose should be used
        setTimeout(function() {
		    editPopup.popup('open');
		}, 300);
    }

	/// Apply edited point text.
    this.applyEditedPointText = function() {
	    var editPopup = $('#edit-recipe-point-text-popup');
        var sectionIndex = parseInt(editPopup.attr('data-section-index'));
        var pointIndex = parseInt(editPopup.attr('data-point-index'));
        var newPointText = $('#edit-recipe-point-text-popup input').val();
        this.getSectionPoint(sectionIndex, pointIndex).text(newPointText);
	    editPopup.popup('close');
    }

    /// Delete selected point from specified section.
    this.deletePoint = function() {
        var optionsPopup = $('#recipe-item-options');
        var sectionIndex = parseInt(optionsPopup.attr('data-section-index'));
        var pointIndex = parseInt(optionsPopup.attr('data-point-index'));
        // remove whole <li> tag
        this.getSectionPoint(sectionIndex, pointIndex).parent().remove();
		optionsPopup.popup('close');
    }

    this.getContent = function() {
        var i = 0;
        var j = 0;
        var sectionPoints = [];
        var sectionObjects = [];
        var allSectionNamesHtml = $('#recipe-sections h4');
        var allSectionPointsHtml = $('#recipe-sections ol');
        var sectionPointsHtml;
        // make sure that there is as much titles as section point lists
        if (allSectionNamesHtml.length != allSectionPointsHtml.length) {
            return;
        }
        // iterate over all section names
        for(i = 0 ; i < allSectionNamesHtml.length ; i++) {
            sectionPointsHtml = $(allSectionPointsHtml[i]).children();
            // construc array of section points
            sectionPoints = [];
            for(j = 0 ; j < sectionPointsHtml.length ; j++) {
                sectionPoints.push($(sectionPointsHtml[j]).text());
            }
            sectionObjects.push({
                'name': $(allSectionNamesHtml[i]).text(),
                'points': sectionPoints
            });
        }
        return sectionObjects;
    }
}

function KeywordsProperties() {

    /// Class encapsulating all operations related to dish keywords.

	this.keywordsData = undefined;

	this.initialize = function(keywordsData) {
        var self = this;
		this.keywordsData = keywordsData;
		this.synchronizeKeywordsList();
        $('#add-new-keyword').on('tap', function(event) { self.showAddKeywordPopup(); });
        $('#add-keyword').on('tap', function(event) { self.addNewKeywordDefinition(); });
	}

    /// Method called when list of available keywords should be updated.
    this.synchronizeKeywordsList = function() {
        var self = this;
        var classText = 'class="ui-btn ui-corner-all ui-shadow ui-screen-hidden"';
        var keywordsList = $('#all-keywords-list');
        var itemsInHtml = keywordsList.children().length;
        var itemsInScript = this.keywordsData.count();
        var keywordsText = '';
        var selectorString = '#all-keywords-list a';
        // if there is same number of items in html as in javascript array then there is nothing to do
        if (itemsInHtml == itemsInScript) {
            return;
        }
        for (var i = itemsInHtml ; i < itemsInScript ; i++) {
            keywordsText += '<a href="#" ' + classText + '>' + this.keywordsData.get(i) + "</a>";
        }
        keywordsList.append(keywordsText);
        // if there already were items added then only add 'on tap' handler
        // to those who have been added during this synchronizations
        if (itemsInHtml > 0) {
            selectorString += (':gt(' + (itemsInHtml - 1) + ')');
        }
        $(selectorString).on('tap', function(event) { self.addKeyword($(this).text()); });
    }

    /// Add keyword to the keyword list.
    this.addKeyword = function(name) {
    	var self = this;
    	var text = '<a href="#" class="ui-btn ui-mini ui-btn-inline ui-icon-delete ui-btn-icon-left">' +
                      cleanNameString(name) +
                   '</a>';
        var keywordShouldBeAdded = true;
        var allKeywords = $('#keywords-list a');
        // check if this keywoard is not already present
        for (var i = 0 ; i < allKeywords.length ; i++) {
            if ($(allKeywords[i]).text() == name) {
                keywordShouldBeAdded = false;
                break;
            }
        }
        if (keywordShouldBeAdded) {
            $('#keywords-list').append(text);
            $('#keywords-list a:last').on('tap', function(event) { self.deleteKeyword($(this).index()+1); });
        }
	    $('#available-keywords').val('');
	    $('#all-keywords-list a').addClass('ui-screen-hidden');
    }

    /// Delete keyword from the keyword list.
    this.deleteKeyword = function(index) {
	    $('#keywords-list a:nth-child(' + index + ')').remove();
    }

    /// Show popup that can be used to define new keyword.
    this.showAddKeywordPopup = function() {
        $('#new-keyword').val("");
        $('#add-keyword-popup').popup('open');
    }

    /// Callback used when new keyword was defined.
    this.addNewKeywordDefinition = function() {
        var name = $('#new-keyword').val();
        // check if keyword already exists
        for (var i = 0 ; i < this.keywordsData.count() ; i++) {
            if (this.keywordsData.get(i) == name) {
                return;
            }
        }
        // add new keyword
        this.keywordsData.add(name);
        // update list of keywords
        this.synchronizeKeywordsList();
        $('#add-keyword-popup').popup('close');
	}

    this.getContent = function() {
        var i = 0;
        var edited = true;
        var keywordsHtml = [];
        var newKeywords = [];
        var selectedKeywords = [];
        // get new keywords
        for (i = 0 ; i < this.keywordsData.count() ; i++) {
            if (this.keywordsData.getDatabaseFlag(i) == 'add') {
                newKeywords.push(this.keywordsData.get(i));
            }
        }
        // get list of selected keywords
        keywordsHtml = $('#keywords-list a');
        for (i = 0 ; i < keywordsHtml.length ; i++) {
            selectedKeywords.push($(keywordsHtml[i]).text());
        }
        return {
            'edited': edited,
            'new': newKeywords,
            'selected': selectedKeywords
        };
    }
}

function DishProperies() {

    this.generalProperties = undefined;
	this.ingredientProperties = undefined;
    this.recipeProperties = undefined;
    this.keywordsProperties = undefined;

    this.initialize = function(ingredientsData, unitsData, keywordsData) {
        var self = this;
        this.generalProperties = new GeneralProperties();
        this.generalProperties.initialize();
        this.ingredientProperties = new IngredientProperties();
        this.ingredientProperties.initialize(ingredientsData, unitsData);
        this.recipeProperties = new RecipeProperties();
        this.recipeProperties.initialize();
        this.keywordsProperties = new KeywordsProperties();
        this.keywordsProperties.initialize(keywordsData);
		$('#dish-defined').on('tap', function(event) { self.applyDishProperties(); });
		//$('#dish-definition-canceled').on('tap', function(event) { self.goToHomeScreen(); });
    }

    this.applyDishProperties = function() {
        var dishData = {
            'general': this.generalProperties.getContent(),
            'ingredients': this.ingredientProperties.getContent(),
            'recipe': this.recipeProperties.getContent(),
            'keywords': this.keywordsProperties.getContent()
        };
        console.log(JSON.stringify(dishData));
    }
}

