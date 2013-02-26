$( document ).bind( "colorchanged", function( e, newValue ) {
	$( ":mobile-colorpalette" ).colorpalette( "option", "color", newValue );
	$( ":mobile-hsvpicker" ).hsvpicker( "option", "color", newValue );
});
