'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LogicalNary = require('./LogicalNary.js');

var _LogicalNary2 = _interopRequireDefault(_LogicalNary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Represents a logical `<And>` operator between two or more filter conditions.
 *
 * @abstract
 */
var And = /*@__PURE__*/function (LogicalNary) {
  function And(conditions) {
    LogicalNary.call(this, 'And', Array.prototype.slice.call(arguments));
  }

  if (LogicalNary) And.__proto__ = LogicalNary;
  And.prototype = Object.create(LogicalNary && LogicalNary.prototype);
  And.prototype.constructor = And;

  return And;
}(_LogicalNary2.default); /**
                           * @module ol/format/filter/And
                           */
exports.default = And;

//# sourceMappingURL=And.js.map