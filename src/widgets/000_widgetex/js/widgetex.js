/*
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
 */

// Base class for widgets that need the following features:
//
// I. HTML prototype loading
//
// This class provides HTML prototype loading for widgets. That is, the widget implementation specifies its HTML portions
// in one continuous HTML snippet, and it optionally provides an object containing selectors into the various parts of the
// HTML snippet. This widget loads the HTML snippet into a jQuery object, and optionally assigns jQuery objects to each of
// the selectors in the optionally provided object.
//
// To use this functionality you can either derive from this class, or you can call its prototype's loadPrototype method.
//
// 1. Widgets deriving from this class should define _htmlProto as part of their prototype declaration. _htmlProto looks like
// this:
//
// _htmlProto: {
//     source: string|jQuery object (optional) default: string - The name of the widget
//     ui: {
//         uiElement1: "#ui-element-1-selector",
//         uiElement2: "#ui-element-2-selector",
//         ...
//         subElement: {
//             subElement1: "#sub-element-1-selector",
//             subElement2: "#sub-element-2-selector",
//             ...
//         }
//         ...
//     }
// }
//
// If neither 'source' nor 'ui' are defined, you must still include an empty _htmlProto key (_htmlProto: {}) to indicate
// that you wish to make use of this feature. This will cause a prototype HTML file named after your widget to be loaded.
// The loaded prototype will be placed into your widget's prototype's _protoHtml.source key.
//
// If 'source' is defined as a string, it is the name of the widget (including namespace). This is the default. If your
// widget's HTML prototype is loaded via AJAX and the name of the AJAX file is different from the name of your widget
// (that is, it is not "<widgetName>.prototype.html", then you should explicitly define 'source' as:
//
// If you wish to load HTML prototypes via AJAX, modify the getProtoPath() function defined below to reflect the directory
// structure holding your widget HTML prototypes.
//
// source: "alternateWidgetName"
//
// If AJAX loading fails, source is set to a jQuery object containing a div with an error message. You can check whether
// loading failed via the jQuery object's jqmData("todons.widgetex.ajax.fail") data item. If false, then the jQuery object
// is the actual prototype loaded via AJAX or present inline. Otherwise, the jQuery object is the error message div.
//
// If 'source' is defined as a jQuery object, it is considered already loaded.
//
// if 'ui' is defined inside _htmlProto, It is assumed to be an object such that every one of its keys is either a string,
// or another object with the same properties as itself.
//
// When a widget is instantiated, the HTML prototype is loaded if not already present in the prototype. If 'ui' is present
// inside _htmlProto, the prototype is cloned. Then, a new structure is created based on 'ui' with each selector replaced
// by a jQuery object containing the results of performing .find() on the prototype's clone with the filter set to the
// value of the string. In the special case where the selector starts with a '#', the ID is removed from the element after
// it is assigned into the structure being created. This structure is then made accessible from the widget instance via
// the '_ui' key (i.e., this._ui).
//
// 2. Use the loadPrototype method when your widget does not derive from $.todons.widgetex:
// Add _htmlProto to your widget's prototype as described above. Then, in your widget's _create() method, call
// loadPrototype in the following manner:
//
// $.todons.widgetex.prototype.loadPrototype.call(this, "namespace.widgetName");
//
// Thereafter, you may use the HTML prototype from your widget's prototype or, if you have specified a 'ui' key in your
// _htmlProto key, you may use this._ui from your widget instance.
//
// II. realize method
//
// When a widget is created, some of its properties cannot be set immediately, because they depend on the widths/heights
// of its constituent elements. They can only be calculated when the page containing the widget is made visible via the
// "pageshow" event, because widths/heights always evaluate to 0 when retrieved from a widget that is not visible. When
// you inherit from widgetex, you can add a "_realize" function to your prototype. This function will be called once right
// after _create() if the element that anchors your widget is on a visible page. Otherwise, it will be called when the
// page to which the widget belongs emits the "pageshow" event.

(function($, undefined) {

// Framework-specific HTML prototype path for AJAX loads
function getProtoPath() {
    var theScriptTag = $("script[data-framework-version][data-framework-root][data-framework-theme]");

    return (theScriptTag.attr("data-framework-root")    + "/" +
            theScriptTag.attr("data-framework-version") + "/themes/" + 
            theScriptTag.attr("data-framework-theme")   + "/proto-html");
}

$.widget("todons.widgetex", $.mobile.widget, {
    _createWidget: function() {
        this.loadPrototype(this.__proto__.namespace + "." + this.__proto__.widgetName);
        $.mobile.widget.prototype._createWidget.apply(this, arguments);
    },

    _init: function() {
        var page = this.element.closest(".ui-page"),
            self = this;

        if (page.is(":visible"))
            this._realize();
        else
            page.bind("pageshow", function() { self._realize(); });
    },

    _realize: function() {},

    loadPrototype: function(widget, ui) {
        var ar = widget.split(".");

        if (ar.length == 2) {
            var namespace = ar[0],
                widgetName = ar[1];

            var htmlProto = $("<div></div>")
                    .text("Failed to load proto for widget " + namespace + "." + widgetName + "!")
                    .css({background: "red", color: "blue", border: "1px solid black"})
                    .jqmData("todons.widgetex.ajax.fail", true);

            // If htmlProto is defined
            if ($[namespace][widgetName].prototype._htmlProto !== undefined) {
                // If no source is defined, use the widget name
                if ($[namespace][widgetName].prototype._htmlProto.source === undefined)
                    $[namespace][widgetName].prototype._htmlProto.source = widgetName;

                // Load the HTML prototype via AJAX if not defined inline
                if (typeof $[namespace][widgetName].prototype._htmlProto.source === "string") {
                    // Establish the path for the proto file
                        widget = $[namespace][widgetName].prototype._htmlProto.source,
                        protoPath = getProtoPath();

                    // Make the AJAX call
                    $.ajax({
                        url: protoPath + "/" + widget + ".prototype.html",
                        async: false,
                        dataType: "html"
                    }).success(function(data, textStatus, jqXHR) {
                        htmlProto = $("<div></div>").html(data).jqmData("todons.widgetex.ajax.fail", false);
                    });

                    // Assign the HTML proto to the widget prototype
                    $[namespace][widgetName].prototype._htmlProto.source = htmlProto;
                }
                // Otherwise, use the inline definition
                else {
                    // AJAX loading has trivially succeeded, since there was no AJAX loading at all
                    $[namespace][widgetName].prototype._htmlProto.source.jqmData("todons.widgetex.ajax.fail", false);
                    htmlProto = $[namespace][widgetName].prototype._htmlProto.source;
                }

                // If there's a "ui" portion in the HTML proto, copy it over to this instance, and
                // replace the selectors with the selected elements from a copy of the HTML prototype
                if ($[namespace][widgetName].prototype._htmlProto.ui !== undefined) {
	            // Assign the relevant parts of the proto
                    function assignElements(proto, obj) {
                        var ret = {};
                        for (var key in obj)
                            if ((typeof obj[key]) === "string") {
                                ret[key] = proto.find(obj[key]);
                                if (obj[key].match(/^#/))
                                    ret[key].removeAttr("id");
                            }
                            else
                            if ((typeof obj[key]) === "object")
                                ret[key] = assignElements(proto, obj[key]);
                        return ret;
                    }

                    $.extend(this, {
                        _ui: assignElements(htmlProto.clone(), $[namespace][widgetName].prototype._htmlProto.ui)
                    });
                }
            }
        }
    }
});

})(jQuery);
