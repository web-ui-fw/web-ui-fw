/*
 * jQuery Mobile Widget @VERSION - listview controls
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

// This extension supplies API to toggle the "mode" in which a list
// is displayed. The modes available is configurable, but defaults
// to ['edit', 'view']. A list can also have a control panel associated
// with it. The visibility of the control panel is governed by the current
// mode (by default, it is visible in 'edit' mode); elements within
// the listview can also be marked up to be visible in one or more of the
// available modes.
//
// One example use case would be a control panel with a "Select all" checkbox
// which, when clicked, selects all of the checkboxes in the associated
// listview items.
//
// The control panel itself should be defined as a form element.
// By default, the control panel will be hidden when the listview is
// initialised, unless you supply mode="edit" as a
// data-listview-controls option (when using the default modes). If you
// want the control panel to be visible in some mode other than
// the default, use a data-listviewcontrols-show-in="<mode>" attribute
// on the control panel element.
//
// Example usage (using the default 'edit' and 'view' modes):
//
// <!-- this is the controls element, displayed in 'edit' mode by default -->
// <form id="listviewcontrols-control-panel">
//   <fieldset data-role="controlgroup">
//     <input type="checkbox" id="listviewcontrols-demo-checkbox-uber" />
//     <label for="listviewcontrols-demo-checkbox-uber">Select all</label>
//   </fieldset>
// </form>
//
// <!-- this is the list associated with the controls -->
// <ul data-role="listview" data-listviewcontrols="#listviewcontrols-control-panel">
//
//   <li>
//
//     <!-- this element is only visible in 'edit' mode -->
//     <fieldset data-role="controlgroup" data-listviewcontrols-show-in="edit">
//       <input type="checkbox" id="listviewcontrols-demo-checkbox-1" />
//       <label for="listviewcontrols-demo-checkbox-1">Greg</label>
//     </fieldset>
//
//     <!-- this element is only visible in 'view' mode -->
//     <span data-listviewcontrols-show-in="view">Greg</span>
//
//   </li>
//
//   ... more li elements marked up the same way ...
//
// </ul>
//
// To associate the listview with the control panel, add
// data-listviewcontrols="..selector.." to a listview, where
// selector selects a single element (the control panel
// you defined). You can then call
// listviewcontrols('option', 'mode', '<mode>') on the
// listview to set the mode.
//
// Inside the listview's items, add controls to each item
// which are only visible when in one of the modes. To do this,
// add form elements (e.g. checkboxes) to the items as you see fit. Then,
// mark each form element with data-listviewcontrols-show-in="<mode>".
// The control's visibility now depends on the mode of the listviewcontrols:
// it is only shown when its <mode> setting matches the current mode
// of the listviewcontrols widget. You are responsible for properly
// styling the form elements inside the listview so the listview looks
// correct when they are hidden or visible.
//
// The control panel (by default, visible when in "show" mode) is flexible
// and can contain any valid form elements (or other jqm components). It's
// up to you to define the behaviour associated with interactions on
// the control panel and/or controls inside list items.
//
// Methods:
//
//   visibleListItems
//     Returns a jQuery object containing all the li elements in the
//     listview which are currently visible and not dividers. (This
//     is just a convenience to make operating on the list as a whole
//     slightly simpler.)
//
// Options (set in options hash passed to constructor, or via the
// option method, or declaratively by attribute described below):
//
//   controlPanelSelector {String}
//     Selector string for selecting the element representing the
//     control panel for the listview. The context for find() is the
//     document (to give the most flexibility), so your selector
//     should be specific. Set declaratively with
//       data-listviewcontrols="...selector...".
//
//   modesAvailable {String[]; default=['edit', 'view']}
//     An array of the modes available for these controls.
//
//   mode {String; default='view'}
//     Current mode for the widget, which governs the visibility
//     of the listview control panel and any elements marked
//     with data-listviewcontrols-show-in="<mode>".
//     Set declaratively with
//       data-listviewcontrols-options='{"mode":"<mode>"}'.
//
//   controlPanelShowIn {String; default=modesAvailable[0]}
//     The mode in which the control panel is visible; defaults to the
//     first element of modesAvailable. Can be set declaratively
//     on the listview controls element with
//       data-listviewcontrols-show-in="<mode>"

(function ($) {

$.widget("todons.listviewcontrols", $.mobile.widget, {
    _defaults: {
        controlPanelSelector: null,
        modesAvailable: ['edit', 'view'],
        mode: 'view',
        controlPanelShowIn: null
    },

    _listviewCssClass: 'ui-listviewcontrols-listview',
    _controlsCssClass: 'ui-listviewcontrols-panel',

    _create: function () {
        var self = this,
            o = this.options,
            optionsValid = true,
            page = this.element.closest('.ui-page'),
            controlPanelSelectorAttr = 'data-' + $.mobile.ns + 'listviewcontrols',
            controlPanelSelector = this.element.attr(controlPanelSelectorAttr),
            dataOptions = this.element.jqmData('listviewcontrols-options'),
            controlPanelShowInAttr;

        o.controlPanelSelector = o.controlPanelSelector || controlPanelSelector;

        // precedence for options: defaults < jqmData attribute < options arg
        o = $.extend({}, this._defaults, dataOptions, o);

        optionsValid = (this._validOption('modesAvailable', o.modesAvailable, o) &&
                        this._validOption('controlPanelSelector', o.controlPanelSelector, o) &&
                        this._validOption('mode', o.mode, o));

        if (!optionsValid) {
            return false;
        }

        // get the controls element
        this.controlPanel = $(document).find(o.controlPanelSelector).first();

        if (this.controlPanel.length === 0) {
            return false;
        }

        // once we have the controls element, we may need to override the
        // mode in which controls are shown
        controlPanelShowInAttr = this.controlPanel.jqmData('listviewcontrols-show-in');
        if (controlPanelShowInAttr) {
            o.controlPanelShowIn = controlPanelShowInAttr;
        }
        else if (!o.controlPanelShowIn) {
            o.controlPanelShowIn = o.modesAvailable[0];
        }

        if (!this._validOption('controlPanelShowIn', o.controlPanelShowIn, o)) {
            return;
        }

        // done setting options
        this.options = o;

        // mark the controls and the list with a class
        this.element.removeClass(this._listviewCssClass).addClass(this._listviewCssClass);
        this.controlPanel.removeClass(this._controlsCssClass).addClass(this._controlsCssClass);

        // show the widget
        if (page && !page.is(':visible')) {
            page.bind('pageshow', function () { self.refresh(); });
        }
        else {
            this.refresh();
        }
    },

    _validOption: function (varName, value, otherOptions) {
        var ok = false;

        if (varName === 'mode') {
            ok = ($.inArray(value, otherOptions.modesAvailable) >= 0);
        }
        else if (varName === 'controlPanelSelector') {
            ok = ($.type(value) === 'string');
        }
        else if (varName === 'modesAvailable') {
            ok = ($.isArray(value) && value.length > 1);

            if (ok) {
                for (var i = 0; i < value.length; i++) {
                    if (value[i] === '' || $.type(value[i]) !== 'string') {
                        ok = false;
                    }
                }
            }
        }
        else if (varName === 'controlPanelShowIn') {
            ok = ($.inArray(value, otherOptions.modesAvailable) >= 0);
        }

        return ok;
    },

    _setOption: function (varName, value) {
        var oldValue = this.options[varName];

        if (oldValue !== value && this._validOption(varName, value, this.options)) {
            this.options[varName] = value;
            this.refresh();
        }
    },

    visibleListItems: function () {
        return this.element.find('li:not(:jqmData(role=list-divider)):visible');
    },

    refresh: function () {
        var self = this,
            triggerUpdateLayout = false,
            isVisible = null,
            showIn,
            modalElements;

        // hide/show the control panel and hide/show controls inside
        // list items based on their "show-in" option
        isVisible = this.controlPanel.is(':visible');

        if (this.options.mode === this.options.controlPanelShowIn) {
            this.controlPanel.show();
        }
        else {
            this.controlPanel.hide();
        }

        if (this.controlPanel.is(':visible') !== isVisible) {
            triggerUpdateLayout = true;
        }

        // we only operate on elements inside list items which aren't dividers
        modalElements = this.element.find('li:not(:jqmData(role=list-divider))')
                                    .find(':jqmData(listviewcontrols-show-in)');

        modalElements.each(function () {
            showIn = $(this).jqmData('listviewcontrols-show-in');

            isVisible = $(this).is(':visible');

            if (showIn === self.options.mode) {
                $(this).show();
            }
            else {
                $(this).hide();
            }

            if ($(this).is(':visible') !== isVisible) {
                triggerUpdateLayout = true;
            }
        });

        if (triggerUpdateLayout) {
            this.element.trigger('updatelayout');
        }
    }
});

$('ul').live('listviewcreate', function () {
	var list = $(this);

	if (list.is(':jqmData(listviewcontrols)')) {
		list.listviewcontrols();
	}
});

})(jQuery);
