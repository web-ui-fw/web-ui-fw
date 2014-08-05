asyncTest( "Destroying widget works", function() {
	var container = $( "#destroy-test-container" ),
		input = $( "#destroy-test" ),
		initial = container.clone();

	input.tokentextarea2();

	$.testHelper.sequence([
		function() {
			input.focus();
		},
		function() {
			input.tokentextarea2( "destroy" );
			deepEqual( $.testHelper.domEqual( container, initial ), true,
				"DOM after creation/destruction is identical to initial DOM" );
			start();
		}
	], 300 );
});
