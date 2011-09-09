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

        canvas = clrpicker.find("#colorpicker-canvas"),
        hsSelector = clrpicker.find("#colorpicker-hs-selector"),
        lSelector =  clrpicker.find("#colorpicker-l-selector"),

        scale = Math.min(parseInt(canvas.css("width")), parseInt(canvas.css("height"))) / 256.0,

        hsl = $.mobile.clrlib.RGBToHSL($.mobile.clrlib.HTMLToRGB(o.color));

    hsl[1] = 1.0 - hsl[1];

    canvas[0].width  = parseInt(canvas.css("width"));
    canvas[0].height = parseInt(canvas.css("height"));

    $.extend( self, {
      scale: scale,
      canvas: canvas,
      hsSelector: hsSelector,
      lSelector: lSelector,
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

    
    canvas.bind( "vmousedown", function (event) {
      if (event.offsetY >= 0 && event.offsetY <= 256 * scale) {
        if (event.offsetX >= 0 && event.offsetX <= 256 * scale) {
          self.dragging = true;
          self.draggingHS = true;
        }
        else
        if (event.offsetX >= parseInt(canvas.attr("width")) - 16 && 
            event.offsetX <= parseInt(canvas.attr("width"))) {
          self.dragging = true;
          self.draggingHS = false;
        }
      }
      return self._canvasDownAndMove(self, event);
    });

    canvas.bind( "vmousemove", function (event) {
      if (self.dragging)
        return self._canvasDownAndMove(self, event);
      return false;
    });

    hsSelector.bind( "vmousedown", function (event) {
      self.dragging = true;
      self.draggingHS = true;
      self.selectorDraggingOffset.x = event.offsetX;
      self.selectorDraggingOffset.y = event.offsetY;

      return true;
    });

    lSelector.bind( "vmousedown", function (event) {
      self.dragging = true;
      self.draggingHS = false;
      self.selectorDraggingOffset.x = event.offsetX;
      self.selectorDraggingOffset.y = event.offsetY;

      return true;
    });

    hsSelector.bind( "vmousemove", function (event) {
      var eventHandled = false,
          potential_h = self.dragging_hsl[0] / 360 + (event.offsetX - self.selectorDraggingOffset.x) / (self.scale * 255.0),
          potential_s = self.dragging_hsl[1] + (event.offsetY - self.selectorDraggingOffset.y) / (self.scale * 255.0);

      if (self.dragging) {
        if (potential_h >= 0.0 && potential_h <= 1.0) {
          self.dragging_hsl[0] = potential_h * 360;
          eventHandled = true;
        }
        if (potential_s >= 0.0 && potential_s <= 1.0) {
          self.dragging_hsl[1] = potential_s;
          eventHandled = true;
        }
      }

      if (eventHandled)
        self.updateSelectors(self.dragging_hsl, true);

      return eventHandled;
    });

    lSelector.bind( "vmousemove", function (event) {
      var eventHandled = false,
          potential_l = self.dragging_hsl[2] + (event.offsetY - self.selectorDraggingOffset.y) / (self.scale * 255.0);

      if (self.dragging && !self.draggingHS) {
        if (potential_l >= 0.0 && potential_l <= 1.0) {
          self.dragging_hsl[2] = potential_l;
          eventHandled = true;
        }
      }

      if (eventHandled) {
        self.paintCanvas(self.dragging_hsl);
        self.updateSelectors(self.dragging_hsl);
      }

      return eventHandled;
    });

    canvas.bind( "vmouseup", function (event) {
      self.dragging = false;
      return true;
    });

    hsSelector.bind( "vmouseup", function (event) {
      self.dragging = false;
      return true;
    });

  },

  _canvasDownAndMove: function(self, event) {
    var eventHandled = false;

    if (self.dragging) {
      if (self.draggingHS) {
        var potential_h = event.offsetX / (self.scale * 255.0),
            potential_s = event.offsetY / (self.scale * 255.0),
            hsl;

        if (potential_h >= 0.0 && potential_h <= 1.0) {
          self.dragging_hsl[0] = potential_h * 360;
          eventHandled = true;
        }

        if (potential_s >= 0.0 && potential_s <= 1.0) {
          self.dragging_hsl[1] = potential_s;
          eventHandled = true;
        }

        if (eventHandled) {
          self.updateSelectors(self.dragging_hsl, true);
          self.selectorDraggingOffset.x = Math.ceil(parseInt(self.hsSelector.css("width"))  / 2.0);
          self.selectorDraggingOffset.y = Math.ceil(parseInt(self.hsSelector.css("height")) / 2.0);
        }
      }
      else {
        var potential_l = event.offsetY / (self.scale * 255.0);

        if (potential_l >= 0.0 && potential_l <= 1.0) {
          self.dragging_hsl[2] = potential_l;
          eventHandled = true;
        }

        if (eventHandled) {
          self.paintCanvas(self.dragging_hsl);
          self.updateSelectors(self.dragging_hsl);
          self.selectorDraggingOffset.x = Math.ceil(parseInt(self.lSelector.css("width"))  / 2.0);
          self.selectorDraggingOffset.y = Math.ceil(parseInt(self.lSelector.css("height")) / 2.0);
        }
      }
    }

    return eventHandled;
  },

  paintCanvas: function(hsl) {
    var Nix, Nix1, gray,
        context = this.canvas[0].getContext("2d"),
        n_x_steps = 64, n_y_steps = 64,
        x_step = 256.0 / n_x_steps, y_step = 256.0 / n_y_steps;

    context.mozImageSmoothingEnabled = false;

    context.save();

    context.scale(this.scale, this.scale);

    for (Nix = 0 ; Nix < n_y_steps ; Nix++)
      for (Nix1 = 0 ; Nix1 < n_x_steps ; Nix1++) {
        h = Nix1 / (n_x_steps - 1);
        s = 1.0 - Nix / (n_y_steps - 1);

        rgb = $.mobile.clrlib.HSLToRGB([h * 360, s, hsl[2]]).map(this.normalizeValue);

        context.fillStyle = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
        context.fillRect(Nix1 * x_step, Nix * y_step, x_step, y_step);
      }

    for (Nix = 0 ; Nix < n_y_steps ; Nix++) {
      gray = this.normalizeValue(Nix / (n_y_steps - 1));
      context.fillStyle = "rgb(" + gray + ", " + gray + ", " + gray + ")";
      context.strokeStyle = "rgb(" + gray + ", " + gray + ", " + gray + ")";
      context.fillRect((this.canvas[0].width - 16) / this.scale, Nix * y_step, 16, y_step);
      context.strokeRect((this.canvas[0].width - 16) / this.scale, Nix * y_step, 16, y_step);
    }

    context.restore();
  },

  makeClrChannel: function(val) {
    return (val < 16 ? "0" : "") + (val & 0xff).toString(16);
  },

  updateSelectors: function(hsl, updateHS) {
    var clr = "#" +
          $.mobile.clrlib.HSLToRGB([hsl[0], 1.0 - hsl[1], hsl[2]])
            .map(this.normalizeValue)
            .map(this.makeClrChannel)
            .join(""),
        gray = this.makeClrChannel(this.normalizeValue(hsl[2]));

    this.hsSelector.css("left", hsl[0] / 360 * this.scale * 256.0);
    this.hsSelector.css("top",  hsl[1] * this.scale * 256.0);
    this.hsSelector.css("background", clr);

    this.lSelector.css("left",  this.canvas[0].width - 8);
    this.lSelector.css("top",   hsl[2] * this.scale * 256.0);
    this.lSelector.css("background",  "#" + gray + gray + gray);

    this.element.attr("data-color", clr);
    this.element.triggerHandler('colorchanged', clr);
  },

  refresh: function() {
    this.paintCanvas(this.dragging_hsl);
    this.updateSelectors(this.dragging_hsl);
  },

  setColor: function(clr) {
    if (clr.match(/#[0-9A-Fa-f]{6}/) && this.element.attr("data-color") != clr) {
      var newHSL = $.mobile.clrlib.RGBToHSL($.mobile.clrlib.HTMLToRGB(clr));

      if (!(newHSL[0] == this.dragging_hsl[0] &&
            newHSL[1] == this.dragging_hsl[1] &&
            newHSL[2] == this.dragging_hsl[2])) {

        this.dragging_hsl = newHSL;
        this.dragging_hsl[1] = 1.0 - this.dragging_hsl[1];
        this.refresh();
      }
    }
  },

  normalizeValue: function (val) {
    var
      ret = val * 255.0,
      ret_floor = Math.floor(ret);

    if (ret - ret_floor > 0.5) ret_floor++;

    return ret_floor;
  }

});

$(document).bind("pagecreate create", function(e) {
  $($.mobile.colorpicker.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .colorpicker();
});

})(jQuery);
