( function( $, undefined ) {

$.widget( "mobile.hsvpicker", $.mobile.widget, $.extend( {},
	$.mobile.behaviors.createOuter,
	$.mobile.behaviors.optionDemultiplexer, {
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
			_ignoreHandle: false,
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

	_handleSlideControlChange: function( e ) {
		var hsv, clr;

		if ( this._ignoreHandle ) {
			return;
		}

		hsv = [
			this._ui.chan.h.widget._value(),
			this._ui.chan.s.widget._value() / 255.0,
			this._ui.chan.v.widget._value() / 255.0
		];
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
		var hclr = this._hsvToClr( [ hsv[ 0 ], 1.0, 1.0 ] ),
			vclr = this._hsvToClr( [ hsv[ 0 ], hsv[ 1 ], 1.0 ] );

		// hue
		this._setElementColor( chan.h.widget.handle, clr, "background" );
		chan.h.sat.css( "opacity", 1 - hsv[ 1 ] );
		chan.h.val.css( "opacity", 1 - hsv[ 2 ] );

		// sat
		this._setElementColor( chan.s.widget.handle, clr, "background" );
		this._setElementColor( chan.s.widget.slider, hclr, "background" );
		chan.s.val.css( "opacity", 1 - hsv[ 2 ] );

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

		return [ h, s, v ];
	},

	// Input: [ h, s, v ], where
	// h is in [0, 360]
	// s is in [0,   1]
	// v is in [0,   1]
	// Returns: jQuery Color object
	_hsvToClr: function( hsv ) {
		var max = hsv[2],
			delta = hsv[1] * max,
			min = max - delta,
			sum = max + min,
			half_sum = sum / 2,
			s_divisor = ((half_sum < 0.5) ? sum : (2 - max - min));

		return $.Color( {
			hue: hsv[ 0 ],
			saturation: ( ( 0 === s_divisor ) ? 0 : ( delta / s_divisor ) ),
			lightness: half_sum
		});
	},

	_setColor: function( value ) {
		var clr, hsv, chan;

		if ( value !== this._clr ) {
			chan = this._ui.chan;
			clr = $.Color( value );
			hsv = this._clrToHSV ( clr );

			this._ignoreHandle = true;
			chan.h.widget.refresh( Math.round( hsv[ 0 ] ) );
			chan.s.widget.refresh( Math.round( hsv[ 1 ] * 255 ) );
			chan.v.widget.refresh( Math.round( hsv[ 2 ] * 255 ) );
			this._ignoreHandle = false;

			this._styleSliders( chan, clr, hsv );

			this._clr = value;
		}
	}
}));

$.widget( "mobile.hsvpicker", $.mobile.hsvpicker, $.extend( {}, $.mobile.behaviors.colorWidget ) );

// Add a filter to prevent the textinput widget from enhancing color inputs 
// that our initSelector would match
$.mobile.reduceEnhancementScope( "mobile", "textinput", $.mobile.hsvpicker.prototype.options.initSelector );

$( document ).bind( "pagecreate create", function( e )  {
	$.mobile.hsvpicker.prototype.enhanceWithin( e.target, true );
});

})( jQuery );
