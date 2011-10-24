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

            if (config.direction === 'x') {
                edge = lastItem.position().left +
                       lastItem.outerWidth(true);

                // manually reset the width of the div so it horizontally
                // fills its parent; NB we can do this for horizontal
                // scroll but not vertical, as the horizontal width
                // for a jqm page is set to the window width; but the
                // same isn't necessarily so for jqm page height
                this.element.width('100%');

                // set the scrollview's view width to the original width
                this.element.find('.ui-scrollview-view')
                            .width(edge);
            }
            else if (config.direction === 'y') {
                edge = lastItem.position().top +
                       lastItem.outerHeight(true);

                // set the scrollview's view height to the original height
                this.element.find('.ui-scrollview-view')
                            .height(edge);
            }
        }
    }
});

})(jQuery);
