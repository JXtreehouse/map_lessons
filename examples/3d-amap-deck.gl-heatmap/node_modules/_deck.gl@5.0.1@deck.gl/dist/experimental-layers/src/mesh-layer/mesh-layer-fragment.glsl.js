"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "\n#define SHADER_NAME mesh-layer-fs\n\n#ifdef GL_ES\nprecision highp float;\n#endif\n\nuniform bool hasTexture;\nuniform sampler2D sampler;\nuniform vec4 color;\n\nvarying vec2 vTexCoord;\nvarying vec4 vColor;\nvarying float vLightWeight;\n\nvoid main(void) {\n  // TODO - restore color rendering\n\n  gl_FragColor = vColor / 255.;\n\n  // hasTexture ? texture2D(sampler, vTexCoord) : color / 255.;\n  // color = vec4(color_transform(color.rgb), color.a * opacity);\n\n  // gl_FragColor = gl_FragColor * vLightWeight;\n\n  // use highlight color if this fragment belongs to the selected object.\n  // gl_FragColor = picking_filterHighlightColor(gl_FragColor);\n\n  // use picking color if rendering to picking FBO.\n  // gl_FragColor = picking_filterPickingColor(gl_FragColor);\n}\n";
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJtZXNoLWxheWVyLWZyYWdtZW50Lmdsc2wuanMiLCJzb3VyY2VzQ29udGVudCI6W119