(function( $, undefined ) {

$.widget( "mobile.colourpicker", $.mobile.widget, {
	options: {
		theme: null,
		disabled: false,
		inline: true,
		corners: true,
		shadow: true,
		overlayTheme: "a",
		hidePlaceholderMenuItems: true,
		closeText: "Close",
		initSelector: "input[type='color'], :jqmData(type='color'), :jqmData(role='colourpicker')"
	},
	_create: function() {
		var
                  self = this,

		  o = this.options,

		  select = this.element.wrap( "<div class='ui-select'>" ),

		  selectID = select.attr( "id" ),

		  label = $( "label[for='"+ selectID +"']" ).addClass( "ui-select" ),

		  // IE throws an exception at options.item() function when
		  // there is no selected item
		  // select first in this case
		  selectedIndex = select[ 0 ].selectedIndex == -1 ? 0 : select[ 0 ].selectedIndex,

                  buttonContents = $("<span/>", { 
                    class : "colourpicker-button-span"
                  })
                  .html("&#x2587;&#x2587;&#x2587;"),


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

	  //vars for non-native menus
		  options = select.find("option"),

		  buttonId = selectID + "-button",

		  menuId = selectID + "-menu",

		  thisPage = select.closest( ".ui-page" ),

		  //button theme
		  theme = /ui-btn-up-([a-z])/.exec( button.attr( "class" ) )[1],

		  screen = $( "<div>", {"class": "ui-selectmenu-screen ui-screen-hidden"})
					  .appendTo( thisPage ),

		  listbox = $("<div>", { "class": "ui-selectmenu ui-selectmenu-hidden ui-overlay-shadow ui-corner-all ui-body-" + o.overlayTheme + " " + $.mobile.defaultDialogTransition + " colourpicker-canvas-border" })
				  .insertAfter(screen),

                  canvas = $("<canvas width='288' height='256'>Colour picker canvas</canvas>")
                    .appendTo(listbox),

                  canvasSelector = $("<div>", {"class" : "colourpicker-canvas-selector"})
                    .appendTo(listbox),

                  luminenceSelector = $("<div>", {"class" : "colourpicker-canvas-selector"})
                    .appendTo(listbox);

                this.element.css("display", "none");

                this._initCanvas(canvas, canvasSelector, luminenceSelector);

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
			optionElems: options,
			selectID: selectID,
			label: label,
			buttonId: buttonId,
			menuId: menuId,
			thisPage: thisPage,
			button: button,
			screen: screen,
			listbox: listbox,
			canvas: canvas,
                        canvasSelector: canvasSelector,
                        luminenceSelector: luminenceSelector,
			placeholder: "",
                        dragging: false,
                        draggingHS: true,
                        dragging_hsl : {
                          h : -1,
                          s : -1,
                          l : -1
                        },
                        selectorDraggingOffset : {
                          x : -1,
                          y : -1
                        },
                        buttonContents: buttonContents
		});

		// Support for using the native select menu with a custom button

		// Create list from select, update state
		self.refresh();

		$( document ).bind( "vmousemove", function( event ) {
			if ( self.dragging ) {
//				self.refresh( event );
				return false;
			}
		});

		$( document ).bind( "vmouseup", function( event ) {
			if ( self.dragging ) {
                                self.dragging = false;
//				self.refresh( event );
				return false;
			}
		});

                canvas.bind( "vmousedown", function (event) {
                  if (event.offsetY >= 0 && event.offsetY <= 256) {
                    if (event.offsetX >= 0 && event.offsetX <= 256) {
                      self.dragging = true;
                      self.draggingHS = true;
                    }
                    else
                    if (event.offsetX >= parseInt(canvas.attr("width")) - 16 && 
                        event.offsetX <= parseInt(canvas.attr("width"))) {
                      self.dragging = true;
                      self.draggingHS = false;
                    }
                  }
                  return self._canvasDownAndMove(self, event);
                });

                canvas.bind( "vmousemove", function (event) {
                  if (self.dragging)
                    return self._canvasDownAndMove(self, event);
                  return false;
                });

                canvasSelector.bind( "vmousedown", function (event) {
                  self.dragging = true;
                  self.draggingHS = true;
                  self.selectorDraggingOffset.x = event.offsetX;
                  self.selectorDraggingOffset.y = event.offsetY;
                  self.dragging_hsl.h = parseInt(self.canvasSelector.css("left"));
                  self.dragging_hsl.s = parseInt(self.canvasSelector.css("top"));
                  self.dragging_hsl.l = parseInt(self.luminenceSelector.css("top"));

//                  console.log("select.vmousedown: (" + self.dragging_hsl.h + ", " + self.dragging_hsl.s + ")");
                  return true;
                });

                luminenceSelector.bind( "vmousedown", function (event) {
                  self.dragging = true;
                  self.draggingHS = false;
                  self.selectorDraggingOffset.x = event.offsetX;
                  self.selectorDraggingOffset.y = event.offsetY;
                  self.dragging_hsl.h = parseInt(self.canvasSelector.css("left"));
                  self.dragging_hsl.s = parseInt(self.canvasSelector.css("top"));
                  self.dragging_hsl.l = parseInt(self.luminenceSelector.css("top"));

//                  console.log("lmnnce.vmousedown: (" + self.dragging_hsl.l + ")");
                  return true;
                });

                canvasSelector.bind( "vmousemove", function (event) {
                  var eventHandled = false,
                      potential_h = self.dragging_hsl.h + event.offsetX - self.selectorDraggingOffset.x,
                      potential_s = self.dragging_hsl.s + event.offsetY - self.selectorDraggingOffset.y;

                  if (self.dragging) {
                    if (potential_h >= 0 && potential_h <= 255) {
                      self.dragging_hsl.h = potential_h;
                      self.canvasSelector.css("left", potential_h);
                      eventHandled = true;
                    }
                    if (potential_s >= 0 && potential_s <= 255) {
                      self.dragging_hsl.s = potential_s;
                      self.canvasSelector.css("top",  potential_s);
                      eventHandled = true;
                    }
                  }

                  if (eventHandled) {
                    self._updateCanvasSelectorBackgroundClr(self);
//                    console.log("select.vmousemove: (" + self.dragging_hsl.h + ", " + self.dragging_hsl.s + ")");
                  }

                  return eventHandled;
                });

                luminenceSelector.bind( "vmousemove", function (event) {
                  var eventHandled = false,
                      potential_l = self.dragging_hsl.l + event.offsetY - self.selectorDraggingOffset.y;

                  if (self.dragging && !self.draggingHS) {
                    if (potential_l >= 0 && potential_l <= 255) {
                      self.dragging_hsl.l = potential_l;
                      self.luminenceSelector.css("top",  potential_l);
                      eventHandled = true;
                    }
                  }

                  if (eventHandled) {
                    self._fillColours(self.canvas, self.dragging_hsl.l / 255.0);
                    self._updateCanvasSelectorBackgroundClr(self);
//                    console.log("lmnnce.vmousemove: (" + self.dragging_hsl.l + ")");
                  }

                  return eventHandled;
                });

                canvas.bind( "vmouseup", function (event) {
//                  console.log("canvas.vmouseup: event = " + event);
                  self.dragging = false;
                  return true;
                });

                canvasSelector.bind( "vmouseup", function (event) {
//                  console.log("canvasSelector.vmouseup: event = " + event);
                  self.dragging = false;
                  return true;
                });

		select.attr( "tabindex", "-1" )
			.focus(function() {
				$(this).blur();
				button.focus();
			});

		// Button events
		button.bind( "vclick keydown" , function( event ) {
			if ( event.type == "vclick" ||
						event.keyCode && ( event.keyCode === $.mobile.keyCode.ENTER ||
																	event.keyCode === $.mobile.keyCode.SPACE ) ) {

				self.open();
				event.preventDefault();
			}
		});

		// Events for list items
		canvas.attr( "role", "listbox" )
			.delegate( ".ui-li>a", "focusin", function() {
				$( this ).attr( "tabindex", "0" );
			})
			.delegate( ".ui-li>a", "focusout", function() {
				$( this ).attr( "tabindex", "-1" );
			})
			.delegate( "li:not(.ui-disabled, .ui-li-divider)", "vclick", function( event ) {

				var $this = $( this ),
					// index of option tag to be selected
					oldIndex = select[ 0 ].selectedIndex,
					newIndex = $this.jqmData( "option-index" ),
					option = self.optionElems[ newIndex ];

				// toggle selected status on the tag for multi selects
				option.selected = true;

				// trigger change if value changed
				if ( oldIndex !== newIndex ) {
					select.trigger( "change" );
				}

				//hide custom select for single selects only
				self.close();

				event.preventDefault();
		})
		//keyboard events for menu items
		.keydown(function( event ) {
			var target = $( event.target ),
				li = target.closest( "li" ),
				prev, next;

			// switch logic based on which key was pressed
			switch ( event.keyCode ) {
				// up or left arrow keys
				case 38:
					prev = li.prev();

					// if there's a previous option, focus it
					if ( prev.length ) {
						target
							.blur()
							.attr( "tabindex", "-1" );

						prev.find( "a" ).first().focus();
					}

					return false;
				break;

				// down or right arrow keys
				case 40:
					next = li.next();

					// if there's a next option, focus it
					if ( next.length ) {
						target
							.blur()
							.attr( "tabindex", "-1" );

						next.find( "a" ).first().focus();
					}

					return false;
				break;

				// If enter or space is pressed, trigger click
				case 13:
				case 32:
					 target.trigger( "vclick" );

					 return false;
				break;
			}
		});

		// Events on "screen" overlay
		screen.bind( "vclick", function( event ) {
		  self.close();
		});
	},

        makeClrChannel: function(val) {
          return (val < 16 ? "0" : "") + (val & 0xff).toString(16);
        },

        _updateCanvasSelectorBackgroundClr: function(self) {
          var g_str = self.makeClrChannel(parseInt(self.luminenceSelector.css("top"))),
              clrValue = "#" + self._HSLToRGB(
                self.dragging_hsl.h / 255.0, 
                (255 - self.dragging_hsl.s) / 255.0,
                self.dragging_hsl.l / 255.0)
                  .map(self.normalizeValue)
                  .map(self.makeClrChannel)
                  .join("");

          self.canvasSelector.css("background", clrValue);
          self.luminenceSelector.css("background", "#" + g_str + g_str + g_str);
          self.element.attr("value", clrValue);
          self.buttonContents.css("color", clrValue);
        },

        _canvasDownAndMove: function(self, event) {
          var eventHandled = false;

          if (self.dragging) {
            if (self.draggingHS) {
              var potential_h = event.offsetX,
                  potential_s = event.offsetY;

              self.dragging_hsl.l = parseInt(self.luminenceSelector.css("top"));

              if (potential_h >= 0 && potential_h <= 255) {
                self.dragging_hsl.h = potential_h;
                eventHandled = true;
                self.canvasSelector.css("left", potential_h);
              }

              if (potential_s >= 0 && potential_s <= 255) {
                self.dragging_hsl.s = potential_s;
                eventHandled = true;
                self.canvasSelector.css("top",  potential_s);
              }

              if (eventHandled) {
                self._updateCanvasSelectorBackgroundClr(self);
                self.selectorDraggingOffset.x = Math.ceil(parseInt(self.canvasSelector.css("width"))  / 2.0);
                self.selectorDraggingOffset.y = Math.ceil(parseInt(self.canvasSelector.css("height")) / 2.0);
//                console.log("canvas.vmousedown: (" + self.dragging_hsl.h + ", " + self.dragging_hsl.s + ")");
              }
            }
            else {
              var potential_l = event.offsetY;

              if (potential_l >= 0 && potential_l <= 255) {
                self.dragging_hsl.l = potential_l;
                eventHandled = true;
                self.luminenceSelector.css("top", potential_l);
              }

              if (eventHandled) {
                self._updateCanvasSelectorBackgroundClr(self);
                self.selectorDraggingOffset.x = Math.ceil(parseInt(self.luminenceSelector.css("width"))  / 2.0);
                self.selectorDraggingOffset.y = Math.ceil(parseInt(self.luminenceSelector.css("height")) / 2.0);
//                console.log("canvas.vmousedown: (" + self.dragging_hsl.l + ")");
              }
            }
          }

          return eventHandled;
        },

        _canvasSelectorDownAndMove: function(self, event) {
        },

        _fillColours: function(canvas, l) {
          var
            width = canvas.attr("width"),
            context = canvas[0].getContext("2d"),
            Nix, Nix1,
            n_x_steps = 64, n_y_steps = 64,
            x_step = 256.0 / n_x_steps, y_step = 256.0 / n_y_steps,
            rgb,
            h, s, g;

          context.save();

          context.mozImageSmoothingEnabled = false;

          for (Nix = 0 ; Nix < n_y_steps ; Nix++)
            for (Nix1 = 0 ; Nix1 < n_x_steps ; Nix1++) {

              h = Nix1 / (n_x_steps - 1);
              s = 1.0 - Nix  / (n_y_steps - 1);

              rgb = this._HSLToRGB(h, s, l).map(this.normalizeValue);

              clrStr = "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", 1.0)";
              context.fillStyle = clrStr;
                context.fillRect(Nix1 * x_step, Nix * y_step, x_step, y_step);
            }

          for (Nix = 0 ; Nix < n_y_steps ; Nix++) {
            g = this.normalizeValue((Nix / (n_y_steps - 1)));
            context.fillStyle = "rgba(" + g + ", " + g + ", " + g + ", 1.0)";
            context.fillRect(width - 16, Nix * y_step, 16, y_step);
          }

          context.restore();
        },

        _initCanvas: function(canvas, canvasSelector, luminenceSelector) {
          var
            width = 256 + 
                    Math.ceil(parseInt(canvasSelector.css("width")) / 2.0) + 
                    Math.ceil(parseInt(luminenceSelector.css("width")) / 2.0) +
                    16;

          canvas.attr("width", width);
          luminenceSelector.css("left", width - 8);
          this._fillColours(canvas, 0.5);
        },

        _HSLToRGB: function(h, s, l) {
          var PI = 3.141592653589793115997963468544;
          var r, g, b;

          r = 0.0 + Math.max (0.0, Math.min (1.0, (0.5 + Math.cos (PI / 180.0 * ( 0.0 + h * 360.0))))) ;
          g = 1.0 - Math.max (0.0, Math.min (1.0, (0.5 + Math.cos (PI / 180.0 * (60.0 + h * 360.0))))) ;
          b = 1.0 - Math.max (0.0, Math.min (1.0, (0.5 + Math.cos (PI / 180.0 * (60.0 - h * 360.0))))) ;

          r = l + (r - l) * s ;
          g = l + (g - l) * s ;
          b = l + (b - l) * s ;

          r += (l - 0.5) * 2.0 * (l < 0.5 ? r : (1.0 - r)) ;
          g += (l - 0.5) * 2.0 * (l < 0.5 ? g : (1.0 - g)) ;
          b += (l - 0.5) * 2.0 * (l < 0.5 ? b : (1.0 - b)) ;

          return [ r, g, b ];
        },

        _RGBToHSL: function(r, g, b) {
          var
            h = 0, s = 1.0, l = 0.5,
            r_dist, g_dist, b_dist,
            fMax, fMin;

          fMax = Math.max (r, Math.max (g, b)) ;
          fMin = Math.min (r, Math.min (g, b)) ;

          l = (fMax + fMin) / 2 ;
          if (fMax - fMin <= 0.00001) {
            h = 0 ;
            s = 0 ;
          }
          else {
            s = (fMax - fMin) / ((l < 0.5) ? (fMax + fMin) : (2 - fMax - fMin)) ;

            r_dist = (fMax - r) / (fMax - fMin) ;
            g_dist = (fMax - g) / (fMax - fMin) ;
            b_dist = (fMax - b) / (fMax - fMin) ;

            if (r == fMax)
              h = b_dist - g_dist ;
            else
            if (g == fMax)
              h = 2 + r_dist - b_dist ;
            else
            if (b == fMax)
              h = 4 + g_dist - r_dist ;

            h *= 60 ;

            if (h < 0)
              h += 360 ;
          }

          return [ h / 360.0, s, l ];
        },

        normalizeValue: function (val) {
          var
            ret = val * 255.0,
            ret_floor = Math.floor(ret);

          if (ret - ret_floor > 0.5) ret_floor++;

          return ret_floor;
        },

	refresh: function( forceRebuild ) {
          var r, g, b, r_str, g_str, b_str, hsl,
	      self = this,
              clrValue = this.element.attr("value");

          self.buttonContents.css("color", clrValue);

//          console.log("clrValue: " + clrValue);

          if (clrValue.charAt(0) == '#')
            clrValue = clrValue.substring(1);

          r_str = clrValue.substring(0, 2);
          g_str = clrValue.substring(2, 4);
          b_str = clrValue.substring(4, 6);
          r = parseInt(r_str, 16) / 255.0;
          g = parseInt(g_str, 16) / 255.0;
          b = parseInt(b_str, 16) / 255.0;

//          console.log("clrValue = " + clrValue + ", " +
//            "r = " + r + "(" + r_str + "), " +
//            "g = " + g + "(" + g_str + "), " +
//            "b = " + b + "(" + b_str + ")");

          hsl = this._RGBToHSL(r, g, b).map(this.normalizeValue);
//          console.log("h: " + hsl[0] + " s: " + hsl[1] + " l: " + hsl[2]);

          this._fillColours(this.canvas, hsl[2] / 255.0);

          this.canvasSelector.css("left", hsl[0]);
          this.canvasSelector.css("top", 255 - hsl[1]);
          this.canvasSelector.css("background", "#" + clrValue);

          var g_str = this.makeClrChannel(hsl[2]);
          this.luminenceSelector.css("top", hsl[2]);
          this.luminenceSelector.css("background", "#" + g_str + g_str + g_str);
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

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
	$( $.mobile.colourpicker.prototype.options.initSelector, e.target )
		.not( ":jqmData(role='none'), :jqmData(role='nojs')" )
		.colourpicker();
});

})( jQuery );
