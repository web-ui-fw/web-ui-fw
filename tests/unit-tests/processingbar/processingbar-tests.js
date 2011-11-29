/*
 * processingbar unit tests
 */

(function ($) {

  $.mobile.defaultTransition = "none";

  module("Processing bar");

  asyncTest("foo", function () {

    $.testHelper.pageSequence([

      function () {
        $.testHelper.openPage('#processingbar-test');
      },

      function () {
        var $new_page = $('#processingbar-test');
        ok($new_page.hasClass('ui-page-active'));
      },

      function () { start(); }

    ]);

  });

})(jQuery);
