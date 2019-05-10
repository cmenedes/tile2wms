'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ComparisonBinary = require('./ComparisonBinary.js');

var _ComparisonBinary2 = _interopRequireDefault(_ComparisonBinary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Represents a `<PropertyIsNotEqualTo>` comparison operator.
 * @api
 */
var NotEqualTo = /*@__PURE__*/function (ComparisonBinary) {
  function NotEqualTo(propertyName, expression, opt_matchCase) {
    ComparisonBinary.call(this, 'PropertyIsNotEqualTo', propertyName, expression, opt_matchCase);
  }

  if (ComparisonBinary) NotEqualTo.__proto__ = ComparisonBinary;
  NotEqualTo.prototype = Object.create(ComparisonBinary && ComparisonBinary.prototype);
  NotEqualTo.prototype.constructor = NotEqualTo;

  return NotEqualTo;
}(_ComparisonBinary2.default); /**
                                * @module ol/format/filter/NotEqualTo
                                */
exports.default = NotEqualTo;

//# sourceMappingURL=NotEqualTo.js.map