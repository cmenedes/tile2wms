'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ComparisonBinary = require('./ComparisonBinary.js');

var _ComparisonBinary2 = _interopRequireDefault(_ComparisonBinary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Represents a `<PropertyIsGreaterThanOrEqualTo>` comparison operator.
 * @api
 */
var GreaterThanOrEqualTo = /*@__PURE__*/function (ComparisonBinary) {
  function GreaterThanOrEqualTo(propertyName, expression) {
    ComparisonBinary.call(this, 'PropertyIsGreaterThanOrEqualTo', propertyName, expression);
  }

  if (ComparisonBinary) GreaterThanOrEqualTo.__proto__ = ComparisonBinary;
  GreaterThanOrEqualTo.prototype = Object.create(ComparisonBinary && ComparisonBinary.prototype);
  GreaterThanOrEqualTo.prototype.constructor = GreaterThanOrEqualTo;

  return GreaterThanOrEqualTo;
}(_ComparisonBinary2.default); /**
                                * @module ol/format/filter/GreaterThanOrEqualTo
                                */
exports.default = GreaterThanOrEqualTo;

//# sourceMappingURL=GreaterThanOrEqualTo.js.map