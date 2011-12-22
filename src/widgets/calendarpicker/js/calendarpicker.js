/*
 * jQuery Mobile Widget @VERSION
 *
 * This software is licensed under the MIT licence (as defined by the OSI at
 * http://www.opensource.org/licenses/mit-license.php)
 * 
 * ***************************************************************************
 * Copyright (C) 2011 by Intel Corporation Ltd.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 *
 * Authors: Kalyan Kondapally <kalyan.kondapally@intel.com>
 */

// CalendarPicker can be created using the calendarpicker() method or by adding a
// data-role="calendarpicker" attribute to an element. The element is converted to a button, which, when clicked, pops up
// the calendarpicker widget. Thus, you can use any button styles you wish (such as data-corners="true/false",
// data-inline="true/false", etc.).
// The core logic of the widget has been taken from https://github.com/jtsage/jquery-mobile-datebox
//
// CalendarPicker is hidden by default. It can be displayed by calling open() or setting option "show" to true
// during creation and close() to hide it. It appears as a popup window and disappears when closed.
// CalendarPicker closes automatically when a valid date selection has been made, or when the user clicks
// outside its box.
//
// Options:
//
//     dateFormat: The format of date. The Default value is YYYY-MM-DD.
//
//     calShowDays: Default value is true. Should be set to false if name of the day should not be displayed.
//     calShowOnlyMonth: Default Value is true. Should be set to false if previous or next month dates should be visible
//                        along with the current month.
//     highDays: An array of days to highlight, every week followed by the theme used to hightlight them.
//               Sun = Sunday, Mon = Monday, ... Sat = Saturday (e.g. ["Sun","b", "Sat", "mycustomtheme"])
//     disabledDayColor: Colour used to show disabled dates.
//     calHighToday: Theme used to highlight current day. By default it is set to e.Setting the value to null will disable
//                   highlighting todays date.
//     highDatesTheme: The theme used to highlight dates specified by highDates option.By default it is theme e.
//     calStartDay: Defines the start day of the week. By default it is 1(Monday).
//
//     FOllowing documentation taken from http://dev.jtsage.com/#/jQM-DateBox/demos/calendar/ :
//
//     afterToday: When set, only dates that are after or on "today" are selectable.
//     beforeToday: When set, only dates that are before or on "today" are selectable.
//     notToday: When set, "today" is not selectable.
//     minDays: When set, only dates that are after *number* of days before today may be selected.
//              Note that minDays can be a negative number.
//     maxDays: When set, only dates that are before *number* of days after today may be selected.
//              Note that maxDays can be a negative number.
//     highDates: An array of ISO 8601 Dates to highlight. (e.g. ["2011-01-01", "2011-12-25"]).
//     blackDays: An array of days to disable, every week. 0 = Sunday, 1 = Monday, ... 6 = Saturday (e.g. [2]).
//     blackDates: An array of ISO 8601 Dates to disable. (e.g. ["2011-01-01", "2011-12-25"]).
//     Using a calendar to select a specific day can be accomplished by setting option 'calWeekMode' to 'true'
//     and 'calWeekModeFirstDay' to the day you wish to pick.
//
// Events:
//
//     appear: Fired after calendarpicker becomes visible and appear animation has ended.
//     disappear: Fired after calendarpicker is closed and disappear animation has ended.
//     selectedDate: Fired after user has selected a valid date. The formateddate(which user has selected)
//                   is sent as additional parameter.
//
// Properties:
//
//     open: Shows the CalendarPicker with an animation.
//     close: Hides the CalendarPicker with an animation.
//     visible: Returns true if calendarpicker is visible.
//     Refresh: Recalculates the needed buttons to display dates.It can be useful in cases like orientation change,
//              changing options dynamically etc.
//
// Examples:
//
//     HTML markup for creating CalendarPicker:
//         <div id = "calendarbutton" data-role = "calendarpicker">  </div>
//
//     How to Show CalendarPicker (for example when user presses a button):
//         <div id = "calendarbutton" data-role = "calendarpicker">
//             <a href="#" data-role="button" data-theme = "a" data-inline = true data-corners=false>
//                Launch CalendarPicker</a>
//         </div>
//        $(document).bind("pagecreate", function() {
//            var button = $('#calendarbutton');
//            button.bind('vclick', function (e) {
//	          button.calendarpicker('open'); --> Shows the CalendarPicker.
//                button.unbind('selectedDate').bind('selectedDate',function(e,val) {
//                // val should contain the selected date in specified format.
//                });
//            });
//        });
//
//    How to Show CalendarPicker by default:
//        <div id = "calendarbutton" data-role = "calendarpicker" data-options='{"show": "true"}'>  </div>
//
//    Passing custom options:
//         <div id = "calendarbutton" data-role = "calendarpicker" data-options='{"calShowOnlyMonth": "false"}'>  </div>
//         <div id = "calendarbutton" data-role = "calendarpicker" data-options='{"highDays": ["Mon","e","Wed","a"]}'></div>
//         <div id = "calendarbutton" data-role = "calendarpicker" data-options='{"highDates": ["2011-12-24", "2011-12-25"],
//                                                                                "highDatesTheme":"c"}'>  </div>
//
//    To select by week using Wednesday:
//        <div id = "calendarbutton" data-role = "calendarpicker" data-options='{"calWeekMode": true,
//                                                                               "calWeekModeFirstDay": 3}'>  </div>
//    To change startday of the week to be Sunday:
//        <div id = "calendarbutton" data-role = "calendarpicker" data-options='{"calStartDay": 0}'>  </div>

