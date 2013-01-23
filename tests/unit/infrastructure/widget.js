( function( $, undefined ) {
	$.widget( "mobile.infratestwidget", $.mobile.widget, {

		options: {
			testValue: null
		},

		_value: {
			option: "testValue",
			signal: "testvaluechanged"
		},

		_setTestValue: function( value ) {
			this.element.text( value );
			this._setValue( value );
		}

	});

	$.widget( "mobile.infratestwidget", $.mobile.infratestwidget, $.mobile.behaviors.optionDemultiplexer );
	$.widget( "mobile.infratestwidget", $.mobile.infratestwidget, $.mobile.behaviors.setValue );

})( jQuery );
