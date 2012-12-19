//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Common functionality for widgets dealing with color
//>>label: colorwidget
//>>group: Forms

define( [ "jquery", "../../../jqm/js/jquery.mobile.core", "../../behaviors/setValue", "../../../jq-color/jquery.color" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
( function( $, undefined ) {

$.mobile.behaviors.colorWidget = $.extend( $.mobile.behaviors.setValue, {
	options: {
		color: null
	},

	_value: {
		attr: "data-" + ( $.mobile.ns || "" ) + "color",
		signal: "colorchanged"
	},

	_setElementColor: function( el, clr, cssProp ) {
		clr = $.Color( clr );

		el.jqmData( "_setElementColor", clr );

		if ( this.options.disabled ) {
			clr = clr.saturation( 0 );
		}

		el.css( cssProp, clr.toRgbaString() );
	},

	_setColor: function( value ) {
		var currentValue = ( null === this.options.color ? null : $.Color( this.options.color ) );

		value = ( null === value ? null : $.Color( value ) );

		if ( this.options.color !== value ) {
			this.options.color = value;
			this._setValue( value );
			return true;
		}

		return false;
	}
});

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
