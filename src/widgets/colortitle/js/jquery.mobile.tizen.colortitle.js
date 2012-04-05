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
 * Authors: Gabriel Schulhof <gabriel.schulhof@intel.com>
 */

// Displays the color in text of the form '#RRGGBB' where
// RR, GG, and BB are in hexadecimal.
//
// Apply a colortitle by adding the attribute data-role="colortitle"
// to a <div> element inside a page. Alternatively, call colortitle() 
// on an element (see below).
//
// Options:
//
//     color: String; the initial color can be specified in html using
//            the data-color="#ff00ff" attribute or when constructed
//            in javascipt eg
//                $("#mycolortitle").colortitle({ color: "#ff00ff" });
//            where the html might be :
//                <div id="mycolortitle"></div>
//            The color can be changed post-construction :
//                $("#mycolortitle").colortitle("option", "color", "#ABCDEF");
//            Default: "#1a8039".

(function( $, undefined ) {

$.widget( "tizen.colortitle", $.tizen.colorwidget, {
    options: {
        initSelector: ":jqmData(role='colortitle')"
    },

    _htmlProto: {
        ui: {
            clrtitle: "#colortitle",
            header:   "#colortitle-string"
        }
    },

    _create: function() {
        this.element
            .css("display", "none")
            .after(this._ui.clrtitle);

    },

    widget: function() { return this._ui.clrtitle; },

    _setDisabled: function(value) {
        $.tizen.widgetex.prototype._setDisabled.call(this, value);
        this._ui.clrtitle[value ? "addClass" : "removeClass"]("ui-disabled");
        $.tizen.colorwidget.prototype._displayDisabledState.call(this, this._ui.header);
    },

    _setColor: function(clr) {
        if ($.tizen.colorwidget.prototype._setColor.call(this, clr)) {
            this._ui.header
                .text(this.options.color);
            $.tizen.colorwidget.prototype._setElementColor.call(this, this._ui.header,
                $.tizen.colorwidget.clrlib.RGBToHSL($.tizen.colorwidget.clrlib.HTMLToRGB(clr)), "color");
				}
    }
});

$(document).bind("pagecreate create", function(e) {
    $($.tizen.colortitle.prototype.options.initSelector, e.target)
        .not(":jqmData(role='none'), :jqmData(role='nojs')")
        .colortitle();
});

})(jQuery);
