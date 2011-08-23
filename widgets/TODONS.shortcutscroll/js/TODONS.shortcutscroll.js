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
    shortcutsContainer.append( $('<li>A</li>') );
    shortcutsContainer.append( $('<li>B</li>') );
    shortcutsContainer.append( $('<li>C</li>') );

    $el.parent().after( $('<div class="ui-shortcutscroll">').append( shortcutsContainer ) );

    this.refresh();
  },

  refresh: function() {
  }
});

function ResizePageContentHeight($page)
{
	var $content = $page.children(".ui-content");
	var hh = $page.children(".ui-header").outerHeight(); hh = hh ? hh : 0;
	var fh = $page.children(".ui-footer").outerHeight(); fh = fh ? fh : 0;
	var pt = parseFloat($content.css("padding-top"));
	var pb = parseFloat($content.css("padding-bottom"));
	var wh = window.innerHeight;
	$content.height(wh - (hh + fh) - (pt + pb));
}

$( document ).bind( "pagecreate create", function( e ){
  $page = $( e.target );

  $( $.TODONS.shortcutscroll.prototype.options.initSelector, $page )
    .not( ":jqmData(role='none'), :jqmData(role='nojs')" )
    .shortcutscroll({scrollview: $page});

  $page.bind("pageshow", function(event) {
	  $page.find(".ui-content").scrollview({direction: 'y', showScrollBars: false});

	  ResizePageContentHeight( $page );
  });
});

$(window).bind("orientationchange", function(event) {
	ResizePageContentHeight($(".ui-page"));
});

})( jQuery );
