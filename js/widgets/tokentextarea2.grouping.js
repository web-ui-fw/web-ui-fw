//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Token text area item grouping
//>>label: Token text area
//>>group: Widgets
//>>css.structure: ../../css/structure/web-ui-fw.tokentextarea2.grouping.css

define([
	"jquery",
	"./tokentextarea2" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");

( function( $, window, document, undefined ) {

$.widget( "mobile.tokentextarea2", $.mobile.tokentextarea2, {
	options: {
		description: "+ {0}"
	},

	_create: function() {
		this._superApply( arguments );

		if ( this.inputNeedsWrap ) {
			if ( this.options.enhanced ) {
				this._summary = this.widget().children( ".ui-tokentextarea2-summary" );
			}

			this._on( this.widget(), {
				"focusin": "_handleFocusIn"
			});
		}
	},

	_enhance: function() {
		this._superApply( arguments );
		if ( this.inputNeedsWrap ) {
			this._summary = $( "<span class='ui-tokentextarea2-summary'></span>" )
				.prependTo( this.widget() );
		}
	},

	_handleFocusIn: function() {
		this.focusIn();
	},

	focusIn: function() {
		if ( this.inputNeedsWrap ) {
			this.widget().removeClass( "ui-tokentextarea2-grouped" );
			this._adjustWidth();
		}
	},

	focusOut: function() {
		var numberOfButtons;

		if ( this.inputNeedsWrap ) {
			numberOfButtons = this.element.prevAll( "a.ui-tokentextarea2-button" ).length;

			this._summary
				.text( numberOfButtons > 0 ?
					this.options.description.replace( /\{0\}/, numberOfButtons ) :
					"" );
			this.widget()
				.addClass( "ui-tokentextarea2-grouped" )
				.removeClass( "stretched-input" );
		}
	}
});

})( jQuery, window, document );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
