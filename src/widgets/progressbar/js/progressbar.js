/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Rijubrata Bhaumik <rijubrata.bhaumik@intel.com>
 */

(function($, window, undefined) {
	$.widget("mobile.progressbar", $.mobile.widget, {
		options: { 
			value		: 0,
			max			: 100,
			duration	: 10000,
		},
				
		data: {
			uuid		: 0,
			bar         : 0,
			box			: 0
		},		
		
		oldValue		: 0,
		delta			: 0,
		
		_value: function() {
			return  this.options.value;
		},
		
		value: function( newValue) {			
			if ( newValue  === undefined ) {
				return this._value();
			}		
			this.options.value = parseInt(newValue);
			this._refreshValue();			
		},
		
		_percentage: function() {
			return 100 * this._value() / this.options.max;
		},
		
		_refreshValue: function( val /*now*/) {
			this.delta = this._value() - this.oldValue;
			if(this.oldValue !== val) {
				this.oldValue = this._value();
				this.value(val);
				this._trigger("change");
			}
		},
		
		_trigger: function(action) {
			// animate here if there is a change in value	
			if (action === "change") {
				this.startProgress();
			}
		},
		
	     startProgress: function() {
				var obj = this;
				this.data.bar.animate({
					    width: obj._percentage() + '%',
					  	}, {
						    duration : this.options.duration * ( obj.delta) / 100 ,
						    specialEasing : {
							    width: 'linear',
						    }, 
							complete: function() {
						   		obj._completed();		
						    },						  
				  	   }
				  	 );
			},		
		
		_completed: function() {
			console.log("call back from progressbar animation");	
		},
		
		_create: function() {
			var container = this.element;
			var obj = this;
			
			/* Give unique id to allow more instances in one page. */
            this.data.uuid += 1;
            var myUUID = this.data.uuid;
            
            container.attr("id", "ui-progressbar-container" + this.data.uuid);
            
            console.log("creating ui-progressbar-container with id " + this.data.uuid);  
			
			var upperProgressBarContainer = $.createUpperProgressBarContainer();
			upperProgressBarContainer.attr("id", "ui-upper-progressbar-container");
			
			$('<div/>', {
				id: 'text1',
				text: 'TextText',								
			}).appendTo(upperProgressBarContainer);
			
			$('<div/>', {
				id: 'progressbar',
														
			}).appendTo(upperProgressBarContainer);			
			
				
			$('<span/>', {
				id: 'text2',
				text: 'Text',								
			}).appendTo(upperProgressBarContainer);
			
			$('<span/>', {
				id: 'text3',
				text: 'TextTextTextText',								
			}).appendTo(upperProgressBarContainer);			
			
			
			var cancelContainer = $("<div/>", {
				id: "cancel-container"
			});
			
			$('<div/>', {
				id: 'cancel-button',
				text: 'Cancel',
				'data-role': 'button',
				'data-inline': true,			
			}).appendTo(cancelContainer);
			
			
			container.append(upperProgressBarContainer);
			container.append(cancelContainer);	
			
			
			this.data.box = $('<div/>', {
					id: 'boxImgId',					
				}).appendTo(progressbar);
							
			this.data.bar = $('<div/>', {
					id: 'barImgId',					
				}).appendTo(progressbar);			
							
			
							
			cancelContainer.find('#cancel-button').click(function() {
				//alert("cancel button clicked");
				if (obj.data.bar.is(':animated')) {
					obj.data.bar.stop();
				};
				obj.options.value =  parseInt(parseInt(obj.data.bar.css('width')) / parseInt(obj.data.box.css('width')) * 100 );
				alert("value=" + obj.options.value);
			}); // end of click		
			
			this._refreshValue();
						
		},			
	}); /* End of widget */
	
	var now = new Date();
    $($.mobile.progressbar.prototype.data.uuid = now.getTime());
	
})(jQuery, this);