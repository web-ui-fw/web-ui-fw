/*
 * processingbar unit tests
 */

(function ($) {

  $.mobile.defaultTransition = "none";

  module("Processing bar");

  asyncTest("Markup and methods are present and work correctly", function () {

    $.testHelper.pageSequence([

      function () {
        $.testHelper.openPage('#processingbar-test');
      },

      function () {
        var $new_page = $('#processingbar-test');

        // 1
        ok($new_page.hasClass('ui-page-active'));

        var pb = $new_page.find('#processingbar-test-1');

        // stop event should happen twice
        pb.bind('stop', function () {
          equal(true, true, "stop event should be fired for each stop");
        });

        // 2: test the markup is in place
        equal(pb.find('div.ui-processingbar-container > div.ui-processingbar-clip > div.ui-processingbar-bar').length, 1);

        // 3: test it is marked as running
        ok(pb.processingbar('isRunning'), "should be running on create");

        // test that it can be stopped
        pb.processingbar('stop');

        // 4 (+1 stop event)
        ok(!pb.processingbar('isRunning'), "should stop running on stop()");

        // test that it can be refreshed (which starts it running again)
        pb.processingbar('refresh');

        // 5
        ok(pb.processingbar('isRunning'), "should be running after refresh()");

        // test it can be destroyed
        pb.processingbar('destroy');

        // 6 (+1 stop event)
        equal(pb.find('div.ui-processingbar-container').length, 0, "should remove markup on destroy()");
      },

      function () { expect(8); start(); }

    ]);

  });

})(jQuery);
