//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Establish outermost element for a widget
//>>label: createOuter
//>>group: Infrastructure

define( [
	"jqm/jquery",
	"jqm/jquery.mobile.core"
	], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
( function( $, undefined ) {

$.mobile.behaviors.createOuter = {
	_createOuter: function() {
		var ret;

		// Establish the outer element
		if ( this.element.is( "input" ) ) {
			ret = $( "<div></div>" )
				.insertAfter( this.element )
				.append( this.element );
			this.element.css( { display: "none" } );
		} else {
			ret = this.element;
		}

		return ret;
	}
};

})( jQuery );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
