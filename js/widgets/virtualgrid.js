//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description:
//>>label: virtualgrid
//>>group: Widget

define( [
	"jqm/jquery",
	"jqm/jquery.mobile.widget",
	"jqm/widgets/page",
	"jqm/widgets/toolbar"
	], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");

( function ($, window, document, undefined) {

function scrollbarWidth()
{
	var parent, child, width;
	if(width === undefined) {
		parent = $( "<div style='width:50px;height:50px;overflow:auto'><div/></div>" ).appendTo( "body" );
		child=parent.children();
		width=child.innerWidth()-child.height( 99 ).innerWidth();
		parent.remove();
	}
	return width;
}

function MomentumTracker()
{
	this.easing = $.easing[ "easeOutQuad" ] || function ( x, t, b, c, d ) {
		return -c *(t/=d)*(t-2) + b;
	};
	this.reset();
}

var tstates = {
	scrolling:	0,
	overshot:	1,
	snapback:	2,
	done:		3
};

function getCurrentTime() { return ( new Date() ).getTime(); }

$.extend(MomentumTracker.prototype, {
	start: function( pos, speed, duration, minPos, maxPos )
	{
		this.state = (speed !== 0) ? ((pos > minPos && pos < maxPos) ? tstates.scrolling : tstates.snapback ) : tstates.done;
		this.pos = pos;
		this.speed = speed;
		this.duration = duration;
		this.minPos = minPos;
		this.maxPos = maxPos;

		this.fromPos = (this.state === tstates.snapback) ? 0 : this.pos;
		this.toPos = (this.state === tstates.snapback) ? ((this.pos < this.minPos) ? this.minPos : this.maxPos) : 0;

		this.startTime = getCurrentTime();
	},

	reset: function()
	{
		this.state = tstates.done;
		this.pos = 0;
		this.speed = 0;
		this.minPos = 0;
		this.maxPos = 0;
		this.duration = 0;
	},

	update: function()
	{
		var state = this.state,
			duration, elapsed, dx, x, didOverShoot;

		if (state === tstates.done) {
			return this.pos;
		}

		duration = this.duration;
		elapsed = getCurrentTime() - this.startTime;
		elapsed = elapsed > duration ? duration : elapsed;

		if (state === tstates.scrolling || state === tstates.overshot)
		{
			dx = this.speed * (1 - this.easing( elapsed/duration, elapsed, 0, 1, duration));
			x = this.pos + dx;

			didOverShoot = (state === tstates.scrolling) && (x < this.minPos || x > this.maxPos);
			if (didOverShoot) {
				x = (x < this.minPos) ? this.minPos : this.maxPos;
			}
			this.pos = x;
			if (state === tstates.overshot)
			{
				if (elapsed >= duration)
				{
					this.state = tstates.snapback;
					this.fromPos = this.pos;
					this.toPos = (x < this.minPos) ? this.minPos : this.maxPos;
					this.duration = this.options.snapbackDuration;
					this.startTime = getCurrentTime();
					elapsed = 0;
				}
			}
			else if (state === tstates.scrolling)
			{
				if ( didOverShoot || elapsed >= duration) {
					this.state = tstates.done;
				} else if ( this.pos <= this.minPos || this.pos > this.maxPos ) {
					this.state = tstates.done;
				}
			}
		}
		else if (state === tstates.snapback)
		{
			this.state = tstates.done;
		}

		return this.pos;
	},

	done: function() { return this.state === tstates.done; },
	getPosition: function(){ return this.pos; }
});


	jQuery.widget ( "mobile.virtualgrid", {
		// view
		_$view : null,
		_$clip : null,
		_$content : null,
		_$document : null,
		_$scrollBar : null,
		_template : null,

		_viewSize : 0,
		_itemCount : 1,
		_inheritedSize : null,

		_storedScrollPos : 0,

		_$clipSize : {
			width :0,
			height : 0
		},

		_$templateItemSize : {
			width :0,
			height : 0
		},

		// previous touch/mouse position in page..
		_prevPos : {
			x : 0,
			y : 0
		},

		// current touch/mouse position in page.
		_curPos : {
			x : 0,
			y : 0
		},

		// Data
		_itemData : null,
		_numItemData : 0,
		_cacheItemData : null,
		_totalRowCnt : 0,
		_maxSize : 0,
		_scrollBarWidth :0,
		_headItemIdx :0,
		_tailItemIdx :0,

		// axis - ( true : x , false : y )
		_direction : false,
		_keepGoing : true,

		//
		_posAttributeName : "top",
		_cssAttributeName : "width",

		// timer
		_timerInterval : 10,
		_timerCB : null,
		// draw widget
		_loadedData : false,
		_isPageShow : false,

		options : {
			// virtualgrid option
			template : "",
			direction : "y",
			repository: null,
			dataType : "json",
			replaceHelper : null,

			initSelector: ":jqmData(role='virtualgrid')"
		},
		_create : function ( ) {
			var self = this,
				_repository = self.options.repository,
				_replaceHelper = null,
				_dataType = self.options.dataType.toLowerCase(),
				successCB = function ( loadedJsonData ) {
					$.mobile.loading("hide");
					self._itemData =  function ( idx ) {
						return loadedJsonData [ idx ];
					};
					self._numItemData = loadedJsonData.length;
					self._getObjectNames( self._itemData( 0 ) );
					self._initWidget();
					self._loadedData = true;
					self.element.trigger("virtualgrid.firstdraw");
				},
				errorCB = function ( data ) {
					$.mobile.loading("hide");
					self.element.unbind( "virtualgrid.firstdraw" );
					// show error message
					self._showErrorMessage( "Can not load the data : \n" + data.statusText + "\n(" +  _repository + ")" );
				};

			if ( _repository === null ) {
				$( document ).one( "pageshow" , function ( /* event */ ) {
					self._showErrorMessage( "Please enter the path of data to the attribute of 'data-repository'. " );
					return false;
				});
				return ;
			}

			_replaceHelper =  window[self.options.replaceHelper ];
			if (  _replaceHelper && $.isFunction( _replaceHelper) ) {
				self._replaceHelper = _replaceHelper;
			}
			self.element.bind( "virtualgrid.firstdraw", function ( /* event */ ) {
				if ( self._isPageShow && self._loadedData ) {
					self.element.unbind("virtualgrid.firstdraw");
					self.refresh();
				}
				return false;
			});

			self._$document = $( document );
			$.mobile.loading( "show" , {
				text: "loading.",
				textVisible : true,
				theme : "z",
				html : ""
			});
			$.ajax( {
				url: _repository,
				dataType: _dataType,
				timeout : 2000,
				cache: true,
				async: true,
				success: successCB,
				error: errorCB
			} );

			( self.element.parents(".ui-page") || self._$document ).one( "pageshow  " , function( event ) {
				if ( $( self.options.initSelector,  event.target ).length !== 0  ){
					self._isPageShow = true;
					self.element.trigger("virtualgrid.firstdraw");
				}
			});
		},

		_initWidget : function () {
			var self = this,
				opts = self.options;
			// make a fragment.
			self._eventType = $.support.touch ? "touch" : "mouse";
			self._scrollBarWidth = scrollbarWidth();
			self._fragment = document.createDocumentFragment();
			self._createElement = function ( tag ) {
				var element = document.createElement( tag );
				self._fragment.appendChild( element );
				return element;
			};
			self._timerCB = function () {
				self._handleMomentumScroll();
			};
			// read defined properties(width and height) from dom element.
			self._inheritedSize = self._getinheritedSize( self.element );
			// set a scroll direction.
			self._direction = opts.direction === "x" ? true : false;
			// create trakcer
			self._tracker = new MomentumTracker();
			// make view layer
			self._$clip = $( self.element ).addClass( "ui-scrollview-clip" ).addClass( "ui-virtualgrid-view" );
			self._$clip.css( "overflow", "hidden" );
			self._$view = $( document.createElement( "div" ) ).addClass( "ui-virtualgrid-scroll-container" );
			self._$view[ 0 ].style.overflow = "auto";
			if ( self._direction ) {
				self._$view[ 0 ].style[ "overflow-y" ] = "hidden";
				self._cssAttributeName = "width";
				self._posAttributeName = "left";
			} else {
				self._$view[ 0 ].style[ "overflow-x" ] = "hidden";
				self._cssAttributeName = "height";
				self._posAttributeName = "top";
			}
			self._$clip.append( self._$view);
			self._$content = $( "<div class='ui-virtualgrid-content' style='position:relative;' ></div>" );
			self._$view.append( self._$content );
			self._addEventListener();
			// optional functions
			self._setScrollBarPos = $.noop;
			self._hideScrollBar = $.noop;
			self._showScrollBar = $.noop;
		},

		refresh : function () {
			var self = this,
				opts = self.options,
				width = 0,
				height = 0;

			self._template = $( "#" + opts.template );
			if ( !self._template ) {
				return ;
			}

			width = self._calculateClipSize( "width" );
			height = self._calculateClipSize( "height" );
			self._$view.width( width ).height( height );
			self._$clip.width( width ).height( height );
			self._$clipSize.width = width;
			self._$clipSize.height = height;
			self._calculateTemplateItemSize();
			self._initPageProperty();

			self._createScrollBar();
			self._setScrollBarSize();
		},

		scrollTo: function ( x, y, duration ) {
			var self = this,
				start = getCurrentTime(),
				thisDuration = duration || 0,
				sx = self._$view[ 0 ].scrollLeft,
				sy = self._$view[ 0 ].scrollTop,
				dx = x - sx,
				dy = y - sy,
				tfunc;

			tfunc = function () {
				var elapsed = getCurrentTime() - start,
					ec;
				if ( elapsed >= thisDuration ) {
					self._timerID = 0;
					self._setScrollPosition( x, y );
				} else {
					ec = $.easing.easeOutQuad( elapsed / thisDuration, elapsed, 0, 1, thisDuration );
					self._setScrollPosition( sx + ( dx * ec ), sy + ( dy * ec ) );
					self._timerID = setTimeout( tfunc, self._timerInterval );
				}
			};
			this._timerID = setTimeout( tfunc, this._timerInterval );
		},

		_resize : function () {
			var self = this,
				width = 0,
				height = 0,
				rowCount = 0,
				totalRowCnt = 0,
				columnCount = 0,
				$orderedRows = null,
				isModified = false,
				cssPropertyName = self._direction ? "width" : "height";

			if ( !self._inheritedSize ) {
				return ;
			}

			width = self._calculateClipSize( "width" );
			height = self._calculateClipSize( "height" );

			columnCount = self._calculateColumnCount();

			if ( self._itemCount !== columnCount ) {
				self._itemCount = columnCount;
				totalRowCnt = parseInt( self._numItemData / columnCount, 10 );
				self._totalRowCnt = self._numItemData % columnCount === 0 ? totalRowCnt : totalRowCnt + 1;
				self._$content[ cssPropertyName ]( self._totalRowCnt * self._$templateItemSize[ cssPropertyName ] );
				self._replaceRows();
				isModified = true;
			}

			if ( self._direction ) {
				rowCount = self._calculateRowCount( width, self._$templateItemSize.width );
			} else {
				rowCount = self._calculateRowCount( height, self._$templateItemSize.height );
			}

			if ( rowCount > self._rowsPerView ) {
				self._increaseRow( rowCount - self._rowsPerView );
				isModified = true;
			} else if ( rowCount < self._rowsPerView ) {
				self._decreaseRow( self._rowsPerView - rowCount );
				isModified = true;
			}
			self._rowsPerView = rowCount;

			// post process
			self._$view.width( width ).height( height );
			self._$clip.width( width ).height( height );
			self._$clipSize.width = width;
			self._$clipSize.height = height;

			// Sort order
			if ( isModified ) {
				$orderedRows = self._$content.children( "[row-index]" ).sort( function ( a, b ) {
						return a.getAttribute( "row-index" ) - b.getAttribute( "row-index" );
				});
				self._headItemIdx = parseInt ( $orderedRows[ 0 ].getAttribute( "row-index" ) , 10 );
				self._tailItemIdx =  parseInt ( $orderedRows[ $orderedRows.length - 1 ].getAttribute( "row-index" ) , 10 );
			}

			self._setScrollBarSize();
			self._setScrollBarPos( self._$view[ 0 ].scrollLeft, self._$view[ 0 ].scrollTop );
		},

		_initPageProperty : function () {
			var self = this,
				$children,
				columnCount = 0,
				totalRowCnt = 0,
				attributeName = "height",
				clipSize = self._$clipSize.height,
				templateSize = self._$templateItemSize.height;

			if ( self._direction ) {
				attributeName = "width";
				clipSize = self._$clipSize.width;
				templateSize = self._$templateItemSize.width;
			}

			columnCount = self._calculateColumnCount();

			totalRowCnt = parseInt(self._numItemData / columnCount , 10 );
			self._totalRowCnt = self._numItemData % columnCount === 0 ? totalRowCnt : totalRowCnt + 1;
			self._itemCount = columnCount;

			if ( templateSize <= 0) {
				return ;
			}

			self._rowsPerView = self._calculateRowCount( clipSize, templateSize );

			$children = self._makeRows( self._rowsPerView + 2 );
			self._$content.append( $children );
			self._$content.children().css( attributeName, templateSize + "px" );

			self._$content[ attributeName ]( self._totalRowCnt * templateSize );
			self._tailItemIdx = self._rowsPerView + 1;
		},

		_addEventListener : function () {
			var self = this;

			if ( self._eventType === "mouse" ) { // mouse event.
				self._$content.delegate( "img", "dragstart", function ( event ) {
					event.preventDefault();
				});
				self._$view.bind( "scroll", function ( event ) {
					var viewElement = self._$view[ 0 ];
					self._setScrollPosition(  viewElement.scrollLeft,  viewElement.scrollTop );
					event.preventDefault();
				});

				this._dragStartEvt = "mousedown";
				this._dragStartCB = function ( event ) {
					return self._handleDragStart( event, event.clientX, event.clientY);
				};

				this._dragMoveEvt = "mousemove";
				this._dragMoveCB = function ( event ) {
					return self._handleDragMove( event, event.clientX, event.clientY );
				};

				this._dragStopEvt = "mouseup";
				this._dragStopCB = function ( event ) {
					return self._handleDragStop( event );
				};
			} else { // touch event.
				self._dragStartEvt = "touchstart";
				self._dragStartCB = function ( event ) {
					var t = event.originalEvent.targetTouches[ 0 ];
					event.preventDefault();
					event.stopPropagation();
					return self._handleDragStart( event, t.pageX, t.pageY );
				};

				self._dragMoveEvt = "touchmove";
				self._dragMoveCB = function ( event ) {
					var t = event.originalEvent.targetTouches[ 0 ];
					return self._handleDragMove( event, t.pageX, t.pageY );
				};

				self._dragStopEvt = "touchend";
				self._dragStopCB = function ( event ) {
					return self._handleDragStop( event );
				};
			}
			self._$view.bind( self._dragStartEvt, self._dragStartCB );
			$( window ).bind( "resize", function ( event ){
				if ( $( $.mobile.virtualgrid.prototype.options.initSelector, $( event.target ) ) ) {
					self._resize();
				}
			});
		},

		_getinheritedSize : function ( elem ) {
			var $target = $(elem),
				height,
				width,
				ret = {
					isDefinedWidth : false,
					isDefinedHeight : false,
					width : 0,
					height : 0
				};

			// Node.ELEMENT_NODE : 1
			while ( $target[ 0 ].nodeType === 1 && (ret.isDefinedWidth === false || ret.isHeightDefined === false )) {
				height = $target[ 0 ].style.height;
				width = $target[ 0 ].style.width;

				if (ret.isDefinedHeight === false && height !== "" ) {
					// Size was defined
					ret.isDefinedHeight = true;
					ret.height = parseInt(height, 10);
				}

				if ( ret.isDefinedWidth === false && width !== "" ) {
					// Size was defined
					ret.isDefinedWidth = true;
					ret.width = parseInt(width, 10);
				}
				$target = $target.parent();
			}
			return ret;
		},

		//----------------------------------------------------//
		//		scroll handler								//
		//----------------------------------------------------//
		_handleMomentumScroll : function ( ) {
			var self =  this,
				keepGoing = false,
				x = 0,	y = 0,
				tracker = self._tracker;

			if ( tracker ) {
				tracker.update();
				if ( self._direction ) {
					x = tracker.getPosition();
				} else {
					y = tracker.getPosition();
				}
				keepGoing = keepGoing || !tracker.done();
			}
			self._setScrollPosition( x, y );
			if ( keepGoing ) {
				self._timerID = setTimeout( self._timerCB, self._timerInterval );
			} else {
				self._stopMScroll();
			}
		},

		_handleDragStart : function ( event ) {
			var self = this;

			self._stopMScroll();
			self._enableTracking();
			self._curPos.x = 0;
			self._curPos.y = 0;
			self._prevPos.x = 0;
			self._prevPos.y = 0;
			// for my control.
			self._scrolling = false;
			self._startTime = ( new Date() ).getTime();
			event.stopPropagation();
		},

		_handleDragMove : function ( event, x, y ) {
			var self = this,
				newY = self._$view[ 0 ].scrollTop,
				newX = self._$view[ 0 ].scrollLeft,
				distanceY =0;

			self._lastPos2 = y;
			self._prevPos.x = self._curPos.x;
			self._prevPos.y = self._curPos.y;
			self._curPos.x = x;
			self._curPos.y = y;
			self._startTime = getCurrentTime();
			if ( self._scrolling ) {
				if ( self._direction ) {
					distanceY = self._curPos.x - self._prevPos.x;
					newX = newX - distanceY;
				} else {
					distanceY = self._curPos.y - self._prevPos.y;
					newY = self._$view[ 0 ].scrollTop - distanceY;
				}
				self._setScrollPosition( newX, newY );
			} else {
				self._scrolling = true;
			}
		},

		_handleDragStop : function ( ) {
			var self = this,
				distanceY = self._curPos.y - self._prevPos.y,
				distanceX = self._curPos.x - self._prevPos.x;

			self._startMScroll(-distanceX, -distanceY);
		},

		_stopMScroll: function () {
			if ( this._timerID ) {
				clearTimeout( this._timerID );
			}
			this._timerID = 0;
			this._tracker.reset();
			this._disableTracking();
			this._hideScrollBar();
		},

		_startMScroll: function ( speedX, speedY ) {
			var self = this,
				keepGoing = false,
				duration = 1500,
				tracker = this._tracker,
				c, startYPos, speed,
				v;

			self._stopMScroll();
			self._showScrollBar();

			if ( tracker ) {
				if ( self._direction ) {
					c = this._$clip.width();
					v = this._$content.width();
					startYPos = this._$view[ 0 ].scrollLeft;
					speed = speedX;
				} else {
					c = this._$clip.height();
					v = this._$content.height();
					startYPos = this._$view[ 0 ].scrollTop;
					speed = speedY;
				}

				if ( (( startYPos === 0 && speedY > 0 ) ||
					( startYPos === (v - c) && speedY < 0 )) &&
						v > c ) {
					return;
				}

				tracker.start( startYPos, speed,
					duration, 0, (v > c) ? (v - c) : 0 );
				keepGoing = keepGoing || !tracker.done();
			}

			if ( keepGoing ) {
				this._timerID = setTimeout( this._timerCB, this._timerInterval );
			} else {
				this._stopMScroll();
			}
		},

		_enableTracking: function () {
			var self = this;
			self._$document.bind( self._dragMoveEvt, self._dragMoveCB );
			self._$document.bind( self._dragStopEvt, self._dragStopCB );
		},

		_disableTracking: function () {
			var self = this;
			self._$document.unbind( self._dragMoveEvt, self._dragMoveCB );
			self._$document.unbind( self._dragStopEvt, self._dragStopCB );
		},

		//----------------------------------------------------//
		//		Calculate size about dom element.		//
		//----------------------------------------------------//
		_setScrollPosition: function ( x, y ) {
			var self = this,
				$content =  self._$content ,
				storedScrollPos = self._storedScrollPos,
				curPos = self._direction ? x : y,
				diffPos = 0,
				attrName = null,
				templateItemSize =0,
				di = 0,
				i = 0,
				$row = null;

			if ( self._direction ) {
				curPos = x;
				templateItemSize = self._$templateItemSize.width;
				attrName = "left";
			} else {
				curPos = y;
				templateItemSize = self._$templateItemSize.height;
				attrName = "top";
			}
			diffPos = curPos - storedScrollPos;
			di = parseInt( diffPos / templateItemSize, 10 );

			if ( di > 0 && self._tailItemIdx < self._totalRowCnt ) { // scroll down
				for ( ; i < di; i++ ) {
					$row = $content.children("[row-index='"+self._headItemIdx+"']");
					self._tailItemIdx++;
					self._headItemIdx++;
					self._replaceRow( $row, self._tailItemIdx );
					self._clearSelectedDom();
				}
				self._storedScrollPos += di * templateItemSize;
			} else if ( di < 0 ) { // scroll up
				for ( ; i > di && self._headItemIdx > 0; i-- ) {
					$row = $content.children( "[row-index='" + self._tailItemIdx + "']" );
					self._headItemIdx--;
					self._replaceRow( $row, self._headItemIdx );
					self._tailItemIdx--;
					self._clearSelectedDom();
				}
				self._storedScrollPos += di * templateItemSize;
			}
			if ( diffPos < 0 ) {
				$row =  $content.children( "[row-index='" + self._headItemIdx + "']");
				if ( $row.position()[attrName] > curPos ) {
					$row = $content.children( "[row-index='" + self._tailItemIdx + "']" );
					self._headItemIdx--;
					self._replaceRow( $row, self._headItemIdx );
					self._tailItemIdx--;
				}
			}

			self._setScrollBarPos( x, y );
			if ( self._direction ) {
				self._$view[ 0 ].scrollLeft = x;
			} else {
				self._$view[ 0 ].scrollTop = y;
			}
		},

		//----------------------------------------------------//
		//		Calculate size about dom element.		//
		//----------------------------------------------------//
		_calculateClipSize : function ( attr ) {
			var self = this,
				paddingValue = 0,
				axis = attr === "height" ? true : false,
				difinedAttrName = axis ? "isDefinedHeight"  : "isDefinedWidth",
				clipSize = 0,
				paddingName1, paddingName2, header, footer, $parent, $view;

			if ( self._inheritedSize[ difinedAttrName ] ) {
				return self._inheritedSize[ attr ];
			}

			$view = self._$clip;
			$parent = $view.parents( ".ui-content" );

			if ( axis ) {
				clipSize = $( window).innerHeight();
				header = $parent.siblings( ".ui-header" );
				footer = $parent.siblings( ".ui-footer" );
				clipSize = clipSize - ( header.outerHeight( true ) || 0);
				clipSize = clipSize - ( footer.outerHeight( true ) || 0);
				paddingName1 = "padding-top";
				paddingName2 = "padding-bottom";
			} else {
				// IE 8 does not support window.inner
				clipSize = $( window).innerWidth();
				paddingName1 = "padding-left";
				paddingName2 = "padding-right";
			}

			if ( $parent ) {
				paddingValue = parseInt( $parent.css( paddingName1 ), 10 );
				clipSize = clipSize - ( paddingValue || 0 );
				paddingValue = parseInt( $parent.css( paddingName2 ), 10 );
				clipSize = clipSize - ( paddingValue || 0 );
			} else {
				clipSize = $view[ attr ]();
			}

			return clipSize;
		},

		// This method will take a size of template-item.
		_calculateTemplateItemSize : function () {
			var self = this,
				$tempBlock,
				$tempItem;

			$tempBlock = $ ( self._makeRow( 0 ) );
			$tempItem = $tempBlock.children().eq( 0 );
			self._$content.append( $tempBlock );
			self._$templateItemSize.width = $tempItem.outerWidth( true );
			self._$templateItemSize.height = $tempItem.outerHeight( true );
			$tempBlock.remove();
		},

		_calculateColumnCount : function () {
			var self = this,
				$view = $( self.element ).parents( ".ui-content" ) || $( self.element ),
				viewSize = self._direction ? $view.innerHeight() : $view.innerWidth(),
				templateSize = self._direction ? self._$templateItemSize.height : self._$templateItemSize.width,
				isDefined = false,
				itemCount = 0;

			isDefined = self._direction ? this._inheritedSize.isDefinedHeight : this._inheritedSize.isDefinedWidth;

			if ( isDefined ) {
				viewSize =  self._direction ? this._inheritedSize.height : this._inheritedSize.width;
			} else {
				if ( self._direction ) {
					viewSize = viewSize - ( parseInt( $view.css( "padding-top" ), 10 ) + parseInt( $view.css( "padding-bottom" ), 10 ) );
				} else {
					viewSize = viewSize - ( parseInt( $view.css( "padding-left" ), 10 ) + parseInt( $view.css( "padding-right" ), 10 ) );
				}
				if ( viewSize < templateSize * self._numItemData ) {
					viewSize = viewSize - ( self._scrollBarWidth );
				}
			}

			itemCount = parseInt( ( viewSize / templateSize ), 10);
			return itemCount > 0 ? itemCount : 1 ;
		},

		_calculateRowCount : function( viewSize, itemSize ) {
			var ret = 0;

			ret = viewSize / itemSize;
			ret = Math.ceil( ret );
			return parseInt( ret, 10);
		},

		//----------------------------------------------------//
		//		Scrollbar		//
		//----------------------------------------------------//
		_createScrollBar : function () {
			var self = this,
				$scrollBar,
				prefix = "<div class=\"ui-scrollbar ui-scrollbar-",
				suffix = "\"><div class=\"ui-scrollbar-track\"><div class=\"ui-scrollbar-thumb\"></div></div></div>";

			if ( self._eventType !== "touch" ) {
				return ;
			}

			// add utility function.
			self._setScrollBarPos = function ( x, y ) {
				var self = this,
					pos = 0,
					$scrollBar = self._$scrollBar;

				if ( self._direction ) {
					pos = x + ( self._movePos * parseInt( x / self._$templateItemSize.width, 10 ) );
					$scrollBar[ 0 ].style.left =  pos  + "px";
				} else {
					pos = y + ( self._movePos * parseInt( y / self._$templateItemSize.height, 10 ) );
					pos = Math.floor( pos );
					$scrollBar[ 0 ].style.top =  pos  + "px";
				}
			};

			self._hideScrollBar = function ( ) {
				self._$scrollBar[ 0 ].style.opacity = 1;
			};

			self._showScrollBar = function ( ) {
				self._$scrollBar[ 0 ].style.opacity = 1;
			};

			// make DOM Element.
			if ( self._direction ) {
				$scrollBar = $( prefix + "x" + suffix );
				self._$view.css("overflow-y", "hidden");
				self._$content[ 0 ].style.height = ( self._$clipSize.height -  self._scrollBarWidth ) +"px";
			} else {
				$scrollBar = $( prefix + "y" + suffix );
			}
			self._$content.append( $scrollBar );
			self._$scrollBar = $scrollBar.find( ".ui-scrollbar-thumb" );
			self._hideScrollBar();
		},

		_setScrollBarSize : function () {
			var self = this,
				size = 0,
				$scrollBar = self._$scrollBar;

			if ( self._eventType !== "touch" ) {
				return ;
			}

			if (self._direction ) {
				self._$content[ 0 ].style.height = ( self._$clipSize.height -  self._scrollBarWidth ) +"px";
			}

			if ( self._direction ) {
				size = parseInt( ( self._$clipSize.width / self._$content.width() ) * 100 , 10 );
				size = size + 15;
				self._movePos = ( self._$clipSize.width - size ) / ( self._totalRowCnt - ( self._rowsPerView - 1 ) );
				$scrollBar.width( size );
			} else {
				size = parseInt ( ( self._$clipSize.height / self._$content.height() ) * 100 , 10 );
				size = size + 15;
				self._movePos = ( self._$clipSize.height - size ) / ( self._totalRowCnt - ( self._rowsPerView - 1 ) );
				$scrollBar.height( size );
			}
		},

		//----------------------------------------------------//
		//		DOM Element handle		//
		//----------------------------------------------------//
		_makeRows : function ( count ) {
			var self = this,
				index = 0,
				$row = null,
				children = [];

			for ( index = 0; index < count ; index += 1 ) {
				$row = $( self._makeRow( index ) );

				$row.children().detach().appendTo( $row ); // <-- layout
				if ( self._direction ) {
					$row[ 0 ].style.top = "0px";
					$row[ 0 ].style.left = ( index * self._$templateItemSize.width )+"px";
				}
				children[ index ] = $row;
			}
			return children;
		},

		// make a single row block
		_makeRow : function ( rowIndex ) {
			var self = this,
				index = rowIndex * self._itemCount,
				colIndex = 0,
				attrName = "left",
				blockClassName = "ui-virtualgrid-wrapblock-y ",
				wrapBlock = self._createElement( "div" ),
				strWrapInner = "";

			if ( self._direction ) {
				attrName = "top";
				blockClassName = "ui-virtualgrid-wrapblock-x ";
			}
			for ( colIndex = 0; colIndex < self._itemCount && index < self._numItemData ; colIndex++ ) {
				strWrapInner += self._makeHtmlData( index, index, attrName );
				index += 1;
			}
			wrapBlock.innerHTML = strWrapInner;
			wrapBlock.setAttribute( "class", blockClassName );
			wrapBlock.setAttribute( "row-index", String( rowIndex ) );
			wrapBlock.style.position = "absolute";
			if ( self._direction ) {
				wrapBlock.style.left = ( rowIndex * self._$templateItemSize.width ) + "px";
				wrapBlock.style.width = self._$templateItemSize.width + "px";
			} else {
				wrapBlock.style.top = ( rowIndex * self._$templateItemSize.height ) + "px";
			}
			return wrapBlock;
		},

		_makeHtmlData : function ( myTemplate, dataIndex, colIndex ) {
			var self = this,
				htmlStr = "",
				itemData = null,
				attrName = self._direction ? "top" : "left";

			itemData = self._itemData( dataIndex );
			if ( itemData ) {
				htmlStr = self._convertTmplToStr( itemData );
				htmlStr = self._insertPosToTmplStr( htmlStr, attrName, ( colIndex * self._cellOtherSize ) );
			}
			return htmlStr;
		},

		_insertPosToTmplStr : function ( tmplStr, attrName, posVal ) {
			var tagCloseIdx = tmplStr.indexOf( ">" ),
				classIdx = -1,
				firstPart,
				lastPart,
				result,
				found = false,
				targetIdx = 0,
				firstPartLen,
				i = 0;

			if ( tagCloseIdx === -1 ) {
				return;
			}

			firstPart = tmplStr.slice( 0, tagCloseIdx );
			lastPart = tmplStr.slice( tagCloseIdx, tmplStr.length );

			classIdx = firstPart.indexOf( "class" );

			if ( classIdx !== -1 ) {
				firstPartLen = firstPart.length;
				for ( i = classIdx + 6; i < firstPartLen; i++ ) {
					if ( firstPart.charAt( i ) === "\"" || firstPart.charAt( i ) === "\'" ) {
						if ( found === false ) {
							found = true;
						} else {
							targetIdx = i;
							break;
						}
					}
				}
				result = firstPart.slice( 0, targetIdx ) + " virtualgrid-item" + firstPart.slice( targetIdx, firstPartLen ) + lastPart;
			} else {
				result = firstPart + " class=\"virtualgrid-item\"" + lastPart;
			}

			if ( !isNaN( posVal ) ) {
				result = result.replace( ">", " style=\"" + attrName + ": " + String( posVal ) + "px\">");
			}
			return result;
		},

		// TODO : supprot x - axis.
		_getCriteriaRow : function () {
			var $row,
				index = this._headItemIdx,
				$content = this._$content,
				scrollPos = this._direction ? this._$view[ 0 ].scrollLeft : this._$view[ 0 ].scrollTop,
				filterCondition = 0;

			filterCondition = scrollPos - ( this._$templateItemSize[ this._cssAttributeName ] * 0.9 );
			do {
				$row = $content. children( "[row-index='" + index + "']" );
				if ( $row && $row.position()[ this._posAttributeName ] >= filterCondition ) {
					break;
				}
				index++;
			} while ( $row.length );
			return { target : $row, index : index };
		},

		_replaceRows : function () {
			var self = this,
				$rows = self._$content.children( "[row-index]" ),
				$row,
				rowIndex = 0,
				rowsLength = $rows.length,
				idx = 0,
				diff = 0,
				ret = self._getCriteriaRow(),
				dataIndex = ret.index * ret.target.children().length;

			dataIndex = dataIndex % self._itemCount === 0 ? dataIndex / self._itemCount : Math.floor( dataIndex / self._itemCount );
			diff = ret.index - dataIndex;

			for ( ; idx < rowsLength ; idx++ ) {
				$row = $( $rows[ idx ] );
				rowIndex = parseInt( $row.attr( "row-index" ), 10 );
				self._replaceRow( $row, rowIndex - diff );
			}

			if ( self._direction ) {
				self._$view[ 0 ].scrollLeft = ret.target.position().left + ( self._$view[ 0 ].scrollLeft % self._$templateItemSize.width );
				self._storedScrollPos = self._$view[ 0 ].scrollLeft;
			} else {
				self._$view[ 0 ].scrollTop = ret.target.position().top + ( self._$view[ 0 ].scrollTop % self._$templateItemSize.height );
				self._storedScrollPos = self._$view[ 0 ].scrollTop;
			}
			self._headItemIdx = self._headItemIdx - diff;
			self._tailItemIdx = self._tailItemIdx - diff;
		},

		_replaceRow : function ( block, index ) {
			var self = this,
				$block = block.hasChildNodes ? block : block[ 0 ],
				length = 0,
				idx = 0,
				dataIndex = 0, data = null, $children,
				tempBlocks = null;

			if ( !$block ) {
				return ;
			}

			$children = $block.children;
			if( self._replaceHelper &&  self._itemCount === $children.length ) {
				dataIndex = index * self._itemCount;
				length = self._itemCount;
				for ( ; idx < length ;  idx++) {
					data = self._itemData( dataIndex + idx );
					if (  $children[ idx ] && data ) {
						self._replaceHelper(  $children[ idx], data );
						$children[ idx ].style.display = "inline-block";
					} else if (  $children[ idx ] && !data ) {
						$children[ idx ].style.display = "none";
					}
				}
			} else {
				while ( $block.hasChildNodes() ) {
					$block.removeChild( $block.lastChild );
				}
				tempBlocks = self._makeRow( index );
				while ( tempBlocks.children.length ) {
					$block.appendChild( tempBlocks.children[ 0 ] );
				}
				tempBlocks.parentNode.removeChild( tempBlocks );
			}

			if ( self._direction ) {
				$block.style.left = ( index * self._$templateItemSize.width ) + "px";
			} else {
				$block.style.top = ( index * self._$templateItemSize.height ) + "px";
			}
			$block.setAttribute("row-index", index );
		},

		_increaseRow : function ( num ) {
			var $row = null,
				idx = 0,
				itemSize =  this._direction ? this._$templateItemSize. width :  this._$templateItemSize. height;


			for ( ; idx < num ; idx++ ) {
				if ( this._tailItemIdx + 1 >  this._totalRowCnt ) {
					this._headItemIdx -= 1;
					$row = $( this._makeRow( this._headItemIdx ) );
					this._storedScrollPos -= itemSize;
				} else {
					this._tailItemIdx += 1;
					$row = $( this._makeRow( this._tailItemIdx ) );
				}
				this._$content.append( $row );
			}
		},

		_decreaseRow : function ( num ) {
			var self = this,
				idx = 0;

			for ( ; idx < num ; idx++ ) {
				self._$content.children ( "[row-index = "+( self._tailItemIdx - idx )+"]" ).remove();
			}
			self._tailItemIdx -= num;
		},

		_getObjectNames : function ( obj ) {
			var properties = [],
				name = "";

			for ( name in obj ) {
				properties.push( name );
			}
			this._properties = properties;
		},

		_tmpl : function ( data ){
			var self = this,
				idx = 0,
				plainMsg,
				ret;
			if ( !data ) {
				return ;
			}

			plainMsg = self._template.text() || self._template.html();
			for ( idx = 0 ; idx < self._properties.length ; idx++ ) {
				plainMsg = self._strReplace( plainMsg, "${" + self._properties[idx] +"}" , data[ self._properties[ idx ] ] );
			}
			ret = $( plainMsg );
			return ret;
		},

		_convertTmplToStr : function ( data ) {
			var self = this,
				idx = 0,
				plainMsg;

			if ( !data ) {
				return ;
			}
			plainMsg = self._template.text() || self._template.html();
			for ( idx = 0 ; idx < self._properties.length ; idx++ ) {
				plainMsg = self._strReplace( plainMsg, "${" + self._properties[ idx ] + "}" , data[ self._properties[ idx ] ] );
			}
			return plainMsg;
		},

		_strReplace : function(plainMsg, stringToFind,stringToReplace){
			var temp = plainMsg,
				index = plainMsg.indexOf( stringToFind );
			while (index !== -1) {
				temp = temp.replace( stringToFind, stringToReplace );
				index = temp.indexOf( stringToFind );
			}
			return temp;
		},

		_clearSelectedDom : function ( ) {
			if ( window.getSelection ) { // Mozilla
				window.getSelection().removeAllRanges();
			} else { // IE
				document.selection.empty();
			}
		},

		_showErrorMessage: function ( message ) {
			// show error message
			$.mobile.loading( "show", $.mobile.pageLoadErrorMessageTheme, message, true );
			// hide after delay
			setTimeout( function() { $.mobile.loading( "hide" ); }, 3000 );
		}
	} );

} (jQuery, window, document) );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
