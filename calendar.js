/*  Prototype Calendar, version 0.1.2
 *  Copyright (c) 2009, GravityMedia. All rights reserved.
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to
 *  deal in the Software without restriction, including without limitation the
 *  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 *  sell copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 *  IN THE SOFTWARE.
 *
 *  This work is licensed under the Creative Commons Attribution-Share Alike 3.0
 *  Unported License. To view a copy of this license, visit
 *  http://creativecommons.org/licenses/by-sa/3.0/ or send a letter to Creative
 *  Commons, 171 Second Street, Suite 300, San Francisco, California, 94105,
 *  USA.
 *
 *  @version: 0.1.2
 *  @author: GravityMedia
 *  @date: 2010-01-14
 *  @copyright: Copyright (c) 2009, GravityMedia. All rights reserved.
 *  @license: Licensed under The MIT License. See http://opensource.org/licenses/mit-license.php. 
 *  @website: http://www.gravitymedia.de/
 */

var Calendar = Class.create(Object.extend(Object.clone(DateMethods), {

	initialize: function(element, options) {
		this.element = $(element);
		if(Object.isElement(this.element)) {
			// override default options
			var _options = Object.extend({
				readOnly:				false,
				disableInputOnFocus:	true,
				selectOnFocus:			true,
				selectMonth:			true,
				selectYear:				true,
				offsetYear:				3,
				currentDate:			null,
				noDatesBefore:			null,
				noDatesAfter:			null,
				target:					null,
				showOn:					'click',
				hideOn:					'click',
				hideOnClick:			false,
				offsetLeft:				0,
				offsetTop:				0,
				onChange:				null
			}, options || {});
			// if calendar is not read only
			if(_options.readOnly !== true && this.element.readAttribute('readonly') !== 'true') {
				// override default class names
				this.classNames = Object.extend({
					calendar:				'calendar',
					head:					'head',
					body:					'body',
					foot:					'foot',
					previous:				'previous',
					date:					'date',
					next:					'next',
					week:					'week',
					day:					'day',
					real:					'real',
					current:				'current',
					hover:					'hover',
					outbound:				'outbound',
					unavailable:			'unavailable'
				}, _options.classNames || {});
				// override default labels 
				this.labels = Object.extend({
					previous:				'&lsaquo;',
					next:					'&rsaquo;',
					week:					'&nbsp;',
					close:					'close'
				}, _options.labels || {});
				// parse options
				this.disableInputOnFocus = _options.disableInputOnFocus === false ? false : true;
				this.selectOnFocus = (this.disableInputOnFocus || _options.selectOnFocus === false) ? false : true;
				this.selectMonth = _options.selectMonth === false ? false : true;
				this.selectYear = _options.selectYear === false ? false : true;
				this.offsetYear = Math.max(0, _options.offsetYear);
				this.target = $(_options.target);
				this.showOn = Object.isElement(this.target) ? (['click', 'mouseover'].include(_options.showOn) ? _options.showOn : 'click') : 'focus';
				this.hideOn = Object.isElement(this.target) ? (['click', 'mouseover'].include(_options.showOn) ? _options.showOn : 'click') : null;
				this.hideOnClick = _options.hideOnClick === true ? true : false;
				this.offset = { left: isNaN(_options.offsetLeft) ? 0 : Number(_options.offsetLeft), top: isNaN(_options.offsetTop) ? 0 : Number(_options.offsetTop) };
				this.onChange = _options.onChange;
				this.realDate = this.getDate();
				this.setNoDatesBeforeTo(_options.noDatesBefore);
				this.setNoDatesAfterTo(_options.noDatesAfter);
				this.setCurrentDateTo(_options.currentDate === null ? (this.element.present() ? $F(this.element) : new Date()) : _options.currentDate).element.setValue(this.currentDate.toString('d'));;
				// showHandler
				var _showHandler = this.show.bind(this);
				this.releaseShowEvent = function(element) { return element.stopObserving(this.showOn, _showHandler) || element; }.bind(this);
				this.catchShowEvent = function(element) { return this.releaseShowEvent(element).observe(this.showOn, _showHandler); }.bind(this);
				// hideHandler
				var _hideHandler = function() { if(this.calendar.visible()) { this.hide(); } }.bind(this);
				this.releaseHideEvent = function(element) { return element.stopObserving(this.hideOn, _hideHandler) || element; }.bind(this);
				this.catchHideEvent = function(element) { return this.releaseHideEvent(element).observe(this.hideOn, _hideHandler); }.bind(this);
				// keypressHandler
				var _keypressHandler = function(event) { (function(element, date) { var _date = Date.parseExact($F(element), Date.CultureInfo.formatPatterns.shortDate); if(_date !== null && !_date.equals(date)) { element.fire('calendar:change', { date: _date }); } }.defer(event.element(), this.currentDate)); }.bindAsEventListener(this);
				this.releaseKeypressEvent = function(element) { return element.stopObserving('keypress', _keypressHandler) || element; };
				this.catchKeypressEvent = function(element) { return this.releaseKeypressEvent(element).observe('keypress', _keypressHandler); }.bind(this);	
				// focusHandler
				var _focusHandler = function(event) { event.element().select(); };
				this.releaseFocusEvent = function(element) { return element.stopObserving('focus', _focusHandler) || element; };
				this.catchFocusEvent = function(element) { return this.selectOnFocus ? this.releaseFocusEvent(element).observe('focus', _focusHandler) : element; }.bind(this);
				// listen for change from keypressHandler
				this.element.observe('calendar:change', function(event) { if(!this.isUnavailable(event.memo.date)) { var _date = event.memo.date.toString('d'); this.setCurrentDateTo(event.memo.date).element.setValue(_date); if(this.calendar.visible()) { this.show(); } if(Object.isFunction(this.onChange)) { this.onChange(this, _date); } } }.bindAsEventListener(this));
				// create elements
				this.previous = new Calendar.Button(this.labels.previous, this.showPreviousMonth.bind(this));
				this.next = new Calendar.Button(this.labels.next, this.showNextMonth.bind(this));
				this.date = new Element('td', { className: this.classNames.date });
				this.table = new Element('td', { colspan: 3 });
				this.close = new Element('button').insert(this.labels.close).observe('click', this.hide.bind(this));
				this.calendar = new Element('div', { className: this.classNames.calendar }).insert(new Element('table', { className: this.classNames.calendar }).insert(new Element('thead').insert(new Element('tr', { className: this.classNames.head }).insert(new Element('td', { className: this.classNames.previous }).insert(this.previous)).insert(this.date).insert(new Element('td', { className: this.classNames.next }).insert(this.next)))).insert(new Element('tbody').insert(new Element('tr', { className: this.classNames.body }).insert(this.table))).insert(new Element('tfoot').insert(new Element('tr', { className: this.classNames.foot }).insert(new Element('td', { colspan: 3 }).insert(this.close))))).hide();
				// (try to) insert elements after body has loaded
				document.observe('body:loaded', function(event) { event.memo.body.insert(this); }.bindAsEventListener(this));
			}
		}
	},
	
	toElement: function() {
		// position calendar, catch important events and return the calendar element
		var _height = this.catchKeypressEvent(this.element).enable().setValue(this.currentDate.toString('d')).getHeight(),
			_position = this.catchShowEvent(Object.isElement(this.target) ? this.target : this.element).cumulativeOffset();
		this.calendar.setStyle({ position: 'absolute', left: this.offset.left + _position.left + 'px', top: this.offset.top + _position.top + _height + 'px' });
		return this.calendar;
	},
	
	toString: function() {
		// debug oriented toString method of the real date
		return this.realDate.toString('D');
	},
	
	hide: function() {
		// toggle events and hide the calendar
		this.releaseFocusEvent(this.disableInputOnFocus ? this.catchKeypressEvent(this.element.enable()) : this.element);
		this.catchShowEvent(Object.isElement(this.target) ? this.releaseHideEvent(this.target) : this.element);
		this.calendar.hide();
		return this;
	},
	
	show: function() {
		// shows the calendar with the current date
		return this.showDate(this.currentDate);
	},

	showDate: function(date) {
		this.viewDate = this.getDate(date);
		var _firstDayName = Date.CultureInfo.abbreviatedDayNames[Date.CultureInfo.firstDayOfWeek],
			_lastDayName = Date.CultureInfo.abbreviatedDayNames[(Date.CultureInfo.firstDayOfWeek + Date.CultureInfo.abbreviatedDayNames.length - 1) % Date.CultureInfo.abbreviatedDayNames.length];
		var _month = new Calendar.Month(this, this.viewDate),
			_first = this.viewDate.clone().moveToFirstDayOfMonth(),
			_last = this.viewDate.clone().moveToLastDayOfMonth();
		var _week = _first.clone().add(-1 * Date.CultureInfo.abbreviatedDayNames.length).days(),
			_days = $R(this.parseToDayNumber(_first), this.parseToDayNumber(_last)).collect(function(day) { return new Calendar.Day(this, this.viewDate.clone().set({ day: day })); }.bind(this));
		while(_first.toString('ddd') != _firstDayName) { _first.addDays(-1); _days.unshift(new Calendar.Day(this, _first.clone(), true)); }
		while(_last.toString('ddd') != _lastDayName) { _last.addDays(1); _days.push(new Calendar.Day(this, _last.clone(), true)); }
		if(this.selectMonth === true && this.selectYear === true) {
			this.date.update(Date.CultureInfo.monthNames.inject(new Calendar.Select(this, this.viewDate), function(select, text, value) { return select.insert(new Calendar.Select.Option(this.viewDate.clone().set({ month: value }), text)); }.bind(this))).insert($R(_month.year - this.offsetYear, _month.year + this.offsetYear).inject(new Calendar.Select(this, this.viewDate), function(select, value) { return select.insert(new Calendar.Select.Option(this.viewDate.clone().set({ year: value }), value)); }.bind(this)));
		} else {
			if(this.selectMonth === true) {
				this.date.update(Date.CultureInfo.monthNames.inject(new Calendar.Select(this, this.viewDate), function(select, text, value) { return select.insert(new Calendar.Select.Option(this.viewDate.clone().set({ month: value }), text)); }.bind(this))).insert(new Element('span').insert(_month.year));
			} else if(this.selectMonth === true) {
				this.date.update(new Element('span').insert(this.viewDate.toString('dddd'))).insert($R(_month.year - this.offsetYear, _month.year + this.offsetYear).inject(new Calendar.Select(this, this.viewDate), function(select, value) { return select.insert(new Calendar.Select.Option(this.viewDate.clone().set({ year: value }), value)); }.bind(this)));
			} else {
				this.date.update(new Element('span').insert(this.viewDate.toString('y')));
			}
		}
		this.table.update(_days.inGroupsOf(Date.CultureInfo.abbreviatedDayNames.length, new Element('td')).inject(_month, function(month, week) { return month.insert(week.inject(new Calendar.Week(this, _week.add(Date.CultureInfo.abbreviatedDayNames.length).days()), function(week, day) { return week.insert(day); })); }.bind(this)));	
		this.releaseShowEvent(Object.isElement(this.target) ? this.catchHideEvent(this.target) : this.element);
		this.catchFocusEvent(this.disableInputOnFocus ? this.releaseKeypressEvent(this.element).disable() : this.element);
		this.previous.disable(this.isUnavailable(_first.add(-1).days()));
		this.next.disable(this.isUnavailable(_last.add(1).days()));
		this.calendar.survive().show();
		this.close.focus();
		return this;
	},

	showPreviousDay: function() {
		return this.showDate(this.viewDate.addDays(-1));
	},

	showNextDay: function() {
		return this.showDate(this.viewDate.addDays(1));
	},
	
	showPreviousMonth: function() {
		return this.showDate(this.viewDate.addMonths(-1));
	},

	showNextMonth: function() {
		return this.showDate(this.viewDate.addMonths(1));
	},
	
	showPreviousYear: function() {
		return this.showDate(this.viewDate.addYears(-1));
	},

	showNextYear: function() {
		return this.showDate(this.viewDate.addYears(1));
	}

}));

