(function($, undefined) {

$.widget("todons.optionheader", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(role='optionheader')",
        showIndicator: true,
        theme: 'c',
        collapsed: false,
        expandable: true
    },

    _create: function () {
        var el = $(this.element),
            arrowHtml = '<div class="ui-option-header-triangle-arrow"></div>',
            options,
            numRows,
            rowsClass,
            theme,
            themeClass;

        // parse data-options
        options = el.data('options');
        $.extend(this.options, options);

        // count ui-grid-a elements to get number of rows
        numRows = el.find('.ui-grid-a').length;

        // ...at least one row
        numRows = Math.max(1, numRows);

        // parse data-theme and reset options.theme if it's present
        theme = el.data('theme') || this.options.theme;
        this.options.theme = theme;

        // add classes to outer div:
        //   ui-option-header-N-row, where N = options.rows
        //   ui-bar-X, where X = options.theme (defaults to 'c')
        //   ui-option-header
        rowsClass = 'ui-option-header-' + numRows + '-row';
        themeClass = 'ui-bar-' + this.options.theme;
        el.addClass(rowsClass + ' ' + themeClass + ' ui-option-header');

        // if there are elements inside the option header
        // and this.options.showIndicator,
        // insert a triangle arrow as the first element inside the
        // optionheader div to show the header is expandable
        if (el.children().length > 0 && this.options.showIndicator) {
            // add the arrow
            el.children().first().before(arrowHtml);
        }

        // if expandable, bind clicks to the toggleExpanded() method
        if (this.options.expandable) {

        }

        // for each ui-grid-a element, append a class ui-option-header-row-M
        // to it, where M is the xpath position() of the div
        el.find('.ui-grid-a').each(function (index) {
            $(this).addClass('ui-option-header-row-' + (index + 1));
        });

        // redraw the buttons (now that the optionheader has the right
        // theme class)
        el.find('.ui-btn').each(function () {
            $(this).attr('data-theme', theme);

            // add a ui-btn-up class for the current theme; this is
            // a bit of a hack, as it doesn't remove the ui-btn-up-*
            // for the old swatch, but precedence means it works OK
            $(this).addClass('ui-btn-up-' + theme);
        });

        // show collapsed or not?
    }
});

// auto self-init widgets
$(document).bind("pagecreate", function (e) {
    $($.todons.optionheader.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .optionheader();
});

})(jQuery);
