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

                // 1
                ok($div.hasClass('ui-singleimagedisplay-nocontent'), "nocontent div created and classes ok");
                // 2
                ok($div.css('display')=="none", "nocontent div hidden ok");

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

                // 3
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

                    // 4: test width/height is same as container
                    if ( imageIsPortrait ) {
                        // height is the limit
                        equal(height, parentHeight, "portrait image height correct");
                    } else {
                        // width is the limit
                        equal(width, parentWidth, "landscape image width correct");
                    }

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(2); start(); }

        ]);

    });

    asyncTest("Resize large square image to smaller square container", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-resize-largersquare-to-smallersquare');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-resize-largersquare-to-smallersquare');

                // 3
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

                    // 4: test width/height is same as container
                    if ( imageIsPortrait ) {
                        // height is the limit
                        equal(height, parentHeight, "portrait image height correct");
                    } else {
                        // width is the limit
                        equal(width, parentWidth, "landscape image width correct");
                    }

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(2); start(); }

        ]);

    });

    asyncTest("Resize large landscape image to smaller square container", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-resize-largelandscape-to-smallersquare');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-resize-largelandscape-to-smallersquare');

                // 3
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

                    // 4: test width/height is same as container
                    if ( imageIsPortrait ) {
                        // height is the limit
                        equal(height, parentHeight, "portrait image height correct");
                    } else {
                        // width is the limit
                        equal(width, parentWidth, "landscape image width correct");
                    }

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(2); start(); }

        ]);

    });

    asyncTest("Resize large portrait image to smaller square container", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-resize-largerportrait-to-smallersquare');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-resize-largerportrait-to-smallersquare');

                // 3
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

                    // 4: test width/height is same as container
                    if ( imageIsPortrait ) {
                        // height is the limit
                        equal(height, parentHeight, "portrait image height correct");
                    } else {
                        // width is the limit
                        equal(width, parentWidth, "landscape image width correct");
                    }

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(2); start(); }

        ]);

    });

    asyncTest("Resize small landscape image to larger square container", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-resize-smallerlandscape-to-largersquare');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-resize-smallerlandscape-to-largersquare');

                // 3
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

                    // 4: test width/height is same as container
                    if ( imageIsPortrait ) {
                        // height is the limit
                        equal(height, parentHeight, "portrait image height correct");
                    } else {
                        // width is the limit
                        equal(width, parentWidth, "landscape image width correct");
                    }

                    $image.unbind( "init" );
                });

                $image.singleimagedisplay();
            },

            function () { expect(2); start(); }

        ]);

    });

})(jQuery);
