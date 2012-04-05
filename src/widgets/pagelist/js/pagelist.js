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

ensureNS("jQuery.mobile.tizen");

$.widget("tizen.pagelist", $.tizen.widgetex, {
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
                                v: Math.max(0, (maxDim.cy - $(this).outerHeight(true)) / 2)
                            },
                            btn = $(this),
                            inner = btn.find(".ui-btn-inner");

                        inner.css({
                            "padding-left"   : parseInt(inner.css("padding-left"))   + padding.h,
                            "padding-top"    : parseInt(inner.css("padding-top"))    + padding.v,
                            "padding-right"  : parseInt(inner.css("padding-right"))  + padding.h,
                            "padding-bottom" : parseInt(inner.css("padding-bottom")) + padding.v
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

// Look for an element marked as a pagelist and assign $.mobile.tizen.pagelist with a newly created pagelist.
// If $.mobile.tizen.pagelist is already assigned, ignore any new "data-pagelist='true'" designations.
$(document).bind("pagecreate create", function(e) {
    $(":jqmData(pagelist='true')", e.target)
        .not(":jqmData(role='none'), :jqmData(role='nojs')")
        .each(function() {
            if ($.mobile.tizen.pagelist === undefined) {
                $.extend($.mobile.tizen, {
                    pagelist: $(this).pagelist()
                });
            }
            return false;
        });
});

})(jQuery);
