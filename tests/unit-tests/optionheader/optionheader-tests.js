/*
 * optionheader unit tests
 */

(function ($) {
  $.mobile.defaultTransition = "none";

  module("Option header");

  asyncTest("Should set options from data-options", function () {
    $.testHelper.pageSequence([
      function () {
        $.testHelper.openPage('#optionheader-test-options');
      },

      function () {
        var $new_page = $('#optionheader-test-options');

        ok($new_page.hasClass('ui-page-active'));

        // test default options set
        var defaultOh = $new_page.find('#optionheader-test-options-default');
        equal(defaultOh.optionheader('option', 'showIndicator'), true);
        equal(defaultOh.optionheader('option', 'theme'), 'b');
        equal(defaultOh.optionheader('option', 'startCollapsed'), false);
        equal(defaultOh.optionheader('option', 'expandable'), true);
        equal(defaultOh.optionheader('option', 'duration'), 0.25);

        // test custom options set
        var customOh  = $new_page.find('#optionheader-test-options-custom');
        equal(customOh.optionheader('option', 'showIndicator'), false);
        equal(customOh.optionheader('option', 'theme'), 'a');
        equal(customOh.optionheader('option', 'startCollapsed'), true);
        equal(customOh.optionheader('option', 'expandable'), false);
        equal(customOh.optionheader('option', 'duration'), 0.5);

        // test data-theme attribute - should override data-options
        var themedOh = $new_page.find('#optionheader-test-theme-attr');
        equal(themedOh.optionheader('option', 'theme'), 'c');

        start();
      }
    ]);
  });

  asyncTest("Should create correct markup", function () {
    $.testHelper.pageSequence([
      function () {
        $.testHelper.openPage('#optionheader-test-markup');
      },

      function () {
        var $new_page = $('#optionheader-test-markup');

        ok($new_page.hasClass('ui-page-active'));

        // test indicator markup
        var withIndicator = $new_page.find('#optionheader-test-markup-indicator');
        equal(withIndicator.siblings('.ui-triangle-container').length, 1);
        var withoutIndicator = $new_page.find('#optionheader-test-markup-no-indicator');
        equal(withoutIndicator.siblings('.ui-triangle-container').length, 0);

        // test for classes
        ok(withIndicator.hasClass('ui-option-header'), 'should have base class');
        ok(withIndicator.hasClass('ui-option-header-1-row'), 'should default to 1 row');
        ok(withIndicator.hasClass('ui-body-b'), 'should have class for default b theme');

        // test for custom theme class
        var themeSet = $new_page.find('#optionheader-test-markup-custom-theme');
        ok(themeSet.hasClass('ui-body-c'), 'should have class for theme c set in options');

        // test for row markup on grids
        var grid = $new_page.find('#optionheader-test-markup-grid');
        ok(grid.hasClass('ui-option-header-3-row'), 'should have 3 rows');
        ok(grid.find('div:nth-child(1)').hasClass('ui-option-header-row-1'));
        ok(grid.find('div:nth-child(2)').hasClass('ui-option-header-row-2'));
        ok(grid.find('div:nth-child(3)').hasClass('ui-option-header-row-3'));

        // test for button markup inside the grid: all buttons should
        // have ui-btn-up-d class, to match the theme of their parent
        equal(grid.find('.ui-btn:not(.ui-btn-up-d)').length, 0);
        equal(grid.find('.ui-btn.ui-btn-up-d').length, 9);

        start();
      }
    ]);
  });

  asyncTest("Should respond to expand/collapse and fire events correctly", function () {
    $.testHelper.pageSequence([
      function () {
        $.testHelper.openPage('#optionheader-test-events');
      },

      function () {
        var $new_page = $('#optionheader-test-events');

        // 1
        ok($new_page.hasClass('ui-page-active'));
      },

      function () {
        var $new_page = $('#optionheader-test-events');

        var startsExpandedOh = $new_page.find('#optionheader-test-events-expanded');

        startsExpandedOh.bind('expand', function () {
          // SHOULDN'T RUN
          equal(true, true, '(startsExpanded) option header which is expanded shouldn\'t fire expand event!!!');
          startsExpandedOh.unbind('expand');
        });

        startsExpandedOh.bind('collapse', function () {
          // 2
          equal(true, true, '(startsExpanded) option header which is expanded should fire collapse event');

          // 3
          equal(startsExpandedOh.height() + 'px',
                $.todons.optionheader.prototype.collapsedHeight,
                'should have collapsed to the height specified in the prototype');

          startsExpandedOh.unbind('collapse');
        });

        startsExpandedOh.optionheader('expand');
        startsExpandedOh.optionheader('collapse');
      },

      function () {
        var $new_page = $('#optionheader-test-events');

        var startsCollapsedOh = $new_page.find('#optionheader-test-events-collapsed');

        // NB the optionheader will have fired a collapse event when it
        // was created, as it would have had collapse() called to set
        // its initial appearance; but calling collapse() after init
        // shouldn't have an effect at this point
        startsCollapsedOh.bind('collapse', function () {
          // SHOULDN'T RUN
          equal(true, true, '(startsCollapsed) option header which is collapsed shouldn\'t fire collapse event!!!');
          startsCollapsedOh.unbind('collapse');
        });

        startsCollapsedOh.bind('expand', function () {
          // 4
          equal(true, true, '(startsCollapsed) option header which is collapsed should fire expand event');
          startsCollapsedOh.unbind('expand');
        });

        startsCollapsedOh.optionheader('collapse');
        startsCollapsedOh.optionheader('expand');
      },

      function () { expect(4); start(); }
    ]);
  });

  asyncTest("Should respond correctly to toggle()", function () {
    $.testHelper.pageSequence([
      function () {
        $.testHelper.openPage('#optionheader-test-toggle');
      },

      function () {
        var $new_page = $('#optionheader-test-toggle');

        // 1
        ok($new_page.hasClass('ui-page-active'));

        var oh = $new_page.find('#optionheader-test-toggle-1');

        oh.bind('collapse', function () {
          // 2
          equal(true, true, 'should collapse when toggled first time');

          // 3
          equal(oh.height() + 'px',
                $.todons.optionheader.prototype.collapsedHeight,
                'should have collapsed to the height specified in the prototype');

          oh.unbind('collapse');

          // trigger the second toggle once the collapse has finished
          oh.optionheader('toggle');
        });

        oh.bind('expand', function () {
          // 4
          equal(true, true, 'should expand when toggled second time');
          oh.unbind('expand');
        });

        oh.optionheader('toggle');
      },

      function () { expect(4); start(); }
    ]);
  });

  asyncTest("Should accept custom options passed to toggle()", function () {
    $.testHelper.pageSequence([
      function () {
        $.testHelper.openPage('#optionheader-test-toggle-options');
      },

      function () {
        var $new_page = $('#optionheader-test-toggle-options');

        // 1
        ok($new_page.hasClass('ui-page-active'));

        var oh = $new_page.find('#optionheader-test-toggle-options-1');

        // test callback when animation is available
        var animationCb = function () {
          // 2
          equal(true, true, 'callback should be invoked after animation');
        };

        oh.optionheader('toggle', {callback: animationCb});

        // test callback when animation is off (duration = 0)
        var noAnimationCb = function () {
          // 3
          equal(true, true, 'callback should be invoked when animation is off (duration == 0)');
        };

        oh.optionheader('toggle', {duration: 0, callback: noAnimationCb});
      },

      function () { expect(3); start(); }
    ]);
  });

  asyncTest("Should respond to clicks on the optionheader", function () {
    $.testHelper.pageSequence([
      function () {
        $.testHelper.openPage('#optionheader-test-click');
      },

      function () {
        var $new_page = $('#optionheader-test-click');

        // 1
        ok($new_page.hasClass('ui-page-active'));

        var oh = $new_page.find('#optionheader-test-click-1');

        oh.bind('collapse', function () {
          // 2
          equal(true, true, 'should collapse when clicked first time');

          // 3
          equal(oh.height() + 'px',
                $.todons.optionheader.prototype.collapsedHeight,
                'should have collapsed to the height specified in the prototype');

          oh.unbind('collapse');

          // click again once the collapse has finished
          oh.trigger('click');
        });

        oh.bind('expand', function () {
          // 4
          equal(true, true, 'should expand when toggled second time');
          oh.unbind('expand');
        });

        oh.trigger('click');
      },

      function () { expect(4); start(); }
    ]);
  });

  asyncTest("Should respond to clicks on the optionheader 'triangle'", function () {
    $.testHelper.pageSequence([
      function () {
        $.testHelper.openPage('#optionheader-test-click');
      },

      function () {
        var $new_page = $('#optionheader-test-click');

        // 1
        ok($new_page.hasClass('ui-page-active'));

        var oh = $new_page.find('#optionheader-test-click-2');

        var triangle = oh.siblings('.ui-triangle-container');

        oh.bind('collapse', function () {
          // 2
          equal(true, true, 'should collapse when clicked first time');

          // 3
          equal(oh.height() + 'px',
                $.todons.optionheader.prototype.collapsedHeight,
                'should have collapsed to the height specified in the prototype');

          oh.unbind('collapse');

          // click again once the collapse has finished
          triangle.trigger('click');
        });

        oh.bind('expand', function () {
          // 4
          equal(true, true, 'should expand when toggled second time');
          oh.unbind('expand');
        });

        triangle.trigger('click');
      },

      function () { expect(4); start(); }
    ]);
  });

  asyncTest("Should collapse when interior buttons are clicked", function () {
    $.testHelper.pageSequence([
      function () {
        $.testHelper.openPage('#optionheader-test-click-inside');
      },

      function () {
        var $new_page = $('#optionheader-test-click-inside');

        // 1
        ok($new_page.hasClass('ui-page-active'));

        var oh = $new_page.find('#optionheader-test-click-inside-oh');

        oh.bind('collapse', function () {
          // 2
          equal(true, true, 'should collapse when interior button clicked');

          // 3
          equal(oh.height() + 'px',
                $.todons.optionheader.prototype.collapsedHeight,
                'should have collapsed to the height specified in the prototype');
        });

        oh.find('#optionheader-test-click-inside-btn').trigger('click');
      },

      function () { expect(3); start(); }
    ]);
  });

})(jQuery);
