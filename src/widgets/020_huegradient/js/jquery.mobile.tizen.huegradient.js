(function($, undefined) {

$.widget("tizen.huegradient", $.tizen.widgetex, {
    _create: function() {
        this.element.addClass("tizen-huegradient");
    },

    // Crutches for IE: it is incapable of multi-stop gradients, so add multiple divs inside the given div, each with a
    // two-point gradient
    _IEGradient: function(div, disabled) {
        var rainbow = disabled
            ? ["#363636", "#ededed", "#b6b6b6", "#c9c9c9", "#121212", "#494949", "#363636"]
            : ["#ff0000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#ff00ff", "#ff0000"];
        for (var Nix = 0 ; Nix < 6 ; Nix++) {
            $("<div></div>")
                .css({
                    position: "absolute",
                    width: (100 / 6) + "%",
                    height: "100%",
                    left: (Nix * 100 / 6) + "%",
                    top: "0px",
                    filter: "progid:DXImageTransform.Microsoft.gradient (startColorstr='" + rainbow[Nix] + "', endColorstr='" + rainbow[Nix + 1] + "', GradientType = 1)"
                })
                .appendTo(div);
        }
    },

    _setDisabled: function(value) {
        $.Widget.prototype._setOption.call(this, "disabled", value);
        if ($.mobile.browser.ie)
            this._IEGradient(this.element.empty(), value);
    }
});

})(jQuery);
