'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Translate = exports.Snap = exports.Select = exports.Pointer = exports.PinchZoom = exports.PinchRotate = exports.MouseWheelZoom = exports.Modify = exports.KeyboardZoom = exports.KeyboardPan = exports.Interaction = exports.Extent = exports.Draw = exports.DragZoom = exports.DragRotateAndZoom = exports.DragRotate = exports.DragPan = exports.DragBox = exports.DragAndDrop = exports.DoubleClickZoom = undefined;

var _DoubleClickZoom = require('./interaction/DoubleClickZoom.js');

Object.defineProperty(exports, 'DoubleClickZoom', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DoubleClickZoom).default;
  }
});

var _DragAndDrop = require('./interaction/DragAndDrop.js');

Object.defineProperty(exports, 'DragAndDrop', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragAndDrop).default;
  }
});

var _DragBox = require('./interaction/DragBox.js');

Object.defineProperty(exports, 'DragBox', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragBox).default;
  }
});

var _DragPan = require('./interaction/DragPan.js');

Object.defineProperty(exports, 'DragPan', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragPan).default;
  }
});

var _DragRotate = require('./interaction/DragRotate.js');

Object.defineProperty(exports, 'DragRotate', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragRotate).default;
  }
});

var _DragRotateAndZoom = require('./interaction/DragRotateAndZoom.js');

Object.defineProperty(exports, 'DragRotateAndZoom', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragRotateAndZoom).default;
  }
});

var _DragZoom = require('./interaction/DragZoom.js');

Object.defineProperty(exports, 'DragZoom', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_DragZoom).default;
  }
});

var _Draw = require('./interaction/Draw.js');

Object.defineProperty(exports, 'Draw', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Draw).default;
  }
});

var _Extent = require('./interaction/Extent.js');

Object.defineProperty(exports, 'Extent', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Extent).default;
  }
});

var _Interaction = require('./interaction/Interaction.js');

Object.defineProperty(exports, 'Interaction', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Interaction).default;
  }
});

var _KeyboardPan = require('./interaction/KeyboardPan.js');

Object.defineProperty(exports, 'KeyboardPan', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_KeyboardPan).default;
  }
});

var _KeyboardZoom = require('./interaction/KeyboardZoom.js');

Object.defineProperty(exports, 'KeyboardZoom', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_KeyboardZoom).default;
  }
});

var _Modify = require('./interaction/Modify.js');

Object.defineProperty(exports, 'Modify', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Modify).default;
  }
});

var _MouseWheelZoom = require('./interaction/MouseWheelZoom.js');

Object.defineProperty(exports, 'MouseWheelZoom', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_MouseWheelZoom).default;
  }
});

var _PinchRotate = require('./interaction/PinchRotate.js');

Object.defineProperty(exports, 'PinchRotate', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_PinchRotate).default;
  }
});

var _PinchZoom = require('./interaction/PinchZoom.js');

Object.defineProperty(exports, 'PinchZoom', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_PinchZoom).default;
  }
});

var _Pointer = require('./interaction/Pointer.js');

Object.defineProperty(exports, 'Pointer', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Pointer).default;
  }
});

var _Select = require('./interaction/Select.js');

Object.defineProperty(exports, 'Select', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Select).default;
  }
});

var _Snap = require('./interaction/Snap.js');

Object.defineProperty(exports, 'Snap', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Snap).default;
  }
});

var _Translate = require('./interaction/Translate.js');

Object.defineProperty(exports, 'Translate', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Translate).default;
  }
});
exports.defaults = defaults;

var _Collection = require('./Collection.js');

var _Collection2 = _interopRequireDefault(_Collection);

var _Kinetic = require('./Kinetic.js');

var _Kinetic2 = _interopRequireDefault(_Kinetic);

var _DoubleClickZoom2 = _interopRequireDefault(_DoubleClickZoom);

var _DragPan2 = _interopRequireDefault(_DragPan);

var _DragRotate2 = _interopRequireDefault(_DragRotate);

var _DragZoom2 = _interopRequireDefault(_DragZoom);

var _KeyboardPan2 = _interopRequireDefault(_KeyboardPan);

var _KeyboardZoom2 = _interopRequireDefault(_KeyboardZoom);

var _MouseWheelZoom2 = _interopRequireDefault(_MouseWheelZoom);

var _PinchRotate2 = _interopRequireDefault(_PinchRotate);

var _PinchZoom2 = _interopRequireDefault(_PinchZoom);

