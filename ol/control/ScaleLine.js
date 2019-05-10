'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Units = undefined;
exports.render = render;

var _Object = require('../Object.js');

var _asserts = require('../asserts.js');

var _Control = require('./Control.js');

var _Control2 = _interopRequireDefault(_Control);

var _css = require('../css.js');

var _events = require('../events.js');

var _proj = require('../proj.js');

var _Units = require('../proj/Units.js');

var _Units2 = _interopRequireDefault(_Units);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @type {string}
 */
var UNITS_PROP = 'units';

/**
 * Units for the scale line. Supported values are `'degrees'`, `'imperial'`,
 * `'nautical'`, `'metric'`, `'us'`.
 * @enum {string}
 */
/**
 * @module ol/control/ScaleLine
 */
var Units = exports.Units = {
  DEGREES: 'degrees',
  IMPERIAL: 'imperial',
  NAUTICAL: 'nautical',
  METRIC: 'metric',
  US: 'us'
};

/**
 * @const
 * @type {Array<number>}
 */
var LEADING_DIGITS = [1, 2, 5];

/**
 * @typedef {Object} Options
 * @property {string} [className='ol-scale-line'] CSS Class name.
 * @property {number} [minWidth=64] Minimum width in pixels.
 * @property {function(import("../MapEvent.js").default)} [render] Function called when the control
 * should be re-rendered. This is called in a `requestAnimationFrame` callback.
 * @property {HTMLElement|string} [target] Specify a target if you want the control
 * to be rendered outside of the map's viewport.
 * @property {Units|string} [units='metric'] Units.
 */

/**
 * @classdesc
 * A control displaying rough y-axis distances, calculated for the center of the
 * viewport. For conformal projections (e.g. EPSG:3857, the default view
 * projection in OpenLayers), the scale is valid for all directions.
 * No scale line will be shown when the y-axis distance of a pixel at the
 * viewport center cannot be calculated in the view projection.
 * By default the scale line will show in the bottom left portion of the map,
 * but this can be changed by using the css selector `.ol-scale-line`.
 *
 * @api
 */
