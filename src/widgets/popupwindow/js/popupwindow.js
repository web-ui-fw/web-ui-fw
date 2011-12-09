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
 * Authors: Gabriel Schulhof <gabriel.schulhof@intel.com>,
 *          Elliot Smith <elliot.smith@intel.com>
 */

// Shows other elements inside a popup window.
//
// To apply, add the attribute data-role="popupwindow" to a <div> element inside
// a page. Alternatively, call popupwindow()
// on an element, eg :
//
//     $("#mypopupwindowContent").popupwindow();
// where the html might be :
//     <div id="mypopupwindowContent"></div>
//
// To trigger the popupwindow to appear, it is necessary to make a call to its
// 'open()' method. This is typically done by binding a function to an event
// emitted by an input element, such as a the clicked event emitted by a button
// element. The open() method takes two arguments, specifying the x and y
// screen coordinates of the center of the popup window.

// You can associate a button with a popup window like this:
//      <div id="mypopupContent" style="display: table;" data-role="popupwindow">
//          <table>
//              <tr> <td>Eenie</td>   <td>Meenie</td>  <td>Mynie</td>   <td>Mo</td>  </tr>
//              <tr> <td>Catch-a</td> <td>Tiger</td>   <td>By-the</td>  <td>Toe</td> </tr>
//              <tr> <td>If-he</td>   <td>Hollers</td> <td>Let-him</td> <td>Go</td>  </tr>
//              <tr> <td>Eenie</td>   <td>Meenie</td>  <td>Mynie</td>   <td>Mo</td>  </tr>
//          </table>
//      </div>
// <a href="#myPopupContent" data-rel="popupwindow" data-role="button">Show popup</a>
//
// Options:
//
//     theme: String; the theme for the popupwindow contents
//                   Default: null
//
//     overlayTheme: String; the theme for the popupwindow
//                   Default: null
//
//     shadow: Boolean; display a shadow around the popupwindow
//             Default: true
//
//     corners: Boolean; display a shadow around the popupwindow
//             Default: true
//
//     fade: Boolean; fades the opening and closing of the popupwindow
//
//     transition: String; the transition to use when opening or closing
//                 a popupwindow
//                 Default: $.mobile.defaultDialogTransition
//
// Events:
//     close: Emitted when the popupwindow is closed.

