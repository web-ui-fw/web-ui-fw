/*
 * singleimagedisplay unit tests
 */

(function ($) {

    $.mobile.defaultTransition = "none";

    module("Single Image Display");

    asyncTest("Should create correct markup", function () {
        var pageId = '#singleimagedisplay-test-markup';

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage( pageId );
            },

            function () {
                var $new_page = $( pageId );
                var $image = $new_page.find('#image0');

                var $div = $image.siblings("div");

                ok($div.hasClass('ui-singleimagedisplay-nocontent'), "nocontent div created and classes ok");
                equal($div.css('display'), "none", "nocontent div hidden ok");

                start();
            }
        ]);
    });

    asyncTest("Resize small square image to larger square container", function () {
        var pageId = '#singleimagedisplay-test-resize-smallersquare-to-largersquare';
        var imageId = '#image1';

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage( pageId );
            },

            function () {
                var $new_page = $( pageId );

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $( pageId );

                var $image = $new_page.find( imageId );
                $image.bind( "init", function() {
                    var $realImage = $image.siblings("img.ui-singleimagedisplay");
                    var width = $realImage.width();
                    var height = $realImage.height();
                    var imageArea = width*height;
                    var aspectRatio = (imageArea==0)?1.0:(width/height);
                    var imageIsPortrait = aspectRatio<1.0;

                    var parentWidth = $image.parent().width();
                    var parentHeight = $image.parent().height();
                    var parentLimit = Math.min( parentWidth, parentHeight );

                    // test width/height is same as container
                    if ( imageIsPortrait ) {
                        // height is the limit
                        equal(height, parentLimit, "portrait image height correct");
                    } else {
                        // width is the limit
                        equal(width, parentLimit, "landscape image width correct");
                    }

                    var originalImage = $realImage[0];
                    var originalAspectRatio = originalImage.naturalWidth/originalImage.naturalHeight;

                    // need a fuzzy compare here, it seems
                    equal( Math.round(aspectRatio*10)/10, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Resize large square image to smaller square container", function () {
        var pageId = '#singleimagedisplay-test-resize-largersquare-to-smallersquare';
        var imageId = '#image2';

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage( pageId );
            },

            function () {
                var $new_page = $( pageId );

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $( pageId );

                var $image = $new_page.find( imageId );
                $image.bind( "init", function() {
                    var $realImage = $image.siblings("img.ui-singleimagedisplay");
                    var width = $realImage.width();
                    var height = $realImage.height();
                    var imageArea = width*height;
                    var aspectRatio = (imageArea==0)?1.0:(width/height);
                    var imageIsPortrait = aspectRatio<1.0;

                    var parentWidth = $image.parent().width();
                    var parentHeight = $image.parent().height();
                    var parentLimit = Math.min( parentWidth, parentHeight );

                    // test width/height is same as container
                    if ( imageIsPortrait ) {
                        // height is the limit
                        equal(height, parentLimit, "portrait image height correct");
                    } else {
                        // width is the limit
                        equal(width, parentLimit, "landscape image width correct");
                    }

                    var originalImage = $realImage[0];
                    var originalAspectRatio = originalImage.naturalWidth/originalImage.naturalHeight;

                    // need a fuzzy compare here, it seems
                    equal( Math.round(aspectRatio*10)/10, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Resize large landscape image to smaller square container", function () {
        var pageId = '#singleimagedisplay-test-resize-largelandscape-to-smallersquare';
        var imageId = '#image3';

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage( pageId );
            },

            function () {
                var $new_page = $( pageId );

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $( pageId );

                var $image = $new_page.find( imageId );
                $image.bind( "init", function() {
                    var $realImage = $image.siblings("img.ui-singleimagedisplay");
                    var width = $realImage.width();
                    var height = $realImage.height();
                    var imageArea = width*height;
                    var aspectRatio = (imageArea==0)?1.0:(width/height);
                    var imageIsPortrait = aspectRatio<1.0;

                    var parentWidth = $image.parent().width();
                    var parentHeight = $image.parent().height();
                    var parentLimit = Math.min( parentWidth, parentHeight );

                    // test width/height is same as container
                    if ( imageIsPortrait ) {
                        // height is the limit
                        equal(height, parentLimit, "portrait image height correct");
                    } else {
                        // width is the limit
                        equal(width, parentLimit, "landscape image width correct");
                    }

                    var originalImage = $realImage[0];
                    var originalAspectRatio = originalImage.naturalWidth/originalImage.naturalHeight;

                    // need a fuzzy compare here, it seems
                    equal( Math.round(aspectRatio*10)/10, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Resize large portrait image to smaller square container", function () {
        var pageId = '#singleimagedisplay-test-resize-largerportrait-to-smallersquare';
        var imageId = '#image4';

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage( pageId );
            },

            function () {
                var $new_page = $( pageId );

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $( pageId );

                var $image = $new_page.find( imageId );
                $image.bind( "init", function() {
                    var $realImage = $image.siblings("img.ui-singleimagedisplay");
                    var width = $realImage.width();
                    var height = $realImage.height();
                    var imageArea = width*height;
                    var aspectRatio = (imageArea==0)?1.0:(width/height);
                    var imageIsPortrait = aspectRatio<1.0;

                    var parentWidth = $image.parent().width();
                    var parentHeight = $image.parent().height();
                    var parentLimit = Math.min( parentWidth, parentHeight );

                    // test width/height is same as container
                    if ( imageIsPortrait ) {
                        // height is the limit
                        equal(height, parentLimit, "portrait image height correct");
                    } else {
                        // width is the limit
                        equal(width, parentLimit, "landscape image width correct");
                    }

                    var originalImage = $realImage[0];
                    var originalAspectRatio = originalImage.naturalWidth/originalImage.naturalHeight;

                    // need a fuzzy compare here, it seems
                    equal( Math.round(aspectRatio*10)/10, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Resize small landscape image to larger square container", function () {
        var pageId = '#singleimagedisplay-test-resize-smallerlandscape-to-largersquare';
        var imageId = '#image5';

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage( pageId );
            },

            function () {
                var $new_page = $( pageId );

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $( pageId );

                var $image = $new_page.find( imageId );
                $image.bind( "init", function() {
                    var $realImage = $image.siblings("img.ui-singleimagedisplay");
                    var width = $realImage.width();
                    var height = $realImage.height();
                    var imageArea = width*height;
                    var aspectRatio = (imageArea==0)?1.0:(width/height);
                    var imageIsPortrait = aspectRatio<1.0;

                    var parentWidth = $image.parent().width();
                    var parentHeight = $image.parent().height();
                    var parentLimit = Math.min( parentWidth, parentHeight );

                    // test width/height is same as container
                    if ( imageIsPortrait ) {
                        // height is the limit
                        equal(height, parentLimit, "portrait image height correct");
                    } else {
                        // width is the limit
                        equal(width, parentLimit, "landscape image width correct");
                    }

                    var originalImage = $realImage[0];
                    var originalAspectRatio = originalImage.naturalWidth/originalImage.naturalHeight;

                    // need a fuzzy compare here, it seems
                    equal( Math.round(aspectRatio*10)/10, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Broken image displays default broken image sized to container", function () {
        var pageId = '#singleimagedisplay-test-default-broken';
        var imageId = '#image6';

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage( pageId );
            },

            function () {
                var $new_page = $( pageId );

                var $image = $new_page.find( imageId );

                $image.bind( "init", function() {
                    var $siblings = $image.siblings();
                    var $div = $siblings.filter("div.ui-singleimagedisplay-nocontent").first();
                    ok($div.css("background-image")!="none", "background image not none");

                    var $realImage = $siblings.filter("img.ui-singleimagedisplay");
                    equal($realImage.length, 0, "real image is empty");

                    var width = $div.width();
                    var height = $div.height();

                    var parentWidth = $image.parent().width();
                    var parentHeight = $image.parent().height();

                    equal( width, parentWidth, "background image fills container width" );
                    equal( height, parentHeight, "background image fills container height" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(4); start(); }

        ]);

    });

    asyncTest("Broken image displays custom broken image sized to container", function () {
        var pageId = '#singleimagedisplay-test-custom-broken';
        var imageId = '#image7';

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage( pageId );
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-custom-broken');
                var $customSrc = 'images/noContent-2.png';

                var $image = $new_page.find( imageId );

                $image.bind( "init", function() {
                    var $siblings = $image.siblings();
                    var $div = $siblings.filter("div.ui-singleimagedisplay-nocontent").first();
                    ok(!$div.is(':visible'), "background div hidden");

                    var $realImage = $siblings.filter("img.ui-singleimagedisplay");
                    equal($realImage.length, 1, "real image is attached");
                    equal($realImage.attr('src'), $customSrc, "real image has correct customer src");

                    var width = $realImage.width();
                    var height = $realImage.height();

                    var parentWidth = $image.parent().width();
                    var parentHeight = $image.parent().height();

                    equal( width, parentWidth, "background image fills container width" );
                    equal( height, parentHeight, "background image fills container height" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay({'noContent':$customSrc});
            },

            function () { expect(5); start(); }

        ]);

    });

// WINDOW TESTS

    asyncTest("Resize small square image to window", function () {
        var pageId = '#singleimagedisplay-test-resize-smallersquare-to-window';
        var imageId = '#image8';

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage( pageId );
            },

            function () {
                var $new_page = $( pageId );

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $( pageId );

                var $image = $new_page.find( imageId );
                $image.bind( "init", function() {

                    var $realImage = $image.siblings("img.ui-singleimagedisplay");
                    var width = $realImage.width();
                    var height = $realImage.height();
                    var imageArea = width*height;
                    var aspectRatio = (imageArea==0)?1.0:(width/height);
                    var imageIsPortrait = aspectRatio<1.0;

                    var parentWidth = window.innerWidth;
                    var parentHeight = window.innerHeight;
                    var parentLimit = Math.min( parentWidth, parentHeight );

                    // test width/height is same as container
                    if ( imageIsPortrait ) {
                        // height is the limit
                        equal(height, parentLimit, "portrait image height correct");
                    } else {
                        // width is the limit
                        equal(width, parentLimit, "landscape image width correct");
                    }

                    var originalImage = $realImage[0];
                    var originalAspectRatio = originalImage.naturalWidth/originalImage.naturalHeight;

                    // need a fuzzy compare here, it seems
                    equal( Math.round(aspectRatio*10)/10, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
                $image.singleimagedisplay( 'option', 'source', "images/singleimage_sm_s.jpg" );

            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Resize large square image to window", function () {
        var pageId = "#singleimagedisplay-test-resize-largersquare-to-window";
        var imageId = '#image9';

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage( pageId );
            },

            function () {
                var $new_page = $( pageId );

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $( pageId );

                var $image = $new_page.find( imageId );
                ok( $image, imageId+" found" );
                $image.bind( "init", function() {
                    var $realImage = $image.siblings("img.ui-singleimagedisplay");
                    var width = $realImage.width();
                    var height = $realImage.height();
                    var imageArea = width*height;
                    var aspectRatio = (imageArea==0)?1.0:(width/height);
                    var imageIsPortrait = aspectRatio<1.0;

                    var parentWidth = window.innerWidth;
                    var parentHeight = window.innerHeight;
                    var parentLimit = Math.min( parentWidth, parentHeight );

                    // test width/height is same as container
                    if ( imageIsPortrait ) {
                        // height is the limit
                        equal(height, parentLimit, "portrait image height correct");
                    } else {
                        // width is the limit
                        equal(width, parentLimit, "landscape image width correct");
                    }

                    var originalImage = $realImage[0];
                    var originalAspectRatio = originalImage.naturalWidth/originalImage.naturalHeight;

                    // need a fuzzy compare here, it seems
                    equal( Math.round(aspectRatio*10)/10, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
                $image.singleimagedisplay( 'option', 'source', "images/singleimage_s.jpg" );
            },

            function () { expect(4); start(); }

        ]);

    });

    asyncTest("Resize large landscape image to window", function () {
        var pageId = "#singleimagedisplay-test-resize-largelandscape-to-window";
        var imageId = '#image10';

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage( pageId );
            },

            function () {
                var $new_page = $( pageId );

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $( pageId );

                var $image = $new_page.find( imageId );
                $image.bind( "init", function() {
                    var $realImage = $image.siblings("img.ui-singleimagedisplay");
                    var width = $realImage.width();
                    var height = $realImage.height();
                    var imageArea = width*height;
                    var aspectRatio = (imageArea==0)?1.0:(width/height);

                    var parentWidth = window.innerWidth;
                    var parentHeight = window.innerHeight;
                    var parentAspectRatio = parentWidth/parentHeight;

                    // test width/height is same as container
                    if ( parentAspectRatio>aspectRatio ) {
                        // height is the limit
                        equal(height, parentHeight, "portrait image height correct");
                    } else {
                        // width is the limit
                        equal(width, parentWidth, "landscape image width correct");
                    }

                    var originalImage = $realImage[0];
                    var originalAspectRatio = originalImage.naturalWidth/originalImage.naturalHeight;

                    equal( Math.round(aspectRatio), originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
                $image.singleimagedisplay( 'option', 'source', "images/singleimage_l.jpg" );
            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Resize large portrait image to window", function () {
        var pageId = "#singleimagedisplay-test-resize-largerportrait-to-window";
        var imageId = '#image11';

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage( pageId );
            },

            function () {
                var $new_page = $( pageId );

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $( pageId );

                var $image = $new_page.find( imageId );
                $image.bind( "init", function() {
                    var $realImage = $image.siblings("img.ui-singleimagedisplay");
                    var width = $realImage.width();
                    var height = $realImage.height();
                    var imageArea = width*height;
                    var aspectRatio = (imageArea==0)?1.0:(width/height);

                    var parentWidth = window.innerWidth;
                    var parentHeight = window.innerHeight;
                    var parentAspectRatio = parentWidth/parentHeight;

                    // test width/height is same as container
                    if ( parentAspectRatio>aspectRatio ) {
                        // height is the limit
                        equal(height, parentHeight, "portrait image height correct");
                    } else {
                        // width is the limit
                        equal(width, parentWidth, "landscape image width correct");
                    }

                    var originalImage = $realImage[0];
                    var originalAspectRatio = originalImage.naturalWidth/originalImage.naturalHeight;

                    // need a fuzzy compare here, it seems
                    equal( Math.round(aspectRatio*10)/10, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
                $image.singleimagedisplay( 'option', 'source', "images/singleimage_p.jpg" );
            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Resize small landscape image to window", function () {
        var pageId = "#singleimagedisplay-test-resize-smallerlandscape-to-window";
        var imageId = '#image12';

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage( pageId );
            },

            function () {
                var $new_page = $( pageId );

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $( pageId );

                var $image = $new_page.find( imageId );
                $image.bind( "init", function() {
                    var $realImage = $image.siblings("img.ui-singleimagedisplay");
                    var width = $realImage.width();
                    var height = $realImage.height();
                    var imageArea = width*height;
                    var aspectRatio = (imageArea==0)?1.0:(width/height);

                    var parentWidth = window.innerWidth;
                    var parentHeight = window.innerHeight;
                    var parentAspectRatio = parentWidth/parentHeight;

                    // test width/height is same as container
                    if ( parentAspectRatio>aspectRatio ) {
                        // height is the limit
                        equal(height, parentHeight, "portrait image height correct");
                    } else {
                        // width is the limit
                        equal(width, parentWidth, "landscape image width correct");
                    }

                    var originalImage = $realImage[0];
                    var originalAspectRatio = originalImage.naturalWidth/originalImage.naturalHeight;

                    equal( Math.round(aspectRatio), originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
                $image.singleimagedisplay( 'option', 'source', "images/singleimage_sm_l.jpg" );
            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Broken image displays default broken image sized to window", function () {
        var pageId = "#singleimagedisplay-test-default-broken-window";
        var imageId = '#image13';

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage( pageId );
            },

            function () {
                var $new_page = $( pageId );

                var $image = $new_page.find( imageId );

                $image.bind( "init", function() {
                    var $siblings = $image.siblings();
                    var $div = $siblings.filter("div.ui-singleimagedisplay-nocontent").first();
                    ok($div.css("background-image")!="none", "background image not none");

                    var $realImage = $siblings.filter("img.ui-singleimagedisplay");
                    equal($realImage.length, 0, "real image is empty");

                    var width = $div.width();
                    var height = $div.height();
                    var imageArea = width*height;
                    var aspectRatio = (imageArea==0)?1.0:(width/height);

                    var parentWidth = window.innerWidth;
                    var parentHeight = window.innerHeight;
                    var parentAspectRatio = parentWidth/parentHeight;

                    // test width/height is same as container
                    if ( parentAspectRatio>aspectRatio ) {
                        // height is the limit - should be square
                        equal(height, parentHeight, "background image height correct");
                        equal(width, parentHeight, "background image height correct");
                    } else {
                        // width is the limit - should be square
                        equal(width, parentWidth, "background image width correct");
                        equal(height, parentWidth, "background image width correct");
                    }

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(4); start(); }

        ]);

    });

    asyncTest("Broken image displays custom broken image sized to window", function () {
        var pageId = "#singleimagedisplay-test-custom-broken-window";
        var imageId = '#image14';

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage( pageId );
            },

            function () {
                var $new_page = $( pageId );
                var $customSrc = 'images/noContent-2.png';

                var $image = $new_page.find( imageId );

                $image.bind( "init", function() {
                    var $siblings = $image.siblings();
                    var $div = $siblings.filter("div.ui-singleimagedisplay-nocontent").first();
                    ok(!$div.is(':visible'), "background div hidden");

                    var $realImage = $siblings.filter("img.ui-singleimagedisplay");
                    equal($realImage.length, 1, "real image is attached");
                    equal($realImage.attr('src'), $customSrc, "real image has correct customer src");

                    var width = $realImage.width();
                    var height = $realImage.height();
                    var imageArea = width*height;
                    var aspectRatio = (imageArea==0)?1.0:(width/height);

                    var parentWidth = window.innerWidth;
                    var parentHeight = window.innerHeight;
                    var parentAspectRatio = parentWidth/parentHeight;

                    // test width/height is same as container
                    if ( parentAspectRatio>aspectRatio ) {
                        // height is the limit - should be square
                        equal(height, parentHeight, "background image height correct");
                        equal(width, parentHeight, "background image height correct");
                    } else {
                        // width is the limit - should be square
                        equal(width, parentWidth, "background image width correct");
                        equal(height, parentWidth, "background image width correct");
                    }

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay({'noContent':$customSrc});
            },

            function () { expect(5); start(); }

        ]);

    });

})(jQuery);
