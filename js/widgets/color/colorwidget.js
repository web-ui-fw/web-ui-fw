//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Common functionality for widgets dealing with color
//>>label: colorwidget
//>>group: Forms

define( [ "jquery", "../../../jqm/js/jquery.mobile.core", "../../behaviors/setValue", "../../../jq-color/jquery.color" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
( function( $, undefined ) {

var dataKey = "_setElementColor_data";

$.mobile.behaviors.colorWidget = $.extend( $.mobile.behaviors.setValue, {
	options: {
		color: null
	},

	_value: {
		attr: "data-" + ( $.mobile.ns || "" ) + "color",
		signal: "colorchanged"
	},

	// Look for all elements in this widget that have the "_setElementColor" data
	// and assign a desaturated version of the color to the css property
	// previously set via _setElementColor
	_setDisabled: function( value ) {
		var widget = this.widget();

		widget.add( widget.find( "*" ) ).each( function() {
			var $el = $( this ),
				data = $el.jqmData( dataKey ),
				clr;

			if ( data ) {
				clr = data.clr;
				if ( value ) {
					clr = clr.saturation( 0 );
				}

				$el.css( data.cssProp, clr.toRgbaString() );
			}
		});
		this._super( value );
	},

	_getElementColor: function( el ) {
		var data = el.jqmData( dataKey );

		return ( data ? data.clr : undefined );
	},

	_setElementColor: function( el, clr, cssProp ) {
		if ( clr ) {
			clr = $.Color( clr );

			el.jqmData( dataKey, { clr: clr, cssProp: cssProp } );

			if ( this.options.disabled ) {
				clr = clr.saturation( 0 );
			}

			el.css( cssProp, clr.toRgbaString() );
		} else {
			el.jqmData( dataKey, undefined );
			el.css( cssProp, "" );
		}
	},

	_setColor: function( value ) {
		var curClr = null, newClr = null, diff;

		if ( this.options.color ) {
			curClr = $.Color( this.options.color );
		}

		if ( value ) {
			newClr = $.Color( value );
		}

		if ( ( curClr === null && newClr !== null ) ||
			( curClr !== null && newClr === null ) ||
			( curClr !== null && newClr !== null && !curClr.is( newClr ) ) ) {
			this.options.color = value;
			this._setValue( value );
		}
		this._super( value );
	}
});

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
