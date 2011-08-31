$('#progressbar_page').bind('pagecreate', function () {
    setInterval(function() {
        var progress = $('.ui-progressbar').progressbar('value');
        progress++;
        if (progress > 100) {
            progress = 0;
        }
        $('.ui-progressbar').progressbar('value', progress)
    }, 100);
});

$(document).bind("pagecreate", function() {
    $('#groupindex-demo').bind('pageshow', function (e) {
        $.fillPageWithContentArea($(this));
    });

    $('#shortcutscroll-demo').bind('pageshow', function (e) {
        $.fillPageWithContentArea($(this));
    });

    var updateDate = function(e, newDate) {
        $("#datetimepicker-demo .selected-date").text(newDate.toString());
    };
    $("#demo-date").bind("date-changed", updateDate);

    /* TODO: we should not need these! */
    $('.ui-progressbar').progressbar();
    $('#switch-1').switch();
    $('#switch-2').switch();
    $('#groupindex').scrolllistview();
    $('#popupwindowDemoButton').bind("vclick", function(e) {
      var btn = $('#popupwindowDemoButton');
      $('#popupContent').popupwindow("open",
        btn.offset().left + btn.outerWidth()  / 2,
        btn.offset().top  + btn.outerHeight() / 2);
    });
});
