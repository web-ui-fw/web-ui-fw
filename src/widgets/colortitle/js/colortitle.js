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

$.widget( "mobile.colortitle", $.mobile.colorwidget, {
  options: {
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

    $.mobile.colorwidget.prototype._create.call(this);
  },

  _setColor: function(clr, unconditional) {
    if ($.mobile.colorwidget.prototype._setColor.call(this, clr, unconditional))
      this.ui.header.text(clr);
  }
});

$(document).bind("pagecreate create", function(e) {
  $($.mobile.colortitle.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .colortitle();
});

})(jQuery);
