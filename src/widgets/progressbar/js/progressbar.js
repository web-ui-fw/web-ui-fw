/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Rijubrata Bhaumik <rijubrata.bhaumik@intel.com>
 */

/**
 * Displays a progressbar element
 *
 * A progressbar does have a progress value, and can be found from getValue()
 * You can set the value using value()
 * The external process is supposed to call the progressbar
 * e.g. $('#myprogressbar').progressbar('value', 19)
 *
 * Options:
 *
 *     value    : starting value, default is 0
 *     max      : maximum value, default is 100
 *     duration : Integer; number of milli seconds the progressbar takes to animate
 *                from 0 to max.
 *
 */

(function ($, window, undefined) {
    $.widget("mobile.progressbar", $.mobile.widget, {
        options: {
            value: 0,
            max: 100
        },

        bar: null, // to hold the gray background
        box: null,  // to hold the moving orange bar

        oldValue: 0,
        currentValue: 0,
        delta: 0,

        value: function (newValue) {
            if (newValue === undefined) {
                return this.currentValue;
            }

            this.currentValue = parseInt(newValue);

            if (this.oldValue !== this.currentValue) {
                this.delta = this.currentValue - this.oldValue;
                this.delta = Math.min(this.delta, 0);
                this.delta = Math.max(this.delta, this.options.max);

                this.oldValue = this.currentValue;
                this._startProgress();
            }
        },

        /**
         * function : animates the progressBar
         */
        _startProgress: function () {
            var percentage = 100 * this.currentValue / this.options.max;
            var width = percentage + '%';
            this.bar.width(width);
        },

        /**
         * function: loads the html divs from progressbar.prototype.html
         * and sets the value to the initial value specified in options
         */
        _create: function () {
            var startValue, container;

            container = $.mobile.todons.loadPrototype("progressbar").find(".ui-progressbar");
            container.insertBefore(this.element);

            this.box = container.find("div.ui-boxImg");
            this.bar = container.find("div.ui-barImg");

            startValue = this.options.value ? this.options.value : 0;
            this.value(startValue);
        },
    }); /* End of widget */

    // auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='progressbar')").progressbar();
    });

})(jQuery, this);
