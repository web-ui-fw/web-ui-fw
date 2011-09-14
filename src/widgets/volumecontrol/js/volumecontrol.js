(function( $, undefined ) {

$.widget( "mobile.volumecontrol", $.mobile.widget, {
  options: {
    volume: 0,
    basicTone: false,
    title: "Volume",
    initSelector: ":jqmData(role='volumecontrol')"
  },

  _create: function() {

    var self = this,
        container = $.mobile.loadPrototype("volumecontrol").find("#volumecontrol")
          .insertBefore(this.element)
          .popupwindow({overlayTheme: "", fade: false, shadow: false}),
        volumeImage = container.find("#volumecontrol-indicator");

      this.element.css("display", "none");


      $.extend (self, {
        isOpen: false,
        volumeImage: volumeImage,
        container: container,
      });

      for (key in this.options)
        this._setOption(key, this.options[key]);

      container.bind("closed", function(e) {
        self.isOpen = false;
      });

      $(document).bind("keydown", function(e) {
        if (self.isOpen) {
          var maxVolume = self.maxVolume(),
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

  _setOption: function(key, value) {
    if (key === "volume")
      this._setVolume(value);
    else
    if (key === "basicTone") {
      this.options.basicTone = value;
      if (!this._setVolume(this.options.volume))
        this._setVolumeIcon();
    }
    else
    if (key === "title") {
      this.options.title = value;
      this.container.find("#volumecontrol-title").text(value);
    }
  },

  _setVolume: function(newVolume) {
    newVolume = Math.max(0, Math.min(newVolume, this.maxVolume()));
    if (newVolume != this.element.attr("data-volume")) {
      this.options.volume = newVolume;
      this._setVolumeIcon();
      this.element.attr("data-volume", this.options.volume);
      this.element.triggerHandler("volumechanged");
      return true;
    }
    return false;
  },

  maxVolume: function() {
    var ret = this.volumeImage.attr(this.options.basicTone
      ? "data-basicTone-maxVolume"
      : "data-generalVolume-maxVolume");
    return ret;
  },

  _setVolumeIcon: function() {
    this.volumeImage.attr("src",
      this.volumeImage.attr(
          (this.options.basicTone 
            ? "data-basicTone-imageTemplate"
            : "data-generalVolume-imageTemplate"))
        .replace("%1", ((this.options.volume < 10 ? "0" : "") + this.options.volume)));
  },

  open: function() {
    if (!this.isOpen) {
      this.container.popupwindow("open",
        window.innerWidth  / 2,
        window.innerHeight / 2);

      this.isOpen = true;
    }
  },
  
  close: function() {
    if (this.isOpen) {
      this.container.popupwindow("close");
      this.isOpen = false;
    }
  },
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
  $( $.mobile.volumecontrol.prototype.options.initSelector, e.target )
    .not( ":jqmData(role='none'), :jqmData(role='nojs')" )
    .volumecontrol();
});

})( jQuery );
