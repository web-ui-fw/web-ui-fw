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

// This widget is implemented in an extremely ugly way. It should derive from $.todons.popupwindow, but it doesn't
// because there's a bug in jquery.ui.widget.js which was fixed in jquery-ui commit
// b9153258b0f0edbff49496ed16d2aa93bec07d95. Once a version of jquery-ui containing that commit is released
// (probably >= 1.9m5), and jQuery Mobile picks up the widget from there, this widget needs to be rewritten properly.
// The problem is that, when a widget inherits from a superclass and declares an object in its prototype identical in key
// to one in the superclass, upon calling $.widget the object is overwritten in both the prototype of the superclass and
// the prototype of the subclass. The prototype of the superclass should remain unchanged.

(function($, undefined) {
    $.widget("todons.ctxpopup", $.todons.widgetex, {
        options: $.extend({}, $.todons.popupwindow.prototype.options, {
            initSelector: ":not(:not(" + $.todons.popupwindow.prototype.options.initSelector + ")):not(:not(:jqmData(show-arrow='true'), :jqmData(show-arrow)))"
        }),

        _htmlProto: {
            ui: {
                outer     : "#outer",
                container : "#container", // the key has to have the name "container"
                arrow     : {
                    all : ":jqmData(role='triangle')",
                    l   : "#left",
                    t   : "#top",
                    r   : "#right",
                    b   : "#bottom"
                }
            }
        },

        _create: function(){
            if (!this.element.data("popupwindow"))
                this.element.popupwindow();
            this.element.data("popupwindow")
                    ._ui.container
                        .removeClass("ui-popupwindow-padding")
                        .append(this._ui.outer);
            this._ui.outer.trigger("create"); // Creates the triangle widgets
            this._ui.container
                .addClass("ui-popupwindow-padding")
                .append(this.element);
        },

        _setOption: function(key, value) {
            $.todons.popupwindow.prototype._setOption.apply(this.element.data("popupwindow"), arguments);
            this.options[key] = value;
        },
    });

var origOpen = $.todons.popupwindow.prototype.open,
    orig_setOption = $.todons.popupwindow.prototype._setOption,
    orig_placementCoords = $.todons.popupwindow.prototype._placementCoords;

$.todons.popupwindow.prototype._setOption = function(key, value) {
    var ctxpopup = this.element.data("ctxpopup"),
        needsApplying = true;
    if (ctxpopup) {
        if ("shadow" === key || "overlayTheme" === key || "corners" === key) {
            var origContainer = this._ui.container;

            this._ui.container = ctxpopup._ui.container;
            orig_setOption.apply(this, arguments);
            this._ui.container = origContainer;
            needsApplying = false;
        }
        ctxpopup.options[key] = value;
    }

    if (needsApplying)
        orig_setOption.apply(this, arguments);
};

$.todons.popupwindow.prototype._placementCoords = function(x, y, cx, cy) {
    var ctxpopup = this.element.data("ctxpopup"),
        self = this;

    if (ctxpopup) {
        var coords = {}, minDiff, minDiffIdx;

        function getCoords(arrow, x_factor, y_factor) {
            var ret = {}, halfSize;

            // Unhide the arrow we want to test to take it into account
            ctxpopup._ui.arrow.all.hide();
            ctxpopup._ui.arrow[arrow].show();

            halfSize = {
                cx: self._ui.container.width()  / 2,
                cy: self._ui.container.height() / 2
            };

            ret.desired = { 
                "x" : x + halfSize.cx * x_factor,
                "y" : y + halfSize.cy * y_factor
            };

            ret.actual = orig_placementCoords.call(self, ret.desired.x, ret.desired.y,
                self._ui.container.width(), self._ui.container.height());

            ret.diff = {
                x: ret.desired.x - (ret.actual.x + halfSize.cx),
                y: ret.desired.y - (ret.actual.y + halfSize.cy)
            };

            ret.absDiff = Math.abs(ret.diff.x) +
                          Math.abs(ret.diff.y);

            // Hide it back
            ctxpopup._ui.arrow[arrow].hide();

            return ret;
        }

        coords = {
            l : getCoords("l",  1,  0),
            r : getCoords("r", -1,  0),
            t : getCoords("t",  0,  1),
            b : getCoords("b",  0, -1)
        };

        $.each(coords, function(key, value) {
            if (minDiff === undefined || value.absDiff < minDiff) {
                minDiff = value.absDiff;
                minDiffIdx = key;
            }
        });

        // Side-effect: show the appropriate arrow and move it to the right offset
        ctxpopup._ui.arrow[minDiffIdx].show();

        var offset = ctxpopup._ui.arrow[minDiffIdx][("b" === minDiffIdx || "t" === minDiffIdx) ? "width" : "height"]() / 2;

        console.log(offset);

        offset += coords[minDiffIdx].diff[("b" === minDiffIdx || "t" === minDiffIdx) ? "x" : "y"];

        console.log(offset);

        ctxpopup._ui.arrow[minDiffIdx].triangle("option", "offset", offset);
        return coords[minDiffIdx].actual;
    }
    else
        return orig_placementCoords.call(this, x, y, cx, cy);
};

$.todons.popupwindow.prototype.open = function(x, y) {
    var ctxpopup = this.element.data("ctxpopup"),
        self = this;
    if (ctxpopup) {
        var coords = {};

        function getCoords(arrows, x_factor, y_factor) {
            var ret = {};

            // Unhide the arrow we want to test to take it into account
            ctxpopup._ui.arrow[arrows[0]].hide();
            ctxpopup._ui.arrow[arrows[1]].hide();
            ctxpopup._ui.arrow[arrows[2]].hide();
            ctxpopup._ui.arrow[arrows[3]].show();

            ret.desired = { 
                "x" : x + (self._ui.container.width()  / 2) * x_factor,
                "y" : y + (self._ui.container.height() / 2) * y_factor
            };

            ret.actual = self._placementCoords(ret.desired.x, ret.desired.y,
                self._ui.container.width(), self._ui.container.height());
            ret.actual = {
                "x" : ret.actual.x + self._ui.container.width()  / 2,
                "y" : ret.actual.y + self._ui.container.height() / 2
            }

            // Hide it back
            ctxpopup._ui.arrow[arrows[3]].hide();

            return ret;
        }

        this._setShadow(false);
        this._setCorners(false);
        this._setOverlayTheme(null);
        this._setOption("overlayTheme", ctxpopup.options.overlayTheme);
        ctxpopup._ui.arrow.all.triangle("option", "color", ctxpopup._ui.container.css("background-color"));
    }

    origOpen.call(this, x, y);
};

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
    var ctxpopups = $($.todons.ctxpopup.prototype.options.initSelector, e.target);
    $.todons.ctxpopup.prototype.enhanceWithin( e.target );

});

})(jQuery);
