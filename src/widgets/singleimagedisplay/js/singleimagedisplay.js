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
            src: null,
        },

        page: null,
        image: null,
        srcError: false,

        _create: function() {
            var self = this;
            var element = self.element[0];

            this.image = $("<img>");
            this.image.hide();

            // when the image is loaded, resize it
            this.image.load( function() {
                // record that src is valid
                self.srcError = false;

                self.resize();
            });

            // when the image fails to load,
            this.image.error( function() {
                // record that src is not valid
                self.srcError = true;
                self.options.src = undefined;

                // set image src to noContents image
                self.image.attr( 'src', self.options.noContents );

                self.resize();
            });

            // copy attributes from source div into img
            $.each(element.attributes, function(index) {
                var thisAttribute = element.attributes[index];
                self.image.attr(thisAttribute.name, thisAttribute.value);
            });

            // record current src for when it is changed by user
            this.options.src = this.image.attr('src');

            // record error if src has not been defined
            this.srcError = this.options.src===undefined;

            // replace source div with new img
            $(element).replaceWith(this.image);

            // when the page is resized, resize the image
            // note that this widget is created on pagecreate
            this.page = this.image.closest(".ui-page");
            this.page.resize( function() {
                self.resize();
            });

            // when the window is resized, resize the image
            $(window).resize( function() {
                if (self.image.is(':visible')) {
                    self.resize();
                }
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
                    // change the value in options
                    this.options.noContents = value;

                    // if using the noContents, change the src on the
                    // image too
                    if (!this.srcError) {
                        this.image.attr( 'src', this.options.src );
                    }

                    this.resize();
                }
                break;
            case "src":
                if (needToChange) {
                    // change the value in options
                    this.options.src = value;

                    // change the image
                    this.image.attr( 'src', this.options.src );

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
