'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _mjolnir = require('mjolnir.js');

var _mapControls = require('../controllers/map-controls');

var _mapControls2 = _interopRequireDefault(_mapControls);

var _mapState = require('../controllers/map-state');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PREFIX = '-webkit-';

var CURSOR = {
  GRABBING: PREFIX + 'grabbing',
  GRAB: PREFIX + 'grab',
  POINTER: 'pointer'
};

var propTypes = {
  width: _propTypes2.default.number.isRequired /** The width of the map. */
  , height: _propTypes2.default.number.isRequired /** The height of the map. */
  , longitude: _propTypes2.default.number.isRequired /** The longitude of the center of the map. */
  , latitude: _propTypes2.default.number.isRequired /** The latitude of the center of the map. */
  , zoom: _propTypes2.default.number.isRequired /** The tile zoom level of the map. */
  , bearing: _propTypes2.default.number /** Specify the bearing of the viewport */
  , pitch: _propTypes2.default.number /** Specify the pitch of the viewport */
  , // Note: Non-public API, see https://github.com/mapbox/mapbox-gl-js/issues/1137
  altitude: _propTypes2.default.number /** Altitude of the viewport camera. Default 1.5 "screen heights" */

  , /** Viewport constraints */
  maxZoom: _propTypes2.default.number, // Max zoom level
  minZoom: _propTypes2.default.number, // Min zoom level
  maxPitch: _propTypes2.default.number, // Max pitch in degrees
  minPitch: _propTypes2.default.number, // Min pitch in degrees

  /**
   * `onViewportChange` callback is fired when the user interacted with the
   * map. The object passed to the callback contains viewport properties
   * such as `longitude`, `latitude`, `zoom` etc.
   */
  onViewportChange: _propTypes2.default.func,

  /** Enables control event handling */
  scrollZoom: _propTypes2.default.bool, // Scroll to zoom
  dragPan: _propTypes2.default.bool, // Drag to pan
  dragRotate: _propTypes2.default.bool, // Drag to rotate
  doubleClickZoom: _propTypes2.default.bool, // Double click to zoom
  touchZoomRotate: _propTypes2.default.bool, // Pinch to zoom / rotate

  /** Accessor that returns a cursor style to show interactive state */
  getCursor: _propTypes2.default.func,

  // A map control instance to replace the default map controls
  // The object must expose one property: `events` as an array of subscribed
  // event names; and two methods: `setState(state)` and `handle(event)`
  controls: _propTypes2.default.shape({
    events: _propTypes2.default.arrayOf(_propTypes2.default.string),
    handleEvent: _propTypes2.default.func
  })
};

var getDefaultCursor = function getDefaultCursor(_ref) {
  var isDragging = _ref.isDragging;
  return isDragging ? CURSOR.GRABBING : CURSOR.GRAB;
};

var defaultProps = Object.assign({}, _mapState.MAPBOX_LIMITS, {
  onViewportChange: null,
  scrollZoom: true,
  dragPan: true,
  dragRotate: true,
  doubleClickZoom: true,
  touchZoomRotate: true,
  getCursor: getDefaultCursor
});

var MapControllerJS = function () {
  function MapControllerJS(props) {
    _classCallCheck(this, MapControllerJS);

    props = Object.assign({}, defaultProps, props);

    this.props = props;
    this.state = {
      isDragging: false // Whether the cursor is down
    };

    this.canvas = props.canvas;

    var eventManager = new _mjolnir.EventManager(this.canvas);

    this._eventManager = eventManager;

    // If props.controls is not provided, fallback to default MapControls instance
    // Cannot use defaultProps here because it needs to be per map instance
    this._controls = this.props.controls || new _mapControls2.default();
    this._controls.setOptions(Object.assign({}, this.props, {
      onStateChange: this._onInteractiveStateChange.bind(this),
      eventManager: eventManager
    }));
  }

  _createClass(MapControllerJS, [{
    key: 'setProps',
    value: function setProps(props) {
      props = Object.assign({}, this.props, props);
      this.props = props;

      this._controls.setOptions(props);
    }
  }, {
    key: 'finalize',
    value: function finalize() {
      this._eventManager.destroy();
    }
  }, {
    key: '_onInteractiveStateChange',
    value: function _onInteractiveStateChange(_ref2) {
      var _ref2$isDragging = _ref2.isDragging,
          isDragging = _ref2$isDragging === undefined ? false : _ref2$isDragging;

      if (isDragging !== this.state.isDragging) {
        this.state.isDragging = isDragging;
        var getCursor = this.props.getCursor;

        this.canvas.style.cursor = getCursor(this.state);
      }
    }
  }]);

  return MapControllerJS;
}();

exports.default = MapControllerJS;


MapControllerJS.displayName = 'MapController';
MapControllerJS.propTypes = propTypes;
MapControllerJS.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3B1cmUtanMvbWFwLWNvbnRyb2xsZXItanMuanMiXSwibmFtZXMiOlsiUFJFRklYIiwiQ1VSU09SIiwiR1JBQkJJTkciLCJHUkFCIiwiUE9JTlRFUiIsInByb3BUeXBlcyIsIndpZHRoIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsImhlaWdodCIsImxvbmdpdHVkZSIsImxhdGl0dWRlIiwiem9vbSIsImJlYXJpbmciLCJwaXRjaCIsImFsdGl0dWRlIiwibWF4Wm9vbSIsIm1pblpvb20iLCJtYXhQaXRjaCIsIm1pblBpdGNoIiwib25WaWV3cG9ydENoYW5nZSIsImZ1bmMiLCJzY3JvbGxab29tIiwiYm9vbCIsImRyYWdQYW4iLCJkcmFnUm90YXRlIiwiZG91YmxlQ2xpY2tab29tIiwidG91Y2hab29tUm90YXRlIiwiZ2V0Q3Vyc29yIiwiY29udHJvbHMiLCJzaGFwZSIsImV2ZW50cyIsImFycmF5T2YiLCJzdHJpbmciLCJoYW5kbGVFdmVudCIsImdldERlZmF1bHRDdXJzb3IiLCJpc0RyYWdnaW5nIiwiZGVmYXVsdFByb3BzIiwiT2JqZWN0IiwiYXNzaWduIiwiTWFwQ29udHJvbGxlckpTIiwicHJvcHMiLCJzdGF0ZSIsImNhbnZhcyIsImV2ZW50TWFuYWdlciIsIl9ldmVudE1hbmFnZXIiLCJfY29udHJvbHMiLCJzZXRPcHRpb25zIiwib25TdGF0ZUNoYW5nZSIsIl9vbkludGVyYWN0aXZlU3RhdGVDaGFuZ2UiLCJiaW5kIiwiZGVzdHJveSIsInN0eWxlIiwiY3Vyc29yIiwiZGlzcGxheU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFFQTs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxTQUFTLFVBQWY7O0FBRUEsSUFBTUMsU0FBUztBQUNiQyxZQUFhRixNQUFiLGFBRGE7QUFFYkcsUUFBU0gsTUFBVCxTQUZhO0FBR2JJLFdBQVM7QUFISSxDQUFmOztBQU1BLElBQU1DLFlBQVk7QUFDaEJDLFNBQU8s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LENBQWVDLFVBQWYsQ0FBMEJOLEtBQTFCO0FBQ0Q7OzsrQkFFVTtBQUNULFdBQUtJLGFBQUwsQ0FBbUJNLE9BQW5CO0FBQ0Q7OztxREFFK0M7QUFBQSxtQ0FBckJmLFVBQXFCO0FBQUEsVUFBckJBLFVBQXFCLG9DQUFSLEtBQVE7O0FBQzlDLFVBQUlBLGVBQWUsS0FBS00sS0FBTCxDQUFXTixVQUE5QixFQUEwQztBQUN4QyxhQUFLTSxLQUFMLENBQVdOLFVBQVgsR0FBd0JBLFVBQXhCO0FBRHdDLFlBRWpDUixTQUZpQyxHQUVwQixLQUFLYSxLQUZlLENBRWpDYixTQUZpQzs7QUFHeEMsYUFBS2UsTUFBTCxDQUFZUyxLQUFaLENBQWtCQyxNQUFsQixHQUEyQnpCLFVBQVUsS0FBS2MsS0FBZixDQUEzQjtBQUNEO0FBQ0Y7Ozs7OztrQkEzQ2tCRixlOzs7QUE4Q3JCQSxnQkFBZ0JjLFdBQWhCLEdBQThCLGVBQTlCO0FBQ0FkLGdCQUFnQm5DLFNBQWhCLEdBQTRCQSxTQUE1QjtBQUNBbUMsZ0JBQWdCSCxZQUFoQixHQUErQkEsWUFBL0IiLCJmaWxlIjoibWFwLWNvbnRyb2xsZXItanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuXG5pbXBvcnQge0V2ZW50TWFuYWdlcn0gZnJvbSAnbWpvbG5pci5qcyc7XG5pbXBvcnQgTWFwQ29udHJvbHMgZnJvbSAnLi4vY29udHJvbGxlcnMvbWFwLWNvbnRyb2xzJztcbmltcG9ydCB7TUFQQk9YX0xJTUlUU30gZnJvbSAnLi4vY29udHJvbGxlcnMvbWFwLXN0YXRlJztcblxuY29uc3QgUFJFRklYID0gJy13ZWJraXQtJztcblxuY29uc3QgQ1VSU09SID0ge1xuICBHUkFCQklORzogYCR7UFJFRklYfWdyYWJiaW5nYCxcbiAgR1JBQjogYCR7UFJFRklYfWdyYWJgLFxuICBQT0lOVEVSOiAncG9pbnRlcidcbn07XG5cbmNvbnN0IHByb3BUeXBlcyA9IHtcbiAgd2lkdGg6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCAvKiogVGhlIHdpZHRoIG9mIHRoZSBtYXAuICovLFxuICBoZWlnaHQ6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCAvKiogVGhlIGhlaWdodCBvZiB0aGUgbWFwLiAqLyxcbiAgbG9uZ2l0dWRlOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQgLyoqIFRoZSBsb25naXR1ZGUgb2YgdGhlIGNlbnRlciBvZiB0aGUgbWFwLiAqLyxcbiAgbGF0aXR1ZGU6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCAvKiogVGhlIGxhdGl0dWRlIG9mIHRoZSBjZW50ZXIgb2YgdGhlIG1hcC4gKi8sXG4gIHpvb206IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCAvKiogVGhlIHRpbGUgem9vbSBsZXZlbCBvZiB0aGUgbWFwLiAqLyxcbiAgYmVhcmluZzogUHJvcFR5cGVzLm51bWJlciAvKiogU3BlY2lmeSB0aGUgYmVhcmluZyBvZiB0aGUgdmlld3BvcnQgKi8sXG4gIHBpdGNoOiBQcm9wVHlwZXMubnVtYmVyIC8qKiBTcGVjaWZ5IHRoZSBwaXRjaCBvZiB0aGUgdmlld3BvcnQgKi8sXG4gIC8vIE5vdGU6IE5vbi1wdWJsaWMgQVBJLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21hcGJveC9tYXBib3gtZ2wtanMvaXNzdWVzLzExMzdcbiAgYWx0aXR1ZGU6IFByb3BUeXBlcy5udW1iZXIgLyoqIEFsdGl0dWRlIG9mIHRoZSB2aWV3cG9ydCBjYW1lcmEuIERlZmF1bHQgMS41IFwic2NyZWVuIGhlaWdodHNcIiAqLyxcblxuICAvKiogVmlld3BvcnQgY29uc3RyYWludHMgKi9cbiAgbWF4Wm9vbTogUHJvcFR5cGVzLm51bWJlciwgLy8gTWF4IHpvb20gbGV2ZWxcbiAgbWluWm9vbTogUHJvcFR5cGVzLm51bWJlciwgLy8gTWluIHpvb20gbGV2ZWxcbiAgbWF4UGl0Y2g6IFByb3BUeXBlcy5udW1iZXIsIC8vIE1heCBwaXRjaCBpbiBkZWdyZWVzXG4gIG1pblBpdGNoOiBQcm9wVHlwZXMubnVtYmVyLCAvLyBNaW4gcGl0Y2ggaW4gZGVncmVlc1xuXG4gIC8qKlxuICAgKiBgb25WaWV3cG9ydENoYW5nZWAgY2FsbGJhY2sgaXMgZmlyZWQgd2hlbiB0aGUgdXNlciBpbnRlcmFjdGVkIHdpdGggdGhlXG4gICAqIG1hcC4gVGhlIG9iamVjdCBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrIGNvbnRhaW5zIHZpZXdwb3J0IHByb3BlcnRpZXNcbiAgICogc3VjaCBhcyBgbG9uZ2l0dWRlYCwgYGxhdGl0dWRlYCwgYHpvb21gIGV0Yy5cbiAgICovXG4gIG9uVmlld3BvcnRDaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxuXG4gIC8qKiBFbmFibGVzIGNvbnRyb2wgZXZlbnQgaGFuZGxpbmcgKi9cbiAgc2Nyb2xsWm9vbTogUHJvcFR5cGVzLmJvb2wsIC8vIFNjcm9sbCB0byB6b29tXG4gIGRyYWdQYW46IFByb3BUeXBlcy5ib29sLCAvLyBEcmFnIHRvIHBhblxuICBkcmFnUm90YXRlOiBQcm9wVHlwZXMuYm9vbCwgLy8gRHJhZyB0byByb3RhdGVcbiAgZG91YmxlQ2xpY2tab29tOiBQcm9wVHlwZXMuYm9vbCwgLy8gRG91YmxlIGNsaWNrIHRvIHpvb21cbiAgdG91Y2hab29tUm90YXRlOiBQcm9wVHlwZXMuYm9vbCwgLy8gUGluY2ggdG8gem9vbSAvIHJvdGF0ZVxuXG4gIC8qKiBBY2Nlc3NvciB0aGF0IHJldHVybnMgYSBjdXJzb3Igc3R5bGUgdG8gc2hvdyBpbnRlcmFjdGl2ZSBzdGF0ZSAqL1xuICBnZXRDdXJzb3I6IFByb3BUeXBlcy5mdW5jLFxuXG4gIC8vIEEgbWFwIGNvbnRyb2wgaW5zdGFuY2UgdG8gcmVwbGFjZSB0aGUgZGVmYXVsdCBtYXAgY29udHJvbHNcbiAgLy8gVGhlIG9iamVjdCBtdXN0IGV4cG9zZSBvbmUgcHJvcGVydHk6IGBldmVudHNgIGFzIGFuIGFycmF5IG9mIHN1YnNjcmliZWRcbiAgLy8gZXZlbnQgbmFtZXM7IGFuZCB0d28gbWV0aG9kczogYHNldFN0YXRlKHN0YXRlKWAgYW5kIGBoYW5kbGUoZXZlbnQpYFxuICBjb250cm9sczogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICBldmVudHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zdHJpbmcpLFxuICAgIGhhbmRsZUV2ZW50OiBQcm9wVHlwZXMuZnVuY1xuICB9KVxufTtcblxuY29uc3QgZ2V0RGVmYXVsdEN1cnNvciA9ICh7aXNEcmFnZ2luZ30pID0+IChpc0RyYWdnaW5nID8gQ1VSU09SLkdSQUJCSU5HIDogQ1VSU09SLkdSQUIpO1xuXG5jb25zdCBkZWZhdWx0UHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBNQVBCT1hfTElNSVRTLCB7XG4gIG9uVmlld3BvcnRDaGFuZ2U6IG51bGwsXG4gIHNjcm9sbFpvb206IHRydWUsXG4gIGRyYWdQYW46IHRydWUsXG4gIGRyYWdSb3RhdGU6IHRydWUsXG4gIGRvdWJsZUNsaWNrWm9vbTogdHJ1ZSxcbiAgdG91Y2hab29tUm90YXRlOiB0cnVlLFxuICBnZXRDdXJzb3I6IGdldERlZmF1bHRDdXJzb3Jcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNYXBDb250cm9sbGVySlMge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdFByb3BzLCBwcm9wcyk7XG5cbiAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzRHJhZ2dpbmc6IGZhbHNlIC8vIFdoZXRoZXIgdGhlIGN1cnNvciBpcyBkb3duXG4gICAgfTtcblxuICAgIHRoaXMuY2FudmFzID0gcHJvcHMuY2FudmFzO1xuXG4gICAgY29uc3QgZXZlbnRNYW5hZ2VyID0gbmV3IEV2ZW50TWFuYWdlcih0aGlzLmNhbnZhcyk7XG5cbiAgICB0aGlzLl9ldmVudE1hbmFnZXIgPSBldmVudE1hbmFnZXI7XG5cbiAgICAvLyBJZiBwcm9wcy5jb250cm9scyBpcyBub3QgcHJvdmlkZWQsIGZhbGxiYWNrIHRvIGRlZmF1bHQgTWFwQ29udHJvbHMgaW5zdGFuY2VcbiAgICAvLyBDYW5ub3QgdXNlIGRlZmF1bHRQcm9wcyBoZXJlIGJlY2F1c2UgaXQgbmVlZHMgdG8gYmUgcGVyIG1hcCBpbnN0YW5jZVxuICAgIHRoaXMuX2NvbnRyb2xzID0gdGhpcy5wcm9wcy5jb250cm9scyB8fCBuZXcgTWFwQ29udHJvbHMoKTtcbiAgICB0aGlzLl9jb250cm9scy5zZXRPcHRpb25zKFxuICAgICAgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcywge1xuICAgICAgICBvblN0YXRlQ2hhbmdlOiB0aGlzLl9vbkludGVyYWN0aXZlU3RhdGVDaGFuZ2UuYmluZCh0aGlzKSxcbiAgICAgICAgZXZlbnRNYW5hZ2VyXG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBzZXRQcm9wcyhwcm9wcykge1xuICAgIHByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcywgcHJvcHMpO1xuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcblxuICAgIHRoaXMuX2NvbnRyb2xzLnNldE9wdGlvbnMocHJvcHMpO1xuICB9XG5cbiAgZmluYWxpemUoKSB7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgfVxuXG4gIF9vbkludGVyYWN0aXZlU3RhdGVDaGFuZ2Uoe2lzRHJhZ2dpbmcgPSBmYWxzZX0pIHtcbiAgICBpZiAoaXNEcmFnZ2luZyAhPT0gdGhpcy5zdGF0ZS5pc0RyYWdnaW5nKSB7XG4gICAgICB0aGlzLnN0YXRlLmlzRHJhZ2dpbmcgPSBpc0RyYWdnaW5nO1xuICAgICAgY29uc3Qge2dldEN1cnNvcn0gPSB0aGlzLnByb3BzO1xuICAgICAgdGhpcy5jYW52YXMuc3R5bGUuY3Vyc29yID0gZ2V0Q3Vyc29yKHRoaXMuc3RhdGUpO1xuICAgIH1cbiAgfVxufVxuXG5NYXBDb250cm9sbGVySlMuZGlzcGxheU5hbWUgPSAnTWFwQ29udHJvbGxlcic7XG5NYXBDb250cm9sbGVySlMucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuTWFwQ29udHJvbGxlckpTLmRlZmF1bHRQcm9wcyA9IGRlZmF1bHRQcm9wcztcbiJdfQ==