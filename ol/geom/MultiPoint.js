'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _array = require('../array.js');

var _extent = require('../extent.js');

var _GeometryType = require('./GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _Point = require('./Point.js');

var _Point2 = _interopRequireDefault(_Point);

var _SimpleGeometry = require('./SimpleGeometry.js');

var _SimpleGeometry2 = _interopRequireDefault(_SimpleGeometry);

var _deflate = require('./flat/deflate.js');

var _inflate = require('./flat/inflate.js');

var _math = require('../math.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Multi-point geometry.
 *
 * @api
 */
/**
 * @module ol/geom/MultiPoint
 */
var MultiPoint = /*@__PURE__*/function (SimpleGeometry) {
  function MultiPoint(coordinates, opt_layout) {
    SimpleGeometry.call(this);
    if (opt_layout && !Array.isArray(coordinates[0])) {
      this.setFlatCoordinates(opt_layout, /** @type {Array<number>} */coordinates);
    } else {
      this.setCoordinates( /** @type {Array<import("../coordinate.js").Coordinate>} */coordinates, opt_layout);
    }
  }

  if (SimpleGeometry) MultiPoint.__proto__ = SimpleGeometry;
  MultiPoint.prototype = Object.create(SimpleGeometry && SimpleGeometry.prototype);
  MultiPoint.prototype.constructor = MultiPoint;

  /**
   * Append the passed point to this multipoint.
   * @param {Point} point Point.
   * @api
   */
  MultiPoint.prototype.appendPoint = function appendPoint(point) {
    if (!this.flatCoordinates) {
      this.flatCoordinates = point.getFlatCoordinates().slice();
    } else {
      (0, _array.extend)(this.flatCoordinates, point.getFlatCoordinates());
    }
    this.changed();
  };

  /**
   * Make a complete copy of the geometry.
   * @return {!MultiPoint} Clone.
   * @override
   * @api
   */
  MultiPoint.prototype.clone = function clone() {
    var multiPoint = new MultiPoint(this.flatCoordinates.slice(), this.layout);
    return multiPoint;
  };

  /**
   * @inheritDoc
   */
  MultiPoint.prototype.closestPointXY = function closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < (0, _extent.closestSquaredDistanceXY)(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    var flatCoordinates = this.flatCoordinates;
    var stride = this.stride;
    for (var i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
      var squaredDistance = (0, _math.squaredDistance)(x, y, flatCoordinates[i], flatCoordinates[i + 1]);
      if (squaredDistance < minSquaredDistance) {
        minSquaredDistance = squaredDistance;
        for (var j = 0; j < stride; ++j) {
          closestPoint[j] = flatCoordinates[i + j];
        }
        closestPoint.length = stride;
      }
    }
    return minSquaredDistance;
  };

  /**
   * Return the coordinates of the multipoint.
   * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
   * @override
   * @api
   */
  MultiPoint.prototype.getCoordinates = function getCoordinates() {
    return (0, _inflate.inflateCoordinates)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
  };

  /**
   * Return the point at the specified index.
   * @param {number} index Index.
   * @return {Point} Point.
   * @api
   */
  MultiPoint.prototype.getPoint = function getPoint(index) {
    var n = !this.flatCoordinates ? 0 : this.flatCoordinates.length / this.stride;
    if (index < 0 || n <= index) {
      return null;
    }
    return new _Point2.default(this.flatCoordinates.slice(index * this.stride, (index + 1) * this.stride), this.layout);
  };

  /**
   * Return the points of this multipoint.
   * @return {Array<Point>} Points.
   * @api
   */
  MultiPoint.prototype.getPoints = function getPoints() {
    var flatCoordinates = this.flatCoordinates;
    var layout = this.layout;
    var stride = this.stride;
    /** @type {Array<Point>} */
    var points = [];
    for (var i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
      var point = new _Point2.default(flatCoordinates.slice(i, i + stride), layout);
      points.push(point);
    }
    return points;
  };

  /**
   * @inheritDoc
   * @api
   */
  MultiPoint.prototype.getType = function getType() {
    return _GeometryType2.default.MULTI_POINT;
  };

  /**
   * @inheritDoc
   * @api
   */
  MultiPoint.prototype.intersectsExtent = function intersectsExtent(extent) {
    var flatCoordinates = this.flatCoordinates;
    var stride = this.stride;
    for (var i = 0, ii = flatCoordinates.length; i < ii; i += stride) {
      var x = flatCoordinates[i];
      var y = flatCoordinates[i + 1];
      if ((0, _extent.containsXY)(extent, x, y)) {
        return true;
      }
    }
    return false;
  };

  /**
   * Set the coordinates of the multipoint.
   * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
   * @param {import("./GeometryLayout.js").default=} opt_layout Layout.
   * @override
   * @api
   */
  MultiPoint.prototype.setCoordinates = function setCoordinates(coordinates, opt_layout) {
    this.setLayout(opt_layout, coordinates, 1);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = (0, _deflate.deflateCoordinates)(this.flatCoordinates, 0, coordinates, this.stride);
    this.changed();
  };

  return MultiPoint;
}(_SimpleGeometry2.default);

exports.default = MultiPoint;

//# sourceMappingURL=MultiPoint.js.map