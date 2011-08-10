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
                     "November", "December"]
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

        _createDateTime: function() {
            var $div = $("<div/>", {
                class: "ui-datetimepicker-main ui-grid-e"
            });
            var $year = $("<span/>", {
                class: "ui-datetimepicker-data ui-block-a ui-datetimepicker-year"});
            var $month = $("<span/>", {
                class: "ui-datetimepicker-data ui-block-b ui-datetimepicker-month"});
            var $day = $("<span/>", {
                class: "ui-datetimepicker-data ui-block-c ui-datetimepicker-day"});
            var $hours = $("<span/>", {
                class: "ui-datetimepicker-data ui-block-d ui-datetimepicker-hours"});
            var $separator = $("<span/>", {
                class: "ui-datetimepicker-data ui-block-e ui-datetimepicker-separator"});
            var $minutes = $("<span/>", {
                class: "ui-datetimepicker-data ui-block-f ui-datetimepicker-minutes"});

            $year.text(this.data.year);
            $month.text(this.data.month);
            $day.text(this.data.day);

            $hours.text(this.data.hours);
            $separator.text(this.options.timeSeparator);
            $minutes.text(this.data.minutes);

            /* TODO: the order should depend on locale and
             * configurable in the options. */
            $div.append($day)
                .append($month)
                .append($year)
                .append($hours)
                .append($separator)
                .append($minutes);

            return $div;
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

            var $headerDiv = this._createHeader();
            var $mainDiv = this._createDateTime();

            /* Give unique id to allow more instances in one page. */
            this.data.uuid += 1;
            $container.attr("id", "ui-datetimepicker-" + this.data.uuid);
            $container.append($headerDiv, $mainDiv);
        }
    }); /* End of widget */

    var now = new Date();
    $($.mobile.datetimepicker.prototype.data.now = now);
    $($.mobile.datetimepicker.prototype.data.uuid = now.getTime());
})(jQuery, this);

