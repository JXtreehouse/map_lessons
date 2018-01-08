"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.linearScale = linearScale;
exports.quantizeScale = quantizeScale;
exports.getQuantizeScale = getQuantizeScale;
exports.getLinearScale = getLinearScale;
exports.clamp = clamp;
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

// Linear scale maps continuous domain to continuous range
function linearScale(domain, range, value) {
  return (value - domain[0]) / (domain[1] - domain[0]) * (range[1] - range[0]) + range[0];
}

// Quantize scale is similar to linear scales,
// except it uses a discrete rather than continuous range
function quantizeScale(domain, range, value) {
  var step = (domain[1] - domain[0]) / range.length;
  var idx = Math.floor((value - domain[0]) / step);
  var clampIdx = Math.max(Math.min(idx, range.length - 1), 0);

  return range[clampIdx];
}

// return a quantize scale function
function getQuantizeScale(domain, range) {
  return function (value) {
    var step = (domain[1] - domain[0]) / range.length;
    var idx = Math.floor((value - domain[0]) / step);
    var clampIdx = Math.max(Math.min(idx, range.length - 1), 0);

    return range[clampIdx];
  };
}

// return a linear scale funciton
function getLinearScale(domain, range) {
  return function (value) {
    return (value - domain[0]) / (domain[1] - domain[0]) * (range[1] - range[0]) + range[0];
  };
}

