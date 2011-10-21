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
 * $("#daySelector1").dayselector('value') returns the values of the selected checkboxes
 *  
 * selectAll() : method can be used to select all the options in the fieldset ( all days of the week) 
 *
 * Options:
 * - none
 */
(function ($, window, undefined) {
    $.widget("todons.dayselector", $.mobile.widget, {
        options: {
            theme: 'e'
        },


        _create: function () {
            var self = this,
                proto = $.mobile.todons.loadPrototype("dayselector"),
                themeClass;

            proto.insertBefore(this.element);

            // theming; override default with the slider's theme if present
            this.options.theme = this.element.data('theme') || this.options.theme;
            themeClass = 'ui-body-' + this.options.theme;
            var daySelectorTheme = proto.find('.ui-dayselector');
            daySelectorTheme.attr('data-theme', this.options.theme);
            daySelectorTheme.addClass(themeClass);

            this.checkboxes = proto.find('.custom-checkbox').checkboxradio();

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