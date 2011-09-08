/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Rijubrata Bhaumik <rijubrata.bhaumik@intel.com>
 */
/**
 * Displays a progressbar element in a dialog
 * For details refer to progressbar
 * The external process is supposed to call the progressbar_dialog 
 * e.g. $('#myprogressbar_dialog').progressbar_dialog('value', someValue);
 *
 * Options:
 *
 *     value	: starting value, default is 0
 *	   max		: maximum value, default is 100		
 *     duration : Integer; number of milli seconds the progressbar takes to animate
 *				 from 0 to max. 
 *
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
	        	
	        dialogContainer = $.mobile.loadPrototype("progressbar_dialog").find("div.ui-progressbar-dialog")
	        		.insertBefore(select);
	                	
	        progressBar_in_dialog = dialogContainer.find("div.ui-progressbar_dialog");
	        progressBar_in_dialog.progressbar();
	        
	        
        },
        
        value: function( newValue ) {
			progressBar_in_dialog.progressbar('value', newValue);
		},
		
		getValue: function () {
			return progressBar_in_dialog.progressbar('value');
		},
		
    }); /* End of widget */

    //auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='progressbar_dialog')").progressbar_dialog();
    });

})(jQuery, this);