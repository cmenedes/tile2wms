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
 * Represents a spatial operator to test whether a geometry-valued property
 * relates to a given geometry.
 *
 * @abstract
 */
var Spatial = /*@__PURE__*/function (Filter) {
  function Spatial(tagName, geometryName, geometry, opt_srsName) {

    Filter.call(this, tagName);

    /**
     * @type {!string}
     */
    this.geometryName = geometryName || 'the_geom';

    /**
     * @type {import("../../geom/Geometry.js").default}
     */
    this.geometry = geometry;

    /**
     * @type {string|undefined}
     */
    this.srsName = opt_srsName;
  }

  if (Filter) Spatial.__proto__ = Filter;
  Spatial.prototype = Object.create(Filter && Filter.prototype);
  Spatial.prototype.constructor = Spatial;

  return Spatial;
}(_Filter2.default); /**
                      * @module ol/format/filter/Spatial
                      */
exports.default = Spatial;

//# sourceMappingURL=Spatial.js.map