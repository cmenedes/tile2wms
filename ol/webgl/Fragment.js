'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webgl = require('../webgl.js');

var _Shader = require('../webgl/Shader.js');

var _Shader2 = _interopRequireDefault(_Shader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module ol/webgl/Fragment
 */

var WebGLFragment = /*@__PURE__*/function (WebGLShader) {
  function WebGLFragment(source) {
    WebGLShader.call(this, source);
  }

  if (WebGLShader) WebGLFragment.__proto__ = WebGLShader;
  WebGLFragment.prototype = Object.create(WebGLShader && WebGLShader.prototype);
  WebGLFragment.prototype.constructor = WebGLFragment;

  /**
   * @inheritDoc
   */
  WebGLFragment.prototype.getType = function getType() {
    return _webgl.FRAGMENT_SHADER;
  };

  return WebGLFragment;
}(_Shader2.default);

exports.default = WebGLFragment;

//# sourceMappingURL=Fragment.js.map