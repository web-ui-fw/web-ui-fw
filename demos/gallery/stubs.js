/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Salvatore Iovene <salvatore.iovene@intel.com>
 */

ensureNS("jQuery.mobile.tizen");

/**
 * This file contains stubs for the Web APIs.
 * The stub can be used for testing purposes.
 */
jQuery.extend(jQuery.mobile.tizen, {
    /*
     * Functions for the Addressbook module.
     */

    PendingOperation: function() {
        this.cancel = function() {
        }
    },

    Person: function(id) {
        this._id = id;

        this.id = function() {
            return this._id;
        }

        // TODO: this is not the real API!
        this.avatar = function() {
            return "images/avatar.png";
        }
    },

    AddressBook: function() {
        this.findPersons = function(
            successCallback, errorCallback, filter, sortOrders,
            attributesOfInterest)
        {
            persons = new Array(
                new $.mobile.tizen.Person("Amy"),
                new $.mobile.tizen.Person("Betty"),
                new $.mobile.tizen.Person("Carl"),
                new $.mobile.tizen.Person("Felicia"),
                new $.mobile.tizen.Person("John"),
                new $.mobile.tizen.Person("Matts"),
                new $.mobile.tizen.Person("Rebecca"),
                new $.mobile.tizen.Person("Zoe"));

            // Simulate some time to complete the operation.
            setTimeout(function() { successCallback(persons); }, 1000);
            return new $.mobile.tizen.PendingOperation();
        }
    }
});
