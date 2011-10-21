/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Salvatore Iovene <salvatore.iovene@intel.com>
 */

/**
 * An Expandable is a list item controller, which makes a list
 * item act like the header of a pop-down container.
 *
 * To apply, add the attribute data-expandable="true" to list item
 * (a <li> element inside a list). Alternatively, call
 * expandable_list_item() on an element.
 *
 * The last <div> element with data-role="expandable-content" is hidden,
 * and then its visibility is toggled with an animation when the
 * parent <li> is clicked.
 */
(function( $, undefined ) {

$.widget( "todons.expandable", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(expandable)"
    },

    _create: function () {
        var $el = this.element,
            self = this,
            expandable_content = $el.find(':jqmData(role="expandable-content"');
    }
});

$(document).bind( "pagecreate create", function (e) {
    $($.todons.expandable.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .expandable();
});

})( jQuery );
