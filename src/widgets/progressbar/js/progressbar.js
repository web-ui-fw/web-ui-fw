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
			duration	: 20000,
		},
				
		min : 0,
		
		data: {
			uuid		: 0,
			bar         : 0,
			box			: 0
		},		
		
		startProgress: function(value) {
			this.data.bar.animate({
				    width: '100%'
				   }, this.options.duration, function() {
				       // Animation complete Callback 
				       _completed();
			  	  },
			  	  /*
			  	  step: function(now,fx) {
			  	  	var data = fx.elem.id + ' ' + fx.prop + ': ' + now;
			  	  }
			  	  */
			  	 );
		},
		
		_completed: function() {
			// animation is finished 
			alert("callback func animation complete");	
		}
		
		_value: function() {
			var val = this.options.value;
			// normalize the invalid value
			if (typeof val !== "number") {
				val = 0;
			}	
			return Math.min(this.options.max, Math.max(this.min, val ));
		},
		
		_destroy: function() {
			/*
			this.data.bar.remove();
			this.data.box.remove();
			this.text1.remove();
			this.text2.remove();
			this.text3.remove();
			this.progressbar.remove();
			this.cancel-button.remove();
			this.element.removeClass("ui-upper-progressbar-container ui-progressbar"); 
			this.cancelContainer.remove();
			*/
			console.log("_destroy is called");
		},
		
		_setOptions: function( key, value) {
			if ( key === "value") {
				this.options.value = value;
			}
		},
		
		_create: function() {
			var container = this.element;
			var obj = this;
			
			/* Give unique id to allow more instances in one page. */
            this.data.uuid += 1;
            var myUUID = this.data.uuid;
            
            container.attr("id", "ui-progressbar-container" + this.data.uuid);
  		
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
				alert("value=" + obj.options.data.value);
			}); // end of click		
			
			/* caller of the progress bar widget should start the progressbar using startProgress */
			obj.startProgress();	
						
		},			
	}); /* End of widget */
	
	var now = new Date();
    $($.mobile.progressbar.prototype.data.uuid = now.getTime());
	
})(jQuery, this);
