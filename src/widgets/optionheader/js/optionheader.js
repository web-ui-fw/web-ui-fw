(function($, undefined) {

$.widget("todons.optionheader", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(role='optionheader')",
        rows: 1
    },

    _create: function () {
        // parse data-options
        var options = this.element.data('options');
        $.extend(this.options, options);
    }
});

// auto self-init widgets
$(document).bind("pagecreate", function (e) {
    $($.todons.optionheader.prototype.options.initSelector, e.target)
    .not(":jqmData(role='none'), :jqmData(role='nojs')")
    .optionheader();
});

})(jQuery);
