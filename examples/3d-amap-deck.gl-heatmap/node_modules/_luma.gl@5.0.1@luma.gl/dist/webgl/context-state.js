'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getModifiedParameters = exports.resetParameters = exports.setParameter = exports.getParameters = exports.getParameter = exports.LUMA_SETTERS = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.setParameters = setParameters;
exports.withParameters = withParameters;

var _constants = require('../webgl-utils/constants');

var _constants2 = _interopRequireDefault(_constants);

var _trackContextState = require('../webgl-utils/track-context-state');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _setParameters = require('../webgl-utils/set-parameters');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /* eslint-disable no-inline-comments, max-len */


// map of parameter setter function names, parameter constants, default values and types
// - Uses gl function names, except when setter function exist that are named differently
// - When the WebGL api offers <setter> and <setter>Separate (e.g. blendEquation and
//   blendEquationSeparate, we use non-separate name, but accept both non-separate and
//   separate arguments. Thus, a `getParameter` call will always return all the separate values
//   in an array, in a form that can be accepted by the setter.
var LUMA_SETTERS = {
  framebuffer: function framebuffer(gl, _framebuffer) {
    var handle = _framebuffer && _framebuffer.handle ? _framebuffer.handle : _framebuffer;
    return gl.bindFramebuffer(_constants2.default.FRAMEBUFFER, handle);
  },
  blend: function blend(gl, value) {
    return value ? gl.enable(_constants2.default.BLEND) : gl.disable(_constants2.default.BLEND);
  },
  blendColor: function blendColor(gl, value) {
    return gl.blendColor.apply(gl, _toConsumableArray(value));
  },
  blendEquation: function blendEquation(gl, args) {
    args = isArray(args) ? args : [args, args];
    gl.blendEquationSeparate.apply(gl, _toConsumableArray(args));
  },
  blendFunc: function blendFunc(gl, args) {
    args = isArray(args) && args.length === 2 ? [].concat(_toConsumableArray(args), _toConsumableArray(args)) : args;
    gl.blendFuncSeparate.apply(gl, _toConsumableArray(args));
  },

  clearColor: function clearColor(gl, value) {
    return gl.clearColor.apply(gl, _toConsumableArray(value));
  },
  clearDepth: function clearDepth(gl, value) {
    return gl.clearDepth(value);
  },
  clearStencil: function clearStencil(gl, value) {
    return gl.clearStencil(value);
  },

  colorMask: function colorMask(gl, value) {
    return gl.colorMask.apply(gl, _toConsumableArray(value));
  },

  cull: function cull(gl, value) {
    return value ? gl.enable(_constants2.default.CULL_FACE) : gl.disable(_constants2.default.CULL_FACE);
  },
  cullFace: function cullFace(gl, value) {
    return gl.cullFace(value);
  },

  depthTest: function depthTest(gl, value) {
    return value ? gl.enable(_constants2.default.DEPTH_TEST) : gl.disable(_constants2.default.DEPTH_TEST);
  },
  depthFunc: function depthFunc(gl, value) {
    return gl.depthFunc(value);
  },
  depthMask: function depthMask(gl, value) {
    return gl.depthMask(value);
  },
  depthRange: function depthRange(gl, value) {
    return gl.depthRange.apply(gl, _toConsumableArray(value));
  },

  dither: function dither(gl, value) {
    return value ? gl.enable(_constants2.default.DITHER) : gl.disable(_constants2.default.DITHER);
  },

  derivativeHint: function derivativeHint(gl, value) {
    // gl1: 'OES_standard_derivatives'
    gl.hint(_constants2.default.FRAGMENT_SHADER_DERIVATIVE_HINT, value);
  },

  frontFace: function frontFace(gl, value) {
    return gl.frontFace(value);
  },

  mipmapHint: function mipmapHint(gl, value) {
    return gl.hint(_constants2.default.GENERATE_MIPMAP_HINT, value);
  },

  lineWidth: function lineWidth(gl, value) {
    return gl.lineWidth(value);
  },

  polygonOffsetFill: function polygonOffsetFill(gl, value) {
    return value ? gl.enable(_constants2.default.POLYGON_OFFSET_FILL) : gl.disable(_constants2.default.POLYGON_OFFSET_FILL);
  },
  polygonOffset: function polygonOffset(gl, value) {
    return gl.polygonOffset.apply(gl, _toConsumableArray(value));
  },

  sampleCoverage: function sampleCoverage(gl, value) {
    return gl.sampleCoverage.apply(gl, _toConsumableArray(value));
  },

  scissorTest: function scissorTest(gl, value) {
    return value ? gl.enable(_constants2.default.SCISSOR_TEST) : gl.disable(_constants2.default.SCISSOR_TEST);
  },
  scissor: function scissor(gl, value) {
    return gl.scissor.apply(gl, _toConsumableArray(value));
  },

  stencilTest: function stencilTest(gl, value) {
    return value ? gl.enable(_constants2.default.STENCIL_TEST) : gl.disable(_constants2.default.STENCIL_TEST);
  },
  stencilMask: function stencilMask(gl, value) {
    value = isArray(value) ? value : [value, value];

    var _value = value,
        _value2 = _slicedToArray(_value, 2),
        mask = _value2[0],
        backMask = _value2[1];

    gl.stencilMaskSeparate(_constants2.default.FRONT, mask);
    gl.stencilMaskSeparate(_constants2.default.BACK, backMask);
  },
  stencilFunc: function stencilFunc(gl, args) {
    args = isArray(args) && args.length === 3 ? [].concat(_toConsumableArray(args), _toConsumableArray(args)) : args;

    var _args = args,
        _args2 = _slicedToArray(_args, 6),
        func = _args2[0],
        ref = _args2[1],
        mask = _args2[2],
        backFunc = _args2[3],
        backRef = _args2[4],
        backMask = _args2[5];

    gl.stencilFuncSeparate(_constants2.default.FRONT, func, ref, mask);
    gl.stencilFuncSeparate(_constants2.default.BACK, backFunc, backRef, backMask);
  },
  stencilOp: function stencilOp(gl, args) {
    args = isArray(args) && args.length === 3 ? [].concat(_toConsumableArray(args), _toConsumableArray(args)) : args;

    var _args3 = args,
        _args4 = _slicedToArray(_args3, 6),
        sfail = _args4[0],
        dpfail = _args4[1],
        dppass = _args4[2],
        backSfail = _args4[3],
        backDpfail = _args4[4],
        backDppass = _args4[5];

    gl.stencilOpSeparate(_constants2.default.FRONT, sfail, dpfail, dppass);
    gl.stencilOpSeparate(_constants2.default.BACK, backSfail, backDpfail, backDppass);
  },

  viewport: function viewport(gl, value) {
    return gl.viewport.apply(gl, _toConsumableArray(value));
  }
};

