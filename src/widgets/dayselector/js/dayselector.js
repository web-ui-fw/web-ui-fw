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
				selectedDays = 0x0,
				container = $.mobile.todons.loadPrototype("dayselector").find("div.ui-dayselector").insertBefore(select);
		
			
			$.extend( self, {
				container: container,
				selectedDays: selectedDays
			});
			
			
			//Button events
			container.find("a.sunday").bind("vclick" ,function(event) {
       			self.selectedDays = self.selectedDays ^ 0x40 ;
       		 	container.trigger("day-changed",self.getValue());
       		 //	event.preventDefault();
       		//	event.stopPropagation();       			
    		});
    		
						
		},
		
		getValue: function() {
			console.log("getValue is called, val= " + this.selectedDays);
			return this.selectedDays;
		},
		
	}); /* End of Widget */
	
	 // auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='dayselector')").dayselector();
    });
    
})(jQuery, this);
