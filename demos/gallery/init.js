// tracks progressbar update intervals to ensure each is not
// added more than once to any single progress bar
var progressbarAnimator = {
    intervals: {},
    justIntervals: [], // retained to make it easier to clear the intervals

    // pause: pause in ms between updates
    updateProgressBar: function (progressbarToUpdate, pause) {
        var id = progressbarToUpdate.attr('id');

        if (this.intervals[id]) {
            return;
        }

        var interval = setInterval(function () {
            var now = (new Date()).getTime();

            var progress = progressbarToUpdate.progressbar('value');
            progress++;

            if (progress > 100) {
                progress = 0;
            }
            progressbarToUpdate.progressbar('value', progress);
        }, pause);

        this.intervals[id] = interval;
        this.justIntervals.push(interval);
    },

    clearIntervals: function () {
        for (var i = 0; i < this.justIntervals.length; i++) {
            clearInterval(this.justIntervals[i]);
        }

        this.intervals = {};
    }
};

$(document).bind("pagecreate", function () {
    $('#groupindex-demo').bind('pageshow', function (e) {
        $.mobile.todons.fillPageWithContentArea($("#groupindex-demo"));
    });

    $('#shortcutscroll-demo').bind('pageshow', function (e) {
        $.mobile.todons.fillPageWithContentArea($(this));
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

    $('#scroller-demo').bind('pageshow', function (e) {
        $.mobile.todons.fillPageWithContentArea($(this));
    });

    $('#scroller-demo').bind('pageshow', function (e) {
        $page = $(e.target);

        $.mobile.todons.fillPageWithContentArea($(this));

        /*
         * many options cannot be set without subclassing since they're
         * used in the _create method - it seems as if these are for
         * internal use only and scrollDuration is only changable by
         * chance.
         */
        var $scroller2List = $('#scroller2').find('ul');
        $scroller2List.scrollview('option','scrollDuration','10000');

        // only works by manipulating css
        // the only other way is to use attribute 'scroll-method="scroll"' in html
        $('#scroller2 .ui-scrollbar').css('visibility','hidden');

        /*
         * make toggle button switch scroll bars on and off
         */
        var scrollBarVisible = $('#scroller2').find('.ui-scrollbar').css('visibility')==="visible";

        var $toggleScrollBars = $('#toggleScrollBars');
        $toggleScrollBars.attr("checked",scrollBarVisible).checkboxradio("refresh");
        /* the 'label' is the thing that is clicked, not the input element */
        var $label = $toggleScrollBars.siblings('label').attr('for','#toggleScrollBars');
        $label.bind("click", function() {
            var $scrollBar = $('#scroller2').find('.ui-scrollbar');
            var scrollBarVisible = $scrollBar.css('visibility')==="visible";
            var newVisibility = scrollBarVisible?"hidden":"visible";
            $scrollBar.css('visibility',scrollBarVisible?"hidden":"visible");
        })
    });

    var updateDate = function(e, newDate) {
        $("#datetimepicker-demo .selected-date").text(newDate.toString());
    };
    $("#demo-date").bind("date-changed", updateDate);

    $('#progressbar-demo').bind('pageshow', function (e) {
        progressbarAnimator.updateProgressBar($(this).find('#progressbar1'), 200);
        progressbarAnimator.updateProgressBar($(this).find('#progressbar2'), 500);
        progressbarAnimator.updateProgressBar($(this).find('#progressbar3'), 1000);
    });

    $('#progressbar-demo').bind('pagehide', function (e) {
        progressbarAnimator.clearIntervals();
    });

    $('#progressbar-dialog-demo').bind('pageshow', function (e) {
        progressbarAnimator.updateProgressBar($(this).find('#progressbarDialog1'), 200);
    });

    $('#progressbar-dialog-demo').bind('pagehide', function (e) {
        progressbarAnimator.clearIntervals();
    });

    $('#groupindex-demo').bind('pageshow', function () {
        $('#groupindex').scrolllistview();
    });

    $('#popupwindowDemoButton').bind("vclick", function (e) {
        var btn = $('#popupwindowDemoButton');
        $('#popupContent').popupwindow("open",
        btn.offset().left + btn.outerWidth()  / 2,
        btn.offset().top  + btn.outerHeight() / 2);
    });
    $('#popupwindowDemoButton2').bind("vclick", function (e) {
        var btn = $('#popupwindowDemoButton2');
        $('#popupContent2').popupwindow("open",
        btn.offset().left + btn.outerWidth()  / 2,
        btn.offset().top  + btn.outerHeight() / 2);
    });

    $("#popupwindow-demo").bind("pageshow", function() {
      $('#popupwindow-demo-transition-' + $("#popupContent2").popupwindow("option", "transition"))
        .attr("checked", "true")
        .checkboxradio("refresh");
    });
    $('input[name=popupwindow-demo-transition-choice]').bind("change", function(e) {
      $("#popupContent2").popupwindow("option", "transition", $(this).attr("id").split("-").pop());
    });

    $("#showVolumeButton").bind("vclick", function (e) {
        $("#myVolumeControl").volumecontrol("open");
    });
    $("#volumecontrol_setBasicTone").bind("change", function(e) {
      var basicTone = !($("#volumecontrol_setBasicTone").next('label').find(".ui-icon").hasClass("ui-icon-checkbox-on"));

      if (basicTone) {
        $("#myVolumeControl").volumecontrol("option", "basicTone", true);
        $("#myVolumeControl").volumecontrol("option", "title", "Basic Tone");
      }
      else {
        $("#myVolumeControl").volumecontrol("option", "basicTone", false);
        $("#myVolumeControl").volumecontrol("option", "title", "Volume");
      }
    });
});

/* FIXME: Use pageinit as of jqm beta 3 */
var clrWidgetsAreInit = false;

$("#colorwidgets-demo").bind("pagebeforeshow", function() {
  if (clrWidgetsAreInit) return;

  $("#colorpicker").bind("colorchanged", function(e, clr) {
    $("#colorpickerbutton").colorpickerbutton("option", "color", clr);
    $("#colorpickerbutton-noform").colorpickerbutton("option", "color", clr);
    $("#hsvpicker").hsvpicker("option", "color", clr);
    $("#colortitle").colortitle("option", "color", clr);
    $("#colorpalette").colorpalette("option", "color", clr);
  });
  $("#colorpickerbutton").bind("colorchanged", function(e, clr) {
    $("#colorpicker").colorpicker("option", "color", clr);
    $("#colorpickerbutton-noform").colorpickerbutton("option", "color", clr);
    $("#hsvpicker").hsvpicker("option", "color", clr);
    $("#colortitle").colortitle("option", "color", clr);
    $("#colorpalette").colorpalette("option", "color", clr);
  });
  $("#colorpickerbutton-noform").bind("colorchanged", function(e, clr) {
    $("#colorpicker").colorpicker("option", "color", clr);
    $("#colorpickerbutton").colorpickerbutton("option", "color", clr);
    $("#hsvpicker").hsvpicker("option", "color", clr);
    $("#colortitle").colortitle("option", "color", clr);
    $("#colorpalette").colorpalette("option", "color", clr);
  });
  $("#hsvpicker").bind("colorchanged", function(e, clr) {
    $("#colorpicker").colorpicker("option", "color", clr);
    $("#colorpickerbutton").colorpickerbutton("option", "color", clr);
    $("#colorpickerbutton-noform").colorpickerbutton("option", "color", clr);
    $("#colortitle").colortitle("option", "color", clr);
    $("#colorpalette").colorpalette("option", "color", clr);
  });
  $("#colortitle").bind("colorchanged", function(e, clr) {
    $("#colorpicker").colorpicker("option", "color", clr);
    $("#colorpickerbutton").colorpickerbutton("option", "color", clr);
    $("#colorpickerbutton-noform").colorpickerbutton("option", "color", clr);
    $("#hsvpicker").hsvpicker("option", "color", clr);
    $("#colorpalette").colorpalette("option", "color", clr);
  });
  $("#colorpalette").bind("colorchanged", function(e, clr) {
    $("#colorpicker").colorpicker("option", "color", clr);
    $("#colorpickerbutton").colorpickerbutton("option", "color", clr);
    $("#colorpickerbutton-noform").colorpickerbutton("option", "color", clr);
    $("#hsvpicker").hsvpicker("option", "color", clr);
    $("#colortitle").colortitle("option", "color", clr);
  });
  $("#colorpalette").colorpalette("option", "color", "#45cc98");

  $("#colorwidgets-demo").bind("pageshow", function(e) {
    $.mobile.todons.fillPageWithContentArea($("#colorwidgets-demo"))
  });

  clrWidgetsAreInit = true;
});

$(document).bind("pagecreate", function() {
    var button = $('#calendarbutton');
    button.bind('vclick', function (e) {
        button.calendarpicker('open');
        button.unbind('selectedDate').bind('selectedDate',function(e,val) {
            $('#selectedCalendarDate').attr('value',val);
        });
    });
});
