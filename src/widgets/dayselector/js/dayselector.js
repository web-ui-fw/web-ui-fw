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
                proto = $.mobile.todons.loadPrototype("dayselector"),
                daysArray = [];

            $(proto).find("fieldset").controlgroup({excludeInvisible: false});

            var container = $(proto).find("div.ui-dayselector").insertBefore(select);
        	            
  			$('input:checkbox[name=checkbox-choice]').change(function () {
            	if( $(this).is(':checked')) {
            		console.log("chkbox val = " + $(this).eq(0).val());
            		self.daysArray.push($(this).eq(0).val());
            	}
            	else {
            		removeItem = $(this).eq(0).val();
            		console.log("unchecked -->" + removeItem);
            		
            		self.daysArray = jQuery.grep(self.daysArray, function(value) {
   					     return value != removeItem;
					});
					
            	}
            	
            	container.trigger("day-changed", self.getValue());
            });
            
            $('input:checkbox[name=checkAll]').change(self.selectAll);
  				
			$.extend( self, {
				container: container,
				daysArray: daysArray
			});		
					
		},
		
		selectAll: function() {
			console.log(".checkall is clicked");
			$('input:checkbox[name=checkAll]').parent('fieldset:eq(0)').find(':checkbox').attr('checked', true);
			//$('input:checkbox[name=checkbox-choice]').attr('checked', true);
			
			var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			self.daysArray = [];
			jQuery.each( days, function() {
				self.daysArray.push(this);
			});
			
			self.container.trigger("day-changed", self.getValue());
		},
		
		getValue: function() {
			var dayString = this.daysArray.join(); 
			console.log("get value here .. daystring= " + dayString);
			return dayString ;
		}
		
	}); /* End of Widget */
	
	 // auto self-init widgets
    $(document).bind("pagebeforecreate", function (e) {
        $(e.target).find(":jqmData(role='dayselector')").dayselector();
    });
    
})(jQuery, this);
