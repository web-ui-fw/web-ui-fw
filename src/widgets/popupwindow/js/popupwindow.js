(function( $, undefined ) {

$.widget( "mobile.popupwindow", $.mobile.widget, {
  options: {
    disabled: false,
    initSelector: ":jqmData(role='popupwindow')",
    overlayTheme: "a"
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
          .addClass("ui-body-" + o.overlayTheme)
          .addClass($.mobile.defaultDialogTransition)
          .insertAfter(screen);

    elem.appendTo(container);

    $.extend( self, {
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
        x = (undefined === x_where ? 0 : x_where),
        y = (undefined === y_where ? 0 : y_where);

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

    var self = this;

    self.screen .addClass("ui-screen-hidden");
    self.container
      .addClass("ui-selectmenu-hidden")
      .removeAttr("style")
      .removeClass("in");

    this.isOpen = false;

    this.element.trigger("closed");
  }
});

$(document).bind("pagecreate create", function(e) {
  $($.mobile.popupwindow.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .popupwindow();
});

})(jQuery);