var _condition = require('./events/condition.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} DefaultsOptions
 * @property {boolean} [altShiftDragRotate=true] Whether Alt-Shift-drag rotate is
 * desired.
 * @property {boolean} [onFocusOnly=false] Interact only when the map has the
 * focus. This affects the `MouseWheelZoom` and `DragPan` interactions and is
 * useful when page scroll is desired for maps that do not have the browser's
 * focus.
 * @property {boolean} [constrainResolution=false] Zoom to the closest integer
 * zoom level after the wheel/trackpad or pinch gesture ends.
 * @property {boolean} [doubleClickZoom=true] Whether double click zoom is
 * desired.
 * @property {boolean} [keyboard=true] Whether keyboard interaction is desired.
 * @property {boolean} [mouseWheelZoom=true] Whether mousewheel zoom is desired.
 * @property {boolean} [shiftDragZoom=true] Whether Shift-drag zoom is desired.
 * @property {boolean} [dragPan=true] Whether drag pan is desired.
 * @property {boolean} [pinchRotate=true] Whether pinch rotate is desired.
 * @property {boolean} [pinchZoom=true] Whether pinch zoom is desired.
 * @property {number} [zoomDelta] Zoom level delta when using keyboard or
 * mousewheel zoom.
 * @property {number} [zoomDuration] Duration of the zoom animation in
 * milliseconds.
 */

/**
 * Set of interactions included in maps by default. Specific interactions can be
 * excluded by setting the appropriate option to false in the constructor
 * options, but the order of the interactions is fixed.  If you want to specify
 * a different order for interactions, you will need to create your own
 * {@link module:ol/interaction/Interaction} instances and insert
 * them into a {@link module:ol/Collection} in the order you want
 * before creating your {@link module:ol/Map~Map} instance. The default set of
 * interactions, in sequence, is:
 * * {@link module:ol/interaction/DragRotate~DragRotate}
 * * {@link module:ol/interaction/DoubleClickZoom~DoubleClickZoom}
 * * {@link module:ol/interaction/DragPan~DragPan}
 * * {@link module:ol/interaction/PinchRotate~PinchRotate}
 * * {@link module:ol/interaction/PinchZoom~PinchZoom}
 * * {@link module:ol/interaction/KeyboardPan~KeyboardPan}
 * * {@link module:ol/interaction/KeyboardZoom~KeyboardZoom}
 * * {@link module:ol/interaction/MouseWheelZoom~MouseWheelZoom}
 * * {@link module:ol/interaction/DragZoom~DragZoom}
 *
 * @param {DefaultsOptions=} opt_options Defaults options.
 * @return {import("./Collection.js").default<import("./interaction/Interaction.js").default>}
 * A collection of interactions to be used with the {@link module:ol/Map~Map}
 * constructor's `interactions` option.
 * @api
 */
function defaults(opt_options) {

  var options = opt_options ? opt_options : {};

  var interactions = new _Collection2.default();

  var kinetic = new _Kinetic2.default(-0.005, 0.05, 100);

  var altShiftDragRotate = options.altShiftDragRotate !== undefined ? options.altShiftDragRotate : true;
  if (altShiftDragRotate) {
    interactions.push(new _DragRotate2.default());
  }

  var doubleClickZoom = options.doubleClickZoom !== undefined ? options.doubleClickZoom : true;
  if (doubleClickZoom) {
    interactions.push(new _DoubleClickZoom2.default({
      delta: options.zoomDelta,
      duration: options.zoomDuration
    }));
  }

  var dragPan = options.dragPan !== undefined ? options.dragPan : true;
  if (dragPan) {
    interactions.push(new _DragPan2.default({
      condition: options.onFocusOnly ? _condition.focus : undefined,
      kinetic: kinetic
    }));
  }

  var pinchRotate = options.pinchRotate !== undefined ? options.pinchRotate : true;
  if (pinchRotate) {
    interactions.push(new _PinchRotate2.default());
  }

  var pinchZoom = options.pinchZoom !== undefined ? options.pinchZoom : true;
  if (pinchZoom) {
    interactions.push(new _PinchZoom2.default({
      constrainResolution: options.constrainResolution,
      duration: options.zoomDuration
    }));
  }

  var keyboard = options.keyboard !== undefined ? options.keyboard : true;
  if (keyboard) {
    interactions.push(new _KeyboardPan2.default());
    interactions.push(new _KeyboardZoom2.default({
      delta: options.zoomDelta,
      duration: options.zoomDuration
    }));
  }

  var mouseWheelZoom = options.mouseWheelZoom !== undefined ? options.mouseWheelZoom : true;
  if (mouseWheelZoom) {
    interactions.push(new _MouseWheelZoom2.default({
      condition: options.onFocusOnly ? _condition.focus : undefined,
      constrainResolution: options.constrainResolution,
      duration: options.zoomDuration
    }));
  }

  var shiftDragZoom = options.shiftDragZoom !== undefined ? options.shiftDragZoom : true;
  if (shiftDragZoom) {
    interactions.push(new _DragZoom2.default({
      duration: options.zoomDuration
    }));
  }

  return interactions;
}

//# sourceMappingURL=interaction.js.map