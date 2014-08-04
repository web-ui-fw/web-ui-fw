test( "class 'stretched-input' correctly applied during enhancement", function() {
	deepEqual( $( "#enhance-test" ).parent().hasClass( "stretched-input" ), false,
		"When there's no initial value, there's no class 'stretched-input' on the wrapper" );
	deepEqual(
		$( "#enhance-test-initial-value-no-tokens" ).parent().hasClass( "stretched-input" ), false,
		"When there are no initial buttons but only a leftover, there's no class " +
			"'stretched-input' on the wrapper" );
	deepEqual( $( "#enhance-test-initial-tokens" ).parent().hasClass( "stretched-input" ), true,
		"When the input has initial buttons, the wrapper initially has class 'stretched-input'" );
	deepEqual( $( "#enhance-test-initial-tokens" )
		.prevAll( ".ui-tokentextarea2-button" ).length,
		1, "When the input has initial buttons, they precede the input" );
	deepEqual( $( "#enhance-test-initial-tokens" )
		.prevAll( ".ui-tokentextarea2-button" )
			.attr( "tabindex" ),
		undefined, "When the enabled input has initial buttons, their tabindex is unset" );
	deepEqual( $( "#enhance-test-initial-tokens-disabled" )
		.prevAll( ".ui-tokentextarea2-button" )
			.attr( "tabindex" ),
		"-1", "When the disabled input has initial buttons, their tabindex is set to '-1'" );
	deepEqual( $( "#enhance-test-initial-tokens" ).parent().hasClass( "stretched-input" ), true,
		"When the input has initial buttons, the wrapper initially has class 'stretched-input'" );
	deepEqual( $( "#enhance-test-initial-value-tokens" ).parent().hasClass( "stretched-input" ),
		true, "When the input has initial buttons and a leftover, the wrapper initially has " +
			"class 'stretched-input'" );
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

test( "Disabling widget", function() {
	var input = $( "#set-options-test" );

	deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).is( function( index, element ) {
		if ( $( element ).attr( "tabindex" ) === "-1" ) {
			return true;
		}
	}), false, "Initially no button has tabindex -1" );

	input.tokentextarea2( "option", "disabled", true );

	deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).is( function( index, element ) {
		if ( $( element ).attr( "tabindex" ) !== "-1" ) {
			return true;
		}
	}), false, "After disabling, all buttons have tabindex -1" );

	input.tokentextarea2( "option", "disabled", false );

	deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).is( function( index, element ) {
		if ( $( element ).attr( "tabindex" ) === "-1" ) {
			return true;
		}
	}), false, "After re-enabling, no buttons have tabindex -1" );
});

module( "Pre-rendered" );

test( "Input shadow found", function() {
	var input = $( "#pre-rendered-test" );

	input.val( "k" ).trigger( "keyup" );

	deepEqual( input.siblings( ".ui-tokentextarea2-input-shadow" ).text(), "k",
		"text is transferred to input shadow" );
});

asyncTest( "Form reset works", function() {
	expect( 16 );

	var form = $( "#reset-test-form" ),
		inputInside = $( "#reset-test-input" ),
		inputOutside = $( "#reset-test-input-outside" ),
		checkPreResetAssertions = function( input ) {
			deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).length, 2,
				"Initially two buttons are present" );

			deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).last().jqmData( "value" ),
				"abc@def.com", "Initially the first button has the correct value" );

			deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).first().jqmData( "value" ),
				"ghi@jkl.com", "Initially the second button has the correct value" );

			input.val( "mno@pqr.com;" ).trigger( "change" );

			deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).length, 3,
				"A newly added button increases length of buttons by one" );

			deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).first().jqmData( "value" ),
				"mno@pqr.com", "A newly added button becomes the first to precede the input" );
		},
		checkPostResetAssertions = function( input ) {
			deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).length, 2,
				"Initially two buttons are present" );

			deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).last().jqmData( "value" ),
				"abc@def.com", "Initially the first button has the correct value" );

			deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).first().jqmData( "value" ),
				"ghi@jkl.com", "Initially the second button has the correct value" );
		};

	checkPreResetAssertions( inputInside );
	checkPreResetAssertions( inputOutside );

	form.trigger( "reset" );

	setTimeout( function() {
		checkPostResetAssertions( inputInside );
		checkPostResetAssertions( inputOutside );

		start();
	}, 500 );
});

asyncTest( "Paste works", function() {
	expect( 7 );

	var input = $( "#paste-test" );

	deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).length, 2,
		"Initially two buttons are present" );

	deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).last().jqmData( "value" ),
		"abc@def.com", "Initially the first button has the correct value" );

	deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).first().jqmData( "value" ),
		"ghi@jkl.com", "Initially the second button has the correct value" );

	input.val( "mno@pqr.com;" ).trigger( "paste" );

	setTimeout( function() {
		deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).length, 3,
			"After pasting three buttons are present" );

		deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).first().jqmData( "value" ),
			"mno@pqr.com", "After pasting the button nearest the input has the correct value" );

		deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).eq( 1 ).jqmData( "value" ),
			"ghi@jkl.com", "After pasting the middle button has the correct value" );

		deepEqual( input.prevAll( "a.ui-tokentextarea2-button" ).last().jqmData( "value" ),
			"abc@def.com", "After pasting the first button has the correct value" );

		start();
	}, 500 );
});
