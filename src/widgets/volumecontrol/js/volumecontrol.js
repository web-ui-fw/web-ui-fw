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
        optionKeys = _.keys(this.options),
        container = $.mobile.todons.loadPrototype("volumecontrol").find("#volumecontrol")
          .insertBefore(this.element)
          .popupwindow({overlayTheme: "", fade: false, shadow: false}),
        volumeImage = container.find("#volumecontrol-indicator");

      this.element.css("display", "none");

      $.extend (self, {
        isOpen: false,
        volumeImage: volumeImage,
        container: container,
      });

      for (key in optionKeys)
        this._setOption(optionKeys[key], this.options[optionKeys[key]], true);

      container.bind("closed", function(e) {
        self.isOpen = false;
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
    this.container.find("#volumecontrol-title").text(value);
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

  _setVolume: function(newVolume, unconditional) {
    newVolume = Math.max(0, Math.min(newVolume, this._maxVolume()));
    if (newVolume != this.options.volume || unconditional) {
      this.options.volume = newVolume;
      this._setVolumeIcon();
      this.element.attr("data-volume", this.options.volume);
      this.element.triggerHandler("volumechanged");
    }
  },

  _maxVolume: function() {
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
