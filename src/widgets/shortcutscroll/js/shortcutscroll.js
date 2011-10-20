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
 * shortcutscroll() on an element.
 *
 * The closest element with class ui-scrollview-clip is used as the
 * scrollview to be controlled.
 *
 * If a listview has no dividers or a single divider, the widget won't
 * display.
 */
(function( $, undefined ) {

$.widget( "todons.shortcutscroll", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(shortcutscroll)"
    },

    _create: function () {
        var $el = this.element,
            self = this,
            $popup,
            page = $el.closest(':jqmData(role="page")');

        this.scrollview = $el.closest('.ui-scrollview-clip');
        this.shortcutsContainer = $('<div class="ui-shortcutscroll"/>');
        this.shortcutsList = $('<ul></ul>');

        // popup for the hovering character
        this.shortcutsContainer.append($('<div class="ui-shortcutscroll-popup"></div>'));
        $popup = this.shortcutsContainer.find('.ui-shortcutscroll-popup');

        this.shortcutsContainer.append(this.shortcutsList);
        this.scrollview.append(this.shortcutsContainer);

        // find the bottom of the last item in the listview
        this.lastListItem = $el.children().last();

        // remove scrollbars from scrollview
        this.scrollview.find('.ui-scrollbar').hide();

        var jumpToDivider = function(divider) {
            // get the vertical position of the divider (so we can
            // scroll to it)
            var dividerY = $(divider).position().top;

            // find the bottom of the last list item
            var bottomOffset = self.lastListItem.outerHeight(true) +
                               self.lastListItem.position().top;

            var scrollviewHeight = self.scrollview.height();

            // check that after the candidate scroll, the bottom of the
            // last item will still be at the bottom of the scroll view
            // and not some way up the page
            var maxScroll = bottomOffset - scrollviewHeight;
            dividerY = (dividerY > maxScroll ? maxScroll : dividerY);

            // don't apply a negative scroll, as this means the
            // divider should already be visible
            dividerY = Math.max(dividerY, 0);

            // apply the scroll
            self.scrollview.scrollview('scrollTo', 0, -dividerY);

            $popup.text($(divider).text())
                  .position({my: 'center center',
                             at: 'center center',
                             of: self.scrollview})
                  .show();
        };

        this.shortcutsList
        // bind mouse over so it moves the scroller to the divider
        .bind('touchstart mousedown vmousedown touchmove vmousemove vmouseover', function (e) {
            // Get coords relative to the element
            var coords = $.mobile.todons.targetRelativeCoordsFromEvent(e);
            var shortcutsListOffset = self.shortcutsList.offset();

            // If the element is a list item, get coordinates relative to the shortcuts list
            if (e.target.tagName.toLowerCase() === "li") {
                coords.x += $(e.target).offset().left - shortcutsListOffset.left;
                coords.y += $(e.target).offset().top  - shortcutsListOffset.top;
            }

            // Hit test each list item
            self.shortcutsList.find('li').each(function() {
                var listItem = $(this),
                    l = listItem.offset().left - shortcutsListOffset.left,
                    t = listItem.offset().top  - shortcutsListOffset.top,
                    r = l + Math.abs(listItem.outerWidth(true)),
                    b = t + Math.abs(listItem.outerHeight(true));

                if (coords.x >= l && coords.x <= r && coords.y >= t && coords.y <= b) {
                    jumpToDivider($(listItem.data('divider')));
                    return false;
                }
                return true;
            });

            e.preventDefault();
            e.stopPropagation();
        })
        // bind mouseout of the shortcutscroll container to remove popup
        .bind('touchend mouseup vmouseup vmouseout', function () {
            $popup.hide();
        });

        if (page && !(page.is(':visible'))) {
            page.bind('pageshow', function () { self.refresh(); });
        }
        else {
            this.refresh();
        }

        // refresh the list when the dividers change
        $el.bind('listChanged', function () {
            self.refresh();
        });

        // refresh the list when dividers are filtered out
        $el.bind('listFiltered', function () {
            self.refresh(true);
        });
    },

    refresh: function (visibleOnly) {
        var self = this,
            shortcutsTop;

        this.shortcutsList.find('li').remove();

        // get all the dividers from the list and turn them into
        // shortcuts
        var dividers = this.element.find(':jqmData(role="list-divider")');

        // get all the list items
        var listItems = this.element.find('li:not(:jqmData(role="list-divider"))');

        if (visibleOnly) {
            dividers = dividers.filter(':visible');
            listItems = listItems.filter(':visible');
        }

        if (dividers.length < 2) {
            this.shortcutsList.hide();
            return;
        }

        this.shortcutsList.show();

        this.lastListItem = listItems.last();

        dividers.each(function (index, divider) {
            self.shortcutsList.append($('<li>' + $(divider).text() + '</li>')
                              .data('divider', divider));
        });

        // position the shortcut flush with the top of the first
        // list divider
        shortcutsTop = dividers.first().position().top;
        this.shortcutsContainer.css('top', shortcutsTop);
    }
});

$(document).bind( "pagecreate create", function (e) {
    $($.todons.shortcutscroll.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .shortcutscroll();
});

})( jQuery );
