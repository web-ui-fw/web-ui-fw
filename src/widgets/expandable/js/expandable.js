/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Salvatore Iovene <salvatore.iovene@intel.com>
 */

// An Expandable is a list item controller, which makes a list
// item act like the header of a pop-down container.
//
// To apply, add the attribute data-expandable="true" to list item
// (a <li> element inside a list). Alternatively, call
// expandable() on an element.
//
// The next list element with data-role="expandable-content" is hidden,
// and then its visibility is toggled with an animation when the
// previous <li> is clicked.

(function( $, undefined ) {

$.widget( "todons.expandable", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(expandable)",
        contentSelector: ':jqmData(role="expandable-content")'
    },

    _toggleIcon: function(el) {
        if (el.hasClass('ui-icon-arrow-d')) {
            el.removeClass('ui-icon-arrow-d').addClass('ui-icon-arrow-u');
        } else if (el.hasClass('ui-icon-arrow-u')) {
            el.removeClass('ui-icon-arrow-u').addClass('ui-icon-arrow-d');
        }
    },

    _create: function () {
        var el = this.element,
            self = this,
            icon = el.find('span.ui-icon'),
            expandable_content = el.next(self.options.contentSelector);

        icon.removeClass('ui-icon-arrow-r')
            .addClass('ui-icon-arrow-d');
        expandable_content.hide();
        el.bind('vclick', function() {
            expandable_content.toggle('fast', 'swing');
            self._toggleIcon(icon);
        });
    }
});

$(document).bind( "pagecreate create", function (e) {
    $($.todons.expandable.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .expandable();
});

})( jQuery );
