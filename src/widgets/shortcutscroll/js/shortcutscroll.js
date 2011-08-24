/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

/**
 * Scrollview controller, which binds the visible part of a scrollview
 * to a a list of short cuts. Clicking on a shortcut jumps the scrollview
 * to the selected list divider; mouse movements on the shortcut column
 * move the scrollview to the list divider currently under the touch.
 *
 * To apply, add the attribute data-shortcutscroll="true" to a listview
 * (a <ul> or <ol> element inside a page).
 *
 * If a scrollview is not passed as an option to the widget, the parent
 * of the listview is assumed to be the scrollview to be controlled.
 */
(function( $, undefined ) {

$.widget( "TODONS.shortcutscroll", $.mobile.widget, {
  options: {
    initSelector: ":jqmData(shortcutscroll)",
    scrollview: null,
    scrollDuration: 500
  },

  _create: function () {
    var $el = this.element,
      o = this.options,
      shortcutsContainer = $('<ul></ul>'),
      dividers = $el.find(':jqmData(role="list-divider")'),
      lastListItem = null;

    // set a minimum scroll duration; with duration = 0, the scroll moves
    // in the wrong direction
    o.scrollDuration = parseInt(o.scrollDuration) && o.scrollDuration > 0 ?
                         o.scrollDuration :
                         500;

    // if no scrollview has been specified, use the parent of the listview
    if (o.scrollview === null) {
      o.scrollview = $el.parent();
    }

    // find the bottom of the last item in the listview
    lastListItem = $el.children().last();

    // get all the dividers from the list
    dividers.each(function (index, divider) {
      var listItem = $('<li>' + $(this).text() + '</li>');

      // bind clicks so they move the scroller to the divider
      listItem.bind('click', function () {
        // get the vertical position of the divider (so we can scroll to it)
        var dividerY = $(divider).position().top;

        // find the bottom of the last list item
        var bottomOffset = lastListItem.outerHeight(true) + lastListItem.position().top;

        // get the height of the scrollview
        var scrollviewHeight = o.scrollview.height();

        // check that after the candidate scroll, the bottom of the
        // last item will still be at the bottom of the scroll view
        // and not half way up the page
        var maxScroll = bottomOffset - scrollviewHeight;

        if (dividerY > maxScroll) {
          dividerY = maxScroll;
        }

        // apply the scroll
        o.scrollview.scrollview('scrollTo', 0, dividerY, o.scrollDuration);
      });

      shortcutsContainer.append(listItem);
    });

    o.scrollview.after($('<div class="ui-shortcutscroll"/>').append(shortcutsContainer));
  },

  refresh: function () {
  }
});

$(document).bind( "pagecreate create", function (e){
  $($.TODONS.shortcutscroll.prototype.options.initSelector, e.target)
  .not(":jqmData(role='none'), :jqmData(role='nojs')")
  .shortcutscroll();
});

})( jQuery );
