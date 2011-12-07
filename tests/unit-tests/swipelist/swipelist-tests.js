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

        var cover = swipelist.find('li *.ui-swipelist-item-cover.ui-body-c').first();
        var item = swipelist.find('li').first();
        var coverStart = cover.position().left;

        var isRight = false;

        var slideLeftDone = function () {
          ok(true, 'should trigger animationComplete after sliding left');
          equal(cover.position().left, coverStart, "cover should be back where it started");
        };

        var slideRightDone = function () {
          ok(true, 'should trigger animationComplete after sliding right');

          setTimeout(function () {
            cover.unbind('animationComplete');
            cover.bind('animationComplete', slideLeftDone);
            item.trigger('swipeleft');
          }, 0);
        };

        cover.bind('animationComplete', slideRightDone);

        cover.trigger('swiperight');
      },

      function () { expect(4); start(); }
    ]);

  });

  asyncTest("Responds to clicks on buttons inside the list element", function () {

    $.testHelper.pageSequence([

      function () {
        $.testHelper.openPage('#swipelist-test-interior-buttons');
      },

      function () {
        var $new_page = $('#swipelist-test-interior-buttons');
        ok($new_page.hasClass('ui-page-active'));

        var swipelist = $new_page.find('ul:jqmData(role=swipelist)');

        var cover = swipelist.find('li *.ui-swipelist-item-cover.ui-body-c').first();
        var button = swipelist.find('li *:jqmData(role=button)').first();
        var coverStart = cover.position().left;

        var slideLeftDone = function () {
          ok(true, "should slide back to the left when interior button clicked");
          equal(cover.position().left, coverStart, "cover should be back where it started");
        };

        var slideRightDone = function () {
          setTimeout(function () {
            cover.unbind('animationComplete');
            cover.bind('animationComplete', slideLeftDone);
            button.trigger('click');
          }, 0);
        };

        cover.bind('animationComplete', slideRightDone);

        cover.trigger('swiperight');
      },

      function () { expect(3); start(); }
    ]);

  });

  asyncTest("Can be destroyed", function () {

    $.testHelper.pageSequence([

      function () {
        $.testHelper.openPage('#swipelist-test-destroy');
      },

      function () {
        var $new_page = $('#swipelist-test-destroy');
        ok($new_page.hasClass('ui-page-active'));

        var swipelist = $new_page.find('ul:jqmData(role=swipelist)');
        swipelist.swipelist('destroy');
        var covers = $new_page.find(':jqmData(role=swipelist-item-cover)');


        equal($new_page.has('.ui-swipelist').length, 0);
        equal($new_page.has('.ui-swipelist-item').length, 0);
        equal($new_page.has('.ui-swipelist-item-cover').length, 0);
        equal($new_page.has('.ui-swipelist-item-cover-inner').length, 0);

        covers.each(function () {
          ok(!$(this).data('animateRight'));
          ok(!$(this).data('animateLeft'));
        });
      },

      function () { expect(7); start(); }
    ]);

  });

})(jQuery);
