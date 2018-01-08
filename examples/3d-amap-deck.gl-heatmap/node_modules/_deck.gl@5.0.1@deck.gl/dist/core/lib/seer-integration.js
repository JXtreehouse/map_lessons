'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeLayerInSeer = exports.updateLayerInSeer = exports.initLayerInSeer = exports.seerInitListener = exports.layerEditListener = exports.applyPropOverrides = exports.setPropOverrides = undefined;

var _seer = require('seer');

var _seer2 = _interopRequireDefault(_seer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Recursively set a nested property of an object given a properties array and a value
 */
var recursiveSet = function recursiveSet(obj, path, value) {
  if (!obj) {
    return;
  }

  if (path.length > 1) {
    recursiveSet(obj[path[0]], path.slice(1), value);
  } else {
    obj[path[0]] = value;
  }
};

var overrides = new Map();

/**
 * Create an override on the specify layer, indexed by a valuePath array.
 * Do nothing in case Seer as not been initialized to prevent any preformance drawback.
 */
var setPropOverrides = exports.setPropOverrides = function setPropOverrides(id, valuePath, value) {
  if (!_seer2.default.isReady()) {
    return;
  }

  if (!overrides.has(id)) {
    overrides.set(id, new Map());
  }

  var props = overrides.get(id);
  props.set(valuePath, value);
};

/**
 * Get the props overrides of a specific layer if Seer as been initialized
 * Invalidates the data to be sure new ones are always picked up.
 */
var applyPropOverrides = exports.applyPropOverrides = function applyPropOverrides(props) {
  if (!_seer2.default.isReady() || !props.id) {
    return;
  }

  var overs = overrides.get(props.id);
  if (!overs) {
    return;
  }

  overs.forEach(function (value, valuePath) {
    recursiveSet(props, valuePath, value);
    // Invalidate data array if we have a data override
    if (valuePath[0] === 'data') {
      props.data = [].concat(_toConsumableArray(props.data));
    }
  });
};

/**
 * Listen for deck.gl edit events
 */
var layerEditListener = exports.layerEditListener = function layerEditListener(cb) {
  if (!_seer2.default.isReady()) {
    return;
  }

  _seer2.default.listenFor('deck.gl', cb);
};

/**
 * Listen for seer init events to resend data
 */
var seerInitListener = exports.seerInitListener = function seerInitListener(cb) {
  if (!_seer2.default.isReady()) {
    return;
  }

  _seer2.default.listenFor('init', cb);
};

var initLayerInSeer = exports.initLayerInSeer = function initLayerInSeer(layer) {
  if (!_seer2.default.isReady() || !layer) {
    return;
  }

  var badges = [layer.constructor.layerName];

  _seer2.default.listItem('deck.gl', layer.id, {
    badges: badges,
    // TODO: Seer currently only handles single model layers
    links: layer.state && layer.state.model ? ['luma.gl:' + layer.state.model.id] : undefined,
    parent: layer.parentLayer ? layer.parentLayer.id : undefined
  });
};

/**
 * Log layer's properties to Seer
 */
var updateLayerInSeer = exports.updateLayerInSeer = function updateLayerInSeer(layer) {
  if (!_seer2.default.isReady() || _seer2.default.throttle('deck.gl:' + layer.id, 1e3)) {
    return;
  }

  var data = logPayload(layer);
  _seer2.default.multiUpdate('deck.gl', layer.id, data);
};

/**
 * On finalize of a specify layer, remove it from seer
 */
var removeLayerInSeer = exports.removeLayerInSeer = function removeLayerInSeer(id) {
  if (!_seer2.default.isReady() || !id) {
    return;
  }

  _seer2.default.deleteItem('deck.gl', id);
};

function logPayload(layer) {
  var data = [{ path: 'objects.props', data: layer.props }];

  var badges = [layer.constructor.layerName];

  if (layer.state) {
    if (layer.state.attributeManager) {
      var attrs = layer.state.attributeManager.getAttributes();
      data.push({ path: 'objects.attributes', data: attrs });
      badges.push(layer.state.attributeManager.stats.getTimeString());
    }
    // TODO: Seer currently only handles single model layers
    if (layer.state.model) {
      layer.state.model.timerQueryEnabled = true;
      var lastFrameTime = layer.state.model.stats.lastFrameTime;

      if (lastFrameTime) {
        badges.push((lastFrameTime * 1000).toFixed(0) + '\u03BCs');
      }
    }
  }

  data.push({ path: 'badges', data: badges });

  return data;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL2xpYi9zZWVyLWludGVncmF0aW9uLmpzIl0sIm5hbWVzIjpbInJlY3Vyc2l2ZVNldCIsIm9iaiIsInBhdGgiLCJ2YWx1ZSIsImxlbmd0aCIsInNsaWNlIiwib3ZlcnJpZGVzIiwiTWFwIiwic2V0UHJvcE92ZXJyaWRlcyIsImlkIiwidmFsdWVQYXRoIiwiaXNSZWFkeSIsImhhcyIsInNldCIsInByb3BzIiwiZ2V0IiwiYXBwbHlQcm9wT3ZlcnJpZGVzIiwib3ZlcnMiLCJmb3JFYWNoIiwiZGF0YSIsImxheWVyRWRpdExpc3RlbmVyIiwibGlzdGVuRm9yIiwiY2IiLCJzZWVySW5pdExpc3RlbmVyIiwiaW5pdExheWVySW5TZWVyIiwibGF5ZXIiLCJiYWRnZXMiLCJjb25zdHJ1Y3RvciIsImxheWVyTmFtZSIsImxpc3RJdGVtIiwibGlua3MiLCJzdGF0ZSIsIm1vZGVsIiwidW5kZWZpbmVkIiwicGFyZW50IiwicGFyZW50TGF5ZXIiLCJ1cGRhdGVMYXllckluU2VlciIsInRocm90dGxlIiwibG9nUGF5bG9hZCIsIm11bHRpVXBkYXRlIiwicmVtb3ZlTGF5ZXJJblNlZXIiLCJkZWxldGVJdGVtIiwiYXR0cmlidXRlTWFuYWdlciIsImF0dHJzIiwiZ2V0QXR0cmlidXRlcyIsInB1c2giLCJzdGF0cyIsImdldFRpbWVTdHJpbmciLCJ0aW1lclF1ZXJ5RW5hYmxlZCIsImxhc3RGcmFtZVRpbWUiLCJ0b0ZpeGVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7O0FBRUE7OztBQUdBLElBQU1BLGVBQWUsU0FBZkEsWUFBZSxDQUFDQyxHQUFELEVBQU1DLElBQU4sRUFBWUMsS0FBWixFQUFzQjtBQUN6QyxNQUFJLENBQUNGLEdBQUwsRUFBVTtBQUNSO0FBQ0Q7O0FBRUQsTUFBSUMsS0FBS0UsTUFBTCxHQUFjLENBQWxCLEVBQXFCO0FBQ25CSixpQkFBYUMsSUFBSUMsS0FBSyxDQUFMLENBQUosQ0FBYixFQUEyQkEsS0FBS0cs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QUFlLENBQUNJLGdCQUFnQixJQUFqQixFQUF1QkMsT0FBdkIsQ0FBK0IsQ0FBL0IsQ0FBZjtBQUNEO0FBQ0Y7QUFDRjs7QUFFRC9CLE9BQUswQixJQUFMLENBQVUsRUFBQzNDLE1BQU0sUUFBUCxFQUFpQmlCLE1BQU1PLE1BQXZCLEVBQVY7O0FBRUEsU0FBT1AsSUFBUDtBQUNEIiwiZmlsZSI6InNlZXItaW50ZWdyYXRpb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2VlciBmcm9tICdzZWVyJztcblxuLyoqXG4gKiBSZWN1cnNpdmVseSBzZXQgYSBuZXN0ZWQgcHJvcGVydHkgb2YgYW4gb2JqZWN0IGdpdmVuIGEgcHJvcGVydGllcyBhcnJheSBhbmQgYSB2YWx1ZVxuICovXG5jb25zdCByZWN1cnNpdmVTZXQgPSAob2JqLCBwYXRoLCB2YWx1ZSkgPT4ge1xuICBpZiAoIW9iaikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChwYXRoLmxlbmd0aCA+IDEpIHtcbiAgICByZWN1cnNpdmVTZXQob2JqW3BhdGhbMF1dLCBwYXRoLnNsaWNlKDEpLCB2YWx1ZSk7XG4gIH0gZWxzZSB7XG4gICAgb2JqW3BhdGhbMF1dID0gdmFsdWU7XG4gIH1cbn07XG5cbmNvbnN0IG92ZXJyaWRlcyA9IG5ldyBNYXAoKTtcblxuLyoqXG4gKiBDcmVhdGUgYW4gb3ZlcnJpZGUgb24gdGhlIHNwZWNpZnkgbGF5ZXIsIGluZGV4ZWQgYnkgYSB2YWx1ZVBhdGggYXJyYXkuXG4gKiBEbyBub3RoaW5nIGluIGNhc2UgU2VlciBhcyBub3QgYmVlbiBpbml0aWFsaXplZCB0byBwcmV2ZW50IGFueSBwcmVmb3JtYW5jZSBkcmF3YmFjay5cbiAqL1xuZXhwb3J0IGNvbnN0IHNldFByb3BPdmVycmlkZXMgPSAoaWQsIHZhbHVlUGF0aCwgdmFsdWUpID0+IHtcbiAgaWYgKCFzZWVyLmlzUmVhZHkoKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICghb3ZlcnJpZGVzLmhhcyhpZCkpIHtcbiAgICBvdmVycmlkZXMuc2V0KGlkLCBuZXcgTWFwKCkpO1xuICB9XG5cbiAgY29uc3QgcHJvcHMgPSBvdmVycmlkZXMuZ2V0KGlkKTtcbiAgcHJvcHMuc2V0KHZhbHVlUGF0aCwgdmFsdWUpO1xufTtcblxuLyoqXG4gKiBHZXQgdGhlIHByb3BzIG92ZXJyaWRlcyBvZiBhIHNwZWNpZmljIGxheWVyIGlmIFNlZXIgYXMgYmVlbiBpbml0aWFsaXplZFxuICogSW52YWxpZGF0ZXMgdGhlIGRhdGEgdG8gYmUgc3VyZSBuZXcgb25lcyBhcmUgYWx3YXlzIHBpY2tlZCB1cC5cbiAqL1xuZXhwb3J0IGNvbnN0IGFwcGx5UHJvcE92ZXJyaWRlcyA9IHByb3BzID0+IHtcbiAgaWYgKCFzZWVyLmlzUmVhZHkoKSB8fCAhcHJvcHMuaWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBvdmVycyA9IG92ZXJyaWRlcy5nZXQocHJvcHMuaWQpO1xuICBpZiAoIW92ZXJzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgb3ZlcnMuZm9yRWFjaCgodmFsdWUsIHZhbHVlUGF0aCkgPT4ge1xuICAgIHJlY3Vyc2l2ZVNldChwcm9wcywgdmFsdWVQYXRoLCB2YWx1ZSk7XG4gICAgLy8gSW52YWxpZGF0ZSBkYXRhIGFycmF5IGlmIHdlIGhhdmUgYSBkYXRhIG92ZXJyaWRlXG4gICAgaWYgKHZhbHVlUGF0aFswXSA9PT0gJ2RhdGEnKSB7XG4gICAgICBwcm9wcy5kYXRhID0gWy4uLnByb3BzLmRhdGFdO1xuICAgIH1cbiAgfSk7XG59O1xuXG4vKipcbiAqIExpc3RlbiBmb3IgZGVjay5nbCBlZGl0IGV2ZW50c1xuICovXG5leHBvcnQgY29uc3QgbGF5ZXJFZGl0TGlzdGVuZXIgPSBjYiA9PiB7XG4gIGlmICghc2Vlci5pc1JlYWR5KCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzZWVyLmxpc3RlbkZvcignZGVjay5nbCcsIGNiKTtcbn07XG5cbi8qKlxuICogTGlzdGVuIGZvciBzZWVyIGluaXQgZXZlbnRzIHRvIHJlc2VuZCBkYXRhXG4gKi9cbmV4cG9ydCBjb25zdCBzZWVySW5pdExpc3RlbmVyID0gY2IgPT4ge1xuICBpZiAoIXNlZXIuaXNSZWFkeSgpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc2Vlci5saXN0ZW5Gb3IoJ2luaXQnLCBjYik7XG59O1xuXG5leHBvcnQgY29uc3QgaW5pdExheWVySW5TZWVyID0gbGF5ZXIgPT4ge1xuICBpZiAoIXNlZXIuaXNSZWFkeSgpIHx8ICFsYXllcikge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGJhZGdlcyA9IFtsYXllci5jb25zdHJ1Y3Rvci5sYXllck5hbWVdO1xuXG4gIHNlZXIubGlzdEl0ZW0oJ2RlY2suZ2wnLCBsYXllci5pZCwge1xuICAgIGJhZGdlcyxcbiAgICAvLyBUT0RPOiBTZWVyIGN1cnJlbnRseSBvbmx5IGhhbmRsZXMgc2luZ2xlIG1vZGVsIGxheWVyc1xuICAgIGxpbmtzOiBsYXllci5zdGF0ZSAmJiBsYXllci5zdGF0ZS5tb2RlbCA/IFtgbHVtYS5nbDoke2xheWVyLnN0YXRlLm1vZGVsLmlkfWBdIDogdW5kZWZpbmVkLFxuICAgIHBhcmVudDogbGF5ZXIucGFyZW50TGF5ZXIgPyBsYXllci5wYXJlbnRMYXllci5pZCA6IHVuZGVmaW5lZFxuICB9KTtcbn07XG5cbi8qKlxuICogTG9nIGxheWVyJ3MgcHJvcGVydGllcyB0byBTZWVyXG4gKi9cbmV4cG9ydCBjb25zdCB1cGRhdGVMYXllckluU2VlciA9IGxheWVyID0+IHtcbiAgaWYgKCFzZWVyLmlzUmVhZHkoKSB8fCBzZWVyLnRocm90dGxlKGBkZWNrLmdsOiR7bGF5ZXIuaWR9YCwgMWUzKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGRhdGEgPSBsb2dQYXlsb2FkKGxheWVyKTtcbiAgc2Vlci5tdWx0aVVwZGF0ZSgnZGVjay5nbCcsIGxheWVyLmlkLCBkYXRhKTtcbn07XG5cbi8qKlxuICogT24gZmluYWxpemUgb2YgYSBzcGVjaWZ5IGxheWVyLCByZW1vdmUgaXQgZnJvbSBzZWVyXG4gKi9cbmV4cG9ydCBjb25zdCByZW1vdmVMYXllckluU2VlciA9IGlkID0+IHtcbiAgaWYgKCFzZWVyLmlzUmVhZHkoKSB8fCAhaWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzZWVyLmRlbGV0ZUl0ZW0oJ2RlY2suZ2wnLCBpZCk7XG59O1xuXG5mdW5jdGlvbiBsb2dQYXlsb2FkKGxheWVyKSB7XG4gIGNvbnN0IGRhdGEgPSBbe3BhdGg6ICdvYmplY3RzLnByb3BzJywgZGF0YTogbGF5ZXIucHJvcHN9XTtcblxuICBjb25zdCBiYWRnZXMgPSBbbGF5ZXIuY29uc3RydWN0b3IubGF5ZXJOYW1lXTtcblxuICBpZiAobGF5ZXIuc3RhdGUpIHtcbiAgICBpZiAobGF5ZXIuc3RhdGUuYXR0cmlidXRlTWFuYWdlcikge1xuICAgICAgY29uc3QgYXR0cnMgPSBsYXllci5zdGF0ZS5hdHRyaWJ1dGVNYW5hZ2VyLmdldEF0dHJpYnV0ZXMoKTtcbiAgICAgIGRhdGEucHVzaCh7cGF0aDogJ29iamVjdHMuYXR0cmlidXRlcycsIGRhdGE6IGF0dHJzfSk7XG4gICAgICBiYWRnZXMucHVzaChsYXllci5zdGF0ZS5hdHRyaWJ1dGVNYW5hZ2VyLnN0YXRzLmdldFRpbWVTdHJpbmcoKSk7XG4gICAgfVxuICAgIC8vIFRPRE86IFNlZXIgY3VycmVudGx5IG9ubHkgaGFuZGxlcyBzaW5nbGUgbW9kZWwgbGF5ZXJzXG4gICAgaWYgKGxheWVyLnN0YXRlLm1vZGVsKSB7XG4gICAgICBsYXllci5zdGF0ZS5tb2RlbC50aW1lclF1ZXJ5RW5hYmxlZCA9IHRydWU7XG4gICAgICBjb25zdCB7bGFzdEZyYW1lVGltZX0gPSBsYXllci5zdGF0ZS5tb2RlbC5zdGF0cztcbiAgICAgIGlmIChsYXN0RnJhbWVUaW1lKSB7XG4gICAgICAgIGJhZGdlcy5wdXNoKGAkeyhsYXN0RnJhbWVUaW1lICogMTAwMCkudG9GaXhlZCgwKX3OvHNgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkYXRhLnB1c2goe3BhdGg6ICdiYWRnZXMnLCBkYXRhOiBiYWRnZXN9KTtcblxuICByZXR1cm4gZGF0YTtcbn1cbiJdfQ==