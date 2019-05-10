'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.primaryAction = exports.mouseOnly = exports.targetNotEditable = exports.shiftKeyOnly = exports.platformModifierKeyOnly = exports.noModifierKeys = exports.doubleClick = exports.singleClick = exports.pointerMove = exports.never = exports.mouseActionButton = exports.click = exports.always = exports.focus = exports.altShiftKeysOnly = exports.altKeyOnly = undefined;

var _MapBrowserEventType = require('../MapBrowserEventType.js');

var _MapBrowserEventType2 = _interopRequireDefault(_MapBrowserEventType);

var _asserts = require('../asserts.js');

var _functions = require('../functions.js');

var _has = require('../has.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A function that takes an {@link module:ol/MapBrowserEvent} and returns a
 * `{boolean}`. If the condition is met, true should be returned.
 *
 * @typedef {function(this: ?, import("../MapBrowserEvent.js").default): boolean} Condition
 */

/**
 * Return `true` if only the alt-key is pressed, `false` otherwise (e.g. when
 * additionally the shift-key is pressed).
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True if only the alt key is pressed.
 * @api
 */
/**
 * @module ol/events/condition
 */
var altKeyOnly = exports.altKeyOnly = function altKeyOnly(mapBrowserEvent) {
  var originalEvent = /** @type {KeyboardEvent|MouseEvent|TouchEvent} */mapBrowserEvent.originalEvent;
  return originalEvent.altKey && !(originalEvent.metaKey || originalEvent.ctrlKey) && !originalEvent.shiftKey;
};

/**
 * Return `true` if only the alt-key and shift-key is pressed, `false` otherwise
 * (e.g. when additionally the platform-modifier-key is pressed).
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True if only the alt and shift keys are pressed.
 * @api
 */
var altShiftKeysOnly = exports.altShiftKeysOnly = function altShiftKeysOnly(mapBrowserEvent) {
  var originalEvent = /** @type {KeyboardEvent|MouseEvent|TouchEvent} */mapBrowserEvent.originalEvent;
  return originalEvent.altKey && !(originalEvent.metaKey || originalEvent.ctrlKey) && originalEvent.shiftKey;
};

/**
 * Return `true` if the map has the focus. This condition requires a map target
 * element with a `tabindex` attribute, e.g. `<div id="map" tabindex="1">`.
 *
 * @param {import("../MapBrowserEvent.js").default} event Map browser event.
 * @return {boolean} The map has the focus.
 * @api
 */
var focus = exports.focus = function focus(event) {
  return event.target.getTargetElement() === document.activeElement;
};

/**
 * Return always true.
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True.
 * @api
 */
var always = exports.always = _functions.TRUE;

/**
 * Return `true` if the event is a `click` event, `false` otherwise.
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True if the event is a map `click` event.
 * @api
 */
var click = exports.click = function click(mapBrowserEvent) {
  return mapBrowserEvent.type == _MapBrowserEventType2.default.CLICK;
};

/**
 * Return `true` if the event has an "action"-producing mouse button.
 *
 * By definition, this includes left-click on windows/linux, and left-click
 * without the ctrl key on Macs.
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} The result.
 */
var mouseActionButton = exports.mouseActionButton = function mouseActionButton(mapBrowserEvent) {
  var originalEvent = /** @type {MouseEvent} */mapBrowserEvent.originalEvent;
  return originalEvent.button == 0 && !(_has.WEBKIT && _has.MAC && originalEvent.ctrlKey);
};

/**
 * Return always false.
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} False.
 * @api
 */
var never = exports.never = _functions.FALSE;

/**
 * Return `true` if the browser event is a `pointermove` event, `false`
 * otherwise.
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True if the browser event is a `pointermove` event.
 * @api
 */
var pointerMove = exports.pointerMove = function pointerMove(mapBrowserEvent) {
  return mapBrowserEvent.type == 'pointermove';
};

/**
 * Return `true` if the event is a map `singleclick` event, `false` otherwise.
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True if the event is a map `singleclick` event.
 * @api
 */
var singleClick = exports.singleClick = function singleClick(mapBrowserEvent) {
  return mapBrowserEvent.type == _MapBrowserEventType2.default.SINGLECLICK;
};

/**
 * Return `true` if the event is a map `dblclick` event, `false` otherwise.
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True if the event is a map `dblclick` event.
 * @api
 */
var doubleClick = exports.doubleClick = function doubleClick(mapBrowserEvent) {
  return mapBrowserEvent.type == _MapBrowserEventType2.default.DBLCLICK;
};

/**
 * Return `true` if no modifier key (alt-, shift- or platform-modifier-key) is
 * pressed.
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True only if there no modifier keys are pressed.
 * @api
 */
var noModifierKeys = exports.noModifierKeys = function noModifierKeys(mapBrowserEvent) {
  var originalEvent = /** @type {KeyboardEvent|MouseEvent|TouchEvent} */mapBrowserEvent.originalEvent;
  return !originalEvent.altKey && !(originalEvent.metaKey || originalEvent.ctrlKey) && !originalEvent.shiftKey;
};

/**
 * Return `true` if only the platform-modifier-key (the meta-key on Mac,
 * ctrl-key otherwise) is pressed, `false` otherwise (e.g. when additionally
 * the shift-key is pressed).
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True if only the platform modifier key is pressed.
 * @api
 */
var platformModifierKeyOnly = exports.platformModifierKeyOnly = function platformModifierKeyOnly(mapBrowserEvent) {
  var originalEvent = /** @type {KeyboardEvent|MouseEvent|TouchEvent} */mapBrowserEvent.originalEvent;
  return !originalEvent.altKey && (_has.MAC ? originalEvent.metaKey : originalEvent.ctrlKey) && !originalEvent.shiftKey;
};

/**
 * Return `true` if only the shift-key is pressed, `false` otherwise (e.g. when
 * additionally the alt-key is pressed).
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True if only the shift key is pressed.
 * @api
 */
var shiftKeyOnly = exports.shiftKeyOnly = function shiftKeyOnly(mapBrowserEvent) {
  var originalEvent = /** @type {KeyboardEvent|MouseEvent|TouchEvent} */mapBrowserEvent.originalEvent;
  return !originalEvent.altKey && !(originalEvent.metaKey || originalEvent.ctrlKey) && originalEvent.shiftKey;
};

/**
 * Return `true` if the target element is not editable, i.e. not a `<input>`-,
 * `<select>`- or `<textarea>`-element, `false` otherwise.
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True only if the target element is not editable.
 * @api
 */
var targetNotEditable = exports.targetNotEditable = function targetNotEditable(mapBrowserEvent) {
  var target = mapBrowserEvent.originalEvent.target;
  var tagName = /** @type {Element} */target.tagName;
  return tagName !== 'INPUT' && tagName !== 'SELECT' && tagName !== 'TEXTAREA';
};

/**
 * Return `true` if the event originates from a mouse device.
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True if the event originates from a mouse device.
 * @api
 */
var mouseOnly = exports.mouseOnly = function mouseOnly(mapBrowserEvent) {
  var pointerEvent = /** @type {import("../MapBrowserPointerEvent").default} */mapBrowserEvent.pointerEvent;
  (0, _asserts.assert)(pointerEvent !== undefined, 56); // mapBrowserEvent must originate from a pointer event
  // see http://www.w3.org/TR/pointerevents/#widl-PointerEvent-pointerType
  return pointerEvent.pointerType == 'mouse';
};

/**
 * Return `true` if the event originates from a primary pointer in
 * contact with the surface or if the left mouse button is pressed.
 * See http://www.w3.org/TR/pointerevents/#button-states.
 *
 * @param {import("../MapBrowserEvent.js").default} mapBrowserEvent Map browser event.
 * @return {boolean} True if the event originates from a primary pointer.
 * @api
 */
var primaryAction = exports.primaryAction = function primaryAction(mapBrowserEvent) {
  var pointerEvent = /** @type {import("../MapBrowserPointerEvent").default} */mapBrowserEvent.pointerEvent;
  (0, _asserts.assert)(pointerEvent !== undefined, 56); // mapBrowserEvent must originate from a pointer event
  return pointerEvent.isPrimary && pointerEvent.button === 0;
};

//# sourceMappingURL=condition.js.map