//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Make words into selectable tokens
//>>label: Token text area
//>>group: Widgets
//>>css.structure: ../../css/structure/web-ui-fw.tokentextarea2.css

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
			}

			this._on({
				"keyup": "_processInput",
				"paste": "_handlePaste",
				"change": "_processInput",
				"vclick a[href='#']": "_handleBlockClick",
				"focusin": "_handleInputFocusIn"
			});
			this._on( this.window, { "throttledresize": "_adjustWidth" } );
			this._on( outer, { "vmousedown": "_handleWidgetVMouseDown" } );
		}
	},

	_enhance: function() {
		var outer;

		this._superApply( arguments );

		if ( this.inputNeedsWrap ) {
			this._processInput( null, false );
			outer = this.widget().addClass( "ui-tokentextarea2" +
				( ( this.element.prevAll( "a.ui-btn" ).length > 0 ) ?
					" initial" : "" ) );
			this._inputShadow = $( "<span class='ui-tokentextarea2-input-shadow'></span>" )
				.appendTo( outer );
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

	_tokenizeInput: function( value ) {
		var tokens = [];

		$.each( value.split( tokenizeRegex ), function( index, token ) {
			token = $.trim( token );
			if ( token !== "" ) {
				tokens.push( token );
			}
		});

		return tokens;
	},

	_block: function( text ) {
		return $( "<a href='#' " +
			( this.element.prop( "disabled" ) ? "tabindex='-1' " : "" ) +
			"class='ui-btn ui-mini ui-corner-all ui-shadow ui-btn-inline'>" +
			text + "</a>" );
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

	_handleInputFocusIn: function() {
		var outer = this.widget();

		if ( outer.hasClass( "initial" ) ) {
			this._adjustWidth();
			outer.removeClass( "initial" );
		}
	},

	_handlePaste: function() {
		this._delay( "_processInput" );
	},

	_handleBlockClick: function( event ) {
		var block = $( event.target );

		if ( this._trigger( "select", { block: block } ) ) {
			if ( block.hasClass( "ui-btn-active" ) ) {
				block.remove();
			} else {
				block.addClass( "ui-btn-active" );
			}
		}
	},

	_processInput: function( event, adjustWidth ) {
		var index, tokens, tokensLength, keepLast,
			value = this.element.val();
		// 186 : semi-colon

		if ( arguments.length < 2 ) {
			adjustWidth = true;
		}

		if ( !event ||
			event.keyCode === $.ui.keyCode.ENTER ||
			event.keyCode === $.ui.keyCode.COMMA ||
			event.keyCode === 186 ) {

				tokens = this._tokenizeInput( value );
				tokensLength = tokens.length;
				keepLast = !value.match( terminatorRegex );

				for ( index = 0 ; index < tokensLength - ( keepLast ? 1 : 0 ); index++ ) {
					this.add( tokens[ index ] );
				}

				this.element.val( keepLast ? tokens[ tokensLength - 1 ] : "" );

		} else if ( event.keyCode === $.ui.keyCode.BACKSPACE &&
			value === "" &&
			this._inputShadow.text() === "" ) {

				this._removeBlock( this.element.prevAll( "a.ui-btn" ).first() );
		} else {
			this.element.prevAll( "a.ui-btn.ui-btn-active" ).removeClass( "ui-btn-active" );
		}

		if ( adjustWidth ) {
			this._adjustWidth();
		}
	},

	_removeBlock: function( block ) {
		var returnValue = false;

		if ( block.hasClass( "ui-btn-active" ) ) {
			block.remove();
			returnValue = true;
		} else {
			block.addClass( "ui-btn-active" );
		}

		return returnValue;
	},

	_adjustWidth: function() {
		var top,
			width = 0,
			containerWidth = this.widget().width(),
			blocks = this.element.prevAll( "a.ui-btn" );

			$.each( blocks, function() {
				var block = $( this ),
					blockTop = block.offset().top;

				if ( top === undefined ) {
					top = blockTop;
				} else if ( top !== blockTop ) {
					return false;
				}

				width += block.outerWidth( true );
			});

		this._inputShadow.text( this.element.val() );

		width = containerWidth - width - ( this.element.outerWidth() - this.element.width() );

		// If the input width is insufficient to properly display its text, unset the width. This
		// will cause the input to have width 100% (set earlier in the CSS) and thus wrap to the
		// next line.
		this.element.width( ( width < this._inputShadow.width() ) ? "" : width );
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

	add: function( value, index ) {
		var buttons, destination;

		if ( this.inputNeedsWrap ) {
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
		}
	},

	length: function() {
		return ( this.inputNeedsWrap ? this.element.prevAll( "a.ui-btn" ).length : 0 );
	},

	remove: function( position ) {
		var buttons;

		if ( this.inputNeedsWrap ) {
			buttons = this.element.prevAll( "a.ui-btn" );

			if ( arguments.length > 0 && position >= 0 && position < buttons.length ) {
				buttons = $( buttons.get().reverse()[ position ] );
			}

			buttons.remove();
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
		this._processInput();
		this._handleInputFocusIn();
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
