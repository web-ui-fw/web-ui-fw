/*
 * dayselector unit tests
 */

(function ($) {
  $.mobile.defaultTransition = "none";

	module("Day selector");

	asyncTest("blah", function () {

		$.testHelper.pageSequence([

			function () {
				$.testHelper.openPage('#dayselector-test');
			},

			function () {
				var $new_page = $('#dayselector-test');
				ok($new_page.hasClass('ui-page-active'));
			},

			function () { start(); }

		]);

	});

})(jQuery);
