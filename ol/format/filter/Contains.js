'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Spatial = require('./Spatial.js');

var _Spatial2 = _interopRequireDefault(_Spatial);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Represents a `<Contains>` operator to test whether a geometry-valued property
 * contains a given geometry.
 * @api
 */
var Contains = /*@__PURE__*/function (Spatial) {
  function Contains(geometryName, geometry, opt_srsName) {

    Spatial.call(this, 'Contains', geometryName, geometry, opt_srsName);
  }

  if (Spatial) Contains.__proto__ = Spatial;
  Contains.prototype = Object.create(Spatial && Spatial.prototype);
  Contains.prototype.constructor = Contains;

  return Contains;
}(_Spatial2.default); /**
                       * @module ol/format/filter/Contains
                       */
exports.default = Contains;

//# sourceMappingURL=Contains.js.map