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
		var list = $(this);
                function absoluteTouchPostion(event) {
		    return new $.Point(event.pageX + window.scrollX,
				       event.pageY + window.scrollY);
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
                    newPos = new $.Point(0, 0),
                    previousYPosition = null
		    
		 
                    this.setMovingObject = function(movingElement, cursorStartPos,
                                                    draggingCallBack,
                                                    draggingStoppedCallback) {
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
			elementTopPos = new $.Point(parseInt(draggedElement.css('left')),
						    parseInt(draggedElement.css('top')));
			 jQuery(draggedElement).css('-webkit-transform', 'scale(1.5)');
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
		 
		    function _evaluatePosition(event) {
			newPos = absoluteTouchPostion(event);
			newPos = newPos.add(elementTopPos).subtract(startPos);
		    }
		 
		    function _moveObject() {
			if (draggedElement == null || !dragging)
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
                            if (previousYPosition == p)
                                return;
                            var scrollingUp = false;
                            if (previousYPosition >p)
                                scrollingUp = true;
                            previousYPosition = p;
			    if (dragCallBack != null)
				dragCallBack(p,scrollingUp);
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
		var listItems = [],
                children = [],
		resetNeeded = false,
                reEvaluateChildren = false,
		draggedObject = new dragObject();
		previousPageX = 0,
		previousPageY = 0,
		$shadow = $($.createShadowListItem()),
		$shadow.addClass("shadow"),
                $realObject = null,
		$clone = document.createElement("li")
		
		var shadowData= {
		    shadowIndex: null,
		    shadowHeight: null,
                    thresholdHeight: null,
		    shadowTop: null,
                    targetHeight: null
		}
		 console.log(list.outerHeight() + 'window'+window.innerHeight);
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
		    shadowData= {
		    shadowIndex: null,//This will be the index of item before which shadow is placed
		    shadowHeight: null,//Height of the shadow. Same as the orginal height of an item being dragged.
                    thresholdHeight: null,//This
		    shadowTop: null,
                    targetHeight: null
		    };
		}
		 		 
		var _evaluateDragEnd = function () {
		    if (draggedObject.draggedElement() != null) {
                       $clone.animate({
                        left: parseInt($shadow.offset().left),
                        top: parseInt($shadow.offset().top)
                        }, 100, "swing", function(){
			    jQuery($clone).css('-webkit-transform', 'scale(1)');
                            $clone.remove();
		            $shadow.replaceWith($realObject);
                            });
		    }
		    $.enableSelection(list);
		    list.trigger('dragEnded', [shadowData.shadowIndex]);
		    _unBind();
		}
		
                var _evaluateDragDown = function (newPos) { 
                    var result = null;
		    for (var i = shadowData.shadowIndex; i < children.length; i++) {
			if (_targetItemIndex(i,newPos,true)) {
                            result = i;
			    break;
			}
		    }
                    return result;
                }

                var _evaluateDragup = function (newPos) {
                    var result = null;
		    for (var i = shadowData.shadowIndex; i >=0; i--) {
			if (_targetItemIndex(i,newPos,false)) {
                            result = i;
			    break;
			}
		    }
                    return result;
                }

                var _targetItemIndex = function (itemIndex,newPos,dragDown) {
                    var result = false;
                    var item = $(children[itemIndex]);
                    if (!item.hasClass("dragObject")) {
			var itemheight = parseInt(item.outerHeight()); 
                        var itemTop =  parseInt(item.offset().top);
                        var difference = dragDown ? newPos - itemTop : Math.abs(itemTop - newPos);
			if (Math.round(itemheight/2) >= difference) {
                            result = true;
			}
                    }
                    return result;
                }
                
                 var _moveShadowToTarget = function (targetIndex,insertBefore) {
                    var target = $(children[targetIndex]);
                    reEvaluateChildren = true;
                    $shadow.animate({
                        left: parseInt(target.offset().left),
                        top: parseInt(target.offset().top)
                        },10, "swing", function(){
		        if (insertBefore) {
			   $shadow.insertBefore(target);
		        } else {
			  $shadow.insertAfter(target);
		        }
                    });
		    shadowData.shadowIndex = targetIndex == 0 ? 0:targetIndex;
		    shadowData.shadowTop = target.offset().top;
                    shadowData.targetHeight = targetIndex == children.length-1
                                        ? (shadowData.shadowTop+Math.round(target.outerHeight()/2))
                                        :null;
                }
		    
                var _evaluateDragMove = function (newPos,scrollingUp) {
                    //check if the new pos is within the shadow item
                    var checkPoint = shadowData.shadowTop+shadowData.shadowHeight;
		    if (newPos > shadowData.shadowTop &&
                        newPos <= checkPoint) {
                        if (shadowData.targetHeight != null && newPos >= shadowData.targetHeight) {
                        _moveShadowToTarget(shadowData.shadowIndex,false);
                        shadowData.targetHeight = null;
                        }
                     return;
		    }
                    
                    if (shadowData.thresholdHeight >= Math.abs(shadowData.shadowTop - newPos)) {
		    //Item has not been dragged enough to move the shadow;
                        return;
		    }
                    
                    if (reEvaluateChildren) {
                        //need to recache children as they have moved
                        children = list.children();
                        reEvaluateChildren = false;
                    }
                    var index = scrollingUp ? _evaluateDragup(newPos): _evaluateDragDown(newPos);
		    if (index==null || shadowData.shadowIndex == index)
                       return;
                    _moveShadowToTarget(index,true);
	        }
		 
		var _mouseInit = function () {
		    resetNeeded = true;
		    listItems = list.children("li");
		    var listItem = "";
		    if (listItems) {
			listItems.each(function (idx, li) {
			    listItem = $(li);
			    listItem.bind('taphold', function (event) {
				$.disableSelection(list);
				list.trigger('dragStarted', [idx]);
				$realObject = $(this);
				$clone = $realObject.clone();
				$clone.addClass("dragObject");
				$realObject.replaceWith($clone);
				draggedObject.setMovingObject($clone,
							     absoluteTouchPostion(event),
							    _evaluateDragMove, _evaluateDragEnd);
				$shadow.css('height', parseInt($clone.outerHeight()));
				$shadow.insertBefore($clone);
				_unBind();
                                shadowData= {
		                    shadowIndex: idx,
		                    shadowHeight: $clone.outerHeight(),
                                    thresholdHeight: Math.round(shadowData.shadowHeight/2),
		                    shadowTop: $shadow.offset().top
		                };
                                reEvaluateChildren = true;
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
    
