/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
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
//             order of preference is: 1) set from option; 2) set from
//             data-theme attribute; 3) set from closest parent data-theme;
//             4) default to 'c'
//
//     type: 'horizontal' (default) or 'vertical'; specifies the type
//           of controlgroup to create around the day check boxes.

(function ($, window, undefined) {
    $.widget("todons.dayselector", $.mobile.widget, {
        options: {
            theme: null,
            type: 'horizontal'
        },

        _create: function () {
            var days = ['Sunday',
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday'];

            this.options.type = this.element.attr('data-type') || this.options.type;
            this.element.attr('data-type', this.options.type);

            this.element.addClass('ui-dayselector');

            this.options.theme = this.options.theme ||
                                 this.element.data('theme') ||
                                 this.element.closest(':jqmData(theme)').attr('data-theme') ||
                                 'c';

            var parentId = this.element.attr('id') ||
                           'dayselector' + (new Date()).getTime();

            for (var i = 0; i < days.length; i++) {
                var day = days[i];
                var letter = day.slice(0, 1);
                var id = parentId + '_' + i;
                var labelClass = 'ui-dayselector-label-' + day.toLowerCase();

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
        $(e.target).find("fieldset:jqmData(role='dayselector')")
                   .dayselector();
    });

})(jQuery, this);
