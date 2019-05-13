'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _easing = require('../easing.js');

var _condition = require('../events/condition.js');

var _extent = require('../extent.js');

var _DragBox = require('./DragBox.js');

var _DragBox2 = _interopRequireDefault(_DragBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} Options
 * @property {string} [className='ol-dragzoom'] CSS class name for styling the
 * box.
 * @property {import("../events/condition.js").Condition} [condition] A function that
 * takes an {@link module:ol/MapBrowserEvent~MapBrowserEvent} and returns a
 * boolean to indicate whether that event should be handled.
 * Default is {@link module:ol/events/condition~shiftKeyOnly}.
 * @property {number} [duration=200] Animation duration in milliseconds.
 * @property {boolean} [out=false] Use interaction for zooming out.
 */

/**
 * @classdesc
 * Allows the user to zoom the map by clicking and dragging on the map,
 * normally combined with an {@link module:ol/events/condition} that limits
 * it to when a key, shift by default, is held down.
 *
 * To change the style of the box, use CSS and the `.ol-dragzoom` selector, or
 * your custom one configured with `className`.
 * @api
 */
/**
 * @module ol/interaction/DragZoom
 */
var DragZoom = /*@__PURE__*/function (DragBox) {
  function DragZoom(opt_options) {
    var options = opt_options ? opt_options : {};

    var condition = options.condition ? options.condition : _condition.shiftKeyOnly;

    DragBox.call(this, {
      condition: condition,
      className: options.className || 'ol-dragzoom',
      onBoxEnd: onBoxEnd
    });

    /**
     * @private
     * @type {number}
     */
    this.duration_ = options.duration !== undefined ? options.duration : 200;

    /**
     * @private
     * @type {boolean}
     */
    this.out_ = options.out !== undefined ? options.out : false;
  }

  if (DragBox) DragZoom.__proto__ = DragBox;
  DragZoom.prototype = Object.create(DragBox && DragBox.prototype);
  DragZoom.prototype.constructor = DragZoom;

  return DragZoom;
}(_DragBox2.default);

/**
 * @this {DragZoom}
 */
function onBoxEnd() {
  var map = this.getMap();
  var view = /** @type {!import("../View.js").default} */map.getView();
  var size = /** @type {!import("../size.js").Size} */map.getSize();
  var extent = this.getGeometry().getExtent();

  if (this.out_) {
    var mapExtent = view.calculateExtent(size);
    var boxPixelExtent = (0, _extent.createOrUpdateFromCoordinates)([map.getPixelFromCoordinate((0, _extent.getBottomLeft)(extent)), map.getPixelFromCoordinate((0, _extent.getTopRight)(extent))]);
    var factor = view.getResolutionForExtent(boxPixelExtent, size);

    (0, _extent.scaleFromCenter)(mapExtent, 1 / factor);
    extent = mapExtent;
  }

  var resolution = view.constrainResolution(view.getResolutionForExtent(extent, size));

  var center = (0, _extent.getCenter)(extent);
  center = view.constrainCenter(center);

  view.animate({
    resolution: resolution,
    center: center,
    duration: this.duration_,
    easing: _easing.easeOut
  });
}

exports.default = DragZoom;

//# sourceMappingURL=DragZoom.js.map