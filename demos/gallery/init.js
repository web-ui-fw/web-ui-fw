// tracks progressbar update intervals to ensure each is not
// added more than once to any single progress bar
var progressbarAnimator = {
    intervals: {},
    justIntervals: [],
    // retained to make it easier to clear the intervals
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
    $('#processingcircle-demo').bind('pageshow', function (e) {
        $(this).find(':jqmData(role="processingcircle")').each(function () {
            var randomWait = 500 * (Math.floor(Math.random() * 6) + 4);
            var elt = $(this);
            var li = elt.parent();

            setTimeout(function () {
                elt.processingcircle('destroy');
                li.html("I am done!");
            }, randomWait);
        });
    });

    $('#processingbar-demo').bind('pageshow', function () {
        $(this).find(':jqmData(role="processingbar")').each(function () {
            var randomWait = 500 * (Math.floor(Math.random() * 6) + 4);
            var elt = $(this);

            elt.bind('stopped', function () {
                elt.html("I am done!");
            });

            setTimeout(function () {
                elt.processingbar('destroy');
            }, randomWait);
        });
    });

    $('#scroller-demo').bind('pageshow', function (e) {
        $page = $(e.target);
        /*
         * many options cannot be set without subclassing since they're
         * used in the _create method - it seems as if these are for
         * internal use only and scrollDuration is only changable by
         * chance.
         */
        var $scroller2List = $('#scroller2').find('ul');
        $scroller2List.scrollview('option', 'scrollDuration', '10000');

        // only works by manipulating css
        // the only other way is to use attribute 'scroll-method="scroll"' in html
        $('#scroller2 .ui-scrollbar').css('visibility', 'hidden');

        /*
         * make toggle button switch scroll bars on and off
         */
        var scrollBarVisible = $('#scroller2').find('.ui-scrollbar').css('visibility') === "visible";

        var $toggleScrollBars = $('#toggleScrollBars');
        $toggleScrollBars.attr("checked", scrollBarVisible).checkboxradio("refresh"); /* the 'label' is the thing that is clicked, not the input element */
        var $label = $toggleScrollBars.siblings('label').attr('for', '#toggleScrollBars');
        $label.bind("click", function () {
            var $scrollBar = $('#scroller2').find('.ui-scrollbar');
            var scrollBarVisible = $scrollBar.css('visibility') === "visible";
            var newVisibility = scrollBarVisible ? "hidden" : "visible";
            $scrollBar.css('visibility', scrollBarVisible ? "hidden" : "visible");
        })
    });

    var updateDate = function (e, newDate) {
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

    $('#day-selector-demo').bind('pageshow', function () {
        $('#day-selector-demo .checkall').click(function () {
            $("#dayselector1").dayselector('selectAll');
        });

        $('#day-selector-demo .getDays').click(function () {
            var valuesStr = $("#dayselector1").dayselector('value').join(', ');
            $(".selectedDay").text(valuesStr);
        });
    });

    $('#groupindex-demo').bind('pageshow', function () {
        $('#groupindex').scrolllistview();
    });

    $("#popupwindow-demo").bind("pageshow", function () {
        $('#popupwindow-demo-transition-' + $("#popupContent2").popupwindow("option", "transition")).attr("checked", "true").checkboxradio("refresh");
    });
    $('input[name=popupwindow-demo-transition-choice]').bind("change", function (e) {
        $("#popupContent2").popupwindow("option", "transition", $(this).attr("id").split("-").pop());
    });

    $("#showVolumeButton").bind("vclick", function (e) {
        $("#myVolumeControl").volumecontrol("open");
    });
    $("#volumecontrol_setBasicTone").bind("change", function (e) {
        var basicTone = !($("#volumecontrol_setBasicTone").next('label').find(".ui-icon").hasClass("ui-icon-checkbox-on"));

        if (basicTone) {
            $("#myVolumeControl").volumecontrol("option", "basicTone", true);
            $("#myVolumeControl").volumecontrol("option", "title", "Basic Tone");
        } else {
            $("#myVolumeControl").volumecontrol("option", "basicTone", false);
            $("#myVolumeControl").volumecontrol("option", "title", "Volume");
        }
    });

    $("#myoptionheader").bind('collapse', function () {
        console.log('option header was collapsed');
    });

    $("#myoptionheader").bind('expand', function () {
        console.log('option header was expanded');
    });

    $('#slider-demo').bind('pageshow', function () {
        var popupEnabled = false;

        var setPopupEnabled = function (newState) {
                $('#mySlider').todonsslider('option', 'popupEnabled', newState);
                $("#togglePopup .ui-btn-text").text((newState ? "Dis" : "En") + "able popup");
            };

        setPopupEnabled(popupEnabled);

        $("#togglePopup").bind("vclick", function (e) {
            popupEnabled = !popupEnabled;
            setPopupEnabled(popupEnabled);
        });
    });


    $("#personpicker-demo").bind('pageshow', function () {
        var personpicker = $(":jqmData(role='personpicker')");
        personpicker.personpicker('option', 'addressBook', new $.mobile.todons.AddressBook());

        personpicker.personpicker('option', 'successCallback', function (persons) {
            s = "PersonPicker succedeed! These are the selected persons:\n";
            persons.forEach(function (p) {
                s += p.id() + " ";
            });
            alert(s);
        });

        personpicker.personpicker('refresh');
    });

    $("#autodividers-demo").bind('pageshow', function () {
        $('#add-gary-button').unbind('click').bind('click', function () {
            var gary = $('<li><a href="#">Gary</a></li>');
            $('#refreshable-dividers').find('li.ui-li-divider:contains(I)').before(gary);
        });

        $('#remove-bertie-button').unbind('click').bind('click', function () {
            $('#refreshable-dividers').find('li:contains("Bertie")').remove();
        });

        $('#refreshable-dividers').unbind('updatelayout').bind('updatelayout', function () {
            console.log('dividers were updated on refreshable list');
        });
    });

    $("#listviewcontrols-demo").bind("pageshow", function () {
        var listview = $(this).find('#listviewcontrols-demo-listview');
        var toggler = $(this).find('#listviewcontrols-demo-toggler');
        var uberCheck = $(this).find('#listviewcontrols-demo-checkbox-uber');
        var searchFilter = $(this).find('input:jqmData(type=search)');
        var clearUberCheck = null;

        toggler.unbind("change").bind("change", function () {
            var value = toggler.val();
            listview.listviewcontrols('option', 'mode', value);
        });

        uberCheck.unbind("change").bind("change", function () {
            var checked = uberCheck.is(':checked');

            var listItems = listview.listviewcontrols('visibleListItems');

            listItems.each(function () {
                var checkbox = $(this).find('input[type="checkbox"]');

                if (checked) {
                    checkbox.attr('checked', 'checked');
                }
                else {
                    checkbox.removeAttr('checked');
                }

                checkbox.checkboxradio('refresh');
            });
        });

        // when a search filter is applied, uncheck the uberCheck
        // if _any_ of the remaining items displayed are unchecked
        clearUberCheck = function () {
            var listItems = listview.listviewcontrols('visibleListItems');
            var unchecked = listItems.has('input[type="checkbox"]:not(:checked)');
            if (unchecked.length > 0) {
                uberCheck.removeAttr('checked');
                uberCheck.checkboxradio('refresh');
            }
            else if (listItems.length - unchecked.length === listItems.length) {
                uberCheck.attr('checked', 'checked');
                uberCheck.checkboxradio('refresh');
            }
        };

        searchFilter.unbind("keyup change", clearUberCheck)
                    .bind("keyup change", clearUberCheck);

        // also bind all the list items to the same function
        listview.find('input[type="checkbox"]')
                .unbind('change', clearUberCheck)
                .bind('change', clearUberCheck);
    });

    // this tests that refreshing a swipelist multiple times only
    // causes the event handlers to be bound once
    $('#swipelist-demo').bind('pageshow', function () {
        for (var i = 0 ; i < 4 ; i++) {
            $(this).find(':jqmData(role=swipelist)').swipelist('refresh');
        }
    });

    var clrWidgetsAreInit = false;

    $("#colorwidgets-demo").bind("pageshow", function () {
        if (clrWidgetsAreInit) return;

        $("#colorpicker").bind("colorchanged", function (e, clr) {
            $("#colorpickerbutton").colorpickerbutton("option", "color", clr);
            $("#colorpickerbutton-noform").colorpickerbutton("option", "color", clr);
            $("#hsvpicker").hsvpicker("option", "color", clr);
            $("#colortitle").colortitle("option", "color", clr);
            $("#colorpalette").colorpalette("option", "color", clr);
        });
        $("#colorpickerbutton").bind("colorchanged", function (e, clr) {
            $("#colorpicker").colorpicker("option", "color", clr);
            $("#colorpickerbutton-noform").colorpickerbutton("option", "color", clr);
            $("#hsvpicker").hsvpicker("option", "color", clr);
            $("#colortitle").colortitle("option", "color", clr);
            $("#colorpalette").colorpalette("option", "color", clr);
        });
        $("#colorpickerbutton-noform").bind("colorchanged", function (e, clr) {
            $("#colorpicker").colorpicker("option", "color", clr);
            $("#colorpickerbutton").colorpickerbutton("option", "color", clr);
            $("#hsvpicker").hsvpicker("option", "color", clr);
            $("#colortitle").colortitle("option", "color", clr);
            $("#colorpalette").colorpalette("option", "color", clr);
        });
        $("#hsvpicker").bind("colorchanged", function (e, clr) {
            $("#colorpicker").colorpicker("option", "color", clr);
            $("#colorpickerbutton").colorpickerbutton("option", "color", clr);
            $("#colorpickerbutton-noform").colorpickerbutton("option", "color", clr);
            $("#colortitle").colortitle("option", "color", clr);
            $("#colorpalette").colorpalette("option", "color", clr);
        });
        $("#colortitle").bind("colorchanged", function (e, clr) {
            $("#colorpicker").colorpicker("option", "color", clr);
            $("#colorpickerbutton").colorpickerbutton("option", "color", clr);
            $("#colorpickerbutton-noform").colorpickerbutton("option", "color", clr);
            $("#hsvpicker").hsvpicker("option", "color", clr);
            $("#colorpalette").colorpalette("option", "color", clr);
        });
        $("#colorpalette").bind("colorchanged", function (e, clr) {
            $("#colorpicker").colorpicker("option", "color", clr);
            $("#colorpickerbutton").colorpickerbutton("option", "color", clr);
            $("#colorpickerbutton-noform").colorpickerbutton("option", "color", clr);
            $("#hsvpicker").hsvpicker("option", "color", clr);
            $("#colortitle").colortitle("option", "color", clr);
        });
        $("#colorpalette").colorpalette("option", "color", "#45cc98");

        clrWidgetsAreInit = true;
    });
});


