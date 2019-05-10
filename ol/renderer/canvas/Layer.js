'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../../util.js');

var _extent = require('../../extent.js');

var _functions = require('../../functions.js');

var _Event = require('../../render/Event.js');

var _Event2 = _interopRequireDefault(_Event);

var _EventType = require('../../render/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _canvas = require('../../render/canvas.js');

var _Immediate = require('../../render/canvas/Immediate.js');

var _Immediate2 = _interopRequireDefault(_Immediate);

var _Layer = require('../Layer.js');

var _Layer2 = _interopRequireDefault(_Layer);

var _transform = require('../../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @abstract
 */
var CanvasLayerRenderer = /*@__PURE__*/function (LayerRenderer) {
  function CanvasLayerRenderer(layer) {

    LayerRenderer.call(this, layer);

    /**
     * @protected
     * @type {number}
     */
    this.renderedResolution;

    /**
     * @private
     * @type {import("../../transform.js").Transform}
     */
    this.transform_ = (0, _transform.create)();
  }

  if (LayerRenderer) CanvasLayerRenderer.__proto__ = LayerRenderer;
  CanvasLayerRenderer.prototype = Object.create(LayerRenderer && LayerRenderer.prototype);
  CanvasLayerRenderer.prototype.constructor = CanvasLayerRenderer;

  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
   * @param {import("../../extent.js").Extent} extent Clip extent.
   * @protected
   */
  CanvasLayerRenderer.prototype.clip = function clip(context, frameState, extent) {
    var pixelRatio = frameState.pixelRatio;
    var width = frameState.size[0] * pixelRatio;
    var height = frameState.size[1] * pixelRatio;
    var rotation = frameState.viewState.rotation;
    var topLeft = (0, _extent.getTopLeft)(extent);
    var topRight = (0, _extent.getTopRight)(extent);
    var bottomRight = (0, _extent.getBottomRight)(extent);
    var bottomLeft = (0, _extent.getBottomLeft)(extent);

    (0, _transform.apply)(frameState.coordinateToPixelTransform, topLeft);
    (0, _transform.apply)(frameState.coordinateToPixelTransform, topRight);
    (0, _transform.apply)(frameState.coordinateToPixelTransform, bottomRight);
    (0, _transform.apply)(frameState.coordinateToPixelTransform, bottomLeft);

    context.save();
    (0, _canvas.rotateAtOffset)(context, -rotation, width / 2, height / 2);
    context.beginPath();
    context.moveTo(topLeft[0] * pixelRatio, topLeft[1] * pixelRatio);
    context.lineTo(topRight[0] * pixelRatio, topRight[1] * pixelRatio);
    context.lineTo(bottomRight[0] * pixelRatio, bottomRight[1] * pixelRatio);
    context.lineTo(bottomLeft[0] * pixelRatio, bottomLeft[1] * pixelRatio);
    context.clip();
    (0, _canvas.rotateAtOffset)(context, rotation, width / 2, height / 2);
  };

  /**
   * @param {import("../../render/EventType.js").default} type Event type.
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
   * @param {import("../../transform.js").Transform=} opt_transform Transform.
   * @private
   */
  CanvasLayerRenderer.prototype.dispatchComposeEvent_ = function dispatchComposeEvent_(type, context, frameState, opt_transform) {
    var layer = this.getLayer();
    if (layer.hasListener(type)) {
      var width = frameState.size[0] * frameState.pixelRatio;
      var height = frameState.size[1] * frameState.pixelRatio;
      var rotation = frameState.viewState.rotation;
      (0, _canvas.rotateAtOffset)(context, -rotation, width / 2, height / 2);
      var transform = opt_transform !== undefined ? opt_transform : this.getTransform(frameState, 0);
      var render = new _Immediate2.default(context, frameState.pixelRatio, frameState.extent, transform, frameState.viewState.rotation);
      var composeEvent = new _Event2.default(type, render, frameState, context, null);
      layer.dispatchEvent(composeEvent);
      (0, _canvas.rotateAtOffset)(context, rotation, width / 2, height / 2);
    }
  };

  /**
   * @param {import("../../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../../PluggableMap.js").FrameState} frameState FrameState.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {function(this: S, import("../../layer/Layer.js").default, (Uint8ClampedArray|Uint8Array)): T} callback Layer
   *     callback.
   * @param {S} thisArg Value to use as `this` when executing `callback`.
   * @return {T|undefined} Callback result.
   * @template S,T,U
   */
  CanvasLayerRenderer.prototype.forEachLayerAtCoordinate = function forEachLayerAtCoordinate(coordinate, frameState, hitTolerance, callback, thisArg) {
    var hasFeature = this.forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, _functions.TRUE);

    if (hasFeature) {
      return callback.call(thisArg, this.getLayer(), null);
    } else {
      return undefined;
    }
  };

  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
   * @param {import("../../layer/Layer.js").State} layerState Layer state.
   * @param {import("../../transform.js").Transform=} opt_transform Transform.
   * @protected
   */
  CanvasLayerRenderer.prototype.postCompose = function postCompose(context, frameState, layerState, opt_transform) {
    this.dispatchComposeEvent_(_EventType2.default.POSTCOMPOSE, context, frameState, opt_transform);
  };

  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
   * @param {import("../../transform.js").Transform=} opt_transform Transform.
   * @protected
   */
  CanvasLayerRenderer.prototype.preCompose = function preCompose(context, frameState, opt_transform) {
    this.dispatchComposeEvent_(_EventType2.default.PRECOMPOSE, context, frameState, opt_transform);
  };

  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
   * @param {import("../../transform.js").Transform=} opt_transform Transform.
   * @protected
   */
  CanvasLayerRenderer.prototype.dispatchRenderEvent = function dispatchRenderEvent(context, frameState, opt_transform) {
    this.dispatchComposeEvent_(_EventType2.default.RENDER, context, frameState, opt_transform);
  };

  /**
   * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
   * @param {number} offsetX Offset on the x-axis in view coordinates.
   * @protected
   * @return {!import("../../transform.js").Transform} Transform.
   */
  CanvasLayerRenderer.prototype.getTransform = function getTransform(frameState, offsetX) {
    var viewState = frameState.viewState;
    var pixelRatio = frameState.pixelRatio;
    var dx1 = pixelRatio * frameState.size[0] / 2;
    var dy1 = pixelRatio * frameState.size[1] / 2;
    var sx = pixelRatio / viewState.resolution;
    var sy = -sx;
    var angle = -viewState.rotation;
    var dx2 = -viewState.center[0] + offsetX;
    var dy2 = -viewState.center[1];
    return (0, _transform.compose)(this.transform_, dx1, dy1, sx, sy, angle, dx2, dy2);
  };

  /**
   * @abstract
   * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
   * @param {import("../../layer/Layer.js").State} layerState Layer state.
   * @param {CanvasRenderingContext2D} context Context.
   */
  CanvasLayerRenderer.prototype.composeFrame = function composeFrame(frameState, layerState, context) {
    (0, _util.abstract)();
  };

  /**
   * @abstract
   * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
   * @param {import("../../layer/Layer.js").State} layerState Layer state.
   * @return {boolean} whether composeFrame should be called.
   */
  CanvasLayerRenderer.prototype.prepareFrame = function prepareFrame(frameState, layerState) {
    return (0, _util.abstract)();
  };

  return CanvasLayerRenderer;
}(_Layer2.default); /**
                     * @module ol/renderer/canvas/Layer
                     */
exports.default = CanvasLayerRenderer;

//# sourceMappingURL=Layer.js.map