test( "Link aligns with the bottom of the wrapper", function() {
	var prevTop, currentTop,
		rowCount = 1,
		relativeOffset,
		input = $( "#test-link-placement" ),
		wrapper = input.parent(),
		link = $( "#link-placement-test-link" );

	relativeOffset = Math.floor( wrapper.offset().top + wrapper.height() - link.offset().top );

	while( true ) {
		input.val( "abc@def.com;" ).trigger( "change" );
		currentTop = input.prevAll( "a.ui-tokentextarea2-button" ).first().offset().top;
		if ( prevTop === undefined ) {
			prevTop = currentTop;
		} else if ( currentTop !== prevTop ) {
			rowCount++;
			prevTop = currentTop;
		}
		if ( rowCount === 4 ) {
			break;
		}
	}

	deepEqual( Math.floor( wrapper.offset().top + wrapper.height() - link.offset().top ),
		relativeOffset,
		"Link vertical relative offset has not changed with the addition of more rows" );
});
