/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Max Waterman <max.waterman@intel.com>
 */

/**
 * Displays the given image resizing it to fit its container or the browser
 * while maintaining the original aspect ratio.
 *
 * To make a singleimagedisplay element use the todonssingleimagedisplay() method on a div
 * or by adding the 'singleimagedisplay' class to a div element. Other attributes typical
 * for an img element can also be added, most notably the src attribute :
 *
 *     <div class="singleimagedisplay" src="myimage.jpg">
 *
 * Options:
 *
 *    noContents: String; path to an image to show when an error occurs while loading
 *                the image.
 */

(function ($, undefined) {
    $.widget("todons.todonssingleimagedisplay", $.mobile.widget, {
        options: {
            initSelector: '.singleimagedisplay',
            noContents: "images/noContent.png",
        },

        image: null,

        _create: function() {
            var self = this,
                element = self.element[0];

            self.image = $("<img>");
            self.image.hide();

            // when the image is loaded, resize it
            self.image.load( function() {
                self.resize();
            });

            // when the image fails to load, substitute noContents
            self.image.error( function() {
                self.image.attr( 'src', self.options.noContents );
                self.resize();
            });

            $.each(element.attributes, function(index) {
                var thisAttribute = element.attributes[index];
                self.image.attr(thisAttribute.name, thisAttribute.value);
            });

            $(element).replaceWith(self.image);

            // when the page is shown, resize the image
            // note that this widget is created on pagecreate
            $(document).bind('pageshow', function() {
                self.resize();
            });

            // when the window is resized, resize the image
            $(window).resize( function() {
                self.resize()
            });
        },

        resize: function() {
            var finalWidth  = 0;
            var finalHeight = 0;

            var realImageWidth       = this.image[0].naturalWidth;
            var realImageHeight      = this.image[0].naturalHeight;
            var realImageAspectRatio = realImageWidth/realImageHeight;

            var windowWidth  = window.innerWidth;
            var windowHeight = window.innerHeight;

            // hide while we use the fiddle with the images dimensions
            this.image.hide();

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
            if (finalWidth/finalHeight > realImageAspectRatio) {
                finalWidth = finalHeight*realImageAspectRatio;
            } else {
                finalHeight = finalWidth/realImageAspectRatio;
            }

            // assign the final size
            this.image.width( finalWidth );
            this.image.height( finalHeight );

            // show the image now it has been resized
            this.image.show();
        },

        _setOption: function(key, value) {
            var needToChange = value !== this.options[key];

            switch (key) {
            case "noContents":
                if (needToChange) {
                    this.options.noContents = value;
                    self.image.attr( 'src', this.options.noContents );
                    this.resize();
                }
                break;
            default:
                break;
            }
        },

    });

    // initialise singleimagedisplays with our own singleimagedisplay
    $(document).bind("pagecreate", function(e) {
        $($.todons.todonssingleimagedisplay.prototype.options.initSelector, e.target)
        .todonssingleimagedisplay();
    });

})(jQuery);
