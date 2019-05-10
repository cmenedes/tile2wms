'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStrideForLayout = getStrideForLayout;
exports.transformGeom2D = transformGeom2D;

var _util = require('../util.js');

var _extent = require('../extent.js');

var _Geometry = require('./Geometry.js');

var _Geometry2 = _interopRequireDefault(_Geometry);

var _GeometryLayout = require('./GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _transform = require('./flat/transform.js');

var _obj = require('../obj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Abstract base class; only used for creating subclasses; do not instantiate
 * in apps, as cannot be rendered.
 *
 * @abstract
 * @api
 */
/**
 * @module ol/geom/SimpleGeometry
 */
var SimpleGeometry = /*@__PURE__*/function (Geometry) {
  function SimpleGeometry() {

    Geometry.call(this);

    /**
     * @protected
     * @type {GeometryLayout}
     */
    this.layout = _GeometryLayout2.default.XY;

    /**
     * @protected
     * @type {number}
     */
    this.stride = 2;

    /**
     * @protected
     * @type {Array<number>}
     */
    this.flatCoordinates = null;
  }

  if (Geometry) SimpleGeometry.__proto__ = Geometry;
  SimpleGeometry.prototype = Object.create(Geometry && Geometry.prototype);
  SimpleGeometry.prototype.constructor = SimpleGeometry;

  /**
   * @inheritDoc
   */
  SimpleGeometry.prototype.computeExtent = function computeExtent(extent) {
    return (0, _extent.createOrUpdateFromFlatCoordinates)(this.flatCoordinates, 0, this.flatCoordinates.length, this.stride, extent);
  };

  /**
   * @abstract
   * @return {Array} Coordinates.
   */
  SimpleGeometry.prototype.getCoordinates = function getCoordinates() {
    return (0, _util.abstract)();
  };

  /**
   * Return the first coordinate of the geometry.
   * @return {import("../coordinate.js").Coordinate} First coordinate.
   * @api
   */
  SimpleGeometry.prototype.getFirstCoordinate = function getFirstCoordinate() {
    return this.flatCoordinates.slice(0, this.stride);
  };

  /**
   * @return {Array<number>} Flat coordinates.
   */
  SimpleGeometry.prototype.getFlatCoordinates = function getFlatCoordinates() {
    return this.flatCoordinates;
  };

  /**
   * Return the last coordinate of the geometry.
   * @return {import("../coordinate.js").Coordinate} Last point.
   * @api
   */
  SimpleGeometry.prototype.getLastCoordinate = function getLastCoordinate() {
    return this.flatCoordinates.slice(this.flatCoordinates.length - this.stride);
  };

  /**
   * Return the {@link module:ol/geom/GeometryLayout layout} of the geometry.
   * @return {GeometryLayout} Layout.
   * @api
   */
  SimpleGeometry.prototype.getLayout = function getLayout() {
    return this.layout;
  };

  /**
   * @inheritDoc
   */
  SimpleGeometry.prototype.getSimplifiedGeometry = function getSimplifiedGeometry(squaredTolerance) {
    if (this.simplifiedGeometryRevision != this.getRevision()) {
      (0, _obj.clear)(this.simplifiedGeometryCache);
      this.simplifiedGeometryMaxMinSquaredTolerance = 0;
      this.simplifiedGeometryRevision = this.getRevision();
    }
    // If squaredTolerance is negative or if we know that simplification will not
    // have any effect then just return this.
    if (squaredTolerance < 0 || this.simplifiedGeometryMaxMinSquaredTolerance !== 0 && squaredTolerance <= this.simplifiedGeometryMaxMinSquaredTolerance) {
      return this;
    }
    var key = squaredTolerance.toString();
    if (this.simplifiedGeometryCache.hasOwnProperty(key)) {
      return this.simplifiedGeometryCache[key];
    } else {
      var simplifiedGeometry = this.getSimplifiedGeometryInternal(squaredTolerance);
      var simplifiedFlatCoordinates = simplifiedGeometry.getFlatCoordinates();
      if (simplifiedFlatCoordinates.length < this.flatCoordinates.length) {
        this.simplifiedGeometryCache[key] = simplifiedGeometry;
        return simplifiedGeometry;
      } else {
        // Simplification did not actually remove any coordinates.  We now know
        // that any calls to getSimplifiedGeometry with a squaredTolerance less
        // than or equal to the current squaredTolerance will also not have any
        // effect.  This allows us to short circuit simplification (saving CPU
        // cycles) and prevents the cache of simplified geometries from filling
        // up with useless identical copies of this geometry (saving memory).
        this.simplifiedGeometryMaxMinSquaredTolerance = squaredTolerance;
        return this;
      }
    }
  };

  /**
   * @param {number} squaredTolerance Squared tolerance.
   * @return {SimpleGeometry} Simplified geometry.
   * @protected
   */
  SimpleGeometry.prototype.getSimplifiedGeometryInternal = function getSimplifiedGeometryInternal(squaredTolerance) {
    return this;
  };

  /**
   * @return {number} Stride.
   */
  SimpleGeometry.prototype.getStride = function getStride() {
    return this.stride;
  };

  /**
   * @param {GeometryLayout} layout Layout.
   * @param {Array<number>} flatCoordinates Flat coordinates.
   */
  SimpleGeometry.prototype.setFlatCoordinates = function setFlatCoordinates(layout, flatCoordinates) {
    this.stride = getStrideForLayout(layout);
    this.layout = layout;
    this.flatCoordinates = flatCoordinates;
  };

  /**
   * @abstract
   * @param {!Array} coordinates Coordinates.
   * @param {GeometryLayout=} opt_layout Layout.
   */
  SimpleGeometry.prototype.setCoordinates = function setCoordinates(coordinates, opt_layout) {
    (0, _util.abstract)();
  };

  /**
   * @param {GeometryLayout|undefined} layout Layout.
   * @param {Array} coordinates Coordinates.
   * @param {number} nesting Nesting.
   * @protected
   */
  SimpleGeometry.prototype.setLayout = function setLayout(layout, coordinates, nesting) {
    /** @type {number} */
    var stride;
    if (layout) {
      stride = getStrideForLayout(layout);
    } else {
      for (var i = 0; i < nesting; ++i) {
        if (coordinates.length === 0) {
          this.layout = _GeometryLayout2.default.XY;
          this.stride = 2;
          return;
        } else {
          coordinates = /** @type {Array} */coordinates[0];
        }
      }
      stride = coordinates.length;
      layout = getLayoutForStride(stride);
    }
    this.layout = layout;
    this.stride = stride;
  };

  /**
   * @inheritDoc
   * @api
   */
  SimpleGeometry.prototype.applyTransform = function applyTransform(transformFn) {
    if (this.flatCoordinates) {
      transformFn(this.flatCoordinates, this.flatCoordinates, this.stride);
      this.changed();
    }
  };

  /**
   * @inheritDoc
   * @api
   */
  SimpleGeometry.prototype.rotate = function rotate$1(angle, anchor) {
    var flatCoordinates = this.getFlatCoordinates();
    if (flatCoordinates) {
      var stride = this.getStride();
      (0, _transform.rotate)(flatCoordinates, 0, flatCoordinates.length, stride, angle, anchor, flatCoordinates);
      this.changed();
    }
  };

  /**
   * @inheritDoc
   * @api
   */
  SimpleGeometry.prototype.scale = function scale$1(sx, opt_sy, opt_anchor) {
    var sy = opt_sy;
    if (sy === undefined) {
      sy = sx;
    }
    var anchor = opt_anchor;
    if (!anchor) {
      anchor = (0, _extent.getCenter)(this.getExtent());
    }
    var flatCoordinates = this.getFlatCoordinates();
    if (flatCoordinates) {
      var stride = this.getStride();
      (0, _transform.scale)(flatCoordinates, 0, flatCoordinates.length, stride, sx, sy, anchor, flatCoordinates);
      this.changed();
    }
  };

  /**
   * @inheritDoc
   * @api
   */
  SimpleGeometry.prototype.translate = function translate$1(deltaX, deltaY) {
    var flatCoordinates = this.getFlatCoordinates();
    if (flatCoordinates) {
      var stride = this.getStride();
      (0, _transform.translate)(flatCoordinates, 0, flatCoordinates.length, stride, deltaX, deltaY, flatCoordinates);
      this.changed();
    }
  };

  return SimpleGeometry;
}(_Geometry2.default);

/**
 * @param {number} stride Stride.
 * @return {GeometryLayout} layout Layout.
 */
function getLayoutForStride(stride) {
  var layout;
  if (stride == 2) {
    layout = _GeometryLayout2.default.XY;
  } else if (stride == 3) {
    layout = _GeometryLayout2.default.XYZ;
  } else if (stride == 4) {
    layout = _GeometryLayout2.default.XYZM;
  }
  return (
    /** @type {GeometryLayout} */layout
  );
}

/**
 * @param {GeometryLayout} layout Layout.
 * @return {number} Stride.
 */
function getStrideForLayout(layout) {
  var stride;
  if (layout == _GeometryLayout2.default.XY) {
    stride = 2;
  } else if (layout == _GeometryLayout2.default.XYZ || layout == _GeometryLayout2.default.XYM) {
    stride = 3;
  } else if (layout == _GeometryLayout2.default.XYZM) {
    stride = 4;
  }
  return (/** @type {number} */stride
  );
}

/**
 * @param {SimpleGeometry} simpleGeometry Simple geometry.
 * @param {import("../transform.js").Transform} transform Transform.
 * @param {Array<number>=} opt_dest Destination.
 * @return {Array<number>} Transformed flat coordinates.
 */
function transformGeom2D(simpleGeometry, transform, opt_dest) {
  var flatCoordinates = simpleGeometry.getFlatCoordinates();
  if (!flatCoordinates) {
    return null;
  } else {
    var stride = simpleGeometry.getStride();
    return (0, _transform.transform2D)(flatCoordinates, 0, flatCoordinates.length, stride, transform, opt_dest);
  }
}

exports.default = SimpleGeometry;

//# sourceMappingURL=SimpleGeometry.js.map