(function($, undefined ) {
    $.widget( "todons.calendarpicker", $.todons.widgetex, {
        options: {
            // All widget options, including some internal runtime details
            daysOfWeekShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            monthsOfYear: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
                           'October', 'November', 'December'],
            calShowDays: true,
            calShowOnlyMonth: true,
            dateFormat: 'YYYY-MM-DD',
            calWeekMode: false,
            calWeekModeFirstDay: 1,
            calStartDay: 1,
            notToday:false,
            afterToday: false,
            beforeToday: false,
            maxDays: false,
            minDays: false,
            highDays: ["Sun","firstdaybutton", "Sat","lastdaybutton"],
            calHighToday: "e",
            highDates: false,
            highDatesTheme:"e",
            blackDays: false,
            blackDates: false,
            disabledDayColor: '#888',
            show: false
        },

        _zeroPad: function(number) {
            // Pad a number with a zero, to make it 2 digits
            return ( ( number < 10 ) ? "0" : "" ) + String(number);
        },

        _makeOrd: function (num) {
            // Return an ordinal suffix (1st, 2nd, 3rd, etc)
            var ending = num % 10;
            if ( num > 9 && num < 21 ) { return 'th'; }
            if ( ending > 3 ) { return 'th'; }
            return ['th','st','nd','rd'][ending];
        },

        _dstAdjust: function(date) {
            // Make sure not to run into daylight savings time.
            if (!date) { return null; }
            date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
            return date;
        },

        _getFirstDay: function(date) {
            // Get the first DAY of the month (0-6)
            return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        },

        _getLastDate: function(date) {
            // Get the last DATE of the month (28,29,30,31)
            return 32 - this._dstAdjust(new Date(date.getFullYear(), date.getMonth(), 32)).getDate();
        },

        _getLastDateBefore: function(date) {
            // Get the last DATE of the PREVIOUS month (28,29,30,31)
            return 32 - this._dstAdjust(new Date(date.getFullYear(), date.getMonth()-1, 32)).getDate();
        },

        _formatter: function(format, date) {
            // Format the output date or time (not duration)
            format = format.replace('SS', this._makeOrd(date.getDate()));
            format = format.replace('YYYY', date.getFullYear());
            format = format.replace('MM',   this._zeroPad(date.getMonth() + 1));
            format = format.replace('mm',   date.getMonth() + 1);
            format = format.replace('DD',   this._zeroPad(date.getDate()));
            format = format.replace('dd',   date.getDate());
            return format;
        },

        _formatDate: function(date) {
            // Shortcut function to return dateFormat date/time format
            return this._formatter(this.options.dateFormat, date);
        },

        _isoDate: function(y,m,d) {
            // Return an ISO 8601 date (yyyy-mm-dd)
            return String(y) + '-' + (( m < 10 ) ? "0" : "") + String(m) + '-' + ((d < 10 ) ? "0" : "") + String(d);
        },

        _checker: function(date) {
            // Return a ISO 8601 BASIC format date (YYYYMMDD) for simple comparisons
            return parseInt(String(date.getFullYear()) + this._zeroPad(date.getMonth()+1) + this._zeroPad(date.getDate()),10);
        },

        _offset: function(mode, amount, update) {
            // Compute a date/time.
            //   update = false to prevent controls refresh
            var self = this,
            o = this.options;

            if ( typeof(update) === "undefined" ) { update = true; }
            switch(mode) {
            case 'y':
                 self.theDate.setYear(self.theDate.getFullYear() + amount);
                break;
            case 'm':
                self.theDate.setMonth(self.theDate.getMonth() + amount);
                break;
            case 'd':
                self.theDate.setDate(self.theDate.getDate() + amount);
                break;
            }
            if ( update === true ) { self._update(); }
        },

        _update: function() {
            // Update the display on date change
            var self = this,
                o = self.options,
                testDate = null,
                i, gridWeek, gridDay, skipThis, thisRow, y, cTheme, inheritDate, thisPRow, tmpVal,
                interval = {'d': 60*60*24, 'h': 60*60, 'i': 60, 's':1},
                calmode = {};

            self._ui.cpMonthGrid.text( o.monthsOfYear[self.theDate.getMonth()] + " " + self.theDate.getFullYear() );
            self._ui.cpweekDayGrid.html('');

            calmode = {'today': -1, 'highlightDay': -1, 'presetDay': -1, 'nexttoday': 1,
                'thisDate': new Date(), 'maxDate': new Date(), 'minDate': new Date(),
                'currentMonth': false, 'weekMode': 0, 'weekDays': null, 'thisTheme': o.pickPageButtoTheme };
            calmode.start = self._getFirstDay(self.theDate);
            calmode.end = self._getLastDate(self.theDate);
            calmode.lastend = self._getLastDateBefore(self.theDate);
            if ( o.calStartDay > 0 ) {
                calmode.start = calmode.start - o.calStartDay;
                if ( calmode.start < 0 ) { calmode.start = calmode.start + 7; }
            }
            calmode.prevtoday = calmode.lastend - (calmode.start - 1);
            calmode.checkDates = ( o.afterToday !== false || o.beforeToday !== false || o.notToday !== false || o.maxDays !== false || o.minDays !== false || o.blackDates !== false || o.blackDays !== false );

            if ( calmode.thisDate.getMonth() === self.theDate.getMonth() && calmode.thisDate.getFullYear() === self.theDate.getFullYear() ) { calmode.currentMonth = true; calmode.highlightDay = calmode.thisDate.getDate(); }

            self.calNoPrev = false; self.calNoNext = false;

            if ( o.afterToday === true &&
                ( calmode.currentMonth === true || ( calmode.thisDate.getMonth() >= self.theDate.getMonth() && self.theDate.getFullYear() === calmode.thisDate.getFullYear() ) ) ) {
                self.calNoPrev = true; }
            if ( o.beforeToday === true &&
                ( calmode.currentMonth === true || ( calmode.thisDate.getMonth() <= self.theDate.getMonth() && self.theDate.getFullYear() === calmode.thisDate.getFullYear() ) ) ) {
                self.calNoNext = true; }

            if ( o.minDays !== false ) {
                calmode.minDate.setDate(calmode.minDate.getDate() - o.minDays);
                if ( self.theDate.getFullYear() === calmode.minDate.getFullYear() && self.theDate.getMonth() <= calmode.minDate.getMonth() ) { self.calNoPrev = true;}
            }
            if ( o.maxDays !== false ) {
                calmode.maxDate.setDate(calmode.maxDate.getDate() + o.maxDays);
                if ( self.theDate.getFullYear() === calmode.maxDate.getFullYear() && self.theDate.getMonth() >= calmode.maxDate.getMonth() ) { self.calNoNext = true;}
            }

            if ( o.calShowDays ) {
                if ( o.daysOfWeekShort.length < 8 ) { o.daysOfWeekShort = o.daysOfWeekShort.concat(o.daysOfWeekShort); }
                calmode.weekDays = $("<div>", {'class':'ui-cp-row'}).appendTo(self._ui.cpweekDayGrid);
                for ( i=0; i<=6;i++ ) {
                    $("<div>"+o.daysOfWeekShort[i+o.calStartDay]+"</div>").addClass('ui-cp-date ui-cp-date-disabled ui-cp-month').appendTo(calmode.weekDays);
                }
            }

            for ( gridWeek=0; gridWeek<=5; gridWeek++ ) {
                if ( gridWeek === 0 || ( gridWeek > 0 && (calmode.today > 0 && calmode.today <= calmode.end) ) ) {
                    thisRow = $("<div>", {'class': 'ui-cp-row'}).appendTo(self._ui.cpweekDayGrid);
                    for ( gridDay=0; gridDay<=6; gridDay++) {
                        if ( gridDay === 0 ) { calmode.weekMode = ( calmode.today < 1 ) ? (calmode.prevtoday - calmode.lastend + o.calWeekModeFirstDay) : (calmode.today + o.calWeekModeFirstDay); }
                        if ( gridDay === calmode.start && gridWeek === 0 ) { calmode.today = 1; }
                        if ( calmode.today > calmode.end ) { calmode.today = -1; }
                        if ( calmode.today < 1 ) {
                            if ( o.calShowOnlyMonth ) {
                                $("<div>", {'class': 'ui-cp-date ui-cp-date-disabled'}).appendTo(thisRow);
                            } else {
                                if (
                                    ( o.blackDays !== false && $.inArray(gridDay, o.blackDays) > -1 ) ||
                                    ( o.blackDates !== false && $.inArray(self._isoDate(self.theDate.getFullYear(), (self.theDate.getMonth()), calmode.prevtoday), o.blackDates) > -1 ) ||
                                    ( o.blackDates !== false && $.inArray(self._isoDate(self.theDate.getFullYear(), (self.theDate.getMonth()+2), calmode.nexttoday), o.blackDates) > -1 ) ) {
                                        skipThis = true;
                                } else { skipThis = false; }

                                if ( gridWeek === 0 ) {
                                    $("<div>"+String(calmode.prevtoday)+"</div>")
                                        .addClass('ui-cp-date ui-cp-date-disabled').appendTo(thisRow)
                                        .attr('data-date', ((o.calWeekMode)?(calmode.weekMode+calmode.lastend):calmode.prevtoday));
                                    calmode.prevtoday++;
                                } else {
                                    $("<div>"+String(calmode.nexttoday)+"</div>")
                                        .addClass('ui-cp-date ui-cp-date-disabled').appendTo(thisRow)
                                        .attr('data-date', ((o.calWeekMode)?calmode.weekMode:calmode.nexttoday));
                                    calmode.nexttoday++;
                                }
                            }
                        } else {
                            skipThis = false;
                            if ( calmode.checkDates ) {
                                if ( o.afterToday && self._checker(calmode.thisDate) > (self._checker(self.theDate)+calmode.today-self.theDate.getDate()) ) {
                                    skipThis = true;
                                }
                                if ( !skipThis && o.beforeToday && self._checker(calmode.thisDate) < (self._checker(self.theDate)+calmode.today-self.theDate.getDate()) ) {
                                    skipThis = true;
                                }
                                if ( !skipThis && o.notToday && calmode.today === calmode.highlightDay ) {
                                    skipThis = true;
                                }
                                if ( !skipThis && o.maxDays !== false && self._checker(calmode.maxDate) < (self._checker(self.theDate)+calmode.today-self.theDate.getDate()) ) {
                                    skipThis = true;
                                }
                                if ( !skipThis && o.minDays !== false && self._checker(calmode.minDate) > (self._checker(self.theDate)+calmode.today-self.theDate.getDate()) ) {
                                    skipThis = true;
                                }
                                if ( !skipThis && ( o.blackDays !== false || o.blackDates !== false ) ) { // Blacklists
                                    if (
                                        ( $.inArray(gridDay, o.blackDays) > -1 ) ||
                                        ( $.inArray(self._isoDate(self.theDate.getFullYear(), self.theDate.getMonth()+1, calmode.today), o.blackDates) > -1 ) ) {
                                            skipThis = true;
                                    }
                                }
                            }

                            if ( o.calHighToday !== null && calmode.today === calmode.highlightDay ) {
                                calmode.thisTheme = o.calHighToday;
                            } else if ( $.isArray(o.highDates) && ($.inArray(self._isoDate(self.theDate.getFullYear(), self.theDate.getMonth()+1, calmode.today), o.highDates) > -1 ) ) {
                                calmode.thisTheme = o.highDatesTheme;
                            } else if ( $.isArray(o.highDays) && $.inArray(o.daysOfWeekShort[gridDay+o.calStartDay], o.highDays) > -1 ) {
                                  var index = $.inArray(o.daysOfWeekShort[gridDay+o.calStartDay], o.highDays);
                                  var theme = "calendarbutton";
                                  index = index == o.highDays.length-1 ? -1 :index;
                                  if (index>-1) {
                                      var temp = o.highDays[index+1];
                                      if (isNaN(temp))
                                          theme = temp;
                                  }
                                calmode.thisTheme = o.highDays[index+1];
                            } else {
                                calmode.thisTheme = "calendarbutton";
                            }


                            $("<div>"+String(calmode.today)+"</div>")
                                .addClass('ui-cp-date ui-calendarbtncommon')
                                .attr('data-date', ((o.calWeekMode)?calmode.weekMode:calmode.today))
                                .attr('data-theme', calmode.thisTheme)
                                .appendTo(thisRow)
                                .addClass('ui-btn-up-'+calmode.thisTheme)
                                .unbind().bind((!skipThis)?'vclick':'error', function(e) {
                                        var theDate = self._formatDate(self.theDate);

                                        e.preventDefault();
                                        self.theDate.setDate($(this).attr('data-date'));
                                        self.element.trigger('selectedDate',[theDate]);
                                        if (self.element.is("input"))
                                            self.element
                                                .attr("value", theDate)
                                                .trigger("change");
                                        self.close();
                                })
                                .css((skipThis)?'color':'nocolor', o.disabledDayColor);

                            calmode.today++;
                        }
                    }
                }
            }
        },

        _create: function() {
            // Create the widget, called automatically by widget system
            var self = this,
                o = $.extend(this.options, this.element.data('options')),
                input = this.element,
                theDate = new Date(); // Internal date object, used for all operations
            $.extend(self, {
                     input:input,
                     theDate: theDate
            });

            $(this.element).buttonMarkup().bind("vclick", function() {
                self.open();
            });

            self._buildPage();
        },

        _htmlProto: {
            ui: {
                cpContainer:    ".ui-cp-container",
                cpHeader:       ".ui-cp-headercontainer",
                cpweekDayGrid:  ".ui-cp-weekday",
                cpMonthGrid:    ".ui-cp-month",
                previousButton: ".ui-cp-previous",
                nextButton:     ".ui-cp-next"
            }
        },

        _buildPage: function () {
            // Build the controls
            var self = this,
                o = self.options,
                isopen = false,
                previousButtonMarkup = {inline: true,
                                        corners:true,
                                        icon:'arrow-l',
                                        iconpos:'notext'},
                nextButtonMarkup = {inline: true,
                                    corners:true,
                                    icon:'arrow-r',
                                    iconpos:'notext'};

            this._ui.previousButton.buttonMarkup(previousButtonMarkup);
            this._ui.nextButton.buttonMarkup(nextButtonMarkup);

            this._ui.nextButton.bind('vclick',function(e) {
                e.preventDefault();
                if (!self.calNoNext) {
                    if ( self.theDate.getDate() > 28 ) { self.theDate.setDate(1); }
                    self._offset('m',1);
                }
            });
            this._ui.previousButton.bind('vclick', function(e) {
                e.preventDefault();
                if (!self.calNoPrev) {
                    if ( self.theDate.getDate() > 28 ) { self.theDate.setDate(1); }
                    self._offset('m',-1);
                }
            });

            $.extend(self, {
                isopen:isopen
            });
            this._ui.cpContainer.appendTo(self.element)
                       .popupwindow({transition: "slideup", overlayTheme: "c"})
                       .bind("closed", function(e) {
                          self.isopen = false;
                       });
            if (o.show)
                self.open();
        },

        refresh: function() {
            this._update();
        },

        visible: function() {
            return this.isopen;
        },

        _setDisabled: function(value) {
            $.Widget.prototype._setOption.call(this, "disabled", value);
            if (this.isopen && value)
                this.close();
            this.element[value ? "addClass" : "removeClass"]("ui-disabled");
        },

        open: function() {
            // Open the picker
            if (this.isopen === true ) { return false; } else { this.isopen = true; } // Ignore if already open
            this._update();
            /*
             * FIXME: Could pass some meaningful coordinates to "open" to make it show up in the right place, rather
             * than the center of the screen. The problem is that no widget from the page is associated with this
             * popup window, so we would have to start with this.element and work our way up the tree until we ran
             * into a widget whose coordinates we could actually pass to "open".
             */
            this._ui.cpContainer.popupwindow("open", 0, window.innerHeight);
        },

        close: function() {
            // Close the picker
            this._ui.cpContainer.popupwindow("close");
        }
    });
    // Autoinit widget.
    $( document ).bind( "pagecreate", function( e ){
        $( ":jqmData(role='calendarpicker')", e.target ).calendarpicker();
    });

})( jQuery );
