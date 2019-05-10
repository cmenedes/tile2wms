'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _array = require('../../array.js');

var _colorlike = require('../../colorlike.js');

var _extent = require('../../extent.js');

var _GeometryType = require('../../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _SimpleGeometry = require('../../geom/SimpleGeometry.js');

var _transform = require('../../geom/flat/transform.js');

var _has = require('../../has.js');

var _VectorContext = require('../VectorContext.js');

var _VectorContext2 = _interopRequireDefault(_VectorContext);

var _canvas = require('../canvas.js');

var _transform2 = require('../../transform.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * A concrete subclass of {@link module:ol/render/VectorContext} that implements
 * direct rendering of features and geometries to an HTML5 Canvas context.
 * Instances of this class are created internally by the library and
 * provided to application code as vectorContext member of the
 * {@link module:ol/render/Event~RenderEvent} object associated with postcompose, precompose and
 * render events emitted by layers and maps.
 */
/**
 * @module ol/render/canvas/Immediate
 */
// FIXME test, especially polygons with holes and multipolygons
// FIXME need to handle large thick features (where pixel size matters)
// FIXME add offset and end to ol/geom/flat/transform~transform2D?

var CanvasImmediateRenderer = /*@__PURE__*/function (VectorContext) {
  function CanvasImmediateRenderer(context, pixelRatio, extent, transform, viewRotation) {
    VectorContext.call(this);

    /**
     * @private
     * @type {CanvasRenderingContext2D}
     */
    this.context_ = context;

    /**
     * @private
     * @type {number}
     */
    this.pixelRatio_ = pixelRatio;

    /**
     * @private
     * @type {import("../../extent.js").Extent}
     */
    this.extent_ = extent;

    /**
     * @private
     * @type {import("../../transform.js").Transform}
     */
    this.transform_ = transform;

    /**
     * @private
     * @type {number}
     */
    this.viewRotation_ = viewRotation;

    /**
     * @private
     * @type {?import("../canvas.js").FillState}
     */
    this.contextFillState_ = null;

    /**
     * @private
     * @type {?import("../canvas.js").StrokeState}
     */
    this.contextStrokeState_ = null;

    /**
     * @private
     * @type {?import("../canvas.js").TextState}
     */
    this.contextTextState_ = null;

    /**
     * @private
     * @type {?import("../canvas.js").FillState}
     */
    this.fillState_ = null;

    /**
     * @private
     * @type {?import("../canvas.js").StrokeState}
     */
    this.strokeState_ = null;

    /**
     * @private
     * @type {HTMLCanvasElement|HTMLVideoElement|HTMLImageElement}
     */
    this.image_ = null;

    /**
     * @private
     * @type {number}
     */
    this.imageAnchorX_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.imageAnchorY_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.imageHeight_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.imageOpacity_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.imageOriginX_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.imageOriginY_ = 0;

    /**
     * @private
     * @type {boolean}
     */
    this.imageRotateWithView_ = false;

    /**
     * @private
     * @type {number}
     */
    this.imageRotation_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.imageScale_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.imageWidth_ = 0;

    /**
     * @private
     * @type {string}
     */
    this.text_ = '';

    /**
     * @private
     * @type {number}
     */
    this.textOffsetX_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.textOffsetY_ = 0;

    /**
     * @private
     * @type {boolean}
     */
    this.textRotateWithView_ = false;

    /**
     * @private
     * @type {number}
     */
    this.textRotation_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.textScale_ = 0;

    /**
     * @private
     * @type {?import("../canvas.js").FillState}
     */
    this.textFillState_ = null;

    /**
     * @private
     * @type {?import("../canvas.js").StrokeState}
     */
    this.textStrokeState_ = null;

    /**
     * @private
     * @type {?import("../canvas.js").TextState}
     */
    this.textState_ = null;

    /**
     * @private
     * @type {Array<number>}
     */
    this.pixelCoordinates_ = [];

    /**
     * @private
     * @type {import("../../transform.js").Transform}
     */
    this.tmpLocalTransform_ = (0, _transform2.create)();
  }

  if (VectorContext) CanvasImmediateRenderer.__proto__ = VectorContext;
  CanvasImmediateRenderer.prototype = Object.create(VectorContext && VectorContext.prototype);
  CanvasImmediateRenderer.prototype.constructor = CanvasImmediateRenderer;

  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @private
   */
  CanvasImmediateRenderer.prototype.drawImages_ = function drawImages_(flatCoordinates, offset, end, stride) {
    if (!this.image_) {
      return;
    }
    var pixelCoordinates = (0, _transform.transform2D)(flatCoordinates, offset, end, 2, this.transform_, this.pixelCoordinates_);
    var context = this.context_;
    var localTransform = this.tmpLocalTransform_;
    var alpha = context.globalAlpha;
    if (this.imageOpacity_ != 1) {
      context.globalAlpha = alpha * this.imageOpacity_;
    }
    var rotation = this.imageRotation_;
    if (this.imageRotateWithView_) {
      rotation += this.viewRotation_;
    }
    for (var i = 0, ii = pixelCoordinates.length; i < ii; i += 2) {
      var x = pixelCoordinates[i] - this.imageAnchorX_;
      var y = pixelCoordinates[i + 1] - this.imageAnchorY_;
      if (rotation !== 0 || this.imageScale_ != 1) {
        var centerX = x + this.imageAnchorX_;
        var centerY = y + this.imageAnchorY_;
        (0, _transform2.compose)(localTransform, centerX, centerY, this.imageScale_, this.imageScale_, rotation, -centerX, -centerY);
        context.setTransform.apply(context, localTransform);
      }
      context.drawImage(this.image_, this.imageOriginX_, this.imageOriginY_, this.imageWidth_, this.imageHeight_, x, y, this.imageWidth_, this.imageHeight_);
    }
    if (rotation !== 0 || this.imageScale_ != 1) {
      context.setTransform(1, 0, 0, 1, 0, 0);
    }
    if (this.imageOpacity_ != 1) {
      context.globalAlpha = alpha;
    }
  };

  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @private
   */
  CanvasImmediateRenderer.prototype.drawText_ = function drawText_(flatCoordinates, offset, end, stride) {
    if (!this.textState_ || this.text_ === '') {
      return;
    }
    if (this.textFillState_) {
      this.setContextFillState_(this.textFillState_);
    }
    if (this.textStrokeState_) {
      this.setContextStrokeState_(this.textStrokeState_);
    }
    this.setContextTextState_(this.textState_);
    var pixelCoordinates = (0, _transform.transform2D)(flatCoordinates, offset, end, stride, this.transform_, this.pixelCoordinates_);
    var context = this.context_;
    var rotation = this.textRotation_;
    if (this.textRotateWithView_) {
      rotation += this.viewRotation_;
    }
    for (; offset < end; offset += stride) {
      var x = pixelCoordinates[offset] + this.textOffsetX_;
      var y = pixelCoordinates[offset + 1] + this.textOffsetY_;
      if (rotation !== 0 || this.textScale_ != 1) {
        var localTransform = (0, _transform2.compose)(this.tmpLocalTransform_, x, y, this.textScale_, this.textScale_, rotation, -x, -y);
        context.setTransform.apply(context, localTransform);
      }
      if (this.textStrokeState_) {
        context.strokeText(this.text_, x, y);
      }
      if (this.textFillState_) {
        context.fillText(this.text_, x, y);
      }
    }
    if (rotation !== 0 || this.textScale_ != 1) {
      context.setTransform(1, 0, 0, 1, 0, 0);
    }
  };

  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @param {boolean} close Close.
   * @private
   * @return {number} end End.
   */
  CanvasImmediateRenderer.prototype.moveToLineTo_ = function moveToLineTo_(flatCoordinates, offset, end, stride, close) {
    var context = this.context_;
    var pixelCoordinates = (0, _transform.transform2D)(flatCoordinates, offset, end, stride, this.transform_, this.pixelCoordinates_);
    context.moveTo(pixelCoordinates[0], pixelCoordinates[1]);
    var length = pixelCoordinates.length;
    if (close) {
      length -= 2;
    }
    for (var i = 2; i < length; i += 2) {
      context.lineTo(pixelCoordinates[i], pixelCoordinates[i + 1]);
    }
    if (close) {
      context.closePath();
    }
    return end;
  };

  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {Array<number>} ends Ends.
   * @param {number} stride Stride.
   * @private
   * @return {number} End.
   */
  CanvasImmediateRenderer.prototype.drawRings_ = function drawRings_(flatCoordinates, offset, ends, stride) {
    for (var i = 0, ii = ends.length; i < ii; ++i) {
      offset = this.moveToLineTo_(flatCoordinates, offset, ends[i], stride, true);
    }
    return offset;
  };

  /**
   * Render a circle geometry into the canvas.  Rendering is immediate and uses
   * the current fill and stroke styles.
   *
   * @param {import("../../geom/Circle.js").default} geometry Circle geometry.
   * @override
   * @api
   */
  CanvasImmediateRenderer.prototype.drawCircle = function drawCircle(geometry) {
    if (!(0, _extent.intersects)(this.extent_, geometry.getExtent())) {
      return;
    }
    if (this.fillState_ || this.strokeState_) {
      if (this.fillState_) {
        this.setContextFillState_(this.fillState_);
      }
      if (this.strokeState_) {
        this.setContextStrokeState_(this.strokeState_);
      }
      var pixelCoordinates = (0, _SimpleGeometry.transformGeom2D)(geometry, this.transform_, this.pixelCoordinates_);
      var dx = pixelCoordinates[2] - pixelCoordinates[0];
      var dy = pixelCoordinates[3] - pixelCoordinates[1];
      var radius = Math.sqrt(dx * dx + dy * dy);
      var context = this.context_;
      context.beginPath();
      context.arc(pixelCoordinates[0], pixelCoordinates[1], radius, 0, 2 * Math.PI);
      if (this.fillState_) {
        context.fill();
      }
      if (this.strokeState_) {
        context.stroke();
      }
    }
    if (this.text_ !== '') {
      this.drawText_(geometry.getCenter(), 0, 2, 2);
    }
  };

  /**
   * Set the rendering style.  Note that since this is an immediate rendering API,
   * any `zIndex` on the provided style will be ignored.
   *
   * @param {import("../../style/Style.js").default} style The rendering style.
   * @override
   * @api
   */
  CanvasImmediateRenderer.prototype.setStyle = function setStyle(style) {
    this.setFillStrokeStyle(style.getFill(), style.getStroke());
    this.setImageStyle(style.getImage());
    this.setTextStyle(style.getText());
  };

  /**
   * Render a geometry into the canvas.  Call
   * {@link module:ol/render/canvas/Immediate#setStyle} first to set the rendering style.
   *
   * @param {import("../../geom/Geometry.js").default|import("../Feature.js").default} geometry The geometry to render.
   * @override
   * @api
   */
  CanvasImmediateRenderer.prototype.drawGeometry = function drawGeometry(geometry) {
    var type = geometry.getType();
    switch (type) {
      case _GeometryType2.default.POINT:
        this.drawPoint( /** @type {import("../../geom/Point.js").default} */geometry);
        break;
      case _GeometryType2.default.LINE_STRING:
        this.drawLineString( /** @type {import("../../geom/LineString.js").default} */geometry);
        break;
      case _GeometryType2.default.POLYGON:
        this.drawPolygon( /** @type {import("../../geom/Polygon.js").default} */geometry);
        break;
      case _GeometryType2.default.MULTI_POINT:
        this.drawMultiPoint( /** @type {import("../../geom/MultiPoint.js").default} */geometry);
        break;
      case _GeometryType2.default.MULTI_LINE_STRING:
        this.drawMultiLineString( /** @type {import("../../geom/MultiLineString.js").default} */geometry);
        break;
      case _GeometryType2.default.MULTI_POLYGON:
        this.drawMultiPolygon( /** @type {import("../../geom/MultiPolygon.js").default} */geometry);
        break;
      case _GeometryType2.default.GEOMETRY_COLLECTION:
        this.drawGeometryCollection( /** @type {import("../../geom/GeometryCollection.js").default} */geometry);
        break;
      case _GeometryType2.default.CIRCLE:
        this.drawCircle( /** @type {import("../../geom/Circle.js").default} */geometry);
        break;
      default:
    }
  };

  /**
   * Render a feature into the canvas.  Note that any `zIndex` on the provided
   * style will be ignored - features are rendered immediately in the order that
   * this method is called.  If you need `zIndex` support, you should be using an
   * {@link module:ol/layer/Vector~VectorLayer} instead.
   *
   * @param {import("../../Feature.js").default} feature Feature.
   * @param {import("../../style/Style.js").default} style Style.
   * @override
   * @api
   */
  CanvasImmediateRenderer.prototype.drawFeature = function drawFeature(feature, style) {
    var geometry = style.getGeometryFunction()(feature);
    if (!geometry || !(0, _extent.intersects)(this.extent_, geometry.getExtent())) {
      return;
    }
    this.setStyle(style);
    this.drawGeometry(geometry);
  };

  /**
   * Render a GeometryCollection to the canvas.  Rendering is immediate and
   * uses the current styles appropriate for each geometry in the collection.
   *
   * @param {import("../../geom/GeometryCollection.js").default} geometry Geometry collection.
   * @override
   */
  CanvasImmediateRenderer.prototype.drawGeometryCollection = function drawGeometryCollection(geometry) {
    var geometries = geometry.getGeometriesArray();
    for (var i = 0, ii = geometries.length; i < ii; ++i) {
      this.drawGeometry(geometries[i]);
    }
  };

  /**
   * Render a Point geometry into the canvas.  Rendering is immediate and uses
   * the current style.
   *
   * @param {import("../../geom/Point.js").default|import("../Feature.js").default} geometry Point geometry.
   * @override
   */
  CanvasImmediateRenderer.prototype.drawPoint = function drawPoint(geometry) {
    var flatCoordinates = geometry.getFlatCoordinates();
    var stride = geometry.getStride();
    if (this.image_) {
      this.drawImages_(flatCoordinates, 0, flatCoordinates.length, stride);
    }
    if (this.text_ !== '') {
      this.drawText_(flatCoordinates, 0, flatCoordinates.length, stride);
    }
  };

  /**
   * Render a MultiPoint geometry  into the canvas.  Rendering is immediate and
   * uses the current style.
   *
   * @param {import("../../geom/MultiPoint.js").default|import("../Feature.js").default} geometry MultiPoint geometry.
   * @override
   */
  CanvasImmediateRenderer.prototype.drawMultiPoint = function drawMultiPoint(geometry) {
    var flatCoordinates = geometry.getFlatCoordinates();
    var stride = geometry.getStride();
    if (this.image_) {
      this.drawImages_(flatCoordinates, 0, flatCoordinates.length, stride);
    }
    if (this.text_ !== '') {
      this.drawText_(flatCoordinates, 0, flatCoordinates.length, stride);
    }
  };

  /**
   * Render a LineString into the canvas.  Rendering is immediate and uses
   * the current style.
   *
   * @param {import("../../geom/LineString.js").default|import("../Feature.js").default} geometry LineString geometry.
   * @override
   */
  CanvasImmediateRenderer.prototype.drawLineString = function drawLineString(geometry) {
    if (!(0, _extent.intersects)(this.extent_, geometry.getExtent())) {
      return;
    }
    if (this.strokeState_) {
      this.setContextStrokeState_(this.strokeState_);
      var context = this.context_;
      var flatCoordinates = geometry.getFlatCoordinates();
      context.beginPath();
      this.moveToLineTo_(flatCoordinates, 0, flatCoordinates.length, geometry.getStride(), false);
      context.stroke();
    }
    if (this.text_ !== '') {
      var flatMidpoint = geometry.getFlatMidpoint();
      this.drawText_(flatMidpoint, 0, 2, 2);
    }
  };

  /**
   * Render a MultiLineString geometry into the canvas.  Rendering is immediate
   * and uses the current style.
   *
   * @param {import("../../geom/MultiLineString.js").default|import("../Feature.js").default} geometry MultiLineString geometry.
   * @override
   */
  CanvasImmediateRenderer.prototype.drawMultiLineString = function drawMultiLineString(geometry) {
    var geometryExtent = geometry.getExtent();
    if (!(0, _extent.intersects)(this.extent_, geometryExtent)) {
      return;
    }
    if (this.strokeState_) {
      this.setContextStrokeState_(this.strokeState_);
      var context = this.context_;
      var flatCoordinates = geometry.getFlatCoordinates();
      var offset = 0;
      var ends = /** @type {Array<number>} */geometry.getEnds();
      var stride = geometry.getStride();
      context.beginPath();
      for (var i = 0, ii = ends.length; i < ii; ++i) {
        offset = this.moveToLineTo_(flatCoordinates, offset, ends[i], stride, false);
      }
      context.stroke();
    }
    if (this.text_ !== '') {
      var flatMidpoints = geometry.getFlatMidpoints();
      this.drawText_(flatMidpoints, 0, flatMidpoints.length, 2);
    }
  };

  /**
   * Render a Polygon geometry into the canvas.  Rendering is immediate and uses
   * the current style.
   *
   * @param {import("../../geom/Polygon.js").default|import("../Feature.js").default} geometry Polygon geometry.
   * @override
   */
  CanvasImmediateRenderer.prototype.drawPolygon = function drawPolygon(geometry) {
    if (!(0, _extent.intersects)(this.extent_, geometry.getExtent())) {
      return;
    }
    if (this.strokeState_ || this.fillState_) {
      if (this.fillState_) {
        this.setContextFillState_(this.fillState_);
      }
      if (this.strokeState_) {
        this.setContextStrokeState_(this.strokeState_);
      }
      var context = this.context_;
      context.beginPath();
      this.drawRings_(geometry.getOrientedFlatCoordinates(), 0, /** @type {Array<number>} */geometry.getEnds(), geometry.getStride());
      if (this.fillState_) {
        context.fill();
      }
      if (this.strokeState_) {
        context.stroke();
      }
    }
    if (this.text_ !== '') {
      var flatInteriorPoint = geometry.getFlatInteriorPoint();
      this.drawText_(flatInteriorPoint, 0, 2, 2);
    }
  };

  /**
   * Render MultiPolygon geometry into the canvas.  Rendering is immediate and
   * uses the current style.
   * @param {import("../../geom/MultiPolygon.js").default} geometry MultiPolygon geometry.
   * @override
   */
  CanvasImmediateRenderer.prototype.drawMultiPolygon = function drawMultiPolygon(geometry) {
    if (!(0, _extent.intersects)(this.extent_, geometry.getExtent())) {
      return;
    }
    if (this.strokeState_ || this.fillState_) {
      if (this.fillState_) {
        this.setContextFillState_(this.fillState_);
      }
      if (this.strokeState_) {
        this.setContextStrokeState_(this.strokeState_);
      }
      var context = this.context_;
      var flatCoordinates = geometry.getOrientedFlatCoordinates();
      var offset = 0;
      var endss = geometry.getEndss();
      var stride = geometry.getStride();
      context.beginPath();
      for (var i = 0, ii = endss.length; i < ii; ++i) {
        var ends = endss[i];
        offset = this.drawRings_(flatCoordinates, offset, ends, stride);
      }
      if (this.fillState_) {
        context.fill();
      }
      if (this.strokeState_) {
        context.stroke();
      }
    }
    if (this.text_ !== '') {
      var flatInteriorPoints = geometry.getFlatInteriorPoints();
      this.drawText_(flatInteriorPoints, 0, flatInteriorPoints.length, 2);
    }
  };

  /**
   * @param {import("../canvas.js").FillState} fillState Fill state.
   * @private
   */
  CanvasImmediateRenderer.prototype.setContextFillState_ = function setContextFillState_(fillState) {
    var context = this.context_;
    var contextFillState = this.contextFillState_;
    if (!contextFillState) {
      context.fillStyle = fillState.fillStyle;
      this.contextFillState_ = {
        fillStyle: fillState.fillStyle
      };
    } else {
      if (contextFillState.fillStyle != fillState.fillStyle) {
        contextFillState.fillStyle = context.fillStyle = fillState.fillStyle;
      }
    }
  };

  /**
   * @param {import("../canvas.js").StrokeState} strokeState Stroke state.
   * @private
   */
  CanvasImmediateRenderer.prototype.setContextStrokeState_ = function setContextStrokeState_(strokeState) {
    var context = this.context_;
    var contextStrokeState = this.contextStrokeState_;
    if (!contextStrokeState) {
      context.lineCap = /** @type {CanvasLineCap} */strokeState.lineCap;
      if (_has.CANVAS_LINE_DASH) {
        context.setLineDash(strokeState.lineDash);
        context.lineDashOffset = strokeState.lineDashOffset;
      }
      context.lineJoin = /** @type {CanvasLineJoin} */strokeState.lineJoin;
      context.lineWidth = strokeState.lineWidth;
      context.miterLimit = strokeState.miterLimit;
      context.strokeStyle = strokeState.strokeStyle;
      this.contextStrokeState_ = {
        lineCap: strokeState.lineCap,
        lineDash: strokeState.lineDash,
        lineDashOffset: strokeState.lineDashOffset,
        lineJoin: strokeState.lineJoin,
        lineWidth: strokeState.lineWidth,
        miterLimit: strokeState.miterLimit,
        strokeStyle: strokeState.strokeStyle
      };
    } else {
      if (contextStrokeState.lineCap != strokeState.lineCap) {
        contextStrokeState.lineCap = context.lineCap = /** @type {CanvasLineCap} */strokeState.lineCap;
      }
      if (_has.CANVAS_LINE_DASH) {
        if (!(0, _array.equals)(contextStrokeState.lineDash, strokeState.lineDash)) {
          context.setLineDash(contextStrokeState.lineDash = strokeState.lineDash);
        }
        if (contextStrokeState.lineDashOffset != strokeState.lineDashOffset) {
          contextStrokeState.lineDashOffset = context.lineDashOffset = strokeState.lineDashOffset;
        }
      }
      if (contextStrokeState.lineJoin != strokeState.lineJoin) {
        contextStrokeState.lineJoin = context.lineJoin = /** @type {CanvasLineJoin} */strokeState.lineJoin;
      }
      if (contextStrokeState.lineWidth != strokeState.lineWidth) {
        contextStrokeState.lineWidth = context.lineWidth = strokeState.lineWidth;
      }
      if (contextStrokeState.miterLimit != strokeState.miterLimit) {
        contextStrokeState.miterLimit = context.miterLimit = strokeState.miterLimit;
      }
      if (contextStrokeState.strokeStyle != strokeState.strokeStyle) {
        contextStrokeState.strokeStyle = context.strokeStyle = strokeState.strokeStyle;
      }
    }
  };

  /**
   * @param {import("../canvas.js").TextState} textState Text state.
   * @private
   */
  CanvasImmediateRenderer.prototype.setContextTextState_ = function setContextTextState_(textState) {
    var context = this.context_;
    var contextTextState = this.contextTextState_;
    var textAlign = textState.textAlign ? textState.textAlign : _canvas.defaultTextAlign;
    if (!contextTextState) {
      context.font = textState.font;
      context.textAlign = /** @type {CanvasTextAlign} */textAlign;
      context.textBaseline = /** @type {CanvasTextBaseline} */textState.textBaseline;
      this.contextTextState_ = {
        font: textState.font,
        textAlign: textAlign,
        textBaseline: textState.textBaseline
      };
    } else {
      if (contextTextState.font != textState.font) {
        contextTextState.font = context.font = textState.font;
      }
      if (contextTextState.textAlign != textAlign) {
        contextTextState.textAlign = context.textAlign = /** @type {CanvasTextAlign} */textAlign;
      }
      if (contextTextState.textBaseline != textState.textBaseline) {
        contextTextState.textBaseline = context.textBaseline =
        /** @type {CanvasTextBaseline} */textState.textBaseline;
      }
    }
  };

  /**
   * Set the fill and stroke style for subsequent draw operations.  To clear
   * either fill or stroke styles, pass null for the appropriate parameter.
   *
   * @param {import("../../style/Fill.js").default} fillStyle Fill style.
   * @param {import("../../style/Stroke.js").default} strokeStyle Stroke style.
   * @override
   */
  CanvasImmediateRenderer.prototype.setFillStrokeStyle = function setFillStrokeStyle(fillStyle, strokeStyle) {
    if (!fillStyle) {
      this.fillState_ = null;
    } else {
      var fillStyleColor = fillStyle.getColor();
      this.fillState_ = {
        fillStyle: (0, _colorlike.asColorLike)(fillStyleColor ? fillStyleColor : _canvas.defaultFillStyle)
      };
    }
    if (!strokeStyle) {
      this.strokeState_ = null;
    } else {
      var strokeStyleColor = strokeStyle.getColor();
      var strokeStyleLineCap = strokeStyle.getLineCap();
      var strokeStyleLineDash = strokeStyle.getLineDash();
      var strokeStyleLineDashOffset = strokeStyle.getLineDashOffset();
      var strokeStyleLineJoin = strokeStyle.getLineJoin();
      var strokeStyleWidth = strokeStyle.getWidth();
      var strokeStyleMiterLimit = strokeStyle.getMiterLimit();
      this.strokeState_ = {
        lineCap: strokeStyleLineCap !== undefined ? strokeStyleLineCap : _canvas.defaultLineCap,
        lineDash: strokeStyleLineDash ? strokeStyleLineDash : _canvas.defaultLineDash,
        lineDashOffset: strokeStyleLineDashOffset ? strokeStyleLineDashOffset : _canvas.defaultLineDashOffset,
        lineJoin: strokeStyleLineJoin !== undefined ? strokeStyleLineJoin : _canvas.defaultLineJoin,
        lineWidth: this.pixelRatio_ * (strokeStyleWidth !== undefined ? strokeStyleWidth : _canvas.defaultLineWidth),
        miterLimit: strokeStyleMiterLimit !== undefined ? strokeStyleMiterLimit : _canvas.defaultMiterLimit,
        strokeStyle: (0, _colorlike.asColorLike)(strokeStyleColor ? strokeStyleColor : _canvas.defaultStrokeStyle)
      };
    }
  };

  /**
   * Set the image style for subsequent draw operations.  Pass null to remove
   * the image style.
   *
   * @param {import("../../style/Image.js").default} imageStyle Image style.
   * @override
   */
  CanvasImmediateRenderer.prototype.setImageStyle = function setImageStyle(imageStyle) {
    if (!imageStyle) {
      this.image_ = null;
    } else {
      var imageAnchor = imageStyle.getAnchor();
      // FIXME pixel ratio
      var imageImage = imageStyle.getImage(1);
      var imageOrigin = imageStyle.getOrigin();
      var imageSize = imageStyle.getSize();
      this.imageAnchorX_ = imageAnchor[0];
      this.imageAnchorY_ = imageAnchor[1];
      this.imageHeight_ = imageSize[1];
      this.image_ = imageImage;
      this.imageOpacity_ = imageStyle.getOpacity();
      this.imageOriginX_ = imageOrigin[0];
      this.imageOriginY_ = imageOrigin[1];
      this.imageRotateWithView_ = imageStyle.getRotateWithView();
      this.imageRotation_ = imageStyle.getRotation();
      this.imageScale_ = imageStyle.getScale() * this.pixelRatio_;
      this.imageWidth_ = imageSize[0];
    }
  };

  /**
   * Set the text style for subsequent draw operations.  Pass null to
   * remove the text style.
   *
   * @param {import("../../style/Text.js").default} textStyle Text style.
   * @override
   */
  CanvasImmediateRenderer.prototype.setTextStyle = function setTextStyle(textStyle) {
    if (!textStyle) {
      this.text_ = '';
    } else {
      var textFillStyle = textStyle.getFill();
      if (!textFillStyle) {
        this.textFillState_ = null;
      } else {
        var textFillStyleColor = textFillStyle.getColor();
        this.textFillState_ = {
          fillStyle: (0, _colorlike.asColorLike)(textFillStyleColor ? textFillStyleColor : _canvas.defaultFillStyle)
        };
      }
      var textStrokeStyle = textStyle.getStroke();
      if (!textStrokeStyle) {
        this.textStrokeState_ = null;
      } else {
        var textStrokeStyleColor = textStrokeStyle.getColor();
        var textStrokeStyleLineCap = textStrokeStyle.getLineCap();
        var textStrokeStyleLineDash = textStrokeStyle.getLineDash();
        var textStrokeStyleLineDashOffset = textStrokeStyle.getLineDashOffset();
        var textStrokeStyleLineJoin = textStrokeStyle.getLineJoin();
        var textStrokeStyleWidth = textStrokeStyle.getWidth();
        var textStrokeStyleMiterLimit = textStrokeStyle.getMiterLimit();
        this.textStrokeState_ = {
          lineCap: textStrokeStyleLineCap !== undefined ? textStrokeStyleLineCap : _canvas.defaultLineCap,
          lineDash: textStrokeStyleLineDash ? textStrokeStyleLineDash : _canvas.defaultLineDash,
          lineDashOffset: textStrokeStyleLineDashOffset ? textStrokeStyleLineDashOffset : _canvas.defaultLineDashOffset,
          lineJoin: textStrokeStyleLineJoin !== undefined ? textStrokeStyleLineJoin : _canvas.defaultLineJoin,
          lineWidth: textStrokeStyleWidth !== undefined ? textStrokeStyleWidth : _canvas.defaultLineWidth,
          miterLimit: textStrokeStyleMiterLimit !== undefined ? textStrokeStyleMiterLimit : _canvas.defaultMiterLimit,
          strokeStyle: (0, _colorlike.asColorLike)(textStrokeStyleColor ? textStrokeStyleColor : _canvas.defaultStrokeStyle)
        };
      }
      var textFont = textStyle.getFont();
      var textOffsetX = textStyle.getOffsetX();
      var textOffsetY = textStyle.getOffsetY();
      var textRotateWithView = textStyle.getRotateWithView();
      var textRotation = textStyle.getRotation();
      var textScale = textStyle.getScale();
      var textText = textStyle.getText();
      var textTextAlign = textStyle.getTextAlign();
      var textTextBaseline = textStyle.getTextBaseline();
      this.textState_ = {
        font: textFont !== undefined ? textFont : _canvas.defaultFont,
        textAlign: textTextAlign !== undefined ? textTextAlign : _canvas.defaultTextAlign,
        textBaseline: textTextBaseline !== undefined ? textTextBaseline : _canvas.defaultTextBaseline
      };
      this.text_ = textText !== undefined ? textText : '';
      this.textOffsetX_ = textOffsetX !== undefined ? this.pixelRatio_ * textOffsetX : 0;
      this.textOffsetY_ = textOffsetY !== undefined ? this.pixelRatio_ * textOffsetY : 0;
      this.textRotateWithView_ = textRotateWithView !== undefined ? textRotateWithView : false;
      this.textRotation_ = textRotation !== undefined ? textRotation : 0;
      this.textScale_ = this.pixelRatio_ * (textScale !== undefined ? textScale : 1);
    }
  };

  return CanvasImmediateRenderer;
}(_VectorContext2.default);

exports.default = CanvasImmediateRenderer;

//# sourceMappingURL=Immediate.js.map