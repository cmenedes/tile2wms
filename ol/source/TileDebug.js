'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Tile = require('../Tile.js');

var _Tile2 = _interopRequireDefault(_Tile);

var _TileState = require('../TileState.js');

var _TileState2 = _interopRequireDefault(_TileState);

var _dom = require('../dom.js');

var _size = require('../size.js');

var _Tile3 = require('./Tile.js');

var _Tile4 = _interopRequireDefault(_Tile3);

var _tilecoord = require('../tilecoord.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module ol/source/TileDebug
 */

var LabeledTile = /*@__PURE__*/function (Tile) {
  function LabeledTile(tileCoord, tileSize, text) {

    Tile.call(this, tileCoord, _TileState2.default.LOADED);

    /**
    * @private
    * @type {import("../size.js").Size}
    */
    this.tileSize_ = tileSize;

    /**
    * @private
    * @type {string}
    */
    this.text_ = text;

    /**
    * @private
    * @type {HTMLCanvasElement}
    */
    this.canvas_ = null;
  }

  if (Tile) LabeledTile.__proto__ = Tile;
  LabeledTile.prototype = Object.create(Tile && Tile.prototype);
  LabeledTile.prototype.constructor = LabeledTile;

  /**
  * Get the image element for this tile.
  * @return {HTMLCanvasElement} Image.
  */
  LabeledTile.prototype.getImage = function getImage() {
    if (this.canvas_) {
      return this.canvas_;
    } else {
      var tileSize = this.tileSize_;
      var context = (0, _dom.createCanvasContext2D)(tileSize[0], tileSize[1]);

      context.strokeStyle = 'black';
      context.strokeRect(0.5, 0.5, tileSize[0] + 0.5, tileSize[1] + 0.5);

      context.fillStyle = 'black';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.font = '24px sans-serif';
      context.fillText(this.text_, tileSize[0] / 2, tileSize[1] / 2);

      this.canvas_ = context.canvas;
      return context.canvas;
    }
  };

  /**
  * @override
  */
  LabeledTile.prototype.load = function load() {};

  return LabeledTile;
}(_Tile2.default);

/**
 * @typedef {Object} Options
 * @property {import("../proj.js").ProjectionLike} projection Projection.
 * @property {import("../tilegrid/TileGrid.js").default} [tileGrid] Tile grid.
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 */

/**
 * @classdesc
 * A pseudo tile source, which does not fetch tiles from a server, but renders
 * a grid outline for the tile grid/projection along with the coordinates for
 * each tile. See examples/canvas-tiles for an example.
 *
 * Uses Canvas context2d, so requires Canvas support.
 * @api
 */
var TileDebug = /*@__PURE__*/function (TileSource) {
  function TileDebug(options) {

    TileSource.call(this, {
      opaque: false,
      projection: options.projection,
      tileGrid: options.tileGrid,
      wrapX: options.wrapX !== undefined ? options.wrapX : true
    });
  }

  if (TileSource) TileDebug.__proto__ = TileSource;
  TileDebug.prototype = Object.create(TileSource && TileSource.prototype);
  TileDebug.prototype.constructor = TileDebug;

  /**
  * @inheritDoc
  */
  TileDebug.prototype.getTile = function getTile(z, x, y) {
    var tileCoordKey = (0, _tilecoord.getKeyZXY)(z, x, y);
    if (this.tileCache.containsKey(tileCoordKey)) {
      return (/** @type {!LabeledTile} */this.tileCache.get(tileCoordKey)
      );
    } else {
      var tileSize = (0, _size.toSize)(this.tileGrid.getTileSize(z));
      var tileCoord = [z, x, y];
      var textTileCoord = this.getTileCoordForTileUrlFunction(tileCoord);
      var text = !textTileCoord ? '' : this.getTileCoordForTileUrlFunction(textTileCoord).toString();
      var tile = new LabeledTile(tileCoord, tileSize, text);
      this.tileCache.set(tileCoordKey, tile);
      return tile;
    }
  };

  return TileDebug;
}(_Tile4.default);

exports.default = TileDebug;

//# sourceMappingURL=TileDebug.js.map