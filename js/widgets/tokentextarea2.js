//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Make words into selectable tokens
//>>label: Token text area
//>>group: Widgets
//>>css.structure: ../../css/structure/web-ui-fw.tokentextarea2.css

//
// The problem with pre-rendered blocks:
// - http://jsbin.com/rowajepa/1/ (core only)
// - http://jsbin.com/rasoliva/1/ (core + jQM)
//

define([
	"jquery",
	"jqm/widgets/forms/textinput",
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
		var outer;

		this._superApply( arguments );

		if ( this.inputNeedsWrap ) {
			outer = this.widget();
			if ( this.options.enhanced ) {
				this._inputShadow = outer.children( ".ui-tokentextarea2-input-shadow" );
				this._processInput( null, false );
			}

			this._on({
				"keyup": "_processInput",
				"paste": "_handlePaste",
				"change": "_processInput",
				"vclick a[href='#']": "_handleBlockClick",
				"focusin": "_handleFocusInOut",
				"focusout": "_handleFocusInOut",
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
		var blocks;

		if ( this.inputNeedsWrap ) {
			if ( options.disabled !== undefined ) {
				blocks = this.element.prevAll( "a.ui-btn" );
				if ( options.disabled ) {
					blocks.attr( "tabindex", -1 );
				} else {
					blocks.removeAttr( "tabindex" );
				}
			}
		}
		return this._superApply( arguments );
	},

	_handleFocusInOut: function( event ) {
		var isFocusIn = ( event.type === "focusin" );

		if ( isFocusIn ) {
			this._adjustWidth();
		}

		this.widget().toggleClass( "initial", !isFocusIn && this._inputIsStretched );
	},

	_tokenizeInput: function( value ) {
		var tokens = [];

		$.each( value.split( tokenizeRegex ), function( index, token ) {
			if ( token !== "" ) {
				tokens.push( token );
			}
		});

		return tokens;
	},

	_block: function( text ) {
		return $( "<a href='#' " +
			( this.element.prop( "disabled" ) ? "tabindex='-1' " : "" ) +
			"class='ui-btn ui-mini ui-corner-all ui-shadow ui-btn-inline'></a>" )
				.text( text );
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

	_handleBlockClick: function( event ) {
		this._removeBlock( $( event.target ) );
	},

	_processInput: function( event, adjustWidth ) {
		var index, tokens, tokensLength, tokensToAdd,
			value = this.element.val();
		// 59, 186 : semicolon, colon

		if ( arguments.length < 2 ) {
			adjustWidth = true;
		}

		if ( event && event.keyCode === $.ui.keyCode.BACKSPACE &&
			value === this._inputShadow.text() ) {
				this._removeBlock( this.element.prevAll( "a.ui-btn" ).first() );
		} else {
			if ( !event ||
				event.keyCode === $.ui.keyCode.ENTER ||
				event.keyCode === $.ui.keyCode.COMMA ||
				event.keyCode === 186 || event.keyCode === 59 ) {

					tokens = this._tokenizeInput( value );
					tokensLength = tokens.length;
					value = ( !value.match( terminatorRegex ) ? tokens[ tokensLength - 1 ] : "" );
					tokensToAdd = tokensLength - ( value ? 1 : 0 );

					if ( tokensToAdd > 0 ) {
						this.widget().addClass( "initial" );
						for ( index = 0 ; index < tokensToAdd; index++ ) {
							this._add( $.trim( tokens[ index ] ) );
						}
					}

					this.element.val( value );
			}
			this.element.prevAll( "a.ui-btn.ui-btn-active" ).removeClass( "ui-btn-active" );
		}

		this._inputShadow.text( this.element.val() );
		if ( adjustWidth ) {
			this._adjustWidth();
			this.widget().removeClass( "initial" );
		}
	},

	_removeBlock: function( block ) {
		if ( block.hasClass( "ui-btn-active" ) ) {
			block.remove();
			this._adjustWidth();
		} else if ( this._trigger( "select", { value: block.jqmData( "value" ) } ) ) {
			block.addClass( "ui-btn-active" );
		}
	},

	_adjustWidth: function() {
		var top, padding, minWidth,
			width = 0,
			input = this.element;

		buttons = input.prevAll( "a.ui-btn" );

		if ( buttons.length > 0 ) {
			buttons.each( function() {
				var block = $( this ),
					blockTop = block.offset().top;

				if ( top === undefined ) {
					top = blockTop;
				} else if ( top !== blockTop ) {
					return false;
				}

				width += block.outerWidth( true );
			});

			padding = ( input.outerWidth() - input.width() );

			width = Math.max( 0, this.widget().width() - width - padding );

			if ( width < this._inputShadow.width() + padding ) {
				width = 0;
			}
		}

		input.width( width || "" );
		this._inputIsStretched = !!width;
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

		this._block( value )
			.jqmData( "value", value )
			.insertBefore( destination );
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
				this.widget().removeClass( "initial" );
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

// Textinputs that have data-role="tokentextarea" are no longer to be enhanced as textinput
$.mobile.reduceEnhancementScope( "mobile", "textinput",
	"[data-" + $.mobile.ns + "role='tokentextarea2']" );

})( jQuery, window, document );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