// HELPERS

exports.LUMA_SETTERS = LUMA_SETTERS;
function isArray(array) {
  return Array.isArray(array) || ArrayBuffer.isView(array);
}

// GETTERS AND SETTERS

// Get the parameter value(s) from the context
exports.getParameter = _setParameters.getParameter; // from '../webgl-utils/set-parameters'

// Get the parameters from the context

exports.getParameters = _setParameters.getParameters; // from '../webgl-utils/set-parameters'

// Resets gl state to default values.

exports.setParameter = _setParameters.setParameter; // from '../webgl-utils/set-parameters'

// Resets gl state to default values.

exports.resetParameters = _setParameters.resetParameters; // from '../webgl-utils/set-parameters'

// Get a map of modified parameters

exports.getModifiedParameters = _setParameters.getModifiedParameters;

// Note: "setParameters" is given extra treatment below

// Set the parameter value(s) by key to the context
// Sets value with key to context.
// Value may be "normalized" (in case a short form is supported). In that case
// the normalized value is retured.

function setParameters(gl, parameters) {
  (0, _setParameters.setParameters)(gl, parameters);
  for (var key in parameters) {
    var setter = LUMA_SETTERS[key];
    if (setter) {
      setter(gl, parameters[key], key);
    }
  }
}

// VERY LIMITED / BASIC GL STATE MANAGEMENT
// Executes a function with gl states temporarily set, exception safe
// Currently support pixelStorage, scissor test and framebuffer binding
function withParameters(gl, parameters, func) {
  // assertWebGLContext(gl);

  var _parameters$nocatch = parameters.nocatch,
      nocatch = _parameters$nocatch === undefined ? true : _parameters$nocatch;
  // frameBuffer not supported use framebuffer

  (0, _assert2.default)(!parameters.frameBuffer);

  (0, _trackContextState.pushContextState)(gl);
  setParameters(gl, parameters);

  // Setup is done, call the function
  var value = void 0;

  if (nocatch) {
    // Avoid try catch to minimize stack size impact for safe execution paths
    value = func(gl);
    (0, _trackContextState.popContextState)(gl);
  } else {
    // Wrap in a try-catch to ensure that parameters are restored on exceptions
    try {
      value = func(gl);
    } finally {
      (0, _trackContextState.popContextState)(gl);
    }
  }

  return value;
}
//# sourceMappingURL=context-state.js.map