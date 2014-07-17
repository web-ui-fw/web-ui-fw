test( "Block with long text is truncated", function() {
	var input = $( "#test-ellipsize" );

	ok( input.prev().outerWidth() <= input.parent().width(),
		"block width does not exceed wrapper width" );
});
