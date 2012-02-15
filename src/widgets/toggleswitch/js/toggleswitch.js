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
        initSelector : ":jqmData(role='toggleswitch')"
    },

    _htmlProto: {
        ui: {
            outer     : "#outer",
            bg        : "#bg",
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
        this._ui.txtMovers.normal
            .add(this._ui.txtMovers.active)
            .find("*")
            .css({"border-color": "transparent"});
        this._ui.btn.addClass("toggleswitch-button");
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
        this._ui.btnSpan.html((noText ? "" : "&nbsp;"));
        this._ui.outer.find("a")[(noText ? "addClass" : "removeClass")]("ui-btn-icon-notext");
    },

    _setOnText: function(value) {
        this._ui.txt.active.text(value);
        this.options.onText = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "on-text", value);
        this._updateBtnText();
    },

    _setOffText: function(value) {
        this._ui.txt.normal.text(value);
        this.options.offText = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "off-text", value);
        this._updateBtnText();
    },

    _setChecked: function(checked) {
        if (this.options.checked != checked) {
            var dst = checked
                    ? {bg:  "0%", normalTop: "-50%", activeBot:   "0%"}
                    : {bg: "50%", normalTop:   "0%", activeBot: "-50%"},
                method = (this._initial ? "css" : "animate")

            this._ui.btn.add(this._ui.bg)[method]({top: dst.bg});
            this._ui.txtMovers.normal[method]({top: dst.normalTop});
            this._ui.txtMovers.active[method]({bottom: dst.activeBot});

            this._initial = false;

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
