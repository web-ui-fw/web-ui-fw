(function($, undefined) {
    var init = false;

    function createWidget(widgetType, inputType) {
        console.log("createWidget(" + widgetType + ", " + inputType + ")");
        $("#widget-container").empty();
        if (inputType !== null) {
            $("#widget-container").html(
                "<form action='#' method='get'>" +
                "   <input type='" + inputType + "' name='testInput' id='testInput'></input>" +
                "</form>"
            );
            $("#testInput")[widgetType]();
        }
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
