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
        select = this.element,
        o = this.options,
        volume = o.volume,
        container = $.mobile.loadPrototype("volumecontrol").find("#volumecontrol")
          .insertBefore(select)
          .popupwindow({overlayTheme: "", fade: false, shadow: false}),
        volumeImage = container.find("#volumecontrol-indicator");

      this.element.css("display", "none");
      container.find("#volumecontrol-title").text(o.title);

      $.extend (self, {
        isOpen: false,
        basicTone: o.basicTone,
        volumeImage: volumeImage,
        container: container,
        volume: volume
      });

      this.setVolumeIcon();

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
              newVolume = Math.min(self.volume + 1, maxVolume);
              break;

            case $.mobile.keyCode.DOWN:
              newVolume = Math.max(self.volume - 1, 0);
              break;

            case $.mobile.keyCode.HOME:
              newVolume = 0;
              break;

            case $.mobile.keyCode.END:
              newVolume = maxVolume;
              break;
          }

          if (newVolume != -1) {
            self.setVolume(newVolume);
          }
        }
      });
  },

  maxVolume: function() {
    var ret = this.volumeImage.attr(this.basicTone
      ? "data-basicTone-maxVolume"
      : "data-generalVolume-maxVolume");
    return ret;
  },

  setVolumeIcon: function() {
    this.volumeImage.attr("src",
      this.volumeImage.attr(
          (this.basicTone 
            ? "data-basicTone-imageTemplate"
            : "data-generalVolume-imageTemplate"))
        .replace("%1", ((this.volume < 10 ? "0" : "") + this.volume)));
  },

  setVolume: function(volume) {
    if (volume != undefined)
      if (this.volume != volume) {
        this.volume =  Math.max(0, Math.min(volume, this.maxVolume()));
        this.setVolumeIcon();
      }
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
