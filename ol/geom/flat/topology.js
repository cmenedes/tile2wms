'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lineStringIsClosed = lineStringIsClosed;

var _area = require('./area.js');

/**
 * Check if the linestring is a boundary.
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {number} end End.
 * @param {number} stride Stride.
 * @return {boolean} The linestring is a boundary.
 */
function lineStringIsClosed(flatCoordinates, offset, end, stride) {
  var lastCoord = end - stride;
  if (flatCoordinates[offset] === flatCoordinates[lastCoord] && flatCoordinates[offset + 1] === flatCoordinates[lastCoord + 1] && (end - offset) / stride > 3) {
    return !!(0, _area.linearRing)(flatCoordinates, offset, end, stride);
  }
  return false;
}

//# sourceMappingURL=topology.js.map
/**
 * @module ol/geom/flat/topology
 */