(function( $, undefined ) {

$.widget( "todons.popupwindow", $.todons.widgetex, {
    options: {
        theme: null,
        overlayTheme: null,
        shadow: true,
        corners: true,
        fade: true,
        transition: $.mobile.defaultDialogTransition,
        showArrow: false,
        initSelector: ":jqmData(role='popupwindow')"
    },

    _htmlProto: {
        ui: {
            screen:    "#popupwindow-screen",
            container: "#popupwindow-container",
            arrow:     "#popupwindow-arrow"
        }
    },

    _create: function() {
        var self = this,
            thisPage = this.element.closest(".ui-page");

        if (thisPage[0] === undefined)
            thisPage = $("body");

        thisPage.append(this._ui.screen);
        this._ui.container.insertAfter(this._ui.screen);
        this._ui.container.append(this.element);
        this._ui.arrow.remove();

        $.extend( self, {
            _isOpen: false
        });

        // Events on "screen" overlay
        this._ui.screen.bind( "vclick", function( event ) {
            self.close();
        });
    },

    _realSetTheme: function(dst, theme) {
        var classes = (dst.attr("class") || "").split(" "),
            alreadyAdded = true,
            currentTheme = null;

        while (classes.length > 0) {
            currentTheme = classes.pop();
            if (currentTheme.match(/^ui-body-[a-z]$/))
                break;
            else
                currentTheme = null;
        }

        dst.removeClass("ui-body-" + currentTheme);
        if ((theme || "").match(/[a-z]/))
            dst.addClass("ui-body-" + theme);
    },

    _setTheme: function(value) {
        this._realSetTheme(this.element, value);
        this.options.theme = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "theme", value);
    },

    _setOverlayTheme: function(value) {
        this._realSetTheme(this._ui.container, value);
        this.options.overlayTheme = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "overlay-theme", value);
    },

    _setShadow: function(value) {
        this.options.shadow = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "shadow", value);
        this._ui.container[value ? "addClass" : "removeClass"]("ui-overlay-shadow");
    },

    _setCorners: function(value) {
        this.options.corners = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "corners", value);
        this._ui.container[value ? "addClass" : "removeClass"]("ui-corner-all");
    },

    _setFade: function(value) {
        this.options.fade = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "fade", value);
    },

    _setTransition: function(value) {
        this._ui.container
                .removeClass((this.options.transition || ""))
                .addClass(value);
        this.options.transition = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "transition", value);
    },

    _setShowArrow: function(value) {
        this.options.showArrow = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "show-arrow", value);
    },

    _placementCoords: function(x, y) {
        // Try and center the overlay over the given coordinates
        var ret,
            menuHeight = this._ui.container.outerHeight(true),
            menuWidth = this._ui.container.outerWidth(true),
            scrollTop = $( window ).scrollTop(),
            screenHeight = window.innerHeight,
            screenWidth = window.innerWidth,
            halfheight = menuHeight / 2,
            maxwidth = parseFloat( this._ui.container.css( "max-width" ) ),
            calcCoords = function(coords) {
                var roomtop = coords.y - scrollTop,
                roombot = scrollTop + screenHeight - coords.y,
                newtop, newleft;

                if ( roomtop > menuHeight / 2 && roombot > menuHeight / 2 ) {
                    newtop = coords.y - halfheight;
                }
                else {
                    // 30px tolerance off the edges
                    newtop = roomtop > roombot ? scrollTop + screenHeight - menuHeight - 30 : scrollTop + 30;
                }

                // If the menuwidth is smaller than the screen center is
                if ( menuWidth < maxwidth ) {
                    newleft = ( screenWidth - menuWidth ) / 2;
                }
                else {
                    //otherwise insure a >= 30px offset from the left
                    newleft = coords.x - menuWidth / 2;

                    // 30px tolerance off the edges
                    if ( newleft < 30 ) {
                        newleft = 30;
                    }
                    else if ( ( newleft + menuWidth ) > screenWidth ) {
                        newleft = screenWidth - menuWidth - 30;
                    }
                }

                return { x : newleft, y : newtop };
            };

        if (this.options.showArrow) {
            this._ui.arrow.appendTo(this._ui.container);
            var possibleLocations = {}, coords, desired, minDiff, minDiffIdx,
                arrowHeight = this._ui.arrow.height();
            this._ui.arrow.remove();

            /* Check above */
            desired = {x : x, y : y - halfheight - arrowHeight};
            coords = calcCoords(desired);
            possibleLocations.above = {
                coords: coords,
                diff: {
                    x: Math.abs(desired.x - (coords.x + menuWidth / 2)),
                    y: Math.abs(desired.y - (coords.y + halfheight))
                }
            };
            minDiff = possibleLocations.above.diff;
            minDiffIdx = "above";

            /* Check below */
            desired = {x : x, y : y + halfheight + arrowHeight};
            coords = calcCoords(desired);
            possibleLocations.below = {
                coords: coords,
                diff: {
                    x: Math.abs(desired.x - (coords.x + menuWidth / 2)),
                    y: Math.abs(desired.y - (coords.y + halfheight))
                }
            };

            /*
             * Compute minimum deviation from desired distance.
             * Not sure if Euclidean distance is best here, especially since it is expensive to compute.
             */
            for (var Nix in possibleLocations) {
                if (possibleLocations[Nix].diff.x + possibleLocations[Nix].diff.y < minDiff.x + minDiff.y) {
                    minDiff = possibleLocations[Nix].diff;
                    minDiffIdx = Nix;
                }

                if (0 === minDiff.x + minDiff.y)
                    break;
            }

            ret = possibleLocations[minDiffIdx].coords;
            ret.arrowLocation = (("above" === minDiffIdx) ? "bottom" : "top");
        }
        else
            ret = calcCoords({x : x, y : y});

        return ret;
    },

    open: function(x_where, y_where) {
        if (!this._isOpen) {
            var self = this,
                x = (undefined === x_where ? window.innerWidth  / 2 : x_where),
                y = (undefined === y_where ? window.innerHeight / 2 : y_where),
                coords = this._placementCoords(x, y),
                zIndexMax = 0;

            $(document)
                .find("*")
                .each(function() {
                    var el = $(this),
                        zIndex = parseInt(el.css("z-index"));

                    if (!(el.is(self._ui.container) || el.is(self._ui.screen) || isNaN(zIndex)))
                        zIndexMax = Math.max(zIndexMax, zIndex);
                });

            this._ui.screen.css("z-index", zIndexMax + 1);
            this._ui.container.css("z-index", zIndexMax * 10);

            if (this.options.showArrow)
                this._ui.currentArrow = this._ui.arrow
                    .clone()
                    .addClass("ui-popupwindow-arrow-" + coords.arrowLocation)
                    [(("bottom" === coords.arrowLocation) ? "appendTo" : "prependTo")](this._ui.container)
                    .triangle({
                        location: coords.arrowLocation, offset: "50%",
                        color: this._ui.container.css("background-color")
                    });

            this._ui.screen
                .height($(document).height())
                .removeClass("ui-screen-hidden");

            if (this.options.fade)
                this._ui.screen.animate({opacity: 0.5}, "fast");
            else
                this._ui.screen.css({opacity: 0.0});

            var origOverflow = { x: $("body").css("overflow-x"), y: $("body").css("overflow-y") };
            $("body").css({"overflow-x" : "hidden", "overflow-y" : "hidden" });
            this._ui.container
                .removeClass("ui-selectmenu-hidden")
                .css({
                    left: coords.x,
                    top: coords.y
                })
                .addClass("in")
                .animationComplete(function() {
                    self._ui.screen.height($(document).height());
                    $("body").css({"overflow-x" : origOverflow.x, "overflow-y" : origOverflow.y});
                });

            this._isOpen = true;
        }
    },

    close: function() {
        if (this._isOpen) {
            var self = this,
                hideScreen = function() {
                    self._ui.screen.addClass("ui-screen-hidden");
                    self._isOpen = false;
                    self.element.trigger("closed");
                };

            var origOverflow = { x: $("body").css("overflow-x"), y: $("body").css("overflow-y") };
            $("body").css({"overflow-x" : "hidden", "overflow-y" : "hidden" });
            this._ui.container
                .removeClass("in")
                .addClass("reverse out")
                .animationComplete(function() {
                    self._ui.container
                        .removeClass("reverse out")
                        .addClass("ui-selectmenu-hidden")
                        .removeAttr("style");
                    if (self._ui.currentArrow != undefined) {
                        self._ui.currentArrow.remove();
                        self._ui.currentArrow = undefined;
                    }
                    $("body").css({"overflow-x" : origOverflow.x, "overflow-y" : origOverflow.y});
                });

            if (this.options.fade)
                this._ui.screen.animate({opacity: 0.0}, "fast", hideScreen);
            else
                hideScreen();
        }
    }
});

