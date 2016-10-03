/*jslint browser: true*/
/*global $, jQuery, alert, FormData, md5*/


function DishBackup() {
    "use strict";

    this.ingredientsData  = undefined;
    this.unitsData  = undefined;
    this.categoriesData  = undefined;

    this.$backupDishesPopup = $('#backup-dishes-popup');
    this.$uploadDishesPopup = $('#upload-dishes-popup');
    this.$uploadDishesFile = $('#upload-dishes-file');
    this.$backupDishesPassword = $('#backup-dishes-password');
    this.$uploadDishesPassword = $('#upload-dishes-password');
    
    this.initialize = function (globals) {
        var self = this;
        this.ingredientsData  = globals.ingredientsData;
        this.unitsData  = globals.unitsData;
        this.categoriesData  = globals.categoriesData;
        
        $('#backup-dishes').on('tap', function () { self.requestDishesBackup(); });
        $('#upload-dishes').on('tap', function () { self.requestDishesUpload(); });
    };

    this.requestDishesBackup = function () {
        var self = this,
            password = md5(this.$backupDishesPassword.val());
        this.$backupDishesPopup.popup('close');
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
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        filename += year + '_' + month + '_' + day + '.json';

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

    this.requestDishesUpload = function () {
        var self = this,
            password = md5(this.$uploadDishesPassword.val()),
            backupFile = this.$uploadDishesFile.files[0],       // todo
            formData = new FormData();
        formData.append('password', password);
        formData.append('file', backupFile);
        this.$uploadDishesPopup.popup('close');
        $.ajax({
            type: "POST",
            url: "upload-dishes",
            data: formData,
            processData: false,
            contentType: false,
            error: function (data) { alert('Error'); },
            success: function (data) { alert('OK'); }
        });
    };
    
}

