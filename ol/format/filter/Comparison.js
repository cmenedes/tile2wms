'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Filter = require('./Filter.js');

var _Filter2 = _interopRequireDefault(_Filter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Abstract class; normally only used for creating subclasses and not instantiated in apps.
 * Base class for WFS GetFeature property comparison filters.
 *
 * @abstract
 */
var Comparison = /*@__PURE__*/function (Filter) {
  function Comparison(tagName, propertyName) {

    Filter.call(this, tagName);

    /**
     * @type {!string}
     */
    this.propertyName = propertyName;
  }

  if (Filter) Comparison.__proto__ = Filter;
  Comparison.prototype = Object.create(Filter && Filter.prototype);
  Comparison.prototype.constructor = Comparison;

  return Comparison;
}(_Filter2.default); /**
                      * @module ol/format/filter/Comparison
                      */
exports.default = Comparison;

//# sourceMappingURL=Comparison.js.map