/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Rijubrata Bhaumik <rijubrata.bhaumik@intel.com>
 */
(function ($, window, undefined) {
    $.widget("mobile.progressbar_dialog", $.mobile.widget, {
        options: {
            value: 0,
            max: 100,
            duration: 10000,
        },
		
		container: 0,
				
        _create: function () {
        	console.log("in _create in progressbar_dialog");
        	
        var self = this,
        	select = this.element,
        	o = this.options;
        	self.container = $.mobile.loadPrototype("progressbar_dialog").find("#progressbar-dialog")
        		.insertBefore(select);
        	
        	
		/*
		var progressbar = $.mobile.loadPrototype("")
    		
    		console.log("looking for" + container.find("#upper-progressbar-container"));	
    		
            container.find('#cancel-button').click(function () {
                if (self.data.bar.is(':animated')) {
                    self.data.bar.stop();
                };                
            });
        */  
       /*  
            $.extend ( self, {
            	container: container
            });
         */ 
          
        },
        
        value : function( newValue ) {
			var progressbar = container.find("#progressbar-in-dialog");	
			console.log("progressbar-->" + progressbar);
        	if (newValue === undefined) {
                return progressbar._value();
            }
            progressbar.options.value = parseInt(newValue);
            progressbar._refreshValue();
		},
    }); /* End of widget */

    //auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='progressbar_dialog')").progressbar_dialog();
    });

})(jQuery, this);