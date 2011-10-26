/*
 * Size pages to the window
 */

(function($, undefined) {

var _fit_page_to_window_selector = ":jqmData(role='page'):jqmData(fit-page-to-window='true'):visible";

$(document).bind("pageshow", function(e) {
    if ($(e.target).is(_fit_page_to_window_selector))
        $.mobile.todons.fillPageWithContentArea($(e.target));
});

$(window).resize(function() {
    if ($(_fit_page_to_window_selector)[0] !== undefined)
        $.mobile.todons.fillPageWithContentArea($(_fit_page_to_window_selector));
});

})(jQuery);
