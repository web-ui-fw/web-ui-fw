/*
 * jQuery Mobile Widget @VERSION - listview controls
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

// This extension supplies API to toggle the "mode" in which a list
// is displayed. In "edit" mode, it displays a control panel for manipulating
// the list; in "view" mode, the control panel is hidden.
// Items in the listview can be marked up so that some elements are
// visible in "edit" mode but not in "view" mode.
//
// One example use case would be a control panel with a "Select all" checkbox
// which, when clicked, selects all of the checkboxes in the associated
// listview items.
//
// The control panel itself should be defined as a form element.
// By default, the control panel will be hidden when the listview is
// initialised, unless you supply mode="edit" as a
// data-listview-controls option.
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
// mark each form element with data-listviewcontrols-show-in="<mode>",
// where mode is "edit" or "view". The control's visibility now depends on
// the visibility of the control panel: it is only shown when
// its <mode> setting matches the current mode of the control panel.
// You are responsible for properly styling the form elements inside
// the listview so the listview looks correct when they are hidden or
// visible.
//
// The control panel (visible when in "show" mode) is flexible and
// can contain any valid form elements (or other jqm components). It's
// up to you to define the behaviour associated with interactions on
// the control panel and/or controls inside list items.
//
// Options (set in options hash passed to constructor, or via the
// option method, or declaratively by attribute described below):
//
//   controlsSelector {String}
//     Selector string for selecting the form element representing the
//     control panel for the listview. The context for find() is the
//     document (to give the most flexibility), so your selector
//     should be specific. Set declaratively with
//       data-listviewcontrols="...selector...".
//
//   mode {String='edit'||'view'}
//     Mode for the controls.
//     Set declaratively with
//       data-listviewcontrols-options='{"mode":"<mode>"}'.

(function ($) {

$.widget("todons.listviewcontrols", $.mobile.widget, {
    options: {
        mode: 'view',
        controlsSelector: null
    },

    _create: function (options) {
        options = options || {};

        var self = this,
            optionsValid = true,
            listview = $(this.element),
            page = listview.closest('.ui-page'),
            controlsSelectorAttr,
            controlsSelector,
            dataOptions;

        controlsSelectorAttr = 'data-' + $.mobile.ns + 'listviewcontrols';
        controlsSelector = listview.attr(controlsSelectorAttr);
        options['controlsSelector'] = controlsSelector;

        dataOptions = listview.jqmData('listviewcontrols-options');

        // precedence for options: defaults < jqmData attribute < options arg
        $.extend(dataOptions, this._defaults);
        $.extend(options, dataOptions);

        optionsValid = optionsValid &&
                       this._validOption('controlsSelector', options.controlsSelector) &&
                       this._validOption('mode', options.mode);

        if (!optionsValid) {
            console.error('Could not create listviewcontrols widget due to ' +
                          'invalid option(s)');
            return;
        }

        this.options = options;

        this.controls = $(document).find(options.controlsSelector).first();

        if (this.controls.length === 0) {
            console.error('Could not create listviewcontrols widget: ' +
                          'controlsSelector didn\'t select any elements');
            return;
        }

        if (page && !page.is(':visible')) {
            page.bind('pageshow', function () {
                self.refresh();
            });
        }
        else {
            this.refresh();
        }
    },

    destroy: function () {
    },

    refresh: function () {
    },

    _validOption: function (name, value) {
        switch (name) {
            case 'mode':
                if (!(value == 'view' || value == 'edit')) {
                    console.error('Invalid mode for listviewcontrols widget ' +
                                  '(should be "view" or "edit")');
                    return false;
                }
            case 'controlsSelector':
                if (!value) {
                    console.error('Invalid controlsSelector for ' +
                                  'listviewcontrols widget');
                    return false;
                }
        };

        return true;
    },

    _setOption: function (name, value) {
        var oldValue, newValue;

        oldValue = this.options[name];

        if (this._validOption(name, value)) {
            newValue = this.options[name];

            if (oldValue != newValue) {
                this.refresh();
            }
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