var ScaleLine = /*@__PURE__*/function (Control) {
  function ScaleLine(opt_options) {

    var options = opt_options ? opt_options : {};

    var className = options.className !== undefined ? options.className : 'ol-scale-line';

    Control.call(this, {
      element: document.createElement('div'),
      render: options.render || render,
      target: options.target
    });

    /**
     * @private
     * @type {HTMLElement}
     */
    this.innerElement_ = document.createElement('div');
    this.innerElement_.className = className + '-inner';

    this.element.className = className + ' ' + _css.CLASS_UNSELECTABLE;
    this.element.appendChild(this.innerElement_);

    /**
     * @private
     * @type {?import("../View.js").State}
     */
    this.viewState_ = null;

    /**
     * @private
     * @type {number}
     */
    this.minWidth_ = options.minWidth !== undefined ? options.minWidth : 64;

    /**
     * @private
     * @type {boolean}
     */
    this.renderedVisible_ = false;

    /**
     * @private
     * @type {number|undefined}
     */
    this.renderedWidth_ = undefined;

    /**
     * @private
     * @type {string}
     */
    this.renderedHTML_ = '';

    (0, _events.listen)(this, (0, _Object.getChangeEventType)(UNITS_PROP), this.handleUnitsChanged_, this);

    this.setUnits( /** @type {Units} */options.units || Units.METRIC);
  }

  if (Control) ScaleLine.__proto__ = Control;
  ScaleLine.prototype = Object.create(Control && Control.prototype);
  ScaleLine.prototype.constructor = ScaleLine;

  /**
   * Return the units to use in the scale line.
   * @return {Units} The units
   * to use in the scale line.
   * @observable
   * @api
   */
  ScaleLine.prototype.getUnits = function getUnits() {
    return this.get(UNITS_PROP);
  };

  /**
   * @private
   */
  ScaleLine.prototype.handleUnitsChanged_ = function handleUnitsChanged_() {
    this.updateElement_();
  };

  /**
   * Set the units to use in the scale line.
   * @param {Units} units The units to use in the scale line.
   * @observable
   * @api
   */
  ScaleLine.prototype.setUnits = function setUnits(units) {
    this.set(UNITS_PROP, units);
  };

  /**
   * @private
   */
  ScaleLine.prototype.updateElement_ = function updateElement_() {
    var viewState = this.viewState_;

    if (!viewState) {
      if (this.renderedVisible_) {
        this.element.style.display = 'none';
        this.renderedVisible_ = false;
      }
      return;
    }

    var center = viewState.center;
    var projection = viewState.projection;
    var units = this.getUnits();
    var pointResolutionUnits = units == Units.DEGREES ? _Units2.default.DEGREES : _Units2.default.METERS;
    var pointResolution = (0, _proj.getPointResolution)(projection, viewState.resolution, center, pointResolutionUnits);
    if (projection.getUnits() != _Units2.default.DEGREES && projection.getMetersPerUnit() && pointResolutionUnits == _Units2.default.METERS) {
      pointResolution *= projection.getMetersPerUnit();
    }

    var nominalCount = this.minWidth_ * pointResolution;
    var suffix = '';
    if (units == Units.DEGREES) {
      var metersPerDegree = _proj.METERS_PER_UNIT[_Units2.default.DEGREES];
      if (projection.getUnits() == _Units2.default.DEGREES) {
        nominalCount *= metersPerDegree;
      } else {
        pointResolution /= metersPerDegree;
      }
      if (nominalCount < metersPerDegree / 60) {
        suffix = '\u2033'; // seconds
        pointResolution *= 3600;
      } else if (nominalCount < metersPerDegree) {
        suffix = '\u2032'; // minutes
        pointResolution *= 60;
      } else {
        suffix = '\xB0'; // degrees
      }
    } else if (units == Units.IMPERIAL) {
      if (nominalCount < 0.9144) {
        suffix = 'in';
        pointResolution /= 0.0254;
      } else if (nominalCount < 1609.344) {
        suffix = 'ft';
        pointResolution /= 0.3048;
      } else {
        suffix = 'mi';
        pointResolution /= 1609.344;
      }
    } else if (units == Units.NAUTICAL) {
      pointResolution /= 1852;
      suffix = 'nm';
    } else if (units == Units.METRIC) {
      if (nominalCount < 0.001) {
        suffix = 'μm';
        pointResolution *= 1000000;
      } else if (nominalCount < 1) {
        suffix = 'mm';
        pointResolution *= 1000;
      } else if (nominalCount < 1000) {
        suffix = 'm';
      } else {
        suffix = 'km';
        pointResolution /= 1000;
      }
    } else if (units == Units.US) {
      if (nominalCount < 0.9144) {
        suffix = 'in';
        pointResolution *= 39.37;
      } else if (nominalCount < 1609.344) {
        suffix = 'ft';
        pointResolution /= 0.30480061;
      } else {
        suffix = 'mi';
        pointResolution /= 1609.3472;
      }
    } else {
      (0, _asserts.assert)(false, 33); // Invalid units
    }

    var i = 3 * Math.floor(Math.log(this.minWidth_ * pointResolution) / Math.log(10));
    var count, width;
    while (true) {
      count = LEADING_DIGITS[(i % 3 + 3) % 3] * Math.pow(10, Math.floor(i / 3));
      width = Math.round(count / pointResolution);
      if (isNaN(width)) {
        this.element.style.display = 'none';
        this.renderedVisible_ = false;
        return;
      } else if (width >= this.minWidth_) {
        break;
      }
      ++i;
    }

    var html = count + ' ' + suffix;
    if (this.renderedHTML_ != html) {
      this.innerElement_.innerHTML = html;
      this.renderedHTML_ = html;
    }

    if (this.renderedWidth_ != width) {
      this.innerElement_.style.width = width + 'px';
      this.renderedWidth_ = width;
    }

    if (!this.renderedVisible_) {
      this.element.style.display = '';
      this.renderedVisible_ = true;
    }
  };

  return ScaleLine;
}(_Control2.default);

/**
 * Update the scale line element.
 * @param {import("../MapEvent.js").default} mapEvent Map event.
 * @this {ScaleLine}
 * @api
 */
function render(mapEvent) {
  var frameState = mapEvent.frameState;
  if (!frameState) {
    this.viewState_ = null;
  } else {
    this.viewState_ = frameState.viewState;
  }
  this.updateElement_();
}

exports.default = ScaleLine;

//# sourceMappingURL=ScaleLine.js.map