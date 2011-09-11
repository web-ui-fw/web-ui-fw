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

    /* Only necessary because of lesscss shortcomings */
    clrpicker.css("width", ui.hs.container.outerWidth() + ui.l.container.outerWidth());
    clrpicker.css("height", Math.max(ui.hs.container.outerHeight(), ui.l.container.outerHeight()));

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
        return false;
      }
    });

    $( document ).bind( "vmouseup", function( event ) {
      if ( self.dragging ) {
        self.dragging = false;
//            self.refresh( event );
        return false;
      }
    });

    ui.hs.container.bind( "vmousedown", function (event) {
      console.log("ui.hs.container.vmousedown");
      self._canvasMouseDown(self, event, ui.hs.container);
      self._canvasDownAndMove(self, event);
    });

    ui.l.container.bind( "vmousedown", function (event) {
      console.log("ui.hs.container.vmousedown");
      self._canvasMouseDown(self, event, ui.l.container);
      self._canvasDownAndMove(self, event);
    });

    ui.hs.container.bind( "vmousemove", function (event) {
      if (self.dragging && self.draggingHS) {
        console.log("ui.hs.container.vmousemove");
        self._canvasDownAndMove(self, event);
      }
    });

    ui.l.container.bind( "vmousemove", function (event) {
      if (self.dragging && !self.draggingHS) {
        console.log("ui.l.container.vmousemove");
        self._canvasDownAndMove(self, event);
      }
    });

    ui.hs.selector.bind( "vmousedown", function (event) {
      console.log("ui.hs.selector.vmousedown");
      self.dragging = true;
      self.draggingHS = true;
      self.selectorDraggingOffset.x = event.offsetX;
      self.selectorDraggingOffset.y = event.offsetY;

      event.stopPropagation();
    });

    ui.l.selector.bind( "vmousedown", function (event) {
      console.log("ui.l.selector.vmousedown");
      self.dragging = true;
      self.draggingHS = false;
      self.selectorDraggingOffset.x = event.offsetX;
      self.selectorDraggingOffset.y = event.offsetY;

      event.stopPropagation();
    });

    ui.hs.selector.bind( "vmousemove", function (event) {
      if (self.dragging && self.draggingHS) {
        console.log("ui.hs.selector.vmousemove");

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
        console.log("ui.l.selector.vmousemove");

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

  _canvasMouseDown: function(self, event, container) {
    if (event.offsetY >= 0 && event.offsetY <= container.height()) {
      if (event.offsetX >= 0 && event.offsetX <= container.width()) {
        self.dragging = true;
        self.draggingHS = (container === this.ui.hs.container);
      }
    }
  },

  _canvasDownAndMove: function(self, event) {
    if (self.dragging) {
      if (self.draggingHS) {
        var potential_h = event.offsetX / self.ui.hs.container.width(),
            potential_s = event.offsetY / self.ui.hs.container.height(),
            hsl;

        potential_h = Math.min(1.0, Math.max(0.0, potential_h));
        potential_s = Math.min(1.0, Math.max(0.0, potential_s));

        self.dragging_hsl[0] = potential_h * 360;
        self.dragging_hsl[1] = potential_s;

        self.updateSelectors(self.dragging_hsl, true);
        self.selectorDraggingOffset.x = Math.ceil(parseInt(self.ui.hs.selector.width())  / 2.0);
        self.selectorDraggingOffset.y = Math.ceil(parseInt(self.ui.hs.selector.height()) / 2.0);

        event.stopPropagation();
      }
      else {
        var potential_l = event.offsetY / this.ui.l.container.height();

        potential_l = Math.min(1.0, Math.max(0.0, potential_l));
        self.dragging_hsl[2] = potential_l;

        self.updateSelectors(self.dragging_hsl);
        self.selectorDraggingOffset.x = Math.ceil(parseInt(self.ui.l.selector.width())  / 2.0);
        self.selectorDraggingOffset.y = Math.ceil(parseInt(self.ui.l.selector.height()) / 2.0);

        event.stopPropagation();
      }
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
