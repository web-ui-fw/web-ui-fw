/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Gabriel Schulhof
 */

/**
 * Displays a 2D hue/saturation spectrum and a lightness slider.
 *
 * To apply, add the attribute data-role="colorpicker" to a <div>
 * element inside a page. Alternatively, call colorpicker() 
 * on an element (see below).
 *
 * Options:
 *     color: String; can be specified in html using the
 *            data-color="#ff00ff" attribute or when constructed
 *                $("#mycolorpicker").colorpicker({ color: "#ff00ff" });
 *            where the html might be :
 *                <div id="mycolorpicker"/>
 */
(function( $, undefined ) {

$.widget( "todons.colorpicker", $.todons.colorwidget, {
  options: {
      initSelector: ":jqmData(role='colorpicker')"
  },

  _create: function() {
    var self = this,
        ui = {
            clrpicker: "#colorpicker",
            hs: {
                container: "#colorpicker-hs-container",
                valMask:   "#colorpicker-hs-val-mask",
                selector:  "#colorpicker-hs-selector"
            },
            l: {
                container: "#colorpicker-l-container",
                selector:  "#colorpicker-l-selector"
            }
        };

    ui = $.mobile.todons.loadPrototype("colorpicker", ui);
    this.element.append(ui.clrpicker);

    $.extend( self, {
      ui: ui,
      dragging: false,
      draggingHS: false,
      selectorDraggingOffset: {
          x : -1,
          y : -1
      },
      dragging_hsl: undefined
    });

    $.todons.colorwidget.prototype._create.call(this);

    $( document ).bind( "vmousemove", function( event ) {
      if ( self.dragging )
        event.stopPropagation();
    });

    $( document ).bind( "vmouseup", function( event ) {
      if ( self.dragging )
        self.dragging = false;
    });

    ui.hs.container.bind( "vmousedown mousedown", function (event) {
      self._canvasMouseDown(event, "hs");
    });

    ui.l.container.bind( "vmousedown mousedown", function (event) {
      self._canvasMouseDown(event, "l");
    });

    ui.hs.container.bind( "vmousemove", function (event) {
      if (self.dragging && self.draggingHS)
        self._canvasMouseMove(event, "hs");
    });

    ui.l.container.bind( "vmousemove", function (event) {
      if (self.dragging && !self.draggingHS)
        self._canvasMouseMove(event, "l");
    });

    ui.hs.selector.bind( "vmousedown mousedown", function (event) {
      self.dragging = true;
      self.draggingHS = true;
      self.selectorDraggingOffset.x = event.offsetX;
      self.selectorDraggingOffset.y = event.offsetY;

      event.stopPropagation();
    });

    ui.l.selector.bind( "vmousedown mousedown", function (event) {
      self.dragging = true;
      self.draggingHS = false;
      self.selectorDraggingOffset.x = event.offsetX;
      self.selectorDraggingOffset.y = event.offsetY;

      event.stopPropagation();
    });

    ui.hs.selector.bind( "vmousemove", function (event) {
      if (self.dragging && self.draggingHS) {
        var potential_h = self.dragging_hsl[0] / 360 + (event.offsetX - self.selectorDraggingOffset.x) / self.ui.hs.container.width(),
            potential_s = self.dragging_hsl[1] + (event.offsetY - self.selectorDraggingOffset.y) / self.ui.hs.container.height();

        potential_h = Math.min(1.0, Math.max(0.0, potential_h));
        potential_s = Math.min(1.0, Math.max(0.0, potential_s));

        self.dragging_hsl[0] = potential_h * 360;
        self.dragging_hsl[1] = potential_s;
        self._updateSelectors(self.dragging_hsl, true);

        event.stopPropagation();
      }
    });

    ui.l.selector.bind( "vmousemove", function (event) {
      if (self.dragging && !self.draggingHS) {
        var potential_l = self.dragging_hsl[2] + (event.offsetY - self.selectorDraggingOffset.y) / self.ui.l.container.height();

        potential_l = Math.min(1.0, Math.max(0.0, potential_l));

        self.dragging_hsl[2] = potential_l;
        self._updateSelectors(self.dragging_hsl);

        event.stopPropagation();
      }
    });

    ui.hs.container.bind( "vmouseup", function (event) {
      self.dragging = false;
      event.stopPropagation();
    });

    ui.hs.selector.bind( "vmouseup", function (event) {
      self.dragging = false;
      event.stopPropagation();
    });
  },

  _canvasMouseDown: function(event, containerStr) {
    if (event.offsetX >= 0 && event.offsetX <= this.ui[containerStr].container.width() &&
        event.offsetY >= 0 && event.offsetY <= this.ui[containerStr].container.height()) {
      this.dragging = true;
      this.draggingHS = ("hs" === containerStr);
      this._canvasMouseMove(event, containerStr);
      event.stopPropagation();
    }
  },

  _canvasMouseMove: function(event, containerStr) {
    if (this.dragging) {
      if (this.draggingHS) {
        var potential_h = event.offsetX / this.ui.hs.container.width(),
            potential_s = event.offsetY / this.ui.hs.container.height();

        potential_h = Math.min(1.0, Math.max(0.0, potential_h));
        potential_s = Math.min(1.0, Math.max(0.0, potential_s));

        this.dragging_hsl[0] = potential_h * 360;
        this.dragging_hsl[1] = potential_s;
      }
      else {
        var potential_l = event.offsetY / this.ui.l.container.height();

        potential_l = Math.min(1.0, Math.max(0.0, potential_l));
        this.dragging_hsl[2] = potential_l;
      }

      this.selectorDraggingOffset.x = Math.ceil(this.ui[containerStr].selector.outerWidth()  / 2.0);
      this.selectorDraggingOffset.y = Math.ceil(this.ui[containerStr].selector.outerHeight() / 2.0);
      this._updateSelectors(this.dragging_hsl, true);
      event.stopPropagation();
    }
  },

  _updateSelectors: function(hsl, updateHS) {
    var clr = $.mobile.todons.clrlib.RGBToHTML($.mobile.todons.clrlib.HSLToRGB([hsl[0], 1.0 - hsl[1], hsl[2]])),
        gray = $.mobile.todons.clrlib.RGBToHTML([hsl[2], hsl[2], hsl[2]]);

    if (hsl[2] < 0.5) {
      this.ui.hs.valMask.css("background", "#000000");
      this.ui.hs.valMask.css("opacity", 1.0 - hsl[2] * 2.0);
    }
    else {
      this.ui.hs.valMask.css("background", "#ffffff");
      this.ui.hs.valMask.css("opacity", (hsl[2] - 0.5) * 2.0);
    }

    this.ui.hs.selector.css("left", hsl[0] / 360 * this.ui.hs.container.width());
    this.ui.hs.selector.css("top",  hsl[1] * this.ui.hs.container.height());
    this.ui.hs.selector.css("background", clr);

    this.ui.l.selector.css("top",   hsl[2] * this.ui.l.container.height());
    this.ui.l.selector.css("background",  gray);

    $.todons.colorwidget.prototype._setColor.call(this, clr);
  },

  _setColor: function(clr, unconditional) {
    if ($.todons.colorwidget.prototype._setColor.call(this, clr, unconditional)) {
      this.dragging_hsl = $.mobile.todons.clrlib.RGBToHSL($.mobile.todons.clrlib.HTMLToRGB(clr));
      this.dragging_hsl[1] = 1.0 - this.dragging_hsl[1];
      this._updateSelectors(this.dragging_hsl);
    }
  }
});

$(document).bind("pagecreate create", function(e) {
  $($.todons.colorpicker.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .colorpicker();
});

})(jQuery);
