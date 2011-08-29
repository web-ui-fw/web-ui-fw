(function( $, undefined ) {

$.widget( "mobile.volumecontrol", $.mobile.widget, {
  options: {
    theme: null,
    disabled: false,
    inline: true,
    corners: true,
    shadow: true,
    overlayTheme: "a",
    closeText: "Close",
    initSelector: ":jqmData(role='volumecontrol')"
  },
  _create: function() {
    var
      self = this,

      o = this.options,

      select = this.element.wrap( "<div class='ui-select'>" ),

      selectID = select.attr( "id" ),

      label = $( "label[for='"+ selectID +"']" ).addClass( "ui-select" ),

      menuId = selectID + "-menu",

      thisPage = select.closest( ".ui-page" ),

      screen = $( "<div>", {"class": "ui-selectmenu-screen ui-screen-hidden"})
        .appendTo( thisPage ),

      listbox = $("<div>", { "class": "ui-selectmenu ui-selectmenu-hidden ui-overlay-shadow ui-corner-all ui-body-" + o.overlayTheme + " " + $.mobile.defaultDialogTransition })
	.insertAfter(screen),

      contents = $("<div>", {"class" : "ui-grid-a"})
        .appendTo(listbox),

      titleContainer = $("<div>", {"class" : "ui-header"})
        .appendTo(contents),

      titleSpan = $("<span>", {"class" : "ui-title"})
        .appendTo(titleContainer),

      randomText = $("<span>")
        .appendTo(contents);

      titleSpan.text("Volume");
      randomText.text("Random Text");

    this.element.css("display", "none");

    // Disable if specified
    if ( o.disabled ) {
      this.disable();
    }

    // Events on native select
    select.change(function() {
      self.refresh();
    });

    // Expose to other methods
    $.extend( self, {
      select: select,
      selectID: selectID,
      label: label,
      menuId: menuId,
      thisPage: thisPage,
      screen: screen,
      listbox: listbox,
      contents: contents,
      placeholder: "",
      dragging: false,
      draggingHS: true,
      dragging_hsl : {
        h : -1,
        s : -1,
        l : -1
      }
    });

    // Support for using the native select menu with a custom button

    // Create list from select, update state
    self.refresh();

    $( document ).bind( "vmousemove", function( event ) {
      if ( self.dragging ) {
//        self.refresh( event );
	return false;
      }
    });

    $( document ).bind( "vmouseup", function( event ) {
      if ( self.dragging ) {
        self.dragging = false;
//        self.refresh( event );
	return false;
      }
    });

    // Events on "screen" overlay
    screen.bind( "vclick", function( event ) {
      self.close();
    });
  },

  makeClrChannel: function(val) {
    return (val < 16 ? "0" : "") + (val & 0xff).toString(16);
  },

  refresh: function( forceRebuild ) {
  },

  open: function() {
    if ( this.options.disabled ) {
      return;
    }

    var self = this,
	    menuHeight = self.contents.parent().outerHeight(),
	    menuWidth = self.contents.parent().outerWidth(),
	    scrollTop = $( window ).scrollTop(),
	    screenHeight = window.innerHeight,
	    screenWidth = window.innerWidth;

    console.log(
      "menuHeight: " + menuHeight + 
      ", menuWidth: " + menuWidth +
      ", scrollTop: " + scrollTop +
      ", screenHeight: " + screenHeight +
      ", screenWidth: " + screenWidth);

    self.screen.height( $(document).height() )
	.removeClass( "ui-screen-hidden" );

    // Try and center the overlay over the button
    var roomtop = -scrollTop,
	roombot = scrollTop + screenHeight,
	halfheight = menuHeight / 2,
	maxwidth = parseFloat( self.contents.parent().css( "max-width" ) ),
	newtop, newleft;

    if ( roomtop > menuHeight / 2 && roombot > menuHeight / 2 ) {
      newtop = -halfheight;
    } else {
      // 30px tolerance off the edges
      newtop = roomtop > roombot ? scrollTop + screenHeight - menuHeight - 30 : scrollTop + 30;
    }

    // If the menuwidth is smaller than the screen center is
    if ( menuWidth < maxwidth ) {
      newleft = ( screenWidth - menuWidth ) / 2;
    } else {

      //otherwise insure a >= 30px offset from the left
      newleft = 0 - menuWidth / 2;

      // 30px tolerance off the edges
      if ( newleft < 30 ) {
	newleft = 30;
      } else if ( ( newleft + menuWidth ) > screenWidth ) {
	newleft = screenWidth - menuWidth - 30;
      }
    }

    self.listbox.append( self.contents )
	.removeClass( "ui-selectmenu-hidden" )
	.css({
	  top: newtop,
	  left: newleft
	})
	.addClass( "in" );

    // duplicate with value set in page show for dialog sized selects
    self.isOpen = true;
  },

  close: function() {
    if ( this.options.disabled || !this.isOpen ) {
      return;
    }

    var self = this;

    self.screen.addClass( "ui-screen-hidden" );
    self.listbox.addClass( "ui-selectmenu-hidden" ).removeAttr( "style" ).removeClass( "in" );
    self.contents.appendTo( self.listbox );

    // allow the dialog to be closed again
    this.isOpen = false;
  },

  disable: function() {
    this.element.attr( "disabled", true );
    return this._setOption( "disabled", true );
  },

  enable: function() {
    this.element.attr( "disabled", false );
    return this._setOption( "disabled", false );
  }
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
  $( $.mobile.volumecontrol.prototype.options.initSelector, e.target )
    .not( ":jqmData(role='none'), :jqmData(role='nojs')" )
    .volumecontrol();
});

})( jQuery );
