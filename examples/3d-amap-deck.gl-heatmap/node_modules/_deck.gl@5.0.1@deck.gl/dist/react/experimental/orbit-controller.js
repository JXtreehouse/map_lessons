'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _orbitControllerJs = require('../../core/pure-js/orbit-controller-js');

var _orbitControllerJs2 = _interopRequireDefault(_orbitControllerJs);

var _orbitViewport = require('../../core/viewports/orbit-viewport');

var _orbitViewport2 = _interopRequireDefault(_orbitViewport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var OrbitController = function (_PureComponent) {
  _inherits(OrbitController, _PureComponent);

  _createClass(OrbitController, null, [{
    key: 'getViewport',

    // Returns a deck.gl Viewport instance, to be used with the DeckGL component
    value: function getViewport(viewport) {
      return new _orbitViewport2.default(viewport);
    }
  }]);

  function OrbitController(props) {
    _classCallCheck(this, OrbitController);

    var _this = _possibleConstructorReturn(this, (OrbitController.__proto__ || Object.getPrototypeOf(OrbitController)).call(this, props));

    _this.controller = null;
    return _this;
  }

  _createClass(OrbitController, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.controller = new _orbitControllerJs2.default(Object.assign({}, this.props, { canvas: this.eventCanvas }));
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate(nextProps) {
      this.controller.setProps(nextProps);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.controller.finalize();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          width = _props.width,
          height = _props.height;


      var eventCanvasStyle = {
        width: width,
        height: height,
        position: 'relative'
      };

      return (0, _react.createElement)('div', {
        key: 'map-controls',
        ref: function ref(c) {
          return _this2.eventCanvas = c;
        },
        style: eventCanvasStyle
      }, this.props.children);
    }
  }]);

  return OrbitController;
}(_react.PureComponent);

exports.default = OrbitController;


