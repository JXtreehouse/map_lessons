'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _math = require('math.gl');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TransitionInterpolator = function () {
  function TransitionInterpolator() {
    _classCallCheck(this, TransitionInterpolator);
  }

  _createClass(TransitionInterpolator, [{
    key: 'arePropsEqual',

    /**
     * Checks if two sets of props need transition in between
     * @param currentProps {object} - a list of viewport props
     * @param nextProps {object} - a list of viewport props
     * @returns {bool} - true if two props are equivalent
     */
    value: function arePropsEqual(currentProps, nextProps) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (this.propNames || [])[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          if (!(0, _math.equals)(currentProps[key], nextProps[key])) {
            return false;
          }
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

      return true;
    }

    /**
     * Called before transition starts to validate/pre-process start and end props
     * @param startProps {object} - a list of starting viewport props
     * @param endProps {object} - a list of target viewport props
     * @returns {Object} {start, end} - start and end props to be passed
     *   to `interpolateProps`
     */

  }, {
    key: 'initializeProps',
    value: function initializeProps(startProps, endProps) {
      return { start: startProps, end: endProps };
    }

    /**
     * Returns viewport props in transition
     * @param startProps {object} - a list of starting viewport props
     * @param endProps {object} - a list of target viewport props
     * @param t {number} - a time factor between [0, 1]
     * @returns {object} - a list of interpolated viewport props
     */

  }, {
    key: 'interpolateProps',
    value: function interpolateProps(startProps, endProps, t) {
      (0, _assert2.default)(false, 'interpolateProps is not implemented');
    }
  }]);

  return TransitionInterpolator;
}();

exports.default = TransitionInterpolator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3RyYW5zaXRpb25zL3RyYW5zaXRpb24taW50ZXJwb2xhdG9yLmpzIl0sIm5hbWVzIjpbIlRyYW5zaXRpb25JbnRlcnBvbGF0b3IiLCJjdXJyZW50UHJvcHMiLCJuZXh0UHJvcHMiLCJwcm9wTmFtZXMiLCJrZXkiLCJzdGFydFByb3BzIiwiZW5kUHJvcHMiLCJzdGFydCIsImVuZCIsInQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7O0lBRXFCQSxzQjs7Ozs7Ozs7QUFDbkI7Ozs7OztrQ0FNY0MsWSxFQUFjQyxTLEVBQVc7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFDckMsOEJBQWtCLEtBQUtDLFNBQUwsSUFBa0IsRUFBcEMsK0hBQXdDO0FBQUEsY0FBN0JDLEdBQTZCOztBQUN0QyxjQUFJLENBQUMsa0JBQU9ILGFBQWFHLEdBQWIsQ0FBUCxFQUEwQkYsVUFBVUUsR0FBVixDQUExQixDQUFMLEVBQWdEO0FBQzlDLG1CQUFPLEtBQVA7QUFDRDtBQUNGO0FBTG9DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBTXJDLGFBQU8sSUFBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7O29DQU9nQkMsVSxFQUFZQyxRLEVBQVU7QUFDcEMsYUFBTyxFQUFDQyxPQUFPRixVQUFSLEVBQW9CRyxLQUFLRixRQUF6QixFQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7cUNBT2lCRCxVLEVBQVlDLFEsRUFBVUcsQyxFQUFHO0FBQ3hDLDRCQUFPLEtBQVAsRUFBYyxxQ0FBZDtBQUNEOzs7Ozs7a0JBcENrQlQsc0IiLCJmaWxlIjoidHJhbnNpdGlvbi1pbnRlcnBvbGF0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2VxdWFsc30gZnJvbSAnbWF0aC5nbCc7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyYW5zaXRpb25JbnRlcnBvbGF0b3Ige1xuICAvKipcbiAgICogQ2hlY2tzIGlmIHR3byBzZXRzIG9mIHByb3BzIG5lZWQgdHJhbnNpdGlvbiBpbiBiZXR3ZWVuXG4gICAqIEBwYXJhbSBjdXJyZW50UHJvcHMge29iamVjdH0gLSBhIGxpc3Qgb2Ygdmlld3BvcnQgcHJvcHNcbiAgICogQHBhcmFtIG5leHRQcm9wcyB7b2JqZWN0fSAtIGEgbGlzdCBvZiB2aWV3cG9ydCBwcm9wc1xuICAgKiBAcmV0dXJucyB7Ym9vbH0gLSB0cnVlIGlmIHR3byBwcm9wcyBhcmUgZXF1aXZhbGVudFxuICAgKi9cbiAgYXJlUHJvcHNFcXVhbChjdXJyZW50UHJvcHMsIG5leHRQcm9wcykge1xuICAgIGZvciAoY29uc3Qga2V5IG9mIHRoaXMucHJvcE5hbWVzIHx8IFtdKSB7XG4gICAgICBpZiAoIWVxdWFscyhjdXJyZW50UHJvcHNba2V5XSwgbmV4dFByb3BzW2tleV0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIGJlZm9yZSB0cmFuc2l0aW9uIHN0YXJ0cyB0byB2YWxpZGF0ZS9wcmUtcHJvY2VzcyBzdGFydCBhbmQgZW5kIHByb3BzXG4gICAqIEBwYXJhbSBzdGFydFByb3BzIHtvYmplY3R9IC0gYSBsaXN0IG9mIHN0YXJ0aW5nIHZpZXdwb3J0IHByb3BzXG4gICAqIEBwYXJhbSBlbmRQcm9wcyB7b2JqZWN0fSAtIGEgbGlzdCBvZiB0YXJnZXQgdmlld3BvcnQgcHJvcHNcbiAgICogQHJldHVybnMge09iamVjdH0ge3N0YXJ0LCBlbmR9IC0gc3RhcnQgYW5kIGVuZCBwcm9wcyB0byBiZSBwYXNzZWRcbiAgICogICB0byBgaW50ZXJwb2xhdGVQcm9wc2BcbiAgICovXG4gIGluaXRpYWxpemVQcm9wcyhzdGFydFByb3BzLCBlbmRQcm9wcykge1xuICAgIHJldHVybiB7c3RhcnQ6IHN0YXJ0UHJvcHMsIGVuZDogZW5kUHJvcHN9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdmlld3BvcnQgcHJvcHMgaW4gdHJhbnNpdGlvblxuICAgKiBAcGFyYW0gc3RhcnRQcm9wcyB7b2JqZWN0fSAtIGEgbGlzdCBvZiBzdGFydGluZyB2aWV3cG9ydCBwcm9wc1xuICAgKiBAcGFyYW0gZW5kUHJvcHMge29iamVjdH0gLSBhIGxpc3Qgb2YgdGFyZ2V0IHZpZXdwb3J0IHByb3BzXG4gICAqIEBwYXJhbSB0IHtudW1iZXJ9IC0gYSB0aW1lIGZhY3RvciBiZXR3ZWVuIFswLCAxXVxuICAgKiBAcmV0dXJucyB7b2JqZWN0fSAtIGEgbGlzdCBvZiBpbnRlcnBvbGF0ZWQgdmlld3BvcnQgcHJvcHNcbiAgICovXG4gIGludGVycG9sYXRlUHJvcHMoc3RhcnRQcm9wcywgZW5kUHJvcHMsIHQpIHtcbiAgICBhc3NlcnQoZmFsc2UsICdpbnRlcnBvbGF0ZVByb3BzIGlzIG5vdCBpbXBsZW1lbnRlZCcpO1xuICB9XG59XG4iXX0=