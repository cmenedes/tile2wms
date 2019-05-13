'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformWithOptions = transformWithOptions;

var _obj = require('../obj.js');

var _util = require('../util.js');

var _proj = require('../proj.js');

/**
 * @typedef {Object} ReadOptions
 * @property {import("../proj.js").ProjectionLike} [dataProjection] Projection of the data we are reading.
 * If not provided, the projection will be derived from the data (where possible) or
 * the `dataProjection` of the format is assigned (where set). If the projection
 * can not be derived from the data and if no `dataProjection` is set for a format,
 * the features will not be reprojected.
 * @property {import("../extent.js").Extent} [extent] Tile extent of the tile being read. This is only used and
 * required for {@link module:ol/format/MVT}.
 * @property {import("../proj.js").ProjectionLike} [featureProjection] Projection of the feature geometries
 * created by the format reader. If not provided, features will be returned in the
 * `dataProjection`.
 */

/**
 * @typedef {Object} WriteOptions
 * @property {import("../proj.js").ProjectionLike} [dataProjection] Projection of the data we are writing.
 * If not provided, the `dataProjection` of the format is assigned (where set).
 * If no `dataProjection` is set for a format, the features will be returned
 * in the `featureProjection`.
 * @property {import("../proj.js").ProjectionLike} [featureProjection] Projection of the feature geometries
 * that will be serialized by the format writer. If not provided, geometries are assumed
 * to be in the `dataProjection` if that is set; in other words, they are not transformed.
 * @property {boolean} [rightHanded] When writing geometries, follow the right-hand
 * rule for linear ring orientation.  This means that polygons will have counter-clockwise
 * exterior rings and clockwise interior rings.  By default, coordinates are serialized
 * as they are provided at construction.  If `true`, the right-hand rule will
 * be applied.  If `false`, the left-hand rule will be applied (clockwise for
 * exterior and counter-clockwise for interior rings).  Note that not all
 * formats support this.  The GeoJSON format does use this property when writing
 * geometries.
 * @property {number} [decimals] Maximum number of decimal places for coordinates.
 * Coordinates are stored internally as floats, but floating-point arithmetic can create
 * coordinates with a large number of decimal places, not generally wanted on output.
 * Set a number here to round coordinates. Can also be used to ensure that
 * coordinates read in can be written back out with the same number of decimals.
 * Default is no rounding.
 */

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for feature formats.
 * {FeatureFormat} subclasses provide the ability to decode and encode
 * {@link module:ol/Feature~Feature} objects from a variety of commonly used geospatial
 * file formats.  See the documentation for each format for more details.
 *
 * @abstract
 * @api
 */
var FeatureFormat = function FeatureFormat() {

  /**
   * @protected
   * @type {import("../proj/Projection.js").default}
   */
  this.dataProjection = null;

  /**
   * @protected
   * @type {import("../proj/Projection.js").default}
   */
  this.defaultFeatureProjection = null;
};

/**
 * Adds the data projection to the read options.
 * @param {Document|Node|Object|string} source Source.
 * @param {ReadOptions=} opt_options Options.
 * @return {ReadOptions|undefined} Options.
 * @protected
 */
/**
 * @module ol/format/Feature
 */
FeatureFormat.prototype.getReadOptions = function getReadOptions(source, opt_options) {
  var options;
  if (opt_options) {
    options = {
      dataProjection: opt_options.dataProjection ? opt_options.dataProjection : this.readProjection(source),
      featureProjection: opt_options.featureProjection
    };
  }
  return this.adaptOptions(options);
};

/**
 * Sets the `dataProjection` on the options, if no `dataProjection`
 * is set.
 * @param {WriteOptions|ReadOptions|undefined} options
 *   Options.
 * @protected
 * @return {WriteOptions|ReadOptions|undefined}
 *   Updated options.
 */
FeatureFormat.prototype.adaptOptions = function adaptOptions(options) {
  return (0, _obj.assign)({
    dataProjection: this.dataProjection,
    featureProjection: this.defaultFeatureProjection
  }, options);
};

/**
 * Get the extent from the source of the last {@link readFeatures} call.
 * @return {import("../extent.js").Extent} Tile extent.
 */
FeatureFormat.prototype.getLastExtent = function getLastExtent() {
  return null;
};

/**
 * @abstract
 * @return {import("./FormatType.js").default} Format.
 */
FeatureFormat.prototype.getType = function getType() {
  return (0, _util.abstract)();
};

