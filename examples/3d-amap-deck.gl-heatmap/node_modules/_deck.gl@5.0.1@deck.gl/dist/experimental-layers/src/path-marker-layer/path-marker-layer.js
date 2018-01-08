'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _deck = require('deck.gl');

var _pathOutlineLayer = require('../path-outline-layer/path-outline-layer');

var _pathOutlineLayer2 = _interopRequireDefault(_pathOutlineLayer);

var _meshLayer = require('../mesh-layer/mesh-layer');

var _meshLayer2 = _interopRequireDefault(_meshLayer);

var _arrow2dGeometry = require('./arrow-2d-geometry');

var _arrow2dGeometry2 = _interopRequireDefault(_arrow2dGeometry);

var _createPathMarkers = require('./create-path-markers');

var _createPathMarkers2 = _interopRequireDefault(_createPathMarkers);

var _polyline = require('./polyline');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DISTANCE_FOR_MULTI_ARROWS = 0.1;
var ARROW_HEAD_SIZE = 0.2;
var ARROW_TAIL_WIDTH = 0.05;
// const ARROW_CENTER_ADJUST = -0.8;

var DEFAULT_MARKER_LAYER = _meshLayer2.default;

var DEFAULT_MARKER_LAYER_PROPS = {
  mesh: new _arrow2dGeometry2.default({ headSize: ARROW_HEAD_SIZE, tailWidth: ARROW_TAIL_WIDTH })
};

var defaultProps = Object.assign({}, _pathOutlineLayer2.default.defaultProps, {
  MarkerLayer: DEFAULT_MARKER_LAYER,
  markerLayerProps: DEFAULT_MARKER_LAYER_PROPS,

  sizeScale: 100,
  fp64: false,

  hightlightIndex: -1,
  highlightPoint: null,

  getPath: function getPath(x) {
    return x.path;
  },
  getColor: function getColor(x) {
    return x.color;
  },
  getMarkerColor: function getMarkerColor(x) {
    return [0, 0, 0, 255];
  },
  getDirection: function getDirection(x) {
    return x.direction;
  },
  getMarkerPercentages: function getMarkerPercentages(object, _ref) {
    var lineLength = _ref.lineLength;
    return lineLength > DISTANCE_FOR_MULTI_ARROWS ? [0.25, 0.5, 0.75] : [0.5];
  }
});

