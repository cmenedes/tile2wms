'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MapBrowserEvent = require('./MapBrowserEvent.js');

var _MapBrowserEvent2 = _interopRequireDefault(_MapBrowserEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MapBrowserPointerEvent = /*@__PURE__*/function (MapBrowserEvent) {
  function MapBrowserPointerEvent(type, map, pointerEvent, opt_dragging, opt_frameState) {

    MapBrowserEvent.call(this, type, map, pointerEvent.originalEvent, opt_dragging, opt_frameState);

    /**
     * @const
     * @type {import("./pointer/PointerEvent.js").default}
     */
    this.pointerEvent = pointerEvent;
  }

  if (MapBrowserEvent) MapBrowserPointerEvent.__proto__ = MapBrowserEvent;
  MapBrowserPointerEvent.prototype = Object.create(MapBrowserEvent && MapBrowserEvent.prototype);
  MapBrowserPointerEvent.prototype.constructor = MapBrowserPointerEvent;

  return MapBrowserPointerEvent;
}(_MapBrowserEvent2.default); /**
                               * @module ol/MapBrowserPointerEvent
                               */
exports.default = MapBrowserPointerEvent;

//# sourceMappingURL=MapBrowserPointerEvent.js.map