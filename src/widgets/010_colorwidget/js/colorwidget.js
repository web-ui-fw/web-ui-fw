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

$.widget("todons.colorwidget", $.todons.widgetex, {
    options: {
        color: "#ff0972"
    },

    _create: function() {
        $.extend (this, {
            isInput: this.element.is("input")
        });

        /* "value", if present, takes precedence over "data-color" */
        if (this.isInput)
            if (this.element.attr("value").match(/#[0-9A-Fa-f]{6}/))
                this.element.attr("data-color", this.element.attr("value"));
    },

    _setColor: function(value) {
        if (value.match(/#[0-9A-Fa-f]{6}/) && (this.options.color != value)) {
            this.element.attr("data-color", value);
            if (this.isInput)
                this.element.attr("value", value);
            this.options.color = value;
            this.element.triggerHandler("colorchanged", value);
            return true;
        }
        return false;
    },
});

})(jQuery);