$(document).bind("pagecreate", function () {
    var button = $('#calendarbutton');
    button.bind('vclick', function (e) {
        button.calendarpicker('open');
        button.unbind('selectedDate').bind('selectedDate', function (e, val) {
            $('#selectedCalendarDate').attr('value', val);
        });
    });
});

$(document).bind("pageinit", function() {
    $("#singleimagedisplay-demo").bind("pageinit", function(e) {
        $(this).find('.singleimagedisplay-container').bind("vclick", function (e) {
            var displayImage = $("#singleimagedisplay-display-image");

            var img = $(this).find('img:jqmData(role=singleimagedisplay)');
            var src = null;
            var noContent = null;
            if (img.length>0) {
                src = img.singleimagedisplay('option', 'source');
                noContent = img.singleimagedisplay('option', 'noContent');
            };

            $.mobile.changePage("#singleimagedisplay-display");

            displayImage.singleimagedisplay('option', 'source', src);
            displayImage.singleimagedisplay('option', 'noContent', noContent);
        });

        // this sets the "broken" src image for #custombroken
        $(this).find('#custombroken:jqmData(role=singleimagedisplay)')
        .singleimagedisplay('option','noContent','images/noContent-2.png');
    });
});

function launchPersonPicker() {
    $("#personpicker-page-demo").personpicker_page({
        title: "Choose contacts",
        addressBook: new $.mobile.todons.AddressBook(),
        successCallback: function (persons) {
            s = "The following contacts were chosen:\n";
            persons.forEach(function (p) {
                s += p.id() + " ";
            });
            alert(s);
        }
    });
    $.mobile.changePage("#personpicker-page-demo");
}
