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

$.widget( "tizen.popupwindow", $.tizen.widgetex, {
    options: {
        theme: null,
        overlayTheme: null,
        shadow: true,
        corners: true,
        fade: true,
        transition: $.mobile.defaultDialogTransition,
        initSelector: ":jqmData(role='popupwindow')"
    },

    _htmlProto: {
        ui: {
            screen:    "#popupwindow-screen",
            container: "#popupwindow-container"
        }
    },

    _create: function() {
        var thisPage = this.element.closest(":jqmData(role='page')"),
            self = this;

        if (thisPage.length === 0)
            thisPage = $("body");

        // Drop a placeholder into the location from which we shall rip out the popup window contents
        this._ui.placeholder = 
            $("<div><!-- placeholder" + 
                    (this.element.attr("id") === undefined 
                        ? "" 
                        : " for " + this.element.attr("id")) + " --></div>")
                .css("display", "none")
                .insertBefore(this.element);

        // Apply the proto
        thisPage.append(this._ui.screen);
        this._ui.container.insertAfter(this._ui.screen);
        this._ui.container.append(this.element);

        // Define instance variables
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
            currentTheme = null,
            matches;

        while (classes.length > 0) {
            currentTheme = classes.pop();
            matches = currentTheme.match(/^ui-body-([a-z])$/);
            if (matches && matches.length > 1) {
                currentTheme = matches[1];
                break;
            }
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
        // The screen must always have some kind of background for fade to work, so, if the theme is being unset,
        // set the background to "a".
        this._realSetTheme(this._ui.screen, (value === "" ? "a" : value));
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

    _setDisabled: function(value) {
        $.Widget.prototype._setOption.call(this, "disabled", value);
        if (value)
            this.close();
    },

    _placementCoords: function(x, y, cx, cy) {
        // Try and center the overlay over the given coordinates
        var ret,
            scrollTop = $(window).scrollTop(),
            screenHeight = $(window).height(),
            screenWidth = $(window).width(),
            halfheight = cy / 2,
            maxwidth = parseFloat( this._ui.container.css( "max-width" ) ),
            roomtop = y - scrollTop,
            roombot = scrollTop + screenHeight - y,
            newtop, newleft;

        if ( roomtop > cy / 2 && roombot > cy / 2 ) {
            newtop = y - halfheight;
        }
        else {
            // 30px tolerance off the edges
            newtop = roomtop > roombot ? scrollTop + screenHeight - cy - 30 : scrollTop + 30;
        }

        // If the menuwidth is smaller than the screen center is
        if ( cx < maxwidth ) {
            newleft = ( screenWidth - cx ) / 2;
        }
        else {
            //otherwise insure a >= 30px offset from the left
            newleft = x - cx / 2;

            // 10px tolerance off the edges
            if ( newleft < 10 ) {
                newleft = 10;
            }
            else
            if ( ( newleft + cx ) > screenWidth ) {
                newleft = screenWidth - cx - 10;
            }
        }

        return { x : newleft, y : newtop };
    },

    destroy: function() {
        // Put the element back where we ripped it out from
        this.element.insertBefore(this._ui.placeholder);

        // Clean up
        this._ui.placeholder.remove();
        this._ui.container.remove();
        this._ui.screen.remove();
        this.element.triggerHandler("destroyed");
        $.Widget.prototype.destroy.call(this);
    },

    open: function(x_where, y_where) {
        if (!(this._isOpen || this.options.disabled)) {
            var self = this,
                x = (undefined === x_where ? window.innerWidth  / 2 : x_where),
                y = (undefined === y_where ? window.innerHeight / 2 : y_where),
                coords,
                zIndexMax = 0;

            // If the width of the popup exceeds the width of the window, we need to limit the width here,
            // otherwise outer{Width,Height}(true) below will happily report the unrestricted values, causing
            // the popup to get placed wrong.
            if (this._ui.container.outerWidth(true) > $(window).width())
                this._ui.container.css({"max-width" : $(window).width() - 30});

            coords = this._placementCoords(x, y,
                this._ui.container.outerWidth(true),
                this._ui.container.outerHeight(true));

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

            this._ui.screen
                .height($(document).height())
                .removeClass("ui-screen-hidden");

            if (this.options.fade)
                this._ui.screen.animate({opacity: 0.5}, "fast");
            else
                this._ui.screen.css({opacity: 0.0});

            this._ui.container
                .removeClass("ui-selectmenu-hidden")
                .css({
                    left: coords.x,
                    top: coords.y
                })
                .addClass("in")
                .animationComplete(function() {
                    self._ui.screen.height($(document).height());
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

            this._ui.container
                .removeClass("in")
                .addClass("reverse out")
                .animationComplete(function() {
                    self._ui.container
                        .removeClass("reverse out")
                        .addClass("ui-selectmenu-hidden")
                        .removeAttr("style");
                });

            if (this.options.fade)
                this._ui.screen.animate({opacity: 0.0}, "fast", hideScreen);
            else
                hideScreen();
        }
    }
});

$.tizen.popupwindow.bindPopupToButton = function(btn, popup) {
    if (btn.length === 0 || popup.length === 0) return;

    var btnVClickHandler = function(e) {
            // When /this/ button causes a popup, align the popup's theme with that of the button, unless the popup has a theme pre-set
            if (!popup.jqmData("overlay-theme-set"))
                popup.popupwindow("option", "overlayTheme", btn.jqmData("theme"));
            popup.popupwindow("open",
                btn.offset().left + btn.outerWidth()  / 2,
                btn.offset().top  + btn.outerHeight() / 2);

            // Swallow event, because it might end up getting picked up by the popup window's screen handler, which
            // will in turn cause the popup window to close - Thanks Sasha!
            if (e.stopPropagation)
                e.stopPropagation();
            if (e.preventDefault)
                e.preventDefault();
        };

    // If the popup has a theme set, prevent it from being clobbered by the associated button
    if ((popup.popupwindow("option", "overlayTheme") || "").match(/[a-z]/))
        popup.jqmData("overlay-theme-set", true);

    btn
        .attr({
            "aria-haspopup": true,
            "aria-owns": btn.attr("href")
        })
        .removeAttr("href")
        .bind("vclick", btnVClickHandler);

    popup.bind("destroyed", function() {
        btn.unbind("vclick", btnVClickHandler);
    });
};

$(document).bind("pagecreate create", function(e) {
    $($.tizen.popupwindow.prototype.options.initSelector, e.target)
        .not(":jqmData(role='none'), :jqmData(role='nojs')")
        .popupwindow();

    $("a[href^='#']:jqmData(rel='popupwindow')", e.target).each(function() {
        $.tizen.popupwindow.bindPopupToButton($(this), $($(this).attr("href")));
    });
});

})(jQuery);
