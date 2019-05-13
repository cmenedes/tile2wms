'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asColorLike = asColorLike;

var _color = require('./color.js');

/**
 * A type accepted by CanvasRenderingContext2D.fillStyle
 * or CanvasRenderingContext2D.strokeStyle.
 * Represents a color, pattern, or gradient. The origin for patterns and
 * gradients as fill style is an increment of 512 css pixels from map coordinate
 * `[0, 0]`. For seamless repeat patterns, width and height of the pattern image
 * must be a factor of two (2, 4, 8, ..., 512).
 *
 * @typedef {string|CanvasPattern|CanvasGradient} ColorLike
 * @api
 */

/**
 * @param {import("./color.js").Color|ColorLike} color Color.
 * @return {ColorLike} The color as an {@link ol/colorlike~ColorLike}.
 * @api
 */
function asColorLike(color) {
  if (Array.isArray(color)) {
    return (0, _color.toString)(color);
  } else {
    return color;
  }
}

//# sourceMappingURL=colorlike.js.map
/**
 * @module ol/colorlike
 */