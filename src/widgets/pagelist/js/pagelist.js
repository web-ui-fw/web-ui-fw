// pagelist widget
//
// Given an element, this widget collects all links contained in the descendants of the element and constructs
// a popupwindow widget containing numbered buttons for each encountered link.
//
// You can mark any one element in your document with "data-pagelist='true'" and a pagelist will be created that
// will allow the user to navigate between the pages linked to within the element.
//
// Currently, only one pagelist can exist in a document and, once created, it cannot be modified.

(function($, undefined) {

ensureNS("jQuery.mobile.todons");

$.widget("todons.pagelist", $.todons.widgetex, {
    _htmlProto: {
        ui: {
            pageList: "#pagelist",
            button:   "#pagelist-button",
            rowBreak: "#pagelist-rowbreak"
        }
    },
    _create: function() {
        var self = this,
            popPageList = false,
            idx = 0;

        this._ui.button.remove();
        this._ui.rowBreak.remove();
        this._ui.pageList
            .appendTo($("body"))
            .popupwindow()
            .bind("vclick", function(e) {
                $(this).popupwindow("close");
            });

        this.element.find("a[href]").each(function(elemIdx, elem) {
            if (idx > 0 && !(idx % 10))
                self._ui.pageList.append(self._ui.rowBreak.clone());

            self._ui.button
                .clone()
                .attr("href", $(elem).attr("href"))
                .text(++idx)
                .appendTo(self._ui.pageList)
                .buttonMarkup()
                .bind("vclick", function() { self._ui.pageList.popupwindow("close"); })
                .find(".ui-btn-inner")
                    .css({padding: 2});
        });

        $(document).bind("keydown", function(e) {
            popPageList = (e.keyCode === $.mobile.keyCode.CONTROL);
        });
        $(document).bind("keyup", function(e) {
            if (e.keyCode === $.mobile.keyCode.CONTROL && popPageList) {
                var maxDim = {cx: 0, cy: 0};
                self._ui.pageList.popupwindow("open", undefined, 0);
                self._ui.pageList.find("a")
                    .each(function() {
                        var btn = $(this),
                            dim = {
                                cx: btn.outerWidth(true),
                                cy: btn.outerHeight(true)
                            };

                        // Make sure things will be even later, because padding cannot have decimals - apparently :-S
                        if (dim.cx % 2) btn.css("padding-left",   parseInt(btn.css("padding-left"))   + 1);
                        if (dim.cy % 2) btn.css("padding-bottom", parseInt(btn.css("padding-bottom")) + 1);

                        maxDim.cx = Math.max(maxDim.cx, dim.cx);
                        maxDim.cy = Math.max(maxDim.cy, dim.cy);
                    })
                    .each(function() {
                        var padding = {
                                h: Math.max(0, (maxDim.cx - $(this).outerWidth(true))  / 2),
                                v: Math.max(0, (maxDim.cy - $(this).outerHeight(true)) / 2),
                            },
                            btn = $(this),
                            inner = btn.find(".ui-btn-inner");

                        inner.css({
                            "padding-left"   : parseInt(inner.css("padding-left"))   + padding.h,
                            "padding-top"    : parseInt(inner.css("padding-top"))    + padding.v,
                            "padding-right"  : parseInt(inner.css("padding-right"))  + padding.h,
                            "padding-bottom" : parseInt(inner.css("padding-bottom")) + padding.v,
                        });
                        btn[((btn.attr("href") === "#" + $.mobile.activePage.attr("id")) ? "addClass" : "removeClass")]("ui-btn-active");
                    });
                e.stopPropagation();
                e.preventDefault();
            }
            popPageList = false;
        });
    }
});

// Look for an element marked as a pagelist and assign $.mobile.todons.pagelist with a newly created pagelist.
// If $.mobile.todons.pagelist is already assigned, ignore any new "data-pagelist='true'" designations.
$(document).bind("pagecreate create", function(e) {
    $(":jqmData(pagelist='true')", e.target)
        .not(":jqmData(role='none'), :jqmData(role='nojs')")
        .each(function() {
            if ($.mobile.todons.pagelist === undefined) {
                $.extend($.mobile.todons, {
                    pagelist: $(this).pagelist()
                });
            }
            return false;
        });
});

})(jQuery);
