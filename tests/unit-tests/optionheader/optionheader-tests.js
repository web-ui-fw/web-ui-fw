/*
 * optionheader unit tests
 */

(function ($) {
  $.mobile.defaultTransition = "none";

	module("Option header");

	asyncTest("description here", function () {
		$.testHelper.pageSequence([
			function () {
				$.testHelper.openPage('#optionheader-test');
			},

			function() {
				var $new_page = $('#optionheader-test');

				ok($new_page.hasClass('ui-page-active'));

				start();
			}
		]);
	});
})(jQuery);
