'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortByZIndex = sortByZIndex;

var _util = require('../util.js');

var _Disposable = require('../Disposable.js');

var _Disposable2 = _interopRequireDefault(_Disposable);

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('../extent.js');

var _functions = require('../functions.js');

var _Layer = require('../layer/Layer.js');

var _IconImageCache = require('../style/IconImageCache.js');

var _transform = require('../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @abstract
 */
var MapRenderer = /*@__PURE__*/function (Disposable) {
  function MapRenderer(map) {
    Disposable.call(this);

    /**
     * @private
     * @type {import("../PluggableMap.js").default}
     */
    this.map_ = map;

    /**
     * @private
     * @type {!Object<string, import("./Layer.js").default>}
     */
    this.layerRenderers_ = {};

    /**
     * @private
     * @type {Object<string, import("../events.js").EventsKey>}
     */
    this.layerRendererListeners_ = {};

    /**
     * @private
     * @type {Array<typeof import("./Layer.js").default>}
     */
    this.layerRendererConstructors_ = [];
  }

  if (Disposable) MapRenderer.__proto__ = Disposable;
  MapRenderer.prototype = Object.create(Disposable && Disposable.prototype);
  MapRenderer.prototype.constructor = MapRenderer;

  /**
   * @abstract
   * @param {import("../render/EventType.js").default} type Event type.
   * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
   */
  MapRenderer.prototype.dispatchRenderEvent = function dispatchRenderEvent(type, frameState) {
    (0, _util.abstract)();
  };

  /**
   * Register layer renderer constructors.
   * @param {Array<typeof import("./Layer.js").default>} constructors Layer renderers.
   */
  MapRenderer.prototype.registerLayerRenderers = function registerLayerRenderers(constructors) {
    this.layerRendererConstructors_.push.apply(this.layerRendererConstructors_, constructors);
  };

  /**
   * @param {import("../PluggableMap.js").FrameState} frameState FrameState.
   * @protected
   */
  MapRenderer.prototype.calculateMatrices2D = function calculateMatrices2D(frameState) {
    var viewState = frameState.viewState;
    var coordinateToPixelTransform = frameState.coordinateToPixelTransform;
    var pixelToCoordinateTransform = frameState.pixelToCoordinateTransform;

    (0, _transform.compose)(coordinateToPixelTransform, frameState.size[0] / 2, frameState.size[1] / 2, 1 / viewState.resolution, -1 / viewState.resolution, -viewState.rotation, -viewState.center[0], -viewState.center[1]);

    (0, _transform.invert)((0, _transform.setFromArray)(pixelToCoordinateTransform, coordinateToPixelTransform));
  };

  /**
   * Removes all layer renderers.
   */
  MapRenderer.prototype.removeLayerRenderers = function removeLayerRenderers() {
    for (var key in this.layerRenderers_) {
      this.removeLayerRendererByKey_(key).dispose();
    }
  };

  /**
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../PluggableMap.js").FrameState} frameState FrameState.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {function(this: S, import("../Feature.js").FeatureLike,
   *     import("../layer/Layer.js").default): T} callback Feature callback.
   * @param {S} thisArg Value to use as `this` when executing `callback`.
   * @param {function(this: U, import("../layer/Layer.js").default): boolean} layerFilter Layer filter
   *     function, only layers which are visible and for which this function
   *     returns `true` will be tested for features.  By default, all visible
   *     layers will be tested.
   * @param {U} thisArg2 Value to use as `this` when executing `layerFilter`.
   * @return {T|undefined} Callback result.
   * @template S,T,U
   */
  MapRenderer.prototype.forEachFeatureAtCoordinate = function forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, callback, thisArg, layerFilter, thisArg2) {
    var result;
    var viewState = frameState.viewState;
    var viewResolution = viewState.resolution;

    /**
     * @param {import("../Feature.js").FeatureLike} feature Feature.
     * @param {import("../layer/Layer.js").default} layer Layer.
     * @return {?} Callback result.
     */
    function forEachFeatureAtCoordinate(feature, layer) {
      var managed = frameState.layerStates[(0, _util.getUid)(layer)].managed;
      if (!((0, _util.getUid)(feature) in frameState.skippedFeatureUids && !managed)) {
        return callback.call(thisArg, feature, managed ? layer : null);
      }
    }

    var projection = viewState.projection;

    var translatedCoordinate = coordinate;
    if (projection.canWrapX()) {
      var projectionExtent = projection.getExtent();
      var worldWidth = (0, _extent.getWidth)(projectionExtent);
      var x = coordinate[0];
      if (x < projectionExtent[0] || x > projectionExtent[2]) {
        var worldsAway = Math.ceil((projectionExtent[0] - x) / worldWidth);
        translatedCoordinate = [x + worldWidth * worldsAway, coordinate[1]];
      }
    }

    var layerStates = frameState.layerStatesArray;
    var numLayers = layerStates.length;
    var i;
    for (i = numLayers - 1; i >= 0; --i) {
      var layerState = layerStates[i];
      var layer = layerState.layer;
      if ((0, _Layer.visibleAtResolution)(layerState, viewResolution) && layerFilter.call(thisArg2, layer)) {
        var layerRenderer = this.getLayerRenderer(layer);
        var source = /** @type {import("../layer/Layer.js").default} */layer.getSource();
        if (source) {
          result = layerRenderer.forEachFeatureAtCoordinate(source.getWrapX() ? translatedCoordinate : coordinate, frameState, hitTolerance, forEachFeatureAtCoordinate);
        }
        if (result) {
          return result;
        }
      }
    }
    return undefined;
  };

  /**
   * @abstract
   * @param {import("../pixel.js").Pixel} pixel Pixel.
   * @param {import("../PluggableMap.js").FrameState} frameState FrameState.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {function(this: S, import("../layer/Layer.js").default, (Uint8ClampedArray|Uint8Array)): T} callback Layer
   *     callback.
   * @param {S} thisArg Value to use as `this` when executing `callback`.
   * @param {function(this: U, import("../layer/Layer.js").default): boolean} layerFilter Layer filter
   *     function, only layers which are visible and for which this function
   *     returns `true` will be tested for features.  By default, all visible
   *     layers will be tested.
   * @param {U} thisArg2 Value to use as `this` when executing `layerFilter`.
   * @return {T|undefined} Callback result.
   * @template S,T,U
   */
  MapRenderer.prototype.forEachLayerAtPixel = function forEachLayerAtPixel(pixel, frameState, hitTolerance, callback, thisArg, layerFilter, thisArg2) {
    return (0, _util.abstract)();
  };

  /**
   * @param {import("../coordinate.js").Coordinate} coordinate Coordinate.
   * @param {import("../PluggableMap.js").FrameState} frameState FrameState.
   * @param {number} hitTolerance Hit tolerance in pixels.
   * @param {function(this: U, import("../layer/Layer.js").default): boolean} layerFilter Layer filter
   *     function, only layers which are visible and for which this function
   *     returns `true` will be tested for features.  By default, all visible
   *     layers will be tested.
   * @param {U} thisArg Value to use as `this` when executing `layerFilter`.
   * @return {boolean} Is there a feature at the given coordinate?
   * @template U
   */
  MapRenderer.prototype.hasFeatureAtCoordinate = function hasFeatureAtCoordinate(coordinate, frameState, hitTolerance, layerFilter, thisArg) {
    var hasFeature = this.forEachFeatureAtCoordinate(coordinate, frameState, hitTolerance, _functions.TRUE, this, layerFilter, thisArg);

    return hasFeature !== undefined;
  };

  /**
   * @param {import("../layer/Base.js").default} layer Layer.
   * @protected
   * @return {import("./Layer.js").default} Layer renderer.
   */
  MapRenderer.prototype.getLayerRenderer = function getLayerRenderer(layer) {
    var layerKey = (0, _util.getUid)(layer);
    if (layerKey in this.layerRenderers_) {
      return this.layerRenderers_[layerKey];
    } else {
      var renderer;
      for (var i = 0, ii = this.layerRendererConstructors_.length; i < ii; ++i) {
        var candidate = this.layerRendererConstructors_[i];
        if (candidate['handles'](layer)) {
          renderer = candidate['create'](this, layer);
          break;
        }
      }
      if (renderer) {
        this.layerRenderers_[layerKey] = renderer;
        this.layerRendererListeners_[layerKey] = (0, _events.listen)(renderer, _EventType2.default.CHANGE, this.handleLayerRendererChange_, this);
      } else {
        throw new Error('Unable to create renderer for layer: ' + layer.getType());
      }
      return renderer;
    }
  };

  /**
   * @param {string} layerKey Layer key.
   * @protected
   * @return {import("./Layer.js").default} Layer renderer.
   */
  MapRenderer.prototype.getLayerRendererByKey = function getLayerRendererByKey(layerKey) {
    return this.layerRenderers_[layerKey];
  };

  /**
   * @protected
   * @return {Object<string, import("./Layer.js").default>} Layer renderers.
   */
  MapRenderer.prototype.getLayerRenderers = function getLayerRenderers() {
    return this.layerRenderers_;
  };

  /**
   * @return {import("../PluggableMap.js").default} Map.
   */
  MapRenderer.prototype.getMap = function getMap() {
    return this.map_;
  };

  /**
   * Handle changes in a layer renderer.
   * @private
   */
  MapRenderer.prototype.handleLayerRendererChange_ = function handleLayerRendererChange_() {
    this.map_.render();
  };

  /**
   * @param {string} layerKey Layer key.
   * @return {import("./Layer.js").default} Layer renderer.
   * @private
   */
  MapRenderer.prototype.removeLayerRendererByKey_ = function removeLayerRendererByKey_(layerKey) {
    var layerRenderer = this.layerRenderers_[layerKey];
    delete this.layerRenderers_[layerKey];

    (0, _events.unlistenByKey)(this.layerRendererListeners_[layerKey]);
    delete this.layerRendererListeners_[layerKey];

    return layerRenderer;
  };

  /**
   * @param {import("../PluggableMap.js").default} map Map.
   * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
   * @private
   */
  MapRenderer.prototype.removeUnusedLayerRenderers_ = function removeUnusedLayerRenderers_(map, frameState) {
    for (var layerKey in this.layerRenderers_) {
      if (!frameState || !(layerKey in frameState.layerStates)) {
        this.removeLayerRendererByKey_(layerKey).dispose();
      }
    }
  };

  /**
   * Render.
   * @abstract
   * @param {?import("../PluggableMap.js").FrameState} frameState Frame state.
   */
  MapRenderer.prototype.renderFrame = function renderFrame(frameState) {
    (0, _util.abstract)();
  };

  /**
   * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
   * @protected
   */
  MapRenderer.prototype.scheduleExpireIconCache = function scheduleExpireIconCache(frameState) {
    frameState.postRenderFunctions.push( /** @type {import("../PluggableMap.js").PostRenderFunction} */expireIconCache);
  };

  /**
   * @param {!import("../PluggableMap.js").FrameState} frameState Frame state.
   * @protected
   */
  MapRenderer.prototype.scheduleRemoveUnusedLayerRenderers = function scheduleRemoveUnusedLayerRenderers(frameState) {
    for (var layerKey in this.layerRenderers_) {
      if (!(layerKey in frameState.layerStates)) {
        frameState.postRenderFunctions.push(
        /** @type {import("../PluggableMap.js").PostRenderFunction} */this.removeUnusedLayerRenderers_.bind(this));
        return;
      }
    }
  };

  return MapRenderer;
}(_Disposable2.default);

/**
 * @param {import("../PluggableMap.js").default} map Map.
 * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
 */
/**
 * @module ol/renderer/Map
 */
function expireIconCache(map, frameState) {
  _IconImageCache.shared.expire();
}

/**
 * @param {import("../layer/Layer.js").State} state1 First layer state.
 * @param {import("../layer/Layer.js").State} state2 Second layer state.
 * @return {number} The zIndex difference.
 */
function sortByZIndex(state1, state2) {
  return state1.zIndex - state2.zIndex;
}
exports.default = MapRenderer;

//# sourceMappingURL=Map.js.map