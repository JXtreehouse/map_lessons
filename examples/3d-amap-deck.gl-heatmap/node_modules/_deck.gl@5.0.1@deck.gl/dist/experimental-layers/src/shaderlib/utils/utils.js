'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

// TODO - this module is a WIP

/* eslint-disable camelcase */
var INITIAL_STATE = {};

function getUniforms() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;

  _objectDestructuringEmpty(_ref);
}

var vs = '// Note - fairly generic, move to a UV or screen package, or even project?\nvec2 project_clipspace_to_uv(vec4 position) {\n  vec2 p = vec2(position.x / position.w, position.y / position.w);\n  return vec2((p.x + 1.0) / 2.0, (p.y + 1.0) / 2.0);\n}\n\nvec2 project_clipspace_to_projective_uv(vec4 position) {\n  // outline_vPosition = mat4(\n  //   0.5, 0.0, 0.0, 0.0,\n  //   0.0, 0.5, 0.0, 0.0,\n  //   0.0, 0.0, 0.5, 0.0,\n  //   0.5, 0.5, 0.5, 1.0\n  // ) * position;\n  return vec4(position.xyz * 0.5 + position.w * 0.5, position.w);\n}\n';

var fs = vs;

exports.default = {
  name: 'outline',
  vs: vs,
  fs: fs,
  getUniforms: getUniforms
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9leHBlcmltZW50YWwtbGF5ZXJzL3NyYy9zaGFkZXJsaWIvdXRpbHMvdXRpbHMuanMiXSwibmFtZXMiOlsiSU5JVElBTF9TVEFURSIsImdldFVuaWZvcm1zIiwidnMiLCJmcyIsIm5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0FBRUE7QUFDQSxJQUFNQSxnQkFBZ0IsRUFBdEI7O0FBRUEsU0FBU0MsV0FBVCxHQUF5QztBQUFBLGlGQUFmRCxhQUFlOztBQUFBO0FBQUU7O0FBRTNDLElBQU1FLG9pQkFBTjs7QUFrQkEsSUFBTUMsS0FBS0QsRUFBWDs7a0JBRWU7QUFDYkUsUUFBTSxTQURPO0FBRWJGLFFBRmE7QUFHYkMsUUFIYTtBQUliRjtBQUphLEMiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUT0RPIC0gdGhpcyBtb2R1bGUgaXMgYSBXSVBcblxuLyogZXNsaW50LWRpc2FibGUgY2FtZWxjYXNlICovXG5jb25zdCBJTklUSUFMX1NUQVRFID0ge307XG5cbmZ1bmN0aW9uIGdldFVuaWZvcm1zKHt9ID0gSU5JVElBTF9TVEFURSkge31cblxuY29uc3QgdnMgPSBgXFxcbi8vIE5vdGUgLSBmYWlybHkgZ2VuZXJpYywgbW92ZSB0byBhIFVWIG9yIHNjcmVlbiBwYWNrYWdlLCBvciBldmVuIHByb2plY3Q/XG52ZWMyIHByb2plY3RfY2xpcHNwYWNlX3RvX3V2KHZlYzQgcG9zaXRpb24pIHtcbiAgdmVjMiBwID0gdmVjMihwb3NpdGlvbi54IC8gcG9zaXRpb24udywgcG9zaXRpb24ueSAvIHBvc2l0aW9uLncpO1xuICByZXR1cm4gdmVjMigocC54ICsgMS4wKSAvIDIuMCwgKHAueSArIDEuMCkgLyAyLjApO1xufVxuXG52ZWMyIHByb2plY3RfY2xpcHNwYWNlX3RvX3Byb2plY3RpdmVfdXYodmVjNCBwb3NpdGlvbikge1xuICAvLyBvdXRsaW5lX3ZQb3NpdGlvbiA9IG1hdDQoXG4gIC8vICAgMC41LCAwLjAsIDAuMCwgMC4wLFxuICAvLyAgIDAuMCwgMC41LCAwLjAsIDAuMCxcbiAgLy8gICAwLjAsIDAuMCwgMC41LCAwLjAsXG4gIC8vICAgMC41LCAwLjUsIDAuNSwgMS4wXG4gIC8vICkgKiBwb3NpdGlvbjtcbiAgcmV0dXJuIHZlYzQocG9zaXRpb24ueHl6ICogMC41ICsgcG9zaXRpb24udyAqIDAuNSwgcG9zaXRpb24udyk7XG59XG5gO1xuXG5jb25zdCBmcyA9IHZzO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG5hbWU6ICdvdXRsaW5lJyxcbiAgdnMsXG4gIGZzLFxuICBnZXRVbmlmb3Jtc1xufTtcbiJdfQ==