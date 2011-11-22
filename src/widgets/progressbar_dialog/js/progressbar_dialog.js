/*
 * jQuery Mobile Widget @VERSION
 *
 *
 * This software is licensed under the MIT licence (as defined by the OSI at
 * http://www.opensource.org/licenses/mit-license.php)
 * 
 * ***************************************************************************
 * Copyright (C) 2011 by Intel Corporation Ltd.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 *
 * Authors: Rijubrata Bhaumik <rijubrata.bhaumik@intel.com>
 */

// Displays a progressbar element in a dialog
// For details refer to progressbar
// The external process is supposed to call the progressbar_dialog 
// e.g. $('#myprogressbar_dialog').progressbar_dialog('value', someValue);
//
// Options:
//
//     value	: starting value, default is 0
//	   max		: maximum value, default is 100		
//     duration : Integer; number of milli seconds the progressbar takes to animate
//				 from 0 to max. 

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
