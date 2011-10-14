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
		options: {
            theme: 'c',
        },
		
		_create: function () {
			var self= this,
				select = this.element,
				container = $.mobile.todons.loadPrototype("dayselector").find("div.ui-dayselector").insertBefore(select);
		
			/*
			this.options.theme = this.element.data('theme') || this.options.theme;
            themeClass = 'ui-body-' + this.options.theme;
			*/
			
			
			
			
			$.extend( self, {
				container: container,
				
			});
			
			container.find(":jqmData(role='controlgroup')").controlgroup();						
		},
		
	
		
	}); /* End of Widget */
	
	 // auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='dayselector')").dayselector();
    });
    
})(jQuery, this);
