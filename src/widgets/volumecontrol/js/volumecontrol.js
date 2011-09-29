/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Gabriel Schulhof
 */

/*
 * Displays a popup window with a visual volume level indicator
 * and a speaker icon.
 *
 * The volume leven can be adjusted using the 'up', 'down', 'home',
 * and 'end' keys. 'home' sets the volume to zero, and 'end' set it
 * to maximum.
 *
 * To apply, add the attribute data-role="volumecontrol" to a <div>
 * element inside a page. Alternatively, call volumecontrol() 
 * on an element (see below).
 *
 * The following options can be set during construction :
 *
 *     $("myVolumeControl").volumecontrol({volume:5, basicTone:true, title:"Basic Tone"});
 *
 * or after using the usual jQuery Mobile method, eg to change the title :
 *
 *     $("myVolumeControl").volumecontrol("option", "title", "Volume");
 *
 * Options:
 *
 *    volume : Integer;the volume level to be displayed
 *             (0-15 or 0-7 for basicTone)
 *             Default: 0
 *
 *    basicTone : Boolean; display the "basic tone" volume scale,
 *                otherwise display the generic one
 *                Default: false
 *
 *    title : String; the title to display at the top of the popupwindow.
 *            Default: 'Volume'
 *
 * Event:
 *     volumechanged: triggered when the user changes the volume.
 */
(function( $, undefined ) {

$.widget( "todons.volumecontrol", $.mobile.widget, {
  options: {
    volume: 0,
    basicTone: false,
    title: "Volume",
    initSelector: ":jqmData(role='volumecontrol')"
  },

  _create: function() {
    var self = this,
        ui = {
          container: "#volumecontrol",
          volumeImage: "#volumecontrol-indicator"
        };

      ui = $.mobile.todons.loadPrototype("volumecontrol", ui);
      ui.container.insertBefore(this.element)
                  .popupwindow({overlayTheme: "", fade: false, shadow: false});
      this.element.css("display", "none");

      $.extend (self, {
        isOpen: false,
        ui: ui,
        dragging: false
      });

      $.mobile.todons.parseOptions(this, true);

      ui.container.bind("closed", function(e) {
        self.isOpen = false;
      });

      ui.volumeImage.bind("vmousedown", function(e) {
        self.dragging = true;
        self._setVolume((1.0 - e.offsetY / $(this).outerHeight()) * self._maxVolume());
        event.preventDefault();
      });

      ui.volumeImage.bind("vmousemove", function(e) {
        if (self.dragging) {
          self._setVolume((1.0 - e.offsetY / $(this).outerHeight()) * self._maxVolume());
          event.preventDefault();
        }
      });

      $( document ).bind( "vmouseup", function( event ) {
        if ( self.dragging )
          self.dragging = false;
      });

      $(document).bind("keydown", function(e) {
        if (self.isOpen) {
          var maxVolume = self._maxVolume(),
              newVolume = -1;

          switch(event.keyCode) {
            case $.mobile.keyCode.UP:
            case $.mobile.keyCode.DOWN:
            case $.mobile.keyCode.HOME:
            case $.mobile.keyCode.END:
              event.preventDefault();
              break;
          }

          switch(event.keyCode) {
            case $.mobile.keyCode.UP:
              newVolume = Math.min(self.options.volume + 1, maxVolume);
              break;

            case $.mobile.keyCode.DOWN:
              newVolume = Math.max(self.options.volume - 1, 0);
              break;

            case $.mobile.keyCode.HOME:
              newVolume = 0;
              break;

            case $.mobile.keyCode.END:
              newVolume = maxVolume;
              break;
          }

          if (newVolume != -1)
            self._setVolume(newVolume);
        }
      });
  },

  _setBasicTone: function(value, unconditional) {
    if (this.options.basicTone != value || unconditional) {
      this.options.basicTone = value;
      this._setVolume(this.options.volume, true);
    }
  },

  _setTitle: function(value, unconditional) {
    this.options.title = value;
    this.ui.container.find("#volumecontrol-title").text(value);
  },

  _setOption: function(key, value, unconditional) {
    if (undefined === unconditional)
      unconditional = false;
    if (key === "volume")
      this._setVolume(value, unconditional);
    else
    if (key === "basicTone")
      this._setBasicTone(value, unconditional);
    else
    if (key === "title")
      this._setTitle(value, unconditional)
  },

  _setVolume: function(vol, unconditional) {
    var newVolume = Math.max(0, Math.min(vol, this._maxVolume())),
        theFloor = Math.floor(newVolume);

    newVolume = theFloor + (((newVolume - theFloor) > 0.5) ? 1 : 0);

    if (newVolume != this.options.volume || unconditional) {
      this.options.volume = newVolume;
      this._setVolumeIcon();
      this.element.attr("data-volume", this.options.volume);
      this.element.triggerHandler("volumechanged");
    }
  },

  _maxVolume: function() {
    var ret = this.ui.volumeImage.attr(this.options.basicTone
      ? "data-basicTone-maxVolume"
      : "data-generalVolume-maxVolume");
    return ret;
  },

  _setVolumeIcon: function() {
    this.ui.volumeImage.attr("src",
      this.ui.volumeImage.attr(
          (this.options.basicTone
            ? "data-basicTone-imageTemplate"
            : "data-generalVolume-imageTemplate"))
        .replace("%1", ((this.options.volume < 10 ? "0" : "") + this.options.volume)));
  },

  open: function() {
    if (!this.isOpen) {
      this.ui.container.popupwindow("open",
        window.innerWidth  / 2,
        window.innerHeight / 2);

      this.isOpen = true;
    }
  },

  close: function() {
    if (this.isOpen) {
      this.ui.container.popupwindow("close");
      this.isOpen = false;
    }
  },
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
  $( $.todons.volumecontrol.prototype.options.initSelector, e.target )
    .not( ":jqmData(role='none'), :jqmData(role='nojs')" )
    .volumecontrol();
});

})( jQuery );
