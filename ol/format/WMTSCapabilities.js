'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extent = require('../extent.js');

var _OWS = require('./OWS.js');

var _OWS2 = _interopRequireDefault(_OWS);

var _XLink = require('./XLink.js');

var _XML = require('./XML.js');

var _XML2 = _interopRequireDefault(_XML);

var _xsd = require('./xsd.js');

var _xml = require('../xml.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @const
 * @type {Array<null|string>}
 */
/**
 * @module ol/format/WMTSCapabilities
 */
var NAMESPACE_URIS = [null, 'http://www.opengis.net/wmts/1.0'];

/**
 * @const
 * @type {Array<null|string>}
 */
var OWS_NAMESPACE_URIS = [null, 'http://www.opengis.net/ows/1.1'];

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Contents': (0, _xml.makeObjectPropertySetter)(readContents)
});

/**
 * @classdesc
 * Format for reading WMTS capabilities data.
 *
 * @api
 */
var WMTSCapabilities = /*@__PURE__*/function (XML) {
  function WMTSCapabilities() {
    XML.call(this);

    /**
     * @type {OWS}
     * @private
     */
    this.owsParser_ = new _OWS2.default();
  }

  if (XML) WMTSCapabilities.__proto__ = XML;
  WMTSCapabilities.prototype = Object.create(XML && XML.prototype);
  WMTSCapabilities.prototype.constructor = WMTSCapabilities;

  /**
   * @inheritDoc
   */
  WMTSCapabilities.prototype.readFromDocument = function readFromDocument(doc) {
    for (var n = doc.firstChild; n; n = n.nextSibling) {
      if (n.nodeType == Node.ELEMENT_NODE) {
        return this.readFromNode(n);
      }
    }
    return null;
  };

  /**
   * @inheritDoc
   */
  WMTSCapabilities.prototype.readFromNode = function readFromNode(node) {
    var version = node.getAttribute('version').trim();
    var WMTSCapabilityObject = this.owsParser_.readFromNode(node);
    if (!WMTSCapabilityObject) {
      return null;
    }
    WMTSCapabilityObject['version'] = version;
    WMTSCapabilityObject = (0, _xml.pushParseAndPop)(WMTSCapabilityObject, PARSERS, node, []);
    return WMTSCapabilityObject ? WMTSCapabilityObject : null;
  };

  return WMTSCapabilities;
}(_XML2.default);

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var CONTENTS_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Layer': (0, _xml.makeObjectPropertyPusher)(readLayer),
  'TileMatrixSet': (0, _xml.makeObjectPropertyPusher)(readTileMatrixSet)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var LAYER_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Style': (0, _xml.makeObjectPropertyPusher)(readStyle),
  'Format': (0, _xml.makeObjectPropertyPusher)(_xsd.readString),
  'TileMatrixSetLink': (0, _xml.makeObjectPropertyPusher)(readTileMatrixSetLink),
  'Dimension': (0, _xml.makeObjectPropertyPusher)(readDimensions),
  'ResourceURL': (0, _xml.makeObjectPropertyPusher)(readResourceUrl)
}, (0, _xml.makeStructureNS)(OWS_NAMESPACE_URIS, {
  'Title': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Abstract': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'WGS84BoundingBox': (0, _xml.makeObjectPropertySetter)(readWgs84BoundingBox),
  'Identifier': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
}));

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var STYLE_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'LegendURL': (0, _xml.makeObjectPropertyPusher)(readLegendUrl)
}, (0, _xml.makeStructureNS)(OWS_NAMESPACE_URIS, {
  'Title': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Identifier': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
}));

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var TMS_LINKS_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'TileMatrixSet': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'TileMatrixSetLimits': (0, _xml.makeObjectPropertySetter)(readTileMatrixLimitsList)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var TMS_LIMITS_LIST_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'TileMatrixLimits': (0, _xml.makeArrayPusher)(readTileMatrixLimits)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var TMS_LIMITS_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'TileMatrix': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'MinTileRow': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'MaxTileRow': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'MinTileCol': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'MaxTileCol': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var DIMENSION_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Default': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Value': (0, _xml.makeObjectPropertyPusher)(_xsd.readString)
}, (0, _xml.makeStructureNS)(OWS_NAMESPACE_URIS, {
  'Identifier': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
}));

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var WGS84_BBOX_READERS = (0, _xml.makeStructureNS)(OWS_NAMESPACE_URIS, {
  'LowerCorner': (0, _xml.makeArrayPusher)(readCoordinates),
  'UpperCorner': (0, _xml.makeArrayPusher)(readCoordinates)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var TMS_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'WellKnownScaleSet': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'TileMatrix': (0, _xml.makeObjectPropertyPusher)(readTileMatrix)
}, (0, _xml.makeStructureNS)(OWS_NAMESPACE_URIS, {
  'SupportedCRS': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Identifier': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
}));

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var TM_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'TopLeftCorner': (0, _xml.makeObjectPropertySetter)(readCoordinates),
  'ScaleDenominator': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'TileWidth': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'TileHeight': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'MatrixWidth': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'MatrixHeight': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger)
}, (0, _xml.makeStructureNS)(OWS_NAMESPACE_URIS, {
  'Identifier': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
}));

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Attribution object.
 */
