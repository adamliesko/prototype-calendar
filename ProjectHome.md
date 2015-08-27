# prototype-calendar #
Version 0.1.2 (released January 14, 2010).

![http://prototype-calendar.googlecode.com/files/calendar.jpg](http://prototype-calendar.googlecode.com/files/calendar.jpg)

[Demo](http://calendar.dev.gravitymedia.de/) (hosted by GravityMedia)
## Overview ##
Prototype Calendar is a light-weight and easy to use calendar plugin. It takes full advantage of the date.js and prototype.js library, resulting in less code, but maintaining a great deal of functionality.

Some of it's capabilities:
  * can pick a parseable date value from an input element, a parseable date string or a javascript Date object as referrer (default is the localized date of today)
  * supports "datejs formats" (See: http://code.google.com/p/datejs/)
  * i18n support via datejs library and calendar object constructor parameters
  * customizable in functionality and look/feel
  * extensible because of prototyped class concepts
## Requirements ##
Prototype Calendar needs [datejs](http://code.google.com/p/datejs/source/checkout) (>= [r195](https://code.google.com/p/prototype-calendar/source/detail?r=195)) and [prototype](http://prototypejs.org/download) (>= 1.6.1.0). For i18n support please refer the desired `date-xx_XX.js` file.
## Installation/Usage ##
Firstly we need to [download](http://code.google.com/p/prototype-calendar/downloads/list) and to include our required javascript and css files in our page like so:
```
<script type="text/javascript" src="date.js"></script>
<script type="text/javascript" src="prototype.js"></script>
<script type="text/javascript" src="calendar.js"></script>
<link rel="stylesheet" type="text/css" href="calendar.css" />
```
Then we have to call the cunstructor for the calendar after the elements have been placed. E.g.:
```
<input id="calendar" type="text" />
<script type="text/javascript">
	new Calendar('calendar');
</script>
```
The following parameters are supported:
### Parameters ###
| **Name** | **Since** | **Scope** | **Default** | **Description** |
|:---------|:----------|:----------|:------------|:----------------|
|readOnly  |0.1.2      |bool       |false        |when the calendar is read only, it won't be initialized|
|disableInputOnFocus|0.1        |bool       |true         |defines if the input will be disabled after the calendar was opened|
|selectOnFocus|0.1        |bool       |true         |the input value will be selected after refocusing the input field (if the calendar stays opened)|
|selectMonth|0.1        |bool       |true         |if a select box will be shown for selecting the desired month or not|
|selectYear|0.1        |bool       |true         |if a select box will be shown for selecting the desired year or not|
|offsetYear|0.1        |Number     |3            |how many years back- and forwards will be available in the select box|
|currentDate|0.1        |null,Date,String|null         |can be used to overwrite a given date in the input field|
|noDatesBefore|0.1        |null,Date,String|null         |the dates before that date will stay unavailable in the calendar popup|
|noDatesAfter|0.1        |null,Date,String|null         |the dates after that date will stay unavailable in the calendar popup|
|target    |0.1        |null,id,Element|null         |defines a different target for opening the calendar popup (e.g. calendar button/icon)|
|showOn    |0.1        |'click','mouseover'|'click'      |the event name for the showdown|
|hideOn    |0.1        |'click','mouseover'|'click'      |the event name for hiding the calendar|
|hideOnClick|0.1        |bool       |false        |defines if the calendar will automaticaly hide after selecting the desired date|
|offsetLeft|0.1.2      |Number     |0            |the left offset from the target or input element|
|offsetTop |0.1.2      |Number     |0            |the top offset from the target or input element|
|~~onClick~~|~~0.1~~    |~~null,Function~~|~~null~~     |~~a callback function which will be called after selecting the desired date (first parameter: the calendar object, second parameter: the selected date as string)~~|
|onChange  |0.1.2      |null,Function|null         |a callback function which will be called after changing (input has changed or date was clicked) the desired date (first attribute: the calendar object, second attribute: the selected date as string)|

#### Example ####
```
(new Calendar('calendar', {
	disableInputOnFocus: false,
	noDatesBefore: 'today - 1 week',
	noDatesAfter: Date.today().add(1).week(),
	hideOnClick: true
}));
```
### StyleClass object parameter ###
An other available parameter called `classNames` ist an object consisting of styleClass names:
| **Key** | **Default** |
|:--------|:------------|
|calendar |'calendar'   |
|head     |'head'       |
|body     |'body'       |
|foot     |'foot'       |
|previous |'previous'   |
|date     |'date'       |
|next     |'next'       |
|week     |'week'       |
|day      |'day'        |
|real     |'real'       |
|current  |'current'    |
|hover    |'hover'      |
|outbound |'outbound'   |
|unavailable|'unavailable'|


#### Example ####
```
(new Calendar('calendar', {
	disableInputOnFocus: false,
	noDatesBefore: 'today - 1 week',
	noDatesAfter: Date.today().add(1).week(),
	hideOnClick: true,
	classNames: {
		calendar: 'my_calendar',
		current: 'real'
	}
}));
```
### i18n object parameter ###
The i18n parameter called `labels` defines the following non-datejs localized text strings:
| **Key** | **Default** |
|:--------|:------------|
|previous |'&lsaquo;'   |
|next     |'&rsaquo;'   |
|week     |'&nbsp;'     |
|close    |'close'      |


#### Example ####
```
(new Calendar('calendar', {
	disableInputOnFocus: false,
	noDatesBefore: 'today - 1 week',
	noDatesAfter: Date.today().add(1).week(),
	hideOnClick: true,
	classNames: {
		calendar: 'my_calendar',
		current: 'real'
	}.
	labels: {
		week: 'Wk'
	}
}));
```
## API ##
The Prototype Calendar object provides some methods for display manipulation:
| **Method** | **Since** | **Description** |
|:-----------|:----------|:----------------|
|Date getDate(null|Date date)|0.1        |Returns the correct date object for Calendar use ~~(time set to 00:00)~~|
|Calendar hide()|0.1        |Hides the calendar|
|Bool isUnavailable(null|string|Date date)|0.1        |Checks if the given date is restricted by noDates... or not|
|Date parseDate(string|Date date)|0.1        |The same like getDate for date strings|
|Calendar setCurrentDateTo(null|string|Date date)|0.1        |Alters the current date by the date parameter|
|Calendar setNoDatesAfterTo(null|string|Date date)|0.1        |(Re)sets the positive limit for unavailable dates|
|Calendar setNoDatesBeforeTo(null|string|Date date)|0.1        |(Re)sets the negative limit for unavailable dates|
|Calendar show()|0.1        |Shows the current month|
|Calendar showNextDay()|0.1        |Shows the month with the next day as the current day|
|Calendar showNextMonth()|0.1        |Shows the next month|
|Calendar showNextYear()|0.1.2      |Shows the next year|
|Calendar showPreviousDay()|0.1        |Shows the month with the previous day as the current day|
|Calendar showPreviousMonth()|0.1        |Shows the previous month|
|Calendar showPreviousYear()|0.1.2      |Shows the previous year|
|Calendar showMonth(null|Date date)|0.1        |Shows the month described by the date parameter|