'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModifyEvent = undefined;

var _util = require('../util.js');

var _Collection = require('../Collection.js');

var _Collection2 = _interopRequireDefault(_Collection);

var _CollectionEventType = require('../CollectionEventType.js');

var _CollectionEventType2 = _interopRequireDefault(_CollectionEventType);

var _Feature = require('../Feature.js');

var _Feature2 = _interopRequireDefault(_Feature);

var _MapBrowserEventType = require('../MapBrowserEventType.js');

var _MapBrowserEventType2 = _interopRequireDefault(_MapBrowserEventType);

var _array = require('../array.js');

var _coordinate = require('../coordinate.js');

var _events = require('../events.js');

var _Event = require('../events/Event.js');

var _Event2 = _interopRequireDefault(_Event);

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _condition = require('../events/condition.js');

var _extent = require('../extent.js');

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _Point = require('../geom/Point.js');

var _Point2 = _interopRequireDefault(_Point);

var _Pointer = require('./Pointer.js');

var _Pointer2 = _interopRequireDefault(_Pointer);

var _Vector = require('../layer/Vector.js');

var _Vector2 = _interopRequireDefault(_Vector);

var _Vector3 = require('../source/Vector.js');

var _Vector4 = _interopRequireDefault(_Vector3);

var _VectorEventType = require('../source/VectorEventType.js');

var _VectorEventType2 = _interopRequireDefault(_VectorEventType);

var _RBush = require('../structs/RBush.js');

var _RBush2 = _interopRequireDefault(_RBush);

