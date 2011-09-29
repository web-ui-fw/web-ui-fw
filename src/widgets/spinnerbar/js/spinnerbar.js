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
(function($, undefined) {

$.widget("todons.spinnerbar", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(processing='spinnerbar')",
        animationMsPerPixel: 15
    },

    _create: function () {
        this.html = $('<div class="ui-spinnerbar-container">' +
                      '<div class="ui-spinnerbar-clip">' +
                      '<div class="ui-spinnerbar-bar" />' +
                      '</div>' +
                      '</div>');

        this.isRunning = false;
    },

    start: function () {
        if (this.isRunning) {
          return;
        }

        // draw the spinnerbar
        var el = $(this.element);

        this.spinnerbar = $(this.html).find('.ui-spinnerbar-container');
        this.bar = $(this.html).find('.ui-spinnerbar-bar');

        this.spinnerbar.position({my: 'center center',
                                  at: 'center center',
                                  of: el});
        el.after(this.html);

        var zIndex = el.css('z-index');
        zIndex = zIndex ? zIndex + 1 : 10;
        this.spinnerbar.css('z-index', zIndex);

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

        this.isRunning = true;
    },

    stop: function () {
        if (!this.isRunning) {
          return;
        }

        // stop the loop
        clearInterval(this.interval);

        // remove all pending animations
        this.bar.stop();
        this.bar.clearQueue();

        // remove the DOM elements
        this.html.detach();

        // trigger event
        this.element.trigger('stopped');

        this.isRunning = false;
    }
});

// auto self-init widgets
$(document).bind("pagecreate create", function (e) {
    $($.todons.spinnerbar.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .spinnerbar();
});

})(jQuery);
