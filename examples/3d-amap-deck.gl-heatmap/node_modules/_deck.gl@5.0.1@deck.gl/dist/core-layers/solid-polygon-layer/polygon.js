"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSimple = isSimple;
exports.normalize = normalize;
exports.getVertexCount = getVertexCount;
exports.getTriangleCount = getTriangleCount;
exports.forEachVertex = forEachVertex;
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

// Basic polygon support
//
// Handles simple and complex polygons
// Simple polygons are arrays of vertices, implicitly "closed"
// Complex polygons are arrays of simple polygons, with the first polygon
// representing the outer hull and other polygons representing holes

/**
 * Check if this is a non-nested polygon (i.e. the first element of the first element is a number)
 * @param {Array} polygon - either a complex or simple polygon
 * @return {Boolean} - true if the polygon is a simple polygon (i.e. not an array of polygons)
 */
function isSimple(polygon) {
  return polygon.length >= 1 && polygon[0].length >= 2 && Number.isFinite(polygon[0][0]);
}

/**
 * Normalize to ensure that all polygons in a list are complex - simplifies processing
 * @param {Array} polygon - either a complex or a simple polygon
 * @param {Object} opts
 * @param {Object} opts.dimensions - if 3, the coords will be padded with 0's if needed
 * @return {Array} - returns a complex polygons
 */
function normalize(polygon) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$dimensions = _ref.dimensions,
      dimensions = _ref$dimensions === undefined ? 3 : _ref$dimensions;

  return isSimple(polygon) ? [polygon] : polygon;
}

/**
 * Check if this is a non-nested polygon (i.e. the first element of the first element is a number)
 * @param {Array} polygon - either a complex or simple polygon
 * @return {Boolean} - true if the polygon is a simple polygon (i.e. not an array of polygons)
 */
function getVertexCount(polygon) {
  return isSimple(polygon) ? polygon.length : polygon.reduce(function (length, simplePolygon) {
    return length + simplePolygon.length;
  }, 0);
}

// Return number of triangles needed to tesselate the polygon
function getTriangleCount(polygon) {
  var triangleCount = 0;
  var first = true;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = normalize(polygon)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var simplePolygon = _step.value;

      var size = simplePolygon.length;
      if (first) {
        triangleCount += size >= 3 ? size - 2 : 0;
      } else {
        triangleCount += size + 1;
      }
      first = false;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return triangleCount;
}

