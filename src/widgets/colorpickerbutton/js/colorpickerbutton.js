(function( $, undefined ) {

$.widget( "mobile.colorpickerbutton", $.mobile.widget, {
	options: {
		theme: null,
		disabled: false,
		inline: true,
		corners: true,
		shadow: true,
		overlayTheme: "a",
		closeText: "Close",
		initSelector: "input[type='color'], :jqmData(type='color'), :jqmData(role='colorpickerbutton')"
	},
	_create: function() {

		var
		  self = this,

		  o = this.options,

		  select = this.element.wrap( "<div class='ui-select'>" ),

		  selectID = select.attr( "id" ),

		  label = $( "label[for='"+ selectID +"']" ).addClass( "ui-select" ),

                  buttonContents = $("<span/>")
                    .html("&#x2587;&#x2587;&#x2587;"),

		  buttonId = selectID + "-button",

		  menuId = selectID + "-menu",

		  button = $( "<a>", {
				  "href": "#",
				  "role": "button",
				  "id": buttonId,
				  "aria-haspopup": "true",
				  "aria-owns": menuId
			  })
			  .append(buttonContents)
			  .insertBefore( select )
			  .buttonMarkup({
				  theme: o.theme,
				  inline: o.inline,
				  corners: o.corners,
				  shadow: o.shadow
			  }),

		  thisPage = select.closest( ".ui-page" ),

		  //button theme
		  theme = /ui-btn-up-([a-z])/.exec( button.attr( "class" ) )[1],

		  screen = $( "<div>", {"class": "ui-selectmenu-screen ui-screen-hidden"})
					  .appendTo( thisPage ),

		  listbox = $("<div>", { "class": "ui-selectmenu ui-selectmenu-hidden ui-overlay-shadow ui-corner-all ui-body-" + o.overlayTheme + " " + $.mobile.defaultDialogTransition})
				  .insertAfter(screen),

                  canvas = $("<div/>", {"id" : "canvas"})
                    .appendTo(listbox),

                  realcanvas = $("<div/>")
                    .appendTo(canvas)
                    .colorpicker()/*,

                  closeButton = $("<a/>", {
                    "href": "#",
                    "role": "button"
                    })
                    .text(o.closeText)
                    .appendTo(canvas)
                    .buttonMarkup({
                      theme: o.theme,
                      inline: true,
                      corners: o.corners,
                      shadow: o.shadow
                    })*/;

                console.log("colorpickerbutton._create: Setting listbox [" + realcanvas.attr("width") + " x " + realcanvas.attr("height") + "]");

                listbox
                  .attr("width", realcanvas.attr("width"))
                  .attr("height", realcanvas.attr("height"));

                listbox
                  .css("width", realcanvas.attr("width"))
                  .css("height", realcanvas.attr("height"));

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
                        realcanvas: realcanvas,
			select: select,
			selectID: selectID,
			label: label,
			buttonId: buttonId,
			menuId: menuId,
			thisPage: thisPage,
			button: button,
			screen: screen,
			listbox: listbox,
                        canvas: canvas,
			placeholder: "",
                        buttonContents: buttonContents
		});

		// Support for using the native select menu with a custom button

		// Create list from select, update state
		self.refresh();

		// Button events
		button.bind( "vclick keydown" , function( event ) {
			if ( event.type == "vclick" ||
						event.keyCode && ( event.keyCode === $.mobile.keyCode.ENTER ||
																	event.keyCode === $.mobile.keyCode.SPACE ) ) {

				self.open();
				event.preventDefault();
			}
		});

		// Events on "screen" overlay
		screen.bind( "vclick", function( event ) {
		  self.close();
		});
	},

	refresh: function( forceRebuild ) {
          var r, g, b, r_str, g_str, b_str, hsl,
	      self = this,
              clrValue = this.element.attr("value");

          if (undefined === clrValue)
            clrValue = "#ff0000";

          self.buttonContents.css("color", clrValue);
	},

	open: function() {
		if ( this.options.disabled ) {
			return;
		}

		var self = this,
                        targetWidget = self.canvas.parent(),
			menuHeight = targetWidget.outerHeight(),
			menuWidth = targetWidget.outerWidth(),
			scrollTop = $( window ).scrollTop(),
			btnOffset = self.button.offset().top,
			screenHeight = window.innerHeight,
			screenWidth = window.innerWidth;

                console.log("colorpickerbutton.open: menuHeight = " + menuHeight + ", menuWidth = " + menuWidth);

		//add active class to button
		self.button.addClass( $.mobile.activeBtnClass );

		//remove after delay
		setTimeout(function() {
			self.button.removeClass( $.mobile.activeBtnClass );
		}, 300);

		self.screen.height( $(document).height() )
			.removeClass( "ui-screen-hidden" );

		// Try and center the overlay over the button
		var roomtop = btnOffset - scrollTop,
			roombot = scrollTop + screenHeight - btnOffset,
			halfheight = menuHeight / 2,
			maxwidth = parseFloat( targetWidget.css( "max-width" ) ),
			newtop, newleft;

                console.log("colorpickerbutton.open: maxwidth = " + maxwidth);

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

                self.listbox
                  .attr("width", self.realcanvas.attr("width"))
                  .attr("height", self.realcanvas.attr("height"));

                self.listbox
                  .css("width", self.realcanvas.attr("width"))
                  .css("height", self.realcanvas.attr("height"));

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

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$( $.mobile.colorpickerbutton.prototype.options.initSelector, e.target )
		.not( ":jqmData(role='none'), :jqmData(role='nojs')" )
		.colorpickerbutton();
});

})( jQuery );