Calendar.Month = Class.create({

	initialize: function($parent, date) {
		this.parent = $parent;
		this.year = $parent.parseToYearNumber(date);
		this.month = $parent.parseToMonthNumber(date);
		this.weeks = [];
	},

	toElement: function() {
		return new Element('table').insert(new Element('thead').insert($R(0, 6).inject(new Element('tr').insert(new Element('td').insert(this.parent.labels.week)), function(row, index) { return row.insert(new Element('td').insert(Date.CultureInfo.shortestDayNames[(index + Date.CultureInfo.firstDayOfWeek) % Date.CultureInfo.abbreviatedDayNames.length])); }))).insert(this.weeks.inject(new Element('tbody'), function(month, week) { return month.insert(week); }));
	},
	
	toString: function() {
		return this.weeks.join("\n");
	},
	
	insert: function(week) {
		this.weeks.push(week);
		return this;
	}

});

Calendar.Week = Class.create({

	initialize: function($parent, date) {
		this.parent = $parent;
		this.year = $parent.parseToYearNumber(date);
		this.week = $parent.parseToWeekNumber(date);
		this.days = [];
	},

	toElement: function() {
		return this.days.inject(new Element('tr').insert(new Element('td', { className: this.parent.classNames.week }).insert(this.week.toPaddedString(2))), function(week, day) { return week.insert(day); });
	},
	
	toString: function() {
		return this.week.toPaddedString(2) + (this.days.length > 0 ? ',' : '') + this.days.join(',');
	},
	
	insert: function(day) {
		this.days.push(day);
		return this;
	}

});

