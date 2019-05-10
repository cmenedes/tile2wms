'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Comparison = require('./Comparison.js');

var _Comparison2 = _interopRequireDefault(_Comparison);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Abstract class; normally only used for creating subclasses and not instantiated in apps.
 * Base class for WFS GetFeature property binary comparison filters.
 *
 * @abstract
 */
var ComparisonBinary = /*@__PURE__*/function (Comparison) {
  function ComparisonBinary(tagName, propertyName, expression, opt_matchCase) {

    Comparison.call(this, tagName, propertyName);

    /**
     * @type {!(string|number)}
     */
    this.expression = expression;

    /**
     * @type {boolean|undefined}
     */
    this.matchCase = opt_matchCase;
  }

  if (Comparison) ComparisonBinary.__proto__ = Comparison;
  ComparisonBinary.prototype = Object.create(Comparison && Comparison.prototype);
  ComparisonBinary.prototype.constructor = ComparisonBinary;

  return ComparisonBinary;
}(_Comparison2.default); /**
                          * @module ol/format/filter/ComparisonBinary
                          */
exports.default = ComparisonBinary;

//# sourceMappingURL=ComparisonBinary.js.map