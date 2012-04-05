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
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

// Horizontal/vertical box layout extension.
//
// This will arrange the child elements of a container in a horizontal
// or vertical row. This only makes sense if your container is a div
// and contains children which are also divs; the children should
// also have a height and width set in CSS, otherwise the layout
// manager won't know what to do with them.
//
// Apply it by setting data-layout="hbox" or data-layout="vbox" (vertical
// on a container element or calling $(element).layouthbox() or
// $(element).layoutvbox().
//
// Usually, you would use a div as the container to get the right effect
// (an element with display:block).
//
// Options can be set programmatically:
//
//   $(element).layouthbox('option', 'scrollable', false)
//   $(element).layoutvbox('option', 'scrollable', false)
//
// or via a data-layout-options attribute on the container:
//
//   <div data-layout="hbox" data-layout-options='{"hgap":5}'>
//       <div>child 1</div>
//       <div>child 2</div>
//   </div>
//
//   <div data-layout="vbox" data-layout-options='{"vgap":5}'>
//       <div>child 1</div>
//       <div>child 2</div>
//   </div>
//
// If you change any options after creating the widget, call
// $(element).layout*box('refresh') to have them picked up.
// However, note that it's currently not feasible to turn off scrolling
// once it's on (as calling scrollview('destroy') doesn't remove the
// scrollview custom mouse handlers).
//
// There is one major difference between the horizontal and
// vertical box layouts: if scrollable=false, the horizontal layout
// will clip children which overflow the edge of the parent container;
// by comparison, the vertical container will grow vertically to
// accommodate the height of its children. This mirrors the behaviour
// of jQuery Mobile, where elements only ever expand horizontally
// to fill the width of the window; but will expand vertically forever,
// unless the page height is artificially constrained.
//
// Options:
//
//   {Integer} hgap (default=0)
//   Horizontal gap (in pixels) between the child elements. Only has
//   an effect on hbox.
//
//   {Integer} vgap (default=0)
//   Vertical gap (in pixels) between the child elements. Only has
//   an effect on vbox.
//
//   {Boolean} scrollable (default=true; can only be set at create time)
//   Set to true to enable a scrollview on the
//   container. If false, children will be clipped if
//   they fall outside the edges of the container after
//   layouting.
//
//   {Boolean} showScrollBars (default=true)
//   Set to false to hide scrollbars on the container's scrollview.
//   Has no effect is scrollable=false

(function ($, undefined) {

// hbox
$.widget("tizen.layouthbox", $.tizen.jlayoutadaptor, {
    fixed: {
        type: 'flexGrid',
        rows: 1,
        direction: 'x',
        initSelector: ':jqmData(layout="hbox")'
    },

    _create: function () {
        if (!this.options.hgap) {
            this.options.hgap = 0;
        }

        $.tizen.jlayoutadaptor.prototype._create.apply(this, arguments);
    }
});

$(document).bind("pagecreate", function (e) {
    $($.tizen.layouthbox.prototype.fixed.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .layouthbox();
});

// vbox
$.widget("tizen.layoutvbox", $.tizen.jlayoutadaptor, {
    fixed: {
        type: 'flexGrid',
        columns: 1,
        direction: 'y',
        initSelector: ':jqmData(layout="vbox")'
    },

    _create: function () {
        if (!this.options.vgap) {
            this.options.vgap = 0;
        }

        $.tizen.jlayoutadaptor.prototype._create.apply(this, arguments);
    }
});

$(document).bind("pagecreate", function (e) {
    $($.tizen.layoutvbox.prototype.fixed.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .layoutvbox();
});

})(jQuery);
