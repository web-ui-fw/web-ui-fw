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
//     $("#myswitch").switch();
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

$.widget("todons.switch", $.todons.widgetex, {
    options: {
        checked: true,
        initSelector: ":jqmData(role='switch')"
    },

    _htmlProto: {
        ui: {
            outer:            "#switch",
            normalBackground: "#switch-inner-normal",
            activeBackground: "#switch-inner-active",
            tButton:          "#switch-button-t",
            fButton:          "#switch-button-f",
            realButton:       "#switch-button-outside-real",
            refButton:        "#switch-button-outside-ref"
        }
    },

    _create: function() {
        var self = this,
            dstAttr = this.element.is("input") ? "checked" : "data-checked";

        this.element.append(this._ui.outer);
        this._ui.outer.find("a").buttonMarkup({inline: true, corners: true});

        $.extend(this, {
            _realized: false,
            _dstAttr: dstAttr
        });

        this._ui.realButton
            .add(this._ui.normalBackground)
            .bind("vclick", function(e) {
                self._setChecked(!(self.options.checked));
                e.stopPropagation();
            });
    },

    _realize: function() {
        this._ui.realButton
            .offset(this._ui[(this.options.checked ? "t" : "f") + "Button"].offset())
            .removeClass("switch-button-transparent");
        this._ui.activeBackground.find("a").addClass("switch-button-transparent");
        this._ui.normalBackground.find("a").addClass("switch-button-transparent");
        this._ui.normalBackground.css({"opacity": this.options.checked ? 0.0 : 1.0});
        this._ui.activeBackground.css({"opacity": this.options.checked ? 1.0 : 0.0});

        this._realized = true;
    },

    _setChecked: function(checked) {
        if (this.options.checked != checked) {

            if (this._realized) {
                this._ui.refButton.offset(this._ui[(checked ? "t" : "f") + "Button"].offset());
                this._ui.realButton.animate({"top": this._ui.refButton.position().top});
            }

            this._ui.normalBackground.animate({"opacity": checked ? 0.0 : 1.0});
            this._ui.activeBackground.animate({"opacity": checked ? 1.0 : 0.0});

            this.options.checked = checked;
            this.element.attr(this._dstAttr, checked ? "true" : "false");
            this.element.triggerHandler("changed", checked);
        }
    }
});

$(document).bind("pagecreate create", function(e) {
    $($.todons.switch.prototype.options.initSelector, e.target)
        .not(":jqmData(role='none'), :jqmData(role='nojs')")
        .switch();
});

})(jQuery);
