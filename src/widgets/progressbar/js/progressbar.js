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
            title : "Progressbar"           
        },

        data: {
            uuid: 0,
            bar: 0,
            box: 0
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

        _create: function () {
        	console.log("in _create in progressbar");
        	
        var self = this,
        	select = this.element,
        	o = this.options,
        	container = $.mobile.loadPrototype("progressbar").find("#progressbar")
        		.insertBefore(select);
    		
    		console.log("looking for" + container.find("#progressbar")[0]);	
    		
            
            $.extend ( self, {
            	container: container
            });
            
            self.options.value = parseInt(parseInt(self.data.bar.css('width')) / parseInt(self.data.box.css('width')) * 100);
            this._refreshValue();

        },
    }); /* End of widget */

   // var now = new Date();
   // $($.mobile.progressbar.prototype.data.uuid = now.getTime());
    
    $( document ).bind( "pagecreate", function( e ){
        $( e.target ).find( ":jqmData(role='progressbar')" ).progressbar();
    });
  
})(jQuery, this);