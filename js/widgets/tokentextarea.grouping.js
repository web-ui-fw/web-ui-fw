//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Token text area item grouping
//>>label: Token text area
//>>group: Widgets
//>>css.structure: ../../css/structure/web-ui-fw.tokentextarea.grouping.css

define([
	"jquery",
	"./tokentextarea" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");

( function( $, window, document, undefined ) {

$.widget( "mobile.tokentextarea", $.mobile.tokentextarea, {
	options: {
		description: "+ {0}"
	},

	_create: function() {
		this._superApply( arguments );

		if ( this.inputNeedsWrap ) {
			if ( this.options.enhanced ) {
				this._summary = this.widget().children( ".ui-tokentextarea-summary" );
			}

			this._on( this.widget(), {
				"focusin": "focusIn"
			});
		}
	},

	_enhance: function() {
		this._superApply( arguments );
		if ( this.inputNeedsWrap ) {
			this._summary = $( "<span class='ui-tokentextarea-summary'></span>" )
				.prependTo( this.widget() );
			this._updateText();
		}
	},

	_updateText: function() {
		var numberOfButtons = this.element.prevAll( "a.ui-tokentextarea-button" ).length;

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
			this.widget().removeClass( "ui-tokentextarea-grouped" );
			this._adjustWidth();
		}
	},

	focusOut: function() {
		if ( this.inputNeedsWrap ) {
			this._updateText();
			this.widget()
				.addClass( "ui-tokentextarea-grouped" )
				.removeClass( "stretched-input" );
			this.element.blur();
		}
	},

	_destroy: function() {
		if ( this.inputNeedsWrap && !this.options.enhanced ) {
			this._summary.remove();
			this.widget().removeClass( "ui-tokentextarea-grouped" );
		}
		return this._superApply( arguments );
	}
});

})( jQuery, window, document );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
