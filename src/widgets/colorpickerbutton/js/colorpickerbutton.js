(function( $, undefined ) {

$.widget( "mobile.colorpickerbutton", $.mobile.widget, {
  options: {
    color: "#ff0000",
    theme: null,
    disabled: false,
    inline: true,
    corners: true,
    shadow: true,
    closeText: "Close",
    initSelector: "input[type='color'], :jqmData(type='color'), :jqmData(role='colorpickerbutton')"
  },
  _create: function() {
    var self = this,

        o = this.options,

        colour = this.element.attr("value"),

        select = this.element.wrap( "<div class='ui-select'>" ),

        selectID = select.attr( "id" ),

        label = $( "label[for='"+ selectID +"']" ).addClass( "ui-select" ),

        buttonContents = $("<span/>")
          .html("&#x2587;&#x2587;&#x2587;"),

        buttonId = selectID + "-button",

        menuId = selectID + "-menu",

        button = $( "<a>", {
		        "href": "#",
		        "role": "button",
		        "id": buttonId,
		        "aria-haspopup": "true",
		        "aria-owns": menuId
	        })
	        .append(buttonContents)
	        .insertBefore( select )
	        .buttonMarkup({
		        theme: o.theme,
		        inline: o.inline,
		        corners: o.corners,
		        shadow: o.shadow
	        })
                .css("color", colour),

        //button theme
        theme = /ui-btn-up-([a-z])/.exec( button.attr( "class" ) )[1],

        canvas = $("<div/>", {"id" : "canvas"})
          .insertBefore(select),

        realcanvas = $("<div/>")
          .appendTo(canvas)
          .colorpicker({"color" : colour}),

        popup = canvas.popupwindow(),

        closeButton = $("<a/>", {
          "href": "#",
          "role": "button"
          })
          .text(o.closeText)
          .appendTo(canvas)
          .buttonMarkup({
            theme: $.mobile.popupwindow.prototype.options.overlayTheme,
            inline: false,
            corners: o.corners,
            shadow: o.shadow
          });

    canvas.css("max-width", realcanvas.outerWidth());

    if (undefined === colour)
      colour = o.color;

    this.element.css("display", "none");

    // Disable if specified
    if ( o.disabled ) {
      this.disable();
    }

    // Expose to other methods
    $.extend( self, {
      popup: popup,
      dragging_clr: undefined,
      colour: colour,
      realcanvas: realcanvas,
      select: select,
      selectID: selectID,
      label: label,
      buttonId: buttonId,
      menuId: menuId,
      button: button,
      canvas: canvas,
      placeholder: "",
      buttonContents: buttonContents
    });

    // Support for using the native select menu with a custom button

    // Create list from select, update state
    self.refresh();

    // Button events
    button.bind("vclick keydown", function(event) {
      if (event.type == "vclick" ||
          event.keyCode &&
            (event.keyCode === $.mobile.keyCode.ENTER ||
             event.keyCode === $.mobile.keyCode.SPACE)) {
	self.open();
	event.preventDefault();
      }
    });

    realcanvas.bind( "colorchanged", function (event, clr) {
      self.dragging_clr = clr;
    });

    closeButton.bind("vclick", function(event) {
      self.setColor(self.dragging_clr);
      self.close();
    });
  },

  setColor: function(clr) {
    if (clr.match(/#[0-9A-Fa-f]{6}/)) {
      if (this.colour != clr) {

        this.colour = clr;
        this.dragging_clr = clr;
        this.refresh();
        this.realcanvas.colorpicker("setColor", this.colour);
        this.element.trigger("colorchanged", this.colour);
      }
    }
  },

  refresh: function( forceRebuild ) {
    var self = this,
        r, g, b, r_str, g_str, b_str, hsl,
        clrValue = self.colour;

        if (undefined === clrValue)
          clrValue = "#ff0000";

        if (self.element.attr("value") != clrValue)
          self.element.attr("value", clrValue);

    self.buttonContents.css("color", clrValue);
  },

  open: function() {
    if ( this.options.disabled ) {
      return;
    }

    this.realcanvas.colorpicker("setColor", this.colour);

    this.popup.popupwindow("open",
      this.button.position().left + this.button.outerWidth()  / 2,
      this.button.position().top  + this.button.outerHeight() / 2);
  },

  _focusButton : function(){
    var self = this;
    setTimeout(function() {
      self.button.focus();
    }, 40);
  },

  close: function() {
    if ( this.options.disabled ) {
      return;
    }

    var self = this;

    self._focusButton();
    self.popup.popupwindow("close");
  },

  disable: function() {
    this.element.attr( "disabled", true );
    this.button.addClass( "ui-disabled" ).attr( "aria-disabled", true );
    return this._setOption( "disabled", true );
  },

  enable: function() {
    this.element.attr( "disabled", false );
    this.button.removeClass( "ui-disabled" ).attr( "aria-disabled", false );
    return this._setOption( "disabled", false );
  }
});

//auto self-init widgets
$(document).bind("pagecreate create", function(e) {
  $($.mobile.colorpickerbutton.prototype.options.initSelector, e.target)
    .not( ":jqmData(role='none'), :jqmData(role='nojs')" )
    .colorpickerbutton();
});

})( jQuery );