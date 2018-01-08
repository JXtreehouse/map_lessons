'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TRANSITION_EVENTS = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* global requestAnimationFrame, cancelAnimationFrame */


var _linearInterpolator = require('../transitions/linear-interpolator');

var _linearInterpolator2 = _interopRequireDefault(_linearInterpolator);

var _transitionUtils = require('../transitions/transition-utils');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var noop = function noop() {};

var TRANSITION_EVENTS = exports.TRANSITION_EVENTS = {
  BREAK: 1,
  SNAP_TO_END: 2,
  IGNORE: 3
};

var DEFAULT_PROPS = {
  transitionDuration: 0,
  transitionEasing: function transitionEasing(t) {
    return t;
  },
  transitionInterpolator: new _linearInterpolator2.default(),
  transitionInterruption: TRANSITION_EVENTS.BREAK,
  onTransitionStart: noop,
  onTransitionInterrupt: noop,
  onTransitionEnd: noop
};

var DEFAULT_STATE = {
  animation: null,
  propsInTransition: null,
  startProps: null,
  endProps: null
};

var TransitionManager = function () {
  function TransitionManager(props) {
    _classCallCheck(this, TransitionManager);

    this.props = props;
    this.state = DEFAULT_STATE;

    this._onTransitionFrame = this._onTransitionFrame.bind(this);
  }

  // Returns current transitioned viewport.


  _createClass(TransitionManager, [{
    key: 'getViewportInTransition',
    value: function getViewportInTransition() {
      return this.state.propsInTransition;
    }

    // Process the vewiport change, either ignore or trigger a new transiton.
    // Return true if a new transition is triggered, false otherwise.

  }, {
    key: 'processViewportChange',
    value: function processViewportChange(nextProps) {
      var transitionTriggered = false;
      var currentProps = this.props;
      // Set this.props here as '_triggerTransition' calls '_updateViewport' that uses this.props.
      this.props = nextProps;

      // NOTE: Be cautious re-ordering statements in this function.
      if (this._shouldIgnoreViewportChange(currentProps, nextProps)) {
        return transitionTriggered;
      }

      var isTransitionInProgress = this._isTransitionInProgress();

      if (this._isTransitionEnabled(nextProps)) {
        var startProps = Object.assign({}, currentProps, this.state.interruption === TRANSITION_EVENTS.SNAP_TO_END ? this.state.endProps : this.state.propsInTransition || currentProps);

        if (isTransitionInProgress) {
          currentProps.onTransitionInterrupt();
        }
        nextProps.onTransitionStart();

        this._triggerTransition(startProps, nextProps);

        transitionTriggered = true;
      } else if (isTransitionInProgress) {
        currentProps.onTransitionInterrupt();
        this._endTransition();
      }

      return transitionTriggered;
    }

    // Helper methods

  }, {
    key: '_isTransitionInProgress',
    value: function _isTransitionInProgress() {
      return this.state.propsInTransition;
    }
  }, {
    key: '_isTransitionEnabled',
    value: function _isTransitionEnabled(props) {
      return props.transitionDuration > 0 && props.transitionInterpolator;
    }
  }, {
    key: '_isUpdateDueToCurrentTransition',
    value: function _isUpdateDueToCurrentTransition(props) {
      if (this.state.propsInTransition) {
        return this.state.interpolator.arePropsEqual(props, this.state.propsInTransition);
      }
      return false;
    }
  }, {
    key: '_shouldIgnoreViewportChange',
    value: function _shouldIgnoreViewportChange(currentProps, nextProps) {
      if (this._isTransitionInProgress()) {
        // Ignore update if it is requested to be ignored
        return this.state.interruption === TRANSITION_EVENTS.IGNORE ||
        // Ignore update if it is due to current active transition.
        this._isUpdateDueToCurrentTransition(nextProps);
      } else if (this._isTransitionEnabled(nextProps)) {
        // Ignore if none of the viewport props changed.
        return nextProps.transitionInterpolator.arePropsEqual(currentProps, nextProps);
      }
      return true;
    }
  }, {
    key: '_triggerTransition',
    value: function _triggerTransition(startProps, endProps) {
      (0, _assert2.default)(this._isTransitionEnabled(endProps), 'Transition is not enabled');

      cancelAnimationFrame(this.state.animation);

      var initialProps = endProps.transitionInterpolator.initializeProps(startProps, endProps);

      this.state = {
        // Save current transition props
        duration: endProps.transitionDuration,
        easing: endProps.transitionEasing,
        interpolator: endProps.transitionInterpolator,
        interruption: endProps.transitionInterruption,

        startTime: Date.now(),
        startProps: initialProps.start,
        endProps: initialProps.end,
        animation: null,
        propsInTransition: {}
      };

      this._onTransitionFrame();
    }
  }, {
    key: '_onTransitionFrame',
    value: function _onTransitionFrame() {
      // _updateViewport() may cancel the animation
      this.state.animation = requestAnimationFrame(this._onTransitionFrame);
      this._updateViewport();
    }
  }, {
    key: '_endTransition',
    value: function _endTransition() {
      cancelAnimationFrame(this.state.animation);
      this.state = DEFAULT_STATE;
    }
  }, {
    key: '_updateViewport',
    value: function _updateViewport() {
      // NOTE: Be cautious re-ordering statements in this function.
      var currentTime = Date.now();
      var _state = this.state,
          startTime = _state.startTime,
          duration = _state.duration,
          easing = _state.easing,
          interpolator = _state.interpolator,
          startProps = _state.startProps,
          endProps = _state.endProps;


      var shouldEnd = false;
      var t = (currentTime - startTime) / duration;
      if (t >= 1) {
        t = 1;
        shouldEnd = true;
      }
      t = easing(t);

      var viewport = interpolator.interpolateProps(startProps, endProps, t);

      // This extractViewportFrom gurantees angle props (bearing, longitude) are normalized
      // So when viewports are compared they are in same range.
      this.state.propsInTransition = (0, _transitionUtils.extractViewportFrom)(Object.assign({}, this.props, viewport));

      if (this.props.onViewportChange) {
        this.props.onViewportChange(this.state.propsInTransition, { inTransition: true });
      }

      if (shouldEnd) {
        this._endTransition();
        this.props.onTransitionEnd();
      }
    }
  }]);

  return TransitionManager;
}();

