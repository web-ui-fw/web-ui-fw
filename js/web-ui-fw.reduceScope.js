//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Reduce enhancement scope
//>>label: Reduce scope
//>>group: Infrastructure

define( [
	"jqm/jquery",
	"jqm/jquery.mobile.ns"
	], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
( function( $, undefined ) {

var scopeReduction = {},
	reduceScope = function( targets, useKeepNative ) {
		var idx,
			ns = this.namespace,
			name = this.widgetName,
			nsList = scopeReduction[ ns ],
			scope = nsList ? nsList[ name ] : undefined;

		if ( scope ) {
			for ( idx = 0 ; targets.length > 0 && idx < scope.ls.length ; idx++ ) {
				targets = targets.not( scope.ls[ idx ] );
			}

			scope.orig.call( this, targets, useKeepNative );
		}
	};

$.mobile.reduceEnhancementScope = function( ns, widget, filter ) {
	var nsList = scopeReduction[ ns ] || {},
		scope = nsList[ widget ] || { ls: [] };

	// Overwrite the enhance() function for this widget class with our scope-
	// restricting version if it's not already overwritten
	if ( $[ ns ][ widget ].prototype.enhance !== reduceScope ) {
		scope.orig = $[ ns ][ widget ].prototype.enhance;
		$[ ns ][ widget ].prototype.enhance = reduceScope;
	}

	// Add the scope restriction
	scope.ls.push( filter );

	nsList[ widget ] = scope;
	scopeReduction[ ns ] = nsList;
};

})( jQuery );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
