(function($, undefined) {

ensureNS("jQuery.mobile.todons");

jQuery.extend( jQuery.mobile.todons,
{
  _widgetPrototypes: {},

  /*
   * load the prototype for a widget.
   *
   * Looks for @widgetname.prototype.html in the proto-html/ subdirectory of the framework's current theme.
   * Loads the file if found, and, if @ui is provided, fills in the hash by looking for the elements specified
   * by the selectors in the hash.
   * If the hash is provided, it will remove the "id" attribute for those elements that are selected by id.
   * Examples:
   *
   * 1.
   * $.mobile.todons.loadPrototype("mywidget") => Returns a <div> containing the structure from the file
   * mywidget.prototype.html located in the current theme folder of the current framework.
   *
   * 2. $.mobile.todons.loadPrototype("mywidget", ui):
   * ui is a hash that looks like this:
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
  loadPrototype: function(widgetname, ui) {
    var selector,
        ret = $.mobile.todons._widgetPrototypes[widgetname];

    function fillObj(obj, uiProto) {
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

    if (ret === undefined) {
      var theScriptTag = $("script[data-framework-version][data-framework-root][data-framework-theme]"),
          frameworkRootPath = theScriptTag.attr("data-framework-root")    + "/" +
                              theScriptTag.attr("data-framework-version") + "/",
          protoPath = frameworkRootPath + "proto-html" + "/" +
                      theScriptTag.attr("data-framework-theme");

      $.ajax({
        url: protoPath + "/" + widgetname + ".prototype.html",
        async: false,
        dataType: "html"
      })
        .success(function(data, textStatus, jqXHR) {
          $.mobile.todons._widgetPrototypes[widgetname] = $("<div>").html(data.replace(/\$\{FRAMEWORK_ROOT\}/g, frameworkRootPath));
          ret = $.mobile.todons._widgetPrototypes[widgetname];
        });
    }

    if (ret != undefined) {
      ret = ret.clone();
      if (ui != undefined)
        ret = fillObj(ui, ret);
    }

    return ret;
  }
});
})(jQuery);
