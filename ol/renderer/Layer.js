'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util.js');

var _ImageState = require('../ImageState.js');

var _ImageState2 = _interopRequireDefault(_ImageState);

var _Observable = require('../Observable.js');

var _Observable2 = _interopRequireDefault(_Observable);

var _TileState = require('../TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _State = require('../source/State.js');

var _State2 = _interopRequireDefault(_State);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LayerRenderer = /*@__PURE__*/function (Observable) {
  function LayerRenderer(layer) {

    Observable.call(this);

    /**
     * @private
     * @type {import("../layer/Layer.js").default}
     */
    this.layer_ = layer;
  }

  if (Observable) LayerRenderer.__proto__ = Observable;
  LayerRenderer.prototype = Object.create(Observable && Observable.prototype);
  LayerRenderer.prototype.constructor = LayerRenderer;

  /**
   * Create a function that adds loaded tiles to the tile lookup.
   * @param {import("../source/Tile.js").default} source Tile source.
   * @param {import("../proj/Projection.js").default} projection Projection of the tiles.
   * @param {Object<number, Object<string, import("../Tile.js").default>>} tiles Lookup of loaded tiles by zoom level.
   * @return {function(number, import("../TileRange.js").default):boolean} A function that can be
   *     called with a zoom level and a tile range to add loaded tiles to the lookup.
   * @protected
   */
  LayerRenderer.prototype.createLoadedTileFinder = function createLoadedTileFinder(source, projection, tiles) {
    return (
      /**
       * @param {number} zoom Zoom level.
       * @param {import("../TileRange.js").default} tileRange Tile range.
       * @return {boolean} The tile range is fully loaded.
       */
      function (zoom, tileRange) {
        /**
         * @param {import("../Tile.js").default} tile Tile.
         */
        function callback(tile) {
          if (!tiles[zoom]) {
            tiles[zoom] = {};
          }
          tiles[zoom][tile.tileCoord.toString()] = tile;
        }
        return source.forEachLoadedTile(projection, zoom, tileRange, callback);
      }
    );
  };

  /**
   * @abstract
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {function(import("../Feature.js").FeatureLike, import("../layer/Layer.js").default): T} callback Feature callback.
   * @return {T|void} Callback result.
   * @template T
   */
  LayerRenderer.prototype.forEachFeatureAtCoordinate = function forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, callback) {};

  /**
   * @return {import("../layer/Layer.js").default} Layer.
   */
  LayerRenderer.prototype.getLayer = function getLayer() {
    return this.layer_;
  };

  /**
   * Handle changes in image state.
   * @param {import("../events/Event.js").default} event Image change event.
   * @private
   */
  LayerRenderer.prototype.handleImageChange_ = function handleImageChange_(event) {
    var image = /** @type {import("../Image.js").default} */event.target;
    if (image.getState() === _ImageState2.default.LOADED) {
      this.renderIfReadyAndVisible();
    }
  };

  /**
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
   * @return {boolean} Is there a feature at the given coordinate?
   */
  LayerRenderer.prototype.hasFeatureAtCoordinate = function hasFeatureAtCoordinate(coordinate, frameState) {
    return false;
  };

  /**
   * Load the image if not already loaded, and register the image change
   * listener if needed.
   * @param {import("../ImageBase.js").default} image Image.
   * @return {boolean} `true` if the image is already loaded, `false` otherwise.
   * @protected
   */
  LayerRenderer.prototype.loadImage = function loadImage(image) {
    var imageState = image.getState();
    if (imageState != _ImageState2.default.LOADED && imageState != _ImageState2.default.ERROR) {
      (0, _events.listen)(image, _EventType2.default.CHANGE, this.handleImageChange_, this);
    }
    if (imageState == _ImageState2.default.IDLE) {
      image.load();
      imageState = image.getState();
    }
    return imageState == _ImageState2.default.LOADED;
  };

  /**
   * @protected
   */
  LayerRenderer.prototype.renderIfReadyAndVisible = function renderIfReadyAndVisible() {
    var layer = this.getLayer();
    if (layer.getVisible() && layer.getSourceState() == _State2.default.READY) {
      this.changed();
    }
  };

  /**
   * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
   * @param {import("../source/Tile.js").default} tileSource Tile source.
   * @protected
   */
  LayerRenderer.prototype.scheduleExpireCache = function scheduleExpireCache(frameState, tileSource) {
    if (tileSource.canExpireCache()) {
      /**
       * @param {import("../source/Tile.js").default} tileSource Tile source.
       * @param {import("../PluggableMap.js").default} map Map.
       * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
       */
      var postRenderFunction = function (tileSource, map, frameState) {
        var tileSourceKey = (0, _util.getUid)(tileSource);
        if (tileSourceKey in frameState.usedTiles) {
          tileSource.expireCache(frameState.viewState.projection, frameState.usedTiles[tileSourceKey]);
        }
      }.bind(null, tileSource);

      frameState.postRenderFunctions.push(
      /** @type {import("../PluggableMap.js").PostRenderFunction} */postRenderFunction);
    }
  };

  /**
   * @param {!Object<string, !Object<string, import("../TileRange.js").default>>} usedTiles Used tiles.
   * @param {import("../source/Tile.js").default} tileSource Tile source.
   * @param {number} z Z.
   * @param {import("../TileRange.js").default} tileRange Tile range.
   * @protected
   */
  LayerRenderer.prototype.updateUsedTiles = function updateUsedTiles(usedTiles, tileSource, z, tileRange) {
    // FIXME should we use tilesToDrawByZ instead?
    var tileSourceKey = (0, _util.getUid)(tileSource);
    var zKey = z.toString();
    if (tileSourceKey in usedTiles) {
      if (zKey in usedTiles[tileSourceKey]) {
        usedTiles[tileSourceKey][zKey].extend(tileRange);
      } else {
        usedTiles[tileSourceKey][zKey] = tileRange;
      }
    } else {
      usedTiles[tileSourceKey] = {};
      usedTiles[tileSourceKey][zKey] = tileRange;
    }
  };

  /**
   * Manage tile pyramid.
   * This function performs a number of functions related to the tiles at the
   * current zoom and lower zoom levels:
   * - registers idle tiles in frameState.wantedTiles so that they are not
   *   discarded by the tile queue
   * - enqueues missing tiles
   * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
   * @param {import("../source/Tile.js").default} tileSource Tile source.
   * @param {import("../tilegrid/TileGrid.js").default} tileGrid Tile grid.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} currentZ Current Z.
   * @param {number} preload Load low resolution tiles up to 'preload' levels.
   * @param {function(this: T, import("../Tile.js").default)=} opt_tileCallback Tile callback.
   * @param {T=} opt_this Object to use as `this` in `opt_tileCallback`.
   * @protected
   * @template T
   */
  LayerRenderer.prototype.manageTilePyramid = function manageTilePyramid(frameState, tileSource, tileGrid, pixelRatio, projection, extent, currentZ, preload, opt_tileCallback, opt_this) {
    var tileSourceKey = (0, _util.getUid)(tileSource);
    if (!(tileSourceKey in frameState.wantedTiles)) {
      frameState.wantedTiles[tileSourceKey] = {};
    }
    var wantedTiles = frameState.wantedTiles[tileSourceKey];
    var tileQueue = frameState.tileQueue;
    var minZoom = tileGrid.getMinZoom();
    var tile, tileRange, tileResolution, x, y, z;
    for (z = minZoom; z <= currentZ; ++z) {
      tileRange = tileGrid.getTileRangeForExtentAndZ(extent, z, tileRange);
      tileResolution = tileGrid.getResolution(z);
      for (x = tileRange.minX; x <= tileRange.maxX; ++x) {
        for (y = tileRange.minY; y <= tileRange.maxY; ++y) {
          if (currentZ - z <= preload) {
            tile = tileSource.getTile(z, x, y, pixelRatio, projection);
            if (tile.getState() == _TileState2.default.IDLE) {
              wantedTiles[tile.getKey()] = true;
              if (!tileQueue.isKeyQueued(tile.getKey())) {
                tileQueue.enqueue([tile, tileSourceKey, tileGrid.getTileCoordCenter(tile.tileCoord), tileResolution]);
              }
            }
            if (opt_tileCallback !== undefined) {
              opt_tileCallback.call(opt_this, tile);
            }
          } else {
            tileSource.useTile(z, x, y, projection);
          }
        }
      }
    }
  };

  return LayerRenderer;
}(_Observable2.default); /**
                          * @module ol/renderer/Layer
                          */
exports.default = LayerRenderer;

//# sourceMappingURL=Layer.js.map