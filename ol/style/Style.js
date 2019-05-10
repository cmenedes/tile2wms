'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * @module ol/style/Style
                                                                                                                                                                                                                                                                               */

/**
 * Feature styles.
 *
 * If no style is defined, the following default style is used:
 * ```js
 *  import {Fill, Stroke, Circle, Style} from 'ol/style';
 *
 *  var fill = new Fill({
 *    color: 'rgba(255,255,255,0.4)'
 *  });
 *  var stroke = new Stroke({
 *    color: '#3399CC',
 *    width: 1.25
 *  });
 *  var styles = [
 *    new Style({
 *      image: new Circle({
 *        fill: fill,
 *        stroke: stroke,
 *        radius: 5
 *      }),
 *      fill: fill,
 *      stroke: stroke
 *    })
 *  ];
 * ```
 *
 * A separate editing style has the following defaults:
 * ```js
 *  import {Fill, Stroke, Circle, Style} from 'ol/style';
 *  import GeometryType from 'ol/geom/GeometryType';
 *
 *  var white = [255, 255, 255, 1];
 *  var blue = [0, 153, 255, 1];
 *  var width = 3;
 *  styles[GeometryType.POLYGON] = [
 *    new Style({
 *      fill: new Fill({
 *        color: [255, 255, 255, 0.5]
 *      })
 *    })
 *  ];
 *  styles[GeometryType.MULTI_POLYGON] =
 *      styles[GeometryType.POLYGON];
 *  styles[GeometryType.LINE_STRING] = [
 *    new Style({
 *      stroke: new Stroke({
 *        color: white,
 *        width: width + 2
 *      })
 *    }),
 *    new Style({
 *      stroke: new Stroke({
 *        color: blue,
 *        width: width
 *      })
 *    })
 *  ];
 *  styles[GeometryType.MULTI_LINE_STRING] =
 *      styles[GeometryType.LINE_STRING];
 *  styles[GeometryType.POINT] = [
 *    new Style({
 *      image: new Circle({
 *        radius: width * 2,
 *        fill: new Fill({
 *          color: blue
 *        }),
 *        stroke: new Stroke({
 *          color: white,
 *          width: width / 2
 *        })
 *      }),
 *      zIndex: Infinity
 *    })
 *  ];
 *  styles[GeometryType.MULTI_POINT] =
 *      styles[GeometryType.POINT];
 *  styles[GeometryType.GEOMETRY_COLLECTION] =
 *      styles[GeometryType.POLYGON].concat(
 *          styles[GeometryType.LINE_STRING],
 *          styles[GeometryType.POINT]
 *      );
 * ```
 */


exports.toFunction = toFunction;
exports.createDefaultStyle = createDefaultStyle;
exports.createEditingStyle = createEditingStyle;

var _asserts = require('../asserts.js');

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _Circle = require('./Circle.js');

var _Circle2 = _interopRequireDefault(_Circle);

var _Fill = require('./Fill.js');

var _Fill2 = _interopRequireDefault(_Fill);

var _Stroke = require('./Stroke.js');

var _Stroke2 = _interopRequireDefault(_Stroke);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A function that takes an {@link module:ol/Feature} and a `{number}`
 * representing the view's resolution. The function should return a
 * {@link module:ol/style/Style} or an array of them. This way e.g. a
 * vector layer can be styled.
 *
 * @typedef {function(import("../Feature.js").FeatureLike, number):(Style|Array<Style>)} StyleFunction
 */

/**
 * A {@link Style}, an array of {@link Style}, or a {@link StyleFunction}.
 * @typedef {Style|Array<Style>|StyleFunction} StyleLike
 */

/**
 * A function that takes an {@link module:ol/Feature} as argument and returns an
 * {@link module:ol/geom/Geometry} that will be rendered and styled for the feature.
 *
 * @typedef {function(import("../Feature.js").FeatureLike):
 *     (import("../geom/Geometry.js").default|import("../render/Feature.js").default|undefined)} GeometryFunction
 */

