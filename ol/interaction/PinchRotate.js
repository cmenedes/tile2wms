'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ViewHint = require('../ViewHint.js');

var _ViewHint2 = _interopRequireDefault(_ViewHint);

var _functions = require('../functions.js');

var _Interaction = require('./Interaction.js');

var _Pointer = require('./Pointer.js');

var _Pointer2 = _interopRequireDefault(_Pointer);

var _rotationconstraint = require('../rotationconstraint.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} Options
 * @property {number} [duration=250] The duration of the animation in
 * milliseconds.
 * @property {number} [threshold=0.3] Minimal angle in radians to start a rotation.
 */

/**
 * @classdesc
 * Allows the user to rotate the map by twisting with two fingers
 * on a touch screen.
 * @api
 */
var PinchRotate = /*@__PURE__*/function (PointerInteraction) {
  function PinchRotate(opt_options) {

    var options = opt_options ? opt_options : {};

    var pointerOptions = /** @type {import("./Pointer.js").Options} */options;

    if (!pointerOptions.stopDown) {
      pointerOptions.stopDown = _functions.FALSE;
    }

    PointerInteraction.call(this, pointerOptions);

    /**
     * @private
     * @type {import("../coordinate.js").Coordinate}
     */
    this.anchor_ = null;

    /**
     * @private
     * @type {number|undefined}
     */
    this.lastAngle_ = undefined;

    /**
     * @private
     * @type {boolean}
     */
    this.rotating_ = false;

    /**
     * @private
     * @type {number}
     */
    this.rotationDelta_ = 0.0;

    /**
     * @private
     * @type {number}
     */
    this.threshold_ = options.threshold !== undefined ? options.threshold : 0.3;

    /**
     * @private
     * @type {number}
     */
    this.duration_ = options.duration !== undefined ? options.duration : 250;
  }

  if (PointerInteraction) PinchRotate.__proto__ = PointerInteraction;
  PinchRotate.prototype = Object.create(PointerInteraction && PointerInteraction.prototype);
  PinchRotate.prototype.constructor = PinchRotate;

  /**
   * @inheritDoc
   */
  PinchRotate.prototype.handleDragEvent = function handleDragEvent(mapBrowserEvent) {
    var rotationDelta = 0.0;

    var touch0 = this.targetPointers[0];
    var touch1 = this.targetPointers[1];

    // angle between touches
    var angle = Math.atan2(touch1.clientY - touch0.clientY, touch1.clientX - touch0.clientX);

    if (this.lastAngle_ !== undefined) {
      var delta = angle - this.lastAngle_;
      this.rotationDelta_ += delta;
      if (!this.rotating_ && Math.abs(this.rotationDelta_) > this.threshold_) {
        this.rotating_ = true;
      }
      rotationDelta = delta;
    }
    this.lastAngle_ = angle;

    var map = mapBrowserEvent.map;
    var view = map.getView();
    if (view.getConstraints().rotation === _rotationconstraint.disable) {
      return;
    }

    // rotate anchor point.
    // FIXME: should be the intersection point between the lines:
    //     touch0,touch1 and previousTouch0,previousTouch1
    var viewportPosition = map.getViewport().getBoundingClientRect();
    var centroid = (0, _Pointer.centroid)(this.targetPointers);
    centroid[0] -= viewportPosition.left;
    centroid[1] -= viewportPosition.top;
    this.anchor_ = map.getCoordinateFromPixel(centroid);

    // rotate
    if (this.rotating_) {
      var rotation = view.getRotation();
      map.render();
      (0, _Interaction.rotateWithoutConstraints)(view, rotation + rotationDelta, this.anchor_);
    }
  };

  /**
   * @inheritDoc
   */
  PinchRotate.prototype.handleUpEvent = function handleUpEvent(mapBrowserEvent) {
    if (this.targetPointers.length < 2) {
      var map = mapBrowserEvent.map;
      var view = map.getView();
      view.setHint(_ViewHint2.default.INTERACTING, -1);
      if (this.rotating_) {
        var rotation = view.getRotation();
        (0, _Interaction.rotate)(view, rotation, this.anchor_, this.duration_);
      }
      return false;
    } else {
      return true;
    }
  };

  /**
   * @inheritDoc
   */
  PinchRotate.prototype.handleDownEvent = function handleDownEvent(mapBrowserEvent) {
    if (this.targetPointers.length >= 2) {
      var map = mapBrowserEvent.map;
      this.anchor_ = null;
      this.lastAngle_ = undefined;
      this.rotating_ = false;
      this.rotationDelta_ = 0.0;
      if (!this.handlingDownUpSequence) {
        map.getView().setHint(_ViewHint2.default.INTERACTING, 1);
      }
      return true;
    } else {
      return false;
    }
  };

  return PinchRotate;
}(_Pointer2.default); /**
                       * @module ol/interaction/PinchRotate
                       */
exports.default = PinchRotate;

//# sourceMappingURL=PinchRotate.js.map