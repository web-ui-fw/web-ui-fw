jQuery.extend( jQuery.mobile,
{
  loadPrototype: function(widgetname) {
    var ret = undefined,
        theScriptTag = $("script[data-framework-version][data-framework-root][data-framework-theme]"),
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
        ret = $("<div>").html(data.replace(/\$\{FRAMEWORK_ROOT\}/g, frameworkRootPath));
      });

    return ret;
  }
});
