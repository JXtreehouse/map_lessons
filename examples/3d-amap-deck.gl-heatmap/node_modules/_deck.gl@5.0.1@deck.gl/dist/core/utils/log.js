'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } // Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/* eslint-disable no-console */
/* global console */


var cache = {};

function log(priority, arg) {
  for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  (0, _assert2.default)(Number.isFinite(priority), 'log priority must be a number');
  if (priority <= log.priority) {
    // Node doesn't have console.debug, but using it looks better in browser consoles
    args = formatArgs.apply(undefined, [arg].concat(_toConsumableArray(args)));
    if (console.debug) {
      var _console;

      (_console = console).debug.apply(_console, _toConsumableArray(args));
    } else {
      var _console2;

      (_console2 = console).info.apply(_console2, _toConsumableArray(args));
    }
  }
}

function once(priority, arg) {
  for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    args[_key2 - 2] = arguments[_key2];
  }

  if (!cache[arg] && priority <= log.priority) {
    var _console3;

    args = checkForAssertionErrors(args);
    (_console3 = console).error.apply(_console3, _toConsumableArray(formatArgs.apply(undefined, [arg].concat(_toConsumableArray(args)))));
    cache[arg] = true;
  }
}

function warn(arg) {
  if (!cache[arg]) {
    var _console4;

    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    (_console4 = console).warn.apply(_console4, ['deck.gl: ' + arg].concat(args));
    cache[arg] = true;
  }
}

function error(arg) {
  var _console5;

  for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    args[_key4 - 1] = arguments[_key4];
  }

  (_console5 = console).error.apply(_console5, ['deck.gl: ' + arg].concat(args));
}

function deprecated(oldUsage, newUsage) {
  log.warn('`' + oldUsage + '` is deprecated and will be removed in a later version. Use `' + newUsage + '` instead');
}

function removed(oldUsage, newUsage) {
  log.error('`' + oldUsage + '` is no longer supported. Use `' + newUsage + '` instead, check our upgrade-guide.md for more details');
}

// Logs a message with a time
function time(priority, label) {
  (0, _assert2.default)(Number.isFinite(priority), 'log priority must be a number');
  if (priority <= log.priority) {
    // In case the platform doesn't have console.time
    if (console.time) {
      console.time(label);
    } else {
      console.info(label);
    }
  }
}

function timeEnd(priority, label) {
  (0, _assert2.default)(Number.isFinite(priority), 'log priority must be a number');
  if (priority <= log.priority) {
    // In case the platform doesn't have console.timeEnd
    if (console.timeEnd) {
      console.timeEnd(label);
    } else {
      console.info(label);
    }
  }
}

function group(priority, arg) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$collapsed = _ref.collapsed,
      collapsed = _ref$collapsed === undefined ? false : _ref$collapsed;

  if (priority <= log.priority) {
    if (collapsed) {
      console.groupCollapsed('luma.gl: ' + arg);
    } else {
      console.group('luma.gl: ' + arg);
    }
  }
}

function groupEnd(priority, arg) {
  if (priority <= log.priority) {
    console.groupEnd('luma.gl: ' + arg);
  }
}

// Helper functions

function formatArgs(firstArg) {
  if (typeof firstArg === 'function') {
    firstArg = firstArg();
  }

  for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    args[_key5 - 1] = arguments[_key5];
  }

  if (typeof firstArg === 'string') {
    args.unshift('deck.gl ' + firstArg);
  } else {
    args.unshift(firstArg);
    args.unshift('deck.gl');
  }
  return args;
}

// Assertions don't generate standard exceptions and don't print nicely
function checkForAssertionErrors(args) {
  var isAssertion = args && args.length > 0 && _typeof(args[0]) === 'object' && args[0] !== null && args[0].name === 'AssertionError';

  if (isAssertion) {
    args = Array.prototype.slice.call(args);
    args.unshift('assert(' + args[0].message + ')');
  }
  return args;
}

