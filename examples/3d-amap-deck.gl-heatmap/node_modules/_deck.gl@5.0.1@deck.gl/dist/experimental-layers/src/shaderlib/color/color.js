'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// TODO - this module is a WIP

/* eslint-disable camelcase */
var INITIAL_STATE = {
  color_uOpacity: 1.0,
  color_uDesaturate: 0.0,
  color_uBrightness: 1.0
};

function getUniforms() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;

  var uniforms = {};
  if (opts.opacity) {
    uniforms.color_uOpacity = opts.opacity;
  }
  return uniforms;
}

var vs = 'varying vec4 color_vColor;\n\ncolor_setColor(vec4 color) {\n  color_vColor = color;\n}\n';

var fs = 'uniform float color_uOpacity;\nuniform float color_uDesaturate;\nuniform float color_uBrightness;\n\nvarying vec4 color_vColor;\n\nvec4 color_getColor() {\n  return color_vColor;\n}\n\nvec4 color_filterColor(vec4 color) {\n  // apply desaturation and brightness\n  if (color_uDesaturate > 0.01) {\n    float luminance = (color.r + color.g + color.b) * 0.333333333 + color_uBrightness;\n    color = vec4(mix(color.rgb, vec3(luminance), color_uDesaturate), color.a);\n\n  // Apply opacity\n  color = vec4(color.rgb, color.a * color_uOpacity);\n  return color;\n}\n';

exports.default = {
  name: 'color',
  vs: vs,
  fs: fs,
  getUniforms: getUniforms
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9leHBlcmltZW50YWwtbGF5ZXJzL3NyYy9zaGFkZXJsaWIvY29sb3IvY29sb3IuanMiXSwibmFtZXMiOlsiSU5JVElBTF9TVEFURSIsImNvbG9yX3VPcGFjaXR5IiwiY29sb3JfdURlc2F0dXJhdGUiLCJjb2xvcl91QnJpZ2h0bmVzcyIsImdldFVuaWZvcm1zIiwib3B0cyIsInVuaWZvcm1zIiwib3BhY2l0eSIsInZzIiwiZnMiLCJuYW1lIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBOztBQUVBO0FBQ0EsSUFBTUEsZ0JBQWdCO0FBQ3BCQyxrQkFBZ0IsR0FESTtBQUVwQkMscUJBQW1CLEdBRkM7QUFHcEJDLHFCQUFtQjtBQUhDLENBQXRCOztBQU1BLFNBQVNDLFdBQVQsR0FBMkM7QUFBQSxNQUF0QkMsSUFBc0IsdUVBQWZMLGFBQWU7O0FBQ3pDLE1BQU1NLFdBQVcsRUFBakI7QUFDQSxNQUFJRCxLQUFLRSxPQUFULEVBQWtCO0FBQ2hCRCxhQUFTTCxjQUFULEdBQTBCSSxLQUFLRSxPQUEvQjtBQUNEO0FBQ0QsU0FBT0QsUUFBUDtBQUNEOztBQUVELElBQU1FLCtGQUFOOztBQVFBLElBQU1DLHlqQkFBTjs7a0JBdUJlO0FBQ2JDLFFBQU0sT0FETztBQUViRixRQUZhO0FBR2JDLFFBSGE7QUFJYkw7QUFKYSxDIiwiZmlsZSI6ImNvbG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVE9ETyAtIHRoaXMgbW9kdWxlIGlzIGEgV0lQXG5cbi8qIGVzbGludC1kaXNhYmxlIGNhbWVsY2FzZSAqL1xuY29uc3QgSU5JVElBTF9TVEFURSA9IHtcbiAgY29sb3JfdU9wYWNpdHk6IDEuMCxcbiAgY29sb3JfdURlc2F0dXJhdGU6IDAuMCxcbiAgY29sb3JfdUJyaWdodG5lc3M6IDEuMFxufTtcblxuZnVuY3Rpb24gZ2V0VW5pZm9ybXMob3B0cyA9IElOSVRJQUxfU1RBVEUpIHtcbiAgY29uc3QgdW5pZm9ybXMgPSB7fTtcbiAgaWYgKG9wdHMub3BhY2l0eSkge1xuICAgIHVuaWZvcm1zLmNvbG9yX3VPcGFjaXR5ID0gb3B0cy5vcGFjaXR5O1xuICB9XG4gIHJldHVybiB1bmlmb3Jtcztcbn1cblxuY29uc3QgdnMgPSBgXFxcbnZhcnlpbmcgdmVjNCBjb2xvcl92Q29sb3I7XG5cbmNvbG9yX3NldENvbG9yKHZlYzQgY29sb3IpIHtcbiAgY29sb3JfdkNvbG9yID0gY29sb3I7XG59XG5gO1xuXG5jb25zdCBmcyA9IGBcXFxudW5pZm9ybSBmbG9hdCBjb2xvcl91T3BhY2l0eTtcbnVuaWZvcm0gZmxvYXQgY29sb3JfdURlc2F0dXJhdGU7XG51bmlmb3JtIGZsb2F0IGNvbG9yX3VCcmlnaHRuZXNzO1xuXG52YXJ5aW5nIHZlYzQgY29sb3JfdkNvbG9yO1xuXG52ZWM0IGNvbG9yX2dldENvbG9yKCkge1xuICByZXR1cm4gY29sb3JfdkNvbG9yO1xufVxuXG52ZWM0IGNvbG9yX2ZpbHRlckNvbG9yKHZlYzQgY29sb3IpIHtcbiAgLy8gYXBwbHkgZGVzYXR1cmF0aW9uIGFuZCBicmlnaHRuZXNzXG4gIGlmIChjb2xvcl91RGVzYXR1cmF0ZSA+IDAuMDEpIHtcbiAgICBmbG9hdCBsdW1pbmFuY2UgPSAoY29sb3IuciArIGNvbG9yLmcgKyBjb2xvci5iKSAqIDAuMzMzMzMzMzMzICsgY29sb3JfdUJyaWdodG5lc3M7XG4gICAgY29sb3IgPSB2ZWM0KG1peChjb2xvci5yZ2IsIHZlYzMobHVtaW5hbmNlKSwgY29sb3JfdURlc2F0dXJhdGUpLCBjb2xvci5hKTtcblxuICAvLyBBcHBseSBvcGFjaXR5XG4gIGNvbG9yID0gdmVjNChjb2xvci5yZ2IsIGNvbG9yLmEgKiBjb2xvcl91T3BhY2l0eSk7XG4gIHJldHVybiBjb2xvcjtcbn1cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbmFtZTogJ2NvbG9yJyxcbiAgdnMsXG4gIGZzLFxuICBnZXRVbmlmb3Jtc1xufTtcbiJdfQ==