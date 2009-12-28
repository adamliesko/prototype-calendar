var Calendar = Class.create({

	initialize: function(element, options) {
		this.element = $(element);
		if(Object.isElement(this.element)) {
			var _options = Object.extend({
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
				onClick:				null
			}, options || {});
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
			this.labels = Object.extend({
				previous:				'&lsaquo;',
				next:					'&rsaquo;',
				week:					'&nbsp;',
				close:					'close'
			}, _options.labels || {});
			this.disableInputOnFocus = _options.disableInputOnFocus === false ? false : true;
			this.selectOnFocus = _options.selectOnFocus === false ? false : true;
			this.selectMonth = _options.selectMonth === false ? false : true;
			this.selectYear = _options.selectYear === false ? false : true;
			this.offsetYear = Math.max(0, _options.offsetYear);
			this.target = $(_options.target);
			this.showOn = Object.isElement(this.target) ? (['click', 'mouseover'].include(_options.showOn) ? _options.showOn : 'click') : 'focus';
			this.hideOn = Object.isElement(this.target) ? (['click', 'mouseover'].include(_options.showOn) ? _options.showOn : 'click') : null;
			this.hideOnClick = _options.hideOnClick === true ? true : false;
			this.onClick = _options.onClick;
			this.realDate = this.getDate();
			this.setCurrentDateTo(_options.currentDate === null ? (this.element.present() ? $F(this.element) : new Date()) : _options.currentDate);
			this.setNoDatesBeforeTo(_options.noDatesBefore);
			this.setNoDatesAfterTo(_options.noDatesAfter);
			this.showHandler = this.show.bind(this);
			this.blurHandler = function(event) { this.setCurrentDateTo(Date.parse($F(event.element()))).showMonth(this.currentDate); }.bindAsEventListener(this);
			this.selectHandler = function(event) { event.element().select(); };
			this.targetHandler = function() { if(this.calendar.visible()) { this.hide(); } }.bind(this);
			this.previous = new Calendar.Button(this.labels.previous, this.showPreviousMonth.bind(this));
			this.next = new Calendar.Button(this.labels.next, this.showNextMonth.bind(this));
			this.date = new Element('td', { className: this.classNames.date });
			this.table = new Element('td', { colspan: 3 });
			this.close = new Element('button').insert(this.labels.close).observe('click', this.hide.bind(this));
			this.calendar = new Element('div', { className: this.classNames.calendar }).insert(new Element('table', { className: this.classNames.calendar }).insert(new Element('thead').insert(new Element('tr', { className: this.classNames.head }).insert(new Element('td', { className: this.classNames.previous }).insert(this.previous)).insert(this.date).insert(new Element('td', { className: this.classNames.next }).insert(this.next)))).insert(new Element('tbody').insert(new Element('tr', { className: this.classNames.body }).insert(this.table))).insert(new Element('tfoot').insert(new Element('tr', { className: this.classNames.foot }).insert(new Element('td', { colspan: 3 }).insert(this.close))))).hide();
			document.observe('dom:loaded', function() { var _body = $$('body').first(); if(Object.isElement(_body)) { _body.insert(this); } }.bind(this));
		}
	},
	
	toElement: function() {
		var _height = this.element.enable().setValue(this.currentDate.toString('d')).getHeight(),
			_position = (Object.isElement(this.target) ? this.target.stopObserving(this.hideOn, this.targetHandler).observe(this.hideOn, this.targetHandler) : this.element).stopObserving(this.showOn, this.showHandler).observe(this.showOn, this.showHandler).cumulativeOffset();
		this.calendar.setStyle({ position: 'absolute', left: _position.left + 'px', top: _position.top + _height + 'px' });
		if(Object.isElement(this.target)) { this.element.stopObserving('blur', this.blurHandler).observe('blur', this.blurHandler); }
		return this.calendar;
	},
	
	toString: function() {
		return this.realDate.toString('D');
	},
	
	getDate: function(date) {
		return (date instanceof Date ? date.clone() : Date.today()).at({ hour: 0, minute: 0 });
	},

	parseDate: function(date) {
		return this.getDate(date instanceof Date ? date : Date.parse(date));
	},
	
	isUnavailable: function(date) {
		var _date = this.parseDate(date);
		return (this.noDatesBefore instanceof Date && _date.compareTo(this.noDatesBefore) < 0) || (this.noDatesAfter instanceof Date && _date.compareTo(this.noDatesAfter) > 0);
	},

	hide: function() {
		if(!Object.isElement(this.target)) { this.element.stopObserving('blur', this.blurHandler); }
		if(this.selectOnFocus) { this.element.stopObserving('focus', this.selectHandler); }
		(Object.isElement(this.target) ? this.target : (this.disableInputOnFocus ? this.element.enable() : this.element)).observe(this.showOn, this.showHandler);
		this.calendar.hide();
		return this;
	},
	
	show: function() {
		return this.showMonth(this.currentDate);
	},

	showPreviousDay: function() {
		return this.showMonth(this.viewDate.addDays(-1));
	},

	showNextDay: function() {
		return this.showMonth(this.viewDate.addDays(1));
	},
	
	showPreviousMonth: function() {
		return this.showMonth(this.viewDate.addMonths(-1));
	},

	showNextMonth: function() {
		return this.showMonth(this.viewDate.addMonths(1));
	},
	
	showMonth: function(date) {
		this.viewDate = this.getDate(date);
		var _firstDayName = Date.CultureInfo.abbreviatedDayNames[Date.CultureInfo.firstDayOfWeek],
			_lastDayName = Date.CultureInfo.abbreviatedDayNames[(Date.CultureInfo.firstDayOfWeek + Date.CultureInfo.abbreviatedDayNames.length - 1) % Date.CultureInfo.abbreviatedDayNames.length];
		var _month = new Calendar.Month(this),
			_first = this.viewDate.clone().moveToFirstDayOfMonth(),
			_last = this.viewDate.clone().moveToLastDayOfMonth();
		var _week = _first.clone().add(-1 * Date.CultureInfo.abbreviatedDayNames.length).days(),
			_days = $R(parseInt(_first.toString('dd'), 10), parseInt(_last.toString('dd'), 10)).collect(function(day) { return new Calendar.Day(this, this.viewDate.clone().set({ day: day })); }.bind(this));
		while(_first.toString('ddd') != _firstDayName) { _first.addDays(-1); _days.unshift(new Calendar.Day(this, _first.clone(), true)); }
		while(_last.toString('ddd') != _lastDayName) { _last.addDays(1); _days.push(new Calendar.Day(this, _last.clone(), true)); }
		if(this.selectMonth === true && this.selectYear === true) {
			this.date.update(Date.CultureInfo.monthNames.inject(new Calendar.Select(this), function(select, text, value) { return select.insert(new Calendar.Select.Option(this.viewDate.clone().set({ month: value }), text)); }.bind(this))).insert($R(_month.year - this.offsetYear, _month.year + this.offsetYear).inject(new Calendar.Select(this), function(select, value) { return select.insert(new Calendar.Select.Option(this.viewDate.clone().set({ year: value }), value)); }.bind(this)));
		} else {
			if(this.selectMonth === true) {
				this.date.update(Date.CultureInfo.monthNames.inject(new Calendar.Select(this), function(select, text, value) { return select.insert(new Calendar.Select.Option(this.viewDate.clone().set({ month: value }), text)); }.bind(this))).insert(new Element('span').insert(_month.year));
			} else if(this.selectMonth === true) {
				this.date.update(new Element('span').insert(this.viewDate.toString('dddd'))).insert($R(_month.year - this.offsetYear, _month.year + this.offsetYear).inject(new Calendar.Select(this), function(select, value) { return select.insert(new Calendar.Select.Option(this.viewDate.clone().set({ year: value }), value)); }.bind(this)));
			} else {
				this.date.update(new Element('span').insert(this.viewDate.toString('y')));
			}
		}
		this.table.update(_days.inGroupsOf(Date.CultureInfo.abbreviatedDayNames.length, new Element('td')).inject(new Calendar.Month(this, this.viewDate.toString('yyy'), this.viewDate.toString('MM')), function(month, week) { return month.insert(week.inject(new Calendar.Week(this, _week.add(Date.CultureInfo.abbreviatedDayNames.length).days()), function(week, day) { return week.insert(day); })); }.bind(this)));
		if(!Object.isElement(this.target)) { this.element.observe('blur', this.blurHandler); }
		if(this.selectOnFocus) { this.element.observe('focus', this.selectHandler); }
		(Object.isElement(this.target) ? this.target : (this.disableInputOnFocus ? this.element.disable() : this.element)).stopObserving(this.showOn, this.showHandler);
		this.previous.disable(this.isUnavailable(_first.add(-1).days()));
		this.next.disable(this.isUnavailable(_last.add(1).days()));
		this.calendar.survive().show();
		this.close.focus();
		return this;
	},

	setCurrentDateTo: function(date) {
		this.currentDate = this.parseDate(date);
		return this;
	},
	
	setNoDatesBeforeTo: function(date) {
		this.noDatesBefore = date === null ? null : this.parseDate(date);
		return this;
	},

	setNoDatesAfterTo: function(date) {
		this.noDatesAfter = date === null ? null : this.parseDate(date);
		return this;
	}

});

