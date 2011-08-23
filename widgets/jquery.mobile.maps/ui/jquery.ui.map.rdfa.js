 /*!
 * jQuery UI Google Map 3.0-alpha
 * http://code.google.com/p/jquery-ui-map/
 * Copyright (c) 2010 - 2011 Johan Säll Larsson
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 *
 * Depends:
 *		jquery.ui.map.js
 */
( function($) {
	
	jQuery.fn.extend({
		items: getItems
	});
	
	function getItems(type, ns, callback) {
		var selector = jQuery.map(splitTokens(ns), function(t) {
			return '['+type+'~="'+t.replace(/"/g, '\\"')+'"]';
		}).join(',') || '*';
		return jQuery(selector, this).filter(callback);
	}
	
	function splitTokens(s) {
		if (s && /\S/.test(s))
		  return s.replace(/^\s+|\s+$/g,'').split(/\s+/);
		return [];
	}
	
	function resolve(url) {
		if (!url)
			return '';
		var img = document.createElement('img');
		img.setAttribute('src', url);
		return img.src;
	}
	
	function populateItem(elm, list, prefix, property) {
		
		var tagName = elm.tagName.toUpperCase();
		list.tagName = tagName;
		list.src = null;
		list.href = null;
		switch ( tagName ) {
			case 'AUDIO':
			case 'EMBED':
			case 'IFRAME':
			case 'IMG':
			case 'SOURCE':
			case 'VIDEO':
				list.src = resolve(elm.getAttribute('src'));
			case 'A':
			case 'AREA':
			case 'LINK':
				list.href = elm.getAttribute('href');
		}
		list.content = null;
		if (elm.getAttribute('content')) {
			list.content = elm.getAttribute('content');
		} else if (elm.innerHTML) {
			list.content = elm.innerHTML;
		}
		list.rel = elm.getAttribute('rel');

	}
	
	function getItem(node, list) {
		node.children().each( function() {
			var property = $(this).attr('property');
			if ( property ) {
				if ( !list[property] ) {
					list[property] = {};
				}
				populateItem(this, list[property], property);
			}
			getItem($(this), list);
		});
		return list;
	}
	
	$.extend($.ui.gmap.prototype, {
		
		/**
		 * Extracts meta data from the HTML 
		 * @param namespace:String
		 * @param callback:function(result:Array<String>, item:jQuery, iterator:int)
		 */
		rdfa: function(ns, callback) { 
			
			var self = this;
			var prefix;
			if ( ns.indexOf('http') > -1 ) {
				prefix = ns.substring(ns.lastIndexOf('/')+1,ns.length);
				prefix = prefix.replace('?','');
				prefix = prefix.replace('#','');
			} else if ( ns.indexOf(':') > -1 ) {
				prefix = ns.split(':')[1];
			} else {
				prefix = ns;
			}
			prefix = prefix.toLowerCase();
			var retval = [];
			retval[prefix] = [];
			
			$(document).items('typeof', ns, function() { return (this.getAttribute('typeof') != null); }).each(function(i, node) {
				getItem($(node), retval[prefix]);
				self._call(callback, retval, $(node), i);
			});
			
		}
	
	});
	
} (jQuery) );