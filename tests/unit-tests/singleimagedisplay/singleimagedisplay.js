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

    asyncTest("Should resize images correctly", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-resize');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-resize');

                // 3
                ok($new_page.hasClass('ui-page-active'), "page active");
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-resize');

                var $image = $new_page.find('#image1');
                $image.bind( "init", function() {
                    var $realImage = $image.siblings("img.ui-singleimagedisplay");
                    var width = $realImage.width();
                    var height = $realImage.height();
                    var imageArea = width*height;
                    var aspectRatio = (imageArea==0)?1.0:(width/height);
                    var imageIsPortrait = aspectRatio>1.0;

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
