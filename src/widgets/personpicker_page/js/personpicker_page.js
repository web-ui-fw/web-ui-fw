/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Salvatore Iovene <salvatore.iovene@intel.com>
 */

/**
 * Displays a page that contains a PersonPicker, and buttons to
 * interact with it.
 *
 * To apply, add the attribute data-role="personpicker-page" to
 * a page.
 *
 * Theme: by default, gets a 'b' swatch; override with data-theme="X"
 * as per usual.
 *
 * Options:
 *     title:
 *         DOMString: the title of the page. Default: empty string.
 *     addressBook:
 *         AddressBook; the address book used to populate the picker.
 *     successCallback:
 *         Function; the function to call after the Done button has
 *         been clicked, and no errors occurred.
 *     errorCallback:
 *         Function; the function to call if there was an error while
 *         showing the widget.
 *     filter:
 *         Filter; a filter used when querying the address book.
 *     multipleSelection:
 *         Boolean; weather the widget allows picking more than one
 *         person. Default: true.
 */

(function ($, window, undefined) {
    $.widget("todons.personpicker_page", $.mobile.dialog, {
        options: {
            title: "",
            addressBook: null,
            successCallback: null,
            errorCallback: null,
            filter: null,
            multipleSelection: true,
            theme: 'b'
        },

        _data: {
            ui: null
        },

        _resizePersonpicker: function() {
            this._data.ui.personpicker.personpicker(
                "resizeScrollview",
                $(window).height() - this._data.ui.container.find('.page-header').outerHeight(true));
        },

        _create: function () {
            var self = this;

            self._data.ui = {
                container: ".ui-personpicker-page-container",
                title: ".ui-personpicker-page-container h1",
                optionheader: ".ui-personpicker-page-container .optionheader",
                cancel: ".ui-personpicker-page-container .optionheader .cancel-btn",
                done: ".ui-personpicker-page-container .optionheader .done-btn",
                personpicker: ".ui-personpicker-page-container > .personpicker",
            };

            $.mobile.todons.parseOptions(self, true);

            // Prepare.
            self._data.ui = $.mobile.todons.loadPrototype("personpicker_page", self._data.ui);
            self._data.ui.title.text(self.options.title);
            self._data.ui.cancel.buttonMarkup({shadow: true, inline: true, icon: "delete", theme: self.options.theme});
            self._data.ui.done
                .buttonMarkup({shadow: true, inline: true, theme: self.options.theme})
                .bind("vclick", function(e) {
                    self.options.successCallback(self._data.ui.personpicker.personpicker("getPersons"));
                });

            this.element.append(self._data.ui.container);

            self._data.ui.optionheader.optionheader({theme: self.options.theme});

            $.mobile.page.prototype._create.call(this);
            $.mobile.dialog.prototype._create.call(this);

            self._data.ui.personpicker.personpicker({
               addressBook: self.options.addressBook,
               successCallback: self.options.successCallback,
               errorCallback: self.options.errorCallback,
               filter: self.options.filter,
               multipleSelection: self.options.multipleSelection,
               theme: self.options.theme
            });

            // Hack: the JQM Dialog is unconfigurable in its will to
            // place a Close button there.
            self._data.ui.container.find(".page-header > a:first-child").remove();

            // Resize on window resize.
            $(window).bind('resize', function() {
                self._resizePersonpicker();
            });

            // Resize when page is ready.
            if (this.element.closest(".ui-page").is(":visible"))
                self._resizePersonpicker();
            else
                this.element.closest(".ui-page").bind("pageshow", function() { self._resizePersonpicker(); });

            // Resize when optionheader collapses or expands.
            self._data.ui.optionheader.bind('collapse expand', function() {
                self._resizePersonpicker();
            });
        }
    }); /* End of widget */

    //auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='personpicker-page')").personpicker_page();
    });
})(jQuery, this);
