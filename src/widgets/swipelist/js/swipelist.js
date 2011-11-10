/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Kalyan Kondapally <kalyan.kondapally@intel.com>,
 *          Elliot Smith <elliot.smith@intel.com>
 */

// Widget which turns a list into a "swipe list":
// i.e. each list item has a sliding "cover" which can be swiped
// to the right (to reveal buttons underneath) or left (to
// cover the buttons again). Clicking on a button under a swipelist
// also moves the cover back to the left.
//
// To create a swipelist, you need markup like this:
//
// <ul data-role="swipelist">
//      <li>
//          <div class="ui-grid-b">
//              <div class="ui-block-a">
//                  <a href="#" data-role="button" data-theme="a">Twitter</a>
//              </div>
//              <div class="ui-block-b">
//                  <a href="#" data-role="button" data-theme="b">FaceBook</a>
//              </div>
//              <div class="ui-block-c">
//                  <a href="#" data-role="button" data-theme="c">Google+</a>
//              </div>
//          </div>
//          <div data-role="swipelist-item-cover">Nigel</div>
//      </li>
//      ...
// </ul>
//
// In this case, the cover is over a grid of buttons;
// but it is should also be possible to use other types of markup under the
// list items.
//
// Note the use of a separate div, parented by the li element, marked
// up with data-role="swipelist-item-cover". This div will usually
// contain text. If you want other elements in your swipelist covers,
// you may need to style them yourself. Because the covers aren't
// technically list items, you may need to do some work to make them
// look right.
//
// WARNING: This doesn't work well inside a scrollview widget, as
// the touch events currently interfere with each other badly (e.g.
// a swipe will work but cause a scroll as well).
//
// Theme: default is to use the parent theme (if set), or 'c' if not;
// can be set explicitly with data-theme="X" or via
// swipelist('option', 'theme', 'X') (though only at create time).
// If list items are themed individually, the cover will pick up the
// theme of the list item which is its parent.
(function ($) {

$.widget("todons.swipelist", $.mobile.widget, {
    options: {
        theme: null
    },

    _create: function () {
        // use the theme set on the element, set in options,
        // the parent theme, or 'c' (in that order of preference)
        var theme = this.element.jqmData('theme') ||
                    this.options.theme ||
                    this.element.parent().jqmData('theme') ||
                    'c';

        this.options.theme = theme;

        this.refresh();
    },

    refresh: function () {
        this.destroy();

        var self = this,
            defaultCoverTheme,
            covers;

        defaultCoverTheme = 'ui-body-' + this.options.theme;

        // swipelist is a listview
        if (!this.element.hasClass('ui-listview')) {
            this.element.listview();
        }

        this.element.addClass('ui-swipelist');

        // get the list item covers
        covers = this.element.find(':jqmData(role="swipelist-item-cover")');

        covers.each(function () {
            var cover = $(this);
            var coverTheme = defaultCoverTheme;

            // get the parent li element and add classes
            var item = cover.closest('li');

            // add swipelist CSS classes
            item.addClass('ui-swipelist-item');

            cover.addClass('ui-swipelist-item-cover');

            // set swatch on cover: if the nearest list item has
            // a swatch set on it, that will be used; otherwise, use
            // the swatch set for the swipelist
            var itemHasThemeClass = item.attr('class')
                                        .match(/ui\-body\-[a-z]|ui\-bar\-[a-z]/);

            if (itemHasThemeClass) {
                coverTheme = itemHasThemeClass[0];
            }

            cover.addClass(coverTheme);

            // wrap inner HTML (so it can potentially be styled)
            if (cover.has('.ui-swipelist-item-cover-inner').length === 0) {
                cover.wrapInner($('<span/>').addClass('ui-swipelist-item-cover-inner'));
            }

            // bind to swipe events on the cover and the item
            if (!(cover.data('animateRight') && cover.data('animateLeft'))) {
                cover.data('animateRight', function () {
                    self._animateCover(cover, 100);
                });

                cover.data('animateLeft', function () {
                    self._animateCover(cover, 0);
                });
            }

            cover.bind('swiperight', cover.data('animateRight'));

            item.bind('swipeleft', cover.data('animateLeft'));

            // any clicks on buttons inside the item also trigger
            // the cover to slide back to the left
            item.find('.ui-btn').bind('click', cover.data('animateLeft'));
        });
    },

    destroy: function () {
        var self = this,
            defaultCoverTheme,
            covers;

        defaultCoverTheme = 'ui-body-' + this.options.theme;

        this.element.removeClass('ui-swipelist');

        // get the list item covers
        covers = this.element.find(':jqmData(role="swipelist-item-cover")');

        covers.each(function () {
            var cover = $(this);
            var coverTheme = defaultCoverTheme;

            // get the parent li element and add classes
            var item = cover.closest('li');

            // remove swipelist CSS classes
            item.removeClass('ui-swipelist-item');
            cover.removeClass('ui-swipelist-item-cover');

            // remove swatch from cover: if the nearest list item has
            // a swatch set on it, that will be used; otherwise, use
            // the swatch set for the swipelist
            var itemClass = item.attr('class');
            var itemHasThemeClass = itemClass &&
                                    itemClass.match(/ui\-body\-[a-z]|ui\-bar\-[a-z]/);

            if (itemHasThemeClass) {
                coverTheme = itemHasThemeClass[0];
            }

            cover.removeClass(coverTheme);

            // remove wrapper HTML
            cover.find('.ui-swipelist-item-cover-inner').children().unwrap();

            // unbind swipe events
            if (cover.data('animateRight') && cover.data('animateLeft')) {
                cover.unbind('swiperight', cover.data('animateRight'));
                item.unbind('swipeleft', cover.data('animateLeft'));

                // unbind clicks on buttons inside the item
                item.find('.ui-btn').unbind('click', cover.data('animateLeft'));

                cover.data('animateRight', null);
                cover.data('animateLeft', null);
            }
        });
    },

    // NB I tried to use CSS animations for this, but the performance
    // and appearance was terrible on Android 2.2 browser;
    // so I reverted to jQuery animations
    _animateCover: function (cover, leftPercentage) {
        cover.stop();
        cover.clearQueue();
        cover.animate({left: '' + leftPercentage + '%'}, 'fast', 'linear');
    }

});

$(document).bind("pagecreate", function (e) {
    $(e.target).find(":jqmData(role='swipelist')").swipelist();
});

})(jQuery);
