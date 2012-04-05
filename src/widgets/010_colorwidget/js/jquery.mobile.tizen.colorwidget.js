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

$.widget("tizen.colorwidget", $.tizen.widgetex, {
    options: {
        color: "#ff0972"
    },

    _value: {
        attr: "data-" + ($.mobile.ns || "") + "color",
        signal: "colorchanged"
    },

    _getElementColor: function(el, cssProp) {
        return el.jqmData("clr");
    },

    _setElementColor: function(el, hsl, cssProp) {
        var clrlib = $.tizen.colorwidget.clrlib,
            clr = clrlib.RGBToHTML(clrlib.HSLToRGB(hsl)),
            dclr = clrlib.RGBToHTML(clrlib.HSLToGray(hsl));

        el.jqmData("clr", clr);
        el.jqmData("dclr", dclr);
        el.jqmData("cssProp", cssProp);
        el.attr("data-" + ($.mobile.ns || "") + "has-dclr", true);
        el.css(cssProp, this.options.disabled ? dclr : clr);

        return { clr: clr, dclr: dclr };
    },

    _displayDisabledState: function(toplevel) {
        var self = this,
            sel = ":jqmData(has-dclr='true')",
            dst = toplevel.is(sel) ? toplevel : $([]);
        dst
            .add(toplevel.find(sel))
            .each(function() {
                el = $(this);

                el.css(el.jqmData("cssProp"), el.jqmData(self.options.disabled ? "dclr" : "clr"));
            });
    },

    _setColor: function(value) {
        var currentValue = (this.options.color + "");

        value = value + "";
        value = value.match(/#[0-9A-Fa-f]{6}/)
            ? value
            : currentValue.match(/#[0-9A-Fa-f]{6}/)
                ? currentValue
                : $.tizen.colorwidget.prototype.options.color;

        if (this.options.color !== value) {
            this.options.color = value;
            this._setValue(value);
            return true;
        }
        return false;
    }
});

$.tizen.colorwidget.clrlib = {
    nearestInt: function(val) {
        var theFloor = Math.floor(val);

        return (((val - theFloor) > 0.5) ? (theFloor + 1) : theFloor);
    },

    // Converts html color string to rgb array.
    //
    // Input: string clr_str, where
    // clr_str is of the form "#aabbcc"
    //
    // Returns: [ r, g, b ], where
    // r is in [0, 1]
    // g is in [0, 1]
    // b is in [0, 1]
    HTMLToRGB: function(clr_str) {
        clr_str = (('#' == clr_str.charAt(0)) ? clr_str.substring(1) : clr_str);

        return [ parseInt(clr_str.substring(0, 2), 16) / 255.0,
                 parseInt(clr_str.substring(2, 4), 16) / 255.0,
                 parseInt(clr_str.substring(4, 6), 16) / 255.0 ];
    },

    // Converts rgb array to html color string.
    //
    // Input: [ r, g, b ], where
    // r is in [0, 1]
    // g is in [0, 1]
    // b is in [0, 1]
    //
    // Returns: string of the form "#aabbcc"
    RGBToHTML: function(rgb) {
        var ret = "#", val, theFloor;
        for (var Nix in rgb) {
            val = rgb[Nix] * 255;
            theFloor = Math.floor(val);
            val = ((val - theFloor > 0.5) ? (theFloor + 1) : theFloor);
            ret = ret + (((val < 16) ? "0" : "") + (val & 0xff).toString(16));
        }

        return ret;
    },

    // Converts hsl to rgb.
    //
    // From http://130.113.54.154/~monger/hsl-rgb.html
    //
    // Input: [ h, s, l ], where
    // h is in [0, 360]
    // s is in [0,   1]
    // l is in [0,   1]
    //
    // Returns: [ r, g, b ], where
    // r is in [0, 1]
    // g is in [0, 1]
    // b is in [0, 1]
    HSLToRGB: function(hsl) {
        var h = hsl[0] / 360.0, s = hsl[1], l = hsl[2];

        if (0 === s)
            return [ l, l, l ];

        var temp2 = ((l < 0.5)
                ? l * (1.0 + s)
                : l + s - l * s),
            temp1 = 2.0 * l - temp2,
            temp3 = {
                r: h + 1.0 / 3.0,
                g: h,
                b: h - 1.0 / 3.0
            };

        temp3.r = ((temp3.r < 0) ? (temp3.r + 1.0) : ((temp3.r > 1) ? (temp3.r - 1.0) : temp3.r));
        temp3.g = ((temp3.g < 0) ? (temp3.g + 1.0) : ((temp3.g > 1) ? (temp3.g - 1.0) : temp3.g));
        temp3.b = ((temp3.b < 0) ? (temp3.b + 1.0) : ((temp3.b > 1) ? (temp3.b - 1.0) : temp3.b));

        ret = [
            (((6.0 * temp3.r) < 1) ? (temp1 + (temp2 - temp1) * 6.0 * temp3.r) :
            (((2.0 * temp3.r) < 1) ? temp2 :
            (((3.0 * temp3.r) < 2) ? (temp1 + (temp2 - temp1) * ((2.0 / 3.0) - temp3.r) * 6.0) :
             temp1))),
            (((6.0 * temp3.g) < 1) ? (temp1 + (temp2 - temp1) * 6.0 * temp3.g) :
            (((2.0 * temp3.g) < 1) ? temp2 :
            (((3.0 * temp3.g) < 2) ? (temp1 + (temp2 - temp1) * ((2.0 / 3.0) - temp3.g) * 6.0) :
             temp1))),
            (((6.0 * temp3.b) < 1) ? (temp1 + (temp2 - temp1) * 6.0 * temp3.b) :
            (((2.0 * temp3.b) < 1) ? temp2 :
            (((3.0 * temp3.b) < 2) ? (temp1 + (temp2 - temp1) * ((2.0 / 3.0) - temp3.b) * 6.0) :
             temp1)))];

        return ret;
    },

    // Converts hsv to rgb.
    //
    // Input: [ h, s, v ], where
    // h is in [0, 360]
    // s is in [0,   1]
    // v is in [0,   1]
    //
    // Returns: [ r, g, b ], where
    // r is in [0, 1]
    // g is in [0, 1]
    // b is in [0, 1]
    HSVToRGB: function(hsv) {
        return $.tizen.colorwidget.clrlib.HSLToRGB($.tizen.colorwidget.clrlib.HSVToHSL(hsv));
    },

    // Converts rgb to hsv.
    //
    // from http://coecsl.ece.illinois.edu/ge423/spring05/group8/FinalProject/HSV_writeup.pdf
    //
    // Input: [ r, g, b ], where
    // r is in [0,   1]
    // g is in [0,   1]
    // b is in [0,   1]
    //
    // Returns: [ h, s, v ], where
    // h is in [0, 360]
    // s is in [0,   1]
    // v is in [0,   1]
    RGBToHSV: function(rgb) {
        var min, max, delta, h, s, v, r = rgb[0], g = rgb[1], b = rgb[2];

        min = Math.min(r, Math.min(g, b));
        max = Math.max(r, Math.max(g, b));
        delta = max - min;

        h = 0;
        s = 0;
        v = max;

        if (delta > 0.00001) {
            s = delta / max;

            if (r === max)
                h = (g - b) / delta ;
            else
            if (g === max)
                h = 2 + (b - r) / delta ;
            else
                h = 4 + (r - g) / delta ;

            h *= 60 ;

            if (h < 0)
                h += 360 ;
        }

        return [h, s, v];
    },

    // Converts hsv to hsl.
    //
    // Input: [ h, s, v ], where
    // h is in [0, 360]
    // s is in [0,   1]
    // v is in [0,   1]
    //
    // Returns: [ h, s, l ], where
    // h is in [0, 360]
    // s is in [0,   1]
    // l is in [0,   1]
    HSVToHSL: function(hsv) {
        var max = hsv[2],
            delta = hsv[1] * max,
            min = max - delta,
            sum = max + min,
            half_sum = sum / 2,
            s_divisor = ((half_sum < 0.5) ? sum : (2 - max - min));

        return [ hsv[0], ((0 == s_divisor) ? 0 : (delta / s_divisor)), half_sum ];
    },

    // Converts rgb to hsl
    //
    // Input: [ r, g, b ], where
    // r is in [0,   1]
    // g is in [0,   1]
    // b is in [0,   1]
    //
    // Returns: [ h, s, l ], where
    // h is in [0, 360]
    // s is in [0,   1]
    // l is in [0,   1]
    RGBToHSL: function(rgb) {
        return $.tizen.colorwidget.clrlib.HSVToHSL($.tizen.colorwidget.clrlib.RGBToHSV(rgb));
    },

    // Converts hsl to grayscale
    // Full-saturation magic grayscale values were taken from the Gimp
    //
    // Input: [ h, s, l ], where
    // h is in [0, 360]
    // s is in [0,   1]
    // l is in [0,   1]
    //
    // Returns: [ r, g, b ], where
    // r is in [0,   1]
    // g is in [0,   1]
    // b is in [0,   1]
    HSLToGray: function(hsl) {
        var intrinsic_vals = [0.211764706, 0.929411765, 0.71372549, 0.788235294, 0.070588235, 0.28627451, 0.211764706],
            idx = Math.floor(hsl[0] / 60),
            begVal, endVal, val;

        // Find hue interval
        begVal = intrinsic_vals[idx];
        endVal = intrinsic_vals[idx + 1];

        // Adjust for lum
        if (hsl[2] < 0.5) {
            var lowerHalfPercent = hsl[2] * 2;
            begVal *= lowerHalfPercent;
            endVal *= lowerHalfPercent;
        }
        else {
            var upperHalfPercent = (hsl[2] - 0.5) * 2;
            begVal += (1.0 - begVal) * upperHalfPercent;
            endVal += (1.0 - endVal) * upperHalfPercent;
        }

        // This is the gray value at full sat, whereas hsl[2] is the gray value at 0 sat.
        val = begVal + ((endVal - begVal) * (hsl[0] - (idx * 60))) / 60;

        // Get value at hsl[1]
        val = val + (hsl[2] - val) * (1.0 - hsl[1]);

        return [val, val, val];
    }
};

})(jQuery);
