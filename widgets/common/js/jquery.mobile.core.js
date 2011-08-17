    /*!
    * jQuery Mobile Widget @VERSION
    *
    * Copyright (C) TODO
    * License: TODO
    * Authors: Kalyan Kondapally <kalyan.kondapally@intel.com>
    */
    
    jQuery.extend(jQuery, {
	//todo NAMESPACE IT TO TODONS
	Point: function (x, y) {
	    var X = isNaN(x) ? 0 : x;
	    var Y = isNaN(y) ? 0 : y;
    
	    this.add = function (Point) {
		if (Point != null) {
		    this.setX(X + Point.x());
		    this.setY(Y + Point.y());
		}
		return this;
	    }
    
	    this.subtract = function (Point) {
		if (Point != null) {
		    this.setX(X - Point.x());
		    this.setY(Y - Point.y());
		}
		return this;
	    }
    
	    this.multiply = function (Point) {
		if (Point != null) {
		    this.setX(Math.round(X * Point.x()));
		    this.setY(Math.round(Y * Point.y()));
		}
		return this;
	    }
    
	    this.divide = function (Point) {
		if (Point != null) {
		    this.setX(Math.round(X / Point.x()));
		    this.setY(Math.round(Y / Point.y()));
		}
		return this;
	    }
    
	    this.isNull = function () {
		return (X == 0 && Y == 0);
	    }
    
	    this.x = function () {
		return X;
	    }
    
	    this.setX = function (val) {
		isNaN(val) ? X = 0 : X = val;
	    }
    
	    this.y = function () {
		return Y;
	    }
    
	    this.setY = function (val) {
		isNaN(val) ? Y = 0 : Y = val;
	    }
    
	    this.setNewPoint = function (point) {
		this.setX(point.x());
		this.setY(point.y());
	    }
	    this.isEqualTo = function (point) {
		return (X == point.x() && Y == point.y());
	    }
    
	},
    
	disableSelection: function (element) {
	    return $(element).each(function () {
		jQuery(element).css('-webkit-user-select', 'none');
	    });
	},
    
	enableSelection: function (element, value) {
	    return $(element).each(function () {
		val = value == "text" ? val = 'text' : val = 'auto';
		jQuery(element).css('-webkit-user-select', val);
	    });
	}
    
    });
