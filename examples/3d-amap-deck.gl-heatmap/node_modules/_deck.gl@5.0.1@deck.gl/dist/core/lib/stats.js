'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.formatTime = formatTime;
exports.leftPad = leftPad;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Stats = function () {
  function Stats(_ref) {
    var id = _ref.id;

    _classCallCheck(this, Stats);

    this.id = id;
    this.time = 0;
    this.total = 0;
    this.average = 0;
    this.count = 0;

    this._time = 0;
  }

  _createClass(Stats, [{
    key: 'timeStart',
    value: function timeStart() {
      this._time = this.timestampMs();
    }
  }, {
    key: 'timeEnd',
    value: function timeEnd() {
      this.time = this.timestampMs() - this._time;
      this.total += this.time;
      this.count++;
      this.average = this.total / this.count;
    }
  }, {
    key: 'timestampMs',
    value: function timestampMs() {
      /* global window */
      return typeof window !== 'undefined' && window.performance ? window.performance.now() : Date.now();
    }
  }, {
    key: 'getTimeString',
    value: function getTimeString() {
      return this.id + ':' + formatTime(this.time) + '(' + this.count + ')';
    }
  }]);

  return Stats;
}();

// TODO: Currently unused, keeping in case we want it later for log formatting


exports.default = Stats;
function formatTime(ms) {
  var formatted = void 0;
  if (ms < 10) {
    formatted = ms.toFixed(2) + 'ms';
  } else if (ms < 100) {
    formatted = ms.toFixed(1) + 'ms';
  } else if (ms < 1000) {
    formatted = ms.toFixed(0) + 'ms';
  } else {
    formatted = (ms / 1000).toFixed(2) + 's';
  }
  return formatted;
}

