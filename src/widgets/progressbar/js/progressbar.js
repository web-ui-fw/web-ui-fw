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
			duration	: 20000,
		},
				
		data: {
			uuid		: 0,
			value		: 0,
			bar         : 0,
			box			: 0
		},		
		
		startProgress: function(value) {
			this.data.bar.animate({
				    width: '100%'
				   }, this.options.duration, function() {
				       // Animation complete Callback 
				       //value = 100;
				       //alert("callback func animation complete");
			  	   }
			  	 );
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
				obj.data.value =  parseInt(parseInt(obj.data.bar.css('width')) / parseInt(obj.data.box.css('width')) * 100 );
				alert("value=" + obj.data.value);
			}); // end of click		
			
			/* caller of the progress bar widget should start the progressbar using startProgress */
			obj.startProgress();	
						
		},			
	}); /* End of widget */
	
	var now = new Date();
    $($.mobile.progressbar.prototype.data.uuid = now.getTime());
	
})(jQuery, this);
