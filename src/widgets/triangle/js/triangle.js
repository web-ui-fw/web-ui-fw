(function($, undefined) {

$.widget( "todons.triangle", $.mobile.widget, {
  options: {
    offsetX: 50,
    initSelector: ":jqmData(role='triangle')"
  },

  _create: function() {
    var self = this,
        triangle = $("<div></div>", {class: "ui-triangle"}),
        thePage = this.element.closest(".ui-page");

    $.extend(this, {
      realized: false,
      triangle: triangle,
      offsetX: undefined
    });

    this.element.css("position", "relative").append(triangle);

    if (thePage.is(":visible"))
      this._realize();
    else
      thePage.bind("pageshow", function(e) { self._realize() ; });

    $.mobile.todons.parseOptions(this, true);
  },

  _realize: function() {
    this.triangle.css("border-left-width",   this.element.height());
    this.triangle.css("border-right-width",  this.element.height());
    this.triangle.css("border-bottom-width", this.element.height());
    this.realized = true;
    if (this.offsetX != undefined)
      this._setOffsetX(this.offsetX, true);
  },

  _setOffsetX: function(value, unconditional) {
    if (value != this.offsetX || unconditional) {
      this.triangle.css("left", value - this.element.height());
      this.offsetX = value;
    }
  },

  _setOption: function(key, value, unconditional) {
    if (undefined === unconditional)
      unconditional = false;
    if (key === "offsetX")
      this._setOffsetX(value, unconditional);
  },
});

$(document).bind("pagecreate create", function(e) {
  $($.todons.triangle.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .triangle();
});

})(jQuery);
