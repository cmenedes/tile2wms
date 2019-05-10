'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExtent = createExtent;
exports.none = none;

var _math = require('./math.js');

/**
 * @typedef {function((import("./coordinate.js").Coordinate|undefined)): (import("./coordinate.js").Coordinate|undefined)} Type
 */

/**
 * @param {import("./extent.js").Extent} extent Extent.
 * @return {Type} The constraint.
 */
function createExtent(extent) {
  return (
    /**
     * @param {import("./coordinate.js").Coordinate=} center Center.
     * @return {import("./coordinate.js").Coordinate|undefined} Center.
     */
    function (center) {
      if (center) {
        return [(0, _math.clamp)(center[0], extent[0], extent[2]), (0, _math.clamp)(center[1], extent[1], extent[3])];
      } else {
        return undefined;
      }
    }
  );
}

/**
 * @param {import("./coordinate.js").Coordinate=} center Center.
 * @return {import("./coordinate.js").Coordinate|undefined} Center.
 */
/**
 * @module ol/centerconstraint
 */
function none(center) {
  return center;
}

//# sourceMappingURL=centerconstraint.js.map