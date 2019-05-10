'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util.js');

var _Object = require('../Object.js');

var _Object2 = _interopRequireDefault(_Object);

var _extent = require('../extent.js');

var _transform = require('./flat/transform.js');

var _proj = require('../proj.js');

var _Units = require('../proj/Units.js');

var _Units2 = _interopRequireDefault(_Units);

var _transform2 = require('../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @type {import("../transform.js").Transform}
 */
var tmpTransform = (0, _transform2.create)();

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for vector geometries.
 *
 * To get notified of changes to the geometry, register a listener for the
 * generic `change` event on your geometry instance.
 *
 * @abstract
 * @api
 */
/**
 * @module ol/geom/Geometry
 */
var Geometry = /*@__PURE__*/function (BaseObject) {
  function Geometry() {

    BaseObject.call(this);

    /**
     * @private
     * @type {import("../extent.js").Extent}
     */
    this.extent_ = (0, _extent.createEmpty)();

    /**
     * @private
     * @type {number}
     */
    this.extentRevision_ = -1;

    /**
     * @protected
     * @type {Object<string, Geometry>}
     */
    this.simplifiedGeometryCache = {};

    /**
     * @protected
     * @type {number}
     */
    this.simplifiedGeometryMaxMinSquaredTolerance = 0;

    /**
     * @protected
     * @type {number}
     */
    this.simplifiedGeometryRevision = 0;
  }

  if (BaseObject) Geometry.__proto__ = BaseObject;
  Geometry.prototype = Object.create(BaseObject && BaseObject.prototype);
  Geometry.prototype.constructor = Geometry;

  /**
   * Make a complete copy of the geometry.
   * @abstract
   * @return {!Geometry} Clone.
   */
  Geometry.prototype.clone = function clone() {
    return (0, _util.abstract)();
  };

  /**
   * @abstract
   * @param {number} x X.
   * @param {number} y Y.
   * @param {import("../coordinate.js").Coordinate} closestPoint Closest point.
   * @param {number} minSquaredDistance Minimum squared distance.
   * @return {number} Minimum squared distance.
   */
  Geometry.prototype.closestPointXY = function closestPointXY(x, y, closestPoint, minSquaredDistance) {
    return (0, _util.abstract)();
  };

  /**
   * @param {number} x X.
   * @param {number} y Y.
   * @return {boolean} Contains (x, y).
   */
  Geometry.prototype.containsXY = function containsXY(x, y) {
    return false;
  };

  /**
   * Return the closest point of the geometry to the passed point as
   * {@link module:ol/coordinate~Coordinate coordinate}.
   * @param {import("../coordinate.js").Coordinate} point Point.
   * @param {import("../coordinate.js").Coordinate=} opt_closestPoint Closest point.
   * @return {import("../coordinate.js").Coordinate} Closest point.
   * @api
   */
  Geometry.prototype.getClosestPoint = function getClosestPoint(point, opt_closestPoint) {
    var closestPoint = opt_closestPoint ? opt_closestPoint : [NaN, NaN];
    this.closestPointXY(point[0], point[1], closestPoint, Infinity);
    return closestPoint;
  };

  /**
   * Returns true if this geometry includes the specified coordinate. If the
   * coordinate is on the boundary of the geometry, returns false.
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @return {boolean} Contains coordinate.
   * @api
   */
  Geometry.prototype.intersectsCoordinate = function intersectsCoordinate(coordinate) {
    return this.containsXY(coordinate[0], coordinate[1]);
  };

  /**
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @protected
   * @return {import("../extent.js").Extent} extent Extent.
   */
  Geometry.prototype.computeExtent = function computeExtent(extent) {
    return (0, _util.abstract)();
  };

  /**
   * Get the extent of the geometry.
   * @param {import("../extent.js").Extent=} opt_extent Extent.
   * @return {import("../extent.js").Extent} extent Extent.
   * @api
   */
  Geometry.prototype.getExtent = function getExtent(opt_extent) {
    if (this.extentRevision_ != this.getRevision()) {
      this.extent_ = this.computeExtent(this.extent_);
      this.extentRevision_ = this.getRevision();
    }
    return (0, _extent.returnOrUpdate)(this.extent_, opt_extent);
  };

  /**
   * Rotate the geometry around a given coordinate. This modifies the geometry
   * coordinates in place.
   * @abstract
   * @param {number} angle Rotation angle in radians.
   * @param {import("../coordinate.js").Coordinate} anchor The rotation center.
   * @api
   */
  Geometry.prototype.rotate = function rotate(angle, anchor) {
    (0, _util.abstract)();
  };

  /**
   * Scale the geometry (with an optional origin).  This modifies the geometry
   * coordinates in place.
   * @abstract
   * @param {number} sx The scaling factor in the x-direction.
   * @param {number=} opt_sy The scaling factor in the y-direction (defaults to
   *     sx).
   * @param {import("../coordinate.js").Coordinate=} opt_anchor The scale origin (defaults to the center
   *     of the geometry extent).
   * @api
   */
  Geometry.prototype.scale = function scale(sx, opt_sy, opt_anchor) {
    (0, _util.abstract)();
  };

  /**
   * Create a simplified version of this geometry.  For linestrings, this uses
   * the the {@link
   * https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm
   * Douglas Peucker} algorithm.  For polygons, a quantization-based
   * simplification is used to preserve topology.
   * @param {number} tolerance The tolerance distance for simplification.
   * @return {Geometry} A new, simplified version of the original geometry.
   * @api
   */
  Geometry.prototype.simplify = function simplify(tolerance) {
    return this.getSimplifiedGeometry(tolerance * tolerance);
  };

  /**
   * Create a simplified version of this geometry using the Douglas Peucker
   * algorithm.
   * See https://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm.
   * @abstract
   * @param {number} squaredTolerance Squared tolerance.
   * @return {Geometry} Simplified geometry.
   */
  Geometry.prototype.getSimplifiedGeometry = function getSimplifiedGeometry(squaredTolerance) {
    return (0, _util.abstract)();
  };

  /**
   * Get the type of this geometry.
   * @abstract
   * @return {import("./GeometryType.js").default} Geometry type.
   */
  Geometry.prototype.getType = function getType() {
    return (0, _util.abstract)();
  };

  /**
   * Apply a transform function to each coordinate of the geometry.
   * The geometry is modified in place.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   * @abstract
   * @param {import("../proj.js").TransformFunction} transformFn Transform.
   */
  Geometry.prototype.applyTransform = function applyTransform(transformFn) {
    (0, _util.abstract)();
  };

  /**
   * Test if the geometry and the passed extent intersect.
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @return {boolean} `true` if the geometry and the extent intersect.
   */
  Geometry.prototype.intersectsExtent = function intersectsExtent(extent) {
    return (0, _util.abstract)();
  };

  /**
   * Translate the geometry.  This modifies the geometry coordinates in place.  If
   * instead you want a new geometry, first `clone()` this geometry.
   * @abstract
   * @param {number} deltaX Delta X.
   * @param {number} deltaY Delta Y.
   * @api
   */
  Geometry.prototype.translate = function translate(deltaX, deltaY) {
    (0, _util.abstract)();
  };

  /**
   * Transform each coordinate of the geometry from one coordinate reference
   * system to another. The geometry is modified in place.
   * For example, a line will be transformed to a line and a circle to a circle.
   * If you do not want the geometry modified in place, first `clone()` it and
   * then use this function on the clone.
   *
   * @param {import("../proj.js").ProjectionLike} source The current projection.  Can be a
   *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
   * @param {import("../proj.js").ProjectionLike} destination The desired projection.  Can be a
   *     string identifier or a {@link module:ol/proj/Projection~Projection} object.
   * @return {Geometry} This geometry.  Note that original geometry is
   *     modified in place.
   * @api
   */
  Geometry.prototype.transform = function transform(source, destination) {
    /** @type {import("../proj/Projection.js").default} */
    var sourceProj = (0, _proj.get)(source);
    var transformFn = sourceProj.getUnits() == _Units2.default.TILE_PIXELS ? function (inCoordinates, outCoordinates, stride) {
      var pixelExtent = sourceProj.getExtent();
      var projectedExtent = sourceProj.getWorldExtent();
      var scale = (0, _extent.getHeight)(projectedExtent) / (0, _extent.getHeight)(pixelExtent);
      (0, _transform2.compose)(tmpTransform, projectedExtent[0], projectedExtent[3], scale, -scale, 0, 0, 0);
      (0, _transform.transform2D)(inCoordinates, 0, inCoordinates.length, stride, tmpTransform, outCoordinates);
      return (0, _proj.getTransform)(sourceProj, destination)(inCoordinates, outCoordinates, stride);
    } : (0, _proj.getTransform)(sourceProj, destination);
    this.applyTransform(transformFn);
    return this;
  };

  return Geometry;
}(_Object2.default);

exports.default = Geometry;

//# sourceMappingURL=Geometry.js.map