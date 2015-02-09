//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Idly loop over an array or an object
//>>label: Idle loop
//>>group: Utilities

( function( factory ) {

	if ( typeof define === "function" && define.amd ) {

		// AMD. Register as an anonymous module.
		define( [ "jquery" ], factory );
	} else {

		// Browser globals
		factory( jQuery );
	}

}( function( $ ) {

// Copied from jQuery's src/core.js
function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}

// $.eachIdle():
//
// Iterates idly over an object or an array.
//
// The first three parameters are the same as $.each().
//
// @timeout, if set to a positive numerical value, will cause the busy-looping to record a start
// time, and check after each iteration whether the previously recorded start time is further in
// the past than the amount specified by @timeout. If set to 0, it will cause each iteration to be
// preceded by a stack unwind. @timeout may also be undefined, in which case time is not measured
// at all.
//
// @iterations, if set to a numerical value, will cause the busy-looping to stop after the
// specified number of iterations. If @iterations is 0 or negative, it will cause each iteration to
// be preceded by a stack unwind. @iterations may also be undefined, in which case the number of
// iterations performed synchronously will not determine whether the loop yields.
//
// If both @timeout and @iterations are undefined, this will be a busy loop just like $.each(), but
// preceded by a stack unwind and probably a lot less performant (though I haven't measured this).
//
// If both @timeout and @iterations are defined, the busy-loop will yield as soon as either of the
// two conditions described above occurs.
//
// Unlike $.each(), the return value is a promise which is resolved when the loop completes. There
// is no distinction between the loop having completed because it ran out of work and between the
// loop having completed because the callback returned false.
//
// The callback behaves the same way as a callback to $.each() and receives the same arguments,
// with one additional feature: If the callback returns a numerical value, the loop will yield,
// and the return value will be used as the length of time in milliseconds after which to resume.
$.eachIdle = function( obj, callback, args, timeout, iterations ) {
	var keys = isArraylike( obj ) ? undefined : Object.keys( obj ),
		deferred = $.Deferred();

	// Yield before commencing
	setTimeout( $.proxy( $.eachIdle.iterate, {

		// We create the following context in which to execute the iterator:
		// The arguments passed in
		obj: obj,
		callback: callback,
		args: args,

		// The counter, which is the only variable updated by the iterate() function
		i: 0,

		// The parameters used for iteration
		deferred: deferred,
		keys: keys,
		length: keys ? keys.length : obj.length,
		timeout: ( $.isNumeric( timeout ) ? timeout : undefined ),
		iterations: ( $.isNumeric( iterations ) ? iterations : undefined )
	} ), 0 );

	return deferred.promise();
};

// $.eachIdle.iterate():
//
// Performs a portion of the work required for iterating over an object. This function is exposed
// mostly for the benefit of testability.
//
// This is the function by which we iterate. It needs a context consisting of:
// obj: The object over which to iterate
// callback: The callback to run for each member
// args: The arguments to pass to the callback (if any)
// i: The counter
// deferred: The deferred to resolve when done
// keys: The keys of @obj, only defined if @obj is not array-like
// length: The number of items over which we must iterate
// timeout: The maximum amount of time for which we should busy-loop
// iterations: The maximum number of iterations in any busy-loop
$.eachIdle.iterate = function() {
	var value, index, context, delay,
		startTime = ( this.timeout > 0 ? $.now() : 0 ),
		currentIterations = 0;

	// We loop while we still have data or until we determine that we must delay further iteration
	for( ; this.i < this.length && delay === undefined ; this.i++ ) {

		// Set up the arguments and the context for the callback
		index = this.keys ? this.keys[ this.i ] : this.i;
		context = this.obj[ index ];

		// Perform the iteration
		if ( this.args ) {
			value = this.callback.apply( context, this.args );
		} else {
			value = this.callback.call( context, index, context );
		}

		// Determine whether we should yield.
		delay =

			// We yield if the callback indicates by a numeric return value that we should delay
			// further iteration by a specified amount of milliseconds
			( $.isNumeric( value ) ? value :

				// We also yield if the callback indicates that it wishes to stop iterating
				( false === value ? 0 :

				// Finally, we yield if any of the conditions in our options (timeout/iterations)
				// are satisfied
				( ( ( this.timeout !== undefined &&

						// If we're measuring time, yield if we've been iterating for too long. We
						// artificially create a difference of 1 ms if the timeout is <= 0, to make
						// sure that we yield after each iteration.
						( ( ( this.timeout > 0 ? $.now() : 1 ) ) - startTime >= this.timeout ) ) ||
					( this.iterations !== undefined &&

							// If we're measuring the number of iterations, yield if we've
							// performed too many of them
							( ++currentIterations ) >= this.iterations ) ) ? 0 :

						// We continue the busy loop if none of these conditions are met
						undefined ) ) );
	}

	// We yield if we have work left, but if the callback told us to stop, we no longer
	// set up a timeout that will allow us to complete the remainder of the work later.
	// We asynchronously resolve the deferred instead to indicate that our job is done.
	setTimeout(
		( this.i < this.length && value !== false ) ?

			// Yield now and resume iterations later.
			$.proxy( $.eachIdle.iterate, this ) :

			// We're done. Resolve the deferred.
			$.proxy( this.deferred, "resolve" ),

		// delay will be undefined if we get to the end of the data.
		( delay === undefined ? 0 : delay ) );
};

// Provided for convenience. This allows the callback to legibly indicate that it wishes to yield
// by returning the value defined below.
$.eachIdle.YIELD = 0;

$.fn.eachIdle = function( callback, args, timeout, iterations ) {
	return $.eachIdle( this, callback, args, timeout, iterations );
};

// $.each() can be modified to call $.eachIdle() without breaking API:
// $.each = ( function( original ) {
//
//	return function eachIdleOverride( obj, callback, args, idle ) {
//
//		if ( idle ) {
//
//			// @idle is assumed to be an object containing @timeout and @iterations, and that can
//			// serve as a repository for the promise returned by $.eachIdle().
//			// Don't laugh too hard.
//			idle.promise = $.eachIdle( obj, callback, args, idle.timeout, idle.iterations );
//
//			return obj;
//		}
//
//		return original.apply( this, arguments );
//	};
//
// })( $.each );

}));
