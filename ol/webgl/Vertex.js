'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webgl = require('../webgl.js');

var _Shader = require('../webgl/Shader.js');

var _Shader2 = _interopRequireDefault(_Shader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module ol/webgl/Vertex
 */

var WebGLVertex = /*@__PURE__*/function (WebGLShader) {
  function WebGLVertex(source) {
    WebGLShader.call(this, source);
  }

  if (WebGLShader) WebGLVertex.__proto__ = WebGLShader;
  WebGLVertex.prototype = Object.create(WebGLShader && WebGLShader.prototype);
  WebGLVertex.prototype.constructor = WebGLVertex;

  /**
   * @inheritDoc
   */
  WebGLVertex.prototype.getType = function getType() {
    return _webgl.VERTEX_SHADER;
  };

  return WebGLVertex;
}(_Shader2.default);

exports.default = WebGLVertex;

//# sourceMappingURL=Vertex.js.map