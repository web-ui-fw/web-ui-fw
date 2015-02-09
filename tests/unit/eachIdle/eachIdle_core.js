( function() {

// Records the sequence of calls to iterate(), and iterate()'s calls to the callback
var callingSequence, timeoutSequence,
	originalSetTimeout = window.setTimeout;


module( "eachIdle", ( function() {
	var originalIterator = $.eachIdle.iterate,
		trackingIterator = function() {
			var returnValue;

			callingSequence = callingSequence.concat( [ "begin", 0 ] );
			returnValue = originalIterator.apply( this, arguments );
			callingSequence.push( "end" );

			return returnValue;
		},
		trackingSetTimeout = function( callback, delay ) {
			timeoutSequence.push( delay );
			return originalSetTimeout.apply( this, arguments );
		};

	return {
		setup: function() {
			callingSequence = [];
			$.eachIdle.iterate = trackingIterator;
			timeoutSequence = [];
			window.setTimeout = trackingSetTimeout;
		},
		teardown: function() {
			$.eachIdle.iterate = originalIterator;
			window.setTimeout = originalSetTimeout;
		}
	};
})());

// A callback that will busy-loop for 100ms each time it is called
function busyLoop( index, value ) {
	var elapsed,
		x = 0,
		startTime = $.now();

	callingSequence[ callingSequence.length - 1 ]++;

	while( true ) {
		elapsed = $.now() - startTime;
		if ( elapsed >= 100 ) {
			break;
		}
		x = Math.tan( Math.atan( Math.exp( Math.log( Math.sqrt( x * x ) ) ) ) ) + 1;
	}
}

function defineTest( options ) {

	var callbackHasArgs = ( options.argsToEachIdle[ 0 ] !== undefined );

	asyncTest(
		( options.useObject ? "Object: " : "Array: " ) +
			( callbackHasArgs ? "" : "no " ) +
			"callback arguments: " + options.description,
		function() {
			expect( 3 + ( callbackHasArgs ? 1 : 0 ) );

			var failsafe = originalSetTimeout( function() {
					ok( false, "Promise was resolved" );
					start();
				}, 3000 ),

				eachIdleArgs = [ ( options.useObject ? {
						abc: "def",
						ghi: "jkl",
						mno: "pqr",
						stu: "vwx"
					} :
					[ 0, 1, 2, 3 ] ), ( callbackHasArgs ? ( function() {
						var checkedArgs = false;

						return function() {

							// The callback gets called many times, but always with the same
							// arguments, if arguments are given. This version of the callback
							// is only used when arguments are given, so we only want to check
							// them once.
							if ( !checkedArgs ) {
								deepEqual( Array.prototype.slice.apply( arguments, [ 0 ] ),
									options.argsToEachIdle[ 0 ],
									"Arguments to callback are correct" );
								checkedArgs = true;
							}
							return options.callback();
						}
					}() ) : options.callback ) ]

					// If we have extra arguments, we have to insert undefined for the @args
					// argument of eachIdle()
					.concat( options.argsToEachIdle );

			$.eachIdle.apply( undefined, eachIdleArgs ).done( function() {
				clearTimeout( failsafe );
				ok( true, "Promise was resolved" );
				deepEqual( callingSequence, options.expectedCallingSequence,
					"$.eachIdle.iterate() was called as expected" );
				deepEqual( timeoutSequence, options.expectedTimeoutSequence,
					"window.setTimeout() was called as expected" );
				start();
			});
		});
}

function defineTests( useObject, callbackArgs ) {

	var defaults = {
		callback: busyLoop,
		useObject: useObject,
		argsToEachIdle: [ callbackArgs ]
	};

	defineTest($.extend( {}, defaults, {
		description: "No extra parameters results in a busy loop",
		expectedCallingSequence: [ "begin", 4, "end" ],
		expectedTimeoutSequence: [ 0, 0 ]
	}));

	defineTest($.extend( {}, defaults, {
		description: "A timeout is respected",
		argsToEachIdle: [ callbackArgs, 200 ],
		expectedCallingSequence: [ "begin", 2, "end", "begin", 2, "end" ],
		expectedTimeoutSequence: [ 0, 0, 0 ]
	}));

	defineTest($.extend( {}, defaults, {
		description: "A timeout of 0 results in a completely idle loop",
		argsToEachIdle: [ callbackArgs, 0 ],
		expectedCallingSequence:
			[ "begin", 1, "end", "begin", 1, "end", "begin", 1, "end", "begin", 1, "end" ],
		expectedTimeoutSequence: [ 0, 0, 0, 0, 0 ]
	}));

	defineTest($.extend( {}, defaults, {
		description: "An iteration count is respected",
		argsToEachIdle: [ callbackArgs, undefined, 2 ],
		expectedCallingSequence: [ "begin", 2, "end", "begin", 2, "end" ],
		expectedTimeoutSequence: [ 0, 0, 0 ]
	}));

	defineTest($.extend( {}, defaults, {
		description: "A short timeout will yield sooner than the allowed iteration count",
		argsToEachIdle: [ callbackArgs, 100, 2 ],
		expectedCallingSequence:
			[ "begin", 1, "end", "begin", 1, "end", "begin", 1, "end", "begin", 1, "end" ],
		expectedTimeoutSequence: [ 0, 0, 0, 0, 0 ]
	}));

	defineTest($.extend( {}, defaults, {
		description: "A short iteration count will yield sooner than the allowed timeout",
		argsToEachIdle: [ callbackArgs, 1000, 2 ],
		expectedCallingSequence: [ "begin", 2, "end", "begin", 2, "end" ],
		expectedTimeoutSequence: [ 0, 0, 0 ]
	}));

	defineTest($.extend( {}, defaults, {
		description: "A delay requested by the callback is respected",
		callback: ( function() {
			var callCount = 0;

			return function( index, value ) {
				busyLoop( index, value );
				callCount++;
				if ( callCount === 3 ) {
					return 200;
				}
			};
		})(),
		expectedCallingSequence: [ "begin", 3, "end", "begin", 1, "end" ],
		expectedTimeoutSequence: [ 0, 200, 0 ]
	}));

	defineTest($.extend( {}, defaults, {
		description: "Looping stops when the callback returns false",
		callback: ( function() {
			var callCount = 0;

			return function( index, value ) {
				busyLoop( index, value );
				callCount++;
				if ( callCount === 3 ) {
					return false;
				}
			};
		})(),
		expectedCallingSequence: [ "begin", 3, "end" ],
		expectedTimeoutSequence: [ 0, 0 ]
	}));
}

defineTests( false );
defineTests( true );
defineTests( false, [ "abc" ] );
defineTests( true, [ "abc" ]  );

})();