Calendar.Day = Class.create({

	initialize: function($parent, date, outbounded) {		
		this.parent = $parent;
		this.date = date;
		this.outbounded = outbounded === true ? true : false;
	},
	
	toElement: function() {
		var _element = new Element('td').insert(this.parent.parseToDayNumber(this.date));
		if(this.outbounded) {
			_element.addClassName(this.parent.classNames.outbound);
		} else if(this.parent.isUnavailable(this.date)) {
			_element.addClassName(this.parent.classNames.unavailable);
		} else {
			if(this.date.equals(this.parent.realDate)) { _element.addClassName(this.parent.classNames.real); }
			else if(this.date.equals(this.parent.currentDate)) { _element.addClassName(this.parent.classNames.current); }
			_element
				.addClassName(this.parent.classNames.day)
				.observe('click', this.click.bind(this))
				.observe('mouseover', function() { _element.addClassName(this.parent.classNames.hover); }.bind(this))
				.observe('mouseout', function() { _element.removeClassName(this.parent.classNames.hover); }.bind(this));
		}
		return _element;
	},
	
	toString: function() {
		return this.date.toString('d');
	},
	
	click: function() {
		this.parent.setCurrentDateTo(this.date).show().element.setValue(this);
		if(this.parent.hideOnClick) { this.parent.hide(); }
		if(Object.isFunction(this.parent.onChange)) { this.parent.onChange(this.parent, this.toString()); }
	}

});

