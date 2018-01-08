'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable camelcase */
var INITIAL_STATE = {
  outlineEnabled: false,
  outlineRenderShadowmap: false,
  outlineShadowmap: null
};

function getUniforms() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE,
      outlineEnabled = _ref.outlineEnabled,
      outlineRenderShadowmap = _ref.outlineRenderShadowmap,
      outlineShadowmap = _ref.outlineShadowmap;

  var uniforms = {};
  if (outlineEnabled !== undefined) {
    uniforms.outline_uEnabled = outlineEnabled; // ? 1.0 : 0.0;
  }
  if (outlineRenderShadowmap !== undefined) {
    uniforms.outline_uRenderOutlines = outlineRenderShadowmap; // ? 1.0 : 0.0;
  }
  if (outlineShadowmap !== undefined) {
    uniforms.outline_uShadowmap = outlineShadowmap;
  }
  return uniforms;
}

var vs = 'varying float outline_vzLevel;\nvarying vec4 outline_vPosition;\n\n// Set the z level for the outline shadowmap rendering\nvoid outline_setZLevel(float zLevel) {\n  outline_vzLevel = zLevel;\n}\n\n// Store an adjusted position for texture2DProj\nvoid outline_setUV(vec4 position) {\n  // mat4(\n  //   0.5, 0.0, 0.0, 0.0,\n  //   0.0, 0.5, 0.0, 0.0,\n  //   0.0, 0.0, 0.5, 0.0,\n  //   0.5, 0.5, 0.5, 1.0\n  // ) * position;\n  outline_vPosition = vec4(position.xyz * 0.5 + position.w * 0.5, position.w);\n}\n';

var fs = 'uniform bool outline_uEnabled;\nuniform bool outline_uRenderOutlines;\nuniform sampler2D outline_uShadowmap;\n\nvarying float outline_vzLevel;\n// varying vec2 outline_vUV;\nvarying vec4 outline_vPosition;\n\nconst float OUTLINE_Z_LEVEL_ERROR = 0.01;\n\n// Return a darker color in shadowmap\nvec4 outline_filterShadowColor(vec4 color) {\n  return vec4(outline_vzLevel / 255., outline_vzLevel / 255., outline_vzLevel / 255., 1.);\n}\n\n// Return a darker color if in shadowmap\nvec4 outline_filterDarkenColor(vec4 color) {\n  if (outline_uEnabled) {\n    float maxZLevel;\n    if (outline_vPosition.q > 0.0) {\n      maxZLevel = texture2DProj(outline_uShadowmap, outline_vPosition).r * 255.;\n    } else {\n      discard;\n    }\n    if (maxZLevel < outline_vzLevel + OUTLINE_Z_LEVEL_ERROR) {\n      vec4(color.rgb * 0.5, color.a);\n    } else {\n      discard;\n    }\n  }\n  return color;\n}\n\n// if enabled and rendering outlines - Render depth to shadowmap\n// if enabled and rendering colors - Return a darker color if in shadowmap\n// if disabled, just return color\nvec4 outline_filterColor(vec4 color) {\n  if (outline_uEnabled) {\n    return outline_uRenderOutlines ?\n      outline_filterShadowColor(color) :\n      outline_filterDarkenColor(color);\n  }\n  return color;\n}\n';

