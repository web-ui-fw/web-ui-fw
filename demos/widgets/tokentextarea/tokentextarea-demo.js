( function ( $, window ) {
	$( document ).ready( function () {
		$( document ).delegate("#MBTaddItemTest", "click", function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "add", "additem" );
		});

		$( document ).delegate( "#MBTremoveItemTest", "click",function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "remove", 0 );
		});

		$( document ).delegate( "#MBTinputTextTest", "click",function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "inputText", "Hello~~~" );
		});

		$( document ).delegate( "#MBTgetInputTextTest", "click",function () {
			var input = $( ":jqmData(role='tokentextarea')" ).tokentextarea( "inputText" );
			window.alert( "input String : " + input );
		});

		$( document ).delegate("#MBTremoveAllItemTest", "click",function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "remove" );
		});

		$( document ).delegate("#MBTgetSelectedItemTest", "click",function () {
			var content = $( ":jqmData(role='tokentextarea')" ).tokentextarea( "select" );
			window.alert( "Select content : " + content );
		});

		$( document ).delegate( "#MBTselectItemTest", "click",function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "select", 0 );
		});

		$( document ).delegate( "#MBTlengthTest", "click",function () {
			var length = $( ":jqmData(role='tokentextarea')" ).tokentextarea( "length" );
			window.alert( "length : " + length );
		});

		$( document ).delegate( "#MBTfocusInTest", "click",function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "focusIn", 0 );
		});

		$( document ).delegate( "#MBTfocusOutTest", "click",function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "focusOut", 0 );
		});

		$( document ).delegate( "#MBTdestroyTest", "click",function () {
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "destroy" );
		});

		$( document ).delegate(  ".name-resource", "click",function () {
			var arg = $( this ).text();
			$( ":jqmData(role='tokentextarea')" ).tokentextarea( "add", arg );
		});

	});
} ( jQuery, window ) );