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
 * meaning first characters of list items, upper-cased.
 *
 * Note that if a listview already has dividers, this extension won't
 * be applied to it. This also protects the list against this extension
 * being applied multiple times.
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
 *         first character of each list item"
 */

(function ($, undefined) {

$.widget("todons.autodividers", $.mobile.widget, {
    options: {
        initSelector: ':jqmData(autodividers):not(:has(li:jqmData(role="list-divider")))',
        type: 'alpha'
    },

    _create: function () {
        this.options.type = this.element.attr('data-autodividers') ||
                            this.options.type;
        this.refresh();
    },

    refresh: function () {
        var dividerType = this.options.type;

        // this will track the text on the last divider
        var lastDividerText = null;

        $(this.element).find('li').not(':jqmData(role="list-divider")').each(function () {
            var divider;

            // look for some text
            var text = $(this).find('a').text() || $(this).text() || null;

            // no text, so don't do anything
            if (!text) {
                return;
            }

            // create the text for the divider
            if (dividerType === 'alpha') {
                text = text.slice(0, 1).toUpperCase();
            }

            if (lastDividerText !== text) {
                lastDividerText = text;

                // add a divider for this character above the current
                // list item
                divider = $('<li data-role="list-divider">' +
                            lastDividerText +
                            '</li>');
                divider.hide();
                $(this).before(divider);
            }
        });

        // remove any visible dividers
        $(this.element).find(':jqmData(role="list-divider"):visible').remove();

        $(this.element).listview('refresh');

        // show the new dividers
        $(this.element).find(':jqmData(role="list-divider")').show();
    }
});

$(document).bind("pagecreate", function (e) {
    $($.todons.autodividers.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .autodividers();
});

})(jQuery);
