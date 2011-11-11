/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

// Displays a spinning circle in the DOM element it is applied to
// (the "target").
//
// A processingcircle doesn't have a progress value, as it is used in situations
// where the exact amount of time a process would take is not known.
//
// Apply a processingcircle using the processingcircle() method or by adding a
// data-role="processingcircle" attribute to an element.
//
// The processingcircle uses a div directly after the element. Calling stop()
// on a processingcircle detaches this element from the DOM. Calling
// refresh() on it restarts the animation.
//
// Events:
//
//     stopped: Fired when stop() is called on the processingcircle

(function($) {

$.widget("todons.processingcircle", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(role='processingcircle')",
        isRunning: false,
        theme: 'b'
    },

    _create: function() {
        var page = this.element.closest('.ui-page'),
            self = this,
            theme;

        theme = this.element.jqmData('theme') || this.options.theme;

        this.html = $('<div class="ui-processingcircle-container ui-body-' + theme + '">' +
                      '<div class="ui-processingcircle">' +
                      '<div class="ui-processingcircle-hand ui-bar-' + theme + '" />' +
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
            this.element.find('.ui-processingcircle').addClass('spin');
            this.isRunning = true;
        }
    },

    stop: function () {
        if (this.isRunning) {
            this.element.find('.ui-processingcircle').removeClass('spin');
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
    $($.todons.processingcircle.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .processingcircle();
});

})(jQuery);
