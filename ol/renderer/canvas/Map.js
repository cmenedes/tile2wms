'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.layerRendererConstructors = undefined;

var _transform = require('../../transform.js');

var _array = require('../../array.js');

var _css = require('../../css.js');

var _dom = require('../../dom.js');

var _Layer = require('../../layer/Layer.js');

var _Event = require('../../render/Event.js');

var _Event2 = _interopRequireDefault(_Event);

var _EventType = require('../../render/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _canvas = require('../../render/canvas.js');

var _Immediate = require('../../render/canvas/Immediate.js');

var _Immediate2 = _interopRequireDefault(_Immediate);

var _Map = require('../Map.js');

var _Map2 = _interopRequireDefault(_Map);

var _State = require('../../source/State.js');

var _State2 = _interopRequireDefault(_State);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @type {Array<typeof import("../Layer.js").default>}
 */
var layerRendererConstructors = exports.layerRendererConstructors = [];

/**
 * @classdesc
 * Canvas map renderer.
 * @api
 */
/**
 * @module ol/renderer/canvas/Map
 */
var CanvasMapRenderer = /*@__PURE__*/function (MapRenderer) {
  function CanvasMapRenderer(map) {
    MapRenderer.call(this, map);

    var container = map.getViewport();

    /**
     * @private
     * @type {CanvasRenderingContext2D}
     */
    this.context_ = (0, _dom.createCanvasContext2D)();

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    this.canvas_ = this.context_.canvas;

    this.canvas_.style.width = '100%';
    this.canvas_.style.height = '100%';
    this.canvas_.style.display = 'block';
    this.canvas_.className = _css.CLASS_UNSELECTABLE;
    container.insertBefore(this.canvas_, container.childNodes[0] || null);

    /**
     * @private
     * @type {boolean}
     */
    this.renderedVisible_ = true;

    /**
     * @private
     * @type {import("../../transform.js").Transform}
     */
    this.transform_ = (0, _transform.create)();
  }

  if (MapRenderer) CanvasMapRenderer.__proto__ = MapRenderer;
  CanvasMapRenderer.prototype = Object.create(MapRenderer && MapRenderer.prototype);
  CanvasMapRenderer.prototype.constructor = CanvasMapRenderer;

  /**
   * @param {import("../../render/EventType.js").default} type Event type.
   * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
   */
  CanvasMapRenderer.prototype.dispatchRenderEvent = function dispatchRenderEvent(type, frameState) {
    var map = this.getMap();
    var context = this.context_;
    if (map.hasListener(type)) {
      var extent = frameState.extent;
      var pixelRatio = frameState.pixelRatio;
      var viewState = frameState.viewState;
      var rotation = viewState.rotation;

      var transform = this.getTransform(frameState);

      var vectorContext = new _Immediate2.default(context, pixelRatio, extent, transform, rotation);
      var composeEvent = new _Event2.default(type, vectorContext, frameState, context, null);
      map.dispatchEvent(composeEvent);
    }
  };

  /**
   * @param {import("../../PluggableMap.js").FrameState} frameState Frame state.
   * @protected
   * @return {!import("../../transform.js").Transform} Transform.
   */
  CanvasMapRenderer.prototype.getTransform = function getTransform(frameState) {
    var viewState = frameState.viewState;
    var dx1 = this.canvas_.width / 2;
    var dy1 = this.canvas_.height / 2;
    var sx = frameState.pixelRatio / viewState.resolution;
    var sy = -sx;
    var angle = -viewState.rotation;
    var dx2 = -viewState.center[0];
    var dy2 = -viewState.center[1];
    return (0, _transform.compose)(this.transform_, dx1, dy1, sx, sy, angle, dx2, dy2);
  };

  /**
   * @inheritDoc
   */
  CanvasMapRenderer.prototype.renderFrame = function renderFrame(frameState) {

    if (!frameState) {
      if (this.renderedVisible_) {
        this.canvas_.style.display = 'none';
        this.renderedVisible_ = false;
      }
      return;
    }

    var context = this.context_;
    var pixelRatio = frameState.pixelRatio;
    var width = Math.round(frameState.size[0] * pixelRatio);
    var height = Math.round(frameState.size[1] * pixelRatio);
    if (this.canvas_.width != width || this.canvas_.height != height) {
      this.canvas_.width = width;
      this.canvas_.height = height;
    } else {
      context.clearRect(0, 0, width, height);
    }

    var rotation = frameState.viewState.rotation;

    this.calculateMatrices2D(frameState);

    this.dispatchRenderEvent(_EventType2.default.PRECOMPOSE, frameState);

    var layerStatesArray = frameState.layerStatesArray;
    (0, _array.stableSort)(layerStatesArray, _Map.sortByZIndex);

    if (rotation) {
      context.save();
      (0, _canvas.rotateAtOffset)(context, rotation, width / 2, height / 2);
    }

    var viewResolution = frameState.viewState.resolution;
    var i, ii;
    for (i = 0, ii = layerStatesArray.length; i < ii; ++i) {
      var layerState = layerStatesArray[i];
      var layer = layerState.layer;
      var layerRenderer = /** @type {import("./Layer.js").default} */this.getLayerRenderer(layer);
      if (!(0, _Layer.visibleAtResolution)(layerState, viewResolution) || layerState.sourceState != _State2.default.READY) {
        continue;
      }
      if (layerRenderer.prepareFrame(frameState, layerState)) {
        layerRenderer.composeFrame(frameState, layerState, context);
      }
    }

    if (rotation) {
      context.restore();
    }

    this.dispatchRenderEvent(_EventType2.default.POSTCOMPOSE, frameState);

    if (!this.renderedVisible_) {
      this.canvas_.style.display = '';
      this.renderedVisible_ = true;
    }

    this.scheduleRemoveUnusedLayerRenderers(frameState);
    this.scheduleExpireIconCache(frameState);
  };

  /**
   * @inheritDoc
   */
  CanvasMapRenderer.prototype.forEachLayerAtPixel = function forEachLayerAtPixel(pixel, frameState, hitTolerance, callback, thisArg, layerFilter, thisArg2) {
    var result;
    var viewState = frameState.viewState;
    var viewResolution = viewState.resolution;

    var layerStates = frameState.layerStatesArray;
    var numLayers = layerStates.length;

    var coordinate = (0, _transform.apply)(frameState.pixelToCoordinateTransform, pixel.slice());

    var i;
    for (i = numLayers - 1; i >= 0; --i) {
      var layerState = layerStates[i];
      var layer = layerState.layer;
      if ((0, _Layer.visibleAtResolution)(layerState, viewResolution) && layerFilter.call(thisArg2, layer)) {
        var layerRenderer = /** @type {import("./Layer.js").default} */this.getLayerRenderer(layer);
        result = layerRenderer.forEachLayerAtCoordinate(coordinate, frameState, hitTolerance, callback, thisArg);
        if (result) {
          return result;
        }
      }
    }
    return undefined;
  };

  /**
   * @inheritDoc
   */
  CanvasMapRenderer.prototype.registerLayerRenderers = function registerLayerRenderers(constructors) {
    MapRenderer.prototype.registerLayerRenderers.call(this, constructors);
    for (var i = 0, ii = constructors.length; i < ii; ++i) {
      var ctor = constructors[i];
      if (!(0, _array.includes)(layerRendererConstructors, ctor)) {
        layerRendererConstructors.push(ctor);
      }
    }
  };

  return CanvasMapRenderer;
}(_Map2.default);

exports.default = CanvasMapRenderer;

//# sourceMappingURL=Map.js.map