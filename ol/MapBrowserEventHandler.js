'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _has = require('./has.js');

var _MapBrowserEventType = require('./MapBrowserEventType.js');

var _MapBrowserEventType2 = _interopRequireDefault(_MapBrowserEventType);

var _MapBrowserPointerEvent = require('./MapBrowserPointerEvent.js');

var _MapBrowserPointerEvent2 = _interopRequireDefault(_MapBrowserPointerEvent);

var _events = require('./events.js');

var _Target = require('./events/Target.js');

var _Target2 = _interopRequireDefault(_Target);

var _EventType = require('./pointer/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _PointerEventHandler = require('./pointer/PointerEventHandler.js');

var _PointerEventHandler2 = _interopRequireDefault(_PointerEventHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MapBrowserEventHandler = /*@__PURE__*/function (EventTarget) {
  function MapBrowserEventHandler(map, moveTolerance) {

    EventTarget.call(this);

    /**
     * This is the element that we will listen to the real events on.
     * @type {import("./PluggableMap.js").default}
     * @private
     */
    this.map_ = map;

    /**
     * @type {any}
     * @private
     */
    this.clickTimeoutId_;

    /**
     * @type {boolean}
     * @private
     */
    this.dragging_ = false;

    /**
     * @type {!Array<import("./events.js").EventsKey>}
     * @private
     */
    this.dragListenerKeys_ = [];

    /**
     * @type {number}
     * @private
     */
    this.moveTolerance_ = moveTolerance ? moveTolerance * _has.DEVICE_PIXEL_RATIO : _has.DEVICE_PIXEL_RATIO;

    /**
     * The most recent "down" type event (or null if none have occurred).
     * Set on pointerdown.
     * @type {import("./pointer/PointerEvent.js").default}
     * @private
     */
    this.down_ = null;

    var element = this.map_.getViewport();

    /**
     * @type {number}
     * @private
     */
    this.activePointers_ = 0;

    /**
     * @type {!Object<number, boolean>}
     * @private
     */
    this.trackedTouches_ = {};

    /**
     * Event handler which generates pointer events for
     * the viewport element.
     *
     * @type {PointerEventHandler}
     * @private
     */
    this.pointerEventHandler_ = new _PointerEventHandler2.default(element);

    /**
     * Event handler which generates pointer events for
     * the document (used when dragging).
     *
     * @type {PointerEventHandler}
     * @private
     */
    this.documentPointerEventHandler_ = null;

    /**
     * @type {?import("./events.js").EventsKey}
     * @private
     */
    this.pointerdownListenerKey_ = (0, _events.listen)(this.pointerEventHandler_, _EventType2.default.POINTERDOWN, this.handlePointerDown_, this);

    /**
     * @type {?import("./events.js").EventsKey}
     * @private
     */
    this.relayedListenerKey_ = (0, _events.listen)(this.pointerEventHandler_, _EventType2.default.POINTERMOVE, this.relayEvent_, this);
  }

  if (EventTarget) MapBrowserEventHandler.__proto__ = EventTarget;
  MapBrowserEventHandler.prototype = Object.create(EventTarget && EventTarget.prototype);
  MapBrowserEventHandler.prototype.constructor = MapBrowserEventHandler;

  /**
   * @param {import("./pointer/PointerEvent.js").default} pointerEvent Pointer
   * event.
   * @private
   */
  MapBrowserEventHandler.prototype.emulateClick_ = function emulateClick_(pointerEvent) {
    var newEvent = new _MapBrowserPointerEvent2.default(_MapBrowserEventType2.default.CLICK, this.map_, pointerEvent);
    this.dispatchEvent(newEvent);
    if (this.clickTimeoutId_ !== undefined) {
      // double-click
      clearTimeout(this.clickTimeoutId_);
      this.clickTimeoutId_ = undefined;
      newEvent = new _MapBrowserPointerEvent2.default(_MapBrowserEventType2.default.DBLCLICK, this.map_, pointerEvent);
      this.dispatchEvent(newEvent);
    } else {
      // click
      this.clickTimeoutId_ = setTimeout(function () {
        this.clickTimeoutId_ = undefined;
        var newEvent = new _MapBrowserPointerEvent2.default(_MapBrowserEventType2.default.SINGLECLICK, this.map_, pointerEvent);
        this.dispatchEvent(newEvent);
      }.bind(this), 250);
    }
  };

  /**
   * Keeps track on how many pointers are currently active.
   *
   * @param {import("./pointer/PointerEvent.js").default} pointerEvent Pointer
   * event.
   * @private
   */
  MapBrowserEventHandler.prototype.updateActivePointers_ = function updateActivePointers_(pointerEvent) {
    var event = pointerEvent;

    if (event.type == _MapBrowserEventType2.default.POINTERUP || event.type == _MapBrowserEventType2.default.POINTERCANCEL) {
      delete this.trackedTouches_[event.pointerId];
    } else if (event.type == _MapBrowserEventType2.default.POINTERDOWN) {
      this.trackedTouches_[event.pointerId] = true;
    }
    this.activePointers_ = Object.keys(this.trackedTouches_).length;
  };

  /**
   * @param {import("./pointer/PointerEvent.js").default} pointerEvent Pointer
   * event.
   * @private
   */
  MapBrowserEventHandler.prototype.handlePointerUp_ = function handlePointerUp_(pointerEvent) {
    this.updateActivePointers_(pointerEvent);
    var newEvent = new _MapBrowserPointerEvent2.default(_MapBrowserEventType2.default.POINTERUP, this.map_, pointerEvent);
    this.dispatchEvent(newEvent);

    // We emulate click events on left mouse button click, touch contact, and pen
    // contact. isMouseActionButton returns true in these cases (evt.button is set
    // to 0).
    // See http://www.w3.org/TR/pointerevents/#button-states
    // We only fire click, singleclick, and doubleclick if nobody has called
    // event.stopPropagation() or event.preventDefault().
    if (!newEvent.propagationStopped && !this.dragging_ && this.isMouseActionButton_(pointerEvent)) {
      this.emulateClick_(this.down_);
    }

    if (this.activePointers_ === 0) {
      this.dragListenerKeys_.forEach(_events.unlistenByKey);
      this.dragListenerKeys_.length = 0;
      this.dragging_ = false;
      this.down_ = null;
      this.documentPointerEventHandler_.dispose();
      this.documentPointerEventHandler_ = null;
    }
  };

  /**
   * @param {import("./pointer/PointerEvent.js").default} pointerEvent Pointer
   * event.
   * @return {boolean} If the left mouse button was pressed.
   * @private
   */
  MapBrowserEventHandler.prototype.isMouseActionButton_ = function isMouseActionButton_(pointerEvent) {
    return pointerEvent.button === 0;
  };

  /**
   * @param {import("./pointer/PointerEvent.js").default} pointerEvent Pointer
   * event.
   * @private
   */
  MapBrowserEventHandler.prototype.handlePointerDown_ = function handlePointerDown_(pointerEvent) {
    this.updateActivePointers_(pointerEvent);
    var newEvent = new _MapBrowserPointerEvent2.default(_MapBrowserEventType2.default.POINTERDOWN, this.map_, pointerEvent);
    this.dispatchEvent(newEvent);

    this.down_ = pointerEvent;

    if (this.dragListenerKeys_.length === 0) {
      /* Set up a pointer event handler on the `document`,
       * which is required when the pointer is moved outside
       * the viewport when dragging.
       */
      this.documentPointerEventHandler_ = new _PointerEventHandler2.default(document);

      this.dragListenerKeys_.push((0, _events.listen)(this.documentPointerEventHandler_, _MapBrowserEventType2.default.POINTERMOVE, this.handlePointerMove_, this), (0, _events.listen)(this.documentPointerEventHandler_, _MapBrowserEventType2.default.POINTERUP, this.handlePointerUp_, this),
      /* Note that the listener for `pointercancel is set up on
       * `pointerEventHandler_` and not `documentPointerEventHandler_` like
       * the `pointerup` and `pointermove` listeners.
       *
       * The reason for this is the following: `TouchSource.vacuumTouches_()`
       * issues `pointercancel` events, when there was no `touchend` for a
       * `touchstart`. Now, let's say a first `touchstart` is registered on
       * `pointerEventHandler_`. The `documentPointerEventHandler_` is set up.
       * But `documentPointerEventHandler_` doesn't know about the first
       * `touchstart`. If there is no `touchend` for the `touchstart`, we can
       * only receive a `touchcancel` from `pointerEventHandler_`, because it is
       * only registered there.
       */
      (0, _events.listen)(this.pointerEventHandler_, _MapBrowserEventType2.default.POINTERCANCEL, this.handlePointerUp_, this));
    }
  };

  /**
   * @param {import("./pointer/PointerEvent.js").default} pointerEvent Pointer
   * event.
   * @private
   */
  MapBrowserEventHandler.prototype.handlePointerMove_ = function handlePointerMove_(pointerEvent) {
    // Between pointerdown and pointerup, pointermove events are triggered.
    // To avoid a 'false' touchmove event to be dispatched, we test if the pointer
    // moved a significant distance.
    if (this.isMoving_(pointerEvent)) {
      this.dragging_ = true;
      var newEvent = new _MapBrowserPointerEvent2.default(_MapBrowserEventType2.default.POINTERDRAG, this.map_, pointerEvent, this.dragging_);
      this.dispatchEvent(newEvent);
    }

    // Some native android browser triggers mousemove events during small period
    // of time. See: https://code.google.com/p/android/issues/detail?id=5491 or
    // https://code.google.com/p/android/issues/detail?id=19827
    // ex: Galaxy Tab P3110 + Android 4.1.1
    pointerEvent.preventDefault();
  };

  /**
   * Wrap and relay a pointer event.  Note that this requires that the type
   * string for the MapBrowserPointerEvent matches the PointerEvent type.
   * @param {import("./pointer/PointerEvent.js").default} pointerEvent Pointer
   * event.
   * @private
   */
  MapBrowserEventHandler.prototype.relayEvent_ = function relayEvent_(pointerEvent) {
    var dragging = !!(this.down_ && this.isMoving_(pointerEvent));
    this.dispatchEvent(new _MapBrowserPointerEvent2.default(pointerEvent.type, this.map_, pointerEvent, dragging));
  };

  /**
   * @param {import("./pointer/PointerEvent.js").default} pointerEvent Pointer
   * event.
   * @return {boolean} Is moving.
   * @private
   */
  MapBrowserEventHandler.prototype.isMoving_ = function isMoving_(pointerEvent) {
    return this.dragging_ || Math.abs(pointerEvent.clientX - this.down_.clientX) > this.moveTolerance_ || Math.abs(pointerEvent.clientY - this.down_.clientY) > this.moveTolerance_;
  };

  /**
   * @inheritDoc
   */
  MapBrowserEventHandler.prototype.disposeInternal = function disposeInternal() {
    if (this.relayedListenerKey_) {
      (0, _events.unlistenByKey)(this.relayedListenerKey_);
      this.relayedListenerKey_ = null;
    }
    if (this.pointerdownListenerKey_) {
      (0, _events.unlistenByKey)(this.pointerdownListenerKey_);
      this.pointerdownListenerKey_ = null;
    }

    this.dragListenerKeys_.forEach(_events.unlistenByKey);
    this.dragListenerKeys_.length = 0;

    if (this.documentPointerEventHandler_) {
      this.documentPointerEventHandler_.dispose();
      this.documentPointerEventHandler_ = null;
    }
    if (this.pointerEventHandler_) {
      this.pointerEventHandler_.dispose();
      this.pointerEventHandler_ = null;
    }
    EventTarget.prototype.disposeInternal.call(this);
  };

  return MapBrowserEventHandler;
}(_Target2.default); /**
                      * @module ol/MapBrowserEventHandler
                      */
exports.default = MapBrowserEventHandler;

//# sourceMappingURL=MapBrowserEventHandler.js.map