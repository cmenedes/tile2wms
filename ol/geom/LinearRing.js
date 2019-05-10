'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extent = require('../extent.js');

var _GeometryLayout = require('./GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _GeometryType = require('./GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _SimpleGeometry = require('./SimpleGeometry.js');

var _SimpleGeometry2 = _interopRequireDefault(_SimpleGeometry);

var _area = require('./flat/area.js');

var _closest = require('./flat/closest.js');

var _deflate = require('./flat/deflate.js');

var _inflate = require('./flat/inflate.js');

var _simplify = require('./flat/simplify.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Linear ring geometry. Only used as part of polygon; cannot be rendered
 * on its own.
 *
 * @api
 */
var LinearRing = /*@__PURE__*/function (SimpleGeometry) {
  function LinearRing(coordinates, opt_layout) {

    SimpleGeometry.call(this);

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

  if (SimpleGeometry) LinearRing.__proto__ = SimpleGeometry;
  LinearRing.prototype = Object.create(SimpleGeometry && SimpleGeometry.prototype);
  LinearRing.prototype.constructor = LinearRing;

  /**
   * Make a complete copy of the geometry.
   * @return {!LinearRing} Clone.
   * @override
   * @api
   */
  LinearRing.prototype.clone = function clone() {
    return new LinearRing(this.flatCoordinates.slice(), this.layout);
  };

  /**
   * @inheritDoc
   */
  LinearRing.prototype.closestPointXY = function closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < (0, _extent.closestSquaredDistanceXY)(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    if (this.maxDeltaRevision_ != this.getRevision()) {
      this.maxDelta_ = Math.sqrt((0, _closest.maxSquaredDelta)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, 0));
      this.maxDeltaRevision_ = this.getRevision();
    }
    return (0, _closest.assignClosestPoint)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
  };

  /**
   * Return the area of the linear ring on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  LinearRing.prototype.getArea = function getArea() {
    return (0, _area.linearRing)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
  };

  /**
   * Return the coordinates of the linear ring.
   * @return {Array<import("../coordinate.js").Coordinate>} Coordinates.
   * @override
   * @api
   */
  LinearRing.prototype.getCoordinates = function getCoordinates() {
    return (0, _inflate.inflateCoordinates)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride);
  };

  /**
   * @inheritDoc
   */
  LinearRing.prototype.getSimplifiedGeometryInternal = function getSimplifiedGeometryInternal(squaredTolerance) {
    var simplifiedFlatCoordinates = [];
    simplifiedFlatCoordinates.length = (0, _simplify.douglasPeucker)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, squaredTolerance, simplifiedFlatCoordinates, 0);
    return new LinearRing(simplifiedFlatCoordinates, _GeometryLayout2.default.XY);
  };

  /**
   * @inheritDoc
   * @api
   */
  LinearRing.prototype.getType = function getType() {
    return _GeometryType2.default.LINEAR_RING;
  };

  /**
   * @inheritDoc
   */
  LinearRing.prototype.intersectsExtent = function intersectsExtent(extent) {
    return false;
  };

  /**
   * Set the coordinates of the linear ring.
   * @param {!Array<import("../coordinate.js").Coordinate>} coordinates Coordinates.
   * @param {GeometryLayout=} opt_layout Layout.
   * @override
   * @api
   */
  LinearRing.prototype.setCoordinates = function setCoordinates(coordinates, opt_layout) {
    this.setLayout(opt_layout, coordinates, 1);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    this.flatCoordinates.length = (0, _deflate.deflateCoordinates)(this.flatCoordinates, 0, coordinates, this.stride);
    this.changed();
  };

  return LinearRing;
}(_SimpleGeometry2.default); /**
                              * @module ol/geom/LinearRing
                              */
exports.default = LinearRing;

//# sourceMappingURL=LinearRing.js.map