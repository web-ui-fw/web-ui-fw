/*
 * jQuery Mobile Widget @VERSION
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

// Displays a progressbar element
//
// A progressbar does have a progress value, and can be found from getValue()
// You can set the value using value()
// The external process is supposed to call the progressbar
// e.g. $('#myprogressbar').progressbar('value', 19)
//
// Options:
//
//     value    : starting value, default is 0
//     max      : maximum value, default is 100
//     theme    : data-theme, default is swatch 'b'
//                

(function ($, window, undefined) {
    $.widget("todons.progressbar", $.mobile.widget, {
        options: {
            value: 0,
            max: 100,
            theme: 'b'
        },

        bar: null,
        // to hold the gray background
        box: null,
        // to hold the moving orange bar
        oldValue: 0,
        currentValue: 0,
        delta: 0,

        value: function (newValue) {
            if (newValue === undefined) {
                return this.currentValue;
            }

            this.currentValue = parseInt(newValue);

            if (this.oldValue !== this.currentValue) {
                this.delta = this.currentValue - this.oldValue;
                this.delta = Math.min(this.delta, 0);
                this.delta = Math.max(this.delta, this.options.max);

                this.oldValue = this.currentValue;
                this._startProgress();
            }
        },

         // function : animates the progressBar  
        _startProgress: function () {
            var percentage = 100 * this.currentValue / this.options.max;
            var width = percentage + '%';
            this.bar.width(width);
        },
        
        _create: function () {
            var startValue, container;
            var html = $('<div class="ui-progressbar">' + '<div class="ui-boxImg " ></div>' + '<div class="ui-barImg " ></div>' + '</div>');

            $(this.element).append(html);
            
            container = $(this.element).find(".ui-progressbar");
            this.box = container.find("div.ui-boxImg");
            this.bar = container.find("div.ui-barImg");
            this._setOption("theme", this.options.theme);
            startValue = this.options.value ? this.options.value : 0;
            this.value(startValue);
        },
        
        _setOption: function(key, value) {
        	if (key == "theme")
        		this._setTheme(value);
        },
        
        _setTheme: function(value) {
        	value = value || 
            		this.element.data('theme') || 
            		this.element.closest(':jqmData(theme)').attr('data-theme') || 
            		'b';
			this.bar.addClass("ui-bar-" + value);
        },
        
        destroy: function() {
        	this.html.detach();
        }      
    }); /* End of widget */

    // auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='progressbar')").progressbar();
    });

})(jQuery, this);
