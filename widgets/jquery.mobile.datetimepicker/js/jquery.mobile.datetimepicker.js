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
            yearsRange: 30 
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
            var div = $("<div/>", {
                id: "header"
            }).text(this.options.header);
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
            var klass = owner.attr("class");
            if (klass.search("year") > 0) {
                this._populateYears(selector, owner);
            } else if (klass.search("month") > 0) {
                this._populateMonths(selector, owner);
            }
            selector.slideDown(this.options.animationDuration);
        },

        _createScrollabeView: function() {
            var container = $("<div/>", {
                class: "container container-years"
            });
            container.attr("data-scroll", "x");

            view = $("<div/>", {class: "view"});

            container.html(view);
            container.scrollview({direction: "x"});

            return {container: container, view: view};
        },

        _populateYears: function(selector, owner) {
            var obj = this;
            var currentYear = this.data.initial.year;
            var startYear = currentYear - Math.floor(this.options.yearsRange / 2);
            var endYear = currentYear + Math.round(this.options.yearsRange / 2);

            var scrollable = obj._createScrollabeView();

            var i = 0;
            for (i = startYear; i <= endYear; i++) {
                w = $("<div />", {
                    class: "item"
                });
                link = $("<a />", {
                    href: "#"
                }).click(function() {
                    /* Get value */
                    obj.data.year = parseInt($(this).text());
                    owner.text(obj.data.year);

                    /* Give feedback */
                    scrollable.view.find('.item a').each(function() {
                        $(this).removeClass("current");
                    });
                    $(this).toggleClass("current");

                    /* Close shop */
                    selector.slideUp(obj.options.animationDuration);
                }).text(i);
                if (i == obj.data.year) {
                    link.addClass("current");
                }
                w.append(link);
                scrollable.view.append(w);
            }

            selector.html(scrollable.container);
        },

        _parseMonth: function(month) {
            var i = 0;
            for(; this.options.months[i] != month; i++);
            return i;
        },

        _populateMonths: function(selector, owner) {
            var obj = this;
            var scrollable = this._createScrollabeView();

            var i = 0;
            for (; i <= 12; i++) {
                w = $("<div />", {
                    class: "item"
                });
                link = $("<a />", {
                    href: "#"
                }).click(function() {
                    /* Get value */
                    obj.data.month = obj._parseMonth($(this).text());
                    owner.text(obj.options.months[obj.data.month]);

                    /* Give feedback */
                    scrollable.view.find('.item a').each(function() {
                        $(this).removeClass("current");
                    });
                    $(this).toggleClass("current");

                    /* Close shop */
                    selector.slideUp(obj.options.animationDuration);
                }).text(obj.options.months[i]);
                if (i == obj.data.month) {
                    link.addClass("current");
                }
                w.append(link);
                scrollable.view.append(w);
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

