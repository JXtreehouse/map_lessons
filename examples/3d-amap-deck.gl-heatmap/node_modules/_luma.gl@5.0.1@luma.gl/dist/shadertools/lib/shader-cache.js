'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _shader = require('../../webgl/shader');

var _program = require('../../webgl/program');

var _program2 = _interopRequireDefault(_program);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShaderCache = /*#__PURE__*/function () {

  /**
   * A cache of compiled shaders, keyed by shader source strings.
   * Compilation of long shaders can be time consuming.
   * By using this class, the application can ensure that each shader
   * is only compiled once.
   */
  function ShaderCache() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        gl = _ref.gl,
        _ref$_cachePrograms = _ref._cachePrograms,
        _cachePrograms = _ref$_cachePrograms === undefined ? false : _ref$_cachePrograms;

    _classCallCheck(this, ShaderCache);

    (0, _assert2.default)(gl);
    this.gl = gl;
    this.vertexShaders = {};
    this.fragmentShaders = {};
    this.programs = {};
    this._cachePrograms = _cachePrograms;
  }

  /**
   * Deletes shader references
   * @return {ShaderCache} - returns this for chaining
   */


  _createClass(ShaderCache, [{
    key: 'delete',
    value: function _delete() {
      // TODO - requires reference counting to avoid deleting shaders in use
      return this;
    }

    /**
     * Returns a compiled `VertexShader` object corresponding to the supplied
     * GLSL source code string, if possible from cache.
     *
     * @param {WebGLRenderingContext} gl - gl context
     * @param {String} source - Source code for shader
     * @return {VertexShader} - a compiled vertex shader
     */

  }, {
    key: 'getVertexShader',
    value: function getVertexShader(gl, source) {
      (0, _assert2.default)(typeof source === 'string');
      (0, _assert2.default)(this._compareContexts(gl, this.gl));

      var shader = this.vertexShaders[source];
      if (!shader) {
        shader = new _shader.VertexShader(gl, source);
        this.vertexShaders[source] = shader;
      }
      return shader;
    }

    /**
     * Returns a compiled `VertexShader` object corresponding to the supplied
     * GLSL source code string, if possible from cache.
     * @param {WebGLRenderingContext} gl - gl context
     * @param {String} source - Source code for shader
     * @return {FragmentShader} - a compiled fragment shader, possibly from chache
     */

  }, {
    key: 'getFragmentShader',
    value: function getFragmentShader(gl, source) {
      (0, _assert2.default)(typeof source === 'string');
      (0, _assert2.default)(this._compareContexts(gl, this.gl));

      var shader = this.fragmentShaders[source];
      if (!shader) {
        shader = new _shader.FragmentShader(gl, source);
        this.fragmentShaders[source] = shader;
      }
      return shader;
    }

    // Retrive Shaders from cache if exists, otherwise create new instance.

  }, {
    key: 'getProgram',
    value: function getProgram(gl, opts) {
      (0, _assert2.default)(this._compareContexts(gl, this.gl));
      (0, _assert2.default)(typeof opts.vs === 'string');
      (0, _assert2.default)(typeof opts.fs === 'string');
      (0, _assert2.default)(typeof opts.id === 'string');

      var cacheKey = this._getProgramKey(opts);
      var program = this.programs[cacheKey];
      if (program) {
        this._resetProgram(program);
        return program;
      }

      program = this._createNewProgram(gl, opts);

      // Check if program can be cached
      // Program caching is experimental and expects
      // each Model to have a unique-id (wich is used in key generation)
      if (this._cachePrograms && this._checkProgramProp(program)) {
        this.programs[cacheKey] = program;
      }

      return program;
    }
  }, {
    key: '_getProgramKey',
    value: function _getProgramKey(opts) {
      return opts.id + '-' + opts.vs + '-' + opts.fs;
    }
  }, {
    key: '_checkProgramProp',
    value: function _checkProgramProp(program) {
      // Check for transform feedback props (varyings, etc), we can't key such programs for now
      return !program.varyings;
    }
  }, {
    key: '_createNewProgram',
    value: function _createNewProgram(gl, opts) {
      var vs = opts.vs,
          fs = opts.fs;

      var vertexShader = this.getVertexShader(gl, vs);
      var fragmentShader = this.getFragmentShader(gl, fs);
      return new _program2.default(this.gl, Object.assign({}, opts, {
        vs: vertexShader,
        fs: fragmentShader
      }));
    }
  }, {
    key: '_resetProgram',
    value: function _resetProgram(program, opts) {
      program.reset();
    }

    // Handle debug contexts

  }, {
    key: '_compareContexts',
    value: function _compareContexts(gl1, gl2) {
      return (gl1.gl || gl1) === (gl2.gl || gl2);
    }
  }]);

  return ShaderCache;
}();

exports.default = ShaderCache;
//# sourceMappingURL=shader-cache.js.map