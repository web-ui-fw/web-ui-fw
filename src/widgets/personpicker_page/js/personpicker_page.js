/*
 * jQuery Mobile Widget @VERSION
 *
 *
 * This software is licensed under the MIT licence (as defined by the OSI at
 * http://www.opensource.org/licenses/mit-license.php)
 *
 * ***************************************************************************
 * Copyright (C) 2011 by Intel Corporation Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 *
 * Authors: Salvatore Iovene <salvatore.iovene@intel.com>
 */

// Displays a page that contains a PersonPicker, and buttons to
// interact with it.
//
// To apply, add the attribute data-role="personpicker-page" to
// a page.
//
// Theme: by default, gets a 'b' swatch; override with data-theme="X"
// as per usual.
//
// Options:
//     title:
//         DOMString: the title of the page. Default: empty string.
//     addressBook:
//         AddressBook; the address book used to populate the picker.
//     successCallback:
//         Function; the function to call after the Done button has
//         been clicked, and no errors occurred.
//     errorCallback:
//         Function; the function to call if there was an error while
//         showing the widget.
//     filter:
//         Filter; a filter used when querying the address book.
//     multipleSelection:
//         Boolean; weather the widget allows picking more than one
//         person. Default: true.

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

        _htmlProto: {
            ui: {
                container: ".ui-personpicker-page-container",
                title: ".ui-personpicker-page-container h1",
                optionheader: ".ui-personpicker-page-container .ui-optionheader-anchor",
                cancel: ".ui-personpicker-page-container .ui-optionheader-anchor .cancel-btn",
                done: ".ui-personpicker-page-container .ui-optionheader-anchor .done-btn",
                personpicker: ".ui-personpicker-page-container > .ui-personpicker-anchor"
            }
        },

        _resizePersonpicker: function() {
            var header = this._ui.container.find(':jqmData(role=header)');

            // get the height of the window
            var windowHeight = $(window).height();

            // get the height of the header
            var headerHeight = header.outerHeight(true);

            // figure out how big to make the personpicker, so it fills the container
            var personpickerHeight = windowHeight - headerHeight - 2;

            this._ui.personpicker.personpicker("resizeScrollview", personpickerHeight);

            this.element.trigger('updatelayout');
        },

        _create: function () {
            var self = this;

            $.todons.widgetex.loadPrototype.call(this, "todons.personpicker_page");

            // Prepare.
            self._ui.title.text(self.options.title);
            self._ui.cancel.buttonMarkup({shadow: true, inline: true, icon: "delete", theme: self.options.theme});
            self._ui.done
                .buttonMarkup({shadow: true, inline: true, theme: self.options.theme})
                .bind("vclick", function(e) {
                    self.options.successCallback(self._ui.personpicker.personpicker("getPersons"));
                });

            this.element.append(self._ui.container);

            self._ui.optionheader.optionheader({theme: self.options.theme});

            $.mobile.page.prototype._create.call(this);
            $.mobile.dialog.prototype._create.call(this);

            self._ui.personpicker.personpicker({
               addressBook: self.options.addressBook,
               successCallback: self.options.successCallback,
               errorCallback: self.options.errorCallback,
               filter: self.options.filter,
               multipleSelection: self.options.multipleSelection,
               theme: self.options.theme
            });

            // Hack: the JQM Dialog is unconfigurable in its will to
            // place a Close button there.
            self._ui.container.find(":jqmData(role=header) > a:first-child").remove();

            // Resize on window resize.
            $(window).bind('resize', function() {
                self._resizePersonpicker();
            });

            // Resize when optionheader collapses or expands.
            self._ui.optionheader.bind('collapse expand', function() {
                self._resizePersonpicker();
            });

            // Resize when page is ready; always expand the optionheader
            // on pageshow (which triggers a resize anyway)
            if (this.element.closest(".ui-page").is(":visible"))
                self._resizePersonpicker();
            else {
                this.element.closest(".ui-page").bind("pageshow", function() {
                    self._ui.optionheader.optionheader('expand', {duration:0});
                    self._ui.optionheader.optionheader('refresh');
                    self._resizePersonpicker();
                });
            }
        }
    }); /* End of widget */

    //auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='personpicker-page')").personpicker_page();
    });
})(jQuery, this);
