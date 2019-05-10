'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util.js');

var _Object = require('../Object.js');

var _Object2 = _interopRequireDefault(_Object);

var _proj = require('../proj.js');

var _State = require('./State.js');

var _State2 = _interopRequireDefault(_State);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A function that returns a string or an array of strings representing source
 * attributions.
 *
 * @typedef {function(import("../PluggableMap.js").FrameState): (string|Array<string>)} Attribution
 */

/**
 * A type that can be used to provide attribution information for data sources.
 *
 * It represents either
 * * a simple string (e.g. `'© Acme Inc.'`)
 * * an array of simple strings (e.g. `['© Acme Inc.', '© Bacme Inc.']`)
 * * a function that returns a string or array of strings (`{@link module:ol/source/Source~Attribution}`)
 *
 * @typedef {string|Array<string>|Attribution} AttributionLike
 */

/**
 * @typedef {Object} Options
 * @property {AttributionLike} [attributions]
 * @property {boolean} [attributionsCollapsible=true] Attributions are collapsible.
 * @property {import("../proj.js").ProjectionLike} projection
 * @property {SourceState} [state='ready']
 * @property {boolean} [wrapX=false]
 */

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for {@link module:ol/layer/Layer~Layer} sources.
 *
 * A generic `change` event is triggered when the state of the source changes.
 * @abstract
 * @api
 */
/**
 * @module ol/source/Source
 */
var Source = /*@__PURE__*/function (BaseObject) {
  function Source(options) {

    BaseObject.call(this);

    /**
     * @private
     * @type {import("../proj/Projection.js").default}
     */
    this.projection_ = (0, _proj.get)(options.projection);

    /**
     * @private
     * @type {?Attribution}
     */
    this.attributions_ = adaptAttributions(options.attributions);

    /**
     * @private
     * @type {boolean}
     */
    this.attributionsCollapsible_ = options.attributionsCollapsible !== undefined ? options.attributionsCollapsible : true;

    /**
     * This source is currently loading data. Sources that defer loading to the
     * map's tile queue never set this to `true`.
     * @type {boolean}
     */
    this.loading = false;

    /**
     * @private
     * @type {SourceState}
     */
    this.state_ = options.state !== undefined ? options.state : _State2.default.READY;

    /**
     * @private
     * @type {boolean}
     */
    this.wrapX_ = options.wrapX !== undefined ? options.wrapX : false;
  }

  if (BaseObject) Source.__proto__ = BaseObject;
  Source.prototype = Object.create(BaseObject && BaseObject.prototype);
  Source.prototype.constructor = Source;

  /**
   * Get the attribution function for the source.
   * @return {?Attribution} Attribution function.
   */
  Source.prototype.getAttributions = function getAttributions() {
    return this.attributions_;
  };

  /**
   * @return {boolean} Aattributions are collapsible.
   */
  Source.prototype.getAttributionsCollapsible = function getAttributionsCollapsible() {
    return this.attributionsCollapsible_;
  };

  /**
   * Get the projection of the source.
   * @return {import("../proj/Projection.js").default} Projection.
   * @api
   */
  Source.prototype.getProjection = function getProjection() {
    return this.projection_;
  };

  /**
   * @abstract
   * @return {Array<number>|undefined} Resolutions.
   */
  Source.prototype.getResolutions = function getResolutions() {
    return (0, _util.abstract)();
  };

  /**
   * Get the state of the source, see {@link module:ol/source/State~State} for possible states.
   * @return {SourceState} State.
   * @api
   */
  Source.prototype.getState = function getState() {
    return this.state_;
  };

  /**
   * @return {boolean|undefined} Wrap X.
   */
  Source.prototype.getWrapX = function getWrapX() {
    return this.wrapX_;
  };

  /**
   * Refreshes the source and finally dispatches a 'change' event.
   * @api
   */
  Source.prototype.refresh = function refresh() {
    this.changed();
  };

  /**
   * Set the attributions of the source.
   * @param {AttributionLike|undefined} attributions Attributions.
   *     Can be passed as `string`, `Array<string>`, `{@link module:ol/source/Source~Attribution}`,
   *     or `undefined`.
   * @api
   */
  Source.prototype.setAttributions = function setAttributions(attributions) {
    this.attributions_ = adaptAttributions(attributions);
    this.changed();
  };

  /**
   * Set the state of the source.
   * @param {SourceState} state State.
   * @protected
   */
  Source.prototype.setState = function setState(state) {
    this.state_ = state;
    this.changed();
  };

  return Source;
}(_Object2.default);

/**
 * Turns the attributions option into an attributions function.
 * @param {AttributionLike|undefined} attributionLike The attribution option.
 * @return {?Attribution} An attribution function (or null).
 */
function adaptAttributions(attributionLike) {
  if (!attributionLike) {
    return null;
  }
  if (Array.isArray(attributionLike)) {
    return function (frameState) {
      return attributionLike;
    };
  }

  if (typeof attributionLike === 'function') {
    return attributionLike;
  }

  return function (frameState) {
    return [attributionLike];
  };
}

exports.default = Source;

//# sourceMappingURL=Source.js.map