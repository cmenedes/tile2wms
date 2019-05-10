'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Filter = require('./Filter.js');

var _Filter2 = _interopRequireDefault(_Filter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Represents a logical `<Not>` operator for a filter condition.
 * @api
 */
var Not = /*@__PURE__*/function (Filter) {
  function Not(condition) {

    Filter.call(this, 'Not');

    /**
     * @type {!import("./Filter.js").default}
     */
    this.condition = condition;
  }

  if (Filter) Not.__proto__ = Filter;
  Not.prototype = Object.create(Filter && Filter.prototype);
  Not.prototype.constructor = Not;

  return Not;
}(_Filter2.default); /**
                      * @module ol/format/filter/Not
                      */
exports.default = Not;

//# sourceMappingURL=Not.js.map