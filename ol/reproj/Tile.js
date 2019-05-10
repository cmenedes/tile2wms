'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = require('./common.js');

var _Tile = require('../Tile.js');

var _Tile2 = _interopRequireDefault(_Tile);

var _TileState = require('../TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('../extent.js');

var _math = require('../math.js');

var _reproj = require('../reproj.js');

var _Triangulation = require('./Triangulation.js');

var _Triangulation2 = _interopRequireDefault(_Triangulation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {function(number, number, number, number) : import("../Tile.js").default} FunctionType
 */

/**
 * @classdesc
 * Class encapsulating single reprojected tile.
 * See {@link module:ol/source/TileImage~TileImage}.
 *
 */
var ReprojTile = /*@__PURE__*/function (Tile) {
  function ReprojTile(sourceProj, sourceTileGrid, targetProj, targetTileGrid, tileCoord, wrappedTileCoord, pixelRatio, gutter, getTileFunction, opt_errorThreshold, opt_renderEdges) {
    Tile.call(this, tileCoord, _TileState2.default.IDLE);

    /**
     * @private
     * @type {boolean}
     */
    this.renderEdges_ = opt_renderEdges !== undefined ? opt_renderEdges : false;

    /**
     * @private
     * @type {number}
     */
    this.pixelRatio_ = pixelRatio;

    /**
     * @private
     * @type {number}
     */
    this.gutter_ = gutter;

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    this.canvas_ = null;

    /**
     * @private
     * @type {import("../tilegrid/TileGrid.js").default}
     */
    this.sourceTileGrid_ = sourceTileGrid;

    /**
     * @private
     * @type {import("../tilegrid/TileGrid.js").default}
     */
    this.targetTileGrid_ = targetTileGrid;

    /**
     * @private
     * @type {import("../tilecoord.js").TileCoord}
     */
    this.wrappedTileCoord_ = wrappedTileCoord ? wrappedTileCoord : tileCoord;

    /**
     * @private
     * @type {!Array<import("../Tile.js").default>}
     */
    this.sourceTiles_ = [];

    /**
     * @private
     * @type {Array<import("../events.js").EventsKey>}
     */
    this.sourcesListenerKeys_ = null;

    /**
     * @private
     * @type {number}
     */
    this.sourceZ_ = 0;

    var targetExtent = targetTileGrid.getTileCoordExtent(this.wrappedTileCoord_);
    var maxTargetExtent = this.targetTileGrid_.getExtent();
    var maxSourceExtent = this.sourceTileGrid_.getExtent();

    var limitedTargetExtent = maxTargetExtent ? (0, _extent.getIntersection)(targetExtent, maxTargetExtent) : targetExtent;

    if ((0, _extent.getArea)(limitedTargetExtent) === 0) {
      // Tile is completely outside range -> EMPTY
      // TODO: is it actually correct that the source even creates the tile ?
      this.state = _TileState2.default.EMPTY;
      return;
    }

    var sourceProjExtent = sourceProj.getExtent();
    if (sourceProjExtent) {
      if (!maxSourceExtent) {
        maxSourceExtent = sourceProjExtent;
      } else {
        maxSourceExtent = (0, _extent.getIntersection)(maxSourceExtent, sourceProjExtent);
      }
    }

    var targetResolution = targetTileGrid.getResolution(this.wrappedTileCoord_[0]);

    var targetCenter = (0, _extent.getCenter)(limitedTargetExtent);
    var sourceResolution = (0, _reproj.calculateSourceResolution)(sourceProj, targetProj, targetCenter, targetResolution);

    if (!isFinite(sourceResolution) || sourceResolution <= 0) {
      // invalid sourceResolution -> EMPTY
      // probably edges of the projections when no extent is defined
      this.state = _TileState2.default.EMPTY;
      return;
    }

    var errorThresholdInPixels = opt_errorThreshold !== undefined ? opt_errorThreshold : _common.ERROR_THRESHOLD;

    /**
     * @private
     * @type {!import("./Triangulation.js").default}
     */
    this.triangulation_ = new _Triangulation2.default(sourceProj, targetProj, limitedTargetExtent, maxSourceExtent, sourceResolution * errorThresholdInPixels);

    if (this.triangulation_.getTriangles().length === 0) {
      // no valid triangles -> EMPTY
      this.state = _TileState2.default.EMPTY;
      return;
    }

    this.sourceZ_ = sourceTileGrid.getZForResolution(sourceResolution);
    var sourceExtent = this.triangulation_.calculateSourceExtent();

    if (maxSourceExtent) {
      if (sourceProj.canWrapX()) {
        sourceExtent[1] = (0, _math.clamp)(sourceExtent[1], maxSourceExtent[1], maxSourceExtent[3]);
        sourceExtent[3] = (0, _math.clamp)(sourceExtent[3], maxSourceExtent[1], maxSourceExtent[3]);
      } else {
        sourceExtent = (0, _extent.getIntersection)(sourceExtent, maxSourceExtent);
      }
    }

    if (!(0, _extent.getArea)(sourceExtent)) {
      this.state = _TileState2.default.EMPTY;
    } else {
      var sourceRange = sourceTileGrid.getTileRangeForExtentAndZ(sourceExtent, this.sourceZ_);

      for (var srcX = sourceRange.minX; srcX <= sourceRange.maxX; srcX++) {
        for (var srcY = sourceRange.minY; srcY <= sourceRange.maxY; srcY++) {
          var tile = getTileFunction(this.sourceZ_, srcX, srcY, pixelRatio);
          if (tile) {
            this.sourceTiles_.push(tile);
          }
        }
      }

      if (this.sourceTiles_.length === 0) {
        this.state = _TileState2.default.EMPTY;
      }
    }
  }

  if (Tile) ReprojTile.__proto__ = Tile;
  ReprojTile.prototype = Object.create(Tile && Tile.prototype);
  ReprojTile.prototype.constructor = ReprojTile;

  /**
   * @inheritDoc
   */
  ReprojTile.prototype.disposeInternal = function disposeInternal() {
    if (this.state == _TileState2.default.LOADING) {
      this.unlistenSources_();
    }
    Tile.prototype.disposeInternal.call(this);
  };

  /**
   * Get the HTML Canvas element for this tile.
   * @return {HTMLCanvasElement} Canvas.
   */
  ReprojTile.prototype.getImage = function getImage() {
    return this.canvas_;
  };

  /**
   * @private
   */
  ReprojTile.prototype.reproject_ = function reproject_() {
    var sources = [];
    this.sourceTiles_.forEach(function (tile, i, arr) {
      if (tile && tile.getState() == _TileState2.default.LOADED) {
        sources.push({
          extent: this.sourceTileGrid_.getTileCoordExtent(tile.tileCoord),
          image: tile.getImage()
        });
      }
    }.bind(this));
    this.sourceTiles_.length = 0;

    if (sources.length === 0) {
      this.state = _TileState2.default.ERROR;
    } else {
      var z = this.wrappedTileCoord_[0];
      var size = this.targetTileGrid_.getTileSize(z);
      var width = typeof size === 'number' ? size : size[0];
      var height = typeof size === 'number' ? size : size[1];
      var targetResolution = this.targetTileGrid_.getResolution(z);
      var sourceResolution = this.sourceTileGrid_.getResolution(this.sourceZ_);

      var targetExtent = this.targetTileGrid_.getTileCoordExtent(this.wrappedTileCoord_);
      this.canvas_ = (0, _reproj.render)(width, height, this.pixelRatio_, sourceResolution, this.sourceTileGrid_.getExtent(), targetResolution, targetExtent, this.triangulation_, sources, this.gutter_, this.renderEdges_);

      this.state = _TileState2.default.LOADED;
    }
    this.changed();
  };

  /**
   * @inheritDoc
   */
  ReprojTile.prototype.load = function load() {
    if (this.state == _TileState2.default.IDLE) {
      this.state = _TileState2.default.LOADING;
      this.changed();

      var leftToLoad = 0;

      this.sourcesListenerKeys_ = [];
      this.sourceTiles_.forEach(function (tile, i, arr) {
        var state = tile.getState();
        if (state == _TileState2.default.IDLE || state == _TileState2.default.LOADING) {
          leftToLoad++;

          var sourceListenKey = (0, _events.listen)(tile, _EventType2.default.CHANGE, function (e) {
            var state = tile.getState();
            if (state == _TileState2.default.LOADED || state == _TileState2.default.ERROR || state == _TileState2.default.EMPTY) {
              (0, _events.unlistenByKey)(sourceListenKey);
              leftToLoad--;
              if (leftToLoad === 0) {
                this.unlistenSources_();
                this.reproject_();
              }
            }
          }, this);
          this.sourcesListenerKeys_.push(sourceListenKey);
        }
      }.bind(this));

      this.sourceTiles_.forEach(function (tile, i, arr) {
        var state = tile.getState();
        if (state == _TileState2.default.IDLE) {
          tile.load();
        }
      });

      if (leftToLoad === 0) {
        setTimeout(this.reproject_.bind(this), 0);
      }
    }
  };

  /**
   * @private
   */
  ReprojTile.prototype.unlistenSources_ = function unlistenSources_() {
    this.sourcesListenerKeys_.forEach(_events.unlistenByKey);
    this.sourcesListenerKeys_ = null;
  };

  return ReprojTile;
}(_Tile2.default); /**
                    * @module ol/reproj/Tile
                    */
exports.default = ReprojTile;

//# sourceMappingURL=Tile.js.map