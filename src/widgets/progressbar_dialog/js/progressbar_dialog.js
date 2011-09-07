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
		progressBar_in_dialog : 0,
				
        _create: function () {
        	console.log("in _create in progressbar_dialog");
        	
        var self = this,
        	select = this.element,
        	o = this.options;
        	container = $.mobile.loadPrototype("progressbar_dialog").find("#progressbar-dialog")
        		.insertBefore(select);
        
        	
        progressBar_in_dialog = container.find("#progressbar-in-dialog");
        progressBar_in_dialog.progressbar();
        
        },
        
        value : function( newValue ) {
			console.log("progressBar_in_dialog-->" + progressBar_in_dialog);
        	progressBar_in_dialog.progressbar('value', newValue);
		},
    }); /* End of widget */

    //auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='progressbar_dialog')").progressbar_dialog();
    });

})(jQuery, this);