/*
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
 *          Salvatore Iovene <salvatore.iovene@intel.com
 */

(function ($, undefined) {

$.widget("mobile.simple", $.mobile.widget, {
    // The `options` are a way to store widget specific settings.
    // Technically, this is nothing more than a dictionary can be accessed
    // globally throughout the widget's scope.
    options: {
        // The `initSelector` is used at the bottom of this file, when we
        // actually bind any HTML element that contains the attribute
        // `data-role="simple"` to this widget.
        initSelector: ":jqmData(role='simple')",

        // We want to let the user specify a theme for this widget. See:
        // http://jquerymobile.com/demos/1.0/docs/api/themes.html
        theme: null,

        // To demostrate some methods implemented when writing a JQM widget,
        // we're adding a number that increases by one regularly. The
        // following setting is the interval of time between updates.
        updateInterval: 1000
    },

    // Let's store here some constants for aid.
    _constants: {
        status_stopped: 0,
        status_running: 1,
        startstop_class: 'startstopbtn'
    },

    // Sometimes there are variables that you will need all over your widget,
    // and for that you can use a `_data` dictionary (although it can be
    // named whatever you want.)
    // It really is nothing but a big global container, but we don't want to
    // pollute `options` with things that are not settings.
    _data: {
        // We store our timer here, because we will need to clear it later.
        timer: 0,

        // We store the status of our timer here (stopped or running).
        status: 0
    },

    // We use this function to change the text on the Start/Stop counter
    // button when the status changes.
    _setButtonText: function(self, text) {
        $span = self.element.find(
            'a.' + self._constants.startstop_class + ' span.ui-btn-text')
        $span.text(text);
    },

    // This will reset the number to its initial value.
    _reset: function(self) {
        // Let's start with 0.
        $number = self.element.find('.number')
        $number.text(0);
    },

    // This is the function that will increase our number.
    _increaseNumber: function(self) {
        $number = self.element.find('.number')

        // Let's get and increse the number.
        value = parseInt($number.text());
        $number.text(value + 1);

        return true;
    },

    // This will start our timer.
    _start: function(self) {
        self._data.timer = setInterval(
            function() {
                return self._increaseNumber(self);
            },
            self.options.updateInterval);
        self._data.status = self._constants.status_running;
        self._setButtonText(self, "Stop counter");
    },

    // This will stop our timer.
    _stop: function(self) {
        clearTimeout(self._data.timer);
        self._data.status = self._constants.status_stopped;
        self._setButtonText(self, "Start counter");
    },

    // The `_create` method is called when the widget is created. This is the
    // place in which the following tasks are usually performed:
    // * Initialization of settings
    // * Creation and initialization of DOM elements
    // * Any other code that should be run at the beginning of the life cycle
    //   of the widget.
    _create: function() {
        // We store `this` in a variable because we will need it later in
        // callbacks functions, when `this` will be something else.
        var self = this,

        // We need the page so that we can bind actions to the page being
        // shown or closed.
        page = self.element.closest('.ui-page');

        // `this.element` is the element to which our `options.initSelector`
        // is applied in the HTML code. Here we're starting to add some more
        // HTML to it.
        self.element.append(
            '<p>This is the Simple Widget. It can be used as a starting ' +
            'point or learning aid for building new JQM widgets.</p>');

        // For the purposes of this widget, we will here add some text that
        // contains a number that we will increase regularly, with a timer.
        // We will use the `updateInterval` setting defined in `options`.
        $number = $('<span class="number">');

        // Here we style our number a little.
        $number.css({
            'text-align' : 'center',
            'font-size'  : '2em',
            'font-weight': 'bold',
            'display'    : 'block',
            'line-height': '2em'
        });

        // Let's also add it to the DOM.
        self.element.append($number);

        // Let's add a button that starts the timer, and theme it correctly.
        $button = $('<a href="#">Start counter</a>');
        $button.buttonMarkup({theme: self.options.theme});
        $button.addClass(self._constants.startstop_class);
        $button.attr('data-' + ($.mobile.ns || "") + 'role', 'button');
        self.element.append($button);

        $button.bind('vclick', function(event) {
            if (self._data.status == 0) {
                // Timer is not running, let's start it.
                self._start(self);
            } else {
                // Timer is running, let's stop it.
                self._stop(self);
            }

            event.stopPropagation(); 
        });

        if (page) {
            // Before the animation for hiding the page starts, let's stop
            // the timeout.
            page.bind('pagebeforehide', function() {
                self._stop(self);
            });

            // After the animation for hiding the page ends, we can reset the
            // number to 0. We didn't do it in `pagebeforehide` because we
            // didn't want the user to see the number change to zero before
            // their eyes.
            page.bind('pagehide', function() {
                self._reset(self);
            });

            // Each time the page is shown, we start over.
            page.bind('pageshow', function() {
                self._reset(self);
            });
        }
    },

    // The `_destroy` method is the place in which you should release and
    // reset the things you've used.
    _destroy: function() {
        // Let's remove the HTML we have created, so everything is created
        // from scratch when we start again.
        this.html.remove();
    },

    _setOption: function(key, value) {
        if (value !== this.options[key]) {
            switch (key) {
            case 'updateInterval':
                this.options.updateInterval = value;
                break;
            case 'disabled':
                this.element[value ? "addClass" : "removeClass"]("ui-disabled");
                this.options.disabled = value;
                break;
            }
            this.refresh();
        }
    },

    // This method updates the widget to reflect the changes that have
    // happened outside of our control. In this case, we're going to imagine
    // that a user changed our `updateInterval`. If that happens, we can
    // reset our timer.
    refresh: function() {
        if (this._data.status == this._constants.status_running) {
            this._stop(this);
            this._start(this);
        }
    }
});

$(document).bind("pagecreate create", function(e) {
    $($.mobile.simple.prototype.options.initSelector, e.target).simple();
});

})(jQuery);

/* vim:ft=javascript.jquery:ai:et:sw=4:ts=4:
 */
