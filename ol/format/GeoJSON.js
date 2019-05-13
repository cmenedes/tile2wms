'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asserts = require('../asserts.js');

var _Feature = require('../Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _Feature3 = require('./Feature.js');

var _JSONFeature = require('./JSONFeature.js');

var _JSONFeature2 = _interopRequireDefault(_JSONFeature);

var _GeometryCollection = require('../geom/GeometryCollection.js');

var _GeometryCollection2 = _interopRequireDefault(_GeometryCollection);

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

var _obj = require('../obj.js');

var _proj = require('../proj.js');

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {import("geojson").GeoJSON} GeoJSONObject
 * @typedef {import("geojson").Feature} GeoJSONFeature
 * @typedef {import("geojson").FeatureCollection} GeoJSONFeatureCollection
 * @typedef {import("geojson").Geometry} GeoJSONGeometry
 * @typedef {import("geojson").Point} GeoJSONPoint
 * @typedef {import("geojson").LineString} GeoJSONLineString
 * @typedef {import("geojson").Polygon} GeoJSONPolygon
 * @typedef {import("geojson").MultiPoint} GeoJSONMultiPoint
 * @typedef {import("geojson").MultiLineString} GeoJSONMultiLineString
 * @typedef {import("geojson").MultiPolygon} GeoJSONMultiPolygon
 * @typedef {import("geojson").GeometryCollection} GeoJSONGeometryCollection
 */

/**
 * @typedef {Object} Options
 * @property {import("../proj.js").ProjectionLike} [dataProjection='EPSG:4326'] Default data projection.
 * @property {import("../proj.js").ProjectionLike} [featureProjection] Projection for features read or
 * written by the format.  Options passed to read or write methods will take precedence.
 * @property {string} [geometryName] Geometry name to use when creating features.
 * @property {boolean} [extractGeometryName=false] Certain GeoJSON providers include
 * the geometry_name field in the feature GeoJSON. If set to `true` the GeoJSON reader
 * will look for that field to set the geometry name. If both this field is set to `true`
 * and a `geometryName` is provided, the `geometryName` will take precedence.
 */

/**
 * @classdesc
 * Feature format for reading and writing data in the GeoJSON format.
 *
  * @api
 */
/**
 * @module ol/format/GeoJSON
 */

var GeoJSON = /*@__PURE__*/function (JSONFeature) {
  function GeoJSON(opt_options) {

    var options = opt_options ? opt_options : {};

    JSONFeature.call(this);

    /**
     * @inheritDoc
     */
    this.dataProjection = (0, _proj.get)(options.dataProjection ? options.dataProjection : 'EPSG:4326');

    if (options.featureProjection) {
      this.defaultFeatureProjection = (0, _proj.get)(options.featureProjection);
    }

    /**
     * Name of the geometry attribute for features.
     * @type {string|undefined}
     * @private
     */
    this.geometryName_ = options.geometryName;

    /**
     * Look for the geometry name in the feature GeoJSON
     * @type {boolean|undefined}
     * @private
     */
    this.extractGeometryName_ = options.extractGeometryName;
  }

  if (JSONFeature) GeoJSON.__proto__ = JSONFeature;
  GeoJSON.prototype = Object.create(JSONFeature && JSONFeature.prototype);
  GeoJSON.prototype.constructor = GeoJSON;

  /**
   * @inheritDoc
   */
  GeoJSON.prototype.readFeatureFromObject = function readFeatureFromObject(object, opt_options) {
    /**
     * @type {GeoJSONFeature}
     */
    var geoJSONFeature = null;
    if (object['type'] === 'Feature') {
      geoJSONFeature = /** @type {GeoJSONFeature} */object;
    } else {
      geoJSONFeature = {
        'type': 'Feature',
        'geometry': /** @type {GeoJSONGeometry} */object,
        'properties': null
      };
    }

    var geometry = readGeometry(geoJSONFeature['geometry'], opt_options);
    var feature = new _Feature2.default();
    if (this.geometryName_) {
      feature.setGeometryName(this.geometryName_);
    } else if (this.extractGeometryName_ && 'geometry_name' in geoJSONFeature !== undefined) {
      feature.setGeometryName(geoJSONFeature['geometry_name']);
    }
    feature.setGeometry(geometry);

    if ('id' in geoJSONFeature) {
      feature.setId(geoJSONFeature['id']);
    }

    if (geoJSONFeature['properties']) {
      feature.setProperties(geoJSONFeature['properties']);
    }
    return feature;
  };

  /**
   * @inheritDoc
   */
  GeoJSON.prototype.readFeaturesFromObject = function readFeaturesFromObject(object, opt_options) {
    var geoJSONObject = /** @type {GeoJSONObject} */object;
    /** @type {Array<import("../Feature.js").default>} */
    var features = null;
    if (geoJSONObject['type'] === 'FeatureCollection') {
      var geoJSONFeatureCollection = /** @type {GeoJSONFeatureCollection} */object;
      features = [];
      var geoJSONFeatures = geoJSONFeatureCollection['features'];
      for (var i = 0, ii = geoJSONFeatures.length; i < ii; ++i) {
        features.push(this.readFeatureFromObject(geoJSONFeatures[i], opt_options));
      }
    } else {
      features = [this.readFeatureFromObject(object, opt_options)];
    }
    return features;
  };

  /**
   * @inheritDoc
   */
  GeoJSON.prototype.readGeometryFromObject = function readGeometryFromObject(object, opt_options) {
    return readGeometry( /** @type {GeoJSONGeometry} */object, opt_options);
  };

  /**
   * @inheritDoc
   */
  GeoJSON.prototype.readProjectionFromObject = function readProjectionFromObject(object) {
    var crs = object['crs'];
    var projection;
    if (crs) {
      if (crs['type'] == 'name') {
        projection = (0, _proj.get)(crs['properties']['name']);
      } else {
        (0, _asserts.assert)(false, 36); // Unknown SRS type
      }
    } else {
      projection = this.dataProjection;
    }
    return (
      /** @type {import("../proj/Projection.js").default} */projection
    );
  };

  /**
   * Encode a feature as a GeoJSON Feature object.
   *
   * @param {import("../Feature.js").default} feature Feature.
   * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
   * @return {GeoJSONFeature} Object.
   * @override
   * @api
   */
  GeoJSON.prototype.writeFeatureObject = function writeFeatureObject(feature, opt_options) {
    opt_options = this.adaptOptions(opt_options);

    /** @type {GeoJSONFeature} */
    var object = {
      'type': 'Feature',
      geometry: null,
      properties: null
    };

    var id = feature.getId();
    if (id !== undefined) {
      object.id = id;
    }

    var geometry = feature.getGeometry();
    if (geometry) {
      object.geometry = writeGeometry(geometry, opt_options);
    }

    var properties = feature.getProperties();
    delete properties[feature.getGeometryName()];
    if (!(0, _obj.isEmpty)(properties)) {
      object.properties = properties;
    }
    return object;
  };

  /**
   * Encode an array of features as a GeoJSON object.
   *
   * @param {Array<import("../Feature.js").default>} features Features.
   * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
   * @return {GeoJSONFeatureCollection} GeoJSON Object.
   * @override
   * @api
   */
  GeoJSON.prototype.writeFeaturesObject = function writeFeaturesObject(features, opt_options) {
    opt_options = this.adaptOptions(opt_options);
    var objects = [];
    for (var i = 0, ii = features.length; i < ii; ++i) {
      objects.push(this.writeFeatureObject(features[i], opt_options));
    }
    return {
      type: 'FeatureCollection',
      features: objects
    };
  };

  /**
   * Encode a geometry as a GeoJSON object.
   *
   * @param {import("../geom/Geometry.js").default} geometry Geometry.
   * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
   * @return {GeoJSONGeometry|GeoJSONGeometryCollection} Object.
   * @override
   * @api
   */
  GeoJSON.prototype.writeGeometryObject = function writeGeometryObject(geometry, opt_options) {
    return writeGeometry(geometry, this.adaptOptions(opt_options));
  };

  return GeoJSON;
}(_JSONFeature2.default);

/**
 * @param {GeoJSONGeometry|GeoJSONGeometryCollection} object Object.
 * @param {import("./Feature.js").ReadOptions=} opt_options Read options.
 * @return {import("../geom/Geometry.js").default} Geometry.
 */
function readGeometry(object, opt_options) {
  if (!object) {
    return null;
  }

  /**
   * @type {import("../geom/Geometry.js").default}
   */
  var geometry;
  switch (object['type']) {
    case _GeometryType2.default.POINT:
      {
        geometry = readPointGeometry( /** @type {GeoJSONPoint} */object);
        break;
      }
    case _GeometryType2.default.LINE_STRING:
      {
        geometry = readLineStringGeometry( /** @type {GeoJSONLineString} */object);
        break;
      }
    case _GeometryType2.default.POLYGON:
      {
        geometry = readPolygonGeometry( /** @type {GeoJSONPolygon} */object);
        break;
      }
    case _GeometryType2.default.MULTI_POINT:
      {
        geometry = readMultiPointGeometry( /** @type {GeoJSONMultiPoint} */object);
        break;
      }
    case _GeometryType2.default.MULTI_LINE_STRING:
      {
        geometry = readMultiLineStringGeometry( /** @type {GeoJSONMultiLineString} */object);
        break;
      }
    case _GeometryType2.default.MULTI_POLYGON:
      {
        geometry = readMultiPolygonGeometry( /** @type {GeoJSONMultiPolygon} */object);
        break;
      }
    case _GeometryType2.default.GEOMETRY_COLLECTION:
      {
        geometry = readGeometryCollectionGeometry( /** @type {GeoJSONGeometryCollection} */object);
        break;
      }
    default:
      {
        throw new Error('Unsupported GeoJSON type: ' + object.type);
      }
  }
  return (/** @type {import("../geom/Geometry.js").default} */(0, _Feature3.transformWithOptions)(geometry, false, opt_options)
  );
}

/**
 * @param {GeoJSONGeometryCollection} object Object.
 * @param {import("./Feature.js").ReadOptions=} opt_options Read options.
 * @return {GeometryCollection} Geometry collection.
 */
function readGeometryCollectionGeometry(object, opt_options) {
  var geometries = object['geometries'].map(
  /**
   * @param {GeoJSONGeometry} geometry Geometry.
   * @return {import("../geom/Geometry.js").default} geometry Geometry.
   */
  function (geometry) {
    return readGeometry(geometry, opt_options);
  });
  return new _GeometryCollection2.default(geometries);
}

/**
 * @param {GeoJSONPoint} object Object.
 * @return {Point} Point.
 */
function readPointGeometry(object) {
  return new _Point2.default(object['coordinates']);
}

/**
 * @param {GeoJSONLineString} object Object.
 * @return {LineString} LineString.
 */
function readLineStringGeometry(object) {
  return new _LineString2.default(object['coordinates']);
}

/**
 * @param {GeoJSONMultiLineString} object Object.
 * @return {MultiLineString} MultiLineString.
 */
function readMultiLineStringGeometry(object) {
  return new _MultiLineString2.default(object['coordinates']);
}

/**
 * @param {GeoJSONMultiPoint} object Object.
 * @return {MultiPoint} MultiPoint.
 */
function readMultiPointGeometry(object) {
  return new _MultiPoint2.default(object['coordinates']);
}

/**
 * @param {GeoJSONMultiPolygon} object Object.
 * @return {MultiPolygon} MultiPolygon.
 */
function readMultiPolygonGeometry(object) {
  return new _MultiPolygon2.default(object['coordinates']);
}

/**
 * @param {GeoJSONPolygon} object Object.
 * @return {Polygon} Polygon.
 */
function readPolygonGeometry(object) {
  return new _Polygon2.default(object['coordinates']);
}

/**
 * @param {import("../geom/Geometry.js").default} geometry Geometry.
 * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
 * @return {GeoJSONGeometry} GeoJSON geometry.
 */
function writeGeometry(geometry, opt_options) {
  geometry = /** @type {import("../geom/Geometry.js").default} */(0, _Feature3.transformWithOptions)(geometry, true, opt_options);
  var type = geometry.getType();

  /** @type {GeoJSONGeometry} */
  var geoJSON;
  switch (type) {
    case _GeometryType2.default.POINT:
      {
        geoJSON = writePointGeometry( /** @type {Point} */geometry, opt_options);
        break;
      }
    case _GeometryType2.default.LINE_STRING:
      {
        geoJSON = writeLineStringGeometry( /** @type {LineString} */geometry, opt_options);
        break;
      }
    case _GeometryType2.default.POLYGON:
      {
        geoJSON = writePolygonGeometry( /** @type {Polygon} */geometry, opt_options);
        break;
      }
    case _GeometryType2.default.MULTI_POINT:
      {
        geoJSON = writeMultiPointGeometry( /** @type {MultiPoint} */geometry, opt_options);
        break;
      }
    case _GeometryType2.default.MULTI_LINE_STRING:
      {
        geoJSON = writeMultiLineStringGeometry( /** @type {MultiLineString} */geometry, opt_options);
        break;
      }
    case _GeometryType2.default.MULTI_POLYGON:
      {
        geoJSON = writeMultiPolygonGeometry( /** @type {MultiPolygon} */geometry, opt_options);
        break;
      }
    case _GeometryType2.default.GEOMETRY_COLLECTION:
      {
        geoJSON = writeGeometryCollectionGeometry( /** @type {GeometryCollection} */geometry, opt_options);
        break;
      }
    case _GeometryType2.default.CIRCLE:
      {
        geoJSON = {
          type: 'GeometryCollection',
          geometries: []
        };
        break;
      }
    default:
      {
        throw new Error('Unsupported geometry type: ' + type);
      }
  }
  return geoJSON;
}

/**
 * @param {GeometryCollection} geometry Geometry.
 * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
 * @return {GeoJSONGeometryCollection} GeoJSON geometry collection.
 */
function writeGeometryCollectionGeometry(geometry, opt_options) {
  var geometries = geometry.getGeometriesArray().map(function (geometry) {
    var options = (0, _obj.assign)({}, opt_options);
    delete options.featureProjection;
    return writeGeometry(geometry, options);
  });
  return {
    type: 'GeometryCollection',
    geometries: geometries
  };
}

/**
 * @param {LineString} geometry Geometry.
 * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
 * @return {GeoJSONGeometry} GeoJSON geometry.
 */
function writeLineStringGeometry(geometry, opt_options) {
  return {
    type: 'LineString',
    coordinates: geometry.getCoordinates()
  };
}

/**
 * @param {MultiLineString} geometry Geometry.
 * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
 * @return {GeoJSONGeometry} GeoJSON geometry.
 */
function writeMultiLineStringGeometry(geometry, opt_options) {
  return {
    type: 'MultiLineString',
    coordinates: geometry.getCoordinates()
  };
}

/**
 * @param {MultiPoint} geometry Geometry.
 * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
 * @return {GeoJSONGeometry} GeoJSON geometry.
 */
function writeMultiPointGeometry(geometry, opt_options) {
  return {
    type: 'MultiPoint',
    coordinates: geometry.getCoordinates()
  };
}

/**
 * @param {MultiPolygon} geometry Geometry.
 * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
 * @return {GeoJSONGeometry} GeoJSON geometry.
 */
function writeMultiPolygonGeometry(geometry, opt_options) {
  var right;
  if (opt_options) {
    right = opt_options.rightHanded;
  }
  return {
    type: 'MultiPolygon',
    coordinates: geometry.getCoordinates(right)
  };
}

/**
 * @param {Point} geometry Geometry.
 * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
 * @return {GeoJSONGeometry} GeoJSON geometry.
 */
function writePointGeometry(geometry, opt_options) {
  return {
    type: 'Point',
    coordinates: geometry.getCoordinates()
  };
}

/**
 * @param {Polygon} geometry Geometry.
 * @param {import("./Feature.js").WriteOptions=} opt_options Write options.
 * @return {GeoJSONGeometry} GeoJSON geometry.
 */
function writePolygonGeometry(geometry, opt_options) {
  var right;
  if (opt_options) {
    right = opt_options.rightHanded;
  }
  return {
    type: 'Polygon',
    coordinates: geometry.getCoordinates(right)
  };
}

exports.default = GeoJSON;

//# sourceMappingURL=GeoJSON.js.map