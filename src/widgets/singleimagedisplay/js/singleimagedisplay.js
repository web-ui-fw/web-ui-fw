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
 * To make a singleimagedisplay element use the singleimagedisplay() method
 * on an img element or add data-role='singleimagedisplay' to an img tag.
 *
 *     <img data-role="singleimagedisplay" data-src="myimage.jpg" />
 *
 * Note that you should not set the src on the img directly.
 *
 * To set the source image, use a data-src attribute on the img. This
 * enables the widget to handle loading the image and displaying a
 * substitute if the image fails to load.
 *
 * Options:
 *
 *    src: String; path to the src for the image; initial value can
 *                 be set using data-src on the img element.
 *    noContent: String; path to an image to show when an error occurs
 *                while loading the image.
 *
 * Either option can be changed at runtime with the
 * singleimagedisplay('option', 'name', 'value') method
 */

(function ($, undefined) {
    $.widget("todons.singleimagedisplay", $.mobile.widget, {
        options: {
            initSelector: 'img:jqmData(role=singleimagedisplay)',
            noContent: "images/noContent.png",
            src: null,
        },

        page: null,
        image: null,
        usingNoContent: false,

        _setImgSrc: function () {
            this.image.attr('src', this.options.src);
        },

        _create: function() {
            var self = this;
            this.image = this.element;

            this.options.src = this.image.jqmData('src') || this.options.noContent;

            this.image.addClass('singleimagedisplay');
            this.image.hide();

            // when the image is loaded, resize it
            this.image.load( function() {
                self.resize();
            });

            // when the image fails to load, substitute noContent
            this.image.error( function() {
                // record that src is not valid
                self.usingNoContent = true;
                self.options.src = undefined;

                // set image src to noContent image
                self.image.attr( 'src', self.options.noContent );
                self.resize();
            });

            // record error if src has not been defined
            this.usingNoContent = this.options.src===undefined;

            // set the src for the image
            this._setImgSrc();

            // resize the image immediately if it is visible
            if (self.image.is(':visible')) {
                self.resize();
            }

            // when the page is shown, resize the image
            // note that this widget is created on pagecreate
            this.page = this.image.closest('.ui-page');
            if (this.page) {
                this.page.bind('pageshow', function() {
                    self.resize();
                });
            }

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
            if (value == this.options[key]) {
                return;
            }

            switch (key) {
            case "noContent":
                this.options.noContent = value;

                if (this.usingNoContent) {
                    this.image.attr( 'src', this.options.noContent );
                }
                break;
            case "src":
                this.options.src = value;

                if (this.options.src === undefined) {
                    if (!this.usingNoContent) {
                        this.usingNoContent = true;
                        this.image.attr( 'src', this.options.noContent );
                    }
                } else {
                    // trigger a load attempt - error handler will
                    // deal with failed load
                    this.usingNoContent = false;
                    this._setImgSrc();
                }
                this.resize();
                break;
            default:
                break;
            }
        },

    });

    // initialise singleimagedisplays with our own singleimagedisplay
    $(document).bind("pagecreate", function(e) {
        $($.todons.singleimagedisplay.prototype.options.initSelector, e.target)
        .singleimagedisplay();
    });

})(jQuery);
