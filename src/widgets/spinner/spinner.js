/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

/**
 * Displays a spinner icon over the DOM element it is applied to
 * (the "target").
 *
 * A spinner doesn't have a progress value, as it is used in situations
 * where the exact amount of time a process would take is not known.
 *
 * Apply a spinner using the spinner() method or by adding a
 * data-processing="spinner" attribute to an element.
 *
 * Once you have a spinner, call the start() method on it to display it
 * and start the animation.
 *
 * The spinner uses a div directly after the element. Calling stop()
 * on a spinner detaches this element from the DOM; it also removes
 * the data-processing="spinner" attribute from the target element, if one
 * exists.
 *
 * Options:
 *
 *     position: Object; positioning specifier, allowing positioning of the
 *               spinner with respect to the target element; default
 *               is to align 'right center' of the spinner
 *               with 'right center' of the target element; change by passing
 *               an object with 'my' and 'at' properties, as per the jQuery UI
 *               position() options (see http://jqueryui.com/demos/position/);
 *               e.g. to position the center of the spinner over the center
 *               of the target element, use:
 *                   position: {my:'center center', at: 'center center'}
 *               where 'my' specifies the point on the spinner, and 'at'
 *               specifies the point on the target element
 *     duration: Integer; number of seconds the spinner should take to rotate
 *               the full 360 degrees
 *
 * Events:
 *
 *     stopped: Fired when stop() is called on the spinner and it has been
 *              detached from the DOM
 */

(function($, undefined) {

$.widget("TODONS.spinner", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(processing='spinner')",
        position: {my: 'right center', at: 'right center'},
        duration: 1,
        isRunning: false
    },

    _create: function() {
        var popup, zIndex;

        popup = $.mobile.loadPrototype("spinner").find("div:first");

        zIndex = this.element.css('z-index');
        zIndex = zIndex ? zIndex + 1 : 10;
        popup.css('z-index', zIndex);

        this.options.position['of'] = this.element;

        this.popup = popup;
    },

    start: function () {
        if (!this.isRunning) {
            var spinner = this.popup.find('.ui-spinner');
            spinner.css('-webkit-animation-duration', this.options.duration + 's');

            this.element.after(this.popup);
            this.popup.position(this.options.position);

            this.isRunning = true;
        }
    },

    stop: function () {
      if (this.isRunning) {
          this.popup.detach();
          this.element.trigger('stopped');
          this.isRunning = false;
      }
    }
});

// auto self-init widgets; NB pageshow is used here so the DOM elements
// have already been drawn before positioning is done
$(document).bind("pagecreate", function (e) {
    $($.TODONS.spinner.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .spinner();
});

})(jQuery);
