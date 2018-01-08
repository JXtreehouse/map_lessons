var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import GL from './api';
import { isWebGL2, ERR_WEBGL2 } from './context';
import { getFeatures } from './context-features';
import { clear as _clear, clearBuffer } from './clear';
import Resource from './resource';
import Texture2D from './texture-2d';
import Renderbuffer from './renderbuffer';
import { getTypedArrayFromGLType, getGLTypeFromTypedArray } from '../utils/typed-array-utils';
import { log as _log, flipRows, scalePixels } from '../utils';
import assert from 'assert';

// Local constants - will collapse during minification
var GL_FRAMEBUFFER = 0x8D40;
var GL_DRAW_FRAMEBUFFER = 0x8CA8;
var GL_READ_FRAMEBUFFER = 0x8CA9;

var GL_COLOR_ATTACHMENT0 = 0x8CE0;
var GL_DEPTH_ATTACHMENT = 0x8D00;
var GL_STENCIL_ATTACHMENT = 0x8D20;
// const GL_DEPTH_STENCIL_ATTACHMENT = 0x821A;

var GL_RENDERBUFFER = 0x8D41;

var GL_TEXTURE_3D = 0x806F;
var GL_TEXTURE_2D_ARRAY = 0x8C1A;
var GL_TEXTURE_2D = 0x0DE1;
var GL_TEXTURE_CUBE_MAP = 0x8513;

var GL_TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;

var GL_DEPTH_BUFFER_BIT = 0x00000100;
var GL_STENCIL_BUFFER_BIT = 0x00000400;
var GL_COLOR_BUFFER_BIT = 0x00004000;

var ERR_MULTIPLE_RENDERTARGETS = 'Multiple render targets not supported';

