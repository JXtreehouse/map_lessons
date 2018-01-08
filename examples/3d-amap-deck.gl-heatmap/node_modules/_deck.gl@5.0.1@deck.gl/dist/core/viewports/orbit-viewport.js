'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _viewport = require('./viewport');

var _viewport2 = _interopRequireDefault(_viewport);

var _mathUtils = require('../utils/math-utils');

var _multiply = require('gl-mat4/multiply');

var _multiply2 = _interopRequireDefault(_multiply);

var _lookAt = require('gl-mat4/lookAt');

var _lookAt2 = _interopRequireDefault(_lookAt);

var _scale = require('gl-mat4/scale');

var _scale2 = _interopRequireDefault(_scale);

var _perspective = require('gl-mat4/perspective');

var _perspective2 = _interopRequireDefault(_perspective);

var _translate = require('gl-mat4/translate');

var _translate2 = _interopRequireDefault(_translate);

var _rotateX = require('gl-mat4/rotateX');

var _rotateX2 = _interopRequireDefault(_rotateX);

var _rotateY = require('gl-mat4/rotateY');

var _rotateY2 = _interopRequireDefault(_rotateY);

var _rotateZ = require('gl-mat4/rotateZ');

var _rotateZ2 = _interopRequireDefault(_rotateZ);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEGREES_TO_RADIANS = Math.PI / 180;

/*
 * A deck.gl Viewport class used by OrbitController
 * Adds zoom and pixel translation on top of the PerspectiveViewport
 */

