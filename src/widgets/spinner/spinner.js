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
 * The spinner uses a div directly after the element. Calling done()
 * on a spinner detaches this element from the DOM; it also removes
 * the data-processing="spinner" attribute from the target element, if one
 * exists.
 *
 * Options:
 *
 *   position = object; positioning specifier, allowing positioning of the
 *              spinner with respect to the target element; default
 *              is to align 'right center' of the spinner
 *              with 'right center' of the target element; change by passing
 *              an object with 'my' and 'at' properties, as per the jQuery UI
 *              position() options (see http://jqueryui.com/demos/position/);
 *              e.g. to position the center of the spinner over the center
 *              of the target element, use:
 *                  position: {my:'center center', at: 'center center'}
 *              where 'my' specifies the point on the spinner, and 'at'
 *              specifies the point on the target element
 *   duration = integer; number of seconds the spinner should take to rotate
                the full 360 degrees
 */

(function($, undefined) {

$.widget("TODONS.spinner", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(processing='spinner')",
        positioning: {my: 'right center', at: 'right center'},
        duration: 1
    },

    _create: function() {
        var self = this,
            target = this.element,
            o = this.options,
            popup, zIndex, spinner;

        popup = $.mobile.loadPrototype("spinner").find("div:first");

        zIndex = target.css('z-index');
        zIndex = zIndex ? zIndex + 1 : 10;
        popup.css('z-index', zIndex);

        target.after(popup);

        o.positioning['of'] = target;

        popup.position(o.positioning);

        spinner = popup.find('.ui-spinner');

        spinner.css('-webkit-animation-duration', o.duration + 's');

        this.popup = popup;
    },

    done: function () {
    }
});

// auto self-init widgets; NB pageshow is used here so the DOM elements
// have already been drawn before positioning is done
$(document).bind("pageshow", function (e) {
    $($.TODONS.spinner.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .spinner();
});

})(jQuery);
