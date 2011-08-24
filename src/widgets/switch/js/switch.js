/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Gabriel Schulhof <gabriel.schulhof@intel.com>
 */

(function($, window, undefined) {
    $.widget("mobile.switch", $.mobile.widget, {
        options: {
            animationDuration: 500
        },

        data: {
            uuid: 0,
            precompute: {
              needed: true,
              slideFrom: -1,
              slideTo: -1
            },
            instanceData: new Array()
        },

        _buttonClicked: function(myUUID, obj) {
          if (0 == obj.data.instanceData[myUUID].toggled)
            obj.data.instanceData[myUUID].toggled = 1;
          else
            obj.data.instanceData[myUUID].toggled = 0;

          if (1 == obj.data.instanceData[myUUID].toggled)
            $('#ui-switch-button-' + myUUID).animate({top: obj.data.precompute.slideTo},   {duration: obj.options.animationDuration});
          else
            $('#ui-switch-button-' + myUUID).animate({top: obj.data.precompute.slideFrom}, {duration: obj.options.animationDuration});

          //$(obj).trigger('toggled');
        },

        _create: function() {
            var container = this.element;
            var obj = this;

            /* Give unique id to allow more instances in one page. */
            this.data.uuid += 1;

            var myUUID = this.data.uuid;

            container.attr("id", "ui-switch-" + this.data.uuid);

            var innerContainer = $.createSwitchInnerContainer();
            innerContainer.attr("id", "ui-switch-inner-container-" + this.data.uuid);

            var theButton = $.createSwitchButton();
            theButton.attr("id", "ui-switch-button-" + this.data.uuid);

            innerContainer.append(theButton);
            container.append(innerContainer);

            obj.data.instanceData[myUUID] = { toggled: 0 };

            if (obj.data.precompute.needed) {
              obj.data.precompute.needed = false;
              obj.data.precompute.slideFrom = parseInt(theButton.css('top'));
              obj.data.precompute.slideTo = innerContainer.height() - parseInt(theButton.css('top')) - theButton.height();
            }

            innerContainer.click(function() {
              obj._buttonClicked(myUUID, obj);
            });
        }
    }); /* End of widget */

    var now = new Date();
    $($.mobile.switch.prototype.data.uuid = now.getTime());
})(jQuery, this);

