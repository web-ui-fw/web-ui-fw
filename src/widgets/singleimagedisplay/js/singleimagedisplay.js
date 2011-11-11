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
 *    source: String; path to the src for the image; initial value can
 *                    be set using data-src on the img element.
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
            noContent: null,
            source: null,
        },

        image: null,
        imageParent: null,
        cover: null,
        usingNoContents: false,

        _setImgSrc: function () {
            if (this.usingNoContents) {
                this._showNoContents();
            } else {
                var self = this;
                // if there is a source image, show it
                this.image.attr('src', this.options.source);
                this.image.error( function() { self._imageErrorHandler() } );
                this.cover.hide();
                this.imageParent.append(this.image);
                this.image.show();
            }
        },

        _imageErrorHandler: function () {
            this.usingNoContents = true;
            this._showNoContents();
        },

        _showNoContents: function () {
            if (!this.options.noContent) {
                this.resize( this.cover );

                this.image.detach();
                this.cover.show();
            }
            else {
                // unbind the error handler, otherwise we could
                // get into an infinite loop if the custom noContent
                // image is missing too
                this.image.unbind('error');

                this.image.attr('src', this.options.noContent);
                this.cover.hide();
                this.imageParent.append(this.image);
                this.resize( this.image );
                this.image.show();
            }
        },

        _create: function() {
            var self = this;

            // make a copy of image element
            this.image = this.element.clone()
                .removeAttr('data-role')
                .removeAttr('id')
                .addClass('ui-singleimagedisplay')
                .css('float','left'); // so the cover overlays the image
            this.imageParent = this.element.parent();

            this.element.css('float','left'); // so the cover overlays the other elements

            this.cover = ($('<div class="ui-singleimagedisplay-nocontent"/>'));
            this.cover.hide(); //this.cover.css('visibility','hidden');
            this.imageParent.append(this.cover);

            this.options.source = this.element.jqmData('src');

            // when the image is loaded, resize it
            this.image.load(function () {
                self.usingNoContents = false;
                self.resize( self.image );
                self.image.show();
            });

            // when the image fails to load, substitute noContent
            this.image.error( function() { self._imageErrorHandler() } );

            // set the src for the image
            this._setImgSrc();

            // resize the image immediately if it is visible
            if (self.image.is(':visible')) {
                self.resize( self.image );
            }

            // when the page is shown, resize the image
            // note that this widget is created on pagecreate
            var page = this.element.closest('.ui-page');
            if (page) {
                page.bind('pageshow', function() {
                    if (self.usingNoContents) {
                        self.resize( self.cover );
                    } else {
                        self.resize( self.image );
                    }
                });
            }

            // when the window is resized, resize the image
            $(window).resize( function() {
                if (self.usingNoContents) {
                    self.resize( self.cover );
                } else {
                    self.resize( self.image );
                }
            });
        },

        resize: function(elementToResize) {
            var finalWidth  = 0;
            var finalHeight = 0;

            var measuringImg = $('<img/>')
                .css( 'width', '0px' )
                .css( 'height', '0px' )
                .css( 'opacity', '0' )
                .css( 'width', 'inherit' )
                .css( 'height', 'inherit' )
                .insertAfter(elementToResize);

            var elementIsImage = elementToResize[0].nodeName==="IMG";
            var realImageWidth  =
                (elementIsImage?
                 elementToResize[0].naturalWidth
                 :elementToResize.width());
            var realImageHeight =
                (elementIsImage?
                 elementToResize[0].naturalHeight
                 :elementToResize.height());
            var realImageArea = realImageWidth*realImageHeight;
            var realImageAspectRatio =
                (realImageArea==0)?1.0:
                (realImageWidth/realImageHeight);

            var windowWidth  = window.innerWidth;
            var windowHeight = window.innerHeight;

            var measuringImageWidth = measuringImg.width();
            var measuringImageHeight = measuringImg.height();

            measuringImg.remove();

            var insideContainer = (measuringImageWidth>0) || (measuringImageHeight>0);

            if (insideContainer) {
                finalWidth = measuringImageWidth;
                finalHeight = measuringImageHeight;
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
            elementToResize.width( finalWidth );
            elementToResize.height( finalHeight );
        },

        _setOption: function(key, value) {
            if (value == this.options[key]) {
                return;
            }

            switch (key) {
            case "noContent":
                this.options.noContent = value;
                this._setImgSrc();
                break;
            case "source":
                this.options.source = value;
                this.usingNoContents = false;
                this._setImgSrc();
                this.resize( this.image );
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
