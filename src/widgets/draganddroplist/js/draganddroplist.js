/*
 * jQuery Mobile Widget @VERSION
 *
 * This software is licensed under the MIT licence (as defined by the OSI at
 * http://www.opensource.org/licenses/mit-license.php)
 * 
 * ***************************************************************************
 * Copyright (C) 2011 by Intel Corporation Ltd.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 * ***************************************************************************
 *
 * Authors: Kalyan Kondapally <kalyan.kondapally@intel.com>
 */

// DragandDropList is a ListView extension containing class="draganddroplist".The extension can be used to add drag and drop
// functionality to listview.LongPress on any item activates the draganddropmode.
// Warning:The extension is in proto state.The behaviour,api and functionality can be changed without notice.
//
// Events:
//
//     dragStarted: Fired on a list item after drag mode has been activated on it.
//     dragEnded: Fired on a list item after drag mode has ended on it.
//
// Examples:
//
//     HTML markup for creating DragandDropList:
//     <ul data-role="listview" class="draganddroplist">
//         <li><a href="#">Demo</a></li>
//     </ul>

(function ($, undefined) {
    $(":jqmData(role='listview')").live("listviewcreate", function () {
        if ($(this).hasClass("draganddroplist")) {
            var $this = $(this);
            function absoluteTouchPostion(event) {
                return new $.mobile.todons.Point(event.pageX + window.scrollX,
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
                newPos = new $.mobile.todons.Point(0, 0),
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
                    elementTopPos = new $.mobile.todons.Point(parseInt(draggedElement.css('left'),10),
                                parseInt(draggedElement.css('top'),10));
                     jQuery(draggedElement).css('-webkit-transform', 'scale(1.001)');
                    _moveObject();
                };

                function _stopDragging() {
                    if (!dragging)
                       return;
                    startPos = null;
                    elementTopPos = null;
                    draggedElement.unbind('vmousemove vmouseup vmousedown');
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
                    draggedElement.bind('vmousemove',
                            function (event) {
                    var coords = $.mobile.todons.targetRelativeCoordsFromEvent(event);
                    dragging = true;
                    _evaluatePosition(event);
                    draggedElement.css({
                        top: newPos.y(),
                        left: newPos.x()
                    });
                    newPos.setY(newPos.y() + coords.y);
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
                    draggedElement.bind('vmouseup vmousedown',
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
            validActivation = false,
            reEvaluateChildren = false,
            $realObject = null,
            $targetObject = null
            $clone = document.createElement("li");
            $shadow = $("<li><div class = 'shadow'> </div></li>");
            $shadow.addClass("shadow");
            draggedObject = new dragObject();
            shadowData = {
                $shadowRect: new $.mobile.todons.Rect(0,0,0,0),
                shadowIndex: null,
                targetHeight: null
            }

            $targetObject = {
                targetItem: null,
                targetIndex: null
            }

            var _reset = function () {
                if (!validActivation)
                    return;
                validActivation = false;
                $realObject.unbind('vmouseup vmousemove',_reset);
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
                    $realObject.bind('vmousedown',_mouseDown);
                    listItems = null;
                    listItems = $this.children("li");
                    _dragInit();
                });
                $.mobile.todons.enableSelection($this);
                $realObject.trigger('dragEnded');
                _reset();
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

            var _mouseDown = function() {
                if (!validActivation) {
                    $realObject = $(this);
                    $realObject.bind('vmouseup vmousemove',_reset);
                    event.preventDefault();
                    validActivation = true;
                }
            }

            var _dragInit = function() {
                listItems.each(function (idx, li) {
                    $(li).bind('taphold', function (event) {
                        if (validActivation) {
                            $.mobile.todons.disableSelection($this);
                            _reset();
                            $.each(listItems, function (idx, li) {
                                $(li).unbind('taphold');
                            });
                            $realObject.trigger('dragStarted');
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
                            shadowData.shadowIndex = idx;
                            shadowData.$shadowRect.setTop($shadow.offset().top);
                            shadowData.$shadowRect.setBottom(shadowData.$shadowRect.top() + cloneHeight);
                            reEvaluateChildren = true;
                            event.preventDefault();
                        }
                    });
                });
            }

            var _mouseInit = function() {
                listItems = $this.children("li");
                listItems.each(function (idx, li) {
                    $(li).bind('vmousedown',_mouseDown);
                });
                _dragInit();
            }
            _mouseInit();
        }
    });

})(jQuery);
