/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

/**
 * Horizontal box layout extension.
 *
 * This will arrange the child elements of a container in a horizontal
 * row. This only makes sense if your container is a div
 * and contains children which are also divs; the children should
 * also have a height and width set in CSS, otherwise the layout
 * manager won't know what to do with them.
 *
 * Apply it by setting data-layout="hbox" on a container element
 * or calling $(element).layouthbox().
 *
 * Usually, you would use a div as the container to get the right effect
 * (an element with display:block).
 *
 * Options can be set programmatically:
 *
 *   $(element).layouthbox('option', 'scrollable', false)
 *
 * or via a data-layout-options attribute on the container:
 *
 *   <div data-layout="hbox" data-layout-options='{"hgap":5}'>
 *       <div>child 1</div>
 *       <div>child 2</div>
 *   </div>
 *
 * If you change any options after creating the widget, call
 * $(element).layouthbox('refresh') to have them picked up.
 * However, note that it's currently not feasible to turn off scrolling
 * once it's on (as calling scrollview('destroy') doesn't remove the
 * scrollview custom mouse handlers).
 *
 * Options:
 *
 *   {Integer} hgap (default=0)
 *   Horizontal gap (in pixels) between the child elements.
 *
 *   {Boolean} scrollable (default=true; can only be set at create time)
 *   Set to true to enable a scrollview on the
 *   container. If false, children will be clipped if
 *   they fall outside the edges of the container after
 *   layouting.
 *
 *   {Boolean} showScrollBars (default=true)
 *   Set to false to hide scrollbars on the container's scrollview.
 *   Has no effect is scrollable=false
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
                this.element.scrollview({direction: 'x',
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

        var layout = container.layout(config);

        this.element.show();

        if (config.scrollable) {
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
