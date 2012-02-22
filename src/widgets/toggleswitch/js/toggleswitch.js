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

// Displays a simple two-state switch.
//
// To apply, add the attribute data-role="switch" to a <div>
// element inside a page. Alternatively, call switch()
// on an element, like this :
//
//     $("#myswitch").toggleswitch();
// where the html might be :
//     <div id="myswitch"></div>
//
// Options:
//     checked: Boolean; the state of the switch
//     Default: true (up)
//
// Events:
//     changed: Emitted when the switch is changed

(function($, undefined) {

$.widget("todons.toggleswitch", $.todons.widgetex, {
    options: {
        onText       : null,
        offText      : null,
        checked      : true,
        horizontal   : false,
        // button options
        theme        : null,
        shadow       : true,
        corners      : true,
        inline       : false,
        initSelector : ":jqmData(role='toggleswitch')"
    },

    _htmlProto: {
        ui: {
            outer     : "#outer",
            bg        : "#bgA",
            normalBG  : "#bgN",
            txtMovers : {
                normal : "#normal",
                active : "#active"
            },
            btn       : "#button",
            btnSpan   : "#btn-span",
            txt       : {
                normal : "[data-normal-text]",
                active : "[data-active-text]",
            },
            links     : "a"
        }
    },

    _value: {
        attr: "data-" + ($.mobile.ns || "") + "checked",
        signal: "changed"
    },

    _dst      : {
        vertical   : {
            btn    : {on  : {top :  "0%", bottom : "50%"},
                      off : {top : "50%", bottom :  "0%"}},
            bg     : {on  : {top :  "0%"},
                      off : {top : "50%"}},
            movers : {
                normal : {on  : {top    : "-50%"},
                          off : {top    :   "0%"}},
                active : {on  : {bottom :   "0%"},
                          off : {bottom : "-50%"}}
            }
        },

        horizontal : {
            btn    : {on  : {left  : "50%", right :  "0%"},
                      off : {left  :  "0%", right : "50%"}},
            bg     : {on  : {right :  "0%"},
                      off : {right : "50%"}},
            movers : {
                normal : {on  : {left : "100%", right : "-50%"},
                          off : {left :  "50%", right :   "0%"}},
                active : {on  : {left :   "0%", right :  "50%"},
                          off : {left : "-50%", right : "100%"}}
            }
        }
    },

    _create: function() {
        var self = this;

        this.element
            .addClass("ui-toggleswitch-hidden")
            .after(this._ui.outer);
        this._ui.links.buttonMarkup();

        // Group some UI elements for easier modification later
        this._ui.clearCss =
            this._ui.btn
                .add(this._ui.bg)
                .add(this._ui.txtMovers.normal)
                .add(this._ui.txtMovers.active);
        this._ui.themedElements = 
            this._ui.outer
                .add(this._ui.normalBG)
                .add(this._ui.links);
        this._ui.cornerElements = 
            this._ui.outer
                .add(this._ui.btn)
                .add(this._ui.bg)
                .add(this._ui.normalBG)
                .add(this._ui.links)
                .add(this._ui.links.find(".ui-btn-inner"));

        this._ui.txtMovers.normal
            .add(this._ui.txtMovers.active)
            .find("*")
            .css({"border-color": "transparent"});

/*
        // Crutches for IE: It does not seem to understand opacity specified in a class, nor that opacity of an element
        // affects all its children
        if ($.mobile.browser.ie) {
            // Remove this class, because it has no effect in IE :-S
            this._ui.outer.find("*").removeClass("toggleswitch-button-transparent");
            // After adding the button markup, make everything transparent
            this._ui.normalBackground.find("*").css("opacity", 0.0);
            this._ui.activeBackground.find("*").css("opacity", 0.0);
            this._ui.refButton.add(this._ui.refButton.find("*")).css("opacity", 0.0);
            this._ui.realButton.add(this._ui.realButton.find("*")).css("opacity", 0.0);
            // ... except the buttons that display the inital position of the switch
            this._ui.initButtons
                .add(this._ui.initButtons.find("*"))
                .add(this._ui.fButton.find("*"))
                .add(this._ui.fButton)
                .css("opacity", 1.0);
        }
*/
        $.extend(this, {
            _initial: true
        });

        this._ui.btn
            .add(this._ui.outer)
            .bind("vclick", function(e) {
                self._setChecked(!(self.options.checked));
                e.stopPropagation();
            });
    },
/*
    _makeTransparent: function(obj, b) {
        if ($.mobile.browser.ie)
            obj.add(obj.find("*")).css("opacity", b ? 0.0 : 1.0);
        else
            obj[b ? "addClass" : "removeClass"]("toggleswitch-button-transparent");
    },
*/
    _setDisabled: function(value) {
        $.todons.widgetex.prototype._setDisabled.call(this, value);
        this._ui.outer[value ? "addClass" : "removeClass"]("ui-disabled");
    },

    _updateBtnText: function() {
        var noText = (((this.options.offText || "") === "" &&
                       (this.options.onText  || "") === ""));
        //this._ui.btnSpan.html((noText ? "" : "&nbsp;"));
        this._ui.links[(noText ? "addClass" : "removeClass")]("ui-btn-icon-notext");
        this._ui.outer[(this.options.inline || noText) ? "addClass" : "removeClass"]("ui-btn-inline");
    },

    _setInline: function(value) {
        this.options.inline = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "inline", value);
        this._updateBtnText();
    },

    _setOnText: function(value) {
        this._ui.txt.active.text(value);
        this.options.onText = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "on-text", value);
        this._updateBtnText();
    },

    _setShadow: function(value) {
        this.options.shadow = value;
        this._ui.outer[value ? "addClass" : "removeClass"]("ui-shadow");
        this.element.attr("data-" + ($.mobile.ns || "") + "shadow", value);
    },

    _setCorners: function(value) {
        var method = (value ? "addClass" : "removeClass");

        this.options.corners = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "corners", value);
        this._ui.links.attr("data-" + ($.mobile.ns || "") + "corners", value)

        this._ui.cornerElements[method]("ui-btn-corner-all");
    },

    _setTheme: function(value) {
        value = ((null === value || "" === value || undefined === value) ? $.mobile.getInheritedTheme(this.element, "c") : value);
        this._ui.themedElements.each(function() {
            var el = $(this),
                classAttr = (el.attr("class") || "") ,
                Nix, result = "";

            if (classAttr !== "") {
                var classes = el.attr("class").split(" ");

                for (Nix = 0 ; Nix < classes.length ; Nix++)
                    if (classes[Nix].match(/ui-btn-up-[a-z]/))
                        result = result + " " + classes[Nix];
                el.removeClass(result);
            }
        });
        this._ui.themedElements.addClass("ui-btn-up-" + value);

        this.options.theme = value;
        this._ui.links.attr("data-" + ($.mobile.ns || "") + "theme", value);
        this.element.attr("data-" + ($.mobile.ns || "") + "theme", value);
    },

    _setOffText: function(value) {
        this._ui.txt.normal.text(value);
        this.options.offText = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "off-text", value);
        this._updateBtnText();
    },

    _setHorizontal: function(value) {
        this._ui.outer
            .removeClass("toggleswitch-h toggleswitch-v")
            .addClass("toggleswitch-" + (value ? "h" : "v"));
        this.options.horizontal = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "horizontal", value);
        this._initial = true;
        this._ui.clearCss.removeAttr("style");
        this.refresh();
    },

    _setChecked: function(checked) {
        if (this.options.checked != checked) {
            this.options.checked = checked;
            this.element.attr("data-" + ($.mobile.ns || "") + "checked", checked);
            this._setValue(checked);
            this.refresh();
        }
    },

    refresh: function() {
        var state = (this.options.checked ? "on" : "off"),
            orientation = (this.options.horizontal ? "horizontal" : "vertical"),
            method = (this._initial ? "css" : "animate");

        this._ui.bg[method](this._dst[orientation].bg[state]);
        this._ui.btn[method](this._dst[orientation].btn[state]);
        this._ui.txtMovers.normal[method](this._dst[orientation].movers.normal[state]);
        this._ui.txtMovers.active[method](this._dst[orientation].movers.active[state]);
        this._initial = false;
    },

    destroy: function() {
        this._ui.outer.remove();
        this.element.removeClass("ui-toggleswitch-hidden");
    }
});

$(document).bind("pagecreate create", function(e) {
    $($.todons.toggleswitch.prototype.options.initSelector, e.target)
        .not(":jqmData(role='none'), :jqmData(role='nojs')")
        .toggleswitch();
});

})(jQuery);
