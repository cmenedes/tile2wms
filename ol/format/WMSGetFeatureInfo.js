'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _array = require('../array.js');

var _GML = require('./GML2.js');

var _GML2 = _interopRequireDefault(_GML);

var _XMLFeature = require('./XMLFeature.js');

var _XMLFeature2 = _interopRequireDefault(_XMLFeature);

var _obj = require('../obj.js');

var _xml = require('../xml.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} Options
 * @property {Array<string>} [layers] If set, only features of the given layers will be returned by the format when read.
 */

/**
 * @const
 * @type {string}
 */
var featureIdentifier = '_feature';

/**
 * @const
 * @type {string}
 */
/**
 * @module ol/format/WMSGetFeatureInfo
 */
var layerIdentifier = '_layer';

/**
 * @classdesc
 * Format for reading WMSGetFeatureInfo format. It uses
 * {@link module:ol/format/GML2~GML2} to read features.
 *
 * @api
 */
var WMSGetFeatureInfo = /*@__PURE__*/function (XMLFeature) {
  function WMSGetFeatureInfo(opt_options) {
    XMLFeature.call(this);

    var options = opt_options ? opt_options : {};

    /**
     * @private
     * @type {string}
     */
    this.featureNS_ = 'http://mapserver.gis.umn.edu/mapserver';

    /**
     * @private
     * @type {GML2}
     */
    this.gmlFormat_ = new _GML2.default();

    /**
     * @private
     * @type {Array<string>}
     */
    this.layers_ = options.layers ? options.layers : null;
  }

  if (XMLFeature) WMSGetFeatureInfo.__proto__ = XMLFeature;
  WMSGetFeatureInfo.prototype = Object.create(XMLFeature && XMLFeature.prototype);
  WMSGetFeatureInfo.prototype.constructor = WMSGetFeatureInfo;

  /**
   * @return {Array<string>} layers
   */
  WMSGetFeatureInfo.prototype.getLayers = function getLayers() {
    return this.layers_;
  };

  /**
   * @param {Array<string>} layers Layers to parse.
   */
  WMSGetFeatureInfo.prototype.setLayers = function setLayers(layers) {
    this.layers_ = layers;
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<import("../Feature.js").default>} Features.
   * @private
   */
  WMSGetFeatureInfo.prototype.readFeatures_ = function readFeatures_(node, objectStack) {
    node.setAttribute('namespaceURI', this.featureNS_);
    var localName = node.localName;
    /** @type {Array<import("../Feature.js").default>} */
    var features = [];
    if (node.childNodes.length === 0) {
      return features;
    }
    if (localName == 'msGMLOutput') {
      for (var i = 0, ii = node.childNodes.length; i < ii; i++) {
        var layer = node.childNodes[i];
        if (layer.nodeType !== Node.ELEMENT_NODE) {
          continue;
        }

        var layerElement = /** @type {Element} */layer;
        var context = objectStack[0];

        var toRemove = layerIdentifier;
        var layerName = layerElement.localName.replace(toRemove, '');

        if (this.layers_ && !(0, _array.includes)(this.layers_, layerName)) {
          continue;
        }

        var featureType = layerName + featureIdentifier;

        context['featureType'] = featureType;
        context['featureNS'] = this.featureNS_;

        /** @type {Object<string, import("../xml.js").Parser>} */
        var parsers = {};
        parsers[featureType] = (0, _xml.makeArrayPusher)(this.gmlFormat_.readFeatureElement, this.gmlFormat_);
        var parsersNS = (0, _xml.makeStructureNS)([context['featureNS'], null], parsers);
        layerElement.setAttribute('namespaceURI', this.featureNS_);
        var layerFeatures = (0, _xml.pushParseAndPop)([], parsersNS, layerElement, objectStack, this.gmlFormat_);
        if (layerFeatures) {
          (0, _array.extend)(features, layerFeatures);
        }
      }
    }
    if (localName == 'FeatureCollection') {
      var gmlFeatures = (0, _xml.pushParseAndPop)([], this.gmlFormat_.FEATURE_COLLECTION_PARSERS, node, [{}], this.gmlFormat_);
      if (gmlFeatures) {
        features = gmlFeatures;
      }
    }
    return features;
  };

  /**
   * @inheritDoc
   */
  WMSGetFeatureInfo.prototype.readFeaturesFromNode = function readFeaturesFromNode(node, opt_options) {
    var options = {};
    if (opt_options) {
      (0, _obj.assign)(options, this.getReadOptions(node, opt_options));
    }
    return this.readFeatures_(node, [options]);
  };

  return WMSGetFeatureInfo;
}(_XMLFeature2.default);

exports.default = WMSGetFeatureInfo;

//# sourceMappingURL=WMSGetFeatureInfo.js.map