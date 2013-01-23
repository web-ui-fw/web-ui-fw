( function( $, undefined ) {

	module( "optionDemultiplexer" );

	test( "_set<OptionName> called when setting option", function() {
		$( "#divTest" ).infratestwidget()
		$( "#divTest" ).infratestwidget( "option", "testValue", "Test text" )
		$( "#divTest" ).infratestwidget( "destroy" );

		deepEqual( $( "#divTest" ).text(), "Test text", "The widget correctly reflects the option value" );
	});

})( jQuery );