function readContents(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, CONTENTS_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Layers object.
 */
function readLayer(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, LAYER_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Tile Matrix Set object.
 */
function readTileMatrixSet(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, TMS_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Style object.
 */
function readStyle(node, objectStack) {
  var style = (0, _xml.pushParseAndPop)({}, STYLE_PARSERS, node, objectStack);
  if (!style) {
    return undefined;
  }
  var isDefault = node.getAttribute('isDefault') === 'true';
  style['isDefault'] = isDefault;
  return style;
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Tile Matrix Set Link object.
 */
function readTileMatrixSetLink(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, TMS_LINKS_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Dimension object.
 */
function readDimensions(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, DIMENSION_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Resource URL object.
 */
function readResourceUrl(node, objectStack) {
  var format = node.getAttribute('format');
  var template = node.getAttribute('template');
  var resourceType = node.getAttribute('resourceType');
  var resource = {};
  if (format) {
    resource['format'] = format;
  }
  if (template) {
    resource['template'] = template;
  }
  if (resourceType) {
    resource['resourceType'] = resourceType;
  }
  return resource;
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} WGS84 BBox object.
 */
function readWgs84BoundingBox(node, objectStack) {
  var coordinates = (0, _xml.pushParseAndPop)([], WGS84_BBOX_READERS, node, objectStack);
  if (coordinates.length != 2) {
    return undefined;
  }
  return (0, _extent.boundingExtent)(coordinates);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Legend object.
 */
function readLegendUrl(node, objectStack) {
  var legend = {};
  legend['format'] = node.getAttribute('format');
  legend['href'] = (0, _XLink.readHref)(node);
  return legend;
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Coordinates object.
 */
function readCoordinates(node, objectStack) {
  var coordinates = (0, _xsd.readString)(node).split(/\s+/);
  if (!coordinates || coordinates.length != 2) {
    return undefined;
  }
  var x = +coordinates[0];
  var y = +coordinates[1];
  if (isNaN(x) || isNaN(y)) {
    return undefined;
  }
  return [x, y];
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} TileMatrix object.
 */
function readTileMatrix(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, TM_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} TileMatrixSetLimits Object.
 */
function readTileMatrixLimitsList(node, objectStack) {
  return (0, _xml.pushParseAndPop)([], TMS_LIMITS_LIST_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} TileMatrixLimits Array.
 */
function readTileMatrixLimits(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, TMS_LIMITS_PARSERS, node, objectStack);
}

exports.default = WMTSCapabilities;

//# sourceMappingURL=WMTSCapabilities.js.map