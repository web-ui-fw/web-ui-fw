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

// Displays a button which, when pressed, opens a popupwindow
// containing hsvpicker.
//
// To apply, add the attribute data-role="colorpickerbutton" to a <div>
// element inside a page. Alternatively, call colorpickerbutton() on an
// element.
//
// Options:
//
//     color: String; color displayed on the button and the base color
//            of the hsvpicker (see hsvpicker).
//            initial color can be specified in html using the
//            data-color="#ff00ff" attribute or when constructed in
//            javascript, eg :
//                $("#mycolorpickerbutton").colorpickerbutton({ color: "#ff00ff" });
//            where the html might be :
//                <div id="colorpickerbutton"></div>
//            The color can be changed post-construction like this :
//                $("#mycolorpickerbutton").colorpickerbutton("option", "color", "#ABCDEF");
//            Default: "#1a8039"
//
//     buttonMarkup: String; markup to use for the close button on the popupwindow, eg :
//                   $("#mycolorpickerbutton").colorpickerbutton("option","buttonMarkup",
//                     "<a href='#' data-role='button'>ignored</a>");
//
//     closeText: String; the text to display on the close button on the popupwindow.
//                The text set in the buttonMarkup will be ignored and this used instead.
//
// Events:
//
//     colorchanged: emitted when the color has been changed and the popupwindow is closed.

(function($, undefined) {

$.widget("tizen.colorpickerbutton", $.tizen.colorwidget, {
    options: {
        buttonMarkup: {
            theme: null,
            inline: true,
            corners: true,
            shadow: true
        },
        hideInput: true,
        closeText: "Close",
        initSelector: "input[type='color'], :jqmData(type='color'), :jqmData(role='colorpickerbutton')"
    },

    _htmlProto: {
        ui: {
            button:          "#colorpickerbutton-button",
            buttonContents:  "#colorpickerbutton-button-contents",
            popup:           "#colorpickerbutton-popup-container",
            hsvpicker:       "#colorpickerbutton-popup-hsvpicker",
            closeButton:     "#colorpickerbutton-popup-close-button",
            closeButtonText: "#colorpickerbutton-popup-close-button-text"
        }
    },

    _create: function() {
        var self = this;

        this.element
            .css("display", "none")
            .after(this._ui.button);

        /* Tear apart the proto */
        this._ui.popup.insertBefore(this.element).popupwindow();
        this._ui.hsvpicker.hsvpicker();

        $.tizen.popupwindow.bindPopupToButton(this._ui.button, this._ui.popup);

        this._ui.closeButton.bind("vclick", function(event) {
            self._setColor(self._ui.hsvpicker.hsvpicker("option", "color"));
            self.close();
        });

        this.element.bind("change keyup blur", function() {
            self._setColor(self.element.val());
        });
    },

    _setHideInput: function(value) {
        this.element[value ? "addClass" : "removeClass"]("ui-colorpickerbutton-input-hidden");
        this.element[value ? "removeClass" : "addClass"]("ui-colorpickerbutton-input");
        this.element.attr("data-" + ($.mobile.ns || "") + "hide-input", value);
    },

    _setColor: function(clr) {
        if ($.tizen.colorwidget.prototype._setColor.call(this, clr)) {
            var clrlib = $.tizen.colorwidget.clrlib;

            this._ui.hsvpicker.hsvpicker("option", "color", this.options.color);
            $.tizen.colorwidget.prototype._setElementColor.call(this, this._ui.buttonContents, 
                clrlib.RGBToHSL(clrlib.HTMLToRGB(this.options.color)), "color");
        }
    },

    _setButtonMarkup: function(value) {
        this._ui.button.buttonMarkup(value);
        this.options.buttonMarkup = value;
        value["inline"] = false;
        this._ui.closeButton.buttonMarkup(value);
    },

    _setCloseText: function(value) {
        this._ui.closeButtonText.text(value);
        this.options.closeText = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "close-text", value);
    },

    _setDisabled: function(value) {
        $.tizen.widgetex.prototype._setDisabled.call(this, value);
        this._ui.popup.popupwindow("option", "disabled", value);
        this._ui.button[value ? "addClass" : "removeClass"]("ui-disabled");
        $.tizen.colorwidget.prototype._displayDisabledState.call(this, this._ui.button);
    },

    open: function() {
        this._ui.popup.popupwindow("open",
            this._ui.button.offset().left + this._ui.button.outerWidth()  / 2,
            this._ui.button.offset().top  + this._ui.button.outerHeight() / 2);
    },

    _focusButton : function(){
        var self = this;
        setTimeout(function() {
            self._ui.button.focus();
        }, 40);
    },

    close: function() {
        this._focusButton();
        this._ui.popup.popupwindow("close");
    }
});

//auto self-init widgets
$(document).bind("pagecreate create", function(e) {
    $($.tizen.colorpickerbutton.prototype.options.initSelector, e.target)
        .not(":jqmData(role='none'), :jqmData(role='nojs')")
        .colorpickerbutton();
});

})(jQuery);
