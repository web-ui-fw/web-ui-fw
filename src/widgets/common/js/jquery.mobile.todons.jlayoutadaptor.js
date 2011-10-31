/**
 * Wrapper round the jLayout functions to enable it to be used
 * for creating jQuery Mobile layout extensions.
 *
 * See the layouthbox and layoutvbox widgets for usage examples.
 */
(function ($, undefined) {

$.widget("todons.jlayoutadaptor", $.mobile.widget, {
    options: {
        hgap: null,
        vgap: null,
        scrollable: true,
        showScrollBars: true,
        direction: null
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
        var container;
        var config = $.extend(this.options, this.fixed);

        if (config.scrollable) {
            if (!(this.element.children().is('.ui-scrollview-view'))) {
                // create the scrollview
                this.element.scrollview({direction: config.direction,
                                         showScrollBars: config.showScrollBars});
            }
            else if (config.showScrollBars) {
                this.element.find('.ui-scrollbar').show();
            }
            else {
                this.element.find('.ui-scrollbar').hide();
            }

            container = this.element.find('.ui-scrollview-view');
        }
        else {
            container = this.element;
        }

        container.layout(config);

        this.element.show();

        if (config.scrollable) {
            // get the right/bottom edge of the last child after layout
            var lastItem = container.children().last();

            var edge;

            var scrollview = this.element.find('.ui-scrollview-view');

            if (config.direction === 'x') {
                edge = lastItem.position().left +
                       lastItem.outerWidth(true);

                // set the scrollview's view width to the original width
                scrollview.width(edge);

                // set the parent container's height to the height of
                // the scrollview
                this.element.height(scrollview.height());
            }
            else if (config.direction === 'y') {
                edge = lastItem.position().top +
                       lastItem.outerHeight(true);

                // set the scrollview's view height to the original height
                scrollview.height(edge);

                // set the parent container's width to the width of the
                // scrollview
                this.element.width(scrollview.width());
            }
        }
    }
});

})(jQuery);
