( function( $ ) {

	module( "routemap" );

	test( "routemap test cases.", function () {
		var $routemap = $( ".ui-routemap" ),
			expectedShortestPath = ["21", "22", "2", "3", "4", "5", "6", "7"],
			expectedminTransPath = ["21", "22", "23", "24", "25", "26", "27", "28"],
			resultPath,
			name,
			ids,
			highlightPath = [];

		deepEqual( $routemap.length , 1, "The widget is created." );

		ids = $routemap.routemap( "getIdsByName", "21" );
		deepEqual( ids, ["21"], "getIdsByName() returned a station ID associated with the specified station name." );

		ids = $routemap.routemap( "getIdsByName", "7(ex)" );
		deepEqual( ids, ["7", "28", "46"], "getIdsByName() returned station IDs associated with the specified exchange name." );

		name = $routemap.routemap( "getNameById", "5" );
		deepEqual( name, "5(ex)", "getNameById() returned a station name with associated the specified station ID." );

		resultPath = $routemap.routemap( "shortestRoute", "21", "7" );
		deepEqual( resultPath, expectedShortestPath , "shortestRoute() returned the array of station codes which is the shortest route." );

		resultPath = $routemap.routemap( "minimumTransfers", "21", "7" );
		deepEqual( resultPath, expectedminTransPath , "minimumTransfers() returned the array of station codes which is the route having minimum transfers." );

		$routemap.routemap( "highlight", ["3", "4", "5"] );
		$( ".ui-highlight" ).each( function () {
			ids = $routemap.routemap( "getIdsByName", ( $( this ).text() ) );
			highlightPath.push( ids[0] );
		} );
		deepEqual( highlightPath , ["3", "4", "5"], "highlight() added a highlighting style to stations." );

		$routemap.routemap( "dishighlight", ["3", "4", "5"] );
		deepEqual( $( ".ui-highlight" ).length , 0, "dishighlight() removed a highlighting style from stations." );
	});
})( jQuery );