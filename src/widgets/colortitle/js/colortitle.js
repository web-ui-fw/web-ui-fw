(function( $, undefined ) {

$.widget( "mobile.colortitle", $.mobile.widget, {
  options: {
    color: "#1a8039",
    initSelector: ":jqmData(role='colortitle')"
  },

  _create: function() {
    var self = this,
        clrtitle = $.mobile.todons.loadPrototype("colortitle").find("#colortitle")
          .appendTo(this.element);

      $.extend( this, {
        clrtitle: clrtitle
      });

    $.mobile.todons.parseOptions(this, true);
  },

  _setOption: function(key, value, unconditional) {
    if (undefined === unconditional)
      unconditional = false;

    if (key === "color")
      this._setColor(value, unconditional);
  },

  _setColor: function(clr, unconditional) {
    if ((clr.match(/#[0-9A-Fa-f]{6}/) && this.element.attr("data-color") != clr) || unconditional) {
      this.clrtitle.find("#colortitle-string").text(clr);
      this.element.attr("data-color", clr);
      this.element.triggerHandler('colorchanged', clr);
    }
  }
});

$(document).bind("pagecreate create", function(e) {
  $($.mobile.colortitle.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .colortitle();
});

})(jQuery);
