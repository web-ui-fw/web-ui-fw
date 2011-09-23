/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Gabriel Schulhof
 */

/*
 * Displays the color in text of the form '#RRGGBB' where
 * RR, GG, and BB are in hexadecimal.
 *
 * Apply a colortitle by adding the attribute data-role="colortitle"
 * to a <div> element inside a page. Alternatively, call colortitle() 
 * on an element (see below).
 *
 * Options:
 *
 *     color: String; the initial color can be specified in html using
 *            the data-color="#ff00ff" attribute or when constructed
 *            in javascipt eg
 *                $("#mycolortitle").colortitle({ color: "#ff00ff" });
 *            where the html might be :
 *                <div id="mycolortitle"></div>
 *            The color can be changed post-construction :
 *                $("#mycolortitle").colortitle("option", "color", "#ABCDEF");
 *            Default: "#1a8039".
 */
(function( $, undefined ) {

$.widget( "mobile.colortitle", $.mobile.widget, {
  options: {
    color: "#1a8039",
    initSelector: ":jqmData(role='colortitle')"
  },

  _create: function() {
    var self = this,
        ui = {
          clrtitle: "#colortitle",
          header: "#colortitle-string"
        };

      $.mobile.todons.loadPrototype("colortitle", ui);
      this.element.append(ui.clrtitle);

      $.extend( this, {
        ui: ui
      });

    $.mobile.todons.parseOptions(this, true);
  },

  _setOption: function(key, value, unconditional) {
    if (undefined === unconditional)
      unconditional = false;

    if (key === "color")
      this._setColor(value, unconditional);
  },

  _setColor: function(clr, unconditional) {
    if ((clr.match(/#[0-9A-Fa-f]{6}/) && this.element.attr("data-color") != clr) || unconditional) {
      this.ui.header.text(clr);
      this.element.attr("data-color", clr);
      this.element.triggerHandler('colorchanged', clr);
    }
  }
});

$(document).bind("pagecreate create", function(e) {
  $($.mobile.colortitle.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .colortitle();
});

})(jQuery);
