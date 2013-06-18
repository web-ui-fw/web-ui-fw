( function( $ ) {

	module( "virtualgrid" );

	test( "_makePalette contains colour around which it's supposed to build a palette", function() {
		var $virtualgrid = $(".ui-virtualgrid-view");

		deepEqual( $virtualgrid.length  , 1, "Virtualgrid is created." );
	});

})( jQuery );