exports.default = TransitionManager;


TransitionManager.defaultProps = DEFAULT_PROPS;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL2xpYi90cmFuc2l0aW9uLW1hbmFnZXIuanMiXSwibmFtZXMiOlsibm9vcCIsIlRSQU5TSVRJT05fRVZFTlRTIiwiQlJFQUsiLCJTTkFQX1RPX0VORCIsIklHTk9SRSIsIkRFRkFVTFRfUFJPUFMiLCJ0cmFuc2l0aW9uRHVyYXRpb24iLCJ0cmFuc2l0aW9uRWFzaW5nIiwidCIsInRyYW5zaXRpb25JbnRlcnBvbGF0b3IiLCJ0cmFuc2l0aW9uSW50ZXJydXB0aW9uIiwib25UcmFuc2l0aW9uU3RhcnQiLCJvblRyYW5zaXRpb25JbnRlcnJ1cHQiLCJvblRyYW5zaXRpb25FbmQiLCJERUZBVUxUX1NUQVRFIiwiYW5pbWF0aW9uIiwicHJvcHNJblRyYW5zaXRpb24iLCJzdGFydFByb3BzIiwiZW5kUHJvcHMiLCJUcmFuc2l0aW9uTWFuYWdlciIsInByb3BzIiwic3RhdGUiLCJfb25UcmFuc2l0aW9uRnJhbWUiLCJiaW5kIiwibmV4dFByb3BzIiwidHJhbnNpdGlvblRyaWdnZXJlZCIsImN1cnJlbnRQcm9wcyIsIl9zaG91bGRJZ25vcmVWaWV3cG9ydENoYW5nZSIsImlzVHJhbnNpdGlvbkluUHJvZ3Jlc3MiLCJfaXNUcmFuc2l0aW9uSW5Qcm9ncmVzcyIsIl9pc1RyYW5zaXRpb25FbmFibGVkIiwiT2JqZWN0IiwiYXNzaWduIiwiaW50ZXJydXB0aW9uIiwiX3RyaWdnZXJUcmFuc2l0aW9uIiwiX2VuZFRyYW5zaXRpb24iLCJpbnRlcnBvbGF0b3IiLCJhcmVQcm9wc0VxdWFsIiwiX2lzVXBkYXRlRHVlVG9DdXJyZW50VHJhbnNpdGlvbiIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiaW5pdGlhbFByb3BzIiwiaW5pdGlhbGl6ZVByb3BzIiwiZHVyYXRpb24iLCJlYXNpbmciLCJzdGFydFRpbWUiLCJEYXRlIiwibm93Iiwic3RhcnQiLCJlbmQiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJfdXBkYXRlVmlld3BvcnQiLCJjdXJyZW50VGltZSIsInNob3VsZEVuZCIsInZpZXdwb3J0IiwiaW50ZXJwb2xhdGVQcm9wcyIsIm9uVmlld3BvcnRDaGFuZ2UiLCJpblRyYW5zaXRpb24iLCJkZWZhdWx0UHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7cWpCQUFBOzs7QUFDQTs7OztBQUNBOztBQUNBOzs7Ozs7OztBQUVBLElBQU1BLE9BQU8sU0FBUEEsSUFBTyxHQUFNLENBQUUsQ0FBckI7O0FBRU8sSUFBTUMsZ0RBQW9CO0FBQy9CQyxTQUFPLENBRHdCO0FBRS9CQyxlQUFhLENBRmtCO0FBRy9CQyxVQUFRO0FBSHVCLENBQTFCOztBQU1QLElBQU1DLGdCQUFnQjtBQUNwQkMsc0JBQW9CLENBREE7QUFFcEJDLG9CQUFrQjtBQUFBLFdBQUtDLENBQUw7QUFBQSxHQUZFO0FBR3BCQywwQkFBd0Isa0NBSEo7QUFJcEJDLDBCQUF3QlQsa0JBQWtCQyxLQUp0QjtBQUtwQlMscUJBQW1CWCxJQUxDO0FBTXBCWSx5QkFBdUJaLElBTkg7QUFPcEJhLG1CQUFpQmI7QUFQRyxDQUF0Qjs7QUFVQSxJQUFNYyxnQkFBZ0I7QUFDcEJDLGFBQVcsSUFEUztBQUVwQkMscUJBQW1CLElBRkM7QUFHcEJDLGNBQVksSUFIUTtBQUlwQkMsWUFBVTtBQUpVLENBQXRCOztJQU9xQkMsaUI7QUFDbkIsNkJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFDakIsU0FBS0EsS0FBTCxHQUFhQSxLQUFiO0FBQ0EsU0FBS0MsS0FBTCxHQUFhUCxhQUFiOztBQUVBLFNBQUtRLGtCQUFMLEdBQTBCLEtBQUtBLGtCQUFMLENBQXdCQyxJQUF4QixDQUE2QixJQUE3QixDQUExQjtBQUNEOztBQUVEOzs7Ozs4Q0FDMEI7QUFDeEIsYUFBTyxLQUFLRixLQUFMLENBQVdMLGlCQUFsQjtBQUNEOztBQUVEO0FBQ0E7Ozs7MENBQ3NCUSxTLEVBQVc7QUFDL0IsVUFBSUMsc0JBQXNCLEtBQTFCO0FBQ0EsVUFBTUMsZUFBZSxLQUFLTixLQUExQjtBQUNBO0FBQ0EsV0FBS0EsS0FBTCxHQUFhSSxTQUFi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Rjs7Ozs7O2tCQW5Ka0JNLGlCOzs7QUFzSnJCQSxrQkFBa0JzQyxZQUFsQixHQUFpQ3BELGFBQWpDIiwiZmlsZSI6InRyYW5zaXRpb24tbWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGdsb2JhbCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUsIGNhbmNlbEFuaW1hdGlvbkZyYW1lICovXG5pbXBvcnQgTGluZWFySW50ZXJwb2xhdG9yIGZyb20gJy4uL3RyYW5zaXRpb25zL2xpbmVhci1pbnRlcnBvbGF0b3InO1xuaW1wb3J0IHtleHRyYWN0Vmlld3BvcnRGcm9tfSBmcm9tICcuLi90cmFuc2l0aW9ucy90cmFuc2l0aW9uLXV0aWxzJztcbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcblxuY29uc3Qgbm9vcCA9ICgpID0+IHt9O1xuXG5leHBvcnQgY29uc3QgVFJBTlNJVElPTl9FVkVOVFMgPSB7XG4gIEJSRUFLOiAxLFxuICBTTkFQX1RPX0VORDogMixcbiAgSUdOT1JFOiAzXG59O1xuXG5jb25zdCBERUZBVUxUX1BST1BTID0ge1xuICB0cmFuc2l0aW9uRHVyYXRpb246IDAsXG4gIHRyYW5zaXRpb25FYXNpbmc6IHQgPT4gdCxcbiAgdHJhbnNpdGlvbkludGVycG9sYXRvcjogbmV3IExpbmVhckludGVycG9sYXRvcigpLFxuICB0cmFuc2l0aW9uSW50ZXJydXB0aW9uOiBUUkFOU0lUSU9OX0VWRU5UUy5CUkVBSyxcbiAgb25UcmFuc2l0aW9uU3RhcnQ6IG5vb3AsXG4gIG9uVHJhbnNpdGlvbkludGVycnVwdDogbm9vcCxcbiAgb25UcmFuc2l0aW9uRW5kOiBub29wXG59O1xuXG5jb25zdCBERUZBVUxUX1NUQVRFID0ge1xuICBhbmltYXRpb246IG51bGwsXG4gIHByb3BzSW5UcmFuc2l0aW9uOiBudWxsLFxuICBzdGFydFByb3BzOiBudWxsLFxuICBlbmRQcm9wczogbnVsbFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVHJhbnNpdGlvbk1hbmFnZXIge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICB0aGlzLnN0YXRlID0gREVGQVVMVF9TVEFURTtcblxuICAgIHRoaXMuX29uVHJhbnNpdGlvbkZyYW1lID0gdGhpcy5fb25UcmFuc2l0aW9uRnJhbWUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8vIFJldHVybnMgY3VycmVudCB0cmFuc2l0aW9uZWQgdmlld3BvcnQuXG4gIGdldFZpZXdwb3J0SW5UcmFuc2l0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRlLnByb3BzSW5UcmFuc2l0aW9uO1xuICB9XG5cbiAgLy8gUHJvY2VzcyB0aGUgdmV3aXBvcnQgY2hhbmdlLCBlaXRoZXIgaWdub3JlIG9yIHRyaWdnZXIgYSBuZXcgdHJhbnNpdG9uLlxuICAvLyBSZXR1cm4gdHJ1ZSBpZiBhIG5ldyB0cmFuc2l0aW9uIGlzIHRyaWdnZXJlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICBwcm9jZXNzVmlld3BvcnRDaGFuZ2UobmV4dFByb3BzKSB7XG4gICAgbGV0IHRyYW5zaXRpb25UcmlnZ2VyZWQgPSBmYWxzZTtcbiAgICBjb25zdCBjdXJyZW50UHJvcHMgPSB0aGlzLnByb3BzO1xuICAgIC8vIFNldCB0aGlzLnByb3BzIGhlcmUgYXMgJ190cmlnZ2VyVHJhbnNpdGlvbicgY2FsbHMgJ191cGRhdGVWaWV3cG9ydCcgdGhhdCB1c2VzIHRoaXMucHJvcHMuXG4gICAgdGhpcy5wcm9wcyA9IG5leHRQcm9wcztcblxuICAgIC8vIE5PVEU6IEJlIGNhdXRpb3VzIHJlLW9yZGVyaW5nIHN0YXRlbWVudHMgaW4gdGhpcyBmdW5jdGlvbi5cbiAgICBpZiAodGhpcy5fc2hvdWxkSWdub3JlVmlld3BvcnRDaGFuZ2UoY3VycmVudFByb3BzLCBuZXh0UHJvcHMpKSB7XG4gICAgICByZXR1cm4gdHJhbnNpdGlvblRyaWdnZXJlZDtcbiAgICB9XG5cbiAgICBjb25zdCBpc1RyYW5zaXRpb25JblByb2dyZXNzID0gdGhpcy5faXNUcmFuc2l0aW9uSW5Qcm9ncmVzcygpO1xuXG4gICAgaWYgKHRoaXMuX2lzVHJhbnNpdGlvbkVuYWJsZWQobmV4dFByb3BzKSkge1xuICAgICAgY29uc3Qgc3RhcnRQcm9wcyA9IE9iamVjdC5hc3NpZ24oXG4gICAgICAgIHt9LFxuICAgICAgICBjdXJyZW50UHJvcHMsXG4gICAgICAgIHRoaXMuc3RhdGUuaW50ZXJydXB0aW9uID09PSBUUkFOU0lUSU9OX0VWRU5UUy5TTkFQX1RPX0VORFxuICAgICAgICAgID8gdGhpcy5zdGF0ZS5lbmRQcm9wc1xuICAgICAgICAgIDogdGhpcy5zdGF0ZS5wcm9wc0luVHJhbnNpdGlvbiB8fCBjdXJyZW50UHJvcHNcbiAgICAgICk7XG5cbiAgICAgIGlmIChpc1RyYW5zaXRpb25JblByb2dyZXNzKSB7XG4gICAgICAgIGN1cnJlbnRQcm9wcy5vblRyYW5zaXRpb25JbnRlcnJ1cHQoKTtcbiAgICAgIH1cbiAgICAgIG5leHRQcm9wcy5vblRyYW5zaXRpb25TdGFydCgpO1xuXG4gICAgICB0aGlzLl90cmlnZ2VyVHJhbnNpdGlvbihzdGFydFByb3BzLCBuZXh0UHJvcHMpO1xuXG4gICAgICB0cmFuc2l0aW9uVHJpZ2dlcmVkID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGlzVHJhbnNpdGlvbkluUHJvZ3Jlc3MpIHtcbiAgICAgIGN1cnJlbnRQcm9wcy5vblRyYW5zaXRpb25JbnRlcnJ1cHQoKTtcbiAgICAgIHRoaXMuX2VuZFRyYW5zaXRpb24oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJhbnNpdGlvblRyaWdnZXJlZDtcbiAgfVxuXG4gIC8vIEhlbHBlciBtZXRob2RzXG5cbiAgX2lzVHJhbnNpdGlvbkluUHJvZ3Jlc3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3RhdGUucHJvcHNJblRyYW5zaXRpb247XG4gIH1cblxuICBfaXNUcmFuc2l0aW9uRW5hYmxlZChwcm9wcykge1xuICAgIHJldHVybiBwcm9wcy50cmFuc2l0aW9uRHVyYXRpb24gPiAwICYmIHByb3BzLnRyYW5zaXRpb25JbnRlcnBvbGF0b3I7XG4gIH1cblxuICBfaXNVcGRhdGVEdWVUb0N1cnJlbnRUcmFuc2l0aW9uKHByb3BzKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUucHJvcHNJblRyYW5zaXRpb24pIHtcbiAgICAgIHJldHVybiB0aGlzLnN0YXRlLmludGVycG9sYXRvci5hcmVQcm9wc0VxdWFsKHByb3BzLCB0aGlzLnN0YXRlLnByb3BzSW5UcmFuc2l0aW9uKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgX3Nob3VsZElnbm9yZVZpZXdwb3J0Q2hhbmdlKGN1cnJlbnRQcm9wcywgbmV4dFByb3BzKSB7XG4gICAgaWYgKHRoaXMuX2lzVHJhbnNpdGlvbkluUHJvZ3Jlc3MoKSkge1xuICAgICAgLy8gSWdub3JlIHVwZGF0ZSBpZiBpdCBpcyByZXF1ZXN0ZWQgdG8gYmUgaWdub3JlZFxuICAgICAgcmV0dXJuIChcbiAgICAgICAgdGhpcy5zdGF0ZS5pbnRlcnJ1cHRpb24gPT09IFRSQU5TSVRJT05fRVZFTlRTLklHTk9SRSB8fFxuICAgICAgICAvLyBJZ25vcmUgdXBkYXRlIGlmIGl0IGlzIGR1ZSB0byBjdXJyZW50IGFjdGl2ZSB0cmFuc2l0aW9uLlxuICAgICAgICB0aGlzLl9pc1VwZGF0ZUR1ZVRvQ3VycmVudFRyYW5zaXRpb24obmV4dFByb3BzKVxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2lzVHJhbnNpdGlvbkVuYWJsZWQobmV4dFByb3BzKSkge1xuICAgICAgLy8gSWdub3JlIGlmIG5vbmUgb2YgdGhlIHZpZXdwb3J0IHByb3BzIGNoYW5nZWQuXG4gICAgICByZXR1cm4gbmV4dFByb3BzLnRyYW5zaXRpb25JbnRlcnBvbGF0b3IuYXJlUHJvcHNFcXVhbChjdXJyZW50UHJvcHMsIG5leHRQcm9wcyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgX3RyaWdnZXJUcmFuc2l0aW9uKHN0YXJ0UHJvcHMsIGVuZFByb3BzKSB7XG4gICAgYXNzZXJ0KHRoaXMuX2lzVHJhbnNpdGlvbkVuYWJsZWQoZW5kUHJvcHMpLCAnVHJhbnNpdGlvbiBpcyBub3QgZW5hYmxlZCcpO1xuXG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5zdGF0ZS5hbmltYXRpb24pO1xuXG4gICAgY29uc3QgaW5pdGlhbFByb3BzID0gZW5kUHJvcHMudHJhbnNpdGlvbkludGVycG9sYXRvci5pbml0aWFsaXplUHJvcHMoc3RhcnRQcm9wcywgZW5kUHJvcHMpO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIC8vIFNhdmUgY3VycmVudCB0cmFuc2l0aW9uIHByb3BzXG4gICAgICBkdXJhdGlvbjogZW5kUHJvcHMudHJhbnNpdGlvbkR1cmF0aW9uLFxuICAgICAgZWFzaW5nOiBlbmRQcm9wcy50cmFuc2l0aW9uRWFzaW5nLFxuICAgICAgaW50ZXJwb2xhdG9yOiBlbmRQcm9wcy50cmFuc2l0aW9uSW50ZXJwb2xhdG9yLFxuICAgICAgaW50ZXJydXB0aW9uOiBlbmRQcm9wcy50cmFuc2l0aW9uSW50ZXJydXB0aW9uLFxuXG4gICAgICBzdGFydFRpbWU6IERhdGUubm93KCksXG4gICAgICBzdGFydFByb3BzOiBpbml0aWFsUHJvcHMuc3RhcnQsXG4gICAgICBlbmRQcm9wczogaW5pdGlhbFByb3BzLmVuZCxcbiAgICAgIGFuaW1hdGlvbjogbnVsbCxcbiAgICAgIHByb3BzSW5UcmFuc2l0aW9uOiB7fVxuICAgIH07XG5cbiAgICB0aGlzLl9vblRyYW5zaXRpb25GcmFtZSgpO1xuICB9XG5cbiAgX29uVHJhbnNpdGlvbkZyYW1lKCkge1xuICAgIC8vIF91cGRhdGVWaWV3cG9ydCgpIG1heSBjYW5jZWwgdGhlIGFuaW1hdGlvblxuICAgIHRoaXMuc3RhdGUuYW5pbWF0aW9uID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuX29uVHJhbnNpdGlvbkZyYW1lKTtcbiAgICB0aGlzLl91cGRhdGVWaWV3cG9ydCgpO1xuICB9XG5cbiAgX2VuZFRyYW5zaXRpb24oKSB7XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5zdGF0ZS5hbmltYXRpb24pO1xuICAgIHRoaXMuc3RhdGUgPSBERUZBVUxUX1NUQVRFO1xuICB9XG5cbiAgX3VwZGF0ZVZpZXdwb3J0KCkge1xuICAgIC8vIE5PVEU6IEJlIGNhdXRpb3VzIHJlLW9yZGVyaW5nIHN0YXRlbWVudHMgaW4gdGhpcyBmdW5jdGlvbi5cbiAgICBjb25zdCBjdXJyZW50VGltZSA9IERhdGUubm93KCk7XG4gICAgY29uc3Qge3N0YXJ0VGltZSwgZHVyYXRpb24sIGVhc2luZywgaW50ZXJwb2xhdG9yLCBzdGFydFByb3BzLCBlbmRQcm9wc30gPSB0aGlzLnN0YXRlO1xuXG4gICAgbGV0IHNob3VsZEVuZCA9IGZhbHNlO1xuICAgIGxldCB0ID0gKGN1cnJlbnRUaW1lIC0gc3RhcnRUaW1lKSAvIGR1cmF0aW9uO1xuICAgIGlmICh0ID49IDEpIHtcbiAgICAgIHQgPSAxO1xuICAgICAgc2hvdWxkRW5kID0gdHJ1ZTtcbiAgICB9XG4gICAgdCA9IGVhc2luZyh0KTtcblxuICAgIGNvbnN0IHZpZXdwb3J0ID0gaW50ZXJwb2xhdG9yLmludGVycG9sYXRlUHJvcHMoc3RhcnRQcm9wcywgZW5kUHJvcHMsIHQpO1xuXG4gICAgLy8gVGhpcyBleHRyYWN0Vmlld3BvcnRGcm9tIGd1cmFudGVlcyBhbmdsZSBwcm9wcyAoYmVhcmluZywgbG9uZ2l0dWRlKSBhcmUgbm9ybWFsaXplZFxuICAgIC8vIFNvIHdoZW4gdmlld3BvcnRzIGFyZSBjb21wYXJlZCB0aGV5IGFyZSBpbiBzYW1lIHJhbmdlLlxuICAgIHRoaXMuc3RhdGUucHJvcHNJblRyYW5zaXRpb24gPSBleHRyYWN0Vmlld3BvcnRGcm9tKE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMsIHZpZXdwb3J0KSk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5vblZpZXdwb3J0Q2hhbmdlKSB7XG4gICAgICB0aGlzLnByb3BzLm9uVmlld3BvcnRDaGFuZ2UodGhpcy5zdGF0ZS5wcm9wc0luVHJhbnNpdGlvbiwge2luVHJhbnNpdGlvbjogdHJ1ZX0pO1xuICAgIH1cblxuICAgIGlmIChzaG91bGRFbmQpIHtcbiAgICAgIHRoaXMuX2VuZFRyYW5zaXRpb24oKTtcbiAgICAgIHRoaXMucHJvcHMub25UcmFuc2l0aW9uRW5kKCk7XG4gICAgfVxuICB9XG59XG5cblRyYW5zaXRpb25NYW5hZ2VyLmRlZmF1bHRQcm9wcyA9IERFRkFVTFRfUFJPUFM7XG4iXX0=