/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

// Converts a div into an indeterminate progressbar, displaying
// as an animated "candy stripe" bar.
//
// Apply it by setting data-role="processingbar" on an element
// (the "target" element) or with $(...).processingbar().
//
// The processingbar overlays its own DOM elements on top of the target
// element. It will fill the horizontal and vertical space occupied by
// the element, and position the animated bar in the center of its
// vertical and horizontal space. This makes it easy to overlay list
// items.
//
// Once you have a processingbar, stop the animation with stop().
// Calling refresh() will start the animation again. destroy() will
// remove the DOM elements for the bar (but leave behind the original
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
//     stopped: Fired when stop() is called on the processingbar

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
            var css = "-webkit-gradient(linear," +
                      "left top," +
                      "right bottom," +
                      "color-stop(0%,  rgba(255,255,255,1.0))," +
                      "color-stop(25%, rgba(255,255,255,1.0))," +
                      "color-stop(25%, processingbarBarBgColor)," +
                      "color-stop(50%, processingbarBarBgColor)," +
                      "color-stop(50%, rgba(255,255,255,1.0))," +
                      "color-stop(75%, rgba(255,255,255,1.0))," +
                      "color-stop(75%, processingbarBarBgColor))";
            css = css.replace(/processingbarBarBgColor/g, bgcolor);
            this.bar.css('background', css);
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
        this.element.trigger('stopped');

        this._isRunning = false;
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
