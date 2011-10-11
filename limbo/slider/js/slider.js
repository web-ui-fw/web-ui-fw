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
        options: {
            theme: 'c',
            popupEnabled: true,
        },

        popup: null,

        _create: function() {
            this.currentValue = null;
            this.popupVisible = false;

            var self = this,
                inputElement = $(this.element),
                themeClass,
                slider,
                handle,
                handleText,
                showPopup,
                hidePopup,
                positionPopup,
                updateSlider;

            // apply jqm slider
            inputElement.slider();

            // hide the slider input element proper
            inputElement.hide();

            // theming; override default with the slider's theme if present
            this.options.theme = this.element.data('theme') || this.options.theme;
            themeClass = 'ui-body-' + this.options.theme;
            self.popup = $('<div class="' + themeClass + ' ui-slider-popup ui-shadow"></div>');

            // get the actual slider added by jqm
            slider = inputElement.next('.ui-slider');

            // get the handle
            handle = slider.find('.ui-slider-handle');

            // remove the rounded corners
            slider.removeClass('ui-btn-corner-all');

            // add a popup element (hidden initially)
            slider.before(self.popup);
            self.popup.hide();

            // get the element where value can be displayed
            handleText = slider.find('.ui-btn-text');

            // position the popup
            positionPopup = function () {
                self.popup.position({my: 'center bottom',
                                at: 'center top',
                                offset: '0 -5px',
                                of: handle});
            };

            // show value on the handle and in popup
            updateSlider = function () {
                positionPopup();

                // remove the title attribute from the handle (which is
                // responsible for the annoying tooltip); NB we have
                // to do it here as the jqm slider sets it every time
                // the slider's value changes :(
                handle.removeAttr('title');

                var newValue = self.element.val();

                if (newValue !== self.currentValue) {
                    self.currentValue = newValue;
                    handleText.html(newValue);
                    self.popup.html(newValue);
                    self.element.trigger('update', newValue);
                }
            };

            // set initial value
            updateSlider();

            // bind to changes in the slider's value to update handle text
            this.element.bind('change', updateSlider);

            // bind clicks on the handle to show the popup
            handle.bind('vmousedown', self.showPopup(this));

            // watch events on the document to turn off the slider popup
            slider.add(document).bind('vmouseup', self.hidePopup);
        },

        // show the popup
        showPopup: function (self) {
            if (self.options.popupEnabled && !self.popupVisible) {
                self.popup.show();
                self.popupVisible = true;
            }
        },

        // hide the popup
        hidePopup: function () {
            if (this.options.popupEnabled && this.popupVisible) {
                this.popup.hide();
                this.popupVisible = false;
            }
        },

        _setOption: function(key, value) {
            console.log("MAXMAXMAX/_setOption/"+key+","+value);
            if ( key === 'popupEnabled' ) {
                this.options.popupEnabled = value;
                if (this.options.popupEnabled) {
                    this.showPopup();
                } else {
                    this.hidePopup();
                }
            }
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
