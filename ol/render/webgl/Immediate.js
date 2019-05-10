'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extent = require('../../extent.js');

var _GeometryType = require('../../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _ReplayType = require('../ReplayType.js');

var _ReplayType2 = _interopRequireDefault(_ReplayType);

var _VectorContext = require('../VectorContext.js');

var _VectorContext2 = _interopRequireDefault(_VectorContext);

var _ReplayGroup = require('./ReplayGroup.js');

var _ReplayGroup2 = _interopRequireDefault(_ReplayGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WebGLImmediateRenderer = /*@__PURE__*/function (VectorContext) {
  function WebGLImmediateRenderer(context, center, resolution, rotation, size, extent, pixelRatio) {
    VectorContext.call(this);

    /**
     * @private
     */
    this.context_ = context;

    /**
     * @private
     */
    this.center_ = center;

    /**
     * @private
     */
    this.extent_ = extent;

    /**
     * @private
     */
    this.pixelRatio_ = pixelRatio;

    /**
     * @private
     */
    this.size_ = size;

    /**
     * @private
     */
    this.rotation_ = rotation;

    /**
     * @private
     */
    this.resolution_ = resolution;

    /**
     * @private
     * @type {import("../../style/Image.js").default}
     */
    this.imageStyle_ = null;

    /**
     * @private
     * @type {import("../../style/Fill.js").default}
     */
    this.fillStyle_ = null;

    /**
     * @private
     * @type {import("../../style/Stroke.js").default}
     */
    this.strokeStyle_ = null;

    /**
     * @private
     * @type {import("../../style/Text.js").default}
     */
    this.textStyle_ = null;
  }

  if (VectorContext) WebGLImmediateRenderer.__proto__ = VectorContext;
  WebGLImmediateRenderer.prototype = Object.create(VectorContext && VectorContext.prototype);
  WebGLImmediateRenderer.prototype.constructor = WebGLImmediateRenderer;

  /**
   * @param {import("./ReplayGroup.js").default} replayGroup Replay group.
   * @param {import("../../geom/Geometry.js").default|import("../Feature.js").default} geometry Geometry.
   * @private
   */
  WebGLImmediateRenderer.prototype.drawText_ = function drawText_(replayGroup, geometry) {
    var context = this.context_;
    var replay = /** @type {import("./TextReplay.js").default} */replayGroup.getReplay(0, _ReplayType2.default.TEXT);
    replay.setTextStyle(this.textStyle_);
    replay.drawText(geometry, null);
    replay.finish(context);
    // default colors
    var opacity = 1;
    /** @type {Object<string, boolean>} */
    var skippedFeatures = {};
    var featureCallback;
    var oneByOne = false;
    replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
    replay.getDeleteResourcesFunction(context)();
  };

  /**
   * Set the rendering style.  Note that since this is an immediate rendering API,
   * any `zIndex` on the provided style will be ignored.
   *
   * @param {import("../../style/Style.js").default} style The rendering style.
   * @override
   * @api
   */
  WebGLImmediateRenderer.prototype.setStyle = function setStyle(style) {
    this.setFillStrokeStyle(style.getFill(), style.getStroke());
    this.setImageStyle(style.getImage());
    this.setTextStyle(style.getText());
  };

  /**
   * Render a geometry into the canvas.  Call
   * {@link ol/render/webgl/Immediate#setStyle} first to set the rendering style.
   *
   * @param {import("../../geom/Geometry.js").default|import("../Feature.js").default} geometry The geometry to render.
   * @override
   * @api
   */
  WebGLImmediateRenderer.prototype.drawGeometry = function drawGeometry(geometry) {
    var type = geometry.getType();
    switch (type) {
      case _GeometryType2.default.POINT:
        this.drawPoint( /** @type {import("../../geom/Point.js").default} */geometry, null);
        break;
      case _GeometryType2.default.LINE_STRING:
        this.drawLineString( /** @type {import("../../geom/LineString.js").default} */geometry, null);
        break;
      case _GeometryType2.default.POLYGON:
        this.drawPolygon( /** @type {import("../../geom/Polygon.js").default} */geometry, null);
        break;
      case _GeometryType2.default.MULTI_POINT:
        this.drawMultiPoint( /** @type {import("../../geom/MultiPoint.js").default} */geometry, null);
        break;
      case _GeometryType2.default.MULTI_LINE_STRING:
        this.drawMultiLineString( /** @type {import("../../geom/MultiLineString.js").default} */geometry, null);
        break;
      case _GeometryType2.default.MULTI_POLYGON:
        this.drawMultiPolygon( /** @type {import("../../geom/MultiPolygon.js").default} */geometry, null);
        break;
      case _GeometryType2.default.GEOMETRY_COLLECTION:
        this.drawGeometryCollection( /** @type {import("../../geom/GeometryCollection.js").default} */geometry, null);
        break;
      case _GeometryType2.default.CIRCLE:
        this.drawCircle( /** @type {import("../../geom/Circle.js").default} */geometry, null);
        break;
      default:
      // pass
    }
  };

  /**
   * @inheritDoc
   * @api
   */
  WebGLImmediateRenderer.prototype.drawFeature = function drawFeature(feature, style) {
    var geometry = style.getGeometryFunction()(feature);
    if (!geometry || !(0, _extent.intersects)(this.extent_, geometry.getExtent())) {
      return;
    }
    this.setStyle(style);
    this.drawGeometry(geometry);
  };

  /**
   * @inheritDoc
   */
  WebGLImmediateRenderer.prototype.drawGeometryCollection = function drawGeometryCollection(geometry, data) {
    var geometries = geometry.getGeometriesArray();
    var i, ii;
    for (i = 0, ii = geometries.length; i < ii; ++i) {
      this.drawGeometry(geometries[i]);
    }
  };

  /**
   * @inheritDoc
   */
  WebGLImmediateRenderer.prototype.drawPoint = function drawPoint(geometry, data) {
    var context = this.context_;
    var replayGroup = new _ReplayGroup2.default(1, this.extent_);
    var replay = /** @type {import("./ImageReplay.js").default} */replayGroup.getReplay(0, _ReplayType2.default.IMAGE);
    replay.setImageStyle(this.imageStyle_);
    replay.drawPoint(geometry, data);
    replay.finish(context);
    // default colors
    var opacity = 1;
    /** @type {Object<string, boolean>} */
    var skippedFeatures = {};
    var featureCallback;
    var oneByOne = false;
    replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
    replay.getDeleteResourcesFunction(context)();

    if (this.textStyle_) {
      this.drawText_(replayGroup, geometry);
    }
  };

  /**
   * @inheritDoc
   */
  WebGLImmediateRenderer.prototype.drawMultiPoint = function drawMultiPoint(geometry, data) {
    var context = this.context_;
    var replayGroup = new _ReplayGroup2.default(1, this.extent_);
    var replay = /** @type {import("./ImageReplay.js").default} */replayGroup.getReplay(0, _ReplayType2.default.IMAGE);
    replay.setImageStyle(this.imageStyle_);
    replay.drawMultiPoint(geometry, data);
    replay.finish(context);
    var opacity = 1;
    /** @type {Object<string, boolean>} */
    var skippedFeatures = {};
    var featureCallback;
    var oneByOne = false;
    replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
    replay.getDeleteResourcesFunction(context)();

    if (this.textStyle_) {
      this.drawText_(replayGroup, geometry);
    }
  };

  /**
   * @inheritDoc
   */
  WebGLImmediateRenderer.prototype.drawLineString = function drawLineString(geometry, data) {
    var context = this.context_;
    var replayGroup = new _ReplayGroup2.default(1, this.extent_);
    var replay = /** @type {import("./LineStringReplay.js").default} */replayGroup.getReplay(0, _ReplayType2.default.LINE_STRING);
    replay.setFillStrokeStyle(null, this.strokeStyle_);
    replay.drawLineString(geometry, data);
    replay.finish(context);
    var opacity = 1;
    /** @type {Object<string, boolean>} */
    var skippedFeatures = {};
    var featureCallback;
    var oneByOne = false;
    replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
    replay.getDeleteResourcesFunction(context)();

    if (this.textStyle_) {
      this.drawText_(replayGroup, geometry);
    }
  };

  /**
   * @inheritDoc
   */
  WebGLImmediateRenderer.prototype.drawMultiLineString = function drawMultiLineString(geometry, data) {
    var context = this.context_;
    var replayGroup = new _ReplayGroup2.default(1, this.extent_);
    var replay = /** @type {import("./LineStringReplay.js").default} */replayGroup.getReplay(0, _ReplayType2.default.LINE_STRING);
    replay.setFillStrokeStyle(null, this.strokeStyle_);
    replay.drawMultiLineString(geometry, data);
    replay.finish(context);
    var opacity = 1;
    /** @type {Object<string, boolean>} */
    var skippedFeatures = {};
    var featureCallback;
    var oneByOne = false;
    replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
    replay.getDeleteResourcesFunction(context)();

    if (this.textStyle_) {
      this.drawText_(replayGroup, geometry);
    }
  };

  /**
   * @inheritDoc
   */
  WebGLImmediateRenderer.prototype.drawPolygon = function drawPolygon(geometry, data) {
    var context = this.context_;
    var replayGroup = new _ReplayGroup2.default(1, this.extent_);
    var replay = /** @type {import("./PolygonReplay.js").default} */replayGroup.getReplay(0, _ReplayType2.default.POLYGON);
    replay.setFillStrokeStyle(this.fillStyle_, this.strokeStyle_);
    replay.drawPolygon(geometry, data);
    replay.finish(context);
    var opacity = 1;
    /** @type {Object<string, boolean>} */
    var skippedFeatures = {};
    var featureCallback;
    var oneByOne = false;
    replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
    replay.getDeleteResourcesFunction(context)();

    if (this.textStyle_) {
      this.drawText_(replayGroup, geometry);
    }
  };

  /**
   * @inheritDoc
   */
  WebGLImmediateRenderer.prototype.drawMultiPolygon = function drawMultiPolygon(geometry, data) {
    var context = this.context_;
    var replayGroup = new _ReplayGroup2.default(1, this.extent_);
    var replay = /** @type {import("./PolygonReplay.js").default} */replayGroup.getReplay(0, _ReplayType2.default.POLYGON);
    replay.setFillStrokeStyle(this.fillStyle_, this.strokeStyle_);
    replay.drawMultiPolygon(geometry, data);
    replay.finish(context);
    var opacity = 1;
    /** @type {Object<string, boolean>} */
    var skippedFeatures = {};
    var featureCallback;
    var oneByOne = false;
    replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
    replay.getDeleteResourcesFunction(context)();

    if (this.textStyle_) {
      this.drawText_(replayGroup, geometry);
    }
  };

  /**
   * @inheritDoc
   */
  WebGLImmediateRenderer.prototype.drawCircle = function drawCircle(geometry, data) {
    var context = this.context_;
    var replayGroup = new _ReplayGroup2.default(1, this.extent_);
    var replay = /** @type {import("./CircleReplay.js").default} */replayGroup.getReplay(0, _ReplayType2.default.CIRCLE);
    replay.setFillStrokeStyle(this.fillStyle_, this.strokeStyle_);
    replay.drawCircle(geometry, data);
    replay.finish(context);
    var opacity = 1;
    /** @type {Object<string, boolean>} */
    var skippedFeatures = {};
    var featureCallback;
    var oneByOne = false;
    replay.replay(this.context_, this.center_, this.resolution_, this.rotation_, this.size_, this.pixelRatio_, opacity, skippedFeatures, featureCallback, oneByOne);
    replay.getDeleteResourcesFunction(context)();

    if (this.textStyle_) {
      this.drawText_(replayGroup, geometry);
    }
  };

  /**
   * @inheritDoc
   */
  WebGLImmediateRenderer.prototype.setImageStyle = function setImageStyle(imageStyle) {
    this.imageStyle_ = imageStyle;
  };

  /**
   * @inheritDoc
   */
  WebGLImmediateRenderer.prototype.setFillStrokeStyle = function setFillStrokeStyle(fillStyle, strokeStyle) {
    this.fillStyle_ = fillStyle;
    this.strokeStyle_ = strokeStyle;
  };

  /**
   * @inheritDoc
   */
  WebGLImmediateRenderer.prototype.setTextStyle = function setTextStyle(textStyle) {
    this.textStyle_ = textStyle;
  };

  return WebGLImmediateRenderer;
}(_VectorContext2.default); /**
                             * @module ol/render/webgl/Immediate
                             */

exports.default = WebGLImmediateRenderer;

//# sourceMappingURL=Immediate.js.map