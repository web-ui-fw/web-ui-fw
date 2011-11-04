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
// contain text (and has styling to cope with this). If you want
// other elements in your swipelist covers, you may need to style
// them yourself.
//
// Theme: default is to use the parent theme (if set), or 'c' if not;
// can be set explicitly with data-theme="X" or via
// swipelist('option', 'theme', 'X') (though only at create time).
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
        var self = this,
            defaultCoverTheme,
            covers;

        defaultCoverTheme = 'ui-body-' + this.options.theme;

        // swipelist is a listview
        if (!this.element.hasClass('ui-listview')) {
            this.element.listview();
        }

        this.element.removeClass('ui-swipelist')
                    .addClass('ui-swipelist');

        // get the list item covers
        covers = this.element.find(':jqmData(role="swipelist-item-cover")');

        covers.each(function () {
            var cover = $(this);
            var coverTheme = defaultCoverTheme;

            // get the parent li element and add classes
            var item = cover.closest('li');

            // add swipelist CSS classes
            item.removeClass('ui-swipelist-item')
                .addClass('ui-swipelist-item');

            cover.removeClass('ui-swipelist-item-cover')
                 .addClass('ui-swipelist-item-cover');

            // set swatch on cover: if the nearest list item has
            // a swatch set on it, that will be used; otherwise, use
            // the swatch set for the swipelist
            var itemHasThemeClass = item.attr('class')
                                        .match(/ui\-body\-[a-z]|ui\-bar\-[a-z]/);

            if (itemHasThemeClass) {
                coverTheme = itemHasThemeClass[0];
            }

            cover.removeClass(coverTheme)
                 .addClass(coverTheme);

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

            cover.unbind('swiperight', cover.data('animateRight'))
                 .bind('swiperight', cover.data('animateRight'));

            item.unbind('swipeleft', cover.data('animateLeft'))
                .bind('swipeleft', cover.data('animateLeft'));

            // any clicks on buttons inside the item also trigger
            // the cover to slide back to the left
            item.find('.ui-btn')
                .unbind('click', cover.data('animateLeft'))
                .bind('click', cover.data('animateLeft'));
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
