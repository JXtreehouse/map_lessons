'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _luma = require('luma.gl');

var _effect = require('../../../core/experimental/lib/effect');

var _effect2 = _interopRequireDefault(_effect);

var _webMercatorViewport = require('../../../core/viewports/web-mercator-viewport');

var _webMercatorViewport2 = _interopRequireDefault(_webMercatorViewport);

var _reflectionEffectVertex = require('./reflection-effect-vertex.glsl');

var _reflectionEffectVertex2 = _interopRequireDefault(_reflectionEffectVertex);

var _reflectionEffectFragment = require('./reflection-effect-fragment.glsl');

var _reflectionEffectFragment2 = _interopRequireDefault(_reflectionEffectFragment);

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

/* global window */


var ReflectionEffect = function (_Effect) {
  _inherits(ReflectionEffect, _Effect);

  /**
   * @classdesc
   * ReflectionEffect
   *
   * @class
   * @param reflectivity How visible reflections should be over the map, between 0 and 1
   * @param blur how blurry the reflection should be, between 0 and 1
   */

  function ReflectionEffect() {
    var reflectivity = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
    var blur = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;

    _classCallCheck(this, ReflectionEffect);

    var _this = _possibleConstructorReturn(this, (ReflectionEffect.__proto__ || Object.getPrototypeOf(ReflectionEffect)).call(this));

    _this.reflectivity = reflectivity;
    _this.blur = blur;
    _this.framebuffer = null;
    _this.setNeedsRedraw();
    return _this;
  }

  _createClass(ReflectionEffect, [{
    key: 'getShaders',
    value: function getShaders() {
      return {
        vs: _reflectionEffectVertex2.default,
        fs: _reflectionEffectFragment2.default,
        modules: [],
        shaderCache: this.context.shaderCache
      };
    }
  }, {
    key: 'initialize',
    value: function initialize(_ref) {
      var gl = _ref.gl,
          layerManager = _ref.layerManager;

      this.unitQuad = new _luma.Model(gl, Object.assign({}, this.getShaders(), {
        id: 'reflection-effect',
        geometry: new _luma.Geometry({
          drawMode: _luma.GL.TRIANGLE_FAN,
          vertices: new Float32Array([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0])
        })
      }));
      this.framebuffer = new _luma.Framebuffer(gl, { depth: true });
    }
  }, {
    key: 'preDraw',
    value: function preDraw(_ref2) {
      var gl = _ref2.gl,
          layerManager = _ref2.layerManager;
      var viewport = layerManager.context.viewport;
      /*
       * the renderer already has a reference to this, but we don't have a reference to the renderer.
       * when we refactor the camera code, we should make sure we get a reference to the renderer so
       * that we can keep this in one place.
       */

      var dpi = typeof window !== 'undefined' && window.devicePixelRatio || 1;
      this.framebuffer.resize({ width: dpi * viewport.width, height: dpi * viewport.height });
      var pitch = viewport.pitch;
      this.framebuffer.bind();
      /* this is a huge hack around the existing viewport class.
       * TODO in the future, once we implement bona-fide cameras, we really need to fix this.
       */
      layerManager.setViewport(new _webMercatorViewport2.default(Object.assign({}, viewport, { pitch: -180 - pitch })));
      gl.clear(_luma.GL.COLOR_BUFFER_BIT | _luma.GL.DEPTH_BUFFER_BIT);

      layerManager.drawLayers({ pass: 'reflection' });
      layerManager.setViewport(viewport);
      this.framebuffer.unbind();
    }
  }, {
    key: 'draw',
    value: function draw(_ref3) {
      var gl = _ref3.gl,
          layerManager = _ref3.layerManager;

      /*
       * Render our unit quad.
       * This will cover the entire screen, but will lie behind all other geometry.
       * This quad will sample the previously generated reflection texture
       * in order to create the reflection effect
       */
      this.unitQuad.render({
        reflectionTexture: this.framebuffer.texture,
        reflectionTextureWidth: this.framebuffer.width,
        reflectionTextureHeight: this.framebuffer.height,
        reflectivity: this.reflectivity,
        blur: this.blur
      });
    }
  }, {
    key: 'finalize',
    value: function finalize(_ref4) {
      /* TODO: Free resources? */

      var gl = _ref4.gl,
          layerManager = _ref4.layerManager;
    }
  }]);

  return ReflectionEffect;
}(_effect2.default);

