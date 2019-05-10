'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util.js');

var _Feature = require('../format/Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _FormatType = require('../format/FormatType.js');

var _FormatType2 = _interopRequireDefault(_FormatType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for text feature formats.
 *
 * @abstract
 */
var TextFeature = /*@__PURE__*/function (FeatureFormat) {
  function TextFeature() {
    FeatureFormat.call(this);
  }

  if (FeatureFormat) TextFeature.__proto__ = FeatureFormat;
  TextFeature.prototype = Object.create(FeatureFormat && FeatureFormat.prototype);
  TextFeature.prototype.constructor = TextFeature;

  /**
   * @inheritDoc
   */
  TextFeature.prototype.getType = function getType() {
    return _FormatType2.default.TEXT;
  };

  /**
   * Read the feature from the source.
   *
   * @param {Document|Node|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions=} opt_options Read options.
   * @return {import("../Feature.js").default} Feature.
   * @api
   */
  TextFeature.prototype.readFeature = function readFeature(source, opt_options) {
    return this.readFeatureFromText(getText(source), this.adaptOptions(opt_options));
  };

  /**
   * @abstract
   * @param {string} text Text.
   * @param {import("./Feature.js").ReadOptions=} opt_options Read options.
   * @protected
   * @return {import("../Feature.js").default} Feature.
   */
  TextFeature.prototype.readFeatureFromText = function readFeatureFromText(text, opt_options) {
    return (0, _util.abstract)();
  };

  /**
   * Read the features from the source.
   *
   * @param {Document|Node|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions=} opt_options Read options.
   * @return {Array<import("../Feature.js").default>} Features.
   * @api
   */
  TextFeature.prototype.readFeatures = function readFeatures(source, opt_options) {
    return this.readFeaturesFromText(getText(source), this.adaptOptions(opt_options));
  };

  /**
   * @abstract
   * @param {string} text Text.
   * @param {import("./Feature.js").ReadOptions=} opt_options Read options.
   * @protected
   * @return {Array<import("../Feature.js").default>} Features.
   */
  TextFeature.prototype.readFeaturesFromText = function readFeaturesFromText(text, opt_options) {
    return (0, _util.abstract)();
  };

  /**
   * Read the geometry from the source.
   *
   * @param {Document|Node|Object|string} source Source.
   * @param {import("./Feature.js").ReadOptions=} opt_options Read options.
   * @return {import("../geom/Geometry.js").default} Geometry.
   * @api
   */
  TextFeature.prototype.readGeometry = function readGeometry(source, opt_options) {
    return this.readGeometryFromText(getText(source), this.adaptOptions(opt_options));
  };

  /**
   * @abstract
   * @param {string} text Text.
   * @param {import("./Feature.js").ReadOptions=} opt_options Read options.
   * @protected
   * @return {import("../geom/Geometry.js").default} Geometry.
   */
  TextFeature.prototype.readGeometryFromText = function readGeometryFromText(text, opt_options) {
    return (0, _util.abstract)();
  };

  /**
   * Read the projection from the source.
   *
   * @param {Document|Node|Object|string} source Source.
   * @return {import("../proj/Projection.js").default} Projection.
   * @api
   */
  TextFeature.prototype.readProjection = function readProjection(source) {
    return this.readProjectionFromText(getText(source));
  };

  /**
   * @param {string} text Text.
   * @protected
   * @return {import("../proj/Projection.js").default} Projection.
   */
  TextFeature.prototype.readProjectionFromText = function readProjectionFromText(text) {
    return this.dataProjection;
  };

  /**
   * Encode a feature as a string.
   *
   * @param {import("../Feature.js").default} feature Feature.
   * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
   * @return {string} Encoded feature.
   * @api
   */
  TextFeature.prototype.writeFeature = function writeFeature(feature, opt_options) {
    return this.writeFeatureText(feature, this.adaptOptions(opt_options));
  };

  /**
   * @abstract
   * @param {import("../Feature.js").default} feature Features.
   * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
   * @protected
   * @return {string} Text.
   */
  TextFeature.prototype.writeFeatureText = function writeFeatureText(feature, opt_options) {
    return (0, _util.abstract)();
  };

  /**
   * Encode an array of features as string.
   *
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
   * @return {string} Encoded features.
   * @api
   */
  TextFeature.prototype.writeFeatures = function writeFeatures(features, opt_options) {
    return this.writeFeaturesText(features, this.adaptOptions(opt_options));
  };

  /**
   * @abstract
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
   * @protected
   * @return {string} Text.
   */
  TextFeature.prototype.writeFeaturesText = function writeFeaturesText(features, opt_options) {
    return (0, _util.abstract)();
  };

  /**
   * Write a single geometry.
   *
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
   * @return {string} Geometry.
   * @api
   */
  TextFeature.prototype.writeGeometry = function writeGeometry(geometry, opt_options) {
    return this.writeGeometryText(geometry, this.adaptOptions(opt_options));
  };

  /**
   * @abstract
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
   * @protected
   * @return {string} Text.
   */
  TextFeature.prototype.writeGeometryText = function writeGeometryText(geometry, opt_options) {
    return (0, _util.abstract)();
  };

  return TextFeature;
}(_Feature2.default);

/**
 * @param {Document|Node|Object|string} source Source.
 * @return {string} Text.
 */
/**
 * @module ol/format/TextFeature
 */
function getText(source) {
  if (typeof source === 'string') {
    return source;
  } else {
    return '';
  }
}

exports.default = TextFeature;

//# sourceMappingURL=TextFeature.js.map