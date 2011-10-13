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
            popupEnabled: true
        },

        popup: null,
		handle: null,
		handleText: null,

        _create: function() {
            this.currentValue = null;
            this.popupVisible = false;

            var self = this,
                inputElement = $(this.element),
                themeClass,
                slider,
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
            self.handle = slider.find('.ui-slider-handle');

            // remove the rounded corners
            slider.removeClass('ui-btn-corner-all');

            // add a popup element (hidden initially)
            slider.before(self.popup);
            self.popup.hide();

            // get the element where value can be displayed
            self.handleText = slider.find('.ui-btn-text');

            // set initial value
            self.updateSlider();

            // bind to changes in the slider's value to update handle text
            this.element.bind('change', function () {
			    self.updateSlider();
			});

            // bind clicks on the handle to show the popup
            self.handle.bind('vmousedown', function () {
                self.showPopup();
            });

            // watch events on the document to turn off the slider popup
            slider.add(document).bind('vmouseup', function () {
                self.hidePopup();
            });
        },

		// position the popup
		positionPopup: function () {
			this.popup.position({my: 'center bottom',
							at: 'center top',
							offset: '0 -5px',
							of: this.handle});
		},

		// show value on the handle and in popup
		updateSlider: function () {
			this.positionPopup();

			// remove the title attribute from the handle (which is
			// responsible for the annoying tooltip); NB we have
			// to do it here as the jqm slider sets it every time
			// the slider's value changes :(
			this.handle.removeAttr('title');

			var newValue = this.element.val();

			if (newValue !== this.currentValue) {
				this.currentValue = newValue;
				this.handleText.html(newValue);
				this.popup.html(newValue);
				this.element.trigger('update', newValue);
			}
		},

        // show the popup
        showPopup: function () {
            var needToShow = (this.options.popupEnabled && !this.popupVisible);
            if (needToShow) {
                this.handleText.hide();
                this.popup.show();
                this.popupVisible = true;
            }
        },

        // hide the popup
        hidePopup: function () {
			var needToHide = (this.options.popupEnabled && this.popupVisible);
            if (needToHide) {
                this.handleText.show();
                this.popup.hide();
                this.popupVisible = false;
            }
        },

        _setOption: function(key, value) {
            switch (key) {
            case 'popupEnabled':
				var needToChange = value !== this.options.popupEnabled;
                if (needToChange) {
					this.options.popupEnabled = value;
					if (this.options.popupEnabled) {
						this.updateSlider();
					} else {
						this.hidePopup();
					}
				}
				break;
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
