'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Instruction = require('./Instruction.js');

var _Instruction2 = _interopRequireDefault(_Instruction);

var _Replay = require('./Replay.js');

var _Replay2 = _interopRequireDefault(_Replay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module ol/render/canvas/LineStringReplay
 */
var CanvasLineStringReplay = /*@__PURE__*/function (CanvasReplay) {
  function CanvasLineStringReplay(tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree) {
    CanvasReplay.call(this, tolerance, maxExtent, resolution, pixelRatio, overlaps, declutterTree);
  }

  if (CanvasReplay) CanvasLineStringReplay.__proto__ = CanvasReplay;
  CanvasLineStringReplay.prototype = Object.create(CanvasReplay && CanvasReplay.prototype);
  CanvasLineStringReplay.prototype.constructor = CanvasLineStringReplay;

  /**
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   * @private
   * @return {number} end.
   */
  CanvasLineStringReplay.prototype.drawFlatCoordinates_ = function drawFlatCoordinates_(flatCoordinates, offset, end, stride) {
    var myBegin = this.coordinates.length;
    var myEnd = this.appendFlatCoordinates(flatCoordinates, offset, end, stride, false, false);
    var moveToLineToInstruction = [_Instruction2.default.MOVE_TO_LINE_TO, myBegin, myEnd];
    this.instructions.push(moveToLineToInstruction);
    this.hitDetectionInstructions.push(moveToLineToInstruction);
    return end;
  };

  /**
   * @inheritDoc
   */
  CanvasLineStringReplay.prototype.drawLineString = function drawLineString(lineStringGeometry, feature) {
    var state = this.state;
    var strokeStyle = state.strokeStyle;
    var lineWidth = state.lineWidth;
    if (strokeStyle === undefined || lineWidth === undefined) {
      return;
    }
    this.updateStrokeStyle(state, this.applyStroke);
    this.beginGeometry(lineStringGeometry, feature);
    this.hitDetectionInstructions.push([_Instruction2.default.SET_STROKE_STYLE, state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin, state.miterLimit, state.lineDash, state.lineDashOffset], _Instruction.beginPathInstruction);
    var flatCoordinates = lineStringGeometry.getFlatCoordinates();
    var stride = lineStringGeometry.getStride();
    this.drawFlatCoordinates_(flatCoordinates, 0, flatCoordinates.length, stride);
    this.hitDetectionInstructions.push(_Instruction.strokeInstruction);
    this.endGeometry(lineStringGeometry, feature);
  };

  /**
   * @inheritDoc
   */
  CanvasLineStringReplay.prototype.drawMultiLineString = function drawMultiLineString(multiLineStringGeometry, feature) {
    var state = this.state;
    var strokeStyle = state.strokeStyle;
    var lineWidth = state.lineWidth;
    if (strokeStyle === undefined || lineWidth === undefined) {
      return;
    }
    this.updateStrokeStyle(state, this.applyStroke);
    this.beginGeometry(multiLineStringGeometry, feature);
    this.hitDetectionInstructions.push([_Instruction2.default.SET_STROKE_STYLE, state.strokeStyle, state.lineWidth, state.lineCap, state.lineJoin, state.miterLimit, state.lineDash, state.lineDashOffset], _Instruction.beginPathInstruction);
    var ends = multiLineStringGeometry.getEnds();
    var flatCoordinates = multiLineStringGeometry.getFlatCoordinates();
    var stride = multiLineStringGeometry.getStride();
    var offset = 0;
    for (var i = 0, ii = ends.length; i < ii; ++i) {
      offset = this.drawFlatCoordinates_(flatCoordinates, offset, ends[i], stride);
    }
    this.hitDetectionInstructions.push(_Instruction.strokeInstruction);
    this.endGeometry(multiLineStringGeometry, feature);
  };

  /**
   * @inheritDoc
   */
  CanvasLineStringReplay.prototype.finish = function finish() {
    var state = this.state;
    if (state.lastStroke != undefined && state.lastStroke != this.coordinates.length) {
      this.instructions.push(_Instruction.strokeInstruction);
    }
    this.reverseHitDetectionInstructions();
    this.state = null;
  };

  /**
   * @inheritDoc.
   */
  CanvasLineStringReplay.prototype.applyStroke = function applyStroke(state) {
    if (state.lastStroke != undefined && state.lastStroke != this.coordinates.length) {
      this.instructions.push(_Instruction.strokeInstruction);
      state.lastStroke = this.coordinates.length;
    }
    state.lastStroke = 0;
    CanvasReplay.prototype.applyStroke.call(this, state);
    this.instructions.push(_Instruction.beginPathInstruction);
  };

  return CanvasLineStringReplay;
}(_Replay2.default);

exports.default = CanvasLineStringReplay;

//# sourceMappingURL=LineStringReplay.js.map