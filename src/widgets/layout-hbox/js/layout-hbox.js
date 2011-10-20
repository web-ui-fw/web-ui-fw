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
    fixed: {
        type: 'flexGrid',
        rows: 1
    },

    options: {
        initSelector: ':jqmData(layout="hbox")',
        hgap: 0,
        scrollable: true,
        showScrollBars: true
    },

    _create: function () {
        var self = this,
            options = this.element.data('layout-options'),
            page = $(this.element).closest(':jqmData(role="page")');

        $.extend(this.options, options);

        this.config = {};
        $.extend(this.config, this.options, this.fixed);

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
        var container;
        var hasScrollview = this.element.children().is('.ui-scrollview-view');

        if (!hasScrollview && this.config.scrollable) {
            // create the scrollview
            this.element.scrollview({direction: 'x',
                                     showScrollBars: this.config.showScrollBars});
        }

        if (this.config.scrollable) {
            container = this.element.find('.ui-scrollview-view');
        }
        else {
            container = this.element;
        }

        var layout = container.layout(this.config);

        this.element.show();

        if (this.config.scrollable) {
            // get the right-most edge of the last child after layout
            var lastItem = container.children().last();

            var rightEdge = lastItem.position().left +
                            lastItem.outerWidth(true);

            // manually reset the width of the div so it horizontally
            // fills its parent
            this.element.width('100%');

            // set the scrollview's view width to the original width,
            // and height to the height of the scrollview
            this.element.find('.ui-scrollview-view')
                        .width(rightEdge);
        }
    }
});

$(document).bind("pagecreate", function (e) {
    $($.todons.layouthbox.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .layouthbox();
});

})(jQuery);
