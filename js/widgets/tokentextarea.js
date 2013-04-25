//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Text area containing tokens
//>>label: tokentextarea
//>>group: Widget

define( [
	"jqm/jquery",
	"jqm/jquery.mobile.widget",
	"jqm/jquery.mobile.buttonMarkup" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");

( function( $, window, document, undefined ) {
	$.widget( "mobile.tokentextarea", $.mobile.widget, {
		_focusStatus : null,
		_items : null,
		_viewWidth : 0,
		_reservedWidth : 0,
		_currentWidth : 0,
		_anchorWidth : 0,
		_labelWidth : 0,
		_marginWidth : 0,
		options : {
			initSelector: ":jqmData(role='tokentextarea')",
			label : "To : ",
			link : null,
			theme : null,
			description : "+ {0}"
		},

		_create: function() {
			var self = this,
				$view = this.element,
				role = $view.jqmData( "role" ),
				option = this.options,
				className = "ui-tokentextarea-link",
				inputbox = document.createElement( "input" ),
				labeltag = document.createElement( "label" ),
				moreBlock = document.createElement( "a" );

			if ( !option.theme ) {
				option.theme = $.mobile.getInheritedTheme( this.element, "a" );
			}

			$view.hide().empty().addClass( "ui-" + role );

			// create a label tag.
			$( labeltag ).text( option.label ).addClass( "ui-tokentextarea-label " + " ui-tokentextarea-label-theme-" + option.theme );
			$view.append( labeltag );

			// create a input tag
			$( inputbox ).text( option.label ).addClass( "ui-tokentextarea-input" + " ui-tokentextarea-input-theme-" + option.theme );
			$view.append( inputbox );

			// create a anchor tag.
			if ( option.listId === null || $.trim( option.listId ).length < 1 || $( option.listId ).length === 0 ) {
				className += "-dim";
			}
			$( moreBlock ).addClass( " ui-tokentextarea-link-base " + className ).attr( "href", $.trim( option.link ) ).buttonMarkup({icon:"plus", inline:true, iconpos:"notext" });

			// append default htmlelements to main widget.
			$view.append( moreBlock );

			// bind a event
			this._bindEvents();
			self._focusStatus = "init";
			// display widget
			$view.show();
			$view.attr( "tabindex", -1 ).focusin( function(/* event */) {
				self.focusIn();
			});

			// assign global variables
			self._viewWidth = $view.innerWidth();
			self._reservedWidth += self._calcBlockWidth( moreBlock );
			self._reservedWidth += self._calcBlockWidth( labeltag );
			self._currentWidth = self._reservedWidth;
		},

		// bind events
		_bindEvents: function() {
			var self = this,
				$view = self.element,
				option = self.options,
				theme = option.theme,
				inputbox = $view.find( ".ui-tokentextarea-input" ),
				moreBlock = $view.find( ".ui-tokentextarea-link-base" ),
				isSeparator = false;

			// delegate a event to HTMLDivElement(each block).
			$view.delegate( "div", "vclick", function(/* event */) {
				if ( $( this ).hasClass( "ui-tokentextarea-sblock" ) ) {
					// If block is selected, it will be removed.
					self._removeTextBlock();
				}

				var lockBlock = $view.find( "div.ui-tokentextarea-sblock" );
				if ( typeof lockBlock !== "undefined" ) {
					lockBlock.removeClass( "ui-tokentextarea-sblock ui-tokentextarea-sblock-theme-" + theme )
					.addClass( "ui-tokentextarea-block ui-tokentextarea-block-theme-" + theme );
				}
				$( this ).removeClass( "ui-tokentextarea-block ui-tokentextarea-block-theme-" + theme )
					.addClass( "ui-tokentextarea-sblock ui-tokentextarea-sblock-theme-" + theme );
			});

			inputbox.bind( "keyup", function( event ) {
				// 8  : backspace
				// 13 : Enter
				// 186 : semi-colon
				// 188 : comma
				var keyValue = event.keyCode,
					keyCode = jQuery.mobile.keyCode,
					valueString = $( inputbox ).val(),
					valueStrings = [],
					index;

				if ( keyValue === keyCode.BACKSPACE ) {
					if ( valueString.length === 0 ) {
						self._validateTargetBlock();
					}
				} else if ( keyValue === keyCode.ENTER || keyValue === 186 || keyValue === keyCode.COMMA ) {
					if ( valueString.length !== 0 ) {
						// split content by separators(',', ';')
						valueStrings = valueString.split ( /[,;]/ );
						for ( index = 0; index < valueStrings.length; index++ ) {
							if ( valueStrings[index].length !== 0 && valueStrings[index].replace( /\s/g, "" ).length !== 0 ) {
								self._addTextBlock( valueStrings[index] );
							}
						}
					}
					inputbox.val( "" );
					isSeparator = true;
				} else {
					self._unlockTextBlock();
				}

				return !isSeparator;
			});

			moreBlock.click( function() {
				if ( $( moreBlock ).hasClass( "ui-tokentextarea-link-dim" ) ) {
					return;
				}

				$( inputbox ).hide();

				$.mobile.changePage( option.listId, {
					transition: "slide",
					reverse: false,
					changeHash: false
				});
			});

			$( document ).bind( "pagechange.mbe", function(/* event */) {
				if ( $view.innerWidth() === 0 ) {
					return ;
				}
				var inputBox = $view.find( ".ui-tokentextarea-input" );
				if ( self._labelWidth === 0 ) {
					self._labelWidth = $view.find( ".ui-tokentextarea-label" ).outerWidth( true );
					self._anchorWidth = $view.find( ".ui-tokentextarea-link-base" ).outerWidth( true );
					self._marginWidth = parseInt( ( $( inputBox ).css( "margin-left" ) ), 10 );
					self._marginWidth += parseInt( ( $( inputBox ).css( "margin-right" ) ), 10 );
					self._viewWidth = $view.innerWidth();
				}
				self._modifyInputBoxWidth();
				$( inputbox ).show();
				self.refresh();
			});

			$view.bind( "click", function(/* event */) {
				if ( self._focusStatus === "focusOut" ) {
					self.focusIn();
				}
			});

			$( window ).bind( "resize", function() {
				//$( ":jqmData(role='multibuttonentry')" ).multibuttonentry( "refresh" );
				self.refresh();
			});
		},

		// create a textbutton and append this button to parent layer.
		// @param arg1 : string
		// @param arg2 : index
		_addTextBlock: function( messages, blockIndex ) {
			if ( arguments.length === 0 ) {
				return;
			}

			if ( !messages ) {
				return ;
			}

			var self = this,
				theme = self.options.theme,
				$view = self.element,
				content = messages,
				index = blockIndex,
				blocks = null,
				textBlock = null;

			if ( self._viewWidth === 0 ) {
				self._viewWidth = $view.innerWidth();
			}

			// Create a new text HTMLDivElement.
			textBlock = $( document.createElement( "div" ) );

			textBlock.text( content ).addClass( "ui-tokentextarea-block ui-tokentextarea-block-theme-" + theme + " ui-tokentextarea-item-theme-" + theme);

			textBlock.css( {"visibility": "hidden"} );

			blocks = $view.find( "div" );
			if ( index !== null && index <= blocks.length ) {
				$( blocks[index] ).before( textBlock );
			} else {
				$view.find( ".ui-tokentextarea-input" ).before( textBlock );
			}

			textBlock = self._ellipsisTextBlock( textBlock );
			textBlock.css( {"visibility": "visible"} );

			self._currentWidth += self._calcBlockWidth( textBlock );
			self._modifyInputBoxWidth();
		},

		_removeTextBlock: function() {
			var self = this,
				$view = self.element,
				theme = self.options.theme,
				lockBlock = $view.find( "div.ui-tokentextarea-sblock" );

			if ( lockBlock !== null && lockBlock.length > 0 ) {
				self._currentWidth -= self._calcBlockWidth( lockBlock );
				lockBlock.remove();
				self._modifyInputBoxWidth();
			} else {
				$view.find( "div:last" )
					.removeClass( "ui-tokentextarea-block ui-ui-tokentextarea-block-theme-"+theme )
					.addClass( "ui-tokentextarea-sblock ui-tokentextarea-sblock-theme-"+theme );
			}
		},

		_calcBlockWidth: function( block ) {
			return $( block ).outerWidth( true );
		},

		_unlockTextBlock: function() {
			var $view = this.element,
				theme = this.options.theme,
				lockBlock = $view.find( "div.ui-tokentextarea-sblock" );
			if ( lockBlock ) {
				lockBlock.removeClass( "ui-tokentextarea-sblock ui-tokentextarea-sblock-theme-"+theme )
					.addClass( "ui-tokentextarea-block ui-tokentextarea-block-theme-"+theme );
			}
		},

		// call when remove text block by backspace key.
		_validateTargetBlock: function() {
			var self = this,
				$view = self.element,
				theme = self.options.theme,
				lastBlock = $view.find( "div:last" ),
				tmpBlock = null;

			if ( lastBlock.hasClass( "ui-tokentextarea-sblock" ) ) {
				self._removeTextBlock();
			} else {
				tmpBlock = $view.find( "div.ui-tokentextarea-sblock" );
				tmpBlock.removeClass( "ui-tokentextarea-sblock ui-tokentextarea-sblock-theme-"+theme )
					.addClass( "ui-tokentextarea-block ui-tokentextarea-block-theme-"+theme );
				lastBlock.removeClass( "ui-tokentextarea-block ui-tokentextarea-block-theme-"+theme )
					.addClass( "ui-tokentextarea-sblock ui-tokentextarea-sblock-theme-"+theme );
			}
		},

		_ellipsisTextBlock: function( textBlock ) {
			var self = this,
				$view = self.element,
				maxWidth = $view.innerWidth() - ( self._labelWidth + self._anchorWidth ) * 2;

			if ( self._calcBlockWidth( textBlock ) > maxWidth ) {
				$( textBlock ).width( maxWidth - self._marginWidth );
			}

			return textBlock;
		},

		_modifyInputBoxWidth: function() {
			var self = this,
				$view = self.element,
				margin = self._marginWidth,
				labelWidth = self._labelWidth,
				anchorWidth = self._anchorWidth,
				inputBoxWidth = self._viewWidth - labelWidth,
				blocks = $view.find( "div" ),
				blockWidth = 0,
				index = 0,
				inputBoxMargin = 10,
				inputBox = $view.find( ".ui-tokentextarea-input" );

			if ( $view.width() === 0 ) {
				return;
			}

			for ( index = 0; index < blocks.length; index += 1 ) {
				blockWidth = self._calcBlockWidth( blocks[index] );

				if ( blockWidth >= inputBoxWidth + anchorWidth ) {
					if ( blockWidth >= inputBoxWidth ) {
						inputBoxWidth = self._viewWidth - blockWidth;
					} else {
						inputBoxWidth = self._viewWidth;
					}
				} else {
					if ( blockWidth >= inputBoxWidth ) {
						inputBoxWidth = self._viewWidth - blockWidth;
					} else {
						inputBoxWidth -= blockWidth;
					}
				}
			}

			inputBoxWidth -= margin;
			if ( inputBoxWidth < anchorWidth * 2 ) {
				inputBoxWidth = self._viewWidth - margin;
			}
			$( inputBox ).width( inputBoxWidth - anchorWidth - inputBoxMargin );
		},

		_stringFormat: function( expression ) {
			var pattern = null,
				message = expression,
				i = 0;
			for ( i = 1; i < arguments.length; i += 1 ) {
				pattern = "{" + ( i - 1 ) + "}";
				message = message.replace( pattern, arguments[i] );
			}
			return message;
		},

		_resizeBlocks: function() {
			var self = this,
				$view = self.element,
				blocks = $view.find( "div" ),
				index = 0;

			for ( index = 0 ; index < blocks.length ; index += 1 ) {
				$( blocks[index] ).css( "width", "auto" );
				blocks[index] = self._ellipsisTextBlock( blocks[index] );
			}
		},

		//---------------------------------------------------- //
		//					Public Method   //
		//----------------------------------------------------//
		//
		// Focus In Event
		//
		focusIn: function() {
			if ( this._focusStatus === "focusIn" ) {
				return;
			}

			var $view = this.element,
				theme = this.options.theme;

			$view.find( "label" ).show();
			$view.find( ".ui-tokentextarea-desclabel" ).remove();
			$view.find( "div.ui-tokentextarea-sblock" )
				.removeClass( "ui-tokentextarea-sblock ui-tokentextarea-sblock-theme-"+theme )
				.addClass( "ui-tokentextarea-block ui-tokentextarea-block-theme-"+theme );
			$view.find( "div" ).show();
			$view.find( ".ui-tokentextarea-input" ).show();
			$view.find( "a" ).show();

			// change focus state.
			this._modifyInputBoxWidth();
			this._focusStatus = "focusIn";
			$view.removeClass( "ui-tokentextarea-focusout" ).addClass( "ui-tokentextarea-focusin" );
		},

		focusOut: function() {
			if ( this._focusStatus === "focusOut" ) {
				return;
			}

			var self = this,
				theme = self.options.theme,
				$view = self.element,
				tempBlock = null,
				statement = "",
				index = 0,
				lastIndex = 10,
				label = $view.find( "label" ),
				more = $view.find( "span" ),
				blocks = $view.find( "div" ),
				currentWidth = $view.outerWidth( true ) - more.outerWidth( true ) - label.outerWidth( true ),
				blockWidth = 0;

			$view.find( ".ui-tokentextarea-input" ).hide();
			$view.find( "a" ).hide();
			blocks.hide();

			currentWidth = currentWidth - self._reservedWidth;

			for ( index = 0; index < blocks.length; index++ ) {
				blockWidth = $( blocks[index] ).outerWidth( true );
				if ( currentWidth - blockWidth <= 0 ) {
					lastIndex = index - 1;
					break;
				}

				$( blocks[index] ).show();
				currentWidth -= blockWidth;
			}

			if ( lastIndex !== blocks.length ) {
				statement = self._stringFormat( self.options.description, blocks.length - lastIndex - 1 );
				tempBlock = $( document.createElement( "label" ) );
				tempBlock.text( statement );
				tempBlock.addClass( "ui-tokentextarea-desclabel " +"ui-tokentextarea-desclabel-theme-"+ theme);
				$( blocks[lastIndex] ).after( tempBlock );
			}

			// update focus state
			this._focusStatus = "focusOut";
			$view.removeClass( "ui-tokentextarea-focusin" ).addClass( "ui-tokentextarea-focusout" );
		},

		inputText: function( message ) {
			var $view = this.element;

			if ( arguments.length === 0 ) {
				return $view.find( ".ui-tokentextarea-input" ).val();
			}
			$view.find( ".ui-tokentextarea-input" ).val( message );
			return message;
		},

		select: function( index ) {
			var $view = this.element,
				theme = this.options.theme,
				lockBlock = null,
				blocks = null;

			if ( this._focusStatus === "focusOut" ) {
				return;
			}

			if ( arguments.length === 0 ) {
				// return a selected block.
				lockBlock = $view.find( "div.ui-tokentextarea-sblock" );
				if ( lockBlock ) {
					return lockBlock.text();
				}
				return null;
			}
			// 1. unlock all blocks.
			this._unlockTextBlock();
			// 2. select pointed block.
			blocks = $view.find( "div" );
			if ( blocks.length > index ) {
				$( blocks[index] ).removeClass( "ui-tokentextarea-block ui-tokentextarea-block-theme-"+theme )
				.addClass( "ui-tokentextarea-sblock ui-tokentextarea-sblock-theme-"+theme );
			}
			return null;
		},

		add: function( message, position ) {
			if ( this._focusStatus === "focusOut" ) {
				return;
			}

			this._addTextBlock( message, position );
		},

		remove: function( position ) {
			var self = this,
				$view = this.element,
				blocks = $view.find( "div" ),
				index = 0;
			if ( this._focusStatus === "focusOut" ) {
				return;
			}

			if ( arguments.length === 0 ) {
				blocks.remove();
			} else if ( typeof position === "number" ) {
				// remove selected button
				index = ( ( position < blocks.length ) ? position : ( blocks.length - 1 ) );
				$( blocks[index] ).remove();
			}
			self._modifyInputBoxWidth();
		},

		length: function() {
			return this.element.find( "div" ).length;
		},

		refresh: function() {
			var self = this,
				$view = this.element;

			self._viewWidth = $view.innerWidth();
			self._resizeBlocks();
			self._modifyInputBoxWidth();
		},

		destroy: function() {
			var $view = this.element;

			$view.find( "label" ).remove();
			$view.find( "div" ).undelegate( "vclick" ).remove();
			$view.find( "a" ).remove();
			$view.find( ".ui-tokentextarea-input" ).unbind( "keyup" ).remove();
		}
	});

	$( document ).bind( "pagecreate create", function( e ) {
		$.mobile.tokentextarea.prototype.enhanceWithin( e.target );
	});
} ( jQuery, window, document ) );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");

