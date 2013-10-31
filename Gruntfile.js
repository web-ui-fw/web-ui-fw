module.exports = function( grunt ) {
	"use strict";

	var _ = grunt.util._,
		webUiFwVersion = "0.2.0",
		jQueryVersion = "1.9.1",
		jQueryMobileVersion = "1.3.1",
		path = require( "path" ),
		dist = "dist",
		httpPort =  Math.floor( 9000 + Math.random() * 1000 );

	// grunt plugins
	grunt.loadNpmTasks( "grunt-contrib-concat" );
	grunt.loadNpmTasks( "grunt-contrib-connect" );
	grunt.loadNpmTasks( "grunt-contrib-requirejs" );
	grunt.loadNpmTasks( "grunt-contrib-jshint" );
	grunt.loadNpmTasks( "grunt-contrib-qunit" );
	grunt.loadNpmTasks( "grunt-qunit-junit" );
	grunt.loadNpmTasks( "grunt-contrib-copy" );

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
				}/*,
				files: {
					src: [ "Gruntfile.js" ]
				}*/
			}
		},

		concat: {
			demos: {
				src: [ "demos/_assets/js/*.js" ],
				dest: path.join( dist, "demos/_assets/js/index.js" )
			}
		},

		copy: {
			demos: {
				options: {
					processContent: function( content, srcPath ) {
						if ( grunt.file.isMatch( "**/*.html", srcPath ) ) {
							content = content
								.replace( /(..\/)*jqm\/js\/jquery\.js/g, "http://code.jquery.com/jquery-" + jQueryVersion + ".min.js" )
								.replace( /((..\/)*_assets\/js\/)/g, "$1index.js" )
								.replace( /(..\/)*jqm\/js\//g, "http://code.jquery.com/mobile/" + jQueryMobileVersion + "/jquery.mobile-" + jQueryMobileVersion + ".min.js" )
								.replace( /(..\/)*js\/"/g, 'http://web-ui-fw.github.com/jqm/' + webUiFwVersion + '/web-ui-fw.js"' )
								.replace( /(..\/)*jqm\/css\/themes\/default\/jquery\.mobile\.css/g, "http://code.jquery.com/mobile/" + jQueryMobileVersion + "/jquery.mobile-" + jQueryMobileVersion + ".min.css" )
								.replace( /(..\/)*css\/themes\/default\/web-ui-fw\.css/g, "http://web-ui-fw.github.com/jqm/" + webUiFwVersion + "/web-ui-fw.css" )
								.replace( /(..\/)*jqm\/demos\/_assets\/css\/jqm-demos\.css/g, "http://view.jquerymobile.com/" + jQueryMobileVersion + "/demos/_assets/css/jqm-demos.css" );
						}
						return content;
					}
				},
				files: [
					{
						expand: true,
						src: [ "demos/**" ],
						dest: dist
					}
				]
			}
		},

		requirejs: {
			js: {
				options: {
					baseUrl: "js",
					paths: {
						"jquery.ui.widget": "../jqm/js/jquery.ui.widget",
						"jquery.hashchange": "../jqm/js/jquery.hashchange",
						"text": "../jqm/external/requirejs/plugins/text",
						"json": "../jqm/external/requirejs/plugins/json",
						"jqm": "../jqm/js",
						"jq-color": "../jq-color"
					},
					//Finds require() dependencies inside a require() or define call.
					findNestedDependencies: true,
					optimize: "none",
					mainConfigFile: "jqm/js/requirejs.config.js",

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
						"json!package.json"
					].concat( ( grunt.option( "modules" ) ) ? [] : [ "jqm/jquery.mobile" ] ),

					out: path.join( dist, "web-ui-fw.js" ),

					pragmasOnSave: {
						jqmBuildExclude: true
					},

					//File paths are relative to the build file, or if running a commmand
					//line build, the current directory.
					wrap: grunt.option( "wrap" ) ? {
						startFile: "build/wrap.start",
						endFile: "build/wrap.end"
					} : undefined,

					onBuildWrite: function( moduleName, path, contents ) {
						return contents.replace( /__version__/g, grunt.config.process( "\"<%= version %>\"" ) );
					}
				}
			}
		},

		cssbuild: {
			options: {
				//Allow CSS optimizations. Allowed values:
				//- "standard": @import inlining, comment removal and line returns.
				//Removing line returns may have problems in IE, depending on the type
				//of CSS.
				//- "standard.keepLines": like "standard" but keeps line returns.
				//- "none": skip CSS optimizations.
				//- "standard.keepComments": keeps the file comments, but removes line
				//returns.  (r.js 1.0.8+)
				//- "standard.keepComments.keepLines": keeps the file comments and line
				//returns. (r.js 1.0.8+)
				optimizeCss: "standard.keepComments.keepLines",

				//If optimizeCss is in use, a list of of files to ignore for the @import
				//inlining. The value of this option should be a string of comma separated
				//CSS file names to ignore (like 'a.css,b.css'. The file names should match
				//whatever strings are used in the @import calls.
				cssImportIgnore: null
			},
			all: {
				files: {
					"dist/web-ui-fw.structure.css": "css/structure/web-ui-fw.structure.css",
					"dist/web-ui-fw.theme.css": "css/themes/default/web-ui-fw.theme.css",
					"dist/web-ui-fw.css": "css/themes/default/web-ui-fw.css"
				}
			}
		},

		connect: {
			server: {
				options: {
					port: httpPort,
					base: "."
				}
			}
		},

		qunit_junit: {
			options: {
				dest: "build/test-results",
				namer: function (url) {
					var match = url.match(/tests\/([^\/]*)\/(.*)$/);
					return match[2].replace(/\//g, ".").replace(/\.html/, "" ).replace(/\?/, "-");
				}
			}
		},

		qunit: {
			options: {
				timeout: 30000
			},

			files: {},

			http: {
				options: {
					urls: (function() {
						// Find the test files
						var suites = _.without( ( grunt.option( "suites" ) || "" ).split( "," ), "" ),
							patterns, paths,
							prefixes = ["tests/unit/"],
							versionedPaths = [],
							jQueries = _.without( ( grunt.option( "jqueries" ) || process.env.JQUERIES || "" ).split( "," ), "" );

						patterns = [];

						if ( suites.length ) {
							suites.forEach( function( unit ) {
								prefixes.forEach( function( prefix ) {
									patterns = patterns.concat([
										prefix + unit + "/",
										prefix + unit + "/index.html",
										prefix + unit + "/*/index.html",
										prefix + unit + "/**/*-tests.html"
									]);
								});
							});
						} else {
							prefixes.forEach( function( prefix ) {
								patterns = patterns.concat([
									prefix + "*/index.html",
									prefix + "*/*/index.html",
									prefix + "**/*-tests.html"
								]);
							});
						}

						paths = grunt.file.expand( patterns )
							.sort()
							.map( function( path ) {
								// Some of our tests (ie. navigation) don't like having the index.html too much
								return path.replace( /\/\index.html$/, "/" );
							});

						paths = grunt.util._.uniq( paths );

						if ( jQueries.length ) {
							paths.forEach( function( path ) {
								versionedPaths = versionedPaths.concat( jQueries.map( function( jQVersion ) {
									return path + "?jquery=" + jQVersion;
								}) );
							});
						}

						if ( versionedPaths.length ) {
							paths = versionedPaths;
						}

						return paths.map( function( path ) {
							return "http://localhost:<%= connect.server.options.port %>/" + path;
						});
					}())
				}
			}
		}
	});

	grunt.registerTask( "lint", [ "jshint" ] );
	grunt.registerTask( "test", [ "jshint", "js:release", "buildjqm", "connect", "qunit:http" ] );
	grunt.registerTask( "js:release",  [ "requirejs"/*, "concat:js", "uglify", "copy:sourcemap"*/ ] );
	grunt.registerTask( "js", [ "js:release" ] );
	grunt.registerTask( "demos", [ "copy:demos", "concat:demos" ] );
	grunt.registerTask( "release", [ "js", "cssbuild", "demos" ] );
	grunt.registerTask( "default", [ "lint", "js:release" ] );

};
