'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _deck = require('deck.gl');

var _luma = require('luma.gl');

var _outline = require('../shaderlib/outline/outline');

var _outline2 = _interopRequireDefault(_outline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(0, _luma.registerShaderModules)([_outline2.default]);

// TODO - this should be built into assembleShaders
function injectShaderCode(_ref) {
  var source = _ref.source,
      _ref$declarations = _ref.declarations,
      declarations = _ref$declarations === undefined ? '' : _ref$declarations,
      _ref$code = _ref.code,
      code = _ref$code === undefined ? '' : _ref$code;

  var INJECT_DECLARATIONS = /^/;
  var INJECT_CODE = /}[^{}]*$/;

  return source.replace(INJECT_DECLARATIONS, declarations).replace(INJECT_CODE, code.concat('\n}\n'));
}

var VS_DECLARATIONS = '#ifdef MODULE_OUTLINE\n  attribute float instanceZLevel;\n#endif\n';

var VS_CODE = '#ifdef MODULE_OUTLINE\n  outline_setUV(gl_Position);\n  outline_setZLevel(instanceZLevel);\n#endif\n';

var FS_CODE = '#ifdef MODULE_OUTLINE\n  gl_FragColor = outline_filterColor(gl_FragColor);\n#endif\n';

var defaultProps = {
  getZLevel: function getZLevel(object) {
    return object.zLevel | 0;
  }
};

var PathOutlineLayer = function (_PathLayer) {
  _inherits(PathOutlineLayer, _PathLayer);

  function PathOutlineLayer() {
    _classCallCheck(this, PathOutlineLayer);

    return _possibleConstructorReturn(this, (PathOutlineLayer.__proto__ || Object.getPrototypeOf(PathOutlineLayer)).apply(this, arguments));
  }

  _createClass(PathOutlineLayer, [{
    key: 'getShaders',

    // Override getShaders to inject the outline module
    value: function getShaders() {
      var shaders = _get(PathOutlineLayer.prototype.__proto__ || Object.getPrototypeOf(PathOutlineLayer.prototype), 'getShaders', this).call(this);
      return Object.assign({}, shaders, {
        modules: shaders.modules.concat(['outline']),
        vs: injectShaderCode({ source: shaders.vs, declarations: VS_DECLARATIONS, code: VS_CODE }),
        fs: injectShaderCode({ source: shaders.fs, code: FS_CODE })
      });
    }
  }, {
    key: 'initializeState',
    value: function initializeState(context) {
      _get(PathOutlineLayer.prototype.__proto__ || Object.getPrototypeOf(PathOutlineLayer.prototype), 'initializeState', this).call(this, context);

      // Create an outline "shadow" map
      // TODO - we should create a single outlineMap for all layers
      this.setState({
        outlineFramebuffer: new _luma.Framebuffer(context.gl),
        dummyTexture: new _luma.Texture2D(context.gl)
      });

      // Create an attribute manager
      this.state.attributeManager.addInstanced({
        instanceZLevel: {
          size: 1,
          type: _luma.GL.UNSIGNED_BYTE,
          update: this.calculateZLevels,
          accessor: 'getZLevel'
        }
      });
    }

    // Override draw to add render module

  }, {
    key: 'draw',
    value: function draw(_ref2) {
      var _ref2$moduleParameter = _ref2.moduleParameters,
          moduleParameters = _ref2$moduleParameter === undefined ? {} : _ref2$moduleParameter,
          parameters = _ref2.parameters,
          uniforms = _ref2.uniforms,
          context = _ref2.context;

      // Need to calculate same uniforms as base layer
      var _props = this.props,
          rounded = _props.rounded,
          miterLimit = _props.miterLimit,
          widthScale = _props.widthScale,
          widthMinPixels = _props.widthMinPixels,
          widthMaxPixels = _props.widthMaxPixels,
          dashJustified = _props.dashJustified;


      uniforms = Object.assign({}, uniforms, {
        jointType: Number(rounded),
        alignMode: Number(dashJustified),
        widthScale: widthScale,
        miterLimit: miterLimit,
        widthMinPixels: widthMinPixels,
        widthMaxPixels: widthMaxPixels
      });

      // Render the outline shadowmap (based on segment z orders)
      var _state = this.state,
          outlineFramebuffer = _state.outlineFramebuffer,
          dummyTexture = _state.dummyTexture;

      outlineFramebuffer.resize();
      outlineFramebuffer.clear({ color: true, depth: true });

      this.state.model.updateModuleSettings(Object.assign({}, moduleParameters, {
        outlineEnabled: true,
        outlineRenderShadowmap: true,
        outlineShadowmap: dummyTexture
      }));

      this.state.model.draw({
        uniforms: Object.assign({}, uniforms, {
          jointType: 0,
          widthScale: this.props.widthScale * 1.3
        }),
        parameters: {
          depthTest: false,
          blendEquation: _luma.GL.MAX // Biggest value needs to go into buffer
        },
        framebuffer: outlineFramebuffer
      });

      // Now use the outline shadowmap to render the lines (with outlines)
      this.state.model.updateModuleSettings(Object.assign({}, moduleParameters, {
        outlineEnabled: true,
        outlineRenderShadowmap: false,
        outlineShadowmap: outlineFramebuffer
      }));
      this.state.model.draw({
        uniforms: Object.assign({}, uniforms, {
          jointType: Number(rounded),
          widthScale: this.props.widthScale
        }),
        parameters: {
          depthTest: false
        }
      });
    }
  }, {
    key: 'calculateZLevels',
    value: function calculateZLevels(attribute) {
      var _props2 = this.props,
          data = _props2.data,
          getZLevel = _props2.getZLevel;
      var paths = this.state.paths;
      var value = attribute.value;


      var i = 0;
      paths.forEach(function (path, index) {
        var zLevel = getZLevel(data[index], index);
        zLevel = isNaN(zLevel) ? 0 : zLevel;
        for (var ptIndex = 1; ptIndex < path.length; ptIndex++) {
          value[i++] = zLevel;
        }
      });
    }
  }]);

  return PathOutlineLayer;
}(_deck.PathLayer);