function clamp(_ref, value) {
  var _ref2 = _slicedToArray(_ref, 2),
      min = _ref2[0],
      max = _ref2[1];

  return Math.min(max, Math.max(min, value));
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3V0aWxzL3NjYWxlLXV0aWxzLmpzIl0sIm5hbWVzIjpbImxpbmVhclNjYWxlIiwicXVhbnRpemVTY2FsZSIsImdldFF1YW50aXplU2NhbGUiLCJnZXRMaW5lYXJTY2FsZSIsImNsYW1wIiwiZG9tYWluIiwicmFuZ2UiLCJ2YWx1ZSIsInN0ZXAiLCJsZW5ndGgiLCJpZHgiLCJNYXRoIiwiZmxvb3IiLCJjbGFtcElkeCIsIm1heCIsIm1pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFxQmdCQSxXLEdBQUFBLFc7UUFNQUMsYSxHQUFBQSxhO1FBU0FDLGdCLEdBQUFBLGdCO1FBV0FDLGMsR0FBQUEsYztRQUlBQyxLLEdBQUFBLEs7QUFuRGhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ08sU0FBU0osV0FBVCxDQUFxQkssTUFBckIsRUFBNkJDLEtBQTdCLEVBQW9DQyxLQUFwQyxFQUEyQztBQUNoRCxTQUFPLENBQUNBLFFBQVFGLE9BQU8sQ0FBUCxDQUFULEtBQXVCQSxPQUFPLENBQVAsSUFBWUEsT0FBTyxDQUFQLENBQW5DLEtBQWlEQyxNQUFNLENBQU4sSUFBV0EsTUFBTSxDQUFOLENBQTVELElBQXdFQSxNQUFNLENBQU4sQ0FBL0U7QUFDRDs7QUFFRDtBQUNBO0FBQ08sU0FBU0wsYUFBVCxDQUF1QkksTUFBdkIsRUFBK0JDLEtBQS9CLEVBQXNDQyxLQUF0QyxFQUE2QztBQUNsRCxNQUFNQyxPQUFPLENBQUNILE9BQU8sQ0FBUCxJQUFZQSxPQUFPLENBQVAsQ0FBYixJQUEwQkMsTUFBTUcsTUFBN0M7QUFDQSxNQUFNQyxNQUFNQyxLQUFLQyxLQUFMLENBQVcsQ0FBQ0wsUUFBUUYsT0FBTyxDQUFQLENBQVQsSUFBc0JHLElBQWpDLENBQVo7QUFDQSxNQUFNSyxXQUFXRixLQUFLRyxHQUFMLENBQVNILEtBQUtJLEdBQUwsQ0FBU0wsR0FBVCxFQUFjSixNQUFNRyxNQUFOLEdBQWUsQ0FBN0IsQ0FBVCxFQUEwQyxDQUExQyxDQUFqQjs7QUFFQSxTQUFPSCxNQUFNTyxRQUFOLENBQVA7QUFDRDs7QUFFRDtBQUNPLFNBQVNYLGdCQUFULENBQTBCRyxNQUExQixFQUFrQ0MsS0FBbEMsRUFBeUM7QUFDOUMsU0FBTyxpQkFBUztBQUNkLFFBQU1FLE9BQU8sQ0FBQ0gsT0FBTyxDQUFQLElBQVlBLE9BQU8sQ0FBUCxDQUFiLElBQTBCQyxNQUFNRyxNQUE3QztBQUNBLFFBQU1DLE1BQU1DLEtBQUtDLEtBQUwsQ0FBVyxDQUFDTCxRQUFRRixPQUFPLENBQVAsQ0FBVCxJQUFzQkcsSUFBakMsQ0FBWjtBQUNBLFFBQU1LLFdBQVdGLEtBQUtHLEdBQUwsQ0FBU0gsS0FBS0ksR0FBTCxDQUFTTCxHQUFULEVBQWNKLE1BQU1HLE1BQU4sR0FBZSxDQUE3QixDQUFULEVBQTBDLENBQTFDLENBQWpCOztBQUVBLFdBQU9ILE1BQU1PLFFBQU4sQ0FBUDtBQUNELEdBTkQ7QUFPRDs7QUFFRDtBQUNPLFNBQVNWLGNBQVQsQ0FBd0JFLE1BQXhCLEVBQWdDQyxLQUFoQyxFQUF1QztBQUM1QyxTQUFPO0FBQUEsV0FBUyxDQUFDQyxRQUFRRixPQUFPLENBQVAsQ0FBVCxLQUF1QkEsT0FBTyxDQUFQLElBQVlBLE9BQU8sQ0FBUCxDQUFuQyxLQUFpREMsTUFBTSxDQUFOLElBQVdBLE1BQU0sQ0FBTixDQUE1RCxJQUF3RUEsTUFBTSxDQUFOLENBQWpGO0FBQUEsR0FBUDtBQUNEOztBQUVNLFNBQVNGLEtBQVQsT0FBMkJHLEtBQTNCLEVBQWtDO0FBQUE7QUFBQSxNQUFsQlEsR0FBa0I7QUFBQSxNQUFiRCxHQUFhOztBQUN2QyxTQUFPSCxLQUFLSSxHQUFMLENBQVNELEdBQVQsRUFBY0gsS0FBS0csR0FBTCxDQUFTQyxHQUFULEVBQWNSLEtBQWQsQ0FBZCxDQUFQO0FBQ0QiLCJmaWxlIjoic2NhbGUtdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgLSAyMDE3IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuLy8gTGluZWFyIHNjYWxlIG1hcHMgY29udGludW91cyBkb21haW4gdG8gY29udGludW91cyByYW5nZVxuZXhwb3J0IGZ1bmN0aW9uIGxpbmVhclNjYWxlKGRvbWFpbiwgcmFuZ2UsIHZhbHVlKSB7XG4gIHJldHVybiAodmFsdWUgLSBkb21haW5bMF0pIC8gKGRvbWFpblsxXSAtIGRvbWFpblswXSkgKiAocmFuZ2VbMV0gLSByYW5nZVswXSkgKyByYW5nZVswXTtcbn1cblxuLy8gUXVhbnRpemUgc2NhbGUgaXMgc2ltaWxhciB0byBsaW5lYXIgc2NhbGVzLFxuLy8gZXhjZXB0IGl0IHVzZXMgYSBkaXNjcmV0ZSByYXRoZXIgdGhhbiBjb250aW51b3VzIHJhbmdlXG5leHBvcnQgZnVuY3Rpb24gcXVhbnRpemVTY2FsZShkb21haW4sIHJhbmdlLCB2YWx1ZSkge1xuICBjb25zdCBzdGVwID0gKGRvbWFpblsxXSAtIGRvbWFpblswXSkgLyByYW5nZS5sZW5ndGg7XG4gIGNvbnN0IGlkeCA9IE1hdGguZmxvb3IoKHZhbHVlIC0gZG9tYWluWzBdKSAvIHN0ZXApO1xuICBjb25zdCBjbGFtcElkeCA9IE1hdGgubWF4KE1hdGgubWluKGlkeCwgcmFuZ2UubGVuZ3RoIC0gMSksIDApO1xuXG4gIHJldHVybiByYW5nZVtjbGFtcElkeF07XG59XG5cbi8vIHJldHVybiBhIHF1YW50aXplIHNjYWxlIGZ1bmN0aW9uXG5leHBvcnQgZnVuY3Rpb24gZ2V0UXVhbnRpemVTY2FsZShkb21haW4sIHJhbmdlKSB7XG4gIHJldHVybiB2YWx1ZSA9PiB7XG4gICAgY29uc3Qgc3RlcCA9IChkb21haW5bMV0gLSBkb21haW5bMF0pIC8gcmFuZ2UubGVuZ3RoO1xuICAgIGNvbnN0IGlkeCA9IE1hdGguZmxvb3IoKHZhbHVlIC0gZG9tYWluWzBdKSAvIHN0ZXApO1xuICAgIGNvbnN0IGNsYW1wSWR4ID0gTWF0aC5tYXgoTWF0aC5taW4oaWR4LCByYW5nZS5sZW5ndGggLSAxKSwgMCk7XG5cbiAgICByZXR1cm4gcmFuZ2VbY2xhbXBJZHhdO1xuICB9O1xufVxuXG4vLyByZXR1cm4gYSBsaW5lYXIgc2NhbGUgZnVuY2l0b25cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaW5lYXJTY2FsZShkb21haW4sIHJhbmdlKSB7XG4gIHJldHVybiB2YWx1ZSA9PiAodmFsdWUgLSBkb21haW5bMF0pIC8gKGRvbWFpblsxXSAtIGRvbWFpblswXSkgKiAocmFuZ2VbMV0gLSByYW5nZVswXSkgKyByYW5nZVswXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsYW1wKFttaW4sIG1heF0sIHZhbHVlKSB7XG4gIHJldHVybiBNYXRoLm1pbihtYXgsIE1hdGgubWF4KG1pbiwgdmFsdWUpKTtcbn1cbiJdfQ==