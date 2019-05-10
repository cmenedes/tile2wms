'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../../util.js');

var _extent = require('../../extent.js');

var _VectorContext = require('../VectorContext.js');

var _VectorContext2 = _interopRequireDefault(_VectorContext);

var _transform = require('../../transform.js');

var _mat = require('../../vec/mat4.js');

var _webgl = require('../../webgl.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module ol/render/webgl/Replay
 */
var WebGLReplay = /*@__PURE__*/function (VectorContext) {
  function WebGLReplay(tolerance, maxExtent) {
    VectorContext.call(this);

    /**
     * @protected
     * @type {number}
     */
    this.tolerance = tolerance;

    /**
     * @protected
     * @const
     * @type {import("../../extent.js").Extent}
     */
    this.maxExtent = maxExtent;

    /**
     * The origin of the coordinate system for the point coordinates sent to
     * the GPU. To eliminate jitter caused by precision problems in the GPU
     * we use the "Rendering Relative to Eye" technique described in the "3D
     * Engine Design for Virtual Globes" book.
     * @protected
     * @type {import("../../coordinate.js").Coordinate}
     */
    this.origin = (0, _extent.getCenter)(maxExtent);

    /**
     * @private
     * @type {import("../../transform.js").Transform}
     */
    this.projectionMatrix_ = (0, _transform.create)();

    /**
     * @private
     * @type {import("../../transform.js").Transform}
     */
    this.offsetRotateMatrix_ = (0, _transform.create)();

    /**
     * @private
     * @type {import("../../transform.js").Transform}
     */
    this.offsetScaleMatrix_ = (0, _transform.create)();

    /**
     * @private
     * @type {Array<number>}
     */
    this.tmpMat4_ = (0, _mat.create)();

    /**
     * @protected
     * @type {Array<number>}
     */
    this.indices = [];

    /**
     * @protected
     * @type {?import("../../webgl/Buffer.js").default}
     */
    this.indicesBuffer = null;

    /**
     * Start index per feature (the index).
     * @protected
     * @type {Array<number>}
     */
    this.startIndices = [];

    /**
     * Start index per feature (the feature).
     * @protected
     * @type {Array<import("../../Feature.js").default|import("../Feature.js").default>}
     */
    this.startIndicesFeature = [];

    /**
     * @protected
     * @type {Array<number>}
     */
    this.vertices = [];

    /**
     * @protected
     * @type {?import("../../webgl/Buffer.js").default}
     */
    this.verticesBuffer = null;

    /**
     * Optional parameter for PolygonReplay instances.
     * @protected
     * @type {import("./LineStringReplay.js").default|undefined}
     */
    this.lineStringReplay = undefined;
  }

  if (VectorContext) WebGLReplay.__proto__ = VectorContext;
  WebGLReplay.prototype = Object.create(VectorContext && VectorContext.prototype);
  WebGLReplay.prototype.constructor = WebGLReplay;

  /**
   * @abstract
   * @param {import("../../webgl/Context.js").default} context WebGL context.
   * @return {function()} Delete resources function.
   */
  WebGLReplay.prototype.getDeleteResourcesFunction = function getDeleteResourcesFunction(context) {
    return (0, _util.abstract)();
  };

  /**
   * @abstract
   * @param {import("../../webgl/Context.js").default} context Context.
   */
  WebGLReplay.prototype.finish = function finish(context) {
    (0, _util.abstract)();
  };

  /**
   * @abstract
   * @protected
   * @param {WebGLRenderingContext} gl gl.
   * @param {import("../../webgl/Context.js").default} context Context.
   * @param {import("../../size.js").Size} size Size.
   * @param {number} pixelRatio Pixel ratio.
   * @return {import("./circlereplay/defaultshader/Locations.js").default|
     import("./linestringreplay/defaultshader/Locations.js").default|
     import("./polygonreplay/defaultshader/Locations.js").default|
     import("./texturereplay/defaultshader/Locations.js").default} Locations.
   */
  WebGLReplay.prototype.setUpProgram = function setUpProgram(gl, context, size, pixelRatio) {
    return (0, _util.abstract)();
  };

  /**
   * @abstract
   * @protected
   * @param {WebGLRenderingContext} gl gl.
   * @param {import("./circlereplay/defaultshader/Locations.js").default|
     import("./linestringreplay/defaultshader/Locations.js").default|
     import("./polygonreplay/defaultshader/Locations.js").default|
     import("./texturereplay/defaultshader/Locations.js").default} locations Locations.
   */
  WebGLReplay.prototype.shutDownProgram = function shutDownProgram(gl, locations) {
    (0, _util.abstract)();
  };

  /**
   * @abstract
   * @protected
   * @param {WebGLRenderingContext} gl gl.
   * @param {import("../../webgl/Context.js").default} context Context.
   * @param {Object<string, boolean>} skippedFeaturesHash Ids of features to skip.
   * @param {boolean} hitDetection Hit detection mode.
   */
  WebGLReplay.prototype.drawReplay = function drawReplay(gl, context, skippedFeaturesHash, hitDetection) {
    (0, _util.abstract)();
  };

  /**
   * @abstract
   * @protected
   * @param {WebGLRenderingContext} gl gl.
   * @param {import("../../webgl/Context.js").default} context Context.
   * @param {Object<string, boolean>} skippedFeaturesHash Ids of features to skip.
   * @param {function((import("../../Feature.js").default|import("../Feature.js").default)): T|undefined} featureCallback Feature callback.
   * @param {import("../../extent.js").Extent=} opt_hitExtent Hit extent: Only features intersecting this extent are checked.
   * @return {T|undefined} Callback result.
   * @template T
   */
  WebGLReplay.prototype.drawHitDetectionReplayOneByOne = function drawHitDetectionReplayOneByOne(gl, context, skippedFeaturesHash, featureCallback, opt_hitExtent) {
    return (0, _util.abstract)();
  };

  /**
   * @protected
   * @param {WebGLRenderingContext} gl gl.
   * @param {import("../../webgl/Context.js").default} context Context.
   * @param {Object<string, boolean>} skippedFeaturesHash Ids of features to skip.
   * @param {function((import("../../Feature.js").default|import("../Feature.js").default)): T|undefined} featureCallback Feature callback.
   * @param {boolean} oneByOne Draw features one-by-one for the hit-detecion.
   * @param {import("../../extent.js").Extent=} opt_hitExtent Hit extent: Only features intersecting this extent are checked.
   * @return {T|undefined} Callback result.
   * @template T
   */
  WebGLReplay.prototype.drawHitDetectionReplay = function drawHitDetectionReplay(gl, context, skippedFeaturesHash, featureCallback, oneByOne, opt_hitExtent) {
    if (!oneByOne) {
      // draw all hit-detection features in "once" (by texture group)
      return this.drawHitDetectionReplayAll(gl, context, skippedFeaturesHash, featureCallback);
    } else {
      // draw hit-detection features one by one
      return this.drawHitDetectionReplayOneByOne(gl, context, skippedFeaturesHash, featureCallback, opt_hitExtent);
    }
  };

  /**
   * @protected
   * @param {WebGLRenderingContext} gl gl.
   * @param {import("../../webgl/Context.js").default} context Context.
   * @param {Object<string, boolean>} skippedFeaturesHash Ids of features to skip.
   * @param {function((import("../../Feature.js").default|import("../Feature.js").default)): T|undefined} featureCallback Feature callback.
   * @return {T|undefined} Callback result.
   * @template T
   */
  WebGLReplay.prototype.drawHitDetectionReplayAll = function drawHitDetectionReplayAll(gl, context, skippedFeaturesHash, featureCallback) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.drawReplay(gl, context, skippedFeaturesHash, true);

    var result = featureCallback(null);
    if (result) {
      return result;
    } else {
      return undefined;
    }
  };

  /**
   * @param {import("../../webgl/Context.js").default} context Context.
   * @param {import("../../coordinate.js").Coordinate} center Center.
   * @param {number} resolution Resolution.
   * @param {number} rotation Rotation.
   * @param {import("../../size.js").Size} size Size.
   * @param {number} pixelRatio Pixel ratio.
   * @param {number} opacity Global opacity.
   * @param {Object<string, boolean>} skippedFeaturesHash Ids of features to skip.
   * @param {function((import("../../Feature.js").default|import("../Feature.js").default)): T|undefined} featureCallback Feature callback.
   * @param {boolean} oneByOne Draw features one-by-one for the hit-detecion.
   * @param {import("../../extent.js").Extent=} opt_hitExtent Hit extent: Only features intersecting this extent are checked.
   * @return {T|undefined} Callback result.
   * @template T
   */
  WebGLReplay.prototype.replay = function replay(context, center, resolution, rotation, size, pixelRatio, opacity, skippedFeaturesHash, featureCallback, oneByOne, opt_hitExtent) {
    var gl = context.getGL();
    var tmpStencil, tmpStencilFunc, tmpStencilMaskVal, tmpStencilRef, tmpStencilMask, tmpStencilOpFail, tmpStencilOpPass, tmpStencilOpZFail;

    if (this.lineStringReplay) {
      tmpStencil = gl.isEnabled(gl.STENCIL_TEST);
      tmpStencilFunc = gl.getParameter(gl.STENCIL_FUNC);
      tmpStencilMaskVal = gl.getParameter(gl.STENCIL_VALUE_MASK);
      tmpStencilRef = gl.getParameter(gl.STENCIL_REF);
      tmpStencilMask = gl.getParameter(gl.STENCIL_WRITEMASK);
      tmpStencilOpFail = gl.getParameter(gl.STENCIL_FAIL);
      tmpStencilOpPass = gl.getParameter(gl.STENCIL_PASS_DEPTH_PASS);
      tmpStencilOpZFail = gl.getParameter(gl.STENCIL_PASS_DEPTH_FAIL);

      gl.enable(gl.STENCIL_TEST);
      gl.clear(gl.STENCIL_BUFFER_BIT);
      gl.stencilMask(255);
      gl.stencilFunc(gl.ALWAYS, 1, 255);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.REPLACE);

      this.lineStringReplay.replay(context, center, resolution, rotation, size, pixelRatio, opacity, skippedFeaturesHash, featureCallback, oneByOne, opt_hitExtent);

      gl.stencilMask(0);
      gl.stencilFunc(gl.NOTEQUAL, 1, 255);
    }

    context.bindBuffer(_webgl.ARRAY_BUFFER, this.verticesBuffer);

    context.bindBuffer(_webgl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);

    var locations = this.setUpProgram(gl, context, size, pixelRatio);

    // set the "uniform" values
    var projectionMatrix = (0, _transform.reset)(this.projectionMatrix_);
    (0, _transform.scale)(projectionMatrix, 2 / (resolution * size[0]), 2 / (resolution * size[1]));
    (0, _transform.rotate)(projectionMatrix, -rotation);
    (0, _transform.translate)(projectionMatrix, -(center[0] - this.origin[0]), -(center[1] - this.origin[1]));

    var offsetScaleMatrix = (0, _transform.reset)(this.offsetScaleMatrix_);
    (0, _transform.scale)(offsetScaleMatrix, 2 / size[0], 2 / size[1]);

    var offsetRotateMatrix = (0, _transform.reset)(this.offsetRotateMatrix_);
    if (rotation !== 0) {
      (0, _transform.rotate)(offsetRotateMatrix, -rotation);
    }

    gl.uniformMatrix4fv(locations.u_projectionMatrix, false, (0, _mat.fromTransform)(this.tmpMat4_, projectionMatrix));
    gl.uniformMatrix4fv(locations.u_offsetScaleMatrix, false, (0, _mat.fromTransform)(this.tmpMat4_, offsetScaleMatrix));
    gl.uniformMatrix4fv(locations.u_offsetRotateMatrix, false, (0, _mat.fromTransform)(this.tmpMat4_, offsetRotateMatrix));
    gl.uniform1f(locations.u_opacity, opacity);

    // draw!
    var result;
    if (featureCallback === undefined) {
      this.drawReplay(gl, context, skippedFeaturesHash, false);
    } else {
      // draw feature by feature for the hit-detection
      result = this.drawHitDetectionReplay(gl, context, skippedFeaturesHash, featureCallback, oneByOne, opt_hitExtent);
    }

    // disable the vertex attrib arrays
    this.shutDownProgram(gl, locations);

    if (this.lineStringReplay) {
      if (!tmpStencil) {
        gl.disable(gl.STENCIL_TEST);
      }
      gl.clear(gl.STENCIL_BUFFER_BIT);
      gl.stencilFunc( /** @type {number} */tmpStencilFunc,
      /** @type {number} */tmpStencilRef, /** @type {number} */tmpStencilMaskVal);
      gl.stencilMask( /** @type {number} */tmpStencilMask);
      gl.stencilOp( /** @type {number} */tmpStencilOpFail,
      /** @type {number} */tmpStencilOpZFail, /** @type {number} */tmpStencilOpPass);
    }

    return result;
  };

  /**
   * @protected
   * @param {WebGLRenderingContext} gl gl.
   * @param {import("../../webgl/Context.js").default} context Context.
   * @param {number} start Start index.
   * @param {number} end End index.
   */
  WebGLReplay.prototype.drawElements = function drawElements(gl, context, start, end) {
    var elementType = context.hasOESElementIndexUint ? _webgl.UNSIGNED_INT : _webgl.UNSIGNED_SHORT;
    var elementSize = context.hasOESElementIndexUint ? 4 : 2;

    var numItems = end - start;
    var offsetInBytes = start * elementSize;
    gl.drawElements(_webgl.TRIANGLES, numItems, elementType, offsetInBytes);
  };

  return WebGLReplay;
}(_VectorContext2.default);

exports.default = WebGLReplay;

//# sourceMappingURL=Replay.js.map