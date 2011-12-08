/*
 * Progressbar unit tests
 */

(function ($) {
  $.mobile.defaultTransition = "none";
 
  module("Progressbar");

  asyncTest("Should set options from data-options", function () {

    $.testHelper.pageSequence([

      function () {
        $.testHelper.openPage('#progressbar-test-options');
      },

      function () {
        var $new_page = $('#progressbar-test-options');
        
        // test default options set
        var defaultPb = $new_page.find('#progressbar-test-options-default');
        equal(defaultPb.progressbar('option', 'value'), 0);
        equal(defaultPb.progressbar('option', 'max'), 100);
        equal(defaultPb.progressbar('option', 'theme'), 'b');
        
        // test custom options set
        var customPb  = $new_page.find('#progressbar-test-options-custom');
        equal(customPb.progressbar('option', 'value'), 5);
        equal(customPb.progressbar('option', 'max'), 80);
        equal(customPb.progressbar('option', 'theme'), 'a');

        // test data-theme attribute - should override data-options
        var themedPb = $new_page.find('#progressbar-test-theme-attr');
        equal(themedPb.progressbar('option', 'theme'), 'c');

        start();
       }
    ]);
  });
	
  asyncTest("Test value", function () {

    $.testHelper.pageSequence([

      function () {
        $.testHelper.openPage('#progressbar-test-value');
      },
		
	  function () {
      	var $new_page = $('#progressbar-test-value');
       	
       	var valuePb = $new_page.find('#progressbar-test-value-div');
       	equal(valuePb.progressbar('value'), 0);
       	valuePb.progressbar('value', 15);
       	equal(valuePb.progressbar('value'), 15);
        // testing markup
       	//console.log(valuePb);
       	ok(valuePb.hasClass('ui-progressbar'));
       	ok(valuePb.hasClass('ui-barImg'));
       	ok(valuePb.hasClass('ui-boxImg'));
       	var maxValue = valuePb.progressbar('option', 'max');
       	equal(valuePb.find('ui-barImg').css('width'), 25/maxValue);
       	
       	start();
       }
   ]);
  });
  
  
})(jQuery);
