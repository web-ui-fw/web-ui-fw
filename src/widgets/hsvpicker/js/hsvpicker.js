(function( $, undefined ) {

$.widget( "mobile.hsvpicker", $.mobile.widget, {
  options: {
    color: "#1a8039",
    initSelector: ":jqmData(role='hsvpicker')"
  },

  _create: function() {
    var self = this,
        optionKeys = _.keys(this.options),
        myProto = $.mobile.loadPrototype("hsvpicker").find("#hsvpicker")
          .appendTo(this.element),
        ui = {
          hue: {
            container: myProto.find("#hsvpicker-hue-masks-container"),
            selector:  myProto.find("#hsvpicker-hue-selector"),
            hue:       myProto.find("#hsvpicker-hue-hue"),
            valMask:   myProto.find("#hsvpicker-hue-mask-val")
          },
          sat: {
            container: myProto.find("#hsvpicker-sat-masks-container"),
            selector:  myProto.find("#hsvpicker-sat-selector"),
            hue:       myProto.find("#hsvpicker-sat-hue"),
            valMask:   myProto.find("#hsvpicker-sat-mask-val")
          },
          val: {
            container: myProto.find("#hsvpicker-val-masks-container"),
            selector:  myProto.find("#hsvpicker-val-selector"),
            hue:       myProto.find("#hsvpicker-val-hue")
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

    for (key in optionKeys)
      this._setOption(optionKeys[key], this.options[optionKeys[key]], true);

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
      self.updateSelectors(self.dragging_hsv);
    });

    $( document ).bind( "vmousemove", function( event ) {
      if ( self.dragging != -1 ) {
//            self.refresh( event );
        event.stopPropagation();
      }
    });

    $( document ).bind( "vmouseup", function( event ) {
      if ( self.dragging != -1 ) {
        self.dragging = false;
//            self.refresh( event );
      }
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

    ui.hue.container.bind("vmousedown", function(e) { self.containerMouseDown("hue", 0, e); });
    ui.sat.container.bind("vmousedown", function(e) { self.containerMouseDown("sat", 1, e); });
    ui.val.container.bind("vmousedown", function(e) { self.containerMouseDown("val", 2, e); });

    ui.hue.container.bind("vmousemove", function(e) { self.containerMouseMove("hue", 0, e); });
    ui.sat.container.bind("vmousemove", function(e) { self.containerMouseMove("sat", 1, e); });
    ui.val.container.bind("vmousemove", function(e) { self.containerMouseMove("val", 2, e); });

    ui.hue.container.bind("vmouseup", function(e) { self.dragging = -1; });
    ui.sat.container.bind("vmouseup", function(e) { self.dragging = -1; });
    ui.val.container.bind("vmouseup", function(e) { self.dragging = -1; });
  },

  _setOption: function(key, value, unconditional) {
    if (undefined === unconditional)
      unconditional = false;
    if (key === "color")
      this._setColor(value, unconditional);
  },

  containerMouseDown: function(chan, idx, e) {
    if (event.offsetX >= 0 && event.offsetX <= this.ui[chan].container.width() &&
        event.offsetY >= 0 && event.offsetY <= this.ui[chan].container.height()) {
      this.dragging = idx;
      this.containerMouseMove(chan, idx, e);
    }
  },

  containerMouseMove: function(chan, idx, e) {
    if (this.dragging === idx) {
      var potential = event.offsetX / this.ui[chan].container.width();

      potential = Math.min(1.0, Math.max(0.0, potential));
      if (0 === idx)
        potential *= 360;

      this.dragging_hsv[idx] = potential;

      this.selectorDraggingOffset.x = Math.ceil(this.ui[chan].selector.outerWidth()  / 2.0);
      this.selectorDraggingOffset.y = Math.ceil(this.ui[chan].selector.outerHeight() / 2.0);
      this.updateSelectors(this.dragging_hsv);
      e.stopPropagation();
    }
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

      potential += (event.offsetX - this.selectorDraggingOffset.x) / this.ui[chan].container.width();
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

    this.element.attr("data-color", clr);
    this.element.triggerHandler('colorchanged', clr);
  },

  _setColor: function(clr, unconditional) {
    if (clr.match(/#[0-9A-Fa-f]{6}/) && this.element.attr("data-color") != clr || unconditional) {
      this.dragging_hsv = $.mobile.clrlib.RGBToHSV($.mobile.clrlib.HTMLToRGB(clr));
      this.updateSelectors(this.dragging_hsv);
    }
  }
});

$(document).bind("pagecreate create", function(e) {
  $($.mobile.hsvpicker.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .hsvpicker();
});

})(jQuery);
