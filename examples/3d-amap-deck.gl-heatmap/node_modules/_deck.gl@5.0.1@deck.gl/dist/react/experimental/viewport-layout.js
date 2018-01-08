'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _flatten = require('../../core/utils/flatten');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ViewportLayout = function (_React$Component) {
  _inherits(ViewportLayout, _React$Component);

  function ViewportLayout(props) {
    _classCallCheck(this, ViewportLayout);

    return _possibleConstructorReturn(this, (ViewportLayout.__proto__ || Object.getPrototypeOf(ViewportLayout)).call(this, props));
  }

  // Iterate over viewport descriptors and render viewports at specified positions


  _createClass(ViewportLayout, [{
    key: '_renderChildrenUnderViewports',
    value: function _renderChildrenUnderViewports() {
      // Flatten out nested viewports array
      var viewports = (0, _flatten.flatten)(this.props.viewports, { filter: Boolean });

      // Build a viewport id to viewport index
      var viewportMap = {};
      viewports.forEach(function (viewportOrDescriptor) {
        var viewport = viewportOrDescriptor.viewport || viewportOrDescriptor;
        if (viewport.id) {
          viewportMap[viewport.id] = viewport;
        }
      });

      var originalChildren = _react2.default.Children.toArray(this.props.children);
      var lastElement = originalChildren.pop();

      var children = originalChildren.map(function (child, i) {
        // If viewportId is provided, match with viewport
        if (child.props.viewportId) {
          var viewport = viewportMap[child.props.viewportId];

          // TODO - this is too react-map-gl specific
          var newProps = Object.assign({}, child.props, {
            visible: viewport.isMapSynched(),
            width: viewport.width,
            height: viewport.height
          }, viewport.getMercatorParams());

          var clone = (0, _react.cloneElement)(child, newProps);

          var _style = {
            position: 'absolute',
            left: viewport.x,
            top: viewport.y,
            width: viewport.width,
            height: viewport.height
          };

          child = (0, _react.createElement)('div', { key: 'viewport-component-' + i, style: _style }, clone);
        }

        return child;
      });

      var style = { position: 'absolute', left: 0, top: 0 };
      children.push((0, _react.createElement)('div', { key: 'children', style: style }, lastElement));

      return children;
    }
  }, {
    key: 'render',
    value: function render() {
      // Render the background elements (typically react-map-gl instances)
      // using the viewport descriptors
      var children = this._renderChildrenUnderViewports();
      return (0, _react.createElement)('div', {}, children);
    }
  }]);

  return ViewportLayout;
}(_react2.default.Component);

