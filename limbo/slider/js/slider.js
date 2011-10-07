/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Rijubrata Bhaumik <rijubrata.bhaumik@intel.com>
 */

/**
 * Displays a slider element
 *
 * Options:
 *
 */

(function ($, window, undefined) {
    $.widget("todons.todonsslider", $.mobile.widget, {
        options: {
        },

        value: function( newValue ) {
            if ( newValue === undefined ) {
                return $(this.element).val();
            } else {
                $(this.element).val( newValue );
            }
        },

        _create: function() {
            var inputElement = $(this.element);

            // apply jqm slider
            inputElement.slider();

            var container = inputElement.parent();
            var slider = inputElement.siblings(".ui-slider");
            var sliderHandle = slider.find(".ui-slider-handle");
            var text = sliderHandle.find(".ui-btn-text");

            container.addClass("ui-slider-container");

            // remove corner radii
            slider.removeClass("ui-btn-corner-all");
            sliderHandle.removeClass("ui-btn-corner-all");

            // add popup
            var popupText=$("<div class='ui-slider-popup-text'></div>");
            var popup=$("<div class='ui-slider-popup ui-shadow ui-slider-handle' data-theme='c'></div>");
            popup.append(popupText);
            sliderHandle.append(popup);

            popup.position({my: 'center top',
                            at: 'center bottom',
                            offset: '0 0',
                            of: container.find(".ui-slider-handle")});
            popup.hide();

            sliderHandle.bind( {
                "vmousedown": function( event ) {
                    popup.show();
                    text.hide();
                    sliderHandle.addClass("ui-slider-handle-pressed");

                    var val = inputElement.val();
                    popupText.html(val);
                },
                "vmousecancel vmouseup": function( event ) {
                    popup.hide();
                    sliderHandle.removeClass("ui-slider-handle-pressed");
                    var val = inputElement.val();
                    text.html(val);
                    text.show();
                }
            });

            // set initial value of handle text
            var val = inputElement.val();
            text.html(val);

            // bind handle text to updates
            inputElement.change( function(e) {
                var val = $(e.target).val();
                text.html(val);
                popupText.html(val);
            });

            // hide input element
            // not in nbeat but need it to get value
            inputElement.hide();
        },
    }); /* End of widget */

    // auto self-init widgets
    // stop jqm from initialising sliders
    $(document).bind("pagebeforecreate", function (e) {
        if ( $.data( window, "realInitSelector" ) === undefined ) {
            $.data( window,"realInitSelector", $.mobile.slider.prototype.options.initSelector );

            $.mobile.slider.prototype.options.initSelector = null;
        }
    });

    // initialise sliders with our own slider
    $(document).bind("pagecreate", function(e) {
        var realInitSelector = $.data(window,"realInitSelector");
        $(e.target).find(realInitSelector).todonsslider();
    });

})(jQuery, this);
