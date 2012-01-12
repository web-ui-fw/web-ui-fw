/*
 * jQuery Mobile Widget @VERSION
 *
 * This software is licensed under the MIT licence (as defined by the OSI at
 * http://www.opensource.org/licenses/mit-license.php)
 *
 * ***************************************************************************
 * Copyright (C) 2011 by Intel Corporation Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 *
 * Authors: Gabriel Schulhof <gabriel.schulhof@intel.com>
 */

(function($, undefined) {
    var init = false;

    function formatHTML(str) {
        var ret = "", nIndent = -4, startIdx = 0, snip = "", subIdx, ar = [], isDeTag = false;
        for (var idx = str.indexOf(">", 0); idx != -1 ; idx = str.indexOf(">", ++idx)) {
            snip = (str.substring(startIdx, idx) + ">" + "\n").replace(/^[ \t]*/, "");
            if (snip.substring(0, 2) !== "</")
                nIndent += 4;
            subIdx = snip.indexOf("<");
            if (subIdx > 0)
                ar = [ snip.substring(0, subIdx), snip.substring(subIdx) ];
            for (var Nix = 0 ; Nix < nIndent ; Nix++)
                ret = ret + " ";
            if (ar.length > 0) {
                ret = ret + ar[0] + "\n";
                isDeTag = (ar[1].substring(0, 2) === "</");
                if (isDeTag)
                    nIndent -= 4;
                for (var Nix = 0 ; Nix < nIndent ; Nix++)
                    ret = ret + " ";
                ret = ret + ar[1];
                if (isDeTag)
                    nIndent -= 4;
                ar = [];
            }
            else
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
                        html: $("<input/>", {
                            type: "number", 
                            value: theWidget[widgetType]("option", key),
                            id: key + "-option"
                        }),
                        getValue: function(elem) {return elem.val();}
                    };

                default:
                    return { 
                        html: $("<input/>", {
                            type: "text", 
                            value: theWidget[widgetType]("option", key),
                            id: key + "-option"
                        }),
                        getValue: function(elem) {return elem.val();}
                    };
            }
        }

        entry = makeSetter();
        $("<div/>")
            .append($("<label/>", {"for": key + "-option"}).text(key))
            .append(entry.html)
            .appendTo(optionsList)
            .fieldcontain();

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

    function createWidget(ns, widgetType, inputType, options) {
        var theWidget,
            optionsList = $("#options-list");

        $("#widget-container").empty().css("display", "none");
        if (inputType !== null) {
            var theForm = $.todons.widgetex.assignElements(
                $("<div>" +
                "    <form id='theForm' action='#' method='get'>" +
                "        <div id='fieldcontain' data-role='fieldcontain'>" +
                "            <label for='testWidget'>Test:</label>" +
                "            <input type='" + inputType + "' name='testWidget' id='testWidget'></input>" +
                "        </div>" +
                "</div>"),
                {
                    theForm: "#theForm",
                    theField: "#fieldcontain",
                    theWidget: "#testWidget"
                });

            $("#widget-container").empty().append(theForm.theForm);
            theWidget = theForm.theWidget;
            theWidget.bind("change", function() {
                updateWidgetSrc();
            });
            theForm.theField.fieldcontain();
        }
        else
            theWidget = $("<div></div>").attr("id", "testWidget").appendTo("#widget-container");

        $("#widget-container").removeAttr("style");
        theWidget[widgetType](options);
        $("#widget-container-cell").addClass("widget-container-cell");

        updateWidgetSrc();
        if (optionsList.data("optionlist"))
            optionsList.optionlist("destroy");
        optionsList.optionlist();
        optionsList.optionlist("option", "widget", $.todons.optionlist.widgetsFromElement(theWidget[0])[0])
        optionsList.bind("optionChanged", updateWidgetSrc);

        $("#option-list-scroller").scrollview("scrollTo", 0, 0);
    }

    $(document).bind("pageshow", function() {
        if (init) return;
        init = true;

        var widgetSelect = $("#widgetSelect"),
            makeInput = $("#makeInput"),
            inputTypeSelect = $("#inputTypeSelect"),
            optionsForm = $("#options"),
            reCreate = $("#reCreate"),
            chkBoxVal = function(chk) { return chk.next('label').find(".ui-icon").hasClass("ui-icon-checkbox-on") ; },
            widgetName = function() {
                var ar = widgetSelect.val().split("."),
                    ret = false;

                if (ar.length === 2)
                    ret = { namespace: ar[0], widgetName: ar[1] };

                return ret;
            },
            mkWidget = function(isInput, options) {
                var widget = widgetName(),
                    isVal = inputTypeSelect.val();


                if (widget) {
                    if (isVal === "Choose input type" || !isInput)
                        isVal = null;
                    createWidget(widget.namespace, widget.widgetName, isVal, options);
                }
            };

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
        reCreate.button("disable");
        widgetSelect
            .selectmenu("refresh", true)
            .bind("change", function() {
                mkWidget(chkBoxVal(makeInput));
                makeInput.checkboxradio("enable");
                reCreate.button("enable");
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

        reCreate.bind("vclick", function() {
            mkWidget(chkBoxVal(makeInput), $.extend({}, $("#testWidget").data(widgetName().widgetName).options));
        });

        inputTypeSelect.bind("change", function() {
            mkWidget(chkBoxVal(makeInput));
        });
    });
})(jQuery);
