/*	Prototype Calendar, version 0.1
 *	Copyright (c) 2009, GravityMedia
 *
 *	Permission is hereby granted, free of charge, to any person obtaining a copy
 *	of this software and associated documentation files (the "Software"), to
 *	deal in the Software without restriction, including without limitation the
 *	rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *	sell copies of the Software, and to permit persons to whom the Software is
 *	furnished to do so, subject to the following conditions:
 *
 *	The above copyright notice and this permission notice shall be included in
 *	all copies or substantial portions of the Software.
 *
 *	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *	FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 *	IN THE SOFTWARE.
 *
 *	This work is licensed under the Creative Commons Attribution-Share Alike 3.0
 *	Unported License. To view a copy of this license, visit
 *	http://creativecommons.org/licenses/by-sa/3.0/ or send a letter to Creative
 *	Commons, 171 Second Street, Suite 300, San Francisco, California, 94105,
 *	USA.
 *
 *	@version: 0.1
 *	@author: GravityMedia http://www.gravitymedia.de/
 *	@date: 2009-12-28
 *	@copyright: Copyright (c) 2009, GravityMedia (http://www.gravitymedia.de/). All rights reserved.
 *	@license: Licensed under The MIT License. See http://opensource.org/licenses/mit-license.php. 
 *	@website: http://www.gravitymedia.de/
 */

Element.addMethods({

	// Returns the parent and siblings of an element (withot the element itself)
	// or an empty list if the node is below or equals the body element
	family: function(element) {
		var _element = $(element);
		return (!Object.isElement(_element) || _element.tagName.toLowerCase() == 'body') ? [] : [_element.parentNode].concat(_element.siblings());
	},

	// set parent's missing z-indexes, get and set as highest z-index
	survive: function(element) {
		var _element = $(element), _family;
		if(Object.isElement(_element)) {
			_element.ancestors().each(function(ancestor) { if(ancestor.tagName.toLowerCase() != 'html' && ancestor.getStyle('zIndex') === null) { ancestor.survive(); } });
			_family = element.family();
			return _element.setStyle({ zIndex: (_family.length > 0 ? parseInt(_family.invoke('getStyle', 'zIndex').max(), 10) : 0) + 1 });
		}
		return _element;
	}

});
