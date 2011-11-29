// This code runs before we unleash jQuery Mobile onto the document

$(document).bind("mobileinit", function() {
    // Prevent jqm from turning #input-switch into a nice-looking checkbox.
    // After all, we want to turn it into a nice-looking switch.
    $.mobile.checkboxradio.prototype.options.initSelector =
        ":not(:not(" + $.mobile.checkboxradio.prototype.options.initSelector + "))[id!='input-switch']";
});
