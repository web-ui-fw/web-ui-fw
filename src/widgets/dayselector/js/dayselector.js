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
 * e.g. $('#dayselector').day_selector()
 *
 * Options:
 * - none
 */

(function ($, window, undefined) {
	$.widget("todons.dayselector", $.mobile.widget, {
		
		_create: function () {
			var self= this,
				select = this.element,
                proto = $.mobile.todons.loadPrototype("dayselector");

            $(proto).find("fieldset").controlgroup({excludeInvisible: false});

            var container = $(proto).find("div.ui-dayselector").insertBefore(select);
        	
            $('input:radio[name=radio-choice]').change(function () {
            	console.log("change val = " + $('input:radio[name=radio-choice]:checked').val());
            	            		
            });
  		
			$.extend( self, {
				container: container,
				
			});				
		},
		
	
		
	}); /* End of Widget */
	
	 // auto self-init widgets
    $(document).bind("pagebeforecreate", function (e) {
        $(e.target).find(":jqmData(role='dayselector')").dayselector();
    });
    
})(jQuery, this);
