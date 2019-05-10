'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../../util.js');

var _Event = require('../../render/Event.js');

var _Event2 = _interopRequireDefault(_Event);

var _EventType = require('../../render/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _Immediate = require('../../render/webgl/Immediate.js');

var _Immediate2 = _interopRequireDefault(_Immediate);

var _Layer = require('../Layer.js');

var _Layer2 = _interopRequireDefault(_Layer);

var _defaultmapshader = require('./defaultmapshader.js');

var _Locations = require('./defaultmapshader/Locations.js');

var _Locations2 = _interopRequireDefault(_Locations);

var _transform = require('../../transform.js');

var _mat = require('../../vec/mat4.js');

var _webgl = require('../../webgl.js');

var _Buffer = require('../../webgl/Buffer.js');

var _Buffer2 = _interopRequireDefault(_Buffer);

var _Context = require('../../webgl/Context.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @abstract
 */
/**
 * @module ol/renderer/webgl/Layer
 */
var WebGLLayerRenderer = /*@__PURE__*/function (LayerRenderer) {
  function WebGLLayerRenderer(mapRenderer, layer) {

    LayerRenderer.call(this, layer);

    /**
     * @protected
     * @type {import("./Map.js").default}
     */
    this.mapRenderer = mapRenderer;

    /**
     * @private
     * @type {import("../../webgl/Buffer.js").default}
     */
    this.arrayBuffer_ = new _Buffer2.default([-1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, 1, 1, 1, 1]);

    /**
     * @protected
     * @type {WebGLTexture}
     */
    this.texture = null;

    /**
     * @protected
     * @type {WebGLFramebuffer}
     */
    this.framebuffer = null;

    /**
     * @protected
     * @type {number|undefined}
     */
    this.framebufferDimension = undefined;

    /**
     * @protected
     * @type {import("../../transform.js").Transform}
     */
    this.texCoordMatrix = (0, _transform.create)();

    /**
     * @protected
     * @type {import("../../transform.js").Transform}
     */
    this.projectionMatrix = (0, _transform.create)();

    /**
     * @type {Array<number>}
     * @private
     */
    this.tmpMat4_ = (0, _mat.create)();

    /**
     * @private
     * @type {import("./defaultmapshader/Locations.js").default}
     */
    this.defaultLocations_ = null;
  }

  if (LayerRenderer) WebGLLayerRenderer.__proto__ = LayerRenderer;
  WebGLLayerRenderer.prototype = Object.create(LayerRenderer && LayerRenderer.prototype);
  WebGLLayerRenderer.prototype.constructor = WebGLLayerRenderer;

  /**
   * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
   * @param {number} framebufferDimension Framebuffer dimension.
   * @protected
   */
  WebGLLayerRenderer.prototype.bindFramebuffer = function bindFramebuffer(frameState, framebufferDimension) {

    var gl = this.mapRenderer.getGL();

    if (this.framebufferDimension === undefined || this.framebufferDimension != framebufferDimension) {
      /**
       * @param {WebGLRenderingContext} gl GL.
       * @param {WebGLFramebuffer} framebuffer Framebuffer.
       * @param {WebGLTexture} texture Texture.
       */
      var postRenderFunction = function (gl, framebuffer, texture) {
        if (!gl.isContextLost()) {
          gl.deleteFramebuffer(framebuffer);
          gl.deleteTexture(texture);
        }
      }.bind(null, gl, this.framebuffer, this.texture);

      frameState.postRenderFunctions.push(
      /** @type {import("../../PluggableMap.js").PostRenderFunction} */postRenderFunction);

      var texture = (0, _Context.createEmptyTexture)(gl, framebufferDimension, framebufferDimension);

      var framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(_webgl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(_webgl.FRAMEBUFFER, _webgl.COLOR_ATTACHMENT0, _webgl.TEXTURE_2D, texture, 0);

      this.texture = texture;
      this.framebuffer = framebuffer;
      this.framebufferDimension = framebufferDimension;
    } else {
      gl.bindFramebuffer(_webgl.FRAMEBUFFER, this.framebuffer);
    }
  };

  /**
   * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
   * @param {import("../../layer/Layer.js").State} layerState Layer state.
   * @param {import("../../webgl/Context.js").default} context Context.
   */
  WebGLLayerRenderer.prototype.composeFrame = function composeFrame(frameState, layerState, context) {

    this.dispatchComposeEvent_(_EventType2.default.PRECOMPOSE, context, frameState);

    context.bindBuffer(_webgl.ARRAY_BUFFER, this.arrayBuffer_);

    var gl = context.getGL();

    var program = context.getProgram(_defaultmapshader.fragment, _defaultmapshader.vertex);

    var locations;
    if (!this.defaultLocations_) {
      locations = new _Locations2.default(gl, program);
      this.defaultLocations_ = locations;
    } else {
      locations = this.defaultLocations_;
    }

    if (context.useProgram(program)) {
      gl.enableVertexAttribArray(locations.a_position);
      gl.vertexAttribPointer(locations.a_position, 2, _webgl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(locations.a_texCoord);
      gl.vertexAttribPointer(locations.a_texCoord, 2, _webgl.FLOAT, false, 16, 8);
      gl.uniform1i(locations.u_texture, 0);
    }

    gl.uniformMatrix4fv(locations.u_texCoordMatrix, false, (0, _mat.fromTransform)(this.tmpMat4_, this.getTexCoordMatrix()));
    gl.uniformMatrix4fv(locations.u_projectionMatrix, false, (0, _mat.fromTransform)(this.tmpMat4_, this.getProjectionMatrix()));
    gl.uniform1f(locations.u_opacity, layerState.opacity);
    gl.bindTexture(_webgl.TEXTURE_2D, this.getTexture());
    gl.drawArrays(_webgl.TRIANGLE_STRIP, 0, 4);

    this.dispatchComposeEvent_(_EventType2.default.POSTCOMPOSE, context, frameState);
  };

  /**
   * @param {import("../../render/EventType.js").default} type Event type.
   * @param {import("../../webgl/Context.js").default} context WebGL context.
   * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
   * @private
   */
  WebGLLayerRenderer.prototype.dispatchComposeEvent_ = function dispatchComposeEvent_(type, context, frameState) {
    var layer = this.getLayer();
    if (layer.hasListener(type)) {
      var viewState = frameState.viewState;
      var resolution = viewState.resolution;
      var pixelRatio = frameState.pixelRatio;
      var extent = frameState.extent;
      var center = viewState.center;
      var rotation = viewState.rotation;
      var size = frameState.size;

      var render = new _Immediate2.default(context, center, resolution, rotation, size, extent, pixelRatio);
      var composeEvent = new _Event2.default(type, render, frameState, null, context);
      layer.dispatchEvent(composeEvent);
    }
  };

  /**
   * @return {!import("../../transform.js").Transform} Matrix.
   */
  WebGLLayerRenderer.prototype.getTexCoordMatrix = function getTexCoordMatrix() {
    return this.texCoordMatrix;
  };

  /**
   * @return {WebGLTexture} Texture.
   */
  WebGLLayerRenderer.prototype.getTexture = function getTexture() {
    return this.texture;
  };

  /**
   * @return {!import("../../transform.js").Transform} Matrix.
   */
  WebGLLayerRenderer.prototype.getProjectionMatrix = function getProjectionMatrix() {
    return this.projectionMatrix;
  };

  /**
   * Handle webglcontextlost.
   */
  WebGLLayerRenderer.prototype.handleWebGLContextLost = function handleWebGLContextLost() {
    this.texture = null;
    this.framebuffer = null;
    this.framebufferDimension = undefined;
  };

  /**
   * @abstract
   * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
   * @param {import("../../layer/Layer.js").State} layerState Layer state.
   * @param {import("../../webgl/Context.js").default} context Context.
   * @return {boolean} whether composeFrame should be called.
   */
  WebGLLayerRenderer.prototype.prepareFrame = function prepareFrame(frameState, layerState, context) {
    return (0, _util.abstract)();
  };

  /**
   * @abstract
   * @param {import("../../pixel.js").Pixel} pixel Pixel.
   * @param {import("../../PluggableMap.js").FrameState} frameState FrameState.
   * @param {function(this: S, import("../../layer/Layer.js").default, (Uint8ClampedArray|Uint8Array)): T} callback Layer
   *     callback.
   * @param {S} thisArg Value to use as `this` when executing `callback`.
   * @return {T|undefined} Callback result.
   * @template S,T,U
   */
  WebGLLayerRenderer.prototype.forEachLayerAtPixel = function forEachLayerAtPixel(pixel, frameState, callback, thisArg) {
    return (0, _util.abstract)();
  };

  return WebGLLayerRenderer;
}(_Layer2.default);

exports.default = WebGLLayerRenderer;

//# sourceMappingURL=Layer.js.map