//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Render a route data.
//>>label: Route map
//>>group: Widgets

define( [
	"jqm/jquery",
	"jqm/jquery.mobile.widget" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");

( function ( $, window ) {
	var document = window.document,
		svgNameSpace = "http://www.w3.org/2000/svg",
		regId = /\bui-id-([\w\-]+)\b/,
		regAttr = /([a-z])([A-Z])/g;

	$.widget( "mobile.routemap", $.mobile.widget, {
		options: {
			language: null,
			db: null,
			unit: 1,
			initSelector: ":jqmData(role='routemap')"
		},

		_svg: null,
		_drawingRange: [],	// [ minX, minY, maxX, maxY ]
		_languageData: null,
		_lines: [],
		_stations: [],
		_stationsMap: [],
		_nameList: {},
		_graph: {},

		_create: function () {
			var self = this,
				view = self.element,
				routemapContainer = $( "<div class='ui-routemap-container'>" )
					.append( "<div class='ui-station-container'></div>" )
					.appendTo( view );

			self._svg = $( document.createElementNS( svgNameSpace, "svg" ) )
				.attr( {
					"version": "1.1",
					"width": "100%",
					"height": "100%",
					"class": "ui-line-container"
				} ).appendTo( routemapContainer )[0];

			view.addClass( "ui-routemap" );

			$.each( this.options, function ( key, value ) {
				self._setOption( key, value );
			} );

			if ( document.readyState === "complete" ) {
				self.refresh( true );
			}

			routemapContainer.on( "vclick", function ( event ) {
				var target = $( event.target ),
					targetId;

				if ( target[0].namespaceURI.indexOf("svg") > -1 ){
					if ( self._hasClass( target, "ui-line" ) ) {
						targetId = regId.exec( target.attr( "class" ) );
					}
				} else if ( target.hasClass( "ui-shape" ) || target.hasClass( "ui-label" ) ) {
					targetId = regId.exec( target.parent().attr( "class" ) );
				}

				target.trigger( "select", targetId ? targetId[1] : undefined );

				event.stopPropagation();
			} );
		},

		_setOption: function ( key, value ) {
			var self = this,
				option = self.options,
				data;

			$.Widget.prototype._setOption.apply( this, arguments );
			switch ( key ) {
			case "db":
				if ( value.match( /\.(json)$/i ) ) {
					$.ajax( {
						async: false,
						global: false,
						dataType: "JSON",
						url : option.db
					} ).done( function ( result ) {
						data = result;
					} ).fail( function ( e ) {
						throw new Error( e );
					} );
				} else {
					data = window[value];
				}
				self._processData( data );
				break;

			case "language":
				if ( !value ) {
					this._languageData = null;
					return;
				}

				data = option.db;

				if ( !data || !data.match(/\.(json)$/i) ) {
					return;
				}

				data = data.substring( data.lastIndexOf("\\") + 1, data.lastIndexOf(".") ) +
						"." + value + "." + data.substring( data.lastIndexOf(".") + 1, data.length );

				$.ajax( {
					async: false,
					global: false,
					dataType: "JSON",
					url : data
				} ).done( function ( result ) {
					self._languageData = result;
				} );

				break;
			}
		},

		_clear: function () {
			while ( this._svg.firstChild ) {
				this._svg.removeChild( this._svg.firstChild );
			}

			$( ".ui-station-container" ).empty();
		},

		_processData: function ( data ) {
			var i, j, k,
				lines = data.lines,
				options = this.options,
				unit = options.unit,
				branches,
				branch,
				station,
				exchange,
				stationStyle,
				exchangeStyle = data.exchangeStyle || {},
				lineStyle,
				coord,
				minX = 9999,
				minY = 9999,
				maxX = 0,
				maxY = 0,
				xPosPrev,
				yPosPrev,
				xPos = 0,
				yPos = 0,
				linePath,
				shorthand,
				controlPoint = [],
				graph= {},
				routemapContainer = this.element.find( ".ui-routemap-container" ),
				marginTop = parseInt( routemapContainer.css( "marginTop" ), 10 ) || 0,
				marginBottom = parseInt( routemapContainer.css( "marginBottom" ), 10 ) || 0,
				marginLeft = parseInt( routemapContainer.css( "marginLeft" ), 10 ) || 0,
				marginRight = parseInt( routemapContainer.css( "marginRight" ), 10 ) || 0,

				convertCoord = function ( pos ) {
					return unit * pos;
				};

			for ( i = 0; i < lines.length; i += 1 ) {
				branches = lines[i].branches;
				stationStyle = lines[i].style.station || {};
				lineStyle = lines[i].style.line || {};
				this._nameList[ lines[i].id ] = lines[i].name;

				for ( j = 0; j < branches.length; j += 1 ) {
					branch = branches[j];
					linePath = "";
					xPosPrev = yPosPrev = -1;
					for ( k = 0; k < branch.length; k += 1 ) {
						station = branch[k];
						coord = station.coordinates;

						if ( graph[station.id] === undefined ) {
							graph[station.id] = {};
						}

						if ( branch[k - 1] !== undefined ) {
							graph[station.id][branch[k - 1].id] = 3;
						}

						if ( branch[k + 1] !== undefined ) {
							graph[station.id][branch[k + 1].id] = 3;
						}

						// info
						minX = ( minX > coord[0] ) ? coord[0] : minX;
						minY = ( minY > coord[1] ) ? coord[1] : minY;
						maxX = ( maxX < coord[0] ) ? coord[0] : maxX;
						maxY = ( maxY < coord[1] ) ? coord[1] : maxY;

						//stations
						if ( !this._stationsMap[coord[0]] ) {
							this._stationsMap[coord[0]] = [];
						}

						this._nameList[ station.id ] = station.label;

						if ( !this._stationsMap[coord[0]][coord[1]] ) {
							station.style = stationStyle;
							station.transfer = [];
							this._stationsMap[coord[0]][coord[1]] = station;
							this._stations.push( station );
						} else {
							exchange = this._stationsMap[coord[0]][coord[1]];
							if ( !exchange.transfer.length ) {
								exchange.style = exchangeStyle;
							}
							exchange.transfer.push( station.id );
							graph[station.id][exchange.id] = "TRANSPER";
							graph[exchange.id][station.id] = "TRANSPER";
						}

						// lines
						xPos = convertCoord( coord[0] );
						yPos = convertCoord( coord[1] );

						if ( xPosPrev !== -1 && yPosPrev !== -1 ) {
							if ( xPosPrev === xPos || yPosPrev === yPos ) {
								linePath += "L" + xPos + "," + yPos;
							} else {
								// Catmull-Rom to Cubic Bezier conversion matrix
								//    0       1       0       0
								//  -1/6      1      1/6      0
								//    0      1/6      1     -1/6
								//    0       0       1       0
								shorthand = branch[ ( k > branch.length - 2 ) ? k : ( k + 1 )].coordinates;
								controlPoint[0] = ( xPosPrev + 6 * xPos - convertCoord( shorthand[0] ) ) / 6;
								controlPoint[1] = ( yPosPrev + 6 * yPos - convertCoord( shorthand[1] ) ) / 6;

								linePath += "S" + " " + controlPoint[0] + "," + controlPoint[1] + " " + xPos + "," + yPos;
							}
						} else {
							linePath += "M" + xPos + "," + yPos;
						}

						xPosPrev = xPos;
						yPosPrev = yPos;
					}
					this._lines.push( { path: linePath, style: lineStyle, id: lines[i].id } );
				}
			}
			this._drawingRange = [ minX, minY, maxX, maxY ];
			this._graph = graph;

			routemapContainer.width( convertCoord( maxX ) + marginLeft + marginRight )
				.height( convertCoord( maxY ) + marginTop + marginBottom );
		},

		_drawLines: function () {
			var i, lines = this._lines,
				length = lines.length;

			for ( i = 0; i < length; i += 1 ) {
				this._node( null, "path", {
					"class": "ui-line ui-id-" + lines[i].id,
					d: lines[i].path
				}, lines[i].style );
			}
		},

		_drawLegend: function () {
			var i, lines = this._lines,
				length = lines.length,
				namelist = this._nameList,
				lineId = "",
				y_weight,
				labelHeight = this.element.find( ".ui-label" ).outerHeight( true ),
				group = this._node( null, "g", { "class": "ui-legend"} );

			for ( i = 0; i < length; i +=1 ) {
				if ( lineId !== lines[i].id ) {
					lineId = lines[i].id;
					y_weight = $(".ui-routemap text").length * labelHeight;
					this._node( group, "line", {
						"class": "ui-line ui-id-" + lineId,
						x1: 0,
						y1: 20 + y_weight,
						x2: 20,
						y2: 20 + y_weight
					}, lines[i].style );

					this._node( group, "text", {
						x : 23,
						y : 23 + y_weight
					} ).appendChild( group.ownerDocument.createTextNode( namelist[ lineId ] ) );
				}
			}
		},

		_drawElements: function () {
			var i,
				options = this.options,
				unit = options.unit,
				stationRadius,
				stations = this._stations,
				station,
				label,
				coordinates,
				position,
				labelPosition = [0, 0],
				labelAngle = 0,
				stationName,
				classes,
				top, left, key,
				$station,
				$stationCircle,
				$textSpan,
				textSpanWidth,
				textSpanHeight,
				$stationContainer = this.element.find( ".ui-station-container" );

			for ( i = 0; i < stations.length; i += 1 ) {
				station = stations[i];
				label = station.label;
				coordinates = station.coordinates;
				position = [unit * coordinates[0], unit * coordinates[1] ];
				classes = "ui-station ui-id-" + station.id;

				if ( station.transfer.length ) {
					classes += " ui-id-" + station.transfer.join( " ui-id-" ) + " ui-exchange";
				}

				$station = $( "<div class='" + classes + "'></div>" ).appendTo( $stationContainer );
				$stationCircle = $( "<div class='ui-shape'></div>" ).appendTo( $station );

				if ( station.style ) {
					for ( key in station.style ) {
						$stationCircle.css( key, station.style[key] );
					}
				}

				stationRadius = $stationCircle.outerWidth() / 2;
				top = position[1];
				left = position[0];
				$stationCircle.css( {
					"top" : top - stationRadius,
					"left" : left - stationRadius
				} );

				labelAngle = station.labelAngle ? -parseInt( station.labelAngle, 10 ) : 0;
				stationName = this._languageData ? ( this._languageData[label] || label ) : label;
				$textSpan = $( "<span class='ui-label'>"+ stationName +"</span>" ).appendTo( $station );
				textSpanWidth = $textSpan.outerWidth( true );
				textSpanHeight = $textSpan.outerHeight( true );
				top -= textSpanHeight / 2;

				switch ( station.labelPosition || "s" ) {
				case "w" :
					labelPosition = [ left - stationRadius * 3 / 2 - textSpanWidth, top ];
					break;
				case "nw" :
					labelPosition = [ left - stationRadius * 3 / 2 - textSpanWidth, top - textSpanHeight / 2 ];
					break;
				case "sw" :
					labelPosition = [ left - stationRadius * 3 / 2 - textSpanWidth, top + textSpanHeight / 2 ];
					break;
				case "e" :
					labelPosition = [ left + stationRadius * 3 / 2, top ];
					break;
				case "ne" :
					labelPosition = [ left + stationRadius * 3 / 2, top - textSpanHeight / 2 ];
					break;
				case "se" :
					labelPosition = [ left + stationRadius * 3 / 2, top + textSpanHeight / 2 ];
					break;
				case "s" :
					labelPosition = [ left - textSpanWidth / 2, top + textSpanHeight ];
					break;
				case "n" :
					labelPosition = [ left - textSpanWidth / 2, top - textSpanHeight ];
					break;
				}

				$textSpan.css( {
					"top" : labelPosition[1],
					"left" : labelPosition[0],
					"transform" : "rotate( " + labelAngle + "deg )"
				} );
			}
		},

		// -------------------------------------------------
		// SVG

		_node: function ( parent, name, settings, style ) {
			var node, key, value, string = "";

			parent = parent || this._svg;
			node = parent.ownerDocument.createElementNS( svgNameSpace, name );
			settings = settings || {};

			for ( key in settings ) {
				value = settings[key];
				if ( value && ( typeof value !== "string" || value !== "" ) ) {
					node.setAttribute( key.replace( regAttr, "$1-$2" ).toLowerCase(), value);
				}
			}

			if ( style ) {
				for ( key in style ) {
					value = style[key];
					if ( value && ( typeof value !== "string" || value !== "" ) ) {
						string += key.replace( regAttr, "$1-$2" ).toLowerCase() + ":" + value + ";";
					}
				}
				node.setAttribute( "style", string );
			}

			parent.appendChild( node );
			return node;
		},

		_hasClass: function ( elements, className ) {
			return new RegExp( "\\b" + className + "\\b" ).test( elements.attr( "class" ) );
		},

		_addClass: function ( elements, className ) {
			var element, classAttr;
			$.each( elements, function () {
				element = $( this );
				if ( element[0].namespaceURI.indexOf( "svg" ) === -1 ) {
					element.addClass( className );
					return true;
				}
				classAttr = element.attr( "class" );
				if ( classAttr.indexOf( className ) !== -1 ) {
					return true;
				}
				element.attr( "class", classAttr + " " + className );
			} );
		},

		_removeClass: function ( elements, className ) {
			var element, classAttr;

			$.each( elements, function () {
				element = $( this );
				if ( element[0].namespaceURI.indexOf( "svg" ) === -1 ) {
					element.removeClass( className );
					return true;
				}
				classAttr = element.attr( "class" );
				element.attr( "class", classAttr.replace( new RegExp( "\\s?" + className ), "" ) );
			} );
		},

		// -------------------------------------------------
		// Dijkstra path-finding functions
		// Original code: https://bitbucket.org/wyatt/dijkstra.js(MIT license)
		// Thanks Wyatt Baldwin
		_calculateShortestPath: function ( graph, source, destination, isMinimumTransfersMode ) {
			var predecessors, costs, open,
				closest,
				u, v,
				costU,
				adjacentNodes,
				costE,
				costUTotal,
				costV,
				msg,
				destCost,
				nodes = [];

			function PriorityQueue() {
				var queue = [],
					sorter = function ( a, b ) {
						return a.cost - b.cost;
					};

				this.push = function ( value, cost ) {
					var item = { value: value, cost: cost };

					queue.push( item );
					queue.sort( sorter );
				};

				this.pop = function () {
					return queue.shift();
				};

				this.empty = function () {
					return queue.length === 0;
				};
			}

			predecessors = {};

			costs = {};
			costs[source] = 0;

			open = new PriorityQueue();
			open.push( source, 0 );

			while ( !open.empty() ) {
				closest = open.pop();
				u = closest.value;
				costU = closest.cost;

				adjacentNodes = graph[u] || {};

				for ( v in adjacentNodes ) {
					costE = adjacentNodes[v];

					if ( costE === "TRANSPER" ) {
						costE = isMinimumTransfersMode ? 999 : 5;
					}

					costUTotal = costU + costE;

					costV = costs[v];
					if ( costV === undefined  || costV > costUTotal ) {
						costs[v] = costUTotal;
						open.push( v, costUTotal );
						predecessors[v] = u;
					}
				}
			}

			if ( destination !== undefined && costs[destination] === undefined ) {
				msg = ["Could not find a path from ", source, " to ", destination, "."].join( "" );
				throw new Error( msg );
			}

			destCost = costs[destination];

			while ( destination ) {
				nodes.push( destination );
				destination = predecessors[destination];
			}

			nodes.reverse();

			return { path: nodes, cost: destCost };
		},

		// -------------------------------------------------
		// Public

		getIdsByName: function ( name ) {
			var nameList = this._nameList, key, ret = [];

			for ( key in nameList ) {
				if( nameList[key] === name ) {
					ret.push( key );
				}
			}
			return ret;
		},

		getNameById: function ( id ) {
			return this._nameList[id];
		},

		shortestRoute: function ( source, destination ) {
			return this._calculateShortestPath( this._graph, source, destination ).path;
		},

		minimumTransfers: function ( source, destination ) {
			var i = 0, j = 0, route,
				result = { cost: 9999 },
				sources = this.getIdsByName( this.getNameById( source ) ),
				destinations = this.getIdsByName( this.getNameById( destination ) ),
				sourcesLength = sources.length,
				destinationsLength = destinations.length;

			for ( i = 0; i < sourcesLength; i++ ) {
				for ( j = 0; j < destinationsLength; j++ ) {
					route = this._calculateShortestPath( this._graph, sources[i], destinations[j], true );
					if ( result.cost > route.cost ) {
						result = route;
					}
				}
			}

			return result.path;
		},

		highlight: function ( target ) {
			var i, view, targetLength;

			if ( !this._svg || !target ) {
				return;
			}

			view = this.element;
			targetLength = target.length;

			for ( i = 0; i < targetLength; i++ ) {
				this._addClass( view.find( ".ui-id-" + target[i] ), "ui-highlight" );
			}
		},

		dishighlight: function ( target ) {
			var i, view, targetLength;

			if ( !this._svg ) {
				return;
			}

			view = this.element;
			if ( !target ) {
				this._removeClass( view.find( ".ui-station, .ui-line" ), "ui-highlight" );
				return;
			}

			targetLength = target.length;
			for ( i = 0; i < targetLength; i++ ) {
				this._removeClass( view.find( ".ui-id-" + target[i] ), "ui-highlight" );
			}
		},

		refresh: function ( redraw ) {
			var view = this.element,
				routemapContainer = view.find( "ui-routemap-container" );

			if ( routemapContainer.width() !== view.width() ) {
				routemapContainer.width( view.width() );
			}

			if ( redraw ) {
				this._clear();
				this._drawLines();
				this._drawElements();
				this._drawLegend();
			}
		}
	} );

	$.mobile.window.on( "pagechange", function () {
		$( ".ui-page-active .ui-routemap" ).routemap( "refresh", true );
	} ).on( "resize", function () {
		$( ".ui-page-active .ui-routemap" ).routemap( "refresh" );
	} );

} ( jQuery, this ) );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
} );
//>>excludeEnd("jqmBuildExclude");
