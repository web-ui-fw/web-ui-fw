/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Gabriel Schulhof
 */

/*
 * It displays a grid two rows by five columns of colors.
 *
 * The colors are automatically computed based on the hue
 * of the color set by the color attribute (see below).
 *
 * One of the displayed colors is the color attribute itself
 * and the others are multiples of 360/10 away from that color;
 * 10 is the total number of colors displayed (2 rows by 5 columns).
 *
 * To apply, add the attribute data-role="colorpalette" to a <div>
 * element inside a page. Alternatively, call colorpalette() on an
 * element.
 *
 * Options:
 *
 *     color: String; initial color can be specified in html
 *            using the data-color="#ff00ff" attribute or
 *            when constructed in javascript, eg :
 *                $("#mycolorpalette").colorpalette({ color: "#ff00ff" });
 *            where the html might be :
 *                <div id="mycolorpalette"></div>
 *            The color can be changed post-construction like this :
 *                $("#mycolorpalette").colorpalette("option", "color", "#ABCDEF");
 *            Default: "#1a8039"
 */
(function( $, undefined ) {

$.widget( "todons.colorpalette", $.todons.colorwidget, {
  options: {
    showPreview: false,
    initSelector: ":jqmData(role='colorpalette')"
  },

  _create: function() {

    var self = this,
        ui = {
          clrpalette: "#colorpalette",
          preview: "#colorpalette-preview",
          previewContainer: "#colorpalette-preview-container"
        };

    ui = $.mobile.todons.loadPrototype("colorpalette", ui);
    this.element.append(ui.clrpalette);

    $.extend(this, {
      ui: ui
    });

    $.todons.colorwidget.prototype._create.call(this);

    ui.clrpalette.find("[data-colorpalette-choice]").bind("vclick", function(e) {
      var clr = $(e.target).css("background-color"),
          Nix,
          nChoices = self.ui.clrpalette.attr("data-n-choices"),
          choiceId, rgbMatches;

      rgbMatches = clr.match(/rgb\(([0-9]*), *([0-9]*), *([0-9]*)\)/);

      if (rgbMatches.length > 3)
        clr = $.mobile.todons.clrlib.RGBToHTML([
          parseInt(rgbMatches[1]) / 255,
          parseInt(rgbMatches[2]) / 255,
          parseInt(rgbMatches[3]) / 255]);

      for (Nix = 0 ; Nix < nChoices ; Nix++)
        ui.clrpalette.find("[data-colorpalette-choice=" + Nix + "]").removeClass("colorpalette-choice-active");

      $(e.target).addClass("colorpalette-choice-active");
      $.todons.colorwidget.prototype._setColor.call(self, clr);
      self.ui.preview.css("background", clr);
    });
  },

  _showPreview: function(show, unconditional) {
    var currentlyVisible = (this.ui.previewContainer.attr("style") != "");

    if (unconditional) {
      if (show)
        this.ui.previewContainer.removeAttr("style");
      else
        this.ui.previewContainer.css("display", "none");
    }
    else {
      if (!show && currentlyVisible)
        this.ui.previewContainer.removeAttr("style");
      else
      if (show && !currentlyVisible)
        this.ui.previewContainer.css("display", "none");
    }
  },

  _setOption: function(key, value, unconditional) {
    if (undefined === unconditional)
      unconditional = false;
    if ("showPreview" === key)
      this._showPreview(value, unconditional);
    else
      $.todons.colorwidget.prototype._setOption.call(this, key, value, unconditional);
  },

  _setColor: function(clr, unconditional) {
    if ($.todons.colorwidget.prototype._setColor.call(this, clr, unconditional)) {
      var Nix,
          activeIdx = -1,
          nChoices = this.ui.clrpalette.attr("data-n-choices"),
          hsl = $.mobile.todons.clrlib.RGBToHSL($.mobile.todons.clrlib.HTMLToRGB(clr)),
          origHue = hsl[0],
          offset = hsl[0] / 36,
          theFloor = Math.floor(offset),
          newClr;

      this.ui.preview.css("background", clr);

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

        this.ui.clrpalette.find("[data-colorpalette-choice=" + Nix + "]").css("background-color", newClr);
      }

      if (activeIdx != -1) {
        var currentlyActive = parseInt(this.ui.clrpalette.find(".colorpalette-choice-active").attr("data-colorpalette-choice"));
        if (currentlyActive != activeIdx) {
          this.ui.clrpalette.find("[data-colorpalette-choice=" + currentlyActive + "]").removeClass("colorpalette-choice-active");
          this.ui.clrpalette.find("[data-colorpalette-choice=" + activeIdx + "]").addClass("colorpalette-choice-active");
        }
      }
    }
  }
});

$(document).bind("pagecreate create", function(e) {
  $($.todons.colorpalette.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .colorpalette();
});

})( jQuery );
