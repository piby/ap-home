/*jslint browser: true*/
/*global $, jQuery, alert, adjustPageHeight, md5*/

function DishDoneHandler() {
    "use strict";

    this.dishPresenter = undefined;
    this.doneOptionText = [
        "Dzisiaj",
        "Wczoraj",
        "Przedwczoraj",
        "Trzy dni temu",
        "Cztery dni temu",
        "Pięć dni temu",
        "Sześć dni temu",
        "Tydzień temu",
        "Osiem dni temu",
        "Dziewięć dni temu",
        "Dziesięć dni temu",
        "Jedenaście dni temu",
        "Dwanaście dni temu",
        "Trzynaście dni temu",
        "Dwa tygodnie temu"
    ];

    this.$dishPage = $('#dish-page');
    this.$dishDonePage = $('#dish-done-page');
    this.$dishDoneSlider = $('#dish-done-slider');
    this.$dishDoneText = $('#dish-done-text');

    this.initialize = function (dishPresenter) {
        var self = this;
        this.dishPresenter = dishPresenter;

        // when dish-done-page is created we need to center
        // its content but this have to be done with a delay
        // as page items wont have proper height right away
        this.$dishDonePage.on("pagecreate", function (event) {
            setTimeout(function () {
                adjustPageHeight(self.$dishDonePage, true);
            }, 200);
        });

        this.$dishDoneSlider.on('slidestop', function (event, ui) {
            var sliderValue = $(this).find('input').val(),
                doneText = self.doneOptionText[sliderValue];
            self.$dishDoneText.text(doneText);
        });

        $('#dish-done-confirm').on('tap', function () { self.requestDishDoneUpdate(); });
    };

    this.requestDishDoneUpdate = function () {
        var self = this,
            currentDishId = this.dishPresenter.getCurrentDishId(),
            doneOffset = this.$dishDoneSlider.find('input').val();
        $.ajax({
            type: "GET",
            url: "update-dish-done-date",
            data: { dish_id: currentDishId, days_offset: doneOffset },
            datatype: "json",
            error: function (data) { alert('Error'); },
            success: function (data) { self.handleDishDoneUpdate(currentDishId, doneOffset); }
        });
    };

    this.handleDishDoneUpdate = function (currentDishId, doneOffset) {
        this.dishPresenter.updateDishDoneOffset(currentDishId, doneOffset);
        $.mobile.changePage(this.$dishPage);
    };
}

