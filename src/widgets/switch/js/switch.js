/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Gabriel Schulhof <gabriel.schulhof@intel.com>
 */

/*
 * Displays a simple two-state switch.
 *
 * To apply, add the attribute data-role="switch" to a <div>
 * element inside a page. Alternatively, call switch() 
 * on an element, like this :
 *
 *     $("#myswitch").switch();
 * where the html might be :
 *     <div id="myswitch"></div>
 *
 * Options:
 *     checked: Boolean; the state of the switch
 *     Default: true (up)
 *
 * Events:
 *     changed: Emitted when the switch is changed
 */

(function($, undefined) {

$.widget("todons.switch", $.mobile.widget, {

  options: {
    checked: true,
    initSelector: ":jqmData(role='switch')"
  },

  _create: function() {
    var self = this,
        dstAttr = this.element.is("input") ? "checked" : "data-checked",
        ui = {
          outer:            "#switch",
          normalBackground: "#switch-inner-normal",
          activeBackground: "#switch-inner-active",
          tButton:          "#switch-button-t",
          fButton:          "#switch-button-f",
          realButton:       "#switch-button-outside-real",
          refButton:        "#switch-button-outside-ref"
        };

    ui = $.mobile.todons.loadPrototype("switch", ui);
    this.element.append(ui.outer);
    ui.outer.find("a").buttonMarkup({inline: true, corners: true});

    $.extend(this, {
      realized: false,
      ui: ui,
      dstAttr: dstAttr
    });

    $.mobile.todons.parseOptions(self, true);

    this.element.closest(".ui-page").bind("pageshow", function() { self._realize(); });

    ui.realButton.bind("vclick", function(e) {
      self._toggle();
      e.stopPropagation();
    });

    ui.normalBackground.bind("vclick", function(e) {
      self._toggle();
      e.stopPropagation();
    });
  },

  _toggle: function() {
    this._setChecked(!(this.options.checked));
  },

  _setOption: function(key, value, unconditional) {
    if (undefined === unconditional)
      unconditional = false;
    if (key === "checked")
      this._setChecked(value, unconditional);
  },

  _realize: function() {
    this.ui.realButton
      .position({
        my: "center center",
        at: "center center",
        of: this.ui[(this.options.checked ? "t" : "f") + "Button"]
      })
      .removeClass("switch-button-transparent");
    this.ui.activeBackground.find("a").addClass("switch-button-transparent");
    this.ui.normalBackground.find("a").addClass("switch-button-transparent");
    this.ui.normalBackground.css({"opacity": this.options.checked ? 0.0 : 1.0});
    this.ui.activeBackground.css({"opacity": this.options.checked ? 1.0 : 0.0});

    this.rendered = true;
  },

  _setChecked: function(checked, unconditional) {
    if (this.options.checked != checked || unconditional) {
      if (this.rendered) {
        this.ui.refButton.position({
          my: "center center", 
          at: "center center",
          of: this.ui[(checked ? "t" : "f") + "Button"]
        });
        this.ui.realButton.animate({"top": this.ui.refButton.position().top});
      }

      this.ui.normalBackground.animate({"opacity": checked ? 0.0 : 1.0});
      this.ui.activeBackground.animate({"opacity": checked ? 1.0 : 0.0});

      this.options.checked = checked;
      this.element.attr(this.dstAttr, checked ? "true" : "false");
      this.element.triggerHandler("changed", checked);
    }
  },
});

$(document).bind("pagecreate create", function(e) {
  $($.todons.switch.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .switch();
});

})(jQuery);
