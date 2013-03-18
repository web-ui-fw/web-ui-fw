//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Color palette
//>>label: colorpalette
//>>group: Forms
//>>css.theme: ../../../css/themes/default/web-ui-fw.theme.css
//>>css.structure: ../../../css/structure/web-ui-fw.color.huegradient.css,../../../css/structure/web-ui-fw.hsvpicker.css

define( [
	"jqm/jquery",
	"jqm/jquery.mobile.widget",
	"./colorwidget",
	"../../behaviors/createOuter",
	"../../web-ui-fw.reduceScope"
	], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");
( function( $, undefined ) {

$.widget( "mobile.hsvpicker", $.mobile.widget, $.extend( {
	options: {
		initSelector: ":jqmData(role='hsvpicker')"
	},

	_create: function() {
		var mask = $( "<div></div>", { "class": "ui-hsvpicker-mask" } ),
			ui = {
				outer: this._createOuter().addClass( "ui-hsvpicker" ),
				chan: {
					h: {
						hue: this._huegradient( mask.clone() ),
						sat: mask.clone().css( { background: "#ffffff" } ),
						val: mask.clone().css( { background: "#000000" } )
					},
					s: {
						// hue
						sat: mask.clone().addClass( "ui-hsvpicker-sat-gradient" ),
						val: mask.clone().css( { background: "#000000" } )
					},
					v: {
						// white
						hue: mask.clone(),
						val: mask.clone().addClass( "ui-hsvpicker-val-gradient" )
					}
				}
			};

		// Apply the proto
		// Background of hue slider is white
		this._makeSlider( ui, "h", 360 )
			.append( ui.chan.h.hue )
			.append( ui.chan.h.sat )
			.append( ui.chan.h.val );

		if ( $.mobile.browser.oldIE ) {
			ui.chan.h.hue = ui.chan.h.hue.add( ui.chan.h.hue.children() );
		}

		// Background of sat slider is the current hue
		ui.chan.s.hue = this._makeSlider( ui, "s", 255 )
			.append( ui.chan.s.sat )
			.append( ui.chan.s.val );

		// Background of val slider is white
		this._makeSlider( ui, "v", 255 ).css( "background", "#ffffff" )
			.append( ui.chan.v.hue )
			.append( ui.chan.v.val );

		$.extend( this, {
			_ui: ui,
			_clr: null,
			_ignoreHandle: false
		});

		this.refresh();
	},

	_makeSlider: function( ui, chan, max ) {
		var widget,
			slider = $( "<div></div>", { min: 0, max: max, step: 1 } )
				.appendTo( ui.outer )
				.slider()
				.val( 0 );

		ui.chan[ chan ].slider = slider;
		widget = slider.data( "mobile-slider" );
		ui.chan[ chan ].widget = widget;

		this._on( slider, { slidecontrolchange: "_handleSlideControlChange" } );

		return widget.slider;
	},

	_hsvFromSliders: function() {
		return {
			h: this._ui.chan.h.widget._value(),
			s: this._ui.chan.s.widget._value() / 255.0,
			v: this._ui.chan.v.widget._value() / 255.0
		};
	},

	_handleSlideControlChange: function( e ) {
		var hsv, clr;

		if ( this._ignoreHandle ) {
			return;
		}

		hsv = this._hsvFromSliders();
		clr = this._hsvToClr( hsv ).toHexString( false );

		this._clr = clr;
		this._setColor( clr );
		this._styleSliders( this._ui.chan, $.Color( clr ), hsv );
	},

	_setDisabled: $.noop,
	refresh: $.noop,

	widget: function() {
		return this._ui.outer;
	},

	// Make the slider colours reflect a certain colour without setting the handle
	// position (which might cause an event loop)
	_styleSliders: function( chan, clr, hsv ) {
		var hclr = this._hsvToClr( { h: hsv.h, s: 1.0, v: 1.0 } ),
			vclr = this._hsvToClr( { h: hsv.h, s: hsv.s, v: 1.0 } );

		// hue
		this._setElementColor( chan.h.widget.handle, clr, "background" );
		chan.h.sat.css( "opacity", 1 - hsv.s );
		chan.h.val.css( "opacity", 1 - hsv.v );

		// sat
		this._setElementColor( chan.s.widget.handle, clr, "background" );
		this._setElementColor( chan.s.widget.slider, hclr, "background" );
		chan.s.val.css( "opacity", 1 - hsv.v );

		// val
		this._setElementColor( chan.v.widget.handle, clr, "background" );
		this._setElementColor( chan.v.hue, vclr, "background" );
	},

	// Input: jQuery Color object
	// Returns: [ h, s, v ], where
	// h is in [0, 360]
	// s is in [0,   1]
	// v is in [0,   1]
	_clrToHSV: function( clr ) {
		var min, max, delta, h, s, v,
			r = clr.red() / 255,
			g = clr.green() / 255,
			b = clr.blue() / 255;

		min = Math.min( r, Math.min( g, b ) );
		max = Math.max( r, Math.max( g, b ) );
		delta = max - min;

		h = 0;
		s = 0;
		v = max;

		if ( delta > 0.00001 ) {
			s = delta / max;

			if ( r === max ) {
				h = ( g - b ) / delta;
			}
			else if ( g === max ) {
				h = 2 + ( b - r ) / delta;
			} else {
				h = 4 + ( r - g ) / delta;
			}

			h *= 60;

			if ( h < 0 ) {
				h += 360;
			}
		}

		return { h: h, s: s, v: v };
	},

	// Input: { h, s, v }, where
	// h is in [0, 360]
	// s is in [0,   1]
	// v is in [0,   1]
	// Returns: jQuery Color object
	_hsvToClr: function( hsv ) {
		var max = hsv.v,
			delta = hsv.s * max,
			min = max - delta,
			sum = max + min,
			halfSum = sum / 2,
			sDivisor = ( ( halfSum < 0.5 ) ? sum : ( 2 - max - min ) );

		return $.Color( {
			hue: hsv.h,
			saturation: ( ( 0 === sDivisor ) ? 0 : ( delta / sDivisor ) ),
			lightness: halfSum
		});
	},

	_setColor: function( value ) {
		var comboIdx, idxidx, clr, hsv, chan, oldHSV, combos, tmpHSV, cpidx, combo, sliderVals;

		if ( value !== this._clr ) {
			chan = this._ui.chan;
			clr = $.Color( value );
			hsv = this._clrToHSV ( clr );
			oldHSV = this._hsvFromSliders();
			// by default we set all three sliders ...
			combo = [ "h", "s", "v" ];
			// ... however, we try to minimize the changes we make to slider
			// positions in order to achieve the desired colour. This minimizes the
			// amount that synced sliders fidget when the transformation quality
			// degrades, like, when the saturation and/or value approaches 0.
			combos = [ [], [ "h" ], [ "s" ], [ "v" ], [ "h", "s" ], [ "h", "v" ], [ "s", "v" ] ];

			// For each combination ...
			for ( comboIdx in combos ) {
				tmpHSV = { h: oldHSV.h, s: oldHSV.s, v: oldHSV.v };
				// ... overwrite those parts of the existing hsv specified by the given
				// combination
				for ( idxidx = 0 ; idxidx < combos[ comboIdx ].length ; idxidx++ ) {
					cpidx = combos[ comboIdx ][ idxidx ];
					tmpHSV[ cpidx ] = hsv[ cpidx ];
				}
				// ... and check whether the result is the desired colour
				if ( this._hsvToClr( tmpHSV ).toHexString( false ) === value ) {
					combo = combos[ comboIdx ];
					hsv = tmpHSV;
					break;
				}
			}

			// We set values on the sliders identified above
			this._ignoreHandle = true;
			sliderVals = { h: hsv.h, s: hsv.s * 255, v: hsv.v * 255 };
			for ( idxidx = 0 ; idxidx < combo.length ; idxidx++ ) {
				chan[ combo[ idxidx ] ].widget.refresh( Math.round( sliderVals[ combo[ idxidx ] ] ) );
			}
			this._ignoreHandle = false;

			this._styleSliders( chan, clr, hsv );

			this._clr = value;
		}
	}
}, $.mobile.behaviors.createOuter, $.mobile.behaviors.optionDemultiplexer ) );

$.widget( "mobile.hsvpicker", $.mobile.hsvpicker, $.extend( {}, $.mobile.behaviors.colorWidget ) );

// Add a filter to prevent the textinput widget from enhancing color inputs 
// that our initSelector would match
$.mobile.reduceEnhancementScope( "mobile", "textinput", $.mobile.hsvpicker.prototype.options.initSelector );

$( document ).bind( "pagecreate create", function( e )  {
	$.mobile.hsvpicker.prototype.enhanceWithin( e.target, true );
});

})( jQuery );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
