jQuery.extend( jQuery,
{
  createUpperProgressBarContainer: function() {
    return $("<div/>", {class: "ui-upper-progressbar-container"});
  },

/*	
  createCancelContainer: function() {
  	return $("<div/>", {class: "ui-cancel-container"});
  },
*/  
  createProgressBar: function() {
    return $("<div/>", {class: "ui-progressbar"});
  }
});
