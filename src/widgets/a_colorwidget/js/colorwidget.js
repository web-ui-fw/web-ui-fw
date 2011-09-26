(function($, undefined) {

$.widget("mobile.colorwidget", $.mobile.widget, {
  options: {
    color: "#ff0972"
  },

  _create: function() {
    $.extend (this, {
      isInput: this.element.is("input")
    });

    /* "value", if present, takes precedence over "data-color" */
    if (this.isInput)
      if (this.element.attr("value").match(/#[0-9A-Fa-f]{6}/))
        this.element.attr("data-color", this.element.attr("value"));

    $.mobile.todons.parseOptions(this, true);
  },

  _setOption: function(key, value, unconditional) {
    if (undefined === unconditional)
      unconditional = false;
    if (key === "color")
      this._setColor(value, unconditional);
  },

  _setColor: function(value, unconditional) {
    if (value.match(/#[0-9A-Fa-f]{6}/) && (value != this.options.color || unconditional)) {
      this.options.color = value;
      this.element.attr("data-color", value);
      if (this.isInput)
        this.element.attr("value", value);
      this.element.triggerHandler("colorchanged", value);
      return true;
    }
    return false;
  },
});

})(jQuery);
