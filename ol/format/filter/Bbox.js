'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Filter = require('./Filter.js');

var _Filter2 = _interopRequireDefault(_Filter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Represents a `<BBOX>` operator to test whether a geometry-valued property
 * intersects a fixed bounding box
 *
 * @api
 */
var Bbox = /*@__PURE__*/function (Filter) {
  function Bbox(geometryName, extent, opt_srsName) {

    Filter.call(this, 'BBOX');

    /**
     * @type {!string}
     */
    this.geometryName = geometryName;

    /**
     * @type {import("../../extent.js").Extent}
     */
    this.extent = extent;

    /**
     * @type {string|undefined}
     */
    this.srsName = opt_srsName;
  }

  if (Filter) Bbox.__proto__ = Filter;
  Bbox.prototype = Object.create(Filter && Filter.prototype);
  Bbox.prototype.constructor = Bbox;

  return Bbox;
}(_Filter2.default); /**
                      * @module ol/format/filter/Bbox
                      */
exports.default = Bbox;

//# sourceMappingURL=Bbox.js.map