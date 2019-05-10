'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _array = require('../array.js');

var _extent = require('../extent.js');

var _GeometryLayout = require('./GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _GeometryType = require('./GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _SimpleGeometry = require('./SimpleGeometry.js');

var _SimpleGeometry2 = _interopRequireDefault(_SimpleGeometry);

var _closest = require('./flat/closest.js');

var _deflate = require('./flat/deflate.js');

var _inflate = require('./flat/inflate.js');

var _interpolate = require('./flat/interpolate.js');

var _intersectsextent = require('./flat/intersectsextent.js');

var _length = require('./flat/length.js');

var _segments = require('./flat/segments.js');

var _simplify = require('./flat/simplify.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Linestring geometry.
 *
 * @api
 */
var LineString = /*@__PURE__*/function (SimpleGeometry) {
  function LineString(coordinates, opt_layout) {

    SimpleGeometry.call(this);

    /**
     * @private
     * @type {import("../coordinate.js").Coordinate}
     */
    this.flatMidpoint_ = null;

    /**
     * @private
     * @type {number}
     */
    this.flatMidpointRevision_ = -1;

    /**
     * @private
     * @type {number}
     */
    this.maxDelta_ = -1;

    /**
     * @private
     * @type {number}
     */
    this.maxDeltaRevision_ = -1;

    if (opt_layout !== undefined && !Array.isArray(coordinates[0])) {
      this.setFlatCoordinates(opt_layout, /** @type {Array<number>} */coordinates);
    } else {
      this.setCoordinates( /** @type {Array<import("../coordinate.js").Coordinate>} */coordinates, opt_layout);
    }
  }

  if (SimpleGeometry) LineString.__proto__ = SimpleGeometry;
  LineString.prototype = Object.create(SimpleGeometry && SimpleGeometry.prototype);
  LineString.prototype.constructor = LineString;

  /**
   * Append the passed coordinate to the coordinates of the linestring.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @api
   */
  LineString.prototype.appendCoordinate = function appendCoordinate(coordinate) {
    if (!this.flatCoordinates) {
      this.flatCoordinates = coordinate.slice();
    } else {
      (0, _array.extend)(this.flatCoordinates, coordinate);
    }
    this.changed();
  };

  /**
   * Make a complete copy of the geometry.
   * @return {!LineString} Clone.
   * @override
   * @api
   */
  LineString.prototype.clone = function clone() {
    return new LineString(this.flatCoordinates.slice(), this.layout);
  };

  /**
   * @inheritDoc
   */
  LineString.prototype.closestPointXY = function closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < (0, _extent.closestSquaredDistanceXY)(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    if (this.maxDeltaRevision_ != this.getRevision()) {
      this.maxDelta_ = Math.sqrt((0, _closest.maxSquaredDelta)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0));
      this.maxDeltaRevision_ = this.getRevision();
    }
    return (0, _closest.assignClosestPoint)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, this.maxDelta_, false, x, y, closestPoint, minSquaredDistance);
  };

  /**
   * Iterate over each segment, calling the provided callback.
   * If the callback returns a truthy value the function returns that
   * value immediately. Otherwise the function returns `false`.
   *
   * @param {function(this: S, import("../coordinate.js").Coordinate, import("../coordinate.js").Coordinate): T} callback Function
   *     called for each segment.
   * @return {T|boolean} Value.
   * @template T,S
   * @api
   */
  LineString.prototype.forEachSegment = function forEachSegment$1(callback) {
    return (0, _segments.forEach)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, callback);
  };

  /**
   * Returns the coordinate at `m` using linear interpolation, or `null` if no
   * such coordinate exists.
   *
   * `opt_extrapolate` controls extrapolation beyond the range of Ms in the
   * MultiLineString. If `opt_extrapolate` is `true` then Ms less than the first
   * M will return the first coordinate and Ms greater than the last M will
   * return the last coordinate.
   *
   * @param {number} m M.
   * @param {boolean=} opt_extrapolate Extrapolate. Default is `false`.
   * @return {import("../coordinate.js").Coordinate} Coordinate.
   * @api
   */
  LineString.prototype.getCoordinateAtM = function getCoordinateAtM(m, opt_extrapolate) {
    if (this.layout != _GeometryLayout2.default.XYM && this.layout != _GeometryLayout2.default.XYZM) {
      return null;
    }
    var extrapolate = opt_extrapolate !== undefined ? opt_extrapolate : false;
    return (0, _interpolate.lineStringCoordinateAtM)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, m, extrapolate);
  };

  /**
   * Return the coordinates of the linestring.
   * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
   * @override
   * @api
   */
  LineString.prototype.getCoordinates = function getCoordinates() {
    return (0, _inflate.inflateCoordinates)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
  };

  /**
   * Return the coordinate at the provided fraction along the linestring.
   * The `fraction` is a number between 0 and 1, where 0 is the start of the
   * linestring and 1 is the end.
   * @param {number} fraction Fraction.
   * @param {import("../coordinate.js").Coordinate=} opt_dest Optional coordinate whose values will
   *     be modified. If not provided, a new coordinate will be returned.
   * @return {import("../coordinate.js").Coordinate} Coordinate of the interpolated point.
   * @api
   */
  LineString.prototype.getCoordinateAt = function getCoordinateAt(fraction, opt_dest) {
    return (0, _interpolate.interpolatePoint)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, fraction, opt_dest);
  };

  /**
   * Return the length of the linestring on projected plane.
   * @return {number} Length (on projected plane).
   * @api
   */
  LineString.prototype.getLength = function getLength() {
    return (0, _length.lineStringLength)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
  };

  /**
   * @return {Array<number>} Flat midpoint.
   */
  LineString.prototype.getFlatMidpoint = function getFlatMidpoint() {
    if (this.flatMidpointRevision_ != this.getRevision()) {
      this.flatMidpoint_ = this.getCoordinateAt(0.5, this.flatMidpoint_);
      this.flatMidpointRevision_ = this.getRevision();
    }
    return this.flatMidpoint_;
  };

  /**
   * @inheritDoc
   */
  LineString.prototype.getSimplifiedGeometryInternal = function getSimplifiedGeometryInternal(squaredTolerance) {
    var simplifiedFlatCoordinates = [];
    simplifiedFlatCoordinates.length = (0, _simplify.douglasPeucker)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, squaredTolerance, simplifiedFlatCoordinates, 0);
    return new LineString(simplifiedFlatCoordinates, _GeometryLayout2.default.XY);
  };

  /**
   * @inheritDoc
   * @api
   */
  LineString.prototype.getType = function getType() {
    return _GeometryType2.default.LINE_STRING;
  };

  /**
   * @inheritDoc
   * @api
   */
  LineString.prototype.intersectsExtent = function intersectsExtent(extent) {
    return (0, _intersectsextent.intersectsLineString)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, extent);
  };

  /**
   * Set the coordinates of the linestring.
   * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
   * @param {GeometryLayout=} opt_layout Layout.
   * @override
   * @api
   */
  LineString.prototype.setCoordinates = function setCoordinates(coordinates, opt_layout) {
    this.setLayout(opt_layout, coordinates, 1);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = (0, _deflate.deflateCoordinates)(this.flatCoordinates, 0, coordinates, this.stride);
    this.changed();
  };

  return LineString;
}(_SimpleGeometry2.default); /**
                              * @module ol/geom/LineString
                              */
exports.default = LineString;

//# sourceMappingURL=LineString.js.map