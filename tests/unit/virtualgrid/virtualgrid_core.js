( function( $ ) {

	module( "virtualgrid" );

	test( "Virtualgrid test cases.", function() {
		var	$virtualgrid = $(".ui-virtualgrid-view"),
			$view, toXPos = 0, toYPos = 220;

		deepEqual( $virtualgrid.length  , 1, "Virtualgrid is created." );
		$view = $virtualgrid.find( ".ui-virtualgrid-overthrow" ) [ 0 ];
		$virtualgrid.virtualgrid( "scrollTo", toXPos, toYPos );

		asyncTest ( "asynchronous test :  scroll move test.", function (){
			setTimeout( function () {
				deepEqual( $view.scrollLeft  , toXPos, "new x position." );
				deepEqual( $view.scrollTop  , toYPos, "new y position" );
				start();
			}, 300 );
		});
	});

})( jQuery );