var PathMarkerLayer = function (_CompositeLayer) {
  _inherits(PathMarkerLayer, _CompositeLayer);

  function PathMarkerLayer() {
    _classCallCheck(this, PathMarkerLayer);

    return _possibleConstructorReturn(this, (PathMarkerLayer.__proto__ || Object.getPrototypeOf(PathMarkerLayer)).apply(this, arguments));
  }

  _createClass(PathMarkerLayer, [{
    key: 'initializeState',
    value: function initializeState() {
      this.state = {
        markers: [],
        mesh: new _arrow2dGeometry2.default({ headSize: ARROW_HEAD_SIZE, tailWidth: ARROW_TAIL_WIDTH }),
        closestPoint: null
      };
    }
  }, {
    key: 'projectFlat',
    value: function projectFlat(xyz, viewport, coordinateSystem, coordinateOrigin) {
      if (coordinateSystem === _deck.COORDINATE_SYSTEM.METER_OFFSETS) {
        var _viewport$metersToLng = viewport.metersToLngLatDelta(xyz),
            _viewport$metersToLng2 = _slicedToArray(_viewport$metersToLng, 2),
            dx = _viewport$metersToLng2[0],
            dy = _viewport$metersToLng2[1];

        var _coordinateOrigin = _slicedToArray(coordinateOrigin, 2),
            x = _coordinateOrigin[0],
            y = _coordinateOrigin[1];

        return viewport.projectFlat([x - dx, dy + y]);
      }

      return viewport.projectFlat(xyz);
    }
  }, {
    key: 'updateState',
    value: function updateState(_ref2) {
      var _this2 = this;

      var props = _ref2.props,
          oldProps = _ref2.oldProps,
          changeFlags = _ref2.changeFlags;

      if (changeFlags.dataChanged) {
        var _props = this.props,
            data = _props.data,
            getPath = _props.getPath,
            getDirection = _props.getDirection,
            getMarkerColor = _props.getMarkerColor,
            getMarkerPercentages = _props.getMarkerPercentages,
            coordinateSystem = _props.coordinateSystem,
            coordinateOrigin = _props.coordinateOrigin;
        var viewport = this.context.viewport;

        var projectFlat = function projectFlat(o) {
          return _this2.projectFlat(o, viewport, coordinateSystem, coordinateOrigin);
        };
        this.state.markers = (0, _createPathMarkers2.default)({
          data: data,
          getPath: getPath,
          getDirection: getDirection,
          getColor: getMarkerColor,
          getMarkerPercentages: getMarkerPercentages,
          projectFlat: projectFlat
        });
        this._recalculateClosestPoint();
      }
      if (changeFlags.propsChanged) {
        if (props.point !== oldProps.point) {
          this._recalculateClosestPoint();
        }
      }
    }
  }, {
    key: '_recalculateClosestPoint',
    value: function _recalculateClosestPoint() {
      var _props2 = this.props,
          highlightPoint = _props2.highlightPoint,
          highlightIndex = _props2.highlightIndex;

      if (highlightPoint && highlightIndex >= 0) {
        var object = this.props.data[highlightIndex];
        var points = this.props.getPath(object);

        var _getClosestPointOnPol = (0, _polyline.getClosestPointOnPolyline)({ points: points, p: highlightPoint }),
            point = _getClosestPointOnPol.point;

        this.state.closestPoints = [{
          position: point
        }];
      } else {
        this.state.closestPoints = [];
      }
    }
  }, {
    key: 'getPickingInfo',
    value: function getPickingInfo(_ref3) {
      var info = _ref3.info;

      return Object.assign(info, {
        // override object with picked feature
        object: info.object && info.object.path || info.object
      });
    }
  }, {
    key: 'renderLayers',
    value: function renderLayers() {
      return [new _pathOutlineLayer2.default(this.getSubLayerProps(Object.assign({}, this.props, {
        id: 'paths',
        fp64: this.props.fp64
      }))), new this.props.MarkerLayer(this.getSubLayerProps(Object.assign({}, this.props.markerLayerProps, {
        id: 'markers',
        data: this.state.markers,
        sizeScale: this.props.sizeScale,
        fp64: this.props.fp64,
        pickable: false,
        parameters: {
          blend: false,
          depthTest: false
        }
      }))), this.state.closestPoints && new _deck.ScatterplotLayer({
        id: this.props.id + '-highlight',
        data: this.state.closestPoints,
        fp64: this.props.fp64
      })];
    }
  }]);

  return PathMarkerLayer;
}(_deck.CompositeLayer);

exports.default = PathMarkerLayer;


