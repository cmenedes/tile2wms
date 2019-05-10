'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Feature = require('../Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _asserts = require('../asserts.js');

var _extent = require('../extent.js');

var _Feature3 = require('./Feature.js');

var _JSONFeature = require('./JSONFeature.js');

var _JSONFeature2 = _interopRequireDefault(_JSONFeature);

var _GeometryLayout = require('../geom/GeometryLayout.js');

var _GeometryLayout2 = _interopRequireDefault(_GeometryLayout);

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

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

var _deflate = require('../geom/flat/deflate.js');

var _orient = require('../geom/flat/orient.js');

var _obj = require('../obj.js');

var _proj = require('../proj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {import("arcgis-rest-api").Feature} EsriJSONFeature
 * @typedef {import("arcgis-rest-api").FeatureSet} EsriJSONFeatureSet
 * @typedef {import("arcgis-rest-api").Geometry} EsriJSONGeometry
 * @typedef {import("arcgis-rest-api").Point} EsriJSONPoint
 * @typedef {import("arcgis-rest-api").Polyline} EsriJSONPolyline
 * @typedef {import("arcgis-rest-api").Polygon} EsriJSONPolygon
 * @typedef {import("arcgis-rest-api").Multipoint} EsriJSONMultipoint
 * @typedef {import("arcgis-rest-api").HasZM} EsriJSONHasZM
 * @typedef {import("arcgis-rest-api").Position} EsriJSONPosition
 * @typedef {import("arcgis-rest-api").SpatialReferenceWkid} EsriJSONSpatialReferenceWkid
 */

/**
 * @typedef {Object} EsriJSONMultiPolygon
 * @property {Array<Array<Array<Array<number>>>>} rings Rings for the MultiPolygon.
 * @property {boolean} [hasM] If the polygon coordinates have an M value.
 * @property {boolean} [hasZ] If the polygon coordinates have a Z value.
 * @property {EsriJSONSpatialReferenceWkid} [spatialReference] The coordinate reference system.
 */

/**
 * @const
 * @type {Object<import("../geom/GeometryType.js").default, function(EsriJSONGeometry): import("../geom/Geometry.js").default>}
 */
/**
 * @module ol/format/EsriJSON
 */
var GEOMETRY_READERS = {};
GEOMETRY_READERS[_GeometryType2.default.POINT] = readPointGeometry;
GEOMETRY_READERS[_GeometryType2.default.LINE_STRING] = readLineStringGeometry;
GEOMETRY_READERS[_GeometryType2.default.POLYGON] = readPolygonGeometry;
GEOMETRY_READERS[_GeometryType2.default.MULTI_POINT] = readMultiPointGeometry;
GEOMETRY_READERS[_GeometryType2.default.MULTI_LINE_STRING] = readMultiLineStringGeometry;
GEOMETRY_READERS[_GeometryType2.default.MULTI_POLYGON] = readMultiPolygonGeometry;

/**
 * @const
 * @type {Object<string, function(import("../geom/Geometry.js").default, import("./Feature.js").WriteOptions=): (EsriJSONGeometry)>}
 */
var GEOMETRY_WRITERS = {};
GEOMETRY_WRITERS[_GeometryType2.default.POINT] = writePointGeometry;
GEOMETRY_WRITERS[_GeometryType2.default.LINE_STRING] = writeLineStringGeometry;
GEOMETRY_WRITERS[_GeometryType2.default.POLYGON] = writePolygonGeometry;
GEOMETRY_WRITERS[_GeometryType2.default.MULTI_POINT] = writeMultiPointGeometry;
GEOMETRY_WRITERS[_GeometryType2.default.MULTI_LINE_STRING] = writeMultiLineStringGeometry;
GEOMETRY_WRITERS[_GeometryType2.default.MULTI_POLYGON] = writeMultiPolygonGeometry;

/**
 * @typedef {Object} Options
 * @property {string} [geometryName] Geometry name to use when creating features.
 */

/**
 * @classdesc
 * Feature format for reading and writing data in the EsriJSON format.
 *
 * @api
 */
var EsriJSON = /*@__PURE__*/function (JSONFeature) {
  function EsriJSON(opt_options) {

    var options = opt_options ? opt_options : {};

    JSONFeature.call(this);

    /**
     * Name of the geometry attribute for features.
     * @type {string|undefined}
     * @private
     */
    this.geometryName_ = options.geometryName;
  }

  if (JSONFeature) EsriJSON.__proto__ = JSONFeature;
  EsriJSON.prototype = Object.create(JSONFeature && JSONFeature.prototype);
  EsriJSON.prototype.constructor = EsriJSON;

  /**
   * @inheritDoc
   */
  EsriJSON.prototype.readFeatureFromObject = function readFeatureFromObject(object, opt_options) {
    var esriJSONFeature = /** @type {EsriJSONFeature} */object;
    var geometry = readGeometry(esriJSONFeature.geometry, opt_options);
    var feature = new _Feature2.default();
    if (this.geometryName_) {
      feature.setGeometryName(this.geometryName_);
    }
    feature.setGeometry(geometry);
    if (opt_options && opt_options.idField && esriJSONFeature.attributes[opt_options.idField]) {
      feature.setId( /** @type {number} */esriJSONFeature.attributes[opt_options.idField]);
    }
    if (esriJSONFeature.attributes) {
      feature.setProperties(esriJSONFeature.attributes);
    }
    return feature;
  };

  /**
   * @inheritDoc
   */
  EsriJSON.prototype.readFeaturesFromObject = function readFeaturesFromObject(object, opt_options) {
    var options = opt_options ? opt_options : {};
    if (object['features']) {
      var esriJSONFeatureSet = /** @type {EsriJSONFeatureSet} */object;
      /** @type {Array<import("../Feature.js").default>} */
      var features = [];
      var esriJSONFeatures = esriJSONFeatureSet.features;
      options.idField = object.objectIdFieldName;
      for (var i = 0, ii = esriJSONFeatures.length; i < ii; ++i) {
        features.push(this.readFeatureFromObject(esriJSONFeatures[i], options));
      }
      return features;
    } else {
      return [this.readFeatureFromObject(object, options)];
    }
  };

  /**
   * @inheritDoc
   */
  EsriJSON.prototype.readGeometryFromObject = function readGeometryFromObject(object, opt_options) {
    return readGeometry( /** @type {EsriJSONGeometry} */object, opt_options);
  };

  /**
   * @inheritDoc
   */
  EsriJSON.prototype.readProjectionFromObject = function readProjectionFromObject(object) {
    if (object['spatialReference'] && object['spatialReference']['wkid'] !== undefined) {
      var spatialReference = /** @type {EsriJSONSpatialReferenceWkid} */object['spatialReference'];
      var crs = spatialReference.wkid;
      return (0, _proj.get)('EPSG:' + crs);
    } else {
      return null;
    }
  };

  /**
   * Encode a geometry as a EsriJSON object.
   *
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
   * @return {EsriJSONGeometry} Object.
   * @override
   * @api
   */
  EsriJSON.prototype.writeGeometryObject = function writeGeometryObject(geometry, opt_options) {
    return writeGeometry(geometry, this.adaptOptions(opt_options));
  };

  /**
   * Encode a feature as a esriJSON Feature object.
   *
   * @param {import("../Feature.js").default} feature Feature.
   * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
   * @return {Object} Object.
   * @override
   * @api
   */
  EsriJSON.prototype.writeFeatureObject = function writeFeatureObject(feature, opt_options) {
    opt_options = this.adaptOptions(opt_options);
    var object = {};
    var geometry = feature.getGeometry();
    if (geometry) {
      object['geometry'] = writeGeometry(geometry, opt_options);
      if (opt_options && opt_options.featureProjection) {
        object['geometry']['spatialReference'] = /** @type {EsriJSONSpatialReferenceWkid} */{
          wkid: Number((0, _proj.get)(opt_options.featureProjection).getCode().split(':').pop())
        };
      }
    }
    var properties = feature.getProperties();
    delete properties[feature.getGeometryName()];
    if (!(0, _obj.isEmpty)(properties)) {
      object['attributes'] = properties;
    } else {
      object['attributes'] = {};
    }
    return object;
  };

  /**
   * Encode an array of features as a EsriJSON object.
   *
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
   * @return {Object} EsriJSON Object.
   * @override
   * @api
   */
  EsriJSON.prototype.writeFeaturesObject = function writeFeaturesObject(features, opt_options) {
    opt_options = this.adaptOptions(opt_options);
    var objects = [];
    for (var i = 0, ii = features.length; i < ii; ++i) {
      objects.push(this.writeFeatureObject(features[i], opt_options));
    }
    return (/** @type {EsriJSONFeatureSet} */{
        'features': objects
      }
    );
  };

  return EsriJSON;
}(_JSONFeature2.default);

/**
 * @param {EsriJSONGeometry} object Object.
 * @param {import("./Feature.js").ReadOptions=} opt_options Read options.
 * @return {import("../geom/Geometry.js").default} Geometry.
 */
function readGeometry(object, opt_options) {
  if (!object) {
    return null;
  }
  /** @type {import("../geom/GeometryType.js").default} */
  var type;
  if (typeof object['x'] === 'number' && typeof object['y'] === 'number') {
    type = _GeometryType2.default.POINT;
  } else if (object['points']) {
    type = _GeometryType2.default.MULTI_POINT;
  } else if (object['paths']) {
    var esriJSONPolyline = /** @type {EsriJSONPolyline} */object;
    if (esriJSONPolyline.paths.length === 1) {
      type = _GeometryType2.default.LINE_STRING;
    } else {
      type = _GeometryType2.default.MULTI_LINE_STRING;
    }
  } else if (object['rings']) {
    var esriJSONPolygon = /** @type {EsriJSONPolygon} */object;
    var layout = getGeometryLayout(esriJSONPolygon);
    var rings = convertRings(esriJSONPolygon.rings, layout);
    if (rings.length === 1) {
      type = _GeometryType2.default.POLYGON;
      object['rings'] = rings[0];
    } else {
      type = _GeometryType2.default.MULTI_POLYGON;
      object['rings'] = rings;
    }
  }
  var geometryReader = GEOMETRY_READERS[type];
  return (
    /** @type {import("../geom/Geometry.js").default} */(0, _Feature3.transformWithOptions)(geometryReader(object), false, opt_options)
  );
}

/**
 * Determines inner and outer rings.
 * Checks if any polygons in this array contain any other polygons in this
 * array. It is used for checking for holes.
 * Logic inspired by: https://github.com/Esri/terraformer-arcgis-parser
 * @param {Array<!Array<!Array<number>>>} rings Rings.
 * @param {import("../geom/GeometryLayout.js").default} layout Geometry layout.
 * @return {Array<!Array<!Array<!Array<number>>>>} Transformed rings.
 */
function convertRings(rings, layout) {
  var flatRing = [];
  var outerRings = [];
  var holes = [];
  var i, ii;
  for (i = 0, ii = rings.length; i < ii; ++i) {
    flatRing.length = 0;
    (0, _deflate.deflateCoordinates)(flatRing, 0, rings[i], layout.length);
    // is this ring an outer ring? is it clockwise?
    var clockwise = (0, _orient.linearRingIsClockwise)(flatRing, 0, flatRing.length, layout.length);
    if (clockwise) {
      outerRings.push([rings[i]]);
    } else {
      holes.push(rings[i]);
    }
  }
  while (holes.length) {
    var hole = holes.shift();
    var matched = false;
    // loop over all outer rings and see if they contain our hole.
    for (i = outerRings.length - 1; i >= 0; i--) {
      var outerRing = outerRings[i][0];
      var containsHole = (0, _extent.containsExtent)(new _LinearRing2.default(outerRing).getExtent(), new _LinearRing2.default(hole).getExtent());
      if (containsHole) {
        // the hole is contained push it into our polygon
        outerRings[i].push(hole);
        matched = true;
        break;
      }
    }
    if (!matched) {
      // no outer rings contain this hole turn it into and outer
      // ring (reverse it)
      outerRings.push([hole.reverse()]);
    }
  }
  return outerRings;
}

/**
 * @param {EsriJSONPoint} object Object.
 * @return {import("../geom/Geometry.js").default} Point.
 */
function readPointGeometry(object) {
  var point;
  if (object.m !== undefined && object.z !== undefined) {
    point = new _Point2.default([object.x, object.y, object.z, object.m], _GeometryLayout2.default.XYZM);
  } else if (object.z !== undefined) {
    point = new _Point2.default([object.x, object.y, object.z], _GeometryLayout2.default.XYZ);
  } else if (object.m !== undefined) {
    point = new _Point2.default([object.x, object.y, object.m], _GeometryLayout2.default.XYM);
  } else {
    point = new _Point2.default([object.x, object.y]);
  }
  return point;
}

/**
 * @param {EsriJSONPolyline} object Object.
 * @return {import("../geom/Geometry.js").default} LineString.
 */
function readLineStringGeometry(object) {
  var layout = getGeometryLayout(object);
  return new _LineString2.default(object.paths[0], layout);
}

/**
 * @param {EsriJSONPolyline} object Object.
 * @return {import("../geom/Geometry.js").default} MultiLineString.
 */
function readMultiLineStringGeometry(object) {
  var layout = getGeometryLayout(object);
  return new _MultiLineString2.default(object.paths, layout);
}

/**
 * @param {EsriJSONHasZM} object Object.
 * @return {import("../geom/GeometryLayout.js").default} The geometry layout to use.
 */
function getGeometryLayout(object) {
  var layout = _GeometryLayout2.default.XY;
  if (object.hasZ === true && object.hasM === true) {
    layout = _GeometryLayout2.default.XYZM;
  } else if (object.hasZ === true) {
    layout = _GeometryLayout2.default.XYZ;
  } else if (object.hasM === true) {
    layout = _GeometryLayout2.default.XYM;
  }
  return layout;
}

/**
 * @param {EsriJSONMultipoint} object Object.
 * @return {import("../geom/Geometry.js").default} MultiPoint.
 */
function readMultiPointGeometry(object) {
  var layout = getGeometryLayout(object);
  return new _MultiPoint2.default(object.points, layout);
}

/**
 * @param {EsriJSONMultiPolygon} object Object.
 * @return {import("../geom/Geometry.js").default} MultiPolygon.
 */
function readMultiPolygonGeometry(object) {
  var layout = getGeometryLayout(object);
  return new _MultiPolygon2.default(object.rings, layout);
}

/**
 * @param {EsriJSONPolygon} object Object.
 * @return {import("../geom/Geometry.js").default} Polygon.
 */
function readPolygonGeometry(object) {
  var layout = getGeometryLayout(object);
  return new _Polygon2.default(object.rings, layout);
}

/**
 * @param {import("../geom/Geometry.js").default} geometry Geometry.
 * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
 * @return {EsriJSONGeometry} EsriJSON geometry.
 */
function writePointGeometry(geometry, opt_options) {
  var coordinates = /** @type {import("../geom/Point.js").default} */geometry.getCoordinates();
  var esriJSON;
  var layout = /** @type {import("../geom/Point.js").default} */geometry.getLayout();
  if (layout === _GeometryLayout2.default.XYZ) {
    esriJSON = /** @type {EsriJSONPoint} */{
      x: coordinates[0],
      y: coordinates[1],
      z: coordinates[2]
    };
  } else if (layout === _GeometryLayout2.default.XYM) {
    esriJSON = /** @type {EsriJSONPoint} */{
      x: coordinates[0],
      y: coordinates[1],
      m: coordinates[2]
    };
  } else if (layout === _GeometryLayout2.default.XYZM) {
    esriJSON = /** @type {EsriJSONPoint} */{
      x: coordinates[0],
      y: coordinates[1],
      z: coordinates[2],
      m: coordinates[3]
    };
  } else if (layout === _GeometryLayout2.default.XY) {
    esriJSON = /** @type {EsriJSONPoint} */{
      x: coordinates[0],
      y: coordinates[1]
    };
  } else {
    (0, _asserts.assert)(false, 34); // Invalid geometry layout
  }
  return (/** @type {EsriJSONGeometry} */esriJSON
  );
}

/**
 * @param {import("../geom/SimpleGeometry.js").default} geometry Geometry.
 * @return {Object} Object with boolean hasZ and hasM keys.
 */
function getHasZM(geometry) {
  var layout = geometry.getLayout();
  return {
    hasZ: layout === _GeometryLayout2.default.XYZ || layout === _GeometryLayout2.default.XYZM,
    hasM: layout === _GeometryLayout2.default.XYM || layout === _GeometryLayout2.default.XYZM
  };
}

/**
 * @param {import("../geom/Geometry.js").default} geometry Geometry.
 * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
 * @return {EsriJSONPolyline} EsriJSON geometry.
 */
function writeLineStringGeometry(geometry, opt_options) {
  var lineString = /** @type {import("../geom/LineString.js").default} */geometry;
  var hasZM = getHasZM(lineString);
  return (
    /** @type {EsriJSONPolyline} */{
      hasZ: hasZM.hasZ,
      hasM: hasZM.hasM,
      paths: [
      /** @type {Array<EsriJSONPosition>} */lineString.getCoordinates()]
    }
  );
}

/**
 * @param {import("../geom/Geometry.js").default} geometry Geometry.
 * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
 * @return {EsriJSONPolygon} EsriJSON geometry.
 */
function writePolygonGeometry(geometry, opt_options) {
  var polygon = /** @type {import("../geom/Polygon.js").default} */geometry;
  // Esri geometries use the left-hand rule
  var hasZM = getHasZM(polygon);
  return (
    /** @type {EsriJSONPolygon} */{
      hasZ: hasZM.hasZ,
      hasM: hasZM.hasM,
      rings: /** @type {Array<Array<EsriJSONPosition>>} */polygon.getCoordinates(false)
    }
  );
}

/**
 * @param {import("../geom/Geometry.js").default} geometry Geometry.
 * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
 * @return {EsriJSONPolyline} EsriJSON geometry.
 */
function writeMultiLineStringGeometry(geometry, opt_options) {
  var multiLineString = /** @type {import("../geom/MultiLineString.js").default} */geometry;
  var hasZM = getHasZM(multiLineString);
  return (
    /** @type {EsriJSONPolyline} */{
      hasZ: hasZM.hasZ,
      hasM: hasZM.hasM,
      paths: /** @type {Array<Array<EsriJSONPosition>>} */multiLineString.getCoordinates()
    }
  );
}

/**
 * @param {import("../geom/Geometry.js").default} geometry Geometry.
 * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
 * @return {EsriJSONMultipoint} EsriJSON geometry.
 */
function writeMultiPointGeometry(geometry, opt_options) {
  var multiPoint = /** @type {import("../geom/MultiPoint.js").default} */geometry;
  var hasZM = getHasZM(multiPoint);
  return (
    /** @type {EsriJSONMultipoint} */{
      hasZ: hasZM.hasZ,
      hasM: hasZM.hasM,
      points: /** @type {Array<EsriJSONPosition>} */multiPoint.getCoordinates()
    }
  );
}

/**
 * @param {import("../geom/Geometry.js").default} geometry Geometry.
 * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
 * @return {EsriJSONPolygon} EsriJSON geometry.
 */
function writeMultiPolygonGeometry(geometry, opt_options) {
  var hasZM = getHasZM( /** @type {import("../geom/MultiPolygon.js").default} */geometry);
  var coordinates = /** @type {import("../geom/MultiPolygon.js").default} */geometry.getCoordinates(false);
  var output = [];
  for (var i = 0; i < coordinates.length; i++) {
    for (var x = coordinates[i].length - 1; x >= 0; x--) {
      output.push(coordinates[i][x]);
    }
  }
  return (/** @type {EsriJSONPolygon} */{
      hasZ: hasZM.hasZ,
      hasM: hasZM.hasM,
      rings: output
    }
  );
}

/**
 * @param {import("../geom/Geometry.js").default} geometry Geometry.
 * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
 * @return {EsriJSONGeometry} EsriJSON geometry.
 */
function writeGeometry(geometry, opt_options) {
  var geometryWriter = GEOMETRY_WRITERS[geometry.getType()];
  return geometryWriter( /** @type {import("../geom/Geometry.js").default} */(0, _Feature3.transformWithOptions)(geometry, true, opt_options), opt_options);
}

exports.default = EsriJSON;

//# sourceMappingURL=EsriJSON.js.map