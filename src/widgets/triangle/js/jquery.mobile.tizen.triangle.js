/*
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
 */

(function($, undefined) {

$.widget( "tizen.triangle", $.tizen.widgetex, {
    options: {
        extraClass: "",
        offset: null,
        color: null,
        location: "top",
        initSelector: ":jqmData(role='triangle')"
    },

    _create: function() {
        var triangle = $("<div></div>", {"class" : "ui-triangle"});

        $.extend(this, {
            _triangle: triangle
        });

        this.element.addClass("ui-triangle-container").append(triangle);
    },

    _doCSS: function() {
        var location = (this.options.location || "top"),
            offsetCoord = (($.inArray(location, ["top", "bottom"]) === -1) ? "top" : "left"),
            cssArg = {
                "border-bottom-color" : "top"    === location ? this.options.color : "transparent",
                "border-top-color"    : "bottom" === location ? this.options.color : "transparent",
                "border-left-color"   : "right"  === location ? this.options.color : "transparent",
                "border-right-color"  : "left"   === location ? this.options.color : "transparent"
            };

        cssArg[offsetCoord] = this.options.offset;

        this._triangle.removeAttr("style").css(cssArg);
    },

    _setOffset: function(value) {
        this.options.offset = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "offset", value);
        this._doCSS();
    },

    _setExtraClass: function(value) {
        this._triangle.addClass(value);
        this.options.extraClass = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "extra-class", value);
    },

    _setColor: function(value) {
        this.options.color = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "color", value);
        this._doCSS();
    },

    _setLocation: function(value) {
        this.element
            .removeClass("ui-triangle-container-" + this.options.location)
            .addClass("ui-triangle-container-" + value);
        this._triangle
            .removeClass("ui-triangle-" + this.options.location)
            .addClass("ui-triangle-" + value);

        this.options.location = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "location", value);

        this._doCSS();
    }
});

$(document).bind("pagecreate create", function(e) {
    $($.tizen.triangle.prototype.options.initSelector, e.target)
        .not(":jqmData(role='none'), :jqmData(role='nojs')")
        .triangle();
});

})(jQuery);
