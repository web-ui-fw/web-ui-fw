/*
 * jQuery Mobile Widget @VERSION
 *
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
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

// Converts a div into an indeterminate progressbar, displaying
// as an animated "candy stripe" bar.
//
// Apply it by setting data-role="processingbar" on an element
// (the "target" element) or with $(...).processingbar().
//
// The processingbar appends its own DOM elements to the target
// element and fill the horizontal and vertical space occupied by
// the element.
//
// Once you have a processingbar, stop the animation with stop().
// Calling refresh() will start the animation again. destroy() will
// remove the bar's DOM elements (but leave behind the original
// div).
//
// Options:
//
//     animationMsPerPixel: Integer; default = 15; the number of ms of
//                          animation to use per pixel of vertical
//                          height in the animated bar. Increasing this
//                          number will make the animation of the bar
//                          faster.
//
// Events:
//
//     stop: Fired when stop() is called on the processingbar

(function($, undefined) {

$.widget("todons.processingbar", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(role='processingbar')",
        animationMsPerPixel: 15,
        theme: 'b'
    },

    _isRunning: false,

    _create: function () {
        var self = this,
            page = this.element.closest('.ui-page'),
            refreshFunc;

        var theme = this.element.jqmData('theme') || this.options.theme;

        this.html = $('<div class="ui-processingbar-container">' +
                      '<div class="ui-processingbar-clip">' +
                      '<div class="ui-processingbar-bar" />' +
                      '</div>' +
                      '</div>' +
                      '<span class="ui-processingbar-swatch"></span>');

        // clean up any old HTML
        this.element.find('.ui-processingbar-container').remove();

        // add the HTML elements
        this.element.append(this.html);

        this.bar = this.element.find('.ui-processingbar-bar');

        // massive hack to get theme colours (we can't apply a theme
        // class direct to the bar, as we need to create the
        // barbershop pole effect)
        var swatch = this.element.find('.ui-processingbar-swatch');
        swatch.addClass('ui-bar-' + theme);
        var bgcolor = swatch.css('background-color');
        swatch.remove();

        if (bgcolor) {
            var webkitCss = "-webkit-gradient(linear, left top, right bottom, " +
                            "color-stop(0%,  rgba(255,255,255,1.0))," +
                            "color-stop(25%, rgba(255,255,255,1.0))," +
                            "color-stop(25%, processingbarBarBgColor)," +
                            "color-stop(50%, processingbarBarBgColor)," +
                            "color-stop(50%, rgba(255,255,255,1.0))," +
                            "color-stop(75%, rgba(255,255,255,1.0))," +
                            "color-stop(75%, processingbarBarBgColor))";
            webkitCss = webkitCss.replace(/processingbarBarBgColor/g, bgcolor);
            this.bar.css('background-image', webkitCss);

            var step = this.bar.height() / 8;
            var mozCss = "-moz-repeating-linear-gradient(top left -45deg, " +
                         "rgba(255,255,255,1.0)," +
                         "rgba(255,255,255,1.0) " + step + "px," +
                         "processingbarBarBgColor " + step + "px," +
                         "processingbarBarBgColor " + (step * 3) + "px," +
                         "rgba(255,255,255,1.0) " + (step * 3) + "px," +
                         "rgba(255,255,255,1.0) " + (step * 4) + "px)";
            mozCss = mozCss.replace(/processingbarBarBgColor/g, bgcolor);
            this.bar.css('background', mozCss);
        }
        // end massive hack

        refreshFunc = function () {
            self.refresh();
        };

        if (page && !page.is(':visible')) {
            page.unbind('pageshow', refreshFunc)
                .bind('pageshow', refreshFunc);
        }
        else {
            this.refresh();
        }
    },

    // draw the processingbar
    refresh: function () {
        this.stop();

        // animate the bar
        var moveY = this.bar.height() / 2;

        // 15 ms for each pixel of movement
        var animationTime = moveY * this.options.animationMsPerPixel;

        // temp variable so bar can be referred to inside function
        var bar = this.bar;

        // func to animate the bar
        var animateFunc = function () {
            bar.animate({top: '-=' + moveY},
                         animationTime,
                         'linear',
                         function () {
                             bar.css('top', 0);
                         });
        };

        // start animation loop
        this.interval = setInterval(animateFunc, animationTime);

        this._isRunning = true;
    },

    stop: function () {
        if (!this._isRunning) {
            return;
        }

        // stop the loop
        clearInterval(this.interval);

        // remove all pending animations
        this.bar.stop();
        this.bar.clearQueue();

        // trigger event
        this.element.trigger('stop');

        this._isRunning = false;
    },

    isRunning: function () {
      return this._isRunning;
    },

    destroy: function () {
        this.stop();
        this.html.detach();
    }
});

// auto self-init widgets
$(document).bind("pagecreate create", function (e) {
    $($.todons.processingbar.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .processingbar();
});

})(jQuery);
