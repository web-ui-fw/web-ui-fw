/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Salvatore Iovene <salvatore.iovene@intel.com>
 */

ensureNS("jQuery.mobile.todons");

/**
 * This file contains stubs for the Web APIs.
 * The stub can be used for testing purposes.
 */
jQuery.extend(jQuery.mobile.todons, {
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
                new $.mobile.todons.Person("Amy"),
                new $.mobile.todons.Person("Betty"),
                new $.mobile.todons.Person("Carl"),
                new $.mobile.todons.Person("Felicia"),
                new $.mobile.todons.Person("John"),
                new $.mobile.todons.Person("Matts"),
                new $.mobile.todons.Person("Rebecca"),
                new $.mobile.todons.Person("Zoe"));

            // Simulate some time to complete the operation.
            setTimeout(function() { successCallback(persons); }, 1000);
            return new $.mobile.todons.PendingOperation();
        }
    }
});
