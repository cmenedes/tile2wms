'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _PluggableMap = require('./PluggableMap.js');

var _PluggableMap2 = _interopRequireDefault(_PluggableMap);

var _util = require('./control/util.js');

var _interaction = require('./interaction.js');

var _obj = require('./obj.js');

var _ImageLayer = require('./renderer/canvas/ImageLayer.js');

var _ImageLayer2 = _interopRequireDefault(_ImageLayer);

var _Map = require('./renderer/canvas/Map.js');

var _Map2 = _interopRequireDefault(_Map);

var _TileLayer = require('./renderer/canvas/TileLayer.js');

var _TileLayer2 = _interopRequireDefault(_TileLayer);

var _VectorLayer = require('./renderer/canvas/VectorLayer.js');

var _VectorLayer2 = _interopRequireDefault(_VectorLayer);

var _VectorTileLayer = require('./renderer/canvas/VectorTileLayer.js');

var _VectorTileLayer2 = _interopRequireDefault(_VectorTileLayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * The map is the core component of OpenLayers. For a map to render, a view,
 * one or more layers, and a target container are needed:
 *
 *     import Map from 'ol/Map';
 *     import View from 'ol/View';
 *     import TileLayer from 'ol/layer/Tile';
 *     import OSM from 'ol/source/OSM';
 *
 *     var map = new Map({
 *       view: new View({
 *         center: [0, 0],
 *         zoom: 1
 *       }),
 *       layers: [
 *         new TileLayer({
 *           source: new OSM()
 *         })
 *       ],
 *       target: 'map'
 *     });
 *
 * The above snippet creates a map using a {@link module:ol/layer/Tile} to
 * display {@link module:ol/source/OSM~OSM} OSM data and render it to a DOM
 * element with the id `map`.
 *
 * The constructor places a viewport container (with CSS class name
 * `ol-viewport`) in the target element (see `getViewport()`), and then two
 * further elements within the viewport: one with CSS class name
 * `ol-overlaycontainer-stopevent` for controls and some overlays, and one with
 * CSS class name `ol-overlaycontainer` for other overlays (see the `stopEvent`
 * option of {@link module:ol/Overlay~Overlay} for the difference). The map
 * itself is placed in a further element within the viewport.
 *
 * Layers are stored as a {@link module:ol/Collection~Collection} in
 * layerGroups. A top-level group is provided by the library. This is what is
 * accessed by `getLayerGroup` and `setLayerGroup`. Layers entered in the
 * options are added to this group, and `addLayer` and `removeLayer` change the
 * layer collection in the group. `getLayers` is a convenience function for
 * `getLayerGroup().getLayers()`. Note that {@link module:ol/layer/Group~Group}
 * is a subclass of {@link module:ol/layer/Base}, so layers entered in the
 * options or added with `addLayer` can be groups, which can contain further
 * groups, and so on.
 *
 * @fires import("./MapBrowserEvent.js").MapBrowserEvent
 * @fires import("./MapEvent.js").MapEvent
 * @fires module:ol/render/Event~RenderEvent#postcompose
 * @fires module:ol/render/Event~RenderEvent#precompose
 * @api
 */
var Map = /*@__PURE__*/function (PluggableMap) {
  function Map(options) {
    options = (0, _obj.assign)({}, options);
    if (!options.controls) {
      options.controls = (0, _util.defaults)();
    }
    if (!options.interactions) {
      options.interactions = (0, _interaction.defaults)();
    }

    PluggableMap.call(this, options);
  }

  if (PluggableMap) Map.__proto__ = PluggableMap;
  Map.prototype = Object.create(PluggableMap && PluggableMap.prototype);
  Map.prototype.constructor = Map;

  Map.prototype.createRenderer = function createRenderer() {
    var renderer = new _Map2.default(this);
    renderer.registerLayerRenderers([_ImageLayer2.default, _TileLayer2.default, _VectorLayer2.default, _VectorTileLayer2.default]);
    return renderer;
  };

  return Map;
}(_PluggableMap2.default); /**
                            * @module ol/Map
                            */
exports.default = Map;

//# sourceMappingURL=Map.js.map