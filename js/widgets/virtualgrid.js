//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description:
//>>label: virtualgrid
//>>group: Widget

define( [
	"jqm/jquery",
	"jqm/jquery.mobile.widget",
	"../../../libs/js/jquery.easing.1.3",
	"../../../libs/js/jquery.mobile.scrollview.js" ], function( $ ) {
//>>excludeEnd("jqmBuildExclude");

( function ($, window, document, undefined) {

	function circularNum (num, total) {
		var n = num % total;
		if (n < 0) {
			n = total + n;
		}
		return n;
	}

	function MomentumTracker (options) {
		this.options = $.extend({}, options);
		this.easing = "easeOutQuad";
		this.reset();
	}

	var tstates = {
		scrolling : 0,
		done : 1
	};

	function getCurrentTime () {
		return Date.now();
	}

	$.extend (MomentumTracker.prototype, {
		start : function (pos, speed, duration) {
			this.state = (speed !== 0 ) ? tstates.scrolling : tstates.done;
			this.pos = pos;
			this.speed = speed;
			this.duration = duration;

			this.fromPos = 0;
			this.toPos = 0;

			this.startTime = getCurrentTime();
		},

		reset : function () {
			this.state = tstates.done;
			this.pos = 0;
			this.speed = 0;
			this.duration = 0;
		},

		update : function () {
			var state = this.state, duration, elapsed, dx, x;

			if (state === tstates.done) {
				return this.pos;
			}
			duration = this.duration;
			elapsed = getCurrentTime () - this.startTime;
			elapsed = elapsed > duration ? duration : elapsed;
			dx = this.speed * (1 - $.easing[this.easing] (elapsed / duration, elapsed, 0, 1, duration) );
			x = this.pos + dx;
			this.pos = x;

			if (elapsed >= duration) {
				this.state = tstates.done;
			}
			return this.pos;
		},

		done : function () {
			return this.state === tstates.done;
		},

		getPosition : function () {
			return this.pos;
		}
	});

	jQuery.widget ("mobile.virtualgrid", jQuery.mobile.widget, {
		options : {
			// virtualgrid option
			template : "",
			direction : "y",
			rotation : false,
			initSelector: ":jqmData(role='virtualgrid')"
		},

		create : function () {
			this._create.apply( this, arguments );
		},

		_create : function ( args ) {
			$.extend(this, {
				// view
				_$view : null,
				_$clip : null,
				_$rows : null,
				_tracker : null,
				_viewSize : 0,
				_clipSize : 0,
				_cellSize : undefined,
				_currentItemCount : 0,
				_itemCount : 1,
				_inheritedSize : null,

				// timer
				_timerInterval : 0,
				_timerID : 0,
				_timerCB : null,
				_lastMove : null,

				// Data
				_itemData : function ( idx ) { return null; },
				_numItemData : 0,
				_cacheItemData : function ( minIdx, maxIdx ) { },
				_totalRowCnt : 0,
				_template : null,
				_maxViewSize : 0,
				_modifyViewPos : 0,
				_maxSize : 0,

				// axis - ( true : x , false : y )
				_direction : false,
				_didDrag : true,
				_reservedPos : 0,
				_scalableSize : 0,
				_eventPos : 0,
				_nextPos : 0,
				_movePos : 0,
				_lastY : 0,
				_speedY : 0,
				_lastX : 0,
				_speedX : 0,
				_rowsPerView : 0,
				_fragment : null,

				_filterRatio : 0.9
			});

			var self = this,
				$dom = $( self.element ),
				opts = self.options,
				$item = null;

			// itemData
			// If mandatory options are not given, Do nothing.
			if ( !args ) {
				return ;
			}

			if ( !self._loadData( args ) ) {
				return;
			}

			// make a fragment.
			self._fragment = document.createDocumentFragment();

			// read defined properties(width and height) from dom element.
			self._inheritedSize = self._getinheritedSize(self.element);

			// set a scroll direction.
			self._direction = opts.direction === 'x' ? true : false;

			// make view layer
			self._$clip = $( self.element ).addClass("ui-scrollview-clip").addClass("ui-virtualgrid-view");
			$item = $( document.createElement("div") ).addClass("ui-scrollview-view");
			self._clipSize =  self._calculateClipSize();
			self._$clip.append($item);
			self._$view = $item;
			self._$clip.css("overflow", "hidden");
			self._$view.css("overflow", "hidden");

			// inherit from scrollview widget.
			self._scrollView = $.mobile.scrollview.prototype;
			self._initScrollView();

			// create tracker.
			self._createTracker();
			self._makePositioned(self._$clip);
			self._timerInterval = 1000 / self.options.fps;

			self._timerID = 0;
			self._timerCB = function () {
				self._handleMomentumScroll();
			};
			$dom.closest(".ui-content").addClass("ui-virtualgrid-content").css("overflow", "hidden");

			// add event handler.
			self._addBehaviors();

			self._currentItemCount = 0;
			self._createScrollBar();
			self.refresh();
		},

		// The argument is checked for compliance with the specified format.
		// @param args   : Object
		// @return boolean
		_loadData : function ( args ) {
			var self = this;

			if ( args.itemData && typeof args.itemData === 'function'  ) {
				self._itemData = args.itemData;
			} else {
				return false;
			}
			if ( args.numItemData ) {
				if ( typeof args.numItemData === 'function' ) {
					self._numItemData = args.numItemData( );
				} else if ( typeof args.numItemData === 'number' ) {
					self._numItemData = args.numItemData;
				} else {
					return false;
				}
			} else {
				return false;
			}
			self._getObjectNames( self._itemData(0) );
			return true;
		},

		// Make up the first screen.
		_initLayout: function () {
			var self = this,
				opts = self.options,
				i,
				$row;

			for ( i = -1; i < self._rowsPerView + 1; i += 1 ) {
				$row = self._$rows[ circularNum( i, self._$rows.length ) ];
				self._$view.append( $row );
			}
			self._setElementTransform( -self._cellSize );

			self._replaceRow(self._$view.children().eq( 0 ), self._totalRowCnt - 1);
			if ( opts.rotation && self._rowsPerView >= self._totalRowCnt ) {
				self._replaceRow(self._$view.children().eq( -1 ), 0);
			}
			self._setViewSize();
		},

		_setViewSize : function () {
			var self = this,
				height = 0,
				width = 0;

			if ( self._direction ) {
				width = self._cellSize * ( self._rowsPerView + 2 );
				width = parseInt(width, 10) + 1;
				self._$view.width( width );
				self._viewSize = self._$view.width();
			} else {
				self._$view.height( self._cellSize * ( self._rowsPerView + 2 ) );
				self._$clip.height( self._clipSize );
				self._viewSize = self._$view.height();
			}
		},

		_getViewHeight : function () {
			var self = this;
			return self._$view.height();
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

			width = self._calculateClipWidth();
			height = self._calculateClipHeight();
			self._$view.width(width).height(height);
			self._$clip.width(width).height(height);

			self._clipSize = self._calculateClipSize();
			self._calculateColumnSize();
			self._initPageProperty();
			self._setScrollBarSize();
		},

		_initPageProperty : function () {
			var self = this,
				rowsPerView = 0,
				$child,
				columnCount = 0,
				totalRowCnt = 0,
				attributeName = self._direction ? "width" : "height";

			columnCount = self._calculateColumnCount();

			totalRowCnt = parseInt(self._numItemData / columnCount , 10 );
			self._totalRowCnt = self._numItemData % columnCount === 0 ? totalRowCnt : totalRowCnt + 1;
			self._itemCount = columnCount;

			if ( self._cellSize <= 0) {
				return ;
			}

			rowsPerView = self._clipSize / self._cellSize;
			rowsPerView = Math.ceil( rowsPerView );
			self._rowsPerView = parseInt( rowsPerView, 10);

			$child = self._makeRows( rowsPerView + 2 );
			$(self._$view).append($child.children());
			self._$view.children().css(attributeName, self._cellSize + "px");
			self._$rows = self._$view.children().detach();

			self._reservedPos = -self._cellSize;
			self._scalableSize = -self._cellSize;

			self._initLayout();

			self._blockScroll = self._rowsPerView > self._totalRowCnt;
			self._maxSize = ( self._totalRowCnt - self._rowsPerView ) * self._cellSize;
			self._maxViewSize = ( self._rowsPerView ) * self._cellSize;
			self._modifyViewPos = -self._cellSize;
			if ( self._clipSize < self._maxViewSize ) {
				self._modifyViewPos = (-self._cellSize) + ( self._clipSize - self._maxViewSize );
			}
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

			while ( $target[0].nodeType === Node.ELEMENT_NODE && (ret.isDefinedWidth === false || ret.isHeightDefined === false )) {
				height = $target[0].style.height;
				width = $target[0].style.width;

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

		resize : function ( ) {
			var self = this,
				ret = null,
				rowsPerView = 0,
				itemCount = 0,
				totalRowCnt = 0,
				diffRowCnt = 0,
				clipSize = 0,
				prevcnt = 0,
				clipPosition = 0;

			itemCount = self._calculateColumnCount();
			if ( itemCount !== self._itemCount ) {
				totalRowCnt = parseInt(self._numItemData / itemCount , 10 );
				self._totalRowCnt = self._numItemData % itemCount === 0 ? totalRowCnt : totalRowCnt + 1;
				prevcnt = self._itemCount;
				self._itemCount = itemCount;
				clipPosition = self._getClipPosition();
				self._$view.hide();

				diffRowCnt = self._replaceRows(itemCount, prevcnt, self._totalRowCnt, clipPosition);
				self._maxSize = ( self._totalRowCnt - self._rowsPerView ) * self._cellSize;
				self._scalableSize += (-diffRowCnt) * self._cellSize;
				self._reservedPos  += (-diffRowCnt) * self._cellSize;
				self._setScrollBarSize();
				self._setScrollBarPosition(diffRowCnt);

				self._$view.show();
			}

			clipSize = self._calculateClipSize();
			if ( clipSize !== self._clipSize ) {
				rowsPerView = clipSize / self._cellSize;
				rowsPerView = parseInt( Math.ceil( rowsPerView ), 10 );

				if ( rowsPerView > self._rowsPerView ) {
					// increase row.
					self._increaseRow( rowsPerView - self._rowsPerView );
				} else if ( rowsPerView < self._rowsPerView ) {
					// decrease row.
					self._decreaseRow( self._rowsPerView - rowsPerView );
				}
				self._rowsPerView = rowsPerView;
				self._clipSize = clipSize;
				self._blockScroll = self._rowsPerView > self._totalRowCnt;
				self._maxSize = ( self._totalRowCnt - self._rowsPerView ) * self._cellSize;
				self._maxViewSize = ( self._rowsPerView ) * self._cellSize;
				if ( self._clipSize < self._maxViewSize ) {
					self._modifyViewPos = (-self._cellSize) + ( self._clipSize - self._maxViewSize );
				}
				if ( self._direction ) {
					self._$clip.width(self._clipSize);
				} else {
					self._$clip.height(self._clipSize);
				}
				self._setScrollBarSize();
				self._setScrollBarPosition(0);
				self._setViewSize();
			}
		},

		_initScrollView : function () {
			var self = this;
			$.extend(self.options, self._scrollView.options);
			self.options.moveThreshold = 10;
			self.options.showScrollBars = false;
			self._getScrollHierarchy = self._scrollView._getScrollHierarchy;
			self._makePositioned =  self._scrollView._makePositioned;
			self._set_scrollbar_size = self._scrollView._set_scrollbar_size;
			self._hideOverflowIndicator = self._scrollView._hideOverflowIndicator;
			self._showOverflowIndicator = self._scrollView._showOverflowIndicator;
			self._setGestureScroll = self._scrollView._setGestureScroll;
		},

		_setStyleTransform: function ( $ele, x, y, duration ) {
			var translate,
				transition;

			if ( this._endEffect ) {
				return;
			}

			if ( !duration || duration === undefined ) {
				transition = "none";
			} else {
				transition =  "-webkit-transform " + duration / 1000 + "s ease-out";
			}

			if ( $.support.cssTransform3d ) {
				translate = "translate3d(" + x + "," + y + ", 0px)";
			} else {
				translate = "translate(" + x + "," + y + ")";
			}

			$ele.css({
				"-moz-transform": translate,
				"-webkit-transform": translate,
				"-ms-transform": translate,
				"-o-transform": translate,
				"transform": translate,
				"-webkit-transition": transition
			});
		},

		_createTracker : function () {
			var self = this;

			self._tracker = new MomentumTracker(self.options);
			if ( self._direction ) {
				self._hTracker = self._tracker;
				self._$clip.width(self._clipSize);
			} else {
				self._vTracker = self._tracker;
				self._$clip.height(self._clipSize);
			}
		},

		//----------------------------------------------------//
		//		Scrollbar		//
		//----------------------------------------------------//
		_createScrollBar : function () {
			var self = this,
				prefix = "<div class=\"ui-scrollbar ui-scrollbar-",
				suffix = "\"><div class=\"ui-scrollbar-track\"><div class=\"ui-scrollbar-thumb\"></div></div></div>";

			if ( self.options.rotation ) {
				return ;
			}

			if ( self._direction ) {
				self._$clip.append( prefix + "x" + suffix );
				self._hScrollBar = $(self._$clip.children(".ui-scrollbar-x"));
				self._hScrollBar.find(".ui-scrollbar-thumb").addClass("ui-scrollbar-thumb-x");
			} else {
				self._$clip.append( prefix + "y" + suffix );
				self._vScrollBar = $(self._$clip.children(".ui-scrollbar-y"));
				self._vScrollBar.find(".ui-scrollbar-thumb").addClass("ui-scrollbar-thumb-y");
			}
		},

		_setScrollBarSize: function () {
			var self = this,
				scrollBarSize = 0,
				currentSize = 0,
				$scrollBar,
				attrName,
				className;

			if ( self.options.rotation ) {
				return ;
			}

			scrollBarSize = parseInt( self._maxViewSize / self._clipSize , 10);
			if ( self._direction ) {
				$scrollBar = self._hScrollBar.find(".ui-scrollbar-thumb");
				attrName = "width";
				currentSize = $scrollBar.width();
				className = "ui-scrollbar-thumb-x";
				self._hScrollBar.css("width", self._clipSize);
			} else {
				$scrollBar = self._vScrollBar.find(".ui-scrollbar-thumb");
				attrName = "height";
				className = "ui-scrollbar-thumb-y";
				currentSize = $scrollBar.height();
				self._vScrollBar.css("height", self._clipSize);
			}

			if ( scrollBarSize > currentSize ) {
				$scrollBar.removeClass(className);
				$scrollBar.css(attrName, scrollBarSize);
			} else {
				scrollBarSize = currentSize;
			}

			self._itemScrollSize = parseFloat( ( self._clipSize - scrollBarSize ) / ( self._totalRowCnt - self._rowsPerView ) );
			self._itemScrollSize = Math.round(self._itemScrollSize * 100) / 100;
		},

		_setScrollBarPosition : function ( di, duration ) {
			var self = this,
				$sbt = null,
				x = "0px",
				y = "0px";

			if ( self.options.rotation ) {
				return ;
			}

			self._currentItemCount = self._currentItemCount + di;
			if ( self._vScrollBar ) {
				$sbt = self._vScrollBar .find(".ui-scrollbar-thumb");
				y = ( self._currentItemCount * self._itemScrollSize ) + "px";
			} else {
				$sbt = self._hScrollBar .find(".ui-scrollbar-thumb");
				x = ( self._currentItemCount * self._itemScrollSize ) + "px";
			}
			self._setStyleTransform( $sbt, x, y, duration );
		},

		_hideScrollBars : function () {
			var self = this,
				vclass = "ui-scrollbar-visible";

			if ( self.options.rotation ) {
				return ;
			}

			if ( self._vScrollBar ) {
				self._vScrollBar.removeClass( vclass );
			} else {
				self._hScrollBar.removeClass( vclass );
			}
		},

		_showScrollBars : function () {
			var self = this,
				vclass = "ui-scrollbar-visible";

			if ( self.options.rotation ) {
				return ;
			}

			if ( self._vScrollBar ) {
				self._vScrollBar.addClass( vclass );
			} else {
				self._hScrollBar.addClass( vclass );
			}
		},

		//----------------------------------------------------//
		//		scroll process		//
		//----------------------------------------------------//
		centerTo: function ( selector ) {
			var self = this,
				i,
				newX = 0,
				newY = 0;

			if ( !self.options.rotation || !self._$rows ) {
				return;
			}

			for ( i = 0; i < self._$rows.length; i++ ) {
				if ( $( self._$rows[i]).hasClass( selector ) ) {
					if ( self._direction ) {
						newX = -( i * self._cellSize - self._clipSize / 2 + self._cellSize * 2 );
					} else {
						newY = -( i * self._cellSize - self._clipSize / 2 + self._cellSize * 2 );
					}
					self.scrollTo( newX, newY );
					return;
				}
			}
		},

		scrollTo: function ( x, y, duration ) {
			var self = this;
			if ( self._direction ) {
				self._sx = self._reservedPos;
				self._reservedPos = x;
			} else {
				self._sy = self._reservedPos;
				self._reservedPos = y;
			}
			self._scrollView.scrollTo.apply( this, [ x, y, duration ] );
		},

		getScrollPosition: function () {
			if ( this.direction ) {
				return { x: -this._ry, y: 0 };
			}
			return { x: 0, y: -this._ry };
		},

		_setScrollPosition: function ( x, y ) {
			var self = this,
				sy = self._scalableSize,
				distance = self._direction ? x : y,
				dy = distance - sy,
				di = parseInt( dy / self._cellSize, 10 ),
				i = 0,
				idx = 0,
				$row = null;

			if ( self._blockScroll ) {
				return ;
			}

			if ( ! self.options.rotation ) {
				if ( dy > 0 && distance >= -self._cellSize && self._scalableSize >= -self._cellSize ) {
					// top
					self._stopMScroll();
					self._scalableSize = -self._cellSize;
					self._setElementTransform( -self._cellSize );
					return;
				}
				if ( (dy < 0 && self._scalableSize <= -(self._maxSize + self._cellSize) )) {
					// bottom
					self._stopMScroll();
					self._scalableSize = -(self._maxSize + self._cellSize);
					self._setElementTransform( self._modifyViewPos );
					return;
				}
			}

			if ( di > 0 ) { // scroll up
				for ( i = 0; i < di; i++ ) {
					idx = -parseInt( ( sy / self._cellSize ) + i + 3, 10 );
					$row = self._$view.children( ).eq( -1 ).detach( );
					self._replaceRow( $row, circularNum( idx, self._totalRowCnt ) );
					self._$view.prepend( $row );
					self._setScrollBarPosition(-1);
				}
			} else if ( di < 0 ) { // scroll down
				for ( i = 0; i > di; i-- ) {
					idx = self._rowsPerView - parseInt( ( sy / self._cellSize ) + i, 10 );
					$row = self._$view.children().eq( 0 ).detach();
					self._replaceRow($row, circularNum( idx, self._totalRowCnt ) );
					self._$view.append( $row );
					self._setScrollBarPosition(1);
				}
			}
			self._scalableSize += di * self._cellSize;
			self._setElementTransform( distance - self._scalableSize - self._cellSize );
		},

		_setElementTransform : function ( value ) {
			var self = this,
				x = 0,
				y = 0;

			if ( self._direction ) {
				x = value + "px";
			} else {
				y = value + "px";
			}
			self._setStyleTransform(self._$view, x, y );
		},

		//----------------------------------------------------//
		//		Event handler		//
		//----------------------------------------------------//
		_handleMomentumScroll: function () {
			var self = this,
				opts = self.options,
				keepGoing = false,
				v = this._$view,
				x = 0,
				y = 0,
				t = self._tracker;

			if ( t ) {
				t.update();
				if ( self._direction ) {
					x = t.getPosition();
				} else {
					y = t.getPosition();
				}
				keepGoing = !t.done();
			}

			self._setScrollPosition( x, y );
			if ( !opts.rotation ) {
				keepGoing = !t.done();
				self._reservedPos = self._direction ? x : y;
				// bottom
				self._reservedPos = self._reservedPos <= (-(self._maxSize - self._modifyViewPos)) ? ( - ( self._maxSize + self._cellSize) ) : self._reservedPos;
				// top
				self._reservedPos = self._reservedPos > -self._cellSize ? -self._cellSize : self._reservedPos;
			} else {
				self._reservedPos = self._direction ? x : y;
			}
			self._$clip.trigger( self.options.updateEventName, [ { x: x, y: y } ] );

			if ( keepGoing ) {
				self._timerID = setTimeout( self._timerCB, self._timerInterval );
			} else {
				self._stopMScroll();
			}
		},

		_startMScroll: function ( speedX, speedY ) {
			var self = this;
			if ( self._direction  ) {
				self._sx = self._reservedPos;
			} else {
				self._sy = self._reservedPos;
			}
			self._scrollView._startMScroll.apply(self, [speedX, speedY]);
		},

		_stopMScroll: function () {
			this._scrollView._stopMScroll.apply(this);
		},

		_enableTracking: function () {
			var self = this;
			self._$view.bind( self._dragMoveEvt, self._dragMoveCB );
			self._$view.bind( self._dragStopEvt, self._dragStopCB );
			self._scrollView._enableTracking.apply( self );
		},

		_disableTracking: function () {
			var self = this;
			self._$view.unbind( self._dragMoveEvt, self._dragMoveCB );
			self._$view.unbind( self._dragStopEvt, self._dragStopCB );
			self._scrollView._disableTracking.apply( self );
		},

		_handleDragStart: function ( e, ex, ey ) {
			var self = this;
			self._scrollView._handleDragStart.apply( this, [ e, ex, ey ] );
			self._eventPos = self._direction ? ex : ey;
			self._nextPos = self._reservedPos;
		},

		_handleDragMove: function ( e, ex, ey ) {
			var self = this,
				dx = ex - self._lastX,
				dy = ey - self._lastY,
				x = 0,
				y = 0;

			self._lastMove = getCurrentTime();
			self._speedX = dx;
			self._speedY = dy;

			self._didDrag = true;

			self._lastX = ex;
			self._lastY = ey;

			if ( self._direction ) {
				self._movePos = ex - self._eventPos;
				x = self._nextPos + self._movePos;
			} else {
				self._movePos = ey - self._eventPos;
				y = self._nextPos + self._movePos;
			}
			self._showScrollBars();
			self._setScrollPosition( x, y );
			return false;
		},

		_handleDragStop: function ( e ) {
			var self = this;

			self._reservedPos = self._movePos ? self._nextPos + self._movePos : self._reservedPos;
			self._scrollView._handleDragStop.apply( this, [ e ] );
			return self._didDrag ? false : undefined;
		},

		_addBehaviors: function () {
			var self = this;

			// scroll event handler.
			if ( self.options.eventType === "mouse" ) {
				self._dragStartEvt = "mousedown";
				self._dragStartCB = function ( e ) {
					return self._handleDragStart( e, e.clientX, e.clientY );
				};

				self._dragMoveEvt = "mousemove";
				self._dragMoveCB = function ( e ) {
					return self._handleDragMove( e, e.clientX, e.clientY );
				};

				self._dragStopEvt = "mouseup";
				self._dragStopCB = function ( e ) {
					return self._handleDragStop( e, e.clientX, e.clientY );
				};

				self._$view.bind( "vclick", function (e) {
					return !self._didDrag;
				} );
			} else { //touch
				self._dragStartEvt = "touchstart";
				self._dragStartCB = function ( e ) {
					var t = e.originalEvent.targetTouches[0];
					return self._handleDragStart(e, t.pageX, t.pageY );
				};

				self._dragMoveEvt = "touchmove";
				self._dragMoveCB = function ( e ) {
					var t = e.originalEvent.targetTouches[0];
					return self._handleDragMove(e, t.pageX, t.pageY );
				};

				self._dragStopEvt = "touchend";
				self._dragStopCB = function ( e ) {
					return self._handleDragStop( e );
				};
			}
			self._$view.bind( self._dragStartEvt, self._dragStartCB );

			// other events.
			self._$view.delegate(".virtualgrid-item", "click", function (event) {
				var $selectedItem = $( this );
				$selectedItem.trigger( "select", this );
			});

			$( window ).bind("resize", function ( e ) {
				var viewSize = 0,
					role = $(self.element).jqmData("role"),
					$virtualgrid = $(".ui-virtualgrid-view");

				if ( role === 'virtualgrid' ) {
					self._resizePageHeight();
					if ( self._direction ) {
						viewSize = self._calculateClipHeight();
						self._$view.height(viewSize);
						self._$clip.height(viewSize);
					} else {
						viewSize = self._calculateClipWidth();
						self._$view.width(viewSize);
						self._$clip.width(viewSize);
					}
					self.resize( );
				}
			});

			$(document).one("pageshow", function (event) {
				self._clipSize =  self._calculateClipSize();
				self._resizePageHeight();
				self._setScrollBarSize();
			});
		},

		_resizePageHeight: function () {
			var self = this,
				padding = 0,
				$page = $(self.element).parents(".ui-page"),
				$header = $page.find( ":jqmData(role='header')" ),
				$footer = $page.find( ":jqmData(role='footer')" ),
				$content = $page.find( ":jqmData(role='content')" ),
				footerHeight = $footer ? $footer.outerHeight() : 0,
				headerHeight = $header ? $header.outerHeight() : 0;

			if ( $page && $content ) {
				padding = parseInt( $content.css("padding-bottom"), 10) + parseInt( $content.css("padding-top"), 10);
				$content.height(window.innerHeight- headerHeight - footerHeight - padding).css("overflow", "hidden");
				$content.addClass("ui-virtualgrid-content");
				self._setScrollBarSize();
			}
		},

		//----------------------------------------------------//
		//		Calculate size about dom element.		//
		//----------------------------------------------------//
		_calculateClipSize : function () {
			var self = this,
				clipSize = 0;

			if ( self._direction ) {
				clipSize = self._calculateClipWidth();
			} else {
				clipSize = self._calculateClipHeight();
			}
			return clipSize;
		},

		_calculateClipWidth : function () {
			var self = this,
				view = $(self.element),
				$parent = view.parents(".ui-content"),
				paddingValue = 0,
				clipSize = $(window).width();

			if ( self._inheritedSize.isDefinedWidth ) {
				return self._inheritedSize.width;
			}

			if ( $parent ) {
				paddingValue = parseInt($parent.css("padding-left"), 10);
				clipSize = clipSize - ( paddingValue || 0 );
				paddingValue = parseInt($parent.css("padding-right"), 10);
				clipSize = clipSize - ( paddingValue || 0);
			} else {
				clipSize = view.width();
			}
			return clipSize;
		},

		_calculateClipHeight : function () {
			var self = this,
				$view = $(self.element),
				$parent = $view.closest(".ui-page"),
				header = null,
				footer = null,
				paddingValue = 0,
				clipSize = window.innerHeight;

			if ( self._inheritedSize.isDefinedHeight ) {
				return self._inheritedSize.height;
			}

			if ( $parent ) {
				paddingValue = parseInt($parent.css("padding-top"), 10);
				clipSize = clipSize - ( paddingValue || 0 );
				paddingValue = parseInt($parent.css("padding-bottom"), 10);
				clipSize = clipSize - ( paddingValue || 0);
				header = $parent.children(".ui-header");
				footer = $parent.children(".ui-footer");

				clipSize = clipSize - ( header.outerHeight(true) || 0);
				clipSize = clipSize - ( footer.outerHeight(true) || 0);
			} else {
				clipSize = $view.height();
			}
			return clipSize;
		},

		_calculateColumnSize : function () {
			var self = this,
				$tempBlock,
				$cell;

			$tempBlock = self._makeRows( 1 );
			self._$view.append( $tempBlock.children().eq( 0 ) );
			if ( self._direction ) {
				// x-axis
				self._viewSize = self._$view.width();
				$cell = self._$view.children().first().children().first();
				self._cellSize = $cell.outerWidth(true);
				self._cellOtherSize = $cell.outerHeight(true);
			} else {
				// y-axis
				self._viewSize = self._$view.height();
				$cell = self._$view.children().first().children().first();
				self._cellSize = $cell.outerHeight(true);
				self._cellOtherSize = $cell.outerWidth(true);
			}
			$tempBlock.remove();
			self._$view.children().remove();
		},

		_calculateColumnCount : function ( ) {
			var self = this,
				$view = $(self.element),
				viewSize = self._direction ? $view.innerHeight() : $view.innerWidth(),
				itemCount = 0 ;

			var pushViewSize = viewSize;
			if ( self._direction ) {
				viewSize = viewSize - ( parseInt( $view.css("padding-top"), 10 ) + parseInt( $view.css("padding-bottom"), 10 ) );
			} else {
				viewSize = viewSize - ( parseInt( $view.css("padding-left"), 10 ) + parseInt( $view.css("padding-right"), 10 ) );
			}

			itemCount = parseInt( (viewSize / self._cellOtherSize), 10);
			return itemCount > 0 ? itemCount : 1 ;
		},

		// Read the position of clip form property ('webkit-transform').
		// @return : number - position of clip.
		_getClipPosition : function () {
			var self = this,
				matrix = null,
				contents = null,
				result = -self._cellSize,
				$scrollview = self._$view.closest(".ui-scrollview-view");

			if ( $scrollview ) {
				matrix = $scrollview.css("-webkit-transform");
				contents = matrix.substr( 7 );
				contents = contents.substr( 0, contents.length - 1 );
				contents = contents.split( ', ' );
				result =  Math.abs(contents [5]);
			}
			return result;
		},

		//----------------------------------------------------//
		//		DOM Element handle		//
		//----------------------------------------------------//
		_makeRows : function ( count ) {
			var self = this,
				opts = self.options,
				index = 0,
				$row = null,
				$wrapper = null;

			$wrapper = $( self._createElement( "div" ) );
			$wrapper.addClass("ui-scrollview-view");
			for ( index = 0; index < count ; index += 1 ) {
				$row = self._makeRow( self._template, index );
				if ( self._direction ) {
					$row.css( "top", 0 ).css( "left", ( index * self._cellSize ) );
				}
				$wrapper.append( $row );
			}
			return $wrapper;
		},

		// make a single row block
		_makeRow : function ( myTemplate, rowIndex ) {
			var self = this,
				opts = self.options,
				index = rowIndex * self._itemCount,
				htmlData = null,
				itemData = null,
				colIndex = 0,
				attrName = self._direction ? "top" : "left",
				blockClassName = self._direction ? "ui-virtualgrid-wrapblock-x" : "ui-virtualgrid-wrapblock-y",
				blockAttrName = self._direction ? "top" : "left",
				wrapBlock = $( self._createElement( "div" ) );
				// wrapBlock = $( document.createElement( "div" ));

			wrapBlock.addClass( blockClassName ).attr("row-index", rowIndex);
			for ( colIndex = 0; colIndex < self._itemCount; colIndex++ ) {
				htmlData = self._makeHtmlData( myTemplate, index, colIndex);
				if ( htmlData ) {
					wrapBlock.append( htmlData );
				}
				index += 1;
			}
			return wrapBlock;
		},

		_makeHtmlData : function ( myTemplate, dataIndex, colIndex ) {
			var self = this,
				htmlData = null,
				itemData = null,
				attrName = self._direction ? "top" : "left";

			itemData = self._itemData( dataIndex );
			if ( itemData ) {
				htmlData = self._tmpl( itemData );
				htmlData.css(attrName, ( colIndex * self._cellOtherSize ) ).addClass( "virtualgrid-item" );
			}
			return htmlData;
		},

		_increaseRow : function ( num ) {
			var self = this,
				rotation = self.options.rotation,
				$row = null,
				headItemIndex = 0,
				tailItemIndex = 0,
				itemIndex = 0,
				size = self._scalableSize,
				idx = 0;

			headItemIndex = parseInt( $(self._$view.children().eq( 0 )).attr("row-index"), 10) - 1;
			tailItemIndex = parseInt( $(self._$view.children()[self._rowsPerView]).attr("row-index"), 10) + 1;

			for ( idx = 1 ; idx <= num ; idx++ ) {
				if ( tailItemIndex + idx  >= self._totalRowCnt ) {
					$row = self._makeRow( self._template, headItemIndex );
					self._$view.prepend($row);
					headItemIndex -= 1;
				} else {
					$row = self._makeRow( self._template, tailItemIndex + idx );
					self._$view.append($row);
				}
				if ( self._direction ) {
					$row.width(self._cellSize);
				} else {
					$row.height(self._cellSize);
				}
			}
		},

		_decreaseRow : function ( num ) {
			var self = this,
				idx = 0;

			for ( idx = 0 ; idx < num ; idx++ ) {
				self._$view.children().last().remove();
			}
		},

		_replaceRows : function ( curCnt, prevCnt, maxCnt, clipPosition ) {
			var self = this,
				$rows = self._$view.children(),
				prevRowIndex = 0,
				rowIndex = 0,
				diffRowCnt = 0,
				targetCnt = 1,
				filterCondition = ( self._filterRatio * self._cellSize) + self._cellSize,
				idx = 0;

			if ( filterCondition < clipPosition ) {
				targetCnt += 1;
			}

			prevRowIndex = parseInt( $($rows[targetCnt]).attr("row-index"), 10);
			if ( prevRowIndex === 0 ) {
				// only top.
				rowIndex = maxCnt - targetCnt;
			} else {
				rowIndex = Math.round( (prevRowIndex * prevCnt) / curCnt );
				if ( rowIndex + self._rowsPerView >= maxCnt ) {
					// only bottom.
					rowIndex = maxCnt - self._rowsPerView;
				}
				diffRowCnt = prevRowIndex - rowIndex;
				rowIndex -= targetCnt;
			}

			for ( idx = 0 ; idx < $rows.length ; idx += 1 ) {
				self._replaceRow($rows[idx], circularNum( rowIndex, self._totalRowCnt ));
				rowIndex++;
			}
			return -diffRowCnt;
		},

		_replaceRow : function ( block, index ) {
			var self = this,
				opts = self.options,
				$columns = null,
				$column = null,
				$block = block.attr ? block : $( block ),
				data = null,
				htmlData = null,
				myTemplate = null,
				idx = 0,
				dataIdx = 0,
				attrName = self._direction ? "top" : "left",
				tempBlocks = null;

			$columns = $block.attr( "row-index", index ).children();
			if ( $columns.length !== self._itemCount ) {
				$block.children().remove();
				tempBlocks = $( self._makeRow( self._template, index ) );
				$block.append( tempBlocks.children() );
				tempBlocks.remove();
				return ;
			}

			dataIdx = index * self._itemCount;
			for ( idx = 0; idx < self._itemCount ; idx += 1 ) {
				$column = $columns.eq(idx);
				data = self._itemData(dataIdx);
				if ( $column && data ) {
					htmlData = self._tmpl( data );
					htmlData.css( attrName, ( idx * self._cellOtherSize ) ).addClass( "virtualgrid-item" );
					$column.remove();
					$block.append( htmlData );
					dataIdx ++;
				} else if ($column && !data ) {
					$column.remove();
				}
			}
		},

		_createElement : function ( tag ) {
			var element = document.createElement( tag );
			this._fragment.appendChild( element );
			return element;
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

			plainMsg = self._template.text();
			for ( idx = 0 ; idx < self._properties.length ; idx++ ) {
				plainMsg = self._strReplace( plainMsg, "${" + self._properties[idx] +"}" , data[ self._properties[ idx ] ] );
			} // repalce string.
			ret = $( plainMsg ); // Make a DOM element.
			return ret;
		},

		_strReplace : function(plainMsg, stringToFind,stringToReplace){
			var temp = plainMsg,
				index = plainMsg.indexOf( stringToFind );
			while (index !== -1) {
				temp = temp.replace( stringToFind, stringToReplace );
				index = temp.indexOf( stringToFind );
			}
			return temp;
		}

	} );

	$( document ).bind( "pagecreate create", function ( e ) {
		$.mobile.virtualgrid.prototype.enhanceWithin( e.target );
	} );
} (jQuery, window, document) );

//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");

