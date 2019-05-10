'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _GML = require('./GML3.js');

var _GML2 = _interopRequireDefault(_GML);

var _GMLBase = require('./GMLBase.js');

var _GMLBase2 = _interopRequireDefault(_GMLBase);

var _xml = require('../xml.js');

var _xsd = require('../format/xsd.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc Feature format for reading and writing data in the GML format
 *            version 3.2.1.
 * @api
 */
/**
 * @module ol/format/GML32
 */
var GML32 = /*@__PURE__*/function (GML3) {
  function GML32(opt_options) {
    var options = /** @type {import("./GMLBase.js").Options} */opt_options ? opt_options : {};

    GML3.call(this, options);

    /**
     * @inheritDoc
     */
    this.schemaLocation = options.schemaLocation ? options.schemaLocation : this.namespace + ' http://schemas.opengis.net/gml/3.2.1/gml.xsd';
  }

  if (GML3) GML32.__proto__ = GML3;
  GML32.prototype = Object.create(GML3 && GML3.prototype);
  GML32.prototype.constructor = GML32;

  return GML32;
}(_GML2.default);

GML32.prototype.namespace = 'http://www.opengis.net/gml/3.2';

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @protected
 */
GML32.prototype.GEOMETRY_FLAT_COORDINATES_PARSERS = {
  'http://www.opengis.net/gml/3.2': {
    'pos': (0, _xml.makeReplacer)(_GML2.default.prototype.readFlatPos_),
    'posList': (0, _xml.makeReplacer)(_GML2.default.prototype.readFlatPosList_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @protected
 */
GML32.prototype.FLAT_LINEAR_RINGS_PARSERS = {
  'http://www.opengis.net/gml/3.2': {
    'interior': _GML2.default.prototype.interiorParser_,
    'exterior': _GML2.default.prototype.exteriorParser_
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @protected
 */
GML32.prototype.GEOMETRY_PARSERS = {
  'http://www.opengis.net/gml/3.2': {
    'Point': (0, _xml.makeReplacer)(_GMLBase2.default.prototype.readPoint),
    'MultiPoint': (0, _xml.makeReplacer)(_GMLBase2.default.prototype.readMultiPoint),
    'LineString': (0, _xml.makeReplacer)(_GMLBase2.default.prototype.readLineString),
    'MultiLineString': (0, _xml.makeReplacer)(_GMLBase2.default.prototype.readMultiLineString),
    'LinearRing': (0, _xml.makeReplacer)(_GMLBase2.default.prototype.readLinearRing),
    'Polygon': (0, _xml.makeReplacer)(_GMLBase2.default.prototype.readPolygon),
    'MultiPolygon': (0, _xml.makeReplacer)(_GMLBase2.default.prototype.readMultiPolygon),
    'Surface': (0, _xml.makeReplacer)(GML32.prototype.readSurface_),
    'MultiSurface': (0, _xml.makeReplacer)(_GML2.default.prototype.readMultiSurface_),
    'Curve': (0, _xml.makeReplacer)(GML32.prototype.readCurve_),
    'MultiCurve': (0, _xml.makeReplacer)(_GML2.default.prototype.readMultiCurve_),
    'Envelope': (0, _xml.makeReplacer)(GML32.prototype.readEnvelope_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML32.prototype.MULTICURVE_PARSERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'curveMember': (0, _xml.makeArrayPusher)(_GML2.default.prototype.curveMemberParser_),
    'curveMembers': (0, _xml.makeArrayPusher)(_GML2.default.prototype.curveMemberParser_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML32.prototype.MULTISURFACE_PARSERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'surfaceMember': (0, _xml.makeArrayPusher)(_GML2.default.prototype.surfaceMemberParser_),
    'surfaceMembers': (0, _xml.makeArrayPusher)(_GML2.default.prototype.surfaceMemberParser_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML32.prototype.CURVEMEMBER_PARSERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'LineString': (0, _xml.makeArrayPusher)(_GMLBase2.default.prototype.readLineString),
    'Curve': (0, _xml.makeArrayPusher)(_GML2.default.prototype.readCurve_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML32.prototype.SURFACEMEMBER_PARSERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'Polygon': (0, _xml.makeArrayPusher)(_GMLBase2.default.prototype.readPolygon),
    'Surface': (0, _xml.makeArrayPusher)(_GML2.default.prototype.readSurface_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML32.prototype.SURFACE_PARSERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'patches': (0, _xml.makeReplacer)(_GML2.default.prototype.readPatch_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML32.prototype.CURVE_PARSERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'segments': (0, _xml.makeReplacer)(_GML2.default.prototype.readSegment_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML32.prototype.ENVELOPE_PARSERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'lowerCorner': (0, _xml.makeArrayPusher)(_GML2.default.prototype.readFlatPosList_),
    'upperCorner': (0, _xml.makeArrayPusher)(_GML2.default.prototype.readFlatPosList_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML32.prototype.PATCHES_PARSERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'PolygonPatch': (0, _xml.makeReplacer)(_GML2.default.prototype.readPolygonPatch_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML32.prototype.SEGMENTS_PARSERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'LineStringSegment': (0, _xml.makeReplacer)(_GML2.default.prototype.readLineStringSegment_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML32.prototype.MULTIPOINT_PARSERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'pointMember': (0, _xml.makeArrayPusher)(_GMLBase2.default.prototype.pointMemberParser_),
    'pointMembers': (0, _xml.makeArrayPusher)(_GMLBase2.default.prototype.pointMemberParser_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML32.prototype.MULTILINESTRING_PARSERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'lineStringMember': (0, _xml.makeArrayPusher)(_GMLBase2.default.prototype.lineStringMemberParser_),
    'lineStringMembers': (0, _xml.makeArrayPusher)(_GMLBase2.default.prototype.lineStringMemberParser_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML32.prototype.MULTIPOLYGON_PARSERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'polygonMember': (0, _xml.makeArrayPusher)(_GMLBase2.default.prototype.polygonMemberParser_),
    'polygonMembers': (0, _xml.makeArrayPusher)(_GMLBase2.default.prototype.polygonMemberParser_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML32.prototype.POINTMEMBER_PARSERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'Point': (0, _xml.makeArrayPusher)(_GMLBase2.default.prototype.readFlatCoordinatesFromNode_)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML32.prototype.LINESTRINGMEMBER_PARSERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'LineString': (0, _xml.makeArrayPusher)(_GMLBase2.default.prototype.readLineString)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @private
 */
GML32.prototype.POLYGONMEMBER_PARSERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'Polygon': (0, _xml.makeArrayPusher)(_GMLBase2.default.prototype.readPolygon)
  }
};

/**
 * @const
 * @type {Object<string, Object<string, import("../xml.js").Parser>>}
 * @protected
 */
GML32.prototype.RING_PARSERS = {
  'http://www.opengis.net/gml/3.2': {
    'LinearRing': (0, _xml.makeReplacer)(_GMLBase2.default.prototype.readFlatLinearRing_)
  }
};

/**
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 * @private
 */
GML32.prototype.RING_SERIALIZERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'exterior': (0, _xml.makeChildAppender)(_GML2.default.prototype.writeRing_),
    'interior': (0, _xml.makeChildAppender)(_GML2.default.prototype.writeRing_)
  }
};

/**
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 * @private
 */
GML32.prototype.ENVELOPE_SERIALIZERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'lowerCorner': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode),
    'upperCorner': (0, _xml.makeChildAppender)(_xsd.writeStringTextNode)
  }
};

/**
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 * @private
 */
GML32.prototype.SURFACEORPOLYGONMEMBER_SERIALIZERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'surfaceMember': (0, _xml.makeChildAppender)(_GML2.default.prototype.writeSurfaceOrPolygonMember_),
    'polygonMember': (0, _xml.makeChildAppender)(_GML2.default.prototype.writeSurfaceOrPolygonMember_)
  }
};

/**
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 * @private
 */
GML32.prototype.POINTMEMBER_SERIALIZERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'pointMember': (0, _xml.makeChildAppender)(_GML2.default.prototype.writePointMember_)
  }
};

/**
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 * @private
 */
GML32.prototype.LINESTRINGORCURVEMEMBER_SERIALIZERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'lineStringMember': (0, _xml.makeChildAppender)(_GML2.default.prototype.writeLineStringOrCurveMember_),
    'curveMember': (0, _xml.makeChildAppender)(_GML2.default.prototype.writeLineStringOrCurveMember_)
  }
};

/**
 * @type {Object<string, Object<string, import("../xml.js").Serializer>>}
 * @private
 */
GML32.prototype.GEOMETRY_SERIALIZERS_ = {
  'http://www.opengis.net/gml/3.2': {
    'Curve': (0, _xml.makeChildAppender)(_GML2.default.prototype.writeCurveOrLineString_),
    'MultiCurve': (0, _xml.makeChildAppender)(_GML2.default.prototype.writeMultiCurveOrLineString_),
    'Point': (0, _xml.makeChildAppender)(GML32.prototype.writePoint_),
    'MultiPoint': (0, _xml.makeChildAppender)(_GML2.default.prototype.writeMultiPoint_),
    'LineString': (0, _xml.makeChildAppender)(_GML2.default.prototype.writeCurveOrLineString_),
    'MultiLineString': (0, _xml.makeChildAppender)(_GML2.default.prototype.writeMultiCurveOrLineString_),
    'LinearRing': (0, _xml.makeChildAppender)(_GML2.default.prototype.writeLinearRing_),
    'Polygon': (0, _xml.makeChildAppender)(_GML2.default.prototype.writeSurfaceOrPolygon_),
    'MultiPolygon': (0, _xml.makeChildAppender)(_GML2.default.prototype.writeMultiSurfaceOrPolygon_),
    'Surface': (0, _xml.makeChildAppender)(_GML2.default.prototype.writeSurfaceOrPolygon_),
    'MultiSurface': (0, _xml.makeChildAppender)(_GML2.default.prototype.writeMultiSurfaceOrPolygon_),
    'Envelope': (0, _xml.makeChildAppender)(_GML2.default.prototype.writeEnvelope)
  }
};

exports.default = GML32;

//# sourceMappingURL=GML32.js.map