exports.default = {
  name: 'outline',
  vs: vs,
  fs: fs,
  getUniforms: getUniforms
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9leHBlcmltZW50YWwtbGF5ZXJzL3NyYy9zaGFkZXJsaWIvb3V0bGluZS9vdXRsaW5lLmpzIl0sIm5hbWVzIjpbIklOSVRJQUxfU1RBVEUiLCJvdXRsaW5lRW5hYmxlZCIsIm91dGxpbmVSZW5kZXJTaGFkb3dtYXAiLCJvdXRsaW5lU2hhZG93bWFwIiwiZ2V0VW5pZm9ybXMiLCJ1bmlmb3JtcyIsInVuZGVmaW5lZCIsIm91dGxpbmVfdUVuYWJsZWQiLCJvdXRsaW5lX3VSZW5kZXJPdXRsaW5lcyIsIm91dGxpbmVfdVNoYWRvd21hcCIsInZzIiwiZnMiLCJuYW1lIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0EsSUFBTUEsZ0JBQWdCO0FBQ3BCQyxrQkFBZ0IsS0FESTtBQUVwQkMsMEJBQXdCLEtBRko7QUFHcEJDLG9CQUFrQjtBQUhFLENBQXRCOztBQU1BLFNBQVNDLFdBQVQsR0FBaUc7QUFBQSxpRkFBZkosYUFBZTtBQUFBLE1BQTNFQyxjQUEyRSxRQUEzRUEsY0FBMkU7QUFBQSxNQUEzREMsc0JBQTJELFFBQTNEQSxzQkFBMkQ7QUFBQSxNQUFuQ0MsZ0JBQW1DLFFBQW5DQSxnQkFBbUM7O0FBQy9GLE1BQU1FLFdBQVcsRUFBakI7QUFDQSxNQUFJSixtQkFBbUJLLFNBQXZCLEVBQWtDO0FBQ2hDRCxhQUFTRSxnQkFBVCxHQUE0Qk4sY0FBNUIsQ0FEZ0MsQ0FDWTtBQUM3QztBQUNELE1BQUlDLDJCQUEyQkksU0FBL0IsRUFBMEM7QUFDeENELGFBQVNHLHVCQUFULEdBQW1DTixzQkFBbkMsQ0FEd0MsQ0FDbUI7QUFDNUQ7QUFDRCxNQUFJQyxxQkFBcUJHLFNBQXpCLEVBQW9DO0FBQ2xDRCxhQUFTSSxrQkFBVCxHQUE4Qk4sZ0JBQTlCO0FBQ0Q7QUFDRCxTQUFPRSxRQUFQO0FBQ0Q7O0FBRUQsSUFBTUssb2dCQUFOOztBQXFCQSxJQUFNQyw4d0NBQU47O2tCQStDZTtBQUNiQyxRQUFNLFNBRE87QUFFYkYsUUFGYTtBQUdiQyxRQUhhO0FBSWJQO0FBSmEsQyIsImZpbGUiOiJvdXRsaW5lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgY2FtZWxjYXNlICovXG5jb25zdCBJTklUSUFMX1NUQVRFID0ge1xuICBvdXRsaW5lRW5hYmxlZDogZmFsc2UsXG4gIG91dGxpbmVSZW5kZXJTaGFkb3dtYXA6IGZhbHNlLFxuICBvdXRsaW5lU2hhZG93bWFwOiBudWxsXG59O1xuXG5mdW5jdGlvbiBnZXRVbmlmb3Jtcyh7b3V0bGluZUVuYWJsZWQsIG91dGxpbmVSZW5kZXJTaGFkb3dtYXAsIG91dGxpbmVTaGFkb3dtYXB9ID0gSU5JVElBTF9TVEFURSkge1xuICBjb25zdCB1bmlmb3JtcyA9IHt9O1xuICBpZiAob3V0bGluZUVuYWJsZWQgIT09IHVuZGVmaW5lZCkge1xuICAgIHVuaWZvcm1zLm91dGxpbmVfdUVuYWJsZWQgPSBvdXRsaW5lRW5hYmxlZDsgLy8gPyAxLjAgOiAwLjA7XG4gIH1cbiAgaWYgKG91dGxpbmVSZW5kZXJTaGFkb3dtYXAgIT09IHVuZGVmaW5lZCkge1xuICAgIHVuaWZvcm1zLm91dGxpbmVfdVJlbmRlck91dGxpbmVzID0gb3V0bGluZVJlbmRlclNoYWRvd21hcDsgLy8gPyAxLjAgOiAwLjA7XG4gIH1cbiAgaWYgKG91dGxpbmVTaGFkb3dtYXAgIT09IHVuZGVmaW5lZCkge1xuICAgIHVuaWZvcm1zLm91dGxpbmVfdVNoYWRvd21hcCA9IG91dGxpbmVTaGFkb3dtYXA7XG4gIH1cbiAgcmV0dXJuIHVuaWZvcm1zO1xufVxuXG5jb25zdCB2cyA9IGBcXFxudmFyeWluZyBmbG9hdCBvdXRsaW5lX3Z6TGV2ZWw7XG52YXJ5aW5nIHZlYzQgb3V0bGluZV92UG9zaXRpb247XG5cbi8vIFNldCB0aGUgeiBsZXZlbCBmb3IgdGhlIG91dGxpbmUgc2hhZG93bWFwIHJlbmRlcmluZ1xudm9pZCBvdXRsaW5lX3NldFpMZXZlbChmbG9hdCB6TGV2ZWwpIHtcbiAgb3V0bGluZV92ekxldmVsID0gekxldmVsO1xufVxuXG4vLyBTdG9yZSBhbiBhZGp1c3RlZCBwb3NpdGlvbiBmb3IgdGV4dHVyZTJEUHJvalxudm9pZCBvdXRsaW5lX3NldFVWKHZlYzQgcG9zaXRpb24pIHtcbiAgLy8gbWF0NChcbiAgLy8gICAwLjUsIDAuMCwgMC4wLCAwLjAsXG4gIC8vICAgMC4wLCAwLjUsIDAuMCwgMC4wLFxuICAvLyAgIDAuMCwgMC4wLCAwLjUsIDAuMCxcbiAgLy8gICAwLjUsIDAuNSwgMC41LCAxLjBcbiAgLy8gKSAqIHBvc2l0aW9uO1xuICBvdXRsaW5lX3ZQb3NpdGlvbiA9IHZlYzQocG9zaXRpb24ueHl6ICogMC41ICsgcG9zaXRpb24udyAqIDAuNSwgcG9zaXRpb24udyk7XG59XG5gO1xuXG5jb25zdCBmcyA9IGBcXFxudW5pZm9ybSBib29sIG91dGxpbmVfdUVuYWJsZWQ7XG51bmlmb3JtIGJvb2wgb3V0bGluZV91UmVuZGVyT3V0bGluZXM7XG51bmlmb3JtIHNhbXBsZXIyRCBvdXRsaW5lX3VTaGFkb3dtYXA7XG5cbnZhcnlpbmcgZmxvYXQgb3V0bGluZV92ekxldmVsO1xuLy8gdmFyeWluZyB2ZWMyIG91dGxpbmVfdlVWO1xudmFyeWluZyB2ZWM0IG91dGxpbmVfdlBvc2l0aW9uO1xuXG5jb25zdCBmbG9hdCBPVVRMSU5FX1pfTEVWRUxfRVJST1IgPSAwLjAxO1xuXG4vLyBSZXR1cm4gYSBkYXJrZXIgY29sb3IgaW4gc2hhZG93bWFwXG52ZWM0IG91dGxpbmVfZmlsdGVyU2hhZG93Q29sb3IodmVjNCBjb2xvcikge1xuICByZXR1cm4gdmVjNChvdXRsaW5lX3Z6TGV2ZWwgLyAyNTUuLCBvdXRsaW5lX3Z6TGV2ZWwgLyAyNTUuLCBvdXRsaW5lX3Z6TGV2ZWwgLyAyNTUuLCAxLik7XG59XG5cbi8vIFJldHVybiBhIGRhcmtlciBjb2xvciBpZiBpbiBzaGFkb3dtYXBcbnZlYzQgb3V0bGluZV9maWx0ZXJEYXJrZW5Db2xvcih2ZWM0IGNvbG9yKSB7XG4gIGlmIChvdXRsaW5lX3VFbmFibGVkKSB7XG4gICAgZmxvYXQgbWF4WkxldmVsO1xuICAgIGlmIChvdXRsaW5lX3ZQb3NpdGlvbi5xID4gMC4wKSB7XG4gICAgICBtYXhaTGV2ZWwgPSB0ZXh0dXJlMkRQcm9qKG91dGxpbmVfdVNoYWRvd21hcCwgb3V0bGluZV92UG9zaXRpb24pLnIgKiAyNTUuO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXNjYXJkO1xuICAgIH1cbiAgICBpZiAobWF4WkxldmVsIDwgb3V0bGluZV92ekxldmVsICsgT1VUTElORV9aX0xFVkVMX0VSUk9SKSB7XG4gICAgICB2ZWM0KGNvbG9yLnJnYiAqIDAuNSwgY29sb3IuYSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRpc2NhcmQ7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb2xvcjtcbn1cblxuLy8gaWYgZW5hYmxlZCBhbmQgcmVuZGVyaW5nIG91dGxpbmVzIC0gUmVuZGVyIGRlcHRoIHRvIHNoYWRvd21hcFxuLy8gaWYgZW5hYmxlZCBhbmQgcmVuZGVyaW5nIGNvbG9ycyAtIFJldHVybiBhIGRhcmtlciBjb2xvciBpZiBpbiBzaGFkb3dtYXBcbi8vIGlmIGRpc2FibGVkLCBqdXN0IHJldHVybiBjb2xvclxudmVjNCBvdXRsaW5lX2ZpbHRlckNvbG9yKHZlYzQgY29sb3IpIHtcbiAgaWYgKG91dGxpbmVfdUVuYWJsZWQpIHtcbiAgICByZXR1cm4gb3V0bGluZV91UmVuZGVyT3V0bGluZXMgP1xuICAgICAgb3V0bGluZV9maWx0ZXJTaGFkb3dDb2xvcihjb2xvcikgOlxuICAgICAgb3V0bGluZV9maWx0ZXJEYXJrZW5Db2xvcihjb2xvcik7XG4gIH1cbiAgcmV0dXJuIGNvbG9yO1xufVxuYDtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBuYW1lOiAnb3V0bGluZScsXG4gIHZzLFxuICBmcyxcbiAgZ2V0VW5pZm9ybXNcbn07XG4iXX0=