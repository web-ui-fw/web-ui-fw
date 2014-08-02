test( "Element is enhanced correctly", function() {
	deepEqual( $( "#enhance-test" ).siblings( ".ui-tokentextarea2-summary" ).length, 1,
		"The input has a summary" );
});

test( "Element with initial buttons has correct summary", function() {
	deepEqual( $( "#initial-buttons-test" ).siblings( ".ui-tokentextarea2-summary" ).text(), "+ 1",
		"Summary text is correct" );
});

test( "Summary updates even when it is hidden", function() {
	var input = $( "#update-summary-while-hidden" );

	deepEqual( input.siblings( ".ui-tokentextarea2-summary" ).text(),
		"", "Initially summary is empty" );

	input
		.val( "abc@def.com;" )
		.trigger( "change" );

	deepEqual( input.siblings( ".ui-tokentextarea2-summary" ).text(),
		"+ 1", "Updating the summary works" );
});

test( "Calling focusOut() activates summary display", function() {
	var input = $( "#focus-out-test" );

	deepEqual( input.parent().hasClass( "ui-tokentextarea2-grouped" ), false,
		"Class ui-tokentextarea2-grouped not initially present" );

	deepEqual( input.siblings( ".ui-tokentextarea2-summary" ).is( ":visible" ), false,
		"Summary is not initially visible" );

	input.tokentextarea2( "focusOut" );

	deepEqual( input.parent().hasClass( "ui-tokentextarea2-grouped" ), true,
		"Class ui-tokentextarea2-grouped present after focusOut()" );

	deepEqual( input.siblings( ".ui-tokentextarea2-summary" ).is( ":visible" ), true,
		"Summary visible after focusOut()" );
});
