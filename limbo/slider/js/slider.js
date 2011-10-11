/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors:
 */

(function ($, window, undefined) {
    $.widget("todons.todonsslider", $.mobile.widget, {
        _create: function() {
            var self = this;
            var inputElement = $(this.element);

            // apply jqm slider
            inputElement.slider();

            // hide the slider input element proper
            inputElement.hide();

            // get the element where value can be displayed
            var handleText = inputElement.next('.ui-slider').find('.ui-btn-text');

            // show value in that element
            var updateHandleText = function () {
                handleText.html(self.element.val());
            };

            updateHandleText();

            // bind to changes in the slider's value to update handle text
            this.element.bind('change', updateHandleText);
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
