//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Make words to selectable tokens
//>>label: Token text area
//>>group: Widgets

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
		_fontSize : 0,
		_anchorWidth : 0,
		_labelWidth : 0,
		_marginWidth : 0,
		_$labeltag: null,
		_$inputbox: null,
		_$moreBlock: null,
		options : {
			label : "To : ",
			link : null,
			theme : null,
			description : "+ {0}"
		},

		_create: function() {
			var self = this,
				$view = this.element,
				role = $view.jqmData( "role" ), //TODO: performance improvement for jqmData after jQM-1.4.
				option = this.options,
				className = "ui-tokentextarea-link",
				labeltag = document.createElement( "label" ),
				inputbox = document.createElement( "input" ),
				$moreBlock = $( document.createElement( "a" ) );

			if ( !option.theme ) {
				option.theme = $.mobile.getInheritedTheme( $view, "a" );
			}

			$view.hide().empty().addClass( "ui-" + role );

			// create a label tag.
			labeltag.innerText = option.label;
			labeltag.className = "ui-tokentextarea-label " + " ui-tokentextarea-label-theme-" + option.theme;
			//labeltag.tabIndex = 0;
			$view.append( labeltag );

			// create a input tag
			inputbox.className = "ui-tokentextarea-input ui-tokentextarea-input-visible" + " ui-tokentextarea-input-theme-" + option.theme;
			$view.append( inputbox );

			// create a anchor tag.
			if ( option.link === null || $.trim( option.link ).length < 1 || $( option.link ).length === 0 ) {
				className += "-dim";
			}
			$moreBlock.attr( "data-role", "button" )
				.buttonMarkup( {
					icon: "plus",
					iconpos:"notext",
					inline: true
				})
				.attr( { "href" : $.trim( option.link ) } )
				.addClass( "ui-tokentextarea-link-base " + className )
				.find( "span.ui-btn-text" )
				.text( "Add recipient" );

			// append default htmlelements to main widget.
			$view.append( $moreBlock[0] );

			// assign global variables for performance improvement instead of using objects in below codes.
			self._$labeltag = $( labeltag );
			self._$inputbox = $( inputbox );
			self._$moreBlock = $moreBlock;

			// bind a event
			this._bindEvents();
			self._focusStatus = "init";
			// display widget
			$view.show();

			// assign global variables
			self._viewWidth = $view.innerWidth();
			self._reservedWidth += self._calcBlockWidth( $moreBlock[0] );
			self._reservedWidth += self._calcBlockWidth( labeltag );
			self._fontSize = parseInt( $moreBlock.css( "font-size" ), 10 );
			self._currentWidth = self._reservedWidth;
			self._modifyInputBoxWidth();
		},

		// bind events
		_bindEvents: function() {
			var self = this,
				$view = self.element,
				option = self.options,
				$inputbox = self._$inputbox,
				$moreBlock = self._$moreBlock;

			// delegate a event to HTMLDivElement(each block).
			$view.delegate( "div", "click", function( event ) {
				var $this = $( this ),
					$lockBlock;

				if ( $this.hasClass( "ui-tokentextarea-sblock" ) ) {
					// If block is selected, it will be removed.
					self._removeTextBlock();
				}

				$lockBlock = $view.find( "div.ui-tokentextarea-sblock" );
				if ( typeof $lockBlock !== "undefined" ) {
					$lockBlock.removeClass( "ui-tokentextarea-sblock" ).addClass( "ui-tokentextarea-block" );
				}

				$this.removeClass( "ui-tokentextarea-block" ).addClass( "ui-tokentextarea-sblock" );
				$view.trigger( "select" );
			});

			$inputbox.bind( "keyup", function( event ) {
				// 8  : backspace
				// 13 : Enter
				// 186 : semi-colon
				// 188 : comma
				var keyValue = event.keyCode,
					valueString = $inputbox.val(),
					valueStrings = [],
					index,
					isSeparator = false;

				if ( keyValue === 8 ) {
					if ( valueString.length === 0 ) {
						self._validateTargetBlock();
					}
				} else if ( keyValue === 13 || keyValue === 186 || keyValue === 188 ) {
					if ( valueString.length !== 0 ) {
						// split content by separators(',', ';')
						valueStrings = valueString.split ( /[,;]/ );
						for ( index = 0; index < valueStrings.length; index++ ) {
							if ( valueStrings[index].length !== 0 && valueStrings[index].replace( /\s/g, "" ).length !== 0 ) {
								self._addTextBlock( valueStrings[index] );
							}
						}
					}
					$inputbox.val( "" );
					isSeparator = true;
				} else {
					self._unlockTextBlock();
				}

				return !isSeparator;
			});

			$moreBlock.click( function() {
				if ( $moreBlock.hasClass( "ui-tokentextarea-link-dim" ) ) {
					return;
				}

				$inputbox.removeClass( "ui-tokentextarea-input-visible" ).addClass( "ui-tokentextarea-input-invisible" );

				$.mobile.changePage( option.link, {
					transition: "slide",
					reverse: false,
					changeHash: false
				});
			});

			$.mobile.document.bind( "pagechange.tta", function( event ) {
				if ( $view.innerWidth() === 0 ) {
					return;
				}
				self.refresh();
				$inputbox.removeClass( "ui-tokentextarea-input-invisible" ).addClass( "ui-tokentextarea-input-visible" );
			});

			$view.bind( "click", function( event ) {
				if ( self._focusStatus === "focusOut" ) {
					self.focusIn();
				}
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
				return;
			}

			var self = this,
				$view = self.element,
				index = blockIndex,
				textBlock = null,
				$blocks = null;

			if ( self._viewWidth === 0 ) {
				self._viewWidth = $view.innerWidth();
			}

			// Create a new text HTMLDivElement.
			textBlock = document.createElement( "div" );
			textBlock.innerText = messages;
			textBlock.className = "ui-tokentextarea-block";
			textBlock.style.visibility = "hidden";

			$blocks = $view.find( "div" );
			if ( index !== null && index <= $blocks.length ) {
				$( $blocks[index] ).before( textBlock );
			} else {
				self._$inputbox.before( textBlock );
			}

			textBlock = self._ellipsisTextBlock( textBlock );
			textBlock.style.visibility = "visible";

			self._modifyInputBoxWidth();

			textBlock.style.display = "none";

			$( textBlock ).fadeIn( "fast", function() {
				self._currentWidth += self._calcBlockWidth( textBlock );
				$view.trigger( "add" );
			});
		},

		_removeTextBlock: function() {
			var self = this,
				$view = this.element,
				$lockBlock = $view.find( "div.ui-tokentextarea-sblock" ),
				_temp = null,
				_dummy = function() {};

			if ( $lockBlock !== null && $lockBlock.length > 0 ) {
				self._currentWidth -= self._calcBlockWidth( $lockBlock );

				$lockBlock.fadeOut( "fast", function() {
					$lockBlock.remove();
					self._modifyInputBoxWidth();
				});

				this._eventRemoveCall = true;
				if ( $view[0].remove ) {
					_temp = $view[0].remove;
					$view[0].remove = _dummy;
				}
				$view.triggerHandler( "remove" );
				if ( _temp) {
					$view[0].remove = _temp;
				}
				this._eventRemoveCall = false;
			} else {
				$view.find( "div:last" ).removeClass( "ui-tokentextarea-block" ).addClass( "ui-tokentextarea-sblock" );
			}
		},

		_calcBlockWidth: function( block ) {
			return $( block ).outerWidth( true );
		},

		_unlockTextBlock: function() {
			var $view = this.element,
				$lockBlock = $view.find( "div.ui-tokentextarea-sblock" );
			if ( $lockBlock ) {
				$lockBlock.removeClass( "ui-tokentextarea-sblock" ).addClass( "ui-tokentextarea-block" );
			}
		},

		// call when remove text block by backspace key.
		_validateTargetBlock: function() {
			var self = this,
				$view = self.element,
				$lastBlock = $view.find( "div:last" ),
				$tmpBlock = null;

			if ( $lastBlock.hasClass( "ui-tokentextarea-sblock" ) ) {
				self._removeTextBlock();
			} else {
				$tmpBlock = $view.find( "div.ui-tokentextarea-sblock" );
				$tmpBlock.removeClass( "ui-tokentextarea-sblock" ).addClass( "ui-tokentextarea-block" );
				$lastBlock.removeClass( "ui-tokentextarea-block" ).addClass( "ui-tokentextarea-sblock" );
			}
		},

		_ellipsisTextBlock: function( textBlock ) {
			var self = this,
				$view = self.element,
				maxWidth = self._viewWidth / 2;

			if ( self._calcBlockWidth( textBlock ) > maxWidth ) {
				$( textBlock ).width( maxWidth - self._marginWidth );
			}

			return textBlock;
		},

		_modifyInputBoxWidth: function() {
			var self = this,
				$view = self.element,
				margin = 0,
				labelWidth = 0,
				anchorWidth = 0,
				inputBoxWidth = 0,
				$blocks = $view.find( "div" ),
				blockWidth = 0,
				index = 0,
				inputBoxMargin = 10,
				$inputBox = self._$inputbox;

			if ( $view.width() === 0 ) {
				return;
			}

			if ( self._labelWidth === 0 ) {
				self._labelWidth = self._$labeltag.outerWidth( true );
				self._anchorWidth = self._$moreBlock.outerWidth( true );
				self._marginWidth = parseInt( ( $inputBox.css( "margin-left" ) ), 10 );
				self._marginWidth += parseInt( ( $inputBox.css( "margin-right" ) ), 10 );
				self._viewWidth = $view.innerWidth();
			}

			margin = self._marginWidth;
			labelWidth = self._labelWidth;
			anchorWidth = self._anchorWidth;
			inputBoxWidth = self._viewWidth - labelWidth;

			for ( index = 0; index < $blocks.length; index += 1 ) {
				blockWidth = self._calcBlockWidth( $blocks[index] );

				if ( blockWidth >= inputBoxWidth + anchorWidth ) {
					if ( blockWidth >= inputBoxWidth ) {
						inputBoxWidth = self._viewWidth - blockWidth;
					} else {
						inputBoxWidth = self._viewWidth;
					}
				} else {
					if ( blockWidth > inputBoxWidth ) {
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
			$inputBox.width( inputBoxWidth - anchorWidth - inputBoxMargin );
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
				$blocks = $view.find( "div" ),
				index = 0;

			for ( index = 0 ; index < $blocks.length ; index += 1 ) {
				$( $blocks[index] ).css( "width", "auto" );
				$blocks[index] = self._ellipsisTextBlock( $blocks[index] );
			}
		},

		//----------------------------------------------------//
		// Public Method                                      //
		//----------------------------------------------------//
		//
		// Focus In Event
		//
		focusIn: function() {
			if ( this._focusStatus === "focusIn" ) {
				return;
			}

			var $view = this.element;

			$view.find( ".ui-tokentextarea-desclabel" ).remove();
			$view.find( "div.ui-tokentextarea-sblock" ).removeClass( "ui-tokentextarea-sblock" ).addClass( "ui-tokentextarea-block" );
			$view.find( "div" ).show();
			this._$inputbox.removeClass( "ui-tokentextarea-input-invisible" ).addClass( "ui-tokentextarea-input-visible" );
			$view.find( "a" ).show();

			// change focus state.
			this._modifyInputBoxWidth();
			this._focusStatus = "focusIn";
			$view.removeClass( "ui-tokentextarea-focusout" ).addClass( "ui-tokentextarea-focusin" );
			this._$inputbox.focus();
		},

		focusOut: function() {
			if ( this._focusStatus === "focusOut" ) {
				return;
			}

			var self = this,
				$view = self.element,
				tempBlock = null,
				stateBlock = null,
				numBlock = null,
				statement = "",
				index = 0,
				lastIndex = 10,
				label = self._$labeltag,
				more = $view.find( "span" ),
				$blocks = $view.find( "div" ),
				currentWidth = $view.outerWidth( true ) - more.outerWidth( true ) - label.outerWidth( true ),
				blockWidth = 0;

			self._$inputbox.removeClass( "ui-tokentextarea-input-visible" ).addClass( "ui-tokentextarea-input-invisible" );
			$blocks.hide();
			$view.find( "a" ).hide();

			currentWidth = currentWidth - self._reservedWidth;

			for ( index = 0; index < $blocks.length; index++ ) {
				blockWidth = $( $blocks[index] ).outerWidth( true );
				if ( currentWidth - blockWidth <= 0 ) {
					lastIndex = index - 1;
					break;
				}

				$( $blocks[index] ).show();
				currentWidth -= blockWidth;
			}

			if ( lastIndex !== $blocks.length ) {
				statement = self._stringFormat( self.options.description, $blocks.length - lastIndex - 1 );
				tempBlock = document.createElement( 'span' );
				tempBlock.className = "ui-tokentextarea-desclabel";
				stateBlock = document.createElement( 'span' );
				stateBlock.innerText = statement;
				numBlock = document.createElement( 'span' );
				numBlock.innerText = $blocks.length - lastIndex - 1;
				numBlock.style.visibility = "hidden";
				tempBlock.appendChild( stateBlock );
				tempBlock.appendChild( numBlock );
				$( $blocks[lastIndex] ).after( tempBlock );
			}

			// update focus state
			this._focusStatus = "focusOut";
			$view.removeClass( "ui-tokentextarea-focusin" ).addClass( "ui-tokentextarea-focusout" );
		},

		inputText: function( message ) {
			if ( arguments.length === 0 ) {
				return this._$inputbox.val();
			}
			this._$inputbox.val( message );
			return message;
		},

		select: function( index ) {
			var $view = this.element,
				$lockBlock = null,
				$blocks = null;

			if ( this._focusStatus === "focusOut" ) {
				return;
			}

			if ( arguments.length === 0 ) {
				// return a selected block.
				$lockBlock = $view.find( "div.ui-tokentextarea-sblock" );
				if ( $lockBlock ) {
					return $lockBlock.text();
				}
				return null;
			}
			// 1. unlock all blocks.
			this._unlockTextBlock();
			// 2. select pointed block.
			$blocks = $view.find( "div" );
			if ( $blocks.length > index ) {
				$( $blocks[index] ).removeClass( "ui-tokentextarea-block" ).addClass( "ui-tokentextarea-sblock" );
				$view.trigger( "select" );
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
				$blocks = $view.find( "div" ),
				index = 0,
				_temp = null,
				_dummy = function() {};

			if ( this._focusStatus === "focusOut" ) {
				return;
			}

			if ( arguments.length === 0 ) {
				$blocks.fadeOut( "fast", function() {
					$blocks.remove();
					self._modifyInputBoxWidth();
					self._trigger( "clear" );
				});
			} else if ( !isNaN( position ) ) {
				// remove selected button
				index = ( ( position < $blocks.length ) ? position : ( $blocks.length - 1 ) );

				$( $blocks[index] ).fadeOut( "fast", function() {
					$( $blocks[index] ).remove();
					self._modifyInputBoxWidth();
				});

				this._eventRemoveCall = true;
				if ( $view[0].remove ) {
					_temp = $view[0].remove;
					$view[0].remove = _dummy;
				}
				$view.triggerHandler( "remove" );
				if ( _temp) {
					$view[0].remove = _temp;
				}
				this._eventRemoveCall = false;
			}
		},

		length: function() {
			return this.element.find( "div" ).length;
		},

		refresh: function() {
			var self = this,
				viewWidth = this.element.innerWidth();

			if ( viewWidth && self._viewWidth !== viewWidth ) {
				self._viewWidth = viewWidth;
			}
			self._resizeBlocks();
			self._modifyInputBoxWidth();
		},

		destroy: function() {
			var $view = this.element,
				_temp = null,
				_dummy = function() {};

			if ( this._eventRemoveCall ) {
				return;
			}

			this._$labeltag.remove();
			$view.find( "div" ).undelegate( "click" ).remove();
			$view.find( "a" ).remove();
			this._$inputbox.unbind( "keyup" ).remove();

			this._eventRemoveCall = true;
			if ( $view[0].remove ) {
				_temp = $view[0].remove;
				$view[0].remove = _dummy;
			}
			$view.remove();
			if ( _temp) {
				$view[0].remove = _temp;
			}
			this._eventRemoveCall = false;

			this._trigger( "destroy" );
		}
	});

	$.mobile.document.bind( "pagecreate create", function() {
		$( ":jqmData(role='tokentextarea')" ).tokentextarea();
	});

	$.mobile.window.bind( "resize", function() {
		$( ":jqmData(role='tokentextarea')" ).tokentextarea( "refresh" );
	});
} ( jQuery, window, document ) );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
} );
//>>excludeEnd("jqmBuildExclude");
