'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _asserts = require('../../asserts.js');

var _Filter = require('./Filter.js');

var _Filter2 = _interopRequireDefault(_Filter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Abstract class; normally only used for creating subclasses and not instantiated in apps.
 * Base class for WFS GetFeature n-ary logical filters.
 *
 * @abstract
 */
/**
 * @module ol/format/filter/LogicalNary
 */
var LogicalNary = /*@__PURE__*/function (Filter) {
  function LogicalNary(tagName, conditions) {

    Filter.call(this, tagName);

    /**
     * @type {Array<import("./Filter.js").default>}
     */
    this.conditions = conditions;
    (0, _asserts.assert)(this.conditions.length >= 2, 57); // At least 2 conditions are required.
  }

  if (Filter) LogicalNary.__proto__ = Filter;
  LogicalNary.prototype = Object.create(Filter && Filter.prototype);
  LogicalNary.prototype.constructor = LogicalNary;

  return LogicalNary;
}(_Filter2.default);

exports.default = LogicalNary;

//# sourceMappingURL=LogicalNary.js.map