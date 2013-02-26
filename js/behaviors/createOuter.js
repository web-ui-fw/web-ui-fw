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
