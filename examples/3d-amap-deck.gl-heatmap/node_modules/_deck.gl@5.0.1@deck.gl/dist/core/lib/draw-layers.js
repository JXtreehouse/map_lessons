'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPixelRatio = undefined;
exports.drawLayers = drawLayers;
exports.drawPickingBuffer = drawPickingBuffer;

var _luma = require('luma.gl');

var _log = require('../utils/log');

var _log2 = _interopRequireDefault(_log);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LOG_PRIORITY_DRAW = 2; // Copyright (c) 2015 - 2017 Uber Technologies, Inc.
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

/* global window */


var renderCount = 0;

// TODO - Exported for pick-layers.js - Move to util?
var getPixelRatio = exports.getPixelRatio = function getPixelRatio(_ref) {
  var useDevicePixels = _ref.useDevicePixels;

  (0, _assert2.default)(typeof useDevicePixels === 'boolean', 'Invalid useDevicePixels');
  return useDevicePixels && typeof window !== 'undefined' ? window.devicePixelRatio : 1;
};

// Convert viewport top-left CSS coordinates to bottom up WebGL coordinates
var getGLViewport = function getGLViewport(gl, _ref2) {
  var viewport = _ref2.viewport,
      pixelRatio = _ref2.pixelRatio;

  // TODO - dummy default for node
  var height = gl.canvas ? gl.canvas.clientHeight : 100;
  // Convert viewport top-left CSS coordinates to bottom up WebGL coordinates
  var dimensions = viewport;
  return [dimensions.x * pixelRatio, (height - dimensions.y - dimensions.height) * pixelRatio, dimensions.width * pixelRatio, dimensions.height * pixelRatio];
};

// Helper functions

function clearCanvas(gl, _ref3) {
  var useDevicePixels = _ref3.useDevicePixels;

  // const pixelRatio = getPixelRatio({useDevicePixels});
  var width = gl.drawingBufferWidth;
  var height = gl.drawingBufferHeight;
  // clear depth and color buffers, restoring transparency
  (0, _luma.withParameters)(gl, { viewport: [0, 0, width, height] }, function () {
    gl.clear(_luma.GL.COLOR_BUFFER_BIT | _luma.GL.DEPTH_BUFFER_BIT);
  });
}

// Draw a list of layers in a list of viewports
function drawLayers(gl, _ref4) {
  var layers = _ref4.layers,
      viewports = _ref4.viewports,
      onViewportActive = _ref4.onViewportActive,
      useDevicePixels = _ref4.useDevicePixels,
      _ref4$drawPickingColo = _ref4.drawPickingColors,
      drawPickingColors = _ref4$drawPickingColo === undefined ? false : _ref4$drawPickingColo,
      _ref4$deviceRect = _ref4.deviceRect,
      deviceRect = _ref4$deviceRect === undefined ? null : _ref4$deviceRect,
      _ref4$parameters = _ref4.parameters,
      parameters = _ref4$parameters === undefined ? {} : _ref4$parameters,
      _ref4$layerFilter = _ref4.layerFilter,
      layerFilter = _ref4$layerFilter === undefined ? null : _ref4$layerFilter,
      _ref4$pass = _ref4.pass,
      pass = _ref4$pass === undefined ? 'draw' : _ref4$pass,
      _ref4$redrawReason = _ref4.redrawReason,
      redrawReason = _ref4$redrawReason === undefined ? '' : _ref4$redrawReason;

  clearCanvas(gl, { useDevicePixels: useDevicePixels });

  // effectManager.preDraw();

  viewports.forEach(function (viewportOrDescriptor, i) {
    var viewport = getViewportFromDescriptor(viewportOrDescriptor);

    // Update context to point to this viewport
    onViewportActive(viewport);

    // render this viewport
    drawLayersInViewport(gl, {
      layers: layers,
      viewport: viewport,
      useDevicePixels: useDevicePixels,
      drawPickingColors: drawPickingColors,
      deviceRect: deviceRect,
      parameters: parameters,
      layerFilter: layerFilter,
      pass: pass,
      redrawReason: redrawReason
    });
  });

  // effectManager.draw();
}

// Draws list of layers and viewports into the picking buffer
// Note: does not sample the buffer, that has to be done by the caller
function drawPickingBuffer(gl, _ref5) {
  var layers = _ref5.layers,
      viewports = _ref5.viewports,
      onViewportActive = _ref5.onViewportActive,
      useDevicePixels = _ref5.useDevicePixels,
      pickingFBO = _ref5.pickingFBO,
      _ref5$deviceRect = _ref5.deviceRect,
      x = _ref5$deviceRect.x,
      y = _ref5$deviceRect.y,
      width = _ref5$deviceRect.width,
      height = _ref5$deviceRect.height,
      _ref5$layerFilter = _ref5.layerFilter,
      layerFilter = _ref5$layerFilter === undefined ? null : _ref5$layerFilter,
      _ref5$redrawReason = _ref5.redrawReason,
      redrawReason = _ref5$redrawReason === undefined ? '' : _ref5$redrawReason;

  // Make sure we clear scissor test and fbo bindings in case of exceptions
  // We are only interested in one pixel, no need to render anything else
  // Note that the callback here is called synchronously.
  // Set blend mode for picking
  // always overwrite existing pixel with [r,g,b,layerIndex]
  return (0, _luma.withParameters)(gl, {
    framebuffer: pickingFBO,
    scissorTest: true,
    scissor: [x, y, width, height],
    clearColor: [0, 0, 0, 0]
  }, function () {
    drawLayers(gl, {
      layers: layers,
      viewports: viewports,
      onViewportActive: onViewportActive,
      useDevicePixels: useDevicePixels,
      drawPickingColors: true,
      layerFilter: layerFilter,
      pass: 'picking',
      redrawReason: redrawReason,
      parameters: {
        blend: true,
        blendFunc: [gl.ONE, gl.ZERO, gl.CONSTANT_ALPHA, gl.ZERO],
        blendEquation: gl.FUNC_ADD,
        blendColor: [0, 0, 0, 0]
      }
    });
  });
}

