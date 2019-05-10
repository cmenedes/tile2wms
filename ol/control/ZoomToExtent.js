'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _Control = require('./Control.js');

var _Control2 = _interopRequireDefault(_Control);

var _css = require('../css.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} Options
 * @property {string} [className='ol-zoom-extent'] Class name.
 * @property {HTMLElement|string} [target] Specify a target if you want the control
 * to be rendered outside of the map's viewport.
 * @property {string|HTMLElement} [label='E'] Text label to use for the button.
 * Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {string} [tipLabel='Fit to extent'] Text label to use for the button tip.
 * @property {import("../extent.js").Extent} [extent] The extent to zoom to. If undefined the validity
 * extent of the view projection is used.
 */

/**
 * @classdesc
 * A button control which, when pressed, changes the map view to a specific
 * extent. To style this control use the css selector `.ol-zoom-extent`.
 *
 * @api
 */
/**
 * @module ol/control/ZoomToExtent
 */
var ZoomToExtent = /*@__PURE__*/function (Control) {
  function ZoomToExtent(opt_options) {
    var options = opt_options ? opt_options : {};

    Control.call(this, {
      element: document.createElement('div'),
      target: options.target
    });

    /**
     * @type {import("../extent.js").Extent}
     * @protected
     */
    this.extent = options.extent ? options.extent : null;

    var className = options.className !== undefined ? options.className : 'ol-zoom-extent';

    var label = options.label !== undefined ? options.label : 'E';
    var tipLabel = options.tipLabel !== undefined ? options.tipLabel : 'Fit to extent';
    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.title = tipLabel;
    button.appendChild(typeof label === 'string' ? document.createTextNode(label) : label);

    (0, _events.listen)(button, _EventType2.default.CLICK, this.handleClick_, this);

    var cssClasses = className + ' ' + _css.CLASS_UNSELECTABLE + ' ' + _css.CLASS_CONTROL;
    var element = this.element;
    element.className = cssClasses;
    element.appendChild(button);
  }

  if (Control) ZoomToExtent.__proto__ = Control;
  ZoomToExtent.prototype = Object.create(Control && Control.prototype);
  ZoomToExtent.prototype.constructor = ZoomToExtent;

  /**
   * @param {MouseEvent} event The event to handle
   * @private
   */
  ZoomToExtent.prototype.handleClick_ = function handleClick_(event) {
    event.preventDefault();
    this.handleZoomToExtent();
  };

  /**
   * @protected
   */
  ZoomToExtent.prototype.handleZoomToExtent = function handleZoomToExtent() {
    var map = this.getMap();
    var view = map.getView();
    var extent = !this.extent ? view.getProjection().getExtent() : this.extent;
    view.fit(extent);
  };

  return ZoomToExtent;
}(_Control2.default);

exports.default = ZoomToExtent;

//# sourceMappingURL=ZoomToExtent.js.map