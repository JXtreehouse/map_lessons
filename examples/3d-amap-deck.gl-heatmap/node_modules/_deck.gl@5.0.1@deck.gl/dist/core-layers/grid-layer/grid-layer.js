'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _core = require('../../core');

var _gridCellLayer = require('../grid-cell-layer/grid-cell-layer');

var _gridCellLayer2 = _interopRequireDefault(_gridCellLayer);

var _gridAggregator = require('./grid-aggregator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

var BinSorter = _core.experimental.BinSorter,
    defaultColorRange = _core.experimental.defaultColorRange,
    getQuantizeScale = _core.experimental.getQuantizeScale,
    getLinearScale = _core.experimental.getLinearScale;


function nop() {}

var defaultProps = {
  // color
  colorDomain: null,
  colorRange: defaultColorRange,
  getColorValue: function getColorValue(points) {
    return points.length;
  },
  lowerPercentile: 0,
  upperPercentile: 100,
  onSetColorDomain: nop,

  // elevation
  elevationDomain: null,
  elevationRange: [0, 1000],
  getElevationValue: function getElevationValue(points) {
    return points.length;
  },
  elevationLowerPercentile: 0,
  elevationUpperPercentile: 100,
  elevationScale: 1,
  onSetElevationDomain: nop,

  // grid
  cellSize: 1000,
  coverage: 1,
  getPosition: function getPosition(x) {
    return x.position;
  },
  extruded: false,
  fp64: false,
  // Optional settings for 'lighting' shader module
  lightSettings: {
    lightsPosition: [-122.45, 37.75, 8000, -122.0, 38.0, 5000],
    ambientRatio: 0.05,
    diffuseRatio: 0.6,
    specularRatio: 0.8,
    lightsStrength: [2.0, 0.0, 0.0, 0.0],
    numberOfLights: 2
  }
};

var GridLayer = function (_CompositeLayer) {
  _inherits(GridLayer, _CompositeLayer);

  function GridLayer() {
    _classCallCheck(this, GridLayer);

    return _possibleConstructorReturn(this, (GridLayer.__proto__ || Object.getPrototypeOf(GridLayer)).apply(this, arguments));
  }

  _createClass(GridLayer, [{
    key: 'initializeState',
    value: function initializeState() {
      this.state = {
        layerData: [],
        sortedColorBins: null,
        sortedElevationBins: null,
        colorValueDomain: null,
        elevationValueDomain: null,
        colorScaleFunc: nop,
        elevationScaleFunc: nop,
        dimensionUpdaters: this.getDimensionUpdaters()
      };
    }
  }, {
    key: 'updateState',
    value: function updateState(_ref) {
      var _this2 = this;

      var oldProps = _ref.oldProps,
          props = _ref.props,
          changeFlags = _ref.changeFlags;

      var dimensionChanges = this.getDimensionChanges(oldProps, props);

      if (changeFlags.dataChanged || this.needsReProjectPoints(oldProps, props)) {
        // project data into hexagons, and get sortedBins
        this.getLayerData();
      } else if (dimensionChanges) {
        dimensionChanges.forEach(function (f) {
          return typeof f === 'function' && f.apply(_this2);
        });
      }
    }
  }, {
    key: 'needsReProjectPoints',
    value: function needsReProjectPoints(oldProps, props) {
      return oldProps.cellSize !== props.cellSize;
    }
  }, {
    key: 'getDimensionUpdaters',
    value: function getDimensionUpdaters() {
      // dimension updaters are sequential,
      // if the first one needs to be called, the 2nd and 3rd one will automatically
      // be called. e.g. if ColorValue needs to be updated, getColorValueDomain and getColorScale
      // will automatically be called
      return {
        getColor: [{
          id: 'value',
          triggers: ['getColorValue'],
          updater: this.getSortedColorBins
        }, {
          id: 'domain',
          triggers: ['lowerPercentile', 'upperPercentile'],
          updater: this.getColorValueDomain
        }, {
          id: 'scaleFunc',
          triggers: ['colorDomain', 'colorRange'],
          updater: this.getColorScale
        }],
        getElevation: [{
          id: 'value',
          triggers: ['getElevationValue'],
          updater: this.getSortedElevationBins
        }, {
          id: 'domain',
          triggers: ['elevationLowerPercentile', 'elevationUpperPercentile'],
          updater: this.getElevationValueDomain
        }, {
          id: 'scaleFunc',
          triggers: ['elevationDomain', 'elevationRange'],
          updater: this.getElevationScale
        }]
      };
    }
  }, {
    key: 'getDimensionChanges',
    value: function getDimensionChanges(oldProps, props) {
      var dimensionUpdaters = this.state.dimensionUpdaters;

      var updaters = [];

      // get dimension to be updated
      for (var dimensionKey in dimensionUpdaters) {
        // return the first triggered updater for each dimension
        var needUpdate = dimensionUpdaters[dimensionKey].find(function (item) {
          return item.triggers.some(function (t) {
            return oldProps[t] !== props[t];
          });
        });

        if (needUpdate) {
          updaters.push(needUpdate.updater);
        }
      }

      return updaters.length ? updaters : null;
    }
  }, {
    key: 'getPickingInfo',
    value: function getPickingInfo(_ref2) {
      var info = _ref2.info;
      var _state = this.state,
          sortedColorBins = _state.sortedColorBins,
          sortedElevationBins = _state.sortedElevationBins;


      var isPicked = info.picked && info.index > -1;
      var object = null;

      if (isPicked) {
        var cell = this.state.layerData[info.index];

        var colorValue = sortedColorBins.binMap[cell.index] && sortedColorBins.binMap[cell.index].value;
        var elevationValue = sortedElevationBins.binMap[cell.index] && sortedElevationBins.binMap[cell.index].value;

        object = Object.assign({
          colorValue: colorValue,
          elevationValue: elevationValue
        }, cell);
      }

      // add bin colorValue and elevationValue to info
      return Object.assign(info, {
        picked: Boolean(object),
        // override object with picked cell
        object: object
      });
    }
  }, {
    key: 'getUpdateTriggers',
    value: function getUpdateTriggers() {
      var _this3 = this;

      var dimensionUpdaters = this.state.dimensionUpdaters;

      // merge all dimension triggers

      var updateTriggers = {};

      var _loop = function _loop(dimensionKey) {
        updateTriggers[dimensionKey] = {};

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = dimensionUpdaters[dimensionKey][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var step = _step.value;

            step.triggers.forEach(function (prop) {
              updateTriggers[dimensionKey][prop] = _this3.props[prop];
            });
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      };

      for (var dimensionKey in dimensionUpdaters) {
        _loop(dimensionKey);
      }

      return updateTriggers;
    }
  }, {
    key: 'getLayerData',
    value: function getLayerData() {
      var _props = this.props,
          data = _props.data,
          cellSize = _props.cellSize,
          getPosition = _props.getPosition;

      var _pointToDensityGridDa = (0, _gridAggregator.pointToDensityGridData)(data, cellSize, getPosition),
          layerData = _pointToDensityGridDa.layerData;

      this.setState({ layerData: layerData });
      this.getSortedBins();
    }
  }, {
    key: 'getValueDomain',
    value: function getValueDomain() {
      this.getColorValueDomain();
      this.getElevationValueDomain();
    }
  }, {
    key: 'getSortedBins',
    value: function getSortedBins() {
      this.getSortedColorBins();
      this.getSortedElevationBins();
    }
  }, {
    key: 'getSortedColorBins',
    value: function getSortedColorBins() {
      var getColorValue = this.props.getColorValue;

      var sortedColorBins = new BinSorter(this.state.layerData || [], getColorValue);

      this.setState({ sortedColorBins: sortedColorBins });
      this.getColorValueDomain();
    }
  }, {
    key: 'getSortedElevationBins',
    value: function getSortedElevationBins() {
      var getElevationValue = this.props.getElevationValue;

      var sortedElevationBins = new BinSorter(this.state.layerData || [], getElevationValue);
      this.setState({ sortedElevationBins: sortedElevationBins });
      this.getElevationValueDomain();
    }
  }, {
    key: 'getColorValueDomain',
    value: function getColorValueDomain() {
      var _props2 = this.props,
          lowerPercentile = _props2.lowerPercentile,
          upperPercentile = _props2.upperPercentile,
          onSetColorDomain = _props2.onSetColorDomain;


      this.state.colorValueDomain = this.state.sortedColorBins.getValueRange([lowerPercentile, upperPercentile]);

      if (typeof onSetColorDomain === 'function') {
        onSetColorDomain(this.state.colorValueDomain);
      }

      this.getColorScale();
    }
  }, {
    key: 'getElevationValueDomain',
    value: function getElevationValueDomain() {
      var _props3 = this.props,
          elevationLowerPercentile = _props3.elevationLowerPercentile,
          elevationUpperPercentile = _props3.elevationUpperPercentile,
          onSetElevationDomain = _props3.onSetElevationDomain;


      this.state.elevationValueDomain = this.state.sortedElevationBins.getValueRange([elevationLowerPercentile, elevationUpperPercentile]);

      if (typeof onSetElevationDomain === 'function') {
        onSetElevationDomain(this.state.elevationValueDomain);
      }

      this.getElevationScale();
    }
  }, {
    key: 'getColorScale',
    value: function getColorScale() {
      var colorRange = this.props.colorRange;

      var colorDomain = this.props.colorDomain || this.state.colorValueDomain;

      this.state.colorScaleFunc = getQuantizeScale(colorDomain, colorRange);
    }
  }, {
    key: 'getElevationScale',
    value: function getElevationScale() {
      var elevationRange = this.props.elevationRange;

      var elevationDomain = this.props.elevationDomain || this.state.elevationValueDomain;

      this.state.elevationScaleFunc = getLinearScale(elevationDomain, elevationRange);
    }
  }, {
    key: '_onGetSublayerColor',
    value: function _onGetSublayerColor(cell) {
      var _state2 = this.state,
          sortedColorBins = _state2.sortedColorBins,
          colorScaleFunc = _state2.colorScaleFunc,
          colorValueDomain = _state2.colorValueDomain;


      var cv = sortedColorBins.binMap[cell.index] && sortedColorBins.binMap[cell.index].value;
      var colorDomain = this.props.colorDomain || colorValueDomain;

      var isColorValueInDomain = cv >= colorDomain[0] && cv <= colorDomain[colorDomain.length - 1];

      // if cell value is outside domain, set alpha to 0
      var color = isColorValueInDomain ? colorScaleFunc(cv) : [0, 0, 0, 0];

      // add alpha to color if not defined in colorRange
      color[3] = Number.isFinite(color[3]) ? color[3] : 255;

      return color;
    }
  }, {
    key: '_onGetSublayerElevation',
    value: function _onGetSublayerElevation(cell) {
      var _state3 = this.state,
          sortedElevationBins = _state3.sortedElevationBins,
          elevationScaleFunc = _state3.elevationScaleFunc,
          elevationValueDomain = _state3.elevationValueDomain;

      var ev = sortedElevationBins.binMap[cell.index] && sortedElevationBins.binMap[cell.index].value;

      var elevationDomain = this.props.elevationDomain || elevationValueDomain;

      var isElevationValueInDomain = ev >= elevationDomain[0] && ev <= elevationDomain[elevationDomain.length - 1];

      // if cell value is outside domain, set elevation to -1
      return isElevationValueInDomain ? elevationScaleFunc(ev) : -1;
    }

    // for subclassing, override this method to return
    // customized sub layer props

  }, {
    key: 'getSubLayerProps',
    value: function getSubLayerProps() {
      var _props4 = this.props,
          elevationScale = _props4.elevationScale,
          fp64 = _props4.fp64,
          extruded = _props4.extruded,
          cellSize = _props4.cellSize,
          coverage = _props4.coverage,
          lightSettings = _props4.lightSettings;

      // return props to the sublayer constructor

      return _get(GridLayer.prototype.__proto__ || Object.getPrototypeOf(GridLayer.prototype), 'getSubLayerProps', this).call(this, {
        id: 'grid-cell',
        data: this.state.layerData,

        fp64: fp64,
        cellSize: cellSize,
        coverage: coverage,
        lightSettings: lightSettings,
        elevationScale: elevationScale,
        extruded: extruded,

        getColor: this._onGetSublayerColor.bind(this),
        getElevation: this._onGetSublayerElevation.bind(this),
        updateTriggers: this.getUpdateTriggers()
      });
    }

    // for subclassing, override this method to return
    // customized sub layer class

  }, {
    key: 'getSubLayerClass',
    value: function getSubLayerClass() {
      return _gridCellLayer2.default;
    }
  }, {
    key: 'renderLayers',
    value: function renderLayers() {
      var SubLayerClass = this.getSubLayerClass();

      return new SubLayerClass(this.getSubLayerProps());
    }
  }]);

  return GridLayer;
}(_core.CompositeLayer);

exports.default = GridLayer;


GridLayer.layerName = 'GridLayer';
GridLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlLWxheWVycy9ncmlkLWxheWVyL2dyaWQtbGF5ZXIuanMiXSwibmFtZXMiOlsiQmluU29ydGVyIiwiZGVmYXVsdENvbG9yUmFuZ2UiLCJnZXRRdWFudGl6ZVNjYWxlIiwiZ2V0TGluZWFyU2NhbGUiLCJub3AiLCJkZWZhdWx0UHJvcHMiLCJjb2xvckRvbWFpbiIsImNvbG9yUmFuZ2UiLCJnZXRDb2xvclZhbHVlIiwicG9pbnRzIiwibGVuZ3RoIiwibG93ZXJQZXJjZW50aWxlIiwidXBwZXJQZXJjZW50aWxlIiwib25TZXRDb2xvckRvbWFpbiIsImVsZXZhdGlvbkRvbWFpbiIsImVsZXZhdGlvblJhbmdlIiwiZ2V0RWxldmF0aW9uVmFsdWUiLCJlbGV2YXRpb25Mb3dlclBlcmNlbnRpbGUiLCJlbGV2YXRpb25VcHBlclBlcmNlbnRpbGUiLCJlbGV2YXRpb25TY2FsZSIsIm9uU2V0RWxldmF0aW9uRG9tYWluIiwiY2VsbFNpemUiLCJjb3ZlcmFnZSIsImdldFBvc2l0aW9uIiwieCIsInBvc2l0aW9uIiwiZXh0cnVkZWQiLCJmcDY0IiwibGlnaHRTZXR0aW5ncyIsImxpZ2h0c1Bvc2l0aW9uIiwiYW1iaWVudFJhdGlvIiwiZGlmZnVzZVJhdGlvIiwic3BlY3VsYXJSYXRpbyIsImxpZ2h0c1N0cmVuZ3RoIiwibnVtYmVyT2ZMaWdodHMiLCJHcmlkTGF5ZXIiLCJzdGF0ZSIsImxheWVyRGF0YSIsInNvcnRlZENvbG9yQmlucyIsInNvcnRlZEVsZXZhdGlvbkJpbnMiLCJjb2xvclZhbHVlRG9tYWluIiwiZWxldmF0aW9uVmFsdWVEb21haW4iLCJjb2xvclNjYWxlRnVuYyIsImVsZXZhdGlvblNjYWxlRnVuYyIsImRpbWVuc2lvblVwZGF0ZXJzIiwiZ2V0RGltZW5zaW9uVXBkYXRlcnMiLCJvbGRQcm9wcyIsInByb3BzIiwiY2hhbmdlRmxhZ3MiLCJkaW1lbnNpb25DaGFuZ2VzIiwiZ2V0RGltZW5zaW9uQ2hhbmdlcyIsImRhdGFDaGFuZ2VkIiwibmVlZHNSZVByb2plY3RQb2ludHMiLCJnZXRMYXllckRhdGEiLCJmb3JFYWNoIiwiZiIsImFwcGx5IiwiZ2V0Q29sb3IiLCJpZCIsInRyaWdnZXJzIiwidXBkYXRlciIsImdldFNvcnRlZENvbG9yQmlucyIsImdldENvbG9yVmFsdWVEb21haW4iLCJnZXRDb2xvclNjYWxlIiwiZ2V0RWxldmF0aW9uIiwiZ2V0U29ydGVkRWxldmF0aW9uQmlucyIsImdldEVsZXZhdGlvblZhbHVlRG9tYWluIiwiZ2V0RWxldmF0aW9uU2NhbGUiLCJ1cGRhdGVycyIsImRpbWVuc2lvbktleSIsIm5lZWRVcGRhdGUiLCJmaW5kIiwiaXRlbSIsInNvbWUiLCJ0IiwicHVzaCIsImluZm8iLCJpc1BpY2tlZCIsInBpY2tlZCIsImluZGV4Iiwib2JqZWN0IiwiY2VsbCIsImNvbG9yVmFsdWUiLCJiaW5NYXAiLCJ2YWx1ZSIsImVsZXZhdGlvblZhbHVlIiwiT2JqZWN0IiwiYXNzaWduIiwiQm9vbGVhbiIsInVwZGF0ZVRyaWdnZXJzIiwic3RlcCIsInByb3AiLCJkYXRhIiwic2V0U3RhdGUiLCJnZXRTb3J0ZWRCaW5zIiwiZ2V0VmFsdWVSYW5nZSIsImN2IiwiaXNDb2xvclZhbHVlSW5Eb21haW4iLCJjb2xvciIsIk51bWJlciIsImlzRmluaXRlIiwiZXYiLCJpc0VsZXZhdGlvblZhbHVlSW5Eb21haW4iLCJfb25HZXRTdWJsYXllckNvbG9yIiwiYmluZCIsIl9vbkdldFN1YmxheWVyRWxldmF0aW9uIiwiZ2V0VXBkYXRlVHJpZ2dlcnMiLCJTdWJMYXllckNsYXNzIiwiZ2V0U3ViTGF5ZXJDbGFzcyIsImdldFN1YkxheWVyUHJvcHMiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFvQkE7O0FBR0E7Ozs7QUFFQTs7Ozs7Ozs7K2VBekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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TywwQkFUNEI7O0FBVzVCK0Isa0JBQVUsS0FBSzhDLG1CQUFMLENBQXlCQyxJQUF6QixDQUE4QixJQUE5QixDQVhrQjtBQVk1QnhDLHNCQUFjLEtBQUt5Qyx1QkFBTCxDQUE2QkQsSUFBN0IsQ0FBa0MsSUFBbEMsQ0FaYztBQWE1QmYsd0JBQWdCLEtBQUtpQixpQkFBTDtBQWJZLE9BQTlCO0FBZUQ7O0FBRUQ7QUFDQTs7Ozt1Q0FDbUI7QUFDakI7QUFDRDs7O21DQUVjO0FBQ2IsVUFBTUMsZ0JBQWdCLEtBQUtDLGdCQUFMLEVBQXRCOztBQUVBLGFBQU8sSUFBSUQsYUFBSixDQUFrQixLQUFLRSxnQkFBTCxFQUFsQixDQUFQO0FBQ0Q7Ozs7OztrQkExUmtCMUUsUzs7O0FBNlJyQkEsVUFBVTJFLFNBQVYsR0FBc0IsV0FBdEI7QUFDQTNFLFVBQVU5QixZQUFWLEdBQXlCQSxZQUF6QiIsImZpbGUiOiJncmlkLWxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IC0gMjAxNyBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7Q29tcG9zaXRlTGF5ZXIsIGV4cGVyaW1lbnRhbH0gZnJvbSAnLi4vLi4vY29yZSc7XG5jb25zdCB7QmluU29ydGVyLCBkZWZhdWx0Q29sb3JSYW5nZSwgZ2V0UXVhbnRpemVTY2FsZSwgZ2V0TGluZWFyU2NhbGV9ID0gZXhwZXJpbWVudGFsO1xuXG5pbXBvcnQgR3JpZENlbGxMYXllciBmcm9tICcuLi9ncmlkLWNlbGwtbGF5ZXIvZ3JpZC1jZWxsLWxheWVyJztcblxuaW1wb3J0IHtwb2ludFRvRGVuc2l0eUdyaWREYXRhfSBmcm9tICcuL2dyaWQtYWdncmVnYXRvcic7XG5cbmZ1bmN0aW9uIG5vcCgpIHt9XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgLy8gY29sb3JcbiAgY29sb3JEb21haW46IG51bGwsXG4gIGNvbG9yUmFuZ2U6IGRlZmF1bHRDb2xvclJhbmdlLFxuICBnZXRDb2xvclZhbHVlOiBwb2ludHMgPT4gcG9pbnRzLmxlbmd0aCxcbiAgbG93ZXJQZXJjZW50aWxlOiAwLFxuICB1cHBlclBlcmNlbnRpbGU6IDEwMCxcbiAgb25TZXRDb2xvckRvbWFpbjogbm9wLFxuXG4gIC8vIGVsZXZhdGlvblxuICBlbGV2YXRpb25Eb21haW46IG51bGwsXG4gIGVsZXZhdGlvblJhbmdlOiBbMCwgMTAwMF0sXG4gIGdldEVsZXZhdGlvblZhbHVlOiBwb2ludHMgPT4gcG9pbnRzLmxlbmd0aCxcbiAgZWxldmF0aW9uTG93ZXJQZXJjZW50aWxlOiAwLFxuICBlbGV2YXRpb25VcHBlclBlcmNlbnRpbGU6IDEwMCxcbiAgZWxldmF0aW9uU2NhbGU6IDEsXG4gIG9uU2V0RWxldmF0aW9uRG9tYWluOiBub3AsXG5cbiAgLy8gZ3JpZFxuICBjZWxsU2l6ZTogMTAwMCxcbiAgY292ZXJhZ2U6IDEsXG4gIGdldFBvc2l0aW9uOiB4ID0+IHgucG9zaXRpb24sXG4gIGV4dHJ1ZGVkOiBmYWxzZSxcbiAgZnA2NDogZmFsc2UsXG4gIC8vIE9wdGlvbmFsIHNldHRpbmdzIGZvciAnbGlnaHRpbmcnIHNoYWRlciBtb2R1bGVcbiAgbGlnaHRTZXR0aW5nczoge1xuICAgIGxpZ2h0c1Bvc2l0aW9uOiBbLTEyMi40NSwgMzcuNzUsIDgwMDAsIC0xMjIuMCwgMzguMCwgNTAwMF0sXG4gICAgYW1iaWVudFJhdGlvOiAwLjA1LFxuICAgIGRpZmZ1c2VSYXRpbzogMC42LFxuICAgIHNwZWN1bGFyUmF0aW86IDAuOCxcbiAgICBsaWdodHNTdHJlbmd0aDogWzIuMCwgMC4wLCAwLjAsIDAuMF0sXG4gICAgbnVtYmVyT2ZMaWdodHM6IDJcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZExheWVyIGV4dGVuZHMgQ29tcG9zaXRlTGF5ZXIge1xuICBpbml0aWFsaXplU3RhdGUoKSB7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGxheWVyRGF0YTogW10sXG4gICAgICBzb3J0ZWRDb2xvckJpbnM6IG51bGwsXG4gICAgICBzb3J0ZWRFbGV2YXRpb25CaW5zOiBudWxsLFxuICAgICAgY29sb3JWYWx1ZURvbWFpbjogbnVsbCxcbiAgICAgIGVsZXZhdGlvblZhbHVlRG9tYWluOiBudWxsLFxuICAgICAgY29sb3JTY2FsZUZ1bmM6IG5vcCxcbiAgICAgIGVsZXZhdGlvblNjYWxlRnVuYzogbm9wLFxuICAgICAgZGltZW5zaW9uVXBkYXRlcnM6IHRoaXMuZ2V0RGltZW5zaW9uVXBkYXRlcnMoKVxuICAgIH07XG4gIH1cblxuICB1cGRhdGVTdGF0ZSh7b2xkUHJvcHMsIHByb3BzLCBjaGFuZ2VGbGFnc30pIHtcbiAgICBjb25zdCBkaW1lbnNpb25DaGFuZ2VzID0gdGhpcy5nZXREaW1lbnNpb25DaGFuZ2VzKG9sZFByb3BzLCBwcm9wcyk7XG5cbiAgICBpZiAoY2hhbmdlRmxhZ3MuZGF0YUNoYW5nZWQgfHwgdGhpcy5uZWVkc1JlUHJvamVjdFBvaW50cyhvbGRQcm9wcywgcHJvcHMpKSB7XG4gICAgICAvLyBwcm9qZWN0IGRhdGEgaW50byBoZXhhZ29ucywgYW5kIGdldCBzb3J0ZWRCaW5zXG4gICAgICB0aGlzLmdldExheWVyRGF0YSgpO1xuICAgIH0gZWxzZSBpZiAoZGltZW5zaW9uQ2hhbmdlcykge1xuICAgICAgZGltZW5zaW9uQ2hhbmdlcy5mb3JFYWNoKGYgPT4gdHlwZW9mIGYgPT09ICdmdW5jdGlvbicgJiYgZi5hcHBseSh0aGlzKSk7XG4gICAgfVxuICB9XG5cbiAgbmVlZHNSZVByb2plY3RQb2ludHMob2xkUHJvcHMsIHByb3BzKSB7XG4gICAgcmV0dXJuIG9sZFByb3BzLmNlbGxTaXplICE9PSBwcm9wcy5jZWxsU2l6ZTtcbiAgfVxuXG4gIGdldERpbWVuc2lvblVwZGF0ZXJzKCkge1xuICAgIC8vIGRpbWVuc2lvbiB1cGRhdGVycyBhcmUgc2VxdWVudGlhbCxcbiAgICAvLyBpZiB0aGUgZmlyc3Qgb25lIG5lZWRzIHRvIGJlIGNhbGxlZCwgdGhlIDJuZCBhbmQgM3JkIG9uZSB3aWxsIGF1dG9tYXRpY2FsbHlcbiAgICAvLyBiZSBjYWxsZWQuIGUuZy4gaWYgQ29sb3JWYWx1ZSBuZWVkcyB0byBiZSB1cGRhdGVkLCBnZXRDb2xvclZhbHVlRG9tYWluIGFuZCBnZXRDb2xvclNjYWxlXG4gICAgLy8gd2lsbCBhdXRvbWF0aWNhbGx5IGJlIGNhbGxlZFxuICAgIHJldHVybiB7XG4gICAgICBnZXRDb2xvcjogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICd2YWx1ZScsXG4gICAgICAgICAgdHJpZ2dlcnM6IFsnZ2V0Q29sb3JWYWx1ZSddLFxuICAgICAgICAgIHVwZGF0ZXI6IHRoaXMuZ2V0U29ydGVkQ29sb3JCaW5zXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpZDogJ2RvbWFpbicsXG4gICAgICAgICAgdHJpZ2dlcnM6IFsnbG93ZXJQZXJjZW50aWxlJywgJ3VwcGVyUGVyY2VudGlsZSddLFxuICAgICAgICAgIHVwZGF0ZXI6IHRoaXMuZ2V0Q29sb3JWYWx1ZURvbWFpblxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdzY2FsZUZ1bmMnLFxuICAgICAgICAgIHRyaWdnZXJzOiBbJ2NvbG9yRG9tYWluJywgJ2NvbG9yUmFuZ2UnXSxcbiAgICAgICAgICB1cGRhdGVyOiB0aGlzLmdldENvbG9yU2NhbGVcbiAgICAgICAgfVxuICAgICAgXSxcbiAgICAgIGdldEVsZXZhdGlvbjogW1xuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICd2YWx1ZScsXG4gICAgICAgICAgdHJpZ2dlcnM6IFsnZ2V0RWxldmF0aW9uVmFsdWUnXSxcbiAgICAgICAgICB1cGRhdGVyOiB0aGlzLmdldFNvcnRlZEVsZXZhdGlvbkJpbnNcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlkOiAnZG9tYWluJyxcbiAgICAgICAgICB0cmlnZ2VyczogWydlbGV2YXRpb25Mb3dlclBlcmNlbnRpbGUnLCAnZWxldmF0aW9uVXBwZXJQZXJjZW50aWxlJ10sXG4gICAgICAgICAgdXBkYXRlcjogdGhpcy5nZXRFbGV2YXRpb25WYWx1ZURvbWFpblxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaWQ6ICdzY2FsZUZ1bmMnLFxuICAgICAgICAgIHRyaWdnZXJzOiBbJ2VsZXZhdGlvbkRvbWFpbicsICdlbGV2YXRpb25SYW5nZSddLFxuICAgICAgICAgIHVwZGF0ZXI6IHRoaXMuZ2V0RWxldmF0aW9uU2NhbGVcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH07XG4gIH1cblxuICBnZXREaW1lbnNpb25DaGFuZ2VzKG9sZFByb3BzLCBwcm9wcykge1xuICAgIGNvbnN0IHtkaW1lbnNpb25VcGRhdGVyc30gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IHVwZGF0ZXJzID0gW107XG5cbiAgICAvLyBnZXQgZGltZW5zaW9uIHRvIGJlIHVwZGF0ZWRcbiAgICBmb3IgKGNvbnN0IGRpbWVuc2lvbktleSBpbiBkaW1lbnNpb25VcGRhdGVycykge1xuICAgICAgLy8gcmV0dXJuIHRoZSBmaXJzdCB0cmlnZ2VyZWQgdXBkYXRlciBmb3IgZWFjaCBkaW1lbnNpb25cbiAgICAgIGNvbnN0IG5lZWRVcGRhdGUgPSBkaW1lbnNpb25VcGRhdGVyc1tkaW1lbnNpb25LZXldLmZpbmQoaXRlbSA9PlxuICAgICAgICBpdGVtLnRyaWdnZXJzLnNvbWUodCA9PiBvbGRQcm9wc1t0XSAhPT0gcHJvcHNbdF0pXG4gICAgICApO1xuXG4gICAgICBpZiAobmVlZFVwZGF0ZSkge1xuICAgICAgICB1cGRhdGVycy5wdXNoKG5lZWRVcGRhdGUudXBkYXRlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVwZGF0ZXJzLmxlbmd0aCA/IHVwZGF0ZXJzIDogbnVsbDtcbiAgfVxuXG4gIGdldFBpY2tpbmdJbmZvKHtpbmZvfSkge1xuICAgIGNvbnN0IHtzb3J0ZWRDb2xvckJpbnMsIHNvcnRlZEVsZXZhdGlvbkJpbnN9ID0gdGhpcy5zdGF0ZTtcblxuICAgIGNvbnN0IGlzUGlja2VkID0gaW5mby5waWNrZWQgJiYgaW5mby5pbmRleCA+IC0xO1xuICAgIGxldCBvYmplY3QgPSBudWxsO1xuXG4gICAgaWYgKGlzUGlja2VkKSB7XG4gICAgICBjb25zdCBjZWxsID0gdGhpcy5zdGF0ZS5sYXllckRhdGFbaW5mby5pbmRleF07XG5cbiAgICAgIGNvbnN0IGNvbG9yVmFsdWUgPVxuICAgICAgICBzb3J0ZWRDb2xvckJpbnMuYmluTWFwW2NlbGwuaW5kZXhdICYmIHNvcnRlZENvbG9yQmlucy5iaW5NYXBbY2VsbC5pbmRleF0udmFsdWU7XG4gICAgICBjb25zdCBlbGV2YXRpb25WYWx1ZSA9XG4gICAgICAgIHNvcnRlZEVsZXZhdGlvbkJpbnMuYmluTWFwW2NlbGwuaW5kZXhdICYmIHNvcnRlZEVsZXZhdGlvbkJpbnMuYmluTWFwW2NlbGwuaW5kZXhdLnZhbHVlO1xuXG4gICAgICBvYmplY3QgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICB7XG4gICAgICAgICAgY29sb3JWYWx1ZSxcbiAgICAgICAgICBlbGV2YXRpb25WYWx1ZVxuICAgICAgICB9LFxuICAgICAgICBjZWxsXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIGFkZCBiaW4gY29sb3JWYWx1ZSBhbmQgZWxldmF0aW9uVmFsdWUgdG8gaW5mb1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGluZm8sIHtcbiAgICAgIHBpY2tlZDogQm9vbGVhbihvYmplY3QpLFxuICAgICAgLy8gb3ZlcnJpZGUgb2JqZWN0IHdpdGggcGlja2VkIGNlbGxcbiAgICAgIG9iamVjdFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0VXBkYXRlVHJpZ2dlcnMoKSB7XG4gICAgY29uc3Qge2RpbWVuc2lvblVwZGF0ZXJzfSA9IHRoaXMuc3RhdGU7XG5cbiAgICAvLyBtZXJnZSBhbGwgZGltZW5zaW9uIHRyaWdnZXJzXG4gICAgY29uc3QgdXBkYXRlVHJpZ2dlcnMgPSB7fTtcblxuICAgIGZvciAoY29uc3QgZGltZW5zaW9uS2V5IGluIGRpbWVuc2lvblVwZGF0ZXJzKSB7XG4gICAgICB1cGRhdGVUcmlnZ2Vyc1tkaW1lbnNpb25LZXldID0ge307XG5cbiAgICAgIGZvciAoY29uc3Qgc3RlcCBvZiBkaW1lbnNpb25VcGRhdGVyc1tkaW1lbnNpb25LZXldKSB7XG4gICAgICAgIHN0ZXAudHJpZ2dlcnMuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgICAgICB1cGRhdGVUcmlnZ2Vyc1tkaW1lbnNpb25LZXldW3Byb3BdID0gdGhpcy5wcm9wc1twcm9wXTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHVwZGF0ZVRyaWdnZXJzO1xuICB9XG5cbiAgZ2V0TGF5ZXJEYXRhKCkge1xuICAgIGNvbnN0IHtkYXRhLCBjZWxsU2l6ZSwgZ2V0UG9zaXRpb259ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCB7bGF5ZXJEYXRhfSA9IHBvaW50VG9EZW5zaXR5R3JpZERhdGEoZGF0YSwgY2VsbFNpemUsIGdldFBvc2l0aW9uKTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe2xheWVyRGF0YX0pO1xuICAgIHRoaXMuZ2V0U29ydGVkQmlucygpO1xuICB9XG5cbiAgZ2V0VmFsdWVEb21haW4oKSB7XG4gICAgdGhpcy5nZXRDb2xvclZhbHVlRG9tYWluKCk7XG4gICAgdGhpcy5nZXRFbGV2YXRpb25WYWx1ZURvbWFpbigpO1xuICB9XG5cbiAgZ2V0U29ydGVkQmlucygpIHtcbiAgICB0aGlzLmdldFNvcnRlZENvbG9yQmlucygpO1xuICAgIHRoaXMuZ2V0U29ydGVkRWxldmF0aW9uQmlucygpO1xuICB9XG5cbiAgZ2V0U29ydGVkQ29sb3JCaW5zKCkge1xuICAgIGNvbnN0IHtnZXRDb2xvclZhbHVlfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qgc29ydGVkQ29sb3JCaW5zID0gbmV3IEJpblNvcnRlcih0aGlzLnN0YXRlLmxheWVyRGF0YSB8fCBbXSwgZ2V0Q29sb3JWYWx1ZSk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtzb3J0ZWRDb2xvckJpbnN9KTtcbiAgICB0aGlzLmdldENvbG9yVmFsdWVEb21haW4oKTtcbiAgfVxuXG4gIGdldFNvcnRlZEVsZXZhdGlvbkJpbnMoKSB7XG4gICAgY29uc3Qge2dldEVsZXZhdGlvblZhbHVlfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qgc29ydGVkRWxldmF0aW9uQmlucyA9IG5ldyBCaW5Tb3J0ZXIodGhpcy5zdGF0ZS5sYXllckRhdGEgfHwgW10sIGdldEVsZXZhdGlvblZhbHVlKTtcbiAgICB0aGlzLnNldFN0YXRlKHtzb3J0ZWRFbGV2YXRpb25CaW5zfSk7XG4gICAgdGhpcy5nZXRFbGV2YXRpb25WYWx1ZURvbWFpbigpO1xuICB9XG5cbiAgZ2V0Q29sb3JWYWx1ZURvbWFpbigpIHtcbiAgICBjb25zdCB7bG93ZXJQZXJjZW50aWxlLCB1cHBlclBlcmNlbnRpbGUsIG9uU2V0Q29sb3JEb21haW59ID0gdGhpcy5wcm9wcztcblxuICAgIHRoaXMuc3RhdGUuY29sb3JWYWx1ZURvbWFpbiA9IHRoaXMuc3RhdGUuc29ydGVkQ29sb3JCaW5zLmdldFZhbHVlUmFuZ2UoW1xuICAgICAgbG93ZXJQZXJjZW50aWxlLFxuICAgICAgdXBwZXJQZXJjZW50aWxlXG4gICAgXSk7XG5cbiAgICBpZiAodHlwZW9mIG9uU2V0Q29sb3JEb21haW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG9uU2V0Q29sb3JEb21haW4odGhpcy5zdGF0ZS5jb2xvclZhbHVlRG9tYWluKTtcbiAgICB9XG5cbiAgICB0aGlzLmdldENvbG9yU2NhbGUoKTtcbiAgfVxuXG4gIGdldEVsZXZhdGlvblZhbHVlRG9tYWluKCkge1xuICAgIGNvbnN0IHtlbGV2YXRpb25Mb3dlclBlcmNlbnRpbGUsIGVsZXZhdGlvblVwcGVyUGVyY2VudGlsZSwgb25TZXRFbGV2YXRpb25Eb21haW59ID0gdGhpcy5wcm9wcztcblxuICAgIHRoaXMuc3RhdGUuZWxldmF0aW9uVmFsdWVEb21haW4gPSB0aGlzLnN0YXRlLnNvcnRlZEVsZXZhdGlvbkJpbnMuZ2V0VmFsdWVSYW5nZShbXG4gICAgICBlbGV2YXRpb25Mb3dlclBlcmNlbnRpbGUsXG4gICAgICBlbGV2YXRpb25VcHBlclBlcmNlbnRpbGVcbiAgICBdKTtcblxuICAgIGlmICh0eXBlb2Ygb25TZXRFbGV2YXRpb25Eb21haW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIG9uU2V0RWxldmF0aW9uRG9tYWluKHRoaXMuc3RhdGUuZWxldmF0aW9uVmFsdWVEb21haW4pO1xuICAgIH1cblxuICAgIHRoaXMuZ2V0RWxldmF0aW9uU2NhbGUoKTtcbiAgfVxuXG4gIGdldENvbG9yU2NhbGUoKSB7XG4gICAgY29uc3Qge2NvbG9yUmFuZ2V9ID0gdGhpcy5wcm9wcztcbiAgICBjb25zdCBjb2xvckRvbWFpbiA9IHRoaXMucHJvcHMuY29sb3JEb21haW4gfHwgdGhpcy5zdGF0ZS5jb2xvclZhbHVlRG9tYWluO1xuXG4gICAgdGhpcy5zdGF0ZS5jb2xvclNjYWxlRnVuYyA9IGdldFF1YW50aXplU2NhbGUoY29sb3JEb21haW4sIGNvbG9yUmFuZ2UpO1xuICB9XG5cbiAgZ2V0RWxldmF0aW9uU2NhbGUoKSB7XG4gICAgY29uc3Qge2VsZXZhdGlvblJhbmdlfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3QgZWxldmF0aW9uRG9tYWluID0gdGhpcy5wcm9wcy5lbGV2YXRpb25Eb21haW4gfHwgdGhpcy5zdGF0ZS5lbGV2YXRpb25WYWx1ZURvbWFpbjtcblxuICAgIHRoaXMuc3RhdGUuZWxldmF0aW9uU2NhbGVGdW5jID0gZ2V0TGluZWFyU2NhbGUoZWxldmF0aW9uRG9tYWluLCBlbGV2YXRpb25SYW5nZSk7XG4gIH1cblxuICBfb25HZXRTdWJsYXllckNvbG9yKGNlbGwpIHtcbiAgICBjb25zdCB7c29ydGVkQ29sb3JCaW5zLCBjb2xvclNjYWxlRnVuYywgY29sb3JWYWx1ZURvbWFpbn0gPSB0aGlzLnN0YXRlO1xuXG4gICAgY29uc3QgY3YgPSBzb3J0ZWRDb2xvckJpbnMuYmluTWFwW2NlbGwuaW5kZXhdICYmIHNvcnRlZENvbG9yQmlucy5iaW5NYXBbY2VsbC5pbmRleF0udmFsdWU7XG4gICAgY29uc3QgY29sb3JEb21haW4gPSB0aGlzLnByb3BzLmNvbG9yRG9tYWluIHx8IGNvbG9yVmFsdWVEb21haW47XG5cbiAgICBjb25zdCBpc0NvbG9yVmFsdWVJbkRvbWFpbiA9IGN2ID49IGNvbG9yRG9tYWluWzBdICYmIGN2IDw9IGNvbG9yRG9tYWluW2NvbG9yRG9tYWluLmxlbmd0aCAtIDFdO1xuXG4gICAgLy8gaWYgY2VsbCB2YWx1ZSBpcyBvdXRzaWRlIGRvbWFpbiwgc2V0IGFscGhhIHRvIDBcbiAgICBjb25zdCBjb2xvciA9IGlzQ29sb3JWYWx1ZUluRG9tYWluID8gY29sb3JTY2FsZUZ1bmMoY3YpIDogWzAsIDAsIDAsIDBdO1xuXG4gICAgLy8gYWRkIGFscGhhIHRvIGNvbG9yIGlmIG5vdCBkZWZpbmVkIGluIGNvbG9yUmFuZ2VcbiAgICBjb2xvclszXSA9IE51bWJlci5pc0Zpbml0ZShjb2xvclszXSkgPyBjb2xvclszXSA6IDI1NTtcblxuICAgIHJldHVybiBjb2xvcjtcbiAgfVxuXG4gIF9vbkdldFN1YmxheWVyRWxldmF0aW9uKGNlbGwpIHtcbiAgICBjb25zdCB7c29ydGVkRWxldmF0aW9uQmlucywgZWxldmF0aW9uU2NhbGVGdW5jLCBlbGV2YXRpb25WYWx1ZURvbWFpbn0gPSB0aGlzLnN0YXRlO1xuICAgIGNvbnN0IGV2ID1cbiAgICAgIHNvcnRlZEVsZXZhdGlvbkJpbnMuYmluTWFwW2NlbGwuaW5kZXhdICYmIHNvcnRlZEVsZXZhdGlvbkJpbnMuYmluTWFwW2NlbGwuaW5kZXhdLnZhbHVlO1xuXG4gICAgY29uc3QgZWxldmF0aW9uRG9tYWluID0gdGhpcy5wcm9wcy5lbGV2YXRpb25Eb21haW4gfHwgZWxldmF0aW9uVmFsdWVEb21haW47XG5cbiAgICBjb25zdCBpc0VsZXZhdGlvblZhbHVlSW5Eb21haW4gPVxuICAgICAgZXYgPj0gZWxldmF0aW9uRG9tYWluWzBdICYmIGV2IDw9IGVsZXZhdGlvbkRvbWFpbltlbGV2YXRpb25Eb21haW4ubGVuZ3RoIC0gMV07XG5cbiAgICAvLyBpZiBjZWxsIHZhbHVlIGlzIG91dHNpZGUgZG9tYWluLCBzZXQgZWxldmF0aW9uIHRvIC0xXG4gICAgcmV0dXJuIGlzRWxldmF0aW9uVmFsdWVJbkRvbWFpbiA/IGVsZXZhdGlvblNjYWxlRnVuYyhldikgOiAtMTtcbiAgfVxuXG4gIC8vIGZvciBzdWJjbGFzc2luZywgb3ZlcnJpZGUgdGhpcyBtZXRob2QgdG8gcmV0dXJuXG4gIC8vIGN1c3RvbWl6ZWQgc3ViIGxheWVyIHByb3BzXG4gIGdldFN1YkxheWVyUHJvcHMoKSB7XG4gICAgY29uc3Qge2VsZXZhdGlvblNjYWxlLCBmcDY0LCBleHRydWRlZCwgY2VsbFNpemUsIGNvdmVyYWdlLCBsaWdodFNldHRpbmdzfSA9IHRoaXMucHJvcHM7XG5cbiAgICAvLyByZXR1cm4gcHJvcHMgdG8gdGhlIHN1YmxheWVyIGNvbnN0cnVjdG9yXG4gICAgcmV0dXJuIHN1cGVyLmdldFN1YkxheWVyUHJvcHMoe1xuICAgICAgaWQ6ICdncmlkLWNlbGwnLFxuICAgICAgZGF0YTogdGhpcy5zdGF0ZS5sYXllckRhdGEsXG5cbiAgICAgIGZwNjQsXG4gICAgICBjZWxsU2l6ZSxcbiAgICAgIGNvdmVyYWdlLFxuICAgICAgbGlnaHRTZXR0aW5ncyxcbiAgICAgIGVsZXZhdGlvblNjYWxlLFxuICAgICAgZXh0cnVkZWQsXG5cbiAgICAgIGdldENvbG9yOiB0aGlzLl9vbkdldFN1YmxheWVyQ29sb3IuYmluZCh0aGlzKSxcbiAgICAgIGdldEVsZXZhdGlvbjogdGhpcy5fb25HZXRTdWJsYXllckVsZXZhdGlvbi5iaW5kKHRoaXMpLFxuICAgICAgdXBkYXRlVHJpZ2dlcnM6IHRoaXMuZ2V0VXBkYXRlVHJpZ2dlcnMoKVxuICAgIH0pO1xuICB9XG5cbiAgLy8gZm9yIHN1YmNsYXNzaW5nLCBvdmVycmlkZSB0aGlzIG1ldGhvZCB0byByZXR1cm5cbiAgLy8gY3VzdG9taXplZCBzdWIgbGF5ZXIgY2xhc3NcbiAgZ2V0U3ViTGF5ZXJDbGFzcygpIHtcbiAgICByZXR1cm4gR3JpZENlbGxMYXllcjtcbiAgfVxuXG4gIHJlbmRlckxheWVycygpIHtcbiAgICBjb25zdCBTdWJMYXllckNsYXNzID0gdGhpcy5nZXRTdWJMYXllckNsYXNzKCk7XG5cbiAgICByZXR1cm4gbmV3IFN1YkxheWVyQ2xhc3ModGhpcy5nZXRTdWJMYXllclByb3BzKCkpO1xuICB9XG59XG5cbkdyaWRMYXllci5sYXllck5hbWUgPSAnR3JpZExheWVyJztcbkdyaWRMYXllci5kZWZhdWx0UHJvcHMgPSBkZWZhdWx0UHJvcHM7XG4iXX0=