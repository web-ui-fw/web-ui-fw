(function($, undefined) {

$.widget("mobile.switch", $.mobile.widget, {

  options: {
    checked: true,
    initSelector: ":jqmData(role='switch')"
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

    $.extend(this, {
      ui: ui,
      dstAttr: dstAttr
    });

    /* FIXME 0x45666291: St00pid hack number necessary because .outerHeight() doesn't seem to work during _create() */
    setTimeout(function(){$.mobile.todons.parseOptions(self, true);}, 0);

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
    var dst = checked ? 0 : this.ui.button.outerHeight();

    this.ui.background.css("height", this.ui.button.outerHeight() * 3);

    /* FIXME 0x45666291: Part of the ugly hack */
    if (unconditional)
      this.ui.button.removeAttr("style");

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
