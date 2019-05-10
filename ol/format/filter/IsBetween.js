'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Comparison = require('./Comparison.js');

var _Comparison2 = _interopRequireDefault(_Comparison);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Represents a `<PropertyIsBetween>` comparison operator.
 * @api
 */
var IsBetween = /*@__PURE__*/function (Comparison) {
  function IsBetween(propertyName, lowerBoundary, upperBoundary) {
    Comparison.call(this, 'PropertyIsBetween', propertyName);

    /**
     * @type {!number}
     */
    this.lowerBoundary = lowerBoundary;

    /**
     * @type {!number}
     */
    this.upperBoundary = upperBoundary;
  }

  if (Comparison) IsBetween.__proto__ = Comparison;
  IsBetween.prototype = Object.create(Comparison && Comparison.prototype);
  IsBetween.prototype.constructor = IsBetween;

  return IsBetween;
}(_Comparison2.default); /**
                          * @module ol/format/filter/IsBetween
                          */
exports.default = IsBetween;

//# sourceMappingURL=IsBetween.js.map