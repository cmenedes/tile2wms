'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util.js');

var _Object = require('../Object.js');

var _Object2 = _interopRequireDefault(_Object);

var _Property = require('./Property.js');

var _Property2 = _interopRequireDefault(_Property);

var _math = require('../math.js');

var _obj = require('../obj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} Options
 * @property {number} [opacity=1] Opacity (0, 1).
 * @property {boolean} [visible=true] Visibility.
 * @property {import("../extent.js").Extent} [extent] The bounding extent for layer rendering.  The layer will not be
 * rendered outside of this extent.
 * @property {number} [zIndex] The z-index for layer rendering.  At rendering time, the layers
 * will be ordered, first by Z-index and then by position. When `undefined`, a `zIndex` of 0 is assumed
 * for layers that are added to the map's `layers` collection, or `Infinity` when the layer's `setMap()`
 * method was used.
 * @property {number} [minResolution] The minimum resolution (inclusive) at which this layer will be
 * visible.
 * @property {number} [maxResolution] The maximum resolution (exclusive) below which this layer will
 * be visible.
 */

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Note that with {@link module:ol/layer/Base} and all its subclasses, any property set in
 * the options is set as a {@link module:ol/Object} property on the layer object, so
 * is observable, and has get/set accessors.
 *
 * @api
 */
var BaseLayer = /*@__PURE__*/function (BaseObject) {
  function BaseLayer(options) {

    BaseObject.call(this);

    /**
     * @type {Object<string, *>}
     */
    var properties = (0, _obj.assign)({}, options);
    properties[_Property2.default.OPACITY] = options.opacity !== undefined ? options.opacity : 1;
    properties[_Property2.default.VISIBLE] = options.visible !== undefined ? options.visible : true;
    properties[_Property2.default.Z_INDEX] = options.zIndex;
    properties[_Property2.default.MAX_RESOLUTION] = options.maxResolution !== undefined ? options.maxResolution : Infinity;
    properties[_Property2.default.MIN_RESOLUTION] = options.minResolution !== undefined ? options.minResolution : 0;

    this.setProperties(properties);

    /**
     * @type {import("./Layer.js").State}
     * @private
     */
    this.state_ = null;

    /**
     * The layer type.
     * @type {import("../LayerType.js").default}
     * @protected;
     */
    this.type;
  }

  if (BaseObject) BaseLayer.__proto__ = BaseObject;
  BaseLayer.prototype = Object.create(BaseObject && BaseObject.prototype);
  BaseLayer.prototype.constructor = BaseLayer;

  /**
   * Get the layer type (used when creating a layer renderer).
   * @return {import("../LayerType.js").default} The layer type.
   */
  BaseLayer.prototype.getType = function getType() {
    return this.type;
  };

  /**
   * @return {import("./Layer.js").State} Layer state.
   */
  BaseLayer.prototype.getLayerState = function getLayerState() {
    /** @type {import("./Layer.js").State} */
    var state = this.state_ || /** @type {?} */{
      layer: this,
      managed: true
    };
    state.opacity = (0, _math.clamp)(this.getOpacity(), 0, 1);
    state.sourceState = this.getSourceState();
    state.visible = this.getVisible();
    state.extent = this.getExtent();
    state.zIndex = this.getZIndex() || 0;
    state.maxResolution = this.getMaxResolution();
    state.minResolution = Math.max(this.getMinResolution(), 0);
    this.state_ = state;

    return state;
  };

  /**
   * @abstract
   * @param {Array<import("./Layer.js").default>=} opt_array Array of layers (to be
   *     modified in place).
   * @return {Array<import("./Layer.js").default>} Array of layers.
   */
  BaseLayer.prototype.getLayersArray = function getLayersArray(opt_array) {
    return (0, _util.abstract)();
  };

  /**
   * @abstract
   * @param {Array<import("./Layer.js").State>=} opt_states Optional list of layer
   *     states (to be modified in place).
   * @return {Array<import("./Layer.js").State>} List of layer states.
   */
  BaseLayer.prototype.getLayerStatesArray = function getLayerStatesArray(opt_states) {
    return (0, _util.abstract)();
  };

  /**
   * Return the {@link module:ol/extent~Extent extent} of the layer or `undefined` if it
   * will be visible regardless of extent.
   * @return {import("../extent.js").Extent|undefined} The layer extent.
   * @observable
   * @api
   */
  BaseLayer.prototype.getExtent = function getExtent() {
    return (
      /** @type {import("../extent.js").Extent|undefined} */this.get(_Property2.default.EXTENT)
    );
  };

  /**
   * Return the maximum resolution of the layer.
   * @return {number} The maximum resolution of the layer.
   * @observable
   * @api
   */
  BaseLayer.prototype.getMaxResolution = function getMaxResolution() {
    return (/** @type {number} */this.get(_Property2.default.MAX_RESOLUTION)
    );
  };

  /**
   * Return the minimum resolution of the layer.
   * @return {number} The minimum resolution of the layer.
   * @observable
   * @api
   */
  BaseLayer.prototype.getMinResolution = function getMinResolution() {
    return (/** @type {number} */this.get(_Property2.default.MIN_RESOLUTION)
    );
  };

  /**
   * Return the opacity of the layer (between 0 and 1).
   * @return {number} The opacity of the layer.
   * @observable
   * @api
   */
  BaseLayer.prototype.getOpacity = function getOpacity() {
    return (/** @type {number} */this.get(_Property2.default.OPACITY)
    );
  };

  /**
   * @abstract
   * @return {import("../source/State.js").default} Source state.
   */
  BaseLayer.prototype.getSourceState = function getSourceState() {
    return (0, _util.abstract)();
  };

  /**
   * Return the visibility of the layer (`true` or `false`).
   * @return {boolean} The visibility of the layer.
   * @observable
   * @api
   */
  BaseLayer.prototype.getVisible = function getVisible() {
    return (/** @type {boolean} */this.get(_Property2.default.VISIBLE)
    );
  };

  /**
   * Return the Z-index of the layer, which is used to order layers before
   * rendering. The default Z-index is 0.
   * @return {number} The Z-index of the layer.
   * @observable
   * @api
   */
  BaseLayer.prototype.getZIndex = function getZIndex() {
    return (/** @type {number} */this.get(_Property2.default.Z_INDEX)
    );
  };

  /**
   * Set the extent at which the layer is visible.  If `undefined`, the layer
   * will be visible at all extents.
   * @param {import("../extent.js").Extent|undefined} extent The extent of the layer.
   * @observable
   * @api
   */
  BaseLayer.prototype.setExtent = function setExtent(extent) {
    this.set(_Property2.default.EXTENT, extent);
  };

  /**
   * Set the maximum resolution at which the layer is visible.
   * @param {number} maxResolution The maximum resolution of the layer.
   * @observable
   * @api
   */
  BaseLayer.prototype.setMaxResolution = function setMaxResolution(maxResolution) {
    this.set(_Property2.default.MAX_RESOLUTION, maxResolution);
  };

  /**
   * Set the minimum resolution at which the layer is visible.
   * @param {number} minResolution The minimum resolution of the layer.
   * @observable
   * @api
   */
  BaseLayer.prototype.setMinResolution = function setMinResolution(minResolution) {
    this.set(_Property2.default.MIN_RESOLUTION, minResolution);
  };

  /**
   * Set the opacity of the layer, allowed values range from 0 to 1.
   * @param {number} opacity The opacity of the layer.
   * @observable
   * @api
   */
  BaseLayer.prototype.setOpacity = function setOpacity(opacity) {
    this.set(_Property2.default.OPACITY, opacity);
  };

  /**
   * Set the visibility of the layer (`true` or `false`).
   * @param {boolean} visible The visibility of the layer.
   * @observable
   * @api
   */
  BaseLayer.prototype.setVisible = function setVisible(visible) {
    this.set(_Property2.default.VISIBLE, visible);
  };

  /**
   * Set Z-index of the layer, which is used to order layers before rendering.
   * The default Z-index is 0.
   * @param {number} zindex The z-index of the layer.
   * @observable
   * @api
   */
  BaseLayer.prototype.setZIndex = function setZIndex(zindex) {
    this.set(_Property2.default.Z_INDEX, zindex);
  };

  return BaseLayer;
}(_Object2.default); /**
                      * @module ol/layer/Base
                      */
exports.default = BaseLayer;

//# sourceMappingURL=Base.js.map