function leftPad(string) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;

  while (string.length < length) {
    string = ' ' + string;
  }
  return string;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL2xpYi9zdGF0cy5qcyJdLCJuYW1lcyI6WyJmb3JtYXRUaW1lIiwibGVmdFBhZCIsIlN0YXRzIiwiaWQiLCJ0aW1lIiwidG90YWwiLCJhdmVyYWdlIiwiY291bnQiLCJfdGltZSIsInRpbWVzdGFtcE1zIiwid2luZG93IiwicGVyZm9ybWFuY2UiLCJub3ciLCJEYXRlIiwibXMiLCJmb3JtYXR0ZWQiLCJ0b0ZpeGVkIiwic3RyaW5nIiwibGVuZ3RoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQW1DZ0JBLFUsR0FBQUEsVTtRQWNBQyxPLEdBQUFBLE87Ozs7SUFqREtDLEs7QUFDbkIsdUJBQWtCO0FBQUEsUUFBTEMsRUFBSyxRQUFMQSxFQUFLOztBQUFBOztBQUNoQixTQUFLQSxFQUFMLEdBQVVBLEVBQVY7QUFDQSxTQUFLQyxJQUFMLEdBQVksQ0FBWjtBQUNBLFNBQUtDLEtBQUwsR0FBYSxDQUFiO0FBQ0EsU0FBS0MsT0FBTCxHQUFlLENBQWY7QUFDQSxTQUFLQyxLQUFMLEdBQWEsQ0FBYjs7QUFFQSxTQUFLQyxLQUFMLEdBQWEsQ0FBYjtBQUNEOzs7O2dDQUVXO0FBQ1YsV0FBS0EsS0FBTCxHQUFhLEtBQUtDLFdBQUwsRUFBYjtBQUNEOzs7OEJBRVM7QUFDUixXQUFLTCxJQUFMLEdBQVksS0FBS0ssV0FBTCxLQUFxQixLQUFLRCxLQUF0QztBQUNBLFdBQUtILEtBQUwsSUFBYyxLQUFLRCxJQUFuQjtBQUNBLFdBQUtHLEtBQUw7QUFDQSxXQUFLRCxPQUFMLEdBQWUsS0FBS0QsS0FBTCxHQUFhLEtBQUtFLEtBQWpDO0FBQ0Q7OztrQ0FFYTtBQUNaO0FBQ0EsYUFBTyxPQUFPRyxNQUFQLEtBQWtCLFdBQWxCLElBQWlDQSxPQUFPQyxXQUF4QyxHQUNIRCxPQUFPQyxXQUFQLENBQW1CQyxHQUFuQixFQURHLEdBRUhDLEtBQUtELEdBQUwsRUFGSjtBQUdEOzs7b0NBRWU7QUFDZCxhQUFVLEtBQUtULEVBQWYsU0FBcUJILFdBQVcsS0FBS0ksSUFBaEIsQ0FBckIsU0FBOEMsS0FBS0csS0FBbkQ7QUFDRDs7Ozs7O0FBR0g7OztrQkFsQ3FCTCxLO0FBbUNkLFNBQVNGLFVBQVQsQ0FBb0JjLEVBQXBCLEVBQXdCO0FBQzdCLE1BQUlDLGtCQUFKO0FBQ0EsTUFBSUQsS0FBSyxFQUFULEVBQWE7QUFDWEMsZ0JBQWVELEdBQUdFLE9BQUgsQ0FBVyxDQUFYLENBQWY7QUFDRCxHQUZELE1BRU8sSUFBSUYsS0FBSyxHQUFULEVBQWM7QUFDbkJDLGdCQUFlRCxHQUFHRSxPQUFILENBQVcsQ0FBWCxDQUFmO0FBQ0QsR0FGTSxNQUVBLElBQUlGLEtBQUssSUFBVCxFQUFlO0FBQ3BCQyxnQkFBZUQsR0FBR0UsT0FBSCxDQUFXLENBQVgsQ0FBZjtBQUNELEdBRk0sTUFFQTtBQUNMRCxnQkFBZSxDQUFDRCxLQUFLLElBQU4sRUFBWUUsT0FBWixDQUFvQixDQUFwQixDQUFmO0FBQ0Q7QUFDRCxTQUFPRCxTQUFQO0FBQ0Q7O0FBRU0sU0FBU2QsT0FBVCxDQUFpQmdCLE1BQWpCLEVBQXFDO0FBQUEsTUFBWkMsTUFBWSx1RUFBSCxDQUFHOztBQUMxQyxTQUFPRCxPQUFPQyxNQUFQLEdBQWdCQSxNQUF2QixFQUErQjtBQUM3QkQsbUJBQWFBLE1BQWI7QUFDRDtBQUNELFNBQU9BLE1BQVA7QUFDRCIsImZpbGUiOiJzdGF0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXRzIHtcbiAgY29uc3RydWN0b3Ioe2lkfSkge1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLnRpbWUgPSAwO1xuICAgIHRoaXMudG90YWwgPSAwO1xuICAgIHRoaXMuYXZlcmFnZSA9IDA7XG4gICAgdGhpcy5jb3VudCA9IDA7XG5cbiAgICB0aGlzLl90aW1lID0gMDtcbiAgfVxuXG4gIHRpbWVTdGFydCgpIHtcbiAgICB0aGlzLl90aW1lID0gdGhpcy50aW1lc3RhbXBNcygpO1xuICB9XG5cbiAgdGltZUVuZCgpIHtcbiAgICB0aGlzLnRpbWUgPSB0aGlzLnRpbWVzdGFtcE1zKCkgLSB0aGlzLl90aW1lO1xuICAgIHRoaXMudG90YWwgKz0gdGhpcy50aW1lO1xuICAgIHRoaXMuY291bnQrKztcbiAgICB0aGlzLmF2ZXJhZ2UgPSB0aGlzLnRvdGFsIC8gdGhpcy5jb3VudDtcbiAgfVxuXG4gIHRpbWVzdGFtcE1zKCkge1xuICAgIC8qIGdsb2JhbCB3aW5kb3cgKi9cbiAgICByZXR1cm4gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LnBlcmZvcm1hbmNlXG4gICAgICA/IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKVxuICAgICAgOiBEYXRlLm5vdygpO1xuICB9XG5cbiAgZ2V0VGltZVN0cmluZygpIHtcbiAgICByZXR1cm4gYCR7dGhpcy5pZH06JHtmb3JtYXRUaW1lKHRoaXMudGltZSl9KCR7dGhpcy5jb3VudH0pYDtcbiAgfVxufVxuXG4vLyBUT0RPOiBDdXJyZW50bHkgdW51c2VkLCBrZWVwaW5nIGluIGNhc2Ugd2Ugd2FudCBpdCBsYXRlciBmb3IgbG9nIGZvcm1hdHRpbmdcbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRUaW1lKG1zKSB7XG4gIGxldCBmb3JtYXR0ZWQ7XG4gIGlmIChtcyA8IDEwKSB7XG4gICAgZm9ybWF0dGVkID0gYCR7bXMudG9GaXhlZCgyKX1tc2A7XG4gIH0gZWxzZSBpZiAobXMgPCAxMDApIHtcbiAgICBmb3JtYXR0ZWQgPSBgJHttcy50b0ZpeGVkKDEpfW1zYDtcbiAgfSBlbHNlIGlmIChtcyA8IDEwMDApIHtcbiAgICBmb3JtYXR0ZWQgPSBgJHttcy50b0ZpeGVkKDApfW1zYDtcbiAgfSBlbHNlIHtcbiAgICBmb3JtYXR0ZWQgPSBgJHsobXMgLyAxMDAwKS50b0ZpeGVkKDIpfXNgO1xuICB9XG4gIHJldHVybiBmb3JtYXR0ZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsZWZ0UGFkKHN0cmluZywgbGVuZ3RoID0gOCkge1xuICB3aGlsZSAoc3RyaW5nLmxlbmd0aCA8IGxlbmd0aCkge1xuICAgIHN0cmluZyA9IGAgJHtzdHJpbmd9YDtcbiAgfVxuICByZXR1cm4gc3RyaW5nO1xufVxuIl19