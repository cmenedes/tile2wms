'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * @module ol/format/KML
                                                                                                                                                                                                                                                                               */


exports.getDefaultFillStyle = getDefaultFillStyle;
exports.getDefaultImageStyle = getDefaultImageStyle;
exports.getDefaultStrokeStyle = getDefaultStrokeStyle;
exports.getDefaultTextStyle = getDefaultTextStyle;
exports.getDefaultStyle = getDefaultStyle;
exports.getDefaultStyleArray = getDefaultStyleArray;
exports.readFlatCoordinates = readFlatCoordinates;

var _Feature = require('../Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _array = require('../array.js');

var _asserts = require('../asserts.js');

var _color = require('../color.js');

var _Feature3 = require('./Feature.js');

var _XMLFeature = require('./XMLFeature.js');

var _XMLFeature2 = _interopRequireDefault(_XMLFeature);

var _xsd = require('./xsd.js');

var _GeometryCollection = require('../geom/GeometryCollection.js');

var _GeometryCollection2 = _interopRequireDefault(_GeometryCollection);

var _GeometryLayout = require('../geom/GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _LineString = require('../geom/LineString.js');

var _LineString2 = _interopRequireDefault(_LineString);

var _MultiLineString = require('../geom/MultiLineString.js');

var _MultiLineString2 = _interopRequireDefault(_MultiLineString);

var _MultiPoint = require('../geom/MultiPoint.js');

var _MultiPoint2 = _interopRequireDefault(_MultiPoint);

var _MultiPolygon = require('../geom/MultiPolygon.js');

var _MultiPolygon2 = _interopRequireDefault(_MultiPolygon);

var _Point = require('../geom/Point.js');

var _Point2 = _interopRequireDefault(_Point);

var _Polygon = require('../geom/Polygon.js');

var _Polygon2 = _interopRequireDefault(_Polygon);

var _math = require('../math.js');

var _proj = require('../proj.js');

var _Fill = require('../style/Fill.js');

var _Fill2 = _interopRequireDefault(_Fill);

var _Icon = require('../style/Icon.js');

var _Icon2 = _interopRequireDefault(_Icon);

var _IconAnchorUnits = require('../style/IconAnchorUnits.js');

var _IconAnchorUnits2 = _interopRequireDefault(_IconAnchorUnits);

var _IconOrigin = require('../style/IconOrigin.js');

var _IconOrigin2 = _interopRequireDefault(_IconOrigin);

var _Stroke = require('../style/Stroke.js');

var _Stroke2 = _interopRequireDefault(_Stroke);

var _Style = require('../style/Style.js');

var _Style2 = _interopRequireDefault(_Style);

var _Text = require('../style/Text.js');

var _Text2 = _interopRequireDefault(_Text);

var _xml = require('../xml.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} Vec2
 * @property {number} x
 * @property {IconAnchorUnits} xunits
 * @property {number} y
 * @property {IconAnchorUnits} yunits
 * @property {IconOrigin} origin
 */

/**
 * @typedef {Object} GxTrackObject
 * @property {Array<number>} flatCoordinates
 * @property {Array<number>} whens
 */

/**
 * @const
 * @type {Array<string>}
 */
var GX_NAMESPACE_URIS = ['http://www.google.com/kml/ext/2.2'];

/**
 * @const
 * @type {Array<null|string>}
 */
var NAMESPACE_URIS = [null, 'http://earth.google.com/kml/2.0', 'http://earth.google.com/kml/2.1', 'http://earth.google.com/kml/2.2', 'http://www.opengis.net/kml/2.2'];

/**
 * @const
 * @type {string}
 */
var SCHEMA_LOCATION = 'http://www.opengis.net/kml/2.2 ' + 'https://developers.google.com/kml/schema/kml22gx.xsd';

/**
 * @type {Object<string, IconAnchorUnits>}
 */
var ICON_ANCHOR_UNITS_MAP = {
  'fraction': _IconAnchorUnits2.default.FRACTION,
  'pixels': _IconAnchorUnits2.default.PIXELS,
  'insetPixels': _IconAnchorUnits2.default.PIXELS
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var PLACEMARK_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'ExtendedData': extendedDataParser,
  'Region': regionParser,
  'MultiGeometry': (0, _xml.makeObjectPropertySetter)(readMultiGeometry, 'geometry'),
  'LineString': (0, _xml.makeObjectPropertySetter)(readLineString, 'geometry'),
  'LinearRing': (0, _xml.makeObjectPropertySetter)(readLinearRing, 'geometry'),
  'Point': (0, _xml.makeObjectPropertySetter)(readPoint, 'geometry'),
  'Polygon': (0, _xml.makeObjectPropertySetter)(readPolygon, 'geometry'),
  'Style': (0, _xml.makeObjectPropertySetter)(readStyle),
  'StyleMap': placemarkStyleMapParser,
  'address': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'description': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'name': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'open': (0, _xml.makeObjectPropertySetter)(_xsd.readBoolean),
  'phoneNumber': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'styleUrl': (0, _xml.makeObjectPropertySetter)(readURI),
  'visibility': (0, _xml.makeObjectPropertySetter)(_xsd.readBoolean)
}, (0, _xml.makeStructureNS)(GX_NAMESPACE_URIS, {
  'MultiTrack': (0, _xml.makeObjectPropertySetter)(readGxMultiTrack, 'geometry'),
  'Track': (0, _xml.makeObjectPropertySetter)(readGxTrack, 'geometry')
}));

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var NETWORK_LINK_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'ExtendedData': extendedDataParser,
  'Region': regionParser,
  'Link': linkParser,
  'address': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'description': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'name': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'open': (0, _xml.makeObjectPropertySetter)(_xsd.readBoolean),
  'phoneNumber': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'visibility': (0, _xml.makeObjectPropertySetter)(_xsd.readBoolean)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var LINK_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'href': (0, _xml.makeObjectPropertySetter)(readURI)
});

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var REGION_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'LatLonAltBox': latLonAltBoxParser,
  'Lod': lodParser
});

/**
 * @const
 * @type {Object<string, Array<string>>}
 */
var KML_SEQUENCE = (0, _xml.makeStructureNS)(NAMESPACE_URIS, ['Document', 'Placemark']);

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 */
var KML_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Document': (0, _xml.makeChildAppender)(writeDocument),
  'Placemark': (0, _xml.makeChildAppender)(writePlacemark)
});

/**
 * @type {import("../color.js").Color}
 */
var DEFAULT_COLOR;

/**
 * @type {Fill}
 */
var DEFAULT_FILL_STYLE = null;

/**
 * Get the default fill style (or null if not yet set).
 * @return {Fill} The default fill style.
 */
function getDefaultFillStyle() {
  return DEFAULT_FILL_STYLE;
}

/**
 * @type {import("../size.js").Size}
 */
var DEFAULT_IMAGE_STYLE_ANCHOR;

/**
 * @type {IconAnchorUnits}
 */
var DEFAULT_IMAGE_STYLE_ANCHOR_X_UNITS;

/**
 * @type {IconAnchorUnits}
 */
var DEFAULT_IMAGE_STYLE_ANCHOR_Y_UNITS;

/**
 * @type {import("../size.js").Size}
 */
var DEFAULT_IMAGE_STYLE_SIZE;

/**
 * @type {string}
 */
var DEFAULT_IMAGE_STYLE_SRC;

/**
 * @type {number}
 */
var DEFAULT_IMAGE_SCALE_MULTIPLIER;

/**
 * @type {import("../style/Image.js").default}
 */
var DEFAULT_IMAGE_STYLE = null;

/**
 * Get the default image style (or null if not yet set).
 * @return {import("../style/Image.js").default} The default image style.
 */
function getDefaultImageStyle() {
  return DEFAULT_IMAGE_STYLE;
}

/**
 * @type {string}
 */
var DEFAULT_NO_IMAGE_STYLE;

/**
 * @type {Stroke}
 */
var DEFAULT_STROKE_STYLE = null;

/**
 * Get the default stroke style (or null if not yet set).
 * @return {Stroke} The default stroke style.
 */
function getDefaultStrokeStyle() {
  return DEFAULT_STROKE_STYLE;
}

/**
 * @type {Stroke}
 */
var DEFAULT_TEXT_STROKE_STYLE;

/**
 * @type {Text}
 */
var DEFAULT_TEXT_STYLE = null;

/**
 * Get the default text style (or null if not yet set).
 * @return {Text} The default text style.
 */
function getDefaultTextStyle() {
  return DEFAULT_TEXT_STYLE;
}

/**
 * @type {Style}
 */
var DEFAULT_STYLE = null;

/**
 * Get the default style (or null if not yet set).
 * @return {Style} The default style.
 */
function getDefaultStyle() {
  return DEFAULT_STYLE;
}

/**
 * @type {Array<Style>}
 */
var DEFAULT_STYLE_ARRAY = null;

/**
 * Get the default style array (or null if not yet set).
 * @return {Array<Style>} The default style.
 */
function getDefaultStyleArray() {
  return DEFAULT_STYLE_ARRAY;
}

function createStyleDefaults() {

  DEFAULT_COLOR = [255, 255, 255, 1];

  DEFAULT_FILL_STYLE = new _Fill2.default({
    color: DEFAULT_COLOR
  });

  DEFAULT_IMAGE_STYLE_ANCHOR = [20, 2]; // FIXME maybe [8, 32] ?

  DEFAULT_IMAGE_STYLE_ANCHOR_X_UNITS = _IconAnchorUnits2.default.PIXELS;

  DEFAULT_IMAGE_STYLE_ANCHOR_Y_UNITS = _IconAnchorUnits2.default.PIXELS;

  DEFAULT_IMAGE_STYLE_SIZE = [64, 64];

  DEFAULT_IMAGE_STYLE_SRC = 'https://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png';

  DEFAULT_IMAGE_SCALE_MULTIPLIER = 0.5;

  DEFAULT_IMAGE_STYLE = new _Icon2.default({
    anchor: DEFAULT_IMAGE_STYLE_ANCHOR,
    anchorOrigin: _IconOrigin2.default.BOTTOM_LEFT,
    anchorXUnits: DEFAULT_IMAGE_STYLE_ANCHOR_X_UNITS,
    anchorYUnits: DEFAULT_IMAGE_STYLE_ANCHOR_Y_UNITS,
    crossOrigin: 'anonymous',
    rotation: 0,
    scale: DEFAULT_IMAGE_SCALE_MULTIPLIER,
    size: DEFAULT_IMAGE_STYLE_SIZE,
    src: DEFAULT_IMAGE_STYLE_SRC
  });

  DEFAULT_NO_IMAGE_STYLE = 'NO_IMAGE';

  DEFAULT_STROKE_STYLE = new _Stroke2.default({
    color: DEFAULT_COLOR,
    width: 1
  });

  DEFAULT_TEXT_STROKE_STYLE = new _Stroke2.default({
    color: [51, 51, 51, 1],
    width: 2
  });

  DEFAULT_TEXT_STYLE = new _Text2.default({
    font: 'bold 16px Helvetica',
    fill: DEFAULT_FILL_STYLE,
    stroke: DEFAULT_TEXT_STROKE_STYLE,
    scale: 0.8
  });

  DEFAULT_STYLE = new _Style2.default({
    fill: DEFAULT_FILL_STYLE,
    image: DEFAULT_IMAGE_STYLE,
    text: DEFAULT_TEXT_STYLE,
    stroke: DEFAULT_STROKE_STYLE,
    zIndex: 0
  });

  DEFAULT_STYLE_ARRAY = [DEFAULT_STYLE];
}

