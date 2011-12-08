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
//     stop: Fired when stop() is called on the processingcircle

(function($) {

$.widget("todons.processingcircle", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(role='processingcircle')",
        theme: 'b'
    },

    _isRunning: false,

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

        this.element.find('.ui-processingcircle-container').remove();

        this.element.append(this.html);
        this.circle = this.element.find('.ui-processingcircle');

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
        if (!this._isRunning) {
            this.circle.addClass('ui-processingcircle-spin');
            this._isRunning = true;
        }
    },

    stop: function () {
        if (this._isRunning) {
            this.circle.removeClass('ui-processingcircle-spin');
            this.element.trigger('stop');
            this._isRunning = false;
        }
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
$(document).bind("pagecreate", function (e) {
    $($.todons.processingcircle.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .processingcircle();
});

})(jQuery);
