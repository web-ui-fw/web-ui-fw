/*
 * jQuery Mobile Widget @VERSION
 *
 * This software is licensed under the MIT licence (as defined by the OSI at
 * http://www.opensource.org/licenses/mit-license.php)
 *
 * ***************************************************************************
 * Copyright (C) 2011 by Intel Corporation Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 *
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
// <pre>
// &lt;ul data-role="swipelist"&gt;<br/>
//     &lt;li&gt;<br/>
//         &lt;div class="ui-grid-b"&gt;<br/>
//             &lt;div class="ui-block-a"&gt;<br/>
//                 &lt;a href="#" data-role="button" data-theme="a"&gt;Twitter&lt;/a&gt;<br/>
//             &lt;/div&gt;<br/>
//             &lt;div class="ui-block-b"&gt;<br/>
//                 &lt;a href="#" data-role="button" data-theme="b"&gt;FaceBook&lt;/a&gt;<br/>
//             &lt;/div&gt;<br/>
//             &lt;div class="ui-block-c"&gt;<br/>
//                 &lt;a href="#" data-role="button" data-theme="c"&gt;Google+&lt;/a&gt;<br/>
//             &lt;/div&gt;<br/>
//         &lt;/div&gt;<br/>
//         &lt;div data-role="swipelist-item-cover"&gt;Nigel&lt;/div&gt;<br/>
//     &lt;/li&gt;<br/>
//     ...<br/>
// &lt;/ul&gt;
// </pre>
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
// Theme: default is to use the theme on the target element,
// theme passed in options, parent theme, or 'c' if none of the above.
// If list items are themed individually, the cover will pick up the
// theme of the list item which is its parent.
//
// Events:
//
//   animationComplete: Triggered by a cover when it finishes sliding
//                      (to either the right or left).
(function ($) {

$.widget("tizen.swipelist", $.mobile.widget, {
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
        this._cleanupDom();

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

            // bind to synthetic events
            item.bind('swipeleft', cover.data('animateLeft'));
            cover.bind('swiperight', cover.data('animateRight'));

            // any clicks on buttons inside the item also trigger
            // the cover to slide back to the left
            item.find('.ui-btn').bind('click', cover.data('animateLeft'));
        });
    },

    _cleanupDom: function () {
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
            var text, wrapper;

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
            wrapper = cover.find('.ui-swipelist-item-cover-inner');

            wrapper.children().unwrap();

            text = wrapper.text()

            if (text) {
              cover.append(text);
              wrapper.remove();
            }

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
    //
    // once the cover animation is done, the cover emits an
    // animationComplete event
    _animateCover: function (cover, leftPercentage) {
        var animationOptions = {
          easing: 'linear',
          duration: 'fast',
          queue: true,
          complete: function () {
              cover.trigger('animationComplete');
          }
        };

        cover.stop();
        cover.clearQueue();
        cover.animate({left: '' + leftPercentage + '%'}, animationOptions);
    },

    destroy: function () {
      this._cleanupDom();
    }

});

$(document).bind("pagecreate", function (e) {
    $(e.target).find(":jqmData(role='swipelist')").swipelist();
});

})(jQuery);
