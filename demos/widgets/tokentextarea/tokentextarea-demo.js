( function ( $, window ) {
	$( document ).ready( function () {
		$( document ).delegate("#TTAaddItemTest", "click", function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "add", "additem" );
		});

		$( document ).delegate( "#TTAremoveItemTest", "click",function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "remove", 0 );
		});

		$( document ).delegate( "#TTAinputTextTest", "click",function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "inputText", "Hello~~~" );
		});

		$( document ).delegate( "#TTAgetInputTextTest", "click",function () {
			var input = $( ":jqmData(role='tokentextarea')" ).tokentextarea( "inputText" );
			window.alert( "input String : " + input );
		});

		$( document ).delegate("#TTAremoveAllItemTest", "click",function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "remove" );
		});

		$( document ).delegate("#TTAgetSelectedItemTest", "click",function () {
			var content = $( ":jqmData(role='tokentextarea')" ).tokentextarea( "select" );
			window.alert( "Select content : " + content );
		});

		$( document ).delegate( "#TTAselectItemTest", "click",function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "select", 0 );
		});

		$( document ).delegate( "#TTAlengthTest", "click",function () {
			var length = $( ":jqmData(role='tokentextarea')" ).tokentextarea( "length" );
			window.alert( "length : " + length );
		});

		$( document ).delegate( "#TTAfocusInTest", "click",function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "focusIn", 0 );
		});

		$( document ).delegate( "#TTAfocusOutTest", "click",function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "focusOut", 0 );
		});

		$( document ).delegate( "#TTAdestroyTest", "click",function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "destroy" );
		});

		$( document ).delegate(  ".name-resource", "click",function () {
			var arg = $( this ).text();
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "add", arg );
		});

	});
} ( jQuery, window ) );
