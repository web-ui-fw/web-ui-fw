//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Set value and emit change on input in addition to setting widget option.
//>>label: setValue
//>>group: Forms

define( [
	"jqm/jquery",
	"jqm/jquery.mobile.core",
	"jqm/widgets/forms/reset" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
( function( $, undefined ) {

$.mobile.behaviors.setValue = $.extend( {
	// The widget factory automagically merges data-<option> attributes with the
	// widget instance's options, but it does not merge the input's value with the
	// widget's corresponding option if this widget is based on an input
	_create: function() {
		if ( this._value !== undefined && this.element.is( "input" ) ) {
			this.options[ this._value.option ] = this._getInputValue();
			this._handleFormReset();
		}

		this._super();
	},

	_getInputValue: function() {
		var inputType, ret;

		if ( this.element.is( "input" ) ) {
			inputType = this.element.attr( "type" );
			// Special handling for checkboxes and radio buttons, where the presence
			// of the "checked" attribute is really the value
			if ( inputType === "checkbox" || inputType === "radio" ) {
				ret = this.element.prop( "checked" );
			} else {
				ret = this.element.val();
			}
		}

		return ret;
	},

	_reset: function() {
		this._setOption( this._value.option, this._getInputValue() );
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
				this.element.prop( "checked", !!newValue );
			}
			else {
				this.element.val( ( valueStringIsSet ? valueString : newValue ) );
			}

			this.element.trigger( "change" );
		}
	}
}, $.mobile.behaviors.formReset );

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
