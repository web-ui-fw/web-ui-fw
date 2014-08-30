test( "Element is enhanced correctly", function() {
	deepEqual( $( "#enhance-test" ).siblings( ".ui-tokentextarea-summary" ).length, 1,
		"The input has a summary" );
});

test( "Element with initial buttons has correct summary", function() {
	deepEqual( $( "#initial-buttons-test" ).siblings( ".ui-tokentextarea-summary" ).text(), "+ 1",
		"Summary text is correct" );
});

test( "Summary updates even when it is hidden", function() {
	var input = $( "#update-summary-while-hidden" );

	deepEqual( input.siblings( ".ui-tokentextarea-summary" ).text(),
		"", "Initially summary is empty" );

	input
		.val( "abc@def.com;" )
		.trigger( "change" );

	deepEqual( input.siblings( ".ui-tokentextarea-summary" ).text(),
		"+ 1", "Updating the summary works" );

	input.tokentextarea( "remove" );

	deepEqual( input.siblings( ".ui-tokentextarea-summary" ).text(), "",
		"Calling remove() updates the summary" );
});

test( "Calling focusOut() activates summary display and focusIn() puts it back", function() {
	var input = $( "#focus-out-test" );

	deepEqual( input.parent().hasClass( "ui-tokentextarea-grouped" ), false,
		"Class ui-tokentextarea-grouped not initially present" );

	deepEqual( input.siblings( ".ui-tokentextarea-summary" ).is( ":visible" ), false,
		"Summary is not initially visible" );

	input.tokentextarea( "focusOut" );

	deepEqual( input.parent().hasClass( "ui-tokentextarea-grouped" ), true,
		"Class ui-tokentextarea-grouped present after focusOut()" );

	deepEqual( input.siblings( ".ui-tokentextarea-summary" ).is( ":visible" ), true,
		"Summary visible after focusOut()" );

	input.tokentextarea( "focusIn" );

	deepEqual( input.parent().hasClass( "ui-tokentextarea-grouped" ), false,
		"Class ui-tokentextarea-grouped absent after focusIn()" );

	deepEqual( input.siblings( ".ui-tokentextarea-summary" ).is( ":visible" ), false,
		"Summary hidden after focusOut()" );
});

test( "Pre-rendered", function() {
	var input = $( "#pre-rendered-test" );

	input.tokentextarea( "add", "ryan@example.com" );

	deepEqual( input.siblings( ".ui-tokentextarea-summary" ).text(), "+ 2",
		"Pre-rendered summary reflects changes immediately" );
});
