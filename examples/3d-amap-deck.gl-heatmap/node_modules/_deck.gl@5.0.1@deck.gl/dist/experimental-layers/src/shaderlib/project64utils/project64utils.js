'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

/* eslint-disable camelcase */
var INITIAL_STATE = {};

function getUniforms() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;

  _objectDestructuringEmpty(_ref);

  var uniforms = {};
  return uniforms;
}

var vs = 'vec4 project_position_and_offset_to_clipspace_fp64(\n  vec3 position64xyzHi, vec2 position64xyLow, vec3 offset, out vec4 worldPosition\n) {\n  // This is the local offset to the instance position\n  vec2 offset64[4];\n  vec4_fp64(vec4(offset, 0.0), offset64);\n\n  // The 64 bit xy vertex position\n  vec4 position64xy = vec4(\n    position64xyzHi.x, position64xyLow.x,\n    position64xyzHi.y, position64xyLow.y\n  );\n\n  float z = project_scale(position64xyzHi.z);\n\n  // Apply web mercator projection (depends on coordinate system imn use)\n  vec2 projectedPosition64xy[2];\n  project_position_fp64(position64xy, projectedPosition64xy);\n\n  vec2 worldPosition64[4];\n  worldPosition64[0] = sum_fp64(offset64[0], projectedPosition64xy[0]);\n  worldPosition64[1] = sum_fp64(offset64[1], projectedPosition64xy[1]);\n  worldPosition64[2] = sum_fp64(offset64[2], vec2(z, 0.0));\n  worldPosition64[3] = vec2(1.0, 0.0);\n\n  worldPosition = vec4(projectedPosition64xy[0].x, projectedPosition64xy[1].x, z, 1.0);\n\n  return project_to_clipspace_fp64(worldPosition64);\n}\n\nvec4 project_position_and_offset_to_clipspace_fp64(\n  vec3 position64xyzHi, vec2 position64xyLow, vec3 offset\n) {\n  vec4 worldPosition;\n  return project_position_and_offset_to_clipspace_fp64(\n    position64xyzHi, position64xyLow, offset, worldPosition\n  );\n}\n';

