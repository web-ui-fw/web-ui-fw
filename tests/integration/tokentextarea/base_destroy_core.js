asyncTest( "Destroying widget works", function() {
	var container = $( "#destroy-test-container" ),
		input = $( "#destroy-test" ),
		initial = container.clone();

	input.tokentextarea();

	$.testHelper.sequence([
		function() {
			input.focus();
		},
		function() {
			input.tokentextarea( "destroy" );
			deepEqual( $.testHelper.domEqual( container, initial ), true,
				"DOM after creation/destruction is identical to initial DOM" );
			start();
		}
	], 300 );
});
