'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pan = pan;
exports.rotate = rotate;
exports.rotateWithoutConstraints = rotateWithoutConstraints;
exports.zoom = zoom;
exports.zoomByDelta = zoomByDelta;
exports.zoomWithoutConstraints = zoomWithoutConstraints;

var _Object = require('../Object.js');

var _Object2 = _interopRequireDefault(_Object);

var _easing = require('../easing.js');

var _Property = require('./Property.js');

var _Property2 = _interopRequireDefault(_Property);

var _math = require('../math.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Object literal with config options for interactions.
 * @typedef {Object} InteractionOptions
 * @property {function(import("../MapBrowserEvent.js").default):boolean} handleEvent
 * Method called by the map to notify the interaction that a browser event was
 * dispatched to the map. If the function returns a falsy value, propagation of
 * the event to other interactions in the map's interactions chain will be
 * prevented (this includes functions with no explicit return).
 */

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * User actions that change the state of the map. Some are similar to controls,
 * but are not associated with a DOM element.
 * For example, {@link module:ol/interaction/KeyboardZoom~KeyboardZoom} is
 * functionally the same as {@link module:ol/control/Zoom~Zoom}, but triggered
 * by a keyboard event not a button element event.
 * Although interactions do not have a DOM element, some of them do render
 * vectors and so are visible on the screen.
 * @api
 */
/**
 * @module ol/interaction/Interaction
 */
var Interaction = /*@__PURE__*/function (BaseObject) {
  function Interaction(options) {
    BaseObject.call(this);

    if (options.handleEvent) {
      this.handleEvent = options.handleEvent;
    }

    /**
     * @private
     * @type {import("../PluggableMap.js").default}
     */
    this.map_ = null;

    this.setActive(true);
  }

  if (BaseObject) Interaction.__proto__ = BaseObject;
  Interaction.prototype = Object.create(BaseObject && BaseObject.prototype);
  Interaction.prototype.constructor = Interaction;

  /**
   * Return whether the interaction is currently active.
   * @return {boolean} `true` if the interaction is active, `false` otherwise.
   * @observable
   * @api
   */
  Interaction.prototype.getActive = function getActive() {
    return (/** @type {boolean} */this.get(_Property2.default.ACTIVE)
    );
  };

  /**
   * Get the map associated with this interaction.
   * @return {import("../PluggableMap.js").default} Map.
   * @api
   */
  Interaction.prototype.getMap = function getMap() {
    return this.map_;
  };

  /**
   * Handles the {@link module:ol/MapBrowserEvent map browser event}.
   * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
   * @return {boolean} `false` to stop event propagation.
   * @api
   */
  Interaction.prototype.handleEvent = function handleEvent(mapBrowserEvent) {
    return true;
  };

  /**
   * Activate or deactivate the interaction.
   * @param {boolean} active Active.
   * @observable
   * @api
   */
  Interaction.prototype.setActive = function setActive(active) {
    this.set(_Property2.default.ACTIVE, active);
  };

  /**
   * Remove the interaction from its current map and attach it to the new map.
   * Subclasses may set up event handlers to get notified about changes to
   * the map here.
   * @param {import("../PluggableMap.js").default} map Map.
   */
  Interaction.prototype.setMap = function setMap(map) {
    this.map_ = map;
  };

  return Interaction;
}(_Object2.default);

/**
 * @param {import("../View.js").default} view View.
 * @param {import("../coordinate.js").Coordinate} delta Delta.
 * @param {number=} opt_duration Duration.
 */
function pan(view, delta, opt_duration) {
  var currentCenter = view.getCenter();
  if (currentCenter) {
    var center = view.constrainCenter([currentCenter[0] + delta[0], currentCenter[1] + delta[1]]);
    if (opt_duration) {
      view.animate({
        duration: opt_duration,
        easing: _easing.linear,
        center: center
      });
    } else {
      view.setCenter(center);
    }
  }
}

/**
 * @param {import("../View.js").default} view View.
 * @param {number|undefined} rotation Rotation.
 * @param {import("../coordinate.js").Coordinate=} opt_anchor Anchor coordinate.
 * @param {number=} opt_duration Duration.
 */
function rotate(view, rotation, opt_anchor, opt_duration) {
  rotation = view.constrainRotation(rotation, 0);
  rotateWithoutConstraints(view, rotation, opt_anchor, opt_duration);
}

/**
 * @param {import("../View.js").default} view View.
 * @param {number|undefined} rotation Rotation.
 * @param {import("../coordinate.js").Coordinate=} opt_anchor Anchor coordinate.
 * @param {number=} opt_duration Duration.
 */
function rotateWithoutConstraints(view, rotation, opt_anchor, opt_duration) {
  if (rotation !== undefined) {
    var currentRotation = view.getRotation();
    var currentCenter = view.getCenter();
    if (currentRotation !== undefined && currentCenter && opt_duration > 0) {
      view.animate({
        rotation: rotation,
        anchor: opt_anchor,
        duration: opt_duration,
        easing: _easing.easeOut
      });
    } else {
      view.rotate(rotation, opt_anchor);
    }
  }
}

/**
 * @param {import("../View.js").default} view View.
 * @param {number|undefined} resolution Resolution to go to.
 * @param {import("../coordinate.js").Coordinate=} opt_anchor Anchor coordinate.
 * @param {number=} opt_duration Duration.
 * @param {number=} opt_direction Zooming direction; > 0 indicates
 *     zooming out, in which case the constraints system will select
 *     the largest nearest resolution; < 0 indicates zooming in, in
 *     which case the constraints system will select the smallest
 *     nearest resolution; == 0 indicates that the zooming direction
 *     is unknown/not relevant, in which case the constraints system
 *     will select the nearest resolution. If not defined 0 is
 *     assumed.
 */
function zoom(view, resolution, opt_anchor, opt_duration, opt_direction) {
  resolution = view.constrainResolution(resolution, 0, opt_direction);
  zoomWithoutConstraints(view, resolution, opt_anchor, opt_duration);
}

/**
 * @param {import("../View.js").default} view View.
 * @param {number} delta Delta from previous zoom level.
 * @param {import("../coordinate.js").Coordinate=} opt_anchor Anchor coordinate.
 * @param {number=} opt_duration Duration.
 */
function zoomByDelta(view, delta, opt_anchor, opt_duration) {
  var currentResolution = view.getResolution();
  var resolution = view.constrainResolution(currentResolution, delta, 0);

  if (resolution !== undefined) {
    var resolutions = view.getResolutions();
    resolution = (0, _math.clamp)(resolution, view.getMinResolution() || resolutions[resolutions.length - 1], view.getMaxResolution() || resolutions[0]);
  }

  // If we have a constraint on center, we need to change the anchor so that the
  // new center is within the extent. We first calculate the new center, apply
  // the constraint to it, and then calculate back the anchor
  if (opt_anchor && resolution !== undefined && resolution !== currentResolution) {
    var currentCenter = view.getCenter();
    var center = view.calculateCenterZoom(resolution, opt_anchor);
    center = view.constrainCenter(center);

    opt_anchor = [(resolution * currentCenter[0] - currentResolution * center[0]) / (resolution - currentResolution), (resolution * currentCenter[1] - currentResolution * center[1]) / (resolution - currentResolution)];
  }

  zoomWithoutConstraints(view, resolution, opt_anchor, opt_duration);
}

/**
 * @param {import("../View.js").default} view View.
 * @param {number|undefined} resolution Resolution to go to.
 * @param {import("../coordinate.js").Coordinate=} opt_anchor Anchor coordinate.
 * @param {number=} opt_duration Duration.
 */
function zoomWithoutConstraints(view, resolution, opt_anchor, opt_duration) {
  if (resolution) {
    var currentResolution = view.getResolution();
    var currentCenter = view.getCenter();
    if (currentResolution !== undefined && currentCenter && resolution !== currentResolution && opt_duration) {
      view.animate({
        resolution: resolution,
        anchor: opt_anchor,
        duration: opt_duration,
        easing: _easing.easeOut
      });
    } else {
      if (opt_anchor) {
        var center = view.calculateCenterZoom(resolution, opt_anchor);
        view.setCenter(center);
      }
      view.setResolution(resolution);
    }
  }
}

exports.default = Interaction;

//# sourceMappingURL=Interaction.js.map