exports.default = ViewportLayout;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZWFjdC9leHBlcmltZW50YWwvdmlld3BvcnQtbGF5b3V0LmpzIl0sIm5hbWVzIjpbIlZpZXdwb3J0TGF5b3V0IiwicHJvcHMiLCJ2aWV3cG9ydHMiLCJmaWx0ZXIiLCJCb29sZWFuIiwidmlld3BvcnRNYXAiLCJmb3JFYWNoIiwidmlld3BvcnQiLCJ2aWV3cG9ydE9yRGVzY3JpcHRvciIsImlkIiwib3JpZ2luYWxDaGlsZHJlbiIsIkNoaWxkcmVuIiwidG9BcnJheSIsImNoaWxkcmVuIiwibGFzdEVsZW1lbnQiLCJwb3AiLCJtYXAiLCJjaGlsZCIsImkiLCJ2aWV3cG9ydElkIiwibmV3UHJvcHMiLCJPYmplY3QiLCJhc3NpZ24iLCJ2aXNpYmxlIiwiaXNNYXBTeW5jaGVkIiwid2lkdGgiLCJoZWlnaHQiLCJnZXRNZXJjYXRvclBhcmFtcyIsImNsb25lIiwic3R5bGUiLCJwb3NpdGlvbiIsImxlZnQiLCJ4IiwidG9wIiwieSIsImtleSIsInB1c2giLCJfcmVuZGVyQ2hpbGRyZW5VbmRlclZpZXdwb3J0cyIsIkNvbXBvbmVudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7Ozs7O0lBRXFCQSxjOzs7QUFDbkIsMEJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFBQSwySEFDWEEsS0FEVztBQUVsQjs7QUFFRDs7Ozs7b0RBQ2dDO0FBQzlCO0FBQ0EsVUFBTUMsWUFBWSxzQkFBUSxLQUFLRCxLQUFMLENBQVdDLFNBQW5CLEVBQThCLEVBQUNDLFFBQVFDLE9BQVQsRUFBOUIsQ0FBbEI7O0FBRUE7QUFDQSxVQUFNQyxjQUFjLEVBQXBCO0FBQ0FILGdCQUFVSSxPQUFWLENBQWtCLGdDQUF3QjtBQUN4QyxZQUFNQyxXQUFXQyxxQkFBcUJELFFBQXJCLElBQWlDQyxvQkFBbEQ7QUFDQSxZQUFJRCxTQUFTRSxFQUFiLEVBQWlCO0FBQ2ZKLHNCQUFZRSxTQUFTRSxFQUFyQixJQUEyQkYsUUFBM0I7QUFDRDtBQUNGLE9BTEQ7O0FBT0EsVUFBTUcsbUJBQW1CLGdCQUFNQyxRQUFOLENBQWVDLE9BQWYsQ0FBdUIsS0FBS1gsS0FBTCxDQUFXWSxRQUFsQyxDQUF6QjtBQUNBLFVBQU1DLGNBQWNKLGlCQUFpQkssR0FBakIsRUFBcEI7O0FBRUEsVUFBTUYsV0FBV0gsaUJBQWlCTSxHQUFqQixDQUFxQixVQUFDQyxLQUFELEVBQVFDLENBQVIsRUFBYztBQUNsRDtBQUNBLFlBQUlELE1BQU1oQixLQUFOLENBQVlrQixVQUFoQixFQUE0QjtBQUMxQixjQUFNWixXQUFXRixZQUFZWSxNQUFNaEIsS0FBTixDQUFZa0IsVUFBeEIsQ0FBakI7O0FBRUE7QUFDQSxjQUFNQyxXQUFXQyxPQUFPQyxNQUFQLENBQ2YsRUFEZSxFQUVmTCxNQUFNaEIsS0FGUyxFQUdmO0FBQ0VzQixxQkFBU2hCLFNBQVNpQixZQUFULEVBRFg7QUFFRUMsbUJBQU9sQixTQUFTa0IsS0FGbEI7QUFHRUMsb0JBQVFuQixTQUFTbUI7QUFIbkIsV0FIZSxFQVFmbkIsU0FBU29CLGlCQUFULEVBUmUsQ0FBakI7O0FBV0EsY0FBTUMsUUFBUSx5QkFBYVgsS0FBYixFQUFvQkcsUUFBcEIsQ0FBZDs7QUFFQSxjQUFNUyxTQUFRO0FBQ1pDLHNCQUFVLFVBREU7QUFFWkMsa0JBQU14QixTQUFTeUIsQ0FGSDtBQUdaQyxpQkFBSzFCLFNBQVMyQixDQUhGO0FBSVpULG1CQUFPbEIsU0FBU2tCLEtBSko7QUFLWkMsb0JBQVFuQixTQUFTbUI7QUFMTCxXQUFkOztBQVFBVCxrQkFBUSwwQkFBYyxLQUFkLEVBQXFCLEVBQUNrQiw2QkFBMkJqQixDQUE1QixFQUFpQ1csYUFBakMsRUFBckIsRUFBOERELEtBQTlELENBQVI7QUFDRDs7QUFFRCxlQUFPWCxLQUFQO0FBQ0QsT0EvQmdCLENBQWpCOztBQWlDQSxVQUFNWSxRQUFRLEVBQUNDLFVBQVUsVUFBWCxFQUF1QkMsTUFBTSxDQUE3QixFQUFnQ0UsS0FBSyxDQUFyQyxFQUFkO0FBQ0FwQixlQUFTdUIsSUFBVCxDQUFjLDBCQUFjLEtBQWQsRUFBcUIsRUFBQ0QsS0FBSyxVQUFOLEVBQWtCTixZQUFsQixFQUFyQixFQUErQ2YsV0FBL0MsQ0FBZDs7QUFFQSxhQUFPRCxRQUFQO0FBQ0Q7Ozs2QkFFUTtBQUNQO0FBQ0E7QUFDQSxVQUFNQSxXQUFXLEtBQUt3Qiw2QkFBTCxFQUFqQjtBQUNBLGFBQU8sMEJBQWMsS0FBZCxFQUFxQixFQUFyQixFQUF5QnhCLFFBQXpCLENBQVA7QUFDRDs7OztFQWxFeUMsZ0JBQU15QixTOztrQkFBN0J0QyxjIiwiZmlsZSI6InZpZXdwb3J0LWxheW91dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwge2NyZWF0ZUVsZW1lbnQsIGNsb25lRWxlbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHtmbGF0dGVufSBmcm9tICcuLi8uLi9jb3JlL3V0aWxzL2ZsYXR0ZW4nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3cG9ydExheW91dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgLy8gSXRlcmF0ZSBvdmVyIHZpZXdwb3J0IGRlc2NyaXB0b3JzIGFuZCByZW5kZXIgdmlld3BvcnRzIGF0IHNwZWNpZmllZCBwb3NpdGlvbnNcbiAgX3JlbmRlckNoaWxkcmVuVW5kZXJWaWV3cG9ydHMoKSB7XG4gICAgLy8gRmxhdHRlbiBvdXQgbmVzdGVkIHZpZXdwb3J0cyBhcnJheVxuICAgIGNvbnN0IHZpZXdwb3J0cyA9IGZsYXR0ZW4odGhpcy5wcm9wcy52aWV3cG9ydHMsIHtmaWx0ZXI6IEJvb2xlYW59KTtcblxuICAgIC8vIEJ1aWxkIGEgdmlld3BvcnQgaWQgdG8gdmlld3BvcnQgaW5kZXhcbiAgICBjb25zdCB2aWV3cG9ydE1hcCA9IHt9O1xuICAgIHZpZXdwb3J0cy5mb3JFYWNoKHZpZXdwb3J0T3JEZXNjcmlwdG9yID0+IHtcbiAgICAgIGNvbnN0IHZpZXdwb3J0ID0gdmlld3BvcnRPckRlc2NyaXB0b3Iudmlld3BvcnQgfHwgdmlld3BvcnRPckRlc2NyaXB0b3I7XG4gICAgICBpZiAodmlld3BvcnQuaWQpIHtcbiAgICAgICAgdmlld3BvcnRNYXBbdmlld3BvcnQuaWRdID0gdmlld3BvcnQ7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBvcmlnaW5hbENoaWxkcmVuID0gUmVhY3QuQ2hpbGRyZW4udG9BcnJheSh0aGlzLnByb3BzLmNoaWxkcmVuKTtcbiAgICBjb25zdCBsYXN0RWxlbWVudCA9IG9yaWdpbmFsQ2hpbGRyZW4ucG9wKCk7XG5cbiAgICBjb25zdCBjaGlsZHJlbiA9IG9yaWdpbmFsQ2hpbGRyZW4ubWFwKChjaGlsZCwgaSkgPT4ge1xuICAgICAgLy8gSWYgdmlld3BvcnRJZCBpcyBwcm92aWRlZCwgbWF0Y2ggd2l0aCB2aWV3cG9ydFxuICAgICAgaWYgKGNoaWxkLnByb3BzLnZpZXdwb3J0SWQpIHtcbiAgICAgICAgY29uc3Qgdmlld3BvcnQgPSB2aWV3cG9ydE1hcFtjaGlsZC5wcm9wcy52aWV3cG9ydElkXTtcblxuICAgICAgICAvLyBUT0RPIC0gdGhpcyBpcyB0b28gcmVhY3QtbWFwLWdsIHNwZWNpZmljXG4gICAgICAgIGNvbnN0IG5ld1Byb3BzID0gT2JqZWN0LmFzc2lnbihcbiAgICAgICAgICB7fSxcbiAgICAgICAgICBjaGlsZC5wcm9wcyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB2aXNpYmxlOiB2aWV3cG9ydC5pc01hcFN5bmNoZWQoKSxcbiAgICAgICAgICAgIHdpZHRoOiB2aWV3cG9ydC53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogdmlld3BvcnQuaGVpZ2h0XG4gICAgICAgICAgfSxcbiAgICAgICAgICB2aWV3cG9ydC5nZXRNZXJjYXRvclBhcmFtcygpXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgY2xvbmUgPSBjbG9uZUVsZW1lbnQoY2hpbGQsIG5ld1Byb3BzKTtcblxuICAgICAgICBjb25zdCBzdHlsZSA9IHtcbiAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICBsZWZ0OiB2aWV3cG9ydC54LFxuICAgICAgICAgIHRvcDogdmlld3BvcnQueSxcbiAgICAgICAgICB3aWR0aDogdmlld3BvcnQud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiB2aWV3cG9ydC5oZWlnaHRcbiAgICAgICAgfTtcblxuICAgICAgICBjaGlsZCA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtrZXk6IGB2aWV3cG9ydC1jb21wb25lbnQtJHtpfWAsIHN0eWxlfSwgY2xvbmUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gY2hpbGQ7XG4gICAgfSk7XG5cbiAgICBjb25zdCBzdHlsZSA9IHtwb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogMCwgdG9wOiAwfTtcbiAgICBjaGlsZHJlbi5wdXNoKGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtrZXk6ICdjaGlsZHJlbicsIHN0eWxlfSwgbGFzdEVsZW1lbnQpKTtcblxuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvLyBSZW5kZXIgdGhlIGJhY2tncm91bmQgZWxlbWVudHMgKHR5cGljYWxseSByZWFjdC1tYXAtZ2wgaW5zdGFuY2VzKVxuICAgIC8vIHVzaW5nIHRoZSB2aWV3cG9ydCBkZXNjcmlwdG9yc1xuICAgIGNvbnN0IGNoaWxkcmVuID0gdGhpcy5fcmVuZGVyQ2hpbGRyZW5VbmRlclZpZXdwb3J0cygpO1xuICAgIHJldHVybiBjcmVhdGVFbGVtZW50KCdkaXYnLCB7fSwgY2hpbGRyZW4pO1xuICB9XG59XG4iXX0=