// Draws a list of layers in one viewport
// TODO - when picking we could completely skip rendering viewports that dont
// intersect with the picking rect
function drawLayersInViewport(gl, _ref6) {
  var layers = _ref6.layers,
      viewport = _ref6.viewport,
      useDevicePixels = _ref6.useDevicePixels,
      _ref6$drawPickingColo = _ref6.drawPickingColors,
      drawPickingColors = _ref6$drawPickingColo === undefined ? false : _ref6$drawPickingColo,
      _ref6$deviceRect = _ref6.deviceRect,
      deviceRect = _ref6$deviceRect === undefined ? null : _ref6$deviceRect,
      _ref6$parameters = _ref6.parameters,
      parameters = _ref6$parameters === undefined ? {} : _ref6$parameters,
      layerFilter = _ref6.layerFilter,
      _ref6$pass = _ref6.pass,
      pass = _ref6$pass === undefined ? 'draw' : _ref6$pass,
      _ref6$redrawReason = _ref6.redrawReason,
      redrawReason = _ref6$redrawReason === undefined ? '' : _ref6$redrawReason;

  var pixelRatio = getPixelRatio({ useDevicePixels: useDevicePixels });
  var glViewport = getGLViewport(gl, { viewport: viewport, pixelRatio: pixelRatio });

  // render layers in normal colors
  var renderStats = {
    totalCount: layers.length,
    visibleCount: 0,
    compositeCount: 0,
    pickableCount: 0
  };

  // const {x, y, width, height} = deviceRect || [];

  (0, _luma.setParameters)(gl, parameters || {});

  // render layers in normal colors
  layers.forEach(function (layer, layerIndex) {
    // Check if we should draw layer
    var shouldDrawLayer = layer.props.visible;
    if (drawPickingColors) {
      shouldDrawLayer = shouldDrawLayer && layer.props.pickable;
    }
    if (shouldDrawLayer && layerFilter) {
      shouldDrawLayer = layerFilter({ layer: layer, viewport: viewport, isPicking: drawPickingColors });
    }

    // Calculate stats
    if (shouldDrawLayer && layer.props.pickable) {
      renderStats.pickableCount++;
    }
    if (layer.isComposite) {
      renderStats.compositeCount++;
    }

    // Draw the layer
    if (shouldDrawLayer) {
      if (!layer.isComposite) {
        renderStats.visibleCount++;
      }

      drawLayerInViewport({ gl: gl, layer: layer, layerIndex: layerIndex, drawPickingColors: drawPickingColors, glViewport: glViewport, parameters: parameters });
    }
  });

  renderCount++;

  logRenderStats({ renderStats: renderStats, pass: pass, redrawReason: redrawReason });
}

function drawLayerInViewport(_ref7) {
  var gl = _ref7.gl,
      layer = _ref7.layer,
      layerIndex = _ref7.layerIndex,
      drawPickingColors = _ref7.drawPickingColors,
      glViewport = _ref7.glViewport,
      parameters = _ref7.parameters;

  var moduleParameters = Object.assign({}, layer.props, {
    viewport: layer.context.viewport,
    pickingActive: drawPickingColors ? 1 : 0
  });

  var uniforms = Object.assign({}, layer.context.uniforms, { layerIndex: layerIndex });

  // All parameter resolving is done here instead of the layer
  // Blend parameters must not be overriden
  var layerParameters = Object.assign({}, layer.props.parameters || {}, parameters);

  Object.assign(layerParameters, {
    viewport: glViewport
  });

  if (drawPickingColors) {
    Object.assign(layerParameters, {
      blendColor: [0, 0, 0, (layerIndex + 1) / 255]
    });
  } else {
    Object.assign(moduleParameters, getObjectHighlightParameters(layer));
  }

  layer.drawLayer({
    moduleParameters: moduleParameters,
    uniforms: uniforms,
    parameters: layerParameters
  });
}

function logRenderStats(_ref8) {
  var renderStats = _ref8.renderStats,
      pass = _ref8.pass,
      redrawReason = _ref8.redrawReason;

  if (_log2.default.priority >= LOG_PRIORITY_DRAW) {
    var totalCount = renderStats.totalCount,
        visibleCount = renderStats.visibleCount,
        compositeCount = renderStats.compositeCount,
        pickableCount = renderStats.pickableCount;

    var primitiveCount = totalCount - compositeCount;
    var hiddenCount = primitiveCount - visibleCount;

    var message = '';
    message += 'RENDER #' + renderCount + ' ' + visibleCount + ' (of ' + totalCount + ' layers) to ' + pass + ' because ' + redrawReason + ' ';
    if (_log2.default.priority > LOG_PRIORITY_DRAW) {
      message += '(' + hiddenCount + ' hidden, ' + compositeCount + ' composite ' + pickableCount + ' unpickable)';
    }

    _log2.default.log(LOG_PRIORITY_DRAW, message);
  }
}

