module.exports = function( grunt ) {
	"use strict";

	grunt.registerTask( 'buildjqm', 'Build jQuery Mobile', function() {
		var done = this.async();

		grunt.util.spawn( {
			cmd: "/bin/sh",
			args: [ "-c", "cd jqm; npm cache clean && npm install && grunt;" ],
			opts: { stdio: "inherit" },
		},
		function( error, result, code ) {
			if ( error ) {
				grunt.fail.warn( "buildjqm failed: " + error.message );
				throw( error );
			} else {
				done();
			}
		});
	});
};
