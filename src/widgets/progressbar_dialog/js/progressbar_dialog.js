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
    $.widget("todons.progressbar_dialog", $.todons.widgetex, {
        options: {
            value: 0,
            max: 100,
            duration: 10000,
        },

        _htmlProto: {
            ui: {
                dialogContainer:       "div.ui-progressbar-dialog", // Note: dash vs. underscore!
                progressBar_in_dialog: "div.ui-progressbar_dialog"
            }
        },
				
        _create: function () {
	    this._ui.dialogContainer.insertBefore(this.element);
	    this._ui.progressBar_in_dialog.progressbar();
        },
        
        value: function( newValue ) {
	    this._ui.progressBar_in_dialog.progressbar('value', newValue);
        },
		
        getValue: function () {
	    return this._ui.progressBar_in_dialog.progressbar('value');
        },
		
    }); /* End of widget */

    //auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='progressbar_dialog')").progressbar_dialog();
    });

})(jQuery, this);
