jQuery.extend( jQuery,
{
  createDateTimePickerHeader: function() {
    return $("<div/>");
  },

  createSelectorItem: function() {
    var container = $("<div/>", {class: "item"});
    var link = $("<a/>", {href: "#"});

    container.append(link);

    return {container:container, link:link, selector:".item a"};
  }
});

