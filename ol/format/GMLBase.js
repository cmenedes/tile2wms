'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GMLNS = undefined;

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

var _LinearRing = require('../geom/LinearRing.js');

var _LinearRing2 = _interopRequireDefault(_LinearRing);

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

var _obj = require('../obj.js');

var _proj = require('../proj.js');

var _xml = require('../xml.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @const
 * @type {string}
 */
var GMLNS = exports.GMLNS = 'http://www.opengis.net/gml';

/**
 * A regular expression that matches if a string only contains whitespace
 * characters. It will e.g. match `''`, `' '`, `'\n'` etc. The non-breaking
 * space (0xa0) is explicitly included as IE doesn't include it in its
 * definition of `\s`.
 *
 * Information from `goog.string.isEmptyOrWhitespace`: https://github.com/google/closure-library/blob/e877b1e/closure/goog/string/string.js#L156-L160
 *
 * @const
 * @type {RegExp}
 */
/**
 * @module ol/format/GMLBase
 */
// FIXME Envelopes should not be treated as geometries! readEnvelope_ is part
// of GEOMETRY_PARSERS_ and methods using GEOMETRY_PARSERS_ do not expect
// envelopes/extents, only geometries!
var ONLY_WHITESPACE_RE = /^[\s\xa0]*$/;

/**
 * @typedef {Object} Options
 * @property {Object<string, string>|string} [featureNS] Feature
 * namespace. If not defined will be derived from GML. If multiple
 * feature types have been configured which come from different feature
 * namespaces, this will be an object with the keys being the prefixes used
 * in the entries of featureType array. The values of the object will be the
 * feature namespaces themselves. So for instance there might be a featureType
 * item `topp:states` in the `featureType` array and then there will be a key
 * `topp` in the featureNS object with value `http://www.openplans.org/topp`.
 * @property {Array<string>|string} [featureType] Feature type(s) to parse.
 * If multiple feature types need to be configured
 * which come from different feature namespaces, `featureNS` will be an object
 * with the keys being the prefixes used in the entries of featureType array.
 * The values of the object will be the feature namespaces themselves.
 * So for instance there might be a featureType item `topp:states` and then
 * there will be a key named `topp` in the featureNS object with value
 * `http://www.openplans.org/topp`.
 * @property {string} srsName srsName to use when writing geometries.
 * @property {boolean} [surface=false] Write gml:Surface instead of gml:Polygon
 * elements. This also affects the elements in multi-part geometries.
 * @property {boolean} [curve=false] Write gml:Curve instead of gml:LineString
 * elements. This also affects the elements in multi-part geometries.
 * @property {boolean} [multiCurve=true] Write gml:MultiCurve instead of gml:MultiLineString.
 * Since the latter is deprecated in GML 3.
 * @property {boolean} [multiSurface=true] Write gml:multiSurface instead of
 * gml:MultiPolygon. Since the latter is deprecated in GML 3.
 * @property {string} [schemaLocation] Optional schemaLocation to use when
 * writing out the GML, this will override the default provided.
 * @property {boolean} [hasZ=false] If coordinates have a Z value.
 */

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Feature base format for reading and writing data in the GML format.
 * This class cannot be instantiated, it contains only base content that
 * is shared with versioned format classes GML2 and GML3.
 *
 * @abstract
 */
var GMLBase = /*@__PURE__*/function (XMLFeature) {
  function GMLBase(opt_options) {
    XMLFeature.call(this);

    var options = /** @type {Options} */opt_options ? opt_options : {};

    /**
     * @protected
     * @type {Array<string>|string|undefined}
     */
    this.featureType = options.featureType;

    /**
     * @protected
     * @type {Object<string, string>|string|undefined}
     */
    this.featureNS = options.featureNS;

    /**
     * @protected
     * @type {string}
     */
    this.srsName = options.srsName;

    /**
     * @protected
     * @type {string}
     */
    this.schemaLocation = '';

    /**
     * @type {Object<string, Object<string, Object>>}
     */
    this.FEATURE_COLLECTION_PARSERS = {};
    this.FEATURE_COLLECTION_PARSERS[this.namespace] = {
      'featureMember': (0, _xml.makeArrayPusher)(this.readFeaturesInternal),
      'featureMembers': (0, _xml.makeReplacer)(this.readFeaturesInternal)
    };
  }

  if (XMLFeature) GMLBase.__proto__ = XMLFeature;
  GMLBase.prototype = Object.create(XMLFeature && XMLFeature.prototype);
  GMLBase.prototype.constructor = GMLBase;

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Array<Feature> | undefined} Features.
   */
  GMLBase.prototype.readFeaturesInternal = function readFeaturesInternal(node, objectStack) {
    var localName = node.localName;
    var features = null;
    if (localName == 'FeatureCollection') {
      features = (0, _xml.pushParseAndPop)([], this.FEATURE_COLLECTION_PARSERS, node, objectStack, this);
    } else if (localName == 'featureMembers' || localName == 'featureMember') {
      var context = objectStack[0];
      var featureType = context['featureType'];
      var featureNS = context['featureNS'];
      var prefix = 'p';
      var defaultPrefix = 'p0';
      if (!featureType && node.childNodes) {
        featureType = [], featureNS = {};
        for (var i = 0, ii = node.childNodes.length; i < ii; ++i) {
          var child = node.childNodes[i];
          if (child.nodeType === 1) {
            var ft = child.nodeName.split(':').pop();
            if (featureType.indexOf(ft) === -1) {
              var key = '';
              var count = 0;
              var uri = child.namespaceURI;
              for (var candidate in featureNS) {
                if (featureNS[candidate] === uri) {
                  key = candidate;
                  break;
                }
                ++count;
              }
              if (!key) {
                key = prefix + count;
                featureNS[key] = uri;
              }
              featureType.push(key + ':' + ft);
            }
          }
        }
        if (localName != 'featureMember') {
          // recheck featureType for each featureMember
          context['featureType'] = featureType;
          context['featureNS'] = featureNS;
        }
      }
      if (typeof featureNS === 'string') {
        var ns = featureNS;
        featureNS = {};
        featureNS[defaultPrefix] = ns;
      }
      /** @type {Object<string, Object<string, import("../xml.js").Parser>>} */
      var parsersNS = {};
      var featureTypes = Array.isArray(featureType) ? featureType : [featureType];
      for (var p in featureNS) {
        /** @type {Object<string, import("../xml.js").Parser>} */
        var parsers = {};
        for (var i$1 = 0, ii$1 = featureTypes.length; i$1 < ii$1; ++i$1) {
          var featurePrefix = featureTypes[i$1].indexOf(':') === -1 ? defaultPrefix : featureTypes[i$1].split(':')[0];
          if (featurePrefix === p) {
            parsers[featureTypes[i$1].split(':').pop()] = localName == 'featureMembers' ? (0, _xml.makeArrayPusher)(this.readFeatureElement, this) : (0, _xml.makeReplacer)(this.readFeatureElement, this);
          }
        }
        parsersNS[featureNS[p]] = parsers;
      }
      if (localName == 'featureMember') {
        features = (0, _xml.pushParseAndPop)(undefined, parsersNS, node, objectStack);
      } else {
        features = (0, _xml.pushParseAndPop)([], parsersNS, node, objectStack);
      }
    }
    if (features === null) {
      features = [];
    }
    return features;
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {import("../geom/Geometry.js").default|undefined} Geometry.
   */
  GMLBase.prototype.readGeometryElement = function readGeometryElement(node, objectStack) {
    var context = /** @type {Object} */objectStack[0];
    context['srsName'] = node.firstElementChild.getAttribute('srsName');
    context['srsDimension'] = node.firstElementChild.getAttribute('srsDimension');
    /** @type {import("../geom/Geometry.js").default} */
    var geometry = (0, _xml.pushParseAndPop)(null, this.GEOMETRY_PARSERS, node, objectStack, this);
    if (geometry) {
      return (
        /** @type {import("../geom/Geometry.js").default} */(0, _Feature3.transformWithOptions)(geometry, false, context)
      );
    } else {
      return undefined;
    }
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @param {boolean} asFeature whether result should be wrapped as a feature.
   * @return {Feature|Object} Feature
   */
  GMLBase.prototype.readFeatureElementInternal = function readFeatureElementInternal(node, objectStack, asFeature) {
    var geometryName;
    var values = {};
    for (var n = node.firstElementChild; n; n = n.nextElementSibling) {
      var value = void 0;
      var localName = n.localName;
      // first, check if it is simple attribute
      if (n.childNodes.length === 0 || n.childNodes.length === 1 && (n.firstChild.nodeType === 3 || n.firstChild.nodeType === 4)) {
        value = (0, _xml.getAllTextContent)(n, false);
        if (ONLY_WHITESPACE_RE.test(value)) {
          value = undefined;
        }
      } else {
        if (asFeature) {
          //if feature, try it as a geometry
          value = this.readGeometryElement(n, objectStack);
        }
        if (!value) {
          //if not a geometry or not a feature, treat it as a complex attribute
          value = this.readFeatureElementInternal(n, objectStack, false);
        } else if (localName !== 'boundedBy') {
          // boundedBy is an extent and must not be considered as a geometry
          geometryName = localName;
        }
      }

      if (values[localName]) {
        if (!(values[localName] instanceof Array)) {
          values[localName] = [values[localName]];
        }
        values[localName].push(value);
      } else {
        values[localName] = value;
      }

      var len = n.attributes.length;
      if (len > 0) {
        values[localName] = { _content_: values[localName] };
        for (var i = 0; i < len; i++) {
          var attName = n.attributes[i].name;
          values[localName][attName] = n.attributes[i].value;
        }
      }
    }
    if (!asFeature) {
      return values;
    } else {
      var feature = new _Feature2.default(values);
      if (geometryName) {
        feature.setGeometryName(geometryName);
      }
      var fid = node.getAttribute('fid') || (0, _xml.getAttributeNS)(node, this.namespace, 'id');
      if (fid) {
        feature.setId(fid);
      }
      return feature;
    }
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Feature} Feature.
   */
  GMLBase.prototype.readFeatureElement = function readFeatureElement(node, objectStack) {
    return this.readFeatureElementInternal(node, objectStack, true);
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Point|undefined} Point.
   */
  GMLBase.prototype.readPoint = function readPoint(node, objectStack) {
    var flatCoordinates = this.readFlatCoordinatesFromNode_(node, objectStack);
    if (flatCoordinates) {
      return new _Point2.default(flatCoordinates, _GeometryLayout2.default.XYZ);
    }
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {MultiPoint|undefined} MultiPoint.
   */
  GMLBase.prototype.readMultiPoint = function readMultiPoint(node, objectStack) {
    /** @type {Array<Array<number>>} */
    var coordinates = (0, _xml.pushParseAndPop)([], this.MULTIPOINT_PARSERS_, node, objectStack, this);
    if (coordinates) {
      return new _MultiPoint2.default(coordinates);
    } else {
      return undefined;
    }
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {MultiLineString|undefined} MultiLineString.
   */
  GMLBase.prototype.readMultiLineString = function readMultiLineString(node, objectStack) {
    /** @type {Array<LineString>} */
    var lineStrings = (0, _xml.pushParseAndPop)([], this.MULTILINESTRING_PARSERS_, node, objectStack, this);
    if (lineStrings) {
      return new _MultiLineString2.default(lineStrings);
    }
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {MultiPolygon|undefined} MultiPolygon.
   */
  GMLBase.prototype.readMultiPolygon = function readMultiPolygon(node, objectStack) {
    /** @type {Array<Polygon>} */
    var polygons = (0, _xml.pushParseAndPop)([], this.MULTIPOLYGON_PARSERS_, node, objectStack, this);
    if (polygons) {
      return new _MultiPolygon2.default(polygons);
    }
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   */
  GMLBase.prototype.pointMemberParser_ = function pointMemberParser_(node, objectStack) {
    (0, _xml.parseNode)(this.POINTMEMBER_PARSERS_, node, objectStack, this);
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   */
  GMLBase.prototype.lineStringMemberParser_ = function lineStringMemberParser_(node, objectStack) {
    (0, _xml.parseNode)(this.LINESTRINGMEMBER_PARSERS_, node, objectStack, this);
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   */
  GMLBase.prototype.polygonMemberParser_ = function polygonMemberParser_(node, objectStack) {
    (0, _xml.parseNode)(this.POLYGONMEMBER_PARSERS_, node, objectStack, this);
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {LineString|undefined} LineString.
   */
  GMLBase.prototype.readLineString = function readLineString(node, objectStack) {
    var flatCoordinates = this.readFlatCoordinatesFromNode_(node, objectStack);
    if (flatCoordinates) {
      var lineString = new _LineString2.default(flatCoordinates, _GeometryLayout2.default.XYZ);
      return lineString;
    } else {
      return undefined;
    }
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   * @return {Array<number>|undefined} LinearRing flat coordinates.
   */
  GMLBase.prototype.readFlatLinearRing_ = function readFlatLinearRing_(node, objectStack) {
    var ring = (0, _xml.pushParseAndPop)(null, this.GEOMETRY_FLAT_COORDINATES_PARSERS, node, objectStack, this);
    if (ring) {
      return ring;
    } else {
      return undefined;
    }
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {LinearRing|undefined} LinearRing.
   */
  GMLBase.prototype.readLinearRing = function readLinearRing(node, objectStack) {
    var flatCoordinates = this.readFlatCoordinatesFromNode_(node, objectStack);
    if (flatCoordinates) {
      return new _LinearRing2.default(flatCoordinates, _GeometryLayout2.default.XYZ);
    }
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @return {Polygon|undefined} Polygon.
   */
  GMLBase.prototype.readPolygon = function readPolygon(node, objectStack) {
    /** @type {Array<Array<number>>} */
    var flatLinearRings = (0, _xml.pushParseAndPop)([null], this.FLAT_LINEAR_RINGS_PARSERS, node, objectStack, this);
    if (flatLinearRings && flatLinearRings[0]) {
      var flatCoordinates = flatLinearRings[0];
      var ends = [flatCoordinates.length];
      var i, ii;
      for (i = 1, ii = flatLinearRings.length; i < ii; ++i) {
        (0, _array.extend)(flatCoordinates, flatLinearRings[i]);
        ends.push(flatCoordinates.length);
      }
      return new _Polygon2.default(flatCoordinates, _GeometryLayout2.default.XYZ, ends);
    } else {
      return undefined;
    }
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   * @return {Array<number>} Flat coordinates.
   */
  GMLBase.prototype.readFlatCoordinatesFromNode_ = function readFlatCoordinatesFromNode_(node, objectStack) {
    return (0, _xml.pushParseAndPop)(null, this.GEOMETRY_FLAT_COORDINATES_PARSERS, node, objectStack, this);
  };

  /**
   * @inheritDoc
   */
  GMLBase.prototype.readGeometryFromNode = function readGeometryFromNode(node, opt_options) {
    var geometry = this.readGeometryElement(node, [this.getReadOptions(node, opt_options ? opt_options : {})]);
    return geometry ? geometry : null;
  };

  /**
   * @inheritDoc
   */
  GMLBase.prototype.readFeaturesFromNode = function readFeaturesFromNode(node, opt_options) {
    var options = {
      featureType: this.featureType,
      featureNS: this.featureNS
    };
    if (opt_options) {
      (0, _obj.assign)(options, this.getReadOptions(node, opt_options));
    }
    var features = this.readFeaturesInternal(node, [options]);
    return features || [];
  };

  /**
   * @inheritDoc
   */
  GMLBase.prototype.readProjectionFromNode = function readProjectionFromNode(node) {
    return (0, _proj.get)(this.srsName ? this.srsName : node.firstElementChild.getAttribute('srsName'));
  };

  return GMLBase;
}(_XMLFeature2.default);

GMLBase.prototype.namespace = GMLNS;

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @protected
 */
GMLBase.prototype.FLAT_LINEAR_RINGS_PARSERS = {
  'http://www.opengis.net/gml': {}
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @protected
 */
GMLBase.prototype.GEOMETRY_FLAT_COORDINATES_PARSERS = {
  'http://www.opengis.net/gml': {}
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @protected
 */
GMLBase.prototype.GEOMETRY_PARSERS = {
  'http://www.opengis.net/gml': {}
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GMLBase.prototype.MULTIPOINT_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'pointMember': (0, _xml.makeArrayPusher)(GMLBase.prototype.pointMemberParser_),
    'pointMembers': (0, _xml.makeArrayPusher)(GMLBase.prototype.pointMemberParser_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GMLBase.prototype.MULTILINESTRING_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'lineStringMember': (0, _xml.makeArrayPusher)(GMLBase.prototype.lineStringMemberParser_),
    'lineStringMembers': (0, _xml.makeArrayPusher)(GMLBase.prototype.lineStringMemberParser_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GMLBase.prototype.MULTIPOLYGON_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'polygonMember': (0, _xml.makeArrayPusher)(GMLBase.prototype.polygonMemberParser_),
    'polygonMembers': (0, _xml.makeArrayPusher)(GMLBase.prototype.polygonMemberParser_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GMLBase.prototype.POINTMEMBER_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'Point': (0, _xml.makeArrayPusher)(GMLBase.prototype.readFlatCoordinatesFromNode_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GMLBase.prototype.LINESTRINGMEMBER_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'LineString': (0, _xml.makeArrayPusher)(GMLBase.prototype.readLineString)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GMLBase.prototype.POLYGONMEMBER_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'Polygon': (0, _xml.makeArrayPusher)(GMLBase.prototype.readPolygon)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @protected
 */
GMLBase.prototype.RING_PARSERS = {
  'http://www.opengis.net/gml': {
    'LinearRing': (0, _xml.makeReplacer)(GMLBase.prototype.readFlatLinearRing_)
  }
};

exports.default = GMLBase;

//# sourceMappingURL=GMLBase.js.map