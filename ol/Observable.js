'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unByKey = unByKey;

var _events = require('./events.js');

var _Target = require('./events/Target.js');

var _Target2 = _interopRequireDefault(_Target);

var _EventType = require('./events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * An event target providing convenient methods for listener registration
 * and unregistration. A generic `change` event is always available through
 * {@link module:ol/Observable~Observable#changed}.
 *
 * @fires import("./events/Event.js").Event
 * @api
 */
var Observable = /*@__PURE__*/function (EventTarget) {
  function Observable() {

    EventTarget.call(this);

    /**
     * @private
     * @type {number}
     */
    this.revision_ = 0;
  }

  if (EventTarget) Observable.__proto__ = EventTarget;
  Observable.prototype = Object.create(EventTarget && EventTarget.prototype);
  Observable.prototype.constructor = Observable;

  /**
   * Increases the revision counter and dispatches a 'change' event.
   * @api
   */
  Observable.prototype.changed = function changed() {
    ++this.revision_;
    this.dispatchEvent(_EventType2.default.CHANGE);
  };

  /**
   * Get the version number for this object.  Each time the object is modified,
   * its version number will be incremented.
   * @return {number} Revision.
   * @api
   */
  Observable.prototype.getRevision = function getRevision() {
    return this.revision_;
  };

  /**
   * Listen for a certain type of event.
   * @param {string|Array<string>} type The event type or array of event types.
   * @param {function(?): ?} listener The listener function.
   * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Unique key for the listener. If
   *     called with an array of event types as the first argument, the return
   *     will be an array of keys.
   * @api
   */
  Observable.prototype.on = function on(type, listener) {
    if (Array.isArray(type)) {
      var len = type.length;
      var keys = new Array(len);
      for (var i = 0; i < len; ++i) {
        keys[i] = (0, _events.listen)(this, type[i], listener);
      }
      return keys;
    } else {
      return (0, _events.listen)(this, /** @type {string} */type, listener);
    }
  };

  /**
   * Listen once for a certain type of event.
   * @param {string|Array<string>} type The event type or array of event types.
   * @param {function(?): ?} listener The listener function.
   * @return {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} Unique key for the listener. If
   *     called with an array of event types as the first argument, the return
   *     will be an array of keys.
   * @api
   */
  Observable.prototype.once = function once(type, listener) {
    if (Array.isArray(type)) {
      var len = type.length;
      var keys = new Array(len);
      for (var i = 0; i < len; ++i) {
        keys[i] = (0, _events.listenOnce)(this, type[i], listener);
      }
      return keys;
    } else {
      return (0, _events.listenOnce)(this, /** @type {string} */type, listener);
    }
  };

  /**
   * Unlisten for a certain type of event.
   * @param {string|Array<string>} type The event type or array of event types.
   * @param {function(?): ?} listener The listener function.
   * @api
   */
  Observable.prototype.un = function un(type, listener) {
    if (Array.isArray(type)) {
      for (var i = 0, ii = type.length; i < ii; ++i) {
        (0, _events.unlisten)(this, type[i], listener);
      }
      return;
    } else {
      (0, _events.unlisten)(this, /** @type {string} */type, listener);
    }
  };

  return Observable;
}(_Target2.default);

/**
 * Removes an event listener using the key returned by `on()` or `once()`.
 * @param {import("./events.js").EventsKey|Array<import("./events.js").EventsKey>} key The key returned by `on()`
 *     or `once()` (or an array of keys).
 * @api
 */
/**
 * @module ol/Observable
 */
function unByKey(key) {
  if (Array.isArray(key)) {
    for (var i = 0, ii = key.length; i < ii; ++i) {
      (0, _events.unlistenByKey)(key[i]);
    }
  } else {
    (0, _events.unlistenByKey)( /** @type {import("./events.js").EventsKey} */key);
  }
}

exports.default = Observable;

//# sourceMappingURL=Observable.js.map