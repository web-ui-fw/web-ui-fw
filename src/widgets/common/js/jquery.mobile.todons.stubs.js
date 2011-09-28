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

    PersonArraySuccessCallback: function() {
        this.onsuccess = function(personArray) {
        }
    },

    AddressBookSuccessCallback: function() {
        this.onsuccess = function(addressbook) {
        }
    },

    ErrorCallback: function() {
        this.onerror = function(error) {
        }
    },

    Filter: function() {
        var ID_FILTER = 0;
        var UNION_FILTER = 1;
        var INTERSECTION_FILTER = 2;
        var ATTRIBUTE_FILTER = 3;
        var ATTRIBUTE_RANGE_FILTER = 4;

        var type = ID_FILTER;
    },

    SortOrderArray: function() {
    },

    DeviceAPIError: function() {
        var code;
        var message;

        var INDEX_SIZE_ERR                 = 1;
        var DOMSTRING_SIZE_ERR             = 2;
        var HIERARCHY_REQUEST_ERR          = 3;
        var WRONG_DOCUMENT_ERR             = 4;
        var INVALID_CHARACTER_ERR          = 5;
        var NO_DATA_ALLOWED_ERR            = 6;
        var NO_MODIFICATION_ALLOWED_ERR    = 7;
        var NOT_FOUND_ERR                  = 8;

        var NOT_SUPPORTED_ERR              = 9;
        var INUSE_ATTRIBUTE_ERR            = 10;
        var INVALID_STATE_ERR              = 11;
        var SYNTAX_ERR                     = 12;
        var INVALID_MODIFICATION_ERR       = 13;
        var NAMESPACE_ERR                  = 14;
        var INVALID_ACCESS_ERR             = 15;
        var VALIDATION_ERR                 = 16;

        var TYPE_MISMATCH_ERR              = 17;
      
        var SECURITY_ERR                   = 18;

        var NETWORK_ERR                    = 19;
      
        var ABORT_ERR                      = 20;

        var TIMEOUT_ERR                    = 21;

        var INVALID_VALUES_ERR             = 22;

        var POLICY_ERR                     = 23;
    },

    getDefaultAddressBook: function(successCallback, errocCallback) {
        successCalback.call();
        return new PendingOperation();
    },
});

