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

      function() {
        var $new_page = $('#optionheader-test-options');

        ok($new_page.hasClass('ui-page-active'));

        // test default options set
        var defaultOh = $($new_page.find('#optionheader-test-options-default'));
        equal(defaultOh.optionheader('option', 'showIndicator'), true);
        equal(defaultOh.optionheader('option', 'theme'), 'b');
        equal(defaultOh.optionheader('option', 'startCollapsed'), false);
        equal(defaultOh.optionheader('option', 'expandable'), true);
        equal(defaultOh.optionheader('option', 'duration'), 0.25);

        // test custom options set
        var customOh  = $($new_page.find('#optionheader-test-options-custom'));
        equal(customOh.optionheader('option', 'showIndicator'), false);
        equal(customOh.optionheader('option', 'theme'), 'a');
        equal(customOh.optionheader('option', 'startCollapsed'), true);
        equal(customOh.optionheader('option', 'expandable'), false);
        equal(customOh.optionheader('option', 'duration'), 0.5);

        // test data-theme attribute - should override data-options
        var themedOh = $($new_page.find('#optionheader-test-theme-attr'));
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

      function() {
        var $new_page = $('#optionheader-test-markup');

        ok($new_page.hasClass('ui-page-active'));

        // test indicator markup
        var withIndicator = $($new_page.find('#optionheader-test-markup-indicator'));
        equal(withIndicator.siblings('.ui-option-header-triangle-arrow').length, 1);
        var withoutIndicator = $($new_page.find('#optionheader-test-markup-no-indicator'));
        equal(withoutIndicator.siblings('.ui-option-header-triangle-arrow').length, 0);

        // test for classes
        ok(withIndicator.hasClass('ui-option-header'), 'should have base class');
        ok(withIndicator.hasClass('ui-option-header-1-row'), 'should default to 1 row');
        ok(withIndicator.hasClass('ui-body-b'), 'should have class for default b theme');

        // test for custom theme class
        var themeSet = $($new_page.find('#optionheader-test-markup-custom-theme'));
        ok(themeSet.hasClass('ui-body-c'), 'should have class for theme c set in options');

        // test for row markup on grids
        var grid = $($new_page.find('#optionheader-test-markup-grid'));
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

  asyncTest("Should fire events correctly", function () {
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

        var startsExpandedOh = $($new_page.find('#optionheader-test-events-expanded'));

        startsExpandedOh.bind('collapse', function () {
          // 2
          equal(true, true, '(startsExpanded) option header which is expanded should fire collapse event');

          // 3
          equal(startsExpandedOh.height() + 'px', $.todons.optionheader.prototype.collapsedHeight);

          startsExpandedOh.unbind('collapse');
        });

        startsExpandedOh.optionheader('collapse');
      },

      function () {
        var $new_page = $('#optionheader-test-events');

        var startsCollapsedOh = $($new_page.find('#optionheader-test-events-collapsed'));

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
})(jQuery);