PathMarkerLayer.layerName = 'PathMarkerLayer';
PathMarkerLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9leHBlcmltZW50YWwtbGF5ZXJzL3NyYy9wYXRoLW1hcmtlci1sYXllci9wYXRoLW1hcmtlci1sYXllci5qcyJdLCJuYW1lcyI6WyJESVNUQU5DRV9GT1JfTVVMVElfQVJST1dTIiwiQVJST1dfSEVBRF9TSVpFIiwiQVJST1dfVEFJTF9XSURUSCIsIkRFRkFVTFRfTUFSS0VSX0xBWUVSIiwiREVGQVVMVF9NQVJLRVJfTEFZRVJfUFJPUFMiLCJtZXNoIiwiaGVhZFNpemUiLCJ0YWlsV2lkdGgiLCJkZWZhdWx0UHJvcHMiLCJPYmplY3QiLCJhc3NpZ24iLCJNYXJrZXJMYXllciIsIm1hcmtlckxheWVyUHJvcHMiLCJzaXplU2NhbGUiLCJmcDY0IiwiaGlnaHRsaWdodEluZGV4IiwiaGlnaGxpZ2h0UG9pbnQiLCJnZXRQYXRoIiwieCIsInBhdGgiLCJnZXRDb2xvciIsImNvbG9yIiwiZ2V0TWFya2VyQ29sb3IiLCJnZXREaXJlY3Rpb24iLCJkaXJlY3Rpb24iLCJnZXRNYXJrZXJQZXJjZW50YWdlcyIsIm9iamVjdCIsImxpbmVMZW5ndGgiLCJQYXRoTWFya2VyTGF5ZXIiLCJzdGF0ZSIsIm1hcmtlcnMiLCJjbG9zZXN0UG9pbnQiLCJ4eXoiLCJ2aWV3cG9ydCIsImNvb3JkaW5hdGVTeXN0ZW0iLCJjb29yZGluYXRlT3JpZ2luIiwiTUVURVJfT0ZGU0VUUyIsIm1ldGVyc1RvTG5nTGF0RGVsdGEiLCJkeCIsImR5IiwieSIsInByb2plY3RGbGF0IiwicHJvcHMiLCJvbGRQcm9wcyIsImNoYW5nZUZsYWdzIiwiZGF0YUNoYW5nZWQiLCJkYXRhIiwiY29udGV4dCIsIm8iLCJfcmVjYWxjdWxhdGVDbG9zZXN0UG9pbnQiLCJwcm9wc0NoYW5nZWQiLCJwb2ludCIsImhpZ2hsaWdodEluZGV4IiwicG9pbnRzIiwicCIsImNsb3Nlc3RQb2ludHMiLCJwb3NpdGlvbiIsImluZm8iLCJnZXRTdWJMYXllclByb3BzIiwiaWQiLCJwaWNrYWJsZSIsInBhcmFtZXRlcnMiLCJibGVuZCIsImRlcHRoVGVzdCIsImxheWVyTmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUVBOzs7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSw0QkFBNEIsR0FBbEM7QUFDQSxJQUFNQyxrQkFBa0IsR0FBeEI7QUFDQSxJQUFNQyxtQkFBbUIsSUFBekI7QUFDQTs7QUFFQSxJQUFNQywwQ0FBTjs7QUFFQSxJQUFNQyw2QkFBNkI7QUFDakNDLFFBQU0sOEJBQW9CLEVBQUNDLFVBQVVMLGVBQVgsRUFBNEJNLFdBQVdMLGdCQUF2QyxFQUFwQjtBQUQyQixDQUFuQzs7QUFJQSxJQUFNTSxlQUFlQyxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQiwyQkFBaUJGLFlBQW5DLEVBQWlEO0FBQ3BFRyxlQUFhUixvQkFEdUQ7QUFFcEVTLG9CQUFrQlIsMEJBRmtEOztBQUlwRVMsYUFBVyxHQUp5RDtBQUtwRUMsUUFBTSxLQUw4RDs7QUFPcEVDLG1CQUFpQixDQUFDLENBUGtEO0FBUXBFQyxrQkFBZ0IsSUFSb0Q7O0FBVXBFQyxXQUFTO0FBQUEsV0FBS0MsRUFBRUMsSUFBUDtBQUFBLEdBVjJEO0FBV3BFQyxZQUFVO0FBQUEsV0FBS0YsRUFBRUcsS0FBUDtBQUFBLEdBWDBEO0FBWXBFQyxrQkFBZ0I7QUFBQSxXQUFLLENBQUMsQ0FBRCxFQUFJLENBQUosRUFBTyxDQUFQLEVBQVUsR0FBVixDQUFMO0FBQUEsR0Fab0Q7QUFhcEVDLGdCQUFjO0FBQUEsV0FBS0wsRUFBRU0sU0FBUDtBQUFBLEdBYnNEO0FBY3BFQyx3QkFBc0IsOEJBQUNDLE1BQUQ7QUFBQSxRQUFVQyxVQUFWLFFBQVVBLFVBQVY7QUFBQSxXQUNwQkEsYUFBYTNCLHlCQUFiLEdBQXlDLENBQUMsSUFBRCxFQUFPLEdBQVAsRUFBWSxJQUFaLENBQXpDLEdBQTZELENBQUMsR0FBRCxDQUR6QztBQUFBO0FBZDhDLENBQWpELENBQXJCOztJQWtCcUI0QixlOzs7Ozs7Ozs7OztzQ0FDRDtBQUNoQixXQUFLQyxLQUFMLEdBQWE7QUFDWEMsaUJBQVMsRUFERTtBQUVYekIsY0FBTSw4QkFBb0IsRUFBQ0MsVUFBVUwsZUFBWCxFQUE0Qk0sV0FBV0wsZ0JBQXZDLEVBQXBCLENBRks7QUFHWDZCLHNCQUFjO0FBSEgsT0FBYjtBQUtEOzs7Z0NBRVdDLEcsRUFBS0MsUSxFQUFVQyxnQixFQUFrQkMsZ0IsRUFBa0I7QUFDN0QsVUFBSUQscUJBQXFCLHdCQUFrQkUsYUFBM0MsRUFBMEQ7QUFBQSxvQ0FDdkNILFNBQVNJLG1CQUFULENBQTZCTCxHQUE3QixDQUR1QztBQUFBO0FBQUEsWUFDakRNLEVBRGlEO0FBQUEsWUFDN0NDLEVBRDZDOztBQUFBLCtDQUV6Q0osZ0JBRnlDO0FBQUEsWUFFakRqQixDQUZpRDtBQUFBLFlBRTlDc0IsQ0FGOEM7O0FBR3hELGVBQU9QLFNBQVNRLFdBQVQsQ0FBcUIsQ0FBQ3ZCLElBQUlvQixFQUFMLEVBQVNDLEtBQUtDLENBQWQsQ0FBckIsQ0FBUDtBQUNEOztBQUVELGFBQU9QLFNBQVNRLFdBQVQsQ0FBcUJULEdBQXJCLENBQVA7QUFDRDs7O3VDQUUyQztBQUFBOztBQUFBLFVBQS9CVSxLQUErQixTQUEvQkEsS0FBK0I7QUFBQSxVQUF4QkMsUUFBd0IsU0FBeEJBLFFBQXdCO0FBQUEsVUFBZEMsV0FBYyxTQUFkQSxXQUFjOztBQUMxQyxVQUFJQSxZQUFZQyxXQUFoQixFQUE2QjtBQUFBLHFCQVN2QixLQUFLSCxLQVRrQjtBQUFBLFlBRXpCSSxJQUZ5QixVQUV6QkEsSUFGeUI7QUFBQSxZQUd6QjdCLE9BSHlCLFVBR3pCQSxPQUh5QjtBQUFBLFlBSXpCTSxZQUp5QixVQUl6QkEsWUFKeUI7QUFBQSxZQUt6QkQsY0FMeUIsVUFLekJBLGNBTHlCO0FBQUEsWUFNekJHLG9CQU55QixVQU16QkEsb0JBTnlCO0FBQUEsWUFPekJTLGdCQVB5QixVQU96QkEsZ0JBUHlCO0FBQUEsWUFRekJDLGdCQVJ5QixVQVF6QkEsZ0JBUnlCO0FBQUEsWUFVcEJGLFFBVm9CLEdBVVIsS0FBS2MsT0FWRyxDQVVwQmQsUUFWb0I7O0FBVzNCLFlBQU1RLGNBQWMsU0FBZEEsV0FBYztBQUFBLGlCQUFLLE9BQUtBLFdBQUwsQ0FBaUJPLENBQWpCLEVBQW9CZixRQUFwQixFQUE4QkMsZ0JBQTlCLEVBQWdEQyxnQkFBaEQsQ0FBTDtBQUFBLFNBQXBCO0FBQ0EsYUFBS04sS0FBTCxDQUFXQyxPQUFYLEdBQXFCLGlDQUFrQjtBQUNyQ2dCLG9CQURxQztBQUVyQzdCLDBCQUZxQztBQUdyQ00sb0NBSHFDO0FBSXJDSCxvQkFBVUUsY0FKMkI7QUFLckNHLG9EQUxxQztBQU1yQ2dCO0FBTnFDLFNBQWxCLENBQXJCO0FBUUEsYUFBS1Esd0JBQUw7QUFDRDtBQUNELFVBQUlMLFlBQVlNLFlBQWhCLEVBQThCO0FBQzVCLFlBQUlSLE1BQU1TLEtBQU4sS0FBZ0JSLFNBQVNRLEtBQTdCLEVBQW9DO0FBQ2xDLGVBQUtGLHdCQUFMO0FBQ0Q7QUFDRjtBQUNGOzs7K0NBRTBCO0FBQUEsb0JBQ2dCLEtBQUtQLEtBRHJCO0FBQUEsVUFDbEIxQixjQURrQixXQUNsQkEsY0FEa0I7QUFBQSxVQUNGb0MsY0FERSxXQUNGQSxjQURFOztBQUV6QixVQUFJcEMsa0JBQWtCb0Msa0JBQWtCLENBQXhDLEVBQTJDO0FBQ3pDLFlBQU0xQixTQUFTLEtBQUtnQixLQUFMLENBQVdJLElBQVgsQ0FBZ0JNLGNBQWhCLENBQWY7QUFDQSxZQUFNQyxTQUFTLEtBQUtYLEtBQUwsQ0FBV3pCLE9BQVgsQ0FBbUJTLE1BQW5CLENBQWY7O0FBRnlDLG9DQUd6Qix5Q0FBMEIsRUFBQzJCLGNBQUQsRUFBU0MsR0FBR3RDLGNBQVosRUFBMUIsQ0FIeUI7QUFBQSxZQUdsQ21DLEtBSGtDLHlCQUdsQ0EsS0FIa0M7O0FBSXpDLGFBQUt0QixLQUFMLENBQVcwQixhQUFYLEdBQTJCLENBQ3pCO0FBQ0VDLG9CQUFVTDtBQURaLFNBRHlCLENBQTNCO0FBS0QsT0FURCxNQVNPO0FBQ0wsYUFBS3RCLEtBQUwsQ0FBVzBCLGFBQVgsR0FBMkIsRUFBM0I7QUFDRDtBQUNGOzs7MENBRXNCO0FBQUEsVUFBUEUsSUFBTyxTQUFQQSxJQUFPOztBQUNyQixhQUFPaEQsT0FBT0MsTUFBUCxDQUFjK0MsSUFBZCxFQUFvQjtBQUN6QjtBQUNBL0IsZ0JBQVMrQixLQUFLL0IsTUFBTCxJQUFlK0IsS0FBSy9CLE1BQUwsQ0FBWVAsSUFBNUIsSUFBcUNzQyxLQUFLL0I7QUFGekIsT0FBcEIsQ0FBUDtBQUlEOzs7bUNBRWM7QUFDYixhQUFPLENBQ0wsK0JBQ0UsS0FBS2dDLGdCQUFMLENBQ0VqRCxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQixLQUFLZ0MsS0FBdkIsRUFBOEI7QUFDNUJpQixZQUFJLE9BRHdCO0FBRTVCN0MsY0FBTSxLQUFLNEIsS0FBTCxDQUFXNUI7QUFGVyxPQUE5QixDQURGLENBREYsQ0FESyxFQVNMLElBQUksS0FBSzRCLEtBQUwsQ0FBVy9CLFdBQWYsQ0FDRSxLQUFLK0MsZ0JBQUwsQ0FDRWpELE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLEtBQUtnQyxLQUFMLENBQVc5QixnQkFBN0IsRUFBK0M7QUFDN0MrQyxZQUFJLFNBRHlDO0FBRTdDYixjQUFNLEtBQUtqQixLQUFMLENBQVdDLE9BRjRCO0FBRzdDakIsbUJBQVcsS0FBSzZCLEtBQUwsQ0FBVzdCLFNBSHVCO0FBSTdDQyxjQUFNLEtBQUs0QixLQUFMLENBQVc1QixJQUo0QjtBQUs3QzhDLGtCQUFVLEtBTG1DO0FBTTdDQyxvQkFBWTtBQUNWQyxpQkFBTyxLQURHO0FBRVZDLHFCQUFXO0FBRkQ7QUFOaUMsT0FBL0MsQ0FERixDQURGLENBVEssRUF3QkwsS0FBS2xDLEtBQUwsQ0FBVzBCLGFBQVgsSUFDRSwyQkFBcUI7QUFDbkJJLFlBQU8sS0FBS2pCLEtBQUwsQ0FBV2lCLEVBQWxCLGVBRG1CO0FBRW5CYixjQUFNLEtBQUtqQixLQUFMLENBQVcwQixhQUZFO0FBR25CekMsY0FBTSxLQUFLNEIsS0FBTCxDQUFXNUI7QUFIRSxPQUFyQixDQXpCRyxDQUFQO0FBK0JEOzs7Ozs7a0JBeEdrQmMsZTs7O0FBMkdyQkEsZ0JBQWdCb0MsU0FBaEIsR0FBNEIsaUJBQTVCO0FBQ0FwQyxnQkFBZ0JwQixZQUFoQixHQUErQkEsWUFBL0IiLCJmaWxlIjoicGF0aC1tYXJrZXItbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvc2l0ZUxheWVyLCBTY2F0dGVycGxvdExheWVyLCBDT09SRElOQVRFX1NZU1RFTX0gZnJvbSAnZGVjay5nbCc7XG5pbXBvcnQgUGF0aE91dGxpbmVMYXllciBmcm9tICcuLi9wYXRoLW91dGxpbmUtbGF5ZXIvcGF0aC1vdXRsaW5lLWxheWVyJztcbmltcG9ydCBNZXNoTGF5ZXIgZnJvbSAnLi4vbWVzaC1sYXllci9tZXNoLWxheWVyJztcbmltcG9ydCBBcnJvdzJER2VvbWV0cnkgZnJvbSAnLi9hcnJvdy0yZC1nZW9tZXRyeSc7XG5cbmltcG9ydCBjcmVhdGVQYXRoTWFya2VycyBmcm9tICcuL2NyZWF0ZS1wYXRoLW1hcmtlcnMnO1xuaW1wb3J0IHtnZXRDbG9zZXN0UG9pbnRPblBvbHlsaW5lfSBmcm9tICcuL3BvbHlsaW5lJztcblxuY29uc3QgRElTVEFOQ0VfRk9SX01VTFRJX0FSUk9XUyA9IDAuMTtcbmNvbnN0IEFSUk9XX0hFQURfU0laRSA9IDAuMjtcbmNvbnN0IEFSUk9XX1RBSUxfV0lEVEggPSAwLjA1O1xuLy8gY29uc3QgQVJST1dfQ0VOVEVSX0FESlVTVCA9IC0wLjg7XG5cbmNvbnN0IERFRkFVTFRfTUFSS0VSX0xBWUVSID0gTWVzaExheWVyO1xuXG5jb25zdCBERUZBVUxUX01BUktFUl9MQVlFUl9QUk9QUyA9IHtcbiAgbWVzaDogbmV3IEFycm93MkRHZW9tZXRyeSh7aGVhZFNpemU6IEFSUk9XX0hFQURfU0laRSwgdGFpbFdpZHRoOiBBUlJPV19UQUlMX1dJRFRIfSlcbn07XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIFBhdGhPdXRsaW5lTGF5ZXIuZGVmYXVsdFByb3BzLCB7XG4gIE1hcmtlckxheWVyOiBERUZBVUxUX01BUktFUl9MQVlFUixcbiAgbWFya2VyTGF5ZXJQcm9wczogREVGQVVMVF9NQVJLRVJfTEFZRVJfUFJPUFMsXG5cbiAgc2l6ZVNjYWxlOiAxMDAsXG4gIGZwNjQ6IGZhbHNlLFxuXG4gIGhpZ2h0bGlnaHRJbmRleDogLTEsXG4gIGhpZ2hsaWdodFBvaW50OiBudWxsLFxuXG4gIGdldFBhdGg6IHggPT4geC5wYXRoLFxuICBnZXRDb2xvcjogeCA9PiB4LmNvbG9yLFxuICBnZXRNYXJrZXJDb2xvcjogeCA9PiBbMCwgMCwgMCwgMjU1XSxcbiAgZ2V0RGlyZWN0aW9uOiB4ID0+IHguZGlyZWN0aW9uLFxuICBnZXRNYXJrZXJQZXJjZW50YWdlczogKG9iamVjdCwge2xpbmVMZW5ndGh9KSA9PlxuICAgIGxpbmVMZW5ndGggPiBESVNUQU5DRV9GT1JfTVVMVElfQVJST1dTID8gWzAuMjUsIDAuNSwgMC43NV0gOiBbMC41XVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhdGhNYXJrZXJMYXllciBleHRlbmRzIENvbXBvc2l0ZUxheWVyIHtcbiAgaW5pdGlhbGl6ZVN0YXRlKCkge1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBtYXJrZXJzOiBbXSxcbiAgICAgIG1lc2g6IG5ldyBBcnJvdzJER2VvbWV0cnkoe2hlYWRTaXplOiBBUlJPV19IRUFEX1NJWkUsIHRhaWxXaWR0aDogQVJST1dfVEFJTF9XSURUSH0pLFxuICAgICAgY2xvc2VzdFBvaW50OiBudWxsXG4gICAgfTtcbiAgfVxuXG4gIHByb2plY3RGbGF0KHh5eiwgdmlld3BvcnQsIGNvb3JkaW5hdGVTeXN0ZW0sIGNvb3JkaW5hdGVPcmlnaW4pIHtcbiAgICBpZiAoY29vcmRpbmF0ZVN5c3RlbSA9PT0gQ09PUkRJTkFURV9TWVNURU0uTUVURVJfT0ZGU0VUUykge1xuICAgICAgY29uc3QgW2R4LCBkeV0gPSB2aWV3cG9ydC5tZXRlcnNUb0xuZ0xhdERlbHRhKHh5eik7XG4gICAgICBjb25zdCBbeCwgeV0gPSBjb29yZGluYXRlT3JpZ2luO1xuICAgICAgcmV0dXJuIHZpZXdwb3J0LnByb2plY3RGbGF0KFt4IC0gZHgsIGR5ICsgeV0pO1xuICAgIH1cblxuICAgIHJldHVybiB2aWV3cG9ydC5wcm9qZWN0RmxhdCh4eXopO1xuICB9XG5cbiAgdXBkYXRlU3RhdGUoe3Byb3BzLCBvbGRQcm9wcywgY2hhbmdlRmxhZ3N9KSB7XG4gICAgaWYgKGNoYW5nZUZsYWdzLmRhdGFDaGFuZ2VkKSB7XG4gICAgICBjb25zdCB7XG4gICAgICAgIGRhdGEsXG4gICAgICAgIGdldFBhdGgsXG4gICAgICAgIGdldERpcmVjdGlvbixcbiAgICAgICAgZ2V0TWFya2VyQ29sb3IsXG4gICAgICAgIGdldE1hcmtlclBlcmNlbnRhZ2VzLFxuICAgICAgICBjb29yZGluYXRlU3lzdGVtLFxuICAgICAgICBjb29yZGluYXRlT3JpZ2luXG4gICAgICB9ID0gdGhpcy5wcm9wcztcbiAgICAgIGNvbnN0IHt2aWV3cG9ydH0gPSB0aGlzLmNvbnRleHQ7XG4gICAgICBjb25zdCBwcm9qZWN0RmxhdCA9IG8gPT4gdGhpcy5wcm9qZWN0RmxhdChvLCB2aWV3cG9ydCwgY29vcmRpbmF0ZVN5c3RlbSwgY29vcmRpbmF0ZU9yaWdpbik7XG4gICAgICB0aGlzLnN0YXRlLm1hcmtlcnMgPSBjcmVhdGVQYXRoTWFya2Vycyh7XG4gICAgICAgIGRhdGEsXG4gICAgICAgIGdldFBhdGgsXG4gICAgICAgIGdldERpcmVjdGlvbixcbiAgICAgICAgZ2V0Q29sb3I6IGdldE1hcmtlckNvbG9yLFxuICAgICAgICBnZXRNYXJrZXJQZXJjZW50YWdlcyxcbiAgICAgICAgcHJvamVjdEZsYXRcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fcmVjYWxjdWxhdGVDbG9zZXN0UG9pbnQoKTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZUZsYWdzLnByb3BzQ2hhbmdlZCkge1xuICAgICAgaWYgKHByb3BzLnBvaW50ICE9PSBvbGRQcm9wcy5wb2ludCkge1xuICAgICAgICB0aGlzLl9yZWNhbGN1bGF0ZUNsb3Nlc3RQb2ludCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9yZWNhbGN1bGF0ZUNsb3Nlc3RQb2ludCgpIHtcbiAgICBjb25zdCB7aGlnaGxpZ2h0UG9pbnQsIGhpZ2hsaWdodEluZGV4fSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKGhpZ2hsaWdodFBvaW50ICYmIGhpZ2hsaWdodEluZGV4ID49IDApIHtcbiAgICAgIGNvbnN0IG9iamVjdCA9IHRoaXMucHJvcHMuZGF0YVtoaWdobGlnaHRJbmRleF07XG4gICAgICBjb25zdCBwb2ludHMgPSB0aGlzLnByb3BzLmdldFBhdGgob2JqZWN0KTtcbiAgICAgIGNvbnN0IHtwb2ludH0gPSBnZXRDbG9zZXN0UG9pbnRPblBvbHlsaW5lKHtwb2ludHMsIHA6IGhpZ2hsaWdodFBvaW50fSk7XG4gICAgICB0aGlzLnN0YXRlLmNsb3Nlc3RQb2ludHMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICBwb3NpdGlvbjogcG9pbnRcbiAgICAgICAgfVxuICAgICAgXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGF0ZS5jbG9zZXN0UG9pbnRzID0gW107XG4gICAgfVxuICB9XG5cbiAgZ2V0UGlja2luZ0luZm8oe2luZm99KSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oaW5mbywge1xuICAgICAgLy8gb3ZlcnJpZGUgb2JqZWN0IHdpdGggcGlja2VkIGZlYXR1cmVcbiAgICAgIG9iamVjdDogKGluZm8ub2JqZWN0ICYmIGluZm8ub2JqZWN0LnBhdGgpIHx8IGluZm8ub2JqZWN0XG4gICAgfSk7XG4gIH1cblxuICByZW5kZXJMYXllcnMoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIG5ldyBQYXRoT3V0bGluZUxheWVyKFxuICAgICAgICB0aGlzLmdldFN1YkxheWVyUHJvcHMoXG4gICAgICAgICAgT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wcm9wcywge1xuICAgICAgICAgICAgaWQ6ICdwYXRocycsXG4gICAgICAgICAgICBmcDY0OiB0aGlzLnByb3BzLmZwNjRcbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgbmV3IHRoaXMucHJvcHMuTWFya2VyTGF5ZXIoXG4gICAgICAgIHRoaXMuZ2V0U3ViTGF5ZXJQcm9wcyhcbiAgICAgICAgICBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnByb3BzLm1hcmtlckxheWVyUHJvcHMsIHtcbiAgICAgICAgICAgIGlkOiAnbWFya2VycycsXG4gICAgICAgICAgICBkYXRhOiB0aGlzLnN0YXRlLm1hcmtlcnMsXG4gICAgICAgICAgICBzaXplU2NhbGU6IHRoaXMucHJvcHMuc2l6ZVNjYWxlLFxuICAgICAgICAgICAgZnA2NDogdGhpcy5wcm9wcy5mcDY0LFxuICAgICAgICAgICAgcGlja2FibGU6IGZhbHNlLFxuICAgICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgICBibGVuZDogZmFsc2UsXG4gICAgICAgICAgICAgIGRlcHRoVGVzdDogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICApXG4gICAgICApLFxuICAgICAgdGhpcy5zdGF0ZS5jbG9zZXN0UG9pbnRzICYmXG4gICAgICAgIG5ldyBTY2F0dGVycGxvdExheWVyKHtcbiAgICAgICAgICBpZDogYCR7dGhpcy5wcm9wcy5pZH0taGlnaGxpZ2h0YCxcbiAgICAgICAgICBkYXRhOiB0aGlzLnN0YXRlLmNsb3Nlc3RQb2ludHMsXG4gICAgICAgICAgZnA2NDogdGhpcy5wcm9wcy5mcDY0XG4gICAgICAgIH0pXG4gICAgXTtcbiAgfVxufVxuXG5QYXRoTWFya2VyTGF5ZXIubGF5ZXJOYW1lID0gJ1BhdGhNYXJrZXJMYXllcic7XG5QYXRoTWFya2VyTGF5ZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19