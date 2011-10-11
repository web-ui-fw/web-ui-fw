/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Elliot Smith <elliot.smith@intel.com>
 */

/**
 * optionheader provides a collapsible toolbar for buttons and
 * segmented controls directly under the title bar. It
 * wraps a jQuery Mobile grid in a collapsible container; clicking
 * on the container, or on one of the buttons inside the container,
 * will collapse it.
 *
 * To add an option header to a page, mark up the header with a
 * data-role="optionheader" attribute, as shown in this example:
 *
 * <div data-role="header">
 *     <h1>Option header - 3 buttons example</h1>
 *     <div data-role="optionheader">
 *        <div class="ui-grid-b">
 *             <div class="ui-block-a"><a data-role="button">Previous</a></div>
 *             <div class="ui-block-b"><a data-role="button">Cancel</a></div>
 *             <div class="ui-block-c"><a data-role="button">Next</a></div>
 *        </div>
 *     </div>
 * </div>
 *
 * Alternatively, use $('...').optionheader() to apply programmatically.
 *
 * The grid inside the optionheader should be marked up as for
 * a standard jQuery Mobile grid. (The widget has been tested with one
 * or two rows of 2-4 columns each.)
 *
 * Note that if you use this with fixed headers, you may find that
 * expanding the option header increases the page size so that scrollbars
 * appear (jQuery Mobile's own collapsible content areas cause the
 * same issue). You can alleviate this somewhat by calling the show() method
 * on the page toolbars each time the size of the header changes.
 *
 * The widget is configurable via a data-options attribute on the same
 * div as the data-role="optionheader" attribute, e.g.
 *
 * <div data-role="header">
 *     <h1>Option header - configured</h1>
 *     <div data-role="optionheader" data-options='{"collapsed":true, "duration":1.5}'>
 *        <div class="ui-grid-b">
 *             <div class="ui-block-a"><a data-role="button">Previous</a></div>
 *             <div class="ui-block-b"><a data-role="button">Cancel</a></div>
 *             <div class="ui-block-c"><a data-role="button">Next</a></div>
 *        </div>
 *     </div>
 * </div>
 *
 * Options can also be set with $(...).optionheader('option', 'name', value).
 * However, if you do this, you'll need to call $(...).optionheader('refresh')
 * afterwards for the new values to take effect (note that optionheader()
 * can be applied multiple times to an element without side effects).
 *
 * See below for the available options.
 *
 * Theme: by default, gets a 'b' swatch; override with data-theme="X"
 * as per usual
 *
 * Options (can be set with a data-options attribute):
 *
 *   {Boolean} [showIndicator=true] Set to true (the default) to show
 *   the upward-pointing arrow indicator on top of the title bar.
 *   {Boolean} [collapseOnInit=false] Sets the appearance when the option
 *   header is first displayed; defaults to false (i.e. show the header
 *   expanded on first draw). NB setting this option later has no
 *   effect: use collapse() to collapse a widget which is already
 *   drawn.
 *   {Boolean} [expandable=true] Sets whether the header will expand
 *   in response to clicks; default = true.
 *   {Float} [duration=0.25] Duration of the expand/collapse animation.
 *
 * Methods (see below for docs):
 *
 *   toggle(options)
 *   expand(options)
 *   collapse(options)
 *
 * Events:
 *
 *   expand: Triggered when the option header is expanded
 *   collapse: Triggered when the option header is collapsed
 *
 */

