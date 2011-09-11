(function( $, undefined ) {

$.widget( "mobile.hsvpicker", $.mobile.widget, {
  options: {
    color: "#1a8039",
    initSelector: ":jqmData(role='hsvpicker')"
  },

  _create: function() {
    var self = this,
        o = this.options,
        myProto = $.mobile.loadPrototype("hsvpicker").find("#hsvpicker")
          .appendTo(this.element),
        ui = {
          hue: {
            masks:    myProto.find("#hsvpicker-hue-masks-container"),
            selector: myProto.find("#hsvpicker-hue-selector"),
            hue:      myProto.find("#hsvpicker-hue-hue"),
            valMask:  myProto.find("#hsvpicker-hue-mask-val")
          },
          sat: {
            masks:    myProto.find("#hsvpicker-sat-masks-container"),
            selector: myProto.find("#hsvpicker-sat-selector"),
            hue:      myProto.find("#hsvpicker-sat-hue"),
            valMask:  myProto.find("#hsvpicker-sat-mask-val")
          },
          val: {
            masks:    myProto.find("#hsvpicker-val-masks-container"),
            selector: myProto.find("#hsvpicker-val-selector"),
            hue:      myProto.find("#hsvpicker-val-hue")
          }
        };

    $.extend(self, {
      ui: ui,
      dragging_hsv: [ 0, 0, 0],
      selectorDraggingOffset: {
        x : -1,
        y : -1
      },
      dragging: -1
    });

    this.setColor(o.color);

    myProto.find(".hsvpicker-arrow-btn").bind("vmousedown", function(e) {
      $(this).attr("src",
        myProto.attr("data-arrow-btn-imageTemplate")
          .replace("%1", $(this).attr("data-location"))
          .replace("%2", "_press"));
    });

    myProto.find(".hsvpicker-arrow-btn").bind("vmouseup", function(e) {
      var chan = $(this).attr("data-target"),
          hsvIdx = ("hue" === chan) ? 0 :
                   ("sat" === chan) ? 1 : 2,
          max = (0 == hsvIdx ? 360 : 1),
          step = 0.05 * max;

      $(this).attr("src",
        myProto.attr("data-arrow-btn-imageTemplate")
          .replace("%1", $(this).attr("data-location"))
          .replace("%2", ""));

      self.dragging_hsv[hsvIdx] = self.dragging_hsv[hsvIdx] + step * ("left" === $(this).attr("data-location") ? -1 : 1);
      self.dragging_hsv[hsvIdx] = Math.min(max, Math.max(0.0, self.dragging_hsv[hsvIdx]));
      self.refresh();
    });

    ui.hue.selector.bind("vmousedown", function(e) { self.selectorMouseDown("hue", 0, e); });
    ui.sat.selector.bind("vmousedown", function(e) { self.selectorMouseDown("sat", 1, e); });
    ui.val.selector.bind("vmousedown", function(e) { self.selectorMouseDown("val", 2, e); });

    ui.hue.selector.bind("vmousemove", function(e) { self.selectorMouseMove("hue", 0, e); });
    ui.sat.selector.bind("vmousemove", function(e) { self.selectorMouseMove("sat", 1, e); });
    ui.val.selector.bind("vmousemove", function(e) { self.selectorMouseMove("val", 2, e); });

    ui.hue.selector.bind("vmouseup", function(e) { self.dragging = -1; });
    ui.sat.selector.bind("vmouseup", function(e) { self.dragging = -1; });
    ui.val.selector.bind("vmouseup", function(e) { self.dragging = -1; });
  },

  selectorMouseDown: function(chan, idx, e) {
    this.dragging = idx;
    this.selectorDraggingOffset.x = event.offsetX;
    this.selectorDraggingOffset.y = event.offsetY;
    e.stopPropagation();
  },

  selectorMouseMove: function(chan, idx, e) {
    if (this.dragging === idx) {
      var potential = this.dragging_hsv[idx];

      if (0 === idx)
        potential /= 360;

      potential += (event.offsetX - this.selectorDraggingOffset.x) / this.ui[chan].masks.width();
      potential = Math.min(1.0, Math.max(0.0, potential));

      if (0 === idx)
        potential *= 360;

      this.dragging_hsv[idx] = potential;
      this.updateSelectors(this.dragging_hsv);

      e.stopPropagation();
    }
  },

  updateSelectors: function(hsv) {
    var  clr = $.mobile.clrlib.RGBToHTML($.mobile.clrlib.HSVToRGB(hsv)),
        hclr = $.mobile.clrlib.RGBToHTML($.mobile.clrlib.HSVToRGB([hsv[0], 1.0, 1.0])),
        vclr = $.mobile.clrlib.RGBToHTML($.mobile.clrlib.HSVToRGB([hsv[0], hsv[1], 1.0]));

    this.ui.hue.selector.css("left", this.ui.hue.masks.width() * hsv[0] / 360);
    this.ui.hue.selector.css("background", clr);
    this.ui.hue.hue.css("opacity", hsv[1]);
    this.ui.hue.valMask.css("opacity", 1.0 - hsv[2]);

    this.ui.sat.selector.css("left", this.ui.sat.masks.width() * hsv[1]);
    this.ui.sat.selector.css("background", clr);
    this.ui.sat.hue.css("background", hclr);
    this.ui.sat.valMask.css("opacity", 1.0 - hsv[2]);

    this.ui.val.selector.css("left", this.ui.val.masks.width() * hsv[2]);
    this.ui.val.selector.css("background", clr);
    this.ui.val.hue.css("background", vclr);

    this.element.attr("data-color", clr);
    this.element.triggerHandler('colorchanged', clr);
  },

  refresh: function() {
    this.updateSelectors(this.dragging_hsv);
  },

  setColor: function(clr) {
    if (clr.match(/#[0-9A-Fa-f]{6}/) && this.element.attr("data-color") != clr) {
      this.dragging_hsv = $.mobile.clrlib.RGBToHSV($.mobile.clrlib.HTMLToRGB(clr));
      this.refresh();
    }
  }
});

$(document).bind("pagecreate create", function(e) {
  $($.mobile.hsvpicker.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .hsvpicker();
});

})(jQuery);
