'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = render;

var _array = require('../array.js');

var _Control = require('./Control.js');

var _Control2 = _interopRequireDefault(_Control);

var _css = require('../css.js');

var _dom = require('../dom.js');

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _Layer = require('../layer/Layer.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} Options
 * @property {string} [className='ol-attribution'] CSS class name.
 * @property {HTMLElement|string} [target] Specify a target if you
 * want the control to be rendered outside of the map's
 * viewport.
 * @property {boolean} [collapsible] Specify if attributions can
 * be collapsed. If not specified, sources control this behavior with their
 * `attributionsCollapsible` setting.
 * @property {boolean} [collapsed=true] Specify if attributions should
 * be collapsed at startup.
 * @property {string} [tipLabel='Attributions'] Text label to use for the button tip.
 * @property {string} [label='i'] Text label to use for the
 * collapsed attributions button.
 * Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {string|HTMLElement} [collapseLabel='»'] Text label to use
 * for the expanded attributions button.
 * Instead of text, also an element (e.g. a `span` element) can be used.
 * @property {function(import("../MapEvent.js").default)} [render] Function called when
 * the control should be re-rendered. This is called in a `requestAnimationFrame`
 * callback.
 */

/**
 * @classdesc
 * Control to show all the attributions associated with the layer sources
 * in the map. This control is one of the default controls included in maps.
 * By default it will show in the bottom right portion of the map, but this can
 * be changed by using a css selector for `.ol-attribution`.
 *
 * @api
 */
var Attribution = /*@__PURE__*/function (Control) {
  function Attribution(opt_options) {

    var options = opt_options ? opt_options : {};

    Control.call(this, {
      element: document.createElement('div'),
      render: options.render || render,
      target: options.target
    });

    /**
     * @private
     * @type {HTMLElement}
     */
    this.ulElement_ = document.createElement('ul');

    /**
     * @private
     * @type {boolean}
     */
    this.collapsed_ = options.collapsed !== undefined ? options.collapsed : true;

    /**
     * @private
     * @type {boolean}
     */
    this.overrideCollapsible_ = options.collapsible !== undefined;

    /**
     * @private
     * @type {boolean}
     */
    this.collapsible_ = options.collapsible !== undefined ? options.collapsible : true;

    if (!this.collapsible_) {
      this.collapsed_ = false;
    }

    var className = options.className !== undefined ? options.className : 'ol-attribution';

    var tipLabel = options.tipLabel !== undefined ? options.tipLabel : 'Attributions';

    var collapseLabel = options.collapseLabel !== undefined ? options.collapseLabel : '\xBB';

    if (typeof collapseLabel === 'string') {
      /**
       * @private
       * @type {HTMLElement}
       */
      this.collapseLabel_ = document.createElement('span');
      this.collapseLabel_.textContent = collapseLabel;
    } else {
      this.collapseLabel_ = collapseLabel;
    }

    var label = options.label !== undefined ? options.label : 'i';

    if (typeof label === 'string') {
      /**
       * @private
       * @type {HTMLElement}
       */
      this.label_ = document.createElement('span');
      this.label_.textContent = label;
    } else {
      this.label_ = label;
    }

    var activeLabel = this.collapsible_ && !this.collapsed_ ? this.collapseLabel_ : this.label_;
    var button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.title = tipLabel;
    button.appendChild(activeLabel);

    (0, _events.listen)(button, _EventType2.default.CLICK, this.handleClick_, this);

    var cssClasses = className + ' ' + _css.CLASS_UNSELECTABLE + ' ' + _css.CLASS_CONTROL + (this.collapsed_ && this.collapsible_ ? ' ' + _css.CLASS_COLLAPSED : '') + (this.collapsible_ ? '' : ' ol-uncollapsible');
    var element = this.element;
    element.className = cssClasses;
    element.appendChild(this.ulElement_);
    element.appendChild(button);

    /**
     * A list of currently rendered resolutions.
     * @type {Array<string>}
     * @private
     */
    this.renderedAttributions_ = [];

    /**
     * @private
     * @type {boolean}
     */
    this.renderedVisible_ = true;
  }

  if (Control) Attribution.__proto__ = Control;
  Attribution.prototype = Object.create(Control && Control.prototype);
  Attribution.prototype.constructor = Attribution;

  /**
   * Collect a list of visible attributions and set the collapsible state.
   * @param {import("../PluggableMap.js").FrameState} frameState Frame state.
   * @return {Array<string>} Attributions.
   * @private
   */
  Attribution.prototype.collectSourceAttributions_ = function collectSourceAttributions_(frameState) {
    /**
     * Used to determine if an attribution already exists.
     * @type {!Object<string, boolean>}
     */
    var lookup = {};

    /**
     * A list of visible attributions.
     * @type {Array<string>}
     */
    var visibleAttributions = [];

    var layerStatesArray = frameState.layerStatesArray;
    var resolution = frameState.viewState.resolution;
    for (var i = 0, ii = layerStatesArray.length; i < ii; ++i) {
      var layerState = layerStatesArray[i];
      if (!(0, _Layer.visibleAtResolution)(layerState, resolution)) {
        continue;
      }

      var source = /** @type {import("../layer/Layer.js").default} */layerState.layer.getSource();
      if (!source) {
        continue;
      }

      var attributionGetter = source.getAttributions();
      if (!attributionGetter) {
        continue;
      }

      var attributions = attributionGetter(frameState);
      if (!attributions) {
        continue;
      }

      if (!this.overrideCollapsible_ && source.getAttributionsCollapsible() === false) {
        this.setCollapsible(false);
      }

      if (Array.isArray(attributions)) {
        for (var j = 0, jj = attributions.length; j < jj; ++j) {
          if (!(attributions[j] in lookup)) {
            visibleAttributions.push(attributions[j]);
            lookup[attributions[j]] = true;
          }
        }
      } else {
        if (!(attributions in lookup)) {
          visibleAttributions.push(attributions);
          lookup[attributions] = true;
        }
      }
    }
    return visibleAttributions;
  };

  /**
   * @private
   * @param {?import("../PluggableMap.js").FrameState} frameState Frame state.
   */
  Attribution.prototype.updateElement_ = function updateElement_(frameState) {
    if (!frameState) {
      if (this.renderedVisible_) {
        this.element.style.display = 'none';
        this.renderedVisible_ = false;
      }
      return;
    }

    var attributions = this.collectSourceAttributions_(frameState);

    var visible = attributions.length > 0;
    if (this.renderedVisible_ != visible) {
      this.element.style.display = visible ? '' : 'none';
      this.renderedVisible_ = visible;
    }

    if ((0, _array.equals)(attributions, this.renderedAttributions_)) {
      return;
    }

    (0, _dom.removeChildren)(this.ulElement_);

    // append the attributions
    for (var i = 0, ii = attributions.length; i < ii; ++i) {
      var element = document.createElement('li');
      element.innerHTML = attributions[i];
      this.ulElement_.appendChild(element);
    }

    this.renderedAttributions_ = attributions;
  };

  /**
   * @param {MouseEvent} event The event to handle
   * @private
   */
  Attribution.prototype.handleClick_ = function handleClick_(event) {
    event.preventDefault();
    this.handleToggle_();
  };

  /**
   * @private
   */
  Attribution.prototype.handleToggle_ = function handleToggle_() {
    this.element.classList.toggle(_css.CLASS_COLLAPSED);
    if (this.collapsed_) {
      (0, _dom.replaceNode)(this.collapseLabel_, this.label_);
    } else {
      (0, _dom.replaceNode)(this.label_, this.collapseLabel_);
    }
    this.collapsed_ = !this.collapsed_;
  };

  /**
   * Return `true` if the attribution is collapsible, `false` otherwise.
   * @return {boolean} True if the widget is collapsible.
   * @api
   */
  Attribution.prototype.getCollapsible = function getCollapsible() {
    return this.collapsible_;
  };

  /**
   * Set whether the attribution should be collapsible.
   * @param {boolean} collapsible True if the widget is collapsible.
   * @api
   */
  Attribution.prototype.setCollapsible = function setCollapsible(collapsible) {
    if (this.collapsible_ === collapsible) {
      return;
    }
    this.collapsible_ = collapsible;
    this.element.classList.toggle('ol-uncollapsible');
    if (!collapsible && this.collapsed_) {
      this.handleToggle_();
    }
  };

  /**
   * Collapse or expand the attribution according to the passed parameter. Will
   * not do anything if the attribution isn't collapsible or if the current
   * collapsed state is already the one requested.
   * @param {boolean} collapsed True if the widget is collapsed.
   * @api
   */
  Attribution.prototype.setCollapsed = function setCollapsed(collapsed) {
    if (!this.collapsible_ || this.collapsed_ === collapsed) {
      return;
    }
    this.handleToggle_();
  };

  /**
   * Return `true` when the attribution is currently collapsed or `false`
   * otherwise.
   * @return {boolean} True if the widget is collapsed.
   * @api
   */
  Attribution.prototype.getCollapsed = function getCollapsed() {
    return this.collapsed_;
  };

  return Attribution;
}(_Control2.default);

/**
 * Update the attribution element.
 * @param {import("../MapEvent.js").default} mapEvent Map event.
 * @this {Attribution}
 * @api
 */
/**
 * @module ol/control/Attribution
 */
function render(mapEvent) {
  this.updateElement_(mapEvent.frameState);
}

exports.default = Attribution;

//# sourceMappingURL=Attribution.js.map