Calendar.Button = Class.create({

	initialize: function(label, handler) {
		this.element = new Element('button').insert(label);
		this.handler = handler;
	},
	
	toElement: function() {
		return this.element;
	},
	
	disable: function(disabled) {
		return disabled ? this.element.stopObserving('click', this.handler).writeAttribute('disabled', 'disabled') : this.element.writeAttribute('disabled', null).observe('click', this.handler);
	}

});

Calendar.Select = Class.create({

	initialize: function($parent, date) {
		this.parent = $parent;
		this.date = date;
		this.options = [];
	},
	
	toElement: function() {
		return this.options.inject(new Element('select').observe('change', function(event) { this.parent.showDate(Date.parse($F(event.element()))); }.bind(this)), function(select, option) { return select.insert(option.setDisabled(this.parent.isUnavailable(option.date)).setSelected(this.date.clone().clearTime().equals(option.date.clone().clearTime()))); }.bind(this));
	},
	
	toString: function() {
		return this.options.join("\n");
	},
	
	clear: function() {
		this.options = [];
	},

	insert: function(option) {
		this.options.push(option);
		return this;
	}

});

Calendar.Select.Option = Class.create({

	initialize: function(date, text) {
		this.date = date;
		this.text = text || date.toString('d');
		this.disabled = false;
		this.selected = false;
	},
	
	toElement: function() {
		var _attributes = { value: this.date.toString('d') };
		if(this.disabled === true) { _attributes.disabled = 'disabled'; }
		if(this.selected === true) { _attributes.selected = 'selected'; }
		return new Element('option', _attributes).insert(this.text);
	},
	
	toString: function() {
		return this.text;
	},
	
	setDisabled: function(disabled) {
		this.disabled = disabled ? true : false;
		return this;
	},
	
	setSelected: function(selected) {
		this.selected = selected === false ? false : true;
		return this;
	}

});
