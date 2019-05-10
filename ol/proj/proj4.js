'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = register;

var _proj = require('../proj.js');

var _transforms = require('./transforms.js');

var _Projection = require('./Projection.js');

var _Projection2 = _interopRequireDefault(_Projection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Make projections defined in proj4 (with `proj4.defs()`) available in
 * OpenLayers.
 *
 * This function should be called whenever changes are made to the proj4
 * registry, e.g. after calling `proj4.defs()`. Existing transforms will not be
 * modified by this function.
 *
 * @param {?} proj4 Proj4.
 * @api
 */
function register(proj4) {
  var projCodes = Object.keys(proj4.defs);
  var len = projCodes.length;
  var i, j;
  for (i = 0; i < len; ++i) {
    var code = projCodes[i];
    if (!(0, _proj.get)(code)) {
      var def = proj4.defs(code);
      (0, _proj.addProjection)(new _Projection2.default({
        code: code,
        axisOrientation: def.axis,
        metersPerUnit: def.to_meter,
        units: def.units
      }));
    }
  }
  for (i = 0; i < len; ++i) {
    var code1 = projCodes[i];
    var proj1 = (0, _proj.get)(code1);
    for (j = 0; j < len; ++j) {
      var code2 = projCodes[j];
      var proj2 = (0, _proj.get)(code2);
      if (!(0, _transforms.get)(code1, code2)) {
        if (proj4.defs[code1] === proj4.defs[code2]) {
          (0, _proj.addEquivalentProjections)([proj1, proj2]);
        } else {
          var transform = proj4(code1, code2);
          (0, _proj.addCoordinateTransforms)(proj1, proj2, transform.forward, transform.inverse);
        }
      }
    }
  }
}

//# sourceMappingURL=proj4.js.map
/**
 * @module ol/proj/proj4
 */