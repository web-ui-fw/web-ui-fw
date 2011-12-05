/*
 * swipelist unit tests
 */

(function ($) {
  $.mobile.defaultTransition = "none";

  module("Swipelist");

  asyncTest("foo", function () {

    $.testHelper.pageSequence([

      function () {
        $.testHelper.openPage('#swipelist-test');
      },

      function () {
        var $new_page = $('#swipelist-test');
        ok($new_page.hasClass('ui-page-active'));
      },

      function () { start(); }

    ]);

  });

})(jQuery);
