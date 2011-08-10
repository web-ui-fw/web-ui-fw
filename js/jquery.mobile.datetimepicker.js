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
    _create: function() {
        var $container = this.element;

        /* We must display either time or date: if the user set both to
         * false, we override that.
         */
        if (!this.options.showDate && !this.options.showTime) {
            this.options.showDate = true;
        }

        $container.addClass("ui-grid-a");

        var $headerDiv = $("<div></div>",
            {class: "ui-datetimepicker-header ui-block-a"});
        $headerDiv.text(this.options.header);

        var $mainDiv = $("<div></div>",
            {class: "ui-datetimepicker-main ui-block-b"});

        $container.append($headerDiv, $mainDiv);
    }
}); /* End of widget */

})(jQuery, this);

