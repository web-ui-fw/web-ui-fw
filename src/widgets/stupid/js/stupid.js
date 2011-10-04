(function ($, undefined) {

$.widget("mobile.stupid", $.mobile.widget, {
    options: {
        initSelector: ":jqmData(role='stupid')"
    },

    _create: function() {
        this.element.append('<p>STUPID WIDGET!</p>');
    }
});

$(document).bind("pagecreate create", function( e ){
    $($.mobile.stupid.prototype.options.initSelector, e.target).stupid();
});

})(jQuery);
