jQuery.extend( jQuery,
{
  createDateTimePickerHeader: function() {
    return $("<div/>");
  },

  createSelectorItem: function(klass) {
    var container = $("<div/>", {class: "item " + klass});
    var link = $("<a/>", {href: "#"});

    container.append(link);

    return {container:container, link:link, selector:".item a"};
  }
});

