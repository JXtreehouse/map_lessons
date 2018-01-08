'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _transitionInterpolator = require('./transition-interpolator');

var _transitionInterpolator2 = _interopRequireDefault(_transitionInterpolator);

var _transitionUtils = require('./transition-utils');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VIEWPORT_TRANSITION_PROPS = ['longitude', 'latitude', 'zoom', 'bearing', 'pitch'];

/**
 * Performs linear interpolation of two viewports.
 */

var LinearInterpolator = function (_TransitionInterpolat) {
  _inherits(LinearInterpolator, _TransitionInterpolat);

  /**
   * @param {Array} transitionProps - list of props to apply linear transition to.
   */
  function LinearInterpolator() {
    var transitionProps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : VIEWPORT_TRANSITION_PROPS;

    _classCallCheck(this, LinearInterpolator);

    var _this = _possibleConstructorReturn(this, (LinearInterpolator.__proto__ || Object.getPrototypeOf(LinearInterpolator)).call(this));

    _this.propNames = transitionProps;
    return _this;
  }

  _createClass(LinearInterpolator, [{
    key: 'initializeProps',
    value: function initializeProps(startProps, endProps) {
      var startViewportProps = {};
      var endViewportProps = {};

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.propNames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          var startValue = startProps[key];
          var endValue = endProps[key];
          (0, _assert2.default)((0, _transitionUtils.isValid)(startValue) && (0, _transitionUtils.isValid)(endValue), key + ' must be supplied for transition');

          startViewportProps[key] = startValue;
          endViewportProps[key] = (0, _transitionUtils.getEndValueByShortestPath)(key, startValue, endValue);
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

      return {
        start: startViewportProps,
        end: endViewportProps
      };
    }
  }, {
    key: 'interpolateProps',
    value: function interpolateProps(startProps, endProps, t) {
      var viewport = {};
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.propNames[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          viewport[key] = (0, _transitionUtils.lerp)(startProps[key], endProps[key], t);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return viewport;
    }
  }]);

  return LinearInterpolator;
}(_transitionInterpolator2.default);

exports.default = LinearInterpolator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3RyYW5zaXRpb25zL2xpbmVhci1pbnRlcnBvbGF0b3IuanMiXSwibmFtZXMiOlsiVklFV1BPUlRfVFJBTlNJVElPTl9QUk9QUyIsIkxpbmVhckludGVycG9sYXRvciIsInRyYW5zaXRpb25Qcm9wcyIsInByb3BOYW1lcyIsInN0YXJ0UHJvcHMiLCJlbmRQcm9wcyIsInN0YXJ0Vmlld3BvcnRQcm9wcyIsImVuZFZpZXdwb3J0UHJvcHMiLCJrZXkiLCJzdGFydFZhbHVlIiwiZW5kVmFsdWUiLCJzdGFydCIsImVuZCIsInQiLCJ2aWV3cG9ydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSw0QkFBNEIsQ0FBQyxXQUFELEVBQWMsVUFBZCxFQUEwQixNQUExQixFQUFrQyxTQUFsQyxFQUE2QyxPQUE3QyxDQUFsQzs7QUFFQTs7OztJQUdxQkMsa0I7OztBQUNuQjs7O0FBR0EsZ0NBQXlEO0FBQUEsUUFBN0NDLGVBQTZDLHVFQUEzQkYseUJBQTJCOztBQUFBOztBQUFBOztBQUV2RCxVQUFLRyxTQUFMLEdBQWlCRCxlQUFqQjtBQUZ1RDtBQUd4RDs7OztvQ0FFZUUsVSxFQUFZQyxRLEVBQVU7QUFDcEMsVUFBTUMscUJBQXFCLEVBQTNCO0FBQ0EsVUFBTUMsbUJBQW1CLEVBQXpCOztBQUZvQztBQUFBO0FBQUE7O0FBQUE7QUFJcEMsNkJBQWtCLEtBQUtKLFNBQXZCLDhIQUFrQztBQUFBLGNBQXZCSyxHQUF1Qjs7QUFDaEMsY0FBTUMsYUFBYUwsV0FBV0ksR0FBWCxDQUFuQjtBQUNBLGNBQU1FLFdBQVdMLFNBQVNHLEdBQVQsQ0FBakI7QUFDQSxnQ0FBTyw4QkFBUUMsVUFBUixLQUF1Qiw4QkFBUUMsUUFBUixDQUE5QixFQUFvREYsR0FBcEQ7O0FBRUFGLDZCQUFtQkUsR0FBbkIsSUFBMEJDLFVBQTFCO0FBQ0FGLDJCQUFpQkMsR0FBakIsSUFBd0IsZ0RBQTBCQSxHQUExQixFQUErQkMsVUFBL0IsRUFBMkNDLFFBQTNDLENBQXhCO0FBQ0Q7QUFYbUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFhcEMsYUFBTztBQUNMQyxlQUFPTCxrQkFERjtBQUVMTSxhQUFLTDtBQUZBLE9BQVA7QUFJRDs7O3FDQUVnQkgsVSxFQUFZQyxRLEVBQVVRLEMsRUFBRztBQUN4QyxVQUFNQyxXQUFXLEVBQWpCO0FBRHdDO0FBQUE7QUFBQTs7QUFBQTtBQUV4Qyw4QkFBa0IsS0FBS1gsU0FBdkIsbUlBQWtDO0FBQUEsY0FBdkJLLEdBQXVCOztBQUNoQ00sbUJBQVNOLEdBQVQsSUFBZ0IsMkJBQUtKLFdBQVdJLEdBQVgsQ0FBTCxFQUFzQkgsU0FBU0csR0FBVCxDQUF0QixFQUFxQ0ssQ0FBckMsQ0FBaEI7QUFDRDtBQUp1QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUt4QyxhQUFPQyxRQUFQO0FBQ0Q7Ozs7OztrQkFsQ2tCYixrQiIsImZpbGUiOiJsaW5lYXItaW50ZXJwb2xhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFRyYW5zaXRpb25JbnRlcnBvbGF0b3IgZnJvbSAnLi90cmFuc2l0aW9uLWludGVycG9sYXRvcic7XG5pbXBvcnQge2lzVmFsaWQsIGxlcnAsIGdldEVuZFZhbHVlQnlTaG9ydGVzdFBhdGh9IGZyb20gJy4vdHJhbnNpdGlvbi11dGlscyc7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5cbmNvbnN0IFZJRVdQT1JUX1RSQU5TSVRJT05fUFJPUFMgPSBbJ2xvbmdpdHVkZScsICdsYXRpdHVkZScsICd6b29tJywgJ2JlYXJpbmcnLCAncGl0Y2gnXTtcblxuLyoqXG4gKiBQZXJmb3JtcyBsaW5lYXIgaW50ZXJwb2xhdGlvbiBvZiB0d28gdmlld3BvcnRzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lYXJJbnRlcnBvbGF0b3IgZXh0ZW5kcyBUcmFuc2l0aW9uSW50ZXJwb2xhdG9yIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7QXJyYXl9IHRyYW5zaXRpb25Qcm9wcyAtIGxpc3Qgb2YgcHJvcHMgdG8gYXBwbHkgbGluZWFyIHRyYW5zaXRpb24gdG8uXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih0cmFuc2l0aW9uUHJvcHMgPSBWSUVXUE9SVF9UUkFOU0lUSU9OX1BST1BTKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnByb3BOYW1lcyA9IHRyYW5zaXRpb25Qcm9wcztcbiAgfVxuXG4gIGluaXRpYWxpemVQcm9wcyhzdGFydFByb3BzLCBlbmRQcm9wcykge1xuICAgIGNvbnN0IHN0YXJ0Vmlld3BvcnRQcm9wcyA9IHt9O1xuICAgIGNvbnN0IGVuZFZpZXdwb3J0UHJvcHMgPSB7fTtcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIHRoaXMucHJvcE5hbWVzKSB7XG4gICAgICBjb25zdCBzdGFydFZhbHVlID0gc3RhcnRQcm9wc1trZXldO1xuICAgICAgY29uc3QgZW5kVmFsdWUgPSBlbmRQcm9wc1trZXldO1xuICAgICAgYXNzZXJ0KGlzVmFsaWQoc3RhcnRWYWx1ZSkgJiYgaXNWYWxpZChlbmRWYWx1ZSksIGAke2tleX0gbXVzdCBiZSBzdXBwbGllZCBmb3IgdHJhbnNpdGlvbmApO1xuXG4gICAgICBzdGFydFZpZXdwb3J0UHJvcHNba2V5XSA9IHN0YXJ0VmFsdWU7XG4gICAgICBlbmRWaWV3cG9ydFByb3BzW2tleV0gPSBnZXRFbmRWYWx1ZUJ5U2hvcnRlc3RQYXRoKGtleSwgc3RhcnRWYWx1ZSwgZW5kVmFsdWUpO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBzdGFydDogc3RhcnRWaWV3cG9ydFByb3BzLFxuICAgICAgZW5kOiBlbmRWaWV3cG9ydFByb3BzXG4gICAgfTtcbiAgfVxuXG4gIGludGVycG9sYXRlUHJvcHMoc3RhcnRQcm9wcywgZW5kUHJvcHMsIHQpIHtcbiAgICBjb25zdCB2aWV3cG9ydCA9IHt9O1xuICAgIGZvciAoY29uc3Qga2V5IG9mIHRoaXMucHJvcE5hbWVzKSB7XG4gICAgICB2aWV3cG9ydFtrZXldID0gbGVycChzdGFydFByb3BzW2tleV0sIGVuZFByb3BzW2tleV0sIHQpO1xuICAgIH1cbiAgICByZXR1cm4gdmlld3BvcnQ7XG4gIH1cbn1cbiJdfQ==