/**
 * @typedef {Object} Options
 * @property {boolean} [extractStyles=true] Extract styles from the KML.
 * @property {boolean} [showPointNames=true] Show names as labels for placemarks which contain points.
 * @property {Array<Style>} [defaultStyle] Default style. The
 * default default style is the same as Google Earth.
 * @property {boolean} [writeStyles=true] Write styles into KML.
 */

/**
 * @classdesc
 * Feature format for reading and writing data in the KML format.
 *
 * {@link module:ol/format/KML~KML#readFeature} will read the first feature from
 * a KML source.
 *
 * MultiGeometries are converted into GeometryCollections if they are a mix of
 * geometry types, and into MultiPoint/MultiLineString/MultiPolygon if they are
 * all of the same type.
 *
 * Note that the KML format uses the URL() constructor. Older browsers such as IE
 * which do not support this will need a URL polyfill to be loaded before use.
 *
 * @api
 */
var KML = /*@__PURE__*/function (XMLFeature) {
  function KML(opt_options) {
    XMLFeature.call(this);

    var options = opt_options ? opt_options : {};

    if (!DEFAULT_STYLE_ARRAY) {
      createStyleDefaults();
    }

    /**
     * @inheritDoc
     */
    this.dataProjection = (0, _proj.get)('EPSG:4326');

    /**
     * @private
     * @type {Array<Style>}
     */
    this.defaultStyle_ = options.defaultStyle ? options.defaultStyle : DEFAULT_STYLE_ARRAY;

    /**
     * @private
     * @type {boolean}
     */
    this.extractStyles_ = options.extractStyles !== undefined ? options.extractStyles : true;

    /**
     * @private
     * @type {boolean}
     */
    this.writeStyles_ = options.writeStyles !== undefined ? options.writeStyles : true;

    /**
     * @private
     * @type {!Object<string, (Array<Style>|string)>}
     */
    this.sharedStyles_ = {};

    /**
     * @private
     * @type {boolean}
     */
    this.showPointNames_ = options.showPointNames !== undefined ? options.showPointNames : true;
  }

  if (XMLFeature) KML.__proto__ = XMLFeature;
  KML.prototype = Object.create(XMLFeature && XMLFeature.prototype);
  KML.prototype.constructor = KML;

  /**
   * @param {Node} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   * @return {Array<Feature>|undefined} Features.
   */
  KML.prototype.readDocumentOrFolder_ = function readDocumentOrFolder_(node, objectStack) {
    // FIXME use scope somehow
    var parsersNS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
      'Document': (0, _xml.makeArrayExtender)(this.readDocumentOrFolder_, this),
      'Folder': (0, _xml.makeArrayExtender)(this.readDocumentOrFolder_, this),
      'Placemark': (0, _xml.makeArrayPusher)(this.readPlacemark_, this),
      'Style': this.readSharedStyle_.bind(this),
      'StyleMap': this.readSharedStyleMap_.bind(this)
    });
    /** @type {Array<Feature>} */
    var features = (0, _xml.pushParseAndPop)([], parsersNS, node, objectStack, this);
    if (features) {
      return features;
    } else {
      return undefined;
    }
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   * @return {Feature|undefined} Feature.
   */
  KML.prototype.readPlacemark_ = function readPlacemark_(node, objectStack) {
    var object = (0, _xml.pushParseAndPop)({ 'geometry': null }, PLACEMARK_PARSERS, node, objectStack);
    if (!object) {
      return undefined;
    }
    var feature = new _Feature2.default();
    var id = node.getAttribute('id');
    if (id !== null) {
      feature.setId(id);
    }
    var options = /** @type {import("./Feature.js").ReadOptions} */objectStack[0];

    var geometry = object['geometry'];
    if (geometry) {
      (0, _Feature3.transformWithOptions)(geometry, false, options);
    }
    feature.setGeometry(geometry);
    delete object['geometry'];

    if (this.extractStyles_) {
      var style = object['Style'];
      var styleUrl = object['styleUrl'];
      var styleFunction = createFeatureStyleFunction(style, styleUrl, this.defaultStyle_, this.sharedStyles_, this.showPointNames_);
      feature.setStyle(styleFunction);
    }
    delete object['Style'];
    // we do not remove the styleUrl property from the object, so it
    // gets stored on feature when setProperties is called

    feature.setProperties(object);

    return feature;
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   */
  KML.prototype.readSharedStyle_ = function readSharedStyle_(node, objectStack) {
    var id = node.getAttribute('id');
    if (id !== null) {
      var style = readStyle(node, objectStack);
      if (style) {
        var styleUri;
        var baseURI = node.baseURI;
        if (!baseURI || baseURI == 'about:blank') {
          baseURI = window.location.href;
        }
        if (baseURI) {
          var url = new URL('#' + id, baseURI);
          styleUri = url.href;
        } else {
          styleUri = '#' + id;
        }
        this.sharedStyles_[styleUri] = style;
      }
    }
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   */
  KML.prototype.readSharedStyleMap_ = function readSharedStyleMap_(node, objectStack) {
    var id = node.getAttribute('id');
    if (id === null) {
      return;
    }
    var styleMapValue = readStyleMapValue(node, objectStack);
    if (!styleMapValue) {
      return;
    }
    var styleUri;
    var baseURI = node.baseURI;
    if (!baseURI || baseURI == 'about:blank') {
      baseURI = window.location.href;
    }
    if (baseURI) {
      var url = new URL('#' + id, baseURI);
      styleUri = url.href;
    } else {
      styleUri = '#' + id;
    }
    this.sharedStyles_[styleUri] = styleMapValue;
  };

  /**
   * @inheritDoc
   */
  KML.prototype.readFeatureFromNode = function readFeatureFromNode(node, opt_options) {
    if (!(0, _array.includes)(NAMESPACE_URIS, node.namespaceURI)) {
      return null;
    }
    var feature = this.readPlacemark_(node, [this.getReadOptions(node, opt_options)]);
    if (feature) {
      return feature;
    } else {
      return null;
    }
  };

  /**
   * @inheritDoc
   */
  KML.prototype.readFeaturesFromNode = function readFeaturesFromNode(node, opt_options) {
    if (!(0, _array.includes)(NAMESPACE_URIS, node.namespaceURI)) {
      return [];
    }
    var features;
    var localName = node.localName;
    if (localName == 'Document' || localName == 'Folder') {
      features = this.readDocumentOrFolder_(node, [this.getReadOptions(node, opt_options)]);
      if (features) {
        return features;
      } else {
        return [];
      }
    } else if (localName == 'Placemark') {
      var feature = this.readPlacemark_(node, [this.getReadOptions(node, opt_options)]);
      if (feature) {
        return [feature];
      } else {
        return [];
      }
    } else if (localName == 'kml') {
      features = [];
      for (var n = node.firstElementChild; n; n = n.nextElementSibling) {
        var fs = this.readFeaturesFromNode(n, opt_options);
        if (fs) {
          (0, _array.extend)(features, fs);
        }
      }
      return features;
    } else {
      return [];
    }
  };

  /**
   * Read the name of the KML.
   *
   * @param {Document|Element|string} source Source.
   * @return {string|undefined} Name.
   * @api
   */
  KML.prototype.readName = function readName(source) {
    if (!source) {
      return undefined;
    } else if (typeof source === 'string') {
      var doc = (0, _xml.parse)(source);
      return this.readNameFromDocument(doc);
    } else if ((0, _xml.isDocument)(source)) {
      return this.readNameFromDocument( /** @type {Document} */source);
    } else {
      return this.readNameFromNode( /** @type {Element} */source);
    }
  };

  /**
   * @param {Document} doc Document.
   * @return {string|undefined} Name.
   */
  KML.prototype.readNameFromDocument = function readNameFromDocument(doc) {
    for (var n = /** @type {Node} */doc.firstChild; n; n = n.nextSibling) {
      if (n.nodeType == Node.ELEMENT_NODE) {
        var name = this.readNameFromNode( /** @type {Element} */n);
        if (name) {
          return name;
        }
      }
    }
    return undefined;
  };

  /**
   * @param {Element} node Node.
   * @return {string|undefined} Name.
   */
  KML.prototype.readNameFromNode = function readNameFromNode(node) {
    for (var n = node.firstElementChild; n; n = n.nextElementSibling) {
      if ((0, _array.includes)(NAMESPACE_URIS, n.namespaceURI) && n.localName == 'name') {
        return (0, _xsd.readString)(n);
      }
    }
    for (var n$1 = node.firstElementChild; n$1; n$1 = n$1.nextElementSibling) {
      var localName = n$1.localName;
      if ((0, _array.includes)(NAMESPACE_URIS, n$1.namespaceURI) && (localName == 'Document' || localName == 'Folder' || localName == 'Placemark' || localName == 'kml')) {
        var name = this.readNameFromNode(n$1);
        if (name) {
          return name;
        }
      }
    }
    return undefined;
  };

  /**
   * Read the network links of the KML.
   *
   * @param {Document|Element|string} source Source.
   * @return {Array<Object>} Network links.
   * @api
   */
  KML.prototype.readNetworkLinks = function readNetworkLinks(source) {
    var networkLinks = [];
    if (typeof source === 'string') {
      var doc = (0, _xml.parse)(source);
      (0, _array.extend)(networkLinks, this.readNetworkLinksFromDocument(doc));
    } else if ((0, _xml.isDocument)(source)) {
      (0, _array.extend)(networkLinks, this.readNetworkLinksFromDocument(
      /** @type {Document} */source));
    } else {
      (0, _array.extend)(networkLinks, this.readNetworkLinksFromNode(
      /** @type {Element} */source));
    }
    return networkLinks;
  };

  /**
   * @param {Document} doc Document.
   * @return {Array<Object>} Network links.
   */
  KML.prototype.readNetworkLinksFromDocument = function readNetworkLinksFromDocument(doc) {
    var networkLinks = [];
    for (var n = /** @type {Node} */doc.firstChild; n; n = n.nextSibling) {
      if (n.nodeType == Node.ELEMENT_NODE) {
        (0, _array.extend)(networkLinks, this.readNetworkLinksFromNode( /** @type {Element} */n));
      }
    }
    return networkLinks;
  };

  /**
   * @param {Element} node Node.
   * @return {Array<Object>} Network links.
   */
  KML.prototype.readNetworkLinksFromNode = function readNetworkLinksFromNode(node) {
    var networkLinks = [];
    for (var n = node.firstElementChild; n; n = n.nextElementSibling) {
      if ((0, _array.includes)(NAMESPACE_URIS, n.namespaceURI) && n.localName == 'NetworkLink') {
        var obj = (0, _xml.pushParseAndPop)({}, NETWORK_LINK_PARSERS, n, []);
        networkLinks.push(obj);
      }
    }
    for (var n$1 = node.firstElementChild; n$1; n$1 = n$1.nextElementSibling) {
      var localName = n$1.localName;
      if ((0, _array.includes)(NAMESPACE_URIS, n$1.namespaceURI) && (localName == 'Document' || localName == 'Folder' || localName == 'kml')) {
        (0, _array.extend)(networkLinks, this.readNetworkLinksFromNode(n$1));
      }
    }
    return networkLinks;
  };

  /**
   * Read the regions of the KML.
   *
   * @param {Document|Element|string} source Source.
   * @return {Array<Object>} Regions.
   * @api
   */
  KML.prototype.readRegion = function readRegion(source) {
    var regions = [];
    if (typeof source === 'string') {
      var doc = (0, _xml.parse)(source);
      (0, _array.extend)(regions, this.readRegionFromDocument(doc));
    } else if ((0, _xml.isDocument)(source)) {
      (0, _array.extend)(regions, this.readRegionFromDocument(
      /** @type {Document} */source));
    } else {
      (0, _array.extend)(regions, this.readRegionFromNode(
      /** @type {Element} */source));
    }
    return regions;
  };

  /**
   * @param {Document} doc Document.
   * @return {Array<Object>} Region.
   */
  KML.prototype.readRegionFromDocument = function readRegionFromDocument(doc) {
    var regions = [];
    for (var n = /** @type {Node} */doc.firstChild; n; n = n.nextSibling) {
      if (n.nodeType == Node.ELEMENT_NODE) {
        (0, _array.extend)(regions, this.readRegionFromNode( /** @type {Element} */n));
      }
    }
    return regions;
  };

  /**
   * @param {Element} node Node.
   * @return {Array<Object>} Region.
   * @api
   */
  KML.prototype.readRegionFromNode = function readRegionFromNode(node) {
    var regions = [];
    for (var n = node.firstElementChild; n; n = n.nextElementSibling) {
      if ((0, _array.includes)(NAMESPACE_URIS, n.namespaceURI) && n.localName == 'Region') {
        var obj = (0, _xml.pushParseAndPop)({}, REGION_PARSERS, n, []);
        regions.push(obj);
      }
    }
    for (var n$1 = node.firstElementChild; n$1; n$1 = n$1.nextElementSibling) {
      var localName = n$1.localName;
      if ((0, _array.includes)(NAMESPACE_URIS, n$1.namespaceURI) && (localName == 'Document' || localName == 'Folder' || localName == 'kml')) {
        (0, _array.extend)(regions, this.readRegionFromNode(n$1));
      }
    }
    return regions;
  };

  /**
   * Encode an array of features in the KML format as an XML node. GeometryCollections,
   * MultiPoints, MultiLineStrings, and MultiPolygons are output as MultiGeometries.
   *
   * @param {Array<Feature>} features Features.
   * @param {import("./Feature.js").WriteOptions=} opt_options Options.
   * @return {Node} Node.
   * @override
   * @api
   */
  KML.prototype.writeFeaturesNode = function writeFeaturesNode(features, opt_options) {
    opt_options = this.adaptOptions(opt_options);
    var kml = (0, _xml.createElementNS)(NAMESPACE_URIS[4], 'kml');
    var xmlnsUri = 'http://www.w3.org/2000/xmlns/';
    kml.setAttributeNS(xmlnsUri, 'xmlns:gx', GX_NAMESPACE_URIS[0]);
    kml.setAttributeNS(xmlnsUri, 'xmlns:xsi', _xml.XML_SCHEMA_INSTANCE_URI);
    kml.setAttributeNS(_xml.XML_SCHEMA_INSTANCE_URI, 'xsi:schemaLocation', SCHEMA_LOCATION);

    var /** @type {import("../xml.js").NodeStackItem} */context = { node: kml };
    /** @type {!Object<string, (Array<Feature>|Feature|undefined)>} */
    var properties = {};
    if (features.length > 1) {
      properties['Document'] = features;
    } else if (features.length == 1) {
      properties['Placemark'] = features[0];
    }
    var orderedKeys = KML_SEQUENCE[kml.namespaceURI];
    var values = (0, _xml.makeSequence)(properties, orderedKeys);
    (0, _xml.pushSerializeAndPop)(context, KML_SERIALIZERS, _xml.OBJECT_PROPERTY_NODE_FACTORY, values, [opt_options], orderedKeys, this);
    return kml;
  };

  return KML;
}(_XMLFeature2.default);

/**
 * @param {Style|undefined} foundStyle Style.
 * @param {string} name Name.
 * @return {Style} style Style.
 */
function createNameStyleFunction(foundStyle, name) {
  var textStyle = null;
  var textOffset = [0, 0];
  var textAlign = 'start';
  if (foundStyle.getImage()) {
    var imageSize = foundStyle.getImage().getImageSize();
    if (imageSize === null) {
      imageSize = DEFAULT_IMAGE_STYLE_SIZE;
    }
    if (imageSize.length == 2) {
      var imageScale = foundStyle.getImage().getScale();
      // Offset the label to be centered to the right of the icon, if there is
      // one.
      textOffset[0] = imageScale * imageSize[0] / 2;
      textOffset[1] = -imageScale * imageSize[1] / 2;
      textAlign = 'left';
    }
  }
  if (foundStyle.getText() !== null) {
    // clone the text style, customizing it with name, alignments and offset.
    // Note that kml does not support many text options that OpenLayers does (rotation, textBaseline).
    var foundText = foundStyle.getText();
    textStyle = foundText.clone();
    textStyle.setFont(foundText.getFont() || DEFAULT_TEXT_STYLE.getFont());
    textStyle.setScale(foundText.getScale() || DEFAULT_TEXT_STYLE.getScale());
    textStyle.setFill(foundText.getFill() || DEFAULT_TEXT_STYLE.getFill());
    textStyle.setStroke(foundText.getStroke() || DEFAULT_TEXT_STROKE_STYLE);
  } else {
    textStyle = DEFAULT_TEXT_STYLE.clone();
  }
  textStyle.setText(name);
  textStyle.setOffsetX(textOffset[0]);
  textStyle.setOffsetY(textOffset[1]);
  textStyle.setTextAlign(textAlign);

  var nameStyle = new _Style2.default({
    text: textStyle
  });
  return nameStyle;
}

/**
 * @param {Array<Style>|undefined} style Style.
 * @param {string} styleUrl Style URL.
 * @param {Array<Style>} defaultStyle Default style.
 * @param {!Object<string, (Array<Style>|string)>} sharedStyles Shared styles.
 * @param {boolean|undefined} showPointNames true to show names for point placemarks.
 * @return {import("../style/Style.js").StyleFunction} Feature style function.
 */
function createFeatureStyleFunction(style, styleUrl, defaultStyle, sharedStyles, showPointNames) {

  return (
    /**
     * @param {Feature} feature feature.
     * @param {number} resolution Resolution.
     * @return {Array<Style>} Style.
     */
    function (feature, resolution) {
      var drawName = showPointNames;
      /** @type {Style|undefined} */
      var nameStyle;
      var name = '';
      if (drawName) {
        var geometry = feature.getGeometry();
        if (geometry) {
          drawName = geometry.getType() === _GeometryType2.default.POINT;
        }
      }

      if (drawName) {
        name = /** @type {string} */feature.get('name');
        drawName = drawName && !!name;
      }

      if (style) {
        if (drawName) {
          nameStyle = createNameStyleFunction(style[0], name);
          return style.concat(nameStyle);
        }
        return style;
      }
      if (styleUrl) {
        var foundStyle = findStyle(styleUrl, defaultStyle, sharedStyles);
        if (drawName) {
          nameStyle = createNameStyleFunction(foundStyle[0], name);
          return foundStyle.concat(nameStyle);
        }
        return foundStyle;
      }
      if (drawName) {
        nameStyle = createNameStyleFunction(defaultStyle[0], name);
        return defaultStyle.concat(nameStyle);
      }
      return defaultStyle;
    }
  );
}

/**
 * @param {Array<Style>|string|undefined} styleValue Style value.
 * @param {Array<Style>} defaultStyle Default style.
 * @param {!Object<string, (Array<Style>|string)>} sharedStyles
 * Shared styles.
 * @return {Array<Style>} Style.
 */
function findStyle(styleValue, defaultStyle, sharedStyles) {
  if (Array.isArray(styleValue)) {
    return styleValue;
  } else if (typeof styleValue === 'string') {
    // KML files in the wild occasionally forget the leading `#` on styleUrls
    // defined in the same document.  Add a leading `#` if it enables to find
    // a style.
    if (!(styleValue in sharedStyles) && '#' + styleValue in sharedStyles) {
      styleValue = '#' + styleValue;
    }
    return findStyle(sharedStyles[styleValue], defaultStyle, sharedStyles);
  } else {
    return defaultStyle;
  }
}

/**
 * @param {Node} node Node.
 * @return {import("../color.js").Color|undefined} Color.
 */
function readColor(node) {
  var s = (0, _xml.getAllTextContent)(node, false);
  // The KML specification states that colors should not include a leading `#`
  // but we tolerate them.
  var m = /^\s*#?\s*([0-9A-Fa-f]{8})\s*$/.exec(s);
  if (m) {
    var hexColor = m[1];
    return [parseInt(hexColor.substr(6, 2), 16), parseInt(hexColor.substr(4, 2), 16), parseInt(hexColor.substr(2, 2), 16), parseInt(hexColor.substr(0, 2), 16) / 255];
  } else {
    return undefined;
  }
}

/**
 * @param {Node} node Node.
 * @return {Array<number>|undefined} Flat coordinates.
 */
function readFlatCoordinates(node) {
  var s = (0, _xml.getAllTextContent)(node, false);
  var flatCoordinates = [];
  // The KML specification states that coordinate tuples should not include
  // spaces, but we tolerate them.
  var re = /^\s*([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?)\s*,\s*([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?)(?:\s*,\s*([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?))?\s*/i;
  var m;
  while (m = re.exec(s)) {
    var x = parseFloat(m[1]);
    var y = parseFloat(m[2]);
    var z = m[3] ? parseFloat(m[3]) : 0;
    flatCoordinates.push(x, y, z);
    s = s.substr(m[0].length);
  }
  if (s !== '') {
    return undefined;
  }
  return flatCoordinates;
}

/**
 * @param {Node} node Node.
 * @return {string} URI.
 */
function readURI(node) {
  var s = (0, _xml.getAllTextContent)(node, false).trim();
  var baseURI = node.baseURI;
  if (!baseURI || baseURI == 'about:blank') {
    baseURI = window.location.href;
  }
  if (baseURI) {
    var url = new URL(s, baseURI);
    return url.href;
  } else {
    return s;
  }
}

/**
 * @param {Element} node Node.
 * @return {Vec2} Vec2.
 */
function readVec2(node) {
  var xunits = node.getAttribute('xunits');
  var yunits = node.getAttribute('yunits');
  var origin;
  if (xunits !== 'insetPixels') {
    if (yunits !== 'insetPixels') {
      origin = _IconOrigin2.default.BOTTOM_LEFT;
    } else {
      origin = _IconOrigin2.default.TOP_LEFT;
    }
  } else {
    if (yunits !== 'insetPixels') {
      origin = _IconOrigin2.default.BOTTOM_RIGHT;
    } else {
      origin = _IconOrigin2.default.TOP_RIGHT;
    }
  }
  return {
    x: parseFloat(node.getAttribute('x')),
    xunits: ICON_ANCHOR_UNITS_MAP[xunits],
    y: parseFloat(node.getAttribute('y')),
    yunits: ICON_ANCHOR_UNITS_MAP[yunits],
    origin: origin
  };
}

/**
 * @param {Node} node Node.
 * @return {number|undefined} Scale.
 */
function readScale(node) {
  return (0, _xsd.readDecimal)(node);
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var STYLE_MAP_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Pair': pairDataParser
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Array<Style>|string|undefined} StyleMap.
 */
function readStyleMapValue(node, objectStack) {
  return (0, _xml.pushParseAndPop)(undefined, STYLE_MAP_PARSERS, node, objectStack);
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var ICON_STYLE_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Icon': (0, _xml.makeObjectPropertySetter)(readIcon),
  'heading': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'hotSpot': (0, _xml.makeObjectPropertySetter)(readVec2),
  'scale': (0, _xml.makeObjectPropertySetter)(readScale)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function iconStyleParser(node, objectStack) {
  // FIXME refreshMode
  // FIXME refreshInterval
  // FIXME viewRefreshTime
  // FIXME viewBoundScale
  // FIXME viewFormat
  // FIXME httpQuery
  var object = (0, _xml.pushParseAndPop)({}, ICON_STYLE_PARSERS, node, objectStack);
  if (!object) {
    return;
  }
  var styleObject = /** @type {Object} */objectStack[objectStack.length - 1];
  var IconObject = 'Icon' in object ? object['Icon'] : {};
  var drawIcon = !('Icon' in object) || Object.keys(IconObject).length > 0;
  var src;
  var href = /** @type {string|undefined} */
  IconObject['href'];
  if (href) {
    src = href;
  } else if (drawIcon) {
    src = DEFAULT_IMAGE_STYLE_SRC;
  }
  var anchor, anchorXUnits, anchorYUnits;
  var anchorOrigin = _IconOrigin2.default.BOTTOM_LEFT;
  var hotSpot = /** @type {Vec2|undefined} */
  object['hotSpot'];
  if (hotSpot) {
    anchor = [hotSpot.x, hotSpot.y];
    anchorXUnits = hotSpot.xunits;
    anchorYUnits = hotSpot.yunits;
    anchorOrigin = hotSpot.origin;
  } else if (src === DEFAULT_IMAGE_STYLE_SRC) {
    anchor = DEFAULT_IMAGE_STYLE_ANCHOR;
    anchorXUnits = DEFAULT_IMAGE_STYLE_ANCHOR_X_UNITS;
    anchorYUnits = DEFAULT_IMAGE_STYLE_ANCHOR_Y_UNITS;
  } else if (/^http:\/\/maps\.(?:google|gstatic)\.com\//.test(src)) {
    anchor = [0.5, 0];
    anchorXUnits = _IconAnchorUnits2.default.FRACTION;
    anchorYUnits = _IconAnchorUnits2.default.FRACTION;
  }

  var offset;
  var x = /** @type {number|undefined} */
  IconObject['x'];
  var y = /** @type {number|undefined} */
  IconObject['y'];
  if (x !== undefined && y !== undefined) {
    offset = [x, y];
  }

  var size;
  var w = /** @type {number|undefined} */
  IconObject['w'];
  var h = /** @type {number|undefined} */
  IconObject['h'];
  if (w !== undefined && h !== undefined) {
    size = [w, h];
  }

  var rotation;
  var heading = /** @type {number} */
  object['heading'];
  if (heading !== undefined) {
    rotation = (0, _math.toRadians)(heading);
  }

  var scale = /** @type {number|undefined} */
  object['scale'];

  if (drawIcon) {
    if (src == DEFAULT_IMAGE_STYLE_SRC) {
      size = DEFAULT_IMAGE_STYLE_SIZE;
      if (scale === undefined) {
        scale = DEFAULT_IMAGE_SCALE_MULTIPLIER;
      }
    }

    var imageStyle = new _Icon2.default({
      anchor: anchor,
      anchorOrigin: anchorOrigin,
      anchorXUnits: anchorXUnits,
      anchorYUnits: anchorYUnits,
      crossOrigin: 'anonymous', // FIXME should this be configurable?
      offset: offset,
      offsetOrigin: _IconOrigin2.default.BOTTOM_LEFT,
      rotation: rotation,
      scale: scale,
      size: size,
      src: src
    });
    styleObject['imageStyle'] = imageStyle;
  } else {
    // handle the case when we explicitly want to draw no icon.
    styleObject['imageStyle'] = DEFAULT_NO_IMAGE_STYLE;
  }
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var LABEL_STYLE_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'color': (0, _xml.makeObjectPropertySetter)(readColor),
  'scale': (0, _xml.makeObjectPropertySetter)(readScale)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function labelStyleParser(node, objectStack) {
  // FIXME colorMode
  var object = (0, _xml.pushParseAndPop)({}, LABEL_STYLE_PARSERS, node, objectStack);
  if (!object) {
    return;
  }
  var styleObject = objectStack[objectStack.length - 1];
  var textStyle = new _Text2.default({
    fill: new _Fill2.default({
      color: /** @type {import("../color.js").Color} */
      'color' in object ? object['color'] : DEFAULT_COLOR
    }),
    scale: /** @type {number|undefined} */
    object['scale']
  });
  styleObject['textStyle'] = textStyle;
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var LINE_STYLE_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'color': (0, _xml.makeObjectPropertySetter)(readColor),
  'width': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function lineStyleParser(node, objectStack) {
  // FIXME colorMode
  // FIXME gx:outerColor
  // FIXME gx:outerWidth
  // FIXME gx:physicalWidth
  // FIXME gx:labelVisibility
  var object = (0, _xml.pushParseAndPop)({}, LINE_STYLE_PARSERS, node, objectStack);
  if (!object) {
    return;
  }
  var styleObject = objectStack[objectStack.length - 1];
  var strokeStyle = new _Stroke2.default({
    color: /** @type {import("../color.js").Color} */
    'color' in object ? object['color'] : DEFAULT_COLOR,
    width: /** @type {number} */'width' in object ? object['width'] : 1
  });
  styleObject['strokeStyle'] = strokeStyle;
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var POLY_STYLE_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'color': (0, _xml.makeObjectPropertySetter)(readColor),
  'fill': (0, _xml.makeObjectPropertySetter)(_xsd.readBoolean),
  'outline': (0, _xml.makeObjectPropertySetter)(_xsd.readBoolean)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function polyStyleParser(node, objectStack) {
  // FIXME colorMode
  var object = (0, _xml.pushParseAndPop)({}, POLY_STYLE_PARSERS, node, objectStack);
  if (!object) {
    return;
  }
  var styleObject = objectStack[objectStack.length - 1];
  var fillStyle = new _Fill2.default({
    color: /** @type {import("../color.js").Color} */
    'color' in object ? object['color'] : DEFAULT_COLOR
  });
  styleObject['fillStyle'] = fillStyle;
  var fill = /** @type {boolean|undefined} */object['fill'];
  if (fill !== undefined) {
    styleObject['fill'] = fill;
  }
  var outline = /** @type {boolean|undefined} */object['outline'];
  if (outline !== undefined) {
    styleObject['outline'] = outline;
  }
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var FLAT_LINEAR_RING_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'coordinates': (0, _xml.makeReplacer)(readFlatCoordinates)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Array<number>} LinearRing flat coordinates.
 */
function readFlatLinearRing(node, objectStack) {
  return (0, _xml.pushParseAndPop)(null, FLAT_LINEAR_RING_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function gxCoordParser(node, objectStack) {
  var gxTrackObject = /** @type {GxTrackObject} */
  objectStack[objectStack.length - 1];
  var flatCoordinates = gxTrackObject.flatCoordinates;
  var s = (0, _xml.getAllTextContent)(node, false);
  var re = /^\s*([+\-]?\d+(?:\.\d*)?(?:e[+\-]?\d*)?)\s+([+\-]?\d+(?:\.\d*)?(?:e[+\-]?\d*)?)\s+([+\-]?\d+(?:\.\d*)?(?:e[+\-]?\d*)?)\s*$/i;
  var m = re.exec(s);
  if (m) {
    var x = parseFloat(m[1]);
    var y = parseFloat(m[2]);
    var z = parseFloat(m[3]);
    flatCoordinates.push(x, y, z, 0);
  } else {
    flatCoordinates.push(0, 0, 0, 0);
  }
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var GX_MULTITRACK_GEOMETRY_PARSERS = (0, _xml.makeStructureNS)(GX_NAMESPACE_URIS, {
  'Track': (0, _xml.makeArrayPusher)(readGxTrack)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {MultiLineString|undefined} MultiLineString.
 */
function readGxMultiTrack(node, objectStack) {
  var lineStrings = (0, _xml.pushParseAndPop)([], GX_MULTITRACK_GEOMETRY_PARSERS, node, objectStack);
  if (!lineStrings) {
    return undefined;
  }
  return new _MultiLineString2.default(lineStrings);
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var GX_TRACK_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'when': whenParser
}, (0, _xml.makeStructureNS)(GX_NAMESPACE_URIS, {
  'coord': gxCoordParser
}));

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {LineString|undefined} LineString.
 */
function readGxTrack(node, objectStack) {
  var gxTrackObject = (0, _xml.pushParseAndPop)(
  /** @type {GxTrackObject} */{
    flatCoordinates: [],
    whens: []
  }, GX_TRACK_PARSERS, node, objectStack);
  if (!gxTrackObject) {
    return undefined;
  }
  var flatCoordinates = gxTrackObject.flatCoordinates;
  var whens = gxTrackObject.whens;
  for (var i = 0, ii = Math.min(flatCoordinates.length, whens.length); i < ii; ++i) {
    flatCoordinates[4 * i + 3] = whens[i];
  }
  return new _LineString2.default(flatCoordinates, _GeometryLayout2.default.XYZM);
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var ICON_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'href': (0, _xml.makeObjectPropertySetter)(readURI)
}, (0, _xml.makeStructureNS)(GX_NAMESPACE_URIS, {
  'x': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'y': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'w': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'h': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal)
}));

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Object} Icon object.
 */
function readIcon(node, objectStack) {
  var iconObject = (0, _xml.pushParseAndPop)({}, ICON_PARSERS, node, objectStack);
  if (iconObject) {
    return iconObject;
  } else {
    return null;
  }
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var GEOMETRY_FLAT_COORDINATES_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'coordinates': (0, _xml.makeReplacer)(readFlatCoordinates)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Array<number>} Flat coordinates.
 */
function readFlatCoordinatesFromNode(node, objectStack) {
  return (0, _xml.pushParseAndPop)(null, GEOMETRY_FLAT_COORDINATES_PARSERS, node, objectStack);
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var EXTRUDE_AND_ALTITUDE_MODE_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'extrude': (0, _xml.makeObjectPropertySetter)(_xsd.readBoolean),
  'tessellate': (0, _xml.makeObjectPropertySetter)(_xsd.readBoolean),
  'altitudeMode': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {LineString|undefined} LineString.
 */
function readLineString(node, objectStack) {
  var properties = (0, _xml.pushParseAndPop)({}, EXTRUDE_AND_ALTITUDE_MODE_PARSERS, node, objectStack);
  var flatCoordinates = readFlatCoordinatesFromNode(node, objectStack);
  if (flatCoordinates) {
    var lineString = new _LineString2.default(flatCoordinates, _GeometryLayout2.default.XYZ);
    lineString.setProperties(properties);
    return lineString;
  } else {
    return undefined;
  }
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Polygon|undefined} Polygon.
 */
function readLinearRing(node, objectStack) {
  var properties = (0, _xml.pushParseAndPop)({}, EXTRUDE_AND_ALTITUDE_MODE_PARSERS, node, objectStack);
  var flatCoordinates = readFlatCoordinatesFromNode(node, objectStack);
  if (flatCoordinates) {
    var polygon = new _Polygon2.default(flatCoordinates, _GeometryLayout2.default.XYZ, [flatCoordinates.length]);
    polygon.setProperties(properties);
    return polygon;
  } else {
    return undefined;
  }
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var MULTI_GEOMETRY_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'LineString': (0, _xml.makeArrayPusher)(readLineString),
  'LinearRing': (0, _xml.makeArrayPusher)(readLinearRing),
  'MultiGeometry': (0, _xml.makeArrayPusher)(readMultiGeometry),
  'Point': (0, _xml.makeArrayPusher)(readPoint),
  'Polygon': (0, _xml.makeArrayPusher)(readPolygon)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {import("../geom/Geometry.js").default} Geometry.
 */
function readMultiGeometry(node, objectStack) {
  var geometries = (0, _xml.pushParseAndPop)([], MULTI_GEOMETRY_PARSERS, node, objectStack);
  if (!geometries) {
    return null;
  }
  if (geometries.length === 0) {
    return new _GeometryCollection2.default(geometries);
  }
  var multiGeometry;
  var homogeneous = true;
  var type = geometries[0].getType();
  var geometry;
  for (var i = 1, ii = geometries.length; i < ii; ++i) {
    geometry = geometries[i];
    if (geometry.getType() != type) {
      homogeneous = false;
      break;
    }
  }
  if (homogeneous) {
    var layout;
    var flatCoordinates;
    if (type == _GeometryType2.default.POINT) {
      var point = geometries[0];
      layout = point.getLayout();
      flatCoordinates = point.getFlatCoordinates();
      for (var i$1 = 1, ii$1 = geometries.length; i$1 < ii$1; ++i$1) {
        geometry = geometries[i$1];
        (0, _array.extend)(flatCoordinates, geometry.getFlatCoordinates());
      }
      multiGeometry = new _MultiPoint2.default(flatCoordinates, layout);
      setCommonGeometryProperties(multiGeometry, geometries);
    } else if (type == _GeometryType2.default.LINE_STRING) {
      multiGeometry = new _MultiLineString2.default(geometries);
      setCommonGeometryProperties(multiGeometry, geometries);
    } else if (type == _GeometryType2.default.POLYGON) {
      multiGeometry = new _MultiPolygon2.default(geometries);
      setCommonGeometryProperties(multiGeometry, geometries);
    } else if (type == _GeometryType2.default.GEOMETRY_COLLECTION) {
      multiGeometry = new _GeometryCollection2.default(geometries);
    } else {
      (0, _asserts.assert)(false, 37); // Unknown geometry type found
    }
  } else {
    multiGeometry = new _GeometryCollection2.default(geometries);
  }
  return (
    /** @type {import("../geom/Geometry.js").default} */multiGeometry
  );
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Point|undefined} Point.
 */
function readPoint(node, objectStack) {
  var properties = (0, _xml.pushParseAndPop)({}, EXTRUDE_AND_ALTITUDE_MODE_PARSERS, node, objectStack);
  var flatCoordinates = readFlatCoordinatesFromNode(node, objectStack);
  if (flatCoordinates) {
    var point = new _Point2.default(flatCoordinates, _GeometryLayout2.default.XYZ);
    point.setProperties(properties);
    return point;
  } else {
    return undefined;
  }
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var FLAT_LINEAR_RINGS_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'innerBoundaryIs': innerBoundaryIsParser,
  'outerBoundaryIs': outerBoundaryIsParser
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Polygon|undefined} Polygon.
 */
function readPolygon(node, objectStack) {
  var properties = (0, _xml.pushParseAndPop)( /** @type {Object<string,*>} */{}, EXTRUDE_AND_ALTITUDE_MODE_PARSERS, node, objectStack);
  var flatLinearRings = (0, _xml.pushParseAndPop)([null], FLAT_LINEAR_RINGS_PARSERS, node, objectStack);
  if (flatLinearRings && flatLinearRings[0]) {
    var flatCoordinates = flatLinearRings[0];
    var ends = [flatCoordinates.length];
    for (var i = 1, ii = flatLinearRings.length; i < ii; ++i) {
      (0, _array.extend)(flatCoordinates, flatLinearRings[i]);
      ends.push(flatCoordinates.length);
    }
    var polygon = new _Polygon2.default(flatCoordinates, _GeometryLayout2.default.XYZ, ends);
    polygon.setProperties(properties);
    return polygon;
  } else {
    return undefined;
  }
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var STYLE_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'IconStyle': iconStyleParser,
  'LabelStyle': labelStyleParser,
  'LineStyle': lineStyleParser,
  'PolyStyle': polyStyleParser
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 * @return {Array<Style>} Style.
 */
function readStyle(node, objectStack) {
  var styleObject = (0, _xml.pushParseAndPop)({}, STYLE_PARSERS, node, objectStack);
  if (!styleObject) {
    return null;
  }
  var fillStyle = /** @type {Fill} */
  'fillStyle' in styleObject ? styleObject['fillStyle'] : DEFAULT_FILL_STYLE;
  var fill = /** @type {boolean|undefined} */styleObject['fill'];
  if (fill !== undefined && !fill) {
    fillStyle = null;
  }
  var imageStyle;
  if ('imageStyle' in styleObject) {
    if (styleObject['imageStyle'] != DEFAULT_NO_IMAGE_STYLE) {
      imageStyle = styleObject['imageStyle'];
    }
  } else {
    imageStyle = DEFAULT_IMAGE_STYLE;
  }
  var textStyle = /** @type {Text} */
  'textStyle' in styleObject ? styleObject['textStyle'] : DEFAULT_TEXT_STYLE;
  var strokeStyle = /** @type {Stroke} */
  'strokeStyle' in styleObject ? styleObject['strokeStyle'] : DEFAULT_STROKE_STYLE;
  var outline = /** @type {boolean|undefined} */
  styleObject['outline'];
  if (outline !== undefined && !outline) {
    strokeStyle = null;
  }
  return [new _Style2.default({
    fill: fillStyle,
    image: imageStyle,
    stroke: strokeStyle,
    text: textStyle,
    zIndex: undefined // FIXME
  })];
}

/**
 * Reads an array of geometries and creates arrays for common geometry
 * properties. Then sets them to the multi geometry.
 * @param {MultiPoint|MultiLineString|MultiPolygon} multiGeometry A multi-geometry.
 * @param {Array<import("../geom/Geometry.js").default>} geometries List of geometries.
 */
function setCommonGeometryProperties(multiGeometry, geometries) {
  var ii = geometries.length;
  var extrudes = new Array(geometries.length);
  var tessellates = new Array(geometries.length);
  var altitudeModes = new Array(geometries.length);
  var hasExtrude, hasTessellate, hasAltitudeMode;
  hasExtrude = hasTessellate = hasAltitudeMode = false;
  for (var i = 0; i < ii; ++i) {
    var geometry = geometries[i];
    extrudes[i] = geometry.get('extrude');
    tessellates[i] = geometry.get('tessellate');
    altitudeModes[i] = geometry.get('altitudeMode');
    hasExtrude = hasExtrude || extrudes[i] !== undefined;
    hasTessellate = hasTessellate || tessellates[i] !== undefined;
    hasAltitudeMode = hasAltitudeMode || altitudeModes[i];
  }
  if (hasExtrude) {
    multiGeometry.set('extrude', extrudes);
  }
  if (hasTessellate) {
    multiGeometry.set('tessellate', tessellates);
  }
  if (hasAltitudeMode) {
    multiGeometry.set('altitudeMode', altitudeModes);
  }
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var DATA_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'displayName': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'value': (0, _xml.makeObjectPropertySetter)(_xsd.readString)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function dataParser(node, objectStack) {
  var name = node.getAttribute('name');
  (0, _xml.parseNode)(DATA_PARSERS, node, objectStack);
  var featureObject = /** @type {Object} */objectStack[objectStack.length - 1];
  if (name !== null) {
    featureObject[name] = featureObject.value;
  } else if (featureObject.displayName !== null) {
    featureObject[featureObject.displayName] = featureObject.value;
  }
  delete featureObject['value'];
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var EXTENDED_DATA_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Data': dataParser,
  'SchemaData': schemaDataParser
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function extendedDataParser(node, objectStack) {
  (0, _xml.parseNode)(EXTENDED_DATA_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function regionParser(node, objectStack) {
  (0, _xml.parseNode)(REGION_PARSERS, node, objectStack);
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var PAIR_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Style': (0, _xml.makeObjectPropertySetter)(readStyle),
  'key': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'styleUrl': (0, _xml.makeObjectPropertySetter)(readURI)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function pairDataParser(node, objectStack) {
  var pairObject = (0, _xml.pushParseAndPop)({}, PAIR_PARSERS, node, objectStack);
  if (!pairObject) {
    return;
  }
  var key = /** @type {string|undefined} */
  pairObject['key'];
  if (key && key == 'normal') {
    var styleUrl = /** @type {string|undefined} */
    pairObject['styleUrl'];
    if (styleUrl) {
      objectStack[objectStack.length - 1] = styleUrl;
    }
    var style = /** @type {Style} */
    pairObject['Style'];
    if (style) {
      objectStack[objectStack.length - 1] = style;
    }
  }
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function placemarkStyleMapParser(node, objectStack) {
  var styleMapValue = readStyleMapValue(node, objectStack);
  if (!styleMapValue) {
    return;
  }
  var placemarkObject = objectStack[objectStack.length - 1];
  if (Array.isArray(styleMapValue)) {
    placemarkObject['Style'] = styleMapValue;
  } else if (typeof styleMapValue === 'string') {
    placemarkObject['styleUrl'] = styleMapValue;
  } else {
    (0, _asserts.assert)(false, 38); // `styleMapValue` has an unknown type
  }
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var SCHEMA_DATA_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'SimpleData': simpleDataParser
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function schemaDataParser(node, objectStack) {
  (0, _xml.parseNode)(SCHEMA_DATA_PARSERS, node, objectStack);
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function simpleDataParser(node, objectStack) {
  var name = node.getAttribute('name');
  if (name !== null) {
    var data = (0, _xsd.readString)(node);
    var featureObject = /** @type {Object} */objectStack[objectStack.length - 1];
    featureObject[name] = data;
  }
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var LAT_LON_ALT_BOX_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'altitudeMode': (0, _xml.makeObjectPropertySetter)(_xsd.readString),
  'minAltitude': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'maxAltitude': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'north': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'south': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'east': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'west': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function latLonAltBoxParser(node, objectStack) {
  var object = (0, _xml.pushParseAndPop)({}, LAT_LON_ALT_BOX_PARSERS, node, objectStack);
  if (!object) {
    return;
  }
  var regionObject = /** @type {Object} */objectStack[objectStack.length - 1];
  var extent = [parseFloat(object['west']), parseFloat(object['south']), parseFloat(object['east']), parseFloat(object['north'])];
  regionObject['extent'] = extent;
  regionObject['altitudeMode'] = object['altitudeMode'];
  regionObject['minAltitude'] = parseFloat(object['minAltitude']);
  regionObject['maxAltitude'] = parseFloat(object['maxAltitude']);
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var LOD_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'minLodPixels': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'maxLodPixels': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'minFadeExtent': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal),
  'maxFadeExtent': (0, _xml.makeObjectPropertySetter)(_xsd.readDecimal)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function lodParser(node, objectStack) {
  var object = (0, _xml.pushParseAndPop)({}, LOD_PARSERS, node, objectStack);
  if (!object) {
    return;
  }
  var lodObject = /** @type {Object} */objectStack[objectStack.length - 1];
  lodObject['minLodPixels'] = parseFloat(object['minLodPixels']);
  lodObject['maxLodPixels'] = parseFloat(object['maxLodPixels']);
  lodObject['minFadeExtent'] = parseFloat(object['minFadeExtent']);
  lodObject['maxFadeExtent'] = parseFloat(object['maxFadeExtent']);
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var INNER_BOUNDARY_IS_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'LinearRing': (0, _xml.makeReplacer)(readFlatLinearRing)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function innerBoundaryIsParser(node, objectStack) {
  /** @type {Array<number>|undefined} */
  var flatLinearRing = (0, _xml.pushParseAndPop)(undefined, INNER_BOUNDARY_IS_PARSERS, node, objectStack);
  if (flatLinearRing) {
    var flatLinearRings = /** @type {Array<Array<number>>} */
    objectStack[objectStack.length - 1];
    flatLinearRings.push(flatLinearRing);
  }
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 */
var OUTER_BOUNDARY_IS_PARSERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'LinearRing': (0, _xml.makeReplacer)(readFlatLinearRing)
});

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function outerBoundaryIsParser(node, objectStack) {
  /** @type {Array<number>|undefined} */
  var flatLinearRing = (0, _xml.pushParseAndPop)(undefined, OUTER_BOUNDARY_IS_PARSERS, node, objectStack);
  if (flatLinearRing) {
    var flatLinearRings = /** @type {Array<Array<number>>} */
    objectStack[objectStack.length - 1];
    flatLinearRings[0] = flatLinearRing;
  }
}

/**
 * @param {Element} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function linkParser(node, objectStack) {
  (0, _xml.parseNode)(LINK_PARSERS, node, objectStack);
}

/**
 * @param {Node} node Node.
 * @param {Array<*>} objectStack Object stack.
 */
function whenParser(node, objectStack) {
  var gxTrackObject = /** @type {GxTrackObject} */
  objectStack[objectStack.length - 1];
  var whens = gxTrackObject.whens;
  var s = (0, _xml.getAllTextContent)(node, false);
  var when = Date.parse(s);
  whens.push(isNaN(when) ? 0 : when);
}

/**
 * @param {Node} node Node to append a TextNode with the color to.
 * @param {import("../color.js").Color|string} color Color.
 */
function writeColorTextNode(node, color) {
  var rgba = (0, _color.asArray)(color);
  var opacity = rgba.length == 4 ? rgba[3] : 1;
  /** @type {Array<string|number>} */
  var abgr = [opacity * 255, rgba[2], rgba[1], rgba[0]];
  for (var i = 0; i < 4; ++i) {
    var hex = Math.floor( /** @type {number} */abgr[i]).toString(16);
    abgr[i] = hex.length == 1 ? '0' + hex : hex;
  }
  (0, _xsd.writeStringTextNode)(node, abgr.join(''));
}

/**
 * @param {Node} node Node to append a TextNode with the coordinates to.
 * @param {Array<number>} coordinates Coordinates.
 * @param {Array<*>} objectStack Object stack.
 */
function writeCoordinatesTextNode(node, coordinates, objectStack) {
  var context = objectStack[objectStack.length - 1];

  var layout = context['layout'];
  var stride = context['stride'];

  var dimension;
  if (layout == _GeometryLayout2.default.XY || layout == _GeometryLayout2.default.XYM) {
    dimension = 2;
  } else if (layout == _GeometryLayout2.default.XYZ || layout == _GeometryLayout2.default.XYZM) {
    dimension = 3;
  } else {
    (0, _asserts.assert)(false, 34); // Invalid geometry layout
  }

  var ii = coordinates.length;
  var text = '';
  if (ii > 0) {
    text += coordinates[0];
    for (var d = 1; d < dimension; ++d) {
      text += ',' + coordinates[d];
    }
    for (var i = stride; i < ii; i += stride) {
      text += ' ' + coordinates[i];
      for (var d$1 = 1; d$1 < dimension; ++d$1) {
        text += ',' + coordinates[i + d$1];
      }
    }
  }
  (0, _xsd.writeStringTextNode)(node, text);
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 */
var EXTENDEDDATA_NODE_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Data': (0, _xml.makeChildAppender)(writeDataNode),
  'value': (0, _xml.makeChildAppender)(writeDataNodeValue),
  'displayName': (0, _xml.makeChildAppender)(writeDataNodeName)
});

/**
 * @param {Element} node Node.
 * @param {{name: *, value: *}} pair Name value pair.
 * @param {Array<*>} objectStack Object stack.
 */
function writeDataNode(node, pair, objectStack) {
  node.setAttribute('name', pair.name);
  var /** @type {import("../xml.js").NodeStackItem} */context = { node: node };
  var value = pair.value;

  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') {
    if (value !== null && value.displayName) {
      (0, _xml.pushSerializeAndPop)(context, EXTENDEDDATA_NODE_SERIALIZERS, _xml.OBJECT_PROPERTY_NODE_FACTORY, [value.displayName], objectStack, ['displayName']);
    }

    if (value !== null && value.value) {
      (0, _xml.pushSerializeAndPop)(context, EXTENDEDDATA_NODE_SERIALIZERS, _xml.OBJECT_PROPERTY_NODE_FACTORY, [value.value], objectStack, ['value']);
    }
  } else {
    (0, _xml.pushSerializeAndPop)(context, EXTENDEDDATA_NODE_SERIALIZERS, _xml.OBJECT_PROPERTY_NODE_FACTORY, [value], objectStack, ['value']);
  }
}

/**
 * @param {Node} node Node to append a TextNode with the name to.
 * @param {string} name DisplayName.
 */
function writeDataNodeName(node, name) {
  (0, _xsd.writeCDATASection)(node, name);
}

/**
 * @param {Node} node Node to append a CDATA Section with the value to.
 * @param {string} value Value.
 */
function writeDataNodeValue(node, value) {
  (0, _xsd.writeStringTextNode)(node, value);
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 */
var DOCUMENT_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Placemark': (0, _xml.makeChildAppender)(writePlacemark)
});

/**
 * @const
 * @param {*} value Value.
 * @param {Array<*>} objectStack Object stack.
 * @param {string=} opt_nodeName Node name.
 * @return {Node|undefined} Node.
 */
var DOCUMENT_NODE_FACTORY = function DOCUMENT_NODE_FACTORY(value, objectStack, opt_nodeName) {
  var parentNode = objectStack[objectStack.length - 1].node;
  return (0, _xml.createElementNS)(parentNode.namespaceURI, 'Placemark');
};

/**
 * @param {Node} node Node.
 * @param {Array<Feature>} features Features.
 * @param {Array<*>} objectStack Object stack.
 * @this {KML}
 */
function writeDocument(node, features, objectStack) {
  var /** @type {import("../xml.js").NodeStackItem} */context = { node: node };
  (0, _xml.pushSerializeAndPop)(context, DOCUMENT_SERIALIZERS, DOCUMENT_NODE_FACTORY, features, objectStack, undefined, this);
}

/**
 * A factory for creating Data nodes.
 * @const
 * @type {function(*, Array<*>): (Node|undefined)}
 */
var DATA_NODE_FACTORY = (0, _xml.makeSimpleNodeFactory)('Data');

/**
 * @param {Node} node Node.
 * @param {{names: Array<string>, values: (Array<*>)}} namesAndValues Names and values.
 * @param {Array<*>} objectStack Object stack.
 */
function writeExtendedData(node, namesAndValues, objectStack) {
  var /** @type {import("../xml.js").NodeStackItem} */context = { node: node };
  var names = namesAndValues.names;
  var values = namesAndValues.values;
  var length = names.length;

  for (var i = 0; i < length; i++) {
    (0, _xml.pushSerializeAndPop)(context, EXTENDEDDATA_NODE_SERIALIZERS, DATA_NODE_FACTORY, [{ name: names[i], value: values[i] }], objectStack);
  }
}

/**
 * @const
 * @type {Object<string, Array<string>>}
 */
var ICON_SEQUENCE = (0, _xml.makeStructureNS)(NAMESPACE_URIS, ['href'], (0, _xml.makeStructureNS)(GX_NAMESPACE_URIS, ['x', 'y', 'w', 'h']));

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 */
var ICON_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'href': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode)
}, (0, _xml.makeStructureNS)(GX_NAMESPACE_URIS, {
  'x': (0, _xml.makeChildAppender)(_xsd.writeDecimalTextNode),
  'y': (0, _xml.makeChildAppender)(_xsd.writeDecimalTextNode),
  'w': (0, _xml.makeChildAppender)(_xsd.writeDecimalTextNode),
  'h': (0, _xml.makeChildAppender)(_xsd.writeDecimalTextNode)
}));

/**
 * @const
 * @param {*} value Value.
 * @param {Array<*>} objectStack Object stack.
 * @param {string=} opt_nodeName Node name.
 * @return {Node|undefined} Node.
 */
var GX_NODE_FACTORY = function GX_NODE_FACTORY(value, objectStack, opt_nodeName) {
  return (0, _xml.createElementNS)(GX_NAMESPACE_URIS[0], 'gx:' + opt_nodeName);
};

/**
 * @param {Node} node Node.
 * @param {Object} icon Icon object.
 * @param {Array<*>} objectStack Object stack.
 */
function writeIcon(node, icon, objectStack) {
  var /** @type {import("../xml.js").NodeStackItem} */context = { node: node };
  var parentNode = objectStack[objectStack.length - 1].node;
  var orderedKeys = ICON_SEQUENCE[parentNode.namespaceURI];
  var values = (0, _xml.makeSequence)(icon, orderedKeys);
  (0, _xml.pushSerializeAndPop)(context, ICON_SERIALIZERS, _xml.OBJECT_PROPERTY_NODE_FACTORY, values, objectStack, orderedKeys);
  orderedKeys = ICON_SEQUENCE[GX_NAMESPACE_URIS[0]];
  values = (0, _xml.makeSequence)(icon, orderedKeys);
  (0, _xml.pushSerializeAndPop)(context, ICON_SERIALIZERS, GX_NODE_FACTORY, values, objectStack, orderedKeys);
}

/**
 * @const
 * @type {Object<string, Array<string>>}
 */
var ICON_STYLE_SEQUENCE = (0, _xml.makeStructureNS)(NAMESPACE_URIS, ['scale', 'heading', 'Icon', 'hotSpot']);

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 */
var ICON_STYLE_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'Icon': (0, _xml.makeChildAppender)(writeIcon),
  'heading': (0, _xml.makeChildAppender)(_xsd.writeDecimalTextNode),
  'hotSpot': (0, _xml.makeChildAppender)(writeVec2),
  'scale': (0, _xml.makeChildAppender)(writeScaleTextNode)
});

/**
 * @param {Node} node Node.
 * @param {import("../style/Icon.js").default} style Icon style.
 * @param {Array<*>} objectStack Object stack.
 */
function writeIconStyle(node, style, objectStack) {
  var /** @type {import("../xml.js").NodeStackItem} */context = { node: node };
  var properties = {};
  var src = style.getSrc();
  var size = style.getSize();
  var iconImageSize = style.getImageSize();
  var iconProperties = {
    'href': src
  };

  if (size) {
    iconProperties['w'] = size[0];
    iconProperties['h'] = size[1];
    var anchor = style.getAnchor(); // top-left
    var origin = style.getOrigin(); // top-left

    if (origin && iconImageSize && origin[0] !== 0 && origin[1] !== size[1]) {
      iconProperties['x'] = origin[0];
      iconProperties['y'] = iconImageSize[1] - (origin[1] + size[1]);
    }

    if (anchor && (anchor[0] !== size[0] / 2 || anchor[1] !== size[1] / 2)) {
      var /** @type {Vec2} */hotSpot = {
        x: anchor[0],
        xunits: _IconAnchorUnits2.default.PIXELS,
        y: size[1] - anchor[1],
        yunits: _IconAnchorUnits2.default.PIXELS
      };
      properties['hotSpot'] = hotSpot;
    }
  }

  properties['Icon'] = iconProperties;

  var scale = style.getScale();
  if (scale !== 1) {
    properties['scale'] = scale;
  }

  var rotation = style.getRotation();
  if (rotation !== 0) {
    properties['heading'] = rotation; // 0-360
  }

  var parentNode = objectStack[objectStack.length - 1].node;
  var orderedKeys = ICON_STYLE_SEQUENCE[parentNode.namespaceURI];
  var values = (0, _xml.makeSequence)(properties, orderedKeys);
  (0, _xml.pushSerializeAndPop)(context, ICON_STYLE_SERIALIZERS, _xml.OBJECT_PROPERTY_NODE_FACTORY, values, objectStack, orderedKeys);
}

/**
 * @const
 * @type {Object<string, Array<string>>}
 */
var LABEL_STYLE_SEQUENCE = (0, _xml.makeStructureNS)(NAMESPACE_URIS, ['color', 'scale']);

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 */
var LABEL_STYLE_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'color': (0, _xml.makeChildAppender)(writeColorTextNode),
  'scale': (0, _xml.makeChildAppender)(writeScaleTextNode)
});

/**
 * @param {Node} node Node.
 * @param {Text} style style.
 * @param {Array<*>} objectStack Object stack.
 */
function writeLabelStyle(node, style, objectStack) {
  var /** @type {import("../xml.js").NodeStackItem} */context = { node: node };
  var properties = {};
  var fill = style.getFill();
  if (fill) {
    properties['color'] = fill.getColor();
  }
  var scale = style.getScale();
  if (scale && scale !== 1) {
    properties['scale'] = scale;
  }
  var parentNode = objectStack[objectStack.length - 1].node;
  var orderedKeys = LABEL_STYLE_SEQUENCE[parentNode.namespaceURI];
  var values = (0, _xml.makeSequence)(properties, orderedKeys);
  (0, _xml.pushSerializeAndPop)(context, LABEL_STYLE_SERIALIZERS, _xml.OBJECT_PROPERTY_NODE_FACTORY, values, objectStack, orderedKeys);
}

/**
 * @const
 * @type {Object<string, Array<string>>}
 */
var LINE_STYLE_SEQUENCE = (0, _xml.makeStructureNS)(NAMESPACE_URIS, ['color', 'width']);

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 */
var LINE_STYLE_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'color': (0, _xml.makeChildAppender)(writeColorTextNode),
  'width': (0, _xml.makeChildAppender)(_xsd.writeDecimalTextNode)
});

/**
 * @param {Node} node Node.
 * @param {Stroke} style style.
 * @param {Array<*>} objectStack Object stack.
 */
function writeLineStyle(node, style, objectStack) {
  var /** @type {import("../xml.js").NodeStackItem} */context = { node: node };
  var properties = {
    'color': style.getColor(),
    'width': style.getWidth()
  };
  var parentNode = objectStack[objectStack.length - 1].node;
  var orderedKeys = LINE_STYLE_SEQUENCE[parentNode.namespaceURI];
  var values = (0, _xml.makeSequence)(properties, orderedKeys);
  (0, _xml.pushSerializeAndPop)(context, LINE_STYLE_SERIALIZERS, _xml.OBJECT_PROPERTY_NODE_FACTORY, values, objectStack, orderedKeys);
}

/**
 * @const
 * @type {Object<string, string>}
 */
var GEOMETRY_TYPE_TO_NODENAME = {
  'Point': 'Point',
  'LineString': 'LineString',
  'LinearRing': 'LinearRing',
  'Polygon': 'Polygon',
  'MultiPoint': 'MultiGeometry',
  'MultiLineString': 'MultiGeometry',
  'MultiPolygon': 'MultiGeometry',
  'GeometryCollection': 'MultiGeometry'
};

/**
 * @const
 * @param {*} value Value.
 * @param {Array<*>} objectStack Object stack.
 * @param {string=} opt_nodeName Node name.
 * @return {Node|undefined} Node.
 */
var GEOMETRY_NODE_FACTORY = function GEOMETRY_NODE_FACTORY(value, objectStack, opt_nodeName) {
  if (value) {
    var parentNode = objectStack[objectStack.length - 1].node;
    return (0, _xml.createElementNS)(parentNode.namespaceURI, GEOMETRY_TYPE_TO_NODENAME[/** @type {import("../geom/Geometry.js").default} */value.getType()]);
  }
};

/**
 * A factory for creating Point nodes.
 * @const
 * @type {function(*, Array<*>, string=): (Node|undefined)}
 */
var POINT_NODE_FACTORY = (0, _xml.makeSimpleNodeFactory)('Point');

/**
 * A factory for creating LineString nodes.
 * @const
 * @type {function(*, Array<*>, string=): (Node|undefined)}
 */
var LINE_STRING_NODE_FACTORY = (0, _xml.makeSimpleNodeFactory)('LineString');

/**
 * A factory for creating LinearRing nodes.
 * @const
 * @type {function(*, Array<*>, string=): (Node|undefined)}
 */
var LINEAR_RING_NODE_FACTORY = (0, _xml.makeSimpleNodeFactory)('LinearRing');

/**
 * A factory for creating Polygon nodes.
 * @const
 * @type {function(*, Array<*>, string=): (Node|undefined)}
 */
var POLYGON_NODE_FACTORY = (0, _xml.makeSimpleNodeFactory)('Polygon');

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 */
var MULTI_GEOMETRY_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'LineString': (0, _xml.makeChildAppender)(writePrimitiveGeometry),
  'Point': (0, _xml.makeChildAppender)(writePrimitiveGeometry),
  'Polygon': (0, _xml.makeChildAppender)(writePolygon),
  'GeometryCollection': (0, _xml.makeChildAppender)(writeMultiGeometry)
});

/**
 * @param {Node} node Node.
 * @param {import("../geom/Geometry.js").default} geometry Geometry.
 * @param {Array<*>} objectStack Object stack.
 */
function writeMultiGeometry(node, geometry, objectStack) {
  /** @type {import("../xml.js").NodeStackItem} */
  var context = { node: node };
  var type = geometry.getType();
  /** @type {Array<import("../geom/Geometry.js").default>} */
  var geometries;
  /** @type {function(*, Array<*>, string=): (Node|undefined)} */
  var factory;
  if (type == _GeometryType2.default.GEOMETRY_COLLECTION) {
    geometries = /** @type {GeometryCollection} */geometry.getGeometries();
    factory = GEOMETRY_NODE_FACTORY;
  } else if (type == _GeometryType2.default.MULTI_POINT) {
    geometries = /** @type {MultiPoint} */geometry.getPoints();
    factory = POINT_NODE_FACTORY;
  } else if (type == _GeometryType2.default.MULTI_LINE_STRING) {
    geometries = /** @type {MultiLineString} */geometry.getLineStrings();
    factory = LINE_STRING_NODE_FACTORY;
  } else if (type == _GeometryType2.default.MULTI_POLYGON) {
    geometries = /** @type {MultiPolygon} */geometry.getPolygons();
    factory = POLYGON_NODE_FACTORY;
  } else {
    (0, _asserts.assert)(false, 39); // Unknown geometry type
  }
  (0, _xml.pushSerializeAndPop)(context, MULTI_GEOMETRY_SERIALIZERS, factory, geometries, objectStack);
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 */
var BOUNDARY_IS_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'LinearRing': (0, _xml.makeChildAppender)(writePrimitiveGeometry)
});

/**
 * @param {Node} node Node.
 * @param {import("../geom/LinearRing.js").default} linearRing Linear ring.
 * @param {Array<*>} objectStack Object stack.
 */
function writeBoundaryIs(node, linearRing, objectStack) {
  var /** @type {import("../xml.js").NodeStackItem} */context = { node: node };
  (0, _xml.pushSerializeAndPop)(context, BOUNDARY_IS_SERIALIZERS, LINEAR_RING_NODE_FACTORY, [linearRing], objectStack);
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 */
var PLACEMARK_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'ExtendedData': (0, _xml.makeChildAppender)(writeExtendedData),
  'MultiGeometry': (0, _xml.makeChildAppender)(writeMultiGeometry),
  'LineString': (0, _xml.makeChildAppender)(writePrimitiveGeometry),
  'LinearRing': (0, _xml.makeChildAppender)(writePrimitiveGeometry),
  'Point': (0, _xml.makeChildAppender)(writePrimitiveGeometry),
  'Polygon': (0, _xml.makeChildAppender)(writePolygon),
  'Style': (0, _xml.makeChildAppender)(writeStyle),
  'address': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'description': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'name': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'open': (0, _xml.makeChildAppender)(_xsd.writeBooleanTextNode),
  'phoneNumber': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'styleUrl': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'visibility': (0, _xml.makeChildAppender)(_xsd.writeBooleanTextNode)
});

/**
 * @const
 * @type {Object<string, Array<string>>}
 */
var PLACEMARK_SEQUENCE = (0, _xml.makeStructureNS)(NAMESPACE_URIS, ['name', 'open', 'visibility', 'address', 'phoneNumber', 'description', 'styleUrl', 'Style']);

/**
 * A factory for creating ExtendedData nodes.
 * @const
 * @type {function(*, Array<*>): (Node|undefined)}
 */
var EXTENDEDDATA_NODE_FACTORY = (0, _xml.makeSimpleNodeFactory)('ExtendedData');

/**
 * FIXME currently we do serialize arbitrary/custom feature properties
 * (ExtendedData).
 * @param {Element} node Node.
 * @param {Feature} feature Feature.
 * @param {Array<*>} objectStack Object stack.
 * @this {KML}
 */
function writePlacemark(node, feature, objectStack) {
  var /** @type {import("../xml.js").NodeStackItem} */context = { node: node };

  // set id
  if (feature.getId()) {
    node.setAttribute('id', /** @type {string} */feature.getId());
  }

  // serialize properties (properties unknown to KML are not serialized)
  var properties = feature.getProperties();

  // don't export these to ExtendedData
  var filter = { 'address': 1, 'description': 1, 'name': 1, 'open': 1,
    'phoneNumber': 1, 'styleUrl': 1, 'visibility': 1 };
  filter[feature.getGeometryName()] = 1;
  var keys = Object.keys(properties || {}).sort().filter(function (v) {
    return !filter[v];
  });

  if (keys.length > 0) {
    var sequence = (0, _xml.makeSequence)(properties, keys);
    var namesAndValues = { names: keys, values: sequence };
    (0, _xml.pushSerializeAndPop)(context, PLACEMARK_SERIALIZERS, EXTENDEDDATA_NODE_FACTORY, [namesAndValues], objectStack);
  }

  var styleFunction = feature.getStyleFunction();
  if (styleFunction) {
    // FIXME the styles returned by the style function are supposed to be
    // resolution-independent here
    var styles = styleFunction(feature, 0);
    if (styles) {
      var style = Array.isArray(styles) ? styles[0] : styles;
      if (this.writeStyles_) {
        properties['Style'] = style;
      }
      var textStyle = style.getText();
      if (textStyle) {
        properties['name'] = textStyle.getText();
      }
    }
  }
  var parentNode = objectStack[objectStack.length - 1].node;
  var orderedKeys = PLACEMARK_SEQUENCE[parentNode.namespaceURI];
  var values = (0, _xml.makeSequence)(properties, orderedKeys);
  (0, _xml.pushSerializeAndPop)(context, PLACEMARK_SERIALIZERS, _xml.OBJECT_PROPERTY_NODE_FACTORY, values, objectStack, orderedKeys);

  // serialize geometry
  var options = /** @type {import("./Feature.js").WriteOptions} */objectStack[0];
  var geometry = feature.getGeometry();
  if (geometry) {
    geometry = /** @type {import("../geom/Geometry.js").default} */(0, _Feature3.transformWithOptions)(geometry, true, options);
  }
  (0, _xml.pushSerializeAndPop)(context, PLACEMARK_SERIALIZERS, GEOMETRY_NODE_FACTORY, [geometry], objectStack);
}

/**
 * @const
 * @type {Object<string, Array<string>>}
 */
var PRIMITIVE_GEOMETRY_SEQUENCE = (0, _xml.makeStructureNS)(NAMESPACE_URIS, ['extrude', 'tessellate', 'altitudeMode', 'coordinates']);

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 */
var PRIMITIVE_GEOMETRY_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'extrude': (0, _xml.makeChildAppender)(_xsd.writeBooleanTextNode),
  'tessellate': (0, _xml.makeChildAppender)(_xsd.writeBooleanTextNode),
  'altitudeMode': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
  'coordinates': (0, _xml.makeChildAppender)(writeCoordinatesTextNode)
});

/**
 * @param {Node} node Node.
 * @param {import("../geom/SimpleGeometry.js").default} geometry Geometry.
 * @param {Array<*>} objectStack Object stack.
 */
function writePrimitiveGeometry(node, geometry, objectStack) {
  var flatCoordinates = geometry.getFlatCoordinates();
  var /** @type {import("../xml.js").NodeStackItem} */context = { node: node };
  context['layout'] = geometry.getLayout();
  context['stride'] = geometry.getStride();

  // serialize properties (properties unknown to KML are not serialized)
  var properties = geometry.getProperties();
  properties.coordinates = flatCoordinates;

  var parentNode = objectStack[objectStack.length - 1].node;
  var orderedKeys = PRIMITIVE_GEOMETRY_SEQUENCE[parentNode.namespaceURI];
  var values = (0, _xml.makeSequence)(properties, orderedKeys);
  (0, _xml.pushSerializeAndPop)(context, PRIMITIVE_GEOMETRY_SERIALIZERS, _xml.OBJECT_PROPERTY_NODE_FACTORY, values, objectStack, orderedKeys);
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 */
var POLYGON_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'outerBoundaryIs': (0, _xml.makeChildAppender)(writeBoundaryIs),
  'innerBoundaryIs': (0, _xml.makeChildAppender)(writeBoundaryIs)
});

/**
 * A factory for creating innerBoundaryIs nodes.
 * @const
 * @type {function(*, Array<*>, string=): (Node|undefined)}
 */
var INNER_BOUNDARY_NODE_FACTORY = (0, _xml.makeSimpleNodeFactory)('innerBoundaryIs');

/**
 * A factory for creating outerBoundaryIs nodes.
 * @const
 * @type {function(*, Array<*>, string=): (Node|undefined)}
 */
var OUTER_BOUNDARY_NODE_FACTORY = (0, _xml.makeSimpleNodeFactory)('outerBoundaryIs');

/**
 * @param {Node} node Node.
 * @param {Polygon} polygon Polygon.
 * @param {Array<*>} objectStack Object stack.
 */
function writePolygon(node, polygon, objectStack) {
  var linearRings = polygon.getLinearRings();
  var outerRing = linearRings.shift();
  var /** @type {import("../xml.js").NodeStackItem} */context = { node: node };
  // inner rings
  (0, _xml.pushSerializeAndPop)(context, POLYGON_SERIALIZERS, INNER_BOUNDARY_NODE_FACTORY, linearRings, objectStack);
  // outer ring
  (0, _xml.pushSerializeAndPop)(context, POLYGON_SERIALIZERS, OUTER_BOUNDARY_NODE_FACTORY, [outerRing], objectStack);
}

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 */
var POLY_STYLE_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'color': (0, _xml.makeChildAppender)(writeColorTextNode)
});

