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

var DateMethods = {

	getDate: function(date) {
		return (date instanceof Date ? date.clone() : new Date());
	},

	parseDate: function(date) {
		return this.getDate(date instanceof Date ? date : Date.parse(date));
	},
	
	parseToDayNumber: function(date) {
		return parseInt(this.parseDate(date).toString('dd'), 10);
	},
	
	parseToWeekNumber: function(date) {
		return parseInt(this.parseDate(date).getISOWeek(), 10);
	},
	
	parseToMonthNumber: function(date) {
		return parseInt(this.parseDate(date).toString('M'), 10);
	},
	
	parseToYearNumber: function(date) {
		return parseInt(this.parseDate(date).toString('yyyy'), 10);
	},

	isUnavailable: function(date) {
		var _date = this.parseDate(date);
		return (this.noDatesBefore instanceof Date && _date.compareTo(this.noDatesBefore) < 0) || (this.noDatesAfter instanceof Date && _date.compareTo(this.noDatesAfter) > 0);
	},

	setNoDatesBeforeTo: function(date) {
		this.noDatesBefore = date === null ? null : this.parseDate(date);
		return this;
	},

	setNoDatesAfterTo: function(date) {
		this.noDatesAfter = date === null ? null : this.parseDate(date);
		return this;
	},

	setCurrentDateTo: function(date) {
		var _date = this.parseDate(date);
		this.currentDate = this.isUnavailable(_date) ? (this.noDatesBefore === null ? this.noDatesAfter : this.noDatesBefore) : _date;
		return this;
	}

};
