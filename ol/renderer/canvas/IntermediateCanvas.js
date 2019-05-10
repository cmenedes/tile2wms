'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../../util.js');

var _coordinate = require('../../coordinate.js');

var _dom = require('../../dom.js');

var _extent = require('../../extent.js');

var _Layer = require('./Layer.js');

var _Layer2 = _interopRequireDefault(_Layer);

var _transform = require('../../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @abstract
 */
/**
 * @module ol/renderer/canvas/IntermediateCanvas
 */
var IntermediateCanvasRenderer = /*@__PURE__*/function (CanvasLayerRenderer) {
  function IntermediateCanvasRenderer(layer) {

    CanvasLayerRenderer.call(this, layer);

    /**
     * @protected
     * @type {import("../../transform.js").Transform}
     */
    this.coordinateToCanvasPixelTransform = (0, _transform.create)();

    /**
     * @private
     * @type {CanvasRenderingContext2D}
     */
    this.hitCanvasContext_ = null;
  }

  if (CanvasLayerRenderer) IntermediateCanvasRenderer.__proto__ = CanvasLayerRenderer;
  IntermediateCanvasRenderer.prototype = Object.create(CanvasLayerRenderer && CanvasLayerRenderer.prototype);
  IntermediateCanvasRenderer.prototype.constructor = IntermediateCanvasRenderer;

  /**
   * @inheritDoc
   */
  IntermediateCanvasRenderer.prototype.composeFrame = function composeFrame(frameState, layerState, context) {

    this.preCompose(context, frameState);

    var image = this.getImage();
    if (image) {

      // clipped rendering if layer extent is set
      var extent = layerState.extent;
      var clipped = extent !== undefined && !(0, _extent.containsExtent)(extent, frameState.extent) && (0, _extent.intersects)(extent, frameState.extent);
      if (clipped) {
        this.clip(context, frameState, /** @type {import("../../extent.js").Extent} */extent);
      }

      var imageTransform = this.getImageTransform();
      // for performance reasons, context.save / context.restore is not used
      // to save and restore the transformation matrix and the opacity.
      // see http://jsperf.com/context-save-restore-versus-variable
      var alpha = context.globalAlpha;
      context.globalAlpha = layerState.opacity;

      // for performance reasons, context.setTransform is only used
      // when the view is rotated. see http://jsperf.com/canvas-transform
      var dx = imageTransform[4];
      var dy = imageTransform[5];
      var dw = image.width * imageTransform[0];
      var dh = image.height * imageTransform[3];
      if (dw >= 0.5 && dh >= 0.5) {
        context.drawImage(image, 0, 0, +image.width, +image.height, Math.round(dx), Math.round(dy), Math.round(dw), Math.round(dh));
      }
      context.globalAlpha = alpha;

      if (clipped) {
        context.restore();
      }
    }

    this.postCompose(context, frameState, layerState);
  };

  /**
   * @abstract
   * @return {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement} Canvas.
   */
  IntermediateCanvasRenderer.prototype.getImage = function getImage() {
    return (0, _util.abstract)();
  };

  /**
   * @abstract
   * @return {!import("../../transform.js").Transform} Image transform.
   */
  IntermediateCanvasRenderer.prototype.getImageTransform = function getImageTransform() {
    return (0, _util.abstract)();
  };

  /**
   * @inheritDoc
   */
  IntermediateCanvasRenderer.prototype.forEachLayerAtCoordinate = function forEachLayerAtCoordinate(coordinate, frameState, hitTolerance, callback, thisArg) {
    if (!this.getImage()) {
      return undefined;
    }

    var pixel = (0, _transform.apply)(this.coordinateToCanvasPixelTransform, coordinate.slice());
    (0, _coordinate.scale)(pixel, frameState.viewState.resolution / this.renderedResolution);

    if (!this.hitCanvasContext_) {
      this.hitCanvasContext_ = (0, _dom.createCanvasContext2D)(1, 1);
    }

    this.hitCanvasContext_.clearRect(0, 0, 1, 1);
    this.hitCanvasContext_.drawImage(this.getImage(), pixel[0], pixel[1], 1, 1, 0, 0, 1, 1);

    var imageData = this.hitCanvasContext_.getImageData(0, 0, 1, 1).data;
    if (imageData[3] > 0) {
      return callback.call(thisArg, this.getLayer(), imageData);
    } else {
      return undefined;
    }
  };

  return IntermediateCanvasRenderer;
}(_Layer2.default);

exports.default = IntermediateCanvasRenderer;

//# sourceMappingURL=IntermediateCanvas.js.map