exports.default = {
  name: 'project64utils',
  dependencies: ['project64'],
  vs: vs,
  fs: null,
  getUniforms: getUniforms
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9leHBlcmltZW50YWwtbGF5ZXJzL3NyYy9zaGFkZXJsaWIvcHJvamVjdDY0dXRpbHMvcHJvamVjdDY0dXRpbHMuanMiXSwibmFtZXMiOlsiSU5JVElBTF9TVEFURSIsImdldFVuaWZvcm1zIiwidW5pZm9ybXMiLCJ2cyIsIm5hbWUiLCJkZXBlbmRlbmNpZXMiLCJmcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTtBQUNBLElBQU1BLGdCQUFnQixFQUF0Qjs7QUFFQSxTQUFTQyxXQUFULEdBQXlDO0FBQUEsaUZBQWZELGFBQWU7O0FBQUE7O0FBQ3ZDLE1BQU1FLFdBQVcsRUFBakI7QUFDQSxTQUFPQSxRQUFQO0FBQ0Q7O0FBRUQsSUFBTUMsaTBDQUFOOztrQkF5Q2U7QUFDYkMsUUFBTSxnQkFETztBQUViQyxnQkFBYyxDQUFDLFdBQUQsQ0FGRDtBQUdiRixRQUhhO0FBSWJHLE1BQUksSUFKUztBQUtiTDtBQUxhLEMiLCJmaWxlIjoicHJvamVjdDY0dXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBjYW1lbGNhc2UgKi9cbmNvbnN0IElOSVRJQUxfU1RBVEUgPSB7fTtcblxuZnVuY3Rpb24gZ2V0VW5pZm9ybXMoe30gPSBJTklUSUFMX1NUQVRFKSB7XG4gIGNvbnN0IHVuaWZvcm1zID0ge307XG4gIHJldHVybiB1bmlmb3Jtcztcbn1cblxuY29uc3QgdnMgPSBgXFxcbnZlYzQgcHJvamVjdF9wb3NpdGlvbl9hbmRfb2Zmc2V0X3RvX2NsaXBzcGFjZV9mcDY0KFxuICB2ZWMzIHBvc2l0aW9uNjR4eXpIaSwgdmVjMiBwb3NpdGlvbjY0eHlMb3csIHZlYzMgb2Zmc2V0LCBvdXQgdmVjNCB3b3JsZFBvc2l0aW9uXG4pIHtcbiAgLy8gVGhpcyBpcyB0aGUgbG9jYWwgb2Zmc2V0IHRvIHRoZSBpbnN0YW5jZSBwb3NpdGlvblxuICB2ZWMyIG9mZnNldDY0WzRdO1xuICB2ZWM0X2ZwNjQodmVjNChvZmZzZXQsIDAuMCksIG9mZnNldDY0KTtcblxuICAvLyBUaGUgNjQgYml0IHh5IHZlcnRleCBwb3NpdGlvblxuICB2ZWM0IHBvc2l0aW9uNjR4eSA9IHZlYzQoXG4gICAgcG9zaXRpb242NHh5ekhpLngsIHBvc2l0aW9uNjR4eUxvdy54LFxuICAgIHBvc2l0aW9uNjR4eXpIaS55LCBwb3NpdGlvbjY0eHlMb3cueVxuICApO1xuXG4gIGZsb2F0IHogPSBwcm9qZWN0X3NjYWxlKHBvc2l0aW9uNjR4eXpIaS56KTtcblxuICAvLyBBcHBseSB3ZWIgbWVyY2F0b3IgcHJvamVjdGlvbiAoZGVwZW5kcyBvbiBjb29yZGluYXRlIHN5c3RlbSBpbW4gdXNlKVxuICB2ZWMyIHByb2plY3RlZFBvc2l0aW9uNjR4eVsyXTtcbiAgcHJvamVjdF9wb3NpdGlvbl9mcDY0KHBvc2l0aW9uNjR4eSwgcHJvamVjdGVkUG9zaXRpb242NHh5KTtcblxuICB2ZWMyIHdvcmxkUG9zaXRpb242NFs0XTtcbiAgd29ybGRQb3NpdGlvbjY0WzBdID0gc3VtX2ZwNjQob2Zmc2V0NjRbMF0sIHByb2plY3RlZFBvc2l0aW9uNjR4eVswXSk7XG4gIHdvcmxkUG9zaXRpb242NFsxXSA9IHN1bV9mcDY0KG9mZnNldDY0WzFdLCBwcm9qZWN0ZWRQb3NpdGlvbjY0eHlbMV0pO1xuICB3b3JsZFBvc2l0aW9uNjRbMl0gPSBzdW1fZnA2NChvZmZzZXQ2NFsyXSwgdmVjMih6LCAwLjApKTtcbiAgd29ybGRQb3NpdGlvbjY0WzNdID0gdmVjMigxLjAsIDAuMCk7XG5cbiAgd29ybGRQb3NpdGlvbiA9IHZlYzQocHJvamVjdGVkUG9zaXRpb242NHh5WzBdLngsIHByb2plY3RlZFBvc2l0aW9uNjR4eVsxXS54LCB6LCAxLjApO1xuXG4gIHJldHVybiBwcm9qZWN0X3RvX2NsaXBzcGFjZV9mcDY0KHdvcmxkUG9zaXRpb242NCk7XG59XG5cbnZlYzQgcHJvamVjdF9wb3NpdGlvbl9hbmRfb2Zmc2V0X3RvX2NsaXBzcGFjZV9mcDY0KFxuICB2ZWMzIHBvc2l0aW9uNjR4eXpIaSwgdmVjMiBwb3NpdGlvbjY0eHlMb3csIHZlYzMgb2Zmc2V0XG4pIHtcbiAgdmVjNCB3b3JsZFBvc2l0aW9uO1xuICByZXR1cm4gcHJvamVjdF9wb3NpdGlvbl9hbmRfb2Zmc2V0X3RvX2NsaXBzcGFjZV9mcDY0KFxuICAgIHBvc2l0aW9uNjR4eXpIaSwgcG9zaXRpb242NHh5TG93LCBvZmZzZXQsIHdvcmxkUG9zaXRpb25cbiAgKTtcbn1cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ3Byb2plY3Q2NHV0aWxzJyxcbiAgZGVwZW5kZW5jaWVzOiBbJ3Byb2plY3Q2NCddLFxuICB2cyxcbiAgZnM6IG51bGwsXG4gIGdldFVuaWZvcm1zXG59O1xuIl19