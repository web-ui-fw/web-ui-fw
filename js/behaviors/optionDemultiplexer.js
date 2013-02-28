//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Route calls to _setOption( optionName, value ) to _set<OptionName>( value )
//>>label: optionDemultiplexer
//>>group: Forms

define( [
	"jqm/jquery",
	"jqm/jquery.mobile.core" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
( function( $, undefined ) {

$.mobile.behaviors.optionDemultiplexer = {
	_setOption: function( key, value ) {
		var setter = "_set" + key.charAt( 0 ).toUpperCase() + key.slice( 1 );

		if ( this[ setter ] !== undefined ) {
			this[ setter ]( value );
		}

		this._super( key, value );

		if ( key !== "initSelector" ) {
			this.element.attr( "data-" + ( $.mobile.ns || "" ) + ( key.replace( /([A-Z])/, "-$1" ).toLowerCase() ), value );
		}
	}
};

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
