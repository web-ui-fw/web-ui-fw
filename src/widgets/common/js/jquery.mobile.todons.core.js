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
 * Authors: Kalyan Kondapally <kalyan.kondapally@intel.com>
 */

ensureNS("jQuery.mobile.todons");

(function () {

jQuery.extend(jQuery.mobile.todons, {
    Point: function (x, y) {
        var X = isNaN(x) ? 0 : x;
        var Y = isNaN(y) ? 0 : y;

        this.add = function (Point) {
            this.setX(X + Point.x());
            this.setY(Y + Point.y());
            return this;
        }

        this.subtract = function (Point) {
            this.setX(X - Point.x());
            this.setY(Y - Point.y());
            return this;
        }

        this.multiply = function (Point) {
            this.setX(Math.round(X * Point.x()));
            this.setY(Math.round(Y * Point.y()));
            return this;
        }

        this.divide = function (Point) {
            this.setX(Math.round(X / Point.x()));
            this.setY(Math.round(Y / Point.y()));
            return this;
        }

        this.isNull = function () {
            return (X === 0 && Y === 0);
        }

        this.x = function () {
            return X;
        }

        this.setX = function (val) {
            isNaN(val) ? X = 0 : X = val;
        }

        this.y = function () {
            return Y;
        }

        this.setY = function (val) {
            isNaN(val) ? Y = 0 : Y = val;
        }

        this.setNewPoint = function (point) {
            this.setX(point.x());
            this.setY(point.y());
        }

        this.isEqualTo = function (point) {
            return (X === point.x() && Y === point.y());
        }
    },

    Rect: function (left,top,width,height) {
        var Left = left;
        var Top = top;
        var Right = Left+width;
        var Bottom = Top+height;

        this.setRect = function(varL,varR,varT,varB) {
            this.setLeft(varL);
            this.setRight(varR);
            this.setTop(varT);
            this.setBottom(varB);
        }

        this.right = function () {
            return Right;
        }

        this.setRight = function (val) {
            Right = val;
        }

        this.top = function () {
            return Top;
        }

        this.setTop = function (val) {
            Top = val;
        }

        this.bottom = function () {
            return Bottom;
        }

        this.setBottom = function (val) {
            Bottom = val;
        }

        this.left = function () {
            return Left;
        }

        this.setLeft = function (val) {
            Left = val;
        }

        this.moveTop = function(valY) {
            var h = this.height();
            Top = valY;
            Bottom = Top + h;
        }

        this.isNull = function () {
            return Right === Left && Bottom === Top;
        }

        this.isValid = function () {
            return Left <= Right && Top <= Bottom;
        }

        this.isEmpty = function () {
            return Left > Right || Top > Bottom;
        }

        this.contains = function (valX,valY) {
            if (this.containsX(valX) && this.containsY(valY))
                return true;
            return false;
        }

        this.width = function () {
            return Right - Left;
        }

        this.height = function () {
            return Bottom - Top;
        }

        this.containsX = function(val) {
            var l = Left,
            r = Right;
            if (Right<Left) {
                l = Right;
                r = Left;
            }
            if (l > val || r < val)
                return false;
        return true;
        }

        this.containsY = function(val) {
            var t = Top,
            b = Bottom;
            if (Bottom<Top) {
                t = Bottom;
                b = Top;
            }
            if (t > val || b < val)
                return false;
          return true;
        }
    },

    disableSelection: function (element) {
        return $(element).each(function () {
            jQuery(element).css('-webkit-user-select', 'none');
        });
    },

    enableSelection: function (element, value) {
        return $(element).each(function () {
            val = value == "text" ? val = 'text' : val = 'auto';
            jQuery(element).css('-webkit-user-select', val);
        });
    },

    // Set the height of the content area to fill the space between a
    // page's header and footer
    fillPageWithContentArea: function (page) {
        var $page = $(page);
        var $content = $page.children(".ui-content:first");
        var hh = $page.children(".ui-header").outerHeight(); hh = hh ? hh : 0;
        var fh = $page.children(".ui-footer").outerHeight(); fh = fh ? fh : 0;
        var pt = parseFloat($content.css("padding-top"));
        var pb = parseFloat($content.css("padding-bottom"));
        var wh = window.innerHeight;
        var height = wh - (hh + fh) - (pt + pb);
        $content.height(height);
    },

    // Get document-relative mouse coordinates from a given event
    // From: http://www.quirksmode.org/js/events_properties.html#position
    documentRelativeCoordsFromEvent: function(ev) {
        var e = ev ? ev : window.event,
            client = { x: e.clientX, y: e.clientY },
            page   = { x: e.pageX,   y: e.pageY   },
            posx = 0,
            posy = 0;

        // Grab useful coordinates from touch events
        if (e.type.match(/^touch/)) {
            page = {
                x: e.originalEvent.targetTouches[0].pageX,
                y: e.originalEvent.targetTouches[0].pageY
            };
            client = {
                x: e.originalEvent.targetTouches[0].clientX,
                y: e.originalEvent.targetTouches[0].clientY
            };
        }

        if (page.x || page.y) {
            posx = page.x;
            posy = page.y;
        }
        else
        if (client.x || client.y) {
            posx = client.x + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = client.y + document.body.scrollTop  + document.documentElement.scrollTop;
        }

        return { x: posx, y: posy };
    },

    targetRelativeCoordsFromEvent: function(e) {
        var coords = { x: e.offsetX, y: e.offsetY };

        if (coords.x === undefined || isNaN(coords.x) ||
            coords.y === undefined || isNaN(coords.y)) {
            var offset = $(e.target).offset();

            coords = $.mobile.todons.documentRelativeCoordsFromEvent(e);
            coords.x -= offset.left;
            coords.y -= offset.top;
        }

        return coords;
    }
});

})();
