(function ($) {

$.widget("todons.swipelist", $.mobile.widget, {
    options: {
        theme: null
    },

    _create: function () {
        var self = this,
            theme,
            covers;

        // use the theme set on the element, set in options,
        // the parent theme, or 'c' (in that order of preference)
        theme = this.element.data('theme') ||
                this.options.theme ||
                this.element.parent().data('theme') ||
                'c';

        // swipelist is a listview
        $(this.element).listview();

        // get the list item covers
        covers = $(this.element).find(':jqmData(role="swipelist-item-cover")');

        covers.each(function () {
            var cover = $(this);

            // get the parent li element and add classes
            var item = cover.closest('li');

            item.removeClass('ui-swipelist-item')
                .addClass('ui-swipelist-item');

            cover.removeClass('ui-swipelist-item-cover')
                 .addClass('ui-swipelist-item-cover');

            // set swatch on cover
            cover.removeClass('ui-body-' + theme)
                 .addClass('ui-body-' + theme);

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
        });
    },

    // NB I tried to use CSS animations for this, but the performance
    // and appearance was terrible on Android 2.2 browser;
    // so I reverted to jQuery animations
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
