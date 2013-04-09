module.exports = function( grunt ) {
	"use strict";

	// grunt plugins
	grunt.loadNpmTasks( "grunt-contrib-jshint" );

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON( "package.json" ),
		jshint: {
			all: {
				options: {
					jshintrc: ".jshintrc"
				},
				files: {
					src: [ "Gruntfile.js", "tasks/**/*.js" ]
				}
			}
		}
	});

	// Default grunt
	grunt.registerTask( "default", [ "jshint" ] );
};
