Element.addMethods({

	family: function(element) {
		var _element = $(element), _siblings = [];
		if(_element) {
			_siblings = _element.tagName.toLowerCase() == 'body' ? [] : _element.siblings();
			return _siblings.length > 0 ? _siblings.concat(_element.parentNode) : _siblings.push(_element);
		}
		return _siblings;
	},

	// set parent's missing z-indexes, get and set as highest z-index
	survive: function(element) {
		var _element = $(element), _family, _max;
		if(_element) {
			_element.ancestors().each(function(ancestor) { if(ancestor.tagName.toLowerCase() != 'html' && ancestor.getStyle('zIndex') === null) { ancestor.survive(); } });
			_family = element.family();
			return _element.setStyle({ zIndex: (_family.length > 0 ? parseInt(_family.invoke('getStyle', 'zIndex').max(), 10) : 0) + 1 });
		}
		return _element;
	}

});
