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

        _create: function () {
            var self = this,
                proto = $.mobile.todons.loadPrototype("dayselector");

            proto.insertBefore(this.element);

            this.checkboxes = proto.find('.custom-checkbox')
                                   .checkboxradio();

            proto.find('.checkall').click(function () {
                self.selectAll();
            });
            
        },
        
        value: function () {
           var values = $('input:checkbox:checked.custom-checkbox').map(function () {
           		return this.value;
           }).get();
           return values.join(',');
        },

        selectAll: function () {
            this.checkboxes.attr('checked', 'checked')
                           .checkboxradio('refresh');
        },
        
        
    }); /* End of Widget */

    // auto self-init widgets
    $(document).bind("pagebeforecreate", function (e) {
        $(e.target).find(":jqmData(role='dayselector')").dayselector();
    });

})(jQuery, this);