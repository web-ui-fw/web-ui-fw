(function( $, undefined ) {

$.widget( "mobile.volumecontrol", $.mobile.widget, {
  options: {
    volume: 0,
    basicTone: false,
    title: "Volume",
    initSelector: ":jqmData(role='volumecontrol')"
  },

  _create: function() {

    console.log("volumecontrol._create");

    var self = this,
        select = this.element,
        o = this.options,
        volume = o.volume,
        container = $("<div>", {"class" : "ui-volumecontrol"})
          .attr("id", "container")
          .insertBefore(select)
          .popupwindow(),
        titleSpan = $("<h1>")
          .text(o.title)
          .appendTo(container),
        icon = $("<div>", {"class" : "ui-volumecontrol-icon"})
          .append($.volumecontrol_createIcon())
          .appendTo(container),

        volumeImage = $("<img>", {"alt": "☺"}),

        indicator = $("<div>", {"class" : "ui-volumecontrol-indicator"})
          .append(volumeImage)
          .appendTo(container);

      this.element.css("display", "none");

      $.extend (self, {
        isOpen: false,
        basicTone: o.basicTone,
        volumeImage: volumeImage,
        indicator: indicator,
        container: container,
        volume: volume
      });

      this.setVolumeIcon();

      container.bind("closed", function(e) {
        console.log("volumecontrol._create: popup closed");
        self.isOpen = false;
      });

      $(document).bind("keydown", function(e) {
        if (this.isOpen) {
          var maxVolume = self.basicTone ? 6 : 14,
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
              newVolume = Math.max(this.volume + 1, maxVolume);
              break;

            case $.mobile.keyCode.DOWN:
              newVolume = Math.min(this.volume - 1, 0);
              break;

            case $.mobile.keyCode.HOME:
              newVolume = 0;
              break;

            case $.mobile.keyCode.END:
              newVolume = maxVolume;
              break;
          }

          self.setVolume(newVolume);
        }
      });
  },

  setVolumeIcon: function() {
    this.volumeImage.attr("src",
      (this.basicTone 
          ? $.volumecontrol_basicToneIconTemplate
          : $.volumecontrol_volumeIconTemplate)
        .replace("%1", ((this.volume < 10 ? "0" : "") + this.volume)));
  },

  setVolume: function(volume) {
    if (volume != undefined)
      if (this.volume != volume) {
        this.volume = Math.max(0, Math.min(volume, (this.basicTone ? 6 : 14)));
        setVolumeIcon();
      }
  },

  open: function() {
    console.log("volumecontrol.open: Entering");
    if (!this.isOpen) {
      console.log("volumecontrol.open: Opening popupwindow at (" 
        + window.innerWidth  / 2 + ", " 
        + window.innerHeight / 2 + ")");

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
