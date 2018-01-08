/* eslint-disable no-console */
/* global console, window, Image */

console.debug = console.debug || console.log;

var cache = {};

var _log = {
  priority: 0,
  table: function table(priority, _table) {
    if (priority <= _log.priority && _table) {
      console.table(_table);
    }
  },
  log: function log(priority, arg) {
    if (priority <= _log.priority) {
      var _console;

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      (_console = console).debug.apply(_console, ['luma.gl: ' + arg].concat(args));
    }
  },
  info: function info(priority, arg) {
    if (priority <= _log.priority) {
      var _console2;

      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      (_console2 = console).log.apply(_console2, ['luma.gl: ' + arg].concat(args));
    }
  },
  once: function once(priority, arg) {
    if (!cache[arg]) {
      for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        args[_key3 - 2] = arguments[_key3];
      }

      _log.log.apply(_log, [priority, arg].concat(args));
      cache[arg] = true;
    }
  },
  warn: function warn(arg) {
    if (!cache[arg]) {
      var _console3;

      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      (_console3 = console).warn.apply(_console3, ['luma.gl: ' + arg].concat(args));
      cache[arg] = true;
    }
  },
  error: function error(arg) {
    var _console4;

    for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      args[_key5 - 1] = arguments[_key5];
    }

    (_console4 = console).error.apply(_console4, ['luma.gl: ' + arg].concat(args));
  },
  image: function image(_ref) {
    var priority = _ref.priority,
        _image = _ref.image,
        _ref$message = _ref.message,
        message = _ref$message === undefined ? '' : _ref$message,
        _ref$scale = _ref.scale,
        scale = _ref$scale === undefined ? 1 : _ref$scale;

    if (priority > _log.priority) {
      return;
    }
    if (typeof window === 'undefined') {
      // Let's not try this under node
      return;
    }
    if (typeof _image === 'string') {
      var img = new Image();
      img.onload = logImage.bind(null, img, message, scale);
      img.src = _image;
    }
    var element = _image.nodeName || '';
    if (element.toLowerCase() === 'img') {
      logImage(_image, message, scale);
    }
    if (element.toLowerCase() === 'canvas') {
      var _img = new Image();
      _img.onload = logImage.bind(null, _img, message, scale);
      _img.src = _image.toDataURL();
    }
  },
  deprecated: function deprecated(oldUsage, newUsage) {
    _log.warn('luma.gl: `' + oldUsage + '` is deprecated and will be removed in a later version. Use `' + newUsage + '` instead');
  },
  removed: function removed(oldUsage, newUsage) {
    _log.error('`' + oldUsage + '` is no longer supported. Use `' + newUsage + '` instead,   check our Upgrade Guide for more details');
  },
  group: function group(priority, arg) {
    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$collapsed = _ref2.collapsed,
        collapsed = _ref2$collapsed === undefined ? false : _ref2$collapsed;

    if (priority <= _log.priority) {
      if (collapsed) {
        console.groupCollapsed('luma.gl: ' + arg);
      } else {
        console.group('luma.gl: ' + arg);
      }
    }
  },
  groupEnd: function groupEnd(priority, arg) {
    if (priority <= _log.priority) {
      console.groupEnd('luma.gl: ' + arg);
    }
  },
  time: function time(priority, label) {
    if (priority <= _log.priority) {
      // In case the platform doesn't have console.time
      if (console.time) {
        console.time(label);
      } else {
        console.info(label);
      }
    }
  },
  timeEnd: function timeEnd(priority, label) {
    if (priority <= _log.priority) {
      // In case the platform doesn't have console.timeEnd
      if (console.timeEnd) {
        console.timeEnd(label);
      } else {
        console.info(label);
      }
    }
  }
};

// Inspired by https://github.com/hughsk/console-image (MIT license)
function logImage(image, message, scale) {
  var width = image.width * scale;
  var height = image.height * scale;
  var imageUrl = image.src.replace(/\(/g, '%28').replace(/\)/g, '%29');

  console.log(message + ' %c+', ['font-size:1px;', 'padding:' + Math.floor(height / 2) + 'px ' + Math.floor(width / 2) + 'px;', 'line-height:' + height + 'px;', 'background:url(' + imageUrl + ');', 'background-size:' + width + 'px ' + height + 'px;', 'color:transparent;'].join(''));
}

function formatArrayValue(v, opts) {
  var _opts$maxElts = opts.maxElts,
      maxElts = _opts$maxElts === undefined ? 16 : _opts$maxElts,
      _opts$size = opts.size,
      size = _opts$size === undefined ? 1 : _opts$size;

  var string = '[';
  for (var i = 0; i < v.length && i < maxElts; ++i) {
    if (i > 0) {
      string += ',' + (i % size === 0 ? ' ' : '');
    }
    string += formatValue(v[i], opts);
  }
  var terminator = v.length > maxElts ? '...' : ']';
  return '' + string + terminator;
}

export function formatValue(v) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var EPSILON = 1e-16;
  var _opts$isInteger = opts.isInteger,
      isInteger = _opts$isInteger === undefined ? false : _opts$isInteger;

  if (Array.isArray(v) || ArrayBuffer.isView(v)) {
    return formatArrayValue(v, opts);
  }
  if (!Number.isFinite(v)) {
    return String(v);
  }
  if (Math.abs(v) < EPSILON) {
    return isInteger ? '0' : '0.';
  }
  if (isInteger) {
    return v.toFixed(0);
  }
  if (Math.abs(v) > 100 && Math.abs(v) < 10000) {
    return v.toFixed(0);
  }
  var string = v.toPrecision(2);
  var decimal = string.indexOf('.0');
  return decimal === string.length - 2 ? string.slice(0, -1) : string;
}

export default _log;
//# sourceMappingURL=log.js.map