/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Max Waterman <max.waterman@intel.com>
 */

/**
 * Todonsslider modifies the JQuery Mobile slider and is created in the same way.
 *
 * See the JQuery Mobile slider widget for more information :
 *     http://jquerymobile.com/demos/1.0a4.1/docs/forms/forms-slider.html
 *
 * The JQuery Mobile slider option:
 *     theme: specify the theme using the 'data-theme' attribute
 *
 * Options:
 *     theme: string; the theme to use if none is specified using the 'data-theme' attribute
 *            default: 'c'
 *     popupEnabled: boolean; controls whether the popup is displayed or not
 *                   specify if the popup is enabled using the 'data-popupEnabled' attribute
 *                   set from javascript using .todonsslider('option','popupEnabled',newValue)
 *
 * Events:
 *     changed: triggers when the value is changed (rather than when the handle is moved)
 *
 * Examples:
 *
 *     <a href="#" id="popupEnabler" data-role="button" data-inline="true">Enable popup</a>
 *     <a href="#" id="popupDisabler" data-role="button" data-inline="true">Disable popup</a>
 *     <div data-role="fieldcontain">
 *         <input id="mySlider" data-theme='a' data-popupenabled='false' type="range" name="slider" value="7" min="0" max="9" />
 *     </div>
 *     <div data-role="fieldcontain">
 *         <input id="mySlider2" type="range" name="slider" value="77" min="0" max="777" />
 *     </div>
 *
 *     // disable popup from javascript
 *     $('#mySlider').todonsslider('option','popupEnabled',false);
 *
 *     // from buttons
 *     $('#popupEnabler').bind('vclick', function() {
 *         $('#mySlider').todonsslider('option','popupEnabled',true);
 *     });
 *     $('#popupDisabler').bind('vclick', function() {
 *         $('#mySlider').todonsslider('option','popupEnabled',false);
 *     });
 */

(function ($, window, undefined) {
    $.widget("todons.todonsslider", $.mobile.widget, {
        options: {
            theme: 'c',
            popupEnabled: true,
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

            // set the popupEnabled according to the html attribute
            var popupEnabledAttr = inputElement.attr('data-popupenabled');
            if ( popupEnabledAttr !== undefined ) {
                self.options.popupEnabled = popupEnabledAttr==='true';
            }

            // get the actual slider added by jqm
            slider = inputElement.next('.ui-slider');

            // get the handle
            self.handle = slider.find('.ui-slider-handle');

            // remove the rounded corners from the slider and its children
            slider.removeClass('ui-btn-corner-all');
            slider.find('*').removeClass('ui-btn-corner-all');

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
            var needToChange = value !== this.options[key];
            switch (key) {
            case 'popupEnabled':
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
        if ($.data(window, "jqmSliderInitSelector") === undefined ) {
            $.data(window,"jqmSliderInitSelector", $.mobile.slider.prototype.options.initSelector);
            $.mobile.slider.prototype.options.initSelector = null;
        }
    });

    // initialise sliders with our own slider
    $(document).bind("pagecreate", function(e) {
        var jqmSliderInitSelector = $.data(window,"jqmSliderInitSelector");
        $(e.target).find(jqmSliderInitSelector).not('select').todonsslider();
        $(e.target).find(jqmSliderInitSelector).filter('select').slider();
    });

})(jQuery, this);
