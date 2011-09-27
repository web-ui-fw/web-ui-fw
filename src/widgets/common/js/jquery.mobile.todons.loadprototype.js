(function($, undefined) {

ensureNS("jQuery.mobile.todons");

jQuery.extend( jQuery.mobile.todons,
{
  _widgetPrototypes: {},

  /*
   * load the prototype for a widget.
   *
   * If @widget is a string, the function looks for @widget.prototype.html in the proto-html/ subdirectory of the
   * framework's current theme and loads the file via AJAX into a string. Note that the file will only be loaded via
   * AJAX once. If two widget instances based on the same @widget value are to be constructed, the second will be
   * constructed from the cached copy of the prototype of the first instance.
   *
   * If @widget is not a string, it is assumed to be a hash containing at least one key, "proto", the value of which is
   * the string to be used for the widget prototype. In this case, the prototype cannot be cached, because the key under
   * which to cache it is not known.
   *
   * Given the string for the widget prototype, the following patterns occurring in the string are replaced:
   *
   *   "${FRAMEWORK_ROOT}" - replaced with the path to the root of the framework
   *
   * The function then creates a jQuery $("<div>") object containing the prototype from the string.
   *
   * If @ui is not provided, the jQuery object containing the prototype is returned.
   *
   * If @ui is provided, it is assumed to be a (possibly multi-level) hash containing CSS selectors. For every level of
   * the hash and for each key at that level, the css selector specified as the value is sought in the prototype jQuery
   * object and, if found, the value of the key is replaced with the jQuery object resulting from the search.
   * Additionally, if the CSS selector is of the form "#widget-id", the "id" attribute will be removed from the elements
   * contained within the resulting jQuery object. The resulting hash is returned.
   *
   * Examples:
   *
   * 1.
   * $.mobile.todons.loadPrototype("mywidget") => Returns a <div> containing the structure from the file
   * mywidget.prototype.html located in the current theme folder of the current framework.
   *
   * 2. $.mobile.todons.loadPrototype("mywidget", ui):
   * where ui is a hash that looks like this:
   * ui = {
   *   element1: "<css selector 1>",
   *   element2: "<css selector 2>",
   *   group1: {
   *     group1element1: "<css selector 3>",
   *     group1element1: "<css selector 4>"
   *   }
   *  ...
   * }
   *
   * In this case, after loading the prototype as in Example 1, loadPrototype will traverse @ui and replace the CSS
   * selector strings with the result of the search for the selector string upon the prototype. If any of the CSS
   * selectors are of the form "#elementid" then the "id" attribute will be stripped from the elements selected. This
   * means that they will no longer be accessible via the selector used initially. @ui is then returned thus modified.
   */

  loadPrototype: function(widget, ui) {
    var ret = undefined,
        theScriptTag = $("script[data-framework-version][data-framework-root][data-framework-theme]"),
        frameworkRootPath = theScriptTag.attr("data-framework-root")    + "/" +
                            theScriptTag.attr("data-framework-version") + "/";

    function replaceVariables(s) {
      return s.replace(/\$\{FRAMEWORK_ROOT\}/g, frameworkRootPath);
    }

    function fillObj(obj, uiProto) {
      var selector;

      for (var key in obj) {
        if (typeof obj[key] === "string") {
          selector = obj[key];
          obj[key] = uiProto.find(obj[key]);
          if (selector.substring(0, 1) === "#")
            obj[key].removeAttr("id");
        }
        else
        if (typeof obj[key] === "object")
          obj[key] = fillObj(obj[key], uiProto);
      }
      return obj;
    }

    if (typeof widget === "string") {
      ret = $.mobile.todons._widgetPrototypes[widget];
      if (ret === undefined) {
        var protoPath = frameworkRootPath + "proto-html" + "/" +
                        theScriptTag.attr("data-framework-theme");
        $.ajax({
          url: protoPath + "/" + widget + ".prototype.html",
          async: false,
          dataType: "html"
        })
          .success(function(data, textStatus, jqXHR) {
            $.mobile.todons._widgetPrototypes[widget] = $("<div>").html(replaceVariables(data));
            ret = $.mobile.todons._widgetPrototypes[widget].clone();
          });
      }
    }
    else
      ret = $("<div>").html(replaceVariables(widget["proto"]));

    if (ret != undefined)
      if (ui != undefined)
        ret = fillObj(ui, ret);

    return ret;
  }
});
})(jQuery);
