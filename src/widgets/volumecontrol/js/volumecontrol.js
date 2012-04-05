/*
 * jQuery Mobile Widget @VERSION
 *
 * This software is licensed under the MIT licence (as defined by the OSI at
 * http://www.opensource.org/licenses/mit-license.php)
 *
 * ***************************************************************************
 * Copyright (C) 2011 by Intel Corporation Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 *
 * Authors: Gabriel Schulhof <gabriel.schulhof@intel.com>
 */

// Displays a popup window with a visual volume level indicator
// and a speaker icon.
//
// The volume leven can be adjusted using the 'up', 'down', 'home',
// and 'end' keys. 'home' sets the volume to zero, and 'end' set it
// to maximum.
//
// To apply, add the attribute data-role="volumecontrol" to a <div>
// element inside a page. Alternatively, call volumecontrol()
// on an element (see below).
//
// The following options can be set during construction :
//
//     $("myVolumeControl").volumecontrol({volume:5, basicTone:true, title:"Basic Tone"});
//
// or after using the usual jQuery Mobile method, eg to change the title :
//
//     $("myVolumeControl").volumecontrol("option", "title", "Volume");
//
// Options:
//
//    volume : Integer;the volume level to be displayed
//             (0-15 or 0-7 for basicTone)
//             Default: 0
//
//    basicTone : Boolean; display the "basic tone" volume scale,
//                otherwise display the generic one
//                Default: false
//
//    title : String; the title to display at the top of the popupwindow.
//            Default: 'Volume'
//
// Event:
//     volumechanged: triggered when the user changes the volume.

(function( $, undefined ) {

$.widget( "tizen.volumecontrol", $.tizen.widgetex, {
    options: {
        volume: 0,
        basicTone: false,
        title: "Volume",
        initSelector: ":jqmData(role='volumecontrol')"
    },

    _htmlProto: {
        ui: {
            container: "#volumecontrol",
            volumeImage: "#volumecontrol-indicator",
            bar: "#volumecontrol-bar"
        }
    },

    _value: {
        attr: "data-" + ($.mobile.ns || "") + "volume",
        signal: "volumechanged"
    },

    _create: function() {
        var self = this,
            yCoord = function(volumeImage, e) {
                var target = $(e.target),
                    coords = $.mobile.tizen.targetRelativeCoordsFromEvent(e);

                if (target.hasClass("ui-volumecontrol-level"))
                    coords.y += target.offset().top  - volumeImage.offset().top;

                return coords.y;
            };

          // Crutches for IE: It doesn't understand the background, so it uses the filter to set the background, but if
          // the backgorund is also set, it breaks the filter, so set it to "none"
          if ($.mobile.browser.ie)
            this._ui.container.css("background", "none");
          this._ui.bar.remove();
          this._ui.container.insertBefore(this.element)
                            .popupwindow({overlayTheme: "", fade: false, shadow: false});
          this.element.css("display", "none");

          $.extend (self, {
              _isOpen: false,
              _dragging: false,
              _volumeElemStack: []
          });

          this._ui.container.bind("closed", function(e) {
              self._isOpen = false;
          });

          this._ui.volumeImage.bind("vmousedown", function(e) {
              self._dragging = true;
              self._setVolume((1.0 - yCoord(self._ui.volumeImage, e) / $(this).outerHeight()) * self._maxVolume());
              e.preventDefault();
          });

          this._ui.volumeImage.bind("vmousemove", function(e) {
              if (self._dragging) {
                  self._setVolume((1.0 - yCoord(self._ui.volumeImage, e) / $(this).outerHeight()) * self._maxVolume());
                  e.preventDefault();
              }
          });

          $( document ).bind( "vmouseup", function( e ) {
              if ( self._dragging )
                  self._dragging = false;
          });

          $(document).bind("keydown", function(e) {
              if (self._isOpen) {
                  var maxVolume = self._maxVolume(),
                      newVolume = -1;

                  switch(e.keyCode) {
                      case $.mobile.keyCode.UP:
                      case $.mobile.keyCode.DOWN:
                      case $.mobile.keyCode.HOME:
                      case $.mobile.keyCode.END:
                          e.preventDefault();
                          break;
                  }

                  switch(e.keyCode) {
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

    _setBasicTone: function(value) {
        while (this._volumeElemStack.length > 0)
            this._volumeElemStack.pop().remove();
        this.options.basicTone = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "basic-tone", value);
        this._setVolume(this.options.volume);
    },

    _setTitle: function(value) {
        this.options.title = value;
        this.element.attr("data-" + ($.mobile.ns || "") + "title", value);
        this._ui.container.find("#volumecontrol-title").text(value);
    },

    _setVolume: function(vol) {
        var newVolume = Math.max(0, Math.min(vol, this._maxVolume())),
            theFloor = Math.floor(newVolume),
            emitSignal;

        newVolume = theFloor + (((newVolume - theFloor) > 0.5) ? 1 : 0);

        this.options.volume = newVolume;
        this.element.attr("data-" + ($.mobile.ns || "") + "volume", newVolume);
        this._setVolumeIcon();
        this._setValue(newVolume);
    },

    _maxVolume: function() {
        return (this.options.basicTone ? 7 : 15);
    },

    _setVolumeIcon: function() {
        if (this._volumeElemStack.length === 0) {
            var cxStart = 63, /* FIXME: Do we need a parameter for this (i.e., is this themeable) or is it OK hard-coded? */
                cx = this._ui.volumeImage.width(),
                cy = this._ui.volumeImage.height(),
                cxInc = (cx - cxStart) / this._maxVolume(),
                nDivisions = 2 * this._maxVolume() + 1,
                cyElem = cy / nDivisions,
                yStart = cy - 2 * cyElem,
                dstOffset = this._ui.volumeImage.offset(),
                elem;

            for (var Nix = this._volumeElemStack.length; Nix < this._maxVolume() ; Nix++) {
                elem = this._ui.bar
                    .clone()
                    .css({
                        width: cxStart + Nix * cxInc,
                        height: cyElem
                    })
                    .appendTo(this._ui.volumeImage)
                    .offset({
                        left: dstOffset.left + (cx - (cxStart + Nix * cxInc)) / 2,
                        top:  dstOffset.top + yStart - Nix * 2 * cyElem,
                    });
                this._volumeElemStack.push(elem);
            }
        }
        for (var Nix = 0 ; Nix < this._maxVolume() ; Nix++)
            if (Nix < this.options.volume)
                this._volumeElemStack[Nix].addClass("ui-volumecontrol-level-set");
            else
                this._volumeElemStack[Nix].removeClass("ui-volumecontrol-level-set");
    },

    open: function() {
        if (!this._isOpen) {
            this._setBasicTone(this.options.basicTone);
            this._ui.container.popupwindow("open",
                window.innerWidth  / 2,
                window.innerHeight / 2);

            this._isOpen = true;
        }
    },

    close: function() {
        if (this._isOpen) {
            this._ui.container.popupwindow("close");
            this._isOpen = false;
        }
    }
});

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
    $( $.tizen.volumecontrol.prototype.options.initSelector, e.target )
        .not( ":jqmData(role='none'), :jqmData(role='nojs')" )
        .volumecontrol();
});

})( jQuery );
