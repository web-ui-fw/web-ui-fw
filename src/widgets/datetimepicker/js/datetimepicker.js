/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Salvatore Iovene <salvatore.iovene@intel.com>
 */

(function($, window, undefined) {
    $.widget("mobile.datetimepicker", $.mobile.widget, {
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

        data: {
            now: 0,
            uuid: 0,
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

        _initDateTime: function() {
            this.data.initial.year = this.data.now.getFullYear();
            this.data.initial.month = this.data.now.getMonth();
            this.data.initial.day = this.data.now.getDate();
            this.data.initial.hours = this.data.now.getHours();
            this.data.initial.minutes = this.data.now.getMinutes();
            this.data.initial.pm = this.data.initial.hours > 11;

            this.data.year = this.data.now.getFullYear();
            this.data.month = this.data.now.getMonth();
            this.data.day = this.data.now.getDate();
            this.data.hours = this.data.now.getHours();
            this.data.minutes = this.data.now.getMinutes();
            this.data.pm = this.data.hours > 11;
        },

        _createHeader: function() {
            var div = $.createDateTimePickerHeader();
            div.attr("id", "header");
            div.text(this.options.header);
            return div;
        },

        _createDate: function() {
            var div = $("<div/>", {
                class: "date ui-grid-b"
            });

            var w = this;

            /* TODO: the order should depend on locale and
             * configurable in the options. */
            var dataItems = {
                0: ["year", this.data.initial.year],
                1: ["month", this.options.months[this.data.initial.month]],
                2: ["day", this.data.initial.day],
            };

            for (var data in dataItems) {
                var props = dataItems[data];
                var item = $("<span/>", {
                    class: "data " + props[0]
                }).text(props[1]);
                div.append(item);
            }

            return div;
        },

        _createTime: function() {
            var div = $("<div/>", {
                class: "time ui-grid-b"
            });

            var w = this;

            /* TODO: the order should depend on locale and
             * configurable in the options. */
            var dataItems = {
                0: ["hours", this._normalizeHour(this._makeTwoDigitValue(this.data.initial.hours))],
                1: ["separator", this.options.timeSeparator],
                2: ["minutes", this._makeTwoDigitValue(this.data.initial.minutes)],
            };

            for (var data in dataItems) {
                var props = dataItems[data];
                var item = $("<span/>", {
                    class: "data " + props[0]
                }).text(props[1]);
                div.append(item);
            }

            return div;
        },

        _createAmPm: function() {
            var div = $("<div/>", {
                class: "ampm"
            });
            item = $("<span/>", {
                class: "data ampm"
            }).text(this._parseAmPmValue(this.data.initial.pm));
            div.append(item);

            return div;
        },

        _createDateTime: function() {
            var div = $("<div/>", {
                id: "main"
            });

            if (this.options.showDate && this.options.showTime) {
                div.attr("class", "ui-grid-a");
                if (!this.options.twentyfourHours) {
                    div.attr("class", "ui-grid-b");
                }
            }

            if (this.options.showDate) {
                div.append(this._createDate());
            }
            if (this.options.showTime) {
                div.append(this._createTime());
            }
            if (!this.options.twentyfourHours) {
                div.append(this._createAmPm());
            }

            return div;
        },

        _createDataSelector: function() {
            var div = $("<div/>", {
                class: "selector"
            });

            return div;
        },

        _makeTwoDigitValue: function(val) {
          var ret = val.toString(10);

          if (val < 10)
            ret = "0" + ret;
          return ret;
        },

        _normalizeHour: function(val) {
            val = parseInt(val);
            val = (!this.options.twentyfourHours && val >= 12) ? (val - 12) : val;
            return this._makeTwoDigitValue(val);
        },

        _parseAmPmValue: function(pm) {
            return pm ? this.options.pm : this.options.am;
        },

        _showDataSelector: function(selector, owner) {
            /* TODO: find out if it'd be better to prepopulate this, or
             * do some caching at least. */
            var obj = this;
            var klass = owner.attr("class");
            var numItems = 0;
            var selectorResult = {};

            if (klass.search("year") > 0) {
                var values = range(1900, 2100);
                numItems = values.length;
                selectorResult = obj._populateSelector(selector, owner,
                    "year", values, parseInt, null, obj.data, "year");
            } else if (klass.search("month") > 0) {
                numItems = obj.options.months.length;
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
                    obj.data, "month");
            } else if (klass.search("day") > 0) {
                var day = new Date(
                    obj.data.year, obj.data.month, 0).getDate();
                numItems = day;
                selectorResult = obj._populateSelector(selector, owner,
                    "day", range(1, day), parseInt, null, obj.data,
                    "day");
            } else if (klass.search("hours") > 0) {
                var values =
                    range(0, this.options.twentyfourHours ? 23 : 11)
                        .map(this._makeTwoDigitValue);
                numItems = values.length;
                /* TODO: 12/24 settings should come from the locale */
                selectorResult = obj._populateSelector(selector, owner,
                    "hours", values, parseInt, null, obj.data,
                    "hours");
            } else if (klass.search("minutes") > 0) {
                var values = range(0, 59).map(this._makeTwoDigitValue);
                numItems = values.length;
                selectorResult = obj._populateSelector(selector, owner,
                    "minutes", values, parseInt, null, obj.data,
                    "minutes");
            } else if (klass.search("ampm") > 0) {
                var values = [this.options.am, this.options.pm];
                numItems = values.length;
                selectorResult = obj._populateSelector(selector, owner,
                    "ampm", values,
                    function (val) {
                        if (val == obj.options.am) {
                            return 0;
                        } else {
                            return 1;
                        }
                    },
                    function (index) {
                        if (index == 0) {
                            return obj.options.am;
                        } else {
                            return obj.options.pm;
                        }
                    },
                    obj.data, "pm");
            }

            selector.slideDown(obj.options.animationDuration);

            /* Now that all the items have been added to the DOM, let's compute
             * the size of the selector.
             */
            itemWidth = selector.find(".item").outerWidth();
            selectorWidth = selector.find(".container").outerWidth();
            var totalWidth = itemWidth * numItems;
            var widthAtItem = itemWidth * selectorResult.currentIndex;
            var halfWidth = selectorWidth / 2.0;
            var x = 0;
            /* The following code deals with the case of the item
             * selected being one of the first ones in the list
             */
            if (widthAtItem > selectorWidth / 2.0) {
                x = -((widthAtItem) - (halfWidth - itemWidth / 2.0));
            }
            /* And here we're dealing with the case of the item
             * selected being one of the last ones in the list.
             */
            if (totalWidth - widthAtItem < halfWidth) {
                x = -totalWidth + selectorWidth;
            }
            /* There's also a third option: the values are so few
             * that we should always center them.
             */
            if (totalWidth < halfWidth) {
                x = totalWidth / 2.0 + itemWidth * numItems / 2.0;
            }

            selector.find(".view").width(itemWidth * numItems);
            selectorResult.scrollable.container.scrollview(
                'scrollTo', x, 0);
        },

        _createScrollableView: function() {
            var container = $("<div/>", {
                class: "container container-years"
            });
            container.attr("data-scroll", "x");

            view = $("<div/>", {class: "view"});

            container.html(view);
            container.scrollview({direction: "x"});

            return {container: container, view: view};
        },

        _populateSelector: function(selector, owner, klass, values,
                                    parseFromFunc, parseToFunc,
                                    dest, prop) {
            var obj = this;
            var jqObj = $(this);
            var scrollable = obj._createScrollableView();
            var currentIndex = 0;
            var destValue = (parseToFunc !== null ?
                                parseToFunc(dest[prop]) :
                                dest[prop]);

            var i = 0;
            for (; i < values.length; i++) {
                var item = $.createSelectorItem(klass);
                item.link.click(function() {
                    var newValue = parseFromFunc(this.text);
                    dest[prop] = newValue;
                    owner.text(this.text);
                    scrollable.view.find(item.selector).each(function() {
                        $(this).removeClass("current");
                    });
                    $(this).toggleClass("current");
                    selector.slideUp(obj.options.animationDuration);
                    $(obj.data.parentInput).trigger("date-changed", obj.getValue());
                }).text(values[i]);
                if (values[i] == destValue) {
                    item.link.addClass("current");
                    currentIndex = i;
                }
                scrollable.view.append(item.container);
            }
            selector.html(scrollable.container);

            return {scrollable: scrollable, currentIndex: currentIndex};
        },

        _create: function() {
            var obj = this;
            var input = this.element;
            var container = $("<div/>", {class: "ui-datetimepicker"});

            $(input).css("display", "none");
            $(input).after(container);
            this.data.parentInput = input;

            /* We must display either time or date: if the user set both to
             * false, we override that.
             */
            if (!this.options.showDate && !this.options.showTime) {
                this.options.showDate = true;
            }

            this._initDateTime();

            /* Give unique id to allow more instances in one page. */
            this.data.uuid += 1;
            container.attr("id", "ui-datetimepicker-" + this.data.uuid);

            var header = this._createHeader();
            var dateTime = this._createDateTime();
            var selector = this._createDataSelector();

            var innerContainer = $("<div/>", {
                id: "inner-container",
            });
            innerContainer.append(header, dateTime);

            container.append(innerContainer, selector);

            dateTime.find(".data").each(function() {
                $(this).click(function() {
                    obj._showDataSelector(selector, $(this));
                });
            });
        },

        getValue: function() {
            var actualHours = this.data.hours;
            if (!this.options.twentyfourHours && this.data.pm) {
                actualHours += 12;
            }
            return new Date(this.data.year,
                            this.data.month,
                            this.data.day,
                            actualHours,
                            this.data.minutes);
        }
    }); /* End of widget */

    var now = new Date();
    $($.mobile.datetimepicker.prototype.data.now = now);
    $($.mobile.datetimepicker.prototype.data.uuid = now.getTime());

    $(document).bind("pagecreate create", function(e) {
        $($.mobile.datetimepicker.prototype.options.initSelector, e.target)
            .not(":jqmData(role='none'), :jqmData(role='nojs')")
            .datetimepicker();
    });

})(jQuery, this);

