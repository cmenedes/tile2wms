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
 * @module ol/format/OWS
 */
var NAMESPACE_URIS = [null, 'http://www.opengis.net/ows/1.1'];

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'ServiceIdentification': (0, _xml.makeObjectPropertySetter)(readServiceIdentification),
  'ServiceProvider': (0, _xml.makeObjectPropertySetter)(readServiceProvider),
  'OperationsMetadata': (0, _xml.makeObjectPropertySetter)(readOperationsMetadata)
});

var OWS = /*@__PURE__*/function (XML) {
  function OWS() {
    XML.call(this);
  }

  if (XML) OWS.__proto__ = XML;
  OWS.prototype = Object.create(XML && XML.prototype);
  OWS.prototype.constructor = OWS;

  /**
   * @inheritDoc
   */
  OWS.prototype.readFromDocument = function readFromDocument(doc) {
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
  OWS.prototype.readFromNode = function readFromNode(node) {
    var owsObject = (0, _xml.pushParseAndPop)({}, PARSERS, node, []);
    return owsObject ? owsObject : null;
  };

  return OWS;
}(_XML2.default);

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var ADDRESS_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'DeliveryPoint': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'City': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'AdministrativeArea': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'PostalCode': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Country': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'ElectronicMailAddress': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var ALLOWED_VALUES_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Value': (0, _xml.makeObjectPropertyPusher)(readValue)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var CONSTRAINT_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'AllowedValues': (0, _xml.makeObjectPropertySetter)(readAllowedValues)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var CONTACT_INFO_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Phone': (0, _xml.makeObjectPropertySetter)(readPhone),
  'Address': (0, _xml.makeObjectPropertySetter)(readAddress)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var DCP_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'HTTP': (0, _xml.makeObjectPropertySetter)(readHttp)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var HTTP_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Get': (0, _xml.makeObjectPropertyPusher)(readGet),
  'Post': undefined // TODO
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var OPERATION_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'DCP': (0, _xml.makeObjectPropertySetter)(readDcp)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var OPERATIONS_METADATA_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Operation': readOperation
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var PHONE_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Voice': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Facsimile': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var REQUEST_METHOD_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Constraint': (0, _xml.makeObjectPropertyPusher)(readConstraint)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var SERVICE_CONTACT_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'IndividualName': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'PositionName': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'ContactInfo': (0, _xml.makeObjectPropertySetter)(readContactInfo)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var SERVICE_IDENTIFICATION_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Abstract': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'AccessConstraints': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Fees': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'Title': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'ServiceTypeVersion': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'ServiceType': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var SERVICE_PROVIDER_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'ProviderName': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'ProviderSite': (0, _xml.makeObjectPropertySetter)(_XLink.readHref),
  'ServiceContact': (0, _xml.makeObjectPropertySetter)(readServiceContact)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The address.
 */
function readAddress(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, ADDRESS_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The values.
 */
function readAllowedValues(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, ALLOWED_VALUES_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The constraint.
 */
function readConstraint(node, objectStack) {
  var name = node.getAttribute('name');
  if (!name) {
    return undefined;
  }
  return (0, _xml.pushParseAndPop)({ 'name': name }, CONSTRAINT_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The contact info.
 */
function readContactInfo(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, CONTACT_INFO_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The DCP.
 */
function readDcp(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, DCP_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The GET object.
 */
function readGet(node, objectStack) {
  var href = (0, _XLink.readHref)(node);
  if (!href) {
    return undefined;
  }
  return (0, _xml.pushParseAndPop)({ 'href': href }, REQUEST_METHOD_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The HTTP object.
 */
function readHttp(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, HTTP_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The operation.
 */
function readOperation(node, objectStack) {
  var name = node.getAttribute('name');
  var value = (0, _xml.pushParseAndPop)({}, OPERATION_PARSERS, node, objectStack);
  if (!value) {
    return undefined;
  }
  var object = /** @type {Object} */
  objectStack[objectStack.length - 1];
  object[name] = value;
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The operations metadata.
 */
function readOperationsMetadata(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, OPERATIONS_METADATA_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The phone.
 */
function readPhone(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, PHONE_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The service identification.
 */
function readServiceIdentification(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, SERVICE_IDENTIFICATION_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The service contact.
 */
function readServiceContact(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, SERVICE_CONTACT_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object|undefined} The service provider.
 */
function readServiceProvider(node, objectStack) {
  return (0, _xml.pushParseAndPop)({}, SERVICE_PROVIDER_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {string|undefined} The value.
 */
function readValue(node, objectStack) {
  return (0, _xsd.readString)(node);
}

exports.default = OWS;

//# sourceMappingURL=OWS.js.map