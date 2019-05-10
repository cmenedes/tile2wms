'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linearRingss = linearRingss;

var _extent = require('../../extent.js');

/**
 * @param {Array<number>} flatCoordinates Flat coordinates.
 * @param {number} offset Offset.
 * @param {Array<Array<number>>} endss Endss.
 * @param {number} stride Stride.
 * @return {Array<number>} Flat centers.
 */
function linearRingss(flatCoordinates, offset, endss, stride) {
  var flatCenters = [];
  var extent = (0, _extent.createEmpty)();
  for (var i = 0, ii = endss.length; i < ii; ++i) {
    var ends = endss[i];
    extent = (0, _extent.createOrUpdateFromFlatCoordinates)(flatCoordinates, offset, ends[0], stride);
    flatCenters.push((extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2);
    offset = ends[ends.length - 1];
  }
  return flatCenters;
}

//# sourceMappingURL=center.js.map
/**
 * @module ol/geom/flat/center
 */