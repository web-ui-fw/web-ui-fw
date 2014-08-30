( function( $ ) {

	module( "Tokentextarea" );

	var	$tokentextarea = $(".ui-tokentextarea").children( "input" ),
		items = [ "item-1", "item-2", "item-3" ],
		index = 0;

	test( "Tokentextarea test cases.", function() {
		var value, inputText, outputText;

		deepEqual( $tokentextarea.length  , 1, "The widget is created." );
		deepEqual( $tokentextarea.tokentextarea("length")  , 0 , "The widget has not text blocks.");
		
		/* Add */
		for ( ; index < items.length ; index++ ) {
			$tokentextarea.tokentextarea("add", items[ index ] );
		}
		deepEqual( $tokentextarea.tokentextarea("length") , items.length , "The widget has text blocks("+ items.length +").");

		 $tokentextarea.tokentextarea( "select", 0 );
		 value = $tokentextarea.tokentextarea( "select");
		 deepEqual( value, items[ 0 ] + ";" , "The widget do return a equal string("+ items[ 0 ] +";).");

		$tokentextarea.tokentextarea( "focusOut" );
		status = $tokentextarea.parent().hasClass( "ui-tokentextarea-grouped" );
		deepEqual( status, "true", "The widget status is focus-out. " );

		/* Focus In */
		$tokentextarea.tokentextarea( "focusIn" );
		status = !$tokentextarea.parent().hasClass( "ui-tokentextarea-grouped" );
		deepEqual( status, "true", "The widget status is focus-in." );

		/* input */
		inputText = "tokentextarea";
		$tokentextarea.tokentextarea( "inputText", inputText );
		outputText = $tokentextarea.tokentextarea( "inputText" );
		deepEqual( outputText, inputText, "Current typed word is '" + outputText + "' )" );

	});

	/* remove */
	asyncTest ( "asyncTest", function () {
		for ( index in items ) {
			$tokentextarea.tokentextarea( "add", items[ index ] );
		}
		$tokentextarea.tokentextarea( "remove", 0 );
		setTimeout( function () {
			deepEqual( $tokentextarea.tokentextarea( "length" ) , items.length - 1, "The widget has removed one item." );
			$tokentextarea.tokentextarea( "remove" );
		}, 500);

		setTimeout( function () {
			deepEqual( $tokentextarea.tokentextarea( "length" ), 0, "The widget has removed all items.");
			start();
		}, 1100);
	});

})( jQuery );
