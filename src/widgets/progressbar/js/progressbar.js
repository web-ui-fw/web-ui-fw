/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Rijubrata Bhaumik <rijubrata.bhaumik@intel.com>
 */
(function ($, window, undefined) {
    $.widget("mobile.progressbar", $.mobile.widget, {
        options: {
            value: 0,
            max: 100,
            duration: 10000,	
            title: "Progressbar"
        },

        data: {
            bar: 0,		// to hold the gray background
            box: 0		// to hold the moving orange bar
        },

        oldValue: 0,
        delta: 0,

        _value: function () {
            return this.options.value;
        },

        value: function (newValue) {
            if (newValue === undefined) {
                return this._value();
            }
            this.options.value = parseInt(newValue);
            this._refreshValue();
        },

        _percentage: function () {
            return 100 * this._value() / this.options.max;
        },

		/**
		 * function: update the value and call _startProgress()
		 */
        _refreshValue: function (val /*now*/ ) {
            this.delta = this._value() - this.oldValue;
            if (this.oldValue !== val) {
                this.oldValue = this._value();
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
	
	// Auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        $(e.target).find(":jqmData(role='progressbar')").progressbar();
    });

})(jQuery, this);