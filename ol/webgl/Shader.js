'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util.js');

/**
 * @abstract
 */
var WebGLShader = function WebGLShader(source) {

  /**
   * @private
   * @type {string}
   */
  this.source_ = source;
};

/**
 * @return {boolean} Is animated?
 */
/**
 * @module ol/webgl/Shader
 */
WebGLShader.prototype.isAnimated = function isAnimated() {
  return false;
};

/**
 * @abstract
 * @return {number} Type.
 */
WebGLShader.prototype.getType = function getType() {
  return (0, _util.abstract)();
};

/**
 * @return {string} Source.
 */
WebGLShader.prototype.getSource = function getSource() {
  return this.source_;
};

exports.default = WebGLShader;

//# sourceMappingURL=Shader.js.map