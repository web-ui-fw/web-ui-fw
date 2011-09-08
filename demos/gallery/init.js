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

    $('#spinner-demo').bind('pageshow', function (e) {
        $(this).find('li').each(function (index, element) {
            var randomWait = 500 * (Math.floor(Math.random() * 6) + 4);

            $(element).text("I am processing");

            $(element).bind('stopped', function () {
                $(element).text("I am done!");
            });

            $(element).spinner('start');

            setTimeout(function () {
                $(element).spinner('stop');
            }, randomWait);
        });
    });

    $('#spinnerbar-demo').bind('pageshow', function () {
        $(this).find(':jqmData(processing="spinnerbar")').each(function (index, element) {
            var randomWait = 500 * (Math.floor(Math.random() * 6) + 4);

            $(element).text("")

            $(element).bind('stopped', function () {
                $(element).text("I am done!");
            });

            $(element).spinnerbar('start');

            setTimeout(function () {
                $(element).spinnerbar('stop');
            }, randomWait);
        });
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
    $("#showVolumeButton").bind("vclick", function (e) {
      $("#myVolumeControl").volumecontrol("open");
    });
});
