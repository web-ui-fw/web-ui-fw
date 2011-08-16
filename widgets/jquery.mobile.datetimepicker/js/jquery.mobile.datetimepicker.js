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
                0: ["ui-datetimepicker-hours", this.data.initial.hours],
                1: ["ui-datetimepicker-separator", this.options.timeSeparator],
                2: ["ui-datetimepicker-minutes", this.data.initial.minutes],
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

        _showDataSelector: function(selector, owner) {
            /* TODO: find out if it'd be better to prepopulate this, or
             * do some caching at least. */
            var obj = this;
            var klass = owner.attr("class");
            if (klass.search("year") > 0) {
                obj._populateSelector(selector, owner, range(1900, 2100),
                                      parseInt, null, obj.data, "year");
            } else if (klass.search("month") > 0) {
                obj._populateSelector(selector, owner, obj.options.months,
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
                var day = new Date(obj.data.year, obj.data.month + 1, 0).getDate();
                obj._populateSelector(selector, owner,
                                      range(1, day),
                                      parseInt, null, obj.data, "day");
            }
            selector.slideDown(obj.options.animationDuration);
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

        _populateSelector: function(selector, owner, values,
                                    parseFromFunc, parseToFunc,
                                    dest, prop) {
            var obj = this;
            var scrollable = obj._createScrollableView();

            var i = 0;
            for (; i < values.length; i++) {
                item = $.createSelectorItem();
                item.link.click(function() {
                    dest[prop] = parseFromFunc(this.text);
                    if (parseToFunc !== null) {
                        owner.text(parseToFunc(dest[prop]));
                    } else {
                        owner.text(dest[prop]);
                    }
                    scrollable.view.find(item.selector).each(function() {
                        $(this).removeClass("current");
                    });
                    $(this).toggleClass("current");
                    selector.slideUp(obj.options.animationDuration);
                }).text(values[i]);
                if (values[i] == dest[prop]) {
                    item.link.addClass("current");
                }
                scrollable.view.append(item.container);
            }
            selector.html(scrollable.container);
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