var OrbitViewport = function (_Viewport) {
  _inherits(OrbitViewport, _Viewport);

  function OrbitViewport(_ref) {
    var _ref$id = _ref.id,
        id = _ref$id === undefined ? 'orbit-viewport' : _ref$id,
        width = _ref.width,
        height = _ref.height,
        distance = _ref.distance,
        _ref$rotationX = _ref.rotationX,
        rotationX = _ref$rotationX === undefined ? 0 : _ref$rotationX,
        _ref$rotationOrbit = _ref.rotationOrbit,
        rotationOrbit = _ref$rotationOrbit === undefined ? 0 : _ref$rotationOrbit,
        _ref$orbitAxis = _ref.orbitAxis,
        orbitAxis = _ref$orbitAxis === undefined ? 'Z' : _ref$orbitAxis,
        _ref$lookAt = _ref.lookAt,
        lookAt = _ref$lookAt === undefined ? [0, 0, 0] : _ref$lookAt,
        _ref$up = _ref.up,
        up = _ref$up === undefined ? [0, 1, 0] : _ref$up,
        _ref$fov = _ref.fov,
        fov = _ref$fov === undefined ? 75 : _ref$fov,
        _ref$near = _ref.near,
        near = _ref$near === undefined ? 1 : _ref$near,
        _ref$far = _ref.far,
        far = _ref$far === undefined ? 100 : _ref$far,
        _ref$zoom = _ref.zoom,
        zoom = _ref$zoom === undefined ? 1 : _ref$zoom;

    _classCallCheck(this, OrbitViewport);

    var rotationMatrix = (0, _rotateX2.default)([], (0, _mathUtils.createMat4)(), -rotationX / 180 * Math.PI);
    if (orbitAxis === 'Z') {
      (0, _rotateZ2.default)(rotationMatrix, rotationMatrix, -rotationOrbit / 180 * Math.PI);
    } else {
      (0, _rotateY2.default)(rotationMatrix, rotationMatrix, -rotationOrbit / 180 * Math.PI);
    }

    var translateMatrix = (0, _mathUtils.createMat4)();
    (0, _scale2.default)(translateMatrix, translateMatrix, [zoom, zoom, zoom]);
    (0, _translate2.default)(translateMatrix, translateMatrix, [-lookAt[0], -lookAt[1], -lookAt[2]]);

    var viewMatrix = (0, _lookAt2.default)([], [0, 0, distance], [0, 0, 0], up);
    var fovRadians = fov * DEGREES_TO_RADIANS;
    var aspect = width / height;
    var perspectiveMatrix = (0, _perspective2.default)([], fovRadians, aspect, near, far);

    var _this = _possibleConstructorReturn(this, (OrbitViewport.__proto__ || Object.getPrototypeOf(OrbitViewport)).call(this, {
      id: id,
      viewMatrix: (0, _multiply2.default)(viewMatrix, viewMatrix, (0, _multiply2.default)(rotationMatrix, rotationMatrix, translateMatrix)),
      projectionMatrix: perspectiveMatrix,
      width: width,
      height: height
    }));

    _this.width = width;
    _this.height = height;
    _this.distance = distance;
    _this.rotationX = rotationX;
    _this.rotationOrbit = rotationOrbit;
    _this.orbitAxis = orbitAxis;
    _this.lookAt = lookAt;
    _this.up = up;
    _this.fov = fov;
    _this.near = near;
    _this.far = far;
    _this.zoom = zoom;
    return _this;
  }

  _createClass(OrbitViewport, [{
    key: 'project',
    value: function project(xyz) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref2$topLeft = _ref2.topLeft,
          topLeft = _ref2$topLeft === undefined ? false : _ref2$topLeft;

      var v = (0, _mathUtils.transformVector)(this.pixelProjectionMatrix, [].concat(_toConsumableArray(xyz), [1]));

      var _v = _slicedToArray(v, 3),
          x = _v[0],
          y = _v[1],
          z = _v[2];

      var y2 = topLeft ? this.height - y : y;
      return [x, y2, z];
    }
  }, {
    key: 'unproject',
    value: function unproject(xyz) {
      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref3$topLeft = _ref3.topLeft,
          topLeft = _ref3$topLeft === undefined ? false : _ref3$topLeft;

      var _xyz = _slicedToArray(xyz, 3),
          x = _xyz[0],
          y = _xyz[1],
          z = _xyz[2];

      var y2 = topLeft ? this.height - y : y;

      return (0, _mathUtils.transformVector)(this.pixelUnprojectionMatrix, [x, y2, z, 1]);
    }

    /** Move camera to make a model bounding box centered at lookat position fit in the viewport.
     * @param {Array} sizes - [sizeX, sizeY, sizeZ]], define the dimensions of bounding box
     * @returns a new OrbitViewport object
     */

  }, {
    key: 'fitBounds',
    value: function fitBounds(sizes) {
      var width = this.width,
          height = this.height,
          rotationX = this.rotationX,
          rotationOrbit = this.rotationOrbit,
          orbitAxis = this.orbitAxis,
          lookAt = this.lookAt,
          up = this.up,
          fov = this.fov,
          near = this.near,
          far = this.far,
          zoom = this.zoom;

      var size = Math.max(sizes[0], sizes[1], sizes[2]) / 2;
      var newDistance = size / Math.tan(fov / 180 * Math.PI / 2);

      return new OrbitViewport({
        width: width,
        height: height,
        rotationX: rotationX,
        rotationOrbit: rotationOrbit,
        orbitAxis: orbitAxis,
        up: up,
        fov: fov,
        near: near,
        far: far,
        zoom: zoom,
        lookAt: lookAt,
        distance: newDistance
      });
    }
  }]);

  return OrbitViewport;
}(_viewport2.default);

exports.default = OrbitViewport;


