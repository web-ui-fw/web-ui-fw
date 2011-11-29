/*
 * dayselector unit tests
 */

(function ($) {
  $.mobile.defaultTransition = "none";

  var testMarkup = function (elt, expectedType, expectedTheme, expectedLabels) {
    var checkbox, label, expectedId;

    ok(elt.hasClass('ui-dayselector'));

    // main element should be a controlgroup
    ok(elt.hasClass('ui-controlgroup'));

    equal(elt.attr('data-' + $.mobile.ns + 'type'), expectedType, "should have '" + expectedType + "' type");

    for (var i = 0; i < expectedLabels.length; i++) {
      expectedId = elt.attr('id') + '_' + i;
      checkbox = elt.find('.ui-checkbox :checkbox[value=' + i + '][id=' + expectedId + ']');
      equal(checkbox.length, 1, "should be one checkbox per day");
      equal(checkbox.attr('value'), '' + i, "should have correct day value");

      label = checkbox.siblings().first();
      equal(label.length, 1, "should be one label per day");
      equal(label.attr('for'), expectedId, "should associate correctly with checkbox");
      ok(label.hasClass('ui-dayselector-label-' + i), "should have the right label class");
      equal(label.jqmData('theme'), expectedTheme, "should have '" + expectedTheme + "' theme");
      equal(label.find('.ui-btn-text').text(), expectedLabels[i], "should have day letter set");
    }
  };

  module("Day selector");

  asyncTest("Should set default configuration correctly", function () {

    $.testHelper.pageSequence([

      function () {
        $.testHelper.openPage('#dayselector-test-configuration');
      },

      function () {
        var $new_page = $('#dayselector-test-configuration');
        ok($new_page.hasClass('ui-page-active'));

        // test defaults are applied correctly
        var defaultDs = $new_page.find('#dayselector-test-configuration-default');

        // test the checkboxes are OK
        var expectedType = 'horizontal';
        var expectedLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        var expectedTheme = 'c';
        testMarkup(defaultDs, expectedType, expectedTheme, expectedLabels);
      },

      function () { start(); }

    ]);

  });

  asyncTest("Should set theme from data-theme attribute", function () {

    $.testHelper.pageSequence([

      function () {
        $.testHelper.openPage('#dayselector-test-configuration');
      },

      function () {
        var $new_page = $('#dayselector-test-configuration');
        ok($new_page.hasClass('ui-page-active'));

        // test theme is applied correctly
        var themeDs = $new_page.find('#dayselector-test-configuration-theme');

        // test the checkboxes are OK
        var expectedType = 'horizontal';
        var expectedLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        var expectedTheme = 'a';
        testMarkup(themeDs, expectedType, expectedTheme, expectedLabels);
      },

      function () { start(); }

    ]);

  });

  asyncTest("Should set custom configuration correctly", function () {

    $.testHelper.pageSequence([

      function () {
        $.testHelper.openPage('#dayselector-test-configuration');
      },

      function () {
        var $new_page = $('#dayselector-test-configuration');
        ok($new_page.hasClass('ui-page-active'));

        // test custom config is applied correctly
        var customDs = $new_page.find('#dayselector-test-configuration-custom');

        // what we expect
        var expectedType = 'vertical';
        var expectedTheme = 'a';

        var frenchDays = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

        var expectedLabels = [];
        for (var j = 0; j < frenchDays.length; j++) {
          expectedLabels.push(frenchDays[j].slice(0, 1));
        }

        customDs.dayselector({type: expectedType, theme: expectedTheme, days: frenchDays});

        testMarkup(customDs, expectedType, expectedTheme, expectedLabels);
      },

      function () { start(); }

    ]);

  });

  asyncTest("Should respond to selection via clicks or API", function () {

    $.testHelper.pageSequence([

      function () {
        $.testHelper.openPage('#dayselector-test-select');
      },

      function () {
        var $new_page = $('#dayselector-test-select');
        ok($new_page.hasClass('ui-page-active'));

        // test defaults are applied correctly
        var selectDs = $new_page.find('#dayselector-test-select-1');

        // nothing should be selected yet
        deepEqual(selectDs.dayselector('value'), []);

        // click on Wednesday and Friday to switch them on
        var wednesday = selectDs.find('.ui-btn-text:contains("W")');
        wednesday.trigger('click');

        var friday = selectDs.find('.ui-btn-text:contains("F")');
        friday.trigger('click');

        deepEqual(selectDs.dayselector('value'), ['3', '5']);

        // turn off Wednesday and Friday
        wednesday.trigger('click');
        friday.trigger('click');

        deepEqual(selectDs.dayselector('value'), []);

        // test the selectAll() method
        selectDs.dayselector('selectAll');

        deepEqual(selectDs.dayselector('value'), ['0', '1', '2', '3', '4', '5', '6']);
      },

      function () { start(); }

    ]);

  });

})(jQuery);
