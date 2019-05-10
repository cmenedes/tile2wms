'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PROJECTIONS = exports.WORLD_EXTENT = exports.EXTENT = exports.HALF_SIZE = exports.RADIUS = undefined;
exports.fromEPSG4326 = fromEPSG4326;
exports.toEPSG4326 = toEPSG4326;

var _math = require('../math.js');

var _Projection = require('./Projection.js');

var _Projection2 = _interopRequireDefault(_Projection);

var _Units = require('./Units.js');

var _Units2 = _interopRequireDefault(_Units);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Radius of WGS84 sphere
 *
 * @const
 * @type {number}
 */
var RADIUS = exports.RADIUS = 6378137;

/**
 * @const
 * @type {number}
 */
/**
 * @module ol/proj/epsg3857
 */
var HALF_SIZE = exports.HALF_SIZE = Math.PI * RADIUS;

/**
 * @const
 * @type {import("../extent.js").Extent}
 */
var EXTENT = exports.EXTENT = [-HALF_SIZE, -HALF_SIZE, HALF_SIZE, HALF_SIZE];

/**
 * @const
 * @type {import("../extent.js").Extent}
 */
var WORLD_EXTENT = exports.WORLD_EXTENT = [-180, -85, 180, 85];

/**
 * @classdesc
 * Projection object for web/spherical Mercator (EPSG:3857).
 */
var EPSG3857Projection = /*@__PURE__*/function (Projection) {
  function EPSG3857Projection(code) {
    Projection.call(this, {
      code: code,
      units: _Units2.default.METERS,
      extent: EXTENT,
      global: true,
      worldExtent: WORLD_EXTENT,
      getPointResolution: function getPointResolution(resolution, point) {
        return resolution / (0, _math.cosh)(point[1] / RADIUS);
      }
    });
  }

  if (Projection) EPSG3857Projection.__proto__ = Projection;
  EPSG3857Projection.prototype = Object.create(Projection && Projection.prototype);
  EPSG3857Projection.prototype.constructor = EPSG3857Projection;

  return EPSG3857Projection;
}(_Projection2.default);

/**
 * Projections equal to EPSG:3857.
 *
 * @const
 * @type {Array<import("./Projection.js").default>}
 */
var PROJECTIONS = exports.PROJECTIONS = [new EPSG3857Projection('EPSG:3857'), new EPSG3857Projection('EPSG:102100'), new EPSG3857Projection('EPSG:102113'), new EPSG3857Projection('EPSG:900913'), new EPSG3857Projection('urn:ogc:def:crs:EPSG:6.18:3:3857'), new EPSG3857Projection('urn:ogc:def:crs:EPSG::3857'), new EPSG3857Projection('http://www.opengis.net/gml/srs/epsg.xml#3857')];

/**
 * Transformation from EPSG:4326 to EPSG:3857.
 *
 * @param {Array<number>} input Input array of coordinate values.
 * @param {Array<number>=} opt_output Output array of coordinate values.
 * @param {number=} opt_dimension Dimension (default is `2`).
 * @return {Array<number>} Output array of coordinate values.
 */
function fromEPSG4326(input, opt_output, opt_dimension) {
  var length = input.length;
  var dimension = opt_dimension > 1 ? opt_dimension : 2;
  var output = opt_output;
  if (output === undefined) {
    if (dimension > 2) {
      // preserve values beyond second dimension
      output = input.slice();
    } else {
      output = new Array(length);
    }
  }
  var halfSize = HALF_SIZE;
  for (var i = 0; i < length; i += dimension) {
    output[i] = halfSize * input[i] / 180;
    var y = RADIUS * Math.log(Math.tan(Math.PI * (input[i + 1] + 90) / 360));
    if (y > halfSize) {
      y = halfSize;
    } else if (y < -halfSize) {
      y = -halfSize;
    }
    output[i + 1] = y;
  }
  return output;
}

/**
 * Transformation from EPSG:3857 to EPSG:4326.
 *
 * @param {Array<number>} input Input array of coordinate values.
 * @param {Array<number>=} opt_output Output array of coordinate values.
 * @param {number=} opt_dimension Dimension (default is `2`).
 * @return {Array<number>} Output array of coordinate values.
 */
function toEPSG4326(input, opt_output, opt_dimension) {
  var length = input.length;
  var dimension = opt_dimension > 1 ? opt_dimension : 2;
  var output = opt_output;
  if (output === undefined) {
    if (dimension > 2) {
      // preserve values beyond second dimension
      output = input.slice();
    } else {
      output = new Array(length);
    }
  }
  for (var i = 0; i < length; i += dimension) {
    output[i] = 180 * input[i] / HALF_SIZE;
    output[i + 1] = 360 * Math.atan(Math.exp(input[i + 1] / RADIUS)) / Math.PI - 90;
  }
  return output;
}

//# sourceMappingURL=epsg3857.js.map