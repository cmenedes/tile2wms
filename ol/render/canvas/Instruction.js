"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @module ol/render/canvas/Instruction
 */

/**
 * @enum {number}
 */
var Instruction = {
  BEGIN_GEOMETRY: 0,
  BEGIN_PATH: 1,
  CIRCLE: 2,
  CLOSE_PATH: 3,
  CUSTOM: 4,
  DRAW_CHARS: 5,
  DRAW_IMAGE: 6,
  END_GEOMETRY: 7,
  FILL: 8,
  MOVE_TO_LINE_TO: 9,
  SET_FILL_STYLE: 10,
  SET_STROKE_STYLE: 11,
  STROKE: 12
};

/**
 * @type {Array<Instruction>}
 */
var fillInstruction = exports.fillInstruction = [Instruction.FILL];

/**
 * @type {Array<Instruction>}
 */
var strokeInstruction = exports.strokeInstruction = [Instruction.STROKE];

/**
 * @type {Array<Instruction>}
 */
var beginPathInstruction = exports.beginPathInstruction = [Instruction.BEGIN_PATH];

/**
 * @type {Array<Instruction>}
 */
var closePathInstruction = exports.closePathInstruction = [Instruction.CLOSE_PATH];

exports.default = Instruction;

//# sourceMappingURL=Instruction.js.map