// option list widget
//
// Given a widget created using the widget factory, this widget will display a list of form elements that can be used to
// set the widget's options at runtime
//
// options:
//
// widget: a HTML element that has been used as the basis for a widget

(function($, undefined) {
    $.widget("todons.optionlist", $.mobile.widget, {
        options: {
            widget: null
        },

        _setOption: function(key, value) {
            switch (key) {
                case "widget":
                    return this._setWidget(value);
                default:
                    return $.Widget.prototype._setOption.call(this, key, value);
            }
        },

        _setWidget: function(value) {
            if (value !== null) {
                var widget = $.todons.optionlist.widgetFromElement(value);

                if (widget) {
                    var self = this;

                    this.options.widget = value;
                    this.element.append($("<h2>" + widget.namespace + "." + widget.widgetName + "</h2>"));
                    $.each($[widget.namespace][widget.widgetName].prototype.options, function(key) {
                        self._createOption(widget.namespace, widget.widgetName, value, key);
                    });
                    this.element.trigger("create");
                }
            }
        },

        destroy: function() {
            this.element.empty();
            $.Widget.prototype.destroy.call(this);
        },

        _createOption: function(ns, widgetType, theWidget, key) {
            var optionsList = this.element, entry,
                self = this,
                id = "todons-optionlist-option-" + ($.todons.optionlist.optionId++) + "-" + key;

            function makeSetter() {
                switch(typeof $[ns][widgetType].prototype.options[key]) {
                    case "boolean":
                        return {
                            html: $("<input/>", {
                                type: "checkbox",
                                checked: $(theWidget)[widgetType]("option", key),
                                id: id
                            }),
                            getValue: function(elem) {return elem.is(":checked");}
                        };

                    case "integer":
                        return {
                            html: $("<input/>", {
                                type: "number", 
                                value: $(theWidget)[widgetType]("option", key),
                                id: id
                            }),
                            getValue: function(elem) {return elem.val();}
                        };

                    default:
                        return { 
                            html: $("<input/>", {
                                type: "text", 
                                value: $(theWidget)[widgetType]("option", key),
                                id: id
                            }),
                            getValue: function(elem) {return elem.val();}
                        };
                }
            }

            entry = makeSetter();
            $("<div/>")
                .append($("<label/>", {"for": id}).text(key))
                .append(entry.html)
                .appendTo(optionsList)
                .fieldcontain();

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

    // monotonically increasing counter for option labels
    $.todons.optionlist.optionId = 0;

})(jQuery);
