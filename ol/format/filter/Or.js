'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LogicalNary = require('./LogicalNary.js');

var _LogicalNary2 = _interopRequireDefault(_LogicalNary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Represents a logical `<Or>` operator between two ore more filter conditions.
 * @api
 */
var Or = /*@__PURE__*/function (LogicalNary) {
  function Or(conditions) {
    LogicalNary.call(this, 'Or', Array.prototype.slice.call(arguments));
  }

  if (LogicalNary) Or.__proto__ = LogicalNary;
  Or.prototype = Object.create(LogicalNary && LogicalNary.prototype);
  Or.prototype.constructor = Or;

  return Or;
}(_LogicalNary2.default); /**
                           * @module ol/format/filter/Or
                           */
exports.default = Or;

//# sourceMappingURL=Or.js.map