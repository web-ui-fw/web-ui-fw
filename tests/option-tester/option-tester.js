(function($, undefined) {
    var init = false;

    function formatHTML(str) {
        var ret = "", nIndent = -4, startIdx = 0, snip = "";
        for (var idx = str.indexOf(">", 0); idx != -1 ; idx = str.indexOf(">", ++idx)) {
            snip = (str.substring(startIdx, idx) + ">" + "\n").replace(/^[ \t]*/, "");
            if (snip.substring(0, 1) === "<" && snip.substring(0, 2) !== "</")
                nIndent += 4;
            for (var Nix = 0 ; Nix < nIndent ; Nix++)
                ret = ret + " ";
            ret = ret + snip;
            startIdx = idx + 1;
            if (snip.substring(0, 2) === "</")
                nIndent -= 4;
        }

        return ret;
    }

    function createOption(ns, widgetType, theWidget, key) {
        var optionsList = $("#options-list"), entry;

        function makeSetter() {
            switch(typeof $[ns][widgetType].prototype.options[key]) {
                case "boolean":
                    return {
                        html: $("<input/>", {type: "checkbox"}),
                        widget: {
                            type: "toggleswitch",
                            options: {
                                checked: theWidget[widgetType]("option", key)
                            }
                        },
                        getValue: function(elem) {return elem.toggleswitch("option", "checked");}
                    };

                case "integer":
                    return {
                        html: $("<input/>", {type: "number"}),
                        getValue: function(elem) {return elem.val();}
                    };

                default:
                    return { 
                        html: $("<input/>", {type: "text", value: $[ns][widgetType].prototype.options[key], id: key + "-option"}),
                        getValue: function(elem) {return elem.val();}
                    };
            }
        }

        entry = makeSetter();
        $("<div/>").fieldcontain()
            .append($("<label/>", {"for": key + "-option"}).text(key))
            .append(entry.html)
            .appendTo(optionsList);
        if (entry.widget !== undefined)
            entry.html[entry.widget.type](entry.widget.options);
        entry.html.bind("change", function(e) {
            theWidget[widgetType]("option", key, entry.getValue(entry.html));
            updateWidgetSrc();
        });
    }

    function updateWidgetSrc() {
        var elems = $.todons.widgetex.assignElements(
            $("<div>" +
                "<div id='widget-src-inner' class='widget-src'>" +
                    "<table>" +
                        "<tr><td><pre><code id='widget-src-dst'></code></pre></td></tr>" +
                    "</table>" +
                "</div>" +
            "</div>"),
            {
                toplevel: "#widget-src-inner",
                dst: "#widget-src-dst"
            }
        );

        $("#widget-src").empty().append(elems.toplevel);
        elems.dst.text(formatHTML($("#widget-container").html()));
        elems.toplevel.scrollview({direction: null});
    }

    function createWidget(ns, widgetType, inputType) {
        console.log("createWidget(" + ns + ", " + widgetType + ", " + inputType + ")");
        var theWidget;
        $("#widget-container").empty().css("display", "none");
        if (inputType !== null) {
            $("#widget-container").html(
                "<form action='#' method='get'>" +
                "   <input type='" + inputType + "' name='testInput' id='testInput'></input>" +
                "</form>"
            );
            theWidget = $("#testInput")[widgetType]();
            theWidget.bind("change", function() {
                updateWidgetSrc();
            });
        }
        else
            theWidget = $("<div></div>").appendTo("#widget-container")[widgetType]();
        $("#widget-container").removeAttr("style");
        $("#widget-container-cell").addClass("widget-container-cell");

        updateWidgetSrc();
        $("#options-list").empty();
        $.each($[ns][widgetType].prototype.options, function(key) {
            createOption(ns, widgetType, theWidget, key);
        });
        $("#option-list-scroller").scrollview("scrollTo", 0, 0);
    }

    $(document).bind("pageshow", function() {
        if (init) return;
        init = true;

        var widgetSelect = $("#widgetSelect"),
            makeInput = $("#makeInput"),
            inputTypeSelect = $("#inputTypeSelect"),
            optionsForm = $("#options"),
            chkBoxVal = function(chk) { return chk.next('label').find(".ui-icon").hasClass("ui-icon-checkbox-on") ; },
            mkWidget = function(isInput) {
                var wsVal = widgetSelect.val(),
                    isVal = inputTypeSelect.val(),
                    ar = wsVal.split(".");

                if (ar.length === 2) {

                    if (isVal === "Choose input type" || !isInput)
                        isVal = null;

                    createWidget(ar[0], ar[1], isVal);
                }
            }

        $.each($.todons, function(key) {
            var value = $.todons[key];
            if (value.prototype && value.prototype.widgetName) {
                $("<option/>")
                    .attr("value", "todons." + value.prototype.widgetName)
                    .text(value.prototype.widgetName)
                    .appendTo(widgetSelect);
            }
        });

        $.each($.mobile, function(key) {
            var value = $.mobile[key];
            if (value.prototype && value.prototype.widgetName) {
                $("<option/>")
                    .attr("value", "mobile." + value.prototype.widgetName)
                    .text(value.prototype.widgetName)
                    .appendTo(widgetSelect);
            }
        });

        makeInput.checkboxradio("disable");
        widgetSelect
            .selectmenu("refresh", true)
            .bind("change", function() {
                mkWidget(chkBoxVal(makeInput));
                makeInput.checkboxradio("enable");
            });

        inputTypeSelect.selectmenu(chkBoxVal(makeInput) ? "enable" : "disable");
        makeInput.bind("change", function() {
            if (chkBoxVal(makeInput)) {
                inputTypeSelect.selectmenu("disable");
                mkWidget(false);
            }
            else {
                inputTypeSelect.selectmenu("enable");
                if (inputTypeSelect.val() === "Choose input type")
                    inputTypeSelect.selectmenu("open");
                else
                    mkWidget(true);
            }
        });
        inputTypeSelect.bind("change", function() {
            mkWidget(chkBoxVal(makeInput));
        });
    });
})(jQuery);
