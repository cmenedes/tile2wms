'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _color = require('../../color.js');

var _simplify = require('../../geom/flat/simplify.js');

var _canvas = require('../canvas.js');

var _Instruction = require('./Instruction.js');

var _Instruction2 = _interopRequireDefault(_Instruction);

var _Replay = require('./Replay.js');

var _Replay2 = _interopRequireDefault(_Replay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CanvasPolygonReplay = /*@__PURE__*/function (CanvasReplay) {
  function CanvasPolygonReplay(tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree) {
    CanvasReplay.call(this, tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree);
  }

  if (CanvasReplay) CanvasPolygonReplay.__proto__ = CanvasReplay;
  CanvasPolygonReplay.prototype = Object.create(CanvasReplay && CanvasReplay.prototype);
  CanvasPolygonReplay.prototype.constructor = CanvasPolygonReplay;

  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {Array<number>} ends Ends.
   * @param {number} stride Stride.
   * @private
   * @return {number} End.
   */
  CanvasPolygonReplay.prototype.drawFlatCoordinatess_ = function drawFlatCoordinatess_(flatCoordinates, offset, ends, stride) {
    var state = this.state;
    var fill = state.fillStyle !== undefined;
    var stroke = state.strokeStyle != undefined;
    var numEnds = ends.length;
    this.instructions.push(_Instruction.beginPathInstruction);
    this.hitDetectionInstructions.push(_Instruction.beginPathInstruction);
    for (var i = 0; i < numEnds; ++i) {
      var end = ends[i];
      var myBegin = this.coordinates.length;
      var myEnd = this.appendFlatCoordinates(flatCoordinates, offset, end, stride, true, !stroke);
      var moveToLineToInstruction = [_Instruction2.default.MOVE_TO_LINE_TO, myBegin, myEnd];
      this.instructions.push(moveToLineToInstruction);
      this.hitDetectionInstructions.push(moveToLineToInstruction);
      if (stroke) {
        // Performance optimization: only call closePath() when we have a stroke.
        // Otherwise the ring is closed already (see appendFlatCoordinates above).
        this.instructions.push(_Instruction.closePathInstruction);
        this.hitDetectionInstructions.push(_Instruction.closePathInstruction);
      }
      offset = end;
    }
    if (fill) {
      this.instructions.push(_Instruction.fillInstruction);
      this.hitDetectionInstructions.push(_Instruction.fillInstruction);
    }
    if (stroke) {
      this.instructions.push(_Instruction.strokeInstruction);
      this.hitDetectionInstructions.push(_Instruction.strokeInstruction);
    }
    return offset;
  };

  /**
   * @inheritDoc
   */
  CanvasPolygonReplay.prototype.drawCircle = function drawCircle(circleGeometry, feature) {
    var state = this.state;
    var fillStyle = state.fillStyle;
    var strokeStyle = state.strokeStyle;
    if (fillStyle === undefined && strokeStyle === undefined) {
      return;
    }
    this.setFillStrokeStyles_(circleGeometry);
    this.beginGeometry(circleGeometry, feature);
    if (state.fillStyle !== undefined) {
      this.hitDetectionInstructions.push([_Instruction2.default.SET_FILL_STYLE, (0, _color.asString)(_canvas.defaultFillStyle)]);
    }
    if (state.strokeStyle !== undefined) {
      this.hitDetectionInstructions.push([_Instruction2.default.SET_STROKE_STYLE, state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin, state.miterLimit, state.lineDash, state.lineDashOffset]);
    }
    var flatCoordinates = circleGeometry.getFlatCoordinates();
    var stride = circleGeometry.getStride();
    var myBegin = this.coordinates.length;
    this.appendFlatCoordinates(flatCoordinates, 0, flatCoordinates.length, stride, false, false);
    var circleInstruction = [_Instruction2.default.CIRCLE, myBegin];
    this.instructions.push(_Instruction.beginPathInstruction, circleInstruction);
    this.hitDetectionInstructions.push(_Instruction.beginPathInstruction, circleInstruction);
    this.hitDetectionInstructions.push(_Instruction.fillInstruction);
    if (state.fillStyle !== undefined) {
      this.instructions.push(_Instruction.fillInstruction);
    }
    if (state.strokeStyle !== undefined) {
      this.instructions.push(_Instruction.strokeInstruction);
      this.hitDetectionInstructions.push(_Instruction.strokeInstruction);
    }
    this.endGeometry(circleGeometry, feature);
  };

  /**
   * @inheritDoc
   */
  CanvasPolygonReplay.prototype.drawPolygon = function drawPolygon(polygonGeometry, feature) {
    var state = this.state;
    var fillStyle = state.fillStyle;
    var strokeStyle = state.strokeStyle;
    if (fillStyle === undefined && strokeStyle === undefined) {
      return;
    }
    this.setFillStrokeStyles_(polygonGeometry);
    this.beginGeometry(polygonGeometry, feature);
    if (state.fillStyle !== undefined) {
      this.hitDetectionInstructions.push([_Instruction2.default.SET_FILL_STYLE, (0, _color.asString)(_canvas.defaultFillStyle)]);
    }
    if (state.strokeStyle !== undefined) {
      this.hitDetectionInstructions.push([_Instruction2.default.SET_STROKE_STYLE, state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin, state.miterLimit, state.lineDash, state.lineDashOffset]);
    }
    var ends = polygonGeometry.getEnds();
    var flatCoordinates = polygonGeometry.getOrientedFlatCoordinates();
    var stride = polygonGeometry.getStride();
    this.drawFlatCoordinatess_(flatCoordinates, 0, ends, stride);
    this.endGeometry(polygonGeometry, feature);
  };

  /**
   * @inheritDoc
   */
  CanvasPolygonReplay.prototype.drawMultiPolygon = function drawMultiPolygon(multiPolygonGeometry, feature) {
    var state = this.state;
    var fillStyle = state.fillStyle;
    var strokeStyle = state.strokeStyle;
    if (fillStyle === undefined && strokeStyle === undefined) {
      return;
    }
    this.setFillStrokeStyles_(multiPolygonGeometry);
    this.beginGeometry(multiPolygonGeometry, feature);
    if (state.fillStyle !== undefined) {
      this.hitDetectionInstructions.push([_Instruction2.default.SET_FILL_STYLE, (0, _color.asString)(_canvas.defaultFillStyle)]);
    }
    if (state.strokeStyle !== undefined) {
      this.hitDetectionInstructions.push([_Instruction2.default.SET_STROKE_STYLE, state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin, state.miterLimit, state.lineDash, state.lineDashOffset]);
    }
    var endss = multiPolygonGeometry.getEndss();
    var flatCoordinates = multiPolygonGeometry.getOrientedFlatCoordinates();
    var stride = multiPolygonGeometry.getStride();
    var offset = 0;
    for (var i = 0, ii = endss.length; i < ii; ++i) {
      offset = this.drawFlatCoordinatess_(flatCoordinates, offset, endss[i], stride);
    }
    this.endGeometry(multiPolygonGeometry, feature);
  };

  /**
   * @inheritDoc
   */
  CanvasPolygonReplay.prototype.finish = function finish() {
    this.reverseHitDetectionInstructions();
    this.state = null;
    // We want to preserve topology when drawing polygons.  Polygons are
    // simplified using quantization and point elimination. However, we might
    // have received a mix of quantized and non-quantized geometries, so ensure
    // that all are quantized by quantizing all coordinates in the batch.
    var tolerance = this.tolerance;
    if (tolerance !== 0) {
      var coordinates = this.coordinates;
      for (var i = 0, ii = coordinates.length; i < ii; ++i) {
        coordinates[i] = (0, _simplify.snap)(coordinates[i], tolerance);
      }
    }
  };

  /**
   * @private
   * @param {import("../../geom/Geometry.js").default|import("../Feature.js").default} geometry Geometry.
   */
  CanvasPolygonReplay.prototype.setFillStrokeStyles_ = function setFillStrokeStyles_(geometry) {
    var state = this.state;
    var fillStyle = state.fillStyle;
    if (fillStyle !== undefined) {
      this.updateFillStyle(state, this.createFill, geometry);
    }
    if (state.strokeStyle !== undefined) {
      this.updateStrokeStyle(state, this.applyStroke);
    }
  };

  return CanvasPolygonReplay;
}(_Replay2.default); /**
                      * @module ol/render/canvas/PolygonReplay
                      */
exports.default = CanvasPolygonReplay;

//# sourceMappingURL=PolygonReplay.js.map