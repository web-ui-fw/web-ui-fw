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

        // Returns:
        // {
        //    absDiff: int
        //    triangleOffset: int
        //    actual: { x: int, y: int }
        // }
        function getCoords(arrow, x_factor, y_factor) {
            // Unhide the arrow we want to test to take it into account
            ctxpopup._ui.arrow.all.hide();
            ctxpopup._ui.arrow[arrow].show();

            var isHorizontal = ("b" === arrow || "t" === arrow),
                // Names of keys used in calculations depend on whether things are horizontal or not
                coord = (isHorizontal
                    ? {point: "x", size: "cx", beg: "left", outerSize: "outerWidth",  niceSize: "width",  triangleSize : "height"}
                    : {point: "y", size: "cy", beg: "top",  outerSize: "outerHeight", niceSize: "height", triangleSize : "width"}),
                size = {
                    cx : self._ui.container.width(),
                    cy : self._ui.container.height()
                },
                halfSize = {
                    cx : size.cx / 2,
                    cy : size.cy / 2
                },
                desired = { 
                    "x" : x + halfSize.cx * x_factor,
                    "y" : y + halfSize.cy * y_factor
                },
                orig = orig_placementCoords.call(self, desired.x, desired.y, size.cx, size.cy),

                // The triangleOffset must be clamped to the range described below:
                //
                //                          +-------...
                //                          |   /\
                //                          |  /  \
                //                   ----+--+-,-----...
                //lowerDiff       -->____|  |/ <-- possible rounded corner
                //triangle size   -->    | /|
                //                   ____|/ |
                //                    ^  |\ | <-- lowest possible offset for triangle
                // actual range of    |  | \| 
                // arrow offset       |  |  | 
                // values due to      |  .  . Payload table cell looks like
                // possible rounded   |  .  . a popup window, and it may have
                // corners and arrow  |  .  . arbitrary things like borders,
                // triangle size -    |  |  | shadows, and rounded corners.
                // our clamp range    |  | /|
                //                   _v__|/ |
                //triangle size   -->    |\ | <-- highest possible offset for triangle
                //                   ____| \|
                //upperDiff       -->    |  |\ <-- possible rounded corner
                //                   ----+--+-'-----...
                //                          |  \  /
                //                          |   \/
                //                          +-------...
                //
                // We calculate lowerDiff and upperDiff by considering the offset and width of the payload (this.element)
                // versus the offset and width of the element enclosing the triangle, because the payload is inside
                // whatever decorations (such as borders, shadow, rounded corners) and thus can give a reliable indication
                // of the thickness of the combined decorations

                arrowBeg = ctxpopup._ui.arrow[arrow].offset()[coord.beg],
                arrowSize = ctxpopup._ui.arrow[arrow][coord.outerSize](true),
                payloadBeg = self.element.offset()[coord.beg],
                payloadSize = self.element[coord.outerSize](true),
                triangleSize = ctxpopup._ui.arrow[arrow][coord.triangleSize](),
                triangleOffset = 
                    Math.max(
                        triangleSize // triangle size
                            + Math.max(0, payloadBeg - arrowBeg), // lowerDiff
                        Math.min(
                            arrowSize // bottom
                                - triangleSize // triangle size
                                - Math.max(0, arrowBeg + arrowSize - (payloadBeg + payloadSize)), // upperDiff
                            arrowSize / 2 // arrow unrestricted offset
                                + desired[coord.point]
                                - orig[coord.point]
                                - halfSize[coord.size])),
                // Triangle points here
                final = {
                    "x": orig.x + ( isHorizontal ? triangleOffset : 0) + ("r" === arrow ? size.cx : 0),
                    "y": orig.y + (!isHorizontal ? triangleOffset : 0) + ("b" === arrow ? size.cy : 0)
                },
                ret = {
                    actual         : orig,
                    triangleOffset : triangleOffset,
                    absDiff        : Math.abs(x - final.x) + Math.abs(y - final.y)
                };

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
        ctxpopup._ui.arrow[minDiffIdx]
            .show()
            .triangle("option", "offset", coords[minDiffIdx].triangleOffset);
        return coords[minDiffIdx].actual;
    }
    else
        return orig_placementCoords.call(this, x, y, cx, cy);
};

$.todons.popupwindow.prototype.open = function(x, y) {
    var ctxpopup = this.element.data("ctxpopup");

    if (ctxpopup) {
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
