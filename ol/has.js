'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _webgl = require('./webgl.js');

Object.defineProperty(exports, 'WEBGL', {
  enumerable: true,
  get: function get() {
    return _webgl.HAS;
  }
});
/**
 * @module ol/has
 */

var ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';

/**
 * User agent string says we are dealing with Firefox as browser.
 * @type {boolean}
 */
var FIREFOX = exports.FIREFOX = ua.indexOf('firefox') !== -1;

/**
 * User agent string says we are dealing with Safari as browser.
 * @type {boolean}
 */
var SAFARI = exports.SAFARI = ua.indexOf('safari') !== -1 && ua.indexOf('chrom') == -1;

/**
 * User agent string says we are dealing with a WebKit engine.
 * @type {boolean}
 */
var WEBKIT = exports.WEBKIT = ua.indexOf('webkit') !== -1 && ua.indexOf('edge') == -1;

/**
 * User agent string says we are dealing with a Mac as platform.
 * @type {boolean}
 */
var MAC = exports.MAC = ua.indexOf('macintosh') !== -1;

/**
 * The ratio between physical pixels and device-independent pixels
 * (dips) on the device (`window.devicePixelRatio`).
 * @const
 * @type {number}
 * @api
 */
var DEVICE_PIXEL_RATIO = exports.DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1;

/**
 * True if the browser's Canvas implementation implements {get,set}LineDash.
 * @type {boolean}
 */
var CANVAS_LINE_DASH = exports.CANVAS_LINE_DASH = function () {
  var has = false;
  try {
    has = !!document.createElement('canvas').getContext('2d').setLineDash;
  } catch (e) {
    // pass
  }
  return has;
}();

/**
 * Is HTML5 geolocation supported in the current browser?
 * @const
 * @type {boolean}
 * @api
 */
var GEOLOCATION = exports.GEOLOCATION = 'geolocation' in navigator;

/**
 * True if browser supports touch events.
 * @const
 * @type {boolean}
 * @api
 */
var TOUCH = exports.TOUCH = 'ontouchstart' in window;

/**
 * True if browser supports pointer events.
 * @const
 * @type {boolean}
 */
var POINTER = exports.POINTER = 'PointerEvent' in window;

/**
 * True if browser supports ms pointer events (IE 10).
 * @const
 * @type {boolean}
 */
var MSPOINTER = exports.MSPOINTER = !!navigator.msPointerEnabled;