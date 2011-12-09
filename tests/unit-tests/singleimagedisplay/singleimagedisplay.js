/*
 * singleimagedisplay unit tests
 */

(function ($) {

    $.mobile.defaultTransition = "none";

    module("Single Image Display");

    asyncTest("", function () {

        $.testHelper.pageSequence([

            function () {
                $.testHelper.openPage('#singleimagedisplay-test-0');
            },

            function () {
                var $new_page = $('#singleimagedisplay-test-0');

                // 1
                ok($new_page.hasClass('ui-page-active'));

                var image = $new_page.find('#image0');
                image.bind( "ready", function() {
                    var width = image.width();
                    var height = image.height();
                    var imageArea = width*height;
                    var aspectRatio = (imageArea==0)?1.0:(width/height);
                    var imageIsPortrait = aspectRatio>1.0;
                    console.log( "MAXMAXMAX/"+height );
                    console.log( "MAXMAXMAX/"+width );
                    console.log( "MAXMAXMAX/"+aspectRatio );
                    console.log( "MAXMAXMAX/"+imageIsPortrait );

                    // 2: test width/height is same as container
                    if ( imageIsPortrait ) {
                        // height is the limit
                        equal(height, 100);
                    } else {
                        // width is the limit
                        equal(width, 100);
                    }
                });
            },

            function () { expect(2); start(); }

        ]);

    });

})(jQuery);
