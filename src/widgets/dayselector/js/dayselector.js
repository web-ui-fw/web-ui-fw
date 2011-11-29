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
 * Authors: Rijubrata Bhaumik <rijubrata.bhaumik@intel.com>
 *          Elliot Smith <elliot.smith@intel.com>
 */

// Displays a day selector element: a control group with 7 check
// boxes which can be toggled on and off.
//
// The widget can be invoked on fieldset element with
// $(element).dayselector() or by creating a fieldset element with
// data-role="dayselector". If you try to apply it to an element
// of type other than fieldset, results will be unpredictable.
//
// The default is to display the controlgroup horizontally; you can
// override this by setting data-type="vertical" on the fieldset,
// or by passing a type option to the constructor. The data-type
// attribute has precedence.
//
// If no ID is supplied for the dayselector, one will be generated
// automatically.
//
// Methods:
//
//     value: Return the day numbers (0=Sunday, ..., 6=Saturday) of
//            the selected checkboxes as an array.
//
//     selectAll: Select all 7 days of the week by automatically "ticking"
//                all of the checkboxes.
//
// Options:
//
//     theme : Override the data-theme of the widget; note that the
//             order of preference is: 1) set from data-theme attribute;
//             2) set from option; 3) set from closest parent data-theme;
//             4) default to 'c'
//
//     type: 'horizontal' (default) or 'vertical'; specifies the type
//           of controlgroup to create around the day check boxes.
//
//     days: array of day names, Sunday first; defaults to English day
//           names; the first letters are used as text for the checkboxes

(function ($, window, undefined) {
    $.widget("todons.dayselector", $.mobile.widget, {
        options: {
            initSelector: 'fieldset:jqmData(role="dayselector")',
            theme: null,
            type: 'horizontal',
            days: ['Sunday',
                   'Monday',
                   'Tuesday',
                   'Wednesday',
                   'Thursday',
                   'Friday',
                   'Saturday']
        },

        defaultTheme: 'c',

        _create: function () {
            this.element.addClass('ui-dayselector');

            this.options.type = this.element.jqmData('type') || this.options.type;

            this.options.theme = this.element.jqmData('theme') ||
                                 this.options.theme ||
                                 this.element.closest(':jqmData(theme)').jqmData('theme')
                                 this.defaultTheme;

            var days = this.options.days;

            this.element.attr('data-' + $.mobile.ns + 'type', this.options.type);

            var parentId = this.element.attr('id') ||
                           'dayselector' + (new Date()).getTime();

            for (var i = 0; i < days.length; i++) {
                var day = days[i];
                var letter = day.slice(0, 1);
                var id = parentId + '_' + i;
                var labelClass = 'ui-dayselector-label-' + i;

                var checkbox = $('<input type="checkbox"/>')
                               .attr('id', id)
                               .attr('value', i);

                var label = $('<label>' + letter + '</label>')
                            .attr('for', id)
                            .addClass(labelClass);

                this.element.append(checkbox);
                this.element.append(label);
            }

            this.checkboxes = this.element.find(':checkbox')
                                          .checkboxradio({theme: this.options.theme});

            this.element.controlgroup({excludeInvisible: false});
        },

        value: function () {
            var values = this.checkboxes.filter(':checked').map(function () {
                return this.value;
            }).get();

            return values;
        },

        selectAll: function () {
            this.checkboxes.attr('checked', 'checked')
                           .checkboxradio('refresh');
        }

    }); /* End of Widget */

    // auto self-init widgets
    $(document).bind("pagebeforecreate", function (e) {
        var elts = $($.todons.dayselector.prototype.options.initSelector, e.target);
        elts.not(":jqmData(role='none'), :jqmData(role='nojs')").dayselector();
    });

})(jQuery, this);
