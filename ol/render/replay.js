'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEXT_ALIGN = exports.ORDER = undefined;

var _ReplayType = require('./ReplayType.js');

var _ReplayType2 = _interopRequireDefault(_ReplayType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @const
 * @type {Array<ReplayType>}
 */
var ORDER = exports.ORDER = [_ReplayType2.default.POLYGON, _ReplayType2.default.CIRCLE, _ReplayType2.default.LINE_STRING, _ReplayType2.default.IMAGE, _ReplayType2.default.TEXT, _ReplayType2.default.DEFAULT];

/**
 * @const
 * @enum {number}
 */
/**
 * @module ol/render/replay
 */
var TEXT_ALIGN = exports.TEXT_ALIGN = {};
TEXT_ALIGN['left'] = 0;
TEXT_ALIGN['end'] = 0;
TEXT_ALIGN['center'] = 0.5;
TEXT_ALIGN['right'] = 1;
TEXT_ALIGN['start'] = 1;
TEXT_ALIGN['top'] = 0;
TEXT_ALIGN['middle'] = 0.5;
TEXT_ALIGN['hanging'] = 0.2;
TEXT_ALIGN['alphabetic'] = 0.8;
TEXT_ALIGN['ideographic'] = 0.8;
TEXT_ALIGN['bottom'] = 1;

//# sourceMappingURL=replay.js.map