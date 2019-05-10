'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../../util.js');

var _LayerType = require('../../LayerType.js');

var _LayerType2 = _interopRequireDefault(_LayerType);

var _TileRange = require('../../TileRange.js');

var _TileRange2 = _interopRequireDefault(_TileRange);

var _TileState = require('../../TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _ViewHint = require('../../ViewHint.js');

var _ViewHint2 = _interopRequireDefault(_ViewHint);

var _dom = require('../../dom.js');

var _extent = require('../../extent.js');

var _IntermediateCanvas = require('./IntermediateCanvas.js');

var _IntermediateCanvas2 = _interopRequireDefault(_IntermediateCanvas);

var _transform = require('../../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Canvas renderer for tile layers.
 * @api
 */
var CanvasTileLayerRenderer = /*@__PURE__*/function (IntermediateCanvasRenderer) {
  function CanvasTileLayerRenderer(tileLayer, opt_noContext) {

    IntermediateCanvasRenderer.call(this, tileLayer);

    /**
     * @protected
     * @type {CanvasRenderingContext2D}
     */
    this.context = opt_noContext ? null : (0, _dom.createCanvasContext2D)();

    /**
     * @private
     * @type {number}
     */
    this.oversampling_;

    /**
     * @private
     * @type {import("../../extent.js").Extent}
     */
    this.renderedExtent_ = null;

    /**
     * @protected
     * @type {number}
     */
    this.renderedRevision;

    /**
     * @protected
     * @type {!Array<import("../../Tile.js").default>}
     */
    this.renderedTiles = [];

    /**
     * @private
     * @type {boolean}
     */
    this.newTiles_ = false;

    /**
     * @protected
     * @type {import("../../extent.js").Extent}
     */
    this.tmpExtent = (0, _extent.createEmpty)();

    /**
     * @private
     * @type {import("../../TileRange.js").default}
     */
    this.tmpTileRange_ = new _TileRange2.default(0, 0, 0, 0);

    /**
     * @private
     * @type {import("../../transform.js").Transform}
     */
    this.imageTransform_ = (0, _transform.create)();

    /**
     * @protected
     * @type {number}
     */
    this.zDirection = 0;
  }

  if (IntermediateCanvasRenderer) CanvasTileLayerRenderer.__proto__ = IntermediateCanvasRenderer;
  CanvasTileLayerRenderer.prototype = Object.create(IntermediateCanvasRenderer && IntermediateCanvasRenderer.prototype);
  CanvasTileLayerRenderer.prototype.constructor = CanvasTileLayerRenderer;

  /**
   * @private
   * @param {import("../../Tile.js").default} tile Tile.
   * @return {boolean} Tile is drawable.
   */
  CanvasTileLayerRenderer.prototype.isDrawableTile_ = function isDrawableTile_(tile) {
    var tileLayer = /** @type {import("../../layer/Tile.js").default} */this.getLayer();
    var tileState = tile.getState();
    var useInterimTilesOnError = tileLayer.getUseInterimTilesOnError();
    return tileState == _TileState2.default.LOADED || tileState == _TileState2.default.EMPTY || tileState == _TileState2.default.ERROR && !useInterimTilesOnError;
  };

  /**
   * @param {number} z Tile coordinate z.
   * @param {number} x Tile coordinate x.
   * @param {number} y Tile coordinate y.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../../proj/Projection.js").default} projection Projection.
   * @return {!import("../../Tile.js").default} Tile.
   */
  CanvasTileLayerRenderer.prototype.getTile = function getTile(z, x, y, pixelRatio, projection) {
    var tileLayer = /** @type {import("../../layer/Tile.js").default} */this.getLayer();
    var tileSource = /** @type {import("../../source/Tile.js").default} */tileLayer.getSource();
    var tile = tileSource.getTile(z, x, y, pixelRatio, projection);
    if (tile.getState() == _TileState2.default.ERROR) {
      if (!tileLayer.getUseInterimTilesOnError()) {
        // When useInterimTilesOnError is false, we consider the error tile as loaded.
        tile.setState(_TileState2.default.LOADED);
      } else if (tileLayer.getPreload() > 0) {
        // Preloaded tiles for lower resolutions might have finished loading.
        this.newTiles_ = true;
      }
    }
    if (!this.isDrawableTile_(tile)) {
      tile = tile.getInterimTile();
    }
    return tile;
  };

  /**
   * @inheritDoc
   */
  CanvasTileLayerRenderer.prototype.prepareFrame = function prepareFrame(frameState, layerState) {

    var pixelRatio = frameState.pixelRatio;
    var size = frameState.size;
    var viewState = frameState.viewState;
    var projection = viewState.projection;
    var viewResolution = viewState.resolution;
    var viewCenter = viewState.center;

    var tileLayer = /** @type {import("../../layer/Tile.js").default} */this.getLayer();
    var tileSource = /** @type {import("../../source/Tile.js").default} */tileLayer.getSource();
    var sourceRevision = tileSource.getRevision();
    var tileGrid = tileSource.getTileGridForProjection(projection);
    var z = tileGrid.getZForResolution(viewResolution, this.zDirection);
    var tileResolution = tileGrid.getResolution(z);
    var oversampling = Math.round(viewResolution / tileResolution) || 1;
    var extent = frameState.extent;

    if (layerState.extent !== undefined) {
      extent = (0, _extent.getIntersection)(extent, layerState.extent);
    }
    if ((0, _extent.isEmpty)(extent)) {
      // Return false to prevent the rendering of the layer.
      return false;
    }

    var tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z);
    var imageExtent = tileGrid.getTileRangeExtent(z, tileRange);

    var tilePixelRatio = tileSource.getTilePixelRatio(pixelRatio);

    /**
     * @type {Object<number, Object<string, import("../../Tile.js").default>>}
     */
    var tilesToDrawByZ = {};
    tilesToDrawByZ[z] = {};

    var findLoadedTiles = this.createLoadedTileFinder(tileSource, projection, tilesToDrawByZ);

    var hints = frameState.viewHints;
    var animatingOrInteracting = hints[_ViewHint2.default.ANIMATING] || hints[_ViewHint2.default.INTERACTING];

    var tmpExtent = this.tmpExtent;
    var tmpTileRange = this.tmpTileRange_;
    this.newTiles_ = false;
    var tile, x, y;
    for (x = tileRange.minX; x <= tileRange.maxX; ++x) {
      for (y = tileRange.minY; y <= tileRange.maxY; ++y) {
        if (Date.now() - frameState.time > 16 && animatingOrInteracting) {
          continue;
        }
        tile = this.getTile(z, x, y, pixelRatio, projection);
        if (this.isDrawableTile_(tile)) {
          var uid = (0, _util.getUid)(this);
          if (tile.getState() == _TileState2.default.LOADED) {
            tilesToDrawByZ[z][tile.tileCoord.toString()] = tile;
            var inTransition = tile.inTransition(uid);
            if (!this.newTiles_ && (inTransition || this.renderedTiles.indexOf(tile) === -1)) {
              this.newTiles_ = true;
            }
          }
          if (tile.getAlpha(uid, frameState.time) === 1) {
            // don't look for alt tiles if alpha is 1
            continue;
          }
        }

        var childTileRange = tileGrid.getTileCoordChildTileRange(tile.tileCoord, tmpTileRange, tmpExtent);
        var covered = false;
        if (childTileRange) {
          covered = findLoadedTiles(z + 1, childTileRange);
        }
        if (!covered) {
          tileGrid.forEachTileCoordParentTileRange(tile.tileCoord, findLoadedTiles, null, tmpTileRange, tmpExtent);
        }
      }
    }

    var renderedResolution = tileResolution * pixelRatio / tilePixelRatio * oversampling;
    if (!(this.renderedResolution && Date.now() - frameState.time > 16 && animatingOrInteracting) && (this.newTiles_ || !(this.renderedExtent_ && (0, _extent.containsExtent)(this.renderedExtent_, extent)) || this.renderedRevision != sourceRevision || oversampling != this.oversampling_ || !animatingOrInteracting && renderedResolution != this.renderedResolution)) {

      var context = this.context;
      if (context) {
        var tilePixelSize = tileSource.getTilePixelSize(z, pixelRatio, projection);
        var width = Math.round(tileRange.getWidth() * tilePixelSize[0] / oversampling);
        var height = Math.round(tileRange.getHeight() * tilePixelSize[1] / oversampling);
        var canvas = context.canvas;
        if (canvas.width != width || canvas.height != height) {
          this.oversampling_ = oversampling;
          canvas.width = width;
          canvas.height = height;
        } else {
          if (this.renderedExtent_ && !(0, _extent.equals)(imageExtent, this.renderedExtent_)) {
            context.clearRect(0, 0, width, height);
          }
          oversampling = this.oversampling_;
        }
      }

      this.renderedTiles.length = 0;
      /** @type {Array<number>} */
      var zs = Object.keys(tilesToDrawByZ).map(Number);
      zs.sort(function (a, b) {
        if (a === z) {
          return 1;
        } else if (b === z) {
          return -1;
        } else {
          return a > b ? 1 : a < b ? -1 : 0;
        }
      });
      var currentResolution, currentScale, currentTilePixelSize, currentZ, i, ii;
      var tileExtent, tileGutter, tilesToDraw, w, h;
      for (i = 0, ii = zs.length; i < ii; ++i) {
        currentZ = zs[i];
        currentTilePixelSize = tileSource.getTilePixelSize(currentZ, pixelRatio, projection);
        currentResolution = tileGrid.getResolution(currentZ);
        currentScale = currentResolution / tileResolution;
        tileGutter = tilePixelRatio * tileSource.getGutterForProjection(projection);
        tilesToDraw = tilesToDrawByZ[currentZ];
        for (var tileCoordKey in tilesToDraw) {
          tile = tilesToDraw[tileCoordKey];
          tileExtent = tileGrid.getTileCoordExtent(tile.getTileCoord(), tmpExtent);
          x = (tileExtent[0] - imageExtent[0]) / tileResolution * tilePixelRatio / oversampling;
          y = (imageExtent[3] - tileExtent[3]) / tileResolution * tilePixelRatio / oversampling;
          w = currentTilePixelSize[0] * currentScale / oversampling;
          h = currentTilePixelSize[1] * currentScale / oversampling;
          this.drawTileImage(tile, frameState, layerState, x, y, w, h, tileGutter, z === currentZ);
          this.renderedTiles.push(tile);
        }
      }

      this.renderedRevision = sourceRevision;
      this.renderedResolution = tileResolution * pixelRatio / tilePixelRatio * oversampling;
      this.renderedExtent_ = imageExtent;
    }

    var scale = this.renderedResolution / viewResolution;
    var transform = (0, _transform.compose)(this.imageTransform_, pixelRatio * size[0] / 2, pixelRatio * size[1] / 2, scale, scale, 0, (this.renderedExtent_[0] - viewCenter[0]) / this.renderedResolution * pixelRatio, (viewCenter[1] - this.renderedExtent_[3]) / this.renderedResolution * pixelRatio);
    (0, _transform.compose)(this.coordinateToCanvasPixelTransform, pixelRatio * size[0] / 2 - transform[4], pixelRatio * size[1] / 2 - transform[5], pixelRatio / viewResolution, -pixelRatio / viewResolution, 0, -viewCenter[0], -viewCenter[1]);

    this.updateUsedTiles(frameState.usedTiles, tileSource, z, tileRange);
    this.manageTilePyramid(frameState, tileSource, tileGrid, pixelRatio, projection, extent, z, tileLayer.getPreload());
    this.scheduleExpireCache(frameState, tileSource);

    return this.renderedTiles.length > 0;
  };

  /**
   * @param {import("../../Tile.js").default} tile Tile.
   * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
   * @param {import("../../layer/Layer.js").State} layerState Layer state.
   * @param {number} x Left of the tile.
   * @param {number} y Top of the tile.
   * @param {number} w Width of the tile.
   * @param {number} h Height of the tile.
   * @param {number} gutter Tile gutter.
   * @param {boolean} transition Apply an alpha transition.
   */
  CanvasTileLayerRenderer.prototype.drawTileImage = function drawTileImage(tile, frameState, layerState, x, y, w, h, gutter, transition) {
    var image = this.getTileImage(tile);
    if (!image) {
      return;
    }
    var uid = (0, _util.getUid)(this);
    var alpha = transition ? tile.getAlpha(uid, frameState.time) : 1;
    var tileLayer = /** @type {import("../../layer/Tile.js").default} */this.getLayer();
    var tileSource = /** @type {import("../../source/Tile.js").default} */tileLayer.getSource();
    if (alpha === 1 && !tileSource.getOpaque(frameState.viewState.projection)) {
      this.context.clearRect(x, y, w, h);
    }
    var alphaChanged = alpha !== this.context.globalAlpha;
    if (alphaChanged) {
      this.context.save();
      this.context.globalAlpha = alpha;
    }
    this.context.drawImage(image, gutter, gutter, image.width - 2 * gutter, image.height - 2 * gutter, x, y, w, h);

    if (alphaChanged) {
      this.context.restore();
    }
    if (alpha !== 1) {
      frameState.animate = true;
    } else if (transition) {
      tile.endTransition(uid);
    }
  };

  /**
   * @inheritDoc
   */
  CanvasTileLayerRenderer.prototype.getImage = function getImage() {
    var context = this.context;
    return context ? context.canvas : null;
  };

  /**
   * @inheritDoc
   */
  CanvasTileLayerRenderer.prototype.getImageTransform = function getImageTransform() {
    return this.imageTransform_;
  };

  /**
   * Get the image from a tile.
   * @param {import("../../Tile.js").default} tile Tile.
   * @return {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} Image.
   * @protected
   */
  CanvasTileLayerRenderer.prototype.getTileImage = function getTileImage(tile) {
    return (/** @type {import("../../ImageTile.js").default} */tile.getImage()
    );
  };

  return CanvasTileLayerRenderer;
}(_IntermediateCanvas2.default);

/**
 * Determine if this renderer handles the provided layer.
 * @param {import("../../layer/Layer.js").default} layer The candidate layer.
 * @return {boolean} The renderer can render the layer.
 */
/**
 * @module ol/renderer/canvas/TileLayer
 */
CanvasTileLayerRenderer['handles'] = function (layer) {
  return layer.getType() === _LayerType2.default.TILE;
};

/**
 * Create a layer renderer.
 * @param {import("../Map.js").default} mapRenderer The map renderer.
 * @param {import("../../layer/Layer.js").default} layer The layer to be rendererd.
 * @return {CanvasTileLayerRenderer} The layer renderer.
 */
CanvasTileLayerRenderer['create'] = function (mapRenderer, layer) {
  return new CanvasTileLayerRenderer( /** @type {import("../../layer/Tile.js").default} */layer);
};

/**
 * @function
 * @return {import("../../layer/Tile.js").default|import("../../layer/VectorTile.js").default}
 */
CanvasTileLayerRenderer.prototype.getLayer;

exports.default = CanvasTileLayerRenderer;

//# sourceMappingURL=TileLayer.js.map