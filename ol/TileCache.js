'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LRUCache = require('./structs/LRUCache.js');

var _LRUCache2 = _interopRequireDefault(_LRUCache);

var _tilecoord = require('./tilecoord.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module ol/TileCache
 */
var TileCache = /*@__PURE__*/function (LRUCache) {
  function TileCache(opt_highWaterMark) {

    LRUCache.call(this, opt_highWaterMark);
  }

  if (LRUCache) TileCache.__proto__ = LRUCache;
  TileCache.prototype = Object.create(LRUCache && LRUCache.prototype);
  TileCache.prototype.constructor = TileCache;

  /**
   * @param {!Object<string, import("./TileRange.js").default>} usedTiles Used tiles.
   */
  TileCache.prototype.expireCache = function expireCache(usedTiles) {
    while (this.canExpireCache()) {
      var tile = this.peekLast();
      var zKey = tile.tileCoord[0].toString();
      if (zKey in usedTiles && usedTiles[zKey].contains(tile.tileCoord)) {
        break;
      } else {
        this.pop().dispose();
      }
    }
  };

  /**
   * Prune all tiles from the cache that don't have the same z as the newest tile.
   */
  TileCache.prototype.pruneExceptNewestZ = function pruneExceptNewestZ() {
    if (this.getCount() === 0) {
      return;
    }
    var key = this.peekFirstKey();
    var tileCoord = (0, _tilecoord.fromKey)(key);
    var z = tileCoord[0];
    this.forEach(function (tile) {
      if (tile.tileCoord[0] !== z) {
        this.remove((0, _tilecoord.getKey)(tile.tileCoord));
        tile.dispose();
      }
    }, this);
  };

  return TileCache;
}(_LRUCache2.default);

exports.default = TileCache;

//# sourceMappingURL=TileCache.js.map