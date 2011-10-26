/*
 * Add markup for labels
 */

(function($, undefined) {

$(document).bind("pagecreate create", function(e) {
    $(":jqmData(role='label')", e.target).not(":jqmData(role='none'), :jqmData(role='nojs')").each(function() {
        $(this).addClass("jquery-mobile-ui-label")
               .html($("<span>", {class: "jquery-mobile-ui-label-text"}).text($(this).text()));
    });
});

})(jQuery);
