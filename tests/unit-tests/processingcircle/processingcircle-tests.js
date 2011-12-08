/*
 * processingcircle unit tests
 */

(function ($) {
  $.mobile.defaultTransition = "none";

  module("Processing circle");

  asyncTest("Provides basic markup and functionality", function () {

    $.testHelper.pageSequence([

      function () {
        $.testHelper.openPage('#processingcircle-test');
      },

      function () {
        var $new_page = $('#processingcircle-test');

        // 1
        ok($new_page.hasClass('ui-page-active'));

        var pc = $new_page.find('#processingcircle-test-1');

        pc.bind('stop', function () {
          ok(true, "should fire stop event");
        });

        // 2
        equal(pc.find('.ui-processingcircle-container > .ui-processingcircle > .ui-processingcircle-hand').length, 1);

        // 3
        equal(pc.find('.ui-processingcircle-container.ui-body-b').length, 1, "'face' should have default 'b' theme");

        // 4
        equal(pc.find('.ui-processingcircle-hand.ui-bar-b').length, 1, "'hand' should have default 'b' theme");

        // 5: test isRunning after create
        ok(pc.processingcircle('isRunning'), "should be running after create");

        // 6: check spin class on circle
        ok(pc.find('.ui-processingcircle').hasClass('ui-processingcircle-spin'),
           'should have spin class after create');

        // (+1 stop event): test stop
        pc.processingcircle('stop');

        // 7
        ok(!pc.processingcircle('isRunning'), "should not be running after stop()");

        // 8: check spin class is gone
        ok(!pc.find('.ui-processingcircle').hasClass('ui-processingcircle-spin'),
           'should not have spin class after stop()');

        // test refresh
        pc.processingcircle('refresh');

        // 9
        ok(pc.processingcircle('isRunning'), "should be running after refresh()");

        // 10: check spin class on circle
        ok(pc.find('.ui-processingcircle').hasClass('ui-processingcircle-spin'),
           'should have spin class after refresh()');

        // (+1 stop event) test destroy
        pc.processingcircle('destroy');

        // 11
        ok(!pc.processingcircle('isRunning'), "should not be running after destroy()");
      },

      function () { expect(13); start(); }

    ]);

  });

  asyncTest("Sets custom theme from data-theme attribute", function () {

    $.testHelper.pageSequence([

      function () {
        $.testHelper.openPage('#processingcircle-test');
      },

      function () {
        var $new_page = $('#processingcircle-test');

        ok($new_page.hasClass('ui-page-active'));

        var pc = $new_page.find('#processingcircle-test-theme');

        console.log(pc);

        equal(pc.find('.ui-processingcircle-container.ui-body-a').length, 1, "'face' should have custom 'a' theme");
        equal(pc.find('.ui-processingcircle-hand.ui-bar-a').length, 1, "'hand' should have custom 'a' theme");
      },

      function () { start(); }

    ]);

  });

})(jQuery);
