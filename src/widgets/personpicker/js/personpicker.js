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

            li.remove();
            persons.forEach(function(p) {
                currentListItem = li.clone();
                currentCheckbox = currentListItem.find('.switch');
                currentName = currentListItem.find('.name');
                currentAvatar = currentListItem.find('.avatar');

                currentName.text(p.id());
                currentAvatar.find("img").attr({src: p.avatar()});
                list.append(currentListItem);

                currentCheckbox.switch({"checked": false});
            });
            list.listview();
        },

        _create: function () {
            var self = this;

            self._data.ui = {
                personpicker: ".ui-personpicker",
                list: ".ui-personpicker > ul",
                cancel: ".ui-personpicker .cancel-btn",
                done: ".ui-personpicker .done-btn"
            };

            self._data.row = {
                li: "li.ui-personpicker-row",
                container: "div.ui-personpicker-row-container",
                checkbox: "div.switch",
                name: "h3.name",
                avatar: "div.avatar"
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

            self._data.ui.cancel.buttonMarkup({shadow: true, inline: true});
            self._data.ui.done.buttonMarkup({shadow: true, inline: true});
        }
    }); /* End of widget */

    //auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='personpicker')").personpicker();
    });
})(jQuery, this);

