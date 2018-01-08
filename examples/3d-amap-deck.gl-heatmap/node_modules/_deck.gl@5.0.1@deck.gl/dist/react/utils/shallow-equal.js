'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.shallowEqual = shallowEqual;
// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
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

// Shallow compare
/* eslint-disable complexity */
function shallowEqual(a, b) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$ignore = _ref.ignore,
      ignore = _ref$ignore === undefined ? {} : _ref$ignore;

  if (a === b) {
    return true;
  }

  if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== 'object' || a === null || (typeof b === 'undefined' ? 'undefined' : _typeof(b)) !== 'object' || b === null) {
    return false;
  }

  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }

  for (var key in a) {
    if (!(key in ignore) && (!(key in b) || a[key] !== b[key])) {
      return false;
    }
  }
  for (var _key in b) {
    if (!(_key in ignore) && !(_key in a)) {
      return false;
    }
  }
  return true;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC91dGlscy9zaGFsbG93LWVxdWFsLmpzIl0sIm5hbWVzIjpbInNoYWxsb3dFcXVhbCIsImEiLCJiIiwiaWdub3JlIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsImtleSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFzQmdCQSxZLEdBQUFBLFk7QUF0QmhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDTyxTQUFTQSxZQUFULENBQXNCQyxDQUF0QixFQUF5QkMsQ0FBekIsRUFBZ0Q7QUFBQSxpRkFBSixFQUFJO0FBQUEseUJBQW5CQyxNQUFtQjtBQUFBLE1BQW5CQSxNQUFtQiwrQkFBVixFQUFVOztBQUNyRCxNQUFJRixNQUFNQyxDQUFWLEVBQWE7QUFDWCxXQUFPLElBQVA7QUFDRDs7QUFFRCxNQUFJLFFBQU9ELENBQVAseUNBQU9BLENBQVAsT0FBYSxRQUFiLElBQXlCQSxNQUFNLElBQS9CLElBQXVDLFFBQU9DLENBQVAseUNBQU9BLENBQVAsT0FBYSxRQUFwRCxJQUFnRUEsTUFBTSxJQUExRSxFQUFnRjtBQUM5RSxXQUFPLEtBQVA7QUFDRDs7QUFFRCxNQUFJRSxPQUFPQyxJQUFQLENBQVlKLENBQVosRUFBZUssTUFBZixLQUEwQkYsT0FBT0MsSUFBUCxDQUFZSCxDQUFaLEVBQWVJLE1BQTdDLEVBQXFEO0FBQ25ELFdBQU8sS0FBUDtBQUNEOztBQUVELE9BQUssSUFBTUMsR0FBWCxJQUFrQk4sQ0FBbEIsRUFBcUI7QUFDbkIsUUFBSSxFQUFFTSxPQUFPSixNQUFULE1BQXFCLEVBQUVJLE9BQU9MLENBQVQsS0FBZUQsRUFBRU0sR0FBRixNQUFXTCxFQUFFSyxHQUFGLENBQS9DLENBQUosRUFBNEQ7QUFDMUQsYUFBTyxLQUFQO0FBQ0Q7QUFDRjtBQUNELE9BQUssSUFBTUEsSUFBWCxJQUFrQkwsQ0FBbEIsRUFBcUI7QUFDbkIsUUFBSSxFQUFFSyxRQUFPSixNQUFULEtBQW9CLEVBQUVJLFFBQU9OLENBQVQsQ0FBeEIsRUFBcUM7QUFDbkMsYUFBTyxLQUFQO0FBQ0Q7QUFDRjtBQUNELFNBQU8sSUFBUDtBQUNEIiwiZmlsZSI6InNoYWxsb3ctZXF1YWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgLSAyMDE3IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuLy8gU2hhbGxvdyBjb21wYXJlXG4vKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovXG5leHBvcnQgZnVuY3Rpb24gc2hhbGxvd0VxdWFsKGEsIGIsIHtpZ25vcmUgPSB7fX0gPSB7fSkge1xuICBpZiAoYSA9PT0gYikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBhICE9PSAnb2JqZWN0JyB8fCBhID09PSBudWxsIHx8IHR5cGVvZiBiICE9PSAnb2JqZWN0JyB8fCBiID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKE9iamVjdC5rZXlzKGEpLmxlbmd0aCAhPT0gT2JqZWN0LmtleXMoYikubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yIChjb25zdCBrZXkgaW4gYSkge1xuICAgIGlmICghKGtleSBpbiBpZ25vcmUpICYmICghKGtleSBpbiBiKSB8fCBhW2tleV0gIT09IGJba2V5XSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgZm9yIChjb25zdCBrZXkgaW4gYikge1xuICAgIGlmICghKGtleSBpbiBpZ25vcmUpICYmICEoa2V5IGluIGEpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuIl19