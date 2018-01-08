'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _orbitViewport = require('../viewports/orbit-viewport');

var _orbitViewport2 = _interopRequireDefault(_orbitViewport);

var _orbitState = require('../controllers/orbit-state');

var _orbitState2 = _interopRequireDefault(_orbitState);

var _viewportControls = require('../controllers/viewport-controls');

var _viewportControls2 = _interopRequireDefault(_viewportControls);

var _mjolnir = require('mjolnir.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PREFIX = '-webkit-';

var CURSOR = {
  GRABBING: PREFIX + 'grabbing',
  GRAB: PREFIX + 'grab',
  POINTER: 'pointer'
};

var propTypes = {
  /* Viewport properties */
  lookAt: _propTypes2.default.arrayOf(_propTypes2.default.number), // target position
  distance: _propTypes2.default.number, // distance from camera to the target
  rotationX: _propTypes2.default.number, // rotation around X axis
  rotationY: _propTypes2.default.number, // rotation around Y axis
  translationX: _propTypes2.default.number, // translation x in screen space
  translationY: _propTypes2.default.number, // translation y in screen space
  zoom: _propTypes2.default.number, // scale in screen space
  minZoom: _propTypes2.default.number,
  maxZoom: _propTypes2.default.number,
  fov: _propTypes2.default.number, // field of view
  near: _propTypes2.default.number,
  far: _propTypes2.default.number,
  width: _propTypes2.default.number.isRequired, // viewport width in pixels
  height: _propTypes2.default.number.isRequired, // viewport height in pixels

  /* Model properties */
  bounds: _propTypes2.default.object, // bounds in the shape of {minX, minY, minZ, maxX, maxY, maxZ}

  /* Callbacks */
  onViewportChange: _propTypes2.default.func.isRequired,

  /** Accessor that returns a cursor style to show interactive state */
  getCursor: _propTypes2.default.func,

  /* Controls */
  orbitControls: _propTypes2.default.object
};

var getDefaultCursor = function getDefaultCursor(_ref) {
  var isDragging = _ref.isDragging;
  return isDragging ? CURSOR.GRABBING : CURSOR.GRAB;
};

var defaultProps = {
  lookAt: [0, 0, 0],
  rotationX: 0,
  rotationY: 0,
  translationX: 0,
  translationY: 0,
  distance: 10,
  zoom: 1,
  minZoom: 0,
  maxZoom: Infinity,
  fov: 50,
  near: 1,
  far: 1000,
  getCursor: getDefaultCursor
};

/*
 * Maps mouse interaction to a deck.gl Viewport
 */

var OrbitControllerJS = function () {
  _createClass(OrbitControllerJS, null, [{
    key: 'getViewport',

    // Returns a deck.gl Viewport instance, to be used with the DeckGL component
    value: function getViewport(viewport) {
      return new _orbitViewport2.default(viewport);
    }
  }]);

  function OrbitControllerJS(props) {
    _classCallCheck(this, OrbitControllerJS);

    props = Object.assign({}, defaultProps, props);

    this.props = props;

    this.state = {
      // Whether the cursor is down
      isDragging: false
    };

    this.canvas = props.canvas;

    var eventManager = new _mjolnir.EventManager(this.canvas);

    this._eventManager = eventManager;

    this._controls = props.orbitControls || new _viewportControls2.default(_orbitState2.default);
    this._controls.setOptions(Object.assign({}, this.props, {
      onStateChange: this._onInteractiveStateChange.bind(this),
      eventManager: eventManager
    }));
  }

  _createClass(OrbitControllerJS, [{
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

  return OrbitControllerJS;
}();

exports.default = OrbitControllerJS;


OrbitControllerJS.displayName = 'OrbitController';
OrbitControllerJS.propTypes = propTypes;
OrbitControllerJS.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3B1cmUtanMvb3JiaXQtY29udHJvbGxlci1qcy5qcyJdLCJuYW1lcyI6WyJQUkVGSVgiLCJDVVJTT1IiLCJHUkFCQklORyIsIkdSQUIiLCJQT0lOVEVSIiwicHJvcFR5cGVzIiwibG9va0F0IiwiYXJyYXlPZiIsIm51bWJlciIsImRpc3RhbmNlIiwicm90YXRpb25YIiwicm90YXRpb25ZIiwidHJhbnNsYXRpb25YIiwidHJhbnNsYXRpb25ZIiwiem9vbSIsIm1pblpvb20iLCJtYXhab29tIiwiZm92IiwibmVhciIsImZhciIsIndpZHRoIiwiaXNSZXF1aXJlZCIsImhlaWdodCIsImJvdW5kcyIsIm9iamVjdCIsIm9uVmlld3BvcnRDaGFuZ2UiLCJmdW5jIiwiZ2V0Q3Vyc29yIiwib3JiaXRDb250cm9scyIsImdldERlZmF1bHRDdXJzb3IiLCJpc0RyYWdnaW5nIiwiZGVmYXVsdFByb3BzIiwiSW5maW5pdHkiLCJPcmJpdENvbnRyb2xsZXJKUyIsInZpZXdwb3J0IiwicHJvcHMiLCJPYmplY3QiLCJhc3NpZ24iLCJzdGF0ZSIsImNhbnZhcyIsImV2ZW50TWFuYWdlciIsIl9ldmVudE1hbmFnZXIiLCJfY29udHJvbHMiLCJzZXRPcHRpb25zIiwib25TdGF0ZUNoYW5nZSIsIl9vbkludGVyYWN0aXZlU3RhdGVDaGFuZ2UiLCJiaW5kIiwiZGVzdHJveSIsInN0eWxlIiwiY3Vyc29yIiwiZGlzcGxheU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsU0FBUyxVQUFmOztBQUVBLElBQU1DLFNBQVM7QUFDYkMsWUFBYUYsTUFBYixhQURhO0FBRWJHLFFBQVNILE1BQVQsU0FGYTtBQUdiSSxXQUFTO0FBSEksQ0FBZjs7QUFNQSxJQUFNQyxZQUFZO0FBQ2hCO0FBQ0FDLFVBQVEsb0JBQVVDLE9BQVYsQ0FBa0Isb0JBQVVDLE1BQTVCLENBRlEs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LEtBQUwsQ0FBV1IsVUFBOUIsRUFBMEM7QUFDeEMsYUFBS1EsS0FBTCxDQUFXUixVQUFYLEdBQXdCQSxVQUF4QjtBQUR3QyxZQUVqQ0gsU0FGaUMsR0FFcEIsS0FBS1EsS0FGZSxDQUVqQ1IsU0FGaUM7O0FBR3hDLGFBQUtZLE1BQUwsQ0FBWVMsS0FBWixDQUFrQkMsTUFBbEIsR0FBMkJ0QixVQUFVLEtBQUtXLEtBQWYsQ0FBM0I7QUFDRDtBQUNGOzs7Ozs7a0JBaERrQkwsaUI7OztBQW1EckJBLGtCQUFrQmlCLFdBQWxCLEdBQWdDLGlCQUFoQztBQUNBakIsa0JBQWtCNUIsU0FBbEIsR0FBOEJBLFNBQTlCO0FBQ0E0QixrQkFBa0JGLFlBQWxCLEdBQWlDQSxZQUFqQyIsImZpbGUiOiJvcmJpdC1jb250cm9sbGVyLWpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBPcmJpdFZpZXdwb3J0IGZyb20gJy4uL3ZpZXdwb3J0cy9vcmJpdC12aWV3cG9ydCc7XG5pbXBvcnQgT3JiaXRTdGF0ZSBmcm9tICcuLi9jb250cm9sbGVycy9vcmJpdC1zdGF0ZSc7XG5pbXBvcnQgVmlld3BvcnRDb250cm9scyBmcm9tICcuLi9jb250cm9sbGVycy92aWV3cG9ydC1jb250cm9scyc7XG5pbXBvcnQge0V2ZW50TWFuYWdlcn0gZnJvbSAnbWpvbG5pci5qcyc7XG5cbmNvbnN0IFBSRUZJWCA9ICctd2Via2l0LSc7XG5cbmNvbnN0IENVUlNPUiA9IHtcbiAgR1JBQkJJTkc6IGAke1BSRUZJWH1ncmFiYmluZ2AsXG4gIEdSQUI6IGAke1BSRUZJWH1ncmFiYCxcbiAgUE9JTlRFUjogJ3BvaW50ZXInXG59O1xuXG5jb25zdCBwcm9wVHlwZXMgPSB7XG4gIC8qIFZpZXdwb3J0IHByb3BlcnRpZXMgKi9cbiAgbG9va0F0OiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMubnVtYmVyKSwgLy8gdGFyZ2V0IHBvc2l0aW9uXG4gIGRpc3RhbmNlOiBQcm9wVHlwZXMubnVtYmVyLCAvLyBkaXN0YW5jZSBmcm9tIGNhbWVyYSB0byB0aGUgdGFyZ2V0XG4gIHJvdGF0aW9uWDogUHJvcFR5cGVzLm51bWJlciwgLy8gcm90YXRpb24gYXJvdW5kIFggYXhpc1xuICByb3RhdGlvblk6IFByb3BUeXBlcy5udW1iZXIsIC8vIHJvdGF0aW9uIGFyb3VuZCBZIGF4aXNcbiAgdHJhbnNsYXRpb25YOiBQcm9wVHlwZXMubnVtYmVyLCAvLyB0cmFuc2xhdGlvbiB4IGluIHNjcmVlbiBzcGFjZVxuICB0cmFuc2xhdGlvblk6IFByb3BUeXBlcy5udW1iZXIsIC8vIHRyYW5zbGF0aW9uIHkgaW4gc2NyZWVuIHNwYWNlXG4gIHpvb206IFByb3BUeXBlcy5udW1iZXIsIC8vIHNjYWxlIGluIHNjcmVlbiBzcGFjZVxuICBtaW5ab29tOiBQcm9wVHlwZXMubnVtYmVyLFxuICBtYXhab29tOiBQcm9wVHlwZXMubnVtYmVyLFxuICBmb3Y6IFByb3BUeXBlcy5udW1iZXIsIC8vIGZpZWxkIG9mIHZpZXdcbiAgbmVhcjogUHJvcFR5cGVzLm51bWJlcixcbiAgZmFyOiBQcm9wVHlwZXMubnVtYmVyLFxuICB3aWR0aDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLCAvLyB2aWV3cG9ydCB3aWR0aCBpbiBwaXhlbHNcbiAgaGVpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsIC8vIHZpZXdwb3J0IGhlaWdodCBpbiBwaXhlbHNcblxuICAvKiBNb2RlbCBwcm9wZXJ0aWVzICovXG4gIGJvdW5kczogUHJvcFR5cGVzLm9iamVjdCwgLy8gYm91bmRzIGluIHRoZSBzaGFwZSBvZiB7bWluWCwgbWluWSwgbWluWiwgbWF4WCwgbWF4WSwgbWF4Wn1cblxuICAvKiBDYWxsYmFja3MgKi9cbiAgb25WaWV3cG9ydENoYW5nZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAvKiogQWNjZXNzb3IgdGhhdCByZXR1cm5zIGEgY3Vyc29yIHN0eWxlIHRvIHNob3cgaW50ZXJhY3RpdmUgc3RhdGUgKi9cbiAgZ2V0Q3Vyc29yOiBQcm9wVHlwZXMuZnVuYyxcblxuICAvKiBDb250cm9scyAqL1xuICBvcmJpdENvbnRyb2xzOiBQcm9wVHlwZXMub2JqZWN0XG59O1xuXG5jb25zdCBnZXREZWZhdWx0Q3Vyc29yID0gKHtpc0RyYWdnaW5nfSkgPT4gKGlzRHJhZ2dpbmcgPyBDVVJTT1IuR1JBQkJJTkcgOiBDVVJTT1IuR1JBQik7XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgbG9va0F0OiBbMCwgMCwgMF0sXG4gIHJvdGF0aW9uWDogMCxcbiAgcm90YXRpb25ZOiAwLFxuICB0cmFuc2xhdGlvblg6IDAsXG4gIHRyYW5zbGF0aW9uWTogMCxcbiAgZGlzdGFuY2U6IDEwLFxuICB6b29tOiAxLFxuICBtaW5ab29tOiAwLFxuICBtYXhab29tOiBJbmZpbml0eSxcbiAgZm92OiA1MCxcbiAgbmVhcjogMSxcbiAgZmFyOiAxMDAwLFxuICBnZXRDdXJzb3I6IGdldERlZmF1bHRDdXJzb3Jcbn07XG5cbi8qXG4gKiBNYXBzIG1vdXNlIGludGVyYWN0aW9uIHRvIGEgZGVjay5nbCBWaWV3cG9ydFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPcmJpdENvbnRyb2xsZXJKUyB7XG4gIC8vIFJldHVybnMgYSBkZWNrLmdsIFZpZXdwb3J0IGluc3RhbmNlLCB0byBiZSB1c2VkIHdpdGggdGhlIERlY2tHTCBjb21wb25lbnRcbiAgc3RhdGljIGdldFZpZXdwb3J0KHZpZXdwb3J0KSB7XG4gICAgcmV0dXJuIG5ldyBPcmJpdFZpZXdwb3J0KHZpZXdwb3J0KTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgcHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKTtcblxuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcblxuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICAvLyBXaGV0aGVyIHRoZSBjdXJzb3IgaXMgZG93blxuICAgICAgaXNEcmFnZ2luZzogZmFsc2VcbiAgICB9O1xuXG4gICAgdGhpcy5jYW52YXMgPSBwcm9wcy5jYW52YXM7XG5cbiAgICBjb25zdCBldmVudE1hbmFnZXIgPSBuZXcgRXZlbnRNYW5hZ2VyKHRoaXMuY2FudmFzKTtcblxuICAgIHRoaXMuX2V2ZW50TWFuYWdlciA9IGV2ZW50TWFuYWdlcjtcblxuICAgIHRoaXMuX2NvbnRyb2xzID0gcHJvcHMub3JiaXRDb250cm9scyB8fCBuZXcgVmlld3BvcnRDb250cm9scyhPcmJpdFN0YXRlKTtcbiAgICB0aGlzLl9jb250cm9scy5zZXRPcHRpb25zKFxuICAgICAgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcywge1xuICAgICAgICBvblN0YXRlQ2hhbmdlOiB0aGlzLl9vbkludGVyYWN0aXZlU3RhdGVDaGFuZ2UuYmluZCh0aGlzKSxcbiAgICAgICAgZXZlbnRNYW5hZ2VyXG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBzZXRQcm9wcyhwcm9wcykge1xuICAgIHByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcywgcHJvcHMpO1xuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcblxuICAgIHRoaXMuX2NvbnRyb2xzLnNldE9wdGlvbnMocHJvcHMpO1xuICB9XG5cbiAgZmluYWxpemUoKSB7XG4gICAgdGhpcy5fZXZlbnRNYW5hZ2VyLmRlc3Ryb3koKTtcbiAgfVxuXG4gIF9vbkludGVyYWN0aXZlU3RhdGVDaGFuZ2Uoe2lzRHJhZ2dpbmcgPSBmYWxzZX0pIHtcbiAgICBpZiAoaXNEcmFnZ2luZyAhPT0gdGhpcy5zdGF0ZS5pc0RyYWdnaW5nKSB7XG4gICAgICB0aGlzLnN0YXRlLmlzRHJhZ2dpbmcgPSBpc0RyYWdnaW5nO1xuICAgICAgY29uc3Qge2dldEN1cnNvcn0gPSB0aGlzLnByb3BzO1xuICAgICAgdGhpcy5jYW52YXMuc3R5bGUuY3Vyc29yID0gZ2V0Q3Vyc29yKHRoaXMuc3RhdGUpO1xuICAgIH1cbiAgfVxufVxuXG5PcmJpdENvbnRyb2xsZXJKUy5kaXNwbGF5TmFtZSA9ICdPcmJpdENvbnRyb2xsZXInO1xuT3JiaXRDb250cm9sbGVySlMucHJvcFR5cGVzID0gcHJvcFR5cGVzO1xuT3JiaXRDb250cm9sbGVySlMuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19