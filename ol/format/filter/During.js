'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Comparison = require('./Comparison.js');

var _Comparison2 = _interopRequireDefault(_Comparison);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Represents a `<During>` comparison operator.
 * @api
 */
var During = /*@__PURE__*/function (Comparison) {
  function During(propertyName, begin, end) {
    Comparison.call(this, 'During', propertyName);

    /**
     * @type {!string}
     */
    this.begin = begin;

    /**
     * @type {!string}
     */
    this.end = end;
  }

  if (Comparison) During.__proto__ = Comparison;
  During.prototype = Object.create(Comparison && Comparison.prototype);
  During.prototype.constructor = During;

  return During;
}(_Comparison2.default); /**
                          * @module ol/format/filter/During
                          */
exports.default = During;

//# sourceMappingURL=During.js.map