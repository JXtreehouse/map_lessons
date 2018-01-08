'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MODULAR_SHADERS = undefined;

var _modularVertex = require('./modular-vertex.glsl');

var _modularVertex2 = _interopRequireDefault(_modularVertex);

var _modularFragment = require('./modular-fragment.glsl');

var _modularFragment2 = _interopRequireDefault(_modularFragment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Default Shaders

// A set of base shaders that leverage the shader module system,
// dynamically enabling features depending on which modules are included
var MODULAR_SHADERS = exports.MODULAR_SHADERS = {
  vs: _modularVertex2.default,
  fs: _modularFragment2.default,
  defaultUniforms: {}
};
//# sourceMappingURL=index.js.map