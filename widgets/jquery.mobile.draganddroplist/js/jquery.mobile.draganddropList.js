  /*!
   * jQuery Mobile Widget @VERSION
   *
   * Copyright (C) TODO
   * License: TODO
   * Authors: Kalyan Kondapally <kalyan.kondapally@intel.com>
   */   
		 
    (function ($, undefined) {
	$(":jqmData(role='listview')").live("listviewcreate", function () {
	    if ($(this).hasClass("draganddroplist")) {
		
                function absoluteTouchPostion(event) {
		    return new $.Point(event.clientX + window.scrollX,
				       event.clientY + window.scrollY);
		}
                
	        //Drag Object. this is the clone of the "real list item" being dragged
                function dragObject() {
                    var startPos = null,
                    elementTopPos = null,
                    dragging = false,
                    draggedElement = null,
                    dragCallBack = null,
                    dragStoppedCallback = null,
                    realObject = null,
                    newPos = $.Point(0, 0),
                    pTopPosition = null
		 
                    this.setMovingObject = function(movingElement, cursorStartPos,
                                                    parentTopPos, draggingCallBack,
                                                    draggingStoppedCallback) {
			dragging = true;
			startPos = cursorStartPos;
			pTopPosition = parentTopPos;
			dragCallBack = draggingCallBack;
			dragStoppedCallback = draggingStoppedCallback;
			draggedElement = movingElement;
			var height = parseInt(draggedElement.height());
			var width = parseInt(draggedElement.width());
			draggedElement.css({
			    position: "absolute",
			    zIndex: "100",
			    opacity: 0.5,
			    top: draggedElement.offset().top,
			    left: draggedElement.offset().left,
			    height: height + height / 4,
			    width: width + width / 4
			});
			elementTopPos = new $.Point(parseInt(draggedElement.css('left')),
						    parseInt(draggedElement.css('top')));
			_moveObject();
		    };
		 
		    function _stopDragging() {
			if (!dragging) return;
			startPos = null;
			elementTopPos = null;
			draggedElement.unbind('swipe mousemove touchmove mouseup touchstart mousedown scroll touchend');
			if (dragStoppedCallback != null)
			    dragStoppedCallback(draggedElement);
			draggedElement = null;
			dragging = false;
		    }
		 
		    function _evaluatePosition() {
			newPos = absoluteTouchPostion(event);
			newPos = newPos.add(elementTopPos).subtract(startPos);
		    }
		 
		    function _moveObject() {
			if (draggedElement == null || !dragging)
			    return;
			draggedElement.bind('swipe mousemove touchmove scroll',
					    function (event) {
			    dragging = true;
			    _evaluatePosition();
			    draggedElement.css({
				top: newPos.y(),
				left: newPos.x()
				});
			    newPos.setY(newPos.y() + event.offsetY);
			    var p = newPos.y() - pTopPosition;
			    if (dragCallBack != null)
				dragCallBack(p);
			    }); 
			    draggedElement.bind('mouseup touchstart mousedown touchend',
						function (event) {
				_stopDragging();
			    });
		    }
		 
		    this.newPosition = function () {
			return newPos;
		    }
		 
		    this.draggedElement = function () {
			return draggedElement;
		    }
		}
		 
		 
		//DragAndDrop Functionality
		var list = $(this),
		listItems = [],
		resetNeeded = false,
		draggedObject = new dragObject();
		previousPageX = 0,
		previousPageY = 0,
		shadow = $.createShadowListItem(),
		$(shadow).addClass("shadow");
		shadowIndex = null,
		clone = document.createElement("li");
		 
		var _unBind = function () {
		    if (!resetNeeded)
			return;
		    resetNeeded = false;
		    var listItem = "";
		    $.each(listItems, function (idx, li) {
			    listItem = $(li);
			    listItem.unbind('taphold');
		    });
		    list.unbind("swipe mousemove touchmove");
		    shadowIndex = null;
		}
		 
		var _refreshChildItems = function () {
		    listItems = [];
		    listItems = list.children("li");
		}
		 
		var _evaluateDragEnd = function () {
		    if (draggedObject.draggedElement() != null) {
			$(clone).remove();
			$(shadow).replaceWith($(realObject));
		    }
		    $.enableSelection(list);
		    list.trigger('dragEnded', [shadowIndex]);
		    _unBind();
		}
		
                var _evaluateDragMove = function (newPos) {
		    var temp;
		    var item;
		    var children = list.children();
		    for (var i = 0; i < children.length; i++) {
			item = $(children[i]);
			if (!item.hasClass("dragObject")) {
			    temp = parseInt(item.outerHeight()); 
			    if (Math.round(temp/2) >= newPos) {
				break;
			    }
			    newPos -= temp;
			}
		    }
		 
		    if ((shadowIndex == i || item.hasClass("shadow") )
			&& i != children.length) {
			return;
		    }
		 
		    if (i != children.length) {
			$(shadow).insertBefore($(children[i]));
		    }
		    else {
			$(shadow).insertAfter($(children[i - 1]));
		    }
		    shadowIndex = i;
		}
		 
		var _mouseInit = function () {
		    resetNeeded = true;
		    _refreshChildItems();
		    var listItem = "";
		    if (listItems) {
			listItems.each(function (idx, li) {
			    listItem = $(li);
			    listItem.bind('taphold', function (event) {
				$.disableSelection(list);
				list.trigger('dragStarted', [idx]);
				realObject = $(this);
				realObject.unbind('taphold');
				clone = realObject.clone(true);
				clone.addClass("dragObject")
				$(realObject).replaceWith($(clone));
				draggedObject.setMovingObject(clone,
							     absoluteTouchPostion(event),
							     parseInt($(list).offset ().top),
							    _evaluateDragMove, _evaluateDragEnd);
				shadow.css('height', parseInt($(clone).outerHeight()));
				$(shadow).insertBefore($(clone));
				_unBind();
				shadowIndex = idx;
			    });
			});
		    }
		}
		 
		list.bind("mousedown touchstart", function (event) {
		    previousPageX = event.pageX;
		    previousPageY = event.pageY;
		    _mouseInit();
		    list.bind("swipe mousemove touchmove", function (event) {
		        if (event.type == "swipe" || previousPageX != event.pageX ||
			   previousPageY != event.pageY) {
			   //we have some movement after touch and before tapandhold
			   //is recieved. Shoule we have some threshold to determine
			   //if it is a pan or swipe??
			   _unBind();
		        }
		    });
		    return true;
		});
	    }
	});
		 
    })(jQuery);
