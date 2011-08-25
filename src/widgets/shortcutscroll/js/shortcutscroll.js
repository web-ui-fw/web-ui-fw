/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

/**
 * shortcutscroll is a scrollview controller, which binds
 * a scrollview to a a list of short cuts; the shortcuts are built
 * from the text on dividers in the list. Clicking on a shortcut
 * instantaneously jumps the scrollview to the selected list divider;
 * mouse movements on the shortcut column move the scrollview to the
 * list divider matching the text currently under the touch; a popup
 * with the text currently under the touch is also displayed.
 *
 * To apply, add the attribute data-shortcutscroll="true" to a listview
 * (a <ul> or <ol> element inside a page). Alternatively, call
 * shortcutscroll() on an element (this allows configuration of
 * the scrollview to be controlled).
 *
 * If a scrollview is not passed as an option to the widget, the parent
 * of the listview is assumed to be the scrollview under control.
 *
 * If a listview has no dividers or a single divider, the widget won't
 * display.
 */
(function( $, undefined ) {

$.widget( "TODONS.shortcutscroll", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(shortcutscroll)",
        scrollview: null
    },

    _create: function () {
        var $el = this.element,
            o = this.options,
            shortcutsContainer = $('<div class="ui-shortcutscroll"/>'),
            shortcutsList = $('<ul></ul>'),
            dividers = $el.find(':jqmData(role="list-divider")'),
            lastListItem = null,
            jumpToDivider = null,
            shortcutscroll = this;

        if (dividers.length < 2) {
          return;
        }

        // popup for the hovering character
        var popup = null;

        // if no scrollview has been specified, use the parent of the listview
        if (o.scrollview === null) {
            o.scrollview = $el.parent();
        }

        // find the bottom of the last item in the listview
        lastListItem = $el.children().last();

        // get all the dividers from the list and turn them into
        // shortcuts
        dividers.each(function (index, divider) {
            var text = $(divider).text();
            var listItem = $('<li>' + text + '</li>');

            // bind mouse over so it moves the scroller to the divider
            listItem.bind('mouseover', function () {
                // get the vertical position of the divider (so we can
                // scroll to it)
                var dividerY = $(divider).position().top;

                // find the bottom of the last list item
                var bottomOffset = lastListItem.outerHeight(true) +
                                   lastListItem.position().top;

                var scrollviewHeight = o.scrollview.height();

                // check that after the candidate scroll, the bottom of the
                // last item will still be at the bottom of the scroll view
                // and not some way up the page
                var maxScroll = bottomOffset - scrollviewHeight;
                dividerY = (dividerY > maxScroll ? maxScroll : dividerY);

                // apply the scroll
                o.scrollview.scrollview('scrollTo', 0, -dividerY);

                // show the popup
                if (!popup) {
                    popup = $('<div class="ui-shortcutscroll-popup">' +
                              '<div></div>' +
                              '</div>');

                    o.scrollview.after(popup);

                    popup.position({my: 'center center',
                                    at: 'center center',
                                    of: o.scrollview});
                }

                popup.find('div').text(text);

                popup.find('div').position({my: 'center center',
                                            at: 'center center',
                                            of: popup});
            });

            shortcutsList.append(listItem);
        });

        // bind mouseout of the shortcutscroll container to remove popup
        shortcutsContainer.bind('mouseout', function () {
            if (popup) {
                popup.remove();
                popup = null;
            }
        });

        o.scrollview.after(shortcutsContainer.append(shortcutsList));
    }
});

$(document).bind( "pagecreate create", function (e) {
    $($.TODONS.shortcutscroll.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .shortcutscroll();
});

})( jQuery );
