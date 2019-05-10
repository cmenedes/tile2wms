'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ComparisonBinary = require('./ComparisonBinary.js');

var _ComparisonBinary2 = _interopRequireDefault(_ComparisonBinary);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Represents a `<PropertyIsEqualTo>` comparison operator.
 * @api
 */
var EqualTo = /*@__PURE__*/function (ComparisonBinary) {
  function EqualTo(propertyName, expression, opt_matchCase) {
    ComparisonBinary.call(this, 'PropertyIsEqualTo', propertyName, expression, opt_matchCase);
  }

  if (ComparisonBinary) EqualTo.__proto__ = ComparisonBinary;
  EqualTo.prototype = Object.create(ComparisonBinary && ComparisonBinary.prototype);
  EqualTo.prototype.constructor = EqualTo;

  return EqualTo;
}(_ComparisonBinary2.default); /**
                                * @module ol/format/filter/EqualTo
                                */
exports.default = EqualTo;

//# sourceMappingURL=EqualTo.js.map