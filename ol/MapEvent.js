'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Event = require('./events/Event.js');

var _Event2 = _interopRequireDefault(_Event);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @classdesc
 * Events emitted as map events are instances of this type.
 * See {@link module:ol/PluggableMap~PluggableMap} for which events trigger a map event.
 */
var MapEvent = /*@__PURE__*/function (Event) {
  function MapEvent(type, map, opt_frameState) {

    Event.call(this, type);

    /**
     * The map where the event occurred.
     * @type {import("./PluggableMap.js").default}
     * @api
     */
    this.map = map;

    /**
     * The frame state at the time of the event.
     * @type {?import("./PluggableMap.js").FrameState}
     * @api
     */
    this.frameState = opt_frameState !== undefined ? opt_frameState : null;
  }

  if (Event) MapEvent.__proto__ = Event;
  MapEvent.prototype = Object.create(Event && Event.prototype);
  MapEvent.prototype.constructor = MapEvent;

  return MapEvent;
}(_Event2.default); /**
                     * @module ol/MapEvent
                     */
exports.default = MapEvent;

//# sourceMappingURL=MapEvent.js.map