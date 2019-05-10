'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ComparisonBinary = require('./ComparisonBinary.js');

var _ComparisonBinary2 = _interopRequireDefault(_ComparisonBinary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Represents a `<PropertyIsLessThan>` comparison operator.
 * @api
 */
var LessThan = /*@__PURE__*/function (ComparisonBinary) {
  function LessThan(propertyName, expression) {
    ComparisonBinary.call(this, 'PropertyIsLessThan', propertyName, expression);
  }

  if (ComparisonBinary) LessThan.__proto__ = ComparisonBinary;
  LessThan.prototype = Object.create(ComparisonBinary && ComparisonBinary.prototype);
  LessThan.prototype.constructor = LessThan;

  return LessThan;
}(_ComparisonBinary2.default); /**
                                * @module ol/format/filter/LessThan
                                */
exports.default = LessThan;

//# sourceMappingURL=LessThan.js.map