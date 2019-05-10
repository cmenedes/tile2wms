'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = require('../../reproj/common.js');

var _LayerType = require('../../LayerType.js');

var _LayerType2 = _interopRequireDefault(_LayerType);

var _ViewHint = require('../../ViewHint.js');

var _ViewHint2 = _interopRequireDefault(_ViewHint);

var _dom = require('../../dom.js');

var _extent = require('../../extent.js');

var _Layer = require('./Layer.js');

var _Layer2 = _interopRequireDefault(_Layer);

var _transform = require('../../transform.js');

var _webgl = require('../../webgl.js');

var _Context = require('../../webgl/Context.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * WebGL renderer for image layers.
 * @api
 */
var WebGLImageLayerRenderer = /*@__PURE__*/function (WebGLLayerRenderer) {
  function WebGLImageLayerRenderer(mapRenderer, imageLayer) {

    WebGLLayerRenderer.call(this, mapRenderer, imageLayer);

    /**
     * The last rendered image.
     * @private
     * @type {?import("../../ImageBase.js").default}
     */
    this.image_ = null;

    /**
     * @private
     * @type {CanvasRenderingContext2D}
     */
    this.hitCanvasContext_ = null;

    /**
     * @private
     * @type {?import("../../transform.js").Transform}
     */
    this.hitTransformationMatrix_ = null;
  }

  if (WebGLLayerRenderer) WebGLImageLayerRenderer.__proto__ = WebGLLayerRenderer;
  WebGLImageLayerRenderer.prototype = Object.create(WebGLLayerRenderer && WebGLLayerRenderer.prototype);
  WebGLImageLayerRenderer.prototype.constructor = WebGLImageLayerRenderer;

  /**
   * @param {import("../../ImageBase.js").default} image Image.
   * @private
   * @return {WebGLTexture} Texture.
   */
  WebGLImageLayerRenderer.prototype.createTexture_ = function createTexture_(image) {

    // We meet the conditions to work with non-power of two textures.
    // http://www.khronos.org/webgl/wiki/WebGL_and_OpenGL_Differences#Non-Power_of_Two_Texture_Support
    // http://learningwebgl.com/blog/?p=2101

    var imageElement = image.getImage();
    var gl = this.mapRenderer.getGL();

    return (0, _Context.createTexture)(gl, imageElement, _webgl.CLAMP_TO_EDGE, _webgl.CLAMP_TO_EDGE);
  };

  /**
   * @inheritDoc
   */
  WebGLImageLayerRenderer.prototype.prepareFrame = function prepareFrame(frameState, layerState, context) {

    var gl = this.mapRenderer.getGL();

    var pixelRatio = frameState.pixelRatio;
    var viewState = frameState.viewState;
    var viewCenter = viewState.center;
    var viewResolution = viewState.resolution;
    var viewRotation = viewState.rotation;

    var image = this.image_;
    var texture = this.texture;
    var imageLayer = /** @type {import("../../layer/Image.js").default} */this.getLayer();
    var imageSource = /** @type {import("../../source/Image.js").default} */imageLayer.getSource();

    var hints = frameState.viewHints;

    var renderedExtent = frameState.extent;
    if (layerState.extent !== undefined) {
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
      var image_ = imageSource.getImage(renderedExtent, viewResolution, pixelRatio, projection);
      if (image_) {
        var loaded = this.loadImage(image_);
        if (loaded) {
          image = image_;
          texture = this.createTexture_(image_);
          if (this.texture) {
            /**
             * @param {WebGLRenderingContext} gl GL.
             * @param {WebGLTexture} texture Texture.
             */
            var postRenderFunction = function (gl, texture) {
              if (!gl.isContextLost()) {
                gl.deleteTexture(texture);
              }
            }.bind(null, gl, this.texture);
            frameState.postRenderFunctions.push(
            /** @type {import("../../PluggableMap.js").PostRenderFunction} */postRenderFunction);
          }
        }
      }
    }

    if (image) {
      var canvas = this.mapRenderer.getContext().getCanvas();

      this.updateProjectionMatrix_(canvas.width, canvas.height, pixelRatio, viewCenter, viewResolution, viewRotation, image.getExtent());
      this.hitTransformationMatrix_ = null;

      // Translate and scale to flip the Y coord.
      var texCoordMatrix = this.texCoordMatrix;
      (0, _transform.reset)(texCoordMatrix);
      (0, _transform.scale)(texCoordMatrix, 1, -1);
      (0, _transform.translate)(texCoordMatrix, 0, -1);

      this.image_ = image;
      this.texture = texture;
    }

    return !!image;
  };

  /**
   * @param {number} canvasWidth Canvas width.
   * @param {number} canvasHeight Canvas height.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../../coordinate.js").Coordinate} viewCenter View center.
   * @param {number} viewResolution View resolution.
   * @param {number} viewRotation View rotation.
   * @param {import("../../extent.js").Extent} imageExtent Image extent.
   * @private
   */
  WebGLImageLayerRenderer.prototype.updateProjectionMatrix_ = function updateProjectionMatrix_(canvasWidth, canvasHeight, pixelRatio, viewCenter, viewResolution, viewRotation, imageExtent) {

    var canvasExtentWidth = canvasWidth * viewResolution;
    var canvasExtentHeight = canvasHeight * viewResolution;

    var projectionMatrix = this.projectionMatrix;
    (0, _transform.reset)(projectionMatrix);
    (0, _transform.scale)(projectionMatrix, pixelRatio * 2 / canvasExtentWidth, pixelRatio * 2 / canvasExtentHeight);
    (0, _transform.rotate)(projectionMatrix, -viewRotation);
    (0, _transform.translate)(projectionMatrix, imageExtent[0] - viewCenter[0], imageExtent[1] - viewCenter[1]);
    (0, _transform.scale)(projectionMatrix, (imageExtent[2] - imageExtent[0]) / 2, (imageExtent[3] - imageExtent[1]) / 2);
    (0, _transform.translate)(projectionMatrix, 1, 1);
  };

  /**
   * @inheritDoc
   */
  WebGLImageLayerRenderer.prototype.forEachLayerAtPixel = function forEachLayerAtPixel(pixel, frameState, callback, thisArg) {
    if (!this.image_ || !this.image_.getImage()) {
      return undefined;
    }

    var imageSize = [this.image_.getImage().width, this.image_.getImage().height];

    if (!this.hitTransformationMatrix_) {
      this.hitTransformationMatrix_ = this.getHitTransformationMatrix_(frameState.size, imageSize);
    }

    var pixelOnFrameBuffer = (0, _transform.apply)(this.hitTransformationMatrix_, pixel.slice());

    if (pixelOnFrameBuffer[0] < 0 || pixelOnFrameBuffer[0] > imageSize[0] || pixelOnFrameBuffer[1] < 0 || pixelOnFrameBuffer[1] > imageSize[1]) {
      // outside the image, no need to check
      return undefined;
    }

    if (!this.hitCanvasContext_) {
      this.hitCanvasContext_ = (0, _dom.createCanvasContext2D)(1, 1);
    }

    this.hitCanvasContext_.clearRect(0, 0, 1, 1);
    this.hitCanvasContext_.drawImage(this.image_.getImage(), pixelOnFrameBuffer[0], pixelOnFrameBuffer[1], 1, 1, 0, 0, 1, 1);

    var imageData = this.hitCanvasContext_.getImageData(0, 0, 1, 1).data;
    if (imageData[3] > 0) {
      return callback.call(thisArg, this.getLayer(), imageData);
    } else {
      return undefined;
    }
  };

  /**
   * The transformation matrix to get the pixel on the image for a
   * pixel on the map.
   * @param {import("../../size.js").Size} mapSize The map size.
   * @param {import("../../size.js").Size} imageSize The image size.
   * @return {import("../../transform.js").Transform} The transformation matrix.
   * @private
   */
  WebGLImageLayerRenderer.prototype.getHitTransformationMatrix_ = function getHitTransformationMatrix_(mapSize, imageSize) {
    // the first matrix takes a map pixel, flips the y-axis and scales to
    // a range between -1 ... 1
    var mapCoordTransform = (0, _transform.create)();
    (0, _transform.translate)(mapCoordTransform, -1, -1);
    (0, _transform.scale)(mapCoordTransform, 2 / mapSize[0], 2 / mapSize[1]);
    (0, _transform.translate)(mapCoordTransform, 0, mapSize[1]);
    (0, _transform.scale)(mapCoordTransform, 1, -1);

    // the second matrix is the inverse of the projection matrix used in the
    // shader for drawing
    var projectionMatrixInv = (0, _transform.invert)(this.projectionMatrix.slice());

    // the third matrix scales to the image dimensions and flips the y-axis again
    var transform = (0, _transform.create)();
    (0, _transform.translate)(transform, 0, imageSize[1]);
    (0, _transform.scale)(transform, 1, -1);
    (0, _transform.scale)(transform, imageSize[0] / 2, imageSize[1] / 2);
    (0, _transform.translate)(transform, 1, 1);

    (0, _transform.multiply)(transform, projectionMatrixInv);
    (0, _transform.multiply)(transform, mapCoordTransform);

    return transform;
  };

  return WebGLImageLayerRenderer;
}(_Layer2.default);

/**
 * Determine if this renderer handles the provided layer.
 * @param {import("../../layer/Layer.js").default} layer The candidate layer.
 * @return {boolean} The renderer can render the layer.
 */
/**
 * @module ol/renderer/webgl/ImageLayer
 */
WebGLImageLayerRenderer['handles'] = function (layer) {
  return layer.getType() === _LayerType2.default.IMAGE;
};

/**
 * Create a layer renderer.
 * @param {import("../Map.js").default} mapRenderer The map renderer.
 * @param {import("../../layer/Layer.js").default} layer The layer to be rendererd.
 * @return {WebGLImageLayerRenderer} The layer renderer.
 */
WebGLImageLayerRenderer['create'] = function (mapRenderer, layer) {
  return new WebGLImageLayerRenderer(
  /** @type {import("./Map.js").default} */mapRenderer,
  /** @type {import("../../layer/Image.js").default} */layer);
};

exports.default = WebGLImageLayerRenderer;

//# sourceMappingURL=ImageLayer.js.map