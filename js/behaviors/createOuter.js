//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Establish outermost element for a widget
//>>label: createOuter
//>>group: Infrastructure
//>>css.structure: ../../css/structure/web-ui-fw.core.css

define( [
	"jqm/jquery",
	"jqm/jquery.mobile.core"
	], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");
( function( $, undefined ) {

$.mobile.behaviors.createOuter = {
	_createOuter: function() {
		var ret;

		$.extend( this, {
			_isInput: this.element.is( "input" )
		});

		// Establish the outer element
		if ( this._isInput ) {
			ret = $( "<div></div>" )
				.insertAfter( this.element )
				.append( this.element );
			this.element.addClass( "ui-hidden-input" );
		} else {
			ret = this.element;
		}

		return ret;
	},

	_destroyOuter: function() {
		if ( this._isInput ) {
			this.element.parent().after( this.element ).remove();
			this.element.css( "display", undefined );
		}
	}
};

})( jQuery );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