exports.default = PathOutlineLayer;


PathOutlineLayer.layerName = 'PathOutlineLayer';
PathOutlineLayer.defaultProps = defaultProps;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9leHBlcmltZW50YWwtbGF5ZXJzL3NyYy9wYXRoLW91dGxpbmUtbGF5ZXIvcGF0aC1vdXRsaW5lLWxheWVyLmpzIl0sIm5hbWVzIjpbImluamVjdFNoYWRlckNvZGUiLCJzb3VyY2UiLCJkZWNsYXJhdGlvbnMiLCJjb2RlIiwiSU5KRUNUX0RFQ0xBUkFUSU9OUyIsIklOSkVDVF9DT0RFIiwicmVwbGFjZSIsImNvbmNhdCIsIlZTX0RFQ0xBUkFUSU9OUyIsIlZTX0NPREUiLCJGU19DT0RFIiwiZGVmYXVsdFByb3BzIiwiZ2V0WkxldmVsIiwib2JqZWN0IiwiekxldmVsIiwiUGF0aE91dGxpbmVMYXllciIsInNoYWRlcnMiLCJPYmplY3QiLCJhc3NpZ24iLCJtb2R1bGVzIiwidnMiLCJmcyIsImNvbnRleHQiLCJzZXRTdGF0ZSIsIm91dGxpbmVGcmFtZWJ1ZmZlciIsImdsIiwiZHVtbXlUZXh0dXJlIiwic3RhdGUiLCJhdHRyaWJ1dGVNYW5hZ2VyIiwiYWRkSW5zdGFuY2VkIiwiaW5zdGFuY2VaTGV2ZWwiLCJzaXplIiwidHlwZSIsIlVOU0lHTkVEX0JZVEUiLCJ1cGRhdGUiLCJjYWxjdWxhdGVaTGV2ZWxzIiwiYWNjZXNzb3IiLCJtb2R1bGVQYXJhbWV0ZXJzIiwicGFyYW1ldGVycyIsInVuaWZvcm1zIiwicHJvcHMiLCJyb3VuZGVkIiwibWl0ZXJMaW1pdCIsIndpZHRoU2NhbGUiLCJ3aWR0aE1pblBpeGVscyIsIndpZHRoTWF4UGl4ZWxzIiwiZGFzaEp1c3RpZmllZCIsImpvaW50VHlwZSIsIk51bWJlciIsImFsaWduTW9kZSIsInJlc2l6ZSIsImNsZWFyIiwiY29sb3IiLCJkZXB0aCIsIm1vZGVsIiwidXBkYXRlTW9kdWxlU2V0dGluZ3MiLCJvdXRsaW5lRW5hYmxlZCIsIm91dGxpbmVSZW5kZXJTaGFkb3dtYXAiLCJvdXRsaW5lU2hhZG93bWFwIiwiZHJhdyIsImRlcHRoVGVzdCIsImJsZW5kRXF1YXRpb24iLCJNQVgiLCJmcmFtZWJ1ZmZlciIsImF0dHJpYnV0ZSIsImRhdGEiLCJwYXRocyIsInZhbHVlIiwiaSIsImZvckVhY2giLCJwYXRoIiwiaW5kZXgiLCJpc05hTiIsInB0SW5kZXgiLCJsZW5ndGgiLCJsYXllck5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUEsaUNBQXNCLG1CQUF0Qjs7QUFFQTtBQUNBLFNBQVNBLGdCQUFULE9BQWtFO0FBQUEsTUFBdkNDLE1BQXVDLFFBQXZDQSxNQUF1QztBQUFBLCtCQUEvQkMsWUFBK0I7QUFBQSxNQUEvQkEsWUFBK0IscUNBQWhCLEVBQWdCO0FBQUEsdUJBQVpDLElBQVk7QUFBQSxNQUFaQSxJQUFZLDZCQUFMLEVBQUs7O0FBQ2hFLE1BQU1DLHNCQUFzQixHQUE1QjtBQUNBLE1BQU1DLGNBQWMsVUFBcEI7O0FBRUEsU0FBT0osT0FDSkssT0FESSxDQUNJRixtQkFESixFQUN5QkYsWUFEekIsRUFFSkksT0FGSSxDQUVJRCxXQUZKLEVBRWlCRixLQUFLSSxNQUFMLENBQVksT0FBWixDQUZqQixDQUFQO0FBR0Q7O0FBRUQsSUFBTUMsc0ZBQU47O0FBTUEsSUFBTUMsZ0hBQU47O0FBT0EsSUFBTUMsZ0dBQU47O0FBTUEsSUFBTUMsZUFBZTtBQUNuQkMsYUFBVztBQUFBLFdBQVVDLE9BQU9DLE1BQVAsR0FBZ0IsQ0FBMUI7QUFBQTtBQURRLENBQXJCOztJQUlxQkMsZ0I7Ozs7Ozs7Ozs7OztBQUNuQjtpQ0FDYTtBQUNYLFVBQU1DLHdJQUFOO0FBQ0EsYUFBT0MsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JGLE9BQWxCLEVBQTJCO0FBQ2hDRyxpQkFBU0gsUUFBUUcsT0FBUixDQUFnQlosTUFBaEIsQ0FBdUIsQ0FBQyxTQUFELENBQXZCLENBRHVCO0FBRWhDYSxZQUFJcEIsaUJBQWlCLEVBQUNDLFFBQVFlLFFBQVFJLEVBQWpCLEVBQXFCbEIsY0FBY00sZUFBbkMsRUFBb0RMLE1BQU1NLE9BQTFELEVBQWpCLENBRjRCO0FB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QVgsQ0FBaUJLLElBQWpCLENBQXNCO0FBQ3BCcEIsa0JBQVV0QixPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQnFCLFFBQWxCLEVBQTRCO0FBQ3BDUSxxQkFBV0MsT0FBT1AsT0FBUCxDQUR5QjtBQUVwQ0Usc0JBQVksS0FBS0gsS0FBTCxDQUFXRztBQUZhLFNBQTVCLENBRFU7QUFLcEJMLG9CQUFZO0FBQ1ZzQixxQkFBVztBQUREO0FBTFEsT0FBdEI7QUFTRDs7O3FDQUVnQkksUyxFQUFXO0FBQUEsb0JBQ0EsS0FBS3hCLEtBREw7QUFBQSxVQUNuQnlCLElBRG1CLFdBQ25CQSxJQURtQjtBQUFBLFVBQ2JyRCxTQURhLFdBQ2JBLFNBRGE7QUFBQSxVQUVuQnNELEtBRm1CLEdBRVYsS0FBS3ZDLEtBRkssQ0FFbkJ1QyxLQUZtQjtBQUFBLFVBR25CQyxLQUhtQixHQUdWSCxTQUhVLENBR25CRyxLQUhtQjs7O0FBSzFCLFVBQUlDLElBQUksQ0FBUjtBQUNBRixZQUFNRyxPQUFOLENBQWMsVUFBQ0MsSUFBRCxFQUFPQyxLQUFQLEVBQWlCO0FBQzdCLFlBQUl6RCxTQUFTRixVQUFVcUQsS0FBS00sS0FBTCxDQUFWLEVBQXVCQSxLQUF2QixDQUFiO0FBQ0F6RCxpQkFBUzBELE1BQU0xRCxNQUFOLElBQWdCLENBQWhCLEdBQW9CQSxNQUE3QjtBQUNBLGFBQUssSUFBSTJELFVBQVUsQ0FBbkIsRUFBc0JBLFVBQVVILEtBQUtJLE1BQXJDLEVBQTZDRCxTQUE3QyxFQUF3RDtBQUN0RE4sZ0JBQU1DLEdBQU4sSUFBYXRELE1BQWI7QUFDRDtBQUNGLE9BTkQ7QUFPRDs7Ozs7O2tCQTlHa0JDLGdCOzs7QUFpSHJCQSxpQkFBaUI0RCxTQUFqQixHQUE2QixrQkFBN0I7QUFDQTVELGlCQUFpQkosWUFBakIsR0FBZ0NBLFlBQWhDIiwiZmlsZSI6InBhdGgtb3V0bGluZS1sYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UGF0aExheWVyfSBmcm9tICdkZWNrLmdsJztcbmltcG9ydCB7R0wsIEZyYW1lYnVmZmVyLCBUZXh0dXJlMkQsIHJlZ2lzdGVyU2hhZGVyTW9kdWxlc30gZnJvbSAnbHVtYS5nbCc7XG5pbXBvcnQgb3V0bGluZSBmcm9tICcuLi9zaGFkZXJsaWIvb3V0bGluZS9vdXRsaW5lJztcblxucmVnaXN0ZXJTaGFkZXJNb2R1bGVzKFtvdXRsaW5lXSk7XG5cbi8vIFRPRE8gLSB0aGlzIHNob3VsZCBiZSBidWlsdCBpbnRvIGFzc2VtYmxlU2hhZGVyc1xuZnVuY3Rpb24gaW5qZWN0U2hhZGVyQ29kZSh7c291cmNlLCBkZWNsYXJhdGlvbnMgPSAnJywgY29kZSA9ICcnfSkge1xuICBjb25zdCBJTkpFQ1RfREVDTEFSQVRJT05TID0gL14vO1xuICBjb25zdCBJTkpFQ1RfQ09ERSA9IC99W157fV0qJC87XG5cbiAgcmV0dXJuIHNvdXJjZVxuICAgIC5yZXBsYWNlKElOSkVDVF9ERUNMQVJBVElPTlMsIGRlY2xhcmF0aW9ucylcbiAgICAucmVwbGFjZShJTkpFQ1RfQ09ERSwgY29kZS5jb25jYXQoJ1xcbn1cXG4nKSk7XG59XG5cbmNvbnN0IFZTX0RFQ0xBUkFUSU9OUyA9IGBcXFxuI2lmZGVmIE1PRFVMRV9PVVRMSU5FXG4gIGF0dHJpYnV0ZSBmbG9hdCBpbnN0YW5jZVpMZXZlbDtcbiNlbmRpZlxuYDtcblxuY29uc3QgVlNfQ09ERSA9IGBcXFxuI2lmZGVmIE1PRFVMRV9PVVRMSU5FXG4gIG91dGxpbmVfc2V0VVYoZ2xfUG9zaXRpb24pO1xuICBvdXRsaW5lX3NldFpMZXZlbChpbnN0YW5jZVpMZXZlbCk7XG4jZW5kaWZcbmA7XG5cbmNvbnN0IEZTX0NPREUgPSBgXFxcbiNpZmRlZiBNT0RVTEVfT1VUTElORVxuICBnbF9GcmFnQ29sb3IgPSBvdXRsaW5lX2ZpbHRlckNvbG9yKGdsX0ZyYWdDb2xvcik7XG4jZW5kaWZcbmA7XG5cbmNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgZ2V0WkxldmVsOiBvYmplY3QgPT4gb2JqZWN0LnpMZXZlbCB8IDBcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhdGhPdXRsaW5lTGF5ZXIgZXh0ZW5kcyBQYXRoTGF5ZXIge1xuICAvLyBPdmVycmlkZSBnZXRTaGFkZXJzIHRvIGluamVjdCB0aGUgb3V0bGluZSBtb2R1bGVcbiAgZ2V0U2hhZGVycygpIHtcbiAgICBjb25zdCBzaGFkZXJzID0gc3VwZXIuZ2V0U2hhZGVycygpO1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzaGFkZXJzLCB7XG4gICAgICBtb2R1bGVzOiBzaGFkZXJzLm1vZHVsZXMuY29uY2F0KFsnb3V0bGluZSddKSxcbiAgICAgIHZzOiBpbmplY3RTaGFkZXJDb2RlKHtzb3VyY2U6IHNoYWRlcnMudnMsIGRlY2xhcmF0aW9uczogVlNfREVDTEFSQVRJT05TLCBjb2RlOiBWU19DT0RFfSksXG4gICAgICBmczogaW5qZWN0U2hhZGVyQ29kZSh7c291cmNlOiBzaGFkZXJzLmZzLCBjb2RlOiBGU19DT0RFfSlcbiAgICB9KTtcbiAgfVxuXG4gIGluaXRpYWxpemVTdGF0ZShjb250ZXh0KSB7XG4gICAgc3VwZXIuaW5pdGlhbGl6ZVN0YXRlKGNvbnRleHQpO1xuXG4gICAgLy8gQ3JlYXRlIGFuIG91dGxpbmUgXCJzaGFkb3dcIiBtYXBcbiAgICAvLyBUT0RPIC0gd2Ugc2hvdWxkIGNyZWF0ZSBhIHNpbmdsZSBvdXRsaW5lTWFwIGZvciBhbGwgbGF5ZXJzXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBvdXRsaW5lRnJhbWVidWZmZXI6IG5ldyBGcmFtZWJ1ZmZlcihjb250ZXh0LmdsKSxcbiAgICAgIGR1bW15VGV4dHVyZTogbmV3IFRleHR1cmUyRChjb250ZXh0LmdsKVxuICAgIH0pO1xuXG4gICAgLy8gQ3JlYXRlIGFuIGF0dHJpYnV0ZSBtYW5hZ2VyXG4gICAgdGhpcy5zdGF0ZS5hdHRyaWJ1dGVNYW5hZ2VyLmFkZEluc3RhbmNlZCh7XG4gICAgICBpbnN0YW5jZVpMZXZlbDoge1xuICAgICAgICBzaXplOiAxLFxuICAgICAgICB0eXBlOiBHTC5VTlNJR05FRF9CWVRFLFxuICAgICAgICB1cGRhdGU6IHRoaXMuY2FsY3VsYXRlWkxldmVscyxcbiAgICAgICAgYWNjZXNzb3I6ICdnZXRaTGV2ZWwnXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBPdmVycmlkZSBkcmF3IHRvIGFkZCByZW5kZXIgbW9kdWxlXG4gIGRyYXcoe21vZHVsZVBhcmFtZXRlcnMgPSB7fSwgcGFyYW1ldGVycywgdW5pZm9ybXMsIGNvbnRleHR9KSB7XG4gICAgLy8gTmVlZCB0byBjYWxjdWxhdGUgc2FtZSB1bmlmb3JtcyBhcyBiYXNlIGxheWVyXG4gICAgY29uc3Qge1xuICAgICAgcm91bmRlZCxcbiAgICAgIG1pdGVyTGltaXQsXG4gICAgICB3aWR0aFNjYWxlLFxuICAgICAgd2lkdGhNaW5QaXhlbHMsXG4gICAgICB3aWR0aE1heFBpeGVscyxcbiAgICAgIGRhc2hKdXN0aWZpZWRcbiAgICB9ID0gdGhpcy5wcm9wcztcblxuICAgIHVuaWZvcm1zID0gT2JqZWN0LmFzc2lnbih7fSwgdW5pZm9ybXMsIHtcbiAgICAgIGpvaW50VHlwZTogTnVtYmVyKHJvdW5kZWQpLFxuICAgICAgYWxpZ25Nb2RlOiBOdW1iZXIoZGFzaEp1c3RpZmllZCksXG4gICAgICB3aWR0aFNjYWxlLFxuICAgICAgbWl0ZXJMaW1pdCxcbiAgICAgIHdpZHRoTWluUGl4ZWxzLFxuICAgICAgd2lkdGhNYXhQaXhlbHNcbiAgICB9KTtcblxuICAgIC8vIFJlbmRlciB0aGUgb3V0bGluZSBzaGFkb3dtYXAgKGJhc2VkIG9uIHNlZ21lbnQgeiBvcmRlcnMpXG4gICAgY29uc3Qge291dGxpbmVGcmFtZWJ1ZmZlciwgZHVtbXlUZXh0dXJlfSA9IHRoaXMuc3RhdGU7XG4gICAgb3V0bGluZUZyYW1lYnVmZmVyLnJlc2l6ZSgpO1xuICAgIG91dGxpbmVGcmFtZWJ1ZmZlci5jbGVhcih7Y29sb3I6IHRydWUsIGRlcHRoOiB0cnVlfSk7XG5cbiAgICB0aGlzLnN0YXRlLm1vZGVsLnVwZGF0ZU1vZHVsZVNldHRpbmdzKFxuICAgICAgT2JqZWN0LmFzc2lnbih7fSwgbW9kdWxlUGFyYW1ldGVycywge1xuICAgICAgICBvdXRsaW5lRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgb3V0bGluZVJlbmRlclNoYWRvd21hcDogdHJ1ZSxcbiAgICAgICAgb3V0bGluZVNoYWRvd21hcDogZHVtbXlUZXh0dXJlXG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLnN0YXRlLm1vZGVsLmRyYXcoe1xuICAgICAgdW5pZm9ybXM6IE9iamVjdC5hc3NpZ24oe30sIHVuaWZvcm1zLCB7XG4gICAgICAgIGpvaW50VHlwZTogMCxcbiAgICAgICAgd2lkdGhTY2FsZTogdGhpcy5wcm9wcy53aWR0aFNjYWxlICogMS4zXG4gICAgICB9KSxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgZGVwdGhUZXN0OiBmYWxzZSxcbiAgICAgICAgYmxlbmRFcXVhdGlvbjogR0wuTUFYIC8vIEJpZ2dlc3QgdmFsdWUgbmVlZHMgdG8gZ28gaW50byBidWZmZXJcbiAgICAgIH0sXG4gICAgICBmcmFtZWJ1ZmZlcjogb3V0bGluZUZyYW1lYnVmZmVyXG4gICAgfSk7XG5cbiAgICAvLyBOb3cgdXNlIHRoZSBvdXRsaW5lIHNoYWRvd21hcCB0byByZW5kZXIgdGhlIGxpbmVzICh3aXRoIG91dGxpbmVzKVxuICAgIHRoaXMuc3RhdGUubW9kZWwudXBkYXRlTW9kdWxlU2V0dGluZ3MoXG4gICAgICBPYmplY3QuYXNzaWduKHt9LCBtb2R1bGVQYXJhbWV0ZXJzLCB7XG4gICAgICAgIG91dGxpbmVFbmFibGVkOiB0cnVlLFxuICAgICAgICBvdXRsaW5lUmVuZGVyU2hhZG93bWFwOiBmYWxzZSxcbiAgICAgICAgb3V0bGluZVNoYWRvd21hcDogb3V0bGluZUZyYW1lYnVmZmVyXG4gICAgICB9KVxuICAgICk7XG4gICAgdGhpcy5zdGF0ZS5tb2RlbC5kcmF3KHtcbiAgICAgIHVuaWZvcm1zOiBPYmplY3QuYXNzaWduKHt9LCB1bmlmb3Jtcywge1xuICAgICAgICBqb2ludFR5cGU6IE51bWJlcihyb3VuZGVkKSxcbiAgICAgICAgd2lkdGhTY2FsZTogdGhpcy5wcm9wcy53aWR0aFNjYWxlXG4gICAgICB9KSxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgZGVwdGhUZXN0OiBmYWxzZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY2FsY3VsYXRlWkxldmVscyhhdHRyaWJ1dGUpIHtcbiAgICBjb25zdCB7ZGF0YSwgZ2V0WkxldmVsfSA9IHRoaXMucHJvcHM7XG4gICAgY29uc3Qge3BhdGhzfSA9IHRoaXMuc3RhdGU7XG4gICAgY29uc3Qge3ZhbHVlfSA9IGF0dHJpYnV0ZTtcblxuICAgIGxldCBpID0gMDtcbiAgICBwYXRocy5mb3JFYWNoKChwYXRoLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IHpMZXZlbCA9IGdldFpMZXZlbChkYXRhW2luZGV4XSwgaW5kZXgpO1xuICAgICAgekxldmVsID0gaXNOYU4oekxldmVsKSA/IDAgOiB6TGV2ZWw7XG4gICAgICBmb3IgKGxldCBwdEluZGV4ID0gMTsgcHRJbmRleCA8IHBhdGgubGVuZ3RoOyBwdEluZGV4KyspIHtcbiAgICAgICAgdmFsdWVbaSsrXSA9IHpMZXZlbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5QYXRoT3V0bGluZUxheWVyLmxheWVyTmFtZSA9ICdQYXRoT3V0bGluZUxheWVyJztcblBhdGhPdXRsaW5lTGF5ZXIuZGVmYXVsdFByb3BzID0gZGVmYXVsdFByb3BzO1xuIl19