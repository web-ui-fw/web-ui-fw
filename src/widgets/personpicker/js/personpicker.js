/*
 * jQuery Mobile Widget @VERSION
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

// Displays a list of contacts fetched from the provided AddressBook.
//
// To apply, add the attribute data-role="personpicker" to a <div>
// element inside a page or a dialog. Alternative, call personpicker()
// on an element, like this:
//
//     $("#my_personpicker").personpicker();
//
// where the HTML might be:
//
//     <div id="my_personpicker"></div>
//
// Theme: by default, gets a 'b' swatch; override with data-theme="X"
// as per usual.
//
// Options:
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
    $.widget("tizen.personpicker", $.tizen.widgetex, {
        options: {
            addressBook: null,
            successCallback: null,
            errorCallback: null,
            filter: null,
            multipleSelection: true,
            theme: 'b'
        },

        _data: {
            checked: new Array()
        },

        _personArraySuccessCallback: function(persons) {
            var self = this;
            var list = self._ui.ui.list;
            var li = self._ui.row.li;
            var container = self._ui.ui.personpicker.find('.ui-personpicker-container');

            container.find('.loader').remove();
            container.find('.ui-listview-filter').show();
            list.find('li').remove();

            persons.forEach(function(p) {
                currentListItem = li.clone();
                currentCheckbox = currentListItem.find('.switch');
                currentName = currentListItem.find('.name');
                currentAvatar = currentListItem.find('.avatar');

                currentName.text(p.id());
                currentAvatar.find("img").attr({src: p.avatar(), alt: p.id()});
                list.append(currentListItem);

                currentCheckbox
                    .toggleswitch({"checked": false, theme: self.options.theme})
                    .data("Person", p)
                    .bind("changed", function(e, checked) {
                        var p = $(this).data("Person");
                        if (checked) {
                            if (!self.options.multipleSelection) {
                                self._data.checked.forEach(function(item) {
                                    item.toggleswitch("option", "checked", false);
                                });
                                self._data.checked.length = 0;
                            }
                            if ($.inArray(p, self._data.checked) == -1) {
                                self._data.checked.push($(this));
                            }
                        } else {
                            self._data.checked = $.grep(
                                self._data.checked, function(value) {
                                    return value != $(this);
                                });
                        }
                    });
            });

            container.scrollview({direction: 'y'});
            self._ui.ui.list.shortcutscroll();
            self._ui.ui.list.autodividers({selector: '.content > h3'});

            // bind to events on the search input so that the listview
            // can be scrolled when the list is filtered
            self._ui.ui.search.bind("keyup change", function () {
              container.scrollview('scrollTo', 0, 0);
            });

            // re-enable search input
            self._ui.ui.search.textinput('enable');
        },

        _htmlProto: {
            ui: {
                ui: {
                    personpicker: ".ui-personpicker",
                    list: ".ui-personpicker ul"
                },
                row: {
                    li: "li.ui-personpicker-row",
                    container: "div.ui-personpicker-row-container",
                    checkbox: "div.switch",
                    name: "h3.name",
                    avatar: "div.avatar"
                }
            }
        },

        _create: function () {
            var self = this;

            this.element.append(self._ui.ui.personpicker);
            self._ui.ui.list.listview({theme: self.options.theme});

            self._ui.ui.search = $(this.element).find(':jqmData(type="search")');

            // disable search input until list is populated
            self._ui.ui.search.textinput('disable');

            this.refresh();
        },

        getPersons: function() {
            var persons = new Array();
            this._data.checked.forEach(function(item) {
                persons.push(item.data("Person"));
            });
            return persons;
        },

        refresh: function () {
            var self = this;

            // Load persons.
            if (this.options.addressBook !== null) {
                // Replace this with actuall call when implemented.
                this.options.addressBook.findPersons(
                    function (persons) { self._personArraySuccessCallback(persons); },
                    this.options.errorCallback,
                    this.options.filter,
                    null,
                    null);
            }
        },

        resizeScrollview: function(height) {
            this._ui.ui.personpicker.find('.ui-personpicker-container').height(height);
        }
    }); /* End of widget */

    //auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='personpicker')").personpicker();
    });
})(jQuery, this);
