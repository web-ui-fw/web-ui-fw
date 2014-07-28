test( "class 'stretched-input' correctly applied during enhancement", function() {
	deepEqual( $( "#enhance-test" ).parent().hasClass( "stretched-input" ), false,
		"When there's no initial value, there's no class 'stretched-input' on the wrapper" );
	deepEqual(
		$( "#enhance-test-initial-value-no-tokens" ).parent().hasClass( "stretched-input" ), false,
		"When there's no initial value, there's no class 'stretched-input' on the wrapper" );
	deepEqual( $( "#enhance-test-initial-tokens" ).parent().hasClass( "stretched-input" ), true,
		"When the input has an initial value, the wrapper initially has class 'stretched-input'" );
	deepEqual( $( "#enhance-test-initial-value-tokens" ).parent().hasClass( "stretched-input" ),
		true, "When the input has an initial value, the wrapper initially has class 'initial'" );
});

test( "token generation", function() {
	var input = $( "#token-generation" ),
		testOne = function( text, value, keyCode ) {
			input.val( text );
			input.trigger( $.extend( $.Event( "keyup" ), { keyCode: keyCode } ) );
			deepEqual( input.prev( "a.ui-btn" ).text(), value,
				"After '" + text.substr( text.length - 1, 1 ) + "': A button with text " +
					"'" + value + "' now precedes the input" );
			deepEqual( input.prev( "a.ui-btn" ).jqmData( "value" ), value,
				"After '" + text.substr( text.length - 1, 1 ) + "': the button has '" +
					value + "' at key 'value'" );
		};

	testOne( "abc@def.com,", "abc@def.com", $.ui.keyCode.COMMA );
	testOne( "ghi@jkl.com;", "ghi@jkl.com", 186 );
});

test( "backspace works correctly", function() {
	input = $( "#backspace" );

	input.val( "g" );
	input.trigger( $.extend( $.Event( "keyup" ), { keyCode: $.ui.keyCode.BACKSPACE } ) );

	deepEqual( input.prev().hasClass( "ui-btn-active" ), false,
		"When only one character left, previous token is not selected" );

	input.val( "" );
	input.trigger( $.extend( $.Event( "keyup" ), { keyCode: $.ui.keyCode.BACKSPACE } ) );

	deepEqual( input.prev().hasClass( "ui-btn-active" ), false,
		"When removing last character, previous token is not selected" );

	input.trigger( $.extend( $.Event( "keyup" ), { keyCode: $.ui.keyCode.BACKSPACE } ) );

	deepEqual( input.prev().hasClass( "ui-btn-active" ), true,
		"When backspacing on empty input, previous token is selected" );

	input.trigger( $.extend( $.Event( "keyup" ), { keyCode: $.ui.keyCode.BACKSPACE } ) );

	deepEqual( input.prev( "a.ui-btn" ).length, 0,
		"Backspacing on empty input with previous token selected removes selected token" );
});

asyncTest( "mousing down on wrapper focuses input", function() {
	expect( 1 );

	var input = $( "#focus-test-vmousedown" );

	$.testHelper.detailedEventCascade([
		function() {
			input.parent().trigger( "vmousedown" );
		},
		{
			focusin: { src: input, event: "focusin.mousingDownOnWrapper1" }
		},
		function( result ) {
			deepEqual( result.focusin.timedOut, false, "input has emitted focusin" );
			start();
		}
	]);
});

asyncTest( "input wraps to next line to accommodate typed text", function() {
	var intervalId, previousLeft,
		length = 0,
		longInputString = "this.is.a.long.email.address@this.is.a.long.domain.name.com",
		input = $( "#wrap-test" ),
		initialLeft = input.offset().left,
		maxLeft = initialLeft,
		currentLeft = initialLeft,
		resolve = function( success ) {
			ok( success, "input has wrapped when typed text no longer fits" );
			deepEqual( input.parent().hasClass( "stretched-input" ), false,
				"wrapper no longer has class stretched-input" );
			clearInterval( intervalId );
			start();
		},
		appendSingleCharacter = function() {
			var substringToAdd;

			length++;
			if ( length <= longInputString.length ) {
				substringToAdd = longInputString.substr( 0, length );
				input.val( substringToAdd );
				input.trigger( "keyup" );

				if ( input.offset().left === initialLeft ) {
					resolve( true );
				}
			} else {
				resolve( false );
			}
		};

	// Fill the first row with tokens to establish the last position of the input before it wraps
	while ( true ) {
		input.tokentextarea2( "add", "abc@def.com" );
		previousLeft = currentLeft;
		currentLeft = input.offset().left;
		if ( currentLeft < previousLeft ) {
			break;
		}
		maxLeft = Math.max( maxLeft, currentLeft );
	}

	// Go back to a state where adding another block would cause a wrap
	while ( true ) {
		input.tokentextarea2( "add", "abc@def.com" );
		currentLeft = input.offset().left;
		if ( currentLeft === maxLeft ) {
			break;
		}
	}

	// Now typing something longer than abc@def.com should cause a wrap
	intervalId = setInterval( appendSingleCharacter, 100 );
});

test( "Clicking on token works", function() {
	var input = $( "#click-twice-to-remove-token" ),
		top = input.offset().top;

	input.prev().click();

	deepEqual( input.prev().hasClass( "ui-btn-active" ), true,
		"clicking on token causes class 'ui-btn-active' to be added" );

	input.prev().click();

	deepEqual( input.prev( "a.ui-btn" ).length, 0, "clicking on token again removes it" );
});

