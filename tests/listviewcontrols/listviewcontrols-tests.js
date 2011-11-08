/*
 * listviewcontrols unit tests
 */
(function ($) {
  $.mobile.defaultTransition = "none";

	module("listviewcontrols");

	asyncTest("listviewcontrols TODO", function() {

		$.testHelper.pageSequence([
			function() {
				$.testHelper.openPage('#listviewcontrols-test');
			},

			function() {
				var $new_page = $('#listviewcontrols-test');

				ok($new_page.hasClass('ui-page-active'));

				start();
			}
		]);

	});

})(jQuery);
