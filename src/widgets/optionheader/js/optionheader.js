(function($, undefined) {

$.widget("todons.optionheader", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(role='optionheader')",
        showIndicator: true,
        theme: 'c',
        collapsed: false,
        expandable: true,
        duration: 0.5
    },

    _create: function () {
        var el = $(this.element),
            arrow = $('<div class="ui-option-header-triangle-arrow"></div>'),
            self = this,
            options,
            numRows,
            rowsClass,
            theme,
            themeClass;

        // parse data-options
        options = el.data('options');
        $.extend(this.options, options);

        this.isCollapsed = this.options.collapsed;
        this.expandedHeight = null;

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
        // optionheader div to show the header has hidden content
        if (el.children().length > 0 && this.options.showIndicator) {
            this.element.before(arrow);
        }

        // if expandable, bind clicks to the toggle() method
        if (this.options.expandable) {
            var self = this;

            el.bind('vclick', function () {
                self.toggle();
            });

            arrow.bind('vclick', function () {
                self.toggle();
            });
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

        // bind to the pageshow on the page containing
        // the optionheader to get the element's dimensions
        // and to set its initial collapse state
        this.element.closest(':jqmData(role="page")').bind('pageshow show', function () {
            self.expandedHeight = self.element.height();

            if (self.isCollapsed) {
                self.collapse({duration: 0});
            }
        });
    },

    _setHeight: function (height, isCollapsed, options) {
        var self = this,
            commonCallback,
            callback;

        options = options || {};

        // set default duration if not specified
        if (typeof options.duration == 'undefined') {
            options.duration = this.options.duration;
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
        if (options.duration > 0) {
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
                             'height ' + options.duration + 's ease-out');
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
     * {Integer} options.duration Duration of the expand/collapse;
     * defaults to this.options.duration
     * {Function} options.callback Function to call after toggle completes
     */
    toggle: function (options) {
        if (this.isCollapsed) {
            this.expand();
        }
        else {
            this.collapse();
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
