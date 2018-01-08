'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _orbitViewport = require('../viewports/orbit-viewport');

var _orbitViewport2 = _interopRequireDefault(_orbitViewport);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultState = {
  lookAt: [0, 0, 0],
  rotationX: 0,
  rotationOrbit: 0,
  fov: 50,
  near: 1,
  far: 100,
  translationX: 0,
  translationY: 0,
  zoom: 1
};

var defaultConstraints = {
  minZoom: 0,
  maxZoom: Infinity
};

/* Helpers */

// Constrain number between bounds
function clamp(x, min, max) {
  return x < min ? min : x > max ? max : x;
}

function ensureFinite(value, fallbackValue) {
  return Number.isFinite(value) ? value : fallbackValue;
}

var OrbitState = function () {
  function OrbitState(_ref) {
    var width = _ref.width,
        height = _ref.height,
        distance = _ref.distance,
        rotationX = _ref.rotationX,
        rotationOrbit = _ref.rotationOrbit,
        orbitAxis = _ref.orbitAxis,
        bounds = _ref.bounds,
        lookAt = _ref.lookAt,
        fov = _ref.fov,
        near = _ref.near,
        far = _ref.far,
        translationX = _ref.translationX,
        translationY = _ref.translationY,
        zoom = _ref.zoom,
        minZoom = _ref.minZoom,
        maxZoom = _ref.maxZoom,
        startPanViewport = _ref.startPanViewport,
        startPanPos = _ref.startPanPos,
        isPanning = _ref.isPanning,
        startRotateViewport = _ref.startRotateViewport,
        isRotating = _ref.isRotating,
        startZoomViewport = _ref.startZoomViewport,
        startZoomPos = _ref.startZoomPos;

    _classCallCheck(this, OrbitState);

    (0, _assert2.default)(Number.isFinite(width), '`width` must be supplied');
    (0, _assert2.default)(Number.isFinite(height), '`height` must be supplied');
    (0, _assert2.default)(Number.isFinite(distance), '`distance` must be supplied');

    this._viewportProps = this._applyConstraints({
      width: width,
      height: height,
      distance: distance,
      rotationX: ensureFinite(rotationX, defaultState.rotationX),
      rotationOrbit: ensureFinite(rotationOrbit, defaultState.rotationOrbit),
      orbitAxis: orbitAxis,

      bounds: bounds,
      lookAt: lookAt || defaultState.lookAt,

      fov: ensureFinite(fov, defaultState.fov),
      near: ensureFinite(near, defaultState.near),
      far: ensureFinite(far, defaultState.far),
      translationX: ensureFinite(translationX, defaultState.translationX),
      translationY: ensureFinite(translationY, defaultState.translationY),
      zoom: ensureFinite(zoom, defaultState.zoom),

      minZoom: ensureFinite(minZoom, defaultConstraints.minZoom),
      maxZoom: ensureFinite(maxZoom, defaultConstraints.maxZoom)
    });

    this._interactiveState = {
      startPanViewport: startPanViewport,
      startPanPos: startPanPos,
      isPanning: isPanning,
      startRotateViewport: startRotateViewport,
      isRotating: isRotating,
      startZoomViewport: startZoomViewport,
      startZoomPos: startZoomPos
    };
  }

  /* Public API */

  _createClass(OrbitState, [{
    key: 'getViewportProps',
    value: function getViewportProps() {
      return this._viewportProps;
    }
  }, {
    key: 'getInteractiveState',
    value: function getInteractiveState() {
      return this._interactiveState;
    }

    /**
     * Start panning
     * @param {[Number, Number]} pos - position on screen where the pointer grabs
     */

  }, {
    key: 'panStart',
    value: function panStart(_ref2) {
      var pos = _ref2.pos;

      var viewport = new _orbitViewport2.default(this._viewportProps);

      return this._getUpdatedOrbitState({
        startPanPos: pos,
        startPanViewport: viewport
      });
    }

    /**
     * Pan
     * @param {[Number, Number]} pos - position on screen where the pointer is
     */

  }, {
    key: 'pan',
    value: function pan(_ref3) {
      var pos = _ref3.pos,
          startPos = _ref3.startPos;

      if (this._interactiveState.isRotating) {
        return this._getUpdatedOrbitState();
      }

      var startPanPos = this._interactiveState.startPanPos || startPos;
      (0, _assert2.default)(startPanPos, '`startPanPos` props is required');

      var viewport = this._interactiveState.startPanViewport || new _orbitViewport2.default(this._viewportProps);

      var deltaX = pos[0] - startPanPos[0];
      var deltaY = pos[1] - startPanPos[1];

      var center = viewport.project(viewport.lookAt);
      var newLookAt = viewport.unproject([center[0] - deltaX, center[1] - deltaY, center[2]]);

      return this._getUpdatedOrbitState({
        lookAt: newLookAt,
        isPanning: true
      });
    }

    /**
     * End panning
     * Must call if `panStart()` was called
     */

  }, {
    key: 'panEnd',
    value: function panEnd() {
      return this._getUpdatedOrbitState({
        startPanViewport: null,
        startPanPos: null,
        isPanning: null
      });
    }

    /**
     * Start rotating
     * @param {[Number, Number]} pos - position on screen where the pointer grabs
     */

  }, {
    key: 'rotateStart',
    value: function rotateStart(_ref4) {
      var pos = _ref4.pos;

      // Rotation center should be the worldspace position at the center of the
      // the screen. If not found, use the last one.
      var viewport = new _orbitViewport2.default(this._viewportProps);

      return this._getUpdatedOrbitState({
        startRotateViewport: viewport
      });
    }

    /**
     * Rotate
     * @param {[Number, Number]} pos - position on screen where the pointer is
     */

  }, {
    key: 'rotate',
    value: function rotate(_ref5) {
      var deltaScaleX = _ref5.deltaScaleX,
          deltaScaleY = _ref5.deltaScaleY;

      if (this._interactiveState.isPanning) {
        return this._getUpdatedOrbitState();
      }

      var startRotateViewport = this._interactiveState.startRotateViewport;

      var _ref6 = startRotateViewport || {},
          rotationX = _ref6.rotationX,
          rotationOrbit = _ref6.rotationOrbit;

      rotationX = ensureFinite(rotationX, this._viewportProps.rotationX);
      rotationOrbit = ensureFinite(rotationOrbit, this._viewportProps.rotationOrbit);

      var newRotationX = clamp(rotationX - deltaScaleY * 180, -89.999, 89.999);
      var newRotationOrbit = (rotationOrbit - deltaScaleX * 180) % 360;

      return this._getUpdatedOrbitState({
        rotationX: newRotationX,
        rotationOrbit: newRotationOrbit,
        isRotating: true
      });
    }

    /**
     * End rotating
     * Must call if `rotateStart()` was called
     */

  }, {
    key: 'rotateEnd',
    value: function rotateEnd() {
      return this._getUpdatedOrbitState({
        startRotateViewport: null,
        isRotating: null
      });
    }

    /**
     * Start zooming
     * @param {[Number, Number]} pos - position on screen where the pointer grabs
     */

  }, {
    key: 'zoomStart',
    value: function zoomStart(_ref7) {
      var pos = _ref7.pos;

      var viewport = new _orbitViewport2.default(this._viewportProps);
      return this._getUpdatedOrbitState({
        startZoomViewport: viewport,
        startZoomPos: pos
      });
    }

    /**
     * Zoom
     * @param {[Number, Number]} pos - position on screen where the current center is
     * @param {[Number, Number]} startPos - the center position at
     *   the start of the operation. Must be supplied of `zoomStart()` was not called
     * @param {Number} scale - a number between [0, 1] specifying the accumulated
     *   relative scale.
     */

  }, {
    key: 'zoom',
    value: function zoom(_ref8) {
      var pos = _ref8.pos,
          startPos = _ref8.startPos,
          scale = _ref8.scale;
      var _viewportProps = this._viewportProps,
          zoom = _viewportProps.zoom,
          minZoom = _viewportProps.minZoom,
          maxZoom = _viewportProps.maxZoom,
          width = _viewportProps.width,
          height = _viewportProps.height;

      var startZoomPos = this._interactiveState.startZoomPos || startPos || pos;
      var viewport = this._interactiveState.startZoomViewport || new _orbitViewport2.default(this._viewportProps);

      var newZoom = clamp(zoom * scale, minZoom, maxZoom);
      var deltaX = pos[0] - startZoomPos[0];
      var deltaY = pos[1] - startZoomPos[1];

      // Zoom around the center position
      var cx = startZoomPos[0] - width / 2;
      var cy = height / 2 - startZoomPos[1];
      var center = viewport.project(viewport.lookAt);
      var newCenterX = center[0] - cx + cx * newZoom / zoom + deltaX;
      var newCenterY = center[1] + cy - cy * newZoom / zoom - deltaY;

      var newLookAt = viewport.unproject([newCenterX, newCenterY, center[2]]);

      return this._getUpdatedOrbitState({
        lookAt: newLookAt,
        zoom: newZoom
      });
    }

    /**
     * End zooming
     * Must call if `zoomStart()` was called
     */

  }, {
    key: 'zoomEnd',
    value: function zoomEnd() {
      return this._getUpdatedOrbitState({
        startZoomPos: null
      });
    }

    /* Private methods */

  }, {
    key: '_getUpdatedOrbitState',
    value: function _getUpdatedOrbitState(newProps) {
      // Update _viewportProps
      return new OrbitState(Object.assign({}, this._viewportProps, this._interactiveState, newProps));
    }

    // Apply any constraints (mathematical or defined by _viewportProps) to map state

  }, {
    key: '_applyConstraints',
    value: function _applyConstraints(props) {
      // Ensure zoom is within specified range
      var maxZoom = props.maxZoom,
          minZoom = props.minZoom,
          zoom = props.zoom;

      props.zoom = zoom > maxZoom ? maxZoom : zoom;
      props.zoom = zoom < minZoom ? minZoom : zoom;

      return props;
    }
  }]);

  return OrbitState;
}();

