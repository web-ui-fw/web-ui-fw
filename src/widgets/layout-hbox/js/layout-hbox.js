/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

/**
 * Horizontal box layout extension.
 */

(function ($, undefined) {

$.widget("todons.layouthbox", $.mobile.widget, {
    options: {
        initSelector: ':jqmData(layout="hbox")',
        hgap: 0,
        type: 'flexGrid',
        rows: 1,
        scrollable: true
    },

    _create: function () {
        var self = this,
            options = this.element.data('layout-options'),
            page = $(this.element).closest(':jqmData(role="page")');

        $.extend(this.options, options);

        if (page && !page.is(':visible')) {
            this.element.hide();

            page.bind('pageshow', function () {
                self.refresh();
            });
        }
        else {
            this.refresh();
        }
    },

    refresh: function () {
        $(this.element).layout(this.options);

        this.element.show();

        if (this.options.scrollable) {
            // get the width of the element after layout
            var originalWidth = this.element.width();

            // create the scrollview
            this.element.scrollview({direction: 'x'});

            // manually reset the width of the div so it horizontally
            // fills its parent
            this.element.width('100%');

            // set the scrollview's view width to the original width,
            // and height to the height of the scrollview
            this.element.find('.ui-scrollview-view')
                        .width(originalWidth)
                        .height('100%');
        }
    }
});

$(document).bind("pagecreate", function (e) {
    $($.todons.layouthbox.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .layouthbox();
});

})(jQuery);
