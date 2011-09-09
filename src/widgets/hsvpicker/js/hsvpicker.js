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
    });

    this.setColor(o.color);

    myProto.find(".hsvpicker-arrow-btn").bind("vmousedown", function(e) {
      $(this).attr("src",
        myProto.attr("data-arrow-btn-imageTemplate")
          .replace("%1", $(this).attr("data-location"))
          .replace("%2", "_press"));
    });

    myProto.find(".hsvpicker-arrow-btn").bind("vmouseup", function(e) {
      $(this).attr("src",
        myProto.attr("data-arrow-btn-imageTemplate")
          .replace("%1", $(this).attr("data-location"))
          .replace("%2", ""));
    });
  },

  updateSelectors: function(hsv) {
    var clr = $.mobile.clrlib.RGBToHTML($.mobile.clrlib.HSVToRGB(hsv)),
        hclr = $.mobile.clrlib.RGBToHTML($.mobile.clrlib.HToRGB(hsv[0]));

    this.ui.hue.selector.css("left", this.ui.hue.masks.width() * hsv[0] / 360);
    this.ui.hue.hue.css("opacity", hsv[1]);
    this.ui.hue.valMask.css("opacity", 1.0 - hsv[2]);

    this.ui.sat.selector.css("left", this.ui.sat.masks.width() * hsv[1]);
    this.ui.sat.hue.css("background", hclr);
    this.ui.sat.valMask.css("opacity", 1.0 - hsv[2]);

    this.ui.val.selector.css("left", this.ui.val.masks.width() * hsv[2]);
    this.ui.val.hue.css("background", clr);

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
