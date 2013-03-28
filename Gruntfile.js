module.exports = function( grunt ) {
	"use strict";

	// grunt plugins
	grunt.loadNpmTasks( "grunt-contrib-requirejs" );
	grunt.loadNpmTasks( "grunt-contrib-jshint" );

	// load the project's default tasks
	grunt.loadTasks( "build/tasks" );

	// Project configuration
	grunt.config.init( {
		pkg: grunt.file.readJSON( "package.json" ),

		version: "<%= pkg.version %>",

		jshint: {
			js: {
				options: {
					jshintrc: "js/.jshintrc"
				},
				files: {
					src: [
						"js/**/*.js",
						"!js/jquery.hashchange.js",
						"!js/jquery.js",
						"!js/jquery.ui.widget.js"
					]
				}
			},
			grunt: {
				options: {
					jshintrc: ".jshintrc"
				},
				files: {
					src: [ "Gruntfile.js" ]
				}
			}
		},

		requirejs: {
			js: {
				options: {
					baseUrl: "js",
					paths: {
						"depend": "../jqm/external/requirejs/plugins/depend",
						"text": "../jqm/external/requirejs/plugins/text",
						"json": "../jqm/external/requirejs/plugins/json",
						"jqm": "../jqm/js",
						"jq-color": "../jq-color"
					},
					//Finds require() dependencies inside a require() or define call.
					findNestedDependencies: true,
					optimize: "none",

					//If skipModuleInsertion is false, then files that do not use define()
					//to define modules will get a define() placeholder inserted for them.
					//Also, require.pause/resume calls will be inserted.
					//Set it to true to avoid this. This is useful if you are building code that
					//does not use require() in the built project or in the JS files, but you
					//still want to use the optimization tool from RequireJS to concatenate modules
					//together.
					skipModuleInsertion: true,

					include: ( grunt.option( "modules" ) || "web-ui-fw" ).split( "," ),

					exclude: [
						"jquery",
						"jqm/jquery",
						"depend",
						"json!package.json"
					],

					out: "web-ui-fw.js",

					pragmasOnSave: {
						jqmBuildExclude: true
					},

					onBuildWrite: function( moduleName, path, contents ) {
						return contents.replace( /__version__/g, grunt.config.process( "\"<%= version %>\"" ) );
					}
				}
			}
		}
	});

	grunt.registerTask( "lint", [ "jshint" ] );

	grunt.registerTask( "js:release",  [ "requirejs"/*, "concat:js", "uglify", "copy:sourcemap"*/ ] );
	grunt.registerTask( "js", [ "config:dev", "js:release" ] );
	grunt.registerTask( "default", [ "lint" ] );

};