log.priority = 0;
log.log = log;
log.once = once;
log.time = time;
log.timeEnd = timeEnd;
log.warn = warn;
log.error = error;
log.deprecated = deprecated;
log.removed = removed;
log.group = group;
log.groupEnd = groupEnd;

exports.default = log;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3V0aWxzL2xvZy5qcyJdLCJuYW1lcyI6WyJjYWNoZSIsImxvZyIsInByaW9yaXR5IiwiYXJnIiwiYXJncyIsIk51bWJlciIsImlzRmluaXRlIiwiZm9ybWF0QXJncyIsImNvbnNvbGUiLCJkZWJ1ZyIsImluZm8iLCJvbmNlIiwiY2hlY2tGb3JBc3NlcnRpb25FcnJvcnMiLCJlcnJvciIsIndhcm4iLCJkZXByZWNhdGVkIiwib2xkVXNhZ2UiLCJuZXdVc2FnZSIsInJlbW92ZWQiLCJ0aW1lIiwibGFiZWwiLCJ0aW1lRW5kIiwiZ3JvdXAiLCJjb2xsYXBzZWQiLCJncm91cENvbGxhcHNlZCIsImdyb3VwRW5kIiwiZmlyc3RBcmciLCJ1bnNoaWZ0IiwiaXNBc3NlcnRpb24iLCJsZW5ndGgiLCJuYW1lIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCJtZXNzYWdlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQXNCQTs7Ozs7O29NQXRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOzs7QUFHQSxJQUFNQSxRQUFRLEVBQWQ7O0FBRUEsU0FBU0MsR0FBVCxDQUFhQyxRQUFiLEVBQXVCQyxHQUF2QixFQUFxQztBQUFBLG9DQUFOQyxJQUFNO0FBQU5BLFFBQU07QUFBQTs7QUFDbkMsd0JBQU9DLE9BQU9DLFFBQVAsQ0FBZ0JKLFFBQWhCLENBQVAsRUFBa0MsK0JBQWxDO0FBQ0EsTUFBSUEsWUFBWUQsSUFBSUMsUUFBcEIsRUFBOEI7QUFDNUI7QUFDQUUsV0FBT0csNkJBQVdKLEdBQVgsNEJBQW1CQyxJQUFuQixHQUFQO0FBQ0EsUUFBSUksUUFBUUMsS0FBWixFQUFtQjtBQUFBOztBQUNqQiwyQkFBUUEsS0FBUixvQ0FBaUJMLElBQWpCO0FBQ0QsS0FGRCxNQUVPO0FBQUE7O0FBQ0ws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QUNBakIsSUFBSXFCLEtBQUosR0FBWUEsS0FBWjtBQUNBckIsSUFBSXdCLFFBQUosR0FBZUEsUUFBZjs7a0JBRWV4QixHIiwiZmlsZSI6ImxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSAtIDIwMTcgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4vKiBnbG9iYWwgY29uc29sZSAqL1xuaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnO1xuXG5jb25zdCBjYWNoZSA9IHt9O1xuXG5mdW5jdGlvbiBsb2cocHJpb3JpdHksIGFyZywgLi4uYXJncykge1xuICBhc3NlcnQoTnVtYmVyLmlzRmluaXRlKHByaW9yaXR5KSwgJ2xvZyBwcmlvcml0eSBtdXN0IGJlIGEgbnVtYmVyJyk7XG4gIGlmIChwcmlvcml0eSA8PSBsb2cucHJpb3JpdHkpIHtcbiAgICAvLyBOb2RlIGRvZXNuJ3QgaGF2ZSBjb25zb2xlLmRlYnVnLCBidXQgdXNpbmcgaXQgbG9va3MgYmV0dGVyIGluIGJyb3dzZXIgY29uc29sZXNcbiAgICBhcmdzID0gZm9ybWF0QXJncyhhcmcsIC4uLmFyZ3MpO1xuICAgIGlmIChjb25zb2xlLmRlYnVnKSB7XG4gICAgICBjb25zb2xlLmRlYnVnKC4uLmFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmluZm8oLi4uYXJncyk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIG9uY2UocHJpb3JpdHksIGFyZywgLi4uYXJncykge1xuICBpZiAoIWNhY2hlW2FyZ10gJiYgcHJpb3JpdHkgPD0gbG9nLnByaW9yaXR5KSB7XG4gICAgYXJncyA9IGNoZWNrRm9yQXNzZXJ0aW9uRXJyb3JzKGFyZ3MpO1xuICAgIGNvbnNvbGUuZXJyb3IoLi4uZm9ybWF0QXJncyhhcmcsIC4uLmFyZ3MpKTtcbiAgICBjYWNoZVthcmddID0gdHJ1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiB3YXJuKGFyZywgLi4uYXJncykge1xuICBpZiAoIWNhY2hlW2FyZ10pIHtcbiAgICBjb25zb2xlLndhcm4oYGRlY2suZ2w6ICR7YXJnfWAsIC4uLmFyZ3MpO1xuICAgIGNhY2hlW2FyZ10gPSB0cnVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIGVycm9yKGFyZywgLi4uYXJncykge1xuICBjb25zb2xlLmVycm9yKGBkZWNrLmdsOiAke2FyZ31gLCAuLi5hcmdzKTtcbn1cblxuZnVuY3Rpb24gZGVwcmVjYXRlZChvbGRVc2FnZSwgbmV3VXNhZ2UpIHtcbiAgbG9nLndhcm4oYFxcYCR7b2xkVXNhZ2V9XFxgIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBcXFxuaW4gYSBsYXRlciB2ZXJzaW9uLiBVc2UgXFxgJHtuZXdVc2FnZX1cXGAgaW5zdGVhZGApO1xufVxuXG5mdW5jdGlvbiByZW1vdmVkKG9sZFVzYWdlLCBuZXdVc2FnZSkge1xuICBsb2cuZXJyb3IoYFxcYCR7b2xkVXNhZ2V9XFxgIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQuIFVzZSBcXGAke25ld1VzYWdlfVxcYCBpbnN0ZWFkLFxcXG4gY2hlY2sgb3VyIHVwZ3JhZGUtZ3VpZGUubWQgZm9yIG1vcmUgZGV0YWlsc2ApO1xufVxuXG4vLyBMb2dzIGEgbWVzc2FnZSB3aXRoIGEgdGltZVxuZnVuY3Rpb24gdGltZShwcmlvcml0eSwgbGFiZWwpIHtcbiAgYXNzZXJ0KE51bWJlci5pc0Zpbml0ZShwcmlvcml0eSksICdsb2cgcHJpb3JpdHkgbXVzdCBiZSBhIG51bWJlcicpO1xuICBpZiAocHJpb3JpdHkgPD0gbG9nLnByaW9yaXR5KSB7XG4gICAgLy8gSW4gY2FzZSB0aGUgcGxhdGZvcm0gZG9lc24ndCBoYXZlIGNvbnNvbGUudGltZVxuICAgIGlmIChjb25zb2xlLnRpbWUpIHtcbiAgICAgIGNvbnNvbGUudGltZShsYWJlbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuaW5mbyhsYWJlbCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHRpbWVFbmQocHJpb3JpdHksIGxhYmVsKSB7XG4gIGFzc2VydChOdW1iZXIuaXNGaW5pdGUocHJpb3JpdHkpLCAnbG9nIHByaW9yaXR5IG11c3QgYmUgYSBudW1iZXInKTtcbiAgaWYgKHByaW9yaXR5IDw9IGxvZy5wcmlvcml0eSkge1xuICAgIC8vIEluIGNhc2UgdGhlIHBsYXRmb3JtIGRvZXNuJ3QgaGF2ZSBjb25zb2xlLnRpbWVFbmRcbiAgICBpZiAoY29uc29sZS50aW1lRW5kKSB7XG4gICAgICBjb25zb2xlLnRpbWVFbmQobGFiZWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmluZm8obGFiZWwpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBncm91cChwcmlvcml0eSwgYXJnLCB7Y29sbGFwc2VkID0gZmFsc2V9ID0ge30pIHtcbiAgaWYgKHByaW9yaXR5IDw9IGxvZy5wcmlvcml0eSkge1xuICAgIGlmIChjb2xsYXBzZWQpIHtcbiAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoYGx1bWEuZ2w6ICR7YXJnfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmdyb3VwKGBsdW1hLmdsOiAke2FyZ31gKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ3JvdXBFbmQocHJpb3JpdHksIGFyZykge1xuICBpZiAocHJpb3JpdHkgPD0gbG9nLnByaW9yaXR5KSB7XG4gICAgY29uc29sZS5ncm91cEVuZChgbHVtYS5nbDogJHthcmd9YCk7XG4gIH1cbn1cblxuLy8gSGVscGVyIGZ1bmN0aW9uc1xuXG5mdW5jdGlvbiBmb3JtYXRBcmdzKGZpcnN0QXJnLCAuLi5hcmdzKSB7XG4gIGlmICh0eXBlb2YgZmlyc3RBcmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICBmaXJzdEFyZyA9IGZpcnN0QXJnKCk7XG4gIH1cbiAgaWYgKHR5cGVvZiBmaXJzdEFyZyA9PT0gJ3N0cmluZycpIHtcbiAgICBhcmdzLnVuc2hpZnQoYGRlY2suZ2wgJHtmaXJzdEFyZ31gKTtcbiAgfSBlbHNlIHtcbiAgICBhcmdzLnVuc2hpZnQoZmlyc3RBcmcpO1xuICAgIGFyZ3MudW5zaGlmdCgnZGVjay5nbCcpO1xuICB9XG4gIHJldHVybiBhcmdzO1xufVxuXG4vLyBBc3NlcnRpb25zIGRvbid0IGdlbmVyYXRlIHN0YW5kYXJkIGV4Y2VwdGlvbnMgYW5kIGRvbid0IHByaW50IG5pY2VseVxuZnVuY3Rpb24gY2hlY2tGb3JBc3NlcnRpb25FcnJvcnMoYXJncykge1xuICBjb25zdCBpc0Fzc2VydGlvbiA9XG4gICAgYXJncyAmJlxuICAgIGFyZ3MubGVuZ3RoID4gMCAmJlxuICAgIHR5cGVvZiBhcmdzWzBdID09PSAnb2JqZWN0JyAmJlxuICAgIGFyZ3NbMF0gIT09IG51bGwgJiZcbiAgICBhcmdzWzBdLm5hbWUgPT09ICdBc3NlcnRpb25FcnJvcic7XG5cbiAgaWYgKGlzQXNzZXJ0aW9uKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MpO1xuICAgIGFyZ3MudW5zaGlmdChgYXNzZXJ0KCR7YXJnc1swXS5tZXNzYWdlfSlgKTtcbiAgfVxuICByZXR1cm4gYXJncztcbn1cblxubG9nLnByaW9yaXR5ID0gMDtcbmxvZy5sb2cgPSBsb2c7XG5sb2cub25jZSA9IG9uY2U7XG5sb2cudGltZSA9IHRpbWU7XG5sb2cudGltZUVuZCA9IHRpbWVFbmQ7XG5sb2cud2FybiA9IHdhcm47XG5sb2cuZXJyb3IgPSBlcnJvcjtcbmxvZy5kZXByZWNhdGVkID0gZGVwcmVjYXRlZDtcbmxvZy5yZW1vdmVkID0gcmVtb3ZlZDtcbmxvZy5ncm91cCA9IGdyb3VwO1xubG9nLmdyb3VwRW5kID0gZ3JvdXBFbmQ7XG5cbmV4cG9ydCBkZWZhdWx0IGxvZztcbiJdfQ==