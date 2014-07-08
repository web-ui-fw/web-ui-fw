//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Make words into selectable tokens
//>>label: Token text area
//>>group: Widgets
//>>css.structure: ../../css/structure/web-ui-fw.tokentextarea2.css

define([
	"jquery",
	"jqm/widgets/forms/textinput",
	"../web-ui-fw.reduceScope" ], function( jQuery ) {

( function( $, window, document, undefined ) {

var regexString = " *[;,] *",
	tokenizeRegex = new RegExp( regexString ),
	terminatorRegex = new RegExp( regexString + "$" );

$.widget( "mobile.tokentextarea2", $.mobile.textinput, {
	_create: function() {
		this._superApply( arguments );
		this._on({
			"keyup": "_handleKeyUp",
			"paste": "_handlePaste"
		});
	},

	_enhance: function() {
		this._superApply( arguments );
		this.widget().addClass( "ui-tokentextarea2" );
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

	_handlePaste: function() {
		setTimeout( $.proxy( this, "_handleKeyUp" ), 0 );
	},

	_handleKeyUp: function( event ) {
		var index, tokens, tokensLength, keepLast,
			adjustWidth = false,
			value = this.element.val();
		// 186 : semi-colon

		if ( !event ||
			event.keyCode === $.ui.keyCode.ENTER ||
			event.keyCode === $.ui.keyCode.COMMA ||
			event.keyCode === 186 ) {

				tokens = this._tokenizeInput( value );
				tokensLength = tokens.length;
				keepLast = !value.match( terminatorRegex );

				for ( index = 0 ; index < tokensLength - ( keepLast ? 1 : 0 ); index++ ) {
					this._block( tokens[ index ] )
						.jqmData( "value", tokens[ index ] )
						.insertBefore( this.element );
				}

				this.element.val( keepLast ? tokens[ tokensLength - 1 ] : "" );

				this._adjustWidth();
		} else if ( event.keyCode === $.ui.keyCode.BACKSPACE && value === "" ) {
			if ( this._removeBlock( this.element.prevAll( "a.ui-btn" ).first() ) ) {
				this._adjustWidth();
			}
		}
	},

	_removeBlock: function( block ) {
		block.remove();
		return true;
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

		this.element.width( containerWidth - width -
			( this.element.outerWidth() - this.element.width() ) );
	},

	inputText: function( newText ) {
		var text = "",
			buttons = this.element.prevAll( "a.ui-btn" );

		if ( arguments.length === 0 ) {
			buttons.reverse().each( function() {
				text += $( this ).jqmData( "value" ) + ";";
			});

			return text + input.val();
		} else {
			buttons.remove();
			this.element.val( newText );
			this._handleKeyUp();
		}
	}
});

// Textinputs that have data-role="tokentextarea" are no longer to be enhanced as textinput
$.mobile.reduceEnhancementScope( "mobile", "textinput", "[data-role='tokentextarea2']" );

})( jQuery, window, document );

});