/**
 * A factory for creating coordinates nodes.
 * @const
 * @type {function(*, Array<*>, string=): (Node|undefined)}
 */
var COLOR_NODE_FACTORY = (0, _xml.makeSimpleNodeFactory)('color');

/**
 * @param {Node} node Node.
 * @param {Fill} style Style.
 * @param {Array<*>} objectStack Object stack.
 */
function writePolyStyle(node, style, objectStack) {
  var /** @type {import("../xml.js").NodeStackItem} */context = { node: node };
  (0, _xml.pushSerializeAndPop)(context, POLY_STYLE_SERIALIZERS, COLOR_NODE_FACTORY, [style.getColor()], objectStack);
}

/**
 * @param {Node} node Node to append a TextNode with the scale to.
 * @param {number|undefined} scale Scale.
 */
function writeScaleTextNode(node, scale) {
  // the Math is to remove any excess decimals created by float arithmetic
  (0, _xsd.writeDecimalTextNode)(node, Math.round(scale * 1e6) / 1e6);
}

/**
 * @const
 * @type {Object<string, Array<string>>}
 */
var STYLE_SEQUENCE = (0, _xml.makeStructureNS)(NAMESPACE_URIS, ['IconStyle', 'LabelStyle', 'LineStyle', 'PolyStyle']);

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 */
var STYLE_SERIALIZERS = (0, _xml.makeStructureNS)(NAMESPACE_URIS, {
  'IconStyle': (0, _xml.makeChildAppender)(writeIconStyle),
  'LabelStyle': (0, _xml.makeChildAppender)(writeLabelStyle),
  'LineStyle': (0, _xml.makeChildAppender)(writeLineStyle),
  'PolyStyle': (0, _xml.makeChildAppender)(writePolyStyle)
});

