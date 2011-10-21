/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Rijubrata Bhaumik <rijubrata.bhaumik@intel.com>
 */
/**
 * Displays a day selector element
 *
 * The element displays the 7 days of a week in a control group
 * containing buttons in a horizontal
 * the widget can be invoked like ->
 * e.g. $('#dayselector').dayselector()
 *
 * value() : returns the values of the selected checkboxes is a comma separated string
 *
 * selectAll() : method can be used to select all the options in the fieldset ( all days of the week)
 *
 * Options:
 * -> data-theme : override the data-theme of the widget
 */
(function ($, window, undefined) {
    $.widget("todons.dayselector", $.mobile.widget, {
        options: {
            theme: 'c'
        },

        _create: function () {
            var self = this,
                proto = $.mobile.todons.loadPrototype("dayselector"),
                themeClass;

            var topElement = proto.find('.daycheckboxes');

            topElement.insertBefore(this.element);

            // theming; override default with the dayselector's theme if present
            this.options.theme = this.element.data('theme') ||
                                 this.element.closest(':jqmData(theme)').attr('data-theme') ||
                                 this.options.theme;

            this.checkboxes = topElement.find('.custom-checkbox').checkboxradio({theme: this.options.theme});
        },

        value: function () {
            var values = $('input:checkbox:checked.custom-checkbox').map(function () {
                return this.value;
            }).get();

            return values.join(',');
        },

        selectAll: function () {
            this.checkboxes.attr('checked', 'checked').checkboxradio('refresh');
        },


    }); /* End of Widget */

    // auto self-init widgets
    $(document).bind("pagebeforecreate", function (e) {
        $(e.target).find(":jqmData(role='dayselector')").dayselector();
    });

})(jQuery, this);
