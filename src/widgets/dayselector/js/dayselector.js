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
       			event.preventDefault();
       			event.stopPropagation();       			
    		});
    		
    		//Button events
			container.find("a.monday").bind("vclick" ,function(event) {
       			self.selectedDays = self.selectedDays ^ 0x20 ;
       		 	container.trigger("day-changed",self.getValue());
       			event.preventDefault();
       			event.stopPropagation();       			
    		});
    		
    		//Button events
			container.find("a.tuesday").bind("vclick" ,function(event) {
       			self.selectedDays = self.selectedDays ^ 0x10 ;
       		 	container.trigger("day-changed",self.getValue());
       			event.preventDefault();
       			event.stopPropagation();       			
    		});
    		
    		//Button events
			container.find("a.wednesday").bind("vclick" ,function(event) {
       			self.selectedDays = self.selectedDays ^ 0x08 ;
       		 	container.trigger("day-changed",self.getValue());
       			event.preventDefault();
       			event.stopPropagation();       			
    		});
    		
    		//Button events
			container.find("a.thursday").bind("vclick" ,function(event) {
       			self.selectedDays = self.selectedDays ^ 0x04 ;
       		 	container.trigger("day-changed",self.getValue());
       			event.preventDefault();
       			event.stopPropagation();       			
    		});
    		
    		//Button events
			container.find("a.friday").bind("vclick" ,function(event) {
       			self.selectedDays = self.selectedDays ^ 0x02 ;
       		 	container.trigger("day-changed",self.getValue());
       			event.preventDefault();
       			event.stopPropagation();       			
    		});
    		
    		
    		//Button events
			container.find("a.saturday").bind("vclick" ,function(event) {
       			self.selectedDays = self.selectedDays ^ 0x01 ;
       		 	container.trigger("day-changed",self.getValue());
       			event.preventDefault();
       			event.stopPropagation();       			
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
