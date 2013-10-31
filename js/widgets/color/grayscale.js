//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Color palette
//>>label: colorpalette
//>>group: Forms

define( [
	"jqm/jquery",
	"jq-color/jquery.color"
	], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");
( function( $, undefined ) {
	$.Color.fn.grayscale = function() {
		var hsl = [ this.hue(), this.saturation(), this.lightness() ],
			// Magic full-sat grayscale values taken from the GIMP
			intrinsic_vals = [ 0.211764706, 0.929411765, 0.71372549, 0.788235294, 0.070588235, 0.28627451, 0.211764706 ],
			idx = Math.floor( hsl[ 0 ] / 60 ),
			begVal, endVal, val, lowerHalfPercent, upperHalfPercent;

		// Find hue interval
		begVal = intrinsic_vals[ idx ];
		endVal = intrinsic_vals[ idx + 1 ];

		// Adjust for lum
		if (hsl[ 2 ] < 0.5) {
			lowerHalfPercent = hsl[ 2 ] * 2;
			begVal *= lowerHalfPercent;
			endVal *= lowerHalfPercent;
		}
		else {
			upperHalfPercent = ( hsl[ 2 ] - 0.5 ) * 2;
			begVal += ( 1.0 - begVal ) * upperHalfPercent;
			endVal += ( 1.0 - endVal ) * upperHalfPercent;
		}

		// This is the gray value at full sat, whereas hsl[2] is the gray value at 0 sat.
		val = begVal + ( ( endVal - begVal ) * ( hsl[ 0 ] - ( idx * 60 ) ) ) / 60;

		// Get value at hsl[1]
		val = ( val + ( hsl[ 2 ] - val ) * ( 1.0 - hsl[ 1 ] ) ) * 255;

		return $.Color( { red: val, green: val, blue: val } );
	};
})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
