'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rotationconstraint = require('../rotationconstraint.js');

var _ViewHint = require('../ViewHint.js');

var _ViewHint2 = _interopRequireDefault(_ViewHint);

var _condition = require('../events/condition.js');

var _functions = require('../functions.js');

var _Interaction = require('./Interaction.js');

var _Pointer = require('./Pointer.js');

var _Pointer2 = _interopRequireDefault(_Pointer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} Options
 * @property {import("../events/condition.js").Condition} [condition] A function that takes an
 * {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a boolean
 * to indicate whether that event should be handled.
 * Default is {@link module:ol/events/condition~altShiftKeysOnly}.
 * @property {number} [duration=250] Animation duration in milliseconds.
 */

/**
 * @classdesc
 * Allows the user to rotate the map by clicking and dragging on the map,
 * normally combined with an {@link module:ol/events/condition} that limits
 * it to when the alt and shift keys are held down.
 *
 * This interaction is only supported for mouse devices.
 * @api
 */
/**
 * @module ol/interaction/DragRotate
 */
var DragRotate = /*@__PURE__*/function (PointerInteraction) {
  function DragRotate(opt_options) {

    var options = opt_options ? opt_options : {};

    PointerInteraction.call(this, {
      stopDown: _functions.FALSE
    });

    /**
     * @private
     * @type {import("../events/condition.js").Condition}
     */
    this.condition_ = options.condition ? options.condition : _condition.altShiftKeysOnly;

    /**
     * @private
     * @type {number|undefined}
     */
    this.lastAngle_ = undefined;

    /**
     * @private
     * @type {number}
     */
    this.duration_ = options.duration !== undefined ? options.duration : 250;
  }

  if (PointerInteraction) DragRotate.__proto__ = PointerInteraction;
  DragRotate.prototype = Object.create(PointerInteraction && PointerInteraction.prototype);
  DragRotate.prototype.constructor = DragRotate;

  /**
   * @inheritDoc
   */
  DragRotate.prototype.handleDragEvent = function handleDragEvent(mapBrowserEvent) {
    if (!(0, _condition.mouseOnly)(mapBrowserEvent)) {
      return;
    }

    var map = mapBrowserEvent.map;
    var view = map.getView();
    if (view.getConstraints().rotation === _rotationconstraint.disable) {
      return;
    }
    var size = map.getSize();
    var offset = mapBrowserEvent.pixel;
    var theta = Math.atan2(size[1] / 2 - offset[1], offset[0] - size[0] / 2);
    if (this.lastAngle_ !== undefined) {
      var delta = theta - this.lastAngle_;
      var rotation = view.getRotation();
      (0, _Interaction.rotateWithoutConstraints)(view, rotation - delta);
    }
    this.lastAngle_ = theta;
  };

  /**
   * @inheritDoc
   */
  DragRotate.prototype.handleUpEvent = function handleUpEvent(mapBrowserEvent) {
    if (!(0, _condition.mouseOnly)(mapBrowserEvent)) {
      return true;
    }

    var map = mapBrowserEvent.map;
    var view = map.getView();
    view.setHint(_ViewHint2.default.INTERACTING, -1);
    var rotation = view.getRotation();
    (0, _Interaction.rotate)(view, rotation, undefined, this.duration_);
    return false;
  };

  /**
   * @inheritDoc
   */
  DragRotate.prototype.handleDownEvent = function handleDownEvent(mapBrowserEvent) {
    if (!(0, _condition.mouseOnly)(mapBrowserEvent)) {
      return false;
    }

    if ((0, _condition.mouseActionButton)(mapBrowserEvent) && this.condition_(mapBrowserEvent)) {
      var map = mapBrowserEvent.map;
      map.getView().setHint(_ViewHint2.default.INTERACTING, 1);
      this.lastAngle_ = undefined;
      return true;
    } else {
      return false;
    }
  };

  return DragRotate;
}(_Pointer2.default);

exports.default = DragRotate;

//# sourceMappingURL=DragRotate.js.map