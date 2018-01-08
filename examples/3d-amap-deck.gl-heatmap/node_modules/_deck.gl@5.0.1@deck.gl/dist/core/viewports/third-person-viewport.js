'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _viewport = require('./viewport');

var _viewport2 = _interopRequireDefault(_viewport);

var _math = require('math.gl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Copyright (c) 2015 - 2017 Uber Technologies, Inc.
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

var SphericalCoordinates = _math.experimental.SphericalCoordinates;


function getDirectionFromBearingAndPitch(_ref) {
  var bearing = _ref.bearing,
      pitch = _ref.pitch;

  var spherical = new SphericalCoordinates({ bearing: bearing, pitch: pitch });
  return spherical.toVector3().normalize();
}

var ThirdPersonViewport = function (_Viewport) {
  _inherits(ThirdPersonViewport, _Viewport);

  function ThirdPersonViewport(opts) {
    _classCallCheck(this, ThirdPersonViewport);

    var bearing = opts.bearing,
        pitch = opts.pitch,
        position = opts.position,
        up = opts.up,
        zoom = opts.zoom;


    var direction = getDirectionFromBearingAndPitch({
      bearing: bearing,
      pitch: pitch
    });

    var distance = zoom * 50;

    // TODO somehow need to flip z to make it work
    // check if the position offset is done in the base viewport
    var eye = direction.scale(-distance).multiply(new _math.Vector3(1, 1, -1));

    var viewMatrix = new _math.Matrix4().multiplyRight(new _math.Matrix4().lookAt({ eye: eye, center: position, up: up }));

    return _possibleConstructorReturn(this, (ThirdPersonViewport.__proto__ || Object.getPrototypeOf(ThirdPersonViewport)).call(this, Object.assign({}, opts, {
      // use meter level
      zoom: null,
      viewMatrix: viewMatrix
    })));
  }

  return ThirdPersonViewport;
}(_viewport2.default);

exports.default = ThirdPersonViewport;


ThirdPersonViewport.displayName = 'ThirdPersonViewport';
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3ZpZXdwb3J0cy90aGlyZC1wZXJzb24tdmlld3BvcnQuanMiXSwibmFtZXMiOlsiU3BoZXJpY2FsQ29vcmRpbmF0ZXMiLCJnZXREaXJlY3Rpb25Gcm9tQmVhcmluZ0FuZFBpdGNoIiwiYmVhcmluZyIsInBpdGNoIiwic3BoZXJpY2FsIiwidG9WZWN0b3IzIiwibm9ybWFsaXplIiwiVGhpcmRQZXJzb25WaWV3cG9ydCIsIm9wdHMiLCJwb3NpdGlvbiIsInVwIiwiem9vbSIsImRpcmVjdGlvbiIsImRpc3RhbmNlIiwiZXllIiwic2NhbGUiLCJtdWx0aXBseSIsInZpZXdNYXRyaXgiLCJtdWx0aXBseVJpZ2h0IiwibG9va0F0IiwiY2VudGVyIiwiT2JqZWN0IiwiYXNzaWduIiwiZGlzcGxheU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQW9CQTs7OztBQUNBOzs7Ozs7OzsrZUFyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0lBSU9BLG9CLHNCQUFBQSxvQjs7O0FBRVAsU0FBU0MsK0JBQVQsT0FBMkQ7QUFBQSxNQUFqQkMsT0FBaUIsUUFBakJBLE9BQWlCO0FBQUEsTUFBUkMsS0FBUSxRQUFSQSxLQUFROztBQUN6RCxNQUFNQyxZQUFZLElBQUlKLG9CQUFKLENBQXlCLEVBQUNFLGdCQUFELEVBQVVDLFlBQVYsRUFBekIsQ0FBbEI7QUFDQSxTQUFPQyxVQUFVQyxTQUFWLEdBQXNCQyxTQUF0QixFQUFQO0FBQ0Q7O0lBRW9CQyxtQjs7O0FBQ25CLCtCQUFZQyxJQUFaLEVBQWtCO0FBQUE7O0FBQUEsUUFDVE4sT0FEUyxHQUM2Qk0sSUFEN0IsQ0FDVE4sT0FEUztBQUFBLFFBQ0FDLEtBREEsR0FDNkJLLElBRDdCLENBQ0FMLEtBREE7QUFBQSxRQUNPTSxRQURQLEdBQzZCRCxJQUQ3QixDQUNPQyxRQURQO0FBQUEsUUFDaUJDLEVBRGpCLEdBQzZCRixJQUQ3QixDQUNpQkUsRUFEakI7QUFBQSxRQUNxQkMsSUFEckIsR0FDNkJILElBRDdCLENBQ3FCRyxJQURyQjs7O0FBR2hCLFFBQU1DLFlBQVlYLGdDQUFnQztBQUNoREMsc0JBRGdEO0FBRWhEQztBQUZnRCxLQUFoQyxDQUFsQjs7QUFLQSxRQUFNVSxXQUFXRixPQUFPLEVBQXhCOztBQUVBO0FBQ0E7QUFDQSxRQUFNRyxNQUFNRixVQUFVRyxLQUFWLENBQWdCLENBQUNGLFFBQWpCLEVBQTJCRyxRQUEzQixDQUFvQyxrQkFBWSxDQUFaLEVBQWUsQ0FBZixFQUFrQixDQUFDLENBQW5CLENBQXBDLENBQVo7O0FBRUEsUUFBTUMsYUFBYSxvQkFBY0MsYUFBZCxDQUNqQixvQkFBY0MsTUFBZCxDQUFxQixFQUFDTCxRQUFELEVBQU1NLFFBQVFYLFFBQWQsRUFBd0JDLE1BQXhCLEVBQXJCLENBRGlCLENBQW5COztBQWRnQixxSUFtQmRXLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCZCxJQUFsQixFQUF3QjtBQUN0QjtBQUNBRyxZQUFNLElBRmdCO0FBR3RCTTtBQUhzQixLQUF4QixDQW5CYztBQXlCakI7Ozs7O2tCQTFCa0JWLG1COzs7QUE2QnJCQSxvQkFBb0JnQixXQUFwQixHQUFrQyxxQkFBbEMiLCJmaWxlIjoidGhpcmQtcGVyc29uLXZpZXdwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IC0gMjAxNyBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCBWaWV3cG9ydCBmcm9tICcuL3ZpZXdwb3J0JztcbmltcG9ydCB7VmVjdG9yMywgTWF0cml4NCwgZXhwZXJpbWVudGFsfSBmcm9tICdtYXRoLmdsJztcbmNvbnN0IHtTcGhlcmljYWxDb29yZGluYXRlc30gPSBleHBlcmltZW50YWw7XG5cbmZ1bmN0aW9uIGdldERpcmVjdGlvbkZyb21CZWFyaW5nQW5kUGl0Y2goe2JlYXJpbmcsIHBpdGNofSkge1xuICBjb25zdCBzcGhlcmljYWwgPSBuZXcgU3BoZXJpY2FsQ29vcmRpbmF0ZXMoe2JlYXJpbmcsIHBpdGNofSk7XG4gIHJldHVybiBzcGhlcmljYWwudG9WZWN0b3IzKCkubm9ybWFsaXplKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRoaXJkUGVyc29uVmlld3BvcnQgZXh0ZW5kcyBWaWV3cG9ydCB7XG4gIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICBjb25zdCB7YmVhcmluZywgcGl0Y2gsIHBvc2l0aW9uLCB1cCwgem9vbX0gPSBvcHRzO1xuXG4gICAgY29uc3QgZGlyZWN0aW9uID0gZ2V0RGlyZWN0aW9uRnJvbUJlYXJpbmdBbmRQaXRjaCh7XG4gICAgICBiZWFyaW5nLFxuICAgICAgcGl0Y2hcbiAgICB9KTtcblxuICAgIGNvbnN0IGRpc3RhbmNlID0gem9vbSAqIDUwO1xuXG4gICAgLy8gVE9ETyBzb21laG93IG5lZWQgdG8gZmxpcCB6IHRvIG1ha2UgaXQgd29ya1xuICAgIC8vIGNoZWNrIGlmIHRoZSBwb3NpdGlvbiBvZmZzZXQgaXMgZG9uZSBpbiB0aGUgYmFzZSB2aWV3cG9ydFxuICAgIGNvbnN0IGV5ZSA9IGRpcmVjdGlvbi5zY2FsZSgtZGlzdGFuY2UpLm11bHRpcGx5KG5ldyBWZWN0b3IzKDEsIDEsIC0xKSk7XG5cbiAgICBjb25zdCB2aWV3TWF0cml4ID0gbmV3IE1hdHJpeDQoKS5tdWx0aXBseVJpZ2h0KFxuICAgICAgbmV3IE1hdHJpeDQoKS5sb29rQXQoe2V5ZSwgY2VudGVyOiBwb3NpdGlvbiwgdXB9KVxuICAgICk7XG5cbiAgICBzdXBlcihcbiAgICAgIE9iamVjdC5hc3NpZ24oe30sIG9wdHMsIHtcbiAgICAgICAgLy8gdXNlIG1ldGVyIGxldmVsXG4gICAgICAgIHpvb206IG51bGwsXG4gICAgICAgIHZpZXdNYXRyaXhcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxufVxuXG5UaGlyZFBlcnNvblZpZXdwb3J0LmRpc3BsYXlOYW1lID0gJ1RoaXJkUGVyc29uVmlld3BvcnQnO1xuIl19