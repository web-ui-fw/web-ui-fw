/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Max Waterman <max.waterman@intel.com>
 */

/**
 * Todonssingleimagedisplay modifies the JQuery Mobile singleimagedisplay and is created in the same way.
 *
 * See the JQuery Mobile singleimagedisplay widget for more information :
 *     http://jquerymobile.com/demos/1.0a4.1/docs/forms/forms-singleimagedisplay.html
 *
 * The JQuery Mobile singleimagedisplay option:
 *     theme: specify the theme using the 'data-theme' attribute
 *
 * Options:
 *     theme: string; the theme to use if none is specified using the 'data-theme' attribute
 *            default: 'c'
 *     popupEnabled: boolean; controls whether the popup is displayed or not
 *                   specify if the popup is enabled using the 'data-popupEnabled' attribute
 *                   set from javascript using .todonssingleimagedisplay('option','popupEnabled',newValue)
 *
 * Events:
 *     changed: triggers when the value is changed (rather than when the handle is moved)
 *
 * Examples:
 *
 *     <a href="#" id="popupEnabler" data-role="button" data-inline="true">Enable popup</a>
 *     <a href="#" id="popupDisabler" data-role="button" data-inline="true">Disable popup</a>
 *     <div data-role="fieldcontain">
 *         <input id="mysingleimagedisplay" data-theme='a' data-popupenabled='false' type="range" name="singleimagedisplay" value="7" min="0" max="9" />
 *     </div>
 *     <div data-role="fieldcontain">
 *         <input id="mysingleimagedisplay2" type="range" name="singleimagedisplay" value="77" min="0" max="777" />
 *     </div>
 *
 *     // disable popup from javascript
 *     $('#mysingleimagedisplay').todonssingleimagedisplay('option','popupEnabled',false);
 *
 *     // from buttons
 *     $('#popupEnabler').bind('vclick', function() {
 *         $('#mysingleimagedisplay').todonssingleimagedisplay('option','popupEnabled',true);
 *     });
 *     $('#popupDisabler').bind('vclick', function() {
 *         $('#mysingleimagedisplay').todonssingleimagedisplay('option','popupEnabled',false);
 *     });
 */

(function ($, window, undefined) {
    $.widget("todons.todonssingleimagedisplay", $.mobile.widget, {
        options: {
        },

        image: null,

        _create: function() {
            console.log("MAXMAXMAX/_create()");
            var self  = this,
                div   = self.element[0];

            self.image = $("<img>");

            // when the image is loaded, resize it
            self.image.load( function() {
                console.log("MAXMAXMAX/load");
                self.resize();
            });

            self.image.error( function() {
                console.log("MAXMAXMAX/error");
                self.image.attr( 'src', 'images/avatar.png' );
                self.resize();
            });

            $.each(div.attributes, function(index) {
                var thisAttribute = div.attributes[index];
                self.image.attr(thisAttribute.name, thisAttribute.value);
            });

            $(div).replaceWith(self.image);

            $(document).bind('pageshow', function() {
                // would be better to run this only if the image has loaded successfully
                var imageIsBroken = (self.image.attr('complete') == false || self.image.attr('naturalWidth') == 0 || self.image.attr('readyState') == 'uninitialized' || jQuery.trim(self.image.attr('src')) == '');
                console.log("MAXMAXMAX/imageIsBroken/"+imageIsBroken);
                if (imageIsBroken) {
                    self.image.attr('src','images/avatar.png');
                } else {
                    self.resize();
                }
            });

            // testing the load event - should have a img element with no src attr
            //$(this.element).attr('src','images/singleimage_l.jpg');

            // when the window is resized, resize the image
            $(window).resize( function() { console.log("MAXMAXMAX/resize"); self.resize() } );
        },

        resize: function() {
            console.log("MAXMAXMAX/resize()");
            var finalWidth = 0;
            var finalHeight = 0;
            var realImageWidth = this.image[0].naturalWidth;
            var realImageHeight = this.image[0].naturalHeight;
            var aspectRatio = realImageWidth/realImageHeight;
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight;

            this.image.css( 'width', 'inherit' );
            this.image.css( 'height', 'inherit' );

            var imageWidth = this.image.width();
            var imageHeight = this.image.height();

            var insideContainer = (imageWidth!=realImageWidth) || (imageHeight!=realImageHeight);

            if (insideContainer) {
                finalWidth = imageWidth;
                finalHeight = imageHeight;
            } else {
                finalWidth = windowWidth;
                finalHeight = windowHeight;
            }

            // restore aspect ratio
            if (finalWidth/finalHeight > aspectRatio) {
                finalWidth = finalHeight*aspectRatio;
            } else {
                finalHeight = finalWidth/aspectRatio;
            }

            // assign the final size
            this.image.width( finalWidth );
            this.image.height( finalHeight );
        },

        _setOption: function(key, value) {
            var needToChange = value !== this.options[key];
            switch (key) {
            }
        },

    });


    // replace all img.singleimagedisplay with div to prevent imaging being loaded
//    $(document).bind("pagebeforecreate", function(e) {
//        $(e.target).find('img.singleimagedisplay').each( function() {
//            var attributes = $(this)[0].attributes;
//            var attributeStrings = [];
//            for( var i=0; i<attributes.length; i++ ) {
//                var thisAttribute = attributes[i];
//                var thisAttributeString = thisAttribute.nodeName+"="+thisAttribute.nodeValue;
//                attributeStrings.push( thisAttributeString );
//            }
//            $(this).replaceWith("<div "+attributeStrings.join(" ")+"></div>");
//        });
//    });

    // initialise singleimagedisplays with our own singleimagedisplay
    $(document).bind("pagecreate", function(e) {
        var images = $(e.target).find('div.singleimagedisplay');
        console.log( "MAXMAXMAX/"+images.length );
        images.todonssingleimagedisplay();
    });

})(jQuery, this);
