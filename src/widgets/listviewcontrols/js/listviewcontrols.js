/*
 * jQuery Mobile Widget @VERSION - listview controls
 *
 * Copyright (C) TODO
 * License: TODO
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
// To associate the listview with the control panel, add
// data-listviewcontrols="..selector.." to a listview, where
// selector selects a single form element (the control panel
// you defined). If you then call
// listviewcontrols('option', 'mode', 'edit') on the
// listview, the controls are made visible (this is just a proxy for
// calling show() on the associated form containing the controls).
//
// Inside the listview's items, you can add controls to each item
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
//   mode {String}
//     Current mode for the widget, which governs the visibility
//     of the listview control panel and any elements marked
//     with data-listviewcontrols-show-in="<mode>".
//     Set declaratively with
//       data-listviewcontrols-options='{"mode":"<mode>"}'.
//
//   controlPanelShowIn {String}
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

    _create: function (options) {
        options = options || {};

        var self = this,
            optionsValid = true,
            listview = $(this.element),
            page = listview.closest('.ui-page'),
            controlPanelSelectorAttr = 'data-' + $.mobile.ns + 'listviewcontrols',
            controlPanelSelector = listview.attr(controlPanelSelectorAttr),
            controlPanelShowIn = null,
            dataOptions = listview.jqmData('listviewcontrols-options');

        options.controlPanelSelector = controlPanelSelector;

        // precedence for options: defaults < jqmData attribute < options arg
        options = $.extend({}, this._defaults, dataOptions, options);

        optionsValid = this._validOption('controlPanelSelector', options.controlPanelSelector) &&
                       this._validOption('modesAvailable', options.modesAvailable) &&
                       this._validOption('mode', options.mode);

        if (!optionsValid) {
            console.error('Could not create listviewcontrols widget due to ' +
                          'invalid option(s)');
            return;
        }

        // get the controls element
        this.controls = $(document).find(options.controlPanelSelector).first();

        if (this.controls.length === 0) {
            console.error('Could not create listviewcontrols widget: ' +
                          'controlPanelSelector didn\'t select any elements');
            return;
        }

        // once we have the controls element, we may need to override the
        // mode in which controls are shown
        controlPanelShowIn = this.controls.jqmData('listviewcontrols-show-in');

        if (controlPanelShowIn &&
            !this._validOption('controlPanelShowIn', controlPanelShowIn, options)) {
            console.error('Could not create listviewcontrols widget due to ' +
                          'invalid show-in option on controls element');
            return;
        }
        else {
            controlPanelShowIn = options.modesAvailable[0];
        }

        options.controlPanelShowIn = controlPanelShowIn;

        // done setting options
        this.options = options;

        // show the widget
        if (page && !page.is(':visible')) {
            page.bind('pageshow', function () { self.refresh(); });
        }
        else {
            this.refresh();
        }
    },

    _validOption: function (name, value, otherOptions) {
        if (name === 'mode' && !(value === 'view' || value === 'edit')) {
            console.error('Invalid mode for listviewcontrols widget ' +
                          '(should be "view" or "edit")');
            return false;
        }
        else if (name === 'controlPanelSelector' && !value) {
            console.error('Invalid controlPanelSelector for ' +
                          'listviewcontrols widget');
            return false;
        }
        else if (name === 'modesAvailable' && !(value && value.length > 1)) {
            console.error('Invalid modesAvailable for listviewcontrols ' +
                          'widget (should be array of strings with at least ' +
                          '2 members)');
            return false;
        }
        else if (name === 'controlPanelShowIn') {
            var modesAvailable = otherOptions.modesAvailable;
            var validMode = ($.inArray(value, modesAvailable) >= 0);
            return value && validMode;
        }

        return true;
    },

    _setOption: function (varName, value) {
        var oldValue = this.options[varName];

        if (oldValue !== value && this._validOption(varName, value)) {
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
            isVisible = null;

        // we only operate on elements inside list items which aren't
        // dividers
        var togglableElts = this.element.find('li:not(:jqmData(role=list-divider))')
                                        .find(':jqmData(listviewcontrols-show-in)');

        // hide/show the control panel and hide/show controls inside
        // list items based on their "show-in" option
        isVisible = this.controls.is(':visible');

        if (this.options.mode === this.options.controlPanelShowIn) {
            this.controls.show();
        }
        else {
            this.controls.hide();
        }

        if (this.controls.is(':visible') !== isVisible) {
            triggerUpdateLayout = true;
        }

        togglableElts.each(function () {
            var showIn = $(this).jqmData('listviewcontrols-show-in');
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
