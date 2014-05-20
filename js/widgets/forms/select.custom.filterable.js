//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Extension to custom select menus to support menu filtering.
//>>label: Selects: Filterable custom menus
//>>group: Forms

define( [
	"jquery",
	"../filterable",
	"./textinput",
	"./clearButton",
	"../../navigation/path",
	"./select.custom" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {

$.widget( "mobile.selectmenu", $.mobile.selectmenu, {

	options: {
		menuFilter: null
	},

	build: function() {
		var returnValue, inputOptions,
			isSearch = false;

		returnValue = this._superApply( arguments );

		if ( this.options.menuFilter && !this.options.nativeMenu ) {
			this._form = $( "<form id='" + this.selectId + "-filter-form'></form>" );

			// Retrieve whether the input is to be of type data-search and then remove the key from
			// the options, because "search" not a valid textinput option
			inputOptions = this.options.menuFilter;
			isSearch = inputOptions.search;
			inputOptions = $.extend( {}, inputOptions );
			delete inputOptions.search;

			this._input = $( "<input id='" + this.selectId + "-filter-input'" +
					( isSearch ? ( "data-" + $.mobile.ns + "type='search'" ) : "" ) +
					"></input>" )
				.appendTo( this._form )
				.textinput( inputOptions );

			this.list
				.before( this._form )
				.filterable({
					input: $.mobile.path.hashToSelector( "#" + this.selectId + "-filter-input" )
				});
		}

		return returnValue;
	},

	_decideFormat: function() {
		var returnValue = this._superApply( arguments );

		this.list.before( this._form );

		return returnValue;
	}

	// TODO _destroy() is only relevant if the select menu is pre-rendered, so it needs to be
	// implemented whenever we implement the "enhanced" option
});

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
