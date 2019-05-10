'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webgl = require('../webgl.js');

/**
 * @enum {number}
 */
var BufferUsage = {
  STATIC_DRAW: _webgl.STATIC_DRAW,
  STREAM_DRAW: _webgl.STREAM_DRAW,
  DYNAMIC_DRAW: _webgl.DYNAMIC_DRAW
}; /**
    * @module ol/webgl/Buffer
    */


var WebGLBuffer = function WebGLBuffer(opt_arr, opt_usage) {

  /**
   * @private
   * @type {Array<number>}
   */
  this.arr_ = opt_arr !== undefined ? opt_arr : [];

  /**
   * @private
   * @type {number}
   */
  this.usage_ = opt_usage !== undefined ? opt_usage : BufferUsage.STATIC_DRAW;
};

/**
 * @return {Array<number>} Array.
 */
WebGLBuffer.prototype.getArray = function getArray() {
  return this.arr_;
};

/**
 * @return {number} Usage.
 */
WebGLBuffer.prototype.getUsage = function getUsage() {
  return this.usage_;
};

exports.default = WebGLBuffer;

//# sourceMappingURL=Buffer.js.map