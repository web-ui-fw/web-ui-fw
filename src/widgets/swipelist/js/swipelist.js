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
        var self = this;

        $(this.element).find('li').each(function () {
            var item = $(this),
                cover,
                coverZIndex;

            item.addClass('ui-swipelist-item');

            coverZIndex = parseInt(item.css('z-index')) + 1;

            var cover = item.find(':jqmData(role="swipelist-item-cover")').first();

            if (cover) {
                cover.removeClass('ui-swipelist-item-cover')
                     .addClass('ui-swipelist-item-cover');

                // set swatch on cover
                cover.removeClass('ui-body-' + theme).addClass('ui-body-' + theme);

                // position cover over the list item
                cover.position({my: 'left top',
                                at: 'left top',
                                of: item});

                // vertically-align text in cover
                cover.css('line-height', item.outerHeight() + 'px');

                // put cover over the item
                cover.css('z-index', coverZIndex);

                // bind to swipe events on the cover and the item
                cover.bind('swiperight', function (e) {
                    self._animateCover(cover, 100);
                    return false;
                });

                item.bind('swipeleft', function (e) {
                    self._animateCover(cover, 0);
                    return false;
                });

                // any clicks on buttons inside the item also trigger
                // the cover to slide back to the left
                item.find('.ui-btn').bind('click', function () {
                    self._animateCover(cover, 0);
                });
            }
        });
    },

    _animateCover: function (cover, leftPercentage) {
        cover.stop();
        cover.clearQueue();
        cover.animate({left: '' + leftPercentage + '%'}, 'fast', 'linear');
    }

});

$(document).bind("pagecreate", function (e) {
    $(e.target).find(":jqmData(role='swipelist')").swipelist();
});

})(jQuery);
