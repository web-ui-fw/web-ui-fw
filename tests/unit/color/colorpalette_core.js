( function( $ ) {

	module( "colorpalette" );

	test( "_makePalette contains colour around which it's supposed to build a palette", function() {
		var clr = "#23fe9a",
			pal = $.mobile.colorpalette.prototype._makePalette( $.Color( clr ), 13 ),
			found = false;

		$.each( pal.split( "," ), function( key, value ) {
			if ( clr === value ) {
				found = true;
				return false;
			}
		});

		deepEqual( found, true, "Colour " + clr + " is present in the generated palette" );
	});

})( jQuery );
