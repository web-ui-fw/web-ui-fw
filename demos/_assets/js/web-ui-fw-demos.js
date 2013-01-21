$( document ).bind( "colorchanged", function( e, newValue ) {
	$( ":mobile-colorpalette" ).colorpalette( "option", "color", newValue );
});
