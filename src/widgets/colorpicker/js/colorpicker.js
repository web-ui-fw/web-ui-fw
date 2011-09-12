(function( $, undefined ) {

$.widget( "mobile.colorpicker", $.mobile.widget, {
  options: {
    color: "#1a8039",
    initSelector: ":jqmData(role='colorpicker')"
  },

  _create: function() {
    var self = this,

        o = this.options,

        clrpicker = $.mobile.loadPrototype("colorpicker").find("#colorpicker")
          .appendTo(this.element),

        ui = {
          hs: {
            container: clrpicker.find("#colorpicker-hs-container"),
            valMask:   clrpicker.find("#colorpicker-hs-val-mask"),
            selector:  clrpicker.find("#colorpicker-hs-selector")
          },
          l: {
            container: clrpicker.find("#colorpicker-l-container"),
            selector:  clrpicker.find("#colorpicker-l-selector")
          }
        },

        hsl = $.mobile.clrlib.RGBToHSL($.mobile.clrlib.HTMLToRGB(o.color));

    $.extend( self, {
      ui: ui,
      dragging: false,
      draggingHS: false,
      selectorDraggingOffset: {
        x : -1,
        y : -1
      },
      dragging_hsl: hsl
    });

    self.refresh();

    $( document ).bind( "vmousemove", function( event ) {
      if ( self.dragging ) {
//            self.refresh( event );
        event.stopPropagation();
      }
    });

    $( document ).bind( "vmouseup", function( event ) {
      if ( self.dragging ) {
        self.dragging = false;
//            self.refresh( event );
      }
    });

    ui.hs.container.bind( "vmousedown", function (event) {
      self._canvasMouseDown(event, "hs");
    });

    ui.l.container.bind( "vmousedown", function (event) {
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

    ui.hs.selector.bind( "vmousedown", function (event) {
      self.dragging = true;
      self.draggingHS = true;
      self.selectorDraggingOffset.x = event.offsetX;
      self.selectorDraggingOffset.y = event.offsetY;

      event.stopPropagation();
    });

    ui.l.selector.bind( "vmousedown", function (event) {
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
        self.updateSelectors(self.dragging_hsl, true);

        event.stopPropagation();
      }
    });

    ui.l.selector.bind( "vmousemove", function (event) {
      if (self.dragging && !self.draggingHS) {
        var potential_l = self.dragging_hsl[2] + (event.offsetY - self.selectorDraggingOffset.y) / self.ui.l.container.height();

        potential_l = Math.min(1.0, Math.max(0.0, potential_l));

        self.dragging_hsl[2] = potential_l;
        self.updateSelectors(self.dragging_hsl);

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
      this.updateSelectors(this.dragging_hsl, true);
      event.stopPropagation();
    }
  },

  updateSelectors: function(hsl, updateHS) {
    var clr = $.mobile.clrlib.RGBToHTML($.mobile.clrlib.HSLToRGB([hsl[0], 1.0 - hsl[1], hsl[2]])),
        gray = $.mobile.clrlib.RGBToHTML([hsl[2], hsl[2], hsl[2]]);

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

    this.element.attr("data-color", clr);
    this.element.triggerHandler('colorchanged', clr);
  },

  refresh: function() {
    this.updateSelectors(this.dragging_hsl);
  },

  setColor: function(clr) {
    if (clr.match(/#[0-9A-Fa-f]{6}/) && this.element.attr("data-color") != clr) {
      this.dragging_hsl = $.mobile.clrlib.RGBToHSL($.mobile.clrlib.HTMLToRGB(clr));
      this.dragging_hsl[1] = 1.0 - this.dragging_hsl[1];
      this.refresh();
    }
  }
});

$(document).bind("pagecreate create", function(e) {
  $($.mobile.colorpicker.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .colorpicker();
});

})(jQuery);