OrbitViewport.displayName = 'OrbitViewport';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3ZpZXdwb3J0cy9vcmJpdC12aWV3cG9ydC5qcyJdLCJuYW1lcyI6WyJERUdSRUVTX1RPX1JBRElBTlMiLCJNYXRoIiwiUEkiLCJPcmJpdFZpZXdwb3J0IiwiaWQiLCJ3aWR0aCIsImhlaWdodCIsImRpc3RhbmNlIiwicm90YXRpb25YIiwicm90YXRpb25PcmJpdCIsIm9yYml0QXhpcyIsImxvb2tBdCIsInVwIiwiZm92IiwibmVhciIsImZhciIsInpvb20iLCJyb3RhdGlvbk1hdHJpeCIsInRyYW5zbGF0ZU1hdHJpeCIsInZpZXdNYXRyaXgiLCJmb3ZSYWRpYW5zIiwiYXNwZWN0IiwicGVyc3BlY3RpdmVNYXRyaXgiLCJwcm9qZWN0aW9uTWF0cml4IiwieHl6IiwidG9wTGVmdCIsInYiLCJwaXhlbFByb2plY3Rpb25NYXRyaXgiLCJ4IiwieSIsInoiLCJ5MiIsInBpeGVsVW5wcm9qZWN0aW9uTWF0cml4Iiwic2l6ZXMiLCJzaXplIiwibWF4IiwibmV3RGlzdGFuY2UiLCJ0YW4iLCJkaXNwbGF5TmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBRUE7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxxQkFBcUJDLEtBQUtDLEVBQUwsR0FBVSxHQUFyQzs7QUFFQTs7Ozs7SUFJcUJDLGE7OztBQUNuQiwrQkFpQkc7QUFBQSx1QkFoQkRDLEVBZ0JDO0FBQUEsUUFoQkRBLEVBZ0JDLDJCQWhCSSxnQkFnQko7QUFBQSxRQWREQyxLQWNDLFFBZERBLEtBY0M7QUFBQSxRQWJEQyxNQWFDLFFBYkRBLE1BYUM7QUFBQSxRQVhEQyxRQVdDLFFBWERBLFFBV0M7QUFBQSw4QkFWREMsU0FVQztBQUFBLFFBVkRBLFNBVUMsa0NBVlcsQ0FVWDtBQUFBLGtDQVREQyxhQVNDO0FBQUEsUUFUREEsYUFTQyxzQ0FUZSxDQVNm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QVZhO0FBQUEsVUFXYkMsR0FYYSxHQWFYLElBYlcsQ0FXYkEsR0FYYTtBQUFBLFVBWWJDLElBWmEsR0FhWCxJQWJXLENBWWJBLElBWmE7O0FBY2YsVUFBTWtCLE9BQU9qQyxLQUFLa0MsR0FBTCxDQUFTRixNQUFNLENBQU4sQ0FBVCxFQUFtQkEsTUFBTSxDQUFOLENBQW5CLEVBQTZCQSxNQUFNLENBQU4sQ0FBN0IsSUFBeUMsQ0FBdEQ7QUFDQSxVQUFNRyxjQUFjRixPQUFPakMsS0FBS29DLEdBQUwsQ0FBU3hCLE1BQU0sR0FBTixHQUFZWixLQUFLQyxFQUFqQixHQUFzQixDQUEvQixDQUEzQjs7QUFFQSxhQUFPLElBQUlDLGFBQUosQ0FBa0I7QUFDdkJFLG9CQUR1QjtBQUV2QkMsc0JBRnVCO0FBR3ZCRSw0QkFIdUI7QUFJdkJDLG9DQUp1QjtBQUt2QkMsNEJBTHVCO0FBTXZCRSxjQU51QjtBQU92QkMsZ0JBUHVCO0FBUXZCQyxrQkFSdUI7QUFTdkJDLGdCQVR1QjtBQVV2QkMsa0JBVnVCO0FBV3ZCTCxzQkFYdUI7QUFZdkJKLGtCQUFVNkI7QUFaYSxPQUFsQixDQUFQO0FBY0Q7Ozs7OztrQkEvR2tCakMsYTs7O0FBa0hyQkEsY0FBY21DLFdBQWQsR0FBNEIsZUFBNUIiLCJmaWxlIjoib3JiaXQtdmlld3BvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlld3BvcnQgZnJvbSAnLi92aWV3cG9ydCc7XG5cbmltcG9ydCB7Y3JlYXRlTWF0NCwgdHJhbnNmb3JtVmVjdG9yfSBmcm9tICcuLi91dGlscy9tYXRoLXV0aWxzJztcblxuaW1wb3J0IG1hdDRfbXVsdGlwbHkgZnJvbSAnZ2wtbWF0NC9tdWx0aXBseSc7XG5pbXBvcnQgbWF0NF9sb29rQXQgZnJvbSAnZ2wtbWF0NC9sb29rQXQnO1xuaW1wb3J0IG1hdDRfc2NhbGUgZnJvbSAnZ2wtbWF0NC9zY2FsZSc7XG5pbXBvcnQgbWF0NF9wZXJzcGVjdGl2ZSBmcm9tICdnbC1tYXQ0L3BlcnNwZWN0aXZlJztcbmltcG9ydCBtYXQ0X3RyYW5zbGF0ZSBmcm9tICdnbC1tYXQ0L3RyYW5zbGF0ZSc7XG5pbXBvcnQgbWF0NF9yb3RhdGVYIGZyb20gJ2dsLW1hdDQvcm90YXRlWCc7XG5pbXBvcnQgbWF0NF9yb3RhdGVZIGZyb20gJ2dsLW1hdDQvcm90YXRlWSc7XG5pbXBvcnQgbWF0NF9yb3RhdGVaIGZyb20gJ2dsLW1hdDQvcm90YXRlWic7XG5cbmNvbnN0IERFR1JFRVNfVE9fUkFESUFOUyA9IE1hdGguUEkgLyAxODA7XG5cbi8qXG4gKiBBIGRlY2suZ2wgVmlld3BvcnQgY2xhc3MgdXNlZCBieSBPcmJpdENvbnRyb2xsZXJcbiAqIEFkZHMgem9vbSBhbmQgcGl4ZWwgdHJhbnNsYXRpb24gb24gdG9wIG9mIHRoZSBQZXJzcGVjdGl2ZVZpZXdwb3J0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9yYml0Vmlld3BvcnQgZXh0ZW5kcyBWaWV3cG9ydCB7XG4gIGNvbnN0cnVjdG9yKHtcbiAgICBpZCA9ICdvcmJpdC12aWV3cG9ydCcsXG4gICAgLy8gdmlld3BvcnQgYXJndW1lbnRzXG4gICAgd2lkdGgsIC8vIFdpZHRoIG9mIHZpZXdwb3J0XG4gICAgaGVpZ2h0LCAvLyBIZWlnaHQgb2Ygdmlld3BvcnRcbiAgICAvLyB2aWV3IG1hdHJpeCBhcmd1bWVudHNcbiAgICBkaXN0YW5jZSwgLy8gRnJvbSBleWUgcG9zaXRpb24gdG8gbG9va0F0XG4gICAgcm90YXRpb25YID0gMCwgLy8gUm90YXRpbmcgYW5nbGUgYXJvdW5kIFggYXhpc1xuICAgIHJvdGF0aW9uT3JiaXQgPSAwLCAvLyBSb3RhdGluZyBhbmdsZSBhcm91bmQgb3JiaXQgYXhpc1xuICAgIG9yYml0QXhpcyA9ICdaJywgLy8gT3JiaXQgYXhpcyB3aXRoIDM2MCBkZWdyZWVzIHJvdGF0aW5nIGZyZWVkb20sIGNhbiBvbmx5IGJlICdZJyBvciAnWidcbiAgICBsb29rQXQgPSBbMCwgMCwgMF0sIC8vIFdoaWNoIHBvaW50IGlzIGNhbWVyYSBsb29raW5nIGF0LCBkZWZhdWx0IG9yaWdpblxuICAgIHVwID0gWzAsIDEsIDBdLCAvLyBEZWZpbmVzIHVwIGRpcmVjdGlvbiwgZGVmYXVsdCBwb3NpdGl2ZSB5IGF4aXNcbiAgICAvLyBwcm9qZWN0aW9uIG1hdHJpeCBhcmd1bWVudHNcbiAgICBmb3YgPSA3NSwgLy8gRmllbGQgb2YgdmlldyBjb3ZlcmVkIGJ5IGNhbWVyYVxuICAgIG5lYXIgPSAxLCAvLyBEaXN0YW5jZSBvZiBuZWFyIGNsaXBwaW5nIHBsYW5lXG4gICAgZmFyID0gMTAwLCAvLyBEaXN0YW5jZSBvZiBmYXIgY2xpcHBpbmcgcGxhbmVcbiAgICB6b29tID0gMVxuICB9KSB7XG4gICAgY29uc3Qgcm90YXRpb25NYXRyaXggPSBtYXQ0X3JvdGF0ZVgoW10sIGNyZWF0ZU1hdDQoKSwgLXJvdGF0aW9uWCAvIDE4MCAqIE1hdGguUEkpO1xuICAgIGlmIChvcmJpdEF4aXMgPT09ICdaJykge1xuICAgICAgbWF0NF9yb3RhdGVaKHJvdGF0aW9uTWF0cml4LCByb3RhdGlvbk1hdHJpeCwgLXJvdGF0aW9uT3JiaXQgLyAxODAgKiBNYXRoLlBJKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWF0NF9yb3RhdGVZKHJvdGF0aW9uTWF0cml4LCByb3RhdGlvbk1hdHJpeCwgLXJvdGF0aW9uT3JiaXQgLyAxODAgKiBNYXRoLlBJKTtcbiAgICB9XG5cbiAgICBjb25zdCB0cmFuc2xhdGVNYXRyaXggPSBjcmVhdGVNYXQ0KCk7XG4gICAgbWF0NF9zY2FsZSh0cmFuc2xhdGVNYXRyaXgsIHRyYW5zbGF0ZU1hdHJpeCwgW3pvb20sIHpvb20sIHpvb21dKTtcbiAgICBtYXQ0X3RyYW5zbGF0ZSh0cmFuc2xhdGVNYXRyaXgsIHRyYW5zbGF0ZU1hdHJpeCwgWy1sb29rQXRbMF0sIC1sb29rQXRbMV0sIC1sb29rQXRbMl1dKTtcblxuICAgIGNvbnN0IHZpZXdNYXRyaXggPSBtYXQ0X2xvb2tBdChbXSwgWzAsIDAsIGRpc3RhbmNlXSwgWzAsIDAsIDBdLCB1cCk7XG4gICAgY29uc3QgZm92UmFkaWFucyA9IGZvdiAqIERFR1JFRVNfVE9fUkFESUFOUztcbiAgICBjb25zdCBhc3BlY3QgPSB3aWR0aCAvIGhlaWdodDtcbiAgICBjb25zdCBwZXJzcGVjdGl2ZU1hdHJpeCA9IG1hdDRfcGVyc3BlY3RpdmUoW10sIGZvdlJhZGlhbnMsIGFzcGVjdCwgbmVhciwgZmFyKTtcblxuICAgIHN1cGVyKHtcbiAgICAgIGlkLFxuICAgICAgdmlld01hdHJpeDogbWF0NF9tdWx0aXBseShcbiAgICAgICAgdmlld01hdHJpeCxcbiAgICAgICAgdmlld01hdHJpeCxcbiAgICAgICAgbWF0NF9tdWx0aXBseShyb3RhdGlvbk1hdHJpeCwgcm90YXRpb25NYXRyaXgsIHRyYW5zbGF0ZU1hdHJpeClcbiAgICAgICksXG4gICAgICBwcm9qZWN0aW9uTWF0cml4OiBwZXJzcGVjdGl2ZU1hdHJpeCxcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0XG4gICAgfSk7XG5cbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgdGhpcy5kaXN0YW5jZSA9IGRpc3RhbmNlO1xuICAgIHRoaXMucm90YXRpb25YID0gcm90YXRpb25YO1xuICAgIHRoaXMucm90YXRpb25PcmJpdCA9IHJvdGF0aW9uT3JiaXQ7XG4gICAgdGhpcy5vcmJpdEF4aXMgPSBvcmJpdEF4aXM7XG4gICAgdGhpcy5sb29rQXQgPSBsb29rQXQ7XG4gICAgdGhpcy51cCA9IHVwO1xuICAgIHRoaXMuZm92ID0gZm92O1xuICAgIHRoaXMubmVhciA9IG5lYXI7XG4gICAgdGhpcy5mYXIgPSBmYXI7XG4gICAgdGhpcy56b29tID0gem9vbTtcbiAgfVxuXG4gIHByb2plY3QoeHl6LCB7dG9wTGVmdCA9IGZhbHNlfSA9IHt9KSB7XG4gICAgY29uc3QgdiA9IHRyYW5zZm9ybVZlY3Rvcih0aGlzLnBpeGVsUHJvamVjdGlvbk1hdHJpeCwgWy4uLnh5eiwgMV0pO1xuXG4gICAgY29uc3QgW3gsIHksIHpdID0gdjtcbiAgICBjb25zdCB5MiA9IHRvcExlZnQgPyB0aGlzLmhlaWdodCAtIHkgOiB5O1xuICAgIHJldHVybiBbeCwgeTIsIHpdO1xuICB9XG5cbiAgdW5wcm9qZWN0KHh5eiwge3RvcExlZnQgPSBmYWxzZX0gPSB7fSkge1xuICAgIGNvbnN0IFt4LCB5LCB6XSA9IHh5ejtcbiAgICBjb25zdCB5MiA9IHRvcExlZnQgPyB0aGlzLmhlaWdodCAtIHkgOiB5O1xuXG4gICAgcmV0dXJuIHRyYW5zZm9ybVZlY3Rvcih0aGlzLnBpeGVsVW5wcm9qZWN0aW9uTWF0cml4LCBbeCwgeTIsIHosIDFdKTtcbiAgfVxuXG4gIC8qKiBNb3ZlIGNhbWVyYSB0byBtYWtlIGEgbW9kZWwgYm91bmRpbmcgYm94IGNlbnRlcmVkIGF0IGxvb2thdCBwb3NpdGlvbiBmaXQgaW4gdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0ge0FycmF5fSBzaXplcyAtIFtzaXplWCwgc2l6ZVksIHNpemVaXV0sIGRlZmluZSB0aGUgZGltZW5zaW9ucyBvZiBib3VuZGluZyBib3hcbiAgICogQHJldHVybnMgYSBuZXcgT3JiaXRWaWV3cG9ydCBvYmplY3RcbiAgICovXG4gIGZpdEJvdW5kcyhzaXplcykge1xuICAgIGNvbnN0IHtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgcm90YXRpb25YLFxuICAgICAgcm90YXRpb25PcmJpdCxcbiAgICAgIG9yYml0QXhpcyxcbiAgICAgIGxvb2tBdCxcbiAgICAgIHVwLFxuICAgICAgZm92LFxuICAgICAgbmVhcixcbiAgICAgIGZhcixcbiAgICAgIHpvb21cbiAgICB9ID0gdGhpcztcbiAgICBjb25zdCBzaXplID0gTWF0aC5tYXgoc2l6ZXNbMF0sIHNpemVzWzFdLCBzaXplc1syXSkgLyAyO1xuICAgIGNvbnN0IG5ld0Rpc3RhbmNlID0gc2l6ZSAvIE1hdGgudGFuKGZvdiAvIDE4MCAqIE1hdGguUEkgLyAyKTtcblxuICAgIHJldHVybiBuZXcgT3JiaXRWaWV3cG9ydCh7XG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIHJvdGF0aW9uWCxcbiAgICAgIHJvdGF0aW9uT3JiaXQsXG4gICAgICBvcmJpdEF4aXMsXG4gICAgICB1cCxcbiAgICAgIGZvdixcbiAgICAgIG5lYXIsXG4gICAgICBmYXIsXG4gICAgICB6b29tLFxuICAgICAgbG9va0F0LFxuICAgICAgZGlzdGFuY2U6IG5ld0Rpc3RhbmNlXG4gICAgfSk7XG4gIH1cbn1cblxuT3JiaXRWaWV3cG9ydC5kaXNwbGF5TmFtZSA9ICdPcmJpdFZpZXdwb3J0JztcbiJdfQ==