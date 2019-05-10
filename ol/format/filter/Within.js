'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Spatial = require('./Spatial.js');

var _Spatial2 = _interopRequireDefault(_Spatial);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Represents a `<Within>` operator to test whether a geometry-valued property
 * is within a given geometry.
 * @api
 */
var Within = /*@__PURE__*/function (Spatial) {
  function Within(geometryName, geometry, opt_srsName) {
    Spatial.call(this, 'Within', geometryName, geometry, opt_srsName);
  }

  if (Spatial) Within.__proto__ = Spatial;
  Within.prototype = Object.create(Spatial && Spatial.prototype);
  Within.prototype.constructor = Within;

  return Within;
}(_Spatial2.default); /**
                       * @module ol/format/filter/Within
                       */
exports.default = Within;

//# sourceMappingURL=Within.js.map