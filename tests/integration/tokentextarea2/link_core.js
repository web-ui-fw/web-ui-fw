test( "Widget is correctly instantiated", function() {
	var input = $( "#enhance-test" );

	deepEqual( input.parent().hasClass( "ui-tokentextarea2" ), true,
		"input parent has class ui-tokentextarea2" );
	deepEqual( input.siblings( "#enhance-test-link" ).length, 1,
		"link is sibling of input" );
	deepEqual( input.parent().hasClass( "ui-input-has-clear" ), true,
		"input parent has class ui-input-has-clear" );
	deepEqual( $( "#enhance-test-link" ).hasClass( "ui-input-clear" ), true,
		"link has class ui-input-clear" );
});

test( "Setting link at runtime works", function() {
	var input = $( "#set-link-at-runtime" );

	deepEqual( input.parent().hasClass( "ui-input-has-clear" ), false,
		"input parent does not initially have class ui-input-has-clear" );

	input.tokentextarea2( "option", "link", "#runtime-link-1" );

	deepEqual( input.siblings( "#runtime-link-1" ).length, 1,
		"runtime-link-1 has become a sibling of the input" );
	deepEqual( $( "#runtime-link-1" ).hasClass( "ui-input-clear" ), true,
		"The link has the class ui-input-clear" );
	deepEqual( input.parent().hasClass( "ui-input-has-clear" ), true,
		"Input parent has class ui-input-hashc-clear" );

	input.tokentextarea2( "option", "link", "#runtime-link-2" );

	deepEqual( input.siblings( "#runtime-link-1" ).length, 0,
		"runtime-link-1 is no longer a sibling of the input" );
	deepEqual( input.siblings( "#runtime-link-2" ).length, 1,
		"runtime-link-2 has become a sibling of the input" );
	deepEqual( $( "#runtime-link-2" ).hasClass( "ui-input-clear" ), true,
		"The new link has the class ui-input-clear" );
	deepEqual( input.parent().hasClass( "ui-input-has-clear" ), true,
		"Input parent still has class ui-input-hashc-clear" );

	input.tokentextarea2( "option", "link", null );

	deepEqual( input.siblings( "#runtime-link-1,#runtime-link-2" ).length, 0,
		"Neither runtime-link-1 nor runtime-link-2 is any longer a sibling of the input" );
	deepEqual( input.parent().hasClass( "ui-input-has-clear" ), false,
		"Input parent no longer has class 'ui-input-has-clear'" );
});