/**
 * Custom renderer function. Takes two arguments:
 *
 * 1. The pixel coordinates of the geometry in GeoJSON notation.
 * 2. The {@link module:ol/render~State} of the layer renderer.
 *
 * @typedef {function((import("../coordinate.js").Coordinate|Array<import("../coordinate.js").Coordinate>|Array<Array<import("../coordinate.js").Coordinate>>),import("../render.js").State)}
 * RenderFunction
 */

/**
 * @typedef {Object} Options
 * @property {string|import("../geom/Geometry.js").default|GeometryFunction} [geometry] Feature property or geometry
 * or function returning a geometry to render for this style.
 * @property {import("./Fill.js").default} [fill] Fill style.
 * @property {import("./Image.js").default} [image] Image style.
 * @property {RenderFunction} [renderer] Custom renderer. When configured, `fill`, `stroke` and `image` will be
 * ignored, and the provided function will be called with each render frame for each geometry.
 * @property {import("./Stroke.js").default} [stroke] Stroke style.
 * @property {import("./Text.js").default} [text] Text style.
 * @property {number} [zIndex] Z index.
 */

/**
 * @classdesc
 * Container for vector feature rendering styles. Any changes made to the style
 * or its children through `set*()` methods will not take effect until the
 * feature or layer that uses the style is re-rendered.
 * @api
 */
var Style = function Style(opt_options) {

  var options = opt_options || {};

  /**
   * @private
   * @type {string|import("../geom/Geometry.js").default|GeometryFunction}
   */
  this.geometry_ = null;

  /**
   * @private
   * @type {!GeometryFunction}
   */
  this.geometryFunction_ = defaultGeometryFunction;

  if (options.geometry !== undefined) {
    this.setGeometry(options.geometry);
  }

  /**
   * @private
   * @type {import("./Fill.js").default}
   */
  this.fill_ = options.fill !== undefined ? options.fill : null;

  /**
     * @private
     * @type {import("./Image.js").default}
     */
  this.image_ = options.image !== undefined ? options.image : null;

  /**
   * @private
   * @type {RenderFunction|null}
   */
  this.renderer_ = options.renderer !== undefined ? options.renderer : null;

  /**
   * @private
   * @type {import("./Stroke.js").default}
   */
  this.stroke_ = options.stroke !== undefined ? options.stroke : null;

  /**
   * @private
   * @type {import("./Text.js").default}
   */
  this.text_ = options.text !== undefined ? options.text : null;

  /**
   * @private
   * @type {number|undefined}
   */
  this.zIndex_ = options.zIndex;
};

/**
 * Clones the style.
 * @return {Style} The cloned style.
 * @api
 */
Style.prototype.clone = function clone() {
  var geometry = this.getGeometry();
  if (geometry && (typeof geometry === 'undefined' ? 'undefined' : _typeof(geometry)) === 'object') {
    geometry = /** @type {import("../geom/Geometry.js").default} */geometry.clone();
  }
  return new Style({
    geometry: geometry,
    fill: this.getFill() ? this.getFill().clone() : undefined,
    image: this.getImage() ? this.getImage().clone() : undefined,
    stroke: this.getStroke() ? this.getStroke().clone() : undefined,
    text: this.getText() ? this.getText().clone() : undefined,
    zIndex: this.getZIndex()
  });
};

/**
 * Get the custom renderer function that was configured with
 * {@link #setRenderer} or the `renderer` constructor option.
 * @return {RenderFunction|null} Custom renderer function.
 * @api
 */
Style.prototype.getRenderer = function getRenderer() {
  return this.renderer_;
};

/**
 * Sets a custom renderer function for this style. When set, `fill`, `stroke`
 * and `image` options of the style will be ignored.
 * @param {RenderFunction|null} renderer Custom renderer function.
 * @api
 */
