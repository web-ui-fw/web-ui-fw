/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors:
 */

/**
 * Because the slider 'change' event is so rubbish (it gets triggered
 * whenever the slider handle moves, not just when the slider
 * value changes), intercept it to provide a new 'update' event,
 * which only fires when the value of the slider is updated.
 */
(function ($, window, undefined) {
    $.widget("todons.todonsslider", $.mobile.widget, {
        _create: function() {
            var inputElement = $(this.element);
            this.currentValue = null;
            var self = this;

            // apply jqm slider
            inputElement.slider();

            // hide the slider input element proper
            inputElement.hide();

            // get the element where value can be displayed
            var handleText = inputElement.next('.ui-slider').find('.ui-btn-text');

            // show value in that element
            var updateSlider = function (e) {
                var newValue = self.element.val();

                if (newValue !== self.currentValue) {
                    self.currentValue = newValue;
                    handleText.html(newValue);
                    self.element.trigger('update', newValue);
                }

                return false;
            };

            // set initial value
            updateSlider();

            // bind to changes in the slider's value to update handle text
            this.element.bind('change', updateSlider);
        },
    });

    // stop jqm from initialising sliders
    $(document).bind("pagebeforecreate", function (e) {
        if ($.data(window, "realInitSelector") === undefined ) {
            $.data(window,"realInitSelector", $.mobile.slider.prototype.options.initSelector);
            $.mobile.slider.prototype.options.initSelector = null;
        }
    });

    // initialise sliders with our own slider
    $(document).bind("pagecreate", function(e) {
        var realInitSelector = $.data(window,"realInitSelector");
        $(e.target).find(realInitSelector).todonsslider();
    });

})(jQuery, this);
