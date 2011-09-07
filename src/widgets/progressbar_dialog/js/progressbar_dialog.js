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
		
		dialogContainer: 0,
		progressBar_in_dialog : 0,
				
        _create: function () {
            var self = this,
	   		   	select = this.element;
	        	
	        dialogContainer = $.mobile.loadPrototype("progressbar_dialog").find("#progressbar-dialog")
	        		.insertBefore(select);
	                	
	        progressBar_in_dialog = dialogContainer.find("#progressbar-in-dialog");
	        progressBar_in_dialog.progressbar();
        },
        
        value: function( newValue ) {
			progressBar_in_dialog.progressbar('value', newValue);
		},
		
		getValue: function () {
			return progressBar_in_dialog.progressbar('getValue');
		},
		
    }); /* End of widget */

    //auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='progressbar_dialog')").progressbar_dialog();
    });

})(jQuery, this);