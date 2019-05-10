'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _array = require('../array.js');

var _extent = require('../extent.js');

var _Feature = require('./Feature.js');

var _GMLBase = require('./GMLBase.js');

var _GMLBase2 = _interopRequireDefault(_GMLBase);

var _xsd = require('./xsd.js');

var _GeometryLayout = require('../geom/GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _LineString = require('../geom/LineString.js');

var _LineString2 = _interopRequireDefault(_LineString);

var _MultiLineString = require('../geom/MultiLineString.js');

var _MultiLineString2 = _interopRequireDefault(_MultiLineString);

var _MultiPolygon = require('../geom/MultiPolygon.js');

var _MultiPolygon2 = _interopRequireDefault(_MultiPolygon);

var _Polygon = require('../geom/Polygon.js');

var _Polygon2 = _interopRequireDefault(_Polygon);

var _obj = require('../obj.js');

var _proj = require('../proj.js');

var _xml = require('../xml.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @const
 * @type {string}
 * @private
 */
var schemaLocation = _GMLBase.GMLNS + ' http://schemas.opengis.net/gml/3.1.1/profiles/gmlsfProfile/' + '1.0.0/gmlsf.xsd';

/**
 * @const
 * @type {Object<string, string>}
 */
/**
 * @module ol/format/GML3
 */
var MULTIGEOMETRY_TO_MEMBER_NODENAME = {
  'MultiLineString': 'lineStringMember',
  'MultiCurve': 'curveMember',
  'MultiPolygon': 'polygonMember',
  'MultiSurface': 'surfaceMember'
};

/**
 * @classdesc
 * Feature format for reading and writing data in the GML format
 * version 3.1.1.
 * Currently only supports GML 3.1.1 Simple Features profile.
 *
 * @api
 */
var GML3 = /*@__PURE__*/function (GMLBase) {
  function GML3(opt_options) {
    var options = /** @type {import("./GMLBase.js").Options} */
    opt_options ? opt_options : {};

    GMLBase.call(this, options);

    /**
     * @private
     * @type {boolean}
     */
    this.surface_ = options.surface !== undefined ? options.surface : false;

    /**
     * @private
     * @type {boolean}
     */
    this.curve_ = options.curve !== undefined ? options.curve : false;

    /**
     * @private
     * @type {boolean}
     */
    this.multiCurve_ = options.multiCurve !== undefined ? options.multiCurve : true;

    /**
     * @private
     * @type {boolean}
     */
    this.multiSurface_ = options.multiSurface !== undefined ? options.multiSurface : true;

    /**
     * @inheritDoc
     */
    this.schemaLocation = options.schemaLocation ? options.schemaLocation : schemaLocation;

    /**
     * @private
     * @type {boolean}
     */
    this.hasZ = options.hasZ !== undefined ? options.hasZ : false;
  }

  if (GMLBase) GML3.__proto__ = GMLBase;
  GML3.prototype = Object.create(GMLBase && GMLBase.prototype);
  GML3.prototype.constructor = GML3;

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   * @return {MultiLineString|undefined} MultiLineString.
   */
  GML3.prototype.readMultiCurve_ = function readMultiCurve_(node, objectStack) {
    /** @type {Array<LineString>} */
    var lineStrings = (0, _xml.pushParseAndPop)([], this.MULTICURVE_PARSERS_, node, objectStack, this);
    if (lineStrings) {
      var multiLineString = new _MultiLineString2.default(lineStrings);
      return multiLineString;
    } else {
      return undefined;
    }
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   * @return {MultiPolygon|undefined} MultiPolygon.
   */
  GML3.prototype.readMultiSurface_ = function readMultiSurface_(node, objectStack) {
    /** @type {Array<Polygon>} */
    var polygons = (0, _xml.pushParseAndPop)([], this.MULTISURFACE_PARSERS_, node, objectStack, this);
    if (polygons) {
      return new _MultiPolygon2.default(polygons);
    }
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   */
  GML3.prototype.curveMemberParser_ = function curveMemberParser_(node, objectStack) {
    (0, _xml.parseNode)(this.CURVEMEMBER_PARSERS_, node, objectStack, this);
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   */
  GML3.prototype.surfaceMemberParser_ = function surfaceMemberParser_(node, objectStack) {
    (0, _xml.parseNode)(this.SURFACEMEMBER_PARSERS_, node, objectStack, this);
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   * @return {Array<(Array<number>)>|undefined} flat coordinates.
   */
  GML3.prototype.readPatch_ = function readPatch_(node, objectStack) {
    return (0, _xml.pushParseAndPop)([null], this.PATCHES_PARSERS_, node, objectStack, this);
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   * @return {Array<number>|undefined} flat coordinates.
   */
  GML3.prototype.readSegment_ = function readSegment_(node, objectStack) {
    return (0, _xml.pushParseAndPop)([null], this.SEGMENTS_PARSERS_, node, objectStack, this);
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   * @return {Array<(Array<number>)>|undefined} flat coordinates.
   */
  GML3.prototype.readPolygonPatch_ = function readPolygonPatch_(node, objectStack) {
    return (0, _xml.pushParseAndPop)([null], this.FLAT_LINEAR_RINGS_PARSERS, node, objectStack, this);
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   * @return {Array<number>|undefined} flat coordinates.
   */
  GML3.prototype.readLineStringSegment_ = function readLineStringSegment_(node, objectStack) {
    return (0, _xml.pushParseAndPop)([null], this.GEOMETRY_FLAT_COORDINATES_PARSERS, node, objectStack, this);
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   */
  GML3.prototype.interiorParser_ = function interiorParser_(node, objectStack) {
    /** @type {Array<number>|undefined} */
    var flatLinearRing = (0, _xml.pushParseAndPop)(undefined, this.RING_PARSERS, node, objectStack, this);
    if (flatLinearRing) {
      var flatLinearRings = /** @type {Array<Array<number>>} */
      objectStack[objectStack.length - 1];
      flatLinearRings.push(flatLinearRing);
    }
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   */
  GML3.prototype.exteriorParser_ = function exteriorParser_(node, objectStack) {
    /** @type {Array<number>|undefined} */
    var flatLinearRing = (0, _xml.pushParseAndPop)(undefined, this.RING_PARSERS, node, objectStack, this);
    if (flatLinearRing) {
      var flatLinearRings = /** @type {Array<Array<number>>} */
      objectStack[objectStack.length - 1];
      flatLinearRings[0] = flatLinearRing;
    }
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   * @return {Polygon|undefined} Polygon.
   */
  GML3.prototype.readSurface_ = function readSurface_(node, objectStack) {
    /** @type {Array<Array<number>>} */
    var flatLinearRings = (0, _xml.pushParseAndPop)([null], this.SURFACE_PARSERS_, node, objectStack, this);
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
   * @return {LineString|undefined} LineString.
   */
  GML3.prototype.readCurve_ = function readCurve_(node, objectStack) {
    /** @type {Array<number>} */
    var flatCoordinates = (0, _xml.pushParseAndPop)([null], this.CURVE_PARSERS_, node, objectStack, this);
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
   * @return {import("../extent.js").Extent|undefined} Envelope.
   */
  GML3.prototype.readEnvelope_ = function readEnvelope_(node, objectStack) {
    /** @type {Array<number>} */
    var flatCoordinates = (0, _xml.pushParseAndPop)([null], this.ENVELOPE_PARSERS_, node, objectStack, this);
    return (0, _extent.createOrUpdate)(flatCoordinates[1][0], flatCoordinates[1][1], flatCoordinates[2][0], flatCoordinates[2][1]);
  };

  /**
   * @param {Node} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   * @return {Array<number>|undefined} Flat coordinates.
   */
  GML3.prototype.readFlatPos_ = function readFlatPos_(node, objectStack) {
    var s = (0, _xml.getAllTextContent)(node, false);
    var re = /^\s*([+\-]?\d*\.?\d+(?:[eE][+\-]?\d+)?)\s*/;
    /** @type {Array<number>} */
    var flatCoordinates = [];
    var m;
    while (m = re.exec(s)) {
      flatCoordinates.push(parseFloat(m[1]));
      s = s.substr(m[0].length);
    }
    if (s !== '') {
      return undefined;
    }
    var context = objectStack[0];
    var containerSrs = context['srsName'];
    var axisOrientation = 'enu';
    if (containerSrs) {
      var proj = (0, _proj.get)(containerSrs);
      axisOrientation = proj.getAxisOrientation();
    }
    if (axisOrientation === 'neu') {
      var i, ii;
      for (i = 0, ii = flatCoordinates.length; i < ii; i += 3) {
        var y = flatCoordinates[i];
        var x = flatCoordinates[i + 1];
        flatCoordinates[i] = x;
        flatCoordinates[i + 1] = y;
      }
    }
    var len = flatCoordinates.length;
    if (len == 2) {
      flatCoordinates.push(0);
    }
    if (len === 0) {
      return undefined;
    }
    return flatCoordinates;
  };

  /**
   * @param {Element} node Node.
   * @param {Array<*>} objectStack Object stack.
   * @private
   * @return {Array<number>|undefined} Flat coordinates.
   */
  GML3.prototype.readFlatPosList_ = function readFlatPosList_(node, objectStack) {
    var s = (0, _xml.getAllTextContent)(node, false).replace(/^\s*|\s*$/g, '');
    var context = objectStack[0];
    var containerSrs = context['srsName'];
    var contextDimension = context['srsDimension'];
    var axisOrientation = 'enu';
    if (containerSrs) {
      var proj = (0, _proj.get)(containerSrs);
      axisOrientation = proj.getAxisOrientation();
    }
    var coords = s.split(/\s+/);
    // The "dimension" attribute is from the GML 3.0.1 spec.
    var dim = 2;
    if (node.getAttribute('srsDimension')) {
      dim = (0, _xsd.readNonNegativeIntegerString)(node.getAttribute('srsDimension'));
    } else if (node.getAttribute('dimension')) {
      dim = (0, _xsd.readNonNegativeIntegerString)(node.getAttribute('dimension'));
    } else if ( /** @type {Element} */node.parentNode.getAttribute('srsDimension')) {
      dim = (0, _xsd.readNonNegativeIntegerString)(
      /** @type {Element} */node.parentNode.getAttribute('srsDimension'));
    } else if (contextDimension) {
      dim = (0, _xsd.readNonNegativeIntegerString)(contextDimension);
    }
    var x, y, z;
    var flatCoordinates = [];
    for (var i = 0, ii = coords.length; i < ii; i += dim) {
      x = parseFloat(coords[i]);
      y = parseFloat(coords[i + 1]);
      z = dim === 3 ? parseFloat(coords[i + 2]) : 0;
      if (axisOrientation.substr(0, 2) === 'en') {
        flatCoordinates.push(x, y, z);
      } else {
        flatCoordinates.push(y, x, z);
      }
    }
    return flatCoordinates;
  };

  /**
   * @param {Element} node Node.
   * @param {import("../geom/Point.js").default} value Point geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  GML3.prototype.writePos_ = function writePos_(node, value, objectStack) {
    var context = objectStack[objectStack.length - 1];
    var hasZ = context['hasZ'];
    var srsDimension = hasZ ? '3' : '2';
    node.setAttribute('srsDimension', srsDimension);
    var srsName = context['srsName'];
    var axisOrientation = 'enu';
    if (srsName) {
      axisOrientation = (0, _proj.get)(srsName).getAxisOrientation();
    }
    var point = value.getCoordinates();
    var coords;
    // only 2d for simple features profile
    if (axisOrientation.substr(0, 2) === 'en') {
      coords = point[0] + ' ' + point[1];
    } else {
      coords = point[1] + ' ' + point[0];
    }
    if (hasZ) {
      // For newly created points, Z can be undefined.
      var z = point[2] || 0;
      coords += ' ' + z;
    }
    (0, _xsd.writeStringTextNode)(node, coords);
  };

  /**
   * @param {Array<number>} point Point geometry.
   * @param {string=} opt_srsName Optional srsName
   * @param {boolean=} opt_hasZ whether the geometry has a Z coordinate (is 3D) or not.
   * @return {string} The coords string.
   * @private
   */
  GML3.prototype.getCoords_ = function getCoords_(point, opt_srsName, opt_hasZ) {
    var axisOrientation = 'enu';
    if (opt_srsName) {
      axisOrientation = (0, _proj.get)(opt_srsName).getAxisOrientation();
    }
    var coords = axisOrientation.substr(0, 2) === 'en' ? point[0] + ' ' + point[1] : point[1] + ' ' + point[0];
    if (opt_hasZ) {
      // For newly created points, Z can be undefined.
      var z = point[2] || 0;
      coords += ' ' + z;
    }

    return coords;
  };

  /**
   * @param {Element} node Node.
   * @param {LineString|import("../geom/LinearRing.js").default} value Geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  GML3.prototype.writePosList_ = function writePosList_(node, value, objectStack) {
    var context = objectStack[objectStack.length - 1];
    var hasZ = context['hasZ'];
    var srsDimension = hasZ ? '3' : '2';
    node.setAttribute('srsDimension', srsDimension);
    var srsName = context['srsName'];
    // only 2d for simple features profile
    var points = value.getCoordinates();
    var len = points.length;
    var parts = new Array(len);
    var point;
    for (var i = 0; i < len; ++i) {
      point = points[i];
      parts[i] = this.getCoords_(point, srsName, hasZ);
    }
    (0, _xsd.writeStringTextNode)(node, parts.join(' '));
  };

  /**
   * @param {Element} node Node.
   * @param {import("../geom/Point.js").default} geometry Point geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  GML3.prototype.writePoint_ = function writePoint_(node, geometry, objectStack) {
    var context = objectStack[objectStack.length - 1];
    var srsName = context['srsName'];
    if (srsName) {
      node.setAttribute('srsName', srsName);
    }
    var pos = (0, _xml.createElementNS)(node.namespaceURI, 'pos');
    node.appendChild(pos);
    this.writePos_(pos, geometry, objectStack);
  };

  /**
   * @param {Element} node Node.
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {Array<*>} objectStack Node stack.
   */
  GML3.prototype.writeEnvelope = function writeEnvelope(node, extent, objectStack) {
    var context = objectStack[objectStack.length - 1];
    var srsName = context['srsName'];
    if (srsName) {
      node.setAttribute('srsName', srsName);
    }
    var keys = ['lowerCorner', 'upperCorner'];
    var values = [extent[0] + ' ' + extent[1], extent[2] + ' ' + extent[3]];
    (0, _xml.pushSerializeAndPop)( /** @type {import("../xml.js").NodeStackItem} */
    { node: node }, this.ENVELOPE_SERIALIZERS_, _xml.OBJECT_PROPERTY_NODE_FACTORY, values, objectStack, keys, this);
  };

  /**
   * @param {Element} node Node.
   * @param {import("../geom/LinearRing.js").default} geometry LinearRing geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  GML3.prototype.writeLinearRing_ = function writeLinearRing_(node, geometry, objectStack) {
    var context = objectStack[objectStack.length - 1];
    var srsName = context['srsName'];
    if (srsName) {
      node.setAttribute('srsName', srsName);
    }
    var posList = (0, _xml.createElementNS)(node.namespaceURI, 'posList');
    node.appendChild(posList);
    this.writePosList_(posList, geometry, objectStack);
  };

  /**
   * @param {*} value Value.
   * @param {Array<*>} objectStack Object stack.
   * @param {string=} opt_nodeName Node name.
   * @return {Node} Node.
   * @private
   */
  GML3.prototype.RING_NODE_FACTORY_ = function RING_NODE_FACTORY_(value, objectStack, opt_nodeName) {
    var context = objectStack[objectStack.length - 1];
    var parentNode = context.node;
    var exteriorWritten = context['exteriorWritten'];
    if (exteriorWritten === undefined) {
      context['exteriorWritten'] = true;
    }
    return (0, _xml.createElementNS)(parentNode.namespaceURI, exteriorWritten !== undefined ? 'interior' : 'exterior');
  };

  /**
   * @param {Element} node Node.
   * @param {Polygon} geometry Polygon geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  GML3.prototype.writeSurfaceOrPolygon_ = function writeSurfaceOrPolygon_(node, geometry, objectStack) {
    var context = objectStack[objectStack.length - 1];
    var hasZ = context['hasZ'];
    var srsName = context['srsName'];
    if (node.nodeName !== 'PolygonPatch' && srsName) {
      node.setAttribute('srsName', srsName);
    }
    if (node.nodeName === 'Polygon' || node.nodeName === 'PolygonPatch') {
      var rings = geometry.getLinearRings();
      (0, _xml.pushSerializeAndPop)({ node: node, hasZ: hasZ, srsName: srsName }, this.RING_SERIALIZERS_, this.RING_NODE_FACTORY_, rings, objectStack, undefined, this);
    } else if (node.nodeName === 'Surface') {
      var patches = (0, _xml.createElementNS)(node.namespaceURI, 'patches');
      node.appendChild(patches);
      this.writeSurfacePatches_(patches, geometry, objectStack);
    }
  };

  /**
   * @param {Element} node Node.
   * @param {LineString} geometry LineString geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  GML3.prototype.writeCurveOrLineString_ = function writeCurveOrLineString_(node, geometry, objectStack) {
    var context = objectStack[objectStack.length - 1];
    var srsName = context['srsName'];
    if (node.nodeName !== 'LineStringSegment' && srsName) {
      node.setAttribute('srsName', srsName);
    }
    if (node.nodeName === 'LineString' || node.nodeName === 'LineStringSegment') {
      var posList = (0, _xml.createElementNS)(node.namespaceURI, 'posList');
      node.appendChild(posList);
      this.writePosList_(posList, geometry, objectStack);
    } else if (node.nodeName === 'Curve') {
      var segments = (0, _xml.createElementNS)(node.namespaceURI, 'segments');
      node.appendChild(segments);
      this.writeCurveSegments_(segments, geometry, objectStack);
    }
  };

  /**
   * @param {Element} node Node.
   * @param {MultiPolygon} geometry MultiPolygon geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  GML3.prototype.writeMultiSurfaceOrPolygon_ = function writeMultiSurfaceOrPolygon_(node, geometry, objectStack) {
    var context = objectStack[objectStack.length - 1];
    var hasZ = context['hasZ'];
    var srsName = context['srsName'];
    var surface = context['surface'];
    if (srsName) {
      node.setAttribute('srsName', srsName);
    }
    var polygons = geometry.getPolygons();
    (0, _xml.pushSerializeAndPop)({ node: node, hasZ: hasZ, srsName: srsName, surface: surface }, this.SURFACEORPOLYGONMEMBER_SERIALIZERS_, this.MULTIGEOMETRY_MEMBER_NODE_FACTORY_, polygons, objectStack, undefined, this);
  };

  /**
   * @param {Element} node Node.
   * @param {import("../geom/MultiPoint.js").default} geometry MultiPoint geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  GML3.prototype.writeMultiPoint_ = function writeMultiPoint_(node, geometry, objectStack) {
    var context = objectStack[objectStack.length - 1];
    var srsName = context['srsName'];
    var hasZ = context['hasZ'];
    if (srsName) {
      node.setAttribute('srsName', srsName);
    }
    var points = geometry.getPoints();
    (0, _xml.pushSerializeAndPop)({ node: node, hasZ: hasZ, srsName: srsName }, this.POINTMEMBER_SERIALIZERS_, (0, _xml.makeSimpleNodeFactory)('pointMember'), points, objectStack, undefined, this);
  };

  /**
   * @param {Element} node Node.
   * @param {MultiLineString} geometry MultiLineString geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  GML3.prototype.writeMultiCurveOrLineString_ = function writeMultiCurveOrLineString_(node, geometry, objectStack) {
    var context = objectStack[objectStack.length - 1];
    var hasZ = context['hasZ'];
    var srsName = context['srsName'];
    var curve = context['curve'];
    if (srsName) {
      node.setAttribute('srsName', srsName);
    }
    var lines = geometry.getLineStrings();
    (0, _xml.pushSerializeAndPop)({ node: node, hasZ: hasZ, srsName: srsName, curve: curve }, this.LINESTRINGORCURVEMEMBER_SERIALIZERS_, this.MULTIGEOMETRY_MEMBER_NODE_FACTORY_, lines, objectStack, undefined, this);
  };

  /**
   * @param {Node} node Node.
   * @param {import("../geom/LinearRing.js").default} ring LinearRing geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  GML3.prototype.writeRing_ = function writeRing_(node, ring, objectStack) {
    var linearRing = (0, _xml.createElementNS)(node.namespaceURI, 'LinearRing');
    node.appendChild(linearRing);
    this.writeLinearRing_(linearRing, ring, objectStack);
  };

  /**
   * @param {Node} node Node.
   * @param {Polygon} polygon Polygon geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  GML3.prototype.writeSurfaceOrPolygonMember_ = function writeSurfaceOrPolygonMember_(node, polygon, objectStack) {
    var child = this.GEOMETRY_NODE_FACTORY_(polygon, objectStack);
    if (child) {
      node.appendChild(child);
      this.writeSurfaceOrPolygon_(child, polygon, objectStack);
    }
  };

  /**
   * @param {Node} node Node.
   * @param {import("../geom/Point.js").default} point Point geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  GML3.prototype.writePointMember_ = function writePointMember_(node, point, objectStack) {
    var child = (0, _xml.createElementNS)(node.namespaceURI, 'Point');
    node.appendChild(child);
    this.writePoint_(child, point, objectStack);
  };

  /**
   * @param {Node} node Node.
   * @param {LineString} line LineString geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  GML3.prototype.writeLineStringOrCurveMember_ = function writeLineStringOrCurveMember_(node, line, objectStack) {
    var child = this.GEOMETRY_NODE_FACTORY_(line, objectStack);
    if (child) {
      node.appendChild(child);
      this.writeCurveOrLineString_(child, line, objectStack);
    }
  };

  /**
   * @param {Node} node Node.
   * @param {Polygon} polygon Polygon geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  GML3.prototype.writeSurfacePatches_ = function writeSurfacePatches_(node, polygon, objectStack) {
    var child = (0, _xml.createElementNS)(node.namespaceURI, 'PolygonPatch');
    node.appendChild(child);
    this.writeSurfaceOrPolygon_(child, polygon, objectStack);
  };

  /**
   * @param {Node} node Node.
   * @param {LineString} line LineString geometry.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  GML3.prototype.writeCurveSegments_ = function writeCurveSegments_(node, line, objectStack) {
    var child = (0, _xml.createElementNS)(node.namespaceURI, 'LineStringSegment');
    node.appendChild(child);
    this.writeCurveOrLineString_(child, line, objectStack);
  };

  /**
   * @param {Node} node Node.
   * @param {import("../geom/Geometry.js").default|import("../extent.js").Extent} geometry Geometry.
   * @param {Array<*>} objectStack Node stack.
   */
  GML3.prototype.writeGeometryElement = function writeGeometryElement(node, geometry, objectStack) {
    var context = /** @type {import("./Feature.js").WriteOptions} */objectStack[objectStack.length - 1];
    var item = (0, _obj.assign)({}, context);
    item['node'] = node;
    var value;
    if (Array.isArray(geometry)) {
      if (context.dataProjection) {
        value = (0, _proj.transformExtent)(geometry, context.featureProjection, context.dataProjection);
      } else {
        value = geometry;
      }
    } else {
      value = (0, _Feature.transformWithOptions)( /** @type {import("../geom/Geometry.js").default} */geometry, true, context);
    }
    (0, _xml.pushSerializeAndPop)( /** @type {import("../xml.js").NodeStackItem} */
    item, this.GEOMETRY_SERIALIZERS_, this.GEOMETRY_NODE_FACTORY_, [value], objectStack, undefined, this);
  };

  /**
   * @param {Element} node Node.
   * @param {import("../Feature.js").default} feature Feature.
   * @param {Array<*>} objectStack Node stack.
   */
  GML3.prototype.writeFeatureElement = function writeFeatureElement(node, feature, objectStack) {
    var fid = feature.getId();
    if (fid) {
      node.setAttribute('fid', /** @type {string} */fid);
    }
    var context = /** @type {Object} */objectStack[objectStack.length - 1];
    var featureNS = context['featureNS'];
    var geometryName = feature.getGeometryName();
    if (!context.serializers) {
      context.serializers = {};
      context.serializers[featureNS] = {};
    }
    var properties = feature.getProperties();
    var keys = [];
    var values = [];
    for (var key in properties) {
      var value = properties[key];
      if (value !== null) {
        keys.push(key);
        values.push(value);
        if (key == geometryName || typeof /** @type {?} */value.getSimplifiedGeometry === 'function') {
          if (!(key in context.serializers[featureNS])) {
            context.serializers[featureNS][key] = (0, _xml.makeChildAppender)(this.writeGeometryElement, this);
          }
        } else {
          if (!(key in context.serializers[featureNS])) {
            context.serializers[featureNS][key] = (0, _xml.makeChildAppender)(_xsd.writeStringTextNode);
          }
        }
      }
    }
    var item = (0, _obj.assign)({}, context);
    item.node = node;
    (0, _xml.pushSerializeAndPop)( /** @type {import("../xml.js").NodeStackItem} */
    item, context.serializers, (0, _xml.makeSimpleNodeFactory)(undefined, featureNS), values, objectStack, keys);
  };

  /**
   * @param {Node} node Node.
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {Array<*>} objectStack Node stack.
   * @private
   */
  GML3.prototype.writeFeatureMembers_ = function writeFeatureMembers_(node, features, objectStack) {
    var context = /** @type {Object} */objectStack[objectStack.length - 1];
    var featureType = context['featureType'];
    var featureNS = context['featureNS'];
    /** @type {Object<string, Object<string, import("../xml.js").Serializer>>} */
    var serializers = {};
    serializers[featureNS] = {};
    serializers[featureNS][featureType] = (0, _xml.makeChildAppender)(this.writeFeatureElement, this);
    var item = (0, _obj.assign)({}, context);
    item.node = node;
    (0, _xml.pushSerializeAndPop)( /** @type {import("../xml.js").NodeStackItem} */
    item, serializers, (0, _xml.makeSimpleNodeFactory)(featureType, featureNS), features, objectStack);
  };

  /**
   * @const
   * @param {*} value Value.
   * @param {Array<*>} objectStack Object stack.
   * @param {string=} opt_nodeName Node name.
   * @return {Node|undefined} Node.
   * @private
   */
  GML3.prototype.MULTIGEOMETRY_MEMBER_NODE_FACTORY_ = function MULTIGEOMETRY_MEMBER_NODE_FACTORY_(value, objectStack, opt_nodeName) {
    var parentNode = objectStack[objectStack.length - 1].node;
    return (0, _xml.createElementNS)(this.namespace, MULTIGEOMETRY_TO_MEMBER_NODENAME[parentNode.nodeName]);
  };

  /**
   * @const
   * @param {*} value Value.
   * @param {Array<*>} objectStack Object stack.
   * @param {string=} opt_nodeName Node name.
   * @return {Element|undefined} Node.
   * @private
   */
  GML3.prototype.GEOMETRY_NODE_FACTORY_ = function GEOMETRY_NODE_FACTORY_(value, objectStack, opt_nodeName) {
    var context = objectStack[objectStack.length - 1];
    var multiSurface = context['multiSurface'];
    var surface = context['surface'];
    var curve = context['curve'];
    var multiCurve = context['multiCurve'];
    var nodeName;
    if (!Array.isArray(value)) {
      nodeName = /** @type {import("../geom/Geometry.js").default} */value.getType();
      if (nodeName === 'MultiPolygon' && multiSurface === true) {
        nodeName = 'MultiSurface';
      } else if (nodeName === 'Polygon' && surface === true) {
        nodeName = 'Surface';
      } else if (nodeName === 'LineString' && curve === true) {
        nodeName = 'Curve';
      } else if (nodeName === 'MultiLineString' && multiCurve === true) {
        nodeName = 'MultiCurve';
      }
    } else {
      nodeName = 'Envelope';
    }
    return (0, _xml.createElementNS)(this.namespace, nodeName);
  };

  /**
   * Encode a geometry in GML 3.1.1 Simple Features.
   *
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions=} opt_options Options.
   * @return {Node} Node.
   * @override
   * @api
   */
  GML3.prototype.writeGeometryNode = function writeGeometryNode(geometry, opt_options) {
    opt_options = this.adaptOptions(opt_options);
    var geom = (0, _xml.createElementNS)(this.namespace, 'geom');
    var context = { node: geom, hasZ: this.hasZ, srsName: this.srsName,
      curve: this.curve_, surface: this.surface_,
      multiSurface: this.multiSurface_, multiCurve: this.multiCurve_ };
    if (opt_options) {
      (0, _obj.assign)(context, opt_options);
    }
    this.writeGeometryElement(geom, geometry, [context]);
    return geom;
  };

  /**
   * Encode an array of features in the GML 3.1.1 format as an XML node.
   *
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions=} opt_options Options.
   * @return {Element} Node.
   * @override
   * @api
   */
  GML3.prototype.writeFeaturesNode = function writeFeaturesNode(features, opt_options) {
    opt_options = this.adaptOptions(opt_options);
    var node = (0, _xml.createElementNS)(this.namespace, 'featureMembers');
    node.setAttributeNS(_xml.XML_SCHEMA_INSTANCE_URI, 'xsi:schemaLocation', this.schemaLocation);
    var context = {
      srsName: this.srsName,
      hasZ: this.hasZ,
      curve: this.curve_,
      surface: this.surface_,
      multiSurface: this.multiSurface_,
      multiCurve: this.multiCurve_,
      featureNS: this.featureNS,
      featureType: this.featureType
    };
    if (opt_options) {
      (0, _obj.assign)(context, opt_options);
    }
    this.writeFeatureMembers_(node, features, [context]);
    return node;
  };

  return GML3;
}(_GMLBase2.default);

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @protected
 */
GML3.prototype.GEOMETRY_FLAT_COORDINATES_PARSERS = {
  'http://www.opengis.net/gml': {
    'pos': (0, _xml.makeReplacer)(GML3.prototype.readFlatPos_),
    'posList': (0, _xml.makeReplacer)(GML3.prototype.readFlatPosList_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @protected
 */
GML3.prototype.FLAT_LINEAR_RINGS_PARSERS = {
  'http://www.opengis.net/gml': {
    'interior': GML3.prototype.interiorParser_,
    'exterior': GML3.prototype.exteriorParser_
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @protected
 */
GML3.prototype.GEOMETRY_PARSERS = {
  'http://www.opengis.net/gml': {
    'Point': (0, _xml.makeReplacer)(_GMLBase2.default.prototype.readPoint),
    'MultiPoint': (0, _xml.makeReplacer)(_GMLBase2.default.prototype.readMultiPoint),
    'LineString': (0, _xml.makeReplacer)(_GMLBase2.default.prototype.readLineString),
    'MultiLineString': (0, _xml.makeReplacer)(_GMLBase2.default.prototype.readMultiLineString),
    'LinearRing': (0, _xml.makeReplacer)(_GMLBase2.default.prototype.readLinearRing),
    'Polygon': (0, _xml.makeReplacer)(_GMLBase2.default.prototype.readPolygon),
    'MultiPolygon': (0, _xml.makeReplacer)(_GMLBase2.default.prototype.readMultiPolygon),
    'Surface': (0, _xml.makeReplacer)(GML3.prototype.readSurface_),
    'MultiSurface': (0, _xml.makeReplacer)(GML3.prototype.readMultiSurface_),
    'Curve': (0, _xml.makeReplacer)(GML3.prototype.readCurve_),
    'MultiCurve': (0, _xml.makeReplacer)(GML3.prototype.readMultiCurve_),
    'Envelope': (0, _xml.makeReplacer)(GML3.prototype.readEnvelope_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML3.prototype.MULTICURVE_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'curveMember': (0, _xml.makeArrayPusher)(GML3.prototype.curveMemberParser_),
    'curveMembers': (0, _xml.makeArrayPusher)(GML3.prototype.curveMemberParser_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML3.prototype.MULTISURFACE_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'surfaceMember': (0, _xml.makeArrayPusher)(GML3.prototype.surfaceMemberParser_),
    'surfaceMembers': (0, _xml.makeArrayPusher)(GML3.prototype.surfaceMemberParser_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML3.prototype.CURVEMEMBER_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'LineString': (0, _xml.makeArrayPusher)(_GMLBase2.default.prototype.readLineString),
    'Curve': (0, _xml.makeArrayPusher)(GML3.prototype.readCurve_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML3.prototype.SURFACEMEMBER_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'Polygon': (0, _xml.makeArrayPusher)(_GMLBase2.default.prototype.readPolygon),
    'Surface': (0, _xml.makeArrayPusher)(GML3.prototype.readSurface_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML3.prototype.SURFACE_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'patches': (0, _xml.makeReplacer)(GML3.prototype.readPatch_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML3.prototype.CURVE_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'segments': (0, _xml.makeReplacer)(GML3.prototype.readSegment_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML3.prototype.ENVELOPE_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'lowerCorner': (0, _xml.makeArrayPusher)(GML3.prototype.readFlatPosList_),
    'upperCorner': (0, _xml.makeArrayPusher)(GML3.prototype.readFlatPosList_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML3.prototype.PATCHES_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'PolygonPatch': (0, _xml.makeReplacer)(GML3.prototype.readPolygonPatch_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML3.prototype.SEGMENTS_PARSERS_ = {
  'http://www.opengis.net/gml': {
    'LineStringSegment': (0, _xml.makeReplacer)(GML3.prototype.readLineStringSegment_)
  }
};

/**
 * Encode an array of features in GML 3.1.1 Simple Features.
 *
 * @function
 * @param {Array<import("../Feature.js").default>} features Features.
 * @param {import("./Feature.js").WriteOptions=} opt_options Options.
 * @return {string} Result.
 * @api
 */
GML3.prototype.writeFeatures;

/**
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 * @private
 */
GML3.prototype.RING_SERIALIZERS_ = {
  'http://www.opengis.net/gml': {
    'exterior': (0, _xml.makeChildAppender)(GML3.prototype.writeRing_),
    'interior': (0, _xml.makeChildAppender)(GML3.prototype.writeRing_)
  }
};

/**
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 * @private
 */
GML3.prototype.ENVELOPE_SERIALIZERS_ = {
  'http://www.opengis.net/gml': {
    'lowerCorner': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
    'upperCorner': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode)
  }
};

/**
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 * @private
 */
GML3.prototype.SURFACEORPOLYGONMEMBER_SERIALIZERS_ = {
  'http://www.opengis.net/gml': {
    'surfaceMember': (0, _xml.makeChildAppender)(GML3.prototype.writeSurfaceOrPolygonMember_),
    'polygonMember': (0, _xml.makeChildAppender)(GML3.prototype.writeSurfaceOrPolygonMember_)
  }
};

/**
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 * @private
 */
GML3.prototype.POINTMEMBER_SERIALIZERS_ = {
  'http://www.opengis.net/gml': {
    'pointMember': (0, _xml.makeChildAppender)(GML3.prototype.writePointMember_)
  }
};

/**
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 * @private
 */
GML3.prototype.LINESTRINGORCURVEMEMBER_SERIALIZERS_ = {
  'http://www.opengis.net/gml': {
    'lineStringMember': (0, _xml.makeChildAppender)(GML3.prototype.writeLineStringOrCurveMember_),
    'curveMember': (0, _xml.makeChildAppender)(GML3.prototype.writeLineStringOrCurveMember_)
  }
};

/**
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 * @private
 */
GML3.prototype.GEOMETRY_SERIALIZERS_ = {
  'http://www.opengis.net/gml': {
    'Curve': (0, _xml.makeChildAppender)(GML3.prototype.writeCurveOrLineString_),
    'MultiCurve': (0, _xml.makeChildAppender)(GML3.prototype.writeMultiCurveOrLineString_),
    'Point': (0, _xml.makeChildAppender)(GML3.prototype.writePoint_),
    'MultiPoint': (0, _xml.makeChildAppender)(GML3.prototype.writeMultiPoint_),
    'LineString': (0, _xml.makeChildAppender)(GML3.prototype.writeCurveOrLineString_),
    'MultiLineString': (0, _xml.makeChildAppender)(GML3.prototype.writeMultiCurveOrLineString_),
    'LinearRing': (0, _xml.makeChildAppender)(GML3.prototype.writeLinearRing_),
    'Polygon': (0, _xml.makeChildAppender)(GML3.prototype.writeSurfaceOrPolygon_),
    'MultiPolygon': (0, _xml.makeChildAppender)(GML3.prototype.writeMultiSurfaceOrPolygon_),
    'Surface': (0, _xml.makeChildAppender)(GML3.prototype.writeSurfaceOrPolygon_),
    'MultiSurface': (0, _xml.makeChildAppender)(GML3.prototype.writeMultiSurfaceOrPolygon_),
    'Envelope': (0, _xml.makeChildAppender)(GML3.prototype.writeEnvelope)
  }
};

exports.default = GML3;

//# sourceMappingURL=GML3.js.map