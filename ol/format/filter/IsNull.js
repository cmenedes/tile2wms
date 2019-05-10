'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Comparison = require('./Comparison.js');

var _Comparison2 = _interopRequireDefault(_Comparison);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Represents a `<PropertyIsNull>` comparison operator.
 * @api
 */
var IsNull = /*@__PURE__*/function (Comparison) {
  function IsNull(propertyName) {
    Comparison.call(this, 'PropertyIsNull', propertyName);
  }

  if (Comparison) IsNull.__proto__ = Comparison;
  IsNull.prototype = Object.create(Comparison && Comparison.prototype);
  IsNull.prototype.constructor = IsNull;

  return IsNull;
}(_Comparison2.default); /**
                          * @module ol/format/filter/IsNull
                          */
exports.default = IsNull;

//# sourceMappingURL=IsNull.js.map