'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ComparisonBinary = require('./ComparisonBinary.js');

var _ComparisonBinary2 = _interopRequireDefault(_ComparisonBinary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Represents a `<PropertyIsLessThanOrEqualTo>` comparison operator.
 * @api
 */
var LessThanOrEqualTo = /*@__PURE__*/function (ComparisonBinary) {
  function LessThanOrEqualTo(propertyName, expression) {
    ComparisonBinary.call(this, 'PropertyIsLessThanOrEqualTo', propertyName, expression);
  }

  if (ComparisonBinary) LessThanOrEqualTo.__proto__ = ComparisonBinary;
  LessThanOrEqualTo.prototype = Object.create(ComparisonBinary && ComparisonBinary.prototype);
  LessThanOrEqualTo.prototype.constructor = LessThanOrEqualTo;

  return LessThanOrEqualTo;
}(_ComparisonBinary2.default); /**
                                * @module ol/format/filter/LessThanOrEqualTo
                                */
exports.default = LessThanOrEqualTo;

//# sourceMappingURL=LessThanOrEqualTo.js.map