// Get a viewport from a viewport descriptor (which can be a plain viewport)
function getViewportFromDescriptor(viewportOrDescriptor) {
  return viewportOrDescriptor.viewport ? viewportOrDescriptor.viewport : viewportOrDescriptor;
}

/**
 * Returns the picking color of currenlty selected object of the given 'layer'.
 * @return {Array} - the picking color or null if layers selected object is invalid.
 */
function getObjectHighlightParameters(layer) {
  // TODO - inefficient to update settings every render?
  // TODO: Add warning if 'highlightedObjectIndex' is > numberOfInstances of the model.

  // Update picking module settings if highlightedObjectIndex is set.
  // This will overwrite any settings from auto highlighting.
  if (Number.isInteger(layer.props.highlightedObjectIndex)) {
    var pickingSelectedColor = layer.props.highlightedObjectIndex >= 0 ? layer.encodePickingColor(layer.props.highlightedObjectIndex) : null;

    return {
      pickingSelectedColor: pickingSelectedColor
    };
  }
  return null;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL2xpYi9kcmF3LWxheWVycy5qcyJdLCJuYW1lcyI6WyJkcmF3TGF5ZXJzIiwiZHJhd1BpY2tpbmdCdWZmZXIiLCJMT0dfUFJJT1JJVFlfRFJBVyIsInJlbmRlckNvdW50IiwiZ2V0UGl4ZWxSYXRpbyIsInVzZURldmljZVBpeGVscyIsIndpbmRvdyIsImRldmljZVBpeGVsUmF0aW8iLCJnZXRHTFZpZXdwb3J0IiwiZ2wiLCJ2aWV3cG9ydCIsInBpeGVsUmF0aW8iLCJoZWlnaHQiLCJjYW52YXMiLCJjbGllbnRIZWlnaHQiLCJkaW1lbnNpb25zIiwieCIsInkiLCJ3aWR0aCIsImNsZWFyQ2FudmFzIiwiZHJhd2luZ0J1ZmZlcldpZHRoIiwiZHJhd2luZ0J1ZmZlckhlaWdodCIsImNsZWFyIiwiQ09MT1JfQlVGRkVSX0JJVCIsIkRFUFRIX0JVRkZFUl9CSVQiLCJsYXllcnMiLCJ2aWV3cG9ydHMiLCJvblZpZXdwb3J0QWN0aXZlIiwiZHJhd1BpY2tpbmdDb2xvcnMiLCJkZXZpY2VSZWN0IiwicGFyYW1ldGVycyIsImxheWVyRmlsdGVyIiwicGFzcyIsInJlZHJhd1JlYXNvbiIsImZvckVhY2giLCJ2aWV3cG9ydE9yRGVzY3JpcHRvciIsImkiLCJnZXRWaWV3cG9ydEZyb21EZXNjcmlwdG9yIiwiZHJhd0xheWVyc0luVmlld3BvcnQiLCJwaWNraW5nRkJPIiwiZnJhbWVidWZmZXIiLCJzY2lzc29yVGVzdCIsInNjaXNzb3IiLCJjbGVhckNvbG9yIiwiYmxlbmQiLCJibGVuZEZ1bmMiLCJPTkUiLCJaRVJPIiwiQ09OU1RBTlRfQUxQSEEiLCJibGVuZEVxdWF0aW9uIiwiRlVOQ19BREQiLCJibGVuZENvbG9yIiwiZ2xWaWV3cG9ydCIsInJlbmRlclN0YXRzIiwidG90YWxDb3VudCIsImxlbmd0aCIsInZpc2libGVDb3VudCIsImNvbXBvc2l0ZUNvdW50IiwicGlja2FibGVDb3VudCIsImxheWVyIiwibGF5ZXJJbmRleCIsInNob3VsZERyYXdMYXllciIsInByb3BzIiwidmlzaWJsZSIsInBpY2thYmxlIiwiaXNQaWNraW5nIiwiaXNDb21wb3NpdGUiLCJkcmF3TGF5ZXJJblZpZXdwb3J0IiwibG9nUmVuZGVyU3RhdHMiLCJtb2R1bGVQYXJhbWV0ZXJzIiwiT2JqZWN0IiwiYXNzaWduIiwiY29udGV4dCIsInBpY2tpbmdBY3RpdmUiLCJ1bmlmb3JtcyIsImxheWVyUGFyYW1ldGVycyIsImdldE9iamVjdEhpZ2hsaWdodFBhcmFtZXRlcnMiLCJkcmF3TGF5ZXIiLCJwcmlvcml0eSIsInByaW1pdGl2ZUNvdW50IiwiaGlkZGVuQ291bnQiLCJtZXNzYWdlIiwibG9nIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwiaGlnaGxpZ2h0ZWRPYmplY3RJbmRleCIsInBpY2tpbmdTZWxlY3RlZENvbG9yIiwiZW5jb2RlUGlja2luZ0NvbG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7UUE4RGdCQSxVLEdBQUFBLFU7UUE0Q0FDLGlCLEdBQUFBLGlCOztBQXJGaEI7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUMsb0JBQW9CLENBQTFCLEMsQ0F6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQU9BLElBQUlDLGNBQWMsQ0FBbEI7O0FBRUE7QUFDTyxJQUFNQyx3Q0FBZ0IsU0FBaEJBLGFBQWdCLE9BQXVCO0FBQUEsTUFBckJDLGVBQXFCLFFBQXJCQSxlQUFxQjs7QUFDbEQsd0JBQU8sT0FBT0EsZUFBUCxLQUEyQixTQUFsQyxFQUE2Qyx5QkFBN0M7QUFDQSxTQUFPQSxtQkFBbUIsT0FBT0MsTUFBUCxLQUFrQixXQUFyQyxHQUFtREEsT0FBT0MsZ0JBQTFELEdBQTZFLENBQXBGO0FBQ0QsQ0FITTs7QUFLUDtBQUNBLElBQU1DLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBQ0MsRUFBRCxTQUFnQztBQUFBLE1BQTFCQyxRQUEw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QUFFRDtBQUNBLFNBQVM1Qyx5QkFBVCxDQUFtQ0Ysb0JBQW5DLEVBQXlEO0FBQ3ZELFNBQU9BLHFCQUFxQnpCLFFBQXJCLEdBQWdDeUIscUJBQXFCekIsUUFBckQsR0FBZ0V5QixvQkFBdkU7QUFDRDs7QUFFRDs7OztBQUlBLFNBQVN5Qyw0QkFBVCxDQUFzQ2pCLEtBQXRDLEVBQTZDO0FBQzNDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUl3QixPQUFPQyxTQUFQLENBQWlCekIsTUFBTUcsS0FBTixDQUFZdUIsc0JBQTdCLENBQUosRUFBMEQ7QUFDeEQsUUFBTUMsdUJBQ0ozQixNQUFNRyxLQUFOLENBQVl1QixzQkFBWixJQUFzQyxDQUF0QyxHQUNJMUIsTUFBTTRCLGtCQUFOLENBQXlCNUIsTUFBTUcsS0FBTixDQUFZdUIsc0JBQXJDLENBREosR0FFSSxJQUhOOztBQUtBLFdBQU87QUFDTEM7QUFESyxLQUFQO0FBR0Q7QUFDRCxTQUFPLElBQVA7QUFDRCIsImZpbGUiOiJkcmF3LWxheWVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNSAtIDIwMTcgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuXG4vKiBnbG9iYWwgd2luZG93ICovXG5pbXBvcnQge0dMLCB3aXRoUGFyYW1ldGVycywgc2V0UGFyYW1ldGVyc30gZnJvbSAnbHVtYS5nbCc7XG5pbXBvcnQgbG9nIGZyb20gJy4uL3V0aWxzL2xvZyc7XG5pbXBvcnQgYXNzZXJ0IGZyb20gJ2Fzc2VydCc7XG5cbmNvbnN0IExPR19QUklPUklUWV9EUkFXID0gMjtcblxubGV0IHJlbmRlckNvdW50ID0gMDtcblxuLy8gVE9ETyAtIEV4cG9ydGVkIGZvciBwaWNrLWxheWVycy5qcyAtIE1vdmUgdG8gdXRpbD9cbmV4cG9ydCBjb25zdCBnZXRQaXhlbFJhdGlvID0gKHt1c2VEZXZpY2VQaXhlbHN9KSA9PiB7XG4gIGFzc2VydCh0eXBlb2YgdXNlRGV2aWNlUGl4ZWxzID09PSAnYm9vbGVhbicsICdJbnZhbGlkIHVzZURldmljZVBpeGVscycpO1xuICByZXR1cm4gdXNlRGV2aWNlUGl4ZWxzICYmIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93LmRldmljZVBpeGVsUmF0aW8gOiAxO1xufTtcblxuLy8gQ29udmVydCB2aWV3cG9ydCB0b3AtbGVmdCBDU1MgY29vcmRpbmF0ZXMgdG8gYm90dG9tIHVwIFdlYkdMIGNvb3JkaW5hdGVzXG5jb25zdCBnZXRHTFZpZXdwb3J0ID0gKGdsLCB7dmlld3BvcnQsIHBpeGVsUmF0aW99KSA9PiB7XG4gIC8vIFRPRE8gLSBkdW1teSBkZWZhdWx0IGZvciBub2RlXG4gIGNvbnN0IGhlaWdodCA9IGdsLmNhbnZhcyA/IGdsLmNhbnZhcy5jbGllbnRIZWlnaHQgOiAxMDA7XG4gIC8vIENvbnZlcnQgdmlld3BvcnQgdG9wLWxlZnQgQ1NTIGNvb3JkaW5hdGVzIHRvIGJvdHRvbSB1cCBXZWJHTCBjb29yZGluYXRlc1xuICBjb25zdCBkaW1lbnNpb25zID0gdmlld3BvcnQ7XG4gIHJldHVybiBbXG4gICAgZGltZW5zaW9ucy54ICogcGl4ZWxSYXRpbyxcbiAgICAoaGVpZ2h0IC0gZGltZW5zaW9ucy55IC0gZGltZW5zaW9ucy5oZWlnaHQpICogcGl4ZWxSYXRpbyxcbiAgICBkaW1lbnNpb25zLndpZHRoICogcGl4ZWxSYXRpbyxcbiAgICBkaW1lbnNpb25zLmhlaWdodCAqIHBpeGVsUmF0aW9cbiAgXTtcbn07XG5cbi8vIEhlbHBlciBmdW5jdGlvbnNcblxuZnVuY3Rpb24gY2xlYXJDYW52YXMoZ2wsIHt1c2VEZXZpY2VQaXhlbHN9KSB7XG4gIC8vIGNvbnN0IHBpeGVsUmF0aW8gPSBnZXRQaXhlbFJhdGlvKHt1c2VEZXZpY2VQaXhlbHN9KTtcbiAgY29uc3Qgd2lkdGggPSBnbC5kcmF3aW5nQnVmZmVyV2lkdGg7XG4gIGNvbnN0IGhlaWdodCA9IGdsLmRyYXdpbmdCdWZmZXJIZWlnaHQ7XG4gIC8vIGNsZWFyIGRlcHRoIGFuZCBjb2xvciBidWZmZXJzLCByZXN0b3JpbmcgdHJhbnNwYXJlbmN5XG4gIHdpdGhQYXJhbWV0ZXJzKGdsLCB7dmlld3BvcnQ6IFswLCAwLCB3aWR0aCwgaGVpZ2h0XX0sICgpID0+IHtcbiAgICBnbC5jbGVhcihHTC5DT0xPUl9CVUZGRVJfQklUIHwgR0wuREVQVEhfQlVGRkVSX0JJVCk7XG4gIH0pO1xufVxuXG4vLyBEcmF3IGEgbGlzdCBvZiBsYXllcnMgaW4gYSBsaXN0IG9mIHZpZXdwb3J0c1xuZXhwb3J0IGZ1bmN0aW9uIGRyYXdMYXllcnMoXG4gIGdsLFxuICB7XG4gICAgbGF5ZXJzLFxuICAgIHZpZXdwb3J0cyxcbiAgICBvblZpZXdwb3J0QWN0aXZlLFxuICAgIHVzZURldmljZVBpeGVscyxcbiAgICBkcmF3UGlja2luZ0NvbG9ycyA9IGZhbHNlLFxuICAgIGRldmljZVJlY3QgPSBudWxsLFxuICAgIHBhcmFtZXRlcnMgPSB7fSxcbiAgICBsYXllckZpbHRlciA9IG51bGwsXG4gICAgcGFzcyA9ICdkcmF3JyxcbiAgICByZWRyYXdSZWFzb24gPSAnJ1xuICB9XG4pIHtcbiAgY2xlYXJDYW52YXMoZ2wsIHt1c2VEZXZpY2VQaXhlbHN9KTtcblxuICAvLyBlZmZlY3RNYW5hZ2VyLnByZURyYXcoKTtcblxuICB2aWV3cG9ydHMuZm9yRWFjaCgodmlld3BvcnRPckRlc2NyaXB0b3IsIGkpID0+IHtcbiAgICBjb25zdCB2aWV3cG9ydCA9IGdldFZpZXdwb3J0RnJvbURlc2NyaXB0b3Iodmlld3BvcnRPckRlc2NyaXB0b3IpO1xuXG4gICAgLy8gVXBkYXRlIGNvbnRleHQgdG8gcG9pbnQgdG8gdGhpcyB2aWV3cG9ydFxuICAgIG9uVmlld3BvcnRBY3RpdmUodmlld3BvcnQpO1xuXG4gICAgLy8gcmVuZGVyIHRoaXMgdmlld3BvcnRcbiAgICBkcmF3TGF5ZXJzSW5WaWV3cG9ydChnbCwge1xuICAgICAgbGF5ZXJzLFxuICAgICAgdmlld3BvcnQsXG4gICAgICB1c2VEZXZpY2VQaXhlbHMsXG4gICAgICBkcmF3UGlja2luZ0NvbG9ycyxcbiAgICAgIGRldmljZVJlY3QsXG4gICAgICBwYXJhbWV0ZXJzLFxuICAgICAgbGF5ZXJGaWx0ZXIsXG4gICAgICBwYXNzLFxuICAgICAgcmVkcmF3UmVhc29uXG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIGVmZmVjdE1hbmFnZXIuZHJhdygpO1xufVxuXG4vLyBEcmF3cyBsaXN0IG9mIGxheWVycyBhbmQgdmlld3BvcnRzIGludG8gdGhlIHBpY2tpbmcgYnVmZmVyXG4vLyBOb3RlOiBkb2VzIG5vdCBzYW1wbGUgdGhlIGJ1ZmZlciwgdGhhdCBoYXMgdG8gYmUgZG9uZSBieSB0aGUgY2FsbGVyXG5leHBvcnQgZnVuY3Rpb24gZHJhd1BpY2tpbmdCdWZmZXIoXG4gIGdsLFxuICB7XG4gICAgbGF5ZXJzLFxuICAgIHZpZXdwb3J0cyxcbiAgICBvblZpZXdwb3J0QWN0aXZlLFxuICAgIHVzZURldmljZVBpeGVscyxcbiAgICBwaWNraW5nRkJPLFxuICAgIGRldmljZVJlY3Q6IHt4LCB5LCB3aWR0aCwgaGVpZ2h0fSxcbiAgICBsYXllckZpbHRlciA9IG51bGwsXG4gICAgcmVkcmF3UmVhc29uID0gJydcbiAgfVxuKSB7XG4gIC8vIE1ha2Ugc3VyZSB3ZSBjbGVhciBzY2lzc29yIHRlc3QgYW5kIGZibyBiaW5kaW5ncyBpbiBjYXNlIG9mIGV4Y2VwdGlvbnNcbiAgLy8gV2UgYXJlIG9ubHkgaW50ZXJlc3RlZCBpbiBvbmUgcGl4ZWwsIG5vIG5lZWQgdG8gcmVuZGVyIGFueXRoaW5nIGVsc2VcbiAgLy8gTm90ZSB0aGF0IHRoZSBjYWxsYmFjayBoZXJlIGlzIGNhbGxlZCBzeW5jaHJvbm91c2x5LlxuICAvLyBTZXQgYmxlbmQgbW9kZSBmb3IgcGlja2luZ1xuICAvLyBhbHdheXMgb3ZlcndyaXRlIGV4aXN0aW5nIHBpeGVsIHdpdGggW3IsZyxiLGxheWVySW5kZXhdXG4gIHJldHVybiB3aXRoUGFyYW1ldGVycyhcbiAgICBnbCxcbiAgICB7XG4gICAgICBmcmFtZWJ1ZmZlcjogcGlja2luZ0ZCTyxcbiAgICAgIHNjaXNzb3JUZXN0OiB0cnVlLFxuICAgICAgc2Npc3NvcjogW3gsIHksIHdpZHRoLCBoZWlnaHRdLFxuICAgICAgY2xlYXJDb2xvcjogWzAsIDAsIDAsIDBdXG4gICAgfSxcbiAgICAoKSA9PiB7XG4gICAgICBkcmF3TGF5ZXJzKGdsLCB7XG4gICAgICAgIGxheWVycyxcbiAgICAgICAgdmlld3BvcnRzLFxuICAgICAgICBvblZpZXdwb3J0QWN0aXZlLFxuICAgICAgICB1c2VEZXZpY2VQaXhlbHMsXG4gICAgICAgIGRyYXdQaWNraW5nQ29sb3JzOiB0cnVlLFxuICAgICAgICBsYXllckZpbHRlcixcbiAgICAgICAgcGFzczogJ3BpY2tpbmcnLFxuICAgICAgICByZWRyYXdSZWFzb24sXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBibGVuZDogdHJ1ZSxcbiAgICAgICAgICBibGVuZEZ1bmM6IFtnbC5PTkUsIGdsLlpFUk8sIGdsLkNPTlNUQU5UX0FMUEhBLCBnbC5aRVJPXSxcbiAgICAgICAgICBibGVuZEVxdWF0aW9uOiBnbC5GVU5DX0FERCxcbiAgICAgICAgICBibGVuZENvbG9yOiBbMCwgMCwgMCwgMF1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICApO1xufVxuXG4vLyBEcmF3cyBhIGxpc3Qgb2YgbGF5ZXJzIGluIG9uZSB2aWV3cG9ydFxuLy8gVE9ETyAtIHdoZW4gcGlja2luZyB3ZSBjb3VsZCBjb21wbGV0ZWx5IHNraXAgcmVuZGVyaW5nIHZpZXdwb3J0cyB0aGF0IGRvbnRcbi8vIGludGVyc2VjdCB3aXRoIHRoZSBwaWNraW5nIHJlY3RcbmZ1bmN0aW9uIGRyYXdMYXllcnNJblZpZXdwb3J0KFxuICBnbCxcbiAge1xuICAgIGxheWVycyxcbiAgICB2aWV3cG9ydCxcbiAgICB1c2VEZXZpY2VQaXhlbHMsXG4gICAgZHJhd1BpY2tpbmdDb2xvcnMgPSBmYWxzZSxcbiAgICBkZXZpY2VSZWN0ID0gbnVsbCxcbiAgICBwYXJhbWV0ZXJzID0ge30sXG4gICAgbGF5ZXJGaWx0ZXIsXG4gICAgcGFzcyA9ICdkcmF3JyxcbiAgICByZWRyYXdSZWFzb24gPSAnJ1xuICB9XG4pIHtcbiAgY29uc3QgcGl4ZWxSYXRpbyA9IGdldFBpeGVsUmF0aW8oe3VzZURldmljZVBpeGVsc30pO1xuICBjb25zdCBnbFZpZXdwb3J0ID0gZ2V0R0xWaWV3cG9ydChnbCwge3ZpZXdwb3J0LCBwaXhlbFJhdGlvfSk7XG5cbiAgLy8gcmVuZGVyIGxheWVycyBpbiBub3JtYWwgY29sb3JzXG4gIGNvbnN0IHJlbmRlclN0YXRzID0ge1xuICAgIHRvdGFsQ291bnQ6IGxheWVycy5sZW5ndGgsXG4gICAgdmlzaWJsZUNvdW50OiAwLFxuICAgIGNvbXBvc2l0ZUNvdW50OiAwLFxuICAgIHBpY2thYmxlQ291bnQ6IDBcbiAgfTtcblxuICAvLyBjb25zdCB7eCwgeSwgd2lkdGgsIGhlaWdodH0gPSBkZXZpY2VSZWN0IHx8IFtdO1xuXG4gIHNldFBhcmFtZXRlcnMoZ2wsIHBhcmFtZXRlcnMgfHwge30pO1xuXG4gIC8vIHJlbmRlciBsYXllcnMgaW4gbm9ybWFsIGNvbG9yc1xuICBsYXllcnMuZm9yRWFjaCgobGF5ZXIsIGxheWVySW5kZXgpID0+IHtcbiAgICAvLyBDaGVjayBpZiB3ZSBzaG91bGQgZHJhdyBsYXllclxuICAgIGxldCBzaG91bGREcmF3TGF5ZXIgPSBsYXllci5wcm9wcy52aXNpYmxlO1xuICAgIGlmIChkcmF3UGlja2luZ0NvbG9ycykge1xuICAgICAgc2hvdWxkRHJhd0xheWVyID0gc2hvdWxkRHJhd0xheWVyICYmIGxheWVyLnByb3BzLnBpY2thYmxlO1xuICAgIH1cbiAgICBpZiAoc2hvdWxkRHJhd0xheWVyICYmIGxheWVyRmlsdGVyKSB7XG4gICAgICBzaG91bGREcmF3TGF5ZXIgPSBsYXllckZpbHRlcih7bGF5ZXIsIHZpZXdwb3J0LCBpc1BpY2tpbmc6IGRyYXdQaWNraW5nQ29sb3JzfSk7XG4gICAgfVxuXG4gICAgLy8gQ2FsY3VsYXRlIHN0YXRzXG4gICAgaWYgKHNob3VsZERyYXdMYXllciAmJiBsYXllci5wcm9wcy5waWNrYWJsZSkge1xuICAgICAgcmVuZGVyU3RhdHMucGlja2FibGVDb3VudCsrO1xuICAgIH1cbiAgICBpZiAobGF5ZXIuaXNDb21wb3NpdGUpIHtcbiAgICAgIHJlbmRlclN0YXRzLmNvbXBvc2l0ZUNvdW50Kys7XG4gICAgfVxuXG4gICAgLy8gRHJhdyB0aGUgbGF5ZXJcbiAgICBpZiAoc2hvdWxkRHJhd0xheWVyKSB7XG4gICAgICBpZiAoIWxheWVyLmlzQ29tcG9zaXRlKSB7XG4gICAgICAgIHJlbmRlclN0YXRzLnZpc2libGVDb3VudCsrO1xuICAgICAgfVxuXG4gICAgICBkcmF3TGF5ZXJJblZpZXdwb3J0KHtnbCwgbGF5ZXIsIGxheWVySW5kZXgsIGRyYXdQaWNraW5nQ29sb3JzLCBnbFZpZXdwb3J0LCBwYXJhbWV0ZXJzfSk7XG4gICAgfVxuICB9KTtcblxuICByZW5kZXJDb3VudCsrO1xuXG4gIGxvZ1JlbmRlclN0YXRzKHtyZW5kZXJTdGF0cywgcGFzcywgcmVkcmF3UmVhc29ufSk7XG59XG5cbmZ1bmN0aW9uIGRyYXdMYXllckluVmlld3BvcnQoe2dsLCBsYXllciwgbGF5ZXJJbmRleCwgZHJhd1BpY2tpbmdDb2xvcnMsIGdsVmlld3BvcnQsIHBhcmFtZXRlcnN9KSB7XG4gIGNvbnN0IG1vZHVsZVBhcmFtZXRlcnMgPSBPYmplY3QuYXNzaWduKHt9LCBsYXllci5wcm9wcywge1xuICAgIHZpZXdwb3J0OiBsYXllci5jb250ZXh0LnZpZXdwb3J0LFxuICAgIHBpY2tpbmdBY3RpdmU6IGRyYXdQaWNraW5nQ29sb3JzID8gMSA6IDBcbiAgfSk7XG5cbiAgY29uc3QgdW5pZm9ybXMgPSBPYmplY3QuYXNzaWduKHt9LCBsYXllci5jb250ZXh0LnVuaWZvcm1zLCB7bGF5ZXJJbmRleH0pO1xuXG4gIC8vIEFsbCBwYXJhbWV0ZXIgcmVzb2x2aW5nIGlzIGRvbmUgaGVyZSBpbnN0ZWFkIG9mIHRoZSBsYXllclxuICAvLyBCbGVuZCBwYXJhbWV0ZXJzIG11c3Qgbm90IGJlIG92ZXJyaWRlblxuICBjb25zdCBsYXllclBhcmFtZXRlcnMgPSBPYmplY3QuYXNzaWduKHt9LCBsYXllci5wcm9wcy5wYXJhbWV0ZXJzIHx8IHt9LCBwYXJhbWV0ZXJzKTtcblxuICBPYmplY3QuYXNzaWduKGxheWVyUGFyYW1ldGVycywge1xuICAgIHZpZXdwb3J0OiBnbFZpZXdwb3J0XG4gIH0pO1xuXG4gIGlmIChkcmF3UGlja2luZ0NvbG9ycykge1xuICAgIE9iamVjdC5hc3NpZ24obGF5ZXJQYXJhbWV0ZXJzLCB7XG4gICAgICBibGVuZENvbG9yOiBbMCwgMCwgMCwgKGxheWVySW5kZXggKyAxKSAvIDI1NV1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBPYmplY3QuYXNzaWduKG1vZHVsZVBhcmFtZXRlcnMsIGdldE9iamVjdEhpZ2hsaWdodFBhcmFtZXRlcnMobGF5ZXIpKTtcbiAgfVxuXG4gIGxheWVyLmRyYXdMYXllcih7XG4gICAgbW9kdWxlUGFyYW1ldGVycyxcbiAgICB1bmlmb3JtcyxcbiAgICBwYXJhbWV0ZXJzOiBsYXllclBhcmFtZXRlcnNcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGxvZ1JlbmRlclN0YXRzKHtyZW5kZXJTdGF0cywgcGFzcywgcmVkcmF3UmVhc29ufSkge1xuICBpZiAobG9nLnByaW9yaXR5ID49IExPR19QUklPUklUWV9EUkFXKSB7XG4gICAgY29uc3Qge3RvdGFsQ291bnQsIHZpc2libGVDb3VudCwgY29tcG9zaXRlQ291bnQsIHBpY2thYmxlQ291bnR9ID0gcmVuZGVyU3RhdHM7XG4gICAgY29uc3QgcHJpbWl0aXZlQ291bnQgPSB0b3RhbENvdW50IC0gY29tcG9zaXRlQ291bnQ7XG4gICAgY29uc3QgaGlkZGVuQ291bnQgPSBwcmltaXRpdmVDb3VudCAtIHZpc2libGVDb3VudDtcblxuICAgIGxldCBtZXNzYWdlID0gJyc7XG4gICAgbWVzc2FnZSArPSBgUkVOREVSICMke3JlbmRlckNvdW50fSBcXFxuJHt2aXNpYmxlQ291bnR9IChvZiAke3RvdGFsQ291bnR9IGxheWVycykgdG8gJHtwYXNzfSBiZWNhdXNlICR7cmVkcmF3UmVhc29ufSBgO1xuICAgIGlmIChsb2cucHJpb3JpdHkgPiBMT0dfUFJJT1JJVFlfRFJBVykge1xuICAgICAgbWVzc2FnZSArPSBgXFxcbigke2hpZGRlbkNvdW50fSBoaWRkZW4sICR7Y29tcG9zaXRlQ291bnR9IGNvbXBvc2l0ZSAke3BpY2thYmxlQ291bnR9IHVucGlja2FibGUpYDtcbiAgICB9XG5cbiAgICBsb2cubG9nKExPR19QUklPUklUWV9EUkFXLCBtZXNzYWdlKTtcbiAgfVxufVxuXG4vLyBHZXQgYSB2aWV3cG9ydCBmcm9tIGEgdmlld3BvcnQgZGVzY3JpcHRvciAod2hpY2ggY2FuIGJlIGEgcGxhaW4gdmlld3BvcnQpXG5mdW5jdGlvbiBnZXRWaWV3cG9ydEZyb21EZXNjcmlwdG9yKHZpZXdwb3J0T3JEZXNjcmlwdG9yKSB7XG4gIHJldHVybiB2aWV3cG9ydE9yRGVzY3JpcHRvci52aWV3cG9ydCA/IHZpZXdwb3J0T3JEZXNjcmlwdG9yLnZpZXdwb3J0IDogdmlld3BvcnRPckRlc2NyaXB0b3I7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgcGlja2luZyBjb2xvciBvZiBjdXJyZW5sdHkgc2VsZWN0ZWQgb2JqZWN0IG9mIHRoZSBnaXZlbiAnbGF5ZXInLlxuICogQHJldHVybiB7QXJyYXl9IC0gdGhlIHBpY2tpbmcgY29sb3Igb3IgbnVsbCBpZiBsYXllcnMgc2VsZWN0ZWQgb2JqZWN0IGlzIGludmFsaWQuXG4gKi9cbmZ1bmN0aW9uIGdldE9iamVjdEhpZ2hsaWdodFBhcmFtZXRlcnMobGF5ZXIpIHtcbiAgLy8gVE9ETyAtIGluZWZmaWNpZW50IHRvIHVwZGF0ZSBzZXR0aW5ncyBldmVyeSByZW5kZXI/XG4gIC8vIFRPRE86IEFkZCB3YXJuaW5nIGlmICdoaWdobGlnaHRlZE9iamVjdEluZGV4JyBpcyA+IG51bWJlck9mSW5zdGFuY2VzIG9mIHRoZSBtb2RlbC5cblxuICAvLyBVcGRhdGUgcGlja2luZyBtb2R1bGUgc2V0dGluZ3MgaWYgaGlnaGxpZ2h0ZWRPYmplY3RJbmRleCBpcyBzZXQuXG4gIC8vIFRoaXMgd2lsbCBvdmVyd3JpdGUgYW55IHNldHRpbmdzIGZyb20gYXV0byBoaWdobGlnaHRpbmcuXG4gIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGxheWVyLnByb3BzLmhpZ2hsaWdodGVkT2JqZWN0SW5kZXgpKSB7XG4gICAgY29uc3QgcGlja2luZ1NlbGVjdGVkQ29sb3IgPVxuICAgICAgbGF5ZXIucHJvcHMuaGlnaGxpZ2h0ZWRPYmplY3RJbmRleCA+PSAwXG4gICAgICAgID8gbGF5ZXIuZW5jb2RlUGlja2luZ0NvbG9yKGxheWVyLnByb3BzLmhpZ2hsaWdodGVkT2JqZWN0SW5kZXgpXG4gICAgICAgIDogbnVsbDtcblxuICAgIHJldHVybiB7XG4gICAgICBwaWNraW5nU2VsZWN0ZWRDb2xvclxuICAgIH07XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG4iXX0=