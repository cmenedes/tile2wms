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

var _LineString = require('./LineString.js');

var _LineString2 = _interopRequireDefault(_LineString);

var _SimpleGeometry = require('./SimpleGeometry.js');

var _SimpleGeometry2 = _interopRequireDefault(_SimpleGeometry);

var _closest = require('./flat/closest.js');

var _deflate = require('./flat/deflate.js');

var _inflate = require('./flat/inflate.js');

var _interpolate = require('./flat/interpolate.js');

var _intersectsextent = require('./flat/intersectsextent.js');

var _simplify = require('./flat/simplify.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Multi-linestring geometry.
 *
 * @api
 */
/**
 * @module ol/geom/MultiLineString
 */
var MultiLineString = /*@__PURE__*/function (SimpleGeometry) {
  function MultiLineString(coordinates, opt_layout, opt_ends) {

    SimpleGeometry.call(this);

    /**
     * @type {Array<number>}
     * @private
     */
    this.ends_ = [];

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

    if (Array.isArray(coordinates[0])) {
      this.setCoordinates( /** @type {Array<Array<import("../coordinate.js").Coordinate>>} */coordinates, opt_layout);
    } else if (opt_layout !== undefined && opt_ends) {
      this.setFlatCoordinates(opt_layout, /** @type {Array<number>} */coordinates);
      this.ends_ = opt_ends;
    } else {
      var layout = this.getLayout();
      var lineStrings = /** @type {Array<LineString>} */coordinates;
      var flatCoordinates = [];
      var ends = [];
      for (var i = 0, ii = lineStrings.length; i < ii; ++i) {
        var lineString = lineStrings[i];
        if (i === 0) {
          layout = lineString.getLayout();
        }
        (0, _array.extend)(flatCoordinates, lineString.getFlatCoordinates());
        ends.push(flatCoordinates.length);
      }
      this.setFlatCoordinates(layout, flatCoordinates);
      this.ends_ = ends;
    }
  }

  if (SimpleGeometry) MultiLineString.__proto__ = SimpleGeometry;
  MultiLineString.prototype = Object.create(SimpleGeometry && SimpleGeometry.prototype);
  MultiLineString.prototype.constructor = MultiLineString;

  /**
   * Append the passed linestring to the multilinestring.
   * @param {LineString} lineString LineString.
   * @api
   */
  MultiLineString.prototype.appendLineString = function appendLineString(lineString) {
    if (!this.flatCoordinates) {
      this.flatCoordinates = lineString.getFlatCoordinates().slice();
    } else {
      (0, _array.extend)(this.flatCoordinates, lineString.getFlatCoordinates().slice());
    }
    this.ends_.push(this.flatCoordinates.length);
    this.changed();
  };

  /**
   * Make a complete copy of the geometry.
   * @return {!MultiLineString} Clone.
   * @override
   * @api
   */
  MultiLineString.prototype.clone = function clone() {
    return new MultiLineString(this.flatCoordinates.slice(), this.layout, this.ends_.slice());
  };

  /**
   * @inheritDoc
   */
  MultiLineString.prototype.closestPointXY = function closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < (0, _extent.closestSquaredDistanceXY)(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    if (this.maxDeltaRevision_ != this.getRevision()) {
      this.maxDelta_ = Math.sqrt((0, _closest.arrayMaxSquaredDelta)(this.flatCoordinates, 0, this.ends_, this.stride, 0));
      this.maxDeltaRevision_ = this.getRevision();
    }
    return (0, _closest.assignClosestArrayPoint)(this.flatCoordinates, 0, this.ends_, this.stride, this.maxDelta_, false, x, y, closestPoint, minSquaredDistance);
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
   * `opt_interpolate` controls interpolation between consecutive LineStrings
   * within the MultiLineString. If `opt_interpolate` is `true` the coordinates
   * will be linearly interpolated between the last coordinate of one LineString
   * and the first coordinate of the next LineString.  If `opt_interpolate` is
   * `false` then the function will return `null` for Ms falling between
   * LineStrings.
   *
   * @param {number} m M.
   * @param {boolean=} opt_extrapolate Extrapolate. Default is `false`.
   * @param {boolean=} opt_interpolate Interpolate. Default is `false`.
   * @return {import("../coordinate.js").Coordinate} Coordinate.
   * @api
   */
  MultiLineString.prototype.getCoordinateAtM = function getCoordinateAtM(m, opt_extrapolate, opt_interpolate) {
    if (this.layout != _GeometryLayout2.default.XYM && this.layout != _GeometryLayout2.default.XYZM || this.flatCoordinates.length === 0) {
      return null;
    }
    var extrapolate = opt_extrapolate !== undefined ? opt_extrapolate : false;
    var interpolate = opt_interpolate !== undefined ? opt_interpolate : false;
    return (0, _interpolate.lineStringsCoordinateAtM)(this.flatCoordinates, 0, this.ends_, this.stride, m, extrapolate, interpolate);
  };

  /**
   * Return the coordinates of the multilinestring.
   * @return {Array<Array<import("../coordinate.js").Coordinate>>} Coordinates.
   * @override
   * @api
   */
  MultiLineString.prototype.getCoordinates = function getCoordinates() {
    return (0, _inflate.inflateCoordinatesArray)(this.flatCoordinates, 0, this.ends_, this.stride);
  };

  /**
   * @return {Array<number>} Ends.
   */
  MultiLineString.prototype.getEnds = function getEnds() {
    return this.ends_;
  };

  /**
   * Return the linestring at the specified index.
   * @param {number} index Index.
   * @return {LineString} LineString.
   * @api
   */
  MultiLineString.prototype.getLineString = function getLineString(index) {
    if (index < 0 || this.ends_.length <= index) {
      return null;
    }
    return new _LineString2.default(this.flatCoordinates.slice(index === 0 ? 0 : this.ends_[index - 1], this.ends_[index]), this.layout);
  };

  /**
   * Return the linestrings of this multilinestring.
   * @return {Array<LineString>} LineStrings.
   * @api
   */
  MultiLineString.prototype.getLineStrings = function getLineStrings() {
    var flatCoordinates = this.flatCoordinates;
    var ends = this.ends_;
    var layout = this.layout;
    /** @type {Array<LineString>} */
    var lineStrings = [];
    var offset = 0;
    for (var i = 0, ii = ends.length; i < ii; ++i) {
      var end = ends[i];
      var lineString = new _LineString2.default(flatCoordinates.slice(offset, end), layout);
      lineStrings.push(lineString);
      offset = end;
    }
    return lineStrings;
  };

  /**
   * @return {Array<number>} Flat midpoints.
   */
  MultiLineString.prototype.getFlatMidpoints = function getFlatMidpoints() {
    var midpoints = [];
    var flatCoordinates = this.flatCoordinates;
    var offset = 0;
    var ends = this.ends_;
    var stride = this.stride;
    for (var i = 0, ii = ends.length; i < ii; ++i) {
      var end = ends[i];
      var midpoint = (0, _interpolate.interpolatePoint)(flatCoordinates, offset, end, stride, 0.5);
      (0, _array.extend)(midpoints, midpoint);
      offset = end;
    }
    return midpoints;
  };

  /**
   * @inheritDoc
   */
  MultiLineString.prototype.getSimplifiedGeometryInternal = function getSimplifiedGeometryInternal(squaredTolerance) {
    var simplifiedFlatCoordinates = [];
    var simplifiedEnds = [];
    simplifiedFlatCoordinates.length = (0, _simplify.douglasPeuckerArray)(this.flatCoordinates, 0, this.ends_, this.stride, squaredTolerance, simplifiedFlatCoordinates, 0, simplifiedEnds);
    return new MultiLineString(simplifiedFlatCoordinates, _GeometryLayout2.default.XY, simplifiedEnds);
  };

  /**
   * @inheritDoc
   * @api
   */
  MultiLineString.prototype.getType = function getType() {
    return _GeometryType2.default.MULTI_LINE_STRING;
  };

  /**
   * @inheritDoc
   * @api
   */
  MultiLineString.prototype.intersectsExtent = function intersectsExtent(extent) {
    return (0, _intersectsextent.intersectsLineStringArray)(this.flatCoordinates, 0, this.ends_, this.stride, extent);
  };

  /**
   * Set the coordinates of the multilinestring.
   * @param {!Array<Array<import("../coordinate.js").Coordinate>>} coordinates Coordinates.
   * @param {GeometryLayout=} opt_layout Layout.
   * @override
   * @api
   */
  MultiLineString.prototype.setCoordinates = function setCoordinates(coordinates, opt_layout) {
    this.setLayout(opt_layout, coordinates, 2);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    var ends = (0, _deflate.deflateCoordinatesArray)(this.flatCoordinates, 0, coordinates, this.stride, this.ends_);
    this.flatCoordinates.length = ends.length === 0 ? 0 : ends[ends.length - 1];
    this.changed();
  };

  return MultiLineString;
}(_SimpleGeometry2.default);

exports.default = MultiLineString;

//# sourceMappingURL=MultiLineString.js.map