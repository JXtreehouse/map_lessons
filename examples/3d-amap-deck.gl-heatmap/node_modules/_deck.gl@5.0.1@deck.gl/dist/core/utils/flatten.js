"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flatten = flatten;
exports.countVertices = countVertices;
exports.flattenVertices = flattenVertices;
exports.fillArray = fillArray;
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

/**
 * Flattens a nested array into a single level array,
 * or a single value into an array with one value
 * @example flatten([[1, [2]], [3], 4]) => [1, 2, 3, 4]
 * @example flatten(1) => [1]
 * @param {Array} array The array to flatten.
 * @param {Function} filter= - Optional predicate called on each `value` to
 *   determine if it should be included (pushed onto) the resulting array.
 * @param {Function} map= - Optional transform applied to each array elements.
 * @param {Array} result=[] - Optional array to push value into
 * @return {Array} Returns the new flattened array (new array or `result` if provided)
 */
function flatten(array) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$filter = _ref.filter,
      filter = _ref$filter === undefined ? function () {
    return true;
  } : _ref$filter,
      _ref$map = _ref.map,
      map = _ref$map === undefined ? function (x) {
    return x;
  } : _ref$map,
      _ref$result = _ref.result,
      result = _ref$result === undefined ? [] : _ref$result;

  // Wrap single object in array
  if (!Array.isArray(array)) {
    return filter(array) ? [map(array)] : [];
  }
  // Deep flatten and filter the array
  return flattenArray(array, filter, map, result);
}

// Deep flattens an array. Helper to `flatten`, see its parameters
function flattenArray(array, filter, map, result) {
  var index = -1;
  while (++index < array.length) {
    var value = array[index];
    if (Array.isArray(value)) {
      flattenArray(value, filter, map, result);
    } else if (filter(value)) {
      result.push(map(value));
    }
  }
  return result;
}

function countVertices(nestedArray) {
  var count = 0;
  var index = -1;
  while (++index < nestedArray.length) {
    var value = nestedArray[index];
    if (Array.isArray(value) || ArrayBuffer.isView(value)) {
      count += countVertices(value);
    } else {
      count++;
    }
  }
  return count;
}

// Flattens nested array of vertices, padding third coordinate as needed
function flattenVertices(nestedArray) {
  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$result = _ref2.result,
      result = _ref2$result === undefined ? [] : _ref2$result,
      _ref2$dimensions = _ref2.dimensions,
      dimensions = _ref2$dimensions === undefined ? 3 : _ref2$dimensions;

  var index = -1;
  var vertexLength = 0;
  while (++index < nestedArray.length) {
    var value = nestedArray[index];
    if (Array.isArray(value) || ArrayBuffer.isView(value)) {
      flattenVertices(value, { result: result, dimensions: dimensions });
    } else {
      // eslint-disable-next-line
      if (vertexLength < dimensions) {
        result.push(value);
        vertexLength++;
      }
    }
  }
  // Add a third coordinate if needed
  if (vertexLength > 0 && vertexLength < dimensions) {
    result.push(0);
  }
  return result;
}

// Uses copyWithin to significantly speed up typed array value filling
function fillArray(_ref3) {
  var target = _ref3.target,
      source = _ref3.source,
      _ref3$start = _ref3.start,
      start = _ref3$start === undefined ? 0 : _ref3$start,
      _ref3$count = _ref3.count,
      count = _ref3$count === undefined ? 1 : _ref3$count;

  var length = source.length;
  var total = count * length;
  var copied = 0;
  for (var i = start; copied < length; copied++) {
    target[i++] = source[copied];
  }

  while (copied < total) {
    // If we have copied less than half, copy everything we got
    // else copy remaining in one operation
    if (copied < total - copied) {
      target.copyWithin(start + copied, start, start + copied);
      copied *= 2;
    } else {
      target.copyWithin(start + copied, start, start + total - copied);
      copied = total;
    }
  }

  return target;
}

