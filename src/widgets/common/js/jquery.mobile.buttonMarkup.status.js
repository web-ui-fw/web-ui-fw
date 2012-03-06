(function($, undefined) {
	var origButtonMarkup = $.fn.buttonMarkup;

	$.fn.buttonMarkup = function(options) {
		var result = origButtonMarkup.apply(this, arguments);

		options = options || {};

		for (var i = 0 ; i < this.length ; i++) {
			var el = this.eq(i),
					e = el[0],
					o = $.extend({}, $.fn.buttonMarkup.defaults, {
						status: options.status !== undefined ? options.status : el.jqmData("status")
					}, options );

			if (o.status !== null) {
				var span = document.createElement("span");
				span.className="ui-icon ui-icon-status ui-icon-status-" + o.status + (o.iconshadow ? " ui-icon-shadow" : "");
				e.children[0].insertBefore(span, e.children[0].firstChild);
				e.className += " ui-btn-status";
			}
		}

		return result;
	};

	$.fn.buttonMarkup.defaults = origButtonMarkup.defaults;
	$.fn.buttonMarkup.defaults.status = null;
})(jQuery);
