/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

/**
 * Displays a spinner icon over the DOM element it is applied to (the
 * "masked" element).
 *
 * A spinner doesn't have a progress value, as it is used in situations
 * where the exact amount of time a process would take is not known.
 *
 * The spinner uses a div directly after the masked element. Calling done()
 * on a spinner detaches this element from the DOM; it also removes
 * the data-mask="spinner" attribute from the masked element, if one
 * exists.
 *
 * Options:
 *
 *   position = positionining specifier, allowing positioning of the
 *              spinner with respect to the masked element; default
 *              is to align 'left top' of the spinner
 *              with 'left top' of the masked element; change by passing
 *              an object with 'my' and 'at' properties, as per the jQuery UI
 *              position() options (see http://jqueryui.com/demos/position/);
 *              e.g. to position the center of the spinner over the center
 *              of the masked element, use:
 *                position: {my:'center center', at: 'center center'}
 *              where 'my' specifies the point on the spinner, at 'at'
 *              specifies the point on the masked element
 */

(function($, undefined) {

$.widget("TODONS.spinner", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(mask='spinner')",
        positioning: {my: 'left top', at: 'left top'}
    },

    _create: function() {
        var self = this,
            masked = this.element,
            o = this.options,
            popup;

        popup = $.mobile.loadPrototype("spinner").find("div:first");

        masked.after(popup);

        o.positioning['of'] = masked;

        popup.position(o.positioning);

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
