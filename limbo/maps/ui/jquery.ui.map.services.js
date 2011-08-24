 /*!
 * jQuery UI Google Map 3.0-alpha
 * http://code.google.com/p/jquery-ui-map/
 * Copyright (c) 2010 - 2011 Johan Säll Larsson
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 * Depends:
 *		jquery.ui.map.js
 */
( function($) {

	$.extend($.ui.gmap.prototype, {

		/**
		 * Makes an elevation request along a path, where the elevation data are returned as distance-based samples along that path.
		 * @param a:google.maps.PathElevationRequest, http://code.google.com/apis/maps/documentation/javascript/reference.html#PathElevationRequest
		 * @param b:function(result:google.maps.ElevationResult, status:google.maps.ElevationStatus), http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#ElevationResult
		 */
		/*elevationPath: function(a, b) {
			this.get('services > ElevationService', new google.maps.ElevationService()).getElevationAlongPath(a, b);
		},*/

		/**
		 * Makes an elevation request for a list of discrete locations.
		 * @param a:google.maps.PathElevationRequest, http://code.google.com/apis/maps/documentation/javascript/reference.html#PathElevationRequest
		 * @param b:function(result:google.maps.ElevationResult, status:google.maps.ElevationStatus), http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#ElevationResult
		 */
		/*elevationLocations: function(a, b) {
			this.get('services > ElevationService', new google.maps.ElevationService()).getElevationForLocations(a, b);
		},*/

		/* PLACES SERVICE */

		/**
		 * Retrieves a list of Places in a given area. The PlaceResultss passed to the callback are stripped-down versions of a full PlaceResult. A more detailed PlaceResult for each Place can be obtained by sending a Place Details request with the desired Place's reference value.
		 * @param a:google.maps.places.PlaceSearchRequest, http://code.google.com/apis/maps/documentation/javascript/reference.html#PlaceSearchRequest
		 * @param b:function(result:google.maps.places.PlaceResult, status:google.maps.places.PlacesServiceStatus), http://code.google.com/apis/maps/documentation/javascript/reference.html#PlaceResult
		 */
		/*placesSearch: function(a, b) {
			this.get('services > PlacesService', new google.maps.places.PlacesService(this.get('map'))).search(a, b);
		},*/

		/**
		 * Retrieves details about the Place identified by the given reference.
		 * @param a:google.maps.places.PlaceDetailsRequest, http://code.google.com/apis/maps/documentation/javascript/reference.html#PlaceDetailsRequest
		 * @param b:function(result:google.maps.places.PlaceResult, status:google.maps.places.PlacesServiceStatus), http://code.google.com/apis/maps/documentation/javascript/reference.html#PlaceResult
		 */
		/*placesDetails: function(a, b) {
			this.get('services > PlacesService', new google.maps.places.PlacesService(this.get('map'))).getDetails(a, b);
		},*/

		/**
		 * A service to predict the desired Place based on user input. The service is attached to an <input> field in the form of a drop-down list. The list of predictions is updated dynamically as text is typed into the input field.
		 * @param a:jquery/node/string
		 * @param b:google.maps.places.AutocompleteOptions, http://code.google.com/apis/maps/documentation/javascript/reference.html#AutocompleteOptions
		 */
		/*placesAutocomplete: function(a, b) {
			this.get('services > Autocomplete', new google.maps.places.Autocomplete(this._unwrap(a)));
		},*/

		/* DISTANCE MATRIX SERVICE */

		/**
		 * Issues a distance matrix request.
		 * @param a:google.maps.DistanceMatrixRequest, http://code.google.com/apis/maps/documentation/javascript/reference.html#DistanceMatrixRequest
		 * @param b:function(result:google.maps.DistanceMatrixResponse, status: google.maps.DistanceMatrixStatus), http://code.google.com/apis/maps/documentation/javascript/reference.html#DistanceMatrixResponse
		 */
		/*displayDistanceMatrix: function(a, b) {
			this.get('services > DistanceMatrixService', new google.maps.DistanceMatrixService()).getDistanceMatrix(a, b);
		},*/

		/* DIRECTIONS SERVICE */

		/**
		 * Computes directions between two or more places.
		 * @param directionsRequest:google.maps.DirectionsRequest
		 * @param directionsRendererOptions:google.maps.DirectionsRendererOptions (optional)
		 * @param callback:function(result:google.maps.DirectionsResult, status:google.maps.DirectionsStatus)
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsRequest
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsRendererOptions
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#DirectionsResult
		 */
		displayDirections: function(a, b, c) {
			var d = this;
			var e = this.get('services > DirectionsService', new google.maps.DirectionsService());
			var f = this.get('services > DirectionsRenderer', new google.maps.DirectionsRenderer());
			f.setOptions(b);
			e.route(a, function(g, h) {
				if ( h === 'OK' ) {
					if ( b.panel ) {
						f.setDirections(g);
					}
					f.setMap(d.get('map'));
				} else {
					f.setMap(null);
				}
				d._call(c, g, h);
			});
		},

		/**
		 * Displays the panorama for a given LatLng or panorama ID.
		 * @param panel:jQuery/String/Node
		 * @param streetViewPanoramaOptions:google.maps.StreetViewPanoramaOptions (optional)
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#StreetViewPanoramaOptions
		 */
		displayStreetView: function(a, b) {
			this.get('map').setStreetView(this.get('services > StreetViewPanorama', new google.maps.StreetViewPanorama(this._unwrap(a), b)));
		},

		/* GEOCODING SERVICE */

		/**
		 * A service for converting between an address and a LatLng.
		 * @param geocoderRequest:google.maps.GeocoderRequest
		 * @param callback:function(result:google.maps.GeocoderResult, status:google.maps.GeocoderStatus),
		 * @see http://code.google.com/intl/sv-SE/apis/maps/documentation/javascript/reference.html#GeocoderResult
		 */
		search: function(a, b) {
			this.get('services > Geocoder', new google.maps.Geocoder()).geocode(a, b);
		}

	});

} (jQuery) );