jQuery.extend( jQuery.mobile.todons,
{
  widgetPrototypes: {},

  loadPrototype: function(widgetname) {
    var ret = $.mobile.todons.widgetPrototypes[widgetname];

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
          $.mobile.todons.widgetPrototypes[widgetname] = $("<div>").html(data.replace(/\$\{FRAMEWORK_ROOT\}/g, frameworkRootPath));
          ret = $.mobile.todons.widgetPrototypes[widgetname];
        });
    }

    if (ret != undefined)
      ret = ret.clone();

    return ret;
  }
});
