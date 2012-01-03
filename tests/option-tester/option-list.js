// option list widget
//
// Given a widget created using the widget factory, this widget will display a list of form elements that can be used to
// set the widget's options at runtime
//
// options:
//
// widget: a HTML element that has been used as the basis for a widget

(function($, undefined) {
    $.widget("todons.optionlist", $.todons.widgetex, {
        options: {
            widget: null
        },

        _setWidget: function(value) {
            if (value !== null) {
                var widget = $.todons.optionlist.widgetFromElement(value);

                if (widget) {
                    var self = this;

                    this.options.widget = value;
                    $.each($[widget.namespace][widget.widgetName].prototype.options, function(key) {
                        self._createOption(widget.namespace, widget.widgetName, value, key);
                    });
                }
            }
        },

        destroy: function() {
            this.element.empty();
            $.Widget.prototype.destroy.call(this);
        },

        _createOption: function(ns, widgetType, theWidget, key) {
            var optionsList = this.element, entry,
                self = this;

            function makeSetter() {
                switch(typeof $[ns][widgetType].prototype.options[key]) {
                    case "boolean":
                        return {
                            html: $("<input/>", {type: "checkbox"}),
                            widget: {
                                type: "toggleswitch",
                                options: {
                                    checked: $(theWidget)[widgetType]("option", key)
                                }
                            },
                            getValue: function(elem) {return elem.toggleswitch("option", "checked");}
                        };

                    case "integer":
                        return {
                            html: $("<input/>", {
                                type: "number", 
                                value: $(theWidget)[widgetType]("option", key),
                                id: key + "-option"
                            }),
                            getValue: function(elem) {return elem.val();}
                        };

                    default:
                        return { 
                            html: $("<input/>", {
                                type: "text", 
                                value: $(theWidget)[widgetType]("option", key),
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
                $(theWidget)[widgetType]("option", key, entry.getValue(entry.html));
                self.element.triggerHandler("optionChanged");
            });
        }

    });

    // "duck typing" a widget - thanks, gnarf! :)
    // Basically, check if an element has a data-item which is an object and contains a function under the key "widget"
    // and a string under the key "widgetName"
    //
    // Returns either false or the widget 
    $.todons.optionlist.widgetFromElement = function(elem) {
        var ret = false;

        $.each($.data(elem), function(key, value) {
            if (typeof value === "object") {
                var hasWidgetFunction = false, hasWidgetName = false;
                $.each(value, function(innerKey, innerValue) {
                    if (innerKey === "widgetName")
                        hasWidgetName = true;
                    else
                    if (innerKey === "widget" && typeof innerValue === "function")
                        hasWidgetFunction = true;

                    if (hasWidgetFunction && hasWidgetName)
                        ret = value;

                    // break when a widget is found
                    return (ret === false);
                });
            }

            // break when a widget is found
            return (ret === false);
        });

        return ret;
    };

})(jQuery);
