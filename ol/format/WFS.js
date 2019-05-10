'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeFilter = writeFilter;

var _asserts = require('../asserts.js');

var _GML = require('./GML2.js');

var _GML2 = _interopRequireDefault(_GML);

var _GML3 = require('./GML3.js');

var _GML4 = _interopRequireDefault(_GML3);

var _GMLBase = require('./GMLBase.js');

var _GMLBase2 = _interopRequireDefault(_GMLBase);

var _filter = require('./filter.js');

var _XMLFeature = require('./XMLFeature.js');

var _XMLFeature2 = _interopRequireDefault(_XMLFeature);

var _xsd = require('./xsd.js');

var _obj = require('../obj.js');

var _proj = require('../proj.js');

var _xml = require('../xml.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
/**
 * @module ol/format/WFS
 */
var FEATURE_COLLECTION_PARSERS = {
  'http://www.opengis.net/gml': {
    'boundedBy': (0, _xml.makeObjectPropertySetter)(_GMLBase2.default.prototype.readGeometryElement, 'bounds')
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var TRANSACTION_SUMMARY_PARSERS = {
  'http://www.opengis.net/wfs': {
    'totalInserted': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
    'totalUpdated': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger),
    'totalDeleted': (0, _xml.makeObjectPropertySetter)(_xsd.readNonNegativeInteger)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var TRANSACTION_RESPONSE_PARSERS = {
  'http://www.opengis.net/wfs': {
    'TransactionSummary': (0, _xml.makeObjectPropertySetter)(readTransactionSummary, 'transactionSummary'),
    'InsertResults': (0, _xml.makeObjectPropertySetter)(readInsertResults, 'insertIds')
  }
};

/**
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 */
var QUERY_SERIALIZERS = {
  'http://www.opengis.net/wfs': {
    'PropertyName': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode)
  }
};

/**
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 */
var TRANSACTION_SERIALIZERS = {
  'http://www.opengis.net/wfs': {
    'Insert': (0, _xml.makeChildAppender)(writeFeature),
    'Update': (0, _xml.makeChildAppender)(writeUpdate),
    'Delete': (0, _xml.makeChildAppender)(writeDelete),
    'Property': (0, _xml.makeChildAppender)(writeProperty),
    'Native': (0, _xml.makeChildAppender)(writeNative)
  }
};

/**
 * @typedef {Object} Options
 * @property {Object<string, string>|string} [featureNS] The namespace URI used for features.
 * @property {Array<string>|string} [featureType] The feature type to parse. Only used for read operations.
 * @property {GMLBase} [gmlFormat] The GML format to use to parse the response. Default is `ol/format/GML3`.
 * @property {string} [schemaLocation] Optional schemaLocation to use for serialization, this will override the default.
 */

/**
 * @typedef {Object} WriteGetFeatureOptions
 * @property {string} featureNS The namespace URI used for features.
 * @property {string} featurePrefix The prefix for the feature namespace.
 * @property {Array<string>} featureTypes The feature type names.
 * @property {string} [srsName] SRS name. No srsName attribute will be set on
 * geometries when this is not provided.
 * @property {string} [handle] Handle.
 * @property {string} [outputFormat] Output format.
 * @property {number} [maxFeatures] Maximum number of features to fetch.
 * @property {string} [geometryName] Geometry name to use in a BBOX filter.
 * @property {Array<string>} [propertyNames] Optional list of property names to serialize.
 * @property {string} [viewParams] viewParams GeoServer vendor parameter.
 * @property {number} [startIndex] Start index to use for WFS paging. This is a
 * WFS 2.0 feature backported to WFS 1.1.0 by some Web Feature Services.
 * @property {number} [count] Number of features to retrieve when paging. This is a
 * WFS 2.0 feature backported to WFS 1.1.0 by some Web Feature Services. Please note that some
 * Web Feature Services have repurposed `maxfeatures` instead.
 * @property {import("../extent.js").Extent} [bbox] Extent to use for the BBOX filter.
 * @property {import("./filter/Filter.js").default} [filter] Filter condition. See
 * {@link module:ol/format/Filter} for more information.
 * @property {string} [resultType] Indicates what response should be returned,
 * E.g. `hits` only includes the `numberOfFeatures` attribute in the response and no features.
 */

/**
 * @typedef {Object} WriteTransactionOptions
 * @property {string} featureNS The namespace URI used for features.
 * @property {string} featurePrefix The prefix for the feature namespace.
 * @property {string} featureType The feature type name.
 * @property {string} [srsName] SRS name. No srsName attribute will be set on
 * geometries when this is not provided.
 * @property {string} [handle] Handle.
 * @property {boolean} [hasZ] Must be set to true if the transaction is for
 * a 3D layer. This will allow the Z coordinate to be included in the transaction.
 * @property {Array<Object>} nativeElements Native elements. Currently not supported.
 * @property {import("./GMLBase.js").Options} [gmlOptions] GML options for the WFS transaction writer.
 * @property {string} [version='1.1.0'] WFS version to use for the transaction. Can be either `1.0.0` or `1.1.0`.
 */

/**
 * Number of features; bounds/extent.
 * @typedef {Object} FeatureCollectionMetadata
 * @property {number} numberOfFeatures
 * @property {import("../extent.js").Extent} bounds
 */

/**
 * Total deleted; total inserted; total updated; array of insert ids.
 * @typedef {Object} TransactionResponse
 * @property {number} totalDeleted
 * @property {number} totalInserted
 * @property {number} totalUpdated
 * @property {Array<string>} insertIds
 */

/**
 * @type {string}
 */
var FEATURE_PREFIX = 'feature';

/**
 * @type {string}
 */
var XMLNS = 'http://www.w3.org/2000/xmlns/';

/**
 * @type {string}
 */
var OGCNS = 'http://www.opengis.net/ogc';

/**
 * @type {string}
 */
var WFSNS = 'http://www.opengis.net/wfs';

/**
 * @type {string}
 */
var FESNS = 'http://www.opengis.net/fes';

/**
 * @type {Object<string, string>}
 */
var SCHEMA_LOCATIONS = {
  '1.1.0': 'http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd',
  '1.0.0': 'http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/wfs.xsd'
};

/**
 * @const
 * @type {string}
 */
var DEFAULT_VERSION = '1.1.0';

/**
 * @classdesc
 * Feature format for reading and writing data in the WFS format.
 * By default, supports WFS version 1.1.0. You can pass a GML format
 * as option if you want to read a WFS that contains GML2 (WFS 1.0.0).
 * Also see {@link module:ol/format/GMLBase~GMLBase} which is used by this format.
 *
 * @api
 */
var WFS = /*@__PURE__*/function (XMLFeature) {
  function WFS(opt_options) {
    XMLFeature.call(this);

    var options = opt_options ? opt_options : {};

    /**
     * @private
     * @type {Array<string>|string|undefined}
     */
    this.featureType_ = options.featureType;

    /**
     * @private
     * @type {Object<string, string>|string|undefined}
     */
    this.featureNS_ = options.featureNS;

    /**
     * @private
     * @type {GMLBase}
     */
    this.gmlFormat_ = options.gmlFormat ? options.gmlFormat : new _GML4.default();

    /**
     * @private
     * @type {string}
     */
    this.schemaLocation_ = options.schemaLocation ? options.schemaLocation : SCHEMA_LOCATIONS[DEFAULT_VERSION];
  }

  if (XMLFeature) WFS.__proto__ = XMLFeature;
  WFS.prototype = Object.create(XMLFeature && XMLFeature.prototype);
  WFS.prototype.constructor = WFS;

  /**
   * @return {Array<string>|string|undefined} featureType
   */
  WFS.prototype.getFeatureType = function getFeatureType() {
    return this.featureType_;
  };

  /**
   * @param {Array<string>|string|undefined} featureType Feature type(s) to parse.
   */
  WFS.prototype.setFeatureType = function setFeatureType(featureType) {
    this.featureType_ = featureType;
  };

  /**
   * @inheritDoc
   */
  WFS.prototype.readFeaturesFromNode = function readFeaturesFromNode(node, opt_options) {
    /** @type {import("../xml.js").NodeStackItem} */
    var context = {
      node: node
    };
    (0, _obj.assign)(context, {
      'featureType': this.featureType_,
      'featureNS': this.featureNS_
    });

    (0, _obj.assign)(context, this.getReadOptions(node, opt_options ? opt_options : {}));
    var objectStack = [context];
    this.gmlFormat_.FEATURE_COLLECTION_PARSERS[_GMLBase.GMLNS]['featureMember'] = (0, _xml.makeArrayPusher)(_GMLBase2.default.prototype.readFeaturesInternal);
    var features = (0, _xml.pushParseAndPop)([], this.gmlFormat_.FEATURE_COLLECTION_PARSERS, node, objectStack, this.gmlFormat_);
    if (!features) {
      features = [];
    }
    return features;
  };

  /**
   * Read transaction response of the source.
   *
   * @param {Document|Element|Object|string} source Source.
   * @return {TransactionResponse|undefined} Transaction response.
   * @api
   */
  WFS.prototype.readTransactionResponse = function readTransactionResponse(source) {
    if (!source) {
      return undefined;
    } else if (typeof source === 'string') {
      var doc = (0, _xml.parse)(source);
      return this.readTransactionResponseFromDocument(doc);
    } else if ((0, _xml.isDocument)(source)) {
      return this.readTransactionResponseFromDocument(
      /** @type {Document} */source);
    } else {
      return this.readTransactionResponseFromNode( /** @type {Element} */source);
    }
  };

  /**
   * Read feature collection metadata of the source.
   *
   * @param {Document|Element|Object|string} source Source.
   * @return {FeatureCollectionMetadata|undefined}
   *     FeatureCollection metadata.
   * @api
   */
  WFS.prototype.readFeatureCollectionMetadata = function readFeatureCollectionMetadata(source) {
    if (!source) {
      return undefined;
    } else if (typeof source === 'string') {
      var doc = (0, _xml.parse)(source);
      return this.readFeatureCollectionMetadataFromDocument(doc);
    } else if ((0, _xml.isDocument)(source)) {
      return this.readFeatureCollectionMetadataFromDocument(
      /** @type {Document} */source);
    } else {
      return this.readFeatureCollectionMetadataFromNode(
      /** @type {Element} */source);
    }
  };

  /**
   * @param {Document} doc Document.
   * @return {FeatureCollectionMetadata|undefined}
   *     FeatureCollection metadata.
   */
  WFS.prototype.readFeatureCollectionMetadataFromDocument = function readFeatureCollectionMetadataFromDocument(doc) {
    for (var n = /** @type {Node} */doc.firstChild; n; n = n.nextSibling) {
      if (n.nodeType == Node.ELEMENT_NODE) {
        return this.readFeatureCollectionMetadataFromNode( /** @type {Element} */n);
      }
    }
    return undefined;
  };

  /**
   * @param {Element} node Node.
   * @return {FeatureCollectionMetadata|undefined}
   *     FeatureCollection metadata.
   */
  WFS.prototype.readFeatureCollectionMetadataFromNode = function readFeatureCollectionMetadataFromNode(node) {
    var result = {};
    var value = (0, _xsd.readNonNegativeIntegerString)(node.getAttribute('numberOfFeatures'));
    result['numberOfFeatures'] = value;
    return (0, _xml.pushParseAndPop)(
    /** @type {FeatureCollectionMetadata} */result, FEATURE_COLLECTION_PARSERS, node, [], this.gmlFormat_);
  };

  /**
   * @param {Document} doc Document.
   * @return {TransactionResponse|undefined} Transaction response.
   */
  WFS.prototype.readTransactionResponseFromDocument = function readTransactionResponseFromDocument(doc) {
    for (var n = /** @type {Node} */doc.firstChild; n; n = n.nextSibling) {
      if (n.nodeType == Node.ELEMENT_NODE) {
        return this.readTransactionResponseFromNode( /** @type {Element} */n);
      }
    }
    return undefined;
  };

  /**
   * @param {Element} node Node.
   * @return {TransactionResponse|undefined} Transaction response.
   */
  WFS.prototype.readTransactionResponseFromNode = function readTransactionResponseFromNode(node) {
    return (0, _xml.pushParseAndPop)(
    /** @type {TransactionResponse} */{}, TRANSACTION_RESPONSE_PARSERS, node, []);
  };

  /**
   * Encode format as WFS `GetFeature` and return the Node.
   *
   * @param {WriteGetFeatureOptions} options Options.
   * @return {Node} Result.
   * @api
   */
  WFS.prototype.writeGetFeature = function writeGetFeature$1(options) {
    var node = (0, _xml.createElementNS)(WFSNS, 'GetFeature');
    node.setAttribute('service', 'WFS');
    node.setAttribute('version', '1.1.0');
    var filter;
    if (options) {
      if (options.handle) {
        node.setAttribute('handle', options.handle);
      }
      if (options.outputFormat) {
        node.setAttribute('outputFormat', options.outputFormat);
      }
      if (options.maxFeatures !== undefined) {
        node.setAttribute('maxFeatures', String(options.maxFeatures));
      }
      if (options.resultType) {
        node.setAttribute('resultType', options.resultType);
      }
      if (options.startIndex !== undefined) {
        node.setAttribute('startIndex', String(options.startIndex));
      }
      if (options.count !== undefined) {
        node.setAttribute('count', String(options.count));
      }
      if (options.viewParams !== undefined) {
        node.setAttribute('viewParams ', options.viewParams);
      }
      filter = options.filter;
      if (options.bbox) {
        (0, _asserts.assert)(options.geometryName, 12); // `options.geometryName` must also be provided when `options.bbox` is set
        var bbox = (0, _filter.bbox)(
        /** @type {string} */options.geometryName, options.bbox, options.srsName);
        if (filter) {
          // if bbox and filter are both set, combine the two into a single filter
          filter = (0, _filter.and)(filter, bbox);
        } else {
          filter = bbox;
        }
      }
    }
    node.setAttributeNS(_xml.XML_SCHEMA_INSTANCE_URI, 'xsi:schemaLocation', this.schemaLocation_);
    /** @type {import("../xml.js").NodeStackItem} */
    var context = {
      node: node
    };
    (0, _obj.assign)(context, {
      'srsName': options.srsName,
      'featureNS': options.featureNS ? options.featureNS : this.featureNS_,
      'featurePrefix': options.featurePrefix,
      'geometryName': options.geometryName,
      'filter': filter,
      'propertyNames': options.propertyNames ? options.propertyNames : []
    });

    (0, _asserts.assert)(Array.isArray(options.featureTypes), 11); // `options.featureTypes` should be an Array
    writeGetFeature(node, /** @type {!Array<string>} */options.featureTypes, [context]);
    return node;
  };

  /**
   * Encode format as WFS `Transaction` and return the Node.
   *
   * @param {Array<import("../Feature.js").default>} inserts The features to insert.
   * @param {Array<import("../Feature.js").default>} updates The features to update.
   * @param {Array<import("../Feature.js").default>} deletes The features to delete.
   * @param {WriteTransactionOptions} options Write options.
   * @return {Node} Result.
   * @api
   */
  WFS.prototype.writeTransaction = function writeTransaction(inserts, updates, deletes, options) {
    var objectStack = [];
    var node = (0, _xml.createElementNS)(WFSNS, 'Transaction');
    var version = options.version ? options.version : DEFAULT_VERSION;
    var gmlVersion = version === '1.0.0' ? 2 : 3;
    node.setAttribute('service', 'WFS');
    node.setAttribute('version', version);
    var baseObj;
    /** @type {import("../xml.js").NodeStackItem} */
    var obj;
    if (options) {
      baseObj = options.gmlOptions ? options.gmlOptions : {};
      if (options.handle) {
        node.setAttribute('handle', options.handle);
      }
    }
    var schemaLocation = SCHEMA_LOCATIONS[version];
    node.setAttributeNS(_xml.XML_SCHEMA_INSTANCE_URI, 'xsi:schemaLocation', schemaLocation);
    var featurePrefix = options.featurePrefix ? options.featurePrefix : FEATURE_PREFIX;
    if (inserts) {
      obj = (0, _obj.assign)({ node: node }, { 'featureNS': options.featureNS,
        'featureType': options.featureType, 'featurePrefix': featurePrefix,
        'gmlVersion': gmlVersion, 'hasZ': options.hasZ, 'srsName': options.srsName });
      (0, _obj.assign)(obj, baseObj);
      (0, _xml.pushSerializeAndPop)(obj, TRANSACTION_SERIALIZERS, (0, _xml.makeSimpleNodeFactory)('Insert'), inserts, objectStack);
    }
    if (updates) {
      obj = (0, _obj.assign)({ node: node }, { 'featureNS': options.featureNS,
        'featureType': options.featureType, 'featurePrefix': featurePrefix,
        'gmlVersion': gmlVersion, 'hasZ': options.hasZ, 'srsName': options.srsName });
      (0, _obj.assign)(obj, baseObj);
      (0, _xml.pushSerializeAndPop)(obj, TRANSACTION_SERIALIZERS, (0, _xml.makeSimpleNodeFactory)('Update'), updates, objectStack);
    }
    if (deletes) {
      (0, _xml.pushSerializeAndPop)({ node: node, 'featureNS': options.featureNS,
        'featureType': options.featureType, 'featurePrefix': featurePrefix,
        'gmlVersion': gmlVersion, 'srsName': options.srsName }, TRANSACTION_SERIALIZERS, (0, _xml.makeSimpleNodeFactory)('Delete'), deletes, objectStack);
    }
    if (options.nativeElements) {
      (0, _xml.pushSerializeAndPop)({ node: node, 'featureNS': options.featureNS,
        'featureType': options.featureType, 'featurePrefix': featurePrefix,
        'gmlVersion': gmlVersion, 'srsName': options.srsName }, TRANSACTION_SERIALIZERS, (0, _xml.makeSimpleNodeFactory)('Native'), options.nativeElements, objectStack);
    }
    return node;
  };

  /**
   * @inheritDoc
   */
  WFS.prototype.readProjectionFromDocument = function readProjectionFromDocument(doc) {
    for (var n = /** @type {Node} */doc.firstChild; n; n = n.nextSibling) {
      if (n.nodeType == Node.ELEMENT_NODE) {
        return this.readProjectionFromNode(n);
      }
    }
    return null;
  };

  /**
   * @inheritDoc
   */
  WFS.prototype.readProjectionFromNode = function readProjectionFromNode(node) {
    if (node.firstElementChild && node.firstElementChild.firstElementChild) {
      node = node.firstElementChild.firstElementChild;
      for (var n = node.firstElementChild; n; n = n.nextElementSibling) {
        if (!(n.childNodes.length === 0 || n.childNodes.length === 1 && n.firstChild.nodeType === 3)) {
          var objectStack = [{}];
          this.gmlFormat_.readGeometryElement(n, objectStack);
          return (0, _proj.get)(objectStack.pop().srsName);
        }
      }
    }

    return null;
  };

  return WFS;
}(_XMLFeature2.default);

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} Transaction Summary.
 */
function readTransactionSummary(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, TRANSACTION_SUMMARY_PARSERS, node, objectStack);
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var OGC_FID_PARSERS = {
  'http://www.opengis.net/ogc': {
    'FeatureId': (0, _xml.makeArrayPusher)(function (node, objectStack) {
      return node.getAttribute('fid');
    })
  }
};

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function fidParser(node, objectStack) {
  (0, _xml.parseNode)(OGC_FID_PARSERS, node, objectStack);
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var INSERT_RESULTS_PARSERS = {
  'http://www.opengis.net/wfs': {
    'Feature': fidParser
  }
};

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Array<string>|undefined} Insert results.
 */
function readInsertResults(node, objectStack) {
  return (0, _xml.pushParseAndPop)([], INSERT_RESULTS_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {import("../Feature.js").default} feature Feature.
 * @param {Array<*>} objectStack Node stack.
 */
function writeFeature(node, feature, objectStack) {
  var context = objectStack[objectStack.length - 1];
  var featureType = context['featureType'];
  var featureNS = context['featureNS'];
  var gmlVersion = context['gmlVersion'];
  var child = (0, _xml.createElementNS)(featureNS, featureType);
  node.appendChild(child);
  if (gmlVersion === 2) {
    _GML2.default.prototype.writeFeatureElement(child, feature, objectStack);
  } else {
    _GML4.default.prototype.writeFeatureElement(child, feature, objectStack);
  }
}

/**
 * @param {Node} node Node.
 * @param {number|string} fid Feature identifier.
 * @param {Array<*>} objectStack Node stack.
 */
function writeOgcFidFilter(node, fid, objectStack) {
  var filter = (0, _xml.createElementNS)(OGCNS, 'Filter');
  var child = (0, _xml.createElementNS)(OGCNS, 'FeatureId');
  filter.appendChild(child);
  child.setAttribute('fid', /** @type {string} */fid);
  node.appendChild(filter);
}

/**
 * @param {string|undefined} featurePrefix The prefix of the feature.
 * @param {string} featureType The type of the feature.
 * @returns {string} The value of the typeName property.
 */
function getTypeName(featurePrefix, featureType) {
  featurePrefix = featurePrefix ? featurePrefix : FEATURE_PREFIX;
  var prefix = featurePrefix + ':';
  // The featureType already contains the prefix.
  if (featureType.indexOf(prefix) === 0) {
    return featureType;
  } else {
    return prefix + featureType;
  }
}

/**
 * @param {Element} node Node.
 * @param {import("../Feature.js").default} feature Feature.
 * @param {Array<*>} objectStack Node stack.
 */
function writeDelete(node, feature, objectStack) {
  var context = objectStack[objectStack.length - 1];
  (0, _asserts.assert)(feature.getId() !== undefined, 26); // Features must have an id set
  var featureType = context['featureType'];
  var featurePrefix = context['featurePrefix'];
  var featureNS = context['featureNS'];
  var typeName = getTypeName(featurePrefix, featureType);
  node.setAttribute('typeName', typeName);
  node.setAttributeNS(XMLNS, 'xmlns:' + featurePrefix, featureNS);
  var fid = feature.getId();
  if (fid !== undefined) {
    writeOgcFidFilter(node, fid, objectStack);
  }
}

/**
 * @param {Element} node Node.
 * @param {import("../Feature.js").default} feature Feature.
 * @param {Array<*>} objectStack Node stack.
 */
function writeUpdate(node, feature, objectStack) {
  var context = objectStack[objectStack.length - 1];
  (0, _asserts.assert)(feature.getId() !== undefined, 27); // Features must have an id set
  var featureType = context['featureType'];
  var featurePrefix = context['featurePrefix'];
  var featureNS = context['featureNS'];
  var typeName = getTypeName(featurePrefix, featureType);
  var geometryName = feature.getGeometryName();
  node.setAttribute('typeName', typeName);
  node.setAttributeNS(XMLNS, 'xmlns:' + featurePrefix, featureNS);
  var fid = feature.getId();
  if (fid !== undefined) {
    var keys = feature.getKeys();
    var values = [];
    for (var i = 0, ii = keys.length; i < ii; i++) {
      var value = feature.get(keys[i]);
      if (value !== undefined) {
        var name = keys[i];
        if (value && typeof /** @type {?} */value.getSimplifiedGeometry === 'function') {
          name = geometryName;
        }
        values.push({ name: name, value: value });
      }
    }
    (0, _xml.pushSerializeAndPop)( /** @type {import("../xml.js").NodeStackItem} */{ 'gmlVersion': context['gmlVersion'], node: node,
      'hasZ': context['hasZ'], 'srsName': context['srsName'] }, TRANSACTION_SERIALIZERS, (0, _xml.makeSimpleNodeFactory)('Property'), values, objectStack);
    writeOgcFidFilter(node, fid, objectStack);
  }
}

/**
 * @param {Node} node Node.
 * @param {Object} pair Property name and value.
 * @param {Array<*>} objectStack Node stack.
 */
function writeProperty(node, pair, objectStack) {
  var name = (0, _xml.createElementNS)(WFSNS, 'Name');
  var context = objectStack[objectStack.length - 1];
  var gmlVersion = context['gmlVersion'];
  node.appendChild(name);
  (0, _xsd.writeStringTextNode)(name, pair.name);
  if (pair.value !== undefined && pair.value !== null) {
    var value = (0, _xml.createElementNS)(WFSNS, 'Value');
    node.appendChild(value);
    if (pair.value && typeof /** @type {?} */pair.value.getSimplifiedGeometry === 'function') {
      if (gmlVersion === 2) {
        _GML2.default.prototype.writeGeometryElement(value, pair.value, objectStack);
      } else {
        _GML4.default.prototype.writeGeometryElement(value, pair.value, objectStack);
      }
    } else {
      (0, _xsd.writeStringTextNode)(value, pair.value);
    }
  }
}

/**
 * @param {Element} node Node.
 * @param {{vendorId: string, safeToIgnore: boolean, value: string}} nativeElement The native element.
 * @param {Array<*>} objectStack Node stack.
 */
function writeNative(node, nativeElement, objectStack) {
  if (nativeElement.vendorId) {
    node.setAttribute('vendorId', nativeElement.vendorId);
  }
  if (nativeElement.safeToIgnore !== undefined) {
    node.setAttribute('safeToIgnore', String(nativeElement.safeToIgnore));
  }
  if (nativeElement.value !== undefined) {
    (0, _xsd.writeStringTextNode)(node, nativeElement.value);
  }
}

/**
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 */
var GETFEATURE_SERIALIZERS = {
  'http://www.opengis.net/wfs': {
    'Query': (0, _xml.makeChildAppender)(writeQuery)
  },
  'http://www.opengis.net/ogc': {
    'During': (0, _xml.makeChildAppender)(writeDuringFilter),
    'And': (0, _xml.makeChildAppender)(writeLogicalFilter),
    'Or': (0, _xml.makeChildAppender)(writeLogicalFilter),
    'Not': (0, _xml.makeChildAppender)(writeNotFilter),
    'BBOX': (0, _xml.makeChildAppender)(writeBboxFilter),
    'Contains': (0, _xml.makeChildAppender)(writeContainsFilter),
    'Intersects': (0, _xml.makeChildAppender)(writeIntersectsFilter),
    'Within': (0, _xml.makeChildAppender)(writeWithinFilter),
    'PropertyIsEqualTo': (0, _xml.makeChildAppender)(writeComparisonFilter),
    'PropertyIsNotEqualTo': (0, _xml.makeChildAppender)(writeComparisonFilter),
    'PropertyIsLessThan': (0, _xml.makeChildAppender)(writeComparisonFilter),
    'PropertyIsLessThanOrEqualTo': (0, _xml.makeChildAppender)(writeComparisonFilter),
    'PropertyIsGreaterThan': (0, _xml.makeChildAppender)(writeComparisonFilter),
    'PropertyIsGreaterThanOrEqualTo': (0, _xml.makeChildAppender)(writeComparisonFilter),
    'PropertyIsNull': (0, _xml.makeChildAppender)(writeIsNullFilter),
    'PropertyIsBetween': (0, _xml.makeChildAppender)(writeIsBetweenFilter),
    'PropertyIsLike': (0, _xml.makeChildAppender)(writeIsLikeFilter)
  }
};

/**
 * @param {Element} node Node.
 * @param {string} featureType Feature type.
 * @param {Array<*>} objectStack Node stack.
 */
function writeQuery(node, featureType, objectStack) {
  var context = /** @type {Object} */objectStack[objectStack.length - 1];
  var featurePrefix = context['featurePrefix'];
  var featureNS = context['featureNS'];
  var propertyNames = context['propertyNames'];
  var srsName = context['srsName'];
  var typeName;
  // If feature prefix is not defined, we must not use the default prefix.
  if (featurePrefix) {
    typeName = getTypeName(featurePrefix, featureType);
  } else {
    typeName = featureType;
  }
  node.setAttribute('typeName', typeName);
  if (srsName) {
    node.setAttribute('srsName', srsName);
  }
  if (featureNS) {
    node.setAttributeNS(XMLNS, 'xmlns:' + featurePrefix, featureNS);
  }
  var item = /** @type {import("../xml.js").NodeStackItem} */(0, _obj.assign)({}, context);
  item.node = node;
  (0, _xml.pushSerializeAndPop)(item, QUERY_SERIALIZERS, (0, _xml.makeSimpleNodeFactory)('PropertyName'), propertyNames, objectStack);
  var filter = context['filter'];
  if (filter) {
    var child = (0, _xml.createElementNS)(OGCNS, 'Filter');
    node.appendChild(child);
    writeFilterCondition(child, filter, objectStack);
  }
}

/**
 * @param {Node} node Node.
 * @param {import("./filter/Filter.js").default} filter Filter.
 * @param {Array<*>} objectStack Node stack.
 */
function writeFilterCondition(node, filter, objectStack) {
  /** @type {import("../xml.js").NodeStackItem} */
  var item = { node: node };
  (0, _xml.pushSerializeAndPop)(item, GETFEATURE_SERIALIZERS, (0, _xml.makeSimpleNodeFactory)(filter.getTagName()), [filter], objectStack);
}

/**
 * @param {Node} node Node.
 * @param {import("./filter/Bbox.js").default} filter Filter.
 * @param {Array<*>} objectStack Node stack.
 */
function writeBboxFilter(node, filter, objectStack) {
  var context = objectStack[objectStack.length - 1];
  context['srsName'] = filter.srsName;

  writeOgcPropertyName(node, filter.geometryName);
  _GML4.default.prototype.writeGeometryElement(node, filter.extent, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {import("./filter/Contains.js").default} filter Filter.
 * @param {Array<*>} objectStack Node stack.
 */
function writeContainsFilter(node, filter, objectStack) {
  var context = objectStack[objectStack.length - 1];
  context['srsName'] = filter.srsName;

  writeOgcPropertyName(node, filter.geometryName);
  _GML4.default.prototype.writeGeometryElement(node, filter.geometry, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {import("./filter/Intersects.js").default} filter Filter.
 * @param {Array<*>} objectStack Node stack.
 */
function writeIntersectsFilter(node, filter, objectStack) {
  var context = objectStack[objectStack.length - 1];
  context['srsName'] = filter.srsName;

  writeOgcPropertyName(node, filter.geometryName);
  _GML4.default.prototype.writeGeometryElement(node, filter.geometry, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {import("./filter/Within.js").default} filter Filter.
 * @param {Array<*>} objectStack Node stack.
 */
function writeWithinFilter(node, filter, objectStack) {
  var context = objectStack[objectStack.length - 1];
  context['srsName'] = filter.srsName;

  writeOgcPropertyName(node, filter.geometryName);
  _GML4.default.prototype.writeGeometryElement(node, filter.geometry, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {import("./filter/During.js").default} filter Filter.
 * @param {Array<*>} objectStack Node stack.
 */
function writeDuringFilter(node, filter, objectStack) {

  var valueReference = (0, _xml.createElementNS)(FESNS, 'ValueReference');
  (0, _xsd.writeStringTextNode)(valueReference, filter.propertyName);
  node.appendChild(valueReference);

  var timePeriod = (0, _xml.createElementNS)(_GMLBase.GMLNS, 'TimePeriod');

  node.appendChild(timePeriod);

  var begin = (0, _xml.createElementNS)(_GMLBase.GMLNS, 'begin');
  timePeriod.appendChild(begin);
  writeTimeInstant(begin, filter.begin);

  var end = (0, _xml.createElementNS)(_GMLBase.GMLNS, 'end');
  timePeriod.appendChild(end);
  writeTimeInstant(end, filter.end);
}

/**
 * @param {Node} node Node.
 * @param {import("./filter/LogicalNary.js").default} filter Filter.
 * @param {Array<*>} objectStack Node stack.
 */
function writeLogicalFilter(node, filter, objectStack) {
  /** @type {import("../xml.js").NodeStackItem} */
  var item = { node: node };
  var conditions = filter.conditions;
  for (var i = 0, ii = conditions.length; i < ii; ++i) {
    var condition = conditions[i];
    (0, _xml.pushSerializeAndPop)(item, GETFEATURE_SERIALIZERS, (0, _xml.makeSimpleNodeFactory)(condition.getTagName()), [condition], objectStack);
  }
}

/**
 * @param {Node} node Node.
 * @param {import("./filter/Not.js").default} filter Filter.
 * @param {Array<*>} objectStack Node stack.
 */
function writeNotFilter(node, filter, objectStack) {
  /** @type {import("../xml.js").NodeStackItem} */
  var item = { node: node };
  var condition = filter.condition;
  (0, _xml.pushSerializeAndPop)(item, GETFEATURE_SERIALIZERS, (0, _xml.makeSimpleNodeFactory)(condition.getTagName()), [condition], objectStack);
}

/**
 * @param {Element} node Node.
 * @param {import("./filter/ComparisonBinary.js").default} filter Filter.
 * @param {Array<*>} objectStack Node stack.
 */
function writeComparisonFilter(node, filter, objectStack) {
  if (filter.matchCase !== undefined) {
    node.setAttribute('matchCase', filter.matchCase.toString());
  }
  writeOgcPropertyName(node, filter.propertyName);
  writeOgcLiteral(node, '' + filter.expression);
}

/**
 * @param {Node} node Node.
 * @param {import("./filter/IsNull.js").default} filter Filter.
 * @param {Array<*>} objectStack Node stack.
 */
function writeIsNullFilter(node, filter, objectStack) {
  writeOgcPropertyName(node, filter.propertyName);
}

/**
 * @param {Node} node Node.
 * @param {import("./filter/IsBetween.js").default} filter Filter.
 * @param {Array<*>} objectStack Node stack.
 */
function writeIsBetweenFilter(node, filter, objectStack) {
  writeOgcPropertyName(node, filter.propertyName);

  var lowerBoundary = (0, _xml.createElementNS)(OGCNS, 'LowerBoundary');
  node.appendChild(lowerBoundary);
  writeOgcLiteral(lowerBoundary, '' + filter.lowerBoundary);

  var upperBoundary = (0, _xml.createElementNS)(OGCNS, 'UpperBoundary');
  node.appendChild(upperBoundary);
  writeOgcLiteral(upperBoundary, '' + filter.upperBoundary);
}

/**
 * @param {Element} node Node.
 * @param {import("./filter/IsLike.js").default} filter Filter.
 * @param {Array<*>} objectStack Node stack.
 */
function writeIsLikeFilter(node, filter, objectStack) {
  node.setAttribute('wildCard', filter.wildCard);
  node.setAttribute('singleChar', filter.singleChar);
  node.setAttribute('escapeChar', filter.escapeChar);
  if (filter.matchCase !== undefined) {
    node.setAttribute('matchCase', filter.matchCase.toString());
  }
  writeOgcPropertyName(node, filter.propertyName);
  writeOgcLiteral(node, '' + filter.pattern);
}

/**
 * @param {string} tagName Tag name.
 * @param {Node} node Node.
 * @param {string} value Value.
 */
function writeOgcExpression(tagName, node, value) {
  var property = (0, _xml.createElementNS)(OGCNS, tagName);
  (0, _xsd.writeStringTextNode)(property, value);
  node.appendChild(property);
}

/**
 * @param {Node} node Node.
 * @param {string} value PropertyName value.
 */
function writeOgcPropertyName(node, value) {
  writeOgcExpression('PropertyName', node, value);
}

/**
 * @param {Node} node Node.
 * @param {string} value PropertyName value.
 */
function writeOgcLiteral(node, value) {
  writeOgcExpression('Literal', node, value);
}

/**
 * @param {Node} node Node.
 * @param {string} time PropertyName value.
 */
function writeTimeInstant(node, time) {
  var timeInstant = (0, _xml.createElementNS)(_GMLBase.GMLNS, 'TimeInstant');
  node.appendChild(timeInstant);

  var timePosition = (0, _xml.createElementNS)(_GMLBase.GMLNS, 'timePosition');
  timeInstant.appendChild(timePosition);
  (0, _xsd.writeStringTextNode)(timePosition, time);
}

/**
 * Encode filter as WFS `Filter` and return the Node.
 *
 * @param {import("./filter/Filter.js").default} filter Filter.
 * @return {Node} Result.
 * @api
 */
function writeFilter(filter) {
  var child = (0, _xml.createElementNS)(OGCNS, 'Filter');
  writeFilterCondition(child, filter, []);
  return child;
}

/**
 * @param {Node} node Node.
 * @param {Array<string>} featureTypes Feature types.
 * @param {Array<*>} objectStack Node stack.
 */
function writeGetFeature(node, featureTypes, objectStack) {
  var context = /** @type {Object} */objectStack[objectStack.length - 1];
  var item = /** @type {import("../xml.js").NodeStackItem} */(0, _obj.assign)({}, context);
  item.node = node;
  (0, _xml.pushSerializeAndPop)(item, GETFEATURE_SERIALIZERS, (0, _xml.makeSimpleNodeFactory)('Query'), featureTypes, objectStack);
}

exports.default = WFS;

//# sourceMappingURL=WFS.js.map