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
 * Authors: Salvatore Iovene <salvatore.iovene@intel.com>
 */

// datetimepicker is a widget that lets the user select a date and/or a
// time.
//
// To apply, add the attribute data-datetimepicker="true", or set the
// type="date" to an <input> field in a <form>.
//
// Options (default in parentheses):
// =================================
//  - showDate (true): shows (and allows modification of) the date.
//  - showTime (true): shows (and allows modification of) the time.
//  - header ("Set time"): the header text of the widget.
//  - timeSeparator (":"): the symbol that separates hours and minutes.
//  - months (["Jan".."Dec"]): an array of month names (provide your
//    own if your interface's language is not English.
//  - am ("AM"): the label for the AM text.
//  - pm ("PM"): the lael for the PM text.
//  - twentyfourHours (false): if true, uses the 24h system; if false
//    uses the 12h system.
//  - anumationDuration (500): the time the item selector takes to
//    be animated, in milliseconds.
//  - initSelector (see code): the jQuery selector for the widget.
//
// How to get a return value:
// ==========================
// Bind to the 'date-changed' event, e.g.:
//    $("#myDatetimepicker").bind("date-changed", function(e, date) {
//        alert("New date: " + date.toString());
//    });

(function($, window, undefined) {
    $.widget("todons.datetimepicker", $.todons.widgetex, {
        options: {
            showDate: true,
            showTime: true,
            header: "Set time",
            timeSeparator: ":",
            months: ["Jan", "Feb", "Mar", "Apr", "May",
                     "Jun", "Jul", "Aug", "Sep", "Oct",
                     "Nov", "Dec"],
            am: "AM",
            pm: "PM",
            twentyfourHours: false,
            animationDuration: 500,
            initSelector: "input[type='date'], :jqmData(type='date'), :jqmData(role='datetimepicker')"
        },

        _initDateTime: function() {
            this.data.initial.year = this.data.now.getFullYear();
            this.data.initial.month = this.data.now.getMonth();
            this.data.initial.day = this.data.now.getDate();
            this.data.initial.hours = this.data.now.getHours();
            this.data.initial.minutes = this.data.now.getMinutes();
            this.data.initial.pm = this.data.initial.hours > 11;

            if (this.data.initial.hours == 0 && this.options.twentyfourHours == false) {
                this.data.initial.hours = 12;
            }

            this.data.year = this.data.initial.year;
            this.data.month = this.data.initial.month;
            this.data.day = this.data.initial.day;
            this.data.hours = this.data.initial.hours;
            this.data.minutes = this.data.initial.minutes;
            this.data.pm = this.data.initial.pm;
        },

        _initDate: function(ui) {
            if (!this.options.showDate)
                ui.date.main.remove();
            else {
                /* TODO: the order should depend on locale and
                 * configurable in the options. */
                var dataItems = {
                    0: ["year", this.data.initial.year],
                    1: ["month", this.options.months[this.data.initial.month]],
                    2: ["day", this.data.initial.day],
                };

                for (var data in dataItems)
                    ui.date[dataItems[data][0]].text(dataItems[data][1]);
            }
        },

        _initTime: function(ui) {
            /* TODO: the order should depend on locale and
             * configurable in the options. */
            var dataItems = {
                0: ["hours", this._makeTwoDigitValue(this._clampHours(this.data.initial.hours))],
                1: ["separator", this.options.timeSeparator],
                2: ["minutes", this._makeTwoDigitValue(this.data.initial.minutes)],
            };

            for (var data in dataItems)
                ui.time[dataItems[data][0]].text(dataItems[data][1]);
        },

        _initDateTimeDivs: function(ui) {
            if (this.options.showDate && this.options.showTime) {
                ui.main.attr("class", "ui-grid-a");
                if (!this.options.twentyfourHours) {
                    ui.main.attr("class", "ui-grid-b");
                }
            }

            this._initDate(ui);
            this._initTime(ui);
            ui.ampm.text(this._parseAmPmValue(this.data.initial.pm));
        },

        _makeTwoDigitValue: function(val) {
            return ((val < 10 ? "0" : "") + val.toString(10));
        },

        _parseDayHoursMinutes: function(val) {
            return parseInt((val.substring(0, 1) === "0") ? val.substring(1) : val);
        },

        _parseAmPmValue: function(pm) {
            return pm ? this.options.pm : this.options.am;
        },

        _clampHours: function(val) {
            return ((this.options.twentyfourHours) ? val : (((val + 11) % 12) + 1));
        },

        _showDataSelector: function(selector, owner, ui) {
            /* TODO: find out if it'd be better to prepopulate this, or
             * do some caching at least. */
            var obj = this;
            var klass = owner.attr("class");
            var selectorResult = undefined;

            if (klass.search("year") > 0) {
                var values = range(1900, 2100);
                selectorResult = obj._populateSelector(selector, owner,
                    "year", values, parseInt, null, obj.data, "year", ui);
            }
            else
            if (klass.search("month") > 0) {
                selectorResult = obj._populateSelector(selector, owner,
                    "month", obj.options.months,
                    function (month) {
                        var i = 0;
                        for (; obj.options.months[i] != month; i++);
                        return i;
                    },
                    function (index) {
                        return obj.options.months[index];
                    },
                    obj.data, "month", ui);
            }
            else
            if (klass.search("day") > 0) {
                var day = new Date(
                    obj.data.year, obj.data.month + 1, 0).getDate();
                selectorResult = obj._populateSelector(selector, owner,
                    "day", range(1, day), this._parseDayHoursMinutes, null, obj.data,
                    "day", ui);
            }
            else
            if (klass.search("hours") > 0) {
                var values =
                    range(this.options.twentyfourHours ? 0 : 1,
                          this.options.twentyfourHours ? 24 : 12)
                        .map(this._makeTwoDigitValue);
                /* TODO: 12/24 settings should come from the locale */
                selectorResult = obj._populateSelector(selector, owner,
                    "hours", values, this._parseDayHoursMinutes,
                      function(val) { return obj._makeTwoDigitValue(obj._clampHours(val)); },
                    obj.data, "hours", ui);
            }
            else
            if (klass.search("separator") > 0) {
                /* Do nothing. */
            }
            else
            if (klass.search("minutes") > 0) {
                var values = range(0, 59).map(this._makeTwoDigitValue);
                selectorResult = obj._populateSelector(selector, owner,
                    "minutes", values, this._parseDayHoursMinutes, this._makeTwoDigitValue, obj.data,
                    "minutes", ui);
            }
            else
            if (klass.search("ampm") > 0) {
                var values = [this.options.am, this.options.pm];
                selectorResult = obj._populateSelector(selector, owner,
                    "ampm", values,
                    function (val) { return (val !== obj.options.am); },
                    function (index) { return obj.options[index ? "pm" : "am"]; },
                    obj.data, "pm", ui);
            }

            if (selectorResult !== undefined) {
                var totalWidth = 0,
                    widthAtItem = 0,
                    x = 0;

                // slideDown() seems to synchronously make things visible (albeit at height = 0px), so we can actually
                // compute widths/heights below
                selector.slideDown(obj.options.animationDuration);
                obj.state.selectorOut = true;

                // If the @owner has any padding/border/margins, then they are not taken into account. Thus, if you want
                // to space/pad your @owner divs, you should wrap them in other divs which give them
                // padding/borders/margins rather than adding left padding/borders/margins directly. Currently, this
                // happens to work, because the @owner divs have no left border/margin/padding.

                ui.triangle.triangle("option", "offset", owner.offset().left + owner.width() / 2 - ui.triangle.offset().left);

                // Now that all the items have been added to the DOM, let's compute the size of the selector.
                selectorWidth = selector.find(".container").outerWidth();
                selector.find(".item").each(function(idx) {
                    var width = $(this).outerWidth(true);
                    totalWidth += width;
                    if (idx < selectorResult.currentIndex)
                        widthAtItem += width;
                });

                // If the contents doesn't fill the selector, pad it out width empty divs so it's centered
                if (totalWidth < selectorWidth) {
                    var half = (selectorWidth - totalWidth) / 2;

                    selector.find(".item:first").before($("<div/>").css("float", "left").width(half).height(1));
                    selector.find(".item:last" ).after( $("<div/>").css("float", "left").width(half).height(1));
                    totalWidth = selectorWidth;
                }
                // Otherwise, try to center the current item as much as possible
                else {
                    x = (selectorWidth - $(selector.find(".item")[selectorResult.currentIndex]).outerWidth(true)) / 2 - widthAtItem;
                    x = Math.min(0, Math.max(selectorWidth - totalWidth, x));
                }

                selector.find(".view").width(totalWidth);
                selectorResult.scrollable.container.scrollview('scrollTo', x, 0);
            }
        },

        _hideDataSelector: function(selector) {
            var self = this;
            if (this.state.selectorOut) {
                selector.slideUp(this.options.animationDuration,
                    function() {
                      if (self._ui.scrollview !== undefined) {
                          self._ui.scrollview.remove();
                          self._ui.scrollview = undefined;
                      }
                    });
                this.state.selectorOut = false;
            }
        },

        _createScrollableView: function(selectorProto) {
            var container = selectorProto.clone(),
                self = this,
                view = container.find("#datetimepicker-selector-view").removeAttr("id");

            container
                .scrollview({direction: "x"})
                .bind("vclick", function(event) {
                  if (self.panning) {
                      event.preventDefault();
                      event.stopPropagation();
                  }
                })
                .bind("scrollstart", function(event) {
                    self.panning = true;
                })
                .bind("scrollstop", function(event) {
                    self.panning = false;
                });

            return {container: container, view: view};
        },

        _createSelectorItem: function(itemProto, klass) {
            var selector = itemProto.attr("data-selector");

            itemProto
                .removeAttr("data-selector")
                .removeAttr("id")
                .addClass(klass);

            return {container: itemProto, link: itemProto.find("a"), selector: selector};
        },

        _updateDate: function(owner, field, value, text) {
            if (field === "month") {
                // From http://www.javascriptkata.com/2007/05/24/how-to-know-if-its-a-leap-year/
                var days = [31,(((new Date(this.data.year,1,29).getDate())===29) ? 29 : 28),31,30,31,30,31,31,30,31,30,31],
                    newDay = Math.min(this.data.day, days[value]);

                if (newDay != this.data.day) {
                    this.data.day = newDay;
                    this._ui.date.day.text(newDay);
                }
            }
            this.data[field] = value;
            owner.text(text);
        },

        _populateSelector: function(selector, owner, klass, values,
                                    parseFromFunc, parseToFunc,
                                    dest, prop, ui) {
            var self = this;
            var obj = this;
            var scrollable = obj._createScrollableView(ui.selectorProto);
            var currentIndex = 0;
            var destValue = ((parseToFunc !== null)
                ? parseToFunc(dest[prop])
                : dest[prop]);

            var i = 0;
            for (; i < values.length; i++) {
                var item = obj._createSelectorItem(ui.itemProto.clone(), klass);
                item.link.bind("vclick", function(e) {
                    if (!self.panning) {
                        self._updateDate(owner, prop, parseFromFunc(this.text), this.text);
                        scrollable.view.find(item.selector).removeClass("current");
                        $(this).toggleClass("current");
                        obj._hideDataSelector(selector);
                        $(obj.data.parentInput).trigger("date-changed", obj.getValue());
                    }
                }).text(values[i]);
                if (values[i] === destValue) {
                    item.link.addClass("current");
                    currentIndex = i;
                }
                scrollable.view.append(item.container);
            }

            if (this._ui.scrollview !== undefined)
                this._ui.scrollview.remove();

            selector.append(scrollable.container);

            this._ui.scrollview = scrollable.container;

            return {scrollable: scrollable, currentIndex: currentIndex};
        },

        _htmlProto: {
            ui: {
                container: "#datetimepicker",
                selector: "#datetimepicker-selector",
                triangle: "#datetimepicker-selector-triangle",
                selectorProto: "#datetimepicker-selector-container",
                itemProto: "#datetimepicker-item",
                header: "#datetimepicker-header",
                main: "#datetimepicker-main",
                date: {
                    main: "#datetimepicker-date",
                    year: "#datetimepicker-date-year",
                    month: "#datetimepicker-date-month",
                    day: "#datetimepicker-date-day"
                },
                time: {
                    main: "#datetimepicker-time",
                    hours: "#datetimepicker-time-hours",
                    separator: "#datetimepicker-time-separator",
                    minutes: "#datetimepicker-time-minutes"
                },
                ampm: "#datetimepicker-ampm-span"
            }
        },

        _create: function() {
            var self = this;
            this._ui.selectorProto.remove();
            this._ui.itemProto.remove();

            $.extend ( this, {
                panning: false,
                data : {
                    now: new Date(),
                    parentInput: 0,

                    initial: {
                        year: 0,
                        month: 0,
                        day: 0,

                        hours: 0,
                        minutes: 0,
                        pm: false
                    },

                    year: 0,
                    month: 0,
                    day: 0,

                    hours: 0,
                    minutes: 0,
                    pm: false
                },

                state : {
                    selectorOut: false
                }
            });

            var obj = this;
            var input = this.element;

            $.mobile.todons.parseOptions(this);

            $(input).css("display", "none");
            $(input).after(this._ui.container);
            this._ui.triangle.triangle({"class" : "selector-triangle-color"});
            this.data.parentInput = input;

            // We must display either time or date: if the user set both to
            // false, we override that.
            if (!this.options.showDate && !this.options.showTime) {
                this.options.showDate = true;
            }

            this._initDateTime();

            this._ui.header.text(this.options.header);

            this._initDateTimeDivs(this._ui);

            this._ui.container.bind("vclick", function () {
                obj._hideDataSelector(self._ui.selector);
            });

            this._ui.main.find(".data").each(function() {
                $(this).bind("vclick", function(e) {
                    obj._showDataSelector(self._ui.selector, $(this), self._ui);
                    e.stopPropagation();
                });
            });
        },

        getValue: function() {
            var actualHours = this._clampHours(this.data.hours);
            if (actualHours === 12 && !this.data.pm)
                actualHours = 0;
            else
            if (actualHours < 12 && this.data.pm)
                actualHours += 12;
            return new Date(this.data.year,
                            this.data.month,
                            this.data.day,
                            actualHours,
                            this.data.minutes);
        }
    }); /* End of widget */

    $(document).bind("pagecreate create", function(e) {
        $($.todons.datetimepicker.prototype.options.initSelector, e.target)
            .not(":jqmData(role='none'), :jqmData(role='nojs')")
            .datetimepicker();
    });

})(jQuery, this);
