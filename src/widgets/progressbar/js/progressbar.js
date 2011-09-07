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
 *     value	: starting value, default is 0
 *	   max		: maximum value, default is 100		
 *     duration : Integer; number of milli seconds the progressbar takes to animate
 *				 from 0 to max. 
 *
 */

(function ($, window, undefined) {
    $.widget("mobile.progressbar", $.mobile.widget, {
        options: {
            value: 0,
            max: 100,
            duration: 10000,	
        },

        data: {
            bar: 0,		// to hold the gray background
            box: 0		// to hold the moving orange bar
        },

        oldValue: 0,
        delta: 0,

        getValue: function () {
            return this.options.value;
        },

        value: function (newValue) {
            if (newValue === undefined) {
                return this.getValue();
            }
            this.options.value = parseInt(newValue);
            this._refreshValue();
        },

        _percentage: function () {
            return 100 * this.getValue() / this.options.max;
        },

		/**
		 * function: update the value and call _startProgress()
		 */
        _refreshValue: function (val /*now*/ ) {
            this.delta = this.getValue() - this.oldValue;
            if (this.oldValue !== val) {
                this.oldValue = this.getValue();
                this.value(val);
                this._startProgress();
            }
        },

        /**
         * function : animates the progressBar
         */
        _startProgress: function () {
            var obj = this;
            this.data.bar.animate({
                width: obj._percentage() + '%',
            }, {
                duration: this.options.duration * (obj.delta) / 100,
                specialEasing: {
                    width: 'linear',
                },
            });
        },
		
		/**
		 * function: loads the html divs from progressbar.prototype.html
		 * and calls _refreshValue();
		 */
        _create: function () {

            var self = this,
                select = this.element,
                o = this.options;

            var container = $.mobile.loadPrototype("progressbar").find("#progressbar").insertBefore(select);

            $.extend(self, {
                container: container
            });

            self.data.box = container.find("#boxImgId");
            self.data.bar = container.find("#barImgId");

            o.value = parseInt(parseInt(self.data.bar.css('width')) / parseInt(self.data.box.css('width')) * 100);
            self._refreshValue();
        },
    }); /* End of widget */
	
	// auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='progressbar')").progressbar();
    });

})(jQuery, this);