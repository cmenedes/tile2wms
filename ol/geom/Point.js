'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extent = require('../extent.js');

var _GeometryType = require('./GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _SimpleGeometry = require('./SimpleGeometry.js');

var _SimpleGeometry2 = _interopRequireDefault(_SimpleGeometry);

var _deflate = require('./flat/deflate.js');

var _math = require('../math.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Point geometry.
 *
 * @api
 */
var Point = /*@__PURE__*/function (SimpleGeometry) {
  function Point(coordinates, opt_layout) {
    SimpleGeometry.call(this);
    this.setCoordinates(coordinates, opt_layout);
  }

  if (SimpleGeometry) Point.__proto__ = SimpleGeometry;
  Point.prototype = Object.create(SimpleGeometry && SimpleGeometry.prototype);
  Point.prototype.constructor = Point;

  /**
   * Make a complete copy of the geometry.
   * @return {!Point} Clone.
   * @override
   * @api
   */
  Point.prototype.clone = function clone() {
    var point = new Point(this.flatCoordinates.slice(), this.layout);
    return point;
  };

  /**
   * @inheritDoc
   */
  Point.prototype.closestPointXY = function closestPointXY(x, y, closestPoint, minSquaredDistance) {
    var flatCoordinates = this.flatCoordinates;
    var squaredDistance = (0, _math.squaredDistance)(x, y, flatCoordinates[0], flatCoordinates[1]);
    if (squaredDistance < minSquaredDistance) {
      var stride = this.stride;
      for (var i = 0; i < stride; ++i) {
        closestPoint[i] = flatCoordinates[i];
      }
      closestPoint.length = stride;
      return squaredDistance;
    } else {
      return minSquaredDistance;
    }
  };

  /**
   * Return the coordinate of the point.
   * @return {import("../coordinate.js").Coordinate} Coordinates.
   * @override
   * @api
   */
  Point.prototype.getCoordinates = function getCoordinates() {
    return !this.flatCoordinates ? [] : this.flatCoordinates.slice();
  };

  /**
   * @inheritDoc
   */
  Point.prototype.computeExtent = function computeExtent(extent) {
    return (0, _extent.createOrUpdateFromCoordinate)(this.flatCoordinates, extent);
  };

  /**
   * @inheritDoc
   * @api
   */
  Point.prototype.getType = function getType() {
    return _GeometryType2.default.POINT;
  };

  /**
   * @inheritDoc
   * @api
   */
  Point.prototype.intersectsExtent = function intersectsExtent(extent) {
    return (0, _extent.containsXY)(extent, this.flatCoordinates[0], this.flatCoordinates[1]);
  };

  /**
   * @inheritDoc
   * @api
   */
  Point.prototype.setCoordinates = function setCoordinates(coordinates, opt_layout) {
    this.setLayout(opt_layout, coordinates, 0);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = (0, _deflate.deflateCoordinate)(this.flatCoordinates, 0, coordinates, this.stride);
    this.changed();
  };

  return Point;
}(_SimpleGeometry2.default); /**
                              * @module ol/geom/Point
                              */
exports.default = Point;

//# sourceMappingURL=Point.js.map