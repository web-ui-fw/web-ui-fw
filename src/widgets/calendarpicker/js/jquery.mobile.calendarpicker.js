/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Kalyan Kondapally <kalyan.kondapally@intel.com>
 */

/**
 * CalendarPicker can be created using the calendarpicker() method or by adding a
 * data-role="calendarpicker" attribute to an element.
 * The core logic of the widget has been taken from https://github.com/jtsage/jquery-mobile-datebox
 *
 * CalendarPicker is displayed by calling open and close to hide it.CalendarPicker
 * appears from bottom of the window and slides back when closed.CalendarPicker closes automatically when a valid
 * date selection has been made. In all other cases, close has to be explicitly called to hide it.
 *
 * Options:
 *
 *     slideupanimationtime: Total time for the appear animation.Default value is "fast".
 *     slideupanimation: The type of animaiton used to show the calendar picker. Default value is linear.
 *
 *     slidedownanimationtime: Total time for the disappear animation.Default value is "fast".
 *     slidedownanimation: The type of animaiton used to hide the calendar picker. Default value is linear.
 *
 *     dateFormat: The format of date. The Default value is YYYY-MM-DD.
 *
 *     calShowDays: Default value is true. Should be set to false if name of the day should not be displayed.
 *     calShowOnlyMonth: Default Value is true. Should be set to false if previous or next month dates should be visible
 *                        along with the current month.
 *      highDays: An array of days to highlight, every week followed by the theme used to hightlight them.
 *                0 = Sunday, 1 = Monday, ... 6 = Saturday (e.g. [2,"b", 3, "mycustomtheme"])
 *      disabledDayColor: Colour used to show disabled dates.
 *      calHighToday: Theme used to highlight current day. By default it is set to e.Setting the value to null will disable
 *                    highlighting todays date.
 *      highDatesTheme: The theme used to highlight dates specified by highDates option.By default it is theme e.
 *
 *      Documentation taken from http://dev.jtsage.com/#/jQM-DateBox/demos/calendar/ :
 *
 *      afterToday: When set, only dates that are after or on "today" are selectable.
 *      beforeToday: When set, only dates that are before or on "today" are selectable.
 *      notToday: When set, "today" is not selectable.
 *      minDays: When set, only dates that are after *number* of days before today may be selected. 
 *               Note that minDays can be a negative number.
 *      maxDays: When set, only dates that are before *number* of days after today may be selected. 
 *               Note that maxDays can be a negative number.
 *      highDates: An array of ISO 8601 Dates to highlight. (e.g. ["2011-01-01", "2011-12-25"]).
 *      blackDays: An array of days to disable, every week. 0 = Sunday, 1 = Monday, ... 6 = Saturday (e.g. [2])
 *      blackDates: An array of ISO 8601 Dates to disable. (e.g. ["2011-01-01", "2011-12-25"])
 *
 * Events:
 *
 *     appear: Fired after calendarpicker becomes visible and appear animation has ended.
 *     disappear: Fired after calendarpicker is closed and disappear animation has ended.
 *     selectedDate: Fired after user has selected a valid date. The formateddate(which user has selected)
 *                   is sent as additional parameter. 
 *
 * Properties:
 *     
 *     open: Shows the CalendarPicker with an animation.
 *     close: Hides the CalendarPicker with an animation.
 *     visible: Returns true if calendarpicker is visible.
 *     Refresh: Recalculates the needed buttons to display dates.It can be useful in cases like orientation change, 
 *              changing options dynamically etc.
 *
 * Examples:
 *         
 *     HTML markup for creating CalendarPicker:
 *         <div id = "calendarbutton" data-role = "calendarpicker">  </div>
 *
 *     How to Show CalendarPicker (for example when user presses a button):
 *         <div id = "calendarbutton" data-role = "calendarpicker"> 
 *             <a href="#" data-role="button" data-theme = "a" data-inline = true data-corners=false> Launch CalendarPicker</a>
 *         </div>
 *        $(document).bind("pagecreate", function() {
 *            var button = $('#calendarbutton');
 *            button.bind('vclick', function (e) { 
 *	          button.calendarpicker('open'); --> Shows the CalendarPicker.
 *                button.unbind('selectedDate').bind('selectedDate',function(e,val) {
 *                // val should contain the selected date in specified format.
 *                });
 *            });
 *        });
 *
 *    Passing custom options:
 *         <div id = "calendarbutton" data-role = "calendarpicker" data-options='{"calShowOnlyMonth": "false"}'>  </div>
 *         <div id = "calendarbutton" data-role = "calendarpicker" data-options='{"highDays": [1,"e", 2,"a"]}'>  </div>
 *         <div id = "calendarbutton" data-role = "calendarpicker" data-options='{"highDates": ["2011-12-24", "2011-12-25"],
 *                                                                                "highDatesTheme":"c"}'>  </div>
 */

