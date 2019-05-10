'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
 * @module ol/format/WMSCapabilities
 */
var NAMESPACE_URIS = [null, 'http://www.opengis.net/wms'];

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Service': (0, _xml.makeObjectPropertySetter)(readService),
  'Capability': (0, _xml.makeObjectPropertySetter)(readCapability)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var CAPABILITY_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Request': (0, _xml.makeObjectPropertySetter)(readRequest),
  'Exception': (0, _xml.makeObjectPropertySetter)(readException),
  'Layer': (0, _xml.makeObjectPropertySetter)(readCapabilityLayer)
});

/**
 * @classdesc
 * Format for reading WMS capabilities data
 *
 * @api
 */
var WMSCapabilities = /*@__PURE__*/function (XML) {
  function WMSCapabilities() {
    XML.call(this);

    /**
     * @type {string|undefined}
     */
    this.version = undefined;
  }

  if (XML) WMSCapabilities.__proto__ = XML;
  WMSCapabilities.prototype = Object.create(XML && XML.prototype);
  WMSCapabilities.prototype.constructor = WMSCapabilities;

  /**
   * @inheritDoc
   */
  WMSCapabilities.prototype.readFromDocument = function readFromDocument(doc) {
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
  WMSCapabilities.prototype.readFromNode = function readFromNode(node) {
    this.version = node.getAttribute('version').trim();
    var wmsCapabilityObject = (0, _xml.pushParseAndPop)({
      'version': this.version
    }, PARSERS, node, []);
    return wmsCapabilityObject ? wmsCapabilityObject : null;
  };

  return WMSCapabilities;
}(_XML2.default);

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var SERVICE_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Name': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Title': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Abstract': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'KeywordList': (0, _xml.makeObjectPropertySetter)(readKeywordList),
  'OnlineResource': (0, _xml.makeObjectPropertySetter)(_XLink.readHref),
  'ContactInformation': (0, _xml.makeObjectPropertySetter)(readContactInformation),
  'Fees': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'AccessConstraints': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'LayerLimit': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'MaxWidth': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
  'MaxHeight': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var CONTACT_INFORMATION_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'ContactPersonPrimary': (0, _xml.makeObjectPropertySetter)(readContactPersonPrimary),
  'ContactPosition': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'ContactAddress': (0, _xml.makeObjectPropertySetter)(readContactAddress),
  'ContactVoiceTelephone': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'ContactFacsimileTelephone': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'ContactElectronicMailAddress': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var CONTACT_PERSON_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'ContactPerson': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'ContactOrganization': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var CONTACT_ADDRESS_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'AddressType': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Address': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'City': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'StateOrProvince': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'PostCode': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Country': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var EXCEPTION_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Format': (0, _xml.makeArrayPusher)(_xsd.readString)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var LAYER_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Name': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Title': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Abstract': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'KeywordList': (0, _xml.makeObjectPropertySetter)(readKeywordList),
  'CRS': (0, _xml.makeObjectPropertyPusher)(_xsd.readString),
  'EX_GeographicBoundingBox': (0, _xml.makeObjectPropertySetter)(readEXGeographicBoundingBox),
  'BoundingBox': (0, _xml.makeObjectPropertyPusher)(readBoundingBox),
  'Dimension': (0, _xml.makeObjectPropertyPusher)(readDimension),
  'Attribution': (0, _xml.makeObjectPropertySetter)(readAttribution),
  'AuthorityURL': (0, _xml.makeObjectPropertyPusher)(readAuthorityURL),
  'Identifier': (0, _xml.makeObjectPropertyPusher)(_xsd.readString),
  'MetadataURL': (0, _xml.makeObjectPropertyPusher)(readMetadataURL),
  'DataURL': (0, _xml.makeObjectPropertyPusher)(readFormatOnlineresource),
  'FeatureListURL': (0, _xml.makeObjectPropertyPusher)(readFormatOnlineresource),
  'Style': (0, _xml.makeObjectPropertyPusher)(readStyle),
  'MinScaleDenominator': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'MaxScaleDenominator': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'Layer': (0, _xml.makeObjectPropertyPusher)(readLayer)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var ATTRIBUTION_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Title': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'OnlineResource': (0, _xml.makeObjectPropertySetter)(_XLink.readHref),
  'LogoURL': (0, _xml.makeObjectPropertySetter)(readSizedFormatOnlineresource)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var EX_GEOGRAPHIC_BOUNDING_BOX_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'westBoundLongitude': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'eastBoundLongitude': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'southBoundLatitude': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'northBoundLatitude': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var REQUEST_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'GetCapabilities': (0, _xml.makeObjectPropertySetter)(readOperationType),
  'GetMap': (0, _xml.makeObjectPropertySetter)(readOperationType),
  'GetFeatureInfo': (0, _xml.makeObjectPropertySetter)(readOperationType)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var OPERATIONTYPE_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Format': (0, _xml.makeObjectPropertyPusher)(_xsd.readString),
  'DCPType': (0, _xml.makeObjectPropertyPusher)(readDCPType)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var DCPTYPE_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'HTTP': (0, _xml.makeObjectPropertySetter)(readHTTP)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var HTTP_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Get': (0, _xml.makeObjectPropertySetter)(readFormatOnlineresource),
  'Post': (0, _xml.makeObjectPropertySetter)(readFormatOnlineresource)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var STYLE_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Name': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Title': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Abstract': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'LegendURL': (0, _xml.makeObjectPropertyPusher)(readSizedFormatOnlineresource),
  'StyleSheetURL': (0, _xml.makeObjectPropertySetter)(readFormatOnlineresource),
  'StyleURL': (0, _xml.makeObjectPropertySetter)(readFormatOnlineresource)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var FORMAT_ONLINERESOURCE_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Format': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'OnlineResource': (0, _xml.makeObjectPropertySetter)(_XLink.readHref)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var KEYWORDLIST_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Keyword': (0, _xml.makeArrayPusher)(_xsd.readString)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Attribution object.
 */
function readAttribution(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, ATTRIBUTION_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object} Bounding box object.
 */
function readBoundingBox(node, objectStack) {
  var extent = [(0, _xsd.readDecimalString)(node.getAttribute('minx')), (0, _xsd.readDecimalString)(node.getAttribute('miny')), (0, _xsd.readDecimalString)(node.getAttribute('maxx')), (0, _xsd.readDecimalString)(node.getAttribute('maxy'))];

  var resolutions = [(0, _xsd.readDecimalString)(node.getAttribute('resx')), (0, _xsd.readDecimalString)(node.getAttribute('resy'))];

  return {
    'crs': node.getAttribute('CRS'),
    'extent': extent,
    'res': resolutions
  };
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {import("../extent.js").Extent|undefined} Bounding box object.
 */
function readEXGeographicBoundingBox(node, objectStack) {
  var geographicBoundingBox = (0, _xml.pushParseAndPop)({}, EX_GEOGRAPHIC_BOUNDING_BOX_PARSERS, node, objectStack);
  if (!geographicBoundingBox) {
    return undefined;
  }
  var westBoundLongitude = /** @type {number|undefined} */
  geographicBoundingBox['westBoundLongitude'];
  var southBoundLatitude = /** @type {number|undefined} */
  geographicBoundingBox['southBoundLatitude'];
  var eastBoundLongitude = /** @type {number|undefined} */
  geographicBoundingBox['eastBoundLongitude'];
  var northBoundLatitude = /** @type {number|undefined} */
  geographicBoundingBox['northBoundLatitude'];
  if (westBoundLongitude === undefined || southBoundLatitude === undefined || eastBoundLongitude === undefined || northBoundLatitude === undefined) {
    return undefined;
  }
  return [westBoundLongitude, southBoundLatitude, eastBoundLongitude, northBoundLatitude];
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Capability object.
 */
function readCapability(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, CAPABILITY_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Service object.
 */
function readService(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, SERVICE_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Contact information object.
 */
function readContactInformation(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, CONTACT_INFORMATION_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Contact person object.
 */
function readContactPersonPrimary(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, CONTACT_PERSON_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Contact address object.
 */
function readContactAddress(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, CONTACT_ADDRESS_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Array<string>|undefined} Format array.
 */
function readException(node, objectStack) {
  return (0, _xml.pushParseAndPop)([], EXCEPTION_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Layer object.
 */
function readCapabilityLayer(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, LAYER_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Layer object.
 */
function readLayer(node, objectStack) {
  var parentLayerObject = /**  @type {!Object<string,*>} */objectStack[objectStack.length - 1];

  var layerObject = (0, _xml.pushParseAndPop)({}, LAYER_PARSERS, node, objectStack);

  if (!layerObject) {
    return undefined;
  }
  var queryable = (0, _xsd.readBooleanString)(node.getAttribute('queryable'));
  if (queryable === undefined) {
    queryable = parentLayerObject['queryable'];
  }
  layerObject['queryable'] = queryable !== undefined ? queryable : false;

  var cascaded = (0, _xsd.readNonNegativeIntegerString)(node.getAttribute('cascaded'));
  if (cascaded === undefined) {
    cascaded = parentLayerObject['cascaded'];
  }
  layerObject['cascaded'] = cascaded;

  var opaque = (0, _xsd.readBooleanString)(node.getAttribute('opaque'));
  if (opaque === undefined) {
    opaque = parentLayerObject['opaque'];
  }
  layerObject['opaque'] = opaque !== undefined ? opaque : false;

  var noSubsets = (0, _xsd.readBooleanString)(node.getAttribute('noSubsets'));
  if (noSubsets === undefined) {
    noSubsets = parentLayerObject['noSubsets'];
  }
  layerObject['noSubsets'] = noSubsets !== undefined ? noSubsets : false;

  var fixedWidth = (0, _xsd.readDecimalString)(node.getAttribute('fixedWidth'));
  if (!fixedWidth) {
    fixedWidth = parentLayerObject['fixedWidth'];
  }
  layerObject['fixedWidth'] = fixedWidth;

  var fixedHeight = (0, _xsd.readDecimalString)(node.getAttribute('fixedHeight'));
  if (!fixedHeight) {
    fixedHeight = parentLayerObject['fixedHeight'];
  }
  layerObject['fixedHeight'] = fixedHeight;

  // See 7.2.4.8
  var addKeys = ['Style', 'CRS', 'AuthorityURL'];
  addKeys.forEach(function (key) {
    if (key in parentLayerObject) {
      var childValue = layerObject[key] || [];
      layerObject[key] = childValue.concat(parentLayerObject[key]);
    }
  });

  var replaceKeys = ['EX_GeographicBoundingBox', 'BoundingBox', 'Dimension', 'Attribution', 'MinScaleDenominator', 'MaxScaleDenominator'];
  replaceKeys.forEach(function (key) {
    if (!(key in layerObject)) {
      var parentValue = parentLayerObject[key];
      layerObject[key] = parentValue;
    }
  });

  return layerObject;
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object} Dimension object.
 */
function readDimension(node, objectStack) {
  var dimensionObject = {
    'name': node.getAttribute('name'),
    'units': node.getAttribute('units'),
    'unitSymbol': node.getAttribute('unitSymbol'),
    'default': node.getAttribute('default'),
    'multipleValues': (0, _xsd.readBooleanString)(node.getAttribute('multipleValues')),
    'nearestValue': (0, _xsd.readBooleanString)(node.getAttribute('nearestValue')),
    'current': (0, _xsd.readBooleanString)(node.getAttribute('current')),
    'values': (0, _xsd.readString)(node)
  };
  return dimensionObject;
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Online resource object.
 */
function readFormatOnlineresource(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, FORMAT_ONLINERESOURCE_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Request object.
 */
function readRequest(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, REQUEST_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} DCP type object.
 */
function readDCPType(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, DCPTYPE_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} HTTP object.
 */
function readHTTP(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, HTTP_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Operation type object.
 */
function readOperationType(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, OPERATIONTYPE_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Online resource object.
 */
function readSizedFormatOnlineresource(node, objectStack) {
  var formatOnlineresource = readFormatOnlineresource(node, objectStack);
  if (formatOnlineresource) {
    var size = [(0, _xsd.readNonNegativeIntegerString)(node.getAttribute('width')), (0, _xsd.readNonNegativeIntegerString)(node.getAttribute('height'))];
    formatOnlineresource['size'] = size;
    return formatOnlineresource;
  }
  return undefined;
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Authority URL object.
 */
function readAuthorityURL(node, objectStack) {
  var authorityObject = readFormatOnlineresource(node, objectStack);
  if (authorityObject) {
    authorityObject['name'] = node.getAttribute('name');
    return authorityObject;
  }
  return undefined;
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Metadata URL object.
 */
function readMetadataURL(node, objectStack) {
  var metadataObject = readFormatOnlineresource(node, objectStack);
  if (metadataObject) {
    metadataObject['type'] = node.getAttribute('type');
    return metadataObject;
  }
  return undefined;
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Style object.
 */
function readStyle(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, STYLE_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Array<string>|undefined} Keyword list.
 */
function readKeywordList(node, objectStack) {
  return (0, _xml.pushParseAndPop)([], KEYWORDLIST_PARSERS, node, objectStack);
}

exports.default = WMSCapabilities;

//# sourceMappingURL=WMSCapabilities.js.map