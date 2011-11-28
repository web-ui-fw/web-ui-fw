/*
 * dayselector unit tests
 */

(function ($) {
  $.mobile.defaultTransition = "none";

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
				var defaultDs = $($new_page.find('#dayselector-test-configuration-default'));

				ok(defaultDs.hasClass('ui-dayselector'));
				equal(defaultDs.attr('data-' + $.mobile.ns + 'type'), 'horizontal', "should default to horizontal layout");

				// main element should be a controlgroup
				ok(defaultDs.hasClass('ui-controlgroup'));

				var id = defaultDs.attr('id');

				// test the checkboxes are OK
				var expectedLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
				var checkbox, label, expectedId;

				for (var i = 0; i < expectedLabels.length; i++) {
				  expectedId = id + '_' + i;
          checkbox = defaultDs.find('.ui-checkbox :checkbox[value=' + i + '][id=' + expectedId + ']');
          equal(checkbox.length, 1, "should be one checkbox per day");
          equal(checkbox.attr('value'), '' + i, "should have correct day value");

          label = checkbox.siblings().first();
          equal(label.length, 1, "should be one label per day");
          equal(label.attr('for'), expectedId, "should associate correctly with checkbox");
          ok(label.hasClass('ui-dayselector-label-' + i), "should have the right label class");
          equal(label.jqmData('theme'), 'c', "should have default 'c' theme");
          equal(label.find('.ui-btn-text').text(), expectedLabels[i], "should have day letter set");
				}
			},

			function () { start(); }

		]);

	});

})(jQuery);
