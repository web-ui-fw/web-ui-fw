(function( $, undefined ) {

$.widget( "mobile.popupwindow", $.mobile.widget, {
  options: {
    disabled: false,
    initSelector: ":jqmData(role='popupwindow')",
    overlayTheme: "c",
    shadow: true,
    fade: true,
  },

  _create: function() {
    var self = this,
        o = this.options,
        elem = this.element,
        thisPage = this.element.closest(".ui-page"),
        myProto = $.mobile.loadPrototype("popupwindow"),
        screen = myProto.find("#popupwindow-screen")
          .appendTo(thisPage),
        container = myProto.find("#popupwindow-container")
          .addClass($.mobile.defaultDialogTransition)
          .insertAfter(screen);

    if (o.overlayTheme.match(/[a-z]/))
      container.addClass("ui-body-" + o.overlayTheme);

    if (!o.shadow)
      container.removeClass("ui-overlay-shadow");

    elem.appendTo(container);

    $.extend( self, {
      fade: o.fade,
      elem: elem,
      isOpen: false,
      thisPage: thisPage,
      screen: screen,
      container: container
    });

    // Events on "screen" overlay
    screen.bind( "vclick", function( event ) {
      self.close();
    });
  },

  open: function(x_where, y_where) {
    console.log("popupwindow.open: Entering with (" + x_where + ", " + y_where + ")");
    if ( this.options.disabled || this.isOpen)
      return;

    var self = this,
        x = (undefined === x_where ? window.innerWidth  / 2 : x_where),
        y = (undefined === y_where ? window.innerHeight / 2 : y_where);

    console.log("self.elem is [" + self.elem.outerWidth() + " x " + self.elem.outerHeight() + "]");

    self.container.css("max-width",  self.elem.outerWidth());
    self.container.css("max-height", self.elem.outerHeight());

    var menuHeight = self.container.outerHeight(),
	menuWidth = self.container.outerWidth(),
	scrollTop = $( window ).scrollTop(),
	screenHeight = window.innerHeight,
	screenWidth = window.innerWidth;

    self.screen
      .height($(document).height())
      .removeClass("ui-screen-hidden");

      if (self.fade)
        self.screen.animate({opacity: 0.5}, "fast");
    
      // Try and center the overlay over the given coordinates
      var roomtop = y - scrollTop,
	  roombot = scrollTop + screenHeight - y,
	  halfheight = menuHeight / 2,
	  maxwidth = parseFloat( self.container.css( "max-width" ) ),
	  newtop, newleft;

      if ( roomtop > menuHeight / 2 && roombot > menuHeight / 2 ) {
        newtop = y - halfheight;
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
        newleft = x - menuWidth / 2;

        // 30px tolerance off the edges
        if ( newleft < 30 ) {
	  newleft = 30;
        }
        else
        if ( ( newleft + menuWidth ) > screenWidth ) {
	  newleft = screenWidth - menuWidth - 30;
        }
      }

      self.container
        .removeClass("us-selectmenu-hidden")
        .css({
          top: newtop,
          left: newleft
        })
        .addClass("in");

      self.isOpen = true;
  },

  close: function() {
    if (this.options.disabled || !this.isOpen)
      return;

    var self = this,
        hideScreen = function() {
          self.screen.addClass("ui-screen-hidden");
          self.isOpen = false;
          self.element.trigger("closed");
        };

    self.container
      .addClass("ui-selectmenu-hidden")
      .removeAttr("style")
      .removeClass("in");

    if (self.fade)
      self.screen.animate({opacity: 0.0}, "fast", hideScreen);
    else
      hideScreen();
  }
});

$(document).bind("pagecreate create", function(e) {
  $($.mobile.popupwindow.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .popupwindow();
});

})(jQuery);