Calendar.Month = Class.create({

	initialize: function($calendar) {
		this.calendar = $calendar;
		this.year = parseInt($calendar.viewDate.toString('yyyy'), 10);
		this.month = parseInt($calendar.viewDate.toString('MM'), 10);
		this.weeks = [];
	},

	toElement: function() {
		return new Element('table').insert(new Element('thead').insert($R(0, 6).inject(new Element('tr').insert(new Element('td').insert(this.calendar.labels.week)), function(row, index) { return row.insert(new Element('td').insert(Date.CultureInfo.shortestDayNames[(index + Date.CultureInfo.firstDayOfWeek) % Date.CultureInfo.abbreviatedDayNames.length])); }))).insert(this.weeks.inject(new Element('tbody'), function(month, week) { return month.insert(week); }));
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

	initialize: function($calendar, date) {
		this.calendar = $calendar;
		this.year = parseInt($calendar.viewDate.toString('yyyy'), 10);
		this.week = parseInt(date.getISOWeek(), 10);
		this.days = [];
	},

	toElement: function() {
		return this.days.inject(new Element('tr').insert(new Element('td', { className: this.calendar.classNames.week }).insert(this.week.toPaddedString(2))), function(week, day) { return week.insert(day); });
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

	initialize: function($calendar, date, outbounded) {		
		this.calendar = $calendar;
		this.date = date;
		this.outbounded = outbounded === true ? true : false;
	},
	
	toElement: function() {
		var _element = new Element('td').insert(parseInt(this.date.toString('dd'), 10));
		if(this.outbounded) {
			_element.addClassName(this.calendar.classNames.outbound);
		} else if(this.calendar.isUnavailable(this.date)) {
			_element.addClassName(this.calendar.classNames.unavailable);
		} else {
			if(this.date.equals(this.calendar.realDate)) { _element.addClassName(this.calendar.classNames.real); }
			else if(this.date.equals(this.calendar.currentDate)) { _element.addClassName(this.calendar.classNames.current); }
			_element
				.addClassName(this.calendar.classNames.day)
				.observe('click', this.click.bind(this))
				.observe('mouseover', function() { _element.addClassName(this.calendar.classNames.hover); }.bind(this))
				.observe('mouseout', function() { _element.removeClassName(this.calendar.classNames.hover); }.bind(this));
		}
		return _element;
	},
	
	toString: function() {
		return this.date.toString('d');
	},
	
	click: function() {
		this.calendar.setCurrentDateTo(this.date).showMonth(this.date).element.setValue(this);
		if(this.calendar.hideOnClick) { this.calendar.hide(); }
		if(Object.isFunction(this.calendar.onClick)) { this.calendar.onClick(this.calendar, this.toString()); }
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

	initialize: function($calendar) {
		this.calendar = $calendar;
		this.selectedValue = $calendar.viewDate;
		this.options = [];
	},
	
	toElement: function() {
		return this.options.inject(new Element('select').observe('change', function(event) { this.calendar.showMonth(Date.parse($F(event.element()))); }.bind(this)), function(select, option) { return select.insert(option.setDisabled(this.calendar.isUnavailable(option.date)).setSelected(this.selectedValue.toString('d') == option.date.toString('d'))); }.bind(this));
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
