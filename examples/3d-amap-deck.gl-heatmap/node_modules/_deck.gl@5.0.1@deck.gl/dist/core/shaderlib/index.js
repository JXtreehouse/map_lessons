'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lighting = exports.project64 = exports.project = exports.picking = exports.fp64 = exports.fp32 = undefined;
exports.initializeShaderModules = initializeShaderModules;

var _luma = require('luma.gl');

var _project = require('../shaderlib/project/project');

var _project2 = _interopRequireDefault(_project);

var _project3 = require('../shaderlib/project64/project64');

var _project4 = _interopRequireDefault(_project3);

var _lighting = require('../shaderlib/lighting/lighting');

var _lighting2 = _interopRequireDefault(_lighting);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initializeShaderModules() {
  (0, _luma.registerShaderModules)([_luma.fp32, _luma.fp64, _project2.default, _project4.default, _lighting2.default, _luma.picking]);

  (0, _luma.setDefaultShaderModules)([_project2.default]);
} // Copyright (c) 2015 - 2017 Uber Technologies, Inc.
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

initializeShaderModules();

exports.fp32 = _luma.fp32;
exports.fp64 = _luma.fp64;
exports.picking = _luma.picking;
exports.project = _project2.default;
exports.project64 = _project4.default;
exports.lighting = _lighting2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb3JlL3NoYWRlcmxpYi9pbmRleC5qcyJdLCJuYW1lcyI6WyJpbml0aWFsaXplU2hhZGVyTW9kdWxlcyIsImZwMzIiLCJmcDY0IiwicGlja2luZyIsInByb2plY3QiLCJwcm9qZWN0NjQiLCJsaWdodGluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O1FBMEJnQkEsdUIsR0FBQUEsdUI7O0FBTmhCOztBQUVBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRU8sU0FBU0EsdUJBQVQsR0FBbUM7QUFDeEMsbUNBQXNCLGlHQUF0Qjs7QUFFQSxxQ0FBd0IsbUJBQXhCO0FBQ0QsQyxDQTlCRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFjQUE7O1FBRVFDLEk7UUFBTUMsSTtRQUFNQyxPO1FBQVNDLE87UUFBU0MsUztRQUFXQyxRIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQ29weXJpZ2h0IChjKSAyMDE1IC0gMjAxNyBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG5cbmltcG9ydCB7cmVnaXN0ZXJTaGFkZXJNb2R1bGVzLCBzZXREZWZhdWx0U2hhZGVyTW9kdWxlc30gZnJvbSAnbHVtYS5nbCc7XG5pbXBvcnQge2ZwMzIsIGZwNjQsIHBpY2tpbmd9IGZyb20gJ2x1bWEuZ2wnO1xuaW1wb3J0IHByb2plY3QgZnJvbSAnLi4vc2hhZGVybGliL3Byb2plY3QvcHJvamVjdCc7XG5pbXBvcnQgcHJvamVjdDY0IGZyb20gJy4uL3NoYWRlcmxpYi9wcm9qZWN0NjQvcHJvamVjdDY0JztcbmltcG9ydCBsaWdodGluZyBmcm9tICcuLi9zaGFkZXJsaWIvbGlnaHRpbmcvbGlnaHRpbmcnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZVNoYWRlck1vZHVsZXMoKSB7XG4gIHJlZ2lzdGVyU2hhZGVyTW9kdWxlcyhbZnAzMiwgZnA2NCwgcHJvamVjdCwgcHJvamVjdDY0LCBsaWdodGluZywgcGlja2luZ10pO1xuXG4gIHNldERlZmF1bHRTaGFkZXJNb2R1bGVzKFtwcm9qZWN0XSk7XG59XG5cbmluaXRpYWxpemVTaGFkZXJNb2R1bGVzKCk7XG5cbmV4cG9ydCB7ZnAzMiwgZnA2NCwgcGlja2luZywgcHJvamVjdCwgcHJvamVjdDY0LCBsaWdodGluZ307XG4iXX0=