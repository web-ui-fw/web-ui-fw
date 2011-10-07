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
 * A slider does have a progress value, and can be found from getValue()
 * You can set the value using value()
 * The external process is supposed to call the slider
 * e.g. $('#myslider').slider('value', 19)
 *
 * Options:
 *
 *     value    : starting value, default is 0
 *     max      : maximum value, default is 100
 *     duration : Integer; number of milli seconds the slider takes to animate
 *                from 0 to max.
 *
 */

(function ($, window, undefined) {
    // auto self-init widgets
    $(document).bind("pagecreate", function (e) {
        var page = e.target
        var slider = $(page).find(".ui-slider");
        var sliderHandle = $(page).find(".ui-slider-handle");
        var text = sliderHandle.find(".ui-btn-text");
        var inputElement = $(page).find(".ui-slider-input");

        // remove corner radii
        slider.removeClass("ui-btn-corner-all");
        sliderHandle.removeClass("ui-btn-corner-all");

        // add popup
        popupText=$("<div class='ui-slider-popup-text'></div>");
        popup=$("<div class='ui-slider-popup ui-shadow ui-slider-handle' data-theme='c'></div>");
        popup.append(popupText);
        sliderHandle.append(popup);
        popup.hide();
        sliderHandle.bind( {
            "vmousedown": function( event ) {
                popup.show();
                text.hide();
                sliderHandle.addClass("ui-slider-popup");

                var val = inputElement.val();
                popupText.html(val);
            },
            "vmousecancel vmouseup": function( event ) {
                popup.hide();
                sliderHandle.removeClass("ui-slider-popup");
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

    });

})(jQuery, this);