var _Style = require('../style/Style.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The segment index assigned to a circle's center when
 * breaking up a circle into ModifySegmentDataType segments.
 * @type {number}
 */
/**
 * @module ol/interaction/Modify
 */
var CIRCLE_CENTER_INDEX = 0;

/**
 * The segment index assigned to a circle's circumference when
 * breaking up a circle into ModifySegmentDataType segments.
 * @type {number}
 */
var CIRCLE_CIRCUMFERENCE_INDEX = 1;

/**
 * @enum {string}
 */
var ModifyEventType = {
  /**
   * Triggered upon feature modification start
   * @event ModifyEvent#modifystart
   * @api
   */
  MODIFYSTART: 'modifystart',
  /**
   * Triggered upon feature modification end
   * @event ModifyEvent#modifyend
   * @api
   */
  MODIFYEND: 'modifyend'
};

/**
 * @typedef {Object} SegmentData
 * @property {Array<number>} [depth]
 * @property {Feature} feature
 * @property {import("../geom/SimpleGeometry.js").default} geometry
 * @property {number} [index]
 * @property {Array<import("../extent.js").Extent>} segment
 * @property {Array<SegmentData>} [featureSegments]
 */

/**
 * @typedef {Object} Options
 * @property {import("../events/condition.js").Condition} [condition] A function that
 * takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event will be considered to add or move a
 * vertex to the sketch. Default is
 * {@link module:ol/events/condition~primaryAction}.
 * @property {import("../events/condition.js").Condition} [deleteCondition] A function
 * that takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event should be handled. By default,
 * {@link module:ol/events/condition~singleClick} with
 * {@link module:ol/events/condition~altKeyOnly} results in a vertex deletion.
 * @property {import("../events/condition.js").Condition} [insertVertexCondition] A
 * function that takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and
 * returns a boolean to indicate whether a new vertex can be added to the sketch
 * features. Default is {@link module:ol/events/condition~always}.
 * @property {number} [pixelTolerance=10] Pixel tolerance for considering the
 * pointer close enough to a segment or vertex for editing.
 * @property {import("../style/Style.js").StyleLike} [style]
 * Style used for the features being modified. By default the default edit
 * style is used (see {@link module:ol/style}).
 * @property {VectorSource} [source] The vector source with
 * features to modify.  If a vector source is not provided, a feature collection
 * must be provided with the features option.
 * @property {Collection<Feature>} [features]
 * The features the interaction works on.  If a feature collection is not
 * provided, a vector source must be provided with the source option.
 * @property {boolean} [wrapX=false] Wrap the world horizontally on the sketch
 * overlay.
 */

/**
 * @classdesc
 * Events emitted by {@link module:ol/interaction/Modify~Modify} instances are
 * instances of this type.
 */
var ModifyEvent = /*@__PURE__*/exports.ModifyEvent = function (Event) {
  function ModifyEvent(type, features, mapBrowserPointerEvent) {
    Event.call(this, type);

    /**
     * The features being modified.
     * @type {Collection<Feature>}
     * @api
     */
    this.features = features;

    /**
     * Associated {@link module:ol/MapBrowserEvent}.
     * @type {import("../MapBrowserEvent.js").default}
     * @api
     */
    this.mapBrowserEvent = mapBrowserPointerEvent;
  }

  if (Event) ModifyEvent.__proto__ = Event;
  ModifyEvent.prototype = Object.create(Event && Event.prototype);
  ModifyEvent.prototype.constructor = ModifyEvent;

  return ModifyEvent;
}(_Event2.default);

/**
 * @classdesc
 * Interaction for modifying feature geometries.  To modify features that have
 * been added to an existing source, construct the modify interaction with the
 * `source` option.  If you want to modify features in a collection (for example,
 * the collection used by a select interaction), construct the interaction with
 * the `features` option.  The interaction must be constructed with either a
 * `source` or `features` option.
 *
 * By default, the interaction will allow deletion of vertices when the `alt`
 * key is pressed.  To configure the interaction with a different condition
 * for deletion, use the `deleteCondition` option.
 * @fires ModifyEvent
 * @api
 */
var Modify = /*@__PURE__*/function (PointerInteraction) {
  function Modify(options) {

    PointerInteraction.call( /** @type {import("./Pointer.js").Options} */this, options);

    /**
     * @private
     * @type {import("../events/condition.js").Condition}
     */
    this.condition_ = options.condition ? options.condition : _condition.primaryAction;

    /**
     * @private
     * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Browser event.
     * @return {boolean} Combined condition result.
     */
    this.defaultDeleteCondition_ = function (mapBrowserEvent) {
      return (0, _condition.altKeyOnly)(mapBrowserEvent) && (0, _condition.singleClick)(mapBrowserEvent);
    };

    /**
     * @type {import("../events/condition.js").Condition}
     * @private
     */
    this.deleteCondition_ = options.deleteCondition ? options.deleteCondition : this.defaultDeleteCondition_;

    /**
     * @type {import("../events/condition.js").Condition}
     * @private
     */
    this.insertVertexCondition_ = options.insertVertexCondition ? options.insertVertexCondition : _condition.always;

    /**
     * Editing vertex.
     * @type {Feature}
     * @private
     */
    this.vertexFeature_ = null;

    /**
     * Segments intersecting {@link this.vertexFeature_} by segment uid.
     * @type {Object<string, boolean>}
     * @private
     */
    this.vertexSegments_ = null;

    /**
     * @type {import("../pixel.js").Pixel}
     * @private
     */
    this.lastPixel_ = [0, 0];

    /**
     * Tracks if the next `singleclick` event should be ignored to prevent
     * accidental deletion right after vertex creation.
     * @type {boolean}
     * @private
     */
    this.ignoreNextSingleClick_ = false;

    /**
     * @type {boolean}
     * @private
     */
    this.modified_ = false;

    /**
     * Segment RTree for each layer
     * @type {RBush<SegmentData>}
     * @private
     */
    this.rBush_ = new _RBush2.default();

    /**
     * @type {number}
     * @private
     */
    this.pixelTolerance_ = options.pixelTolerance !== undefined ? options.pixelTolerance : 10;

    /**
     * @type {boolean}
     * @private
     */
    this.snappedToVertex_ = false;

    /**
     * Indicate whether the interaction is currently changing a feature's
     * coordinates.
     * @type {boolean}
     * @private
     */
    this.changingFeature_ = false;

    /**
     * @type {Array}
     * @private
     */
    this.dragSegments_ = [];

    /**
     * Draw overlay where sketch features are drawn.
     * @type {VectorLayer}
     * @private
     */
    this.overlay_ = new _Vector2.default({
      source: new _Vector4.default({
        useSpatialIndex: false,
        wrapX: !!options.wrapX
      }),
      style: options.style ? options.style : getDefaultStyleFunction(),
      updateWhileAnimating: true,
      updateWhileInteracting: true
    });

    /**
     * @const
     * @private
     * @type {!Object<string, function(Feature, import("../geom/Geometry.js").default)>}
     */
    this.SEGMENT_WRITERS_ = {
      'Point': this.writePointGeometry_,
      'LineString': this.writeLineStringGeometry_,
      'LinearRing': this.writeLineStringGeometry_,
      'Polygon': this.writePolygonGeometry_,
      'MultiPoint': this.writeMultiPointGeometry_,
      'MultiLineString': this.writeMultiLineStringGeometry_,
      'MultiPolygon': this.writeMultiPolygonGeometry_,
      'Circle': this.writeCircleGeometry_,
      'GeometryCollection': this.writeGeometryCollectionGeometry_
    };

    /**
     * @type {VectorSource}
     * @private
     */
    this.source_ = null;

    var features;
    if (options.source) {
      this.source_ = options.source;
      features = new _Collection2.default(this.source_.getFeatures());
      (0, _events.listen)(this.source_, _VectorEventType2.default.ADDFEATURE, this.handleSourceAdd_, this);
      (0, _events.listen)(this.source_, _VectorEventType2.default.REMOVEFEATURE, this.handleSourceRemove_, this);
    } else {
      features = options.features;
    }
    if (!features) {
      throw new Error('The modify interaction requires features or a source');
    }

    /**
     * @type {Collection<Feature>}
     * @private
     */
    this.features_ = features;

    this.features_.forEach(this.addFeature_.bind(this));
    (0, _events.listen)(this.features_, _CollectionEventType2.default.ADD, this.handleFeatureAdd_, this);
    (0, _events.listen)(this.features_, _CollectionEventType2.default.REMOVE, this.handleFeatureRemove_, this);

    /**
     * @type {import("../MapBrowserPointerEvent.js").default}
     * @private
     */
    this.lastPointerEvent_ = null;
  }

  if (PointerInteraction) Modify.__proto__ = PointerInteraction;
  Modify.prototype = Object.create(PointerInteraction && PointerInteraction.prototype);
  Modify.prototype.constructor = Modify;

  /**
   * @param {Feature} feature Feature.
   * @private
   */
  Modify.prototype.addFeature_ = function addFeature_(feature) {
    var geometry = feature.getGeometry();
    if (geometry && geometry.getType() in this.SEGMENT_WRITERS_) {
      this.SEGMENT_WRITERS_[geometry.getType()].call(this, feature, geometry);
    }
    var map = this.getMap();
    if (map && map.isRendered() && this.getActive()) {
      this.handlePointerAtPixel_(this.lastPixel_, map);
    }
    (0, _events.listen)(feature, _EventType2.default.CHANGE, this.handleFeatureChange_, this);
  };

  /**
   * @param {import("../MapBrowserPointerEvent.js").default} evt Map browser event
   * @private
   */
  Modify.prototype.willModifyFeatures_ = function willModifyFeatures_(evt) {
    if (!this.modified_) {
      this.modified_ = true;
      this.dispatchEvent(new ModifyEvent(ModifyEventType.MODIFYSTART, this.features_, evt));
    }
  };

  /**
   * @param {Feature} feature Feature.
   * @private
   */
  Modify.prototype.removeFeature_ = function removeFeature_(feature) {
    this.removeFeatureSegmentData_(feature);
    // Remove the vertex feature if the collection of canditate features
    // is empty.
    if (this.vertexFeature_ && this.features_.getLength() === 0) {
      /** @type {VectorSource} */this.overlay_.getSource().removeFeature(this.vertexFeature_);
      this.vertexFeature_ = null;
    }
    (0, _events.unlisten)(feature, _EventType2.default.CHANGE, this.handleFeatureChange_, this);
  };

  /**
   * @param {Feature} feature Feature.
   * @private
   */
  Modify.prototype.removeFeatureSegmentData_ = function removeFeatureSegmentData_(feature) {
    var rBush = this.rBush_;
    var /** @type {Array<SegmentData>} */nodesToRemove = [];
    rBush.forEach(
    /**
     * @param {SegmentData} node RTree node.
     */
    function (node) {
      if (feature === node.feature) {
        nodesToRemove.push(node);
      }
    });
    for (var i = nodesToRemove.length - 1; i >= 0; --i) {
      rBush.remove(nodesToRemove[i]);
    }
  };

  /**
   * @inheritDoc
   */
  Modify.prototype.setActive = function setActive(active) {
    if (this.vertexFeature_ && !active) {
      /** @type {VectorSource} */this.overlay_.getSource().removeFeature(this.vertexFeature_);
      this.vertexFeature_ = null;
    }
    PointerInteraction.prototype.setActive.call(this, active);
  };

  /**
   * @inheritDoc
   */
  Modify.prototype.setMap = function setMap(map) {
    this.overlay_.setMap(map);
    PointerInteraction.prototype.setMap.call(this, map);
  };

  /**
   * Get the overlay layer that this interaction renders sketch features to.
   * @return {VectorLayer} Overlay layer.
   * @api
   */
  Modify.prototype.getOverlay = function getOverlay() {
    return this.overlay_;
  };

  /**
   * @param {import("../source/Vector.js").VectorSourceEvent} event Event.
   * @private
   */
  Modify.prototype.handleSourceAdd_ = function handleSourceAdd_(event) {
    if (event.feature) {
      this.features_.push(event.feature);
    }
  };

  /**
   * @param {import("../source/Vector.js").VectorSourceEvent} event Event.
   * @private
   */
  Modify.prototype.handleSourceRemove_ = function handleSourceRemove_(event) {
    if (event.feature) {
      this.features_.remove(event.feature);
    }
  };

  /**
   * @param {import("../Collection.js").CollectionEvent} evt Event.
   * @private
   */
  Modify.prototype.handleFeatureAdd_ = function handleFeatureAdd_(evt) {
    this.addFeature_( /** @type {Feature} */evt.element);
  };

  /**
   * @param {import("../events/Event.js").default} evt Event.
   * @private
   */
  Modify.prototype.handleFeatureChange_ = function handleFeatureChange_(evt) {
    if (!this.changingFeature_) {
      var feature = /** @type {Feature} */evt.target;
      this.removeFeature_(feature);
      this.addFeature_(feature);
    }
  };

  /**
   * @param {import("../Collection.js").CollectionEvent} evt Event.
   * @private
   */
  Modify.prototype.handleFeatureRemove_ = function handleFeatureRemove_(evt) {
    var feature = /** @type {Feature} */evt.element;
    this.removeFeature_(feature);
  };

  /**
   * @param {Feature} feature Feature
   * @param {Point} geometry Geometry.
   * @private
   */
  Modify.prototype.writePointGeometry_ = function writePointGeometry_(feature, geometry) {
    var coordinates = geometry.getCoordinates();
    var segmentData = /** @type {SegmentData} */{
      feature: feature,
      geometry: geometry,
      segment: [coordinates, coordinates]
    };
    this.rBush_.insert(geometry.getExtent(), segmentData);
  };

  /**
   * @param {Feature} feature Feature
   * @param {import("../geom/MultiPoint.js").default} geometry Geometry.
   * @private
   */
  Modify.prototype.writeMultiPointGeometry_ = function writeMultiPointGeometry_(feature, geometry) {
    var points = geometry.getCoordinates();
    for (var i = 0, ii = points.length; i < ii; ++i) {
      var coordinates = points[i];
      var segmentData = /** @type {SegmentData} */{
        feature: feature,
        geometry: geometry,
        depth: [i],
        index: i,
        segment: [coordinates, coordinates]
      };
      this.rBush_.insert(geometry.getExtent(), segmentData);
    }
  };

  /**
   * @param {Feature} feature Feature
   * @param {import("../geom/LineString.js").default} geometry Geometry.
   * @private
   */
  Modify.prototype.writeLineStringGeometry_ = function writeLineStringGeometry_(feature, geometry) {
    var coordinates = geometry.getCoordinates();
    for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
      var segment = coordinates.slice(i, i + 2);
      var segmentData = /** @type {SegmentData} */{
        feature: feature,
        geometry: geometry,
        index: i,
        segment: segment
      };
      this.rBush_.insert((0, _extent.boundingExtent)(segment), segmentData);
    }
  };

  /**
   * @param {Feature} feature Feature
   * @param {import("../geom/MultiLineString.js").default} geometry Geometry.
   * @private
   */
  Modify.prototype.writeMultiLineStringGeometry_ = function writeMultiLineStringGeometry_(feature, geometry) {
    var lines = geometry.getCoordinates();
    for (var j = 0, jj = lines.length; j < jj; ++j) {
      var coordinates = lines[j];
      for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        var segment = coordinates.slice(i, i + 2);
        var segmentData = /** @type {SegmentData} */{
          feature: feature,
          geometry: geometry,
          depth: [j],
          index: i,
          segment: segment
        };
        this.rBush_.insert((0, _extent.boundingExtent)(segment), segmentData);
      }
    }
  };

  /**
   * @param {Feature} feature Feature
   * @param {import("../geom/Polygon.js").default} geometry Geometry.
   * @private
   */
  Modify.prototype.writePolygonGeometry_ = function writePolygonGeometry_(feature, geometry) {
    var rings = geometry.getCoordinates();
    for (var j = 0, jj = rings.length; j < jj; ++j) {
      var coordinates = rings[j];
      for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
        var segment = coordinates.slice(i, i + 2);
        var segmentData = /** @type {SegmentData} */{
          feature: feature,
          geometry: geometry,
          depth: [j],
          index: i,
          segment: segment
        };
        this.rBush_.insert((0, _extent.boundingExtent)(segment), segmentData);
      }
    }
  };

  /**
   * @param {Feature} feature Feature
   * @param {import("../geom/MultiPolygon.js").default} geometry Geometry.
   * @private
   */
  Modify.prototype.writeMultiPolygonGeometry_ = function writeMultiPolygonGeometry_(feature, geometry) {
    var polygons = geometry.getCoordinates();
    for (var k = 0, kk = polygons.length; k < kk; ++k) {
      var rings = polygons[k];
      for (var j = 0, jj = rings.length; j < jj; ++j) {
        var coordinates = rings[j];
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
          var segment = coordinates.slice(i, i + 2);
          var segmentData = /** @type {SegmentData} */{
            feature: feature,
            geometry: geometry,
            depth: [j, k],
            index: i,
            segment: segment
          };
          this.rBush_.insert((0, _extent.boundingExtent)(segment), segmentData);
        }
      }
    }
  };

  /**
   * We convert a circle into two segments.  The segment at index
   * {@link CIRCLE_CENTER_INDEX} is the
   * circle's center (a point).  The segment at index
   * {@link CIRCLE_CIRCUMFERENCE_INDEX} is
   * the circumference, and is not a line segment.
   *
   * @param {Feature} feature Feature.
   * @param {import("../geom/Circle.js").default} geometry Geometry.
   * @private
   */
  Modify.prototype.writeCircleGeometry_ = function writeCircleGeometry_(feature, geometry) {
    var coordinates = geometry.getCenter();
    var centerSegmentData = /** @type {SegmentData} */{
      feature: feature,
      geometry: geometry,
      index: CIRCLE_CENTER_INDEX,
      segment: [coordinates, coordinates]
    };
    var circumferenceSegmentData = /** @type {SegmentData} */{
      feature: feature,
      geometry: geometry,
      index: CIRCLE_CIRCUMFERENCE_INDEX,
      segment: [coordinates, coordinates]
    };
    var featureSegments = [centerSegmentData, circumferenceSegmentData];
    centerSegmentData.featureSegments = circumferenceSegmentData.featureSegments = featureSegments;
    this.rBush_.insert((0, _extent.createOrUpdateFromCoordinate)(coordinates), centerSegmentData);
    this.rBush_.insert(geometry.getExtent(), circumferenceSegmentData);
  };

  /**
   * @param {Feature} feature Feature
   * @param {import("../geom/GeometryCollection.js").default} geometry Geometry.
   * @private
   */
  Modify.prototype.writeGeometryCollectionGeometry_ = function writeGeometryCollectionGeometry_(feature, geometry) {
    var geometries = geometry.getGeometriesArray();
    for (var i = 0; i < geometries.length; ++i) {
      this.SEGMENT_WRITERS_[geometries[i].getType()].call(this, feature, geometries[i]);
    }
  };

  /**
   * @param {import("../coordinate.js").Coordinate} coordinates Coordinates.
   * @return {Feature} Vertex feature.
   * @private
   */
  Modify.prototype.createOrUpdateVertexFeature_ = function createOrUpdateVertexFeature_(coordinates) {
    var vertexFeature = this.vertexFeature_;
    if (!vertexFeature) {
      vertexFeature = new _Feature2.default(new _Point2.default(coordinates));
      this.vertexFeature_ = vertexFeature;
      /** @type {VectorSource} */this.overlay_.getSource().addFeature(vertexFeature);
    } else {
      var geometry = /** @type {Point} */vertexFeature.getGeometry();
      geometry.setCoordinates(coordinates);
    }
    return vertexFeature;
  };

  /**
   * Handles the {@link module:ol/MapBrowserEvent map browser event} and may modify the geometry.
   * @override
   */
  Modify.prototype.handleEvent = function handleEvent(mapBrowserEvent) {
    if (! /** @type {import("../MapBrowserPointerEvent.js").default} */mapBrowserEvent.pointerEvent) {
      return true;
    }
    this.lastPointerEvent_ = mapBrowserEvent;

    var handled;
    if (!mapBrowserEvent.map.getView().getInteracting() && mapBrowserEvent.type == _MapBrowserEventType2.default.POINTERMOVE && !this.handlingDownUpSequence) {
      this.handlePointerMove_(mapBrowserEvent);
    }
    if (this.vertexFeature_ && this.deleteCondition_(mapBrowserEvent)) {
      if (mapBrowserEvent.type != _MapBrowserEventType2.default.SINGLECLICK || !this.ignoreNextSingleClick_) {
        handled = this.removePoint();
      } else {
        handled = true;
      }
    }

    if (mapBrowserEvent.type == _MapBrowserEventType2.default.SINGLECLICK) {
      this.ignoreNextSingleClick_ = false;
    }

    return PointerInteraction.prototype.handleEvent.call(this, mapBrowserEvent) && !handled;
  };

  /**
   * @inheritDoc
   */
  Modify.prototype.handleDragEvent = function handleDragEvent(evt) {
    this.ignoreNextSingleClick_ = false;
    this.willModifyFeatures_(evt);

    var vertex = evt.coordinate;
    for (var i = 0, ii = this.dragSegments_.length; i < ii; ++i) {
      var dragSegment = this.dragSegments_[i];
      var segmentData = dragSegment[0];
      var depth = segmentData.depth;
      var geometry = segmentData.geometry;
      var coordinates = void 0;
      var segment = segmentData.segment;
      var index = dragSegment[1];

      while (vertex.length < geometry.getStride()) {
        vertex.push(segment[index][vertex.length]);
      }

      switch (geometry.getType()) {
        case _GeometryType2.default.POINT:
          coordinates = vertex;
          segment[0] = segment[1] = vertex;
          break;
        case _GeometryType2.default.MULTI_POINT:
          coordinates = geometry.getCoordinates();
          coordinates[segmentData.index] = vertex;
          segment[0] = segment[1] = vertex;
          break;
        case _GeometryType2.default.LINE_STRING:
          coordinates = geometry.getCoordinates();
          coordinates[segmentData.index + index] = vertex;
          segment[index] = vertex;
          break;
        case _GeometryType2.default.MULTI_LINE_STRING:
          coordinates = geometry.getCoordinates();
          coordinates[depth[0]][segmentData.index + index] = vertex;
          segment[index] = vertex;
          break;
        case _GeometryType2.default.POLYGON:
          coordinates = geometry.getCoordinates();
          coordinates[depth[0]][segmentData.index + index] = vertex;
          segment[index] = vertex;
          break;
        case _GeometryType2.default.MULTI_POLYGON:
          coordinates = geometry.getCoordinates();
          coordinates[depth[1]][depth[0]][segmentData.index + index] = vertex;
          segment[index] = vertex;
          break;
        case _GeometryType2.default.CIRCLE:
          segment[0] = segment[1] = vertex;
          if (segmentData.index === CIRCLE_CENTER_INDEX) {
            this.changingFeature_ = true;
            geometry.setCenter(vertex);
            this.changingFeature_ = false;
          } else {
            // We're dragging the circle's circumference:
            this.changingFeature_ = true;
            geometry.setRadius((0, _coordinate.distance)(geometry.getCenter(), vertex));
            this.changingFeature_ = false;
          }
          break;
        default:
        // pass
      }

      if (coordinates) {
        this.setGeometryCoordinates_(geometry, coordinates);
      }
    }
    this.createOrUpdateVertexFeature_(vertex);
  };

  /**
   * @inheritDoc
   */
  Modify.prototype.handleDownEvent = function handleDownEvent(evt) {
    if (!this.condition_(evt)) {
      return false;
    }
    this.handlePointerAtPixel_(evt.pixel, evt.map);
    var pixelCoordinate = evt.map.getCoordinateFromPixel(evt.pixel);
    this.dragSegments_.length = 0;
    this.modified_ = false;
    var vertexFeature = this.vertexFeature_;
    if (vertexFeature) {
      var insertVertices = [];
      var geometry = /** @type {Point} */vertexFeature.getGeometry();
      var vertex = geometry.getCoordinates();
      var vertexExtent = (0, _extent.boundingExtent)([vertex]);
      var segmentDataMatches = this.rBush_.getInExtent(vertexExtent);
      var componentSegments = {};
      segmentDataMatches.sort(compareIndexes);
      for (var i = 0, ii = segmentDataMatches.length; i < ii; ++i) {
        var segmentDataMatch = segmentDataMatches[i];
        var segment = segmentDataMatch.segment;
        var uid = (0, _util.getUid)(segmentDataMatch.feature);
        var depth = segmentDataMatch.depth;
        if (depth) {
          uid += '-' + depth.join('-'); // separate feature components
        }
        if (!componentSegments[uid]) {
          componentSegments[uid] = new Array(2);
        }
        if (segmentDataMatch.geometry.getType() === _GeometryType2.default.CIRCLE && segmentDataMatch.index === CIRCLE_CIRCUMFERENCE_INDEX) {

          var closestVertex = closestOnSegmentData(pixelCoordinate, segmentDataMatch);
          if ((0, _coordinate.equals)(closestVertex, vertex) && !componentSegments[uid][0]) {
            this.dragSegments_.push([segmentDataMatch, 0]);
            componentSegments[uid][0] = segmentDataMatch;
          }
        } else if ((0, _coordinate.equals)(segment[0], vertex) && !componentSegments[uid][0]) {
          this.dragSegments_.push([segmentDataMatch, 0]);
          componentSegments[uid][0] = segmentDataMatch;
        } else if ((0, _coordinate.equals)(segment[1], vertex) && !componentSegments[uid][1]) {

          // prevent dragging closed linestrings by the connecting node
          if ((segmentDataMatch.geometry.getType() === _GeometryType2.default.LINE_STRING || segmentDataMatch.geometry.getType() === _GeometryType2.default.MULTI_LINE_STRING) && componentSegments[uid][0] && componentSegments[uid][0].index === 0) {
            continue;
          }

          this.dragSegments_.push([segmentDataMatch, 1]);
          componentSegments[uid][1] = segmentDataMatch;
        } else if (this.insertVertexCondition_(evt) && (0, _util.getUid)(segment) in this.vertexSegments_ && !componentSegments[uid][0] && !componentSegments[uid][1]) {
          insertVertices.push([segmentDataMatch, vertex]);
        }
      }
      if (insertVertices.length) {
        this.willModifyFeatures_(evt);
      }
      for (var j = insertVertices.length - 1; j >= 0; --j) {
        this.insertVertex_.apply(this, insertVertices[j]);
      }
    }
    return !!this.vertexFeature_;
  };

  /**
   * @inheritDoc
   */
  Modify.prototype.handleUpEvent = function handleUpEvent(evt) {
    for (var i = this.dragSegments_.length - 1; i >= 0; --i) {
      var segmentData = this.dragSegments_[i][0];
      var geometry = segmentData.geometry;
      if (geometry.getType() === _GeometryType2.default.CIRCLE) {
        // Update a circle object in the R* bush:
        var coordinates = geometry.getCenter();
        var centerSegmentData = segmentData.featureSegments[0];
        var circumferenceSegmentData = segmentData.featureSegments[1];
        centerSegmentData.segment[0] = centerSegmentData.segment[1] = coordinates;
        circumferenceSegmentData.segment[0] = circumferenceSegmentData.segment[1] = coordinates;
        this.rBush_.update((0, _extent.createOrUpdateFromCoordinate)(coordinates), centerSegmentData);
        this.rBush_.update(geometry.getExtent(), circumferenceSegmentData);
      } else {
        this.rBush_.update((0, _extent.boundingExtent)(segmentData.segment), segmentData);
      }
    }
    if (this.modified_) {
      this.dispatchEvent(new ModifyEvent(ModifyEventType.MODIFYEND, this.features_, evt));
      this.modified_ = false;
    }
    return false;
  };

  /**
   * @param {import("../MapBrowserEvent.js").default} evt Event.
   * @private
   */
  Modify.prototype.handlePointerMove_ = function handlePointerMove_(evt) {
    this.lastPixel_ = evt.pixel;
    this.handlePointerAtPixel_(evt.pixel, evt.map);
  };

  /**
   * @param {import("../pixel.js").Pixel} pixel Pixel
   * @param {import("../PluggableMap.js").default} map Map.
   * @private
   */
  Modify.prototype.handlePointerAtPixel_ = function handlePointerAtPixel_(pixel, map) {
    var pixelCoordinate = map.getCoordinateFromPixel(pixel);
    var sortByDistance = function sortByDistance(a, b) {
      return pointDistanceToSegmentDataSquared(pixelCoordinate, a) - pointDistanceToSegmentDataSquared(pixelCoordinate, b);
    };

    var box = (0, _extent.buffer)((0, _extent.createOrUpdateFromCoordinate)(pixelCoordinate), map.getView().getResolution() * this.pixelTolerance_);

    var rBush = this.rBush_;
    var nodes = rBush.getInExtent(box);
    if (nodes.length > 0) {
      nodes.sort(sortByDistance);
      var node = nodes[0];
      var closestSegment = node.segment;
      var vertex = closestOnSegmentData(pixelCoordinate, node);
      var vertexPixel = map.getPixelFromCoordinate(vertex);
      var dist = (0, _coordinate.distance)(pixel, vertexPixel);
      if (dist <= this.pixelTolerance_) {
        /** @type {Object<string, boolean>} */
        var vertexSegments = {};

        if (node.geometry.getType() === _GeometryType2.default.CIRCLE && node.index === CIRCLE_CIRCUMFERENCE_INDEX) {

          this.snappedToVertex_ = true;
          this.createOrUpdateVertexFeature_(vertex);
        } else {
          var pixel1 = map.getPixelFromCoordinate(closestSegment[0]);
          var pixel2 = map.getPixelFromCoordinate(closestSegment[1]);
          var squaredDist1 = (0, _coordinate.squaredDistance)(vertexPixel, pixel1);
          var squaredDist2 = (0, _coordinate.squaredDistance)(vertexPixel, pixel2);
          dist = Math.sqrt(Math.min(squaredDist1, squaredDist2));
          this.snappedToVertex_ = dist <= this.pixelTolerance_;
          if (this.snappedToVertex_) {
            vertex = squaredDist1 > squaredDist2 ? closestSegment[1] : closestSegment[0];
          }
          this.createOrUpdateVertexFeature_(vertex);
          for (var i = 1, ii = nodes.length; i < ii; ++i) {
            var segment = nodes[i].segment;
            if ((0, _coordinate.equals)(closestSegment[0], segment[0]) && (0, _coordinate.equals)(closestSegment[1], segment[1]) || (0, _coordinate.equals)(closestSegment[0], segment[1]) && (0, _coordinate.equals)(closestSegment[1], segment[0])) {
              vertexSegments[(0, _util.getUid)(segment)] = true;
            } else {
              break;
            }
          }
        }

        vertexSegments[(0, _util.getUid)(closestSegment)] = true;
        this.vertexSegments_ = vertexSegments;
        return;
      }
    }
    if (this.vertexFeature_) {
      /** @type {VectorSource} */this.overlay_.getSource().removeFeature(this.vertexFeature_);
      this.vertexFeature_ = null;
    }
  };

  /**
   * @param {SegmentData} segmentData Segment data.
   * @param {import("../coordinate.js").Coordinate} vertex Vertex.
   * @private
   */
  Modify.prototype.insertVertex_ = function insertVertex_(segmentData, vertex) {
    var segment = segmentData.segment;
    var feature = segmentData.feature;
    var geometry = segmentData.geometry;
    var depth = segmentData.depth;
    var index = /** @type {number} */segmentData.index;
    var coordinates;

    while (vertex.length < geometry.getStride()) {
      vertex.push(0);
    }

    switch (geometry.getType()) {
      case _GeometryType2.default.MULTI_LINE_STRING:
        coordinates = geometry.getCoordinates();
        coordinates[depth[0]].splice(index + 1, 0, vertex);
        break;
      case _GeometryType2.default.POLYGON:
        coordinates = geometry.getCoordinates();
        coordinates[depth[0]].splice(index + 1, 0, vertex);
        break;
      case _GeometryType2.default.MULTI_POLYGON:
        coordinates = geometry.getCoordinates();
        coordinates[depth[1]][depth[0]].splice(index + 1, 0, vertex);
        break;
      case _GeometryType2.default.LINE_STRING:
        coordinates = geometry.getCoordinates();
        coordinates.splice(index + 1, 0, vertex);
        break;
      default:
        return;
    }

    this.setGeometryCoordinates_(geometry, coordinates);
    var rTree = this.rBush_;
    rTree.remove(segmentData);
    this.updateSegmentIndices_(geometry, index, depth, 1);
    var newSegmentData = /** @type {SegmentData} */{
      segment: [segment[0], vertex],
      feature: feature,
      geometry: geometry,
      depth: depth,
      index: index
    };
    rTree.insert((0, _extent.boundingExtent)(newSegmentData.segment), newSegmentData);
    this.dragSegments_.push([newSegmentData, 1]);

    var newSegmentData2 = /** @type {SegmentData} */{
      segment: [vertex, segment[1]],
      feature: feature,
      geometry: geometry,
      depth: depth,
      index: index + 1
    };
    rTree.insert((0, _extent.boundingExtent)(newSegmentData2.segment), newSegmentData2);
    this.dragSegments_.push([newSegmentData2, 0]);
    this.ignoreNextSingleClick_ = true;
  };

  /**
   * Removes the vertex currently being pointed.
   * @return {boolean} True when a vertex was removed.
   * @api
   */
  Modify.prototype.removePoint = function removePoint() {
    if (this.lastPointerEvent_ && this.lastPointerEvent_.type != _MapBrowserEventType2.default.POINTERDRAG) {
      var evt = this.lastPointerEvent_;
      this.willModifyFeatures_(evt);
      this.removeVertex_();
      this.dispatchEvent(new ModifyEvent(ModifyEventType.MODIFYEND, this.features_, evt));
      this.modified_ = false;
      return true;
    }
    return false;
  };

  /**
   * Removes a vertex from all matching features.
   * @return {boolean} True when a vertex was removed.
   * @private
   */
  Modify.prototype.removeVertex_ = function removeVertex_() {
    var dragSegments = this.dragSegments_;
    var segmentsByFeature = {};
    var deleted = false;
    var component, coordinates, dragSegment, geometry, i, index, left;
    var newIndex, right, segmentData, uid;
    for (i = dragSegments.length - 1; i >= 0; --i) {
      dragSegment = dragSegments[i];
      segmentData = dragSegment[0];
      uid = (0, _util.getUid)(segmentData.feature);
      if (segmentData.depth) {
        // separate feature components
        uid += '-' + segmentData.depth.join('-');
      }
      if (!(uid in segmentsByFeature)) {
        segmentsByFeature[uid] = {};
      }
      if (dragSegment[1] === 0) {
        segmentsByFeature[uid].right = segmentData;
        segmentsByFeature[uid].index = segmentData.index;
      } else if (dragSegment[1] == 1) {
        segmentsByFeature[uid].left = segmentData;
        segmentsByFeature[uid].index = segmentData.index + 1;
      }
    }
    for (uid in segmentsByFeature) {
      right = segmentsByFeature[uid].right;
      left = segmentsByFeature[uid].left;
      index = segmentsByFeature[uid].index;
      newIndex = index - 1;
      if (left !== undefined) {
        segmentData = left;
      } else {
        segmentData = right;
      }
      if (newIndex < 0) {
        newIndex = 0;
      }
      geometry = segmentData.geometry;
      coordinates = geometry.getCoordinates();
      component = coordinates;
      deleted = false;
      switch (geometry.getType()) {
        case _GeometryType2.default.MULTI_LINE_STRING:
          if (coordinates[segmentData.depth[0]].length > 2) {
            coordinates[segmentData.depth[0]].splice(index, 1);
            deleted = true;
          }
          break;
        case _GeometryType2.default.LINE_STRING:
          if (coordinates.length > 2) {
            coordinates.splice(index, 1);
            deleted = true;
          }
          break;
        case _GeometryType2.default.MULTI_POLYGON:
          component = component[segmentData.depth[1]];
        /* falls through */
        case _GeometryType2.default.POLYGON:
          component = component[segmentData.depth[0]];
          if (component.length > 4) {
            if (index == component.length - 1) {
              index = 0;
            }
            component.splice(index, 1);
            deleted = true;
            if (index === 0) {
              // close the ring again
              component.pop();
              component.push(component[0]);
              newIndex = component.length - 1;
            }
          }
          break;
        default:
        // pass
      }

      if (deleted) {
        this.setGeometryCoordinates_(geometry, coordinates);
        var segments = [];
        if (left !== undefined) {
          this.rBush_.remove(left);
          segments.push(left.segment[0]);
        }
        if (right !== undefined) {
          this.rBush_.remove(right);
          segments.push(right.segment[1]);
        }
        if (left !== undefined && right !== undefined) {
          var newSegmentData = /** @type {SegmentData} */{
            depth: segmentData.depth,
            feature: segmentData.feature,
            geometry: segmentData.geometry,
            index: newIndex,
            segment: segments
          };
          this.rBush_.insert((0, _extent.boundingExtent)(newSegmentData.segment), newSegmentData);
        }
        this.updateSegmentIndices_(geometry, index, segmentData.depth, -1);
        if (this.vertexFeature_) {
          /** @type {VectorSource} */this.overlay_.getSource().removeFeature(this.vertexFeature_);
          this.vertexFeature_ = null;
        }
        dragSegments.length = 0;
      }
    }
    return deleted;
  };

  /**
   * @param {import("../geom/SimpleGeometry.js").default} geometry Geometry.
   * @param {Array} coordinates Coordinates.
   * @private
   */
  Modify.prototype.setGeometryCoordinates_ = function setGeometryCoordinates_(geometry, coordinates) {
    this.changingFeature_ = true;
    geometry.setCoordinates(coordinates);
    this.changingFeature_ = false;
  };

  /**
   * @param {import("../geom/SimpleGeometry.js").default} geometry Geometry.
   * @param {number} index Index.
   * @param {Array<number>|undefined} depth Depth.
   * @param {number} delta Delta (1 or -1).
   * @private
   */
  Modify.prototype.updateSegmentIndices_ = function updateSegmentIndices_(geometry, index, depth, delta) {
    this.rBush_.forEachInExtent(geometry.getExtent(), function (segmentDataMatch) {
      if (segmentDataMatch.geometry === geometry && (depth === undefined || segmentDataMatch.depth === undefined || (0, _array.equals)(segmentDataMatch.depth, depth)) && segmentDataMatch.index > index) {
        segmentDataMatch.index += delta;
      }
    });
  };

  return Modify;
}(_Pointer2.default);