(function($, undefined ) {
    $.widget( "TODONS.calendarpicker", $.mobile.widget, {
        options: {
            // All widget options, including some internal runtime details      
            daysOfWeekShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            monthsOfYear: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            slideupanimationtime: "fast",
            slidedownanimationtime: "fast",
            slideupanimation: "linear",
            slidedownanimation: "linear",
            calShowDays: true,
            calShowOnlyMonth: true,
            dateFormat: 'YYYY-MM-DD',
            calWeekMode: false,
            calWeekModeFirstDay: 1,
            notToday:false,
            afterToday: false,
            beforeToday: false,
            maxDays: false,
            minDays: false,
            highDays: [0,"firstdaybutton", 6,"lastdaybutton"],
	    calHighToday: "e",
            highDates: false,
            highDatesTheme:"e",
            blackDays: false,
            blackDates: false,
            disabledDayColor: '#888'
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

            self.cpMonthGrid.text( o.monthsOfYear[self.theDate.getMonth()] + " " + self.theDate.getFullYear() );
            self.cpweekDayGrid.html('');
            
            calmode = {'today': -1, 'highlightDay': -1, 'presetDay': -1, 'nexttoday': 1,
                'thisDate': new Date(), 'maxDate': new Date(), 'minDate': new Date(),
                'currentMonth': false, 'weekMode': 0, 'weekDays': null, 'thisTheme': o.pickPageButtoTheme };
            calmode.start = self._getFirstDay(self.theDate);
            calmode.end = self._getLastDate(self.theDate);
            calmode.lastend = self._getLastDateBefore(self.theDate);
            
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
                calmode.weekDays = $("<div>", {'class':'ui-cp-row'}).appendTo(self.cpweekDayGrid);
                for ( i=0; i<=6;i++ ) {
                    $("<div>"+o.daysOfWeekShort[i]+"</div>").addClass('ui-cp-date ui-cp-date-disabled ui-cp-month').appendTo(calmode.weekDays);
                }
            }
            
            for ( gridWeek=0; gridWeek<=5; gridWeek++ ) {
                if ( gridWeek === 0 || ( gridWeek > 0 && (calmode.today > 0 && calmode.today <= calmode.end) ) ) {
                    thisRow = $("<div>", {'class': 'ui-cp-row'}).appendTo(self.cpweekDayGrid);
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
                                calmode.thisTheme = highDatesTheme;
                            } else if ( $.isArray(o.highDays) && $.inArray(gridDay, o.highDays) > -1 ) {
                                  var index = $.inArray(gridDay, o.highDays);
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
                                        e.preventDefault();
                                        self.theDate.setDate($(this).attr('data-date'));
                                        self.element.trigger('selectedDate',[self._formatDate(self.theDate)]);
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
                theDate = new Date(), // Internal date object, used for all operations
                thisPage = input.closest('.ui-page');       
            $.extend(self, {
                     input:input,
                     thisPage: thisPage,
                     theDate: theDate
            }); 
            self._buildPage();
        },

        _buildPage: function () {
            // Build the controls
            var self = this,
                o = self.options,
                container = $.mobile.loadPrototype("calendarpicker"),
                cpContainer = container.find('.ui-cp-container'),
                cpHeader = container.find('.ui-cp-headercontainer'),
                cpweekDayGrid = container.find('.ui-cp-weekday'),
                cpMonthGrid = container.find('.ui-cp-month'),
                previousButton = container.find('.ui-cp-previous').buttonMarkup({inline: true, corners:true}),
                nextButton = container.find('.ui-cp-next').buttonMarkup({inline: true, corners:true}),
                isopen = false;    
            nextButton.bind('vclick',function(e) {
                e.preventDefault();
                if (!self.calNoNext) {
                    if ( self.theDate.getDate() > 28 ) { self.theDate.setDate(1); }
                    self._offset('m',1);
                }
            });
            previousButton.bind('vclick', function(e) {
                e.preventDefault();
                if (!self.calNoPrev) {
                    if ( self.theDate.getDate() > 28 ) { self.theDate.setDate(1); }
                    self._offset('m',-1);
                }
            });
                    
            $.extend(self, {
                cpMonthGrid: cpMonthGrid,
                cpweekDayGrid: cpweekDayGrid,
                cpContainer: cpContainer,
                isopen:isopen
            });     
            cpContainer.appendTo(self.thisPage);     
        },

        refresh: function() {
            this._update();
        },

        visible: function() {
            return this.isopen;
        },

        open: function() {
            // Open the picker
            var self = this;
            if (self.isopen === true ) { return false; } else { self.isopen = true; } // Ignore if already open
            self._update();
            var windowHeight = $(window).height(),
                contentHeight = self.cpContainer.outerHeight();
            self.cpContainer.css({'position': 'absolute','top':windowHeight+contentHeight}).removeClass('ui-cpcontainer-hidden')
                .stop().animate({"left" :0, "top":windowHeight-contentHeight}, self.options.slideupanimation,self.options.slideupanimation,function() {
                self.element.trigger('appear');
            });
        },

        close: function() {
            // Close the picker
            var self = this,
            callback;
            self.isopen = false;
            self.cpContainer.stop().animate({"top":$(window).height()+self.cpContainer.outerHeight()},
                                             self.options.slidedownanimationtime,self.options.slidedownanimation,function() {
                self.cpContainer.addClass('ui-cpcontainer-hidden').removeAttr('style').removeClass('in');
                self.element.trigger('dissapear');
            });
        },
    });  
    // Autoinit widget.
    $( document ).bind( "pagecreate", function( e ){
        $( ":jqmData(role='calendarpicker')", e.target ).calendarpicker();
    });
	
})( jQuery );
