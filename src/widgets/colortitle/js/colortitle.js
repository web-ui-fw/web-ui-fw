/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Gabriel Schulhof
 */

/*
 * colortitle is a color title widget. It displays the color in
 * text of the form '#RRGGBB' where RR, GG, and BB are in
 * hexadecimal.
 *
 * To apply, add the attribute data-role="colorcolor" to a <div>
 * element inside a page. Alternatively, call colortitle() 
 * on an element (see below).
 *
 * The initial color can be specified in html using the
 * data-color="#ff00ff" attribute.
 *
 * Alternatively, the color can be specified when constructed
 * in javascript, * (usually bound to the pageload/create
 * event) eg
 *     $("#mycolortitle").colortitle({ color: "#ff00ff" });
 * where the html might be :
 *     <div id="mycolortitle"></div>
 *
 * The color can be changed post-construction in the usual jQuery mobile
 * way, like this :
 *     $("#mycolortitle").colortitle("option", "color", "#ABCDEF");
 *
 * The default color is "#1a8039".
 */
(function( $, undefined ) {

$.widget( "mobile.colortitle", $.mobile.widget, {
  options: {
    color: "#1a8039",
    initSelector: ":jqmData(role='colortitle')"
  },

  _create: function() {
    var self = this,
        clrtitle = $.mobile.todons.loadPrototype("colortitle").find("#colortitle")
          .appendTo(this.element);

      $.extend( this, {
        clrtitle: clrtitle
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
      this.clrtitle.find("#colortitle-string").text(clr);
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
