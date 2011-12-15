/*
 * singleimagedisplay unit tests
 */

(function ($) {

    $.mobile.defaultTransition = "none";

    module("Single Image Display");

    asyncTest("Should create correct markup", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-markup');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-markup');
                var $image = $new_page.find('#image0');

                var $div = $image.siblings("div");

                ok($div.hasClass('ui-singleimagedisplay-nocontent'), "nocontent div created and classes ok");
                equal($div.css('display'), "none", "nocontent div hidden ok");

                start();
            }
        ]);
    });

    asyncTest("Resize small square image to larger square container", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-resize-smallersquare-to-largersquare');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-resize-smallersquare-to-largersquare');

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-resize-smallersquare-to-largersquare');

                var $image = $new_page.find('#image1');
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

                    equal( aspectRatio, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Resize large square image to smaller square container", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-resize-largersquare-to-smallersquare');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-resize-largersquare-to-smallersquare');

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-resize-largersquare-to-smallersquare');

                var $image = $new_page.find('#image2');
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

                    equal( aspectRatio, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Resize large landscape image to smaller square container", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-resize-largelandscape-to-smallersquare');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-resize-largelandscape-to-smallersquare');

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-resize-largelandscape-to-smallersquare');

                var $image = $new_page.find('#image3');
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

                    equal( aspectRatio, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Resize large portrait image to smaller square container", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-resize-largerportrait-to-smallersquare');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-resize-largerportrait-to-smallersquare');

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-resize-largerportrait-to-smallersquare');

                var $image = $new_page.find('#image4');
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

                    equal( aspectRatio, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Resize small landscape image to larger square container", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-resize-smallerlandscape-to-largersquare');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-resize-smallerlandscape-to-largersquare');

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-resize-smallerlandscape-to-largersquare');

                var $image = $new_page.find('#image5');
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

                    equal( aspectRatio, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Broken image displays default broken image sized to container", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-default-broken');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-default-broken');

                var $image = $new_page.find('#image6');

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

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-custom-broken');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-custom-broken');
                var $customSrc = 'images/noContent-2.png';

                var $image = $new_page.find('#image7');

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

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-window-is-container');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-window-is-container');

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-window-is-container');

                var $image = $new_page.find('#image8');
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

                    equal( aspectRatio, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
                $image.singleimagedisplay( 'option', 'source', "images/singleimage_sm_s.jpg" );

            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Resize large square image to window", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-window-is-container');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-window-is-container');

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-window-is-container');

                var $image = $new_page.find('#image8');
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

                    equal( aspectRatio, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
                $image.singleimagedisplay( 'option', 'source', "images/singleimage_s.jpg" );
            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Resize large landscape image to window", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-window-is-container');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-window-is-container');

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-window-is-container');

                var $image = $new_page.find('#image8');
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

                    equal( aspectRatio, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
                $image.singleimagedisplay( 'option', 'source', "images/singleimage_l.jpg" );
            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Resize large portrait image to window", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-window-is-container');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-window-is-container');

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-window-is-container');

                var $image = $new_page.find('#image8');
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

                    equal( aspectRatio, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
                $image.singleimagedisplay( 'option', 'source', "images/singleimage_p.jpg" );
            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Resize small landscape image to window", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-window-is-container');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-window-is-container');

                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-window-is-container');

                var $image = $new_page.find('#image8');
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

                    equal( aspectRatio, originalAspectRatio, "aspect ratio correct" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
                $image.singleimagedisplay( 'option', 'source', "images/singleimage_sm_l.jpg" );
            },

            function () { expect(3); start(); }

        ]);

    });

    asyncTest("Broken image displays default broken image sized to window", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-window-is-container');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-window-is-container');

                var $image = $new_page.find('#image8');

                $image.bind( "init", function() {
                    var $siblings = $image.siblings();
                    var $div = $siblings.filter("div.ui-singleimagedisplay-nocontent").first();
                    ok($div.css("background-image")!="none", "background image not none");

                    var $realImage = $siblings.filter("img.ui-singleimagedisplay");
                    equal($realImage.length, 0, "real image is empty");

                    var width = $div.width();
                    var height = $div.height();

                    var parentWidth = window.innerWidth;
                    var parentHeight = window.innerHeight;

                    equal( width, parentWidth, "background image fills container width" );
                    equal( height, parentHeight, "background image fills container height" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(4); start(); }

        ]);

    });

    asyncTest("Broken image displays custom broken image sized to window", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-window-is-container');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-window-is-container');
                var $customSrc = 'images/noContent-2.png';

                var $image = $new_page.find('#image8');

                $image.bind( "init", function() {
                    var $siblings = $image.siblings();
                    var $div = $siblings.filter("div.ui-singleimagedisplay-nocontent").first();
                    ok(!$div.is(':visible'), "background div hidden");

                    var $realImage = $siblings.filter("img.ui-singleimagedisplay");
                    equal($realImage.length, 1, "real image is attached");
                    equal($realImage.attr('src'), $customSrc, "real image has correct customer src");

                    var width = $realImage.width();
                    var height = $realImage.height();

                    var parentWidth = window.innerWidth;
                    var parentHeight = window.innerHeight;

                    equal( width, parentWidth, "background image fills container width" );
                    equal( height, parentHeight, "background image fills container height" );

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay({'noContent':$customSrc});
            },

            function () { expect(5); start(); }

        ]);

    });

})(jQuery);
