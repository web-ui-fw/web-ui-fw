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
        header: ""
    },

    _createHeader: function() {
        var $div = $("<div/>", {
            class: "ui-datetimepicker-header"
        });
        $div.text(this.options.header);
        return $div;
    },

    _createDateTime: function() {
        var $div = $("<div/>", {
            class: "ui-datetimepicker-main"
        });
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

        var $headerDiv = this._createHeader();
        var $mainDiv = this._createDateTime();

        $container.append($headerDiv, $mainDiv);
    }
}); /* End of widget */

})(jQuery, this);

