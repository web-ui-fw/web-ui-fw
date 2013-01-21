//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Set value and emit change on input in addition to setting widget option.
//>>label: setValue
//>>group: Forms

define( [ "jquery", "../../jqm/js/jquery.mobile.core" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
( function( $, undefined ) {

$.mobile.behaviors.setValue = {
	// The widget factory automagically merges data-<option> attributes with the
	// widget instance's options, but it does not merge the input's value with the
	// widget's corresponding option if this widget is based on an input
	_create: function() {
		var inputType;
		if ( this._value !== undefined && this.element.is( "input" ) ) {
			inputType = this.element.attr( "type" );

			// Special handling for checkboxes and radio buttons, where the presence
			// of the "checked" attribute is really the value
			if ( inputType === "checkbox" || inputType === "radio" ) {
				this.options[ this._value.option ] = this.element[ 0 ].hasAttribute( "checked" );
			} else {
				this.options[ this._value.option ] = this.element.attr( "value" );
			}
		}

		this._super();
	},

	_setValue: function( newValue ) {
		var valueString, valueStringIsSet, inputType;

		if ( this._value !== undefined ) {
			valueString = this._value.makeString ? this._value.makeString( newValue ) : newValue;
			valueStringIsSet = true;

			this.element.attr( "data-" + $.mobile.ns + this._value.option, valueString );

			if ( this._value.signal !== undefined ) {
				this.element.trigger( this._value.signal, newValue );
			}
		}

		if ( this.element.is( "input" ) ) {
			inputType = this.element.attr( "type" );

			// Special handling for checkboxes and radio buttons, where the presence
			// of the "checked" attribute is really the value
			if ( inputType === "checkbox" || inputType === "radio" ) {
				if ( newValue ) {
					this.element.attr( "checked", true );
				} else {
					this.element.removeAttr( "checked" );
				}
			}
			else {
				this.element.attr( "value", ( valueStringIsSet ? valueString : newValue ) );
			}

			this.element.trigger( "change" );
		}
	}
};

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