$.todons.popupwindow.bindPopupToButton = function(btn, popup) {
    // If the popup has a theme set, prevent it from being clobbered by the associated button
    if ((popup.popupwindow("option", "overlayTheme") || "").match(/[a-z]/))
        popup.jqmData("overlay-theme-set", true);
    btn
        .attr({
            "aria-haspopup": true,
            "aria-owns": btn.attr("href")
        })
        .removeAttr("href")
        .bind("vclick", function() {
            // When /this/ button causes a popup, align the popup's theme with that of the button, unless the popup has a theme pre-set
            if (!popup.jqmData("overlay-theme-set"))
                popup.popupwindow("option", "overlayTheme", btn.jqmData("theme"));
            popup.popupwindow("open",
                btn.offset().left + btn.outerWidth()  / 2,
                btn.offset().top  + btn.outerHeight() / 2);
        });
};

$(document).bind("pagecreate create", function(e) {
    $($.todons.popupwindow.prototype.options.initSelector, e.target)
        .not(":jqmData(role='none'), :jqmData(role='nojs')")
        .popupwindow();

    $("a[href^='#']:jqmData(rel='popupwindow')", e.target).each(function() {
        $.todons.popupwindow.bindPopupToButton($(this), $($(this).attr("href")));
    });
});

})(jQuery);
