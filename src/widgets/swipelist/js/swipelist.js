(function ($) {

$.widget("todons.swipelist", $.mobile.widget, {
    options: {
        theme: null
    },

    _create: function () {
        var self = this,
            page = this.element.closest(':jqmData(role="page")');

        this.options.theme = this.options.theme ||
                             this.element.parent().data('theme') ||
                             'c';

        // swipelist is also a listview
        $(this.element).listview();

        // modify listview items by styling covers
        if (page.is(':visible')) {
            self._sizeAndPositionCovers();
        }
        else {
            page.bind('pageshow', function () {
                self._sizeAndPositionCovers();
            });
        }
    },

    _sizeAndPositionCovers: function () {
        var theme = this.options.theme;
        var listItems = $(this.element).find('li');

        listItems.each(function () {
            var item = $(this);
            var cover = item.find(':jqmData(role="swipelist-item-cover")').first();

            if (cover) {
                cover.removeClass('ui-swipelist-item-cover')
                     .addClass('ui-swipelist-item-cover');

                cover.removeClass('ui-body-' + theme).addClass('ui-body-' + theme);

                cover.position({my: 'left top',
                                at: 'left top',
                                of: item});

                cover.bind('swiperight', function (e) {
                    cover.stop();
                    cover.clearQueue();
                    cover.animate({left: '100%'}, 'fast', 'linear');
                });

                item.bind('swipeleft', function (e) {
                    cover.stop();
                    cover.clearQueue();
                    cover.animate({left: '0%'}, 'fast', 'linear');
                });
            }
        });
    }

});

$(document).bind("pagecreate", function (e) {
    $(e.target).find(":jqmData(role='swipelist')").swipelist();
});

})(jQuery);
