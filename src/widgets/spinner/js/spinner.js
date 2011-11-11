/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

// Displays a spinner icon over the DOM element it is applied to
// (the "target").
//
// A spinner doesn't have a progress value, as it is used in situations
// where the exact amount of time a process would take is not known.
//
// Apply a spinner using the spinner() method or by adding a
// data-processing="spinner" attribute to an element.
//
// Once you have a spinner, call the start() method on it to display it
// and start the animation.
//
// The spinner uses a div directly after the element. Calling stop()
// on a spinner detaches this element from the DOM.
//
// Events:
//
//     stopped: Fired when stop() is called on the spinner and it has been
//              detached from the DOM

(function($) {

$.widget("todons.spinner", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(role='spinner')",
        isRunning: false
    },

    _create: function() {
        var page = this.element.closest('.ui-page'),
            self = this;

        this.html = $('<div class="ui-spinner-container">' +
                      '<div class="ui-spinner">' +
                      '</div>' +
                      '</div>');

        this.element.append(this.html);

        if (page && !page.is(':visible')) {
            page.bind('pageshow', function () {
                self.refresh();
            });
        }
        else {
            this.refresh();
        }
    },

    refresh: function () {
        if (!this.isRunning) {
            this.element.find('.ui-spinner').addClass('spin');
            this.isRunning = true;
        }
    },

    stop: function () {
        if (this.isRunning) {
            this.element.find('.ui-spinner').removeClass('spin');
            this.element.trigger('stopped');
            this.isRunning = false;
        }
    },

    destroy: function () {
        this.stop();
        this.html.detach();
    }
});

// auto self-init widgets
$(document).bind("pagecreate", function (e) {
    $($.todons.spinner.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .spinner();
});

})(jQuery);
