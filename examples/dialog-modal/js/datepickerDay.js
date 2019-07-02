/*
*   This content is licensed according to the W3C Software License at
*   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
*
*   File:   datepickerDay.js
*/

var DatePickerDay = function (domNode, datepicker, index, row, column) {

  this.index = index;
  this.row = row;
  this.column = column;

  this.year = -1;
  this.month = -1;
  this.day = -1;

  this.domNode = domNode;
  this.datepicker = datepicker;

  this.keyCode = Object.freeze({
    'TAB': 9,
    'ENTER': 13,
    'ESC': 27,
    'SPACE': 32,
    'PAGEUP': 33,
    'PAGEDOWN': 34,
    'END': 35,
    'HOME': 36,
    'LEFT': 37,
    'UP': 38,
    'RIGHT': 39,
    'DOWN': 40
  });
};

DatePickerDay.prototype.init = function () {
  this.domNode.setAttribute('tabindex', '-1');
  this.domNode.addEventListener('mousedown', this.handleMouseDown.bind(this));
  this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));

  this.domNode.innerHTML = '-1';

};

DatePickerDay.prototype.isDisabled = function () {
  return this.domNode.classList.contains('disabled');
};

DatePickerDay.prototype.updateDay = function (disable, year, month, day) {

  if (disable) {
    this.domNode.classList.add('disabled');
  }
  else {
    this.domNode.classList.remove('disabled');
  }

  this.year = year;
  this.month = month;
  this.day = day;

  this.domNode.innerHTML = day + 1;
  this.domNode.setAttribute('tabindex', '-1');
  this.domNode.removeAttribute('aria-selected');

  var d = (day + 1).toString();
  if (day < 9) {
    d = '0' + d;
  }

  var m = (month + 1).toString();
  if (month < 9) {
    m = '0' + m;
  }

  this.domNode.setAttribute('data-date', year + '-' + m + '-' + d);

};

DatePickerDay.prototype.handleKeyDown = function (event) {
  var flag = false;
  var onFirstRow = this.datepicker.onFirstRow();
  var onLastRow = this.datepicker.onLastRow();

  switch (event.keyCode) {

    case this.keyCode.ESC:
      this.datepicker.hide();
      break;

    case this.keyCode.TAB:
      this.datepicker.cancelButtonNode.focus();
      if (event.shiftKey) {
        this.datepicker.nextYearNode.focus();
      }
      flag = true;
      break;

    case this.keyCode.ENTER:
    case this.keyCode.SPACE:
      this.datepicker.setTextboxDate();
      this.datepicker.hide();
      flag = true;
      break;

    case this.keyCode.RIGHT:
      this.datepicker.moveFocusToNextDay();
      flag = true;
      break;

    case this.keyCode.LEFT:
      this.datepicker.moveFocusToPreviousDay();
      flag = true;
      break;

    case this.keyCode.DOWN:
      this.datepicker.moveFocusToNextWeek();
      flag = true;
      break;

    case this.keyCode.UP:
      this.datepicker.moveFocusToPreviousWeek();
      flag = true;
      break;

    case this.keyCode.PAGEUP:
      if (event.shiftKey) {
        this.datepicker.moveToPreviousYear();
      }
      else {
        this.datepicker.moveToPreviousMonth();
      }
      this.datepicker.adjustCurrentDay(onFirstRow, onLastRow);
      this.datepicker.setFocusDay();
      flag = true;
      break;

    case this.keyCode.PAGEDOWN:
      if (event.shiftKey) {
        this.datepicker.moveToNextYear();
      }
      else {
        this.datepicker.moveToNextMonth();
      }
      this.datepicker.adjustCurrentDay(onFirstRow, onLastRow);
      this.datepicker.setFocusDay();
      flag = true;
      break;

    case this.keyCode.HOME:
      this.datepicker.moveFocusToFirstDayOfWeek();
      flag = true;
      break;

    case this.keyCode.END:
      this.datepicker.moveFocusToLastDayOfWeek();
      flag = true;
      break;

  }

  if (flag) {
    event.stopPropagation();
    event.preventDefault();
  }

};

DatePickerDay.prototype.handleMouseDown = function (event) {
  this.datepicker.day = this.day;

  if (this.isDisabled()) {
    this.datepicker.moveToDay(this.day, this.month, this.year);
  }
  else {
    if (!this.datepicker.dateInput.hasFocus()) {
      this.datepicker.dateInput.ignoreBlurEvent = true;
    }
    this.datepicker.setTextboxDate();
    this.datepicker.hide();
  }

  event.stopPropagation();
  event.preventDefault();

};


