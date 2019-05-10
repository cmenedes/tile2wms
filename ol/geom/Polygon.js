'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.circular = circular;
exports.fromExtent = fromExtent;
exports.fromCircle = fromCircle;
exports.makeRegular = makeRegular;

var _array = require('../array.js');

var _extent = require('../extent.js');

var _GeometryLayout = require('./GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _GeometryType = require('./GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _LinearRing = require('./LinearRing.js');

var _LinearRing2 = _interopRequireDefault(_LinearRing);

var _Point = require('./Point.js');

var _Point2 = _interopRequireDefault(_Point);

var _SimpleGeometry = require('./SimpleGeometry.js');

var _SimpleGeometry2 = _interopRequireDefault(_SimpleGeometry);

var _sphere = require('../sphere.js');

var _area = require('./flat/area.js');

var _closest = require('./flat/closest.js');

var _contains = require('./flat/contains.js');

var _deflate = require('./flat/deflate.js');

var _inflate = require('./flat/inflate.js');

var _interiorpoint = require('./flat/interiorpoint.js');

var _intersectsextent = require('./flat/intersectsextent.js');

var _orient = require('./flat/orient.js');

var _simplify = require('./flat/simplify.js');

var _math = require('../math.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Polygon geometry.
 *
 * @api
 */
/**
 * @module ol/geom/Polygon
 */
var Polygon = /*@__PURE__*/function (SimpleGeometry) {
  function Polygon(coordinates, opt_layout, opt_ends) {

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
    this.flatInteriorPointRevision_ = -1;

    /**
     * @private
     * @type {import("../coordinate.js").Coordinate}
     */
    this.flatInteriorPoint_ = null;

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

    /**
     * @private
     * @type {number}
     */
    this.orientedRevision_ = -1;

    /**
     * @private
     * @type {Array<number>}
     */
    this.orientedFlatCoordinates_ = null;

    if (opt_layout !== undefined && opt_ends) {
      this.setFlatCoordinates(opt_layout, /** @type {Array<number>} */coordinates);
      this.ends_ = opt_ends;
    } else {
      this.setCoordinates( /** @type {Array<Array<import("../coordinate.js").Coordinate>>} */coordinates, opt_layout);
    }
  }

  if (SimpleGeometry) Polygon.__proto__ = SimpleGeometry;
  Polygon.prototype = Object.create(SimpleGeometry && SimpleGeometry.prototype);
  Polygon.prototype.constructor = Polygon;

  /**
   * Append the passed linear ring to this polygon.
   * @param {LinearRing} linearRing Linear ring.
   * @api
   */
  Polygon.prototype.appendLinearRing = function appendLinearRing(linearRing) {
    if (!this.flatCoordinates) {
      this.flatCoordinates = linearRing.getFlatCoordinates().slice();
    } else {
      (0, _array.extend)(this.flatCoordinates, linearRing.getFlatCoordinates());
    }
    this.ends_.push(this.flatCoordinates.length);
    this.changed();
  };

  /**
   * Make a complete copy of the geometry.
   * @return {!Polygon} Clone.
   * @override
   * @api
   */
  Polygon.prototype.clone = function clone() {
    return new Polygon(this.flatCoordinates.slice(), this.layout, this.ends_.slice());
  };

  /**
   * @inheritDoc
   */
  Polygon.prototype.closestPointXY = function closestPointXY(x, y, closestPoint, minSquaredDistance) {
    if (minSquaredDistance < (0, _extent.closestSquaredDistanceXY)(this.getExtent(), x, y)) {
      return minSquaredDistance;
    }
    if (this.maxDeltaRevision_ != this.getRevision()) {
      this.maxDelta_ = Math.sqrt((0, _closest.arrayMaxSquaredDelta)(this.flatCoordinates, 0, this.ends_, this.stride, 0));
      this.maxDeltaRevision_ = this.getRevision();
    }
    return (0, _closest.assignClosestArrayPoint)(this.flatCoordinates, 0, this.ends_, this.stride, this.maxDelta_, true, x, y, closestPoint, minSquaredDistance);
  };

  /**
   * @inheritDoc
   */
  Polygon.prototype.containsXY = function containsXY(x, y) {
    return (0, _contains.linearRingsContainsXY)(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, x, y);
  };

  /**
   * Return the area of the polygon on projected plane.
   * @return {number} Area (on projected plane).
   * @api
   */
  Polygon.prototype.getArea = function getArea() {
    return (0, _area.linearRings)(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride);
  };

  /**
   * Get the coordinate array for this geometry.  This array has the structure
   * of a GeoJSON coordinate array for polygons.
   *
   * @param {boolean=} opt_right Orient coordinates according to the right-hand
   *     rule (counter-clockwise for exterior and clockwise for interior rings).
   *     If `false`, coordinates will be oriented according to the left-hand rule
   *     (clockwise for exterior and counter-clockwise for interior rings).
   *     By default, coordinate orientation will depend on how the geometry was
   *     constructed.
   * @return {Array<Array<import("../coordinate.js").Coordinate>>} Coordinates.
   * @override
   * @api
   */
  Polygon.prototype.getCoordinates = function getCoordinates(opt_right) {
    var flatCoordinates;
    if (opt_right !== undefined) {
      flatCoordinates = this.getOrientedFlatCoordinates().slice();
      (0, _orient.orientLinearRings)(flatCoordinates, 0, this.ends_, this.stride, opt_right);
    } else {
      flatCoordinates = this.flatCoordinates;
    }

    return (0, _inflate.inflateCoordinatesArray)(flatCoordinates, 0, this.ends_, this.stride);
  };

  /**
   * @return {Array<number>} Ends.
   */
  Polygon.prototype.getEnds = function getEnds() {
    return this.ends_;
  };

  /**
   * @return {Array<number>} Interior point.
   */
  Polygon.prototype.getFlatInteriorPoint = function getFlatInteriorPoint() {
    if (this.flatInteriorPointRevision_ != this.getRevision()) {
      var flatCenter = (0, _extent.getCenter)(this.getExtent());
      this.flatInteriorPoint_ = (0, _interiorpoint.getInteriorPointOfArray)(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, flatCenter, 0);
      this.flatInteriorPointRevision_ = this.getRevision();
    }
    return this.flatInteriorPoint_;
  };

  /**
   * Return an interior point of the polygon.
   * @return {Point} Interior point as XYM coordinate, where M is the
   * length of the horizontal intersection that the point belongs to.
   * @api
   */
  Polygon.prototype.getInteriorPoint = function getInteriorPoint() {
    return new _Point2.default(this.getFlatInteriorPoint(), _GeometryLayout2.default.XYM);
  };

  /**
   * Return the number of rings of the polygon,  this includes the exterior
   * ring and any interior rings.
   *
   * @return {number} Number of rings.
   * @api
   */
  Polygon.prototype.getLinearRingCount = function getLinearRingCount() {
    return this.ends_.length;
  };

  /**
   * Return the Nth linear ring of the polygon geometry. Return `null` if the
   * given index is out of range.
   * The exterior linear ring is available at index `0` and the interior rings
   * at index `1` and beyond.
   *
   * @param {number} index Index.
   * @return {LinearRing} Linear ring.
   * @api
   */
  Polygon.prototype.getLinearRing = function getLinearRing(index) {
    if (index < 0 || this.ends_.length <= index) {
      return null;
    }
    return new _LinearRing2.default(this.flatCoordinates.slice(index === 0 ? 0 : this.ends_[index - 1], this.ends_[index]), this.layout);
  };

  /**
   * Return the linear rings of the polygon.
   * @return {Array<LinearRing>} Linear rings.
   * @api
   */
  Polygon.prototype.getLinearRings = function getLinearRings() {
    var layout = this.layout;
    var flatCoordinates = this.flatCoordinates;
    var ends = this.ends_;
    var linearRings = [];
    var offset = 0;
    for (var i = 0, ii = ends.length; i < ii; ++i) {
      var end = ends[i];
      var linearRing = new _LinearRing2.default(flatCoordinates.slice(offset, end), layout);
      linearRings.push(linearRing);
      offset = end;
    }
    return linearRings;
  };

  /**
   * @return {Array<number>} Oriented flat coordinates.
   */
  Polygon.prototype.getOrientedFlatCoordinates = function getOrientedFlatCoordinates() {
    if (this.orientedRevision_ != this.getRevision()) {
      var flatCoordinates = this.flatCoordinates;
      if ((0, _orient.linearRingIsOriented)(flatCoordinates, 0, this.ends_, this.stride)) {
        this.orientedFlatCoordinates_ = flatCoordinates;
      } else {
        this.orientedFlatCoordinates_ = flatCoordinates.slice();
        this.orientedFlatCoordinates_.length = (0, _orient.orientLinearRings)(this.orientedFlatCoordinates_, 0, this.ends_, this.stride);
      }
      this.orientedRevision_ = this.getRevision();
    }
    return this.orientedFlatCoordinates_;
  };

  /**
   * @inheritDoc
   */
  Polygon.prototype.getSimplifiedGeometryInternal = function getSimplifiedGeometryInternal(squaredTolerance) {
    var simplifiedFlatCoordinates = [];
    var simplifiedEnds = [];
    simplifiedFlatCoordinates.length = (0, _simplify.quantizeArray)(this.flatCoordinates, 0, this.ends_, this.stride, Math.sqrt(squaredTolerance), simplifiedFlatCoordinates, 0, simplifiedEnds);
    return new Polygon(simplifiedFlatCoordinates, _GeometryLayout2.default.XY, simplifiedEnds);
  };

  /**
   * @inheritDoc
   * @api
   */
  Polygon.prototype.getType = function getType() {
    return _GeometryType2.default.POLYGON;
  };

  /**
   * @inheritDoc
   * @api
   */
  Polygon.prototype.intersectsExtent = function intersectsExtent(extent) {
    return (0, _intersectsextent.intersectsLinearRingArray)(this.getOrientedFlatCoordinates(), 0, this.ends_, this.stride, extent);
  };

  /**
   * Set the coordinates of the polygon.
   * @param {!Array<Array<import("../coordinate.js").Coordinate>>} coordinates Coordinates.
   * @param {GeometryLayout=} opt_layout Layout.
   * @override
   * @api
   */
  Polygon.prototype.setCoordinates = function setCoordinates(coordinates, opt_layout) {
    this.setLayout(opt_layout, coordinates, 2);
    if (!this.flatCoordinates) {
      this.flatCoordinates = [];
    }
    var ends = (0, _deflate.deflateCoordinatesArray)(this.flatCoordinates, 0, coordinates, this.stride, this.ends_);
    this.flatCoordinates.length = ends.length === 0 ? 0 : ends[ends.length - 1];
    this.changed();
  };

  return Polygon;
}(_SimpleGeometry2.default);

exports.default = Polygon;

/**
 * Create an approximation of a circle on the surface of a sphere.
 * @param {import("../coordinate.js").Coordinate} center Center (`[lon, lat]` in degrees).
 * @param {number} radius The great-circle distance from the center to
 *     the polygon vertices.
 * @param {number=} opt_n Optional number of vertices for the resulting
 *     polygon. Default is `32`.
 * @param {number=} opt_sphereRadius Optional radius for the sphere (defaults to
 *     the Earth's mean radius using the WGS84 ellipsoid).
 * @return {Polygon} The "circular" polygon.
 * @api
 */

function circular(center, radius, opt_n, opt_sphereRadius) {
  var n = opt_n ? opt_n : 32;
  /** @type {Array<number>} */
  var flatCoordinates = [];
  for (var i = 0; i < n; ++i) {
    (0, _array.extend)(flatCoordinates, (0, _sphere.offset)(center, radius, 2 * Math.PI * i / n, opt_sphereRadius));
  }
  flatCoordinates.push(flatCoordinates[0], flatCoordinates[1]);
  return new Polygon(flatCoordinates, _GeometryLayout2.default.XY, [flatCoordinates.length]);
}

/**
 * Create a polygon from an extent. The layout used is `XY`.
 * @param {import("../extent.js").Extent} extent The extent.
 * @return {Polygon} The polygon.
 * @api
 */
function fromExtent(extent) {
  var minX = extent[0];
  var minY = extent[1];
  var maxX = extent[2];
  var maxY = extent[3];
  var flatCoordinates = [minX, minY, minX, maxY, maxX, maxY, maxX, minY, minX, minY];
  return new Polygon(flatCoordinates, _GeometryLayout2.default.XY, [flatCoordinates.length]);
}

/**
 * Create a regular polygon from a circle.
 * @param {import("./Circle.js").default} circle Circle geometry.
 * @param {number=} opt_sides Number of sides of the polygon. Default is 32.
 * @param {number=} opt_angle Start angle for the first vertex of the polygon in
 *     radians. Default is 0.
 * @return {Polygon} Polygon geometry.
 * @api
 */
function fromCircle(circle, opt_sides, opt_angle) {
  var sides = opt_sides ? opt_sides : 32;
  var stride = circle.getStride();
  var layout = circle.getLayout();
  var center = circle.getCenter();
  var arrayLength = stride * (sides + 1);
  var flatCoordinates = new Array(arrayLength);
  for (var i = 0; i < arrayLength; i += stride) {
    flatCoordinates[i] = 0;
    flatCoordinates[i + 1] = 0;
    for (var j = 2; j < stride; j++) {
      flatCoordinates[i + j] = center[j];
    }
  }
  var ends = [flatCoordinates.length];
  var polygon = new Polygon(flatCoordinates, layout, ends);
  makeRegular(polygon, center, circle.getRadius(), opt_angle);
  return polygon;
}

/**
 * Modify the coordinates of a polygon to make it a regular polygon.
 * @param {Polygon} polygon Polygon geometry.
 * @param {import("../coordinate.js").Coordinate} center Center of the regular polygon.
 * @param {number} radius Radius of the regular polygon.
 * @param {number=} opt_angle Start angle for the first vertex of the polygon in
 *     radians. Default is 0.
 */
function makeRegular(polygon, center, radius, opt_angle) {
  var flatCoordinates = polygon.getFlatCoordinates();
  var stride = polygon.getStride();
  var sides = flatCoordinates.length / stride - 1;
  var startAngle = opt_angle ? opt_angle : 0;
  for (var i = 0; i <= sides; ++i) {
    var offset = i * stride;
    var angle = startAngle + (0, _math.modulo)(i, sides) * 2 * Math.PI / sides;
    flatCoordinates[offset] = center[0] + radius * Math.cos(angle);
    flatCoordinates[offset + 1] = center[1] + radius * Math.sin(angle);
  }
  polygon.changed();
}

//# sourceMappingURL=Polygon.js.map