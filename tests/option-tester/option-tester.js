(function($, undefined) {
    var init = false;

    function formatHTML(str) {
        var ret = "", nIndent = -4, startIdx = 0, snip = "";
        for (var idx = str.indexOf(">", 0); idx != -1 ; idx = str.indexOf(">", ++idx)) {
            snip = (str.substring(startIdx, idx) + ">" + "\n").replace(/^[ \t]*/, "");
            if (snip.substring(0, 2) === "</")
                nIndent -= 4;
            else
            if (snip.substring(0, 1) === "<")
                nIndent += 4;
            for (var Nix = 0 ; Nix < nIndent ; Nix++)
                ret = ret + " ";
            ret = ret + snip;
            startIdx = idx + 1;
        }

        return ret;
    }

    function createOption(widgetType, theWidget, key) {
        var optionsList = $("#options-list"), entry;

        function makeSetter() {
            switch(typeof $.todons[widgetType].prototype.options[key]) {
                case "boolean":
                    console.log("theWidget[" + widgetType + "]('option', " + key + "): ");
                    console.log(theWidget[widgetType]("option", key));
                    return {
                        html: $("<input/>", {type: "checkbox"}),
                        widget: {
                            type: "toggleswitch",
                            options: {
                                checked: theWidget[widgetType]("option", key)
                            }
                        }
                    };

                case "integer":
                    return {
                        html: $("<input/>", {type: "number"})
                    };

                default:
                    return { 
                        html: $("<input/>", {type: "text", value: typeof $.todons[widgetType].prototype.options[key], id: key + "-option"}),
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
    }

    function createWidget(widgetType, inputType) {
        var theWidget;
        $("#widget-container").empty().css("display", "none");
        if (inputType !== null) {
            $("#widget-container").html(
                "<form action='#' method='get'>" +
                "   <input type='" + inputType + "' name='testInput' id='testInput'></input>" +
                "</form>"
            );
            theWidget = $("#testInput")[widgetType]();
        }
        else
            theWidget = $("<div></div>").appendTo("#widget-container")[widgetType]();
        $("#widget-container").removeAttr("style").css("border", "1px dashed black");
        $("#widget-src").html($("<pre><code>").text(formatHTML($("#widget-container").html())));
        $("#options-list");
        $.each($.todons[widgetType].prototype.options, function(key) {
            createOption(widgetType, theWidget, key);
        });
    }

    $(document).bind("pageshow", function() {
        if (init) return;
        init = true;

        var widgetSelect = $("#widgetSelect"),
            makeInput = $("#makeInput"),
            inputTypeSelect = $("#inputTypeSelect"),
            optionsForm = $("#options"),
            chkBoxVal = function(chk) { return chk.next('label').find(".ui-icon").hasClass("ui-icon-checkbox-on") ; },
            mkWidget = function() {
                var wsVal = widgetSelect.val(),
                    isVal = inputTypeSelect.val();

                if (isVal === "Choose input type")
                    isVal = null;

                createWidget(wsVal, isVal);
            }

        $.each($.todons, function(key) {
            var value = $.todons[key];
            if (value.prototype && value.prototype.widgetName) {
                $("<option/>")
                    .attr("value", value.prototype.widgetName)
                    .text(value.prototype.widgetName)
                    .appendTo(widgetSelect);
            }
        });

        makeInput.checkboxradio("disable");
        widgetSelect
            .selectmenu("refresh", true)
            .bind("change", function() {
                mkWidget();
                makeInput.checkboxradio("enable");
            });

        inputTypeSelect.selectmenu(chkBoxVal(makeInput) ? "enable" : "disable");
        makeInput.bind("change", function() {
            inputTypeSelect.selectmenu(chkBoxVal(makeInput) ? "disable" : "enable");
            inputTypeSelect.selectmenu("open");
        });
        inputTypeSelect.bind("change", function() {
            mkWidget();
        });
    });
})(jQuery);