var Framebuffer = /*#__PURE__*/function (_Resource) {
  _inherits(Framebuffer, _Resource);

  _createClass(Framebuffer, [{
    key: 'MAX_COLOR_ATTACHMENTS',
    get: function get() {
      return this.gl.getParameter(this.gl.MAX_COLOR_ATTACHMENTS);
    }
  }, {
    key: 'MAX_DRAW_BUFFERS',
    get: function get() {
      return this.gl.getParameter(this.gl.MAX_DRAW_BUFFERS);
    }
  }], [{
    key: 'isSupported',
    value: function isSupported(gl) {
      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          colorBufferFloat = _ref.colorBufferFloat,
          colorBufferHalfFloat = _ref.colorBufferHalfFloat;

      var supported = true;
      supported = colorBufferFloat && gl.getExtension(isWebGL2(gl) ? 'EXT_color_buffer_float' : 'WEBGL_color_buffer_float');
      supported = colorBufferHalfFloat && gl.getExtension(isWebGL2(gl) ? 'EXT_color_buffer_float' : 'EXT_color_buffer_half_float');
      return supported;
    }

    // Create a Framebuffer wrapper for the default framebuffer (target === null)

  }, {
    key: 'getDefaultFramebuffer',
    value: function getDefaultFramebuffer(gl) {
      gl.luma = gl.luma || {};
      if (!gl.luma.defaultFramebuffer) {
        gl.luma.defaultFramebuffer = new Framebuffer(gl, { handle: null, attachments: {} });
      }
      // TODO - can we query for and get a handle to the GL.FRONT renderbuffer?
      return gl.luma.defaultFramebuffer;
    }
  }]);

  function Framebuffer(gl) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Framebuffer);

    // Public members
    var _this = _possibleConstructorReturn(this, (Framebuffer.__proto__ || Object.getPrototypeOf(Framebuffer)).call(this, gl, opts));

    _this.width = null;
    _this.height = null;
    _this.attachments = {};
    _this.readBuffer = GL_COLOR_ATTACHMENT0;
    _this.drawBuffers = [GL_COLOR_ATTACHMENT0];
    _this.initialize(opts);

    Object.seal(_this);
    return _this;
  }

  _createClass(Framebuffer, [{
    key: 'initialize',
    value: function initialize(_ref2) {
      var _ref2$width = _ref2.width,
          width = _ref2$width === undefined ? 1 : _ref2$width,
          _ref2$height = _ref2.height,
          height = _ref2$height === undefined ? 1 : _ref2$height,
          _ref2$attachments = _ref2.attachments,
          attachments = _ref2$attachments === undefined ? null : _ref2$attachments,
          _ref2$color = _ref2.color,
          color = _ref2$color === undefined ? true : _ref2$color,
          _ref2$depth = _ref2.depth,
          depth = _ref2$depth === undefined ? true : _ref2$depth,
          _ref2$stencil = _ref2.stencil,
          stencil = _ref2$stencil === undefined ? false : _ref2$stencil,
          _ref2$check = _ref2.check,
          check = _ref2$check === undefined ? true : _ref2$check,
          readBuffer = _ref2.readBuffer,
          drawBuffers = _ref2.drawBuffers;

      assert(width >= 0 && height >= 0, 'Width and height need to be integers');

      // Store actual width and height for diffing
      this.width = width;
      this.height = height;

      // Resize any provided attachments - note that resize only resizes if needed
      // Note: A framebuffer has no separate size, it is defined by its attachments (which must agree)
      if (attachments) {
        for (var attachment in attachments) {
          var target = attachments[attachment];
          var object = Array.isArray(target) ? target[0] : target;
          object.resize({ width: width, height: height });
        }
      } else {
        // Create any requested default attachments
        attachments = this._createDefaultAttachments({ color: color, depth: depth, stencil: stencil, width: width, height: height });
      }

      this.update({ clearAttachments: true, attachments: attachments, readBuffer: readBuffer, drawBuffers: drawBuffers });

      // Checks that framebuffer was properly set up, if not, throws an explanatory error
      if (attachments && check) {
        this.checkStatus();
      }
    }
  }, {
    key: 'update',
    value: function update(_ref3) {
      var _ref3$attachments = _ref3.attachments,
          attachments = _ref3$attachments === undefined ? {} : _ref3$attachments,
          readBuffer = _ref3.readBuffer,
          drawBuffers = _ref3.drawBuffers,
          _ref3$clearAttachment = _ref3.clearAttachments,
          clearAttachments = _ref3$clearAttachment === undefined ? false : _ref3$clearAttachment;

      this.attach(attachments, { clearAttachments: clearAttachments });

      var gl = this.gl;
      // Multiple render target support, set read buffer and draw buffers

      var prevHandle = gl.bindFramebuffer(GL_FRAMEBUFFER, this.handle);
      if (readBuffer) {
        this._setReadBuffer(readBuffer);
      }
      if (drawBuffers) {
        this._setDrawBuffers(drawBuffers);
      }
      gl.bindFramebuffer(GL_FRAMEBUFFER, prevHandle);

      return this;
    }

    // Attachment resize is expected to be a noop if size is same

  }, {
    key: 'resize',
    value: function resize() {
      var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          width = _ref4.width,
          height = _ref4.height;

      // for default framebuffer, just update the stored size
      if (this.handle === null) {
        assert(width === undefined && height === undefined);
        this.width = this.gl.drawingBufferWidth;
        this.height = this.gl.drawingBufferHeight;
        return this;
      }

      if (width === undefined) {
        width = this.gl.drawingBufferWidth;
      }
      if (height === undefined) {
        height = this.gl.drawingBufferHeight;
      }

      if (width !== this.width && height !== this.height) {
        _log.log(2, 'Resizing framebuffer ' + this.id + ' to ' + width + 'x' + height);
      }
      for (var attachmentPoint in this.attachments) {
        this.attachments[attachmentPoint].resize({ width: width, height: height });
      }
      this.width = width;
      this.height = height;
      return this;
    }

    // Attach from a map of attachments

  }, {
    key: 'attach',
    value: function attach(attachments) {
      var _this2 = this;

      var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref5$clearAttachment = _ref5.clearAttachments,
          clearAttachments = _ref5$clearAttachment === undefined ? false : _ref5$clearAttachment;

      var newAttachments = {};

      // Any current attachments need to be removed, add null values to map
      if (clearAttachments) {
        Object.keys(this.attachments).forEach(function (key) {
          newAttachments[key] = null;
        });
      }

      // Overlay the new attachments
      Object.assign(newAttachments, attachments);

      var prevHandle = this.gl.bindFramebuffer(GL_FRAMEBUFFER, this.handle);

      // Walk the attachments
      for (var attachment in newAttachments) {
        // Ensure key is not undefined
        assert(attachment !== 'undefined', 'Misspelled framebuffer binding point?');

        var descriptor = newAttachments[attachment];
        var object = descriptor;
        if (!object) {
          this._unattach({ attachment: attachment });
        } else if (object instanceof Renderbuffer) {
          this._attachRenderbuffer({ attachment: attachment, renderbuffer: object });
        } else if (Array.isArray(descriptor)) {
          var _descriptor = _slicedToArray(descriptor, 3),
              texture = _descriptor[0],
              _descriptor$ = _descriptor[1],
              layer = _descriptor$ === undefined ? 0 : _descriptor$,
              _descriptor$2 = _descriptor[2],
              level = _descriptor$2 === undefined ? 0 : _descriptor$2;

          object = texture;
          this._attachTexture({ attachment: attachment, texture: texture, layer: layer, level: level });
        } else {
          this._attachTexture({ attachment: attachment, texture: object, layer: 0, level: 0 });
        }

        // Resize objects
        if (object) {
          object.resize({ width: this.width, height: this.height });
        }
      }

      this.gl.bindFramebuffer(GL_FRAMEBUFFER, prevHandle);

      // Assign to attachments and remove any nulls to get a clean attachment map
      Object.assign(this.attachments, attachments);
      Object.keys(this.attachments).filter(function (key) {
        return !_this2.attachments[key];
      }).forEach(function (key) {
        delete _this2.attachments[key];
      });
    }
  }, {
    key: 'checkStatus',
    value: function checkStatus() {
      var gl = this.gl;

      var prevHandle = gl.bindFramebuffer(GL_FRAMEBUFFER, this.handle);
      var status = gl.checkFramebufferStatus(GL_FRAMEBUFFER);
      gl.bindFramebuffer(GL_FRAMEBUFFER, prevHandle);
      if (status !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error(_getFrameBufferStatus(status));
      }
      return this;
    }
  }, {
    key: 'clear',
    value: function clear() {
      var _ref6 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          color = _ref6.color,
          depth = _ref6.depth,
          stencil = _ref6.stencil,
          _ref6$drawBuffers = _ref6.drawBuffers,
          drawBuffers = _ref6$drawBuffers === undefined ? [] : _ref6$drawBuffers;

      // Bind framebuffer and delegate to global clear functions
      var prevHandle = this.gl.bindFramebuffer(GL_FRAMEBUFFER, this.handle);

      if (color || depth || stencil) {
        _clear(this.gl, { color: color, depth: depth, stencil: stencil });
      }

      drawBuffers.forEach(function (value, drawBuffer) {
        clearBuffer({ drawBuffer: drawBuffer, value: value });
      });

      this.gl.bindFramebuffer(GL_FRAMEBUFFER, prevHandle);

      return this;
    }

    // NOTE: Slow requires roundtrip to GPU
    // App can provide pixelArray or have it auto allocated by this method
    // @returns {Uint8Array|Uint16Array|FloatArray} - pixel array,
    //  newly allocated by this method unless provided by app.

  }, {
    key: 'readPixels',
    value: function readPixels(_ref7) {
      var _ref7$x = _ref7.x,
          x = _ref7$x === undefined ? 0 : _ref7$x,
          _ref7$y = _ref7.y,
          y = _ref7$y === undefined ? 0 : _ref7$y,
          _ref7$width = _ref7.width,
          width = _ref7$width === undefined ? this.width : _ref7$width,
          _ref7$height = _ref7.height,
          height = _ref7$height === undefined ? this.height : _ref7$height,
          _ref7$format = _ref7.format,
          format = _ref7$format === undefined ? GL.RGBA : _ref7$format,
          type = _ref7.type,
          _ref7$pixelArray = _ref7.pixelArray,
          pixelArray = _ref7$pixelArray === undefined ? null : _ref7$pixelArray,
          _ref7$attachment = _ref7.attachment,
          attachment = _ref7$attachment === undefined ? GL_COLOR_ATTACHMENT0 : _ref7$attachment;
      var gl = this.gl;

      // TODO - Set and unset gl.readBuffer

      if (attachment === GL.COLOR_ATTACHMENT0 && this.handle === null) {
        attachment = GL.FRONT;
      }

      // Deduce type and allocated pixelArray if needed
      if (!pixelArray) {
        // Allocate pixel array if not already available, using supplied type
        type = type || gl.UNSIGNED_BYTE;
        var ArrayType = getTypedArrayFromGLType(type, { clamped: false });
        var components = glFormatToComponents(format);
        // TODO - check for composite type (components = 1).
        pixelArray = pixelArray || new ArrayType(width * height * components);
      }

      // Pixel array available, if necessary, deduce type from it.
      type = type || getGLTypeFromTypedArray(pixelArray);

      var prevHandle = this.gl.bindFramebuffer(GL_FRAMEBUFFER, this.handle);
      this.gl.readPixels(x, y, width, height, format, type, pixelArray);
      this.gl.bindFramebuffer(GL_FRAMEBUFFER, prevHandle);

      return pixelArray;
    }

    // Reads pixels as a dataUrl

  }, {
    key: 'copyToDataUrl',
    value: function copyToDataUrl() {
      var _ref8 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref8$attachment = _ref8.attachment,
          attachment = _ref8$attachment === undefined ? GL_COLOR_ATTACHMENT0 : _ref8$attachment,
          _ref8$maxHeight = _ref8.maxHeight,
          maxHeight = _ref8$maxHeight === undefined ? Number.MAX_SAFE_INTEGER : _ref8$maxHeight;

      var data = this.readPixels({ attachment: attachment });

      // Scale down
      var width = this.width,
          height = this.height;

      while (height > maxHeight) {
        var _scalePixels = scalePixels({ data: data, width: width, height: height });

        data = _scalePixels.data;
        width = _scalePixels.width;
        height = _scalePixels.height;
      }

      // Flip to top down coordinate system
      flipRows({ data: data, width: width, height: height });

      /* global document */
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext('2d');

      // Copy the pixels to a 2D canvas
      var imageData = context.createImageData(width, height);
      imageData.data.set(data);
      context.putImageData(imageData, 0, 0);

      return canvas.toDataURL();
    }

    // Reads pixels into an HTML Image

  }, {
    key: 'copyToImage',
    value: function copyToImage() {
      var _ref9 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref9$image = _ref9.image,
          image = _ref9$image === undefined ? null : _ref9$image,
          _ref9$attachment = _ref9.attachment,
          attachment = _ref9$attachment === undefined ? GL_COLOR_ATTACHMENT0 : _ref9$attachment,
          _ref9$maxHeight = _ref9.maxHeight,
          maxHeight = _ref9$maxHeight === undefined ? Number.MAX_SAFE_INTEGER : _ref9$maxHeight;

      /* global Image */
      var dataUrl = this.readDataUrl({ attachment: attachment });
      image = image || new Image();
      image.src = dataUrl;
      return image;
    }

    // copyToFramebuffer({width, height}) {
    //   const scaleX = width / this.width;
    //   const scaleY = height / this.height;
    //   const scale = Math.min(scaleX, scaleY);
    //   width = width * scale;
    //   height = height * scale;
    //   const scaledFramebuffer = new Framebuffer(this.gl, {width, height});
    //   this.blit();
    // }

    // Copy a rectangle from a framebuffer attachment into a texture (at an offset)

  }, {
    key: 'copyToTexture',
    value: function copyToTexture(_ref10) {
      var texture = _ref10.texture,
          target = _ref10.target,
          _ref10$xoffset = _ref10.xoffset,
          xoffset = _ref10$xoffset === undefined ? 0 : _ref10$xoffset,
          _ref10$yoffset = _ref10.yoffset,
          yoffset = _ref10$yoffset === undefined ? 0 : _ref10$yoffset,
          _ref10$zoffset = _ref10.zoffset,
          zoffset = _ref10$zoffset === undefined ? 0 : _ref10$zoffset,
          _ref10$mipmapLevel = _ref10.mipmapLevel,
          mipmapLevel = _ref10$mipmapLevel === undefined ? 0 : _ref10$mipmapLevel,
          _ref10$attachment = _ref10.attachment,
          attachment = _ref10$attachment === undefined ? GL_COLOR_ATTACHMENT0 : _ref10$attachment,
          _ref10$x = _ref10.x,
          x = _ref10$x === undefined ? 0 : _ref10$x,
          _ref10$y = _ref10.y,
          y = _ref10$y === undefined ? 0 : _ref10$y,
          width = _ref10.width,
          height = _ref10.height;
      var gl = this.gl;

      var prevHandle = gl.bindFramebuffer(GL_FRAMEBUFFER, this.handle);
      var prevBuffer = gl.readBuffer(attachment);

      width = Number.isFinite(width) ? width : texture.width;
      height = Number.isFinite(height) ? height : texture.height;

      // target
      switch (texture.target) {
        case GL_TEXTURE_2D:
        case GL_TEXTURE_CUBE_MAP:
          gl.copyTexSubImage2D(target || texture.target, mipmapLevel, xoffset, yoffset, x, y, width, height);
          break;
        case GL_TEXTURE_2D_ARRAY:
        case GL_TEXTURE_3D:
          gl.copyTexSubImage3D(target || texture.target, mipmapLevel, xoffset, yoffset, zoffset, x, y, width, height);
          break;
        default:
      }

      gl.readBuffer(prevBuffer);
      gl.bindFramebuffer(GL_FRAMEBUFFER, prevHandle);
      return texture;
    }

    // WEBGL2 INTERFACE

    // Copies a rectangle of pixels between framebuffers

  }, {
    key: 'blit',
    value: function blit(_ref11) {
      var srcFramebuffer = _ref11.srcFramebuffer,
          _ref11$attachment = _ref11.attachment,
          attachment = _ref11$attachment === undefined ? GL_COLOR_ATTACHMENT0 : _ref11$attachment,
          _ref11$srcX = _ref11.srcX0,
          srcX0 = _ref11$srcX === undefined ? 0 : _ref11$srcX,
          _ref11$srcY = _ref11.srcY0,
          srcY0 = _ref11$srcY === undefined ? 0 : _ref11$srcY,
          srcX1 = _ref11.srcX1,
          srcY1 = _ref11.srcY1,
          _ref11$dstX = _ref11.dstX0,
          dstX0 = _ref11$dstX === undefined ? 0 : _ref11$dstX,
          _ref11$dstY = _ref11.dstY0,
          dstY0 = _ref11$dstY === undefined ? 0 : _ref11$dstY,
          dstX1 = _ref11.dstX1,
          dstY1 = _ref11.dstY1,
          _ref11$color = _ref11.color,
          color = _ref11$color === undefined ? true : _ref11$color,
          _ref11$depth = _ref11.depth,
          depth = _ref11$depth === undefined ? false : _ref11$depth,
          _ref11$stencil = _ref11.stencil,
          stencil = _ref11$stencil === undefined ? false : _ref11$stencil,
          _ref11$mask = _ref11.mask,
          mask = _ref11$mask === undefined ? 0 : _ref11$mask,
          _ref11$filter = _ref11.filter,
          filter = _ref11$filter === undefined ? GL.NEAREST : _ref11$filter;
      var gl = this.gl;

      assert(isWebGL2(gl), ERR_WEBGL2);

      if (!srcFramebuffer.handle && attachment === GL_COLOR_ATTACHMENT0) {
        attachment = GL.FRONT;
      }

      if (color) {
        mask |= GL_COLOR_BUFFER_BIT;
      }
      if (depth) {
        mask |= GL_DEPTH_BUFFER_BIT;
      }
      if (stencil) {
        mask |= GL_STENCIL_BUFFER_BIT;
      }
      assert(mask);

      srcX1 = srcX1 === undefined ? srcFramebuffer.width : srcX1;
      srcY1 = srcY1 === undefined ? srcFramebuffer.height : srcY1;
      dstX1 = dstX1 === undefined ? this.width : dstX1;
      dstY1 = dstY1 === undefined ? this.height : dstY1;

      var prevDrawHandle = gl.bindFramebuffer(GL_DRAW_FRAMEBUFFER, this.handle);
      var prevReadHandle = gl.bindFramebuffer(GL_READ_FRAMEBUFFER, srcFramebuffer.handle);
      var prevReadBuffer = gl.readBuffer(attachment);
      gl.blitFramebuffer(srcX0, srcY0, srcX1, srcY1, dstX0, dstY0, dstX1, dstY1, mask, filter);
      gl.readBuffer(prevReadBuffer);
      gl.bindFramebuffer(GL_READ_FRAMEBUFFER, prevReadHandle);
      gl.bindFramebuffer(GL_DRAW_FRAMEBUFFER, prevDrawHandle);

      return this;
    }

    // signals to the GL that it need not preserve all pixels of a specified region
    // of the framebuffer

  }, {
    key: 'invalidate',
    value: function invalidate(_ref12) {
      var _ref12$attachments = _ref12.attachments,
          attachments = _ref12$attachments === undefined ? [] : _ref12$attachments,
          _ref12$x = _ref12.x,
          x = _ref12$x === undefined ? 0 : _ref12$x,
          _ref12$y = _ref12.y,
          y = _ref12$y === undefined ? 0 : _ref12$y,
          width = _ref12.width,
          height = _ref12.height;
      var gl = this.gl;

      assert(isWebGL2(gl, ERR_WEBGL2));
      var prevHandle = gl.bindFramebuffer(GL_READ_FRAMEBUFFER, this.handle);
      var invalidateAll = x === 0 && y === 0 && width === undefined && height === undefined;
      if (invalidateAll) {
        gl.invalidateFramebuffer(GL_READ_FRAMEBUFFER, attachments);
      } else {
        gl.invalidateFramebuffer(GL_READ_FRAMEBUFFER, attachments, x, y, width, height);
      }
      gl.bindFramebuffer(GL_READ_FRAMEBUFFER, prevHandle);
      return this;
    }

    // Return the value for `pname` of the specified attachment.
    // The type returned is the type of the requested pname

  }, {
    key: 'getAttachmentParameter',
    value: function getAttachmentParameter() {
      var _ref13 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref13$attachment = _ref13.attachment,
          attachment = _ref13$attachment === undefined ? GL_COLOR_ATTACHMENT0 : _ref13$attachment,
          pname = _ref13.pname;

      var value = this._getAttachmentParameterFallback(pname);
      if (value === null) {
        this.gl.bindTexture(GL_FRAMEBUFFER, this.handle);
        value = this.gl.getFramebufferAttachmentParameter(GL_FRAMEBUFFER, attachment, pname);
        this.gl.bindTexture(GL_FRAMEBUFFER, null);
      }
      return value;
    }
  }, {
    key: 'getAttachmentParameters',
    value: function getAttachmentParameters() {
      var attachment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : GL_COLOR_ATTACHMENT0;
      var parameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.constructor.ATTACHMENT_PARAMETERS || {};

      var values = {};
      for (var pname in parameters) {
        values[pname] = this.getAttachmentParameter(pname);
      }
      return this;
    }

    // DEBUG

    // Note: Will only work when called in an event handler

  }, {
    key: 'show',
    value: function show() {
      /* global window */
      if (typeof window !== 'undefined') {
        window.open(this.copyToDataUrl(), 'luma-debug-texture');
      }
      return this;
    }
  }, {
    key: 'log',
    value: function log() {
      var _ref14 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref14$priority = _ref14.priority,
          priority = _ref14$priority === undefined ? 0 : _ref14$priority,
          _ref14$message = _ref14.message,
          message = _ref14$message === undefined ? '' : _ref14$message;

      if (priority > _log.priority || typeof window === 'undefined') {
        return this;
      }
      message = message || 'Framebuffer ' + this.id;
      var image = this.copyToDataUrl({ maxHeight: 100 });
      _log.image({ priority: priority, message: message, image: image }, message);
      return this;
    }

    // WEBGL INTERFACE

  }, {
    key: 'bind',
    value: function bind() {
      var _ref15 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref15$target = _ref15.target,
          target = _ref15$target === undefined ? GL_FRAMEBUFFER : _ref15$target;

      this.gl.bindFramebuffer(target, this.handle);
      return this;
    }
  }, {
    key: 'unbind',
    value: function unbind() {
      var _ref16 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref16$target = _ref16.target,
          target = _ref16$target === undefined ? GL_FRAMEBUFFER : _ref16$target;

      this.gl.bindFramebuffer(target, null);
      return this;
    }

    // PRIVATE METHODS

  }, {
    key: '_createDefaultAttachments',
    value: function _createDefaultAttachments(_ref17) {
      var color = _ref17.color,
          depth = _ref17.depth,
          stencil = _ref17.stencil,
          width = _ref17.width,
          height = _ref17.height;

      var defaultAttachments = null;

      // Add a color buffer if requested and not supplied
      if (color) {
        var _parameters;

        defaultAttachments = defaultAttachments || {};
        defaultAttachments[GL_COLOR_ATTACHMENT0] = new Texture2D(this.gl, {
          pixels: null, // reserves texture memory, but texels are undefined
          format: GL.RGBA,
          type: GL.UNSIGNED_BYTE,
          width: width,
          height: height,
          // Note: Mipmapping can be disabled by texture resource when we resize the texture
          // to a non-power-of-two dimenstion (NPOT texture) under WebGL1. To have consistant
          // behavior we always disable mipmaps.
          mipmaps: false,
          // Set MIN and MAG filtering parameters so mipmaps are not used in sampling.
          // Set WRAP modes that support NPOT textures too.
          parameters: (_parameters = {}, _defineProperty(_parameters, GL.TEXTURE_MIN_FILTER, GL.NEAREST), _defineProperty(_parameters, GL.TEXTURE_MAG_FILTER, GL.NEAREST), _defineProperty(_parameters, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE), _defineProperty(_parameters, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE), _parameters)
        });
      }

      // Add a depth buffer if requested and not supplied
      if (depth) {
        defaultAttachments = defaultAttachments || {};
        defaultAttachments[GL_DEPTH_ATTACHMENT] = new Renderbuffer(this.gl, { format: GL.DEPTH_COMPONENT16, width: width, height: height });
      }

      // TODO - handle stencil and combined depth and stencil

      return defaultAttachments;
    }
  }, {
    key: '_unattach',
    value: function _unattach(_ref18) {
      var attachment = _ref18.attachment;

      this.gl.bindRenderbuffer(GL_RENDERBUFFER, this.handle);
      this.gl.framebufferRenderbuffer(GL_FRAMEBUFFER, attachment, GL_RENDERBUFFER, null);
      delete this.attachments[attachment];
    }
  }, {
    key: '_attachRenderbuffer',
    value: function _attachRenderbuffer(_ref19) {
      var _ref19$attachment = _ref19.attachment,
          attachment = _ref19$attachment === undefined ? GL_COLOR_ATTACHMENT0 : _ref19$attachment,
          renderbuffer = _ref19.renderbuffer;
      var gl = this.gl;
      // TODO - is the bind needed?
      // gl.bindRenderbuffer(GL_RENDERBUFFER, renderbuffer.handle);

      gl.framebufferRenderbuffer(GL_FRAMEBUFFER, attachment, GL_RENDERBUFFER, renderbuffer.handle);
      // TODO - is the unbind needed?
      // gl.bindRenderbuffer(GL_RENDERBUFFER, null);

      this.attachments[attachment] = renderbuffer;
    }

    // layer = 0 - index into Texture2DArray and Texture3D or face for `TextureCubeMap`
    // level = 0 - mipmapLevel (must be 0 in WebGL1)

  }, {
    key: '_attachTexture',
    value: function _attachTexture(_ref20) {
      var _ref20$attachment = _ref20.attachment,
          attachment = _ref20$attachment === undefined ? GL_COLOR_ATTACHMENT0 : _ref20$attachment,
          texture = _ref20.texture,
          layer = _ref20.layer,
          level = _ref20.level;
      var gl = this.gl;

      gl.bindTexture(texture.target, texture.handle);

      switch (texture.target) {
        case GL_TEXTURE_2D_ARRAY:
        case GL_TEXTURE_3D:
          gl.framebufferTextureLayer(GL_FRAMEBUFFER, attachment, texture.target, level, layer);
          break;

        case GL_TEXTURE_CUBE_MAP:
          // layer must be a cubemap face (or if index, converted to cube map face)
          var face = mapIndexToCubeMapFace(layer);
          gl.framebufferTexture2D(GL_FRAMEBUFFER, attachment, face, texture.handle, level);
          break;

        case GL_TEXTURE_2D:
          gl.framebufferTexture2D(GL_FRAMEBUFFER, attachment, GL_TEXTURE_2D, texture.handle, level);
          break;

        default:
          assert(false, 'Illegal texture type');
      }

      gl.bindTexture(texture.target, null);
      this.attachments[attachment] = texture;
    }

    // Expects framebuffer to be bound

  }, {
    key: '_setReadBuffer',
    value: function _setReadBuffer(gl, readBuffer) {
      if (isWebGL2(gl)) {
        gl.readBuffer(readBuffer);
      } else {
        // Setting to color attachment 0 is a noop, so allow it in WebGL1
        assert(readBuffer === GL_COLOR_ATTACHMENT0 || readBuffer === GL.BACK, ERR_MULTIPLE_RENDERTARGETS);
      }
      this.readBuffer = readBuffer;
    }

    // Expects framebuffer to be bound

  }, {
    key: '_setDrawBuffers',
    value: function _setDrawBuffers(gl, drawBuffers) {
      if (isWebGL2(gl)) {
        gl.drawBuffers(drawBuffers);
      } else {
        var ext = gl.getExtension('WEBGL_draw_buffers');
        if (ext) {
          ext.drawBuffersWEBGL(drawBuffers);
        } else {
          // Setting a single draw buffer to color attachment 0 is a noop, allow in WebGL1
          assert(drawBuffers.length === 1 && (drawBuffers[0] === GL_COLOR_ATTACHMENT0 || drawBuffers[0] === GL.BACK), ERR_MULTIPLE_RENDERTARGETS);
        }
      }
      this.drawBuffers = drawBuffers;
    }

    // Attempt to provide workable defaults for WebGL2 symbols under WebGL1
    // null means OK to query
    /* eslint-disable complexity */

  }, {
    key: '_getAttachmentParameterFallback',
    value: function _getAttachmentParameterFallback(pname) {
      var caps = getFeatures(this.gl);

      switch (pname) {
        case GL.FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER:
          // GLint
          return !caps.webgl2 ? 0 : null;
        case GL.FRAMEBUFFER_ATTACHMENT_RED_SIZE: // GLint
        case GL.FRAMEBUFFER_ATTACHMENT_GREEN_SIZE: // GLint
        case GL.FRAMEBUFFER_ATTACHMENT_BLUE_SIZE: // GLint
        case GL.FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE: // GLint
        case GL.FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE: // GLint
        case GL.FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE:
          // GLint
          return !caps.webgl2 ? 8 : null;
        case GL.FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE:
          // GLenum
          return !caps.webgl2 ? GL.UNSIGNED_INT : null;
        case GL.FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING:
          return !caps.webgl2 && !caps.EXT_sRGB ? GL.LINEAR : null;
        default:
          return null;
      }
    }
    /* eslint-enable complexity */

    // RESOURCE METHODS

  }, {
    key: '_createHandle',
    value: function _createHandle() {
      return this.gl.createFramebuffer();
    }
  }, {
    key: '_deleteHandle',
    value: function _deleteHandle() {
      this.gl.deleteFramebuffer(this.handle);
    }
  }, {
    key: 'color',
    get: function get() {
      return this.attachments[GL_COLOR_ATTACHMENT0] || null;
    }
  }, {
    key: 'texture',
    get: function get() {
      return this.attachments[GL_COLOR_ATTACHMENT0] || null;
    }
  }, {
    key: 'depth',
    get: function get() {
      return this.attachments[GL_DEPTH_ATTACHMENT] || null;
    }
  }, {
    key: 'stencil',
    get: function get() {
      return this.attachments[GL_STENCIL_ATTACHMENT] || null;
    }
  }]);

  return Framebuffer;
}(Resource);

// PUBLIC METHODS

// Map an index to a cube map face constant


export default Framebuffer;
function mapIndexToCubeMapFace(layer) {
  // TEXTURE_CUBE_MAP_POSITIVE_X is a big value (0x8515)
  // if smaller assume layer is index, otherwise assume it is already a cube map face constant
  return layer < GL_TEXTURE_CUBE_MAP_POSITIVE_X ? layer + GL_TEXTURE_CUBE_MAP_POSITIVE_X : layer;
}

// Returns number of components in a specific WebGL format
function glFormatToComponents(format) {
  switch (format) {
    case GL.ALPHA:
      return 1;
    case GL.RGB:
      return 3;
    case GL.RGBA:
      return 4;
    default:
      throw new Error('Unknown format');
  }
}

// Get a string describing the framebuffer error if installed
function _getFrameBufferStatus(status) {
  // Use error mapping if installed
  var STATUS = Framebuffer.STATUS || {};
  return STATUS[status] || 'Framebuffer error ' + status;
}
//# sourceMappingURL=framebuffer.js.map