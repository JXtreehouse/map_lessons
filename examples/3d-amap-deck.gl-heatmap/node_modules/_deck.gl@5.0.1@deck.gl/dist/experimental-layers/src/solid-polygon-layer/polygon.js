'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSimple = isSimple;
exports.normalize = normalize;
exports.getVertexCount = getVertexCount;
exports.getTriangleCount = getTriangleCount;
exports.forEachVertex = forEachVertex;
exports.getSurfaceIndices = getSurfaceIndices;

var _deck = require('deck.gl');

var _earcut = require('earcut');

var _earcut2 = _interopRequireDefault(_earcut);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var flattenVertices = _deck.experimental.flattenVertices; // Copyright (c) 2015 - 2017 Uber Technologies, Inc.
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

  polygon.forEach(function (simplePolygon) {
    simplePolygon.forEach(visitor);
  });
}

// Returns the offset of each hole polygon in the flattened array for that polygon
function getHoleIndices(complexPolygon) {
  var holeIndices = null;
  if (complexPolygon.length > 1) {
    var polygonStartIndex = 0;
    holeIndices = [];
    complexPolygon.forEach(function (polygon) {
      polygonStartIndex += polygon.length;
      holeIndices.push(polygonStartIndex);
    });
    // Last element points to end of the flat array, remove it
    holeIndices.pop();
  }
  return holeIndices;
}

/*
 * Get vertex indices for drawing complexPolygon mesh
 * @private
 * @param {[Number,Number,Number][][]} complexPolygon
 * @returns {[Number]} indices
 */
