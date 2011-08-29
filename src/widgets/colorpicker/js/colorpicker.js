(function( $, undefined ) {

$.widget( "mobile.colorpicker", $.mobile.widget, {
  options: {
    color: "#1a8039",
    initSelector: ":jqmData(role='colorpicker')"
  },

  _create: function() {
    var self = this,
        o = this.options,
        elem = this.element
          /*.wrap("<div class='ui-colorpicker'/>")*/
          .addClass("ui-colorpicker"),
        elemID = elem.attr("id"),

        canvasContainer = $("<div>", {"class" : "ui-colorpicker-canvas-border"})
          .appendTo(elem),

        canvas = $("<canvas>", {"class" : "ui-colorpicker-canvas" })
          .text("colorpicker canvas")
          .appendTo(canvasContainer),
        hsSelector = $("<div>", {"class": "ui-colorpicker-canvas-selector ui-corner-all" })
          .appendTo(canvasContainer),
        lSelector =  $("<div>", {"class": "ui-colorpicker-canvas-selector ui-corner-all" })
          .appendTo(canvasContainer),
        scale = Math.min(parseInt(canvas.css("width")), parseInt(canvas.css("height"))) / 256.0,
        hsl = this.getHSL(o.color),
        canvasCX = parseInt(canvas.css("width")),
        canvasCY = parseInt(canvas.css("height"));

      canvas[0].width  = canvasCX;
      canvas[0].height = canvasCY;

      console.log("colorpicker._create: Setting [w x h] = [" + canvasCX + " x " + canvasCY + "]");

      canvas.attr("width", canvasCX);
      canvas.attr("height", canvasCY);

      console.log("colorpicker._create: Setting elem [w x h] = [" + canvasContainer.outerWidth() + " x " + canvasContainer.outerHeight() + "]");

      elem.attr("width", canvasContainer.outerWidth());
      elem.attr("height", canvasContainer.outerHeight());

    $.extend( self, {
      scale: scale,
      colour: o.color,
      elem: elem,
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
          potential_h = self.dragging_hsl[0] + (event.offsetX - self.selectorDraggingOffset.x) / (self.scale * 255.0),
          potential_s = self.dragging_hsl[1] + (event.offsetY - self.selectorDraggingOffset.y) / (self.scale * 255.0);

      if (self.dragging) {
        if (potential_h >= 0.0 && potential_h <= 1.0) {
          self.dragging_hsl[0] = potential_h;
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
          self.dragging_hsl[0] = potential_h;
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

  getHSL: function(str) {
    var rgb_str = (('#' == str.charAt(0)) ? str.substring(1) : str),
        rgb = [ rgb_str.substring(0, 2), rgb_str.substring(2, 4), rgb_str.substring(4, 6)]
          .map(function(val) { return parseInt(val, 16) / 255.0; });

    return this.RGBToHSL(rgb[0], rgb[1], rgb[2]);
  },

  paintCanvas: function(hsl) {
    var Nix, Nix1, g,
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

        rgb = this.HSLToRGB(h, s, hsl[2]).map(this.normalizeValue);

        context.fillStyle = "rgba(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ", 1.0)";
        context.fillRect(Nix1 * x_step, Nix * y_step, x_step, y_step);
      }

    for (Nix = 0 ; Nix < n_y_steps ; Nix++) {
      g = this.normalizeValue(Nix / (n_y_steps - 1));
      context.fillStyle = "rgba(" + g + ", " + g + ", " + g + ", 1.0)";
      context.strokeStyle = "rgba(" + g + ", " + g + ", " + g + ", 1.0)";
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
          this.HSLToRGB(hsl[0], 1.0 - hsl[1], hsl[2])
            .map(this.normalizeValue)
            .map(this.makeClrChannel)
            .join(""),
        gray = this.makeClrChannel(this.normalizeValue(hsl[2]));

    this.hsSelector.css("left", hsl[0] * this.scale * 256.0);
    this.hsSelector.css("top",  hsl[1] * this.scale * 256.0);
    this.hsSelector.css("background", clr);

    this.lSelector.css("left",  this.canvas[0].width - 8);
    this.lSelector.css("top",   hsl[2] * this.scale * 256.0);
    this.lSelector.css("background",  "#" + gray + gray + gray);

    this.element.triggerHandler('colorchanged', clr);
  },

  refresh: function() {
    this.paintCanvas(this.dragging_hsl);
    this.updateSelectors(this.dragging_hsl);
  },

  normalizeValue: function (val) {
    var
      ret = val * 255.0,
      ret_floor = Math.floor(ret);

    if (ret - ret_floor > 0.5) ret_floor++;

    return ret_floor;
  },

  HSLToRGB: function(h, s, l) {
    var PI = 3.141592653589793115997963468544;
    var r, g, b;

    r = 0.0 + Math.max (0.0, Math.min (1.0, (0.5 + Math.cos (PI / 180.0 * ( 0.0 + h * 360.0))))) ;
    g = 1.0 - Math.max (0.0, Math.min (1.0, (0.5 + Math.cos (PI / 180.0 * (60.0 + h * 360.0))))) ;
    b = 1.0 - Math.max (0.0, Math.min (1.0, (0.5 + Math.cos (PI / 180.0 * (60.0 - h * 360.0))))) ;

    r = l + (r - l) * s ;
    g = l + (g - l) * s ;
    b = l + (b - l) * s ;

    r += (l - 0.5) * 2.0 * (l < 0.5 ? r : (1.0 - r)) ;
    g += (l - 0.5) * 2.0 * (l < 0.5 ? g : (1.0 - g)) ;
    b += (l - 0.5) * 2.0 * (l < 0.5 ? b : (1.0 - b)) ;

    return [ r, g, b ];
  },

  RGBToHSL: function(r, g, b) {
    var
      h = 0, s = 1.0, l = 0.5,
      r_dist, g_dist, b_dist,
      fMax, fMin;

    fMax = Math.max (r, Math.max (g, b)) ;
    fMin = Math.min (r, Math.min (g, b)) ;

    l = (fMax + fMin) / 2 ;
    if (fMax - fMin <= 0.00001) {
      h = 0 ;
      s = 0 ;
    }
    else {
      s = (fMax - fMin) / ((l < 0.5) ? (fMax + fMin) : (2 - fMax - fMin)) ;

      r_dist = (fMax - r) / (fMax - fMin) ;
      g_dist = (fMax - g) / (fMax - fMin) ;
      b_dist = (fMax - b) / (fMax - fMin) ;

      if (r == fMax)
        h = b_dist - g_dist ;
      else
      if (g == fMax)
        h = 2 + r_dist - b_dist ;
      else
      if (b == fMax)
        h = 4 + g_dist - r_dist ;

      h *= 60 ;

      if (h < 0)
        h += 360 ;
    }

    return [ h / 360.0, s, l ];
  }

});

$(document).bind("pagecreate create", function(e) {
  $($.mobile.colorpicker.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .colorpicker();
});

})(jQuery);
