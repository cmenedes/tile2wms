'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaults = defaults;

var _Collection = require('../Collection.js');

var _Collection2 = _interopRequireDefault(_Collection);

var _Attribution = require('./Attribution.js');

var _Attribution2 = _interopRequireDefault(_Attribution);

var _Rotate = require('./Rotate.js');

var _Rotate2 = _interopRequireDefault(_Rotate);

var _Zoom = require('./Zoom.js');

var _Zoom2 = _interopRequireDefault(_Zoom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} DefaultsOptions
 * @property {boolean} [attribution=true] Include
 * {@link module:ol/control/Attribution~Attribution}.
 * @property {import("./Attribution.js").Options} [attributionOptions]
 * Options for {@link module:ol/control/Attribution~Attribution}.
 * @property {boolean} [rotate=true] Include
 * {@link module:ol/control/Rotate~Rotate}.
 * @property {import("./Rotate.js").Options} [rotateOptions] Options
 * for {@link module:ol/control/Rotate~Rotate}.
 * @property {boolean} [zoom] Include {@link module:ol/control/Zoom~Zoom}.
 * @property {import("./Zoom.js").Options} [zoomOptions] Options for
 * {@link module:ol/control/Zoom~Zoom}.
 * @api
 */

/**
 * Set of controls included in maps by default. Unless configured otherwise,
 * this returns a collection containing an instance of each of the following
 * controls:
 * * {@link module:ol/control/Zoom~Zoom}
 * * {@link module:ol/control/Rotate~Rotate}
 * * {@link module:ol/control/Attribution~Attribution}
 *
 * @param {DefaultsOptions=} opt_options
 * Defaults options.
 * @return {Collection<import("./Control.js").default>}
 * Controls.
 * @function module:ol/control.defaults
 * @api
 */
/**
 * @module ol/control/util
 */
function defaults(opt_options) {

  var options = opt_options ? opt_options : {};

  var controls = new _Collection2.default();

  var zoomControl = options.zoom !== undefined ? options.zoom : true;
  if (zoomControl) {
    controls.push(new _Zoom2.default(options.zoomOptions));
  }

  var rotateControl = options.rotate !== undefined ? options.rotate : true;
  if (rotateControl) {
    controls.push(new _Rotate2.default(options.rotateOptions));
  }

  var attributionControl = options.attribution !== undefined ? options.attribution : true;
  if (attributionControl) {
    controls.push(new _Attribution2.default(options.attributionOptions));
  }

  return controls;
}

//# sourceMappingURL=util.js.map