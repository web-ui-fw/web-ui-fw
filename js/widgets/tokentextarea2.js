//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Make words into selectable tokens
//>>label: Token text area
//>>group: Widgets
//>>css.structure: ../../css/structure/web-ui-fw.tokentextarea2.css

define([
	"jquery",
	"jqm/widgets/forms/textinput",
	"jqm/vmouse",
	"../web-ui-fw.reduceScope" ], function( jQuery ) {

( function( $, window, document, undefined ) {

var regexString = " *[;,] *",
	tokenizeRegex = new RegExp( regexString ),
	terminatorRegex = new RegExp( regexString + "$" );

$.widget( "mobile.tokentextarea2", $.mobile.textinput, {
	_create: function() {
		this._superApply( arguments );
		this._on({
			"keyup": "_processInput",
			"paste": "_handlePaste",
			"change": "_processInput",
			"vclick a[href='#']": "_handleBlockClick",
			"focusin": "_handleInitialFocusIn"
		});

		this._on( this.window, { "throttledresize": "_adjustWidth" } );

		this._on( this.widget(), { "vmousedown": "_handleInitialFocusIn" } );
	},

	_enhance: function() {
		this._superApply( arguments );
		this.widget().addClass( "ui-tokentextarea2 initial" );
		this._processInput( null, false );
		this._inputShadow = $( "<span class='input-shadow'></span>" ).appendTo( this.widget() );
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
		return $( "<a href='#' class='ui-btn ui-mini ui-corner-all ui-shadow ui-btn-inline'>" +
			text + "</a>" );
	},

	_handleInitialFocusIn: function() {
		if ( this.widget().hasClass( "initial" ) ) {
			this.widget().removeClass( "initial" );
			this._adjustWidth();
			this._delay( function() { this.element.focus() } );
		}
	},

	_handlePaste: function() {
		this._delay( "_handleKeyUp" );
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

		} else if ( event.keyCode === $.ui.keyCode.BACKSPACE && value === "" ) {
			this._removeBlock( this.element.prevAll( "a.ui-btn" ).first() );
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
		var text = "",
			buttons = this.element.prevAll( "a.ui-btn" );

		if ( arguments.length === 0 ) {
			return this._textFromButtons( $( buttons.get().reverse() ) ) + input.val();
		} else {
			buttons.remove();
			this.element.val( newText );
			this._processInput();
		}
	},

	add: function( value, index ) {
		var buttons,
			destination = this.element;

		if ( arguments.length > 1 ) {
			buttons = this.element.prevAll( "a.ui-btn" ).get().reverse();
			if ( index >= 0 && index < buttons.length ) {
				destination = $( buttons[ index ] )
			}
		}

		this._block( value )
			.jqmData( "value", value )
			.insertBefore( destination );
	},

	length: function() {
		return this.element.prevAll( "a.ui-btn" ).length;
	},

	remove: function( position ) {
		var buttons = this.element.prevAll( "a.ui-btn" );

		if ( arguments.length > 0 && position >= 0 && position < buttons.length ) {
			buttons = $( buttons.get().reverse()[ position ] );
		}

		buttons.remove();
	},

	select: function( index ) {
		var buttons;

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
});

// Textinputs that have data-role="tokentextarea" are no longer to be enhanced as textinput
$.mobile.reduceEnhancementScope( "mobile", "textinput", "[data-role='tokentextarea2']" );

})( jQuery, window, document );

});