/**
 * @param {SegmentData} a The first segment data.
 * @param {SegmentData} b The second segment data.
 * @return {number} The difference in indexes.
 */
function compareIndexes(a, b) {
  return a.index - b.index;
}

/**
 * Returns the distance from a point to a line segment.
 *
 * @param {import("../coordinate.js").Coordinate} pointCoordinates The coordinates of the point from
 *        which to calculate the distance.
 * @param {SegmentData} segmentData The object describing the line
 *        segment we are calculating the distance to.
 * @return {number} The square of the distance between a point and a line segment.
 */
function pointDistanceToSegmentDataSquared(pointCoordinates, segmentData) {
  var geometry = segmentData.geometry;

  if (geometry.getType() === _GeometryType2.default.CIRCLE) {
    var circleGeometry = /** @type {import("../geom/Circle.js").default} */geometry;

    if (segmentData.index === CIRCLE_CIRCUMFERENCE_INDEX) {
      var distanceToCenterSquared = (0, _coordinate.squaredDistance)(circleGeometry.getCenter(), pointCoordinates);
      var distanceToCircumference = Math.sqrt(distanceToCenterSquared) - circleGeometry.getRadius();
      return distanceToCircumference * distanceToCircumference;
    }
  }
  return (0, _coordinate.squaredDistanceToSegment)(pointCoordinates, segmentData.segment);
}

/**
 * Returns the point closest to a given line segment.
 *
 * @param {import("../coordinate.js").Coordinate} pointCoordinates The point to which a closest point
 *        should be found.
 * @param {SegmentData} segmentData The object describing the line
 *        segment which should contain the closest point.
 * @return {import("../coordinate.js").Coordinate} The point closest to the specified line segment.
 */
function closestOnSegmentData(pointCoordinates, segmentData) {
  var geometry = segmentData.geometry;

  if (geometry.getType() === _GeometryType2.default.CIRCLE && segmentData.index === CIRCLE_CIRCUMFERENCE_INDEX) {
    return geometry.getClosestPoint(pointCoordinates);
  }
  return (0, _coordinate.closestOnSegment)(pointCoordinates, segmentData.segment);
}

/**
 * @return {import("../style/Style.js").StyleFunction} Styles.
 */
function getDefaultStyleFunction() {
  var style = (0, _Style.createEditingStyle)();
  return function (feature, resolution) {
    return style[_GeometryType2.default.POINT];
  };
}

exports.default = Modify;

//# sourceMappingURL=Modify.js.map