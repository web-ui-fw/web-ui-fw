/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Gabriel Schulhof
 */

/*
 * Displays a button which, when pressed, opens a popupwindow
 * containing hsvpicker.
 *
 * To apply, add the attribute data-role="colorpickerbutton" to a <div>
 * element inside a page. Alternatively, call colorpickerbutton() on an
 * element.
 *
 * Options:
 *
 *     color: String; color displayed on the button and the base color
 *            of the hsvpicker (see hsvpicker).
 *            initial color can be specified in html using the
 *            data-color="#ff00ff" attribute or when constructed in
 *            javascript, eg :
 *                $("#mycolorpickerbutton").colorpickerbutton({ color: "#ff00ff" });
 *            where the html might be :
 *                <div id="colorpickerbutton"></div>
 *            The color can be changed post-construction like this :
 *                $("#mycolorpickerbutton").colorpickerbutton("option", "color", "#ABCDEF");
 *            Default: "#1a8039"
 *
 *     buttonMarkup: String; markup to use for the close button on the popupwindow, eg :
 *                   $("#mycolorpickerbutton").colorpickerbutton("option","buttonMarkup",
 *                     "<a href='#' data-role='button'>ignored</a>");
 *
 *     buttonText: String; the text to display on the close button on the popupwindow.
 *                 The text set in the buttonMarkup will be ignored and this used instead.
 *
 * Events:
 *
 *     colorchanged: emitted when the color has been changed and the popupwindow is closed.
 */
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
        ui = {
          buttonContents:  "#colorpickerbutton-button-contents",
          popup:           "#colorpickerbutton-popup-container",
          hsvpicker:       "#colorpickerbutton-popup-hsvpicker",
          closeButton:     "#colorpickerbutton-popup-close-button",
          closeButtonText: "#colorpickerbutton-popup-close-button-text",
        };

    ui = $.mobile.todons.loadPrototype("colorpickerbutton", ui);
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
