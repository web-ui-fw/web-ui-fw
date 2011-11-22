/*
 * jQuery Mobile Widget @VERSION
 *
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
