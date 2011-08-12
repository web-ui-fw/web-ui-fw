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
            months: ["January", "February", "March", "April", "May",
                     "June", "July", "August", "September", "October",
                     "November", "December"],
            animationDuration: 500
        },

        data: {
            now: 0,
            uuid: 0,

            year: 0,
            month: 0,
            day: 0,

            hours: 0,
            minutes: 0
        },

        _initDateTime: function() {
            this.data.year = this.data.now.getFullYear();
            this.data.month = this.data.now.getMonth();
            this.data.day = this.data.now.getDate();

            this.data.hour = this.data.now.getHours();
            this.data.minutes = this.data.now.getMinutes();
        },

        _createHeader: function() {
            var $div = $("<div/>", {
                class: "ui-datetimepicker-header"
            }).text(this.options.header);
            return $div;
        },

        _createDate: function() {
            var $div = $("<div/>", {
                class: "ui-datetimepicker-date ui-grid-b"
            });

            var $w = this;
            var $year = $("<span/>", {
                class: "ui-datetimepicker-data ui-datetimepicker-year"
            }).click(function() {
                /* TODO: fix ugliness. */
                $w._showDataSelector($($year.parent().parent().parent().find(".ui-datetimepicker-selector")))
            });
            var $month = $("<span/>", {
                class: "ui-datetimepicker-data ui-datetimepicker-month"});
            var $day = $("<span/>", {
                class: "ui-datetimepicker-data ui-datetimepicker-day"});

            $year.text(this.data.year);
            $month.text(this.options.months[this.data.month]);
            $day.text(this.data.day);

            /* TODO: the order should depend on locale and
             * configurable in the options. */
            $div.append($day)
                .append($month)
                .append($year);

            return $div;
        },

        _createTime: function() {
            var $div = $("<div/>", {
                class: "ui-datetimepicker-time ui-grid-b"
            });

            var $hours = $("<span/>", {
                class: "ui-datetimepicker-data ui-datetimepicker-hours"});
            var $separator = $("<span/>", {
                class: "ui-datetimepicker-data ui-datetimepicker-separator"});
            var $minutes = $("<span/>", {
                class: "ui-datetimepicker-data ui-datetimepicker-last ui-datetimepicker-minutes"});

            $hours.text(this.data.hours);
            $separator.text(this.options.timeSeparator);
            $minutes.text(this.data.minutes);

            /* TODO: missing the AM/PM bit. */
            $div.append($hours)
                .append($separator)
                .append($minutes);

            return $div;
        },

        _createDateTime: function() {
            var $div = $("<div/>", {
                class: "ui-datetimepicker-main"
            });

            if (this.options.showDate && this.options.showTime) {
                $div.addClass("ui-grid-a");
            }

            if (this.options.showDate) {
                $div.append(this._createDate());
            }
            if (this.options.showTime) {
                $div.append(this._createTime());
            }

            return $div;
        },

        _createDataSelector: function() {
            var $div = $("<div/>", {
                class: "ui-datetimepicker-selector"
            });

            return $div;
        },

        _showDataSelector: function($w) {
            $w.slideDown(this.options.animationDuration);
        },

        _create: function() {
            var $container = this.element;

            /* We must display either time or date: if the user set both to
             * false, we override that.
             */
            if (!this.options.showDate && !this.options.showTime) {
                this.options.showDate = true;
            }

            this._initDateTime();

            /* Give unique id to allow more instances in one page. */
            this.data.uuid += 1;
            $container.attr("id", "ui-datetimepicker-" + this.data.uuid);

            $container.append(this._createHeader(),
                              this._createDateTime(),
                              this._createDataSelector());
        }
    }); /* End of widget */

    var now = new Date();
    $($.mobile.datetimepicker.prototype.data.now = now);
    $($.mobile.datetimepicker.prototype.data.uuid = now.getTime());
})(jQuery, this);

