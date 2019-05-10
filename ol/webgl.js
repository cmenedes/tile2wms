'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getContext = getContext;
/**
 * @module ol/webgl
 */

/**
 * Constants taken from goog.webgl
 */

/**
 * @const
 * @type {number}
 */
var ONE = exports.ONE = 1;

/**
 * @const
 * @type {number}
 */
var SRC_ALPHA = exports.SRC_ALPHA = 0x0302;

/**
 * @const
 * @type {number}
 */
var COLOR_ATTACHMENT0 = exports.COLOR_ATTACHMENT0 = 0x8CE0;

/**
 * @const
 * @type {number}
 */
var COLOR_BUFFER_BIT = exports.COLOR_BUFFER_BIT = 0x00004000;

/**
 * @const
 * @type {number}
 */
var TRIANGLES = exports.TRIANGLES = 0x0004;

/**
 * @const
 * @type {number}
 */
var TRIANGLE_STRIP = exports.TRIANGLE_STRIP = 0x0005;

/**
 * @const
 * @type {number}
 */
var ONE_MINUS_SRC_ALPHA = exports.ONE_MINUS_SRC_ALPHA = 0x0303;

/**
 * @const
 * @type {number}
 */
var ARRAY_BUFFER = exports.ARRAY_BUFFER = 0x8892;

/**
 * @const
 * @type {number}
 */
var ELEMENT_ARRAY_BUFFER = exports.ELEMENT_ARRAY_BUFFER = 0x8893;

/**
 * @const
 * @type {number}
 */
var STREAM_DRAW = exports.STREAM_DRAW = 0x88E0;

/**
 * @const
 * @type {number}
 */
var STATIC_DRAW = exports.STATIC_DRAW = 0x88E4;

/**
 * @const
 * @type {number}
 */
var DYNAMIC_DRAW = exports.DYNAMIC_DRAW = 0x88E8;

/**
 * @const
 * @type {number}
 */
var CULL_FACE = exports.CULL_FACE = 0x0B44;

/**
 * @const
 * @type {number}
 */
var BLEND = exports.BLEND = 0x0BE2;

/**
 * @const
 * @type {number}
 */
var STENCIL_TEST = exports.STENCIL_TEST = 0x0B90;

/**
 * @const
 * @type {number}
 */
var DEPTH_TEST = exports.DEPTH_TEST = 0x0B71;

/**
 * @const
 * @type {number}
 */
var SCISSOR_TEST = exports.SCISSOR_TEST = 0x0C11;

/**
 * @const
 * @type {number}
 */
var UNSIGNED_BYTE = exports.UNSIGNED_BYTE = 0x1401;

/**
 * @const
 * @type {number}
 */
var UNSIGNED_SHORT = exports.UNSIGNED_SHORT = 0x1403;

/**
 * @const
 * @type {number}
 */
var UNSIGNED_INT = exports.UNSIGNED_INT = 0x1405;

/**
 * @const
 * @type {number}
 */
var FLOAT = exports.FLOAT = 0x1406;

/**
 * @const
 * @type {number}
 */
var RGBA = exports.RGBA = 0x1908;

/**
 * @const
 * @type {number}
 */
var FRAGMENT_SHADER = exports.FRAGMENT_SHADER = 0x8B30;

/**
 * @const
 * @type {number}
 */
var VERTEX_SHADER = exports.VERTEX_SHADER = 0x8B31;

/**
 * @const
 * @type {number}
 */
var LINK_STATUS = exports.LINK_STATUS = 0x8B82;

/**
 * @const
 * @type {number}
 */
var LINEAR = exports.LINEAR = 0x2601;

/**
 * @const
 * @type {number}
 */
var TEXTURE_MAG_FILTER = exports.TEXTURE_MAG_FILTER = 0x2800;

/**
 * @const
 * @type {number}
 */
var TEXTURE_MIN_FILTER = exports.TEXTURE_MIN_FILTER = 0x2801;

/**
 * @const
 * @type {number}
 */
var TEXTURE_WRAP_S = exports.TEXTURE_WRAP_S = 0x2802;

/**
 * @const
 * @type {number}
 */
var TEXTURE_WRAP_T = exports.TEXTURE_WRAP_T = 0x2803;

/**
 * @const
 * @type {number}
 */
var TEXTURE_2D = exports.TEXTURE_2D = 0x0DE1;

/**
 * @const
 * @type {number}
 */
var TEXTURE0 = exports.TEXTURE0 = 0x84C0;

/**
 * @const
 * @type {number}
 */
var CLAMP_TO_EDGE = exports.CLAMP_TO_EDGE = 0x812F;

/**
 * @const
 * @type {number}
 */
var COMPILE_STATUS = exports.COMPILE_STATUS = 0x8B81;

/**
 * @const
 * @type {number}
 */
var FRAMEBUFFER = exports.FRAMEBUFFER = 0x8D40;

/** end of goog.webgl constants
 */

/**
 * @const
 * @type {Array<string>}
 */
var CONTEXT_IDS = ['experimental-webgl', 'webgl', 'webkit-3d', 'moz-webgl'];

/**
 * @param {HTMLCanvasElement} canvas Canvas.
 * @param {Object=} opt_attributes Attributes.
 * @return {WebGLRenderingContext} WebGL rendering context.
 */
function getContext(canvas, opt_attributes) {
  var ii = CONTEXT_IDS.length;
  for (var i = 0; i < ii; ++i) {
    try {
      var context = canvas.getContext(CONTEXT_IDS[i], opt_attributes);
      if (context) {
        return (/** @type {!WebGLRenderingContext} */context
        );
      }
    } catch (e) {
      // pass
    }
  }
  return null;
}

/**
 * Include debuggable shader sources.  Default is `true`. This should be set to
 * `false` for production builds.
 * @type {boolean}
 */
var DEBUG = exports.DEBUG = true;

/**
 * The maximum supported WebGL texture size in pixels. If WebGL is not
 * supported, the value is set to `undefined`.
 * @type {number|undefined}
 */
var MAX_TEXTURE_SIZE; // value is set below


/**
 * List of supported WebGL extensions.
 * @type {Array<string>}
 */
var EXTENSIONS; // value is set below


/**
 * True if both OpenLayers and browser support WebGL.
 * @type {boolean}
 * @api
 */
var HAS = false;

//TODO Remove side effects
if (typeof window !== 'undefined' && 'WebGLRenderingContext' in window) {
  try {
    var canvas = /** @type {HTMLCanvasElement} */document.createElement('canvas');
    var gl = getContext(canvas, { failIfMajorPerformanceCaveat: true });
    if (gl) {
      exports.HAS = HAS = true;
      exports.MAX_TEXTURE_SIZE = MAX_TEXTURE_SIZE = /** @type {number} */gl.getParameter(gl.MAX_TEXTURE_SIZE);
      exports.EXTENSIONS = EXTENSIONS = gl.getSupportedExtensions();
    }
  } catch (e) {
    // pass
  }
}

exports.HAS = HAS;
exports.MAX_TEXTURE_SIZE = MAX_TEXTURE_SIZE;
exports.EXTENSIONS = EXTENSIONS;

//# sourceMappingURL=webgl.js.map