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

// Displays three sliders that allow the user to select the
// hue, saturation, and value for a color.
//
// To apply, add the attribute data-role="hsvpicker" to a <div>
// element inside a page. Alternatively, call hsvpicker() 
// on an element (see below).
//
// Options:
//
//     color: String; the initial color can be specified in html using the
//            data-color="#ff00ff" attribute or when constructed
//            in javascript, eg
//                $("#myhsvpicker").hsvpicker({ color: "#ff00ff" });
//            where the html might be :
//                <div id="myhsvpicker"></div>
//            The color can be changed post-construction like this :
//                $("#myhsvpicker").hsvpicker("option", "color", "#ABCDEF");
//            Default: "#1a8039"
//
// Events:
//
//     colorchanged: Fired when the color is changed.

(function( $, undefined ) {

$.widget( "todons.hsvpicker", $.todons.colorwidget, {
    options: {
        initSelector: ":jqmData(role='hsvpicker')"
    },

    _htmlProto: {
        ui: {
            container: "#hsvpicker",
            hue: {
                eventSource: "[data-event-source-hue]",
                selector:    "#hsvpicker-hue-selector",
                hue:         "#hsvpicker-hue-hue",
                valMask:     "#hsvpicker-hue-mask-val"
            },
            sat: {
                gradient:    "#hsvpicker-sat-gradient",
                eventSource: "[data-event-source-sat]",
                selector:    "#hsvpicker-sat-selector",
                hue:         "#hsvpicker-sat-hue",
                valMask:     "#hsvpicker-sat-mask-val"
            },
            val: {
                gradient:    "#hsvpicker-val-gradient",
                eventSource: "[data-event-source-val]",
                selector:    "#hsvpicker-val-selector",
                hue:         "#hsvpicker-val-hue"
            }
        }
    },

    _create: function() {
        var self = this;

        this.element
            .css("display", "none")
            .after(this._ui.container);

        this._ui.hue.hue.huegradient();

        $.extend(this, {
            dragging_hsv: [ 0, 0, 0],
            selectorDraggingOffset: {
                x : -1,
                y : -1
            },
            dragging: -1
        });

        this._ui.container.find(".hsvpicker-arrow-btn")
            .buttonMarkup()
            .bind("vclick", function(e) {
                var chan = $(this).attr("data-" + ($.mobile.ns || "") + "target"),
                    hsvIdx = ("hue" === chan) ? 0 :
                             ("sat" === chan) ? 1 : 2,
                    max = (0 == hsvIdx ? 360 : 1),
                    step = 0.05 * max;

                self.dragging_hsv[hsvIdx] = self.dragging_hsv[hsvIdx] + step * ("left" === $(this).attr("data-" + ($.mobile.ns || "") + "location") ? -1 : 1);
                self.dragging_hsv[hsvIdx] = Math.min(max, Math.max(0.0, self.dragging_hsv[hsvIdx]));
                self._updateSelectors(self.dragging_hsv, chan, hsvIdx);
            });

        $( document )
            .bind( "vmousemove", function( event ) {
                if ( self.dragging != -1 ) {
                    event.stopPropagation();
                    event.preventDefault();
                }
            })
            .bind( "vmouseup", function( event ) {
                self.dragging = -1;
            });

        this._bindElements("hue", 0);
        this._bindElements("sat", 1);
        this._bindElements("val", 2);
    },

    _bindElements: function(chan, idx) {
        var self = this;
        this._ui[chan].selector
            .bind("mousedown vmousedown", function(e) { self._handleMouseDown(chan, idx, e, true); })
            .bind("vmousemove touchmove", function(e) { self._handleMouseMove(chan, idx, e, true); })
            .bind("vmouseup",             function(e) { self.dragging = -1; });
        this._ui[chan].eventSource
            .bind("mousedown vmousedown", function(e) { self._handleMouseDown(chan, idx, e, false); })
            .bind("vmousemove touchmove", function(e) { self._handleMouseMove(chan, idx, e, false); })
            .bind("vmouseup",             function(e) { self.dragging = -1; });
    },

    _handleMouseDown: function(chan, idx, e, isSelector) {
        var coords = $.mobile.todons.targetRelativeCoordsFromEvent(e),
            widgetStr = (isSelector ? "selector" : "eventSource");

        if (coords.x >= 0 && coords.x <= this._ui[chan][widgetStr].outerWidth() &&
            coords.y >= 0 && coords.y <= this._ui[chan][widgetStr].outerHeight()) {

            this.dragging = idx;

            if (isSelector) {
                this.selectorDraggingOffset.x = coords.x;
                this.selectorDraggingOffset.y = coords.y;
            }

						// precompute this for the coming drag operation
						this._ui[chan].selector._halfOuterWidth  = this._ui[chan].selector.outerWidth()  / 2.0;
						this._ui[chan].selector._halfOuterHeight = this._ui[chan].selector.outerHeight() / 2.0;

            this._handleMouseMove(chan, idx, e, isSelector, coords);
        }
    },

    _handleMouseMove: function(chan, idx, e, isSelector, coords) {
        if (this.dragging === idx) {
            coords = (coords || $.mobile.todons.targetRelativeCoordsFromEvent(e));

            var factor = ((0 === idx) ? 360 : 1),
                potential = (isSelector
                  ? ((this.dragging_hsv[idx] / factor) +
                     ((coords.x - this.selectorDraggingOffset.x) / this._ui[chan].eventSource[0].clientWidth))
                  : (coords.x / this._ui[chan].eventSource[0].clientWidth));

            this.dragging_hsv[idx] = Math.min(1.0, Math.max(0.0, potential)) * factor;

            if (!isSelector) {
                this.selectorDraggingOffset.x = Math.ceil(this._ui[chan].selector._halfOuterWidth);
                this.selectorDraggingOffset.y = Math.ceil(this._ui[chan].selector._halfOuterHeight);
            }

            this._updateSelectors(this.dragging_hsv, chan, idx);
            e.stopPropagation();
            e.preventDefault();
        }
    },

    _updateSelectors: function(hsv, chan, idx) {
        var clrlib = $.todons.colorwidget.clrlib,
            clrwidget = $.todons.colorwidget.prototype,
             clr = clrlib.HSVToHSL(hsv),
            hclr = clrlib.HSVToHSL([hsv[0], 1.0, 1.0]),
            vclr = clrlib.HSVToHSL([hsv[0], hsv[1], 1.0]);

        if (chan) {
            this._ui[chan].selector[0].style.left = (this._ui[chan].eventSource[0].clientWidth * hsv[idx] / (0 === idx ? 360 : 1)) + "px";
        }
        else {
            this._ui.hue.selector.css({left : this._ui.hue.eventSource.width() * hsv[0] / 360});
            this._ui.sat.selector.css({ left : this._ui.sat.eventSource.width() * hsv[1]});
            this._ui.val.selector.css({ left : this._ui.val.eventSource.width() * hsv[2]});
        }

	      clrwidget._setElementColor.call(this, this._ui.hue.selector,  clr, "background");
        clrwidget._setElementColor.call(this, this._ui.sat.selector,  clr, "background");
        clrwidget._setElementColor.call(this, this._ui.sat.hue,      hclr, "background");
        clrwidget._setElementColor.call(this, this._ui.val.selector,  clr, "background");
        clrwidget._setElementColor.call(this, this._ui.val.hue,      vclr, "background");

        if ($.mobile.browser.ie)
            this._ui.hue.hue.find("*").css("opacity", hsv[1]);
        else
            this._ui.hue.hue.css("opacity", hsv[1]);
        this._ui.hue.valMask.css("opacity", 1.0 - hsv[2]);
        this._ui.sat.valMask.css("opacity", 1.0 - hsv[2]);

        clrwidget._setColor.call(this, clrlib.RGBToHTML(clrlib.HSLToRGB(clr)));
    },

    _setDisabled: function(value) {
        $.todons.widgetex.prototype._setDisabled.call(this, value);
        this._ui.container[value ? "addClass" : "removeClass"]("ui-disabled");
        this._ui.hue.hue.huegradient("option", "disabled", value);
        $.todons.colorwidget.prototype._displayDisabledState.call(this, this._ui.container);
    },

    _setColor: function(clr) {
        if ($.todons.colorwidget.prototype._setColor.call(this, clr)) {
            this.dragging_hsv = $.todons.colorwidget.clrlib.RGBToHSV($.todons.colorwidget.clrlib.HTMLToRGB(this.options.color));
            this._updateSelectors(this.dragging_hsv);
        }
    }
});

$(document).bind("pagecreate create", function(e) {
    $($.todons.hsvpicker.prototype.options.initSelector, e.target)
        .not(":jqmData(role='none'), :jqmData(role='nojs')")
        .hsvpicker();
});

})(jQuery);
