/*
 * Add markup for labels
 */

$(document).bind("pagecreate create", function(e) {
  $("[data-role=label]", e.target).not(":jqmData(role='none'), :jqmData(role='nojs')").each(function() {
    $(this).addClass("jquery-mobile-ui-label")
           .html($("<span>", {class: "jquery-mobile-ui-label-text"}).text($(this).text()));
  });
});