exports.default = ReflectionEffect;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9lZmZlY3RzL2V4cGVyaW1lbnRhbC9yZWZsZWN0aW9uLWVmZmVjdC9yZWZsZWN0aW9uLWVmZmVjdC5qcyJdLCJuYW1lcyI6WyJSZWZsZWN0aW9uRWZmZWN0IiwicmVmbGVjdGl2aXR5IiwiYmx1ciIsImZyYW1lYnVmZmVyIiwic2V0TmVlZHNSZWRyYXciLCJ2cyIsImZzIiwibW9kdWxlcyIsInNoYWRlckNhY2hlIiwiY29udGV4dCIsImdsIiwibGF5ZXJNYW5hZ2VyIiwidW5pdFF1YWQiLCJPYmplY3QiLCJhc3NpZ24iLCJnZXRTaGFkZXJzIiwiaWQiLCJnZW9tZXRyeSIsImRyYXdNb2RlIiwiVFJJQU5HTEVfRkFOIiwidmVydGljZXMiLCJGbG9hdDMyQXJyYXkiLCJkZXB0aCIsInZpZXdwb3J0IiwiZHBpIiwid2luZG93IiwiZGV2aWNlUGl4ZWxSYXRpbyIsInJlc2l6ZSIsIndpZHRoIiwiaGVpZ2h0IiwicGl0Y2giLCJiaW5kIiwic2V0Vmlld3BvcnQiLCJjbGVhciIsIkNPTE9SX0JVRkZFUl9CSVQiLCJERVBUSF9CVUZGRVJfQklUIiwiZHJhd0xheWVycyIsInBhc3MiLCJ1bmJpbmQiLCJyZW5kZXIiLCJyZWZsZWN0aW9uVGV4dHVyZSIsInRleHR1cmUiLCJyZWZsZWN0aW9uVGV4dHVyZVdpZHRoIiwicmVmbGVjdGlvblRleHR1cmVIZWlnaHQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBcUJBOztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7Ozs7Ozs7OytlQTFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7O0lBUXFCQSxnQjs7O0FBQ25COzs7Ozs7Ozs7QUFTQSw4QkFBNEM7QUFBQSxRQUFoQ0MsWUFBZ0MsdUVBQWpCLEdBQWlCO0FBQUEsUUFBWkMsSUFBWSx1RUFBTCxHQUFLOztB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aW9uLWVmZmVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSAtIDIwMTcgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG4vKiBnbG9iYWwgd2luZG93ICovXG5pbXBvcnQge0dMLCBGcmFtZWJ1ZmZlciwgTW9kZWwsIEdlb21ldHJ5fSBmcm9tICdsdW1hLmdsJztcbmltcG9ydCBFZmZlY3QgZnJvbSAnLi4vLi4vLi4vY29yZS9leHBlcmltZW50YWwvbGliL2VmZmVjdCc7XG5pbXBvcnQgV2ViTWVyY2F0b3JWaWV3cG9ydCBmcm9tICcuLi8uLi8uLi9jb3JlL3ZpZXdwb3J0cy93ZWItbWVyY2F0b3Itdmlld3BvcnQnO1xuXG5pbXBvcnQgcmVmbGVjdGlvblZlcnRleCBmcm9tICcuL3JlZmxlY3Rpb24tZWZmZWN0LXZlcnRleC5nbHNsJztcbmltcG9ydCByZWZsZWN0aW9uRnJhZ21lbnQgZnJvbSAnLi9yZWZsZWN0aW9uLWVmZmVjdC1mcmFnbWVudC5nbHNsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVmbGVjdGlvbkVmZmVjdCBleHRlbmRzIEVmZmVjdCB7XG4gIC8qKlxuICAgKiBAY2xhc3NkZXNjXG4gICAqIFJlZmxlY3Rpb25FZmZlY3RcbiAgICpcbiAgICogQGNsYXNzXG4gICAqIEBwYXJhbSByZWZsZWN0aXZpdHkgSG93IHZpc2libGUgcmVmbGVjdGlvbnMgc2hvdWxkIGJlIG92ZXIgdGhlIG1hcCwgYmV0d2VlbiAwIGFuZCAxXG4gICAqIEBwYXJhbSBibHVyIGhvdyBibHVycnkgdGhlIHJlZmxlY3Rpb24gc2hvdWxkIGJlLCBiZXR3ZWVuIDAgYW5kIDFcbiAgICovXG5cbiAgY29uc3RydWN0b3IocmVmbGVjdGl2aXR5ID0gMC41LCBibHVyID0gMC41KSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnJlZmxlY3Rpdml0eSA9IHJlZmxlY3Rpdml0eTtcbiAgICB0aGlzLmJsdXIgPSBibHVyO1xuICAgIHRoaXMuZnJhbWVidWZmZXIgPSBudWxsO1xuICAgIHRoaXMuc2V0TmVlZHNSZWRyYXcoKTtcbiAgfVxuXG4gIGdldFNoYWRlcnMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZzOiByZWZsZWN0aW9uVmVydGV4LFxuICAgICAgZnM6IHJlZmxlY3Rpb25GcmFnbWVudCxcbiAgICAgIG1vZHVsZXM6IFtdLFxuICAgICAgc2hhZGVyQ2FjaGU6IHRoaXMuY29udGV4dC5zaGFkZXJDYWNoZVxuICAgIH07XG4gIH1cblxuICBpbml0aWFsaXplKHtnbCwgbGF5ZXJNYW5hZ2VyfSkge1xuICAgIHRoaXMudW5pdFF1YWQgPSBuZXcgTW9kZWwoXG4gICAgICBnbCxcbiAgICAgIE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZ2V0U2hhZGVycygpLCB7XG4gICAgICAgIGlkOiAncmVmbGVjdGlvbi1lZmZlY3QnLFxuICAgICAgICBnZW9tZXRyeTogbmV3IEdlb21ldHJ5KHtcbiAgICAgICAgICBkcmF3TW9kZTogR0wuVFJJQU5HTEVfRkFOLFxuICAgICAgICAgIHZlcnRpY2VzOiBuZXcgRmxvYXQzMkFycmF5KFswLCAwLCAwLCAxLCAwLCAwLCAxLCAxLCAwLCAwLCAxLCAwXSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgKTtcbiAgICB0aGlzLmZyYW1lYnVmZmVyID0gbmV3IEZyYW1lYnVmZmVyKGdsLCB7ZGVwdGg6IHRydWV9KTtcbiAgfVxuXG4gIHByZURyYXcoe2dsLCBsYXllck1hbmFnZXJ9KSB7XG4gICAgY29uc3Qge3ZpZXdwb3J0fSA9IGxheWVyTWFuYWdlci5jb250ZXh0O1xuICAgIC8qXG4gICAgICogdGhlIHJlbmRlcmVyIGFscmVhZHkgaGFzIGEgcmVmZXJlbmNlIHRvIHRoaXMsIGJ1dCB3ZSBkb24ndCBoYXZlIGEgcmVmZXJlbmNlIHRvIHRoZSByZW5kZXJlci5cbiAgICAgKiB3aGVuIHdlIHJlZmFjdG9yIHRoZSBjYW1lcmEgY29kZSwgd2Ugc2hvdWxkIG1ha2Ugc3VyZSB3ZSBnZXQgYSByZWZlcmVuY2UgdG8gdGhlIHJlbmRlcmVyIHNvXG4gICAgICogdGhhdCB3ZSBjYW4ga2VlcCB0aGlzIGluIG9uZSBwbGFjZS5cbiAgICAgKi9cbiAgICBjb25zdCBkcGkgPSAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmRldmljZVBpeGVsUmF0aW8pIHx8IDE7XG4gICAgdGhpcy5mcmFtZWJ1ZmZlci5yZXNpemUoe3dpZHRoOiBkcGkgKiB2aWV3cG9ydC53aWR0aCwgaGVpZ2h0OiBkcGkgKiB2aWV3cG9ydC5oZWlnaHR9KTtcbiAgICBjb25zdCBwaXRjaCA9IHZpZXdwb3J0LnBpdGNoO1xuICAgIHRoaXMuZnJhbWVidWZmZXIuYmluZCgpO1xuICAgIC8qIHRoaXMgaXMgYSBodWdlIGhhY2sgYXJvdW5kIHRoZSBleGlzdGluZyB2aWV3cG9ydCBjbGFzcy5cbiAgICAgKiBUT0RPIGluIHRoZSBmdXR1cmUsIG9uY2Ugd2UgaW1wbGVtZW50IGJvbmEtZmlkZSBjYW1lcmFzLCB3ZSByZWFsbHkgbmVlZCB0byBmaXggdGhpcy5cbiAgICAgKi9cbiAgICBsYXllck1hbmFnZXIuc2V0Vmlld3BvcnQoXG4gICAgICBuZXcgV2ViTWVyY2F0b3JWaWV3cG9ydChPYmplY3QuYXNzaWduKHt9LCB2aWV3cG9ydCwge3BpdGNoOiAtMTgwIC0gcGl0Y2h9KSlcbiAgICApO1xuICAgIGdsLmNsZWFyKEdMLkNPTE9SX0JVRkZFUl9CSVQgfCBHTC5ERVBUSF9CVUZGRVJfQklUKTtcblxuICAgIGxheWVyTWFuYWdlci5kcmF3TGF5ZXJzKHtwYXNzOiAncmVmbGVjdGlvbid9KTtcbiAgICBsYXllck1hbmFnZXIuc2V0Vmlld3BvcnQodmlld3BvcnQpO1xuICAgIHRoaXMuZnJhbWVidWZmZXIudW5iaW5kKCk7XG4gIH1cblxuICBkcmF3KHtnbCwgbGF5ZXJNYW5hZ2VyfSkge1xuICAgIC8qXG4gICAgICogUmVuZGVyIG91ciB1bml0IHF1YWQuXG4gICAgICogVGhpcyB3aWxsIGNvdmVyIHRoZSBlbnRpcmUgc2NyZWVuLCBidXQgd2lsbCBsaWUgYmVoaW5kIGFsbCBvdGhlciBnZW9tZXRyeS5cbiAgICAgKiBUaGlzIHF1YWQgd2lsbCBzYW1wbGUgdGhlIHByZXZpb3VzbHkgZ2VuZXJhdGVkIHJlZmxlY3Rpb24gdGV4dHVyZVxuICAgICAqIGluIG9yZGVyIHRvIGNyZWF0ZSB0aGUgcmVmbGVjdGlvbiBlZmZlY3RcbiAgICAgKi9cbiAgICB0aGlzLnVuaXRRdWFkLnJlbmRlcih7XG4gICAgICByZWZsZWN0aW9uVGV4dHVyZTogdGhpcy5mcmFtZWJ1ZmZlci50ZXh0dXJlLFxuICAgICAgcmVmbGVjdGlvblRleHR1cmVXaWR0aDogdGhpcy5mcmFtZWJ1ZmZlci53aWR0aCxcbiAgICAgIHJlZmxlY3Rpb25UZXh0dXJlSGVpZ2h0OiB0aGlzLmZyYW1lYnVmZmVyLmhlaWdodCxcbiAgICAgIHJlZmxlY3Rpdml0eTogdGhpcy5yZWZsZWN0aXZpdHksXG4gICAgICBibHVyOiB0aGlzLmJsdXJcbiAgICB9KTtcbiAgfVxuXG4gIGZpbmFsaXplKHtnbCwgbGF5ZXJNYW5hZ2VyfSkge1xuICAgIC8qIFRPRE86IEZyZWUgcmVzb3VyY2VzPyAqL1xuICB9XG59XG4iXX0=