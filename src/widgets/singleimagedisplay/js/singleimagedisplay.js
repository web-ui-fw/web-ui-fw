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
 * Authors: Max Waterman <max.waterman@intel.com>
 */

// Displays the given image resizing it to fit its container or the browser
// while maintaining the original aspect ratio.
//
// To make a singleimagedisplay element use the singleimagedisplay() method
// on an img element or add data-role='singleimagedisplay' to an img tag.
//
//     <img data-role="singleimagedisplay" data-src="myimage.jpg" />
//
// Note that you should not set the src on the img directly.
//
// To set the source image, use a data-src attribute on the img. This
// enables the widget to handle loading the image and displaying a
// substitute if the image fails to load.
//
// Options:
//
//    source: String; path to the src for the image; initial value can
//                    be set using data-src on the img element.
//    noContent: String; path to an image to show when an error occurs
//                while loading the image.
//
// Either option can be changed at runtime with the
// singleimagedisplay('option', 'name', 'value') method

(function ($, undefined) {
    $.widget("todons.singleimagedisplay", $.mobile.widget, {
        options: {
            initSelector: 'img:jqmData(role=singleimagedisplay)',
            noContent: null,
            source: null
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
            this.element.trigger( "init" );
        },

        _showNoContents: function () {
            var noContentSrcIsEmpty = (this.options.noContent==null);
            if (noContentSrcIsEmpty) {
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
            this.cover.hide();
            this.imageParent.append(this.cover);

            this.options.source = this.element.jqmData('src');

            // when the image is loaded, resize it
            this.image.load(function () {
                self.usingNoContents = false;
                self.resize( self.image );
                self.image.show();
                self.element.trigger( "init" );
            });

            // when the image fails to load, substitute noContent
            this.image.error( function() {
                self._imageErrorHandler();
                self.element.trigger( "init" );
            } );

            // set the src for the image
            this._setImgSrc();

            // resize the image immediately if it is visible
            if (self.image.is(':visible')) {
                self.resize( self.image );

                this.element.trigger( "init" );
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
                    self.element.trigger( "init" );
                });
            }

            // when the window is resized, resize the image
            $(window).resize( function() {
                if (self.usingNoContents) {
                    self.resize( self.cover );
                } else {
                    self.resize( self.image );
                }
                self.element.trigger( "init" );
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
        }

    });

    // initialise singleimagedisplays with our own singleimagedisplay
    $(document).bind("pagecreate", function(e) {
        $($.todons.singleimagedisplay.prototype.options.initSelector, e.target)
        .singleimagedisplay();
    });

})(jQuery);
