'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../../util.js');

var _LayerType = require('../../LayerType.js');

var _LayerType2 = _interopRequireDefault(_LayerType);

var _ViewHint = require('../../ViewHint.js');

var _ViewHint2 = _interopRequireDefault(_ViewHint);

var _dom = require('../../dom.js');

var _events = require('../../events.js');

var _EventType = require('../../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _rbush = require('rbush');

var _rbush2 = _interopRequireDefault(_rbush);

var _extent = require('../../extent.js');

var _EventType3 = require('../../render/EventType.js');

var _EventType4 = _interopRequireDefault(_EventType3);

var _canvas = require('../../render/canvas.js');

var _ReplayGroup = require('../../render/canvas/ReplayGroup.js');

var _ReplayGroup2 = _interopRequireDefault(_ReplayGroup);

var _Layer = require('./Layer.js');

var _Layer2 = _interopRequireDefault(_Layer);

var _vector = require('../vector.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Canvas renderer for vector layers.
 * @api
 */
var CanvasVectorLayerRenderer = /*@__PURE__*/function (CanvasLayerRenderer) {
  function CanvasVectorLayerRenderer(vectorLayer) {

    CanvasLayerRenderer.call(this, vectorLayer);

    /**
     * Declutter tree.
     * @private
     */
    this.declutterTree_ = vectorLayer.getDeclutter() ? (0, _rbush2.default)(9, undefined) : null;

    /**
     * @private
     * @type {boolean}
     */
    this.dirty_ = false;

    /**
     * @private
     * @type {number}
     */
    this.renderedRevision_ = -1;

    /**
     * @private
     * @type {number}
     */
    this.renderedResolution_ = NaN;

    /**
     * @private
     * @type {import("../../extent.js").Extent}
     */
    this.renderedExtent_ = (0, _extent.createEmpty)();

    /**
     * @private
     * @type {function(import("../../Feature.js").default, import("../../Feature.js").default): number|null}
     */
    this.renderedRenderOrder_ = null;

    /**
     * @private
     * @type {import("../../render/canvas/ReplayGroup.js").default}
     */
    this.replayGroup_ = null;

    /**
     * A new replay group had to be created by `prepareFrame()`
     * @type {boolean}
     */
    this.replayGroupChanged = true;

    /**
     * @type {CanvasRenderingContext2D}
     */
    this.context = (0, _dom.createCanvasContext2D)();

    (0, _events.listen)(_canvas.labelCache, _EventType2.default.CLEAR, this.handleFontsChanged_, this);
  }

  if (CanvasLayerRenderer) CanvasVectorLayerRenderer.__proto__ = CanvasLayerRenderer;
  CanvasVectorLayerRenderer.prototype = Object.create(CanvasLayerRenderer && CanvasLayerRenderer.prototype);
  CanvasVectorLayerRenderer.prototype.constructor = CanvasVectorLayerRenderer;

  /**
   * @inheritDoc
   */
  CanvasVectorLayerRenderer.prototype.disposeInternal = function disposeInternal() {
    (0, _events.unlisten)(_canvas.labelCache, _EventType2.default.CLEAR, this.handleFontsChanged_, this);
    CanvasLayerRenderer.prototype.disposeInternal.call(this);
  };

  /**
   * @param {CanvasRenderingContext2D} context Context.
   * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
   * @param {import("../../layer/Layer.js").State} layerState Layer state.
   */
  CanvasVectorLayerRenderer.prototype.compose = function compose(context, frameState, layerState) {
    var extent = frameState.extent;
    var pixelRatio = frameState.pixelRatio;
    var skippedFeatureUids = layerState.managed ? frameState.skippedFeatureUids : {};
    var viewState = frameState.viewState;
    var projection = viewState.projection;
    var rotation = viewState.rotation;
    var projectionExtent = projection.getExtent();
    var vectorSource = /** @type {import("../../source/Vector.js").default} */this.getLayer().getSource();

    var transform = this.getTransform(frameState, 0);

    // clipped rendering if layer extent is set
    var clipExtent = layerState.extent;
    var clipped = clipExtent !== undefined;
    if (clipped) {
      this.clip(context, frameState, /** @type {import("../../extent.js").Extent} */clipExtent);
    }
    var replayGroup = this.replayGroup_;
    if (replayGroup && !replayGroup.isEmpty()) {
      if (this.declutterTree_) {
        this.declutterTree_.clear();
      }
      var layer = /** @type {import("../../layer/Vector.js").default} */this.getLayer();
      var drawOffsetX = 0;
      var drawOffsetY = 0;
      var replayContext;
      var transparentLayer = layerState.opacity !== 1;
      var hasRenderListeners = layer.hasListener(_EventType4.default.RENDER);
      if (transparentLayer || hasRenderListeners) {
        var drawWidth = context.canvas.width;
        var drawHeight = context.canvas.height;
        if (rotation) {
          var drawSize = Math.round(Math.sqrt(drawWidth * drawWidth + drawHeight * drawHeight));
          drawOffsetX = (drawSize - drawWidth) / 2;
          drawOffsetY = (drawSize - drawHeight) / 2;
          drawWidth = drawHeight = drawSize;
        }
        // resize and clear
        this.context.canvas.width = drawWidth;
        this.context.canvas.height = drawHeight;
        replayContext = this.context;
      } else {
        replayContext = context;
      }

      var alpha = replayContext.globalAlpha;
      if (!transparentLayer) {
        // for performance reasons, context.save / context.restore is not used
        // to save and restore the transformation matrix and the opacity.
        // see http://jsperf.com/context-save-restore-versus-variable
        replayContext.globalAlpha = layerState.opacity;
      }

      if (replayContext != context) {
        replayContext.translate(drawOffsetX, drawOffsetY);
      }

      var viewHints = frameState.viewHints;
      var snapToPixel = !(viewHints[_ViewHint2.default.ANIMATING] || viewHints[_ViewHint2.default.INTERACTING]);
      var width = frameState.size[0] * pixelRatio;
      var height = frameState.size[1] * pixelRatio;
      (0, _canvas.rotateAtOffset)(replayContext, -rotation, width / 2, height / 2);
      replayGroup.replay(replayContext, transform, rotation, skippedFeatureUids, snapToPixel);
      if (vectorSource.getWrapX() && projection.canWrapX() && !(0, _extent.containsExtent)(projectionExtent, extent)) {
        var startX = extent[0];
        var worldWidth = (0, _extent.getWidth)(projectionExtent);
        var world = 0;
        var offsetX;
        while (startX < projectionExtent[0]) {
          --world;
          offsetX = worldWidth * world;
          transform = this.getTransform(frameState, offsetX);
          replayGroup.replay(replayContext, transform, rotation, skippedFeatureUids, snapToPixel);
          startX += worldWidth;
        }
        world = 0;
        startX = extent[2];
        while (startX > projectionExtent[2]) {
          ++world;
          offsetX = worldWidth * world;
          transform = this.getTransform(frameState, offsetX);
          replayGroup.replay(replayContext, transform, rotation, skippedFeatureUids, snapToPixel);
          startX -= worldWidth;
        }
      }
      (0, _canvas.rotateAtOffset)(replayContext, rotation, width / 2, height / 2);

      if (hasRenderListeners) {
        this.dispatchRenderEvent(replayContext, frameState, transform);
      }
      if (replayContext != context) {
        if (transparentLayer) {
          var mainContextAlpha = context.globalAlpha;
          context.globalAlpha = layerState.opacity;
          context.drawImage(replayContext.canvas, -drawOffsetX, -drawOffsetY);
          context.globalAlpha = mainContextAlpha;
        } else {
          context.drawImage(replayContext.canvas, -drawOffsetX, -drawOffsetY);
        }
        replayContext.translate(-drawOffsetX, -drawOffsetY);
      }

      if (!transparentLayer) {
        replayContext.globalAlpha = alpha;
      }
    }

    if (clipped) {
      context.restore();
    }
  };

  /**
   * @inheritDoc
   */
  CanvasVectorLayerRenderer.prototype.composeFrame = function composeFrame(frameState, layerState, context) {
    var transform = this.getTransform(frameState, 0);
    this.preCompose(context, frameState, transform);
    this.compose(context, frameState, layerState);
    this.postCompose(context, frameState, layerState, transform);
  };

  /**
   * @inheritDoc
   */
  CanvasVectorLayerRenderer.prototype.forEachFeatureAtCoordinate = function forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, callback, thisArg) {
    if (!this.replayGroup_) {
      return undefined;
    } else {
      var resolution = frameState.viewState.resolution;
      var rotation = frameState.viewState.rotation;
      var layer = /** @type {import("../../layer/Vector.js").default} */this.getLayer();
      /** @type {!Object<string, boolean>} */
      var features = {};
      var result = this.replayGroup_.forEachFeatureAtCoordinate(coordinate, resolution, rotation, hitTolerance, {},
      /**
       * @param {import("../../Feature.js").FeatureLike} feature Feature.
       * @return {?} Callback result.
       */
      function (feature) {
        var key = (0, _util.getUid)(feature);
        if (!(key in features)) {
          features[key] = true;
          return callback.call(thisArg, feature, layer);
        }
      }, null);
      return result;
    }
  };

  /**
   * @param {import("../../events/Event.js").default} event Event.
   */
  CanvasVectorLayerRenderer.prototype.handleFontsChanged_ = function handleFontsChanged_(event) {
    var layer = this.getLayer();
    if (layer.getVisible() && this.replayGroup_) {
      layer.changed();
    }
  };

  /**
   * Handle changes in image style state.
   * @param {import("../../events/Event.js").default} event Image style change event.
   * @private
   */
  CanvasVectorLayerRenderer.prototype.handleStyleImageChange_ = function handleStyleImageChange_(event) {
    this.renderIfReadyAndVisible();
  };

  /**
   * @inheritDoc
   */
  CanvasVectorLayerRenderer.prototype.prepareFrame = function prepareFrame(frameState, layerState) {
    var vectorLayer = /** @type {import("../../layer/Vector.js").default} */this.getLayer();
    var vectorSource = /** @type {import("../../source/Vector.js").default} */vectorLayer.getSource();

    var animating = frameState.viewHints[_ViewHint2.default.ANIMATING];
    var interacting = frameState.viewHints[_ViewHint2.default.INTERACTING];
    var updateWhileAnimating = vectorLayer.getUpdateWhileAnimating();
    var updateWhileInteracting = vectorLayer.getUpdateWhileInteracting();

    if (!this.dirty_ && !updateWhileAnimating && animating || !updateWhileInteracting && interacting) {
      return true;
    }

    var frameStateExtent = frameState.extent;
    var viewState = frameState.viewState;
    var projection = viewState.projection;
    var resolution = viewState.resolution;
    var pixelRatio = frameState.pixelRatio;
    var vectorLayerRevision = vectorLayer.getRevision();
    var vectorLayerRenderBuffer = vectorLayer.getRenderBuffer();
    var vectorLayerRenderOrder = vectorLayer.getRenderOrder();

    if (vectorLayerRenderOrder === undefined) {
      vectorLayerRenderOrder = _vector.defaultOrder;
    }

    var extent = (0, _extent.buffer)(frameStateExtent, vectorLayerRenderBuffer * resolution);
    var projectionExtent = viewState.projection.getExtent();

    if (vectorSource.getWrapX() && viewState.projection.canWrapX() && !(0, _extent.containsExtent)(projectionExtent, frameState.extent)) {
      // For the replay group, we need an extent that intersects the real world
      // (-180° to +180°). To support geometries in a coordinate range from -540°
      // to +540°, we add at least 1 world width on each side of the projection
      // extent. If the viewport is wider than the world, we need to add half of
      // the viewport width to make sure we cover the whole viewport.
      var worldWidth = (0, _extent.getWidth)(projectionExtent);
      var gutter = Math.max((0, _extent.getWidth)(extent) / 2, worldWidth);
      extent[0] = projectionExtent[0] - gutter;
      extent[2] = projectionExtent[2] + gutter;
    }

    if (!this.dirty_ && this.renderedResolution_ == resolution && this.renderedRevision_ == vectorLayerRevision && this.renderedRenderOrder_ == vectorLayerRenderOrder && (0, _extent.containsExtent)(this.renderedExtent_, extent)) {
      this.replayGroupChanged = false;
      return true;
    }

    this.replayGroup_ = null;

    this.dirty_ = false;

    var replayGroup = new _ReplayGroup2.default((0, _vector.getTolerance)(resolution, pixelRatio), extent, resolution, pixelRatio, vectorSource.getOverlaps(), this.declutterTree_, vectorLayer.getRenderBuffer());
    vectorSource.loadFeatures(extent, resolution, projection);
    /**
     * @param {import("../../Feature.js").default} feature Feature.
     * @this {CanvasVectorLayerRenderer}
     */
    var render = function (feature) {
      var styles;
      var styleFunction = feature.getStyleFunction() || vectorLayer.getStyleFunction();
      if (styleFunction) {
        styles = styleFunction(feature, resolution);
      }
      if (styles) {
        var dirty = this.renderFeature(feature, resolution, pixelRatio, styles, replayGroup);
        this.dirty_ = this.dirty_ || dirty;
      }
    }.bind(this);
    if (vectorLayerRenderOrder) {
      /** @type {Array<import("../../Feature.js").default>} */
      var features = [];
      vectorSource.forEachFeatureInExtent(extent,
      /**
       * @param {import("../../Feature.js").default} feature Feature.
       */
      function (feature) {
        features.push(feature);
      });
      features.sort(vectorLayerRenderOrder);
      for (var i = 0, ii = features.length; i < ii; ++i) {
        render(features[i]);
      }
    } else {
      vectorSource.forEachFeatureInExtent(extent, render);
    }
    replayGroup.finish();

    this.renderedResolution_ = resolution;
    this.renderedRevision_ = vectorLayerRevision;
    this.renderedRenderOrder_ = vectorLayerRenderOrder;
    this.renderedExtent_ = extent;
    this.replayGroup_ = replayGroup;

    this.replayGroupChanged = true;
    return true;
  };

  /**
   * @param {import("../../Feature.js").default} feature Feature.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../../style/Style.js").default|Array<import("../../style/Style.js").default>} styles The style or array of styles.
   * @param {import("../../render/canvas/ReplayGroup.js").default} replayGroup Replay group.
   * @return {boolean} `true` if an image is loading.
   */
  CanvasVectorLayerRenderer.prototype.renderFeature = function renderFeature$1(feature, resolution, pixelRatio, styles, replayGroup) {
    if (!styles) {
      return false;
    }
    var loading = false;
    if (Array.isArray(styles)) {
      for (var i = 0, ii = styles.length; i < ii; ++i) {
        loading = (0, _vector.renderFeature)(replayGroup, feature, styles[i], (0, _vector.getSquaredTolerance)(resolution, pixelRatio), this.handleStyleImageChange_, this) || loading;
      }
    } else {
      loading = (0, _vector.renderFeature)(replayGroup, feature, styles, (0, _vector.getSquaredTolerance)(resolution, pixelRatio), this.handleStyleImageChange_, this);
    }
    return loading;
  };

  return CanvasVectorLayerRenderer;
}(_Layer2.default);

/**
 * Determine if this renderer handles the provided layer.
 * @param {import("../../layer/Layer.js").default} layer The candidate layer.
 * @return {boolean} The renderer can render the layer.
 */
/**
 * @module ol/renderer/canvas/VectorLayer
 */
CanvasVectorLayerRenderer['handles'] = function (layer) {
  return layer.getType() === _LayerType2.default.VECTOR;
};

/**
 * Create a layer renderer.
 * @param {import("../Map.js").default} mapRenderer The map renderer.
 * @param {import("../../layer/Layer.js").default} layer The layer to be rendererd.
 * @return {CanvasVectorLayerRenderer} The layer renderer.
 */
CanvasVectorLayerRenderer['create'] = function (mapRenderer, layer) {
  return new CanvasVectorLayerRenderer( /** @type {import("../../layer/Vector.js").default} */layer);
};

exports.default = CanvasVectorLayerRenderer;

//# sourceMappingURL=VectorLayer.js.map