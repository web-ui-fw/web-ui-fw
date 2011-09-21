(function($, undefined) {

$.widget("mobile.switch", $.mobile.widget, {

  options: {
    checked: true,
    initSelector: ":jqmData(role='switch')"
  },

  /* Ugly hack used when .outerHeight() doesn't work properly */
  _initialHeight: function(obj) {
    return obj.outerHeight(true)
      + parseInt(obj.css("padding-top"))
      + parseInt(obj.css("padding-bottom"))
      + parseInt(obj.css("border-bottom-width"))
      + parseInt(obj.css("border-top-width"));
  },

  _create: function() {
    var self = this,
        dstAttr = this.element.is("input") ? "checked" : "data-checked",
        myProto = $.mobile.todons.loadPrototype("switch").find("#switch")
          .appendTo(this.element),
        ui = {
          background: myProto,
          button: myProto.find("#switch-button").buttonMarkup({inline: true, corners: true})
        };

    ui.background.css("height", this._initialHeight(ui.button) * 3);

    $.extend(this, {
      ui: ui,
      dstAttr: dstAttr
    });

    $.mobile.todons.parseOptions(this, true);

    ui.button.bind("vclick", function(e) {
      self._toggle();
      e.stopPropagation();
    });

    ui.background.bind("vclick", function(e) {
      self._toggle();
      e.stopPropagation();
    });
  },

  _toggle: function() {
    this._setChecked(!(parseInt(this.ui.button.css("top")) === 0));
  },

  _setOption: function(key, value, unconditional) {
    if (undefined === unconditional)
      unconditional = false;
    if (key === "checked")
      this._setChecked(value, unconditional);
  },

  _setChecked: function(checked, unconditional) {
    var dst = checked       ? 0                                   : 
              unconditional ? this._initialHeight(this.ui.button) : 
                this.ui.button.outerHeight();

    if (dst != parseInt(this.ui.button.css("top")) || unconditional) {
      if (unconditional)
        this.ui.button.css("top", dst + "px");
      else
        this.ui.button.animate({"top" : dst + "px"}, "fast");

      if (checked)
        this.ui.background.addClass("ui-btn-active");
      else
        this.ui.background.removeClass("ui-btn-active");

      this.options.checked = checked;
      this.element.attr(this.dstAttr, checked ? "true" : "false");
      this.element.triggerHandler("changed", checked);
    }
  },
});

$(document).bind("pagecreate create", function(e) {
  $($.mobile.switch.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .switch();
});

})(jQuery);
