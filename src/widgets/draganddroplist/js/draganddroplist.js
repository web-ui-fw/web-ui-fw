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
		    var $this = $(this);
		    function absoluteTouchPostion(event) {
			    return new $.Point(event.pageX + window.scrollX,
					       event.pageY + window.scrollY);
		    }

		    //Drag Object.  Clone of the "real list item" being dragged
		    function dragObject() {
			    var startPos = null,
			    elementTopPos = null,
			    dragging = false,
			    draggedElement = null,
			    dragCallBack = null,
			    dragStoppedCallback = null,
			    realObject = null,
			    newPos = new $.Point(0, 0),
			    previousYPosition = null


			    this.setMovingObject = function(movingElement, cursorStartPos,
							    draggingCallBack,
							    draggingStoppedCallback) {
				    if (movingElement === null)
					    return;
				    dragging = true;
				    startPos = cursorStartPos;
				    previousYPosition = startPos.y();
				    dragCallBack = draggingCallBack;
				    dragStoppedCallback = draggingStoppedCallback;
				    draggedElement = movingElement;
				    draggedElement.css({
					    position: "absolute",
					    zIndex: "100",
					    opacity: 0.5,
					    top: draggedElement.offset().top,
					    left: draggedElement.offset().left
				    });
				    elementTopPos = new $.Point(parseInt(draggedElement.css('left'),10),
								parseInt(draggedElement.css('top'),10));
				     jQuery(draggedElement).css('-webkit-transform', 'scale(1.1)');
				    _moveObject();
			    };

			    function _stopDragging() {
				    if (!dragging)
				       return;
				    startPos = null;
				    elementTopPos = null;
				    draggedElement.unbind('swipe mousemove touchmove mouseup touchstart mousedown scroll touchend');
				    if (dragStoppedCallback !== null)
					    dragStoppedCallback(draggedElement);
				    draggedElement = null;
				    dragging = false;
			    }

			    function _evaluatePosition(event) {
				    newPos = absoluteTouchPostion(event);
				    newPos = newPos.add(elementTopPos).subtract(startPos);
			    }

			    function _moveObject() {
				    if (!dragging)
					    return;
				    draggedElement.bind('swipe mousemove touchmove scroll',
							function (event) {
					dragging = true;
					_evaluatePosition(event);
					draggedElement.css({
						top: newPos.y(),
						left: newPos.x()
					});
					newPos.setY(newPos.y() + event.offsetY);
					var p = newPos.y();
					if (previousYPosition === p)
						return true;
					var scrollingUp = false;
					if (previousYPosition >p)
					    scrollingUp = true;
					previousYPosition = p;
					if (dragCallBack !== null)
					    dragCallBack(p,scrollingUp);
					event.preventDefault();
				    });
				    draggedElement.bind('mouseup touchstart mousedown touchend',
							    function (event) {
					    _stopDragging();
					    return true;
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
		    var listItems = [],
		    children = [],
		    resetNeeded = false,
		    reEvaluateChildren = false,
		    $realObject = null,
		    $targetObject = null
		    $clone = document.createElement("li");
		    $shadow = $($.createShadowListItem());
		    $shadow.addClass("shadow");
		    draggedObject = new dragObject();
		    shadowData = {
			    $shadowRect: new $.Rect(0,0,0,0),
			    shadowIndex: null,
			    targetHeight: null
		    }

		    $targetObject = {
			    targetItem: null,
			    targetIndex: null
		    }

		    var _unBind = function () {
			    if (!resetNeeded)
				    return;
			    resetNeeded = false;
			    var listItem = "";
			    $.each(listItems, function (idx, li) {
				    listItem = $(li);
				    listItem.unbind('taphold');
			    });
			    $this.unbind("swipe mousemove touchmove");
			    shadowData.$shadowRect.setRect(0,0,0,0);
			    shadowData.targetHeight = null;
			    shadowData.shadowIndex = null;
			    $targetObject = {
				targetItem: null,
				targetIndex: null
			    }
		    }

		    var _evaluateDragEnd = function () {
			    var offset = $shadow.offset();
			    $clone.animate({
				left: parseInt(offset.left,10),
				top: parseInt(offset.top,10)
				}, 100, "swing", function(){
				    $clone.remove();
				    $shadow.replaceWith($realObject);
			    });
			    $.enableSelection($this);
			    $this.trigger('dragEnded', [shadowData.shadowIndex]);
			    _unBind();
		    }

		    var _evaluateDragDown = function (newPos) {
			    for (var i = shadowData.shadowIndex,l = children.length; i < l; i++) {
				    if (_targetItemIndex(i,newPos,true)) {
					break;
				    }
			    }
		    }

		    var _evaluateDragup = function (newPos) {
			    for (var i = shadowData.shadowIndex; i >=0; i--) {
				    if (_targetItemIndex(i,newPos,false)) {
					break;
				    }
			    }
		    }

		    var _targetItemIndex = function (itemIndex,newPos,dragDown) {
			    var result = false;
			    var item = $(children[itemIndex]);
			    if (!item.hasClass("dragObject")) {
				    var itemheight = parseInt(item.outerHeight(),10);
				    var itemTop =  parseInt(item.offset().top,10);
				    var difference = dragDown ? newPos - itemTop
							      : Math.abs(itemTop - newPos);
				    if (Math.round(itemheight/2) > difference) {
				       $targetObject.targetItem = item;
				       $targetObject.targetIndex = itemIndex;
				       result = true;
				    }
			    }
			return result;
		    }

		    var _moveShadowToTarget = function (insertBefore) {
			    var offset = $targetObject.targetItem.offset();
			    $shadow.animate({
				left: parseInt(offset.left,10),
				top: parseInt(offset.top,10)
				},10, "swing", function(){
				    if (insertBefore) {
				       $shadow.insertBefore($targetObject.targetItem);
				    } else {
				      $shadow.insertAfter($targetObject.targetItem);
				    }
			    });
			    reEvaluateChildren = true;
			    shadowData.shadowIndex = $targetObject.targetIndex;
			    shadowData.$shadowRect.moveTop($targetObject.targetItem.offset().top);
			    shadowData.targetHeight = $targetObject.targetIndex === children.length-1
					       ? (shadowData.$shadowRect.top()+Math.round($targetObject.targetItem.outerHeight()/2))
					       :null;
		    }

		    var _evaluateDragMove = function (newPos,scrollingUp) {

			    if (reEvaluateChildren) {
				    //need to recache children as they have moved
				    children = $this.children();
				    reEvaluateChildren = false;
			    }
			    //check if the new pos is within the shadow item
			    if (shadowData.$shadowRect.containsY(newPos)) {
					if (shadowData.targetHeight !== null
						 && newPos >= shadowData.targetHeight) {
						$targetObject.targetIndex = children.length-1;
						$targetObject.targetItem = $(children[children.length-1]);
						_moveShadowToTarget(false);
						shadowData.targetHeight = null;
					}
				 return;
			    }

			    $targetObject.targetIndex = null;
			    $targetObject.targetItem = null;
			    var index = scrollingUp ? _evaluateDragup(newPos)
						    : _evaluateDragDown(newPos);
			    if ($targetObject.targetItem === null ||
				    $targetObject.targetIndex === null ||
				    shadowData.shadowIndex === $targetObject.targetIndex ||
				    $targetObject.targetItem.hasClass("shadow")) {
				       return;
			    }
			    _moveShadowToTarget(true);
		    }

		    var _mouseInit = function () {
			    resetNeeded = true;
			    listItems = $this.children("li");
			    listItems.each(function (idx, li) {
				$(li).bind('taphold', function (event) {
					$.disableSelection($this);
					$this.trigger('dragStarted', [idx]);
					$realObject = $(this);
					$clone = $realObject.clone();
					$clone.addClass("dragObject");
					$clone.css('width', $realObject.css('width'));
					$realObject.replaceWith($clone);
					draggedObject.setMovingObject($clone,
								     absoluteTouchPostion(event),
								    _evaluateDragMove, _evaluateDragEnd);
					var cloneHeight = $clone.outerHeight();
					$shadow.css('height', parseInt(cloneHeight,10));
					$shadow.insertBefore($clone);
					_unBind();
					shadowData.shadowIndex = idx;
					shadowData.$shadowRect.setTop($shadow.offset().top);
					shadowData.$shadowRect.setBottom(shadowData.$shadowRect.top() + cloneHeight);
					reEvaluateChildren = true;
					event.preventDefault();
				});
			    });
		    }

		    $this.bind("mousedown touchstart", function (event) {
			    var previousPageX = event.pageX;
			    var previousPageY = event.pageY;
			    _mouseInit();
			    $this.bind("swipe mousemove touchmove", function (event) {
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
