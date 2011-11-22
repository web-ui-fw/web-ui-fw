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
 * Authors: Gabriel Schulhof
 */

// Displays a 2D hue/saturation spectrum and a lightness slider.
//
// To apply, add the attribute data-role="colorpicker" to a <div>
// element inside a page. Alternatively, call colorpicker() 
// on an element (see below).
//
// Options:
//     color: String; can be specified in html using the
//            data-color="#ff00ff" attribute or when constructed
//                $("#mycolorpicker").colorpicker({ color: "#ff00ff" });
//            where the html might be :
//                <div id="mycolorpicker"/>

(function( $, undefined ) {

$.widget( "todons.colorpicker", $.todons.colorwidget, {
    options: {
        initSelector: ":jqmData(role='colorpicker')"
    },

    _htmlProto: {
        ui: {
            clrpicker: "#colorpicker",
            hs: {
                eventSource: "[data-event-source='hs']",
                valMask:   "#colorpicker-hs-val-mask",
                selector:  "#colorpicker-hs-selector"
            },
            l: {
                eventSource: "[data-event-source='l']",
                selector:  "#colorpicker-l-selector"
            }
        }
    },

    _create: function() {
        var self = this,
            stopDragging = function(event) {
              self.dragging = false;
              event.stopPropagation();
              event.preventDefault();
            };

        this.element.append(this._ui.clrpicker);

        $.extend( self, {
            dragging: false,
            draggingHS: false,
            selectorDraggingOffset: {
                x : -1,
                y : -1
            },
            dragging_hsl: undefined
        });

        $.todons.colorwidget.prototype._create.call(this);

        $( document )
            .bind( "vmousemove", function( event ) {
                if ( self.dragging ) {
                    event.stopPropagation();
                    event.preventDefault();
                }
            })
            .bind( "vmouseup", function( event ) {
                if ( self.dragging )
                    self.dragging = false;
            });

        this._ui.hs.eventSource
            .bind( "vmousedown mousedown", function (event) { self._handleMouseDown(event, "hs", false); })
            .bind( "vmousemove"          , function (event) { self._handleMouseMove(event, "hs", false); })
            .bind( "vmouseup"            , stopDragging);

        this._ui.l.eventSource
            .bind( "vmousedown mousedown", function (event) { self._handleMouseDown(event, "l",  false); })
            .bind( "vmousemove"          , function (event) { self._handleMouseMove(event, "l",  false); })
            .bind( "vmouseup"            , stopDragging);

        this._ui.hs.selector
            .bind( "vmousedown mousedown", function (event) { self._handleMouseDown(event, "hs", true); })
            .bind( "touchmove vmousemove", function (event) { self._handleMouseMove(event, "hs", true); })
            .bind( "vmouseup"            , stopDragging);

        this._ui.l.selector
            .bind( "vmousedown mousedown", function (event) { self._handleMouseDown(event, "l",  true); })
            .bind( "touchmove vmousemove", function (event) { self._handleMouseMove(event, "l",  true); })
            .bind( "vmouseup"            , stopDragging);
    },

    _handleMouseDown: function(event, containerStr, isSelector) {
        var coords = $.mobile.todons.targetRelativeCoordsFromEvent(event),
            widgetStr = isSelector ? "selector" : "eventSource";
        if ((coords.x >= 0 && coords.x <= this._ui[containerStr][widgetStr].width() &&
             coords.y >= 0 && coords.y <= this._ui[containerStr][widgetStr].height()) || isSelector) {
            this.dragging = true;
            this.draggingHS = ("hs" === containerStr);

            if (isSelector) {
                this.selectorDraggingOffset.x = coords.x;
                this.selectorDraggingOffset.y = coords.y;
            }

            this._handleMouseMove(event, containerStr, isSelector, coords);
        }
    },

    _handleMouseMove: function(event, containerStr, isSelector, coords) {
        if (this.dragging) {
            if (coords === undefined)
                var coords = $.mobile.todons.targetRelativeCoordsFromEvent(event);
            if (this.draggingHS) {
                var potential_h = isSelector
                      ? this.dragging_hsl[0] / 360 + (coords.x - this.selectorDraggingOffset.x) / this._ui[containerStr].eventSource.width()
                      : coords.x / this._ui[containerStr].eventSource.width(),
                    potential_s = isSelector
                      ? this.dragging_hsl[1]       + (coords.y - this.selectorDraggingOffset.y) / this._ui[containerStr].eventSource.height()
                      : coords.y / this._ui[containerStr].eventSource.height();

                this.dragging_hsl[0] = Math.min(1.0, Math.max(0.0, potential_h)) * 360;
                this.dragging_hsl[1] = Math.min(1.0, Math.max(0.0, potential_s));
            }
            else {
                var potential_l = isSelector
                      ? this.dragging_hsl[2]       + (coords.y - this.selectorDraggingOffset.y) / this._ui[containerStr].eventSource.height()
                      : coords.y / this._ui[containerStr].eventSource.height();

                this.dragging_hsl[2] = Math.min(1.0, Math.max(0.0, potential_l));
            }

            if (!isSelector) {
                this.selectorDraggingOffset.x = Math.ceil(this._ui[containerStr].selector.outerWidth()  / 2.0);
                this.selectorDraggingOffset.y = Math.ceil(this._ui[containerStr].selector.outerHeight() / 2.0);
            }

            this._updateSelectors(this.dragging_hsl);
            event.stopPropagation();
            event.preventDefault();
        }
    },

    _updateSelectors: function(hsl) {
        var clr = $.mobile.todons.clrlib.RGBToHTML($.mobile.todons.clrlib.HSLToRGB([hsl[0], 1.0 - hsl[1], hsl[2]])),
            gray = $.mobile.todons.clrlib.RGBToHTML([hsl[2], hsl[2], hsl[2]]);

        if (hsl[2] < 0.5) {
            this._ui.hs.valMask.css("background", "#000000");
            this._ui.hs.valMask.css("opacity", 1.0 - hsl[2] * 2.0);
        }
        else {
            this._ui.hs.valMask.css("background", "#ffffff");
            this._ui.hs.valMask.css("opacity", (hsl[2] - 0.5) * 2.0);
        }

        this._ui.hs.selector.css("left", hsl[0] / 360 * this._ui.hs.eventSource.width());
        this._ui.hs.selector.css("top",  hsl[1] * this._ui.hs.eventSource.height());
        this._ui.hs.selector.css("background", clr);

        this._ui.l.selector.css("top",   hsl[2] * this._ui.l.eventSource.height());
        this._ui.l.selector.css("background",  gray);

        $.todons.colorwidget.prototype._setColor.call(this, clr);
    },

    _setColor: function(clr, unconditional) {
        if ($.todons.colorwidget.prototype._setColor.call(this, clr, unconditional)) {
            this.dragging_hsl = $.mobile.todons.clrlib.RGBToHSL($.mobile.todons.clrlib.HTMLToRGB(clr));
            this.dragging_hsl[1] = 1.0 - this.dragging_hsl[1];
            this._updateSelectors(this.dragging_hsl);
        }
    }
});

$(document).bind("pagecreate create", function(e) {
    $($.todons.colorpicker.prototype.options.initSelector, e.target)
        .not(":jqmData(role='none'), :jqmData(role='nojs')")
        .colorpicker();
});

})(jQuery);
