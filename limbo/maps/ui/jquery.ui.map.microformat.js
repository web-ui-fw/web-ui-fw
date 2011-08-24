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

	/* see http://en.wikipedia.org/wiki/XHTML_Friends_Network */
	var XFN = [
		'friend',
		'contact',
		'acquaintance'
	];

	/* Supported properties */
	var properties = [
		'summary',
		'description',
		'url',
		'photo',
		'street-address',
		'postal-code',
		'locality',
		'region',
		'latitude',
		'longitude',
		'startDate',
		'dtstart',
		'endDate',
		'dtend',
		'duration',
		'eventType',
		'category',
		'fn',
		'name',
		'nickname',
		'title',
		'role',
		'org',
		'tel',
		'reviewer',
		'dtreviewed',
		'rating'
	];

	$.extend($.ui.gmap.prototype, {
		microformat: function(ns, callback) {
			var self = this;
			$('.'+ns).each(function(i, node) {
				self._call(callback, getItem($(node), []), $(node), i);
			});
		}
	});

	function hasProperty(property) {
		for( var i = 0; i < properties.length; i++) {
			if ( properties[i] === property ) {
				return true;
			}
		};
		return false;
	}

	function hasXFN(xfn) {
		for( var i = 0; i < XFN.length; i++) {
			if ( XFN[i] === xfn ) {
				return true;
			}
		};
		return false;
	}

	function getItem(node, list) {

		node.children().each(function() {

			var childNode = $(this);

			if ( childNode.attr('class') != undefined ) {
				$.each(childNode.attr('class').split(' '), function(i, c) {
					if ( c.length > 0 && hasProperty(c) ) {
						if ( !list[c] ) {
							list[c] = {};
						}
						if ( childNode.attr('id') != '' ) {
							list[c].id = childNode.attr('id');
						}
						if ( childNode.attr('title') != '' ) {
							list[c].title = childNode.attr('title');
						}
						if ( childNode.attr('href') != undefined ) {
							list[c].href = childNode.attr('href');
						}
						if ( childNode.attr('src') != undefined ) {
							list[c].src = childNode.attr('src');
						}
						if ( childNode.text() != '' ) {
							list[c].text = childNode.text();
						}
					}
				});
			}

			if ( childNode.attr('rel') != undefined ) {
				$.each(childNode.attr('rel').split(' '), function(i, c) {
					if ( c.length > 0 && hasXFN(c) ) {
						if (!list[c]) {
							list[c] = [];
						}
						list[c].push({ 'text': childNode.text(), 'href': childNode.attr('href') });
					}
				});
			}

			getItem(childNode, list);

		});

		return list;

	}

} (jQuery) );