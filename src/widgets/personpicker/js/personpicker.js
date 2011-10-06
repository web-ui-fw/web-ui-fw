/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Salvatore Iovene <salvatore.iovene@intel.com>
 */

/**
 * TODO: documentation.
 */

(function ($, window, undefined) {
    $.widget("todons.personpicker", $.mobile.widget, {
        options: {
            addressBook: new $.mobile.todons.AddressBook()
        },

        _data: {
            ui: undefined,
            row: undefined
        },

        _personArraySuccessCallback: function(persons) {
            var list = this._data.ui.list;
            var li = this._data.row.li;
            var name = this._data.row.name;

            li.remove();
            persons.forEach(function(p) {
                currentListItem = li.clone();
                currentCheckbox = currentListItem.find('.switch');

                name.text(p.id());
                list.append(currentListItem);
                currentCheckbox.switch();
            });
            list.listview();
        },

        _create: function () {
            var self = this;

            self._data.ui = {
                personpicker: ".ui-personpicker",
                list: ".ui-personpicker > ul"
            };

            self._data.row = {
                li: "li.ui-personpicker-row",
                container: "div.ui-personpicker-row-container",
                checkbox: "div.switch",
                name: "h3.name"
            };

            // Prepare.
            self._data.ui = $.mobile.todons.loadPrototype("personpicker", self._data.ui); 
            self._data.row = $.mobile.todons.loadPrototype("personpicker-row", self._data.row);
 
            // Load persons.
            if (self.options.addressBook !== undefined) {
                // Replace this with actuall call when implemented.
                self.options.addressBook.findPersons(
                    function(persons) { self._personArraySuccessCallback(persons); },
                    undefined, undefined, undefined, undefined);
            }

            this.element.append(self._data.ui.personpicker);
        }
    }); /* End of widget */

    //auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='personpicker')").personpicker();
    });
})(jQuery, this);

