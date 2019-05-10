'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util.js');

var _asserts = require('../asserts.js');

var _Feature = require('../Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _coordinate = require('../coordinate.js');

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('../extent.js');

var _Point = require('../geom/Point.js');

var _Point2 = _interopRequireDefault(_Point);

var _Vector = require('./Vector.js');

var _Vector2 = _interopRequireDefault(_Vector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} Options
 * @property {import("./Source.js").AttributionLike} [attributions] Attributions.
 * @property {number} [distance=20] Minimum distance in pixels between clusters.
 * @property {function(Feature):Point} [geometryFunction]
 * Function that takes an {@link module:ol/Feature} as argument and returns an
 * {@link module:ol/geom/Point} as cluster calculation point for the feature. When a
 * feature should not be considered for clustering, the function should return
 * `null`. The default, which works when the underyling source contains point
 * features only, is
 * ```js
 * function(feature) {
 *   return feature.getGeometry();
 * }
 * ```
 * See {@link module:ol/geom/Polygon~Polygon#getInteriorPoint} for a way to get a cluster
 * calculation point for polygons.
 * @property {VectorSource} source Source.
 * @property {boolean} [wrapX=true] Whether to wrap the world horizontally.
 */

/**
 * @classdesc
 * Layer source to cluster vector data. Works out of the box with point
 * geometries. For other geometry types, or if not all geometries should be
 * considered for clustering, a custom `geometryFunction` can be defined.
 * @api
 */
/**
 * @module ol/source/Cluster
 */

var Cluster = /*@__PURE__*/function (VectorSource) {
  function Cluster(options) {
    VectorSource.call(this, {
      attributions: options.attributions,
      wrapX: options.wrapX
    });

    /**
     * @type {number|undefined}
     * @protected
     */
    this.resolution = undefined;

    /**
     * @type {number}
     * @protected
     */
    this.distance = options.distance !== undefined ? options.distance : 20;

    /**
     * @type {Array<Feature>}
     * @protected
     */
    this.features = [];

    /**
     * @param {Feature} feature Feature.
     * @return {Point} Cluster calculation point.
     * @protected
     */
    this.geometryFunction = options.geometryFunction || function (feature) {
      var geometry = /** @type {Point} */feature.getGeometry();
      (0, _asserts.assert)(geometry.getType() == _GeometryType2.default.POINT, 10); // The default `geometryFunction` can only handle `Point` geometries
      return geometry;
    };

    /**
     * @type {VectorSource}
     * @protected
     */
    this.source = options.source;

    (0, _events.listen)(this.source, _EventType2.default.CHANGE, this.refresh, this);
  }

  if (VectorSource) Cluster.__proto__ = VectorSource;
  Cluster.prototype = Object.create(VectorSource && VectorSource.prototype);
  Cluster.prototype.constructor = Cluster;

  /**
   * Get the distance in pixels between clusters.
   * @return {number} Distance.
   * @api
   */
  Cluster.prototype.getDistance = function getDistance() {
    return this.distance;
  };

  /**
   * Get a reference to the wrapped source.
   * @return {VectorSource} Source.
   * @api
   */
  Cluster.prototype.getSource = function getSource() {
    return this.source;
  };

  /**
   * @inheritDoc
   */
  Cluster.prototype.loadFeatures = function loadFeatures(extent, resolution, projection) {
    this.source.loadFeatures(extent, resolution, projection);
    if (resolution !== this.resolution) {
      this.clear();
      this.resolution = resolution;
      this.cluster();
      this.addFeatures(this.features);
    }
  };

  /**
   * Set the distance in pixels between clusters.
   * @param {number} distance The distance in pixels.
   * @api
   */
  Cluster.prototype.setDistance = function setDistance(distance) {
    this.distance = distance;
    this.refresh();
  };

  /**
   * handle the source changing
   * @override
   */
  Cluster.prototype.refresh = function refresh() {
    this.clear();
    this.cluster();
    this.addFeatures(this.features);
    VectorSource.prototype.refresh.call(this);
  };

  /**
   * @protected
   */
  Cluster.prototype.cluster = function cluster() {
    if (this.resolution === undefined) {
      return;
    }
    this.features.length = 0;
    var extent = (0, _extent.createEmpty)();
    var mapDistance = this.distance * this.resolution;
    var features = this.source.getFeatures();

    /**
     * @type {!Object<string, boolean>}
     */
    var clustered = {};

    for (var i = 0, ii = features.length; i < ii; i++) {
      var feature = features[i];
      if (!((0, _util.getUid)(feature) in clustered)) {
        var geometry = this.geometryFunction(feature);
        if (geometry) {
          var coordinates = geometry.getCoordinates();
          (0, _extent.createOrUpdateFromCoordinate)(coordinates, extent);
          (0, _extent.buffer)(extent, mapDistance, extent);

          var neighbors = this.source.getFeaturesInExtent(extent);
          neighbors = neighbors.filter(function (neighbor) {
            var uid = (0, _util.getUid)(neighbor);
            if (!(uid in clustered)) {
              clustered[uid] = true;
              return true;
            } else {
              return false;
            }
          });
          this.features.push(this.createCluster(neighbors));
        }
      }
    }
  };

  /**
   * @param {Array<Feature>} features Features
   * @return {Feature} The cluster feature.
   * @protected
   */
  Cluster.prototype.createCluster = function createCluster(features) {
    var centroid = [0, 0];
    for (var i = features.length - 1; i >= 0; --i) {
      var geometry = this.geometryFunction(features[i]);
      if (geometry) {
        (0, _coordinate.add)(centroid, geometry.getCoordinates());
      } else {
        features.splice(i, 1);
      }
    }
    (0, _coordinate.scale)(centroid, 1 / features.length);

    var cluster = new _Feature2.default(new _Point2.default(centroid));
    cluster.set('features', features);
    return cluster;
  };

  return Cluster;
}(_Vector2.default);

exports.default = Cluster;

//# sourceMappingURL=Cluster.js.map