exports.default = OrbitState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL2NvbnRyb2xsZXJzL29yYml0LXN0YXRlLmpzIl0sIm5hbWVzIjpbImRlZmF1bHRTdGF0ZSIsImxvb2tBdCIsInJvdGF0aW9uWCIsInJvdGF0aW9uT3JiaXQiLCJmb3YiLCJuZWFyIiwiZmFyIiwidHJhbnNsYXRpb25YIiwidHJhbnNsYXRpb25ZIiwiem9vbSIsImRlZmF1bHRDb25zdHJhaW50cyIsIm1pblpvb20iLCJtYXhab29tIiwiSW5maW5pdHkiLCJjbGFtcCIsIngiLCJtaW4iLCJtYXgiLCJlbnN1cmVGaW5pdGUiLCJ2YWx1ZSIsImZhbGxiYWNrVmFsdWUiLCJOdW1iZXIiLCJpc0Zpbml0ZSIsIk9yYml0U3RhdGUiLCJ3aWR0aCIsImhlaWdodCIsImRpc3RhbmNlIiwib3JiaXRBeGlzIiwiYm91bmRzIiwic3RhcnRQYW5WaWV3cG9ydCIsInN0YXJ0UGFuUG9zIiwiaXNQYW5uaW5nIiwic3RhcnRSb3RhdGVWaWV3cG9ydCIsImlzUm90YXRpbmciLCJzdGFydFpvb21WaWV3cG9ydCIsInN0YXJ0Wm9vbVBvcyIsIl92aWV3cG9ydFByb3BzIiwiX2FwcGx5Q29uc3RyYWludHMiLCJfaW50ZXJhY3RpdmVTdGF0ZSIsInBvcyIsInZpZXdwb3J0IiwiX2dldFVwZGF0ZWRPcmJpdFN0YXRlIiwic3RhcnRQb3MiLCJkZWx0YVgiLCJkZWx0YVkiLCJjZW50ZXIiLCJwcm9qZWN0IiwibmV3TG9va0F0IiwidW5wcm9qZWN0IiwiZGVsdGFTY2FsZVgiLCJkZWx0YVNjYWxlWSIsIm5ld1JvdGF0aW9uWCIsIm5ld1JvdGF0aW9uT3JiaXQiLCJzY2FsZSIsIm5ld1pvb20iLCJjeCIsImN5IiwibmV3Q2VudGVyWCIsIm5ld0NlbnRlclkiLCJuZXdQcm9wcyIsIk9iamVjdCIsImFzc2lnbiIsInByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsZUFBZTtBQUNuQkMsVUFBUSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sQ0FBUCxDQURXO0FBRW5CQyxhQUFXLENBRlE7QUFHbkJDLGlCQUFlLENBSEk7QUFJbkJDLE9BQUssRUFKYztBQUtuQkMsUUFBTSxDQUxhO0FBTW5CQyxPQUFLLEdBTmM7QUFPbkJDLGdCQUFjLENBUEs7QUFRbkJDLGdCQUFjLENBUks7QUFTbkJDLFFBQU07QUFUYSxDQUFyQjs7QUFZQSxJQUFNQyxxQkFBcUI7QUFDekJDLFdBQVMsQ0FEZ0I7QUFFekJDLFdBQVNDO0FBRmdCLENBQTNCOztBQUtBOztBQUVBO0FBQ0EsU0FBU0MsS0FBVCxDQUFlQyxDQUFmLEVBQWtCQyxHQUFsQixFQUF1QkMsR0FBdkIsRUFBNEI7QUFDMUIsU0FBT0YsSUFBSUMsR0FBSixHQUFVQSxHQUFWLEdBQWdCRCxJQUFJRSxHQUFKLEdBQVVBLEdBQVYsR0FBZ0JGLENBQXZDO0FBQ0Q7O0FBRUQsU0FBU0csWUFBVCxDQUFzQkMsS0FBdEIsRUFBNkJDLGFBQTdCLEVBQTRDO0FBQzFDLFNBQU9DLE9BQU9DLFFBQVAsQ0FBZ0JILEtBQWhCLElBQXlCQSxLQUF6QixHQUFpQ0MsYUFBeEM7QUFDRDs7SUFFb0JHLFU7QUFDbkIsNEJBdUNHO0FBQUEsUUFyQ0RDLEtBcUNDLFFBckNEQSxLQXFDQztBQUFBLFFBcENEQyxNQW9DQyxRQXBDREEsTUFvQ0M7QUFBQSxRQW5DREMsUUFtQ0MsUUFuQ0RBLFFBbUNDO0FBQUEsUUFsQ0R4QixTQWtDQyxRQWxDREEsU0FrQ0M7QUFBQSxRQWpDREMsYUFpQ0MsUUFqQ0RBLGFBaUNDO0FBQUEsUUFoQ0R3QixTQWdDQyxRQWhDREEsU0FnQ0M7QUFBQSxRQTlCREMsTUE4QkMsUUE5QkRBLE1BOEJDO0FBQUEsUUEzQkQzQixNQTJCQyxRQTNCREEsTUEyQkM7QUFBQSxRQXhCREcsR0F3QkMsUUF4QkRBLEdBd0JDO0FBQUEsUUF2QkRDLElBdUJDLFFBdkJEQSxJQXVCQztBQUFBLFFBdEJEQyxHQXNCQyxRQXRCREEsR0FzQkM7QUFBQSxRQW5CREMsWUFtQkMsUUFuQkRBLFlBbUJDO0FBQUEsUUFsQkRDLFlBa0JDLFFBbEJEQSxZQWtCQztBQUFBLFFBakJEQyxJQWlCQyxRQWpCREEsSUFpQkM7QUFBQSxRQWRERSxPQWNDLFFBZERBLE9BY0M7QUFBQSxRQWJEQyxPQWFDLFFBYkRBLE9BYUM7QUFBQSxRQVREaUIsZ0JBU0MsUUFUREEsZ0JBU0M7QUFBQSxRQVJEQyxXQVFDLFFBUkRBLFdBUUM7QUFBQSxRQVBEQyxTQU9DLFFBUERBLFNBT0M7QUFBQSxRQUxEQyxtQkFLQyxRQUxEQSxtQkFLQztBQUFBLFFBSkRDLFVBSUMsUUFKREEsVUFJQztBQUFBLFFBRkRDLGlCQUVDLFFBRkRBLGlCQUVDO0FBQUEsUUFEREMsWUFDQyxRQUREQSxZQUNDOztBQUFBOztBQUNELDBCQUFPZCxPQUFPQyxRQUFQLENBQWdCRSxLQUFoQixDQUFQLEVBQStCLDBCQUEvQjtBQUNBLDBCQUFPSCxPQUFPQyxRQUFQLENBQWdCRyxNQUFoQixDQUFQLEVBQWdDLDJCQUFoQztBQUNBLDBCQUFPSixPQUFPQyxRQUFQLENBQWdCSSxRQUFoQixDQUFQLEVBQWtDLDZCQUFsQzs7QUFFQSxTQUFLVSxjQUFMLEdBQXNCLEtBQUtDLGlCQUFMLENBQXVCO0FBQzNDYixrQkFEMkM7QUFFM0NDLG9CQUYyQztBQUczQ0Msd0JBSDJDO0FBSTNDeEIsaUJBQVdnQixhQUFhaEIsU0FBYixFQUF3QkYsYUFBYUUsU0FBckMsQ0FKZ0M7QUFLM0NDLHFCQUFlZSxhQUFhZixhQUFiLEVBQTRCSCxhQUFhRyxhQUF6QyxDQUw0QjtBQU0zQ3dCLDBCQU4yQzs7QUFRM0NDLG9CQVIyQztBQVMzQzNCLGNBQVFBLFVBQVVELGFBQWFDLE1BVFk7O0FBVzNDRyxXQUFLYyxhQUFhZCxHQUFiLEVBQWtCSixhQUFhSSxHQUEvQixDQVhzQztBQVkzQ0MsWUFBTWEsYUFBYWIsSUFBYixFQUFtQkwsYUFBYUssSUFBaEMsQ0FacUM7QUFhM0NDLFdBQUtZLGFBQWFaLEdBQWIsRUFBa0JOLGFBQWFNLEdBQS9CLENBYnNDO0FBYzNDQyxvQkFBY1csYUFBYVgsWUFBYixFQUEyQlAsYUFBYU8sWUFBeEMsQ0FkNkI7QUFlM0NDLG9CQUFjVSxhQUFhVixZQUFiLEVBQTJCUixhQUFhUSxZQUF4QyxDQWY2QjtBQWdCM0NDLFlBQU1TLGFBQWFULElBQWIsRUFBbUJULGFBQWFTLElBQWhDLENBaEJxQzs7QUFrQjNDRSxlQUFTTyxhQUFhUCxPQUFiLEVBQXNCRCxtQkFBbUJDLE9BQXpDLENBbEJrQztBQW1CM0NDLGVBQVNNLGFBQWFOLE9BQWIsRUFBc0JGLG1CQUFtQkUsT0FBekM7QUFuQmtDLEtBQXZCLENBQXRCOztBQXNCQSxTQUFLMEIsaUJBQUwsR0FBeUI7QUFDdkJULHdDQUR1QjtBQUV2QkMsOEJBRnVCO0FBR3ZCQywwQkFIdUI7QUFJdkJDLDhDQUp1QjtBQUt2QkMsNEJBTHVCO0FBTXZCQywwQ0FOdUI7QUFPdkJDO0FBUHVCLEtBQXpCO0FBU0Q7O0FBRUQ7Ozs7dUNBRW1CO0FBQ2pCLGFBQU8sS0FBS0MsY0FBWjtBQUNEOzs7MENBRXFCO0FBQ3BCLGFBQU8sS0FBS0UsaUJBQVo7QUFDRDs7QUFFRDs7Ozs7OztvQ0FJZ0I7QUFBQSxVQUFOQyxHQUFNLFNBQU5BLEdBQU07O0FBQ2QsVUFBTUMsV0FBVyw0QkFBa0IsS0FBS0osY0FBdkIsQ0FBakI7O0FBRUEsYUFBTyxLQUFLSyxxQkFBTCxDQUEyQjtBQUNoQ1gscUJBQWFTLEdBRG1CO0FBRWhDViwwQkFBa0JXO0FBRmMsT0FBM0IsQ0FBUDtBQUlEOztBQUVEOzs7Ozs7OytCQUlxQjtBQUFBLFVBQWhCRCxHQUFnQixTQUFoQkEsR0FBZ0I7QUFBQSxVQUFYRyxRQUFXLFNBQVhBLFFBQVc7O0FBQ25CLFVBQUksS0FBS0osaUJBQUwsQ0FBdUJMLFVBQTNCLEVBQXVDO0FBQ3JDLGVBQU8sS0FBS1EscUJBQUwsRUFBUDtBQUNEOztBQUVELFVBQU1YLGNBQWMsS0FBS1EsaUJBQUwsQ0FBdUJSLFdBQXZCLElBQXNDWSxRQUExRDtBQUNBLDRCQUFPWixXQUFQLEVBQW9CLGlDQUFwQjs7QUFFQSxVQUFNVSxXQUNKLEtBQUtGLGlCQUFMLENBQXVCVCxnQkFBdkIsSUFBMkMsNEJBQWtCLEtBQUtPLGNBQXZCLENBRDdDOztBQUdBLFVBQU1PLFNBQVNKLElBQUksQ0FBSixJQUFTVCxZQUFZLENBQVosQ0FBeEI7QUFDQSxVQUFNYyxTQUFTTCxJQUFJLENBQUosSUFBU1QsWUFBWSxDQUFaLENBQXhCOztBQUVBLFVBQU1lLFNBQVNMLFNBQVNNLE9BQVQsQ0FBaUJOLFNBQVN2QyxNQUExQixDQUFmO0FBQ0EsVUFBTThDLFlBQVlQLFNBQVNRLFNBQVQsQ0FBbUIsQ0FBQ0gsT0FBTyxDQUFQLElBQVlGLE1BQWIsRUFBcUJFLE9BQU8sQ0FBUCxJQUFZRCxNQUFqQyxFQUF5Q0MsT0FBTyxDQUFQLENBQXpDLENBQW5CLENBQWxCOztBQUVBLGFBQU8sS0FBS0oscUJBQUwsQ0FBMkI7QUFDaEN4QyxnQkFBUThDLFNBRHdCO0FBRWhDaEIsbUJBQVc7QUFGcUIsT0FBM0IsQ0FBUDtBQUlEOztBQUVEOzs7Ozs7OzZCQUlTO0FBQ1AsYUFBTyxLQUFLVSxxQkFBTCxDQUEyQjtBQUNoQ1osMEJBQWtCLElBRGM7QUFFaENDLHFCQUFhLElBRm1CO0FBR2hDQyxtQkFBVztBQUhxQixPQUEzQixDQUFQO0FBS0Q7O0FBRUQ7Ozs7Ozs7dUNBSW1CO0FBQUEsVUFBTlEsR0FBTSxTQUFOQSxHQUFNOztBQUNqQjtBQUNBO0FBQ0EsVUFBTUMsV0FBVyw0QkFBa0IsS0FBS0osY0FBdkIsQ0FBakI7O0FBRUEsYUFBTyxLQUFLSyxxQkFBTCxDQUEyQjtBQUNoQ1QsNkJBQXFCUTtBQURXLE9BQTNCLENBQVA7QUFHRDs7QUFFRDs7Ozs7OztrQ0FJbUM7QUFBQSxVQUEzQlMsV0FBMkIsU0FBM0JBLFdBQTJCO0FBQUEsVUFBZEMsV0FBYyxTQUFkQSxXQUFjOztBQUNqQyxVQUFJLEtBQUtaLGlCQUFMLENBQXVCUCxTQUEzQixFQUFzQztBQUNwQyxlQUFPLEtBQUtVLHFCQUFMLEVBQVA7QUFDRDs7QUFIZ0MsVUFLMUJULG1CQUwwQixHQUtILEtBQUtNLGlCQUxGLENBSzFCTixtQkFMMEI7O0FBQUEsa0JBT0FBLHVCQUF1QixFQVB2QjtBQUFBLFVBTzVCOUIsU0FQNEIsU0FPNUJBLFNBUDRCO0FBQUEsVUFPakJDLGFBUGlCLFNBT2pCQSxhQVBpQjs7QUFRakNELGtCQUFZZ0IsYUFBYWhCLFNBQWIsRUFBd0IsS0FBS2tDLGNBQUwsQ0FBb0JsQyxTQUE1QyxDQUFaO0FBQ0FDLHNCQUFnQmUsYUFBYWYsYUFBYixFQUE0QixLQUFLaUMsY0FBTCxDQUFvQmpDLGFBQWhELENBQWhCOztBQUVBLFVBQU1nRCxlQUFlckMsTUFBTVosWUFBWWdELGNBQWMsR0FBaEMsRUFBcUMsQ0FBQyxNQUF0QyxFQUE4QyxNQUE5QyxDQUFyQjtBQUNBLFVBQU1FLG1CQUFtQixDQUFDakQsZ0JBQWdCOEMsY0FBYyxHQUEvQixJQUFzQyxHQUEvRDs7QUFFQSxhQUFPLEtBQUtSLHFCQUFMLENBQTJCO0FBQ2hDdkMsbUJBQVdpRCxZQURxQjtBQUVoQ2hELHVCQUFlaUQsZ0JBRmlCO0FBR2hDbkIsb0JBQVk7QUFIb0IsT0FBM0IsQ0FBUDtBQUtEOztBQUVEOzs7Ozs7O2dDQUlZO0FBQ1YsYUFBTyxLQUFLUSxxQkFBTCxDQUEyQjtBQUNoQ1QsNkJBQXFCLElBRFc7QUFFaENDLG9CQUFZO0FBRm9CLE9BQTNCLENBQVA7QUFJRDs7QUFFRDs7Ozs7OztxQ0FJaUI7QUFBQSxVQUFOTSxHQUFNLFNBQU5BLEdBQU07O0FBQ2YsVUFBTUMsV0FBVyw0QkFBa0IsS0FBS0osY0FBdkIsQ0FBakI7QUFDQSxhQUFPLEtBQUtLLHFCQUFMLENBQTJCO0FBQ2hDUCwyQkFBbUJNLFFBRGE7QUFFaENMLHNCQUFjSTtBQUZrQixPQUEzQixDQUFQO0FBSUQ7O0FBRUQ7Ozs7Ozs7Ozs7O2dDQVE2QjtBQUFBLFVBQXZCQSxHQUF1QixTQUF2QkEsR0FBdUI7QUFBQSxVQUFsQkcsUUFBa0IsU0FBbEJBLFFBQWtCO0FBQUEsVUFBUlcsS0FBUSxTQUFSQSxLQUFRO0FBQUEsMkJBQ3FCLEtBQUtqQixjQUQxQjtBQUFBLFVBQ3BCM0IsSUFEb0Isa0JBQ3BCQSxJQURvQjtBQUFBLFVBQ2RFLE9BRGMsa0JBQ2RBLE9BRGM7QUFBQSxVQUNMQyxPQURLLGtCQUNMQSxPQURLO0FBQUEsVUFDSVksS0FESixrQkFDSUEsS0FESjtBQUFBLFVBQ1dDLE1BRFgsa0JBQ1dBLE1BRFg7O0FBRTNCLFVBQU1VLGVBQWUsS0FBS0csaUJBQUwsQ0FBdUJILFlBQXZCLElBQXVDTyxRQUF2QyxJQUFtREgsR0FBeEU7QUFDQSxVQUFNQyxXQUNKLEtBQUtGLGlCQUFMLENBQXVCSixpQkFBdkIsSUFBNEMsNEJBQWtCLEtBQUtFLGNBQXZCLENBRDlDOztBQUdBLFVBQU1rQixVQUFVeEMsTUFBTUwsT0FBTzRDLEtBQWIsRUFBb0IxQyxPQUFwQixFQUE2QkMsT0FBN0IsQ0FBaEI7QUFDQSxVQUFNK0IsU0FBU0osSUFBSSxDQUFKLElBQVNKLGFBQWEsQ0FBYixDQUF4QjtBQUNBLFVBQU1TLFNBQVNMLElBQUksQ0FBSixJQUFTSixhQUFhLENBQWIsQ0FBeEI7O0FBRUE7QUFDQSxVQUFNb0IsS0FBS3BCLGFBQWEsQ0FBYixJQUFrQlgsUUFBUSxDQUFyQztBQUNBLFVBQU1nQyxLQUFLL0IsU0FBUyxDQUFULEdBQWFVLGFBQWEsQ0FBYixDQUF4QjtBQUNBLFVBQU1VLFNBQVNMLFNBQVNNLE9BQVQsQ0FBaUJOLFNBQVN2QyxNQUExQixDQUFmO0FBQ0EsVUFBTXdELGFBQWFaLE9BQU8sQ0FBUCxJQUFZVSxFQUFaLEdBQWlCQSxLQUFLRCxPQUFMLEdBQWU3QyxJQUFoQyxHQUF1Q2tDLE1BQTFEO0FBQ0EsVUFBTWUsYUFBYWIsT0FBTyxDQUFQLElBQVlXLEVBQVosR0FBaUJBLEtBQUtGLE9BQUwsR0FBZTdDLElBQWhDLEdBQXVDbUMsTUFBMUQ7O0FBRUEsVUFBTUcsWUFBWVAsU0FBU1EsU0FBVCxDQUFtQixDQUFDUyxVQUFELEVBQWFDLFVBQWIsRUFBeUJiLE9BQU8sQ0FBUCxDQUF6QixDQUFuQixDQUFsQjs7QUFFQSxhQUFPLEtBQUtKLHFCQUFMLENBQTJCO0FBQ2hDeEMsZ0JBQVE4QyxTQUR3QjtBQUVoQ3RDLGNBQU02QztBQUYwQixPQUEzQixDQUFQO0FBSUQ7O0FBRUQ7Ozs7Ozs7OEJBSVU7QUFDUixhQUFPLEtBQUtiLHFCQUFMLENBQTJCO0FBQ2hDTixzQkFBYztBQURrQixPQUEzQixDQUFQO0FBR0Q7O0FBRUQ7Ozs7MENBRXNCd0IsUSxFQUFVO0FBQzlCO0FBQ0EsYUFBTyxJQUFJcEMsVUFBSixDQUFlcUMsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS3pCLGNBQXZCLEVBQXVDLEtBQUtFLGlCQUE1QyxFQUErRHFCLFFBQS9ELENBQWYsQ0FBUDtBQUNEOztBQUVEOzs7O3NDQUNrQkcsSyxFQUFPO0FBQ3ZCO0FBRHVCLFVBRWhCbEQsT0FGZ0IsR0FFVWtELEtBRlYsQ0FFaEJsRCxPQUZnQjtBQUFBLFVBRVBELE9BRk8sR0FFVW1ELEtBRlYsQ0FFUG5ELE9BRk87QUFBQSxVQUVFRixJQUZGLEdBRVVxRCxLQUZWLENBRUVyRCxJQUZGOztBQUd2QnFELFlBQU1yRCxJQUFOLEdBQWFBLE9BQU9HLE9BQVAsR0FBaUJBLE9BQWpCLEdBQTJCSCxJQUF4QztBQUNBcUQsWUFBTXJELElBQU4sR0FBYUEsT0FBT0UsT0FBUCxHQUFpQkEsT0FBakIsR0FBMkJGLElBQXhDOztBQUVBLGFBQU9xRCxLQUFQO0FBQ0Q7Ozs7OztrQkFwUWtCdkMsVSIsImZpbGUiOiJvcmJpdC1zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBPcmJpdFZpZXdwb3J0IGZyb20gJy4uL3ZpZXdwb3J0cy9vcmJpdC12aWV3cG9ydCc7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5cbmNvbnN0IGRlZmF1bHRTdGF0ZSA9IHtcbiAgbG9va0F0OiBbMCwgMCwgMF0sXG4gIHJvdGF0aW9uWDogMCxcbiAgcm90YXRpb25PcmJpdDogMCxcbiAgZm92OiA1MCxcbiAgbmVhcjogMSxcbiAgZmFyOiAxMDAsXG4gIHRyYW5zbGF0aW9uWDogMCxcbiAgdHJhbnNsYXRpb25ZOiAwLFxuICB6b29tOiAxXG59O1xuXG5jb25zdCBkZWZhdWx0Q29uc3RyYWludHMgPSB7XG4gIG1pblpvb206IDAsXG4gIG1heFpvb206IEluZmluaXR5XG59O1xuXG4vKiBIZWxwZXJzICovXG5cbi8vIENvbnN0cmFpbiBudW1iZXIgYmV0d2VlbiBib3VuZHNcbmZ1bmN0aW9uIGNsYW1wKHgsIG1pbiwgbWF4KSB7XG4gIHJldHVybiB4IDwgbWluID8gbWluIDogeCA+IG1heCA/IG1heCA6IHg7XG59XG5cbmZ1bmN0aW9uIGVuc3VyZUZpbml0ZSh2YWx1ZSwgZmFsbGJhY2tWYWx1ZSkge1xuICByZXR1cm4gTnVtYmVyLmlzRmluaXRlKHZhbHVlKSA/IHZhbHVlIDogZmFsbGJhY2tWYWx1ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3JiaXRTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKHtcbiAgICAvKiBWaWV3cG9ydCBhcmd1bWVudHMgKi9cbiAgICB3aWR0aCwgLy8gV2lkdGggb2Ygdmlld3BvcnRcbiAgICBoZWlnaHQsIC8vIEhlaWdodCBvZiB2aWV3cG9ydFxuICAgIGRpc3RhbmNlLCAvLyBGcm9tIGV5ZSB0byB0YXJnZXRcbiAgICByb3RhdGlvblgsIC8vIFJvdGF0aW9uIGFyb3VuZCB4IGF4aXNcbiAgICByb3RhdGlvbk9yYml0LCAvLyBSb3RhdGlvbiBhcm91bmQgb3JiaXQgYXhpc1xuICAgIG9yYml0QXhpcywgLy8gT3JiaXQgYXhpcyB3aXRoIDM2MCBkZWdyZWVzIHJvdGF0aW5nIGZyZWVkb20sIGNhbiBvbmx5IGJlICdZJyBvciAnWidcbiAgICAvLyBCb3VuZGluZyBib3ggb2YgdGhlIG1vZGVsLCBpbiB0aGUgc2hhcGUgb2Yge21pblgsIG1heFgsIG1pblksIG1heFksIG1pblosIG1heFp9XG4gICAgYm91bmRzLFxuXG4gICAgLyogVmlldyBtYXRyaXggYXJndW1lbnRzICovXG4gICAgbG9va0F0LCAvLyBXaGljaCBwb2ludCBpcyBjYW1lcmEgbG9va2luZyBhdCwgZGVmYXVsdCBvcmlnaW5cblxuICAgIC8qIFByb2plY3Rpb24gbWF0cml4IGFyZ3VtZW50cyAqL1xuICAgIGZvdiwgLy8gRmllbGQgb2YgdmlldyBjb3ZlcmVkIGJ5IGNhbWVyYVxuICAgIG5lYXIsIC8vIERpc3RhbmNlIG9mIG5lYXIgY2xpcHBpbmcgcGxhbmVcbiAgICBmYXIsIC8vIERpc3RhbmNlIG9mIGZhciBjbGlwcGluZyBwbGFuZVxuXG4gICAgLyogQWZ0ZXIgcHJvamVjdGlvbiAqL1xuICAgIHRyYW5zbGF0aW9uWCwgLy8gaW4gcGl4ZWxzXG4gICAgdHJhbnNsYXRpb25ZLCAvLyBpbiBwaXhlbHNcbiAgICB6b29tLFxuXG4gICAgLyogVmlld3BvcnQgY29uc3RyYWludHMgKi9cbiAgICBtaW5ab29tLFxuICAgIG1heFpvb20sXG5cbiAgICAvKiogSW50ZXJhY3Rpb24gc3RhdGVzLCByZXF1aXJlZCB0byBjYWxjdWxhdGUgY2hhbmdlIGR1cmluZyB0cmFuc2Zvcm0gKi9cbiAgICAvLyBNb2RlbCBzdGF0ZSB3aGVuIHRoZSBwYW4gb3BlcmF0aW9uIGZpcnN0IHN0YXJ0ZWRcbiAgICBzdGFydFBhblZpZXdwb3J0LFxuICAgIHN0YXJ0UGFuUG9zLFxuICAgIGlzUGFubmluZyxcbiAgICAvLyBNb2RlbCBzdGF0ZSB3aGVuIHRoZSByb3RhdGUgb3BlcmF0aW9uIGZpcnN0IHN0YXJ0ZWRcbiAgICBzdGFydFJvdGF0ZVZpZXdwb3J0LFxuICAgIGlzUm90YXRpbmcsXG4gICAgLy8gTW9kZWwgc3RhdGUgd2hlbiB0aGUgem9vbSBvcGVyYXRpb24gZmlyc3Qgc3RhcnRlZFxuICAgIHN0YXJ0Wm9vbVZpZXdwb3J0LFxuICAgIHN0YXJ0Wm9vbVBvc1xuICB9KSB7XG4gICAgYXNzZXJ0KE51bWJlci5pc0Zpbml0ZSh3aWR0aCksICdgd2lkdGhgIG11c3QgYmUgc3VwcGxpZWQnKTtcbiAgICBhc3NlcnQoTnVtYmVyLmlzRmluaXRlKGhlaWdodCksICdgaGVpZ2h0YCBtdXN0IGJlIHN1cHBsaWVkJyk7XG4gICAgYXNzZXJ0KE51bWJlci5pc0Zpbml0ZShkaXN0YW5jZSksICdgZGlzdGFuY2VgIG11c3QgYmUgc3VwcGxpZWQnKTtcblxuICAgIHRoaXMuX3ZpZXdwb3J0UHJvcHMgPSB0aGlzLl9hcHBseUNvbnN0cmFpbnRzKHtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgZGlzdGFuY2UsXG4gICAgICByb3RhdGlvblg6IGVuc3VyZUZpbml0ZShyb3RhdGlvblgsIGRlZmF1bHRTdGF0ZS5yb3RhdGlvblgpLFxuICAgICAgcm90YXRpb25PcmJpdDogZW5zdXJlRmluaXRlKHJvdGF0aW9uT3JiaXQsIGRlZmF1bHRTdGF0ZS5yb3RhdGlvbk9yYml0KSxcbiAgICAgIG9yYml0QXhpcyxcblxuICAgICAgYm91bmRzLFxuICAgICAgbG9va0F0OiBsb29rQXQgfHwgZGVmYXVsdFN0YXRlLmxvb2tBdCxcblxuICAgICAgZm92OiBlbnN1cmVGaW5pdGUoZm92LCBkZWZhdWx0U3RhdGUuZm92KSxcbiAgICAgIG5lYXI6IGVuc3VyZUZpbml0ZShuZWFyLCBkZWZhdWx0U3RhdGUubmVhciksXG4gICAgICBmYXI6IGVuc3VyZUZpbml0ZShmYXIsIGRlZmF1bHRTdGF0ZS5mYXIpLFxuICAgICAgdHJhbnNsYXRpb25YOiBlbnN1cmVGaW5pdGUodHJhbnNsYXRpb25YLCBkZWZhdWx0U3RhdGUudHJhbnNsYXRpb25YKSxcbiAgICAgIHRyYW5zbGF0aW9uWTogZW5zdXJlRmluaXRlKHRyYW5zbGF0aW9uWSwgZGVmYXVsdFN0YXRlLnRyYW5zbGF0aW9uWSksXG4gICAgICB6b29tOiBlbnN1cmVGaW5pdGUoem9vbSwgZGVmYXVsdFN0YXRlLnpvb20pLFxuXG4gICAgICBtaW5ab29tOiBlbnN1cmVGaW5pdGUobWluWm9vbSwgZGVmYXVsdENvbnN0cmFpbnRzLm1pblpvb20pLFxuICAgICAgbWF4Wm9vbTogZW5zdXJlRmluaXRlKG1heFpvb20sIGRlZmF1bHRDb25zdHJhaW50cy5tYXhab29tKVxuICAgIH0pO1xuXG4gICAgdGhpcy5faW50ZXJhY3RpdmVTdGF0ZSA9IHtcbiAgICAgIHN0YXJ0UGFuVmlld3BvcnQsXG4gICAgICBzdGFydFBhblBvcyxcbiAgICAgIGlzUGFubmluZyxcbiAgICAgIHN0YXJ0Um90YXRlVmlld3BvcnQsXG4gICAgICBpc1JvdGF0aW5nLFxuICAgICAgc3RhcnRab29tVmlld3BvcnQsXG4gICAgICBzdGFydFpvb21Qb3NcbiAgICB9O1xuICB9XG5cbiAgLyogUHVibGljIEFQSSAqL1xuXG4gIGdldFZpZXdwb3J0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZpZXdwb3J0UHJvcHM7XG4gIH1cblxuICBnZXRJbnRlcmFjdGl2ZVN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9pbnRlcmFjdGl2ZVN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHBhbm5pbmdcbiAgICogQHBhcmFtIHtbTnVtYmVyLCBOdW1iZXJdfSBwb3MgLSBwb3NpdGlvbiBvbiBzY3JlZW4gd2hlcmUgdGhlIHBvaW50ZXIgZ3JhYnNcbiAgICovXG4gIHBhblN0YXJ0KHtwb3N9KSB7XG4gICAgY29uc3Qgdmlld3BvcnQgPSBuZXcgT3JiaXRWaWV3cG9ydCh0aGlzLl92aWV3cG9ydFByb3BzKTtcblxuICAgIHJldHVybiB0aGlzLl9nZXRVcGRhdGVkT3JiaXRTdGF0ZSh7XG4gICAgICBzdGFydFBhblBvczogcG9zLFxuICAgICAgc3RhcnRQYW5WaWV3cG9ydDogdmlld3BvcnRcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYW5cbiAgICogQHBhcmFtIHtbTnVtYmVyLCBOdW1iZXJdfSBwb3MgLSBwb3NpdGlvbiBvbiBzY3JlZW4gd2hlcmUgdGhlIHBvaW50ZXIgaXNcbiAgICovXG4gIHBhbih7cG9zLCBzdGFydFBvc30pIHtcbiAgICBpZiAodGhpcy5faW50ZXJhY3RpdmVTdGF0ZS5pc1JvdGF0aW5nKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZ2V0VXBkYXRlZE9yYml0U3RhdGUoKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFydFBhblBvcyA9IHRoaXMuX2ludGVyYWN0aXZlU3RhdGUuc3RhcnRQYW5Qb3MgfHwgc3RhcnRQb3M7XG4gICAgYXNzZXJ0KHN0YXJ0UGFuUG9zLCAnYHN0YXJ0UGFuUG9zYCBwcm9wcyBpcyByZXF1aXJlZCcpO1xuXG4gICAgY29uc3Qgdmlld3BvcnQgPVxuICAgICAgdGhpcy5faW50ZXJhY3RpdmVTdGF0ZS5zdGFydFBhblZpZXdwb3J0IHx8IG5ldyBPcmJpdFZpZXdwb3J0KHRoaXMuX3ZpZXdwb3J0UHJvcHMpO1xuXG4gICAgY29uc3QgZGVsdGFYID0gcG9zWzBdIC0gc3RhcnRQYW5Qb3NbMF07XG4gICAgY29uc3QgZGVsdGFZID0gcG9zWzFdIC0gc3RhcnRQYW5Qb3NbMV07XG5cbiAgICBjb25zdCBjZW50ZXIgPSB2aWV3cG9ydC5wcm9qZWN0KHZpZXdwb3J0Lmxvb2tBdCk7XG4gICAgY29uc3QgbmV3TG9va0F0ID0gdmlld3BvcnQudW5wcm9qZWN0KFtjZW50ZXJbMF0gLSBkZWx0YVgsIGNlbnRlclsxXSAtIGRlbHRhWSwgY2VudGVyWzJdXSk7XG5cbiAgICByZXR1cm4gdGhpcy5fZ2V0VXBkYXRlZE9yYml0U3RhdGUoe1xuICAgICAgbG9va0F0OiBuZXdMb29rQXQsXG4gICAgICBpc1Bhbm5pbmc6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbmQgcGFubmluZ1xuICAgKiBNdXN0IGNhbGwgaWYgYHBhblN0YXJ0KClgIHdhcyBjYWxsZWRcbiAgICovXG4gIHBhbkVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0VXBkYXRlZE9yYml0U3RhdGUoe1xuICAgICAgc3RhcnRQYW5WaWV3cG9ydDogbnVsbCxcbiAgICAgIHN0YXJ0UGFuUG9zOiBudWxsLFxuICAgICAgaXNQYW5uaW5nOiBudWxsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgcm90YXRpbmdcbiAgICogQHBhcmFtIHtbTnVtYmVyLCBOdW1iZXJdfSBwb3MgLSBwb3NpdGlvbiBvbiBzY3JlZW4gd2hlcmUgdGhlIHBvaW50ZXIgZ3JhYnNcbiAgICovXG4gIHJvdGF0ZVN0YXJ0KHtwb3N9KSB7XG4gICAgLy8gUm90YXRpb24gY2VudGVyIHNob3VsZCBiZSB0aGUgd29ybGRzcGFjZSBwb3NpdGlvbiBhdCB0aGUgY2VudGVyIG9mIHRoZVxuICAgIC8vIHRoZSBzY3JlZW4uIElmIG5vdCBmb3VuZCwgdXNlIHRoZSBsYXN0IG9uZS5cbiAgICBjb25zdCB2aWV3cG9ydCA9IG5ldyBPcmJpdFZpZXdwb3J0KHRoaXMuX3ZpZXdwb3J0UHJvcHMpO1xuXG4gICAgcmV0dXJuIHRoaXMuX2dldFVwZGF0ZWRPcmJpdFN0YXRlKHtcbiAgICAgIHN0YXJ0Um90YXRlVmlld3BvcnQ6IHZpZXdwb3J0XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUm90YXRlXG4gICAqIEBwYXJhbSB7W051bWJlciwgTnVtYmVyXX0gcG9zIC0gcG9zaXRpb24gb24gc2NyZWVuIHdoZXJlIHRoZSBwb2ludGVyIGlzXG4gICAqL1xuICByb3RhdGUoe2RlbHRhU2NhbGVYLCBkZWx0YVNjYWxlWX0pIHtcbiAgICBpZiAodGhpcy5faW50ZXJhY3RpdmVTdGF0ZS5pc1Bhbm5pbmcpIHtcbiAgICAgIHJldHVybiB0aGlzLl9nZXRVcGRhdGVkT3JiaXRTdGF0ZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHtzdGFydFJvdGF0ZVZpZXdwb3J0fSA9IHRoaXMuX2ludGVyYWN0aXZlU3RhdGU7XG5cbiAgICBsZXQge3JvdGF0aW9uWCwgcm90YXRpb25PcmJpdH0gPSBzdGFydFJvdGF0ZVZpZXdwb3J0IHx8IHt9O1xuICAgIHJvdGF0aW9uWCA9IGVuc3VyZUZpbml0ZShyb3RhdGlvblgsIHRoaXMuX3ZpZXdwb3J0UHJvcHMucm90YXRpb25YKTtcbiAgICByb3RhdGlvbk9yYml0ID0gZW5zdXJlRmluaXRlKHJvdGF0aW9uT3JiaXQsIHRoaXMuX3ZpZXdwb3J0UHJvcHMucm90YXRpb25PcmJpdCk7XG5cbiAgICBjb25zdCBuZXdSb3RhdGlvblggPSBjbGFtcChyb3RhdGlvblggLSBkZWx0YVNjYWxlWSAqIDE4MCwgLTg5Ljk5OSwgODkuOTk5KTtcbiAgICBjb25zdCBuZXdSb3RhdGlvbk9yYml0ID0gKHJvdGF0aW9uT3JiaXQgLSBkZWx0YVNjYWxlWCAqIDE4MCkgJSAzNjA7XG5cbiAgICByZXR1cm4gdGhpcy5fZ2V0VXBkYXRlZE9yYml0U3RhdGUoe1xuICAgICAgcm90YXRpb25YOiBuZXdSb3RhdGlvblgsXG4gICAgICByb3RhdGlvbk9yYml0OiBuZXdSb3RhdGlvbk9yYml0LFxuICAgICAgaXNSb3RhdGluZzogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuZCByb3RhdGluZ1xuICAgKiBNdXN0IGNhbGwgaWYgYHJvdGF0ZVN0YXJ0KClgIHdhcyBjYWxsZWRcbiAgICovXG4gIHJvdGF0ZUVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0VXBkYXRlZE9yYml0U3RhdGUoe1xuICAgICAgc3RhcnRSb3RhdGVWaWV3cG9ydDogbnVsbCxcbiAgICAgIGlzUm90YXRpbmc6IG51bGxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB6b29taW5nXG4gICAqIEBwYXJhbSB7W051bWJlciwgTnVtYmVyXX0gcG9zIC0gcG9zaXRpb24gb24gc2NyZWVuIHdoZXJlIHRoZSBwb2ludGVyIGdyYWJzXG4gICAqL1xuICB6b29tU3RhcnQoe3Bvc30pIHtcbiAgICBjb25zdCB2aWV3cG9ydCA9IG5ldyBPcmJpdFZpZXdwb3J0KHRoaXMuX3ZpZXdwb3J0UHJvcHMpO1xuICAgIHJldHVybiB0aGlzLl9nZXRVcGRhdGVkT3JiaXRTdGF0ZSh7XG4gICAgICBzdGFydFpvb21WaWV3cG9ydDogdmlld3BvcnQsXG4gICAgICBzdGFydFpvb21Qb3M6IHBvc1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFpvb21cbiAgICogQHBhcmFtIHtbTnVtYmVyLCBOdW1iZXJdfSBwb3MgLSBwb3NpdGlvbiBvbiBzY3JlZW4gd2hlcmUgdGhlIGN1cnJlbnQgY2VudGVyIGlzXG4gICAqIEBwYXJhbSB7W051bWJlciwgTnVtYmVyXX0gc3RhcnRQb3MgLSB0aGUgY2VudGVyIHBvc2l0aW9uIGF0XG4gICAqICAgdGhlIHN0YXJ0IG9mIHRoZSBvcGVyYXRpb24uIE11c3QgYmUgc3VwcGxpZWQgb2YgYHpvb21TdGFydCgpYCB3YXMgbm90IGNhbGxlZFxuICAgKiBAcGFyYW0ge051bWJlcn0gc2NhbGUgLSBhIG51bWJlciBiZXR3ZWVuIFswLCAxXSBzcGVjaWZ5aW5nIHRoZSBhY2N1bXVsYXRlZFxuICAgKiAgIHJlbGF0aXZlIHNjYWxlLlxuICAgKi9cbiAgem9vbSh7cG9zLCBzdGFydFBvcywgc2NhbGV9KSB7XG4gICAgY29uc3Qge3pvb20sIG1pblpvb20sIG1heFpvb20sIHdpZHRoLCBoZWlnaHR9ID0gdGhpcy5fdmlld3BvcnRQcm9wcztcbiAgICBjb25zdCBzdGFydFpvb21Qb3MgPSB0aGlzLl9pbnRlcmFjdGl2ZVN0YXRlLnN0YXJ0Wm9vbVBvcyB8fCBzdGFydFBvcyB8fCBwb3M7XG4gICAgY29uc3Qgdmlld3BvcnQgPVxuICAgICAgdGhpcy5faW50ZXJhY3RpdmVTdGF0ZS5zdGFydFpvb21WaWV3cG9ydCB8fCBuZXcgT3JiaXRWaWV3cG9ydCh0aGlzLl92aWV3cG9ydFByb3BzKTtcblxuICAgIGNvbnN0IG5ld1pvb20gPSBjbGFtcCh6b29tICogc2NhbGUsIG1pblpvb20sIG1heFpvb20pO1xuICAgIGNvbnN0IGRlbHRhWCA9IHBvc1swXSAtIHN0YXJ0Wm9vbVBvc1swXTtcbiAgICBjb25zdCBkZWx0YVkgPSBwb3NbMV0gLSBzdGFydFpvb21Qb3NbMV07XG5cbiAgICAvLyBab29tIGFyb3VuZCB0aGUgY2VudGVyIHBvc2l0aW9uXG4gICAgY29uc3QgY3ggPSBzdGFydFpvb21Qb3NbMF0gLSB3aWR0aCAvIDI7XG4gICAgY29uc3QgY3kgPSBoZWlnaHQgLyAyIC0gc3RhcnRab29tUG9zWzFdO1xuICAgIGNvbnN0IGNlbnRlciA9IHZpZXdwb3J0LnByb2plY3Qodmlld3BvcnQubG9va0F0KTtcbiAgICBjb25zdCBuZXdDZW50ZXJYID0gY2VudGVyWzBdIC0gY3ggKyBjeCAqIG5ld1pvb20gLyB6b29tICsgZGVsdGFYO1xuICAgIGNvbnN0IG5ld0NlbnRlclkgPSBjZW50ZXJbMV0gKyBjeSAtIGN5ICogbmV3Wm9vbSAvIHpvb20gLSBkZWx0YVk7XG5cbiAgICBjb25zdCBuZXdMb29rQXQgPSB2aWV3cG9ydC51bnByb2plY3QoW25ld0NlbnRlclgsIG5ld0NlbnRlclksIGNlbnRlclsyXV0pO1xuXG4gICAgcmV0dXJuIHRoaXMuX2dldFVwZGF0ZWRPcmJpdFN0YXRlKHtcbiAgICAgIGxvb2tBdDogbmV3TG9va0F0LFxuICAgICAgem9vbTogbmV3Wm9vbVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuZCB6b29taW5nXG4gICAqIE11c3QgY2FsbCBpZiBgem9vbVN0YXJ0KClgIHdhcyBjYWxsZWRcbiAgICovXG4gIHpvb21FbmQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFVwZGF0ZWRPcmJpdFN0YXRlKHtcbiAgICAgIHN0YXJ0Wm9vbVBvczogbnVsbFxuICAgIH0pO1xuICB9XG5cbiAgLyogUHJpdmF0ZSBtZXRob2RzICovXG5cbiAgX2dldFVwZGF0ZWRPcmJpdFN0YXRlKG5ld1Byb3BzKSB7XG4gICAgLy8gVXBkYXRlIF92aWV3cG9ydFByb3BzXG4gICAgcmV0dXJuIG5ldyBPcmJpdFN0YXRlKE9iamVjdC5hc3NpZ24oe30sIHRoaXMuX3ZpZXdwb3J0UHJvcHMsIHRoaXMuX2ludGVyYWN0aXZlU3RhdGUsIG5ld1Byb3BzKSk7XG4gIH1cblxuICAvLyBBcHBseSBhbnkgY29uc3RyYWludHMgKG1hdGhlbWF0aWNhbCBvciBkZWZpbmVkIGJ5IF92aWV3cG9ydFByb3BzKSB0byBtYXAgc3RhdGVcbiAgX2FwcGx5Q29uc3RyYWludHMocHJvcHMpIHtcbiAgICAvLyBFbnN1cmUgem9vbSBpcyB3aXRoaW4gc3BlY2lmaWVkIHJhbmdlXG4gICAgY29uc3Qge21heFpvb20sIG1pblpvb20sIHpvb219ID0gcHJvcHM7XG4gICAgcHJvcHMuem9vbSA9IHpvb20gPiBtYXhab29tID8gbWF4Wm9vbSA6IHpvb207XG4gICAgcHJvcHMuem9vbSA9IHpvb20gPCBtaW5ab29tID8gbWluWm9vbSA6IHpvb207XG5cbiAgICByZXR1cm4gcHJvcHM7XG4gIH1cbn1cbiJdfQ==