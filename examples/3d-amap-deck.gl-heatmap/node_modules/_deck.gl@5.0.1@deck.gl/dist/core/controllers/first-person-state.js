'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _viewState = require('./view-state');

var _viewState2 = _interopRequireDefault(_viewState);

var _math = require('math.gl');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MOVEMENT_SPEED = 1; // 1 meter per keyboard click
var ROTATION_STEP_DEGREES = 2;

/* Helpers */

// Constrain number between bounds
function clamp(x, min, max) {
  return x < min ? min : x > max ? max : x;
}

function ensureFinite(value, fallbackValue) {
  return Number.isFinite(value) ? value : fallbackValue;
}

var FirstPersonState = function (_ViewState) {
  _inherits(FirstPersonState, _ViewState);

  function FirstPersonState(_ref) {
    var width = _ref.width,
        height = _ref.height,
        position = _ref.position,
        bearing = _ref.bearing,
        pitch = _ref.pitch,
        longitude = _ref.longitude,
        latitude = _ref.latitude,
        zoom = _ref.zoom,
        _ref$syncBearing = _ref.syncBearing,
        syncBearing = _ref$syncBearing === undefined ? true : _ref$syncBearing,
        bounds = _ref.bounds,
        startPanEventPosition = _ref.startPanEventPosition,
        startPanPosition = _ref.startPanPosition,
        startRotateCenter = _ref.startRotateCenter,
        startRotateViewport = _ref.startRotateViewport,
        startZoomPos = _ref.startZoomPos,
        startZoom = _ref.startZoom;

    _classCallCheck(this, FirstPersonState);

    var _this = _possibleConstructorReturn(this, (FirstPersonState.__proto__ || Object.getPrototypeOf(FirstPersonState)).call(this, {
      width: width,
      height: height,
      position: position,
      bearing: bearing,
      pitch: pitch,
      longitude: longitude,
      latitude: latitude,
      zoom: zoom
    }));

    _this._interactiveState = {
      startPanEventPosition: startPanEventPosition,
      startPanPosition: startPanPosition,
      startRotateCenter: startRotateCenter,
      startRotateViewport: startRotateViewport,
      startZoomPos: startZoomPos,
      startZoom: startZoom
    };
    return _this;
  }

  /* Public API */

  _createClass(FirstPersonState, [{
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
      var _viewportProps = this._viewportProps,
          translationX = _viewportProps.translationX,
          translationY = _viewportProps.translationY;


      return this._getUpdatedState({
        startPanPosition: [translationX, translationY],
        startPanEventPosition: pos
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

      var startPanEventPosition = this._interactiveState.startPanEventPosition || startPos;
      (0, _assert2.default)(startPanEventPosition, '`startPanEventPosition` props is required');

      var _ref4 = this._interactiveState.startPanPosition || [],
          _ref5 = _slicedToArray(_ref4, 2),
          translationX = _ref5[0],
          translationY = _ref5[1];

      translationX = ensureFinite(translationX, this._viewportProps.translationX);
      translationY = ensureFinite(translationY, this._viewportProps.translationY);

      var deltaX = pos[0] - startPanEventPosition[0];
      var deltaY = pos[1] - startPanEventPosition[1];

      return this._getUpdatedState({
        translationX: translationX + deltaX,
        translationY: translationY - deltaY
      });
    }

    /**
     * End panning
     * Must call if `panStart()` was called
     */

  }, {
    key: 'panEnd',
    value: function panEnd() {
      return this._getUpdatedState({
        startPanPosition: null,
        startPanPos: null
      });
    }

    /**
     * Start rotating
     * @param {[Number, Number]} pos - position on screen where the pointer grabs
     */

  }, {
    key: 'rotateStart',
    value: function rotateStart(_ref6) {
      var pos = _ref6.pos;

      return this._getUpdatedState({
        startRotateCenter: this._viewportProps.position,
        startRotateViewport: this._viewportProps
      });
    }

    /**
     * Rotate
     * @param {[Number, Number]} pos - position on screen where the pointer is
     */

  }, {
    key: 'rotate',
    value: function rotate(_ref7) {
      var deltaScaleX = _ref7.deltaScaleX,
          deltaScaleY = _ref7.deltaScaleY;
      var _viewportProps2 = this._viewportProps,
          bearing = _viewportProps2.bearing,
          pitch = _viewportProps2.pitch;


      return this._getUpdatedState({
        bearing: bearing + deltaScaleX * 10,
        pitch: pitch - deltaScaleY * 10
      });
    }

    /**
     * End rotating
     * Must call if `rotateStart()` was called
     */

  }, {
    key: 'rotateEnd',
    value: function rotateEnd() {
      return this._getUpdatedState({
        startRotateCenter: null,
        startRotateViewport: null
      });
    }

    /**
     * Start zooming
     * @param {[Number, Number]} pos - position on screen where the pointer grabs
     */

  }, {
    key: 'zoomStart',
    value: function zoomStart(_ref8) {
      var pos = _ref8.pos;

      return this._getUpdatedState({
        startZoomPos: pos,
        startZoom: this._viewportProps.zoom
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
    value: function zoom(_ref9) {
      var pos = _ref9.pos,
          startPos = _ref9.startPos,
          scale = _ref9.scale;
      var _viewportProps3 = this._viewportProps,
          zoom = _viewportProps3.zoom,
          minZoom = _viewportProps3.minZoom,
          maxZoom = _viewportProps3.maxZoom,
          width = _viewportProps3.width,
          height = _viewportProps3.height,
          translationX = _viewportProps3.translationX,
          translationY = _viewportProps3.translationY;


      var startZoomPos = this._interactiveState.startZoomPos || startPos || pos;

      var newZoom = clamp(zoom * scale, minZoom, maxZoom);
      var deltaX = pos[0] - startZoomPos[0];
      var deltaY = pos[1] - startZoomPos[1];

      // Zoom around the center position
      var cx = startZoomPos[0] - width / 2;
      var cy = height / 2 - startZoomPos[1];
      /* eslint-disable no-unused-vars */
      var newTranslationX = cx - (cx - translationX) * newZoom / zoom + deltaX;
      var newTranslationY = cy - (cy - translationY) * newZoom / zoom - deltaY;
      /* eslint-enable no-unused-vars */

      // return this._getUpdatedState({
      //   position
      //   translationX: newTranslationX,
      //   translationY: newTranslationY
      // });

      // TODO HACK
      return newZoom / zoom < 1 ? this.moveBackward() : this.moveForward();
    }

    /**
     * End zooming
     * Must call if `zoomStart()` was called
     */

  }, {
    key: 'zoomEnd',
    value: function zoomEnd() {
      return this._getUpdatedState({
        startZoomPos: null,
        startZoom: null
      });
    }
  }, {
    key: 'moveLeft',
    value: function moveLeft() {
      var bearing = this._viewportProps.bearing;

      var newBearing = bearing - ROTATION_STEP_DEGREES;
      return this._getUpdatedState({
        bearing: newBearing
      });
    }
  }, {
    key: 'moveRight',
    value: function moveRight() {
      var bearing = this._viewportProps.bearing;

      var newBearing = bearing + ROTATION_STEP_DEGREES;
      return this._getUpdatedState({
        bearing: newBearing
      });
    }
  }, {
    key: 'moveForward',
    value: function moveForward() {
      var position = this._viewportProps.position;

      var direction = this.getDirection();
      var delta = new _math.Vector3(direction).normalize().scale(MOVEMENT_SPEED);
      return this._getUpdatedState({
        position: new _math.Vector3(position).add(delta)
      });
    }
  }, {
    key: 'moveBackward',
    value: function moveBackward() {
      var position = this._viewportProps.position;

      var direction = this.getDirection();
      var delta = new _math.Vector3(direction).normalize().scale(-MOVEMENT_SPEED);
      return this._getUpdatedState({
        position: new _math.Vector3(position).add(delta)
      });
    }
  }, {
    key: 'moveUp',
    value: function moveUp() {
      var position = this._viewportProps.position;

      var delta = [0, 0, 1];
      return this._getUpdatedState({
        position: new _math.Vector3(position).add(delta)
      });
    }
  }, {
    key: 'moveDown',
    value: function moveDown() {
      var position = this._viewportProps.position;

      var delta = position[2] >= 1 ? [0, 0, -1] : [0, 0, 0];
      return this._getUpdatedState({
        position: new _math.Vector3(position).add(delta)
      });
    }
  }, {
    key: 'zoomIn',
    value: function zoomIn() {
      return this._getUpdatedState({
        zoom: this._viewportProps.zoom + 0.2
      });
    }
  }, {
    key: 'zoomOut',
    value: function zoomOut() {
      return this._getUpdatedState({
        zoom: this._viewportProps.zoom - 0.2
      });
    }

    /* Private methods */

  }, {
    key: '_getUpdatedState',
    value: function _getUpdatedState(newProps) {
      // Update _viewportProps
      return new FirstPersonState(Object.assign({}, this._viewportProps, this._interactiveState, newProps));
    }
  }]);

  return FirstPersonState;
}(_viewState2.default);

exports.default = FirstPersonState;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL2NvbnRyb2xsZXJzL2ZpcnN0LXBlcnNvbi1zdGF0ZS5qcyJdLCJuYW1lcyI6WyJNT1ZFTUVOVF9TUEVFRCIsIlJPVEFUSU9OX1NURVBfREVHUkVFUyIsImNsYW1wIiwieCIsIm1pbiIsIm1heCIsImVuc3VyZUZpbml0ZSIsInZhbHVlIiwiZmFsbGJhY2tWYWx1ZSIsIk51bWJlciIsImlzRmluaXRlIiwiRmlyc3RQZXJzb25TdGF0ZSIsIndpZHRoIiwiaGVpZ2h0IiwicG9zaXRpb24iLCJiZWFyaW5nIiwicGl0Y2giLCJsb25naXR1ZGUiLCJsYXRpdHVkZSIsInpvb20iLCJzeW5jQmVhcmluZyIsImJvdW5kcyIsInN0YXJ0UGFuRXZlbnRQb3NpdGlvbiIsInN0YXJ0UGFuUG9zaXRpb24iLCJzdGFydFJvdGF0ZUNlbnRlciIsInN0YXJ0Um90YXRlVmlld3BvcnQiLCJzdGFydFpvb21Qb3MiLCJzdGFydFpvb20iLCJfaW50ZXJhY3RpdmVTdGF0ZSIsInBvcyIsIl92aWV3cG9ydFByb3BzIiwidHJhbnNsYXRpb25YIiwidHJhbnNsYXRpb25ZIiwiX2dldFVwZGF0ZWRTdGF0ZSIsInN0YXJ0UG9zIiwiZGVsdGFYIiwiZGVsdGFZIiwic3RhcnRQYW5Qb3MiLCJkZWx0YVNjYWxlWCIsImRlbHRhU2NhbGVZIiwic2NhbGUiLCJtaW5ab29tIiwibWF4Wm9vbSIsIm5ld1pvb20iLCJjeCIsImN5IiwibmV3VHJhbnNsYXRpb25YIiwibmV3VHJhbnNsYXRpb25ZIiwibW92ZUJhY2t3YXJkIiwibW92ZUZvcndhcmQiLCJuZXdCZWFyaW5nIiwiZGlyZWN0aW9uIiwiZ2V0RGlyZWN0aW9uIiwiZGVsdGEiLCJub3JtYWxpemUiLCJhZGQiLCJuZXdQcm9wcyIsIk9iamVjdCIsImFzc2lnbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBLElBQU1BLGlCQUFpQixDQUF2QixDLENBQTBCO0FB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LGNBQXZCLEVBQXVDLEtBQUtGLGlCQUE1QyxFQUErRDRCLFFBQS9ELENBREssQ0FBUDtBQUdEOzs7Ozs7a0JBN1FrQjdDLGdCIiwiZmlsZSI6ImZpcnN0LXBlcnNvbi1zdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3U3RhdGUgZnJvbSAnLi92aWV3LXN0YXRlJztcblxuaW1wb3J0IHtWZWN0b3IzfSBmcm9tICdtYXRoLmdsJztcbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcblxuY29uc3QgTU9WRU1FTlRfU1BFRUQgPSAxOyAvLyAxIG1ldGVyIHBlciBrZXlib2FyZCBjbGlja1xuY29uc3QgUk9UQVRJT05fU1RFUF9ERUdSRUVTID0gMjtcblxuLyogSGVscGVycyAqL1xuXG4vLyBDb25zdHJhaW4gbnVtYmVyIGJldHdlZW4gYm91bmRzXG5mdW5jdGlvbiBjbGFtcCh4LCBtaW4sIG1heCkge1xuICByZXR1cm4geCA8IG1pbiA/IG1pbiA6IHggPiBtYXggPyBtYXggOiB4O1xufVxuXG5mdW5jdGlvbiBlbnN1cmVGaW5pdGUodmFsdWUsIGZhbGxiYWNrVmFsdWUpIHtcbiAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZSh2YWx1ZSkgPyB2YWx1ZSA6IGZhbGxiYWNrVmFsdWU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZpcnN0UGVyc29uU3RhdGUgZXh0ZW5kcyBWaWV3U3RhdGUge1xuICBjb25zdHJ1Y3Rvcih7XG4gICAgLyogVmlld3BvcnQgYXJndW1lbnRzICovXG4gICAgd2lkdGgsIC8vIFdpZHRoIG9mIHZpZXdwb3J0XG4gICAgaGVpZ2h0LCAvLyBIZWlnaHQgb2Ygdmlld3BvcnRcblxuICAgIC8vIFBvc2l0aW9uIGFuZCBvcmllbnRhdGlvblxuICAgIHBvc2l0aW9uLCAvLyB0eXBpY2FsbHkgaW4gbWV0ZXJzIGZyb20gYW5jaG9yIHBvaW50XG5cbiAgICBiZWFyaW5nLCAvLyBSb3RhdGlvbiBhcm91bmQgeSBheGlzXG4gICAgcGl0Y2gsIC8vIFJvdGF0aW9uIGFyb3VuZCB4IGF4aXNcblxuICAgIC8vIEdlb3NwYXRpYWwgYW5jaG9yXG4gICAgbG9uZ2l0dWRlLFxuICAgIGxhdGl0dWRlLFxuICAgIHpvb20sXG5cbiAgICBzeW5jQmVhcmluZyA9IHRydWUsIC8vIFdoZXRoZXIgdG8gbG9jayBiZWFyaW5nIHRvIGRpcmVjdGlvblxuXG4gICAgLy8gQ29uc3RyYWludHMgLSBzaW1wbGUgbW92ZW1lbnQgbGltaXRcbiAgICAvLyBCb3VuZGluZyBib3ggb2YgdGhlIHdvcmxkLCBpbiB0aGUgc2hhcGUgb2Yge21pblgsIG1heFgsIG1pblksIG1heFksIG1pblosIG1heFp9XG4gICAgYm91bmRzLFxuXG4gICAgLyoqIEludGVyYWN0aW9uIHN0YXRlcywgcmVxdWlyZWQgdG8gY2FsY3VsYXRlIGNoYW5nZSBkdXJpbmcgdHJhbnNmb3JtICovXG4gICAgLy8gTW9kZWwgc3RhdGUgd2hlbiB0aGUgcGFuIG9wZXJhdGlvbiBmaXJzdCBzdGFydGVkXG4gICAgc3RhcnRQYW5FdmVudFBvc2l0aW9uLFxuICAgIHN0YXJ0UGFuUG9zaXRpb24sXG5cbiAgICAvLyBNb2RlbCBzdGF0ZSB3aGVuIHRoZSByb3RhdGUgb3BlcmF0aW9uIGZpcnN0IHN0YXJ0ZWRcbiAgICBzdGFydFJvdGF0ZUNlbnRlcixcbiAgICBzdGFydFJvdGF0ZVZpZXdwb3J0LFxuXG4gICAgLy8gTW9kZWwgc3RhdGUgd2hlbiB0aGUgem9vbSBvcGVyYXRpb24gZmlyc3Qgc3RhcnRlZFxuICAgIHN0YXJ0Wm9vbVBvcyxcbiAgICBzdGFydFpvb21cbiAgfSkge1xuICAgIHN1cGVyKHtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgcG9zaXRpb24sXG4gICAgICBiZWFyaW5nLFxuICAgICAgcGl0Y2gsXG4gICAgICBsb25naXR1ZGUsXG4gICAgICBsYXRpdHVkZSxcbiAgICAgIHpvb21cbiAgICB9KTtcblxuICAgIHRoaXMuX2ludGVyYWN0aXZlU3RhdGUgPSB7XG4gICAgICBzdGFydFBhbkV2ZW50UG9zaXRpb24sXG4gICAgICBzdGFydFBhblBvc2l0aW9uLFxuICAgICAgc3RhcnRSb3RhdGVDZW50ZXIsXG4gICAgICBzdGFydFJvdGF0ZVZpZXdwb3J0LFxuICAgICAgc3RhcnRab29tUG9zLFxuICAgICAgc3RhcnRab29tXG4gICAgfTtcbiAgfVxuXG4gIC8qIFB1YmxpYyBBUEkgKi9cblxuICBnZXRJbnRlcmFjdGl2ZVN0YXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9pbnRlcmFjdGl2ZVN0YXRlO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHBhbm5pbmdcbiAgICogQHBhcmFtIHtbTnVtYmVyLCBOdW1iZXJdfSBwb3MgLSBwb3NpdGlvbiBvbiBzY3JlZW4gd2hlcmUgdGhlIHBvaW50ZXIgZ3JhYnNcbiAgICovXG4gIHBhblN0YXJ0KHtwb3N9KSB7XG4gICAgY29uc3Qge3RyYW5zbGF0aW9uWCwgdHJhbnNsYXRpb25ZfSA9IHRoaXMuX3ZpZXdwb3J0UHJvcHM7XG5cbiAgICByZXR1cm4gdGhpcy5fZ2V0VXBkYXRlZFN0YXRlKHtcbiAgICAgIHN0YXJ0UGFuUG9zaXRpb246IFt0cmFuc2xhdGlvblgsIHRyYW5zbGF0aW9uWV0sXG4gICAgICBzdGFydFBhbkV2ZW50UG9zaXRpb246IHBvc1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhblxuICAgKiBAcGFyYW0ge1tOdW1iZXIsIE51bWJlcl19IHBvcyAtIHBvc2l0aW9uIG9uIHNjcmVlbiB3aGVyZSB0aGUgcG9pbnRlciBpc1xuICAgKi9cbiAgcGFuKHtwb3MsIHN0YXJ0UG9zfSkge1xuICAgIGNvbnN0IHN0YXJ0UGFuRXZlbnRQb3NpdGlvbiA9IHRoaXMuX2ludGVyYWN0aXZlU3RhdGUuc3RhcnRQYW5FdmVudFBvc2l0aW9uIHx8IHN0YXJ0UG9zO1xuICAgIGFzc2VydChzdGFydFBhbkV2ZW50UG9zaXRpb24sICdgc3RhcnRQYW5FdmVudFBvc2l0aW9uYCBwcm9wcyBpcyByZXF1aXJlZCcpO1xuXG4gICAgbGV0IFt0cmFuc2xhdGlvblgsIHRyYW5zbGF0aW9uWV0gPSB0aGlzLl9pbnRlcmFjdGl2ZVN0YXRlLnN0YXJ0UGFuUG9zaXRpb24gfHwgW107XG4gICAgdHJhbnNsYXRpb25YID0gZW5zdXJlRmluaXRlKHRyYW5zbGF0aW9uWCwgdGhpcy5fdmlld3BvcnRQcm9wcy50cmFuc2xhdGlvblgpO1xuICAgIHRyYW5zbGF0aW9uWSA9IGVuc3VyZUZpbml0ZSh0cmFuc2xhdGlvblksIHRoaXMuX3ZpZXdwb3J0UHJvcHMudHJhbnNsYXRpb25ZKTtcblxuICAgIGNvbnN0IGRlbHRhWCA9IHBvc1swXSAtIHN0YXJ0UGFuRXZlbnRQb3NpdGlvblswXTtcbiAgICBjb25zdCBkZWx0YVkgPSBwb3NbMV0gLSBzdGFydFBhbkV2ZW50UG9zaXRpb25bMV07XG5cbiAgICByZXR1cm4gdGhpcy5fZ2V0VXBkYXRlZFN0YXRlKHtcbiAgICAgIHRyYW5zbGF0aW9uWDogdHJhbnNsYXRpb25YICsgZGVsdGFYLFxuICAgICAgdHJhbnNsYXRpb25ZOiB0cmFuc2xhdGlvblkgLSBkZWx0YVlcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbmQgcGFubmluZ1xuICAgKiBNdXN0IGNhbGwgaWYgYHBhblN0YXJ0KClgIHdhcyBjYWxsZWRcbiAgICovXG4gIHBhbkVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0VXBkYXRlZFN0YXRlKHtcbiAgICAgIHN0YXJ0UGFuUG9zaXRpb246IG51bGwsXG4gICAgICBzdGFydFBhblBvczogbnVsbFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHJvdGF0aW5nXG4gICAqIEBwYXJhbSB7W051bWJlciwgTnVtYmVyXX0gcG9zIC0gcG9zaXRpb24gb24gc2NyZWVuIHdoZXJlIHRoZSBwb2ludGVyIGdyYWJzXG4gICAqL1xuICByb3RhdGVTdGFydCh7cG9zfSkge1xuICAgIHJldHVybiB0aGlzLl9nZXRVcGRhdGVkU3RhdGUoe1xuICAgICAgc3RhcnRSb3RhdGVDZW50ZXI6IHRoaXMuX3ZpZXdwb3J0UHJvcHMucG9zaXRpb24sXG4gICAgICBzdGFydFJvdGF0ZVZpZXdwb3J0OiB0aGlzLl92aWV3cG9ydFByb3BzXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUm90YXRlXG4gICAqIEBwYXJhbSB7W051bWJlciwgTnVtYmVyXX0gcG9zIC0gcG9zaXRpb24gb24gc2NyZWVuIHdoZXJlIHRoZSBwb2ludGVyIGlzXG4gICAqL1xuICByb3RhdGUoe2RlbHRhU2NhbGVYLCBkZWx0YVNjYWxlWX0pIHtcbiAgICBjb25zdCB7YmVhcmluZywgcGl0Y2h9ID0gdGhpcy5fdmlld3BvcnRQcm9wcztcblxuICAgIHJldHVybiB0aGlzLl9nZXRVcGRhdGVkU3RhdGUoe1xuICAgICAgYmVhcmluZzogYmVhcmluZyArIGRlbHRhU2NhbGVYICogMTAsXG4gICAgICBwaXRjaDogcGl0Y2ggLSBkZWx0YVNjYWxlWSAqIDEwXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRW5kIHJvdGF0aW5nXG4gICAqIE11c3QgY2FsbCBpZiBgcm90YXRlU3RhcnQoKWAgd2FzIGNhbGxlZFxuICAgKi9cbiAgcm90YXRlRW5kKCkge1xuICAgIHJldHVybiB0aGlzLl9nZXRVcGRhdGVkU3RhdGUoe1xuICAgICAgc3RhcnRSb3RhdGVDZW50ZXI6IG51bGwsXG4gICAgICBzdGFydFJvdGF0ZVZpZXdwb3J0OiBudWxsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgem9vbWluZ1xuICAgKiBAcGFyYW0ge1tOdW1iZXIsIE51bWJlcl19IHBvcyAtIHBvc2l0aW9uIG9uIHNjcmVlbiB3aGVyZSB0aGUgcG9pbnRlciBncmFic1xuICAgKi9cbiAgem9vbVN0YXJ0KHtwb3N9KSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFVwZGF0ZWRTdGF0ZSh7XG4gICAgICBzdGFydFpvb21Qb3M6IHBvcyxcbiAgICAgIHN0YXJ0Wm9vbTogdGhpcy5fdmlld3BvcnRQcm9wcy56b29tXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogWm9vbVxuICAgKiBAcGFyYW0ge1tOdW1iZXIsIE51bWJlcl19IHBvcyAtIHBvc2l0aW9uIG9uIHNjcmVlbiB3aGVyZSB0aGUgY3VycmVudCBjZW50ZXIgaXNcbiAgICogQHBhcmFtIHtbTnVtYmVyLCBOdW1iZXJdfSBzdGFydFBvcyAtIHRoZSBjZW50ZXIgcG9zaXRpb24gYXRcbiAgICogICB0aGUgc3RhcnQgb2YgdGhlIG9wZXJhdGlvbi4gTXVzdCBiZSBzdXBwbGllZCBvZiBgem9vbVN0YXJ0KClgIHdhcyBub3QgY2FsbGVkXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzY2FsZSAtIGEgbnVtYmVyIGJldHdlZW4gWzAsIDFdIHNwZWNpZnlpbmcgdGhlIGFjY3VtdWxhdGVkXG4gICAqICAgcmVsYXRpdmUgc2NhbGUuXG4gICAqL1xuICB6b29tKHtwb3MsIHN0YXJ0UG9zLCBzY2FsZX0pIHtcbiAgICBjb25zdCB7em9vbSwgbWluWm9vbSwgbWF4Wm9vbSwgd2lkdGgsIGhlaWdodCwgdHJhbnNsYXRpb25YLCB0cmFuc2xhdGlvbll9ID0gdGhpcy5fdmlld3BvcnRQcm9wcztcblxuICAgIGNvbnN0IHN0YXJ0Wm9vbVBvcyA9IHRoaXMuX2ludGVyYWN0aXZlU3RhdGUuc3RhcnRab29tUG9zIHx8IHN0YXJ0UG9zIHx8IHBvcztcblxuICAgIGNvbnN0IG5ld1pvb20gPSBjbGFtcCh6b29tICogc2NhbGUsIG1pblpvb20sIG1heFpvb20pO1xuICAgIGNvbnN0IGRlbHRhWCA9IHBvc1swXSAtIHN0YXJ0Wm9vbVBvc1swXTtcbiAgICBjb25zdCBkZWx0YVkgPSBwb3NbMV0gLSBzdGFydFpvb21Qb3NbMV07XG5cbiAgICAvLyBab29tIGFyb3VuZCB0aGUgY2VudGVyIHBvc2l0aW9uXG4gICAgY29uc3QgY3ggPSBzdGFydFpvb21Qb3NbMF0gLSB3aWR0aCAvIDI7XG4gICAgY29uc3QgY3kgPSBoZWlnaHQgLyAyIC0gc3RhcnRab29tUG9zWzFdO1xuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG4gICAgY29uc3QgbmV3VHJhbnNsYXRpb25YID0gY3ggLSAoY3ggLSB0cmFuc2xhdGlvblgpICogbmV3Wm9vbSAvIHpvb20gKyBkZWx0YVg7XG4gICAgY29uc3QgbmV3VHJhbnNsYXRpb25ZID0gY3kgLSAoY3kgLSB0cmFuc2xhdGlvblkpICogbmV3Wm9vbSAvIHpvb20gLSBkZWx0YVk7XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xuXG4gICAgLy8gcmV0dXJuIHRoaXMuX2dldFVwZGF0ZWRTdGF0ZSh7XG4gICAgLy8gICBwb3NpdGlvblxuICAgIC8vICAgdHJhbnNsYXRpb25YOiBuZXdUcmFuc2xhdGlvblgsXG4gICAgLy8gICB0cmFuc2xhdGlvblk6IG5ld1RyYW5zbGF0aW9uWVxuICAgIC8vIH0pO1xuXG4gICAgLy8gVE9ETyBIQUNLXG4gICAgcmV0dXJuIG5ld1pvb20gLyB6b29tIDwgMSA/IHRoaXMubW92ZUJhY2t3YXJkKCkgOiB0aGlzLm1vdmVGb3J3YXJkKCk7XG4gIH1cblxuICAvKipcbiAgICogRW5kIHpvb21pbmdcbiAgICogTXVzdCBjYWxsIGlmIGB6b29tU3RhcnQoKWAgd2FzIGNhbGxlZFxuICAgKi9cbiAgem9vbUVuZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZ2V0VXBkYXRlZFN0YXRlKHtcbiAgICAgIHN0YXJ0Wm9vbVBvczogbnVsbCxcbiAgICAgIHN0YXJ0Wm9vbTogbnVsbFxuICAgIH0pO1xuICB9XG5cbiAgbW92ZUxlZnQoKSB7XG4gICAgY29uc3Qge2JlYXJpbmd9ID0gdGhpcy5fdmlld3BvcnRQcm9wcztcbiAgICBjb25zdCBuZXdCZWFyaW5nID0gYmVhcmluZyAtIFJPVEFUSU9OX1NURVBfREVHUkVFUztcbiAgICByZXR1cm4gdGhpcy5fZ2V0VXBkYXRlZFN0YXRlKHtcbiAgICAgIGJlYXJpbmc6IG5ld0JlYXJpbmdcbiAgICB9KTtcbiAgfVxuXG4gIG1vdmVSaWdodCgpIHtcbiAgICBjb25zdCB7YmVhcmluZ30gPSB0aGlzLl92aWV3cG9ydFByb3BzO1xuICAgIGNvbnN0IG5ld0JlYXJpbmcgPSBiZWFyaW5nICsgUk9UQVRJT05fU1RFUF9ERUdSRUVTO1xuICAgIHJldHVybiB0aGlzLl9nZXRVcGRhdGVkU3RhdGUoe1xuICAgICAgYmVhcmluZzogbmV3QmVhcmluZ1xuICAgIH0pO1xuICB9XG5cbiAgbW92ZUZvcndhcmQoKSB7XG4gICAgY29uc3Qge3Bvc2l0aW9ufSA9IHRoaXMuX3ZpZXdwb3J0UHJvcHM7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy5nZXREaXJlY3Rpb24oKTtcbiAgICBjb25zdCBkZWx0YSA9IG5ldyBWZWN0b3IzKGRpcmVjdGlvbikubm9ybWFsaXplKCkuc2NhbGUoTU9WRU1FTlRfU1BFRUQpO1xuICAgIHJldHVybiB0aGlzLl9nZXRVcGRhdGVkU3RhdGUoe1xuICAgICAgcG9zaXRpb246IG5ldyBWZWN0b3IzKHBvc2l0aW9uKS5hZGQoZGVsdGEpXG4gICAgfSk7XG4gIH1cblxuICBtb3ZlQmFja3dhcmQoKSB7XG4gICAgY29uc3Qge3Bvc2l0aW9ufSA9IHRoaXMuX3ZpZXdwb3J0UHJvcHM7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy5nZXREaXJlY3Rpb24oKTtcbiAgICBjb25zdCBkZWx0YSA9IG5ldyBWZWN0b3IzKGRpcmVjdGlvbikubm9ybWFsaXplKCkuc2NhbGUoLU1PVkVNRU5UX1NQRUVEKTtcbiAgICByZXR1cm4gdGhpcy5fZ2V0VXBkYXRlZFN0YXRlKHtcbiAgICAgIHBvc2l0aW9uOiBuZXcgVmVjdG9yMyhwb3NpdGlvbikuYWRkKGRlbHRhKVxuICAgIH0pO1xuICB9XG5cbiAgbW92ZVVwKCkge1xuICAgIGNvbnN0IHtwb3NpdGlvbn0gPSB0aGlzLl92aWV3cG9ydFByb3BzO1xuICAgIGNvbnN0IGRlbHRhID0gWzAsIDAsIDFdO1xuICAgIHJldHVybiB0aGlzLl9nZXRVcGRhdGVkU3RhdGUoe1xuICAgICAgcG9zaXRpb246IG5ldyBWZWN0b3IzKHBvc2l0aW9uKS5hZGQoZGVsdGEpXG4gICAgfSk7XG4gIH1cblxuICBtb3ZlRG93bigpIHtcbiAgICBjb25zdCB7cG9zaXRpb259ID0gdGhpcy5fdmlld3BvcnRQcm9wcztcbiAgICBjb25zdCBkZWx0YSA9IHBvc2l0aW9uWzJdID49IDEgPyBbMCwgMCwgLTFdIDogWzAsIDAsIDBdO1xuICAgIHJldHVybiB0aGlzLl9nZXRVcGRhdGVkU3RhdGUoe1xuICAgICAgcG9zaXRpb246IG5ldyBWZWN0b3IzKHBvc2l0aW9uKS5hZGQoZGVsdGEpXG4gICAgfSk7XG4gIH1cblxuICB6b29tSW4oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFVwZGF0ZWRTdGF0ZSh7XG4gICAgICB6b29tOiB0aGlzLl92aWV3cG9ydFByb3BzLnpvb20gKyAwLjJcbiAgICB9KTtcbiAgfVxuXG4gIHpvb21PdXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFVwZGF0ZWRTdGF0ZSh7XG4gICAgICB6b29tOiB0aGlzLl92aWV3cG9ydFByb3BzLnpvb20gLSAwLjJcbiAgICB9KTtcbiAgfVxuXG4gIC8qIFByaXZhdGUgbWV0aG9kcyAqL1xuXG4gIF9nZXRVcGRhdGVkU3RhdGUobmV3UHJvcHMpIHtcbiAgICAvLyBVcGRhdGUgX3ZpZXdwb3J0UHJvcHNcbiAgICByZXR1cm4gbmV3IEZpcnN0UGVyc29uU3RhdGUoXG4gICAgICBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl92aWV3cG9ydFByb3BzLCB0aGlzLl9pbnRlcmFjdGl2ZVN0YXRlLCBuZXdQcm9wcylcbiAgICApO1xuICB9XG59XG4iXX0=