function getSurfaceIndices(complexPolygon) {
  // Prepare an array of hole indices as expected by earcut
  var holeIndices = getHoleIndices(complexPolygon);
  // Flatten the polygon as expected by earcut
  var verts = flattenVertices(complexPolygon, { dimensions: 2, result: [] });
  // Let earcut triangulate the polygon
  return (0, _earcut2.default)(verts, holeIndices, 2);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9leHBlcmltZW50YWwtbGF5ZXJzL3NyYy9zb2xpZC1wb2x5Z29uLWxheWVyL3BvbHlnb24uanMiXSwibmFtZXMiOlsiaXNTaW1wbGUiLCJub3JtYWxpemUiLCJnZXRWZXJ0ZXhDb3VudCIsImdldFRyaWFuZ2xlQ291bnQiLCJmb3JFYWNoVmVydGV4IiwiZ2V0U3VyZmFjZUluZGljZXMiLCJmbGF0dGVuVmVydGljZXMiLCJwb2x5Z29uIiwibGVuZ3RoIiwiTnVtYmVyIiwiaXNGaW5pdGUiLCJkaW1lbnNpb25zIiwicmVkdWNlIiwic2ltcGxlUG9seWdvbiIsInRyaWFuZ2xlQ291bnQiLCJmaXJzdCIsInNpemUiLCJ2aXNpdG9yIiwiZm9yRWFjaCIsImdldEhvbGVJbmRpY2VzIiwiY29tcGxleFBvbHlnb24iLCJob2xlSW5kaWNlcyIsInBvbHlnb25TdGFydEluZGV4IiwicHVzaCIsInBvcCIsInZlcnRzIiwicmVzdWx0Il0sIm1hcHBpbmdzIjoiOzs7OztRQW9DZ0JBLFEsR0FBQUEsUTtRQVdBQyxTLEdBQUFBLFM7UUFTQUMsYyxHQUFBQSxjO1FBT0FDLGdCLEdBQUFBLGdCO1FBZUFDLGEsR0FBQUEsYTtRQWlDQUMsaUIsR0FBQUEsaUI7O0FBM0ZoQjs7QUFFQTs7Ozs7O0lBRE9DLGUsc0JBQUFBLGUsRUFyQlA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7OztBQUtPLFNBQVNOLFFBQVQsQ0FBa0JPLE9BQWxCLEVBQTJCO0FBQ2hDLFNBQU9BLFFBQVFDLE1BQVIsSUFBa0IsQ0FBbEIsSUFBdUJELFFBQVEsQ0FBUixFQUFXQyxNQUFYLElBQXFCLENBQTVDLElBQWlEQyxPQUFPQyxRQUFQLENBQWdCSCxRQUFRLENBQVIsRUFBVyxDQUFYLENBQWhCLENBQXhEO0FBQ0Q7O0FBRUQ7Ozs7Ozs7QUFPTyxTQUFTTixTQUFULENBQW1CTSxPQUFuQixFQUFtRDtBQUFBLGlGQUFKLEVBQUk7QUFBQSw2QkFBdEJJLFVBQXNCO0FBQUEsTUFBdEJBLFVBQXNCLG1DQUFULENBQVM7O0FBQ3hELFNBQU9YLFNBQVNPLE9BQVQsSUFBb0IsQ0FBQ0EsT0FBRCxDQUFwQixHQUFnQ0EsT0FBdkM7QUFDRDs7QUFFRDs7Ozs7QUFLTyxTQUFTTCxjQUFULENBQXdCSyxPQUF4QixFQUFpQztBQUN0QyxTQUFPUCxTQUFTTyxPQUFULElBQ0hBLFFBQVFDLE1BREwsR0FFSEQsUUFBUUssTUFBUixDQUFlLFVBQUNKLE1BQUQsRUFBU0ssYUFBVDtBQUFBLFdBQTJCTCxTQUFTSyxjQUFjTCxNQUFsRDtBQUFBLEdBQWYsRUFBeUUsQ0FBekUsQ0FGSjtBQUdEOztBQUVEO0FBQ08sU0FBU0wsZ0JBQVQsQ0FBMEJJLE9BQTFCLEVBQW1DO0FBQ3hDLE1BQUlPLGdCQUFnQixDQUFwQjtBQUNBLE1BQUlDLFFBQVEsSUFBWjtBQUZ3QztBQUFBO0FBQUE7O0FBQUE7QUFHeEMseUJBQTRCZCxVQUFVTSxPQUFWLENBQTVCLDhIQUFnRDtBQUFBLFVBQXJDTSxhQUFxQzs7QUFDOUMsVUFBTUcsT0FBT0gsY0FBY0wsTUFBM0I7QUFDQSxVQUFJTyxLQUFKLEVBQVc7QUFDVEQseUJBQWlCRSxRQUFRLENBQVIsR0FBWUEsT0FBTyxDQUFuQixHQUF1QixDQUF4QztBQUNELE9BRkQsTUFFTztBQUNMRix5QkFBaUJFLE9BQU8sQ0FBeEI7QUFDRDtBQUNERCxjQUFRLEtBQVI7QUFDRDtBQVh1QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVl4QyxTQUFPRCxhQUFQO0FBQ0Q7O0FBRU0sU0FBU1YsYUFBVCxDQUF1QkcsT0FBdkIsRUFBZ0NVLE9BQWhDLEVBQXlDO0FBQzlDLE1BQUlqQixTQUFTTyxPQUFULENBQUosRUFBdUI7QUFDckJBLFlBQVFXLE9BQVIsQ0FBZ0JELE9BQWhCO0FBQ0E7QUFDRDs7QUFFRFYsVUFBUVcsT0FBUixDQUFnQix5QkFBaUI7QUFDL0JMLGtCQUFjSyxPQUFkLENBQXNCRCxPQUF0QjtBQUNELEdBRkQ7QUFHRDs7QUFFRDtBQUNBLFNBQVNFLGNBQVQsQ0FBd0JDLGNBQXhCLEVBQXdDO0FBQ3RDLE1BQUlDLGNBQWMsSUFBbEI7QUFDQSxNQUFJRCxlQUFlWixNQUFmLEdBQXdCLENBQTVCLEVBQStCO0FBQzdCLFFBQUljLG9CQUFvQixDQUF4QjtBQUNBRCxrQkFBYyxFQUFkO0FBQ0FELG1CQUFlRixPQUFmLENBQXVCLG1CQUFXO0FBQ2hDSSwyQkFBcUJmLFFBQVFDLE1BQTdCO0FBQ0FhLGtCQUFZRSxJQUFaLENBQWlCRCxpQkFBakI7QUFDRCxLQUhEO0FBSUE7QUFDQUQsZ0JBQVlHLEdBQVo7QUFDRDtBQUNELFNBQU9ILFdBQVA7QUFDRDs7QUFFRDs7Ozs7O0FBTU8sU0FBU2hCLGlCQUFULENBQTJCZSxjQUEzQixFQUEyQztBQUNoRDtBQUNBLE1BQU1DLGNBQWNGLGVBQWVDLGNBQWYsQ0FBcEI7QUFDQTtBQUNBLE1BQU1LLFFBQVFuQixnQkFBZ0JjLGNBQWhCLEVBQWdDLEVBQUNULFlBQVksQ0FBYixFQUFnQmUsUUFBUSxFQUF4QixFQUFoQyxDQUFkO0FBQ0E7QUFDQSxTQUFPLHNCQUFPRCxLQUFQLEVBQWNKLFdBQWQsRUFBMkIsQ0FBM0IsQ0FBUDtBQUNEIiwiZmlsZSI6InBvbHlnb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTUgLSAyMDE3IFViZXIgVGVjaG5vbG9naWVzLCBJbmMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuLy8gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuLy8gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuLy8gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuLy8gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbi8vIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbi8vIFRIRSBTT0ZUV0FSRS5cblxuaW1wb3J0IHtleHBlcmltZW50YWx9IGZyb20gJ2RlY2suZ2wnO1xuY29uc3Qge2ZsYXR0ZW5WZXJ0aWNlc30gPSBleHBlcmltZW50YWw7XG5pbXBvcnQgZWFyY3V0IGZyb20gJ2VhcmN1dCc7XG5cbi8vIEJhc2ljIHBvbHlnb24gc3VwcG9ydFxuLy9cbi8vIEhhbmRsZXMgc2ltcGxlIGFuZCBjb21wbGV4IHBvbHlnb25zXG4vLyBTaW1wbGUgcG9seWdvbnMgYXJlIGFycmF5cyBvZiB2ZXJ0aWNlcywgaW1wbGljaXRseSBcImNsb3NlZFwiXG4vLyBDb21wbGV4IHBvbHlnb25zIGFyZSBhcnJheXMgb2Ygc2ltcGxlIHBvbHlnb25zLCB3aXRoIHRoZSBmaXJzdCBwb2x5Z29uXG4vLyByZXByZXNlbnRpbmcgdGhlIG91dGVyIGh1bGwgYW5kIG90aGVyIHBvbHlnb25zIHJlcHJlc2VudGluZyBob2xlc1xuXG4vKipcbiAqIENoZWNrIGlmIHRoaXMgaXMgYSBub24tbmVzdGVkIHBvbHlnb24gKGkuZS4gdGhlIGZpcnN0IGVsZW1lbnQgb2YgdGhlIGZpcnN0IGVsZW1lbnQgaXMgYSBudW1iZXIpXG4gKiBAcGFyYW0ge0FycmF5fSBwb2x5Z29uIC0gZWl0aGVyIGEgY29tcGxleCBvciBzaW1wbGUgcG9seWdvblxuICogQHJldHVybiB7Qm9vbGVhbn0gLSB0cnVlIGlmIHRoZSBwb2x5Z29uIGlzIGEgc2ltcGxlIHBvbHlnb24gKGkuZS4gbm90IGFuIGFycmF5IG9mIHBvbHlnb25zKVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTaW1wbGUocG9seWdvbikge1xuICByZXR1cm4gcG9seWdvbi5sZW5ndGggPj0gMSAmJiBwb2x5Z29uWzBdLmxlbmd0aCA+PSAyICYmIE51bWJlci5pc0Zpbml0ZShwb2x5Z29uWzBdWzBdKTtcbn1cblxuLyoqXG4gKiBOb3JtYWxpemUgdG8gZW5zdXJlIHRoYXQgYWxsIHBvbHlnb25zIGluIGEgbGlzdCBhcmUgY29tcGxleCAtIHNpbXBsaWZpZXMgcHJvY2Vzc2luZ1xuICogQHBhcmFtIHtBcnJheX0gcG9seWdvbiAtIGVpdGhlciBhIGNvbXBsZXggb3IgYSBzaW1wbGUgcG9seWdvblxuICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzLmRpbWVuc2lvbnMgLSBpZiAzLCB0aGUgY29vcmRzIHdpbGwgYmUgcGFkZGVkIHdpdGggMCdzIGlmIG5lZWRlZFxuICogQHJldHVybiB7QXJyYXl9IC0gcmV0dXJucyBhIGNvbXBsZXggcG9seWdvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZShwb2x5Z29uLCB7ZGltZW5zaW9ucyA9IDN9ID0ge30pIHtcbiAgcmV0dXJuIGlzU2ltcGxlKHBvbHlnb24pID8gW3BvbHlnb25dIDogcG9seWdvbjtcbn1cblxuLyoqXG4gKiBDaGVjayBpZiB0aGlzIGlzIGEgbm9uLW5lc3RlZCBwb2x5Z29uIChpLmUuIHRoZSBmaXJzdCBlbGVtZW50IG9mIHRoZSBmaXJzdCBlbGVtZW50IGlzIGEgbnVtYmVyKVxuICogQHBhcmFtIHtBcnJheX0gcG9seWdvbiAtIGVpdGhlciBhIGNvbXBsZXggb3Igc2ltcGxlIHBvbHlnb25cbiAqIEByZXR1cm4ge0Jvb2xlYW59IC0gdHJ1ZSBpZiB0aGUgcG9seWdvbiBpcyBhIHNpbXBsZSBwb2x5Z29uIChpLmUuIG5vdCBhbiBhcnJheSBvZiBwb2x5Z29ucylcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFZlcnRleENvdW50KHBvbHlnb24pIHtcbiAgcmV0dXJuIGlzU2ltcGxlKHBvbHlnb24pXG4gICAgPyBwb2x5Z29uLmxlbmd0aFxuICAgIDogcG9seWdvbi5yZWR1Y2UoKGxlbmd0aCwgc2ltcGxlUG9seWdvbikgPT4gbGVuZ3RoICsgc2ltcGxlUG9seWdvbi5sZW5ndGgsIDApO1xufVxuXG4vLyBSZXR1cm4gbnVtYmVyIG9mIHRyaWFuZ2xlcyBuZWVkZWQgdG8gdGVzc2VsYXRlIHRoZSBwb2x5Z29uXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJpYW5nbGVDb3VudChwb2x5Z29uKSB7XG4gIGxldCB0cmlhbmdsZUNvdW50ID0gMDtcbiAgbGV0IGZpcnN0ID0gdHJ1ZTtcbiAgZm9yIChjb25zdCBzaW1wbGVQb2x5Z29uIG9mIG5vcm1hbGl6ZShwb2x5Z29uKSkge1xuICAgIGNvbnN0IHNpemUgPSBzaW1wbGVQb2x5Z29uLmxlbmd0aDtcbiAgICBpZiAoZmlyc3QpIHtcbiAgICAgIHRyaWFuZ2xlQ291bnQgKz0gc2l6ZSA+PSAzID8gc2l6ZSAtIDIgOiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cmlhbmdsZUNvdW50ICs9IHNpemUgKyAxO1xuICAgIH1cbiAgICBmaXJzdCA9IGZhbHNlO1xuICB9XG4gIHJldHVybiB0cmlhbmdsZUNvdW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9yRWFjaFZlcnRleChwb2x5Z29uLCB2aXNpdG9yKSB7XG4gIGlmIChpc1NpbXBsZShwb2x5Z29uKSkge1xuICAgIHBvbHlnb24uZm9yRWFjaCh2aXNpdG9yKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBwb2x5Z29uLmZvckVhY2goc2ltcGxlUG9seWdvbiA9PiB7XG4gICAgc2ltcGxlUG9seWdvbi5mb3JFYWNoKHZpc2l0b3IpO1xuICB9KTtcbn1cblxuLy8gUmV0dXJucyB0aGUgb2Zmc2V0IG9mIGVhY2ggaG9sZSBwb2x5Z29uIGluIHRoZSBmbGF0dGVuZWQgYXJyYXkgZm9yIHRoYXQgcG9seWdvblxuZnVuY3Rpb24gZ2V0SG9sZUluZGljZXMoY29tcGxleFBvbHlnb24pIHtcbiAgbGV0IGhvbGVJbmRpY2VzID0gbnVsbDtcbiAgaWYgKGNvbXBsZXhQb2x5Z29uLmxlbmd0aCA+IDEpIHtcbiAgICBsZXQgcG9seWdvblN0YXJ0SW5kZXggPSAwO1xuICAgIGhvbGVJbmRpY2VzID0gW107XG4gICAgY29tcGxleFBvbHlnb24uZm9yRWFjaChwb2x5Z29uID0+IHtcbiAgICAgIHBvbHlnb25TdGFydEluZGV4ICs9IHBvbHlnb24ubGVuZ3RoO1xuICAgICAgaG9sZUluZGljZXMucHVzaChwb2x5Z29uU3RhcnRJbmRleCk7XG4gICAgfSk7XG4gICAgLy8gTGFzdCBlbGVtZW50IHBvaW50cyB0byBlbmQgb2YgdGhlIGZsYXQgYXJyYXksIHJlbW92ZSBpdFxuICAgIGhvbGVJbmRpY2VzLnBvcCgpO1xuICB9XG4gIHJldHVybiBob2xlSW5kaWNlcztcbn1cblxuLypcbiAqIEdldCB2ZXJ0ZXggaW5kaWNlcyBmb3IgZHJhd2luZyBjb21wbGV4UG9seWdvbiBtZXNoXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtbTnVtYmVyLE51bWJlcixOdW1iZXJdW11bXX0gY29tcGxleFBvbHlnb25cbiAqIEByZXR1cm5zIHtbTnVtYmVyXX0gaW5kaWNlc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U3VyZmFjZUluZGljZXMoY29tcGxleFBvbHlnb24pIHtcbiAgLy8gUHJlcGFyZSBhbiBhcnJheSBvZiBob2xlIGluZGljZXMgYXMgZXhwZWN0ZWQgYnkgZWFyY3V0XG4gIGNvbnN0IGhvbGVJbmRpY2VzID0gZ2V0SG9sZUluZGljZXMoY29tcGxleFBvbHlnb24pO1xuICAvLyBGbGF0dGVuIHRoZSBwb2x5Z29uIGFzIGV4cGVjdGVkIGJ5IGVhcmN1dFxuICBjb25zdCB2ZXJ0cyA9IGZsYXR0ZW5WZXJ0aWNlcyhjb21wbGV4UG9seWdvbiwge2RpbWVuc2lvbnM6IDIsIHJlc3VsdDogW119KTtcbiAgLy8gTGV0IGVhcmN1dCB0cmlhbmd1bGF0ZSB0aGUgcG9seWdvblxuICByZXR1cm4gZWFyY3V0KHZlcnRzLCBob2xlSW5kaWNlcywgMik7XG59XG4iXX0=