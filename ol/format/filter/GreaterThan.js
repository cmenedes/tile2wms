'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ComparisonBinary = require('./ComparisonBinary.js');

var _ComparisonBinary2 = _interopRequireDefault(_ComparisonBinary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Represents a `<PropertyIsGreaterThan>` comparison operator.
 * @api
 */
var GreaterThan = /*@__PURE__*/function (ComparisonBinary) {
  function GreaterThan(propertyName, expression) {
    ComparisonBinary.call(this, 'PropertyIsGreaterThan', propertyName, expression);
  }

  if (ComparisonBinary) GreaterThan.__proto__ = ComparisonBinary;
  GreaterThan.prototype = Object.create(ComparisonBinary && ComparisonBinary.prototype);
  GreaterThan.prototype.constructor = GreaterThan;

  return GreaterThan;
}(_ComparisonBinary2.default); /**
                                * @module ol/format/filter/GreaterThan
                                */
exports.default = GreaterThan;

//# sourceMappingURL=GreaterThan.js.map