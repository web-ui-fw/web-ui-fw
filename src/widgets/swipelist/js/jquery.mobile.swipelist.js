/*!
 * jQuery Mobile Widget @VERSION
 *
 * Copyright (C) TODO
 * License: TODO
 * Authors: Kalyan Kondapally <kalyan.kondapally@intel.com>
 */

/*
    A swipelist is a simple list containing linked list items with a data-role="swipelist" attribute.
    The list can be used to provide quick access to a set of actions associated with a particular context.
    The context should be defined with a data-role "ui-list-cover" and associated actions with a data-role "button". 
    A button is created for each associated action.The context(cover) is shown on top and actions(buttons) 
    are hidden underneath.The associated actions of a particular context can be revealed by swiping it 
    from left to right.
    Here is the HTML markup for a basic swipe-list.
    <ul data-role="swipelist">
        <li>
            <a href="#" data-role="button" data-theme="a">Tweet</a>
            <div data-role ="ui-list-cover">Name</div>
        </li>
    </ul>
*/

(function($) {
    $.widget( "mobile.swipelist", $.mobile.widget, {
        _create: function() {
            var yThreshold = 20,
                swipeThreshold = 30,
                $currentSwipeItem = null,
                $animatedItem = null,
                maxSwipeItemLeft = 0,
                resetNeeded = false,
                startData = {
                    time: null,
                    point: new $.Point(0,0)
                };

            this._mouseDownCB = function(e) {
                $currentSwipeItem = $(this);
                var data = e.type === "touchstart" ? e.originalEvent.targetTouches[0]
                                                   :e;
                e.preventDefault();
                return _TouchStart(e, data.clientX, data.clientY);
            };

            var _mouseMoveCB = function(e) {
                var data = e.type === "touchmove"
                                  ? e.originalEvent.targetTouches[0]
                                  :e;
                e.preventDefault();
                return _TouchMove(e, e.clientX, e.clientY);
            };

            var _mouseUpCB = function(e) {
                var data = e.type === "touchend"
                                  ? e.originalEvent.targetTouches[0]
                                  :e;
                return _TouchEnd(e, e.clientX, e.clientY);
            };

            var _TouchStart =  function(e,X,Y) {
                var targetName = e.target.className;
                if (targetName.indexOf('ui-swipelistitemcover') < 0
                    && targetName.indexOf('ui-swipelistitemcontent') < 0
                    && targetName.indexOf('ui-swipelistitemcontainer') < 0)
                    return $(e.target).trigger('click');
                var temp = $currentSwipeItem.children('.ui-swipelistitemcontainer');
                $animatedItem = temp.children('.ui-swipelistitemcover');
                maxSwipeItemLeft = $animatedItem.outerWidth();
                if (0 !== $animatedItem.position().left) {
                    _swipeBack();
                    $animatedItem = null;
                    maxSwipeItemLeft = null;
                }
                else {
                    var date = new Date();
                    startData.time = date.getTime();
                    startData.point.setX(X);
                    startData.point.setY(Y);
                    if ($currentSwipeItem.width()/2 < swipeThreshold)
                        swipeThreshold = $currentSwipeItem.outerWidth()/2;
                    $currentSwipeItem.bind("mousemove touchmove", _mouseMoveCB);
                    $currentSwipeItem.bind("mouseup touchend", _mouseUpCB);
                    resetNeeded = true;
                    delete date;
                }
            };

            var _swipeBack = function() {
                $animatedItem.stop().animate({"left" :0}, 'fast','linear');
            };

            var _swipeToTarget = function() {
                $animatedItem.stop().animate({"left" :maxSwipeItemLeft}, 'fast','linear');
            };

            var _reset = function() {
                if (!resetNeeded)
                    return;
                swipeThreshold = 30;
                startData.time = null;
                startData.point.setX(0);
                startData.point.setY(0);
                $currentSwipeItem.unbind("mousemove touchmove", _mouseMoveCB);
                $currentSwipeItem.unbind("mouseup touchend", _mouseUpCB);
                $currentSwipeItem = null;
                $animatedItem = null;
                maxSwipeItemLeft = null;
                resetNeeded = false;
            };

            var _TouchMove = function(e,X,Y) {
                if (Math.abs(Y-startData.point.y()) > yThreshold)
                    _reset();
            };

            var _TouchEnd = function(e,X,Y) {
                var date = new Date(),
                    time = date.getTime()-startData.time,
                    dMoved = Math.abs(X-startData.point.x()),
                    swipeLeft = X<startData.point.x(),
                    velocity = dMoved/time;
                if ((dMoved >= swipeThreshold) && velocity >=0.2) {
                    swipeLeft === false ? _swipeToTarget():_swipeBack();
                }
                _reset();
                delete date;
            }
        },

        _init: function() {
            var $coverDiv = null,
                $contentDiv = null,
                $containerDiv = null,
                coverContent = null,
                self = this,
                listItems = self.element.children("li"),
                $li = null;
            self.element.addClass("ui-swipelist");
            listItems.each(function (idx, li) {
                $li = $(li);
                coverContent = $li.find(":jqmData(role='ui-list-cover')");
                if (coverContent.length !== 0) {
                    $li.addClass("ui-swipelistitem");
                    //create div for top container to hold both content and cover
                    $containerDiv= $(document.createElement("div"));
                    $containerDiv.addClass("ui-swipelistitemcontainer");

                    //Create div and append toplayer content
                    $coverDiv = $(document.createElement("div"));
                    $coverDiv.addClass("ui-swipelistitemcover");
                    $coverDiv.append(coverContent);

                    //create div and append button content
                    $contentDiv = $(document.createElement("div"));
                    $contentDiv.html($li.find(":jqmData(role!='ui-list-cover')").parent().html());
                    $li.find(":jqmData(role!='ui-list-cover')").remove();
                    $contentDiv.addClass("ui-swipelistitemcontent");
                    $contentDiv.attr('data-role','controlgroup');
                    $contentDiv.attr('data-type','horizontal');
                    $contentDiv.controlgroup( {direction: "horizontal"});

                    //Create appropriate layout for buttons.
                    var temp = $contentDiv.find(".ui-btn-inner").parent(),
                    cLength = temp.length;
                    if (cLength>0) {
                        temp.removeClass('ui-shadow');
                        temp.addClass('ui-buttonlayout');
                        temp.last().addClass('ui-swipebuttonlast');
                        switch (cLength) {
                        case 3:
                            temp.addClass('ui-threebuttonlayout');
                            $(temp[1]).addClass('ui-centrebutton');
                        break;
                        case 4:
                            temp.addClass('ui-fourbuttonlayout');
                        break;
                        default:
                            if (cLength>4)
                                temp.addClass('ui-fourbuttonlayout');
                        }
                    }

                    //append content and cover div to top level container
                    $containerDiv.append($contentDiv);
                    $containerDiv.append($coverDiv);

                    //append top level container to listitem
                    $li.append($containerDiv);
                    $li.bind("mousedown touchstart",
                             self._mouseDownCB);
                }
            });
            if (listItems.length === 1)
                $(listItems[0]).addClass("ui-onelinelist");
            //no need for any placeholder.
            listItems = null;
        }
    }); /* End of widget */
    
    //auto self-init widgets
    $( document ).bind( "pagecreate", function( e ){
        $( e.target ).find( ":jqmData(role='swipelist')" ).swipelist();
    });

})(jQuery);