// Flattens nested array of vertices, padding third coordinate as needed
/*
export function flattenTypedVertices(nestedArray, {
  result = [],
  Type = Float32Array,
  start = 0,
  dimensions = 3
} = {}) {
  let index = -1;
  let vertexLength = 0;
  while (++index < nestedArray.length) {
    const value = nestedArray[index];
    if (Array.isArray(value) || ArrayBuffer.isView(value)) {
      start = flattenTypedVertices(value, {result, start, dimensions});
    } else {
      if (vertexLength < dimensions) { // eslint-disable-line
        result[start++] = value;
        vertexLength++;
      }
    }
  }
  // Add a third coordinate if needed
  if (vertexLength > 0 && vertexLength < dimensions) {
    result[start++] = 0;
  }
  return start;
}
*/
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3V0aWxzL2ZsYXR0ZW4uanMiXSwibmFtZXMiOlsiZmxhdHRlbiIsImNvdW50VmVydGljZXMiLCJmbGF0dGVuVmVydGljZXMiLCJmaWxsQXJyYXkiLCJhcnJheSIsImZpbHRlciIsIm1hcCIsIngiLCJyZXN1bHQiLCJBcnJheSIsImlzQXJyYXkiLCJmbGF0dGVuQXJyYXkiLCJpbmRleCIsImxlbmd0aCIsInZhbHVlIiwicHVzaCIsIm5lc3RlZEFycmF5IiwiY291bnQiLCJBcnJheUJ1ZmZlciIsImlzVmlldyIsImRpbWVuc2lvbnMiLCJ2ZXJ0ZXhMZW5ndGgiLCJ0YXJnZXQiLCJzb3VyY2UiLCJzdGFydCIsInRvdGFsIiwiY29waWVkIiwiaSIsImNvcHlXaXRoaW4iXSwibWFwcGluZ3MiOiI7Ozs7O1FBZ0NnQkEsTyxHQUFBQSxPO1FBdUJBQyxhLEdBQUFBLGE7UUFlQUMsZSxHQUFBQSxlO1FBdUJBQyxTLEdBQUFBLFM7QUE3RmhCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7QUFZTyxTQUFTSCxPQUFULENBQWlCSSxLQUFqQixFQUErRTtBQUFBLGlGQUFKLEVBQUk7QUFBQSx5QkFBdERDLE1BQXNEO0FBQUEsTUFBdERBLE1BQXNELCtCQUE3QztBQUFBLFdBQU0sSUFBTjtBQUFBLEdBQTZDO0FBQUEsc0JBQWpDQyxHQUFpQztBQUFBLE1BQWpDQSxHQUFpQyw0QkFBM0I7QUFBQSxXQUFLQyxDQUFMO0FBQUEsR0FBMkI7QUFBQSx5QkFBbkJDLE1BQW1CO0FBQUEsTUFBbkJBLE1BQW1CLCtCQUFWLEVBQVU7O0FBQ3BGO0FBQ0EsTUFBSSxDQUFDQyxNQUFNQyxPQUFOLENBQWNOLEtBQWQsQ0FBTCxFQUEyQjtBQUN6QixXQUFPQyxPQUFPRCxLQUFQLElBQWdCLENBQUNFLElBQUlGLEtB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Y0osT0FBT0csTUFBUCxDQUFkO0FBQ0Q7O0FBRUQsU0FBT0EsU0FBU0QsS0FBaEIsRUFBdUI7QUFDckI7QUFDQTtBQUNBLFFBQUlDLFNBQVNELFFBQVFDLE1BQXJCLEVBQTZCO0FBQzNCSixhQUFPTSxVQUFQLENBQWtCSixRQUFRRSxNQUExQixFQUFrQ0YsS0FBbEMsRUFBeUNBLFFBQVFFLE1BQWpEO0FBQ0FBLGdCQUFVLENBQVY7QUFDRCxLQUhELE1BR087QUFDTEosYUFBT00sVUFBUCxDQUFrQkosUUFBUUUsTUFBMUIsRUFBa0NGLEtBQWxDLEVBQXlDQSxRQUFRQyxLQUFSLEdBQWdCQyxNQUF6RDtBQUNBQSxlQUFTRCxLQUFUO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPSCxNQUFQO0FBQ0Q7O0FBRUQ7QUFDQSIsImZpbGUiOiJmbGF0dGVuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IC0gMjAxNyBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbi8qKlxuICogRmxhdHRlbnMgYSBuZXN0ZWQgYXJyYXkgaW50byBhIHNpbmdsZSBsZXZlbCBhcnJheSxcbiAqIG9yIGEgc2luZ2xlIHZhbHVlIGludG8gYW4gYXJyYXkgd2l0aCBvbmUgdmFsdWVcbiAqIEBleGFtcGxlIGZsYXR0ZW4oW1sxLCBbMl1dLCBbM10sIDRdKSA9PiBbMSwgMiwgMywgNF1cbiAqIEBleGFtcGxlIGZsYXR0ZW4oMSkgPT4gWzFdXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gZmxhdHRlbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZpbHRlcj0gLSBPcHRpb25hbCBwcmVkaWNhdGUgY2FsbGVkIG9uIGVhY2ggYHZhbHVlYCB0b1xuICogICBkZXRlcm1pbmUgaWYgaXQgc2hvdWxkIGJlIGluY2x1ZGVkIChwdXNoZWQgb250bykgdGhlIHJlc3VsdGluZyBhcnJheS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IG1hcD0gLSBPcHRpb25hbCB0cmFuc2Zvcm0gYXBwbGllZCB0byBlYWNoIGFycmF5IGVsZW1lbnRzLlxuICogQHBhcmFtIHtBcnJheX0gcmVzdWx0PVtdIC0gT3B0aW9uYWwgYXJyYXkgdG8gcHVzaCB2YWx1ZSBpbnRvXG4gKiBAcmV0dXJuIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGZsYXR0ZW5lZCBhcnJheSAobmV3IGFycmF5IG9yIGByZXN1bHRgIGlmIHByb3ZpZGVkKVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmxhdHRlbihhcnJheSwge2ZpbHRlciA9ICgpID0+IHRydWUsIG1hcCA9IHggPT4geCwgcmVzdWx0ID0gW119ID0ge30pIHtcbiAgLy8gV3JhcCBzaW5nbGUgb2JqZWN0IGluIGFycmF5XG4gIGlmICghQXJyYXkuaXNBcnJheShhcnJheSkpIHtcbiAgICByZXR1cm4gZmlsdGVyKGFycmF5KSA/IFttYXAoYXJyYXkpXSA6IFtdO1xuICB9XG4gIC8vIERlZXAgZmxhdHRlbiBhbmQgZmlsdGVyIHRoZSBhcnJheVxuICByZXR1cm4gZmxhdHRlbkFycmF5KGFycmF5LCBmaWx0ZXIsIG1hcCwgcmVzdWx0KTtcbn1cblxuLy8gRGVlcCBmbGF0dGVucyBhbiBhcnJheS4gSGVscGVyIHRvIGBmbGF0dGVuYCwgc2VlIGl0cyBwYXJhbWV0ZXJzXG5mdW5jdGlvbiBmbGF0dGVuQXJyYXkoYXJyYXksIGZpbHRlciwgbWFwLCByZXN1bHQpIHtcbiAgbGV0IGluZGV4ID0gLTE7XG4gIHdoaWxlICgrK2luZGV4IDwgYXJyYXkubGVuZ3RoKSB7XG4gICAgY29uc3QgdmFsdWUgPSBhcnJheVtpbmRleF07XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBmbGF0dGVuQXJyYXkodmFsdWUsIGZpbHRlciwgbWFwLCByZXN1bHQpO1xuICAgIH0gZWxzZSBpZiAoZmlsdGVyKHZhbHVlKSkge1xuICAgICAgcmVzdWx0LnB1c2gobWFwKHZhbHVlKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3VudFZlcnRpY2VzKG5lc3RlZEFycmF5KSB7XG4gIGxldCBjb3VudCA9IDA7XG4gIGxldCBpbmRleCA9IC0xO1xuICB3aGlsZSAoKytpbmRleCA8IG5lc3RlZEFycmF5Lmxlbmd0aCkge1xuICAgIGNvbnN0IHZhbHVlID0gbmVzdGVkQXJyYXlbaW5kZXhdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSB8fCBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsdWUpKSB7XG4gICAgICBjb3VudCArPSBjb3VudFZlcnRpY2VzKHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY291bnQrKztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvdW50O1xufVxuXG4vLyBGbGF0dGVucyBuZXN0ZWQgYXJyYXkgb2YgdmVydGljZXMsIHBhZGRpbmcgdGhpcmQgY29vcmRpbmF0ZSBhcyBuZWVkZWRcbmV4cG9ydCBmdW5jdGlvbiBmbGF0dGVuVmVydGljZXMobmVzdGVkQXJyYXksIHtyZXN1bHQgPSBbXSwgZGltZW5zaW9ucyA9IDN9ID0ge30pIHtcbiAgbGV0IGluZGV4ID0gLTE7XG4gIGxldCB2ZXJ0ZXhMZW5ndGggPSAwO1xuICB3aGlsZSAoKytpbmRleCA8IG5lc3RlZEFycmF5Lmxlbmd0aCkge1xuICAgIGNvbnN0IHZhbHVlID0gbmVzdGVkQXJyYXlbaW5kZXhdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSB8fCBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsdWUpKSB7XG4gICAgICBmbGF0dGVuVmVydGljZXModmFsdWUsIHtyZXN1bHQsIGRpbWVuc2lvbnN9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lXG4gICAgICBpZiAodmVydGV4TGVuZ3RoIDwgZGltZW5zaW9ucykge1xuICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XG4gICAgICAgIHZlcnRleExlbmd0aCsrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICAvLyBBZGQgYSB0aGlyZCBjb29yZGluYXRlIGlmIG5lZWRlZFxuICBpZiAodmVydGV4TGVuZ3RoID4gMCAmJiB2ZXJ0ZXhMZW5ndGggPCBkaW1lbnNpb25zKSB7XG4gICAgcmVzdWx0LnB1c2goMCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gVXNlcyBjb3B5V2l0aGluIHRvIHNpZ25pZmljYW50bHkgc3BlZWQgdXAgdHlwZWQgYXJyYXkgdmFsdWUgZmlsbGluZ1xuZXhwb3J0IGZ1bmN0aW9uIGZpbGxBcnJheSh7dGFyZ2V0LCBzb3VyY2UsIHN0YXJ0ID0gMCwgY291bnQgPSAxfSkge1xuICBjb25zdCBsZW5ndGggPSBzb3VyY2UubGVuZ3RoO1xuICBjb25zdCB0b3RhbCA9IGNvdW50ICogbGVuZ3RoO1xuICBsZXQgY29waWVkID0gMDtcbiAgZm9yIChsZXQgaSA9IHN0YXJ0OyBjb3BpZWQgPCBsZW5ndGg7IGNvcGllZCsrKSB7XG4gICAgdGFyZ2V0W2krK10gPSBzb3VyY2VbY29waWVkXTtcbiAgfVxuXG4gIHdoaWxlIChjb3BpZWQgPCB0b3RhbCkge1xuICAgIC8vIElmIHdlIGhhdmUgY29waWVkIGxlc3MgdGhhbiBoYWxmLCBjb3B5IGV2ZXJ5dGhpbmcgd2UgZ290XG4gICAgLy8gZWxzZSBjb3B5IHJlbWFpbmluZyBpbiBvbmUgb3BlcmF0aW9uXG4gICAgaWYgKGNvcGllZCA8IHRvdGFsIC0gY29waWVkKSB7XG4gICAgICB0YXJnZXQuY29weVdpdGhpbihzdGFydCArIGNvcGllZCwgc3RhcnQsIHN0YXJ0ICsgY29waWVkKTtcbiAgICAgIGNvcGllZCAqPSAyO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXQuY29weVdpdGhpbihzdGFydCArIGNvcGllZCwgc3RhcnQsIHN0YXJ0ICsgdG90YWwgLSBjb3BpZWQpO1xuICAgICAgY29waWVkID0gdG90YWw7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuLy8gRmxhdHRlbnMgbmVzdGVkIGFycmF5IG9mIHZlcnRpY2VzLCBwYWRkaW5nIHRoaXJkIGNvb3JkaW5hdGUgYXMgbmVlZGVkXG4vKlxuZXhwb3J0IGZ1bmN0aW9uIGZsYXR0ZW5UeXBlZFZlcnRpY2VzKG5lc3RlZEFycmF5LCB7XG4gIHJlc3VsdCA9IFtdLFxuICBUeXBlID0gRmxvYXQzMkFycmF5LFxuICBzdGFydCA9IDAsXG4gIGRpbWVuc2lvbnMgPSAzXG59ID0ge30pIHtcbiAgbGV0IGluZGV4ID0gLTE7XG4gIGxldCB2ZXJ0ZXhMZW5ndGggPSAwO1xuICB3aGlsZSAoKytpbmRleCA8IG5lc3RlZEFycmF5Lmxlbmd0aCkge1xuICAgIGNvbnN0IHZhbHVlID0gbmVzdGVkQXJyYXlbaW5kZXhdO1xuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSB8fCBBcnJheUJ1ZmZlci5pc1ZpZXcodmFsdWUpKSB7XG4gICAgICBzdGFydCA9IGZsYXR0ZW5UeXBlZFZlcnRpY2VzKHZhbHVlLCB7cmVzdWx0LCBzdGFydCwgZGltZW5zaW9uc30pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodmVydGV4TGVuZ3RoIDwgZGltZW5zaW9ucykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgIHJlc3VsdFtzdGFydCsrXSA9IHZhbHVlO1xuICAgICAgICB2ZXJ0ZXhMZW5ndGgrKztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLy8gQWRkIGEgdGhpcmQgY29vcmRpbmF0ZSBpZiBuZWVkZWRcbiAgaWYgKHZlcnRleExlbmd0aCA+IDAgJiYgdmVydGV4TGVuZ3RoIDwgZGltZW5zaW9ucykge1xuICAgIHJlc3VsdFtzdGFydCsrXSA9IDA7XG4gIH1cbiAgcmV0dXJuIHN0YXJ0O1xufVxuKi9cbiJdfQ==