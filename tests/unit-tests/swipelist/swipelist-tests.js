/*
 * swipelist unit tests
 */

(function ($) {
  $.mobile.defaultTransition = "none";

  module("Swipelist");

  asyncTest("Applies markup", function () {

    $.testHelper.pageSequence([

      function () {
        $.testHelper.openPage('#swipelist-test');
      },

      function () {
        var $new_page = $('#swipelist-test');
        ok($new_page.hasClass('ui-page-active'));

        var swipelist = $new_page.find('ul:jqmData(role=swipelist)');
        var covers = swipelist.find('li *.ui-swipelist-item-cover.ui-body-c');

        ok(swipelist.hasClass('ui-listview'));
        ok(swipelist.hasClass('ui-swipelist'));

        equal(swipelist.find('li.ui-swipelist-item').length, 2, "should be two swipe-able items");
        equal(covers.length, 2, "should be two swipe covers with 'c' theme");

        equal(covers.find('span.ui-swipelist-item-cover-inner:contains("Nigel")').length,
                          1,
                          "should wrap inner text of Nigel cover with a span");
        equal(covers.find('span.ui-swipelist-item-cover-inner:contains("Bert")').length,
                          1,
                          "should wrap inner text of Bert cover with a span");
      },

      function () { start(); }

    ]);

  });

  asyncTest("Responds to swipe events", function () {

    $.testHelper.pageSequence([

      function () {
        $.testHelper.openPage('#swipelist-test');
      },

      function () {
        var $new_page = $('#swipelist-test');
        ok($new_page.hasClass('ui-page-active'));

        var swipelist = $new_page.find('ul:jqmData(role=swipelist)');

        var cover1 = swipelist.find('li *.ui-swipelist-item-cover.ui-body-c').first();
        var item1 = swipelist.find('li').first();

        var isRight = false;

        var slideLeftDone = function () {
          ok(true, 'should trigger animationComplete after sliding left');
        };

        var slideRightDone = function () {
          ok(true, 'should trigger animationComplete after sliding right');

          setTimeout(function () {
            cover1.unbind('animationComplete');
            cover1.bind('animationComplete', slideLeftDone);
            item1.trigger('swipeleft');
          }, 0);
        };

        cover1.bind('animationComplete', slideRightDone);

        cover1.trigger('swiperight');
      },

      function () { expect(3); start(); }
    ]);

  });

})(jQuery);
