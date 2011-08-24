 /*!
 * jQuery UI Google Map 3.0-alpha
 * http://code.google.com/p/jquery-ui-map/
 * Copyright (c) 2010 - 2011 Johan Säll Larsson
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 * Depends:
 *      jquery.ui.widget.js
 */

( function($) {
	
	$.widget( "ui.gmap", {
		
		/**
		 * Widget options
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MapOptions
		 */
		options: {
			center: (google.maps) ? new google.maps.LatLng(0.0, 0.0) : null,
			mapTypeId: (google.maps) ? google.maps.MapTypeId.ROADMAP : null,
			zoom: 5
		},
		
		/**
		 * Create widget
		 * @return $(google.maps.Map)
		 */
		_create: function() {
			this.options.center = this._latLng(this.options.center);
			var a = this.element;
			this.id = a.attr('id');
			this.instances = [];
			var b = this.instances[a.attr('id')] = { map: new google.maps.Map( a[0], this.options ), markers: [], services: [], overlays: [] };
			google.maps.event.addListenerOnce(b.map, 'bounds_changed', function() {
				a.trigger('init', b.map);
			});
			return $(b.map);
		},
		
		/**
		 * Sets the option
		 * @param name:string
		 * @param value:object
		 */
		_setOption: function(a, b) {
			var map = this.get('map');
			jQuery.extend(this.options, { 'center': map.getCenter(), 'mapTypeId': map.getMapTypeId(), 'zoom': map.getZoom() } );
			if ( a && b ) {
				$.Widget.prototype._setOption.apply(this, arguments);
			};
			map.setOptions(this.options);
		},
		
		/**
		 * Adds a latitude longitude pair to the bounds.
		 * @param position:google.maps.LatLng/string
		 */
		addBounds: function(a) {
			this.get('bounds', new google.maps.LatLngBounds()).extend(this._latLng(a));
			this.get('map').fitBounds(this.get('bounds'));
		},
		
		/**
		 * Adds a custom control to the map
		 * @param panel:jquery/node/string	
		 * @param position:google.maps.ControlPosition	 
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#ControlPosition
		 */
		addControl: function(a, b) {
			this.get('map').controls[b].push(this._unwrap(a));
		},
		
		/**
		 * Adds a Marker to the map
		 * @param markerOptions:google.maps.MarkerOptions (optional)
		 * @param callback:function(map:google.maps.Map, marker:google.maps.Marker) (optional)
		 * @param marker:function (optional)
		 * @return $(google.maps.Marker)
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#MarkerOptions
		 */
		addMarker: function(a, b, c) {
			var d = this.get('map');
			var c = c || google.maps.Marker;
			a.position = (a.position) ? this._latLng(a.position) : null;
			var e = new c( jQuery.extend({'map': d, 'bounds': false}, a) );
			var f = this.get('markers', []);
			if ( e.id ) {
				f[e.id] = e;
			} else {
				f.push(e);
			}
			if ( e.bounds ) {
				this.addBounds(e.getPosition());
			}
			this._call(b, d, e);
			return $(e);
		},
		
		/**
		 * Adds an InfoWindow to the map
		 * @param infoWindowOptions:google.maps.InfoWindowOptions (optional)
		 * @param callback:function(InfoWindow:google.maps.InfoWindowOptions) (optional)
		 * @return $(google.maps.InfoWindowOptions)
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#InfoWindowOptions
		 */
		addInfoWindow: function(a, b) {
			var c = new google.maps.InfoWindow(a);
			this._call(b, c);
			return $(c);
		},
		
		/**
		 * Clears by type
		 * @param type:string i.e. markers, overlays, services
		 */
		clear: function(a) {
			this._c(this.get(a));
			this.set(a, []);
		},
		
		_c: function(a) {
			for ( b in a ) {
				if ( a[b] instanceof google.maps.MVCObject ) {
					google.maps.event.clearInstanceListeners(a[b]);
					a[b].setMap(null);
				} else if ( a[b] instanceof Array ) {
					this._c(a[b]);
				}
				a[b] = null;
			}
		},
		
		/**
		 * Returns the marker(s) with a specific property and value, e.g. 'category', 'tags'
		 * @param property:string the property to search within
		 * @param value:string
		 * @param delimiter:string/boolean	a delimiter if it's multi-valued otherwise false
		 * @param callback:function(marker:google.maps.Marker, isFound:boolean)
		 */
		findMarker: function(a, b, c, d) {
			var e = this.get('markers');
			for ( f in e ) {
				var g = ( c && e[f][a] ) ? ( e[f][a].split(c).indexOf(b) > -1 ) : ( e[f][a] === b );
				this._call(d, e[f], g);
			};
		},

		/**
		 * Returns an instance property by key. Has the ability to set an object if the property does not exist
		 * @param key:string
		 * @param value:object(optional)
		 */
		get: function(a, b) {
			var c = this.instances[this.id];
			if (!c[a]) {
				if ( a.indexOf('>') > -1 ) {
					var e = a.replace(/ /g, '').split('>');
					for ( var i = 0; i < e.length; i++ ) {
						if ( !c[e[i]] ) {
							if (b) {
								c[e[i]] = ( (i + 1) < e.length ) ? [] : b;
							} else {
								return null;
							}
						}
						c = c[e[i]];
					}
					return c;
				} else if ( b && !c[a] ) {
					this.set(a, b);
				}
			}
			return c[a];
		},
		
		/**
		 * Triggers an InfoWindow to open
		 * @param infoWindowOptions:google.maps.InfoWindowOptions
		 * @param marker:google.maps.Marker (optional)
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#InfoWindowOptions
		 */
		openInfoWindow: function(a, b) {
			this.get('iw', new google.maps.InfoWindow).setOptions(a);
			this.get('iw').open(this.get('map'), this._unwrap(b)); 
		},
				
		/**
		 * Sets an instance property
		 * @param key:string
		 * @param value:object
		 */
		set: function(a, b) {
			this.instances[this.id][a] = b;
		},
		
		/**
		 * Refreshes the map
		 */
		refresh: function() {
			$(this.get('map')).triggerEvent('resize');
			this._setOption();
		},
		
		/**
		 * Destroys the plugin.
		 */
		destroy: function() {
			$.Widget.prototype.destroy.call(this);
			this.clear('markers');
			this.clear('services');
			this.clear('overlays', true);
			var a = this.instances[this.id];
			for ( b in a ) {
				a[b] = null;
			}
		},
		
		/**
		 * Helper method for calling a function
		 * @param callback
		 */
		_call: function(a) {
			if ( $.isFunction(a) ) {
				a.apply(this, Array.prototype.slice.call(arguments, 1));
			}
		},
		
		/**
		 * Helper method for google.maps.Latlng
		 * @param callback
		 */
		_latLng: function(a) {
			if ( a instanceof google.maps.LatLng ) {
				return a;
			} else {
				var b = a.replace(' ','').split(',');
				return new google.maps.LatLng(b[0], b[1]);
			}
		},
		
		/**
		 * Helper method for unwrapping jQuery/DOM/string elements
		 * @param callback
		 */
		_unwrap: function(a) {
			if ( !a ) {
				return null;
			} else if ( a instanceof jQuery ) {
				return a[0];
			} else if ( a instanceof Object ) {
				return a;
			}
			return $('#'+a)[0];
		}
			
	});
	
	jQuery.fn.extend( {
		
		click: function(a) { 
			return this.addEventListener('click', a);
		},
		
		rightclick: function(a) {
			return this.addEventListener('rightclick', a);
		},
		
		dblclick: function(a) {
			return this.addEventListener('dblclick', a);
		},
		
		mouseover: function(a) {
			return this.addEventListener('mouseover', a);
		},
		
		mouseout: function(a) {
			return this.addEventListener('mouseout', a);
		},
		
		drag: function(a) {
			return this.addEventListener('drag', a );
		},
		
		dragend: function(a) {
			return this.addEventListener('dragend', a );
		},
		
		triggerEvent: function(a) {
			google.maps.event.trigger(this[0], a);		
		},
		
		addEventListener: function(a, b) {
			if ( google.maps && this[0] instanceof google.maps.MVCObject ) {
				google.maps.event.addListener(this[0], a, b );
			} else {
				this.bind(a, b);	
			}
			return this;
		}
		
	});

} (jQuery) );