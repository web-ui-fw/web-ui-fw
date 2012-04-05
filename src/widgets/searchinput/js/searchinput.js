(function($, undefined) {
    $.widget("tizen.searchinput", $.mobile.textinput, {
        options: {
            initSelector: "input[type='search'], input:jqmData(type='search')"
        },

        _create: function() {
            if (!this.element.data("textinput")) {
                this.element.textinput();
            }

            var self = this,
                btn = this.element.next(),
                searchTimeoutId,
                updateSearchButton = function() {
                    self.element.next()[self.element.val() ? "removeClass" : "addClass"]("ui-disabled");
                    searchTimeoutId = undefined;
                };

            this.element
                .unbind()
                .bind("keyup", function(e) {
                    if (e.keyCode === $.mobile.keyCode.ENTER) {
                        console.log("Triggering search");
                        self.element.trigger("search");
                    }
                })
                .parent()
                    .removeClass("ui-icon-searchfield");

            btn
                .unbind()
                .addClass("ui-disabled")
                .bind("vclick", function() {
                    console.log("Triggering search");
                    self.element.trigger("search");
                })
                .find(".ui-icon")
                    .removeClass("ui-icon-delete")
                    .addClass("ui-icon-search");

            // Need to do this via setTimeout, because by the time we get here, a timeout has already
            // been added to hide the button.
            setTimeout(function() {btn.removeClass("ui-input-clear-hidden");}, 0);

            this.element.bind('paste cut keyup focus change blur', function() {
                if (!searchTimeoutId) {
                    searchTimeoutId = setTimeout(updateSearchButton, 0);
                }
            });
        }
    });

//auto self-init widgets
$( document ).bind( "pagecreate create", function( e ){
    $.tizen.searchinput.prototype.enhanceWithin( e.target );
});

})(jQuery);