/**
 * Read a single feature from a source.
 *
 * @abstract
 * @param {Document|Node|Object|string} source Source.
 * @param {ReadOptions=} opt_options Read options.
 * @return {import("../Feature.js").FeatureLike} Feature.
 */
FeatureFormat.prototype.readFeature = function readFeature(source, opt_options) {
  return (0, _util.abstract)();
};

/**
 * Read all features from a source.
 *
 * @abstract
 * @param {Document|Node|ArrayBuffer|Object|string} source Source.
 * @param {ReadOptions=} opt_options Read options.
 * @return {Array<import("../Feature.js").FeatureLike>} Features.
 */
FeatureFormat.prototype.readFeatures = function readFeatures(source, opt_options) {
  return (0, _util.abstract)();
};

/**
 * Read a single geometry from a source.
 *
 * @abstract
 * @param {Document|Node|Object|string} source Source.
 * @param {ReadOptions=} opt_options Read options.
 * @return {import("../geom/Geometry.js").default} Geometry.
 */
FeatureFormat.prototype.readGeometry = function readGeometry(source, opt_options) {
  return (0, _util.abstract)();
};

/**
 * Read the projection from a source.
 *
 * @abstract
 * @param {Document|Node|Object|string} source Source.
 * @return {import("../proj/Projection.js").default} Projection.
 */
FeatureFormat.prototype.readProjection = function readProjection(source) {
  return (0, _util.abstract)();
};

/**
 * Encode a feature in this format.
 *
 * @abstract
 * @param {import("../Feature.js").default} feature Feature.
 * @param {WriteOptions=} opt_options Write options.
 * @return {string} Result.
 */
FeatureFormat.prototype.writeFeature = function writeFeature(feature, opt_options) {
  return (0, _util.abstract)();
};

/**
 * Encode an array of features in this format.
 *
 * @abstract
 * @param {Array<import("../Feature.js").default>} features Features.
 * @param {WriteOptions=} opt_options Write options.
 * @return {string} Result.
 */
FeatureFormat.prototype.writeFeatures = function writeFeatures(features, opt_options) {
  return (0, _util.abstract)();
};

/**
 * Write a single geometry in this format.
 *
 * @abstract
 * @param {import("../geom/Geometry.js").default} geometry Geometry.
 * @param {WriteOptions=} opt_options Write options.
 * @return {string} Result.
 */
FeatureFormat.prototype.writeGeometry = function writeGeometry(geometry, opt_options) {
  return (0, _util.abstract)();
};

exports.default = FeatureFormat;

/**
 * @param {import("../geom/Geometry.js").default|import("../extent.js").Extent} geometry Geometry.
 * @param {boolean} write Set to true for writing, false for reading.
 * @param {(WriteOptions|ReadOptions)=} opt_options Options.
 * @return {import("../geom/Geometry.js").default|import("../extent.js").Extent} Transformed geometry.
 */

function transformWithOptions(geometry, write, opt_options) {
  var featureProjection = opt_options ? (0, _proj.get)(opt_options.featureProjection) : null;
  var dataProjection = opt_options ? (0, _proj.get)(opt_options.dataProjection) : null;
  /**
   * @type {import("../geom/Geometry.js").default|import("../extent.js").Extent}
   */
  var transformed;
  if (featureProjection && dataProjection && !(0, _proj.equivalent)(featureProjection, dataProjection)) {
    if (Array.isArray(geometry)) {
      // FIXME this is necessary because GML treats extents
      // as geometries
      transformed = (0, _proj.transformExtent)(geometry, dataProjection, featureProjection);
    } else {
      transformed = (write ? /** @type {import("../geom/Geometry").default} */geometry.clone() : geometry).transform(write ? featureProjection : dataProjection, write ? dataProjection : featureProjection);
    }
  } else {
    transformed = geometry;
  }
  if (write && opt_options && /** @type {WriteOptions} */opt_options.decimals !== undefined && !Array.isArray(transformed)) {
    var power = Math.pow(10, /** @type {WriteOptions} */opt_options.decimals);
    // if decimals option on write, round each coordinate appropriately
    /**
     * @param {Array<number>} coordinates Coordinates.
     * @return {Array<number>} Transformed coordinates.
     */
    var transform = function transform(coordinates) {
      for (var i = 0, ii = coordinates.length; i < ii; ++i) {
        coordinates[i] = Math.round(coordinates[i] * power) / power;
      }
      return coordinates;
    };
    if (transformed === geometry) {
      transformed = /** @type {import("../geom/Geometry").default} */geometry.clone();
    }
    transformed.applyTransform(transform);
  }
  return transformed;
}

//# sourceMappingURL=Feature.js.map