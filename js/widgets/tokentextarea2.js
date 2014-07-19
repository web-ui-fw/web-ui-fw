//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Make words into selectable buttons
//>>label: Token text area
//>>group: Widgets
//>>css.structure: ../../css/structure/web-ui-fw.tokentextarea2.css

define([
	"jquery",
	"jqm/widgets/forms/textinput",
	"jqm/widgets/forms/reset",
	"jqm/jquery.mobile.vmouse",
	"../web-ui-fw.reduceScope" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");

( function( $, window, document, undefined ) {

var regexString = " *[;,] *",
	tokenizeRegex = new RegExp( regexString ),
	terminatorRegex = new RegExp( regexString + "$" );

$.widget( "mobile.tokentextarea2", $.mobile.textinput, {
	initSelector: "[data-" + $.mobile.ns + "role='tokentextarea2']",

	_create: function() {
		var outer, formId;

		this._superApply( arguments );

		if ( this.inputNeedsWrap ) {
			outer = this.widget();
			if ( this.options.enhanced ) {
				this._inputShadow = outer.children( ".ui-tokentextarea2-input-shadow" );
			}

			// Handle form reset
			formId = this.element.attr( "form" );
			this._on( ( formId ? this.document[ 0 ].getElementById( formId ) :
				this.element.closest( "form" ) ), {
					"reset": function() { this._delay( "refresh" ); }
			});

			this._on({
				"keyup": "_processInput",
				"paste": "_handlePaste",
				"change": "_processInput",
				"vclick a[href='#']": "_handleButtonClick",
				"focusin": "_adjustWidth"
			});
			this._on( this.window, { "resize": "_adjustWidth" } );
			this._on( outer, { "vmousedown": "_handleWidgetVMouseDown" } );
		}
	},

	_enhance: function() {
		var outer;

		this._superApply( arguments );
		if ( this.inputNeedsWrap ) {
			outer = this.widget();
			this._inputShadow = $( "<span class='ui-tokentextarea2-input-shadow'></span>" )
				.appendTo( outer );
			this._processInput( null, false );
			outer = this.widget().addClass( "ui-tokentextarea2" +
				( ( this.element.prevAll( "a.ui-btn" ).length > 0 ) ?
					" initial" : "" ) );
		}
	},

	_setOptions: function( options ) {
		var buttons;

		if ( this.inputNeedsWrap ) {
			if ( options.disabled !== undefined ) {
				buttons = this.element.prevAll( "a.ui-btn" );
				if ( options.disabled ) {
					buttons.attr( "tabindex", -1 );
				} else {
					buttons.removeAttr( "tabindex" );
				}
			}
		}
		return this._superApply( arguments );
	},

	_tokenizeInput: function( value ) {
		var index,
			tokens = [],
			leftover = "";

		$.each( value.split( tokenizeRegex ), function( index, token ) {
			if ( token !== "" ) {
				tokens.push( token );
			}
		});

		if ( !value.match( terminatorRegex ) ) {
			leftover = tokens[ tokens.length - 1 ];
			tokens = tokens.slice( 0, tokens.length - 1 );
		}

		for ( index in tokens ) {
			tokens[ index ] = $.trim( tokens[ index ] );
		}

		return {
			tokens: tokens,
			leftover: leftover
		};
	},

	_button: function( text ) {
		return $( "<a href='#' " +
			( this.element.prop( "disabled" ) ? "tabindex='-1' " : "" ) +
			"class='ui-btn ui-mini ui-corner-all ui-shadow ui-btn-inline'></a>" )
				.text( text )
				.jqmData( "value", text );
	},

	_handleWidgetVMouseDown: function( event ) {
		if ( event.target === this.widget()[ 0 ] ) {
			if ( this.element.is( ":focus" ) ) {
				event.preventDefault();
			} else {
				this._delay( function() { this.element.focus(); } );
			}
		}
	},

	_handlePaste: function() {
		this._delay( "_processInput" );
	},

	_handleButtonClick: function( event ) {
		this._removeButton( $( event.target ) );
	},

	_processInput: function( event, adjustWidth ) {
		var index, tokens, fragment, tokensLength,
			value = this.element.val();
		// 59, 186 : semicolon, colon

		if ( arguments.length < 2 ) {
			adjustWidth = true;
		}

		if ( event && event.keyCode === $.ui.keyCode.BACKSPACE &&
			value === this._inputShadow.text() ) {
				this._removeButton( this.element.prevAll( "a.ui-btn" ).first() );
		} else {
			if ( !event ||
				event.keyCode === $.ui.keyCode.ENTER ||
				event.keyCode === $.ui.keyCode.COMMA ||
				event.keyCode === 186 || event.keyCode === 59 ) {

					tokens = this._tokenizeInput( value );
					tokensLength = tokens.tokens.length;

					if ( tokensLength > 0 ) {
						if ( tokensLength === 1 ) {
							fragment = this._button( tokens.tokens[ 0 ] );
						} else {
							fragment = this.document[ 0 ].createDocumentFragment();
							for ( index = 0 ; index < tokensLength; index++ ) {
								fragment.appendChild(
									this._button( tokens.tokens[ index ] )[ 0 ] );
							}
						}
						this._add( fragment );
					}

					this.element.val( tokens.leftover );
			}
			this.element.prevAll( "a.ui-btn.ui-btn-active" ).removeClass( "ui-btn-active" );
		}

		this._inputShadow.text( this.element.val() );
		if ( adjustWidth ) {
			this._adjustWidth();
		}
	},

	_removeButton: function( button ) {
		if ( button.hasClass( "ui-btn-active" ) ) {
			button.remove();
			this.widget().toggleClass( "stretched-input",
				this.element.prevAll( "a.ui-btn" ).length > 0 );
			this._adjustWidth();
		} else if ( this._trigger( "select", { value: button.jqmData( "value" ) } ) ) {
			button.addClass( "ui-btn-active" );
		}
	},

	_adjustWidth: function() {
		var top, padding,
			width = 0,
			input = this.element,
			buttons = input.prevAll( "a.ui-btn" );

		if ( buttons.length > 0 ) {
			buttons.each( function() {
				var button = $( this ),
					buttonTop = button.offset().top;

				if ( top === undefined ) {
					top = buttonTop;
				} else if ( top !== buttonTop ) {
					return false;
				}

				width += button.outerWidth( true );
			});

			padding = ( input.outerWidth() - input.width() );

			// Reusing the variable "width" here. Whereas before it was referring to the combined
			// width of the buttons, it is now reassigned to refer to the width we desire for the
			// input.
			width = Math.max( 0, this.widget().width() - width - padding );
			if ( width < this._inputShadow.width() + padding ) {
				width = 0;
			}
		}

		// If the input width is insufficient to properly display its text or there are no buttons,
		// unset the width. This will cause the input to have width 100% (set earlier in the CSS)
		// and thus be alone on a line.
		input.width( width || "" );
		this.widget().toggleClass( "stretched-input", !!width && ( buttons.length > 0 ) );
	},

	_textFromButtons: function( buttons ) {
		var text = "";

		buttons.each( function() {
			text += $( this ).jqmData( "value" ) + ";";
		});

		return text;
	},

	inputText: function( newText ) {
		var buttons;

		if ( this.inputNeedsWrap ) {
			buttons = this.element.prevAll( "a.ui-btn" );

			if ( arguments.length === 0 ) {
				return this._textFromButtons( $( buttons.get().reverse() ) ) + this.element.val();
			} else {
				buttons.remove();
				this.element.val( newText );
				this._processInput();
			}
		}
	},

	_add: function( value, index ) {
		var buttons,
			destination = this.element;

		if ( arguments.length > 1 ) {
			buttons = this.element.prevAll( "a.ui-btn" ).get().reverse();
			if ( index >= 0 && index < buttons.length ) {
				destination = $( buttons[ index ] );
			}
		}

		this.widget().addClass( "stretched-input" );
		destination.before( ( typeof value === "string" ? this._button( value ) : value ) );
	},

	add: function( value, index ) {
		if ( this.inputNeedsWrap ) {
			this._add( value, index );
			this._adjustWidth();
		}
	},

	length: function() {
		return ( this.inputNeedsWrap ? this.element.prevAll( "a.ui-btn" ).length : 0 );
	},

	remove: function( position ) {
		var buttons, toRemove;

		if ( this.inputNeedsWrap ) {
			buttons = toRemove = this.element.prevAll( "a.ui-btn" );

			if ( arguments.length > 0 && position >= 0 && position < buttons.length ) {
				toRemove = $( buttons.get().reverse()[ position ] );
			}

			toRemove.remove();
			if ( buttons.not( toRemove ).length === 0 ) {
				this._adjustWidth();
				this.widget().removeClass( "stretched-input" );
			}
		}
	},

	select: function( index ) {
		var buttons;

		if ( this.inputNeedsWrap ) {
			if ( arguments.length === 0 ) {
				return this._textFromButtons(
					$( this.element.prevAll( "a.ui-btn.ui-btn-active" ).get().reverse() ) );
			} else {
				buttons = this.element.prevAll( "a.ui-btn" ).get().reverse();

				if ( index >= 0 && index < buttons.length ) {
					$( buttons[ index ] ).addClass( "ui-btn-active" );
				}
			}
		}
	},

	refresh: function() {
		this.remove();
		this._processInput( null, this.element.is( ":focus" ) );
	},

	_destroy: function() {
		if ( this.inputNeedsWrap && !this.options.enhanced ) {
			this.element.val( this.inputText() );
			this.element.prevAll( "a.ui-btn" ).remove();
			this._inputShadow.remove();
		}
		return this._superApply( arguments );
	}
});

// Textinputs that have data-role="tokentextarea2" are no longer to be enhanced as textinput
$.mobile.reduceEnhancementScope( "mobile", "textinput",
	"[data-" + $.mobile.ns + "role='tokentextarea2']" );

})( jQuery, window, document );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