OrbitController.displayName = 'OrbitController';
OrbitController.propTypes = _orbitControllerJs2.default.propTypes;
OrbitController.defaultProps = _orbitControllerJs2.default.defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9leHBlcmltZW50YWwvb3JiaXQtY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJPcmJpdENvbnRyb2xsZXIiLCJ2aWV3cG9ydCIsInByb3BzIiwiY29udHJvbGxlciIsIk9iamVjdCIsImFzc2lnbiIsImNhbnZhcyIsImV2ZW50Q2FudmFzIiwibmV4dFByb3BzIiwic2V0UHJvcHMiLCJmaW5hbGl6ZSIsIndpZHRoIiwiaGVpZ2h0IiwiZXZlbnRDYW52YXNTdHlsZSIsInBvc2l0aW9uIiwia2V5IiwicmVmIiwiYyIsInN0eWxlIiwiY2hpbGRyZW4iLCJkaXNwbGF5TmFtZSIsInByb3BUeXBlcyIsImRlZmF1bHRQcm9wcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7SUFFcUJBLGU7Ozs7OztBQUNuQjtnQ0FDbUJDLFEsRUFBVTtBQUMzQixhQUFPLDRCQUFrQkEsUUFBbEIsQ0FBUDtBQUNEOzs7QUFFRCwyQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLGtJQUNYQSxLQURXOztBQUVqQixVQUFLQyxVQUFMLEdBQWtCLElBQWxCO0FBRmlCO0FBR2xCOzs7O3dDQUVtQjtBQUNsQixXQUFLQSxVQUFMLEdBQWtCLGdDQUNoQkMsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS0gsS0FBdkIsRUFBOEIsRUFBQ0ksUUFBUSxLQUFLQyxXQUFkLEVBQTlCLENBRGdCLENBQWxCO0FBR0Q7Ozt3Q0FFbUJDLFMsRUFBVztBQUM3QixXQUFLTCxVQUFMLENBQWdCTSxRQUFoQixDQUF5QkQsU0FBekI7QUFDRDs7OzJDQUVzQjtBQUNyQixXQUFLTCxVQUFMLENBQWdCTyxRQUFoQjtBQUNEOzs7NkJBRVE7QUFBQTs7QUFBQSxtQkFDaUIsS0FBS1IsS0FEdEI7QUFBQSxVQUNBUyxLQURBLFVBQ0FBLEtBREE7QUFBQSxVQUNPQyxNQURQLFVBQ09BLE1BRFA7OztBQUdQLFVBQU1DLG1CQUFtQjtBQUN2QkYsb0JBRHVCO0FBRXZCQyxzQkFGdUI7QUFHdkJFLGtCQUFVO0FBSGEsT0FBekI7O0FBTUEsYUFBTywwQkFDTCxLQURLLEVBRUw7QUFDRUMsYUFBSyxjQURQO0FBRUVDLGFBQUs7QUFBQSxpQkFBTSxPQUFLVCxXQUFMLEdBQW1CVSxDQUF6QjtBQUFBLFNBRlA7QUFHRUMsZUFBT0w7QUFIVCxPQUZLLEVBT0wsS0FBS1gsS0FBTCxDQUFXaUIsUUFQTixDQUFQO0FBU0Q7Ozs7OztrQkEzQ2tCbkIsZTs7O0FBOENyQkEsZ0JBQWdCb0IsV0FBaEIsR0FBOEIsaUJBQTlCO0FBQ0FwQixnQkFBZ0JxQixTQUFoQixHQUE0Qiw0QkFBa0JBLFNBQTlDO0FBQ0FyQixnQkFBZ0JzQixZQUFoQixHQUErQiw0QkFBa0JBLFlBQWpEIiwiZmlsZSI6Im9yYml0LWNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1B1cmVDb21wb25lbnQsIGNyZWF0ZUVsZW1lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBPcmJpdENvbnRyb2xsZXJKUyBmcm9tICcuLi8uLi9jb3JlL3B1cmUtanMvb3JiaXQtY29udHJvbGxlci1qcyc7XG5pbXBvcnQgT3JiaXRWaWV3cG9ydCBmcm9tICcuLi8uLi9jb3JlL3ZpZXdwb3J0cy9vcmJpdC12aWV3cG9ydCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9yYml0Q29udHJvbGxlciBleHRlbmRzIFB1cmVDb21wb25lbnQge1xuICAvLyBSZXR1cm5zIGEgZGVjay5nbCBWaWV3cG9ydCBpbnN0YW5jZSwgdG8gYmUgdXNlZCB3aXRoIHRoZSBEZWNrR0wgY29tcG9uZW50XG4gIHN0YXRpYyBnZXRWaWV3cG9ydCh2aWV3cG9ydCkge1xuICAgIHJldHVybiBuZXcgT3JiaXRWaWV3cG9ydCh2aWV3cG9ydCk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBudWxsO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IE9yYml0Q29udHJvbGxlckpTKFxuICAgICAgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcywge2NhbnZhczogdGhpcy5ldmVudENhbnZhc30pXG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVcGRhdGUobmV4dFByb3BzKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLnNldFByb3BzKG5leHRQcm9wcyk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLmNvbnRyb2xsZXIuZmluYWxpemUoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSB0aGlzLnByb3BzO1xuXG4gICAgY29uc3QgZXZlbnRDYW52YXNTdHlsZSA9IHtcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZSdcbiAgICB9O1xuXG4gICAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQoXG4gICAgICAnZGl2JyxcbiAgICAgIHtcbiAgICAgICAga2V5OiAnbWFwLWNvbnRyb2xzJyxcbiAgICAgICAgcmVmOiBjID0+ICh0aGlzLmV2ZW50Q2FudmFzID0gYyksXG4gICAgICAgIHN0eWxlOiBldmVudENhbnZhc1N0eWxlXG4gICAgICB9LFxuICAgICAgdGhpcy5wcm9wcy5jaGlsZHJlblxuICAgICk7XG4gIH1cbn1cblxuT3JiaXRDb250cm9sbGVyLmRpc3BsYXlOYW1lID0gJ09yYml0Q29udHJvbGxlcic7XG5PcmJpdENvbnRyb2xsZXIucHJvcFR5cGVzID0gT3JiaXRDb250cm9sbGVySlMucHJvcFR5cGVzO1xuT3JiaXRDb250cm9sbGVyLmRlZmF1bHRQcm9wcyA9IE9yYml0Q29udHJvbGxlckpTLmRlZmF1bHRQcm9wcztcbiJdfQ==