/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Gabriel Schulhof
 */

/*
 * Displays three sliders that allow the user to select the
 * hue, saturation, and value for a color.
 *
 * To apply, add the attribute data-role="hsvpicker" to a <div>
 * element inside a page. Alternatively, call hsvpicker() 
 * on an element (see below).
 *
 * Options:
 *
 *     color: String; the initial color can be specified in html using the
 *            data-color="#ff00ff" attribute or when constructed
 *            in javascript, eg
 *                $("#myhsvpicker").hsvpicker({ color: "#ff00ff" });
 *            where the html might be :
 *                <div id="myhsvpicker"></div>
 *            The color can be changed post-construction like this :
 *                $("#myhsvpicker").hsvpicker("option", "color", "#ABCDEF");
 *            Default: "#1a8039"
 *
 * Events:
 *
 *     colorchanged: Fired when the color is changed.
 */
(function( $, undefined ) {

$.widget( "todons.hsvpicker", $.todons.colorwidget, {
  options: {
    initSelector: ":jqmData(role='hsvpicker')"
  },

  _create: function() {
    var self = this,
        ui = {
          container: "#hsvpicker",
          hue: {
            container: "#hsvpicker-hue-masks-container",
            selector:  "#hsvpicker-hue-selector",
            hue:       "#hsvpicker-hue-hue",
            valMask:   "#hsvpicker-hue-mask-val"
          },
          sat: {
            container: "#hsvpicker-sat-masks-container",
            selector:  "#hsvpicker-sat-selector",
            hue:       "#hsvpicker-sat-hue",
            valMask:   "#hsvpicker-sat-mask-val"
          },
          val: {
            container: "#hsvpicker-val-masks-container",
            selector:  "#hsvpicker-val-selector",
            hue:       "#hsvpicker-val-hue"
          }
        };

    $.mobile.todons.loadPrototype("hsvpicker", ui);
    this.element.append(ui.container);

    $.extend(self, {
      ui: ui,
      dragging_hsv: [ 0, 0, 0],
      selectorDraggingOffset: {
        x : -1,
        y : -1
      },
      dragging: -1
    });

    $.todons.colorwidget.prototype._create.call(this);

    ui.container.find(".hsvpicker-arrow-btn")
      .bind("mousedown vmousedown", function(e) {
        self._setArrowImg($(this), "_press");
      })
      .bind("vmouseup", function(e) {
        var chan = $(this).attr("data-target"),
            hsvIdx = ("hue" === chan) ? 0 :
                     ("sat" === chan) ? 1 : 2,
            max = (0 == hsvIdx ? 360 : 1),
            step = 0.05 * max;

        self._setArrowImg($(this), "");
        self.dragging_hsv[hsvIdx] = self.dragging_hsv[hsvIdx] + step * ("left" === $(this).attr("data-location") ? -1 : 1);
        self.dragging_hsv[hsvIdx] = Math.min(max, Math.max(0.0, self.dragging_hsv[hsvIdx]));
        self._updateSelectors(self.dragging_hsv);
      });

    $( document )
      .bind( "vmousemove", function( event ) {
        if ( self.dragging != -1 ) {
          event.stopPropagation();
          event.preventDefault();
        }
      })
      .bind( "vmouseup", function( event ) {
        self.dragging = -1;
        ui.container.find(".hsvpicker-arrow-btn").each(function() {self._setArrowImg($(this), "");});
      });

    this._bindElements("hue", 0);
    this._bindElements("sat", 1);
    this._bindElements("val", 2);
  },

  _bindElements: function(chan, idx) {
    var self = this;
    this.ui[chan].selector
      .bind("mousedown vmousedown", function(e) { self._selectorMouseDown(chan,  idx, e); })
      .bind("vmousemove",           function(e) { self._selectorMouseMove(chan,  idx, e); })
      .bind("vmouseup",             function(e) { self.dragging = -1; });
    this.ui[chan].container
      .bind("mousedown vmousedown", function(e) { self._containerMouseDown(chan, idx, e); })
      .bind("vmousemove",           function(e) { self._containerMouseMove(chan, idx, e); })
      .bind("vmouseup",             function(e) { self.dragging = -1; });
  },

  _setArrowImg: function(arrowImg, suffix) {
    arrowImg.attr("src",
      this.ui.container.attr("data-arrow-btn-imageTemplate")
        .replace("%1", arrowImg.attr("data-location"))
        .replace("%2", suffix));
  },

  _containerMouseDown: function(chan, idx, e) {
    if (event.offsetX >= 0 && event.offsetX <= this.ui[chan].container.width() &&
        event.offsetY >= 0 && event.offsetY <= this.ui[chan].container.height()) {
      this.dragging = idx;
      this._containerMouseMove(chan, idx, e);
    }
  },

  _containerMouseMove: function(chan, idx, e) {
    if (this.dragging === idx) {
      var potential = event.offsetX / this.ui[chan].container.width();

      potential = Math.min(1.0, Math.max(0.0, potential));
      if (0 === idx)
        potential *= 360;

      this.dragging_hsv[idx] = potential;

      this.selectorDraggingOffset.x = Math.ceil(this.ui[chan].selector.outerWidth()  / 2.0);
      this.selectorDraggingOffset.y = Math.ceil(this.ui[chan].selector.outerHeight() / 2.0);
      this._updateSelectors(this.dragging_hsv);
      e.stopPropagation();
      e.preventDefault();
    }
  },

  _selectorMouseDown: function(chan, idx, e) {
    this.dragging = idx;
    this.selectorDraggingOffset.x = event.offsetX;
    this.selectorDraggingOffset.y = event.offsetY;
    e.stopPropagation();
    e.preventDefault();
  },

  _selectorMouseMove: function(chan, idx, e) {
    if (this.dragging === idx) {
      var potential = this.dragging_hsv[idx];

      if (0 === idx)
        potential /= 360;

      potential += (event.offsetX - this.selectorDraggingOffset.x) / this.ui[chan].container.width();
      potential = Math.min(1.0, Math.max(0.0, potential));

      if (0 === idx)
        potential *= 360;

      this.dragging_hsv[idx] = potential;
      this._updateSelectors(this.dragging_hsv);

      e.stopPropagation();
      e.preventDefault();
    }
  },

  _updateSelectors: function(hsv) {
    var  clr = $.mobile.todons.clrlib.RGBToHTML($.mobile.todons.clrlib.HSVToRGB(hsv)),
        hclr = $.mobile.todons.clrlib.RGBToHTML($.mobile.todons.clrlib.HSVToRGB([hsv[0], 1.0, 1.0])),
        vclr = $.mobile.todons.clrlib.RGBToHTML($.mobile.todons.clrlib.HSVToRGB([hsv[0], hsv[1], 1.0]));

    this.ui.hue.selector.css("left", this.ui.hue.container.width() * hsv[0] / 360);
    this.ui.hue.selector.css("background", clr);
    this.ui.hue.hue.css("opacity", hsv[1]);
    this.ui.hue.valMask.css("opacity", 1.0 - hsv[2]);

    this.ui.sat.selector.css("left", this.ui.sat.container.width() * hsv[1]);
    this.ui.sat.selector.css("background", clr);
    this.ui.sat.hue.css("background", hclr);
    this.ui.sat.valMask.css("opacity", 1.0 - hsv[2]);

    this.ui.val.selector.css("left", this.ui.val.container.width() * hsv[2]);
    this.ui.val.selector.css("background", clr);
    this.ui.val.hue.css("background", vclr);

    $.todons.colorwidget.prototype._setColor.call(this, clr);
  },

  _setColor: function(clr, unconditional) {
    if ($.todons.colorwidget.prototype._setColor.call(this, clr, unconditional)) {
      this.dragging_hsv = $.mobile.todons.clrlib.RGBToHSV($.mobile.todons.clrlib.HTMLToRGB(clr));
      this._updateSelectors(this.dragging_hsv);
    }
  }
});

$(document).bind("pagecreate create", function(e) {
  $($.todons.hsvpicker.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .hsvpicker();
});

})(jQuery);
