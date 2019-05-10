'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disable = disable;
exports.none = none;
exports.createSnapToN = createSnapToN;
exports.createSnapToZero = createSnapToZero;

var _math = require('./math.js');

/**
 * @typedef {function((number|undefined), number): (number|undefined)} Type
 */

/**
 * @param {number|undefined} rotation Rotation.
 * @param {number} delta Delta.
 * @return {number|undefined} Rotation.
 */
function disable(rotation, delta) {
  if (rotation !== undefined) {
    return 0;
  } else {
    return undefined;
  }
}

/**
 * @param {number|undefined} rotation Rotation.
 * @param {number} delta Delta.
 * @return {number|undefined} Rotation.
 */
/**
 * @module ol/rotationconstraint
 */
function none(rotation, delta) {
  if (rotation !== undefined) {
    return rotation + delta;
  } else {
    return undefined;
  }
}

/**
 * @param {number} n N.
 * @return {Type} Rotation constraint.
 */
function createSnapToN(n) {
  var theta = 2 * Math.PI / n;
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {number} delta Delta.
     * @return {number|undefined} Rotation.
     */
    function (rotation, delta) {
      if (rotation !== undefined) {
        rotation = Math.floor((rotation + delta) / theta + 0.5) * theta;
        return rotation;
      } else {
        return undefined;
      }
    }
  );
}

/**
 * @param {number=} opt_tolerance Tolerance.
 * @return {Type} Rotation constraint.
 */
function createSnapToZero(opt_tolerance) {
  var tolerance = opt_tolerance || (0, _math.toRadians)(5);
  return (
    /**
     * @param {number|undefined} rotation Rotation.
     * @param {number} delta Delta.
     * @return {number|undefined} Rotation.
     */
    function (rotation, delta) {
      if (rotation !== undefined) {
        if (Math.abs(rotation + delta) <= tolerance) {
          return 0;
        } else {
          return rotation + delta;
        }
      } else {
        return undefined;
      }
    }
  );
}

//# sourceMappingURL=rotationconstraint.js.map