/**
 * @param {Node} node Node.
 * @param {Style} style Style.
 * @param {Array<*>} objectStack Object stack.
 */
function writeStyle(node, style, objectStack) {
  var /** @type {import("../xml.js").NodeStackItem} */context = { node: node };
  var properties = {};
  var fillStyle = style.getFill();
  var strokeStyle = style.getStroke();
  var imageStyle = style.getImage();
  var textStyle = style.getText();
  if (imageStyle && typeof /** @type {?} */imageStyle.getSrc === 'function') {
    properties['IconStyle'] = imageStyle;
  }
  if (textStyle) {
    properties['LabelStyle'] = textStyle;
  }
  if (strokeStyle) {
    properties['LineStyle'] = strokeStyle;
  }
  if (fillStyle) {
    properties['PolyStyle'] = fillStyle;
  }
  var parentNode = objectStack[objectStack.length - 1].node;
  var orderedKeys = STYLE_SEQUENCE[parentNode.namespaceURI];
  var values = (0, _xml.makeSequence)(properties, orderedKeys);
  (0, _xml.pushSerializeAndPop)(context, STYLE_SERIALIZERS, _xml.OBJECT_PROPERTY_NODE_FACTORY, values, objectStack, orderedKeys);
}

/**
 * @param {Element} node Node to append a TextNode with the Vec2 to.
 * @param {Vec2} vec2 Vec2.
 */
function writeVec2(node, vec2) {
  node.setAttribute('x', String(vec2.x));
  node.setAttribute('y', String(vec2.y));
  node.setAttribute('xunits', vec2.xunits);
  node.setAttribute('yunits', vec2.yunits);
}

exports.default = KML;

//# sourceMappingURL=KML.js.map