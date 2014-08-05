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

test( "Setting a master at runtime", function() {
	var slave = $( "#sync-test-slave-no-master" ),
		master = $( "#sync-test-new-master" );

	deepEqual( slave.prevAll( "a.ui-tokentextarea2-button" ).length, 0,
		"Initially slave has no buttons" );

	slave.tokentextarea2( "option", "master", master );

	deepEqual( slave.prevAll( "a.ui-tokentextarea2-button" ).length, 2,
		"After setting a new master, there are two buttons" );

	deepEqual( slave.prevAll( "a.ui-tokentextarea2-button" ).first().jqmData( "value" ),
		"ghi@jkl.com", "After setting a new master, button nearest input has the right value" );

	deepEqual( slave.prevAll( "a.ui-tokentextarea2-button" ).last().jqmData( "value" ),
		"abc@def.com", "After setting a new master, first button has the right value" );

	slave.tokentextarea2( "option", "master", null );

	master.val( "mno@pqr.com;" ).trigger( "change" );

	deepEqual( slave.prevAll( "a.ui-tokentextarea2-button" ).length, 2,
		"After unsetting the new master, there are still two buttons" );

	deepEqual( slave.prevAll( "a.ui-tokentextarea2-button" ).first().jqmData( "value" ),
		"ghi@jkl.com",
		"After unsetting the new master, button nearest input still has the right value" );

	deepEqual( slave.prevAll( "a.ui-tokentextarea2-button" ).last().jqmData( "value" ),
		"abc@def.com", "After unsetting the new master, first button still has the right value" );

	slave.tokentextarea2( "remove" );

	deepEqual( slave.prevAll( "a.ui-tokentextarea2-button" ).length, 0,
		"After removing all the buttons the slave has no buttons" );

	slave.tokentextarea2( "option", "master", master );

	deepEqual( slave.prevAll( "a.ui-tokentextarea2-button" ).length, 1,
		"After reassigning the same master, the slave has one button" );

	deepEqual( slave.prevAll( "a.ui-tokentextarea2-button" ).first().jqmData( "value" ),
		"mno@pqr.com",
		"After reassigning the new master, button nearest input again has the right value" );

	slave.tokentextarea2( "option", "master", "#sync-test-other-master" );

	deepEqual( slave.prevAll( "a.ui-tokentextarea2-button" ).length, 2,
		"After assigning a different master, the slave has two buttons" );

	deepEqual( slave.prevAll( "a.ui-tokentextarea2-button" ).first().jqmData( "value" ),
		"vincent@example.com",
		"After assigning a different master, button nearest input again has the right value" );

	deepEqual( slave.prevAll( "a.ui-tokentextarea2-button" ).last().jqmData( "value" ),
		"doreen@example.com",
		"After assigning a different master, first button again has the right value" );
});
