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
            animationDuration: 500,
        },

        data: {
            uuid: 0,
            toggled: 0
        },

        _theButtonClicked: function() {
          if (0 == this.data.toggled)
            this.data.toggled = 1;
          else
            this.data.toggled = 0;

          console.log("theButtonClicked: this.data.toggled = " + this.data.toggled);

          if (this.data.toggled)
            $(this).find('.ui-switch-button').animate({top: 85}, {duration: 500});
          else
            $(this).find('.ui-switch-button').animate({top: 5}, {duration: 500});
        },

        _buttonClicked: function(obj) {
          if (0 == obj.data.toggled)
            obj.data.toggled = 1;
          else
            obj.data.toggled = 0;

          if (1 == obj.data.toggled)
            $('#ui-switch-button-' + obj.data.uuid).animate({top: 85}, {duration: obj.options.animationDuration});
          else
            $('#ui-switch-button-' + obj.data.uuid).animate({top:  5}, {duration: obj.options.animationDuration});

          $(obj).trigger('toggled');
        },

        _create: function() {
            var container = this.element;
            var obj = this;

            /* Give unique id to allow more instances in one page. */
            this.data.uuid += 1;

            container.attr("id", "ui-switch-" + this.data.uuid);

            var innerContainer = $("<div/>", {
              class: "ui-switch-inner-container"
            });
            innerContainer.attr("id", "ui-switch-inner-container-" + this.data.uuid);

            var theButton = $("<div/>", {
              class: "ui-switch-button"
            });
            theButton.attr("id", "ui-switch-button-" + this.data.uuid);

            innerContainer.append(theButton);
            container.append(innerContainer);

            innerContainer.click(function() {
              obj._buttonClicked(obj);
            });
        }
    }); /* End of widget */

    var now = new Date();
    $($.mobile.switch.prototype.data.uuid = now.getTime());
})(jQuery, this);

