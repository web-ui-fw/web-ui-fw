//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Sync tokentextarea2 text with another input
//>>label: Token text area sync
//>>group: Widgets

define([
	"jquery",
	"./tokentextarea2" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");

( function( $, window, document, undefined ) {

$.widget( "mobile.tokentextarea2", $.mobile.tokentextarea2, {
	options: {
		master: null
	},

	_master: null,

	_enhance: function() {
		if ( this.inputNeedsWrap && this.options.master ) {
			this._setSync( this.options.master );
			if ( this._master ) {
				this.element.val( this._master.val() );
				this._master.val( "" );
			}
		}

		return this._superApply( arguments );
	},

	_processInput: function() {
		this._superApply( arguments );
		this._syncToMaster();
	},

	_setSync: function( newSync ) {
		if ( this._master ) {
			this._off( this._master, "change" );
			this._master = null;
		}
		newSync = $( newSync );
		if ( newSync.length > 0 ) {
			this._master = newSync;
			this._on( this._master, { "change": "_syncFromMaster" } );
		}
	},

	_setOptions: function( options ) {
		if ( options.master !== undefined ) {
			this._setSync( options.master );
			this._syncFromMaster();
		}

		return this._superApply( arguments );
	},

	_add: function() {
		this._superApply( arguments );
		this._syncToMaster();
	},

	_remove: function() {
		this._superApply( arguments );
		this._syncToMaster();
	},

	_syncToMaster: function() {
		if ( this._master ) {
			this._master.val( this.inputText() );
		}
	},

	_syncFromMaster: function() {
		if ( this._master && this.inputText() !== this._master.val() ) {
			this.inputText( this._master.val() );
			this._master.val( this.inputText() );
		}
	}
});

})( jQuery, window, document );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
