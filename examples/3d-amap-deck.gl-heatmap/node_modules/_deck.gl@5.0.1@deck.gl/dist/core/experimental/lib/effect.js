'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var counter = 0;

var Effect = function () {
  function Effect() {
    _classCallCheck(this, Effect);

    this.id = 'effect';
    this.count = counter++;
    this.visible = true;
    this.priority = 0;
    this.needsRedraw = false;
  }

  /**
   * subclasses should override to set up any resources needed
   */


  _createClass(Effect, [{
    key: 'initialize',
    value: function initialize(_ref) {
      var gl = _ref.gl,
          layerManager = _ref.layerManager;
    }
    /**
     * and subclasses should free those resources here
     */

  }, {
    key: 'finalize',
    value: function finalize(_ref2) {
      var gl = _ref2.gl,
          layerManager = _ref2.layerManager;
    }
    /**
     * override for a callback immediately before drawing each frame
     */

  }, {
    key: 'preDraw',
    value: function preDraw(_ref3) {
      var gl = _ref3.gl,
          layerManager = _ref3.layerManager;
    }
    /**
     * override for a callback immediately after drawing a frame's layers
     */

  }, {
    key: 'draw',
    value: function draw(_ref4) {
      var gl = _ref4.gl,
          layerManager = _ref4.layerManager;
    }
  }, {
    key: 'setNeedsRedraw',
    value: function setNeedsRedraw() {
      var redraw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      this.needsRedraw = redraw;
    }
  }]);

  return Effect;
}();

exports.default = Effect;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb3JlL2V4cGVyaW1lbnRhbC9saWIvZWZmZWN0LmpzIl0sIm5hbWVzIjpbImNvdW50ZXIiLCJFZmZlY3QiLCJpZCIsImNvdW50IiwidmlzaWJsZSIsInByaW9yaXR5IiwibmVlZHNSZWRyYXciLCJnbCIsImxheWVyTWFuYWdlciIsInJlZHJhdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUlBLFVBQVUsQ0FBZDs7SUFFcUJDLE07QUFDbkIsb0JBQWM7QUFBQTs7QUFDWixTQUFLQyxFQUFMLEdBQVUsUUFBVjtBQUNBLFNBQUtDLEtBQUwsR0FBYUgsU0FBYjtBQUNBLFNBQUtJLE9BQUwsR0FBZSxJQUFmO0FBQ0EsU0FBS0MsUUFBTCxHQUFnQixDQUFoQjtBQUNBLFNBQUtDLFdBQUwsR0FBbUIsS0FBbkI7QUFDRDs7QUFFRDs7Ozs7OztxQ0FHK0I7QUFBQSxVQUFuQkMsRUFBbUIsUUFBbkJBLEVBQW1CO0FBQUEsVUFBZkMsWUFBZSxRQUFmQSxZQUFlO0FBQUU7QUFDakM7Ozs7OztvQ0FHNkI7QUFBQSxVQUFuQkQsRUFBbUIsU0FBbkJBLEVBQW1CO0FBQUEsVUFBZkMsWUFBZSxTQUFmQSxZQUFlO0FBQUU7QUFDL0I7Ozs7OzttQ0FHNEI7QUFBQSxVQUFuQkQsRUFBbUIsU0FBbkJBLEVBQW1CO0FBQUEsVUFBZkMsWUFBZSxTQUFmQSxZQUFlO0FBQUU7QUFDOUI7Ozs7OztnQ0FHeUI7QUFBQSxVQUFuQkQsRUFBbUIsU0FBbkJBLEVBQW1CO0FBQUEsVUFBZkMsWUFBZSxTQUFmQSxZQUFlO0FBQUU7OztxQ0FFRztBQUFBLFVBQWZDLE1BQWUsdUVBQU4sSUFBTTs7QUFDNUIsV0FBS0gsV0FBTCxHQUFtQkcsTUFBbkI7QUFDRDs7Ozs7O2tCQTVCa0JSLE0iLCJmaWxlIjoiZWZmZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IC0gMjAxNyBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmxldCBjb3VudGVyID0gMDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRWZmZWN0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pZCA9ICdlZmZlY3QnO1xuICAgIHRoaXMuY291bnQgPSBjb3VudGVyKys7XG4gICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLnByaW9yaXR5ID0gMDtcbiAgICB0aGlzLm5lZWRzUmVkcmF3ID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogc3ViY2xhc3NlcyBzaG91bGQgb3ZlcnJpZGUgdG8gc2V0IHVwIGFueSByZXNvdXJjZXMgbmVlZGVkXG4gICAqL1xuICBpbml0aWFsaXplKHtnbCwgbGF5ZXJNYW5hZ2VyfSkge31cbiAgLyoqXG4gICAqIGFuZCBzdWJjbGFzc2VzIHNob3VsZCBmcmVlIHRob3NlIHJlc291cmNlcyBoZXJlXG4gICAqL1xuICBmaW5hbGl6ZSh7Z2wsIGxheWVyTWFuYWdlcn0pIHt9XG4gIC8qKlxuICAgKiBvdmVycmlkZSBmb3IgYSBjYWxsYmFjayBpbW1lZGlhdGVseSBiZWZvcmUgZHJhd2luZyBlYWNoIGZyYW1lXG4gICAqL1xuICBwcmVEcmF3KHtnbCwgbGF5ZXJNYW5hZ2VyfSkge31cbiAgLyoqXG4gICAqIG92ZXJyaWRlIGZvciBhIGNhbGxiYWNrIGltbWVkaWF0ZWx5IGFmdGVyIGRyYXdpbmcgYSBmcmFtZSdzIGxheWVyc1xuICAgKi9cbiAgZHJhdyh7Z2wsIGxheWVyTWFuYWdlcn0pIHt9XG5cbiAgc2V0TmVlZHNSZWRyYXcocmVkcmF3ID0gdHJ1ZSkge1xuICAgIHRoaXMubmVlZHNSZWRyYXcgPSByZWRyYXc7XG4gIH1cbn1cbiJdfQ==