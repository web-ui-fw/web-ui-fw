/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

/**
 * Converts a div into an indeterminate progressbar, displaying
 * as an animated "candy stripe" bar.
 *
 * Apply it by setting data-processing="spinnerbar" on an element
 * (the "target" element) or with $(...).spinnerbar().
 *
 * The spinnerbar overlays its own DOM elements on top of the target
 * element. It will fill the horizontal and vertical space occupied by
 * the element, and position the animated bar in the center of its
 * vertical and horizontal space. This makes it easy to overlay list
 * items.
 *
 * Once you have a spinnerbar, start its animation with start();
 * stop the animation with stop() (which also detaches its DOM elements).
 * NB if you start() a spinnerbar again, it will redraw itself
 * at the same position on the page.
 *
 * Options:
 *
 *     animationMsPerPixel: Integer; default = 15; the number of ms of
 *                          animation to use per pixel of vertical
 *                          height in the animated bar. Increasing this
 *                          number will make the animation of the bar
 *                          faster.
 *
 * Events:
 *
 *     stopped: Fired when stop() is called on the spinnerbar and it has been
 *              detached from the DOM
 */
(function($, window, undefined) {

$.widget("todons.spinnerbar", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(processing='spinnerbar')",
        animationMsPerPixel: 15
    },

    _create: function () {
        this.isRunning = false;
        this.spinnerbar = $.mobile.todons.loadPrototype('spinnerbar').find('div:first');
        this.bar = this.spinnerbar.find('.ui-spinnerbar-bar');
    },

    start: function () {
        if (this.isRunning) {
          return;
        }

        // draw the spinnerbar
        var el = $(this.element);

        var zIndex = el.css('z-index');
        zIndex = zIndex ? zIndex + 1 : 10;
        this.spinnerbar.css('z-index', zIndex);

        this.spinnerbar.position({my: 'center center',
                                  at: 'center center',
                                  of: el});
        el.after(this.spinnerbar);

        // func to animate the bar itself
        var animateFunc = function (bar, animationMsPerPixel) {
            var moveY = bar.height() / 2;

            // 15 ms for each pixel of movement
            var animationTime = moveY * animationMsPerPixel;

            bar.animate({top: '-=' + moveY},
                         animationTime,
                         'linear',
                         function () {
                             bar.css('top', 0);
                             animateFunc(bar, animationMsPerPixel);
                         });
        };

        // animate the bar
        animateFunc(this.bar, this.options.animationMsPerPixel);

        this.isRunning = true;
    },

    stop: function () {
        if (!this.isRunning) {
          return;
        }

        // remove all pending animations
        this.bar.stop();
        this.bar.clearQueue();

        // remove the DOM elements
        this.spinnerbar.detach();

        // trigger event
        this.element.trigger('stopped');

        this.isRunning = false;
    }
});

// auto self-init widgets
$(document).bind("pagecreate", function (e) {
    $($.todons.spinnerbar.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .spinnerbar();
});

})(jQuery);
