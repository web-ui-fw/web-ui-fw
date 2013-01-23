( function( $, undefined ) {

	module( "setValue" );

	asyncTest( "setting a value triggers the corresponding signal", function() {
		var testText = "Test text",
			divTest = $( "#divTest" ),
			inputTest = $( "#inputTest" ),
			inputTestSet = $( "#inputTestSet" );
		expect( 10 );

		$.testHelper.detailedEventCascade([

			function() {
				// div test widget
				divTest.infratestwidget()
				divTest.infratestwidget( "option", "testValue", testText );
			},

			{
				testvaluechanged: { src: divTest, event: "testvaluechanged.valueSetTriggersSignal1" }
			},

			function( result ) {
				deepEqual( result.testvaluechanged.timedOut, false, "Widget did emit signal 'testvaluechanged'" );
				deepEqual( divTest.text(), testText, "The widget correctly reflects the option value" );
				divTest.infratestwidget( "destroy" );

				// input test widget
				inputTest.infratestwidget();
				deepEqual( inputTest.infratestwidget( "option", "testValue" ), "", "Initial value for widget inputTest is ''" );
				inputTest.infratestwidget( "option", "testValue", testText );
			},

			{
				testvaluechanged: { src: inputTest, event: "testvaluechanged.valueSetTriggersSignal2" },
				change: { src: inputTest, event: "change.valueSetTriggersSignal2" }
			},

			function( result ) {
				deepEqual( result.testvaluechanged.timedOut, false, "Widget did emit signal 'testvaluechanged'" );
				deepEqual( result.change.timedOut, false, "Widget did emit signal 'change'" );
				deepEqual( inputTest.text(), testText, "The widget correctly reflects the option value" );
				inputTest.infratestwidget( "destroy" );

				// input test widget with initial value
				inputTestSet.infratestwidget();
				deepEqual( inputTestSet.infratestwidget( "option", "testValue" ), "testValue", "Initial value for widget inputTest is 'testValue'" );
				debugger;
				inputTestSet.infratestwidget( "option", "testValue", testText );
			},

			{
				testvaluechanged: { src: inputTestSet, event: "testvaluechanged.valueSetTriggersSignal3" },
				change: { src: inputTestSet, event: "change.valueSetTriggersSignal3" }
			},

			function( result ) {
				debugger;
				deepEqual( result.testvaluechanged.timedOut, false, "Widget did emit signal 'testvaluechanged'" );
				deepEqual( result.change.timedOut, false, "Widget did emit signal 'change'" );
				deepEqual( inputTestSet.text(), testText, "The widget correctly reflects the option value" );
				inputTestSet.infratestwidget( "destroy" );
				start();
			}
		]);
	});

})( jQuery );
