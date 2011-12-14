/*
 * Progressbar unit tests
 */
(function ($) {
    $.mobile.defaultTransition = "none";

    module("Progressbar");

    asyncTest("Should set options from data-options", function () {
        $.testHelper.pageSequence([

        function () {
            $.testHelper.openPage('#progressbar-test-options');
        }, 
        function () {
            var $new_page = $('#progressbar-test-options');

            // test default options set
            var defaultPb = $new_page.find('#progressbar-test-options-default');
            equal(defaultPb.progressbar('option', 'value'), 0);
            equal(defaultPb.progressbar('option', 'max'), 100);
            equal(defaultPb.progressbar('option', 'theme'), 'b');

            // test custom options set
            var customPb = $new_page.find('#progressbar-test-options-custom');
            equal(customPb.progressbar('option', 'value'), 5);
            equal(customPb.progressbar('option', 'max'), 80);
            equal(customPb.progressbar('option', 'theme'), 'a');

            // test data-theme attribute - should override data-options
            var themedPb = $new_page.find('#progressbar-test-theme-attr');
            equal(themedPb.progressbar('option', 'theme'), 'c');

            start();
        }]);
    });

    asyncTest("Test value", function () {
        $.testHelper.pageSequence([

        function () {
            $.testHelper.openPage('#progressbar-test-value');
        }, 
        function () {
            var $new_page = $('#progressbar-test-value');
            var valuePb = $new_page.find('#progressbar-test-value-div');
            equal(valuePb.progressbar('value'), 0);
            valuePb.progressbar('value', 15);
            equal(valuePb.progressbar('value'), 15);

            // testing markup
            ok(valuePb.find('.ui-progressbar'));
            ok(valuePb.find('.ui-barImg'));
            ok(valuePb.find('.ui-boxImg'));
            var maxValue = valuePb.progressbar('option', 'max');
            var barWidth = parseInt(valuePb.find('.ui-barImg').css('width'));
            var boxWidth = parseInt(valuePb.find('.ui-boxImg').css('width'));
            equal(Math.round(barWidth / boxWidth * 100), Math.round(15 / maxValue * 100));

            valuePb.progressbar('value', -5);
            equal(valuePb.progressbar('value'), 0);
            valuePb.progressbar('value', 110);
            equal(valuePb.progressbar('value'), 100);

            start();
        }]);
    });
})(jQuery);