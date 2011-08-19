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
			increment	: 2,
			speed 		: 15,
			showText 	: true,	
			boxImage	:'../images/progressbar.gif',
			barImage	:'../images/progressbg_yellow.gif',
			width		: 120,
			height		: 12
		},
				
		data: {
			uuid		: 0,
			value		: 0,
			max			: 100,
			min			: 0
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
				text: 'text1',								
			}).appendTo(upperProgressBarContainer);
			
			$('<div/>', {
				id: 'progressbar',
														
			}).appendTo(upperProgressBarContainer);			
			
				
			$('<span/>', {
				id: 'text2',
				text: 'text2',								
			}).appendTo(upperProgressBarContainer);
			
			$('<span/>', {
				id: 'text3',
				text: 'text3',								
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
			
			$('<div/>', {
					id: 'boxImgId',					
				}).appendTo(progressbar);
				
			$('<div/>', {
					id: 'barImgId',					
				}).appendTo(progressbar);
			
				
							
			$('#cancel-button').click(function() {
				//alert("clicked !!");						
				/*
				$('boxImgId').css("background-image",  "url(../images/progressbg_yellow.gif)");	
				$('boxImgId').css("padding", "0");
				$('boxImgId').css("margin", "0");
				*/	
			});			
						
		},
				
			
		
	}); /* End of widget */
	
	var now = new Date();
    $($.mobile.progressbar.prototype.data.uuid = now.getTime());
	
})(jQuery, this);
