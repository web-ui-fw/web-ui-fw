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
    $("input[type='checkbox'][data-widget-type-list]").bind("change", function() {
        var ls = $(this).attr("data-widget-type-list").split(","),
            page = $(this).closest(":jqmData(role='page')"),
            disabled = $(this).is(":checked");

        $.each(ls, function(idx, widgetType) {
            var ar = widgetType.split("-");

            if (ar.length === 2)
                page.find(":" + widgetType)[ar[1]]("option", "disabled", disabled);
        });
    });

    $('#processingcircle-demo').bind('pageshow', function (e) {
        $(this).find(':jqmData(role="processingcircle")').each(function () {
            var randomWait = 500 * (Math.floor(Math.random() * 6) + 4);
            var elt = $(this);

            elt.unbind('stop').bind('stop', function () {
                elt.parent().find('p').text("I am done!");
            });

            setTimeout(function () {
                elt.processingcircle('destroy');
            }, randomWait);
        });
    });

    $('#processingbar-demo').bind('pagecreate', function () {
        $(this).find(':jqmData(role="processingbar")').each(function () {
            var randomWait = 500 * (Math.floor(Math.random() * 6) + 4);
            var elt = $(this);

            elt.unbind('stop').bind('stop', function () {
                elt.parent().append('<p>I am done!</p>');
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

    $("#convertToPopup").bind("vclick", function() {
        var btn = $(this),
            popup = $("#runtimePopup"),
            txt = $("#convertToPopupText");

        if (!popup.data("popupwindow")) {
            var restoreBtn = $("<a></a>").text("Restore");

            txt.text("Show popup");
            restoreBtn
                .appendTo(popup)
                .buttonMarkup()
                .bind("vclick", function() {
                    popup.popupwindow("destroy");
                    restoreBtn.remove();
                    txt.text("Convert to popup");
                });
            $.todons.popupwindow.bindPopupToButton(btn, popup.popupwindow());
            btn.trigger("vclick");
        }
    });

    $('input[name=popupwindow-demo-transition-choice]').bind("change", function (e) {
        $("#popupContent2").popupwindow("option", "transition", $(this).attr("id").split("-").pop());
    });

    $("#showVolumeButton").bind("vclick", function (e) {
        $("#myVolumeControl").volumecontrol("open");
    });
    $("#volumecontrol_setBasicTone").bind("change", function (e) {
        var basicTone = $("#volumecontrol_setBasicTone").is(":checked");

        if (basicTone) {
            $("#myVolumeControl").volumecontrol("option", "basicTone", true);
            $("#myVolumeControl").volumecontrol("option", "title", "Basic Tone");
        } else {
            $("#myVolumeControl").volumecontrol("option", "basicTone", false);
            $("#myVolumeControl").volumecontrol("option", "title", "Volume");
        }
    });

    $("#checkHideInput").bind("change", function (e) {
        $("#colorpickerbutton").colorpickerbutton("option", "hideInput", $("#checkHideInput").is(":checked"));
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

    var coordSwitchesAreInit = false;
    $("#switch-demo").bind("pageshow", function(e) {
        if (coordSwitchesAreInit) return;

        $("#switch-1-coord").bind("changed", function(e) {
            $("#switch-2-coord").toggleswitch("option", "checked", $("#switch-1-coord").toggleswitch("option", "checked"));
        });
        $("#switch-2-coord").bind("changed", function(e) {
            $("#switch-1-coord").toggleswitch("option", "checked", $("#switch-2-coord").toggleswitch("option", "checked"));
        });

        coordSwitchesAreInit = true;
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

    $('#optionheader-demo-programmatic-example').bind('pageshow', function () {
        $(this).find('#optionheader-demo-to-be-1').optionheader({startCollapsed:true});
        $(this).find('#optionheader-demo-to-be-2').optionheader({startCollapsed:false});
    });

    $('#layoutvbox-demo').bind('pageshow', function () {
        var tinyDiv = $('<div class="layout-demo-onehundred">' +
                        '<p>tiny tiny tiny tiny tiny tiny</p>' +
                        '</div>');

        var biggerDiv = $('<div class="layout-demo-twohundred">' +
                          '<p>bigger bigger bigger bigger bigger!</p>' +
                          '</div>');

        $('#layoutvbox-demo-add-start').unbind('vclick').bind('vclick', function () {
            var newDiv = tinyDiv.clone();
            newDiv.addClass('layout-demo-red');
            $('#layoutvbox-demo-add-container').prepend(newDiv);
            $('#layoutvbox-demo-add-container').layoutvbox('refresh');
        });
        $('#layoutvbox-demo-add-end').unbind('vclick').bind('vclick', function () {
            var newDiv = tinyDiv.clone();
            newDiv.addClass('layout-demo-blue');
            $('#layoutvbox-demo-add-container').append(newDiv);
            $('#layoutvbox-demo-add-container').layoutvbox('refresh');
        });
        $('#layoutvbox-demo-add-reset').unbind('vclick').bind('vclick', function () {
            $('#layoutvbox-demo-add-container').find('.layout-demo-blue,.layout-demo-red')
                                               .remove();
            $('#layoutvbox-demo-add-container').layoutvbox('refresh');
        });

        var container = $('#layoutvbox-demo-add-container-sv');

        $('#layoutvbox-demo-add-start-sv').unbind('vclick').bind('vclick', function () {
            var newDiv = biggerDiv.clone();
            newDiv.addClass('layout-demo-red');
            container.find('.ui-scrollview-view').prepend(newDiv);
            container.layoutvbox('refresh');
        });
        $('#layoutvbox-demo-add-end-sv').unbind('vclick').bind('vclick', function () {
            var newDiv = biggerDiv.clone();
            newDiv.addClass('layout-demo-blue');
            container.find('.ui-scrollview-view').append(newDiv);
            container.layoutvbox('refresh');
        });
        $('#layoutvbox-demo-add-reset-sv').unbind('vclick').bind('vclick', function () {
            container.find('.layout-demo-blue,.layout-demo-red')
                     .remove();
            container.layoutvbox('refresh');
            container.scrollview('scrollTo', 0, 0);
        });
        $('#layoutvbox-demo-add-increase-sv').unbind('vclick').bind('vclick', function () {
            var vgap = container.layoutvbox('option', 'vgap');
            vgap += 5;
            container.layoutvbox('option', 'vgap', vgap);
            container.layoutvbox('refresh');
        });
        $('#layoutvbox-demo-add-decrease-sv').unbind('vclick').bind('vclick', function () {
            var vgap = container.layoutvbox('option', 'vgap');
            vgap -= 5;
            vgap = Math.max(vgap, 0);
            container.layoutvbox('option', 'vgap', vgap);
            container.layoutvbox('refresh');
        });
        $('#layoutvbox-demo-add-toggle-sv').unbind('vclick').bind('vclick', function () {
            var val = $(this).attr('value');
            var newVal, newText;
            if (val === 'on') {
                newVal = 'off';
                container.layoutvbox('option', 'showScrollBars', false);
            }
            else {
                newVal = 'on';
                container.layoutvbox('option', 'showScrollBars', true);
            }
            newText = 'Scrollbars ' + val;
            $(this).find('.ui-btn-text').text(newText);
            $(this).attr('value', newVal);
            container.layoutvbox('refresh');
        });
    });

    $('#layouthbox-demo').bind('pageshow', function () {
        var tinyDiv = $('<div class="layout-demo-onehundred">' +
                        '<p>tiny tiny tiny tiny tiny tiny</p>' +
                        '</div>');

        var biggerDiv = $('<div class="layout-demo-twohundred">' +
                          '<p>bigger bigger bigger bigger bigger!</p>' +
                          '</div>');

        $('#layouthbox-demo-add-start').unbind('vclick').bind('vclick', function () {
            var newDiv = tinyDiv.clone();
            newDiv.addClass('layout-demo-red');
            $('#layouthbox-demo-add-container').prepend(newDiv);
            $('#layouthbox-demo-add-container').layouthbox('refresh');
        });
        $('#layouthbox-demo-add-end').unbind('vclick').bind('vclick', function () {
            var newDiv = tinyDiv.clone();
            newDiv.addClass('layout-demo-blue');
            $('#layouthbox-demo-add-container').append(newDiv);
            $('#layouthbox-demo-add-container').layouthbox('refresh');
        });
        $('#layouthbox-demo-add-reset').unbind('vclick').bind('vclick', function () {
            $('#layouthbox-demo-add-container').find('.layout-demo-blue,.layout-demo-red')
                                               .remove();
            $('#layouthbox-demo-add-container').layouthbox('refresh');
        });

        var container = $('#layouthbox-demo-add-container-sv');

        $('#layouthbox-demo-add-start-sv').unbind('vclick').bind('vclick', function () {
            var newDiv = biggerDiv.clone();
            newDiv.addClass('layout-demo-red');
            container.find('.ui-scrollview-view').prepend(newDiv);
            container.layouthbox('refresh');
        });
        $('#layouthbox-demo-add-end-sv').unbind('vclick').bind('vclick', function () {
            var newDiv = biggerDiv.clone();
            newDiv.addClass('layout-demo-blue');
            container.find('.ui-scrollview-view').append(newDiv);
            container.layouthbox('refresh');
        });
        $('#layouthbox-demo-add-reset-sv').unbind('vclick').bind('vclick', function () {
            container.find('.layout-demo-blue,.layout-demo-red')
                     .remove();
            container.layouthbox('refresh');
            container.scrollview('scrollTo', 0, 0);
        });
        $('#layouthbox-demo-add-increase-sv').unbind('vclick').bind('vclick', function () {
            var hgap = container.layouthbox('option', 'hgap');
            hgap += 5;
            container.layouthbox('option', 'hgap', hgap);
            container.layouthbox('refresh');
        });
        $('#layouthbox-demo-add-decrease-sv').unbind('vclick').bind('vclick', function () {
            var hgap = container.layouthbox('option', 'hgap');
            hgap -= 5;
            hgap = Math.max(hgap, 0);
            container.layouthbox('option', 'hgap', hgap);
            container.layouthbox('refresh');
        });
        $('#layouthbox-demo-add-toggle-sv').unbind('vclick').bind('vclick', function () {
            var val = $(this).attr('value');
            var newVal, newText;
            if (val === 'on') {
                newVal = 'off';
                container.layouthbox('option', 'showScrollBars', false);
            }
            else {
                newVal = 'on';
                container.layouthbox('option', 'showScrollBars', true);
            }
            newText = 'Scrollbars ' + val;
            $(this).find('.ui-btn-text').text(newText);
            $(this).attr('value', newVal);
            container.layouthbox('refresh');
        });
    });
});

$(document).bind("pagecreate", function () {
    $('#calendarbutton').bind('selectedDate', function(e, val) {
        $('#selectedCalendarDate').attr('value', val);
    });
});

$(document).bind("pagecreate", function() {
    $("#input-switch").toggleswitch();
});

$(document).bind("pageinit", function() {
    $("#singleimagedisplay-demo").bind("pageinit", function(e) {
        $(this).find('.singleimagedisplay-container').bind("vclick", function (e) {
            var displayImage = $("#singleimagedisplay-display-image");

            var img = $(this).find('img:jqmData(role=singleimagedisplay)');
            var source = null;
            var noContent = null;
            if (img.length>0) {
                source = img.singleimagedisplay('option', 'source');
                noContent = img.singleimagedisplay('option', 'noContent');
            };

            $.mobile.changePage("#singleimagedisplay-display");

            displayImage.singleimagedisplay('option', 'source', source);
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
