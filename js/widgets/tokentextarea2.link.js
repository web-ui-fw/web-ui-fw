//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Token text area item grouping
//>>label: Token text area
//>>group: Widgets
//>>css.structure: ../../css/structure/web-ui-fw.tokentextarea2.link.css

define([
	"jquery",
	"./tokentextarea2" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");

( function( $, window, document, undefined ) {

$.widget( "mobile.tokentextarea2", $.mobile.tokentextarea2, {
	options: {
		link: null
	},

	_create: function() {
		this._superApply( arguments );
		if ( this.inputNeedsWrap && !this.options.enhanced && this.options.link ) {
			this._link = this.widget().children( ".ui-input-clear" );
		}
	},

	_setLink: function( link ) {
		if ( this._link ) {
			this._link.remove();
			this._link = null;
		}

		if ( link ) {
			this._link = $( link )
				.appendTo( this.widget() )
				.addClass( "ui-input-clear" );
		}

		this.widget().toggleClass( "ui-input-has-clear", !!link );
	},

	_enhance: function() {
		this._superApply( arguments );
		if ( this.inputNeedsWrap ) {
			this._setLink( this.options.link );
		}
	},

	_setOptions: function( options ) {
		if ( this.inputNeedsWrap ) {
			if ( options.link !== undefined ) {
				this._setLink( options.link );
			}
		}
		return this._superApply( arguments );
	},

	_destroy: function() {
		if ( this.inputNeedsWrap && !this.options.enhanced ) {
			this._setLink( null );
		}
		return this._superApply( arguments );
	}
});

})( jQuery, window, document );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
