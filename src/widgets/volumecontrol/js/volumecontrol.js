(function( $, undefined ) {

$.widget( "mobile.volumecontrol", $.mobile.widget, {
	options: {
		theme: null,
		disabled: false,
		inline: true,
		corners: true,
		shadow: true,
		overlayTheme: "a",
		closeText: "Close"
	},
	_create: function() {
		var
                  self = this,

		  o = this.options,

		  select = this.element,

		  selectID = select.attr( "id" ),

		  thisPage = select.closest( ".ui-page" ),

		  screen = $( "<div>", {"class": "ui-selectmenu-screen ui-screen-hidden"})
					  .appendTo( thisPage ),

		  listbox = $("<div>", { "class": "ui-selectmenu ui-selectmenu-hidden ui-overlay-shadow ui-corner-all ui-body-" + o.overlayTheme + " " + $.mobile.defaultDialogTransition + " colorpicker-canvas-border" })
				  .insertAfter(screen);
/*
                  canvas = $("<canvas width='288' height='256'>Colour picker canvas</canvas>")
                    .appendTo(listbox),
*/
                this.element.css("display", "none");

		// Disable if specified
		if ( o.disabled ) {
			this.disable();
		}

		// Events on native select
		select.change(function() {
			self.refresh();
		});

		// Expose to other methods
		$.extend( self, {
			select: select,
			selectID: selectID,
			thisPage: thisPage,
			listbox: listbox,
/*
			canvas: canvas,
*/
			screen: screen
		});

		// Support for using the native select menu with a custom button

		// Create list from select, update state
		self.refresh();

		// Events on "screen" overlay
		screen.bind( "vclick", function( event ) {
		  self.close();
		});
	},

	refresh: function( forceRebuild ) {
	},

	open: function() {
		if ( this.options.disabled ) {
			return;
		}

		var self = this,
			menuHeight = self.canvas.parent().outerHeight(),
			menuWidth = self.canvas.parent().outerWidth(),
			scrollTop = $( window ).scrollTop(),
			btnOffset = self.button.offset().top,
			screenHeight = window.innerHeight,
			screenWidth = window.innerWidth;

		//add active class to button
		self.button.addClass( $.mobile.activeBtnClass );

		//remove after delay
		setTimeout(function() {
			self.button.removeClass( $.mobile.activeBtnClass );
		}, 300);

		function focusMenuItem() {
			self.canvas.find( ".ui-btn-active" ).focus();
		}

		self.screen.height( $(document).height() )
			.removeClass( "ui-screen-hidden" );

		// Try and center the overlay over the button
		var roomtop = btnOffset - scrollTop,
			roombot = scrollTop + screenHeight - btnOffset,
			halfheight = menuHeight / 2,
			maxwidth = parseFloat( self.canvas.parent().css( "max-width" ) ),
			newtop, newleft;

		if ( roomtop > menuHeight / 2 && roombot > menuHeight / 2 ) {
			newtop = btnOffset + ( self.button.outerHeight() / 2 ) - halfheight;
		} else {
			// 30px tolerance off the edges
			newtop = roomtop > roombot ? scrollTop + screenHeight - menuHeight - 30 : scrollTop + 30;
		}

		// If the menuwidth is smaller than the screen center is
		if ( menuWidth < maxwidth ) {
			newleft = ( screenWidth - menuWidth ) / 2;
		} else {

			//otherwise insure a >= 30px offset from the left
			newleft = self.button.offset().left + self.button.outerWidth() / 2 - menuWidth / 2;

			// 30px tolerance off the edges
			if ( newleft < 30 ) {
				newleft = 30;
			} else if ( ( newleft + menuWidth ) > screenWidth ) {
				newleft = screenWidth - menuWidth - 30;
			}
		}

		self.listbox.append( self.canvas )
			.removeClass( "ui-selectmenu-hidden" )
			.css({
				top: newtop,
				left: newleft
			})
			.addClass( "in" );

		focusMenuItem();

		// duplicate with value set in page show for dialog sized selects
		self.isOpen = true;
	},

	_focusButton : function(){
		var self = this;
		setTimeout(function() {
			self.button.focus();
		}, 40);
	},

	close: function() {
		if ( this.options.disabled || !this.isOpen ) {
			return;
		}

		var self = this;

		self.screen.addClass( "ui-screen-hidden" );
		self.listbox.addClass( "ui-selectmenu-hidden" ).removeAttr( "style" ).removeClass( "in" );
		self.canvas.appendTo( self.listbox );
		self._focusButton();

		// allow the dialog to be closed again
		this.isOpen = false;
	},

	disable: function() {
		this.element.attr( "disabled", true );
		this.button.addClass( "ui-disabled" ).attr( "aria-disabled", true );
		return this._setOption( "disabled", true );
	},

	enable: function() {
		this.element.attr( "disabled", false );
		this.button.removeClass( "ui-disabled" ).attr( "aria-disabled", false );
		return this._setOption( "disabled", false );
	}
});

})( jQuery );