Style.prototype.setRenderer = function setRenderer(renderer) {
  this.renderer_ = renderer;
};

/**
 * Get the geometry to be rendered.
 * @return {string|import("../geom/Geometry.js").default|GeometryFunction}
 * Feature property or geometry or function that returns the geometry that will
 * be rendered with this style.
 * @api
 */
Style.prototype.getGeometry = function getGeometry() {
  return this.geometry_;
};

/**
 * Get the function used to generate a geometry for rendering.
 * @return {!GeometryFunction} Function that is called with a feature
 * and returns the geometry to render instead of the feature's geometry.
 * @api
 */
Style.prototype.getGeometryFunction = function getGeometryFunction() {
  return this.geometryFunction_;
};

/**
 * Get the fill style.
 * @return {import("./Fill.js").default} Fill style.
 * @api
 */
Style.prototype.getFill = function getFill() {
  return this.fill_;
};

/**
 * Set the fill style.
 * @param {import("./Fill.js").default} fill Fill style.
 * @api
 */
Style.prototype.setFill = function setFill(fill) {
  this.fill_ = fill;
};

/**
 * Get the image style.
 * @return {import("./Image.js").default} Image style.
 * @api
 */
Style.prototype.getImage = function getImage() {
  return this.image_;
};

/**
 * Set the image style.
 * @param {import("./Image.js").default} image Image style.
 * @api
 */
Style.prototype.setImage = function setImage(image) {
  this.image_ = image;
};

/**
 * Get the stroke style.
 * @return {import("./Stroke.js").default} Stroke style.
 * @api
 */
Style.prototype.getStroke = function getStroke() {
  return this.stroke_;
};

/**
 * Set the stroke style.
 * @param {import("./Stroke.js").default} stroke Stroke style.
 * @api
 */
Style.prototype.setStroke = function setStroke(stroke) {
  this.stroke_ = stroke;
};

/**
 * Get the text style.
 * @return {import("./Text.js").default} Text style.
 * @api
 */
Style.prototype.getText = function getText() {
  return this.text_;
};

/**
 * Set the text style.
 * @param {import("./Text.js").default} text Text style.
 * @api
 */
Style.prototype.setText = function setText(text) {
  this.text_ = text;
};

/**
 * Get the z-index for the style.
 * @return {number|undefined} ZIndex.
 * @api
 */
Style.prototype.getZIndex = function getZIndex() {
  return this.zIndex_;
};

/**
 * Set a geometry that is rendered instead of the feature's geometry.
 *
 * @param {string|import("../geom/Geometry.js").default|GeometryFunction} geometry
 *   Feature property or geometry or function returning a geometry to render
 *   for this style.
 * @api
 */
Style.prototype.setGeometry = function setGeometry(geometry) {
  if (typeof geometry === 'function') {
    this.geometryFunction_ = geometry;
  } else if (typeof geometry === 'string') {
    this.geometryFunction_ = function (feature) {
      return (
        /** @type {import("../geom/Geometry.js").default} */feature.get(geometry)
      );
    };
  } else if (!geometry) {
    this.geometryFunction_ = defaultGeometryFunction;
  } else if (geometry !== undefined) {
    this.geometryFunction_ = function () {
      return (
        /** @type {import("../geom/Geometry.js").default} */geometry
      );
    };
  }
  this.geometry_ = geometry;
};

/**
 * Set the z-index.
 *
 * @param {number|undefined} zIndex ZIndex.
 * @api
 */
Style.prototype.setZIndex = function setZIndex(zIndex) {
  this.zIndex_ = zIndex;
};

/**
 * Convert the provided object into a style function.  Functions passed through
 * unchanged.  Arrays of Style or single style objects wrapped in a
 * new style function.
 * @param {StyleFunction|Array<Style>|Style} obj
 *     A style function, a single style, or an array of styles.
 * @return {StyleFunction} A style function.
 */
