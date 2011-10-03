/*
 * Size pages to the window
 */

(function($, undefined) {

$(document).bind("pageshow", function(e) {
  var page = $(e.target);
  if (page.attr("data-fit-page-to-window") === "true")
    $.mobile.todons.fillPageWithContentArea(page);
});

})(jQuery);
