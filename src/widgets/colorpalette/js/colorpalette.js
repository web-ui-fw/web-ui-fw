/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Gabriel Schulhof
 */

/*
 * colorpalette is a color palette widget. It displays a grid
 * two rows by five columns of colors. The colors are automatically
 * computed based on the hue of the color set by the color 
 * attribute (see below).
 *
 * To apply, add the attribute data-role="colorpalette" to a <div>
 * element inside a page. Alternatively, call colorpalette() 
 * on an element (see below).
 *
 * The initial color can be specified in html using the
 * data-color="#ff00ff" attribute.
 *
 * Alternatively, the color can be specified when constructed
 * in javascript (usually bound to the pageload/create
 * event), eg
 *     $("#mycolorpalette").colorpalette({ color: "#ff00ff" });
 * where the html might be :
 *     <div id="mycolorpalette"></div>
 *
 * The color can be changed post-construction in the usual jQuery mobile
 * way, like this :
 *     $("#mycolorpalette").colorpalette("option", "color", "#ABCDEF");
 *
 * The default color is "#1a8039".
 */
(function( $, undefined ) {

$.widget( "mobile.colorpalette", $.mobile.widget, {
  options: {
    color: "#1a8039",
    initSelector: ":jqmData(role='colorpalette')"
  },

  _create: function() {

    var self = this,
        dstAttr = this.element.is("input") ? "value" : "data-color",
        clrpalette = $.mobile.todons.loadPrototype("colorpalette").find("#colorpalette")
          .appendTo(this.element);

    $.extend(this, {
      dstAttr: dstAttr,
      clrpalette: clrpalette
    });

    $.mobile.todons.parseOptions(this, true);

    clrpalette.find("[data-role=colorpalette-choice]").bind("vclick", function(e) {
      var id = $(e.target).attr("id"),
          clr = $(e.target).css("background-color"),
          Nix,
          nChoices = self.clrpalette.attr("data-n-choices"),
          choiceId, rgbMatches;

      rgbMatches = clr.match(/rgb\(([0-9]*), *([0-9]*), *([0-9]*)\)/);

      if (rgbMatches.length > 3)
        clr = $.mobile.todons.clrlib.RGBToHTML([
          parseInt(rgbMatches[1]) / 255,
          parseInt(rgbMatches[2]) / 255,
          parseInt(rgbMatches[3]) / 255]);

      for (Nix = 0 ; Nix < nChoices ; Nix++)
        clrpalette.find("#colorpalette-choice-" + Nix).removeClass("colorpalette-choice-active");

      $(e.target).addClass("colorpalette-choice-active");

      self.element.attr(self.dstAttr, clr);
      self.element.triggerHandler("colorchanged", clr);
    });
  },

  _setOption: function(key, value, unconditional) {
    if (undefined === unconditional)
      unconditional = false;
    if (key === "color")
      this._setColor(value, unconditional);
  },

  _setColor: function(clr, unconditional) {
    var clrValue = this.element.attr("data-color");

    if (clr != clrValue || unconditional) {
      var Nix,
          activeIdx = -1,
          nChoices = this.clrpalette.attr("data-n-choices"),
          hsl = $.mobile.todons.clrlib.RGBToHSL($.mobile.todons.clrlib.HTMLToRGB(clr)),
          origHue = hsl[0],
          offset = hsl[0] / 36,
          theFloor = Math.floor(offset),
          newClr;

      offset = (offset - theFloor < 0.5)
        ? (offset - theFloor)
        : (offset - (theFloor + 1));

      offset *= 36;

      for (Nix = 0 ; Nix < nChoices ; Nix++) {
        hsl[0] = Nix * 36 + offset;
        hsl[0] = ((hsl[0] < 0) ? (hsl[0] + 360) : ((hsl[0] > 360) ? (hsl[0] - 360) : hsl[0]));

        if (hsl[0] === origHue)
          activeIdx = Nix;

        newClr = $.mobile.todons.clrlib.RGBToHTML($.mobile.todons.clrlib.HSLToRGB(hsl));

        this.clrpalette.find("#colorpalette-choice-" + Nix).css("background-color", newClr);
      }

      if (activeIdx != -1) {
        var currentlyActive = this.clrpalette.find(".colorpalette-choice-active").attr("id");
        if (currentlyActive != "colorpalette-choice-" + activeIdx) {
          this.clrpalette.find("#" + currentlyActive).removeClass("colorpalette-choice-active");
          this.clrpalette.find("#colorpalette-choice-" + activeIdx).addClass("colorpalette-choice-active");
        }
      }

      this.element.attr(this.dstAttr, clr);
      this.element.triggerHandler("colorchanged", clr);
    }
  }
});

$(document).bind("pagecreate create", function(e) {
  $($.mobile.colorpalette.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .colorpalette();
});

})( jQuery );