function toFunction(obj) {
  var styleFunction;

  if (typeof obj === 'function') {
    styleFunction = obj;
  } else {
    /**
     * @type {Array<Style>}
     */
    var styles;
    if (Array.isArray(obj)) {
      styles = obj;
    } else {
      (0, _asserts.assert)(typeof /** @type {?} */obj.getZIndex === 'function', 41); // Expected an `Style` or an array of `Style`
      var style = /** @type {Style} */obj;
      styles = [style];
    }
    styleFunction = function styleFunction() {
      return styles;
    };
  }
  return styleFunction;
}

/**
 * @type {Array<Style>}
 */
var defaultStyles = null;

/**
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 * @param {number} resolution Resolution.
 * @return {Array<Style>} Style.
 */
function createDefaultStyle(feature, resolution) {
  // We don't use an immediately-invoked function
  // and a closure so we don't get an error at script evaluation time in
  // browsers that do not support Canvas. (import("./Circle.js").CircleStyle does
  // canvas.getContext('2d') at construction time, which will cause an.error
  // in such browsers.)
  if (!defaultStyles) {
    var fill = new _Fill2.default({
      color: 'rgba(255,255,255,0.4)'
    });
    var stroke = new _Stroke2.default({
      color: '#3399CC',
      width: 1.25
    });
    defaultStyles = [new Style({
      image: new _Circle2.default({
        fill: fill,
        stroke: stroke,
        radius: 5
      }),
      fill: fill,
      stroke: stroke
    })];
  }
  return defaultStyles;
}

/**
 * Default styles for editing features.
 * @return {Object<import("../geom/GeometryType.js").default, Array<Style>>} Styles
 */
function createEditingStyle() {
  /** @type {Object<import("../geom/GeometryType.js").default, Array<Style>>} */
  var styles = {};
  var white = [255, 255, 255, 1];
  var blue = [0, 153, 255, 1];
  var width = 3;
  styles[_GeometryType2.default.POLYGON] = [new Style({
    fill: new _Fill2.default({
      color: [255, 255, 255, 0.5]
    })
  })];
  styles[_GeometryType2.default.MULTI_POLYGON] = styles[_GeometryType2.default.POLYGON];

  styles[_GeometryType2.default.LINE_STRING] = [new Style({
    stroke: new _Stroke2.default({
      color: white,
      width: width + 2
    })
  }), new Style({
    stroke: new _Stroke2.default({
      color: blue,
      width: width
    })
  })];
  styles[_GeometryType2.default.MULTI_LINE_STRING] = styles[_GeometryType2.default.LINE_STRING];

  styles[_GeometryType2.default.CIRCLE] = styles[_GeometryType2.default.POLYGON].concat(styles[_GeometryType2.default.LINE_STRING]);

  styles[_GeometryType2.default.POINT] = [new Style({
    image: new _Circle2.default({
      radius: width * 2,
      fill: new _Fill2.default({
        color: blue
      }),
      stroke: new _Stroke2.default({
        color: white,
        width: width / 2
      })
    }),
    zIndex: Infinity
  })];
  styles[_GeometryType2.default.MULTI_POINT] = styles[_GeometryType2.default.POINT];

  styles[_GeometryType2.default.GEOMETRY_COLLECTION] = styles[_GeometryType2.default.POLYGON].concat(styles[_GeometryType2.default.LINE_STRING], styles[_GeometryType2.default.POINT]);

  return styles;
}

/**
 * Function that is called with a feature and returns its default geometry.
 * @param {import("../Feature.js").FeatureLike} feature Feature to get the geometry for.
 * @return {import("../geom/Geometry.js").default|import("../render/Feature.js").default|undefined} Geometry to render.
 */
function defaultGeometryFunction(feature) {
  return feature.getGeometry();
}

exports.default = Style;

//# sourceMappingURL=Style.js.map