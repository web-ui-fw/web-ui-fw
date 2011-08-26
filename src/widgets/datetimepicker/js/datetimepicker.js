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
            header: "",
            timeSeparator: ":",
            months: ["Jan", "Feb", "Mar", "Apr", "May",
                     "Jun", "Jul", "Aug", "Sep", "Oct",
                     "Nov", "Dec"],
            animationDuration: 500,
        },

        data: {
            now: 0,
            uuid: 0,

            initial: {
                year: 0,
                month: 0,
                day: 0,

                hours: 0,
                minutes: 0
            },

            year: 0,
            month: 0,
            day: 0,

            hours: 0,
            minutes: 0
        },

        _initDateTime: function() {
            this.data.initial.year = this.data.now.getFullYear();
            this.data.initial.month = this.data.now.getMonth();
            this.data.initial.day = this.data.now.getDate();
            this.data.initial.hour = this.data.now.getHours();
            this.data.initial.minutes = this.data.now.getMinutes();

            this.data.year = this.data.now.getFullYear();
            this.data.month = this.data.now.getMonth();
            this.data.day = this.data.now.getDate();
            this.data.hour = this.data.now.getHours();
            this.data.minutes = this.data.now.getMinutes();
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
                0: ["hours", this._makeTwoDigitValue(this.data.initial.hours)],
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

        _createDateTime: function() {
            var div = $("<div/>", {
                id: "main"
            });

            if (this.options.showDate && this.options.showTime) {
                div.addClass("ui-grid-a");
            }

            if (this.options.showDate) {
                div.append(this._createDate());
            }
            if (this.options.showTime) {
                div.append(this._createTime());
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
                var values = range(0, 23).map(this._makeTwoDigitValue);
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
            }

            selector.slideDown(obj.options.animationDuration);

            /* Now that all the items have been added to the DOM, let's compute
             * the size of the selector.
             */
            itemWidth = selector.find(".item").outerWidth();
            selectorWidth = selector.find(".container").outerWidth();
            var x = 0;
            if (itemWidth * selectorResult.currentIndex > selectorWidth / 2.0) {
                x = -((itemWidth * selectorResult.currentIndex) -
                        (selectorWidth / 2.0 - itemWidth / 2.0));
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
            var container = this.element;
            var obj = this;

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
        }
    }); /* End of widget */

    var now = new Date();
    $($.mobile.datetimepicker.prototype.data.now = now);
    $($.mobile.datetimepicker.prototype.data.uuid = now.getTime());
})(jQuery, this);

