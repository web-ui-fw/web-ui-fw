(function($, undefined) {

$.widget( "todons.triangle", $.mobile.widget, {
  options: {
    class: "",
    offset: 50,
    color: undefined,
    location: "top",
    initSelector: ":jqmData(role='triangle')"
  },

  _create: function() {
    var self = this,
        triangle = $("<div></div>", {class: "ui-triangle"}),
        thePage = this.element.closest(".ui-page");

    $.extend(this, {
      realized: false,
      triangle: triangle,
    });

    this.element.css("position", "relative").append(triangle);

    if (thePage.is(":visible"))
      this._realize();
    else
      thePage.bind("pageshow", function(e) { self._realize() ; });

    $.mobile.todons.parseOptions(this, true);
  },

  /* The widget needs to be realized for this function */
  _setBorders: function() {
    if (this.options.location === "top") {
      this.triangle.css("border-left-width",   this.element.height());
      this.triangle.css("border-top-width",    0);
      this.triangle.css("border-right-width",  this.element.height());
      this.triangle.css("border-bottom-width", this.element.height());
      this.triangle.css("border-left-color",   "rgba(0, 0, 0, 0)");
      this.triangle.css("border-right-color",  "rgba(0, 0, 0, 0)");
    }
    else
    if (this.options.location === "bottom") {
      this.triangle.css("border-left-width",   this.element.height());
      this.triangle.css("border-top-width",    this.element.height());
      this.triangle.css("border-right-width",  this.element.height());
      this.triangle.css("border-bottom-width", 0);
      this.triangle.css("border-left-color",   "rgba(0, 0, 0, 0)");
      this.triangle.css("border-right-color",  "rgba(0, 0, 0, 0)");
    }
  },

  _realize: function() {
    this._setBorders();
    this.triangle.css("margin-left", -this.element.height());
    this._setOffset(this.options.offset, true);
    this.realized = true;
  },

  _setOffset: function(value, unconditional) {
    if (value != this.options.offset || unconditional) {
      this.triangle.css("left", value);
      this.options.offset = value;
    }
  },

  _setClass: function(value, unconditional) {
    if (value != this.options.class || unconditional) {
      this.triangle.addClass(value);
      this.options.class = value;
    }
  },

  _setColor: function(value, unconditional) {
    if (value != this.options.color || unconditional)
      if (value != undefined)
        this.triangle.css("border-bottom-color", value);
  },

  _setLocation: function(value, unconditional) {
    if (value != this.options.location || unconditional) {
      this.options.location = value;
      if (this.realized)
        this._setBorders();
    }
  },

  _setOption: function(key, value, unconditional) {
    if (undefined === unconditional)
      unconditional = false;
    if (key === "offset")
      this._setOffset(value, unconditional);
    else
    if (key === "class")
      this._setClass(value, unconditional);
    else
    if (key === "color")
      this._setColor(value, unconditional);
    else
    if (key === "location")
      this._setLocation(value, unconditional);
  },
});

$(document).bind("pagecreate create", function(e) {
  $($.todons.triangle.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .triangle();
});

})(jQuery);
