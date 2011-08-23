/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

/**
 * To apply, add the attribute data-shortcutscroll="true" to a listview
 * (a <ul> or <ol> element inside a page).
 *
 * Applying shortcutscroll to a list will make the content area of the page
 * a scrollview with vertical scrolling enabled.
 */
(function( $, undefined ) {

$.widget( "TODONS.shortcutscroll", $.mobile.widget, {
  options: {
    initSelector: ":jqmData(shortcutscroll)"
  },

  _create: function() {
    var $el = this.element,
      o = this.options,
      shortcutsContainer = $('<ul></ul>');

    // TODO use characters from dividers rather than hard-coding here
    shortcutsContainer.append($('<li>A</li>'));
    shortcutsContainer.append($('<li>B</li>'));
    shortcutsContainer.append($('<li>C</li>'));

    $el.parent().after($('<div class="ui-shortcutscroll">').append(shortcutsContainer));

    this.refresh();
  },

  refresh: function() {
  }
});

$( document ).bind( "pagecreate create", function( e ){
  $( $.TODONS.shortcutscroll.prototype.options.initSelector, e.target )
    .not( ":jqmData(role='none'), :jqmData(role='nojs')" )
    .shortcutscroll();
});

})( jQuery );
