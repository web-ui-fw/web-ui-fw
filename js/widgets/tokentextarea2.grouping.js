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
			this._updateText();
		}
	},

	_handleFocusIn: function() {
		this.focusIn();
	},

	_updateText: function() {
		var numberOfButtons = this.element.prevAll( "a.ui-tokentextarea2-button" ).length;

		if ( this._summary ) {
			this._summary
				.text( numberOfButtons > 0 ?
					this.options.description.replace( /\{0\}/, numberOfButtons ) : "" );
		}
	},

	_add: function() {
		this._superApply( arguments );
		if ( this.inputNeedsWrap ) {
			this._updateText();
		}
	},

	_remove: function() {
		this._superApply( arguments );
		if ( this.inputNeedsWrap ) {
			this._updateText();
		}
	},

	focusIn: function() {
		if ( this.inputNeedsWrap ) {
			this.widget().removeClass( "ui-tokentextarea2-grouped" );
			this._adjustWidth();
		}
	},

	focusOut: function() {
		if ( this.inputNeedsWrap ) {
			this._updateText();
			this.widget()
				.addClass( "ui-tokentextarea2-grouped" )
				.removeClass( "stretched-input" );
		}
	},

	_destroy: function() {
		if ( this.inputNeedsWrap && !this.options.enhanced ) {
			this._summary.remove();
			this.widget().removeClass( "ui-tokentextarea2-grouped" );
		}
		return this._superApply( arguments );
	}
});

})( jQuery, window, document );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
