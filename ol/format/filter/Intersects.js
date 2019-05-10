'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Spatial = require('./Spatial.js');

var _Spatial2 = _interopRequireDefault(_Spatial);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Represents a `<Intersects>` operator to test whether a geometry-valued property
 * intersects a given geometry.
 * @api
 */
var Intersects = /*@__PURE__*/function (Spatial) {
  function Intersects(geometryName, geometry, opt_srsName) {
    Spatial.call(this, 'Intersects', geometryName, geometry, opt_srsName);
  }

  if (Spatial) Intersects.__proto__ = Spatial;
  Intersects.prototype = Object.create(Spatial && Spatial.prototype);
  Intersects.prototype.constructor = Intersects;

  return Intersects;
}(_Spatial2.default); /**
                       * @module ol/format/filter/Intersects
                       */
exports.default = Intersects;

//# sourceMappingURL=Intersects.js.map