(function($, undefined) {

$.widget("todons.optionheader", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(role='optionheader')",
        showIndicator: true,
        theme: 'b',
        startCollapsed: false,
        expandable: true,
        duration: 0.25
    },

    _create: function () {
        var options,
            theme,
            self = this;

        // parse data-options
        options = this.element.data('options');
        $.extend(this.options, options);

        this.isCollapsed = this.options.collapseOnInit;
        this.expandedHeight = null;

        // parse data-theme and reset options.theme if it's present
        theme = this.element.data('theme') || this.options.theme;
        this.options.theme = theme;

        // bind to the pageshow on the page containing
        // the optionheader to get the element's dimensions
        // and to set its initial collapse state
        this.element.closest(':jqmData(role="page")').bind('pageshow show', function () {
            self.expandedHeight = self.element.height();

            if (self.isCollapsed) {
                self.collapse({duration: 0});
            }
        });

        // set up the click handler; it's done here so it can
        // easily be removed, as there should only be one instance
        // of the handler function for each class instance
        this.clickHandler = function () {
            self.toggle();
        };

        this.refresh();
    },

    // Draw the option header, according to current options
    refresh: function () {
        var el = this.element,
            arrow = $('<div class="ui-option-header-triangle-arrow"></div>'),
            optionHeaderClass = 'ui-option-header',
            self = this,
            gridRowSelector = '.ui-grid-a,.ui-grid-b,.ui-grid-c,.ui-grid-d,.ui-grid-e',
            theme = this.options.theme,
            numRows,
            rowsClass,
            themeClass,
            elBgColor;

        // count ui-grid-* elements to get number of rows
        numRows = el.find(gridRowSelector).length;

        // ...at least one row
        numRows = Math.max(1, numRows);

        // add classes to outer div:
        //   ui-option-header-N-row, where N = options.rows
        //   ui-bar-X, where X = options.theme (defaults to 'c')
        //   ui-option-header
        rowsClass = 'ui-option-header-' + numRows + '-row';
        themeClass = 'ui-bar-' + this.options.theme;

        el.removeClass(rowsClass).addClass(rowsClass);
        el.removeClass(themeClass).addClass(themeClass);
        el.removeClass(optionHeaderClass).addClass(optionHeaderClass);

        // remove any arrow currently visible
        el.prev('.ui-option-header-triangle-arrow').remove();

        // if there are elements inside the option header
        // and this.options.showIndicator,
        // insert a triangle arrow as the first element inside the
        // optionheader div to show the header has hidden content
        if (this.options.showIndicator) {
            // set the border-color for the triangle to the
            // background-color of the outer div
            elBgColor = el.css('background-color');

            if (elBgColor) {
                arrow.css('border-color',
                          'transparent transparent ' + elBgColor + ' transparent');
            }

            el.before(arrow);
        }

        // if expandable, bind clicks to the toggle() method
        if (this.options.expandable) {
            el.bind('vclick', this.clickHandler);
            arrow.bind('vclick', this.clickHandler);
        }
        else {
            el.unbind('vclick', this.clickHandler);
            arrow.unbind('vclick', this.clickHandler);
        }

        // for each ui-grid-a element, add a class ui-option-header-row-M
        // to it, where M is the xpath position() of the div
        el.find(gridRowSelector).each(function (index) {
            var klass = 'ui-option-header-row-' + (index + 1);
            $(this).removeClass(klass).addClass(klass);
        });

        // redraw the buttons (now that the optionheader has the right
        // swatch)
        el.find('.ui-btn').each(function () {
            $(this).attr('data-theme', theme);

            // add a ui-btn-up class for the current theme; this is
            // a bit of a hack, as it doesn't remove the ui-btn-up-*
            // for the old swatch, but precedence means it works OK
            $(this).removeClass('ui-btn-up-' + theme)
                   .addClass('ui-btn-up-' + theme);
        });
    },

    _setHeight: function (height, isCollapsed, options) {
        var self = this,
            duration,
            commonCallback,
            callback;

        options = options || {};

        // set default duration if not specified
        duration = options.duration;
        if (typeof duration == 'undefined') {
            duration = this.options.duration;
        }

        // the callback to always call after expanding or collapsing
        commonCallback = function () {
            self.isCollapsed = isCollapsed;

            if (isCollapsed) {
                self.element.trigger('collapse');
            }
            else {
                self.element.trigger('expand');
            }
        };

        // combine commonCallback with any user-specified callback
        if (options.callback) {
            callback = function () {
                options.callback();
                commonCallback();
            };
        }
        else {
            callback = function () {
                commonCallback();
            }
        }

        // apply the animation
        if (duration > 0 && $.support.cssTransitions) {
            // add a handler to invoke a callback when the animation is done
            var elt = this.element.get(0);

            var handler = {
                handleEvent: function (e) {
                    elt.removeEventListener('webkitTransitionEnd', this);
                    callback();
                }
            };

            elt.addEventListener('webkitTransitionEnd', handler, false);

            // apply the transition
            this.element.css('-webkit-transition',
                             'height ' + duration + 's ease-out');
            this.element.css('height', height);
        }
        // make sure the callback gets called even when there's no
        // animation
        else {
            this.element.css('height', height);
            callback();
        }
    },

    /**
     * Toggle the expanded/collapsed state of the widget.
     * {Object} [options] Configuration for the expand/collapse
     * {Integer} [options.duration] Duration of the expand/collapse;
     * defaults to this.options.duration
     * {Function} options.callback Function to call after toggle completes
     */
    toggle: function (options) {
        if (this.isCollapsed) {
            this.expand(options);
        }
        else {
            this.collapse(options);
        }
    },

    /**
     * Takes the same options as toggle()
     */
    collapse: function (options) {
        this._setHeight('5px', true, options);
    },

    /**
     * Takes the same options as toggle()
     */
    expand: function (options) {
        this._setHeight(this.expandedHeight, false, options);
    }
});

// auto self-init widgets
$(document).bind("pagecreate", function (e) {
    $($.todons.optionheader.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .optionheader();
});

})(jQuery);