function forEachVertex(polygon, visitor) {
  if (isSimple(polygon)) {
    polygon.forEach(visitor);
    return;
  }

  var vertexIndex = 0;
  polygon.forEach(function (simplePolygon) {
    simplePolygon.forEach(function (v, i, p) {
      return visitor(v, vertexIndex, polygon);
    });
    vertexIndex++;
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlLWxheWVycy9zb2xpZC1wb2x5Z29uLWxheWVyL3BvbHlnb24uanMiXSwibmFtZXMiOlsiaXNTaW1wbGUiLCJub3JtYWxpemUiLCJnZXRWZXJ0ZXhDb3VudCIsImdldFRyaWFuZ2xlQ291bnQiLCJmb3JFYWNoVmVydGV4IiwicG9seWdvbiIsImxlbmd0aCIsIk51bWJlciIsImlzRmluaXRlIiwiZGltZW5zaW9ucyIsInJlZHVjZSIsInNpbXBsZVBvbHlnb24iLCJ0cmlhbmdsZUNvdW50IiwiZmlyc3QiLCJzaXplIiwidmlzaXRvciIsImZvckVhY2giLCJ2ZXJ0ZXhJbmRleCIsInYiLCJpIiwicCJdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFnQ2dCQSxRLEdBQUFBLFE7UUFXQUMsUyxHQUFBQSxTO1FBU0FDLGMsR0FBQUEsYztRQU9BQyxnQixHQUFBQSxnQjtRQWVBQyxhLEdBQUFBLGE7QUExRWhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7QUFLTyxTQUFTSixRQUFULENBQWtCSyxPQUFsQixFQUEyQjtBQUNoQyxTQUFPQSxRQUFRQyxNQUFSLElBQWtCLENBQWxCLElBQXVCRCxRQUFRLENBQVIsRUFBV0MsTUFBWCxJQUFxQixDQUE1QyxJQUFpREMsT0FBT0MsUUFBUCxDQUFnQkgsUUFBUSxDQUFSLEVBQVcsQ0FBWCxDQUFoQixDQUF4RDtBQUNEOztBQUVEOzs7Ozs7O0FBT08sU0FBU0osU0FBVCxDQUFtQkksT0FBbkIsRUFBbUQ7QUFBQSxpRkFBSixFQUFJO0FBQUEsNkJBQXRCSSxVQUFzQjtBQUFBLE1BQXRCQSxVQUFzQixtQ0FBVCxDQUFTOztBQUN4RCxTQUFPVCxTQUFTSyxPQUFULElBQW9CLENBQUNBLE9BQUQsQ0FBcEIsR0FBZ0NBLE9BQXZDO0FBQ0Q7O0FBRUQ7Ozs7O0FBS08sU0FBU0gsY0FBVCxDQUF3QkcsT0FBeEIsRUFBaUM7QUFDdEMsU0FBT0wsU0FBU0ssT0FBVCxJQUNIQSxRQUFRQyxNQURMLEdBRUhELFFBQVFLLE1BQVIsQ0FBZSxVQUFDSixNQUFELEVBQVNLLGFBQVQ7QUFBQSxXQUEyQkwsU0FBU0ssY0FBY0wsTUFBbEQ7QUFBQSxHQUFmLEVBQXlFLENBQXpFLENBRko7QUFHRDs7QUFFRDtBQUNPLFNBQVNILGdCQUFULENBQTBCRSxPQUExQixFQUFtQztBQUN4QyxNQUFJTyxnQkFBZ0IsQ0FBcEI7QUFDQSxNQUFJQyxRQUFRLElBQVo7QUFGd0M7QUFBQTtBQUFBOztBQUFBO0FBR3hDLHlCQUE0QlosVUFBVUksT0FBVixDQUE1Qiw4SEFBZ0Q7QUFBQSxVQUFyQ00sYUFBcUM7O0FBQzlDLFVBQU1HLE9BQU9ILGNBQWNMLE1BQTNCO0FBQ0EsVUFBSU8sS0FBSixFQUFXO0FBQ1RELHlCQUFpQkUsUUFBUSxDQUFSLEdBQVlBLE9BQU8sQ0FBbkIsR0FBdUIsQ0FBeEM7QUFDRCxPQUZELE1BRU87QUFDTEYseUJBQWlCRSxPQUFPLENBQXhCO0FBQ0Q7QUFDREQsY0FBUSxLQUFSO0FBQ0Q7QUFYdUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFZeEMsU0FBT0QsYUFBUDtBQUNEOztBQUVNLFNBQVNSLGFBQVQsQ0FBdUJDLE9BQXZCLEVBQWdDVSxPQUFoQyxFQUF5QztBQUM5QyxNQUFJZixTQUFTSyxPQUFULENBQUosRUFBdUI7QUFDckJBLFlBQVFXLE9BQVIsQ0FBZ0JELE9BQWhCO0FBQ0E7QUFDRDs7QUFFRCxNQUFJRSxjQUFjLENBQWxCO0FBQ0FaLFVBQVFXLE9BQVIsQ0FBZ0IseUJBQWlCO0FBQy9CTCxrQkFBY0ssT0FBZCxDQUFzQixVQUFDRSxDQUFELEVBQUlDLENBQUosRUFBT0MsQ0FBUDtBQUFBLGFBQWFMLFFBQVFHLENBQVIsRUFBV0QsV0FBWCxFQUF3QlosT0FBeEIsQ0FBYjtBQUFBLEtBQXRCO0FBQ0FZO0FBQ0QsR0FIRDtBQUlEIiwiZmlsZSI6InBvbHlnb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgLSAyMDE3IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuLy8gQmFzaWMgcG9seWdvbiBzdXBwb3J0XG4vL1xuLy8gSGFuZGxlcyBzaW1wbGUgYW5kIGNvbXBsZXggcG9seWdvbnNcbi8vIFNpbXBsZSBwb2x5Z29ucyBhcmUgYXJyYXlzIG9mIHZlcnRpY2VzLCBpbXBsaWNpdGx5IFwiY2xvc2VkXCJcbi8vIENvbXBsZXggcG9seWdvbnMgYXJlIGFycmF5cyBvZiBzaW1wbGUgcG9seWdvbnMsIHdpdGggdGhlIGZpcnN0IHBvbHlnb25cbi8vIHJlcHJlc2VudGluZyB0aGUgb3V0ZXIgaHVsbCBhbmQgb3RoZXIgcG9seWdvbnMgcmVwcmVzZW50aW5nIGhvbGVzXG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBpcyBhIG5vbi1uZXN0ZWQgcG9seWdvbiAoaS5lLiB0aGUgZmlyc3QgZWxlbWVudCBvZiB0aGUgZmlyc3QgZWxlbWVudCBpcyBhIG51bWJlcilcbiAqIEBwYXJhbSB7QXJyYXl9IHBvbHlnb24gLSBlaXRoZXIgYSBjb21wbGV4IG9yIHNpbXBsZSBwb2x5Z29uXG4gKiBAcmV0dXJuIHtCb29sZWFufSAtIHRydWUgaWYgdGhlIHBvbHlnb24gaXMgYSBzaW1wbGUgcG9seWdvbiAoaS5lLiBub3QgYW4gYXJyYXkgb2YgcG9seWdvbnMpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1NpbXBsZShwb2x5Z29uKSB7XG4gIHJldHVybiBwb2x5Z29uLmxlbmd0aCA+PSAxICYmIHBvbHlnb25bMF0ubGVuZ3RoID49IDIgJiYgTnVtYmVyLmlzRmluaXRlKHBvbHlnb25bMF1bMF0pO1xufVxuXG4vKipcbiAqIE5vcm1hbGl6ZSB0byBlbnN1cmUgdGhhdCBhbGwgcG9seWdvbnMgaW4gYSBsaXN0IGFyZSBjb21wbGV4IC0gc2ltcGxpZmllcyBwcm9jZXNzaW5nXG4gKiBAcGFyYW0ge0FycmF5fSBwb2x5Z29uIC0gZWl0aGVyIGEgY29tcGxleCBvciBhIHNpbXBsZSBwb2x5Z29uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICogQHBhcmFtIHtPYmplY3R9IG9wdHMuZGltZW5zaW9ucyAtIGlmIDMsIHRoZSBjb29yZHMgd2lsbCBiZSBwYWRkZWQgd2l0aCAwJ3MgaWYgbmVlZGVkXG4gKiBAcmV0dXJuIHtBcnJheX0gLSByZXR1cm5zIGEgY29tcGxleCBwb2x5Z29uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplKHBvbHlnb24sIHtkaW1lbnNpb25zID0gM30gPSB7fSkge1xuICByZXR1cm4gaXNTaW1wbGUocG9seWdvbikgPyBbcG9seWdvbl0gOiBwb2x5Z29uO1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHRoaXMgaXMgYSBub24tbmVzdGVkIHBvbHlnb24gKGkuZS4gdGhlIGZpcnN0IGVsZW1lbnQgb2YgdGhlIGZpcnN0IGVsZW1lbnQgaXMgYSBudW1iZXIpXG4gKiBAcGFyYW0ge0FycmF5fSBwb2x5Z29uIC0gZWl0aGVyIGEgY29tcGxleCBvciBzaW1wbGUgcG9seWdvblxuICogQHJldHVybiB7Qm9vbGVhbn0gLSB0cnVlIGlmIHRoZSBwb2x5Z29uIGlzIGEgc2ltcGxlIHBvbHlnb24gKGkuZS4gbm90IGFuIGFycmF5IG9mIHBvbHlnb25zKVxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VmVydGV4Q291bnQocG9seWdvbikge1xuICByZXR1cm4gaXNTaW1wbGUocG9seWdvbilcbiAgICA/IHBvbHlnb24ubGVuZ3RoXG4gICAgOiBwb2x5Z29uLnJlZHVjZSgobGVuZ3RoLCBzaW1wbGVQb2x5Z29uKSA9PiBsZW5ndGggKyBzaW1wbGVQb2x5Z29uLmxlbmd0aCwgMCk7XG59XG5cbi8vIFJldHVybiBudW1iZXIgb2YgdHJpYW5nbGVzIG5lZWRlZCB0byB0ZXNzZWxhdGUgdGhlIHBvbHlnb25cbmV4cG9ydCBmdW5jdGlvbiBnZXRUcmlhbmdsZUNvdW50KHBvbHlnb24pIHtcbiAgbGV0IHRyaWFuZ2xlQ291bnQgPSAwO1xuICBsZXQgZmlyc3QgPSB0cnVlO1xuICBmb3IgKGNvbnN0IHNpbXBsZVBvbHlnb24gb2Ygbm9ybWFsaXplKHBvbHlnb24pKSB7XG4gICAgY29uc3Qgc2l6ZSA9IHNpbXBsZVBvbHlnb24ubGVuZ3RoO1xuICAgIGlmIChmaXJzdCkge1xuICAgICAgdHJpYW5nbGVDb3VudCArPSBzaXplID49IDMgPyBzaXplIC0gMiA6IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyaWFuZ2xlQ291bnQgKz0gc2l6ZSArIDE7XG4gICAgfVxuICAgIGZpcnN0ID0gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRyaWFuZ2xlQ291bnQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JFYWNoVmVydGV4KHBvbHlnb24sIHZpc2l0b3IpIHtcbiAgaWYgKGlzU2ltcGxlKHBvbHlnb24pKSB7XG4gICAgcG9seWdvbi5mb3JFYWNoKHZpc2l0b3IpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCB2ZXJ0ZXhJbmRleCA9IDA7XG4gIHBvbHlnb24uZm9yRWFjaChzaW1wbGVQb2x5Z29uID0+IHtcbiAgICBzaW1wbGVQb2x5Z29uLmZvckVhY2goKHYsIGksIHApID0+IHZpc2l0b3IodiwgdmVydGV4SW5kZXgsIHBvbHlnb24pKTtcbiAgICB2ZXJ0ZXhJbmRleCsrO1xuICB9KTtcbn1cbiJdfQ==