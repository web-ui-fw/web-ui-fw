(function($, undefined) {

$.widget("mobile.colorpickerbutton", $.mobile.button, {
  options: {
    color: "#ff0000",
    buttonMarkup: {
      theme: null,
      inline: true,
      corners: true,
      shadow: true,
    },
    closeText: "Close",
    initSelector: "input[type='color'], :jqmData(type='color'), :jqmData(role='colorpickerbutton')"
  },

  _create: function() {
    var self = this,

        dstAttr = this.element.is("input") ? "value" : "data-color",

        myProto = $.mobile.todons.loadPrototype("colorpickerbutton").find("#colorpickerbutton"),

        ui = {
          buttonContents:  myProto.find("#colorpickerbutton-button-contents"),
          popup:           myProto.find("#colorpickerbutton-popup-container"),
          hsvpicker:       myProto.find("#colorpickerbutton-popup-hsvpicker"),
          closeButton:     myProto.find("#colorpickerbutton-popup-close-button"),
          closeButtonText: myProto.find("#colorpickerbutton-popup-close-button-text"),
        };

    $.mobile.button.prototype._create.call(this);
    ui.button = this.button;

    /* Tear apart the proto */
    ui.popup.insertBefore(this.element)
            .popupwindow();
    ui.hsvpicker.hsvpicker();
    ui.button.find("span.ui-btn-text")
      .empty()
      .append(ui.buttonContents);

    // Expose to other methods
    $.extend( self, {
      dstAttr: dstAttr,
      ui: ui,
    });

    $.mobile.todons.parseOptions(this, true);

    // Button events
    ui.button.bind("vclick keydown", function(event) {
      if (event.type == "vclick" ||
          event.keyCode &&
            (event.keyCode === $.mobile.keyCode.ENTER ||
             event.keyCode === $.mobile.keyCode.SPACE)) {
	self.open();
	event.preventDefault();
      }
    });

    ui.closeButton.bind("vclick", function(event) {
      self._setColor(self.ui.hsvpicker.attr("data-color"));
      self.close();
    });
  },

  _setOption: function(key, value, unconditional) {
    if (undefined === unconditional)
      unconditional = false;
    if (key === "color")
      this._setColor(value, unconditional);
    else
    if (key === "buttonMarkup") {
      value["theme"] = this.ui.popup.popupwindow("option", "overlayTheme").substring(8);
      value["inline"] = false;
      this.ui.closeButton.buttonMarkup(value);
    }
    else
    if (key === "closeText")
      this.ui.closeButtonText.text(value);
  },

  _setColor: function(clr, unconditional) {
    if (clr.match(/#[0-9A-Fa-f]{6}/)) {
      if (this.element.attr("data-color") != clr || unconditional) {
        this.ui.hsvpicker.hsvpicker("option", "color", clr);
        this.element.attr(this.dstAttr, clr);
        this.element.trigger("colorchanged", clr);
        this.ui.buttonContents.css("color", clr);
      }
    }
  },

  open: function() {
    if ( this.options.disabled ) {
      return;
    }

    this.ui.popup.popupwindow("open",
      this.ui.button.position().left + this.ui.button.outerWidth()  / 2,
      this.ui.button.position().top  + this.ui.button.outerHeight() / 2);
  },

  _focusButton : function(){
    var self = this;
    setTimeout(function() {
      self.ui.button.focus();
    }, 40);
  },

  close: function() {
    if ( this.options.disabled ) {
      return;
    }

    var self = this;

    self._focusButton();
    self.ui.popup.popupwindow("close");
  },
});

//auto self-init widgets
$(document).bind("pagecreate create", function(e) {
  $($.mobile.colorpickerbutton.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .colorpickerbutton();
});

})(jQuery);
