'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PROJECTIONS = exports.METERS_PER_UNIT = exports.EXTENT = exports.RADIUS = undefined;

var _Projection = require('./Projection.js');

var _Projection2 = _interopRequireDefault(_Projection);

var _Units = require('./Units.js');

var _Units2 = _interopRequireDefault(_Units);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Semi-major radius of the WGS84 ellipsoid.
 *
 * @const
 * @type {number}
 */
/**
 * @module ol/proj/epsg4326
 */
var RADIUS = exports.RADIUS = 6378137;

/**
 * Extent of the EPSG:4326 projection which is the whole world.
 *
 * @const
 * @type {import("../extent.js").Extent}
 */
var EXTENT = exports.EXTENT = [-180, -90, 180, 90];

/**
 * @const
 * @type {number}
 */
var METERS_PER_UNIT = exports.METERS_PER_UNIT = Math.PI * RADIUS / 180;

/**
 * @classdesc
 * Projection object for WGS84 geographic coordinates (EPSG:4326).
 *
 * Note that OpenLayers does not strictly comply with the EPSG definition.
 * The EPSG registry defines 4326 as a CRS for Latitude,Longitude (y,x).
 * OpenLayers treats EPSG:4326 as a pseudo-projection, with x,y coordinates.
 */
var EPSG4326Projection = /*@__PURE__*/function (Projection) {
  function EPSG4326Projection(code, opt_axisOrientation) {
    Projection.call(this, {
      code: code,
      units: _Units2.default.DEGREES,
      extent: EXTENT,
      axisOrientation: opt_axisOrientation,
      global: true,
      metersPerUnit: METERS_PER_UNIT,
      worldExtent: EXTENT
    });
  }

  if (Projection) EPSG4326Projection.__proto__ = Projection;
  EPSG4326Projection.prototype = Object.create(Projection && Projection.prototype);
  EPSG4326Projection.prototype.constructor = EPSG4326Projection;

  return EPSG4326Projection;
}(_Projection2.default);

/**
 * Projections equal to EPSG:4326.
 *
 * @const
 * @type {Array<import("./Projection.js").default>}
 */
var PROJECTIONS = exports.PROJECTIONS = [new EPSG4326Projection('CRS:84'), new EPSG4326Projection('EPSG:4326', 'neu'), new EPSG4326Projection('urn:ogc:def:crs:EPSG::4326', 'neu'), new EPSG4326Projection('urn:ogc:def:crs:EPSG:6.6:4326', 'neu'), new EPSG4326Projection('urn:ogc:def:crs:OGC:1.3:CRS84'), new EPSG4326Projection('urn:ogc:def:crs:OGC:2:84'), new EPSG4326Projection('http://www.opengis.net/gml/srs/epsg.xml#4326', 'neu'), new EPSG4326Projection('urn:x-ogc:def:crs:EPSG:4326', 'neu')];

//# sourceMappingURL=epsg4326.js.map