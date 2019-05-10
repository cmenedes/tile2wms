'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultLoadFunction = defaultLoadFunction;

var _util = require('./util.js');

var _Tile = require('./Tile.js');

var _Tile2 = _interopRequireDefault(_Tile);

var _TileState = require('./TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _dom = require('./dom.js');

var _events = require('./events.js');

var _extent = require('./extent.js');

var _EventType = require('./events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _featureloader = require('./featureloader.js');

var _functions = require('./functions.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} ReplayState
 * @property {boolean} dirty
 * @property {null|import("./render.js").OrderFunction} renderedRenderOrder
 * @property {number} renderedTileRevision
 * @property {number} renderedRevision
 */

var VectorImageTile = /*@__PURE__*/function (Tile) {
  function VectorImageTile(tileCoord, state, sourceRevision, format, tileLoadFunction, urlTileCoord, tileUrlFunction, sourceTileGrid, tileGrid, sourceTiles, pixelRatio, projection, tileClass, handleTileChange, zoom) {

    Tile.call(this, tileCoord, state, { transition: 0 });

    /**
     * @private
     * @type {!Object<string, CanvasRenderingContext2D>}
     */
    this.context_ = {};

    /**
     * @private
     * @type {import("./featureloader.js").FeatureLoader}
     */
    this.loader_;

    /**
     * @private
     * @type {!Object<string, ReplayState>}
     */
    this.replayState_ = {};

    /**
     * @private
     * @type {Object<string, import("./VectorTile.js").default>}
     */
    this.sourceTiles_ = sourceTiles;

    /**
     * Keys of source tiles used by this tile. Use with {@link #getTile}.
     * @type {Array<string>}
     */
    this.tileKeys = [];

    /**
     * @type {import("./extent.js").Extent}
     */
    this.extent = null;

    /**
     * @type {number}
     */
    this.sourceRevision_ = sourceRevision;

    /**
     * @type {import("./tilecoord.js").TileCoord}
     */
    this.wrappedTileCoord = urlTileCoord;

    /**
     * @type {Array<import("./events.js").EventsKey>}
     */
    this.loadListenerKeys_ = [];

    /**
     * @type {Array<import("./events.js").EventsKey>}
     */
    this.sourceTileListenerKeys_ = [];

    if (urlTileCoord) {
      var extent = this.extent = tileGrid.getTileCoordExtent(urlTileCoord);
      var resolution = tileGrid.getResolution(zoom);
      var sourceZ = sourceTileGrid.getZForResolution(resolution);
      var useLoadedOnly = zoom != tileCoord[0];
      var loadCount = 0;
      sourceTileGrid.forEachTileCoord(extent, sourceZ, function (sourceTileCoord) {
        var sharedExtent = (0, _extent.getIntersection)(extent, sourceTileGrid.getTileCoordExtent(sourceTileCoord));
        var sourceExtent = sourceTileGrid.getExtent();
        if (sourceExtent) {
          sharedExtent = (0, _extent.getIntersection)(sharedExtent, sourceExtent, sharedExtent);
        }
        if ((0, _extent.getWidth)(sharedExtent) / resolution >= 0.5 && (0, _extent.getHeight)(sharedExtent) / resolution >= 0.5) {
          // only include source tile if overlap is at least 1 pixel
          ++loadCount;
          var sourceTileKey = sourceTileCoord.toString();
          var sourceTile = sourceTiles[sourceTileKey];
          if (!sourceTile && !useLoadedOnly) {
            var tileUrl = tileUrlFunction(sourceTileCoord, pixelRatio, projection);
            sourceTile = sourceTiles[sourceTileKey] = new tileClass(sourceTileCoord, tileUrl == undefined ? _TileState2.default.EMPTY : _TileState2.default.IDLE, tileUrl == undefined ? '' : tileUrl, format, tileLoadFunction);
            this.sourceTileListenerKeys_.push((0, _events.listen)(sourceTile, _EventType2.default.CHANGE, handleTileChange));
          }
          if (sourceTile && (!useLoadedOnly || sourceTile.getState() == _TileState2.default.LOADED)) {
            sourceTile.consumers++;
            this.tileKeys.push(sourceTileKey);
          }
        }
      }.bind(this));

      if (useLoadedOnly && loadCount == this.tileKeys.length) {
        this.finishLoading_();
      }

      if (zoom <= tileCoord[0] && this.state != _TileState2.default.LOADED) {
        while (zoom > tileGrid.getMinZoom()) {
          var tile = new VectorImageTile(tileCoord, state, sourceRevision, format, tileLoadFunction, urlTileCoord, tileUrlFunction, sourceTileGrid, tileGrid, sourceTiles, pixelRatio, projection, tileClass, _functions.VOID, --zoom);
          if (tile.state == _TileState2.default.LOADED) {
            this.interimTile = tile;
            break;
          }
        }
      }
    }
  }

  if (Tile) VectorImageTile.__proto__ = Tile;
  VectorImageTile.prototype = Object.create(Tile && Tile.prototype);
  VectorImageTile.prototype.constructor = VectorImageTile;

  /**
   * @inheritDoc
   */
  VectorImageTile.prototype.disposeInternal = function disposeInternal() {
    this.state = _TileState2.default.ABORT;
    this.changed();
    if (this.interimTile) {
      this.interimTile.dispose();
    }

    for (var i = 0, ii = this.tileKeys.length; i < ii; ++i) {
      var sourceTileKey = this.tileKeys[i];
      var sourceTile = this.getTile(sourceTileKey);
      sourceTile.consumers--;
      if (sourceTile.consumers == 0) {
        delete this.sourceTiles_[sourceTileKey];
        sourceTile.dispose();
      }
    }
    this.tileKeys.length = 0;
    this.sourceTiles_ = null;
    this.loadListenerKeys_.forEach(_events.unlistenByKey);
    this.loadListenerKeys_.length = 0;
    this.sourceTileListenerKeys_.forEach(_events.unlistenByKey);
    this.sourceTileListenerKeys_.length = 0;
    Tile.prototype.disposeInternal.call(this);
  };

  /**
   * @param {import("./layer/Layer.js").default} layer Layer.
   * @return {CanvasRenderingContext2D} The rendering context.
   */
  VectorImageTile.prototype.getContext = function getContext(layer) {
    var key = (0, _util.getUid)(layer);
    if (!(key in this.context_)) {
      this.context_[key] = (0, _dom.createCanvasContext2D)();
    }
    return this.context_[key];
  };

  /**
   * Get the Canvas for this tile.
   * @param {import("./layer/Layer.js").default} layer Layer.
   * @return {HTMLCanvasElement} Canvas.
   */
  VectorImageTile.prototype.getImage = function getImage(layer) {
    return this.getReplayState(layer).renderedTileRevision == -1 ? null : this.getContext(layer).canvas;
  };

  /**
   * @param {import("./layer/Layer.js").default} layer Layer.
   * @return {ReplayState} The replay state.
   */
  VectorImageTile.prototype.getReplayState = function getReplayState(layer) {
    var key = (0, _util.getUid)(layer);
    if (!(key in this.replayState_)) {
      this.replayState_[key] = {
        dirty: false,
        renderedRenderOrder: null,
        renderedRevision: -1,
        renderedTileRevision: -1
      };
    }
    return this.replayState_[key];
  };

  /**
   * @inheritDoc
   */
  VectorImageTile.prototype.getKey = function getKey() {
    return this.tileKeys.join('/') + '-' + this.sourceRevision_;
  };

  /**
   * @param {string} tileKey Key (tileCoord) of the source tile.
   * @return {import("./VectorTile.js").default} Source tile.
   */
  VectorImageTile.prototype.getTile = function getTile(tileKey) {
    return this.sourceTiles_[tileKey];
  };

  /**
   * @inheritDoc
   */
  VectorImageTile.prototype.load = function load() {
    // Source tiles with LOADED state - we just count them because once they are
    // loaded, we're no longer listening to state changes.
    var leftToLoad = 0;
    // Source tiles with ERROR state - we track them because they can still have
    // an ERROR state after another load attempt.
    var errorSourceTiles = {};

    if (this.state == _TileState2.default.IDLE) {
      this.setState(_TileState2.default.LOADING);
    }
    if (this.state == _TileState2.default.LOADING) {
      this.tileKeys.forEach(function (sourceTileKey) {
        var sourceTile = this.getTile(sourceTileKey);
        if (sourceTile.state == _TileState2.default.IDLE) {
          sourceTile.setLoader(this.loader_);
          sourceTile.load();
        }
        if (sourceTile.state == _TileState2.default.LOADING) {
          var key = (0, _events.listen)(sourceTile, _EventType2.default.CHANGE, function (e) {
            var state = sourceTile.getState();
            if (state == _TileState2.default.LOADED || state == _TileState2.default.ERROR) {
              var uid = (0, _util.getUid)(sourceTile);
              if (state == _TileState2.default.ERROR) {
                errorSourceTiles[uid] = true;
              } else {
                --leftToLoad;
                delete errorSourceTiles[uid];
              }
              if (leftToLoad - Object.keys(errorSourceTiles).length == 0) {
                this.finishLoading_();
              }
            }
          }.bind(this));
          this.loadListenerKeys_.push(key);
          ++leftToLoad;
        }
      }.bind(this));
    }
    if (leftToLoad - Object.keys(errorSourceTiles).length == 0) {
      setTimeout(this.finishLoading_.bind(this), 0);
    }
  };

  /**
   * @private
   */
  VectorImageTile.prototype.finishLoading_ = function finishLoading_() {
    var loaded = this.tileKeys.length;
    var empty = 0;
    for (var i = loaded - 1; i >= 0; --i) {
      var state = this.getTile(this.tileKeys[i]).getState();
      if (state != _TileState2.default.LOADED) {
        --loaded;
      }
      if (state == _TileState2.default.EMPTY) {
        ++empty;
      }
    }
    if (loaded == this.tileKeys.length) {
      this.loadListenerKeys_.forEach(_events.unlistenByKey);
      this.loadListenerKeys_.length = 0;
      this.setState(_TileState2.default.LOADED);
    } else {
      this.setState(empty == this.tileKeys.length ? _TileState2.default.EMPTY : _TileState2.default.ERROR);
    }
  };

  return VectorImageTile;
}(_Tile2.default); /**
                    * @module ol/VectorImageTile
                    */
exports.default = VectorImageTile;

/**
 * Sets the loader for a tile.
 * @param {import("./VectorTile.js").default} tile Vector tile.
 * @param {string} url URL.
 */

function defaultLoadFunction(tile, url) {
  var loader = (0, _featureloader.loadFeaturesXhr)(url, tile.getFormat(), tile.onLoad.bind(tile), tile.onError.bind(tile));
  tile.setLoader(loader);
}

//# sourceMappingURL=VectorImageTile.js.map