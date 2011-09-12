(function( $, undefined ) {

$.widget( "mobile.colortitle", $.mobile.widget, {
  options: {
    color: "#1a8039",
    initSelector: ":jqmData(role='colortitle')"
  },

  _create: function() {
    var self = this,

        o = this.options,

        clrtitle = $.mobile.loadPrototype("colortitle")
          .appendTo(this.element);

      $.extend( this, {
        clrtitle: clrtitle,
        colour: o.color
      });

      this.refresh();
  },

  refresh: function() {
    this.clrtitle.find("#colortitle-string").text(this.colour);
    this.element.attr("data-color", this.colour);
    this.element.triggerHandler('colorchanged', this.colour);
  },

  setColor: function(clr) {
    if (clr.match(/#[0-9A-Fa-f]{6}/) && this.element.attr("data-color") != clr) {
      this.colour = clr;
      this.refresh();
    }
  }
});

$(document).bind("pagecreate create", function(e) {
  $($.mobile.colortitle.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .colortitle();
});

})(jQuery);
