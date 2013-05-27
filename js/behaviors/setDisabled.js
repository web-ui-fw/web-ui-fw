//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Also get set .prop( "disabled" ) if this.element is an input.
//>>label: setDisabled
//>>group: Forms

define( [
	"jqm/jquery",
	"jqm/jquery.mobile.core" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");
( function( $, undefined ) {

$.mobile.behaviors.setDisabled = {
	_setOption: function( key, value ) {
		this._super( key, value );
		if ( key === "disabled" && this.element.is( "input" ) ) {
			this.element.prop( "disabled", !!value );
		}
	}
};

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
