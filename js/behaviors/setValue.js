//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Set value and emit change on input in addition to setting widget option.
//>>label: setValue
//>>group: Forms

define( [ "jquery", "../../jqm/js/jquery.mobile.core" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
( function( $, undefined ) {

$.mobile.behaviors.setValue = {
	_setValue: function( newValue ) {
		var valueString, valueStringIsSet, inputType;

		if ( this._value !== undefined ) {
			valueString = this._value.makeString ? this._value.makeString( newValue ) : newValue;
			valueStringIsSet = true;

			this.element.attr( this._value.attr, valueString );

			if ( this._value.signal !== undefined ) {
				this.element.triggerHandler( this._value.signal, newValue );
			}
		}

		if ( this.element.is( "input" ) ) {
			inputType = this.element.attr( "type" );

			// Special handling for checkboxes and radio buttons, where the presence
			// of the "checked" attribute is really the value
			if ( inputType === "checkbox" || inputType === "radio" ) {
				if ( newValue )
					this.element.attr( "checked", true );
				else
					this.element.removeAttr( "checked" );
			}
			else {
				this.element.attr( "value", ( valueStrinIsSet ? valueString : newValue ) );
			}

			this.element.trigger( "change" );
		}
	}
};

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
