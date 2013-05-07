/*jshint node:true */
module.exports = function( grunt ) {
	"use strict";

	function handleGHHook( req, res ) {
		var payload;

		console.log( "handleGHHook: Entering" );

		if ( req.method === "POST" &&
			req.body.payload &&
			req.headers[ "x-github-event" ] === "push" ) {

			console.log( req.body.payload );
			payload = JSON.parse( req.body.payload );

			if ( payload.ref === "refs/heads/jqm" ) {
				grunt.util.spawn( { cmd: "git", args: [ "pull", "origin", "jqm" ] },
					function( error, result, code ) {
						console.log( "code: " + code );
						if ( code === 0 ) {
							grunt.util.spawn( { cmd: "grunt", args: [ "deploy" ] }, function( error, result, code ){
								console.log( "deploy: error:" + error );
								console.log( "deploy: stdout:" );
								console.log( result.stdout );
								console.log( "deploy: stderr:" );
								console.log( result.stderr );
								console.log( code );
							});
						}
					});
			}
		}
		res.end( "" );
	}

	var entryFiles = grunt.file.expand( { filter: "isFile" }, "entries/*.xml" );

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON( "package.json" ),
		clean: {
			folder: [ "dist" ]
		},
		jshint: {
			grunt: {
				options: {
					jshintrc: ".jshintrc"
				},
				files: {
					src: [ "Gruntfile.js" ]
				}
			}
		},
		xmllint: {
			all: [].concat( entryFiles, "categories.xml", "entries2html.xsl" )
		},
		xmltidy: {
			all: [].concat( entryFiles, "categories.xml" )
		},
		"build-pages": {
			all: grunt.file.expand( { filter: "isFile" }, "pages/**" )
		},
		"build-xml-entries": {
			all: entryFiles
		},
		"build-resources": {
			all: grunt.file.expand( { filter: "isFile" }, "resources/**" )
		},
		wordpress: grunt.util._.extend({
			dir: "dist/wordpress"
		}, grunt.file.readJSON( "config.json" ) ),
		watch: {
			scripts: {
				files: 'entries/*.xml',
				tasks: ['build'],
				options: {
					interrupt: true
				}
			}
		},
		connect: {
			ghhook: {
				options: {
					hostname: "*",
					keepalive: true,
					port: 8082,
					middleware: function( connect ) {
						return [
							connect.bodyParser(),
							handleGHHook
						];
					}
				}
			}
		}
	});

	// grunt plugins
	grunt.loadNpmTasks( "grunt-check-modules" );
	grunt.loadNpmTasks( "grunt-contrib-clean" );
	grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.loadNpmTasks( "grunt-contrib-watch" );
	grunt.loadNpmTasks( "grunt-jquery-content" );
	grunt.loadNpmTasks( "grunt-contrib-connect" );
	grunt.loadNpmTasks( "grunt-wordpress" );

	grunt.registerTask( "build", [ "build-pages", "build-xml-entries", "build-xml-categories", "build-xml-full", "build-resources" ] );
	grunt.registerTask( "lint", [ "jshint", "xmllint" ] );
	grunt.registerTask( "build-wordpress", [ "check-modules", "clean", "lint", "build" ] );
	grunt.registerTask( "tidy", [ "xmllint", "xmltidy" ] );
	grunt.registerTask( "ghhook", [ "jshint", "connect:ghhook" ] );

	// Default grunt
	grunt.registerTask( "default", [ "build-wordpress" ] );
};
