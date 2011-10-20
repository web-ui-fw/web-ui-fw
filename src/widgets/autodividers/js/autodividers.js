/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

/**
 * Applies dividers automatically to a listview, using link text
 * (for link list) or text (for readonly list) as the basis for the
 * divider text.
 *
 * Apply using autodividers({type: 'X'}) on a <ul> with
 * data-role="listview", or with data-autodividers="X", where X
 * is the type of divider to create. The default divider type is 'alpha',
 * meaning first characters of list item text, upper-cased.
 *
 * The element used to derive the text for the auto dividers defaults
 * to the first link inside the li; failing that, the text directly inside
 * the li element is used. This can be overridden with the
 * data-autodividers-selector attribute or via options; the selector
 * will use each li element as its context.
 *
 * Any time a new li element is added to the list, or an li element is
 * removed, this extension will update the dividers in the listview
 * accordingly.
 *
 * Note that if a listview already has dividers, applying this
 * extension will remove all the existing dividers and replace them
 * with new ones.
 *
 * Also note that this extension doesn't sort the list: it only creates
 * dividers based on text inside list items. So if your list isn't
 * alphabetically-sorted, you will get duplicate dividers with the
 * 'alpha' autodivider type. (Dividers are added before individual
 * list items, and change each time the first character of a list item
 * is different from the first character of the immediately preceding
 * list item).
 *
 * So, for example, this markup:
 *
 * <ul id="has-no-dividers" data-role="listview" data-autodividers="alpha">
 *      <li>Barry</li>
 *      <li>Carrie</li>
 *      <li>Betty</li>
 *      <li>Harry</li>
 *      <li>Carly</li>
 *      <li>Hetty</li>
 * </ul>
 *
 * will produce divider markup like this:
 *
 * <ul data-role="listview" data-autodividers="alpha">
 *    <li data-role="list-divider">B</li>
 *    <li>Barry</li>
 *    <li data-role="list-divider">C</li>
 *    <li>Carrie</li>
 *    <li data-role="list-divider">B</li>
 *    <li>Betty</li>
 *    <li data-role="list-divider">H</li>
 *    <li>Harry</li>
 *    <li data-role="list-divider">C</li>
 *    <li>Carly</li>
 *    <li data-role="list-divider">H</li>
 *    <li>Hetty</li>
 * </ul>
 *
 * with each divider occuring twice.
 *
 * Options:
 *
 *   type: 'alpha' (default) sets the auto divider type to "uppercased
 *         first character of text selected from each item". Set in
 *         the data-autodividers="X" attribute on the listview or via
 *         options.
 *   selector: The jQuery selector to use to find text for the
 *             generated dividers. Default is to use the first 'a'
 *             (link) element. If this selector doesn't find any
 *             text, the widget automatically falls back to the text
 *             inside the li (for read-only lists). Can be set
 *             via data-autodividers-selector="...".
 *
 * Events:
 *
 *   update: Triggered if the dividers in the list change; generally
 *           happens if items are added to the listview which cause
 *           the dividers to change.
 *
 * Methods:
 *
 *   refresh: Renew all the dividers in the list, replacing all of
 *            the existing dividers where necessary. An 'update' event
 *            is triggered if the new set of dividers contains
 *            different text from the old set (NOT if the dividers
 *            just change position in the list).
 */

(function ($, undefined) {

$.widget("todons.autodividers", $.mobile.widget, {
    options: {
        initSelector: ':jqmData(autodividers)',
        type: 'alpha',
        selector: 'a'
    },

    _create: function () {
        var self = this;

        this.options.type = this.element.attr('data-autodividers') ||
                            this.options.type;

        this.options.selector = this.element.attr('data-autodividers-selector') ||
                                this.options.selector;

        // refresh on addition/removal of list elements on the listview
        this.element.bind('DOMNodeInserted DOMNodeRemoved', function (e) {
            if ($(e.target).is('li:not(:jqmData(role="list-divider"))')) {
                $(e.target).data('pending-dom-event-type', e.type);
                self.refresh();
            }
        });

        this.refresh();
    },

    /**
     * Rebuild the list dividers.
     */
    refresh: function () {
        var textSelector = this.options.selector;
        var dividerType = this.options.type;

        // this will track the text on the last divider
        var lastDividerText = null;

        // track the text on the old dividers
        var oldDividersText = '';

        // track the text on the new dividers
        var newDividersText = '';

        // remove the old dividers and add new ones
        $(this.element).find('li').each(function () {
            var divider, text;

            // remove if a divider
            if ($(this).is(':jqmData(role="list-divider")')) {
                oldDividersText += $(this).text();
                $(this).remove();
                return;
            }

            // hackery: ignore list item if it is just about to be removed;
            // this is to work around the fact that the DOMNodeRemoved
            // event is fired _before_ the node is actually removed
            if ($(this).data('pending-dom-event-type') === 'DOMNodeRemoved') {
                return;
            }

            // look for some text in the item
            text = $(this).find(textSelector).text() ||
                   $(this).text() ||
                   null;

            // no text, so don't do anything
            if (!text) {
                return;
            }

            // create the text for the divider
            if (dividerType === 'alpha') {
                text = text.slice(0, 1).toUpperCase();
            }

            // found a new divider
            if (lastDividerText !== text) {
                lastDividerText = text;
                newDividersText += text;

                // add a divider for this character above the current
                // list item
                divider = $('<li data-role="list-divider">' +
                            lastDividerText +
                            '</li>');

                $(this).before(divider);
            }
        });

        $(this.element).listview('refresh');

        // compare the old dividers with the new ones; if they are
        // different, trigger an 'update' event
        if (newDividersText != oldDividersText) {
            this.element.trigger('update');
        }
    }
});

$(document).bind("pagecreate", function (e) {
    $($.todons.autodividers.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .autodividers();
});

})(jQuery);
