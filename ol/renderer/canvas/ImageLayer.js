'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = require('../../reproj/common.js');

var _ImageCanvas = require('../../ImageCanvas.js');

var _ImageCanvas2 = _interopRequireDefault(_ImageCanvas);

var _LayerType = require('../../LayerType.js');

var _LayerType2 = _interopRequireDefault(_LayerType);

var _ViewHint = require('../../ViewHint.js');

var _ViewHint2 = _interopRequireDefault(_ViewHint);

var _array = require('../../array.js');

var _extent = require('../../extent.js');

var _VectorRenderType = require('../../layer/VectorRenderType.js');

var _VectorRenderType2 = _interopRequireDefault(_VectorRenderType);

var _obj = require('../../obj.js');

var _Map = require('./Map.js');

var _IntermediateCanvas = require('./IntermediateCanvas.js');

var _IntermediateCanvas2 = _interopRequireDefault(_IntermediateCanvas);

var _transform = require('../../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Canvas renderer for image layers.
 * @api
 */
var CanvasImageLayerRenderer = /*@__PURE__*/function (IntermediateCanvasRenderer) {
  function CanvasImageLayerRenderer(imageLayer) {

    IntermediateCanvasRenderer.call(this, imageLayer);

    /**
     * @private
     * @type {?import("../../ImageBase.js").default}
     */
    this.image_ = null;

    /**
     * @private
     * @type {import("../../transform.js").Transform}
     */
    this.imageTransform_ = (0, _transform.create)();

    /**
     * @type {!Array<string>}
     */
    this.skippedFeatures_ = [];

    /**
     * @private
     * @type {import("./VectorLayer.js").default}
     */
    this.vectorRenderer_ = null;

    if (imageLayer.getType() === _LayerType2.default.VECTOR) {
      for (var i = 0, ii = _Map.layerRendererConstructors.length; i < ii; ++i) {
        var ctor = _Map.layerRendererConstructors[i];
        if (ctor !== CanvasImageLayerRenderer && ctor['handles'](imageLayer)) {
          this.vectorRenderer_ = /** @type {import("./VectorLayer.js").default} */new ctor(imageLayer);
          break;
        }
      }
    }
  }

  if (IntermediateCanvasRenderer) CanvasImageLayerRenderer.__proto__ = IntermediateCanvasRenderer;
  CanvasImageLayerRenderer.prototype = Object.create(IntermediateCanvasRenderer && IntermediateCanvasRenderer.prototype);
  CanvasImageLayerRenderer.prototype.constructor = CanvasImageLayerRenderer;

  /**
   * @inheritDoc
   */
  CanvasImageLayerRenderer.prototype.disposeInternal = function disposeInternal() {
    if (this.vectorRenderer_) {
      this.vectorRenderer_.dispose();
    }
    IntermediateCanvasRenderer.prototype.disposeInternal.call(this);
  };

  /**
   * @inheritDoc
   */
  CanvasImageLayerRenderer.prototype.getImage = function getImage() {
    return !this.image_ ? null : this.image_.getImage();
  };

  /**
   * @inheritDoc
   */
  CanvasImageLayerRenderer.prototype.getImageTransform = function getImageTransform() {
    return this.imageTransform_;
  };

  /**
   * @inheritDoc
   */
  CanvasImageLayerRenderer.prototype.prepareFrame = function prepareFrame(frameState, layerState) {

    var pixelRatio = frameState.pixelRatio;
    var size = frameState.size;
    var viewState = frameState.viewState;
    var viewCenter = viewState.center;
    var viewResolution = viewState.resolution;

    var image;
    var imageLayer = /** @type {import("../../layer/Image.js").default} */this.getLayer();
    var imageSource = /** @type {import("../../source/Image.js").default} */imageLayer.getSource();

    var hints = frameState.viewHints;

    var vectorRenderer = this.vectorRenderer_;
    var renderedExtent = frameState.extent;
    if (!vectorRenderer && layerState.extent !== undefined) {
      renderedExtent = (0, _extent.getIntersection)(renderedExtent, layerState.extent);
    }

    if (!hints[_ViewHint2.default.ANIMATING] && !hints[_ViewHint2.default.INTERACTING] && !(0, _extent.isEmpty)(renderedExtent)) {
      var projection = viewState.projection;
      if (!_common.ENABLE_RASTER_REPROJECTION) {
        var sourceProjection = imageSource.getProjection();
        if (sourceProjection) {
          projection = sourceProjection;
        }
      }
      var skippedFeatures = this.skippedFeatures_;
      if (vectorRenderer) {
        var context = vectorRenderer.context;
        var imageFrameState = /** @type {import("../../PluggableMap.js").FrameState} */(0, _obj.assign)({}, frameState, {
          size: [(0, _extent.getWidth)(renderedExtent) / viewResolution, (0, _extent.getHeight)(renderedExtent) / viewResolution],
          viewState: /** @type {import("../../View.js").State} */(0, _obj.assign)({}, frameState.viewState, {
            rotation: 0
          })
        });
        var newSkippedFeatures = Object.keys(imageFrameState.skippedFeatureUids).sort();
        image = new _ImageCanvas2.default(renderedExtent, viewResolution, pixelRatio, context.canvas, function (callback) {
          if (vectorRenderer.prepareFrame(imageFrameState, layerState) && (vectorRenderer.replayGroupChanged || !(0, _array.equals)(skippedFeatures, newSkippedFeatures))) {
            context.canvas.width = imageFrameState.size[0] * pixelRatio;
            context.canvas.height = imageFrameState.size[1] * pixelRatio;
            vectorRenderer.compose(context, imageFrameState, layerState);
            skippedFeatures = newSkippedFeatures;
            callback();
          }
        });
      } else {
        image = imageSource.getImage(renderedExtent, viewResolution, pixelRatio, projection);
      }
      if (image && this.loadImage(image)) {
        this.image_ = image;
        this.skippedFeatures_ = skippedFeatures;
      }
    }

    if (this.image_) {
      image = this.image_;
      var imageExtent = image.getExtent();
      var imageResolution = image.getResolution();
      var imagePixelRatio = image.getPixelRatio();
      var scale = pixelRatio * imageResolution / (viewResolution * imagePixelRatio);
      var transform = (0, _transform.compose)(this.imageTransform_, pixelRatio * size[0] / 2, pixelRatio * size[1] / 2, scale, scale, 0, imagePixelRatio * (imageExtent[0] - viewCenter[0]) / imageResolution, imagePixelRatio * (viewCenter[1] - imageExtent[3]) / imageResolution);
      (0, _transform.compose)(this.coordinateToCanvasPixelTransform, pixelRatio * size[0] / 2 - transform[4], pixelRatio * size[1] / 2 - transform[5], pixelRatio / viewResolution, -pixelRatio / viewResolution, 0, -viewCenter[0], -viewCenter[1]);

      this.renderedResolution = imageResolution * pixelRatio / imagePixelRatio;
    }

    return !!this.image_;
  };

  /**
   * @inheritDoc
   */
  CanvasImageLayerRenderer.prototype.forEachFeatureAtCoordinate = function forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, callback) {
    if (this.vectorRenderer_) {
      return this.vectorRenderer_.forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, callback);
    } else {
      return IntermediateCanvasRenderer.prototype.forEachFeatureAtCoordinate.call(this, coordinate, frameState, hitTolerance, callback);
    }
  };

  return CanvasImageLayerRenderer;
}(_IntermediateCanvas2.default);

/**
 * Determine if this renderer handles the provided layer.
 * @param {import("../../layer/Layer.js").default} layer The candidate layer.
 * @return {boolean} The renderer can render the layer.
 */
/**
 * @module ol/renderer/canvas/ImageLayer
 */
CanvasImageLayerRenderer['handles'] = function (layer) {
  return layer.getType() === _LayerType2.default.IMAGE || layer.getType() === _LayerType2.default.VECTOR &&
  /** @type {import("../../layer/Vector.js").default} */layer.getRenderMode() === _VectorRenderType2.default.IMAGE;
};

/**
 * Create a layer renderer.
 * @param {import("../Map.js").default} mapRenderer The map renderer.
 * @param {import("../../layer/Layer.js").default} layer The layer to be rendererd.
 * @return {CanvasImageLayerRenderer} The layer renderer.
 */
CanvasImageLayerRenderer['create'] = function (mapRenderer, layer) {
  return new CanvasImageLayerRenderer( /** @type {import("../../layer/Image.js").default} */layer);
};

exports.default = CanvasImageLayerRenderer;

//# sourceMappingURL=ImageLayer.js.map