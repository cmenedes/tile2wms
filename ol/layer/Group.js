'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util.js');

var _Collection = require('../Collection.js');

var _Collection2 = _interopRequireDefault(_Collection);

var _CollectionEventType = require('../CollectionEventType.js');

var _CollectionEventType2 = _interopRequireDefault(_CollectionEventType);

var _Object = require('../Object.js');

var _ObjectEventType = require('../ObjectEventType.js');

var _ObjectEventType2 = _interopRequireDefault(_ObjectEventType);

var _asserts = require('../asserts.js');

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('../extent.js');

var _Base = require('./Base.js');

var _Base2 = _interopRequireDefault(_Base);

var _obj = require('../obj.js');

var _State = require('../source/State.js');

var _State2 = _interopRequireDefault(_State);

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
 * @property {Array<import("./Base.js").default>|import("../Collection.js").default<import("./Base.js").default>} [layers] Child layers.
 */

/**
 * @enum {string}
 * @private
 */
/**
 * @module ol/layer/Group
 */
var Property = {
  LAYERS: 'layers'
};

/**
 * @classdesc
 * A {@link module:ol/Collection~Collection} of layers that are handled together.
 *
 * A generic `change` event is triggered when the group/Collection changes.
 *
 * @api
 */
var LayerGroup = /*@__PURE__*/function (BaseLayer) {
  function LayerGroup(opt_options) {

    var options = opt_options || {};
    var baseOptions = /** @type {Options} */(0, _obj.assign)({}, options);
    delete baseOptions.layers;

    var layers = options.layers;

    BaseLayer.call(this, baseOptions);

    /**
     * @private
     * @type {Array<import("../events.js").EventsKey>}
     */
    this.layersListenerKeys_ = [];

    /**
     * @private
     * @type {Object<string, Array<import("../events.js").EventsKey>>}
     */
    this.listenerKeys_ = {};

    (0, _events.listen)(this, (0, _Object.getChangeEventType)(Property.LAYERS), this.handleLayersChanged_, this);

    if (layers) {
      if (Array.isArray(layers)) {
        layers = new _Collection2.default(layers.slice(), { unique: true });
      } else {
        (0, _asserts.assert)(typeof /** @type {?} */layers.getArray === 'function', 43); // Expected `layers` to be an array or a `Collection`
      }
    } else {
      layers = new _Collection2.default(undefined, { unique: true });
    }

    this.setLayers(layers);
  }

  if (BaseLayer) LayerGroup.__proto__ = BaseLayer;
  LayerGroup.prototype = Object.create(BaseLayer && BaseLayer.prototype);
  LayerGroup.prototype.constructor = LayerGroup;

  /**
   * @private
   */
  LayerGroup.prototype.handleLayerChange_ = function handleLayerChange_() {
    this.changed();
  };

  /**
   * @private
   */
  LayerGroup.prototype.handleLayersChanged_ = function handleLayersChanged_() {
    this.layersListenerKeys_.forEach(_events.unlistenByKey);
    this.layersListenerKeys_.length = 0;

    var layers = this.getLayers();
    this.layersListenerKeys_.push((0, _events.listen)(layers, _CollectionEventType2.default.ADD, this.handleLayersAdd_, this), (0, _events.listen)(layers, _CollectionEventType2.default.REMOVE, this.handleLayersRemove_, this));

    for (var id in this.listenerKeys_) {
      this.listenerKeys_[id].forEach(_events.unlistenByKey);
    }
    (0, _obj.clear)(this.listenerKeys_);

    var layersArray = layers.getArray();
    for (var i = 0, ii = layersArray.length; i < ii; i++) {
      var layer = layersArray[i];
      this.listenerKeys_[(0, _util.getUid)(layer)] = [(0, _events.listen)(layer, _ObjectEventType2.default.PROPERTYCHANGE, this.handleLayerChange_, this), (0, _events.listen)(layer, _EventType2.default.CHANGE, this.handleLayerChange_, this)];
    }

    this.changed();
  };

  /**
   * @param {import("../Collection.js").CollectionEvent} collectionEvent CollectionEvent.
   * @private
   */
  LayerGroup.prototype.handleLayersAdd_ = function handleLayersAdd_(collectionEvent) {
    var layer = /** @type {import("./Base.js").default} */collectionEvent.element;
    this.listenerKeys_[(0, _util.getUid)(layer)] = [(0, _events.listen)(layer, _ObjectEventType2.default.PROPERTYCHANGE, this.handleLayerChange_, this), (0, _events.listen)(layer, _EventType2.default.CHANGE, this.handleLayerChange_, this)];
    this.changed();
  };

  /**
   * @param {import("../Collection.js").CollectionEvent} collectionEvent CollectionEvent.
   * @private
   */
  LayerGroup.prototype.handleLayersRemove_ = function handleLayersRemove_(collectionEvent) {
    var layer = /** @type {import("./Base.js").default} */collectionEvent.element;
    var key = (0, _util.getUid)(layer);
    this.listenerKeys_[key].forEach(_events.unlistenByKey);
    delete this.listenerKeys_[key];
    this.changed();
  };

  /**
   * Returns the {@link module:ol/Collection collection} of {@link module:ol/layer/Layer~Layer layers}
   * in this group.
   * @return {!import("../Collection.js").default<import("./Base.js").default>} Collection of
   *   {@link module:ol/layer/Base layers} that are part of this group.
   * @observable
   * @api
   */
  LayerGroup.prototype.getLayers = function getLayers() {
    return (
      /** @type {!import("../Collection.js").default<import("./Base.js").default>} */this.get(Property.LAYERS)
    );
  };

  /**
   * Set the {@link module:ol/Collection collection} of {@link module:ol/layer/Layer~Layer layers}
   * in this group.
   * @param {!import("../Collection.js").default<import("./Base.js").default>} layers Collection of
   *   {@link module:ol/layer/Base layers} that are part of this group.
   * @observable
   * @api
   */
  LayerGroup.prototype.setLayers = function setLayers(layers) {
    this.set(Property.LAYERS, layers);
  };

  /**
   * @inheritDoc
   */
  LayerGroup.prototype.getLayersArray = function getLayersArray(opt_array) {
    var array = opt_array !== undefined ? opt_array : [];
    this.getLayers().forEach(function (layer) {
      layer.getLayersArray(array);
    });
    return array;
  };

  /**
   * @inheritDoc
   */
  LayerGroup.prototype.getLayerStatesArray = function getLayerStatesArray(opt_states) {
    var states = opt_states !== undefined ? opt_states : [];

    var pos = states.length;

    this.getLayers().forEach(function (layer) {
      layer.getLayerStatesArray(states);
    });

    var ownLayerState = this.getLayerState();
    for (var i = pos, ii = states.length; i < ii; i++) {
      var layerState = states[i];
      layerState.opacity *= ownLayerState.opacity;
      layerState.visible = layerState.visible && ownLayerState.visible;
      layerState.maxResolution = Math.min(layerState.maxResolution, ownLayerState.maxResolution);
      layerState.minResolution = Math.max(layerState.minResolution, ownLayerState.minResolution);
      if (ownLayerState.extent !== undefined) {
        if (layerState.extent !== undefined) {
          layerState.extent = (0, _extent.getIntersection)(layerState.extent, ownLayerState.extent);
        } else {
          layerState.extent = ownLayerState.extent;
        }
      }
    }

    return states;
  };

  /**
   * @inheritDoc
   */
  LayerGroup.prototype.getSourceState = function getSourceState() {
    return _State2.default.READY;
  };

  return LayerGroup;
}(_Base2.default);

exports.default = LayerGroup;

//# sourceMappingURL=Group.js.map