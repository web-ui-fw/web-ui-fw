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
        checked: true,
        initSelector: ":jqmData(role='toggleswitch')"
    },

    _htmlProto: {
        ui: {
            outer:            "#toggleswitch",
            normalBackground: "#toggleswitch-inner-normal",
            activeBackground: "#toggleswitch-inner-active",
            initButtons:      "#toggleswitch-button-t-active",
            tButton:          "#toggleswitch-button-t",
            fButton:          "#toggleswitch-button-f",
            realButton:       "#toggleswitch-button-outside-real",
            refButton:        "#toggleswitch-button-outside-ref"
        }
    },

    _value: {
        attr: "data-" + ($.mobile.ns || "") + "checked",
        signal: "changed"
    },

    _create: function() {
        var self = this;

        this.element
            .css("display", "none")
            .after(this._ui.outer);

        this._ui.outer.find("a").buttonMarkup();

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

        $.extend(this, {
            _initial: true
        });

        this._ui.realButton
            .add(this._ui.normalBackground)
            .bind("vclick", function(e) {
                self._setChecked(!(self.options.checked));
                e.stopPropagation();
            });
    },

    _makeTransparent: function(obj, b) {
        if ($.mobile.browser.ie)
            obj.add(obj.find("*")).css("opacity", b ? 0.0 : 1.0);
        else
            obj[b ? "addClass" : "removeClass"]("toggleswitch-button-transparent");
    },

    _setChecked: function(checked) {
        if (this.options.checked != checked) {
            if (this.options.checked === undefined) {
                this._makeTransparent(this._ui[(checked ? "normal" : "active") + "Background"], true);
            }
            else {
                this._ui.refButton.offset(this._ui[(checked ? "t" : "f") + "Button"].offset());
                this._ui.realButton.offset(this._ui[(checked ? "f" : "t") + "Button"].offset());

                if (this._initial) {
                    this._makeTransparent(this._ui.outer.find("a"), true);
                    this._makeTransparent(this._ui.realButton, false);
                    this._initial = false;
                }

                this._ui.realButton.animate({top: this._ui.refButton.position().top});
                this._ui.normalBackground.animate({opacity: checked ? 0.0 : 1.0});
                this._ui.activeBackground.animate({opacity: checked ? 1.0 : 0.0});
            }

            this.options.checked = checked;
            this.element.attr("data-" + ($.mobile.ns || "") + "checked", checked);
            this._setValue(checked);
        }
    }
});

$(document).bind("pagecreate create", function(e) {
    $($.todons.toggleswitch.prototype.options.initSelector, e.target)
        .not(":jqmData(role='none'), :jqmData(role='nojs')")
        .toggleswitch();
});

})(jQuery);
