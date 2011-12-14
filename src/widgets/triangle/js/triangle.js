/*
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
 */

(function($, undefined) {

$.widget( "todons.triangle", $.todons.widgetex, {
    options: {
        extraClass: "",
        offset: null,
        color: undefined,
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

    _setOffset: function(value) {
        if (null !== value) {
            this._triangle.css("left", value);
            this.options.offset = value;
            this.element.attr("data-" + ($.mobile.ns || "") + "offset", value);
        }
    },

    _setExtraClass: function(value) {
        this._triangle.addClass(value);
        this.options.extraClass = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "extra-class", value);
    },

    _setColor: function(value) {
        this._triangle.css("border-bottom-color", value);
        this._triangle.css("border-top-color", value);
        this.options.color = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "color", value);
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
    }
});

$(document).bind("pagecreate create", function(e) {
    $($.todons.triangle.prototype.options.initSelector, e.target)
        .not(":jqmData(role='none'), :jqmData(role='nojs')")
        .triangle();
});

})(jQuery);
