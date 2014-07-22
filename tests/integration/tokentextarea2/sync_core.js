test( "Widget correctly picks up and reflects master initial value", function() {
	deepEqual( $( "#sync-test-master" ).val(), "abc@def.com;ghi ", "Initial value is correct" );
});

test( "Typing a single character is reflected in the master", function() {
	$( "#sync-test-slave" ).val( $( "#sync-test-slave" ).val() + "f" );
	$( "#sync-test-slave" ).trigger( "keyup" );
	deepEqual( $( "#sync-test-master" ).val(), "abc@def.com;ghi f",
		"Value after typing a single character is correct" );
});

test( "Changes made via widget API are reflected in the master", function() {
	$( "#sync-test-slave" ).tokentextarea2( "add", "ghi@jkl.com", 0 );
	deepEqual( $( "#sync-test-master" ).val(), "ghi@jkl.com;abc@def.com;ghi f",
		"Value after prepending a button is correct" );

	$( "#sync-test-slave" ).tokentextarea2( "remove", 1 );
	deepEqual( $( "#sync-test-master" ).val(), "ghi@jkl.com;ghi f",
		"Value after removing a button is correct" );
});

test( "The value of the master is reflected in the slave upon triggering 'change'", function() {
	$( "#sync-test-master" ).val( "abc" ).trigger( "change" );
	deepEqual( $( "#sync-test-slave" ).tokentextarea2( "inputText" ), "abc",
		"Widget inputText() is correct" );
});
