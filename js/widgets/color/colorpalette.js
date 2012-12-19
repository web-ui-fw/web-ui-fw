//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Color palette
//>>label: colorpalette
//>>group: Forms

define( [ "jquery", "../../../jqm/js/jquery.mobile.widget", "./colorwidget", "../../behaviors/optionDemultiplexer" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");
( function( $, undefined ) {

$.widget( "mobile.colorpalette", $.mobile.widget, {
	options: {
		showPreview: false,
		initSelector: ":jqmData(role='colorpalette')",
		rows: 2,
		colors: "#ff0000,#ff8000,#ffff00,#80ff00,#00ff00,#00ff80,#00ffff,#0080ff,#0000ff,#8000ff,#ff00ff,#ff0080",
		initSelector: ":jqmData(role='colorpalette')"
	},

	_create: function() {
		var ui = {
			preview: {
				outer: $( "<div class='ui-colorpalette-preview-container ui-corner-all'></div>" ),
				inner: $( "<div class='ui-colorpalette-preview'></div>" )
			},
			table: $( "<div class='ui-colorpalette-table'></div>" ),
			row: $( "<div class='ui-colorpalette-row'></div>" ),
			entry: {
				outer: $( "<div class='ui-colorpalette-choice-container ui-corner-all'></div>" ),
				inner: $( "<div class='ui-colorpalette-choice'></div>" )
			}
		};

		// Establish the outer element
		if ( this.element.is( "input" ) ) {
			ui.outer = $( "<div class='ui-colorpalette'></div>" )
				.insertAfter( this.element )
				.append( this.element );
		} else {
			ui.outer = this.element.addClass( "ui-colorpalette" );
		}

		// Apply the proto
		ui.outer.append( ui.preview.outer );
		ui.preview.outer.append( ui.preview.inner );
		ui.outer.append( ui.table );

		$.extend( this, {
			_ui: ui,
			_colorEls: []
		});

		this.refresh();
	},

	_setShowPreview: function( value ) {
		this._ui.preview[ value ? "show" : "hide" ]();
	},

	_setRows: function( value ) {
		this.options.rows = value;
		this.refresh();
	},

	_setColor: function( value ) {
	},

	_setDisabled: function( value ) {
	},

	_setColors: function( value ) {
		if ( value !== this.options.colors ) {
			this._updateColors( value );
		}
	},

	_updateColors: function( clrs ) {
		var clrs = clrs.split( "," ),
			nClrs = clrs.length,
			idx;

		for ( idx = 0 ; idx < this._colorEls.length ; idx++ ) {
			if ( idx < nClrs ) {
				this._setElementColor( this._colorEls[ idx ], clrs[ idx ], "background-color" );
			} else {
				this._setElementColor( this._colorEls[ idx ], null, "background-color" );
			}
		}
	},

	refresh: function() {
		var o = this.options,
			nClrs = ( o.colors || "" ).split( "," ).length,
			nCols = Math.floor( nClrs / o.rows ),
			idx, row, el, inner;

		this._ui.table.empty();
		this._colorEls = [];

		for ( idx = 0 ; idx < nClrs ; idx++ ) {
			if ( idx % nCols === 0 ) {
				row = this._ui.row.clone();
				this._ui.table.append( row );
			}
			el = this._ui.entry.outer.clone();
			row.append( el );
			inner = this._ui.entry.inner.clone().appendTo( el );
			this._colorEls.push( inner );
		}

		this._updateColors( o.colors );
	}
});

$.widget( "mobile.colorpalette", $.mobile.colorpalette, $.mobile.behaviors.colorWidget );
$.widget( "mobile.colorpalette", $.mobile.colorpalette, $.mobile.behaviors.optionDemultiplexer );

$( document ).bind( "pagecreate create", function( e )  {
	$.mobile.colorpalette.prototype.enhanceWithin( e.target, true );
});

})( jQuery );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
