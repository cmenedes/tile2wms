'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _array = require('../array.js');

var _Feature = require('../Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _Feature3 = require('./Feature.js');

var _XMLFeature = require('./XMLFeature.js');

var _XMLFeature2 = _interopRequireDefault(_XMLFeature);

var _GeometryLayout = require('../geom/GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _LineString = require('../geom/LineString.js');

var _LineString2 = _interopRequireDefault(_LineString);

var _Point = require('../geom/Point.js');

var _Point2 = _interopRequireDefault(_Point);

var _Polygon = require('../geom/Polygon.js');

var _Polygon2 = _interopRequireDefault(_Polygon);

var _obj = require('../obj.js');

var _proj = require('../proj.js');

var _xml = require('../xml.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @const
 * @type {Array<null>}
 */
var NAMESPACE_URIS = [null];

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
/**
 * @module ol/format/OSMXML
 */
// FIXME add typedef for stack state objects
var WAY_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'nd': readNd,
  'tag': readTag
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'node': readNode,
  'way': readWay
});

/**
 * @classdesc
 * Feature format for reading data in the
 * [OSMXML format](http://wiki.openstreetmap.org/wiki/OSM_XML).
 *
 * @api
 */
var OSMXML = /*@__PURE__*/function (XMLFeature) {
  function OSMXML() {
    XMLFeature.call(this);

    /**
     * @inheritDoc
     */
    this.dataProjection = (0, _proj.get)('EPSG:4326');
  }

  if (XMLFeature) OSMXML.__proto__ = XMLFeature;
  OSMXML.prototype = Object.create(XMLFeature && XMLFeature.prototype);
  OSMXML.prototype.constructor = OSMXML;

  /**
   * @inheritDoc
   */
  OSMXML.prototype.readFeaturesFromNode = function readFeaturesFromNode(node, opt_options) {
    var options = this.getReadOptions(node, opt_options);
    if (node.localName == 'osm') {
      var state = (0, _xml.pushParseAndPop)({
        nodes: {},
        ways: [],
        features: []
      }, PARSERS, node, [options]);
      // parse nodes in ways
      for (var j = 0; j < state.ways.length; j++) {
        var values = /** @type {Object} */state.ways[j];
        /** @type {Array<number>} */
        var flatCoordinates = [];
        for (var i = 0, ii = values.ndrefs.length; i < ii; i++) {
          var point = state.nodes[values.ndrefs[i]];
          (0, _array.extend)(flatCoordinates, point);
        }
        var geometry = void 0;
        if (values.ndrefs[0] == values.ndrefs[values.ndrefs.length - 1]) {
          // closed way
          geometry = new _Polygon2.default(flatCoordinates, _GeometryLayout2.default.XY, [flatCoordinates.length]);
        } else {
          geometry = new _LineString2.default(flatCoordinates, _GeometryLayout2.default.XY);
        }
        (0, _Feature3.transformWithOptions)(geometry, false, options);
        var feature = new _Feature2.default(geometry);
        feature.setId(values.id);
        feature.setProperties(values.tags);
        state.features.push(feature);
      }
      if (state.features) {
        return state.features;
      }
    }
    return [];
  };

  return OSMXML;
}(_XMLFeature2.default);

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var NODE_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'tag': readTag
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function readNode(node, objectStack) {
  var options = /** @type {import("./Feature.js").ReadOptions} */objectStack[0];
  var state = /** @type {Object} */objectStack[objectStack.length - 1];
  var id = node.getAttribute('id');
  /** @type {import("../coordinate.js").Coordinate} */
  var coordinates = [parseFloat(node.getAttribute('lon')), parseFloat(node.getAttribute('lat'))];
  state.nodes[id] = coordinates;

  var values = (0, _xml.pushParseAndPop)({
    tags: {}
  }, NODE_PARSERS, node, objectStack);
  if (!(0, _obj.isEmpty)(values.tags)) {
    var geometry = new _Point2.default(coordinates);
    (0, _Feature3.transformWithOptions)(geometry, false, options);
    var feature = new _Feature2.default(geometry);
    feature.setId(id);
    feature.setProperties(values.tags);
    state.features.push(feature);
  }
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function readWay(node, objectStack) {
  var id = node.getAttribute('id');
  var values = (0, _xml.pushParseAndPop)({
    id: id,
    ndrefs: [],
    tags: {}
  }, WAY_PARSERS, node, objectStack);
  var state = /** @type {Object} */objectStack[objectStack.length - 1];
  state.ways.push(values);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function readNd(node, objectStack) {
  var values = /** @type {Object} */objectStack[objectStack.length - 1];
  values.ndrefs.push(node.getAttribute('ref'));
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function readTag(node, objectStack) {
  var values = /** @type {Object} */objectStack[objectStack.length - 1];
  values.tags[node.getAttribute('k')] = node.getAttribute('v');
}

exports.default = OSMXML;

//# sourceMappingURL=OSMXML.js.map