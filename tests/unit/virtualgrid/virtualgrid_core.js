( function( $ ) {

	module( "virtualgrid" );

	asyncTest ( "asynchronous test : create virtualgrid.", function (){
		setTimeout( function () {
			var	$virtualgrid = $(".ui-virtualgrid-view"),
				$view, toXPos = 0, toYPos = 220;
			deepEqual( $virtualgrid.length  , 1, "Virtualgrid is created." );
			$virtualgrid.virtualgrid( "scrollTo", toXPos, toYPos );
			setTimeout ( function () {
				$view = $virtualgrid.find( ".ui-virtualgrid-scroll-container" )[ 0 ];
				deepEqual( $view.scrollLeft  , toXPos, "new x position." );
				deepEqual( $view.scrollTop  , toYPos, "new y position" );
				start();
			}, 600 );
		}, 3000 );
	});
})( jQuery );