test( "Public API works", function() {
	var input = $( "#refresh-test" );

	input.val( "abc@def.com; ghi@jkl.com, mno@pqr.com; stu " ).tokentextarea2( "refresh" );

	deepEqual( input.prevAll( ".ui-tokentextarea2-button" ).length, 3,
		"refresh(): Two buttons were added" );

	deepEqual( input
		.prev( ".ui-tokentextarea2-button" )
			.prev( ".ui-tokentextarea2-button" )
				.prev( ".ui-tokentextarea2-button" )
					.text(), "abc@def.com",
		"refresh(): First added button text is correct" );

	deepEqual( input
		.prev( ".ui-tokentextarea2-button" )
			.prev( ".ui-tokentextarea2-button" )
				.text(), "ghi@jkl.com",
		"refresh(): Second added button text is correct" );

	deepEqual( input.prev( ".ui-tokentextarea2-button" ).text(), "mno@pqr.com",
		"refresh(): Third added button text is correct" );

	deepEqual( input.val(), "stu ", "refresh(): Leftover text is correct" );

	deepEqual( input.tokentextarea2( "inputText" ), "abc@def.com;ghi@jkl.com;mno@pqr.com;stu ",
		"inputText() returns the correct value" );

	input.tokentextarea2( "inputText", "foo@example.com; bar@example.org; baz@example.edu; xyz " );

	deepEqual( input
		.prev( ".ui-tokentextarea2-button" )
			.prev( ".ui-tokentextarea2-button" )
				.prev( ".ui-tokentextarea2-button" )
					.text(), "foo@example.com",
		"inputText(): First added button text is correct" );

	deepEqual( input
		.prev( ".ui-tokentextarea2-button" )
			.prev( ".ui-tokentextarea2-button" )
				.text(), "bar@example.org",
		"inputText(): Second added button text is correct" );

	deepEqual( input.prev( ".ui-tokentextarea2-button" ).text(), "baz@example.edu",
		"inputText(): Third added button text is correct" );

	deepEqual( input.prevAll( ".ui-tokentextarea2-button" ).length, 3,
		"inputText(): There are three buttons" );

	deepEqual( input.val(), "xyz ", "inputText(): Input has correct value after setting text" );

	deepEqual( input.tokentextarea2( "length" ), 3, "length() returns the correct value" );

	input.tokentextarea2( "remove", 1 );

	deepEqual( input.tokentextarea2( "length" ), 2,
		"remove(): length() returns the correct value after one removal" );

	deepEqual( input.tokentextarea2( "inputText" ), "foo@example.com;baz@example.edu;xyz ",
		"remove(): inputText() returns the correct value after one removal" );

	deepEqual( input
		.prev( ".ui-tokentextarea2-button" )
			.prev( ".ui-tokentextarea2-button" )
				.text(), "foo@example.com",
		"remove(): First button is correct" );

	deepEqual( input.prev( ".ui-tokentextarea2-button" ).text(), "baz@example.edu",
		"remove(): Second button is correct" );

	input.tokentextarea2( "remove" );

	deepEqual( input.tokentextarea2( "inputText" ), "xyz ",
		"remove(): inputText() returns the correct value after removal of all tokens" );

	deepEqual( input.parent().children( ".ui-tokentextarea2-button" ).length, 0,
		"remove(): No tokens present after calling remove() with no arguments" );

	input
		.val( "abc@def.com;mno@pqr.com;stu " )
		.tokentextarea2( "refresh" )
		.tokentextarea2( "add", "vwx@yz.com", 1 );

	deepEqual( input.tokentextarea2( "inputText" ), "abc@def.com;vwx@yz.com;mno@pqr.com;stu ",
		"add(): inputText() returns the correct value after one addition" );

	deepEqual( input.prevAll( ".ui-tokentextarea2-button" ).length, 3,
		"add(): There are three buttons after one addition" );

	deepEqual( input.tokentextarea2( "select" ), "",
		"select(): Empty string is returned when no tokens are selected" );

	input.tokentextarea2( "select", 0 );

	deepEqual( input.prevAll( ".ui-tokentextarea2-button" ).last().hasClass( "ui-btn-active" ),
		true,
		"select(): Selecting the first element causes class 'ui-btn-active' to be added to it" );

	deepEqual( input.tokentextarea2( "select" ), "abc@def.com;",
		"select(): Correct text is returned after selecting one element" );

	input.tokentextarea2( "select", 2 );

	deepEqual( input.prevAll( ".ui-tokentextarea2-button" ).last().hasClass( "ui-btn-active" ),
		true,
		"select(): Selecting the last element causes the first element to remain selected" );

	deepEqual( input.prevAll( ".ui-tokentextarea2-button" ).first().hasClass( "ui-btn-active" ),
		true,
		"select(): Selecting the last element causes class 'ui-btn-active' to be added to it" );

	deepEqual( input.tokentextarea2( "select" ), "abc@def.com;mno@pqr.com;",
		"select(): Correct text is returned after selecting two elements" );

	input
		.val( input.val() + " " )
		.trigger( "keyup" );

	deepEqual( input.prevAll( ".ui-tokentextarea2-button.ui-btn-active" ).length, 0,
		"Typing a space causes all selected items to be deselected" );

	deepEqual( input.tokentextarea2( "select" ), "",
		"select(): After items become deselected, select() returns an empty string" );
});
