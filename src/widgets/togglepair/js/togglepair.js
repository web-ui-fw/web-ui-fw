(function($, undefined) {
    $.widget("tizen.togglepair", $.tizen.widgetex, {
        options: {
            checked: false,
        },

        _htmlProto: {
            ui: {
                outer: "#outer",
                l: {
                    btn: "#btn-l",
                    lbl: "#label-l"
                },
                r: {
                    btn: "#btn-r",
                    lbl: "#label-r"
                }
            }
        },

        _create: function() {
            var self = this,
                children = this.element.children(),
                buttons = this._ui.outer.find("a");

            if (children.length > 1) {
                this._ui.l.lbl.text($(children[0]).text());
                this._ui.r.lbl.text($(children[1]).text());
            }

            this.element
                .addClass("ui-togglepair-hidden")
                .after(this._ui.outer);

            buttons
                .buttonMarkup({theme: $.mobile.getInheritedTheme(this.element, "c")})
                .bind("vclick", function(e) {
                    self._setChecked(this === self._ui.r.btn[0]);
                    e.preventDefault();
                })
                .bind("vmousecancel vmouseup vmouseout vmouseover focus blur", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                })
                .bind("vmousedown", function(e) {
                    var side = $(e.target).jqmData("togglepair-value"),
                        theme = $.mobile.getInheritedTheme(self.element, "c");

                    if (( self.options.checked && side === "l") ||
                        (!self.options.checked && side === "r")) {
                        self._ui[side].btn
                            .removeClass("ui-btn-up-" + theme)
                            .addClass("ui-btn-down-" + theme);
                    }
                })
                .bind("vmouseover focus", function(e) {
                    var side = $(e.target).jqmData("togglepair-value"),
                        theme = $.mobile.getInheritedTheme(self.element, "c");
                    self._ui[side].btn.addClass("ui-btn-hover-" + theme);
                })
                .bind("vmouseout blur", function(e) {
                    var side = $(e.target).jqmData("togglepair-value"),
                        theme = $.mobile.getInheritedTheme(self.element, "c");
                    self._ui[side].btn.removeClass("ui-btn-hover-" + theme);
                })
                .bind("vmouseout vmousecancel", function(e) {
                    var side = $(e.target).jqmData("togglepair-value"),
                        theme = $.mobile.getInheritedTheme(self.element, "c");

                    if (( self.options.checked && side === "l") ||
                        (!self.options.checked && side === "r")) {
                        self._ui[side].btn
                            .removeClass("ui-btn-down-" + theme)
                            .addClass("ui-btn-up-" + theme);
                    }
                });

            this._ui.l.btn
                .add(this._ui.l.btn.find("*"))
                    .jqmData("togglepair-value", "l");

            this._ui.r.btn
                .add(this._ui.r.btn.find("*"))
                    .jqmData("togglepair-value", "r");

            this._ui.outer.controlgroup({excludeInvisible: false});
        },

        _setChecked: function(value) {
            var dSide = "l", uSide = "r",
                theme = $.mobile.getInheritedTheme(this.element, "c");
            if (value) {
                dSide = "r";
                uSide = "l";
            }

            this._ui[dSide].btn
                .removeClass("ui-btn-up-" + theme)
                .addClass("ui-btn-down-" + theme + " ui-btn-active");
            this._ui[uSide].btn
                .removeClass("ui-btn-down-" + theme + " ui-btn-active")
                .addClass("ui-btn-up-" + theme);

            this.options.checked = value;
            this.element.attr("data-" + ($.mobile.ns || "") + "checked", value);
        }
    });

    if ($.fn.slider && $.mobile.slider) {
        var origSlider = $.fn.slider;

        $.fn.slider = function() {
            $.each(this, function(key, value) {
                if (this.tagName === "SELECT") {
                    $(this).togglepair(arguments);
                }
                else {
                    origSlider.apply($(this), arguments);
                }
            });
        };
    }
})(jQuery);
