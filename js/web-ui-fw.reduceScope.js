//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Reduce enhancement scope
//>>label: Reduce scope
//>>group: Infrastructure

define( [
	"jquery",
	"jqm/jquery.mobile.ns"
	], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");
( function( $, undefined ) {

// Wrap the initSelector for a widget in a :not(:not()) and intersect with
// :not(filter). Assign the resulting selector to the widget's initSelector.
$.mobile.reduceEnhancementScope = function( ns, widget, filter ) {
	var initSelector;

	widget = $[ ns ][ widget ];
	if ( !!widget ) {
		initSelector = widget.initSelector;
		initSelector = initSelector ? ":not(:not(" + initSelector + "))" : "";
		widget.initSelector = initSelector + ":not(" + filter + ")";
	}
};

})( jQuery );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
