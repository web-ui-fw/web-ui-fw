(function( $, undefined ) {

$.widget( "mobile.colorpickerbutton", $.mobile.widget, {
  options: {
    color: "#ff0000",
    theme: null,
    disabled: false,
    inline: true,
    corners: true,
    shadow: true,
    overlayTheme: "a",
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

        thisPage = select.closest( ".ui-page" ),

        //button theme
        theme = /ui-btn-up-([a-z])/.exec( button.attr( "class" ) )[1],

        screen = $( "<div>", {"class": "ui-selectmenu-screen ui-screen-hidden"})
			        .appendTo( thisPage ),

        listbox = $("<div>", { "class": "ui-popupmenu ui-selectmenu-hidden ui-overlay-shadow ui-corner-all ui-body-" + o.overlayTheme + " " + $.mobile.defaultDialogTransition})
		        .insertAfter(screen),

        canvas = $("<div/>", {"id" : "canvas"})
          .appendTo(listbox),

        realcanvas = $("<div/>")
          .appendTo(canvas)
          .colorpicker({"color" : colour}),

        closeButton = $("<a/>", {
          "href": "#",
          "role": "button"
          })
          .text(o.closeText)
          .appendTo(canvas)
          .buttonMarkup({
            theme: o.theme,
            inline: false,
            corners: o.corners,
            shadow: o.shadow
          });

    if (undefined === colour)
      colour = o.color;

    this.element.css("display", "none");

    // Disable if specified
    if ( o.disabled ) {
      this.disable();
    }

    // Expose to other methods
    $.extend( self, {
      dragging_clr: undefined,
      colour: colour,
      realcanvas: realcanvas,
      select: select,
      selectID: selectID,
      label: label,
      buttonId: buttonId,
      menuId: menuId,
      thisPage: thisPage,
      button: button,
      screen: screen,
      listbox: listbox,
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

    // Events on "screen" overlay
    screen.bind( "vclick", function( event ) {
      self.close();
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

    var self = this,
        targetWidget = self.canvas.parent();

    self.realcanvas.colorpicker("setColor", self.colour);
    self.canvas.css("max-width", self.realcanvas.outerWidth());
    self.listbox.css("max-width", self.realcanvas.outerWidth());

    var menuHeight = targetWidget.outerHeight(),
	menuWidth = targetWidget.outerWidth(),
	scrollTop = $( window ).scrollTop(),
	btnOffset = self.button.offset().top,
	screenHeight = window.innerHeight,
	screenWidth = window.innerWidth;

    //add active class to button
    self.button.addClass( $.mobile.activeBtnClass );

    //remove after delay
    setTimeout(function() {
      self.button.removeClass( $.mobile.activeBtnClass );
    }, 300);

    self.screen
      .height($(document).height())
      .removeClass("ui-screen-hidden");

    // Try and center the overlay over the button
    var roomtop = btnOffset - scrollTop,
	roombot = scrollTop + screenHeight - btnOffset,
	halfheight = menuHeight / 2,
	maxwidth = parseFloat( targetWidget.css( "max-width" ) ),
	newtop, newleft;

    if ( roomtop > menuHeight / 2 && roombot > menuHeight / 2 ) {
      newtop = btnOffset + ( self.button.outerHeight() / 2 ) - halfheight;
    }
    else {
      // 30px tolerance off the edges
      newtop = roomtop > roombot ? scrollTop + screenHeight - menuHeight - 30 : scrollTop + 30;
    }

    // If the menuwidth is smaller than the screen center is
    if ( menuWidth < maxwidth ) {
      newleft = ( screenWidth - menuWidth ) / 2;
    } 
    else {

      //otherwise insure a >= 30px offset from the left
      newleft = self.button.offset().left + (self.button.outerWidth() - menuWidth) / 2;

      // 30px tolerance off the edges
      if ( newleft < 30 ) {
	newleft = 30;
      }
      else
      if ( ( newleft + menuWidth ) > screenWidth ) {
	newleft = screenWidth - menuWidth - 30;
      }
    }

    self.listbox
      .removeClass( "ui-selectmenu-hidden" )
      .css({
	top: newtop,
	left: newleft
      })
      .addClass( "in" );

    // duplicate with value set in page show for dialog sized selects
    self.isOpen = true;
  },

  _focusButton : function(){
    var self = this;
    setTimeout(function() {
      self.button.focus();
    }, 40);
  },

  close: function() {
    if ( this.options.disabled || !this.isOpen ) {
      return;
    }

    var self = this;

    self.screen.addClass( "ui-screen-hidden" );
    self.listbox.addClass( "ui-selectmenu-hidden" ).removeAttr( "style" ).removeClass( "in" );
    self._focusButton();

    // allow the dialog to be closed again
    this.isOpen = false;
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
