//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Common functionality for widgets dealing with color
//>>label: colorwidget
//>>group: Forms

define( [
	"jquery",
	"jqm/jquery.mobile.core",
	"../../behaviors/setValue",
	"../../behaviors/setDisabled",
	"jq-color/jquery.color",
	"./grayscale" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");
( function( $, undefined ) {

var dataKey = "_setElementColor_data";

$.mobile.behaviors.colorWidget = $.extend( {}, $.mobile.behaviors.setValue, $.mobile.behaviors.setDisabled, {
	options: {
		color: null
	},

	_value: {
		option: "color",
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
					clr = clr.grayscale();
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
			if ( $.type( clr ) === "string" ) {
				clr = $.Color( clr );
			}

			el.jqmData( dataKey, { clr: clr, cssProp: cssProp } );

			if ( this.options.disabled ) {
				clr = clr.grayscale();
			}

			el.css( cssProp, clr.toRgbaString() );
		} else {
			el.jqmData( dataKey, undefined );
			el.css( cssProp, "" );
		}
	},

	_setColor: function( value ) {
		var curClr = null, newClr = null;

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
	},

	_huegradient: function( el ) {
		var idx;
		el.addClass( "ui-huegradient" );
		if ( $.mobile.browser.oldIE ) {
			el.addClass( "ie" );
			for ( idx = 0 ; idx < 6 ; idx++ ) {
				$( "<div></div>" )
					.addClass( "ie-grad g" + idx )
					.appendTo( el );
			}
		}

		return el;
	}
});

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
