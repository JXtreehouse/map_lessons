'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _mapControllerJs = require('../core/pure-js/map-controller-js');

var _mapControllerJs2 = _interopRequireDefault(_mapControllerJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapController = function (_PureComponent) {
  _inherits(MapController, _PureComponent);

  function MapController(props) {
    _classCallCheck(this, MapController);

    var _this = _possibleConstructorReturn(this, (MapController.__proto__ || Object.getPrototypeOf(MapController)).call(this, props));

    _this.controller = null;
    return _this;
  }

  _createClass(MapController, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.controller = new _mapControllerJs2.default(Object.assign({}, this.props, { canvas: this.eventCanvas }));
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

  return MapController;
}(_react.PureComponent);

exports.default = MapController;


MapController.displayName = 'MapController';
MapController.propTypes = _mapControllerJs2.default.propTypes;
MapController.defaultProps = _mapControllerJs2.default.defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZWFjdC9tYXAtY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJNYXBDb250cm9sbGVyIiwicHJvcHMiLCJjb250cm9sbGVyIiwiT2JqZWN0IiwiYXNzaWduIiwiY2FudmFzIiwiZXZlbnRDYW52YXMiLCJuZXh0UHJvcHMiLCJzZXRQcm9wcyIsImZpbmFsaXplIiwid2lkdGgiLCJoZWlnaHQiLCJldmVudENhbnZhc1N0eWxlIiwicG9zaXRpb24iLCJrZXkiLCJyZWYiLCJjIiwic3R5bGUiLCJjaGlsZHJlbiIsImRpc3BsYXlOYW1lIiwicHJvcFR5cGVzIiwiZGVmYXVsdFByb3BzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7SUFFcUJBLGE7OztBQUNuQix5QkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLDhIQUNYQSxLQURXOztBQUVqQixVQUFLQyxVQUFMLEdBQWtCLElBQWxCO0FBRmlCO0FBR2xCOzs7O3dDQUVtQjtBQUNsQixXQUFLQSxVQUFMLEdBQWtCLDhCQUNoQkMsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0IsS0FBS0gsS0FBdkIsRUFBOEIsRUFBQ0ksUUFBUSxLQUFLQyxXQUFkLEVBQTlCLENBRGdCLENBQWxCO0FBR0Q7Ozt3Q0FFbUJDLFMsRUFBVztBQUM3QixXQUFLTCxVQUFMLENBQWdCTSxRQUFoQixDQUF5QkQsU0FBekI7QUFDRDs7OzJDQUVzQjtBQUNyQixXQUFLTCxVQUFMLENBQWdCTyxRQUFoQjtBQUNEOzs7NkJBRVE7QUFBQTs7QUFBQSxtQkFDaUIsS0FBS1IsS0FEdEI7QUFBQSxVQUNBUyxLQURBLFVBQ0FBLEtBREE7QUFBQSxVQUNPQyxNQURQLFVBQ09BLE1BRFA7OztBQUdQLFVBQU1DLG1CQUFtQjtBQUN2QkYsb0JBRHVCO0FBRXZCQyxzQkFGdUI7QUFHdkJFLGtCQUFVO0FBSGEsT0FBekI7O0FBTUEsYUFBTywwQkFDTCxLQURLLEVBRUw7QUFDRUMsYUFBSyxjQURQO0FBRUVDLGFBQUs7QUFBQSxpQkFBTSxPQUFLVCxXQUFMLEdBQW1CVSxDQUF6QjtBQUFBLFNBRlA7QUFHRUMsZUFBT0w7QUFIVCxPQUZLLEVBT0wsS0FBS1gsS0FBTCxDQUFXaUIsUUFQTixDQUFQO0FBU0Q7Ozs7OztrQkF0Q2tCbEIsYTs7O0FBeUNyQkEsY0FBY21CLFdBQWQsR0FBNEIsZUFBNUI7QUFDQW5CLGNBQWNvQixTQUFkLEdBQTBCLDBCQUFnQkEsU0FBMUM7QUFDQXBCLGNBQWNxQixZQUFkLEdBQTZCLDBCQUFnQkEsWUFBN0MiLCJmaWxlIjoibWFwLWNvbnRyb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1B1cmVDb21wb25lbnQsIGNyZWF0ZUVsZW1lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBNYXBDb250cm9sbGVySlMgZnJvbSAnLi4vY29yZS9wdXJlLWpzL21hcC1jb250cm9sbGVyLWpzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTWFwQ29udHJvbGxlciBleHRlbmRzIFB1cmVDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBudWxsO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5jb250cm9sbGVyID0gbmV3IE1hcENvbnRyb2xsZXJKUyhcbiAgICAgIE9iamVjdC5hc3NpZ24oe30sIHRoaXMucHJvcHMsIHtjYW52YXM6IHRoaXMuZXZlbnRDYW52YXN9KVxuICAgICk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVXBkYXRlKG5leHRQcm9wcykge1xuICAgIHRoaXMuY29udHJvbGxlci5zZXRQcm9wcyhuZXh0UHJvcHMpO1xuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5jb250cm9sbGVyLmZpbmFsaXplKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3Qge3dpZHRoLCBoZWlnaHR9ID0gdGhpcy5wcm9wcztcblxuICAgIGNvbnN0IGV2ZW50Q2FudmFzU3R5bGUgPSB7XG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnXG4gICAgfTtcblxuICAgIHJldHVybiBjcmVhdGVFbGVtZW50KFxuICAgICAgJ2RpdicsXG4gICAgICB7XG4gICAgICAgIGtleTogJ21hcC1jb250cm9scycsXG4gICAgICAgIHJlZjogYyA9PiAodGhpcy5ldmVudENhbnZhcyA9IGMpLFxuICAgICAgICBzdHlsZTogZXZlbnRDYW52YXNTdHlsZVxuICAgICAgfSxcbiAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW5cbiAgICApO1xuICB9XG59XG5cbk1hcENvbnRyb2xsZXIuZGlzcGxheU5hbWUgPSAnTWFwQ29udHJvbGxlcic7XG5NYXBDb250cm9sbGVyLnByb3BUeXBlcyA9IE1hcENvbnRyb2xsZXJKUy5wcm9wVHlwZXM7XG5NYXBDb250cm9sbGVyLmRlZmF1bHRQcm9wcyA9IE1hcENvbnRyb2xsZXJKUy5kZWZhdWx0UHJvcHM7XG4iXX0=